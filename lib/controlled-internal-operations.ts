import type { Prisma } from "@/generated/prisma";

import { createExecutiveDashboardReport } from "@/lib/executive-dashboard";
import { prisma } from "@/lib/prisma";
import { logRevenueAuditEvent } from "@/lib/revenue-spine";
import { refreshDepartmentIntelligenceSnapshots } from "@/lib/department-intelligence";


type ControlledInternalOperationsDb = {
  dailyBriefingSnapshot: {
    create(args: unknown): Promise<{ id: string }>;
  };
  aiDepartmentMemoryEvent: {
    upsert(args: unknown): Promise<{ id: string }>;
  };
};

type ControlledInternalOperationsDeps = {
  db: ControlledInternalOperationsDb;
  loadDashboard: typeof createExecutiveDashboardReport;
  refreshIntelligence: typeof refreshDepartmentIntelligenceSnapshots;
  logAudit: typeof logRevenueAuditEvent;
};

let deps: ControlledInternalOperationsDeps = {
  db: prisma as ControlledInternalOperationsDb,
  loadDashboard: createExecutiveDashboardReport,
  refreshIntelligence: refreshDepartmentIntelligenceSnapshots,
  logAudit: logRevenueAuditEvent,
};

export function setControlledInternalOperationsDepsForTest(testDeps: Partial<ControlledInternalOperationsDeps>) {
  const previous = deps;
  deps = { ...deps, ...testDeps };

  return () => {
    deps = previous;
  };
}

export const controlledInternalOperationActions = [
  "start_company",
  "generate_morning_brief",
  "refresh_internal_intelligence",
  "record_executive_memory",
] as const;

export type ControlledInternalOperationAction = (typeof controlledInternalOperationActions)[number];

export type ControlledInternalOperationResult = {
  ok: true;
  action: ControlledInternalOperationAction;
  createdRecordType: "DailyBriefingSnapshot" | "AiDepartmentMemoryEvent" | "AiDepartmentIntelligenceSnapshot";
  createdRecordId: string | null;
  recordsCreated: number;
  recordsUpdated: number;
  stateTransition: "internal_operational" | "degraded_but_usable";
  auditEntryCreated: boolean;
  providerCalled: false;
  sent: false;
  published: false;
  crmMutation: false;
  outreach: false;
  scraping: false;
  externalExecutionAllowed: false;
  liveExecutionAllowed: false;
};

function isControlledInternalOperationAction(value: unknown): value is ControlledInternalOperationAction {
  return typeof value === "string" && controlledInternalOperationActions.includes(value as ControlledInternalOperationAction);
}

export function parseControlledInternalOperationAction(value: unknown): ControlledInternalOperationAction {
  if (isControlledInternalOperationAction(value)) return value;

  throw new Error("Unsupported controlled internal operation.");
}

function summarizeDashboardForSnapshot(report: Awaited<ReturnType<typeof createExecutiveDashboardReport>>) {
  return {
    panels: {
      productionReadiness: report.productionReadinessCommand?.status ?? "not_checked",
      dailyStartup: report.dailyStartup?.companyOperatingMode ?? "not_checked",
      morningBrief: report.morningBrief?.summary ?? "not_checked",
      departmentIntelligence: report.departmentIntelligence?.summary ?? "not_checked",
    },
    verticalSlice: {
      priorities: report.todayPriorities?.slice(0, 5).map((item) => item.label) ?? [],
      recommendedWorkOrder: report.morningBrief?.recommendedWorkOrder?.slice(0, 5) ?? [],
      dataGaps: report.dataGaps?.slice(0, 12) ?? [],
      qualifiedPropertyOpportunities: report.propertyOpportunitySummary?.morningBriefSignals
        .filter((signal) => signal.priority === "High")
        .slice(0, 5)
        .map((signal) => ({
          propertyOpportunityId: signal.propertyOpportunityId,
          title: signal.title,
          opportunityScore: signal.opportunityScore,
          recommendedAction: signal.recommendedAction,
        })) ?? [],
    },
    approvalSummary: {
      pending: report.dailyStartup?.approval_queue_summary.awaiting_ceo_approval ?? 0,
      review: report.dailyStartup?.approval_queue_summary.ready_for_review ?? 0,
      blocked: report.dailyStartup?.approval_queue_summary.blocked ?? 0,
    },
    connectorSummary: {
      connected: report.connectorActivation?.totals.connected ?? 0,
      internalReady: report.connectorActivation?.totals.internalReady ?? 0,
      credentialGaps: report.connectorActivation?.totals.credentialsMissing ?? 0,
      dataGaps: report.connectorActivation?.totals.dataGaps ?? 0,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  };
}

async function recordBriefingSnapshot(action: ControlledInternalOperationAction, tenantId: string): Promise<ControlledInternalOperationResult> {
  const report = await deps.loadDashboard(tenantId);
  const snapshot = summarizeDashboardForSnapshot(report);
  const created = await deps.db.dailyBriefingSnapshot.create({
    data: {
      tenantId,
      panels: snapshot.panels as Prisma.InputJsonObject,
      verticalSlice: snapshot.verticalSlice as Prisma.InputJsonObject,
      approvalSummary: snapshot.approvalSummary as Prisma.InputJsonObject,
      connectorSummary: snapshot.connectorSummary as Prisma.InputJsonObject,
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
  });

  await deps.logAudit({
    tenantId,
    action: `controlled_internal_operation.${action}`,
    targetType: "DailyBriefingSnapshot",
    targetId: created.id,
    source: "controlled_internal_operating_mode",
    metadata: {
      action,
      providerCalled: false,
      sent: false,
      published: false,
      crmMutation: false,
      outreach: false,
      scraping: false,
      externalExecutionAllowed: false,
      liveExecutionAllowed: false,
    },
  });

  return {
    ok: true,
    action,
    createdRecordType: "DailyBriefingSnapshot",
    createdRecordId: created.id,
    recordsCreated: 1,
    recordsUpdated: 0,
    stateTransition: "internal_operational",
    auditEntryCreated: true,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutation: false,
    outreach: false,
    scraping: false,
    externalExecutionAllowed: false,
    liveExecutionAllowed: false,
  };
}

async function recordExecutiveMemory(tenantId: string): Promise<ControlledInternalOperationResult> {
  const memoryKey = `executive-memory:controlled-internal-mode:${tenantId}:${new Date().toISOString().slice(0, 10)}`;
  const event = await deps.db.aiDepartmentMemoryEvent.upsert({
    where: { memoryKey },
    create: {
      tenantId,
      memoryKey,
      department: "Executive AI",
      eventType: "ceo_decision",
      summary: "Controlled internal operating mode was reviewed from the dashboard.",
      lesson: "Internal operations can create governed records while external execution remains blocked.",
      recommendation: "Continue with internal briefs, decisions, drafts, and audit records; keep provider and production gates closed.",
      metrics: {
        providerCalled: false,
        sent: false,
        published: false,
        crmMutation: false,
        outreach: false,
        externalExecutionAllowed: false,
      },
      evidenceLabels: ["controlled_internal_operating_mode", "executive_dashboard"],
      confidence: 82,
      outcome: "outcome_pending",
      assumptions: ["This memory is internal governance context only and does not authorize external execution."],
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
    update: {
      summary: "Controlled internal operating mode was reviewed from the dashboard.",
      lesson: "Internal operations can create governed records while external execution remains blocked.",
      recommendation: "Continue with internal briefs, decisions, drafts, and audit records; keep provider and production gates closed.",
      metrics: {
        providerCalled: false,
        sent: false,
        published: false,
        crmMutation: false,
        outreach: false,
        externalExecutionAllowed: false,
      },
      evidenceLabels: ["controlled_internal_operating_mode", "executive_dashboard"],
      confidence: 82,
      outcome: "outcome_pending",
      assumptions: ["This memory is internal governance context only and does not authorize external execution."],
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
  });

  await deps.logAudit({
    tenantId,
    action: "controlled_internal_operation.record_executive_memory",
    targetType: "AiDepartmentMemoryEvent",
    targetId: event.id,
    source: "controlled_internal_operating_mode",
    metadata: {
      memoryKey,
      providerCalled: false,
      sent: false,
      published: false,
      crmMutation: false,
      outreach: false,
      scraping: false,
      externalExecutionAllowed: false,
      liveExecutionAllowed: false,
    },
  });

  return {
    ok: true,
    action: "record_executive_memory",
    createdRecordType: "AiDepartmentMemoryEvent",
    createdRecordId: event.id,
    recordsCreated: 1,
    recordsUpdated: 0,
    stateTransition: "internal_operational",
    auditEntryCreated: true,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutation: false,
    outreach: false,
    scraping: false,
    externalExecutionAllowed: false,
    liveExecutionAllowed: false,
  };
}

async function refreshInternalIntelligence(tenantId: string): Promise<ControlledInternalOperationResult> {
  const report = await deps.refreshIntelligence();

  await deps.logAudit({
    tenantId,
    action: "controlled_internal_operation.refresh_internal_intelligence",
    targetType: "AiDepartmentIntelligenceSnapshot",
    source: "controlled_internal_operating_mode",
    metadata: {
      departmentsReviewed: report.departments.length,
      providerCalled: false,
      sent: false,
      published: false,
      crmMutation: false,
      outreach: false,
      scraping: false,
      externalExecutionAllowed: false,
      liveExecutionAllowed: false,
    },
  });

  return {
    ok: true,
    action: "refresh_internal_intelligence",
    createdRecordType: "AiDepartmentIntelligenceSnapshot",
    createdRecordId: null,
    recordsCreated: 0,
    recordsUpdated: report.departments.length,
    stateTransition: report.departments.some((department) => department.memoryStatus !== "no_memory") ? "internal_operational" : "degraded_but_usable",
    auditEntryCreated: true,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutation: false,
    outreach: false,
    scraping: false,
    externalExecutionAllowed: false,
    liveExecutionAllowed: false,
  };
}

export async function runControlledInternalOperation(
  action: ControlledInternalOperationAction,
  tenantId: string,
): Promise<ControlledInternalOperationResult> {
  if (action === "refresh_internal_intelligence") return refreshInternalIntelligence(tenantId);
  if (action === "record_executive_memory") return recordExecutiveMemory(tenantId);

  return recordBriefingSnapshot(action, tenantId);
}
