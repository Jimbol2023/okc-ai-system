import { phase7KpiRevenueSignalFamilies } from "./phase-7-kpi-revenue-signal-audit";

export const phase7ManualKpiRevenuePolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  kpiPersistenceEnabled: false,
  reportPersistenceEnabled: false,
  metricPersistenceEnabled: false,
  scorePersistenceEnabled: false,
  crmMutationEnabled: false,
  sourceMutationEnabled: false,
  spendChangeEnabled: false,
  marketingChangeEnabled: false,
  taskCreationEnabled: false,
  queueCreationEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  notificationEnabled: false,
  dailyPlanPersistenceEnabled: false,
  auditWritingEnabled: false,
  storageWritingEnabled: false,
  providerActivated: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  automationEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  revenueExecutionEnabled: false,
  phase8ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase7KpiIntelligenceLanes = [
  "stop_measurement_first",
  "data_quality_before_kpi",
  "source_quality_review",
  "human_review_throughput_review",
  "follow_up_leakage_review",
  "seller_conversion_review",
  "pipeline_value_assumption_review",
  "revenue_bottleneck_review",
  "operator_focus_roi_review",
  "monitor_baseline",
  "defer_until_data_matures",
] as const;

export const phase7KpiRevenueSummaryStates = [
  "measurement_blocked",
  "data_quality_gap",
  "source_signal_review",
  "throughput_signal_review",
  "leakage_signal_review",
  "conversion_signal_review",
  "revenue_bottleneck_signal",
  "pipeline_assumption_only",
  "operator_focus_signal",
  "monitor_only",
  "not_ready",
] as const;

export type Phase7KpiIntelligenceLane = (typeof phase7KpiIntelligenceLanes)[number];
export type Phase7KpiRevenueSummaryState = (typeof phase7KpiRevenueSummaryStates)[number];

export type Phase7ManualKpiRevenuePolicy = {
  phase: "Phase 7: KPI & Revenue Intelligence";
  phaseStep: "Phase 7C — Manual KPI & Revenue Intelligence Policy";
  previousStep: "Phase 7B — KPI & Revenue Signal Audit";
  phaseDecision: "manual_policy_only";
  implementationDecision: "not_authorized";
  reportDecision: "not_authorized";
  metricDecision: "not_authorized";
  scoreDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  sourceMutationDecision: "not_authorized";
  spendDecision: "not_authorized";
  marketingDecision: "not_authorized";
  taskDecision: "not_authorized";
  queueDecision: "not_authorized";
  routingDecision: "not_authorized";
  assignmentDecision: "not_authorized";
  notificationDecision: "not_authorized";
  dailyPlanDecision: "not_authorized";
  auditDecision: "not_authorized";
  recommendedNextExactStep: "Phase 7D — KPI & Revenue Intelligence Implementation Scope";
  nextStageRecommendation: "Phase 7D — KPI & Revenue Intelligence Implementation Scope";
  kpiIntelligenceLanes: typeof phase7KpiIntelligenceLanes;
  summaryStates: typeof phase7KpiRevenueSummaryStates;
  signalReferences: typeof phase7KpiRevenueSignalFamilies;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase7ManualKpiRevenuePolicyFlags;
};

export const phase7ManualKpiRevenuePolicyRules = [
  "Phase 7C defines manual KPI intelligence lanes and summary states as review labels only.",
  "Policy output may help a human compare source quality, throughput, leakage, seller conversion, pipeline assumptions, revenue bottlenecks, and operator-focus ROI.",
  "Policy output cannot persist KPIs, reports, metrics, scores, source changes, spend changes, marketing changes, CRM updates, tasks, queues, assignments, notifications, daily plans, audit logs, storage writes, or revenue execution.",
];

export const phase7ManualKpiRevenuePolicyStopRules = [
  "Phase 7C is manual KPI & Revenue Intelligence policy only.",
  "No KPI/report/metric/score persistence, CRM mutation, source mutation, task creation, queue creation, routing, assignment, notification, daily plan persistence, spend change, marketing change, provider activation, outreach, calling, message sending, automation, scraping, skip tracing, revenue execution, Phase 8 implementation, or go-live is authorized.",
];

export const phase7ManualKpiRevenuePolicyAiBoundary = [
  "rank and explain KPI intelligence lanes for human review only",
  "summarize source quality throughput leakage conversion pipeline assumptions bottlenecks and operator-focus ROI",
  "do not persist KPIs reports metrics scores or revenue claims",
  "do not mutate CRM records or source fields",
  "do not change spend or marketing decisions",
  "do not create tasks queues routing assignments notifications or daily plans",
  "do not contact sellers send messages activate providers trigger automation scrape or skip trace",
  "do not execute revenue actions",
  "do not approve implementation",
];

export const phase7ManualKpiRevenuePolicyHumanBoundary = [
  "final KPI interpretation",
  "source judgment",
  "revenue judgment",
  "pipeline value verification",
  "operational adjustment",
  "spend decisions",
  "marketing decisions",
  "future implementation approval",
];

export const phase7ManualKpiRevenuePolicyForbiddenDrift = [
  "KPI persistence",
  "report persistence",
  "metric persistence",
  "score persistence",
  "CRM mutation",
  "source mutation",
  "spend change",
  "marketing change",
  "task creation",
  "queue creation",
  "routing",
  "assignment",
  "notification",
  "daily plan persistence",
  "provider activation",
  "outreach",
  "calling",
  "message sending",
  "automation",
  "scraping",
  "skip tracing",
  "revenue execution",
  "Phase 8 implementation",
  "go-live",
];

export function getPhase7ManualKpiRevenuePolicy(): Phase7ManualKpiRevenuePolicy {
  const result: Phase7ManualKpiRevenuePolicy = {
    phase: "Phase 7: KPI & Revenue Intelligence",
    phaseStep: "Phase 7C — Manual KPI & Revenue Intelligence Policy",
    previousStep: "Phase 7B — KPI & Revenue Signal Audit",
    phaseDecision: "manual_policy_only",
    implementationDecision: "not_authorized",
    reportDecision: "not_authorized",
    metricDecision: "not_authorized",
    scoreDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    sourceMutationDecision: "not_authorized",
    spendDecision: "not_authorized",
    marketingDecision: "not_authorized",
    taskDecision: "not_authorized",
    queueDecision: "not_authorized",
    routingDecision: "not_authorized",
    assignmentDecision: "not_authorized",
    notificationDecision: "not_authorized",
    dailyPlanDecision: "not_authorized",
    auditDecision: "not_authorized",
    recommendedNextExactStep: "Phase 7D — KPI & Revenue Intelligence Implementation Scope",
    nextStageRecommendation: "Phase 7D — KPI & Revenue Intelligence Implementation Scope",
    kpiIntelligenceLanes: phase7KpiIntelligenceLanes,
    summaryStates: phase7KpiRevenueSummaryStates,
    signalReferences: phase7KpiRevenueSignalFamilies,
    policyRules: phase7ManualKpiRevenuePolicyRules,
    stopRules: phase7ManualKpiRevenuePolicyStopRules,
    aiOperatorLeverageBoundary: phase7ManualKpiRevenuePolicyAiBoundary,
    humanOwnershipBoundary: phase7ManualKpiRevenuePolicyHumanBoundary,
    forbiddenDrift: phase7ManualKpiRevenuePolicyForbiddenDrift,
    flags: phase7ManualKpiRevenuePolicyFlags,
  };
  assertPhase7ManualKpiRevenuePolicySafe(result);
  return result;
}

export function assertPhase7ManualKpiRevenuePolicySafe(result: Phase7ManualKpiRevenuePolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.kpiIntelligenceLanes, result.summaryStates].flat().join(" ");
  const unsafePattern = /KPI persistence is authorized|report persistence is authorized|score persistence is authorized|CRM mutation is authorized|source mutation is authorized|spend change is authorized|marketing change is authorized|task creation is authorized|queue creation is authorized|routing is authorized|assignment is authorized|provider activation is authorized|outreach is authorized|calling is authorized|message sending is authorized|scraping is authorized|skip tracing is authorized|revenue execution is authorized|Phase 8 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 7C — Manual KPI & Revenue Intelligence Policy") throw new Error("Phase 7C step must remain pinned.");
  if (result.previousStep !== "Phase 7B — KPI & Revenue Signal Audit") throw new Error("Phase 7C previous step must remain Phase 7B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 7C must remain manual-policy-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 7C decisions must remain not_authorized.");
  if (result.kpiIntelligenceLanes.join("|") !== phase7KpiIntelligenceLanes.join("|")) throw new Error("Phase 7C must include all KPI intelligence lanes.");
  if (result.summaryStates.join("|") !== phase7KpiRevenueSummaryStates.join("|")) throw new Error("Phase 7C must include all summary states.");
  if (result.signalReferences.join("|") !== phase7KpiRevenueSignalFamilies.join("|")) throw new Error("Phase 7C must preserve signal references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 7C blocked flags cannot turn true.");
  if (!/review labels only/i.test(result.policyRules.join(" ")) || !/operator-focus ROI/i.test(result.policyRules.join(" "))) throw new Error("Phase 7C policy rules are missing.");
  if (!/policy only/i.test(result.stopRules.join(" ")) || !/No KPI\/report\/metric\/score persistence/i.test(result.stopRules.join(" "))) throw new Error("Phase 7C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not persist KPIs/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 7C AI boundary is missing.");
  if (!/final KPI interpretation/i.test(result.humanOwnershipBoundary.join(" ")) || !/spend decisions/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 7C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 7D — KPI & Revenue Intelligence Implementation Scope") throw new Error("Phase 7C must hand off to Phase 7D.");
  if (unsafePattern.test(text)) throw new Error("Phase 7C wording must not imply unsafe authorization.");
}

export function getPhase7ManualKpiRevenuePolicySummary() {
  const result = getPhase7ManualKpiRevenuePolicy();
  return `${result.phase} / ${result.phaseStep}: manual KPI intelligence lanes and summary states for highest acquisition ROI per operator hour. Human-owned KPI interpretation, source judgment, revenue judgment, and spend decisions remain required. No KPI persistence, no score persistence, no CRM mutation, no spend change, no marketing change, no outreach, no automation, no revenue execution, and no Phase 8 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
