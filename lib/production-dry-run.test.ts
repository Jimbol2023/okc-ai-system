import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { runProductionDryRun, productionDryRunSafetyFlags, type ProductionDryRunApprovalQueueItem } from "./production-dry-run";
import type { CompanyActivationSnapshot, InternalWorkQueueReport } from "./company-activation";
import type { CeoDraftWorkspaceReport } from "./company-draft-workspace";
import type { DfdOperatingReport } from "./dfd-operating-conductor";
import type { DailyMission } from "./daily-mission";
import type { BusinessDataSnapshotRecord, LiveMorningBrief } from "./read-only-business-connections";

function snapshot(): BusinessDataSnapshotRecord {
  return {
    snapshotDate: new Date("2026-07-07T00:00:00.000Z"),
    provider: "Google Search Console",
    connectorId: "google_search_console",
    category: "search_console_performance",
    status: "fresh",
    sourceLabel: "search_console:search_analytics:readonly",
    provenance: "Stored read-only snapshot.",
    freshness: "2026-07-07T10:00:00.000Z",
    summary: "50 impressions and 5 clicks.",
    metrics: { impressions: 50, clicks: 5 },
    records: [{ page: "/sell-your-house" }],
    dataGaps: [],
    assumptions: [],
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
    providerCalled: true,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}

const morningBrief: LiveMorningBrief = {
  greeting: "Good Morning Moses",
  generatedAt: "2026-07-07T12:00:00.000Z",
  overnightSummary: ["50 Search Console impressions from stored snapshot."],
  todayPriorities: ["Review DFD acquisition priorities"],
  estimatedCeoTimeMinutes: 18,
  sourceLabels: ["search_console:search_analytics:readonly"],
  dataGaps: [],
  departmentRecommendations: [],
  connectorHealth: [],
  featureFlags: {} as never,
  providerCalled: true,
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

const dailyMission = {
  ok: true,
  missionDate: "2026-07-07",
  generatedAt: "2026-07-07T12:00:00.000Z",
  title: "CEO Daily Mission",
  greeting: "Good Morning Moses",
  summary: "DFD and revenue work are ready.",
  status: "urgent",
  overnightSummary: morningBrief.overnightSummary,
  urgentCeoDecisions: [],
  draftsReady: [],
  revenuePriorities: [
    {
      id: "dfd-roi-priority-1",
      title: "Review 123 Main St",
      detail: "DFD ranked this property for internal review.",
      sourceLabel: "dfd_operating_conductor:lead-1",
      confidence: 88,
      approvalRequired: true,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  ],
  leadPriorities: [],
  connectorHealth: [],
  dfdOperating: null,
  dataGaps: [],
  estimatedCeoTimeMinutes: 18,
  sourceLabels: ["dfd_operating_conductor:lead-1"],
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
} satisfies DailyMission;

const dfdOperating = {
  ok: true,
  title: "DFD AI Operating Conductor",
  summary: "DFD ranked one internal property review priority.",
  generatedAt: "2026-07-07T12:00:00.000Z",
  totals: {
    storedLeads: 1,
    propertyReviewPriorities: 1,
    governanceStops: 0,
    distressSignals: 1,
    staleObservations: 0,
    missingPropertyData: 0,
    duplicateReviews: 0,
    acquisitionBottlenecks: 0,
  },
  topPriorities: [
    {
      id: "dfd-visible-distress-lead-1",
      leadId: "lead-1",
      propertyAddress: "123 Main St",
      source: "d4d_manual",
      score: 88,
      roiRank: 98,
      category: "visible_distress",
      title: "visible distress: 123 Main St",
      rationale: "Stored distress flags require review.",
      nextInternalAction: "Review stored distress signals manually.",
      assignedDepartment: "Acquisitions AI",
      sourceRecords: ["lead:lead-1"],
      dataGaps: [],
      approvalRequired: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      workflowStarted: false,
    },
  ],
  departmentRoutes: [],
  connectorEvidence: ["google_search_console:search_console_performance:fresh:50 impressions and 5 clicks."],
  dataGaps: [],
  draftWorkspaceProof: ["Acquisitions AI:visible distress: 123 Main St:lead:lead-1"],
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
} satisfies DfdOperatingReport;

const activationSnapshot: CompanyActivationSnapshot = {
  directives: [],
  assignments: [],
  draftQueueItems: [],
  latestDecision: null,
  providerCalled: false,
  liveExecutionAllowed: false,
};

const internalWorkQueue: InternalWorkQueueReport = {
  ok: true,
  queue: [
    {
      id: "assignment-1",
      itemType: "assignment",
      directiveId: "campaign-001",
      department: "Acquisitions AI",
      requestedOutputs: ["DFD review package"],
      status: "in_progress",
      blocker: null,
      sourceLabel: "executive_directive:campaign-001",
      approvalRequired: true,
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
      safetyFlags: {
        providerCalled: false,
        liveExecutionAllowed: false,
        published: false,
        sent: false,
        outreachBlocked: true,
        workflowExecutionBlocked: true,
        scrapingBlocked: true,
        adsBlocked: true,
        emailBlocked: true,
        smsBlocked: true,
      },
    },
  ],
  totals: {
    assignments: 1,
    draftQueueItems: 0,
    readyForFinalApproval: 0,
    completedInternal: 0,
    blocked: 0,
  },
  summary: "1 internal work item.",
  approvalRequired: true,
  providerCalled: false,
  sent: false,
  published: false,
  scheduled: false,
  liveExecutionAllowed: false,
};

const draftWorkspace: CeoDraftWorkspaceReport = {
  ok: true,
  title: "CEO Draft Workspace",
  summary: "1 draft visible.",
  totals: {
    departments: 1,
    drafts: 1,
    approved: 0,
    rejected: 0,
    changesRequested: 0,
    pendingReview: 1,
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

const approvalQueue: ProductionDryRunApprovalQueueItem[] = [
  {
    id: "approval-1",
    title: "Review DFD work package",
    status: "pending_review",
    sourceLabel: "dfd_operating_conductor:lead-1",
    itemType: "approved_execution",
  },
];

describe("production dry run", () => {
  it("runs the full operating loop using stored data and records audit traces", async () => {
    const traces: unknown[] = [];
    const report = await runProductionDryRun({
      now: () => new Date("2026-07-07T12:00:00.000Z"),
      env: { APPROVED_EXECUTION_ENABLED: "false", VERCEL_ENV: "production", APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED: "false" },
      loadSnapshots: async () => [snapshot()],
      loadMorningBrief: async () => morningBrief,
      loadDailyMission: async () => dailyMission,
      loadDfdOperating: async () => dfdOperating,
      loadActivationSnapshot: async () => activationSnapshot,
      loadInternalWorkQueue: async () => internalWorkQueue,
      loadDraftWorkspace: async () => draftWorkspace,
      loadApprovalQueue: async () => approvalQueue,
      recordTrace: async (input) => {
        traces.push(input);

        return {
          traceId: input.traceId ?? "trace",
          sourceStep: input.sourceStep,
          targetStep: input.targetStep,
          entityType: input.entityType,
          entityId: input.entityId,
          status: input.status,
          idempotencyKey: input.idempotencyKey ?? "key",
          sourceLabel: input.sourceLabel,
          createdAt: input.createdAt ?? "2026-07-07T12:00:00.000Z",
          providerCalled: false,
          sent: false,
          published: false,
          liveExecutionAllowed: false,
        };
      },
    });

    assert.equal(report.ok, true);
    assert.equal(report.loopSteps.length, 11);
    assert.deepEqual(report.loopSteps.map((step) => step.targetStep), [
      "daily_mission",
      "ceo_decision",
      "ai_coo_assignment",
      "department_work_order",
      "draft_workspace",
      "ceo_approval",
      "approved_execution",
      "audit",
      "memory",
      "business_outcome",
      "tomorrow_recommendation",
    ]);
    assert.equal(traces.length, 11);
    assert.equal(report.auditProof.traceRecordsRecorded, 11);
    assert.equal(report.businessWorkProduced.dfdPropertyPriorities, 1);
    assert.equal(report.businessWorkProduced.departmentWorkOrders, 1);
    assert.equal(report.ceoApprovalProof.canApproveRejectDraftWork, true);
    assert.equal(report.ceoApprovalProof.canReviewApprovalQueue, true);
    assert.equal(report.approvedExecutionValidation.status, "blocked");
    assert.equal(report.approvedExecutionValidation.blockedReason, "APPROVED_EXECUTION_ENABLED is not true.");
    assert.equal(report.memoryEligibility.eligible, true);
    assert.equal(report.memoryEligibility.memoryWritten, false);
    assert.equal(report.businessOutcomePlaceholder.status, "blocked");
    assert.ok(report.tomorrowRecommendations.some((item) => item.sourceLabel.includes("dfd_operating_conductor")));
  });

  it("fails closed on audit trace persistence gaps and preserves safety flags", async () => {
    const report = await runProductionDryRun({
      now: () => new Date("2026-07-07T12:00:00.000Z"),
      env: { APPROVED_EXECUTION_ENABLED: "true", VERCEL_ENV: "production", APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED: "false" },
      loadSnapshots: async () => [snapshot()],
      loadMorningBrief: async () => morningBrief,
      loadDailyMission: async () => dailyMission,
      loadDfdOperating: async () => dfdOperating,
      loadActivationSnapshot: async () => activationSnapshot,
      loadInternalWorkQueue: async () => internalWorkQueue,
      loadDraftWorkspace: async () => draftWorkspace,
      loadApprovalQueue: async () => approvalQueue,
      recordTrace: async () => null,
    });

    assert.deepEqual(report.safetyFlags, productionDryRunSafetyFlags);
    assert.equal(report.providerCalled, false);
    assert.equal(report.sent, false);
    assert.equal(report.published, false);
    assert.equal(report.workflowStarted, false);
    assert.equal(report.liveExecutionAllowed, false);
    assert.equal(report.auditProof.failedClosed, true);
    assert.equal(report.auditProof.traceRecordsRecorded, 0);
    assert.equal(report.approvedExecutionValidation.blockedReason, "APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED is not true.");
    assert.equal(report.approvedExecutionValidation.providerCalled, false);
    assert.equal(report.approvedExecutionValidation.sent, false);
    assert.equal(report.approvedExecutionValidation.published, false);
    assert.equal(report.approvedExecutionValidation.liveExecutionAllowed, false);
  });
});
