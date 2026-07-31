import type { AiWorkforceCommandCenterReport } from "@/lib/ai-collaboration-engine";
import { createAiWorkforceCommandCenter } from "@/lib/ai-collaboration-engine";
import { getCompanyDepartmentRegistry } from "@/lib/company-orchestrator";
import { getCompanyActivationSnapshot, getInternalWorkQueue, type CompanyActivationSnapshot, type InternalWorkQueueReport } from "@/lib/company-activation";
import type { DailyMission } from "@/lib/daily-mission";
import { getDailyMission } from "@/lib/daily-mission";
import type { DailyRevenueOperatingLoopReport } from "@/lib/daily-revenue-operating-loop";
import { createDailyRevenueOperatingLoop } from "@/lib/daily-revenue-operating-loop";
import { createExecutiveDashboardReport, type ExecutiveDashboardReport } from "@/lib/executive-dashboard";
import { getConnectorHealth, type ConnectorHealthStatus } from "@/lib/connector-platform";
import { getFeatureFlagSnapshot } from "@/lib/feature-flags";
import { createProviderReadinessReport, type ProviderReadinessReport } from "@/lib/provider-readiness";

export type CeoScorecardEvidenceState = "measured" | "not_yet_measured" | "no_evidence";
export type CeoScorecardStatus = "ready" | "watch" | "blocked" | "needs_ceo_approval" | "not_yet_measured";

export type CeoOperatingObjective = {
  objective: "Increase source-attributed qualified seller conversations";
  ownerDepartment: "Revenue Operations";
  ownerProfessional: "Revenue Operations AI";
  status: "draft_requires_ceo_confirmation" | "active";
  targetKpi: "Qualified seller conversations per week with source attribution";
  currentKpi: CeoScorecardKpiEvidence;
  targetPeriod: "weekly";
  supportingDepartments: string[];
  sourceLabel: string;
};

export type CeoScorecardKpiEvidence = {
  id:
    | "qualified_seller_conversations"
    | "source_attribution_coverage"
    | "decision_packets_prepared"
    | "ceo_review_time"
    | "blocked_leads_resolved"
    | "unauthorized_outreach_count";
  label: string;
  value: string | number;
  unit: string;
  evidenceState: CeoScorecardEvidenceState;
  sourceLabel: string;
  detail: string;
};

export type CeoScorecardMission = {
  title: string;
  status: DailyMission["status"] | "no_evidence";
  assignedDepartments: string[];
  dependencies: string[];
  dueState: string;
  evidenceReadiness: CeoScorecardEvidenceState;
  sourceLabel: string;
};

export type CeoScorecardDepartmentWork = {
  department: string;
  assignedWork: string;
  status: CeoScorecardStatus;
  latestDeliverable: string;
  qaStatus: "ready_for_review" | "blocked" | "not_yet_measured";
  blocker: string | null;
  approvalNeeded: boolean;
  sourceLabel: string;
};

export type CeoScorecardDecision = {
  id: string;
  title: string;
  recommendedDecision: string;
  evidenceCount: number;
  riskLevel: "low" | "medium" | "high";
  nextAction: string;
  sourceLabel: string;
};

export type CeoScorecardConnectorGap = {
  connector: string;
  readinessState: ConnectorHealthStatus | "missing_credentials" | "data_gap";
  dataGap: string;
  departmentAffected: string;
  safeNextStep: string;
  sourceLabel: string;
};

export type CeoScorecardGovernance = {
  phase3Status: "calibration_ready";
  phase4Status: "blocked_until_phase3_promotion";
  providerCalled: false;
  liveExecutionAllowed: false;
  externalExecutionPermitted: false;
  pendingExternalApprovalCount: number;
  featureFlagsSource: "feature_flags_snapshot";
};

export type CeoOperatingLoopStep = {
  id: "morning_brief" | "daily_mission" | "department_work" | "qa_review" | "ceo_decision" | "executive_memory" | "end_of_day_outcome";
  label: string;
  status: CeoScorecardStatus;
  owner: string;
  evidence: string;
  nextAction: string;
  blocker: string | null;
};

export type CeoOperatingScorecardReport = {
  ok: true;
  company: "J Capital Property Group";
  tenantScope: "default";
  generatedAt: string;
  objective: CeoOperatingObjective;
  mission: CeoScorecardMission;
  departments: CeoScorecardDepartmentWork[];
  approvals: CeoScorecardDecision[];
  kpiEvidence: CeoScorecardKpiEvidence[];
  blockers: string[];
  connectorReadiness: CeoScorecardConnectorGap[];
  governance: CeoScorecardGovernance;
  operatingLoop: CeoOperatingLoopStep[];
  drillDownLinks: Array<{ label: string; href: string; sourceLabel: string }>;
  sources: string[];
  embeddedWorkforce: AiWorkforceCommandCenterReport;
  safety: {
    readOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalWritesAllowed: false;
    connectorActivationAllowed: false;
    crmMutationAllowed: false;
  };
};

export type CeoOperatingScorecardInputs = {
  tenantScope?: "default";
  generatedAt?: string;
  dailyMission: DailyMission | null;
  workforceCommandCenter: AiWorkforceCommandCenterReport;
  dailyRevenueOperatingLoop: DailyRevenueOperatingLoopReport;
  executiveDashboard: ExecutiveDashboardReport | null;
  activationSnapshot: CompanyActivationSnapshot | null;
  internalWorkQueue: InternalWorkQueueReport | null;
  providerReadiness: ProviderReadinessReport;
  connectorHealth: ReturnType<typeof getConnectorHealth>;
};

function unique(values: Array<string | null | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value?.trim())))];
}

function kpi(
  id: CeoScorecardKpiEvidence["id"],
  label: string,
  value: string | number,
  unit: string,
  evidenceState: CeoScorecardEvidenceState,
  sourceLabel: string,
  detail: string,
): CeoScorecardKpiEvidence {
  return { id, label, value, unit, evidenceState, sourceLabel, detail };
}

function createKpiEvidence(input: CeoOperatingScorecardInputs): CeoScorecardKpiEvidence[] {
  const decisionPackets = input.internalWorkQueue?.totals.readyForFinalApproval;
  const ceoTime = input.dailyMission?.estimatedCeoTimeMinutes;
  const blockedLeads = input.dailyRevenueOperatingLoop.workOrders.filter((order) => order.outcome === "blocked" || order.status === "blocked").length;

  return [
    kpi(
      "qualified_seller_conversations",
      "Qualified seller conversations",
      "not_yet_measured",
      "conversations/week",
      "not_yet_measured",
      "business_objective:draft",
      "The repository tracks qualified leads, but no approved evidence source currently proves qualified seller conversations per week.",
    ),
    kpi(
      "source_attribution_coverage",
      "Source attribution coverage",
      "no_evidence",
      "coverage",
      "no_evidence",
      "executive_dashboard:business_intelligence",
      "No canonical source attribution coverage KPI exists yet in the reused reports.",
    ),
    kpi(
      "decision_packets_prepared",
      "Decision packets prepared",
      typeof decisionPackets === "number" ? decisionPackets : "no_evidence",
      "packets",
      typeof decisionPackets === "number" ? "measured" : "no_evidence",
      "company_activation:internal_work_queue",
      typeof decisionPackets === "number" ? "Ready-for-final-approval internal work items." : "Internal work queue is unavailable.",
    ),
    kpi(
      "ceo_review_time",
      typeof ceoTime === "number" ? "Estimated CEO review time" : "CEO review time",
      typeof ceoTime === "number" ? ceoTime : "not_yet_measured",
      "minutes",
      typeof ceoTime === "number" ? "measured" : "not_yet_measured",
      "daily_mission:estimated_ceo_time",
      typeof ceoTime === "number" ? "Daily Mission estimate from queued review items." : "No measured CEO review time evidence exists yet.",
    ),
    kpi(
      "blocked_leads_resolved",
      "Blocked leads resolved",
      blockedLeads > 0 ? 0 : "not_yet_measured",
      "leads",
      blockedLeads > 0 ? "measured" : "not_yet_measured",
      "daily_revenue_operating_loop:work_orders",
      blockedLeads > 0 ? `${blockedLeads} blocked lead/work item(s) remain unresolved.` : "No resolved-blocked-lead evidence exists yet.",
    ),
    kpi(
      "unauthorized_outreach_count",
      "Unauthorized outreach count",
      0,
      "events",
      "measured",
      "governance:safety_flags",
      "Current scorecard and source systems preserve outreach blocking and no external execution.",
    ),
  ];
}

function createObjective(input: CeoOperatingScorecardInputs, kpis: CeoScorecardKpiEvidence[]): CeoOperatingObjective {
  return {
    objective: "Increase source-attributed qualified seller conversations",
    ownerDepartment: "Revenue Operations",
    ownerProfessional: "Revenue Operations AI",
    status: "draft_requires_ceo_confirmation",
    targetKpi: "Qualified seller conversations per week with source attribution",
    currentKpi: kpis[0],
    targetPeriod: "weekly",
    supportingDepartments: ["Marketing Intelligence", "Search Intelligence", "Property Intelligence", "Operations", "Executive Office"],
    sourceLabel: input.activationSnapshot?.directives[0]?.id ? `executive_directive:${input.activationSnapshot.directives[0].id}` : "business_objective:draft",
  };
}

function createMission(input: CeoOperatingScorecardInputs): CeoScorecardMission {
  const departments = unique([
    ...input.dailyRevenueOperatingLoop.departmentQueues.filter((queue) => queue.workOrders.length > 0).map((queue) => queue.department),
    ...input.workforceCommandCenter.employees.filter((employee) => employee.status !== "idle").map((employee) => employee.department),
  ]);
  const dependencies = unique([
    ...(input.dailyMission?.dataGaps ?? []),
    ...input.dailyRevenueOperatingLoop.ceoDashboard.connectorIssues,
    ...input.dailyRevenueOperatingLoop.ceoDashboard.departmentBlockers,
  ]).slice(0, 8);

  return {
    title: input.dailyMission?.title ?? "CEO Daily Mission",
    status: input.dailyMission?.status ?? "no_evidence",
    assignedDepartments: departments,
    dependencies,
    dueState: input.dailyRevenueOperatingLoop.workOrders.some((order) => order.status === "needs_ceo_approval") ? "ceo_review_required_before_tomorrow" : "today",
    evidenceReadiness: input.dailyMission ? "measured" : "no_evidence",
    sourceLabel: input.dailyMission ? "daily_mission" : "daily_mission:no_evidence",
  };
}

function statusFromWorkOrder(status: string, hasBlocker: boolean, approvalNeeded: boolean): CeoScorecardStatus {
  if (hasBlocker || status === "blocked") return "blocked";
  if (approvalNeeded || status === "needs_ceo_approval") return "needs_ceo_approval";
  if (status === "waiting") return "watch";
  return "ready";
}

function createDepartments(input: CeoOperatingScorecardInputs): CeoScorecardDepartmentWork[] {
  const registry = getCompanyDepartmentRegistry();
  return input.dailyRevenueOperatingLoop.departmentQueues.map((queue) => {
    const firstWorkOrder = queue.workOrders[0] ?? null;
    const registryOwner = registry.find((item) => String(item.name) === String(queue.department));
    const blocker = queue.blockers[0] ?? queue.connectorIssues[0] ?? null;
    const approvalNeeded = queue.workOrders.some((order) => order.status === "needs_ceo_approval" || /approval/i.test(order.approvalRule));
    const registryOutput = registryOwner?.outputs[0];

    return {
      department: queue.department,
      assignedWork: firstWorkOrder?.recommendedAction ?? registryOutput ?? queue.nextSafeAction,
      status: statusFromWorkOrder(queue.status, Boolean(blocker), approvalNeeded),
      latestDeliverable: firstWorkOrder?.outputType ?? registryOutput ?? "Internal preparation brief",
      qaStatus: blocker ? "blocked" : queue.workOrders.length > 0 ? "ready_for_review" : "not_yet_measured",
      blocker,
      approvalNeeded,
      sourceLabel: `daily_revenue_operating_loop:department:${queue.department}`,
    };
  });
}

function riskLevel(value: string): "low" | "medium" | "high" {
  if (value === "high" || value === "medium" || value === "low") return value;
  return "medium";
}

function createApprovals(input: CeoOperatingScorecardInputs): CeoScorecardDecision[] {
  const missionDecisions = (input.dailyMission?.urgentCeoDecisions ?? []).map((decision) => ({
    id: decision.id,
    title: decision.title,
    recommendedDecision: decision.recommendedAction,
    evidenceCount: decision.sourceLabel ? 1 : 0,
    riskLevel: riskLevel(decision.riskLevel),
    nextAction: decision.reason,
    sourceLabel: decision.sourceLabel,
  }));
  const commandEscalations = input.workforceCommandCenter.ceoEscalations.map((request) => ({
    id: request.id,
    title: request.title,
    recommendedDecision: "review",
    evidenceCount: request.dependencyOf ? 1 : 0,
    riskLevel: request.priority === "high" ? "high" as const : request.priority === "low" ? "low" as const : "medium" as const,
    nextAction: request.safeNextAction,
    sourceLabel: `ai_workforce_command_center:${request.id}`,
  }));

  return [...missionDecisions, ...commandEscalations].slice(0, 12);
}

function createConnectorGaps(input: CeoOperatingScorecardInputs): CeoScorecardConnectorGap[] {
  const providerById = new Map(input.providerReadiness.providers.map((provider) => [provider.id, provider]));
  return input.connectorHealth
    .map((connector) => {
      const missionHealth = input.dailyMission?.connectorHealth.find((item) => item.connectorId === connector.connectorId);
      const provider = providerById.get(connector.connectorId);
      const dataGap = missionHealth?.lastDataGap ?? provider?.safeNextAction ?? connector.lastFailedSync ?? "No fresh connector evidence is available.";
      const readinessState: CeoScorecardConnectorGap["readinessState"] =
        missionHealth?.unifiedStatus === "missing_credentials" || provider?.status === "missing"
          ? "missing_credentials"
          : missionHealth?.lastDataGap
            ? "data_gap"
            : connector.healthStatus;

      return {
        connector: connector.displayName,
        readinessState,
        dataGap,
        departmentAffected: connector.connectorId.includes("google") || connector.connectorId.includes("analytics") ? "Marketing Intelligence" : "Operations",
        safeNextStep: provider?.safeNextAction ?? "Keep readiness visible and do not activate providers from the scorecard.",
        sourceLabel: `connector:${connector.connectorId}:readiness`,
      };
    })
    .filter((gap) => gap.readinessState !== "healthy")
    .slice(0, 10);
}

function createGovernance(input: CeoOperatingScorecardInputs, approvals: CeoScorecardDecision[]): CeoScorecardGovernance {
  void getFeatureFlagSnapshot();

  return {
    phase3Status: "calibration_ready",
    phase4Status: "blocked_until_phase3_promotion",
    providerCalled: false,
    liveExecutionAllowed: false,
    externalExecutionPermitted: false,
    pendingExternalApprovalCount: approvals.length,
    featureFlagsSource: "feature_flags_snapshot",
  };
}

function createOperatingLoop(input: CeoOperatingScorecardInputs, approvals: CeoScorecardDecision[], kpis: CeoScorecardKpiEvidence[]): CeoOperatingLoopStep[] {
  const hasMemory = Boolean(input.executiveDashboard?.morningBrief.memoryInsight || input.executiveDashboard?.recentSystemActivity.some((item) => /memory/i.test(item.label)));
  const blocked = unique([...(input.dailyMission?.dataGaps ?? []), ...input.dailyRevenueOperatingLoop.ceoDashboard.departmentBlockers]);
  return [
    {
      id: "morning_brief",
      label: "Morning Brief",
      status: input.executiveDashboard?.morningBrief ? "ready" : "not_yet_measured",
      owner: "CEO Office",
      evidence: input.executiveDashboard?.morningBrief.summary ?? "No morning brief evidence is available.",
      nextAction: "Review the operating summary before approving work.",
      blocker: null,
    },
    {
      id: "daily_mission",
      label: "Daily Mission",
      status: input.dailyMission?.status === "urgent" ? "needs_ceo_approval" : input.dailyMission ? "ready" : "not_yet_measured",
      owner: "AI COO",
      evidence: input.dailyMission?.summary ?? "No Daily Mission evidence is available.",
      nextAction: "Confirm today department priorities.",
      blocker: input.dailyMission?.dataGaps[0] ?? null,
    },
    {
      id: "department_work",
      label: "Department Work",
      status: input.dailyRevenueOperatingLoop.ceoDashboard.departmentBlockers.length > 0 ? "blocked" : "ready",
      owner: "Revenue Operations",
      evidence: `${input.dailyRevenueOperatingLoop.workOrders.length} internal work order(s).`,
      nextAction: "Review ready and blocked department work.",
      blocker: blocked[0] ?? null,
    },
    {
      id: "qa_review",
      label: "QA Review",
      status: blocked.length > 0 ? "blocked" : "watch",
      owner: "Approval / Safety",
      evidence: "QA is represented by approval gates and blocker visibility.",
      nextAction: "Keep unsupported claims and unsafe actions blocked.",
      blocker: blocked[0] ?? null,
    },
    {
      id: "ceo_decision",
      label: "CEO Decision",
      status: approvals.length > 0 ? "needs_ceo_approval" : "watch",
      owner: "CEO Office",
      evidence: `${approvals.length} pending CEO decision item(s).`,
      nextAction: approvals[0]?.nextAction ?? "No action can execute externally from this scorecard.",
      blocker: approvals.length > 0 ? "CEO review required." : null,
    },
    {
      id: "executive_memory",
      label: "Executive Memory",
      status: hasMemory ? "ready" : "not_yet_measured",
      owner: "Knowledge / Memory",
      evidence: hasMemory ? "Existing executive memory or recent activity is available." : "No memory evidence is available for this loop yet.",
      nextAction: "Record outcomes only through approved internal workflows.",
      blocker: hasMemory ? null : "No closed-loop outcome has been logged yet.",
    },
    {
      id: "end_of_day_outcome",
      label: "End-of-Day Outcome",
      status: kpis.some((item) => item.id === "blocked_leads_resolved" && item.evidenceState === "measured") ? "watch" : "not_yet_measured",
      owner: "AI COO",
      evidence: "Closed operating outcomes are not yet proven for the first controlled operating day.",
      nextAction: "Measure qualified conversations, blockers resolved, and CEO review time after the day closes.",
      blocker: "First controlled operating day evidence has not been captured.",
    },
  ];
}

function createLinks() {
  return [
    { label: "Revenue", href: "/dashboard/revenue", sourceLabel: "dashboard_navigation:revenue" },
    { label: "Leads", href: "/dashboard/leads", sourceLabel: "dashboard_navigation:leads" },
    { label: "Approvals", href: "/dashboard/approvals", sourceLabel: "dashboard_navigation:approvals" },
    { label: "Connectors", href: "/dashboard/connectors", sourceLabel: "dashboard_navigation:connectors" },
    { label: "Production Readiness", href: "/dashboard/production-readiness", sourceLabel: "dashboard_navigation:production_readiness" },
    { label: "Workforce", href: "/dashboard/workforce", sourceLabel: "dashboard_navigation:workforce" },
    { label: "Daily Revenue", href: "/dashboard/daily-revenue", sourceLabel: "dashboard_navigation:daily_revenue" },
    { label: "Knowledge / Memory", href: "/dashboard/knowledge", sourceLabel: "dashboard_navigation:knowledge" },
  ];
}

export function assertCeoOperatingScorecardSafety(report: CeoOperatingScorecardReport): void {
  if (
    report.safety.providerCalled ||
    report.safety.liveExecutionAllowed ||
    report.safety.externalWritesAllowed ||
    report.safety.connectorActivationAllowed ||
    report.safety.crmMutationAllowed ||
    report.governance.providerCalled ||
    report.governance.liveExecutionAllowed ||
    report.governance.externalExecutionPermitted
  ) {
    throw new Error("CEO operating scorecard must remain read-only and must not permit external execution.");
  }

  if (report.tenantScope !== "default") throw new Error("CEO operating scorecard only supports the default tenant scope in P0 Batch 1.");
}

export function createCeoOperatingScorecardFromInputs(input: CeoOperatingScorecardInputs): CeoOperatingScorecardReport {
  if ((input.tenantScope ?? "default") !== "default") {
    throw new Error("ceo_operating_scorecard_cross_tenant_scope_blocked");
  }

  const generatedAt = input.generatedAt ?? input.dailyMission?.generatedAt ?? input.dailyRevenueOperatingLoop.generatedAt ?? input.workforceCommandCenter.generatedAt;
  const kpiEvidence = createKpiEvidence(input);
  const objective = createObjective(input, kpiEvidence);
  const mission = createMission(input);
  const departments = createDepartments(input);
  const approvals = createApprovals(input);
  const connectorReadiness = createConnectorGaps(input);
  const governance = createGovernance(input, approvals);
  const operatingLoop = createOperatingLoop(input, approvals, kpiEvidence);
  const blockers = unique([
    ...departments.map((department) => department.blocker),
    ...connectorReadiness.map((connector) => connector.dataGap),
    ...operatingLoop.map((step) => step.blocker),
  ]).slice(0, 12);

  const report: CeoOperatingScorecardReport = {
    ok: true,
    company: "J Capital Property Group",
    tenantScope: "default",
    generatedAt,
    objective,
    mission,
    departments,
    approvals,
    kpiEvidence,
    blockers,
    connectorReadiness,
    governance,
    operatingLoop,
    drillDownLinks: createLinks(),
    sources: unique([
      "daily_mission",
      "ai_workforce_command_center",
      "daily_revenue_operating_loop",
      "executive_dashboard",
      "company_activation",
      "internal_work_queue",
      "connector_platform",
      "provider_readiness",
      "feature_flags_snapshot",
    ]),
    embeddedWorkforce: input.workforceCommandCenter,
    safety: {
      readOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalWritesAllowed: false,
      connectorActivationAllowed: false,
      crmMutationAllowed: false,
    },
  };
  assertCeoOperatingScorecardSafety(report);

  return report;
}

export async function createCeoOperatingScorecard(): Promise<CeoOperatingScorecardReport> {
  const [dailyMission, workforceCommandCenter, dailyRevenueOperatingLoop, executiveDashboard, activationSnapshot, internalWorkQueue] = await Promise.all([
    getDailyMission().catch(() => null),
    createAiWorkforceCommandCenter(),
    createDailyRevenueOperatingLoop(),
    createExecutiveDashboardReport().catch(() => null),
    getCompanyActivationSnapshot().catch(() => null),
    getInternalWorkQueue().catch(() => null),
  ]);

  return createCeoOperatingScorecardFromInputs({
    dailyMission,
    workforceCommandCenter,
    dailyRevenueOperatingLoop,
    executiveDashboard,
    activationSnapshot,
    internalWorkQueue,
    providerReadiness: createProviderReadinessReport(),
    connectorHealth: getConnectorHealth(),
  });
}
