import assert from "node:assert/strict";
import { test } from "node:test";
import { createCeoOperatingScorecardFromInputs } from "@/lib/ceo-operating-scorecard";
import type { AiWorkforceCommandCenterReport } from "@/lib/ai-collaboration-engine";
import type { DailyMission } from "@/lib/daily-mission";
import type { DailyRevenueOperatingLoopReport } from "@/lib/daily-revenue-operating-loop";
import type { ProviderReadinessReport } from "@/lib/provider-readiness";

const generatedAt = "2026-07-26T12:00:00.000Z";

function dailyMission(overrides: Partial<DailyMission> = {}): DailyMission {
  return {
    ok: true,
    missionDate: "2026-07-26",
    generatedAt,
    title: "CEO Daily Mission",
    greeting: "Good Morning Moses",
    summary: "1 CEO decision, 0 drafts, and 1 lead priority item are ready for review.",
    status: "urgent",
    overnightSummary: [],
    urgentCeoDecisions: [
      {
        id: "decision-1",
        title: "Review source-qualified seller conversation objective",
        reason: "CEO confirmation is required before external action.",
        expectedBusinessValue: "Align the first controlled operating day to a measurable revenue objective.",
        riskLevel: "medium",
        status: "awaiting_ceo_approval",
        recommendedAction: "review",
        sourceLabel: "executive_directive:decision-1",
        approvalRequired: true,
        providerCalled: false,
        liveExecutionAllowed: false,
      },
    ],
    draftsReady: [],
    revenuePriorities: [],
    leadPriorities: [],
    connectorHealth: [
      {
        connectorId: "google_search_console",
        displayName: "Google Search Console",
        connected: false,
        authenticated: false,
        readOnly: true,
        healthy: false,
        lastFailure: "Missing required read-only credential/configuration: GOOGLE_SEARCH_CONSOLE_SITE_URL.",
        sourceLabel: "connector:google_search_console:health",
        unifiedStatus: "missing_credentials",
        registryStatus: "readiness_only",
        providerReadinessStatus: "missing",
        lastSuccessfulRead: null,
        lastDataGap: "Missing required read-only credential/configuration: GOOGLE_SEARCH_CONSOLE_SITE_URL.",
        authentication: "missing",
        permissions: [],
        dataFreshness: "data_gap",
        readOnlyProviderCalled: false,
        liveExecutionAllowed: false,
      },
    ],
    dfdOperating: null,
    dataGaps: ["Search Console: missing site URL."],
    estimatedCeoTimeMinutes: 18,
    sourceLabels: ["daily_mission:test"],
    morningBrief: {
      ok: true,
      generatedAt,
      greeting: "Good Morning Moses",
      overnightSummary: [],
      todayPriorities: [],
      connectorHealth: [],
      dataGaps: [],
      estimatedCeoTimeMinutes: 12,
      sourceLabels: [],
      providerCalled: false,
      liveExecutionAllowed: false,
    },
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
    ...overrides,
  };
}

function workforceCommandCenter(): AiWorkforceCommandCenterReport {
  return {
    ok: true,
    company: "J Capital Property Group",
    generatedAt,
    employees: [
      {
        department: "Lead Generation",
        manager: "Lead Research Analyst AI",
        employee: "Lead Research Analyst AI",
        employeeId: "lead-research",
        status: "working",
        currentAssignment: "Review source-qualified seller lead evidence.",
        requestedBy: null,
        waitingOn: null,
        blocker: null,
        dueDate: generatedAt,
        handoffTarget: "Approval Gatekeeper AI",
        nextSafeAction: "Prepare internal evidence only.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
    ],
    requests: [],
    dependencyChains: [],
    managerEscalations: [],
    ceoEscalations: [
      {
        id: "approval-1",
        fromDepartment: "Lead Generation",
        fromEmployee: "Lead Research Analyst AI",
        toDepartment: "Approval / Safety",
        toEmployee: "Approval Gatekeeper AI",
        requestType: "approval_escalation",
        title: "Lead evidence needs CEO review",
        description: "CEO approval required.",
        neededOutput: "Approval packet",
        dependencyOf: "work-1",
        status: "needs_ceo_approval",
        priority: "high",
        blocker: "CEO review required.",
        dueDate: generatedAt,
        approvalRequired: true,
        safeNextAction: "Review evidence; do not contact seller.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
    ],
    readiness: {
      overallAiCompanyReadiness: 72,
      internalOperationalReadiness: { overall: 80, workforce: 80, operatingLoop: 80, collaboration: 80 },
      externalOperationalReadiness: { overall: 0, connectors: 0, crmExecution: 0, publishing: 0 },
    },
    totals: { employees: 1, working: 1, waiting: 0, blocked: 0, needsApproval: 1, idle: 0, requests: 1 },
    safety: {
      readOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalExecutionAllowed: false,
      connectorActivationAllowed: false,
    },
  };
}

function dailyRevenueOperatingLoop(): DailyRevenueOperatingLoopReport {
  return {
    ok: true,
    company: "J Capital Property Group",
    missionDate: "2026-07-26",
    generatedAt,
    revenueGoal: "Move source-attributed seller leads into clean internal next actions.",
    todaysRevenueOpportunities: [],
    highestPriorityLead: null,
    departmentQueues: [
      {
        department: "Lead Generation",
        manager: "Lead Research Analyst AI",
        status: "working",
        employeesAssigned: ["Lead Research Analyst AI"],
        employeesWorking: ["Lead Research Analyst AI"],
        employeesWaiting: [],
        workOrders: [
          {
            id: "work-1",
            department: "Lead Generation",
            aiManager: "Lead Research Analyst AI",
            aiEmployee: "Lead Research Analyst AI",
            aiEmployeeId: "lead-research",
            dailyInput: ["Stored lead source"],
            dailyOutput: ["Source-qualified lead review"],
            revenueObjective: "Improve seller conversation readiness.",
            successKpi: ["Qualified seller conversations"],
            lead: null,
            dealId: null,
            recommendedAction: "Prepare lead source review packet.",
            reason: "Source evidence needs CEO review.",
            revenueImpact: "high",
            missingData: ["No source-attribution coverage metric exists."],
            approvalRule: "CEO approval required before outreach.",
            handoffTarget: ["Approval Gatekeeper AI"],
            dueDate: generatedAt,
            status: "needs_ceo_approval",
            outcome: "pending",
            outputType: "Lead source review packet",
            sourceLabels: ["daily_revenue:test"],
            canCreateCrmTask: false,
            allowedInternalAction: null,
            providerCalled: false,
            liveExecutionAllowed: false,
          },
        ],
        blockers: ["No source-attribution coverage metric exists."],
        connectorIssues: ["Google Search Console"],
        nextSafeAction: "Keep review internal.",
      },
    ],
    workOrders: [],
    ceoDashboard: {
      todaysRevenueOpportunities: 0,
      highestPriorityLead: null,
      departmentsWaiting: [],
      departmentsWorking: ["Lead Generation"],
      departmentBlockers: ["No source-attribution coverage metric exists."],
      connectorIssues: ["Google Search Console"],
      aiEmployeesAssigned: 1,
      tasksReady: 0,
      approvalsNeeded: 1,
      revenueRisk: [],
    },
    tomorrowRecommendations: ["Measure qualified seller conversations after the controlled operating day."],
    safety: {
      internalOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalProviderWritesAllowed: false,
      onlyAllowedInternalAction: "create_crm_task",
      crmTaskCreationRequiresApproval: true,
      approvalGatesPreserved: true,
    },
  };
}

function providerReadiness(): ProviderReadinessReport {
  return {
    generatedAt,
    providers: [
      {
        id: "google_search_console",
        label: "Google Search Console",
        status: "missing",
        connectionState: "missing",
        configuredEnvKeys: [],
        missingEnvKeys: ["GOOGLE_SEARCH_CONSOLE_SITE_URL"],
        permissionsRequired: [],
        safeNextAction: "Add GOOGLE_SEARCH_CONSOLE_SITE_URL only in the approved environment.",
      },
    ],
    summary: { ready: 0, partial: 0, missing: 1, manualOnly: 0 },
    globalFlags: { providerCalled: false, liveExecutionAllowed: false },
  };
}

function scorecardInput() {
  return {
    tenantScope: "default" as const,
    generatedAt,
    dailyMission: dailyMission(),
    workforceCommandCenter: workforceCommandCenter(),
    dailyRevenueOperatingLoop: dailyRevenueOperatingLoop(),
    executiveDashboard: null,
    activationSnapshot: null,
    internalWorkQueue: null,
    providerReadiness: providerReadiness(),
    connectorHealth: [
      {
        connectorId: "google_search_console",
        displayName: "Google Search Console",
        healthStatus: "readiness_only" as const,
        lastSuccessfulSync: null,
        lastFailedSync: null,
        retryPolicy: "fail closed",
        timeoutPolicy: "bounded",
        circuitBreakerState: "not_applicable" as const,
        providerCalled: false,
        liveExecutionAllowed: false,
      },
    ],
  };
}

test("CEO operating scorecard is deterministic and source-attributed", () => {
  const first = createCeoOperatingScorecardFromInputs(scorecardInput());
  const second = createCeoOperatingScorecardFromInputs(scorecardInput());

  assert.deepEqual(first, second);
  assert.equal(first.generatedAt, generatedAt);
  assert.equal(first.objective.status, "draft_requires_ceo_confirmation");
  assert.ok(first.sources.includes("daily_mission"));
  assert.equal(first.tenantScope, "default");
});

test("CEO operating scorecard blocks cross-tenant scope", () => {
  assert.throws(
    () => createCeoOperatingScorecardFromInputs({ ...scorecardInput(), tenantScope: "other" as never }),
    /ceo_operating_scorecard_cross_tenant_scope_blocked/,
  );
});

test("CEO operating scorecard preserves governance and external execution boundaries", () => {
  const report = createCeoOperatingScorecardFromInputs(scorecardInput());

  assert.equal(report.governance.phase3Status, "calibration_ready");
  assert.equal(report.governance.phase4Status, "blocked_until_phase3_promotion");
  assert.equal(report.governance.providerCalled, false);
  assert.equal(report.governance.liveExecutionAllowed, false);
  assert.equal(report.governance.externalExecutionPermitted, false);
  assert.equal(report.safety.crmMutationAllowed, false);
  assert.equal(report.safety.connectorActivationAllowed, false);
});

test("CEO operating scorecard does not invent missing KPI evidence", () => {
  const report = createCeoOperatingScorecardFromInputs(scorecardInput());
  const qualifiedConversations = report.kpiEvidence.find((item) => item.id === "qualified_seller_conversations");
  const sourceCoverage = report.kpiEvidence.find((item) => item.id === "source_attribution_coverage");

  assert.equal(qualifiedConversations?.value, "not_yet_measured");
  assert.equal(qualifiedConversations?.evidenceState, "not_yet_measured");
  assert.equal(sourceCoverage?.value, "no_evidence");
  assert.equal(sourceCoverage?.evidenceState, "no_evidence");
});

test("CEO operating scorecard aggregates blocked connectors, approvals, departments, and mission", () => {
  const report = createCeoOperatingScorecardFromInputs(scorecardInput());

  assert.equal(report.mission.status, "urgent");
  assert.ok(report.departments.some((department) => department.department === "Lead Generation"));
  assert.ok(report.departments.some((department) => department.approvalNeeded));
  assert.ok(report.approvals.length >= 2);
  assert.ok(report.connectorReadiness.some((connector) => connector.connector === "Google Search Console"));
  assert.ok(report.blockers.some((blocker) => blocker.includes("source-attribution")));
});
