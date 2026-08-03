import type { Prisma } from "@/generated/prisma";

import { runInternalCompanyWork } from "@/lib/company-activation";
import { runControlledInternalOperation } from "@/lib/controlled-internal-operations";
import { createDailyRevenueOperatingLoop } from "@/lib/daily-revenue-operating-loop";
import { createExecutiveDashboardReport } from "@/lib/executive-dashboard";
import { listDbLeads } from "@/lib/leads-db";
import type { StoredLead } from "@/lib/leads-storage";
import { prisma } from "@/lib/prisma";
import { createRevenueCommandCenter, logRevenueAuditEvent, syncLeadRevenueSpine, type RevenueCommandCenterReport, type RevenueInboxItem } from "@/lib/revenue-spine";

const DEFAULT_TENANT_ID = "default";
const LEVEL = 1;
const MODE = "executive_autonomy_level_1_internal";

export const executiveAutonomyLevel1SafetyProof = {
  providerCalled: false,
  sent: false,
  published: false,
  crmMutation: false,
  outreach: false,
  scraping: false,
  externalExecutionAllowed: false,
  liveExecutionAllowed: false,
} as const;

export type ExecutiveAutonomyLevel1SafetyProof = typeof executiveAutonomyLevel1SafetyProof;

export type ExecutiveAutonomyLevel1PhaseStatus = "completed" | "advisory" | "exception";

export type ExecutiveAutonomyLevel1PhaseResult = {
  id:
    | "idempotency_lock"
    | "evidence_refresh"
    | "department_autonomy"
    | "lead_to_decision_pipeline"
    | "morning_brief"
    | "memory_and_audit";
  label: string;
  status: ExecutiveAutonomyLevel1PhaseStatus;
  summary: string;
  recordsCreated: number;
  recordsUpdated: number;
  advisories: string[];
  safety: ExecutiveAutonomyLevel1SafetyProof;
};

export type ExecutiveAutonomyLeadRecommendation = {
  leadId: string;
  propertyAddress: string;
  source: string;
  score: number;
  confidence: number;
  priority: "High" | "Medium" | "Low";
  assignedDepartment: string;
  status: "advisory";
  recommendation: string;
  missingData: string[];
  duplicateWarnings: number;
  approvalItemId: string | null;
  approvalRequired: boolean;
};

export type ExecutiveAutonomyLevel1RunResult = {
  ok: true;
  level: typeof LEVEL;
  mode: typeof MODE;
  state: "completed" | "completed_with_exceptions" | "already_completed" | "already_running";
  tenantId: string;
  businessDate: string;
  idempotencyKey: string;
  startedAt: string;
  completedAt: string | null;
  triggeredBy: "cron" | "manual" | "system";
  phases: ExecutiveAutonomyLevel1PhaseResult[];
  morningBrief: {
    title: "CEO Morning Brief";
    summary: string;
    topCeoDecisions: string[];
    exceptions: string[];
    kpiChanges: string[];
    confidenceLevels: Array<{ label: string; confidence: number; status: "enabled" | "advisory" | "blocked_pending_approval" }>;
  };
  departmentCompletionSummary: {
    departmentsRun: number;
    assignmentsAdvanced: number;
    draftQueueItemsAdvanced: number;
    completedInternalCount: number;
  };
  leadPipeline: {
    leadsReviewed: number;
    leadsScored: number;
    recommendations: ExecutiveAutonomyLeadRecommendation[];
    approvalsCreated: number;
  };
  dataQuality: {
    status: "advisory";
    confidence: number;
    connectorGaps: string[];
    summary: string;
  };
  nextRunAt: string;
  manualControls: Array<"run_daily_startup_now" | "retry_failed_internal_step" | "regenerate_morning_brief">;
  safety: ExecutiveAutonomyLevel1SafetyProof;
};

export type ExecutiveAutonomyLevel1Status = {
  ok: true;
  level: typeof LEVEL;
  mode: typeof MODE;
  tenantId: string;
  businessDate: string;
  idempotencyKey: string;
  lastRun: {
    state: ExecutiveAutonomyLevel1RunResult["state"] | "started" | "not_started";
    startedAt: string | null;
    completedAt: string | null;
    summary: string | null;
    exceptions: string[];
    confidence: number | null;
  };
  nextRunAt: string;
  manualControls: ExecutiveAutonomyLevel1RunResult["manualControls"];
  safety: ExecutiveAutonomyLevel1SafetyProof;
};

type MemoryEventRecord = {
  id: string;
  memoryKey: string;
  eventType: string;
  summary: string;
  recommendation: string;
  metrics: Prisma.JsonValue;
  confidence: number;
  outcome: string;
  createdAt: Date;
};

type ApprovalItemRecord = {
  id: string;
};

type ExecutiveAutonomyDb = {
  aiDepartmentMemoryEvent: {
    findFirst(args: unknown): Promise<MemoryEventRecord | null>;
    create(args: unknown): Promise<MemoryEventRecord>;
    update(args: unknown): Promise<MemoryEventRecord>;
  };
  unifiedApprovalItem: {
    findFirst(args: unknown): Promise<ApprovalItemRecord | null>;
    create(args: unknown): Promise<ApprovalItemRecord>;
  };
};

type ExecutiveAutonomyDeps = {
  db: ExecutiveAutonomyDb;
  loadLeads: typeof listDbLeads;
  syncLead: typeof syncLeadRevenueSpine;
  createRevenueCommandCenter: typeof createRevenueCommandCenter;
  createDailyRevenueOperatingLoop: typeof createDailyRevenueOperatingLoop;
  runControlledInternalOperation: typeof runControlledInternalOperation;
  runInternalCompanyWork: typeof runInternalCompanyWork;
  loadDashboard: typeof createExecutiveDashboardReport;
  logAudit: typeof logRevenueAuditEvent;
  now: () => Date;
};

let deps: ExecutiveAutonomyDeps = {
  db: prisma as ExecutiveAutonomyDb,
  loadLeads: listDbLeads,
  syncLead: syncLeadRevenueSpine,
  createRevenueCommandCenter,
  createDailyRevenueOperatingLoop,
  runControlledInternalOperation,
  runInternalCompanyWork,
  loadDashboard: createExecutiveDashboardReport,
  logAudit: logRevenueAuditEvent,
  now: () => new Date(),
};

export function setExecutiveAutonomyLevel1DepsForTest(testDeps: Partial<ExecutiveAutonomyDeps>) {
  const previous = deps;
  deps = { ...deps, ...testDeps };

  return () => {
    deps = previous;
  };
}

function toBusinessDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getNextRunAt(now: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [year, month, day] = formatter.format(now).split("-").map(Number);
  const nextCentralEight = new Date(Date.UTC(year, month - 1, day, 13, 0, 0));

  if (now.getTime() >= nextCentralEight.getTime()) {
    nextCentralEight.setUTCDate(nextCentralEight.getUTCDate() + 1);
  }

  return nextCentralEight.toISOString();
}

export function createExecutiveAutonomyLevel1IdempotencyKey(tenantId = DEFAULT_TENANT_ID, businessDate = toBusinessDate(new Date())) {
  return `executive-autonomy-l1:${tenantId}:${businessDate}`;
}

function phase(input: Omit<ExecutiveAutonomyLevel1PhaseResult, "safety">): ExecutiveAutonomyLevel1PhaseResult {
  return {
    ...input,
    safety: executiveAutonomyLevel1SafetyProof,
  };
}

function isCompletedOutcome(outcome: string) {
  return outcome === "executive_autonomy_l1_completed" || outcome === "executive_autonomy_l1_completed_with_exceptions";
}

function metricsObject(record: MemoryEventRecord | null): Record<string, unknown> {
  return record?.metrics && typeof record.metrics === "object" && !Array.isArray(record.metrics) ? (record.metrics as Record<string, unknown>) : {};
}

function resultFromMemory(record: MemoryEventRecord, tenantId: string, businessDate: string, idempotencyKey: string, now: Date): ExecutiveAutonomyLevel1RunResult {
  const metrics = metricsObject(record);
  const cachedResult = metrics.result;
  if (cachedResult && typeof cachedResult === "object") {
    return {
      ...(cachedResult as ExecutiveAutonomyLevel1RunResult),
      state: "already_completed",
    };
  }

  return {
    ok: true,
    level: LEVEL,
    mode: MODE,
    state: "already_completed",
    tenantId,
    businessDate,
    idempotencyKey,
    startedAt: record.createdAt.toISOString(),
    completedAt: record.createdAt.toISOString(),
    triggeredBy: "system",
    phases: [
      phase({
        id: "idempotency_lock",
        label: "Daily Idempotency",
        status: "completed",
        summary: "Existing completed Executive Autonomy Level 1 run returned.",
        recordsCreated: 0,
        recordsUpdated: 0,
        advisories: [],
      }),
    ],
    morningBrief: {
      title: "CEO Morning Brief",
      summary: record.summary,
      topCeoDecisions: [],
      exceptions: [],
      kpiChanges: [],
      confidenceLevels: [{ label: "Daily run cache", confidence: record.confidence, status: "enabled" }],
    },
    departmentCompletionSummary: {
      departmentsRun: 0,
      assignmentsAdvanced: 0,
      draftQueueItemsAdvanced: 0,
      completedInternalCount: 0,
    },
    leadPipeline: {
      leadsReviewed: 0,
      leadsScored: 0,
      recommendations: [],
      approvalsCreated: 0,
    },
    dataQuality: {
      status: "advisory",
      confidence: record.confidence,
      connectorGaps: [],
      summary: "Existing daily result loaded from executive memory.",
    },
    nextRunAt: getNextRunAt(now),
    manualControls: ["run_daily_startup_now", "retry_failed_internal_step", "regenerate_morning_brief"],
    safety: executiveAutonomyLevel1SafetyProof,
  };
}

function resultFromActiveRun(record: MemoryEventRecord, tenantId: string, businessDate: string, idempotencyKey: string, now: Date): ExecutiveAutonomyLevel1RunResult {
  return {
    ...resultFromMemory(record, tenantId, businessDate, idempotencyKey, now),
    state: "already_running",
    completedAt: null,
    phases: [
      phase({
        id: "idempotency_lock",
        label: "Daily Idempotency",
        status: "advisory",
        summary: "Another Executive Autonomy Level 1 startup owns today's run.",
        recordsCreated: 0,
        recordsUpdated: 0,
        advisories: ["The duplicate request exited without advancing internal work."],
      }),
    ],
    morningBrief: {
      title: "CEO Morning Brief",
      summary: "Executive Autonomy Level 1 startup is already running.",
      topCeoDecisions: [],
      exceptions: [],
      kpiChanges: [],
      confidenceLevels: [{ label: "Daily run lock", confidence: 100, status: "enabled" }],
    },
  };
}

function calculateDataQuality(dashboard: Awaited<ReturnType<typeof createExecutiveDashboardReport>>) {
  const connectorActivation = dashboard.connectorActivation;
  const connectorGaps = [
    ...(connectorActivation?.dataGaps ?? []),
    ...(dashboard.dataGaps ?? []),
  ].slice(0, 12);
  const credentialGapCount = connectorActivation?.totals.credentialsMissing ?? 0;
  const dataGapCount = connectorActivation?.totals.dataGaps ?? connectorGaps.length;
  const confidence = Math.max(35, Math.min(100, 100 - credentialGapCount * 8 - dataGapCount * 6 - connectorGaps.length * 2));

  return {
    status: "advisory" as const,
    confidence,
    connectorGaps,
    summary:
      connectorGaps.length > 0
        ? `${connectorGaps.length} connector/data advisory item(s) lower confidence but do not stop internal operations.`
        : "Read-only evidence is sufficient for Level 1 internal operations.",
  };
}

function assignOwnerDepartment(item: RevenueInboxItem) {
  if (item.duplicateWarnings.length > 0) return "Revenue Operations";
  if ((item.latestScore?.missingData ?? []).some((gap) => /address|parcel|county|owner/i.test(gap))) return "Lead Intelligence";
  if ((item.latestScore?.score ?? 0) >= 75 || item.latestScore?.priority === "High") return "Revenue";
  if (/seo|search|organic|website/i.test(item.lead.source)) return "Marketing";

  return "Operations";
}

async function ensureApprovalItem(item: RevenueInboxItem, tenantId: string, idempotencyKey: string, businessDate: string) {
  const score = item.latestScore?.score ?? item.lead.score ?? 0;
  const highImpact = score >= 75 || item.latestScore?.priority === "High";
  const risky = item.duplicateWarnings.length > 0 || Boolean(item.lead.doNotContact);

  if (!highImpact && !risky) {
    return null;
  }

  const sourceId = `${idempotencyKey}:${item.lead.id}`;
  const existing = await deps.db.unifiedApprovalItem.findFirst({
    where: {
      tenantId,
      sourceType: "executive_autonomy_l1",
      sourceId,
      status: "pending_review",
    },
  });

  if (existing) return existing.id;

  const created = await deps.db.unifiedApprovalItem.create({
    data: {
      tenantId,
      itemType: "lead_recommendation",
      sourceType: "executive_autonomy_l1",
      sourceId,
      title: `CEO review: ${item.lead.propertyAddress || "Lead recommendation"}`,
      sourceLabel: `executive_autonomy_l1:${businessDate}`,
      status: "pending_review",
      riskLevel: risky ? "high" : "medium",
      requiredApprovals: ["ceo_review"] as Prisma.InputJsonArray,
      connectorId: null,
      executionBlockedReason: "Level 1 creates advisory recommendations only. External execution remains approval-gated and disabled.",
      payload: {
        leadId: item.lead.id,
        score,
        confidence: item.latestScore?.confidence ?? 0,
        priority: item.latestScore?.priority ?? item.lead.priority,
        recommendation: item.recommendedAction,
        missingData: item.latestScore?.missingData ?? [],
        duplicateWarnings: item.duplicateWarnings.length,
        providerCalled: false,
        sent: false,
        published: false,
        crmMutation: false,
        outreach: false,
        scraping: false,
        externalExecutionAllowed: false,
        liveExecutionAllowed: false,
      } satisfies Prisma.InputJsonObject,
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
  });

  return created.id;
}

async function processLeadPipeline(leads: StoredLead[], commandCenter: RevenueCommandCenterReport, tenantId: string, idempotencyKey: string, businessDate: string) {
  let approvalsCreated = 0;
  const recommendations: ExecutiveAutonomyLeadRecommendation[] = [];
  const leadIdsToScore = new Set(commandCenter.inbox.slice(0, 25).map((item) => item.lead.id));
  for (const lead of leads.filter((lead) => leadIdsToScore.has(lead.id))) {
    await deps.syncLead({
      lead,
      action: "score_refreshed",
      source: "executive_autonomy_l1",
    });
  }

  const refreshedCommandCenter = await deps.createRevenueCommandCenter(leads);
  for (const item of refreshedCommandCenter.inbox.slice(0, 10)) {
    const approvalItemId = await ensureApprovalItem(item, tenantId, idempotencyKey, businessDate);
    if (approvalItemId) approvalsCreated += 1;
    recommendations.push({
      leadId: item.lead.id,
      propertyAddress: item.lead.propertyAddress || "Unknown property",
      source: item.lead.source || "unknown",
      score: item.latestScore?.score ?? item.lead.score ?? 0,
      confidence: item.latestScore?.confidence ?? 0,
      priority: item.latestScore?.priority ?? item.lead.priority,
      assignedDepartment: assignOwnerDepartment(item),
      status: "advisory",
      recommendation: item.recommendedAction,
      missingData: item.latestScore?.missingData ?? [],
      duplicateWarnings: item.duplicateWarnings.length,
      approvalItemId,
      approvalRequired: Boolean(approvalItemId),
    });
  }

  return {
    refreshedCommandCenter,
    approvalsCreated,
    recommendations,
    leadsScored: leadIdsToScore.size,
  };
}

function buildMorningBrief(input: {
  dashboard: Awaited<ReturnType<typeof createExecutiveDashboardReport>>;
  dataQuality: ExecutiveAutonomyLevel1RunResult["dataQuality"];
  recommendations: ExecutiveAutonomyLeadRecommendation[];
  departmentSummary: ExecutiveAutonomyLevel1RunResult["departmentCompletionSummary"];
}) {
  const approvals = input.recommendations.filter((item) => item.approvalRequired);
  const exceptions = [
    ...approvals.slice(0, 5).map((item) => `${item.propertyAddress}: CEO approval required before high-impact/risky follow-up.`),
    ...(input.dataQuality.connectorGaps.length > 0 ? [`Data quality confidence is ${input.dataQuality.confidence}%; connector gaps are advisory.`] : []),
  ];
  const kpiChanges = [
    `Leads reviewed: ${input.recommendations.length}`,
    `High-impact approvals: ${approvals.length}`,
    `Internal assignments advanced: ${input.departmentSummary.assignmentsAdvanced}`,
    `Draft queue advanced: ${input.departmentSummary.draftQueueItemsAdvanced}`,
    `Data confidence: ${input.dataQuality.confidence}%`,
  ];

  return {
    title: "CEO Morning Brief" as const,
    summary:
      input.dashboard.morningBrief?.summary ??
      "Executive Autonomy Level 1 completed the internal daily startup and prepared CEO-only exceptions.",
    topCeoDecisions: approvals.slice(0, 5).map((item) => `${item.propertyAddress}: ${item.recommendation}`),
    exceptions,
    kpiChanges,
    confidenceLevels: [
      { label: "Internal Operations", confidence: 100, status: "enabled" as const },
      { label: "Data Quality", confidence: input.dataQuality.confidence, status: "advisory" as const },
      { label: "External Execution", confidence: 0, status: "blocked_pending_approval" as const },
    ],
  };
}

async function recordFinalMemory(result: ExecutiveAutonomyLevel1RunResult, memoryRecordId: string) {
  await deps.db.aiDepartmentMemoryEvent.update({
    where: { id: memoryRecordId },
    data: {
      eventType: "executive_autonomy_l1_daily_startup_completed",
      summary: result.morningBrief.summary,
      lesson: "Executive Autonomy Level 1 can run internal departments and recommendations without external execution.",
      recommendation: result.morningBrief.topCeoDecisions[0] ?? "Review exceptions, approval queue, KPI changes, and confidence levels.",
      metrics: {
        result,
        safety: executiveAutonomyLevel1SafetyProof,
      } satisfies Prisma.InputJsonObject,
      evidenceLabels: ["DailyBriefingSnapshot", "AiDepartmentMemoryEvent", "RevenueDecisionLog", "UnifiedApprovalItem"] as Prisma.InputJsonArray,
      confidence: result.dataQuality.confidence,
      outcome: result.state === "completed" ? "executive_autonomy_l1_completed" : "executive_autonomy_l1_completed_with_exceptions",
      assumptions: ["Level 1 remains internal-only.", "Connector gaps are advisory unless an external action is requested."] as Prisma.InputJsonArray,
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
  });
}

export async function runExecutiveDailyStartup({
  tenantId = DEFAULT_TENANT_ID,
  triggeredBy = "system",
  date = deps.now(),
}: {
  tenantId?: string;
  triggeredBy?: "cron" | "manual" | "system";
  date?: Date;
} = {}): Promise<ExecutiveAutonomyLevel1RunResult> {
  const businessDate = toBusinessDate(date);
  const idempotencyKey = createExecutiveAutonomyLevel1IdempotencyKey(tenantId, businessDate);
  const existing = await deps.db.aiDepartmentMemoryEvent.findFirst({
    where: {
      tenantId,
      memoryKey: idempotencyKey,
    },
  });

  if (existing && isCompletedOutcome(existing.outcome)) {
    return resultFromMemory(existing, tenantId, businessDate, idempotencyKey, date);
  }

  if (existing) {
    return resultFromActiveRun(existing, tenantId, businessDate, idempotencyKey, date);
  }

  const startedAt = deps.now().toISOString();
  let memoryRecord: MemoryEventRecord | null = existing;
  if (!memoryRecord) {
    try {
      memoryRecord = await deps.db.aiDepartmentMemoryEvent.create({
        data: {
          tenantId,
          memoryKey: idempotencyKey,
          department: "Executive Office",
          eventType: "executive_autonomy_l1_daily_startup_started",
          summary: "Executive Autonomy Level 1 daily startup started.",
          lesson: "Daily operating loop records internal-only work and safety proof.",
          recommendation: "Complete internal startup, generate Morning Brief, and surface only exceptions to the CEO.",
          metrics: { status: "started", safety: executiveAutonomyLevel1SafetyProof } satisfies Prisma.InputJsonObject,
          evidenceLabels: ["executive_autonomy_l1"] as Prisma.InputJsonArray,
          confidence: 100,
          outcome: "executive_autonomy_l1_started",
          assumptions: ["8:00 AM Central scheduled startup target."] as Prisma.InputJsonArray,
          providerCalled: false,
          sent: false,
          published: false,
          liveExecutionAllowed: false,
        },
      });
    } catch (error) {
      const concurrentRecord = await deps.db.aiDepartmentMemoryEvent.findFirst({
        where: {
          tenantId,
          memoryKey: idempotencyKey,
        },
      });

      if (concurrentRecord && isCompletedOutcome(concurrentRecord.outcome)) {
        return resultFromMemory(concurrentRecord, tenantId, businessDate, idempotencyKey, date);
      }

      if (!concurrentRecord) {
        throw error;
      }

      return resultFromActiveRun(concurrentRecord, tenantId, businessDate, idempotencyKey, date);
    }
  }
  const phases: ExecutiveAutonomyLevel1PhaseResult[] = [
    phase({
      id: "idempotency_lock",
      label: "Daily Idempotency",
      status: "completed",
      summary: "Daily Level 1 lock acquired or resumed for the current business date.",
      recordsCreated: existing ? 0 : 1,
      recordsUpdated: existing ? 1 : 0,
      advisories: [],
    }),
  ];

  if (!memoryRecord) {
    throw new Error("Executive Autonomy Level 1 could not acquire the daily startup lock.");
  }

  const refresh = await deps.runControlledInternalOperation("refresh_internal_intelligence", tenantId);
  phases.push(
    phase({
      id: "evidence_refresh",
      label: "Refresh Evidence Snapshots",
      status: refresh.stateTransition === "degraded_but_usable" ? "advisory" : "completed",
      summary: "Read-only internal intelligence refresh completed where existing adapters and records permit it.",
      recordsCreated: refresh.recordsCreated,
      recordsUpdated: refresh.recordsUpdated,
      advisories: refresh.stateTransition === "degraded_but_usable" ? ["Connector evidence is incomplete; confidence will reflect the gap."] : [],
    }),
  );

  const internalWork = await deps.runInternalCompanyWork();
  const departmentSummary = {
    departmentsRun: internalWork.completedInternalCount,
    assignmentsAdvanced: internalWork.assignmentsAdvanced,
    draftQueueItemsAdvanced: internalWork.draftQueueItemsAdvanced,
    completedInternalCount: internalWork.completedInternalCount,
  };
  phases.push(
    phase({
      id: "department_autonomy",
      label: "Department Autonomy",
      status: "completed",
      summary: "Departments with internal readiness completed preparation work without requiring CEO approval.",
      recordsCreated: 0,
      recordsUpdated: internalWork.assignmentsAdvanced + internalWork.draftQueueItemsAdvanced,
      advisories: [],
    }),
  );

  const leads = await deps.loadLeads();
  await deps.createDailyRevenueOperatingLoop();
  const commandCenter = await deps.createRevenueCommandCenter(leads);
  const leadPipeline = await processLeadPipeline(leads, commandCenter, tenantId, idempotencyKey, businessDate);
  phases.push(
    phase({
      id: "lead_to_decision_pipeline",
      label: "Lead-To-Decision Pipeline",
      status: leadPipeline.approvalsCreated > 0 ? "advisory" : "completed",
      summary: `${leadPipeline.leadsScored} lead(s) scored and ${leadPipeline.recommendations.length} advisory recommendation(s) prepared.`,
      recordsCreated: leadPipeline.leadsScored + leadPipeline.approvalsCreated,
      recordsUpdated: 0,
      advisories: leadPipeline.approvalsCreated > 0 ? [`${leadPipeline.approvalsCreated} high-impact/risky recommendation(s) wait for CEO approval.`] : [],
    }),
  );

  const briefOperation = await deps.runControlledInternalOperation("generate_morning_brief", tenantId);
  const dashboard = await deps.loadDashboard();
  const dataQuality = calculateDataQuality(dashboard);
  const morningBrief = buildMorningBrief({
    dashboard,
    dataQuality,
    recommendations: leadPipeline.recommendations,
    departmentSummary,
  });
  phases.push(
    phase({
      id: "morning_brief",
      label: "CEO Morning Brief",
      status: dataQuality.connectorGaps.length > 0 ? "advisory" : "completed",
      summary: "Morning Brief generated with decisions, exceptions, KPI changes, and confidence levels.",
      recordsCreated: briefOperation.recordsCreated,
      recordsUpdated: briefOperation.recordsUpdated,
      advisories: dataQuality.connectorGaps.slice(0, 5),
    }),
  );

  const state = morningBrief.exceptions.length > 0 || dataQuality.connectorGaps.length > 0 ? "completed_with_exceptions" : "completed";
  const result: ExecutiveAutonomyLevel1RunResult = {
    ok: true,
    level: LEVEL,
    mode: MODE,
    state,
    tenantId,
    businessDate,
    idempotencyKey,
    startedAt,
    completedAt: deps.now().toISOString(),
    triggeredBy,
    phases,
    morningBrief,
    departmentCompletionSummary: departmentSummary,
    leadPipeline: {
      leadsReviewed: leads.length,
      leadsScored: leadPipeline.leadsScored,
      recommendations: leadPipeline.recommendations,
      approvalsCreated: leadPipeline.approvalsCreated,
    },
    dataQuality,
    nextRunAt: getNextRunAt(date),
    manualControls: ["run_daily_startup_now", "retry_failed_internal_step", "regenerate_morning_brief"],
    safety: executiveAutonomyLevel1SafetyProof,
  };

  phases.push(
    phase({
      id: "memory_and_audit",
      label: "Memory And Audit",
      status: "completed",
      summary: "Executive memory and audit proof recorded for the internal-only run.",
      recordsCreated: 1,
      recordsUpdated: 1,
      advisories: [],
    }),
  );
  const finalResult = {
    ...result,
    phases,
  };

  await recordFinalMemory(finalResult, memoryRecord.id);
  await deps.logAudit({
    tenantId,
    action: "executive_autonomy_l1_daily_startup",
    targetType: "ai_company",
    targetId: idempotencyKey,
    source: "executive_autonomy_l1",
    result: state,
    metadata: {
      businessDate,
      phases: phases.map((item) => ({ id: item.id, status: item.status })),
      safety: executiveAutonomyLevel1SafetyProof,
    },
  });

  return finalResult;
}

export async function getExecutiveAutonomyLevel1Status({
  tenantId = DEFAULT_TENANT_ID,
  date = deps.now(),
}: {
  tenantId?: string;
  date?: Date;
} = {}): Promise<ExecutiveAutonomyLevel1Status> {
  const businessDate = toBusinessDate(date);
  const idempotencyKey = createExecutiveAutonomyLevel1IdempotencyKey(tenantId, businessDate);
  const record = await deps.db.aiDepartmentMemoryEvent.findFirst({
    where: {
      tenantId,
      memoryKey: idempotencyKey,
    },
  });
  const metrics = metricsObject(record);
  const result = metrics.result && typeof metrics.result === "object" ? (metrics.result as ExecutiveAutonomyLevel1RunResult) : null;

  return {
    ok: true,
    level: LEVEL,
    mode: MODE,
    tenantId,
    businessDate,
    idempotencyKey,
    lastRun: {
      state: result?.state ?? (record ? "started" : "not_started"),
      startedAt: result?.startedAt ?? record?.createdAt.toISOString() ?? null,
      completedAt: result?.completedAt ?? (record && isCompletedOutcome(record.outcome) ? record.createdAt.toISOString() : null),
      summary: result?.morningBrief.summary ?? record?.summary ?? null,
      exceptions: result?.morningBrief.exceptions ?? [],
      confidence: result?.dataQuality.confidence ?? record?.confidence ?? null,
    },
    nextRunAt: getNextRunAt(date),
    manualControls: ["run_daily_startup_now", "retry_failed_internal_step", "regenerate_morning_brief"],
    safety: executiveAutonomyLevel1SafetyProof,
  };
}
