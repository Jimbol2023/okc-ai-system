import type { Prisma } from "@/generated/prisma";

import {
  autonomySafetyFlags,
  evaluateAutonomyPolicy,
  leadQualificationActionKey,
  leadQualificationLane,
  leadQualificationPolicyKey,
  leadQualificationTaskType,
} from "@/lib/autonomy-policy";
import { prisma } from "@/lib/prisma";
import { requireTenantId } from "@/lib/tenant-context";
import type { StoredLead } from "@/lib/leads-storage";

export const autonomousLeadQualificationVersion = "lead-intake-qualification-autonomy/2.0.0-canonical";

type Db = typeof prisma;
let autonomyDb: Db = prisma;

export function setAutonomousLeadQualificationDbForTest(db: Db) {
  const previous = autonomyDb;
  autonomyDb = db;
  return () => { autonomyDb = previous; };
}

function json(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function startOfUtcDay(now: Date) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function createLeadQualificationEvidence(lead: StoredLead): string[] {
  const evidence = ["stored_lead"];
  if (lead.source?.trim()) evidence.push("source_attribution");
  if (typeof lead.score === "number") evidence.push("revenue_score");
  if (!lead.doNotContact && !lead.optOutReason) evidence.push("no_dnc_or_opt_out");
  return evidence;
}

export function createLeadQualificationIdempotencyKey(tenantId: string, leadId: string) {
  return [requireTenantId(tenantId, "level2_idempotency"), autonomousLeadQualificationVersion, leadQualificationActionKey, leadQualificationTaskType, leadId].join(":");
}

export type LeadQualificationResult = {
  ok: boolean;
  tenantId: string;
  lane: typeof leadQualificationLane;
  decision: "allowed" | "denied" | "approval_required";
  reason: string;
  taskId: string | null;
  runId: string | null;
  outcomeEventId: string | null;
  safety: typeof autonomySafetyFlags;
};

export async function runAutonomousLeadQualification(input: {
  tenantId: string;
  lead: StoredLead;
  triggeredBy: string;
  now?: Date;
}): Promise<LeadQualificationResult> {
  const tenantId = requireTenantId(input.tenantId, "level2_lead_qualification");
  const now = input.now ?? new Date();
  const evidence = createLeadQualificationEvidence(input.lead);
  const idempotencyKey = createLeadQualificationIdempotencyKey(tenantId, input.lead.id);
  const existingTask = await autonomyDb.revenueTask.findUnique({
    where: { tenantId_idempotencyKey: { tenantId, idempotencyKey } },
  });
  if (existingTask) {
    const [existingRun, existingOutcome] = await Promise.all([
      autonomyDb.autonomousRunRecord.findUnique({ where: { tenantId_runKey: { tenantId, runKey: idempotencyKey } } }),
      autonomyDb.businessOutcomeEvent.findUnique({ where: { tenantId_outcomeKey: { tenantId, outcomeKey: idempotencyKey } } }),
    ]);
    return { ok: true, tenantId, lane: leadQualificationLane, decision: "allowed", reason: "idempotent_replay", taskId: existingTask.id, runId: existingRun?.id ?? null, outcomeEventId: existingOutcome?.id ?? null, safety: autonomySafetyFlags };
  }
  const policy = await autonomyDb.autonomyPolicy.findUnique({
    where: { tenantId_policyKey: { tenantId, policyKey: leadQualificationPolicyKey } },
  });
  const usedToday = await autonomyDb.revenueTask.count({
    where: { tenantId, taskType: leadQualificationTaskType, createdAt: { gte: startOfUtcDay(now) } },
  });
  const decision = evaluateAutonomyPolicy({
    policy,
    tenantId,
    requestedAction: leadQualificationActionKey,
    requestedTaskType: leadQualificationTaskType,
    requestedLevel: 2,
    evidence,
    usedToday,
  });

  if (!decision.allowed) {
    return { ok: false, tenantId, lane: leadQualificationLane, decision: decision.decision, reason: decision.reason, taskId: null, runId: null, outcomeEventId: null, safety: autonomySafetyFlags };
  }

  const businessDate = now.toISOString().slice(0, 10);
  return autonomyDb.$transaction(async (tx) => {
    const concurrentTask = await tx.revenueTask.findUnique({
      where: { tenantId_idempotencyKey: { tenantId, idempotencyKey } },
    });
    if (concurrentTask) {
      const [concurrentRun, concurrentOutcome] = await Promise.all([
        tx.autonomousRunRecord.findUnique({ where: { tenantId_runKey: { tenantId, runKey: idempotencyKey } } }),
        tx.businessOutcomeEvent.findUnique({ where: { tenantId_outcomeKey: { tenantId, outcomeKey: idempotencyKey } } }),
      ]);
      return { ok: true, tenantId, lane: leadQualificationLane, decision: "allowed", reason: "idempotent_replay", taskId: concurrentTask.id, runId: concurrentRun?.id ?? null, outcomeEventId: concurrentOutcome?.id ?? null, safety: autonomySafetyFlags };
    }
    const currentPolicy = await tx.autonomyPolicy.findUnique({
      where: { tenantId_policyKey: { tenantId, policyKey: leadQualificationPolicyKey } },
    });
    const currentUsage = await tx.revenueTask.count({
      where: { tenantId, taskType: leadQualificationTaskType, createdAt: { gte: startOfUtcDay(now) } },
    });
    const currentDecision = evaluateAutonomyPolicy({
      policy: currentPolicy,
      tenantId,
      requestedAction: leadQualificationActionKey,
      requestedTaskType: leadQualificationTaskType,
      requestedLevel: 2,
      evidence,
      usedToday: currentUsage,
    });
    if (!currentDecision.allowed) {
      return { ok: false, tenantId, lane: leadQualificationLane, decision: currentDecision.decision, reason: currentDecision.reason, taskId: null, runId: null, outcomeEventId: null, safety: autonomySafetyFlags };
    }

    const run = await tx.autonomousRunRecord.upsert({
      where: { tenantId_runKey: { tenantId, runKey: idempotencyKey } },
      create: { tenantId, runKey: idempotencyKey, businessDate, pipelineVersion: autonomousLeadQualificationVersion, lane: leadQualificationLane, triggeredBy: input.triggeredBy, state: "started", phaseSummary: json(["policy_authorized"]), safetyFlags: json(autonomySafetyFlags) },
      update: {},
    });
    const task = await tx.revenueTask.upsert({
      where: { tenantId_idempotencyKey: { tenantId, idempotencyKey } },
      create: {
        tenantId,
        leadId: input.lead.id,
        title: "Review autonomously qualified lead",
        taskType: leadQualificationTaskType,
        priority: input.lead.priority ?? "Medium",
        status: "open",
        recommendedAction: "Review stored lead evidence and decide the next approved internal step.",
        reason: "Tenant policy authorized one bounded internal CRM review task.",
        assignedTo: "Revenue Operations",
        requiresApproval: false,
        source: leadQualificationLane,
        idempotencyKey,
        materializationVersion: autonomousLeadQualificationVersion,
        sourceProvenance: json({ leadId: input.lead.id, source: input.lead.source, evidence }),
        contactPosture: json({ doNotContact: Boolean(input.lead.doNotContact), optOutReason: input.lead.optOutReason ?? null }),
        providerCalled: false,
        outreach: false,
        sent: false,
        published: false,
        crmMutation: true,
        externalExecutionAllowed: false,
        liveExecutionAllowed: false,
      },
      update: {},
    });
    const outcome = await tx.businessOutcomeEvent.upsert({
      where: { tenantId_outcomeKey: { tenantId, outcomeKey: idempotencyKey } },
      create: { tenantId, outcomeKey: idempotencyKey, sourceType: leadQualificationLane, sourceId: input.lead.id, leadId: input.lead.id, taskId: task.id, runId: run.id, actionKey: leadQualificationActionKey, expectedOutcome: "Human review of qualified stored lead evidence.", actualOutcome: "internal_task_created", kpiAffected: json(["speed_to_lead_review"]), confidence: Math.max(0, Math.min(100, input.lead.score ?? 70)), nextRecommendation: "Human reviews the task; no seller contact is authorized.", safeMetadata: json({ evidence, taskType: leadQualificationTaskType }) },
      update: {},
    });
    const audit = await tx.revenueAuditEvent.create({
      data: { tenantId, actorId: "autonomous-lead-qualification", action: leadQualificationActionKey, targetType: "revenue_task", targetId: task.id, source: leadQualificationLane, result: "policy_authorized", safeMetadata: json({ runId: run.id, outcomeEventId: outcome.id, idempotencyKey, safety: autonomySafetyFlags }) },
    });
    await tx.aiDepartmentMemoryEvent.upsert({
      where: { memoryKey: idempotencyKey },
      create: { tenantId, memoryKey: idempotencyKey, department: "Revenue Operations", eventType: leadQualificationLane, summary: "Policy-authorized internal CRM review task created.", lesson: currentDecision.reason, recommendation: "Human review only; no outreach.", metrics: json({ taskId: task.id, runId: run.id, outcomeEventId: outcome.id }), evidenceLabels: json(evidence), confidence: Math.max(0, Math.min(100, input.lead.score ?? 70)), outcome: "internal_task_created", assumptions: json([]) },
      update: {},
    });
    await tx.connectorExecutionAttempt.upsert({
      where: { tenantId_traceId: { tenantId, traceId: idempotencyKey } },
      create: { tenantId, traceId: idempotencyKey, connectorId: "internal_crm", capabilityKey: "crm.task.internal_create", actionKey: leadQualificationActionKey, actorId: "autonomous-lead-qualification", requestingModule: "Revenue Operations", policyDecision: "allowed", reason: currentDecision.reason, normalizedResult: json({ leadId: input.lead.id, taskId: task.id }), auditEventId: audit.id, outcomeEventId: outcome.id },
      update: {},
    });
    await tx.autonomousRunRecord.update({
      where: { id: run.id },
      data: { state: "completed", phaseSummary: json(["policy_authorized", "crm_task_created", "outcome_recorded", "audit_recorded"]), workCreated: 1, workExecuted: 1, healthCertified: true, completedAt: now },
    });
    return { ok: true, tenantId, lane: leadQualificationLane, decision: "allowed", reason: currentDecision.reason, taskId: task.id, runId: run.id, outcomeEventId: outcome.id, safety: autonomySafetyFlags };
  }, { isolationLevel: "Serializable" });
}

export async function getAutonomyStatus(tenantIdValue: string, db: Pick<Db, "autonomyPolicy" | "departmentSLA" | "autonomousRunRecord" | "businessOutcomeEvent"> = autonomyDb) {
  const tenantId = requireTenantId(tenantIdValue, "level2_autonomy_status");
  const [policies, slas, latestRun, outcomes] = await Promise.all([
    db.autonomyPolicy.findMany({ where: { tenantId }, orderBy: { policyKey: "asc" } }),
    db.departmentSLA.findMany({ where: { tenantId }, orderBy: { department: "asc" } }),
    db.autonomousRunRecord.findFirst({ where: { tenantId, lane: leadQualificationLane }, orderBy: { createdAt: "desc" } }),
    db.businessOutcomeEvent.findMany({ where: { tenantId, actualOutcome: { in: ["pending", "exception_pending"] } }, orderBy: { createdAt: "desc" }, take: 25 }),
  ]);
  const configured = policies.some((policy) => policy.policyKey === leadQualificationPolicyKey) && slas.some((sla) => sla.lane === leadQualificationLane);
  const healthy = configured && Boolean(latestRun?.healthCertified) && outcomes.length === 0;
  const supervisor = {
    name: "Autonomous Operations Supervisor AI",
    operatingLevel: "LEVEL_2_POLICY_AUTHORIZED_INTERNAL_WRITES",
    compatible: configured,
    eligibleForSupervisedWindows: healthy,
    blockers: configured ? (healthy ? [] : ["healthy_level2_run_evidence_required"]) : ["level2_foundations_not_configured"],
    level3AndAboveAllowed: false,
  };
  return { ok: true, tenantId, readiness: configured ? "configured" : "not_configured", ceoState: healthy ? "NO_ACTION_REQUIRED" : "MATERIAL_EXCEPTION_REQUIRED", exceptionCount: outcomes.length + (configured ? 0 : 1), policies, departmentSlas: slas, latestRun, outcomes, supervisor, safety: autonomySafetyFlags };
}
