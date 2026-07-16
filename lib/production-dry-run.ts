import { getCompanyActivationSnapshot, getInternalWorkQueue, type CompanyActivationSnapshot, type InternalWorkQueueReport } from "@/lib/company-activation";
import { getCeoDraftWorkspaceReport, type CeoDraftWorkspaceReport } from "@/lib/company-draft-workspace";
import { createDfdOperatingReport, type DfdOperatingReport } from "@/lib/dfd-operating-conductor";
import { getDailyMission, type DailyMission } from "@/lib/daily-mission";
import { sanitizeAiMemoryPayload } from "@/lib/ai-memory-logger";
import { recordOperatingLoopTraceFailClosed, type OperatingLoopStep } from "@/lib/operating-loop-trace";
import { prisma } from "@/lib/prisma";
import {
  getLatestBusinessSnapshots,
  getLatestLiveMorningBrief,
  type BusinessDataSnapshotRecord,
  type LiveMorningBrief,
} from "@/lib/read-only-business-connections";

const tenantId = "default";

export const productionDryRunSafetyFlags = {
  readOnly: true,
  providerCalled: false,
  sent: false,
  published: false,
  workflowStarted: false,
  liveExecutionAllowed: false,
  outreachBlocked: true,
  scrapingBlocked: true,
  adsBlocked: true,
  crmMutationBlocked: true,
  externalWritesBlocked: true,
} as const;

export type ProductionDryRunLoopStep = {
  sourceStep: OperatingLoopStep;
  targetStep: OperatingLoopStep;
  status: "prepared" | "completed" | "blocked" | "failed";
  evidence: string;
  sourceLabel: string;
  auditRecorded: boolean;
  providerCalled: false;
  sent: false;
  published: false;
  liveExecutionAllowed: false;
};

export type ProductionDryRunReport = {
  ok: true;
  traceId: string;
  generatedAt: string;
  summary: string;
  loopSteps: ProductionDryRunLoopStep[];
  businessWorkProduced: {
    morningBriefItems: number;
    dailyMissionRevenuePriorities: number;
    dfdPropertyPriorities: number;
    aiCooAssignments: number;
    departmentWorkOrders: number;
    draftWorkspaceItems: number;
    approvalQueueItems: number;
    sourceLabels: string[];
  };
  ceoApprovalProof: {
    draftsVisible: number;
    approvalsVisible: number;
    canApproveRejectDraftWork: boolean;
    canReviewApprovalQueue: boolean;
    approvalSourceLabels: string[];
    providerCalled: false;
    liveExecutionAllowed: false;
  };
  approvedExecutionValidation: {
    status: "blocked";
    approvedExecutionEnabled: boolean;
    productionSmokePassed: boolean;
    externalActionsBlocked: true;
    internalCrmTaskValidation: "exact_approved_action_required";
    blockedReason: string;
    providerCalled: false;
    sent: false;
    published: false;
    liveExecutionAllowed: false;
  };
  auditProof: {
    traceRecordsAttempted: number;
    traceRecordsRecorded: number;
    failedClosed: boolean;
    sourceLabel: string;
  };
  memoryEligibility: {
    eligible: boolean;
    memoryWritten: false;
    eventType: string | null;
    source: string | null;
    reason: string;
    sanitizedMetadataKeys: string[];
  };
  businessOutcomePlaceholder: {
    status: "outcome_pending" | "blocked";
    sourceLabel: string;
    evidence: string[];
    providerCalled: false;
    sent: false;
    published: false;
    liveExecutionAllowed: false;
  };
  tomorrowRecommendations: Array<{
    title: string;
    reason: string;
    sourceLabel: string;
    approvalRequired: true;
    providerCalled: false;
    liveExecutionAllowed: false;
  }>;
  remainingProductionBlockers: string[];
  safetyFlags: typeof productionDryRunSafetyFlags;
  providerCalled: false;
  sent: false;
  published: false;
  workflowStarted: false;
  liveExecutionAllowed: false;
};

export type ProductionDryRunApprovalQueueItem = {
  id: string;
  title: string;
  status: string;
  sourceLabel: string;
  itemType: string;
};

type ProductionDryRunServices = {
  now?: () => Date;
  loadSnapshots?: () => Promise<BusinessDataSnapshotRecord[]>;
  loadMorningBrief?: () => Promise<LiveMorningBrief>;
  loadDailyMission?: () => Promise<DailyMission>;
  loadDfdOperating?: () => Promise<DfdOperatingReport>;
  loadActivationSnapshot?: () => Promise<CompanyActivationSnapshot>;
  loadInternalWorkQueue?: () => Promise<InternalWorkQueueReport>;
  loadDraftWorkspace?: () => Promise<CeoDraftWorkspaceReport>;
  loadApprovalQueue?: () => Promise<ProductionDryRunApprovalQueueItem[]>;
  recordTrace?: typeof recordOperatingLoopTraceFailClosed;
  env?: NodeJS.ProcessEnv;
};

const loopTransitions: Array<[OperatingLoopStep, OperatingLoopStep]> = [
  ["morning_brief", "daily_mission"],
  ["daily_mission", "ceo_decision"],
  ["ceo_decision", "ai_coo_assignment"],
  ["ai_coo_assignment", "department_work_order"],
  ["department_work_order", "draft_workspace"],
  ["draft_workspace", "ceo_approval"],
  ["ceo_approval", "approved_execution"],
  ["approved_execution", "audit"],
  ["audit", "memory"],
  ["memory", "business_outcome"],
  ["business_outcome", "tomorrow_recommendation"],
];

async function loadApprovalQueueFromDb(): Promise<ProductionDryRunApprovalQueueItem[]> {
  return prisma.unifiedApprovalItem.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      status: true,
      sourceLabel: true,
      itemType: true,
    },
  });
}

function hasProductionSmokeApproval(env: NodeJS.ProcessEnv) {
  if (env.VERCEL_ENV !== "production" && env.NODE_ENV !== "production") return true;

  return env.APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED === "true";
}

function approvedExecutionBlockedReason(env: NodeJS.ProcessEnv) {
  if (env.APPROVED_EXECUTION_ENABLED !== "true") return "APPROVED_EXECUTION_ENABLED is not true.";
  if (!hasProductionSmokeApproval(env)) return "APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED is not true.";

  return "Sprint 24 dry run is validation-only; live execution is not performed by this endpoint.";
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

async function safeLoad<T>(label: string, load: () => Promise<T>, fallback: T, failures: string[]) {
  try {
    return await load();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown load failure.";
    failures.push(`${label}: ${message}`);

    return fallback;
  }
}

function fallbackMorningBrief(generatedAt: string): LiveMorningBrief {
  return {
    greeting: "Good Morning Moses",
    generatedAt,
    overnightSummary: ["Production dry run could not load stored read-only snapshots."],
    todayPriorities: ["Resolve production dry-run data access blockers."],
    estimatedCeoTimeMinutes: 12,
    sourceLabels: ["production_dry_run:data_access_blocker"],
    dataGaps: ["Stored read-only connector snapshots could not be loaded."],
    departmentRecommendations: [],
    connectorHealth: [],
    featureFlags: {} as LiveMorningBrief["featureFlags"],
    providerCalled: false,
    liveExecutionAllowed: false,
    safetyFlags: {
      readOnly: true,
      liveExecutionAllowed: false,
      externalWritesBlocked: true,
      publishingBlocked: true,
      emailSendingBlocked: true,
      smsBlocked: true,
      adsBlocked: true,
      crmMutationBlocked: true,
      providerExecutionBlocked: true,
      oauthWritesBlocked: true,
    },
  };
}

function fallbackDailyMission(morningBrief: LiveMorningBrief, generatedAt: string): DailyMission {
  return {
    ok: true,
    missionDate: generatedAt.slice(0, 10),
    generatedAt,
    title: "CEO Daily Mission",
    greeting: "Good Morning Moses",
    summary: "Production dry run could not load the full Daily Mission; resolve data access blockers before deployment.",
    status: "data_gap",
    overnightSummary: morningBrief.overnightSummary,
    urgentCeoDecisions: [],
    draftsReady: [],
    revenuePriorities: [],
    leadPriorities: [],
    connectorHealth: [],
    dfdOperating: null,
    dataGaps: ["Daily Mission could not be loaded from internal data."],
    estimatedCeoTimeMinutes: 12,
    sourceLabels: ["production_dry_run:daily_mission_data_gap"],
    morningBrief,
    safetyFlags: {
      readOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      published: false,
      sent: false,
      workflowStarted: false,
      outreachBlocked: true,
      scrapingBlocked: true,
      adsBlocked: true,
      emailBlocked: true,
      smsBlocked: true,
      crmMutationBlocked: true,
      externalActionsBlocked: true,
      approvalRequired: true,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
    published: false,
    sent: false,
    workflowStarted: false,
  };
}

function fallbackDfdOperating(generatedAt: string): DfdOperatingReport {
  return {
    ok: true,
    title: "DFD AI Operating Conductor",
    summary: "DFD AI could not load stored lead/property data during the dry run.",
    generatedAt,
    totals: {
      storedLeads: 0,
      propertyReviewPriorities: 0,
      governanceStops: 0,
      distressSignals: 0,
      staleObservations: 0,
      missingPropertyData: 0,
      duplicateReviews: 0,
      acquisitionBottlenecks: 0,
    },
    topPriorities: [],
    departmentRoutes: [],
    connectorEvidence: [],
    dataGaps: ["DFD operating data could not be loaded."],
    draftWorkspaceProof: [],
    safetyFlags: {
      readOnly: true,
      advisoryOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      workflowStarted: false,
      sent: false,
      published: false,
      outreachBlocked: true,
      scrapingBlocked: true,
      adsBlocked: true,
      crmMutationBlocked: true,
      gpsTrackingBlocked: true,
      streetViewAutomationBlocked: true,
      skipTracingBlocked: true,
      autonomousLeadCreationBlocked: true,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
    workflowStarted: false,
    sent: false,
    published: false,
  };
}

function fallbackActivationSnapshot(): CompanyActivationSnapshot {
  return {
    directives: [],
    assignments: [],
    draftQueueItems: [],
    latestDecision: null,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function fallbackInternalWorkQueue(): InternalWorkQueueReport {
  return {
    ok: true,
    queue: [],
    totals: {
      assignments: 0,
      draftQueueItems: 0,
      readyForFinalApproval: 0,
      completedInternal: 0,
      blocked: 0,
    },
    summary: "Internal work queue could not be loaded.",
    approvalRequired: true,
    providerCalled: false,
    sent: false,
    published: false,
    scheduled: false,
    liveExecutionAllowed: false,
  };
}

function fallbackDraftWorkspace(): CeoDraftWorkspaceReport {
  return {
    ok: true,
    title: "CEO Draft Workspace",
    summary: "CEO Draft Workspace could not be loaded.",
    totals: {
      departments: 0,
      drafts: 0,
      approved: 0,
      rejected: 0,
      changesRequested: 0,
      pendingReview: 0,
    },
    groups: [],
    safetyFlags: {
      providerCalled: false,
      liveExecutionAllowed: false,
      published: false,
      sent: false,
      workflowStarted: false,
      externalExecutionAllowed: false,
      scrapingBlocked: true,
      outreachBlocked: true,
      adsBlocked: true,
      emailBlocked: true,
      smsBlocked: true,
      crmMutationBlocked: true,
      oauthWritesBlocked: true,
    },
  };
}

function createEvidence(input: {
  morningBrief: LiveMorningBrief;
  dailyMission: DailyMission;
  dfdOperating: DfdOperatingReport;
  activationSnapshot: CompanyActivationSnapshot;
  internalWorkQueue: InternalWorkQueueReport;
  draftWorkspace: CeoDraftWorkspaceReport;
  approvalQueue: ProductionDryRunApprovalQueueItem[];
}) {
  return {
    morning_brief: `${input.morningBrief.overnightSummary.length} overnight signal(s) from stored snapshots.`,
    daily_mission: `${input.dailyMission.revenuePriorities.length} revenue priorit${input.dailyMission.revenuePriorities.length === 1 ? "y" : "ies"} and ${input.dailyMission.leadPriorities.length} lead priorit${input.dailyMission.leadPriorities.length === 1 ? "y" : "ies"}.`,
    ceo_decision: `${input.activationSnapshot.directives.length} CEO directive(s) visible.`,
    ai_coo_assignment: `${input.internalWorkQueue.totals.assignments} AI COO assignment(s) visible.`,
    department_work_order: `${input.internalWorkQueue.queue.length} internal work queue item(s) visible.`,
    draft_workspace: `${input.draftWorkspace.totals.drafts} CEO draft workspace item(s) visible.`,
    ceo_approval: `${input.approvalQueue.length} unified approval queue item(s) visible.`,
    approved_execution: "Approved execution validation remains blocked in dry-run mode.",
    audit: "Operating loop trace writes internal RevenueAuditEvent records only.",
    memory: "Executive Memory eligibility checked with sanitized payload; no automatic memory write.",
    business_outcome: "Business outcome placeholder is internal evidence only.",
    tomorrow_recommendation: "Tomorrow recommendations are based on dry-run evidence, DFD priorities, and blockers.",
    dfd: `${input.dfdOperating.topPriorities.length} DFD property review priorit${input.dfdOperating.topPriorities.length === 1 ? "y" : "ies"} visible.`,
  };
}

function recommendation(title: string, reason: string, sourceLabel: string) {
  return {
    title,
    reason,
    sourceLabel,
    approvalRequired: true as const,
    providerCalled: false as const,
    liveExecutionAllowed: false as const,
  };
}

function createTomorrowRecommendations(input: {
  dailyMission: DailyMission;
  dfdOperating: DfdOperatingReport;
  approvedExecutionBlockedReason: string;
}) {
  const revenue = input.dailyMission.revenuePriorities.slice(0, 3).map((priority) => recommendation(priority.title, priority.detail, priority.sourceLabel));
  const dfd = input.dfdOperating.topPriorities.slice(0, 3).map((priority) =>
    recommendation(priority.title, priority.nextInternalAction, `dfd_operating_conductor:${priority.leadId}`),
  );
  const blockers = [
    recommendation("Resolve approved execution production gate", input.approvedExecutionBlockedReason, "approved_execution:dry_run_gate"),
    ...input.dfdOperating.dataGaps.slice(0, 2).map((gap) => recommendation("Resolve DFD operating data gap", gap, "dfd_operating_conductor:data_gap")),
  ];

  return [...revenue, ...dfd, ...blockers].slice(0, 8);
}

function createMemoryEligibility(input: {
  traceId: string;
  generatedAt: string;
  sourceLabels: string[];
}) {
  const sanitized = sanitizeAiMemoryPayload({
    actionId: input.traceId,
    eventType: "production_dry_run_completed",
    source: "production_dry_run",
    approvalDecision: "dry_run_only",
    messageStatus: "blocked_external_execution",
    outcome: "outcome_pending",
    metadata: {
      traceId: input.traceId,
      generatedAt: input.generatedAt,
      sourceLabels: input.sourceLabels.slice(0, 12),
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
  });
  const metadata = sanitized.metadata && typeof sanitized.metadata === "object" && !Array.isArray(sanitized.metadata) ? sanitized.metadata : {};
  const eligible = Boolean(sanitized.eventType && sanitized.source);

  return {
    eligible,
    memoryWritten: false as const,
    eventType: sanitized.eventType,
    source: sanitized.source,
    reason: eligible ? "Payload is sanitized and eligible; Sprint 24 records eligibility only unless a future CEO-approved memory write is requested." : "Memory payload is not eligible.",
    sanitizedMetadataKeys: Object.keys(metadata),
  };
}

export async function runProductionDryRun(services: ProductionDryRunServices = {}): Promise<ProductionDryRunReport> {
  const now = services.now?.() ?? new Date();
  const generatedAt = now.toISOString();
  const traceId = `production-dry-run:${generatedAt.slice(0, 10)}`;
  const env = services.env ?? process.env;
  const loadFailures: string[] = [];
  const snapshots = await safeLoad("BusinessDataSnapshot", services.loadSnapshots ?? (() => getLatestBusinessSnapshots(40)), [], loadFailures);
  const morningBrief = await safeLoad("Morning Brief", services.loadMorningBrief ?? getLatestLiveMorningBrief, fallbackMorningBrief(generatedAt), loadFailures);
  const [
    dailyMission,
    dfdOperating,
    activationSnapshot,
    internalWorkQueue,
    draftWorkspace,
    approvalQueue,
  ] = await Promise.all([
    safeLoad("Daily Mission", services.loadDailyMission ?? getDailyMission, fallbackDailyMission(morningBrief, generatedAt), loadFailures),
    safeLoad("DFD Operating Conductor", services.loadDfdOperating ?? createDfdOperatingReport, fallbackDfdOperating(generatedAt), loadFailures),
    safeLoad("Company Activation", services.loadActivationSnapshot ?? getCompanyActivationSnapshot, fallbackActivationSnapshot(), loadFailures),
    safeLoad("Internal Work Queue", services.loadInternalWorkQueue ?? getInternalWorkQueue, fallbackInternalWorkQueue(), loadFailures),
    safeLoad("CEO Draft Workspace", services.loadDraftWorkspace ?? getCeoDraftWorkspaceReport, fallbackDraftWorkspace(), loadFailures),
    safeLoad("Unified Approval Queue", services.loadApprovalQueue ?? loadApprovalQueueFromDb, [], loadFailures),
  ]);
  const evidence = createEvidence({
    morningBrief,
    dailyMission,
    dfdOperating,
    activationSnapshot,
    internalWorkQueue,
    draftWorkspace,
    approvalQueue,
  });
  const recordTrace = services.recordTrace ?? recordOperatingLoopTraceFailClosed;
  const loopSteps: ProductionDryRunLoopStep[] = [];

  for (const [sourceStep, targetStep] of loopTransitions) {
    const trace = await recordTrace({
      traceId,
      sourceStep,
      targetStep,
      entityType: "ProductionDryRun",
      entityId: traceId,
      status: targetStep === "approved_execution" ? "blocked" : "completed",
      idempotencyKey: `${traceId}:${sourceStep}->${targetStep}`,
      sourceLabel: "production_dry_run:sprint_24",
      metadata: {
        evidence: evidence[targetStep],
        dryRunOnly: true,
        noExternalWrites: true,
      },
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    });

    loopSteps.push({
      sourceStep,
      targetStep,
      status: targetStep === "approved_execution" ? "blocked" : "completed",
      evidence: evidence[targetStep],
      sourceLabel: "production_dry_run:sprint_24",
      auditRecorded: Boolean(trace),
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    });
  }

  const sourceLabels = unique([
    ...morningBrief.sourceLabels,
    ...dailyMission.sourceLabels,
    ...dfdOperating.connectorEvidence,
    ...approvalQueue.map((item) => item.sourceLabel),
  ]).slice(0, 20);
  const blockedReason = approvedExecutionBlockedReason(env);
  const memoryEligibility = createMemoryEligibility({ traceId, generatedAt, sourceLabels });
  const tomorrowRecommendations = createTomorrowRecommendations({
    dailyMission,
    dfdOperating,
    approvedExecutionBlockedReason: blockedReason,
  });
  const remainingProductionBlockers = unique([
    snapshots.length === 0 ? "No stored read-only business snapshots are available." : "",
    ...loadFailures,
    draftWorkspace.totals.drafts === 0 ? "CEO Draft Workspace has no visible draft work yet." : "",
    approvalQueue.length === 0 ? "Unified Approval Queue has no visible approval items yet." : "",
    blockedReason,
    ...dailyMission.dataGaps.slice(0, 5),
    ...dfdOperating.dataGaps.slice(0, 5),
  ]);
  const traceRecordsRecorded = loopSteps.filter((step) => step.auditRecorded).length;

  return {
    ok: true,
    traceId,
    generatedAt,
    summary: `Sprint 24 dry run completed ${loopSteps.length} operating-loop transition(s), produced ${dfdOperating.topPriorities.length} DFD priorit${dfdOperating.topPriorities.length === 1 ? "y" : "ies"}, and kept external execution blocked.`,
    loopSteps,
    businessWorkProduced: {
      morningBriefItems: morningBrief.overnightSummary.length,
      dailyMissionRevenuePriorities: dailyMission.revenuePriorities.length,
      dfdPropertyPriorities: dfdOperating.topPriorities.length,
      aiCooAssignments: internalWorkQueue.totals.assignments,
      departmentWorkOrders: internalWorkQueue.queue.length,
      draftWorkspaceItems: draftWorkspace.totals.drafts,
      approvalQueueItems: approvalQueue.length,
      sourceLabels,
    },
    ceoApprovalProof: {
      draftsVisible: draftWorkspace.totals.drafts,
      approvalsVisible: approvalQueue.length,
      canApproveRejectDraftWork: draftWorkspace.totals.drafts > 0,
      canReviewApprovalQueue: approvalQueue.length > 0,
      approvalSourceLabels: approvalQueue.map((item) => item.sourceLabel).slice(0, 8),
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    approvedExecutionValidation: {
      status: "blocked",
      approvedExecutionEnabled: env.APPROVED_EXECUTION_ENABLED === "true",
      productionSmokePassed: hasProductionSmokeApproval(env),
      externalActionsBlocked: true,
      internalCrmTaskValidation: "exact_approved_action_required",
      blockedReason,
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
    auditProof: {
      traceRecordsAttempted: loopSteps.length,
      traceRecordsRecorded,
      failedClosed: traceRecordsRecorded < loopSteps.length,
      sourceLabel: "production_dry_run:sprint_24",
    },
    memoryEligibility,
    businessOutcomePlaceholder: {
      status: remainingProductionBlockers.length > 0 ? "blocked" : "outcome_pending",
      sourceLabel: "production_dry_run:business_outcome_placeholder",
      evidence: [
        evidence.business_outcome,
        `${tomorrowRecommendations.length} tomorrow recommendation(s) prepared from dry-run evidence.`,
      ],
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
    tomorrowRecommendations,
    remainingProductionBlockers,
    safetyFlags: productionDryRunSafetyFlags,
    providerCalled: false,
    sent: false,
    published: false,
    workflowStarted: false,
    liveExecutionAllowed: false,
  };
}
