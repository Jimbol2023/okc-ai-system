import { phase7KpiIntelligenceLanes, phase7KpiRevenueSummaryStates } from "./phase-7-manual-kpi-revenue-policy";

export const phase7KpiRevenueImplementationScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  implementationScopeOnly: true,
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

export type Phase7KpiRevenueImplementationLane =
  | "candidate_readonly_kpi_visibility"
  | "candidate_source_quality_visibility"
  | "candidate_revenue_bottleneck_visibility"
  | "candidate_assumption_labeled_pipeline_visibility"
  | "blocked_execution_persistence_and_spend_paths"
  | "phase_7e_gate_requirements";

export const phase7KpiRevenueImplementationLanes: Phase7KpiRevenueImplementationLane[] = [
  "candidate_readonly_kpi_visibility",
  "candidate_source_quality_visibility",
  "candidate_revenue_bottleneck_visibility",
  "candidate_assumption_labeled_pipeline_visibility",
  "blocked_execution_persistence_and_spend_paths",
  "phase_7e_gate_requirements",
];

export type Phase7KpiRevenueImplementationScope = {
  phase: "Phase 7: KPI & Revenue Intelligence";
  phaseStep: "Phase 7D — KPI & Revenue Intelligence Implementation Scope";
  previousStep: "Phase 7C — Manual KPI & Revenue Intelligence Policy";
  phaseDecision: "implementation_scope_only";
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
  recommendedNextExactStep: "Phase 7E — Minimal KPI & Revenue Intelligence Gate";
  nextStageRecommendation: "Phase 7E — Minimal KPI & Revenue Intelligence Gate";
  implementationScopeLanes: Phase7KpiRevenueImplementationLane[];
  kpiLaneReferences: typeof phase7KpiIntelligenceLanes;
  summaryStateReferences: typeof phase7KpiRevenueSummaryStates;
  scopeRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase7KpiRevenueImplementationScopeFlags;
};

export const phase7KpiRevenueImplementationScopeRules = [
  "Phase 7D scopes possible future read-only KPI and revenue visibility only.",
  "No implementation execution, KPI persistence, report persistence, metric persistence, score persistence, CRM mutation, source mutation, spend change, marketing change, task creation, queue creation, routing, assignment, notification, daily plan persistence, provider activation, outreach, calling, message sending, audit writing, storage writing, automation, scraping, skip tracing, revenue execution, Phase 8 implementation, or go-live is authorized.",
  "Any future build must keep pipeline value and revenue claims assumption-labeled until human verification.",
];

export const phase7KpiRevenueImplementationScopeStopRules = [
  "Phase 7D is implementation scope only, not implementation execution.",
  "Candidate work cannot create UI, routes, APIs, schema, storage writes, audit writes, KPI records, report records, score records, source mutations, CRM writes, tasks, queues, routing, assignments, notifications, daily plans, spend changes, marketing changes, messages, calls, providers, runtime jobs, or revenue execution.",
];

export const phase7KpiRevenueImplementationScopeAiBoundary = [
  "explain future read-only KPI and revenue visibility scope for human review only",
  "map KPI lanes and summary states to candidate internal review surfaces",
  "do not implement UI routes APIs schema storage audit KPI report score source or CRM writes",
  "do not create tasks queues routing assignments notifications or daily plans",
  "do not change spend or marketing decisions",
  "do not send messages call sellers activate providers or trigger automation",
  "do not scrape or skip trace",
  "do not execute revenue actions",
  "do not approve implementation",
];

export const phase7KpiRevenueImplementationScopeHumanBoundary = [
  "final implementation approval",
  "KPI interpretation",
  "source judgment",
  "revenue judgment",
  "pipeline value verification",
  "operational adjustment",
  "spend decisions",
  "marketing decisions",
  "future Phase 8 transition approval",
];

export function getPhase7KpiRevenueImplementationScope(): Phase7KpiRevenueImplementationScope {
  const result: Phase7KpiRevenueImplementationScope = {
    phase: "Phase 7: KPI & Revenue Intelligence",
    phaseStep: "Phase 7D — KPI & Revenue Intelligence Implementation Scope",
    previousStep: "Phase 7C — Manual KPI & Revenue Intelligence Policy",
    phaseDecision: "implementation_scope_only",
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
    recommendedNextExactStep: "Phase 7E — Minimal KPI & Revenue Intelligence Gate",
    nextStageRecommendation: "Phase 7E — Minimal KPI & Revenue Intelligence Gate",
    implementationScopeLanes: phase7KpiRevenueImplementationLanes,
    kpiLaneReferences: phase7KpiIntelligenceLanes,
    summaryStateReferences: phase7KpiRevenueSummaryStates,
    scopeRules: phase7KpiRevenueImplementationScopeRules,
    stopRules: phase7KpiRevenueImplementationScopeStopRules,
    aiOperatorLeverageBoundary: phase7KpiRevenueImplementationScopeAiBoundary,
    humanOwnershipBoundary: phase7KpiRevenueImplementationScopeHumanBoundary,
    forbiddenDrift: phase7KpiRevenueImplementationScopeRules,
    flags: phase7KpiRevenueImplementationScopeFlags,
  };
  assertPhase7KpiRevenueImplementationScopeSafe(result);
  return result;
}

export function assertPhase7KpiRevenueImplementationScopeSafe(result: Phase7KpiRevenueImplementationScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "implementationScopeOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.implementationScopeLanes].flat().join(" ");
  const unsafePattern = /implementation execution is authorized|KPI persistence is authorized|report persistence is authorized|score persistence is authorized|CRM mutation is authorized|source mutation is authorized|spend change is authorized|marketing change is authorized|task creation is authorized|queue creation is authorized|routing is authorized|assignment is authorized|provider activation is authorized|outreach is authorized|calling is authorized|message sending is authorized|audit writing is authorized|storage writing is authorized|scraping is authorized|skip tracing is authorized|revenue execution is authorized|Phase 8 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 7D — KPI & Revenue Intelligence Implementation Scope") throw new Error("Phase 7D step must remain pinned.");
  if (result.previousStep !== "Phase 7C — Manual KPI & Revenue Intelligence Policy") throw new Error("Phase 7D previous step must remain Phase 7C.");
  if (result.phaseDecision !== "implementation_scope_only") throw new Error("Phase 7D must remain implementation-scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 7D decisions must remain not_authorized.");
  if (result.implementationScopeLanes.join("|") !== phase7KpiRevenueImplementationLanes.join("|")) throw new Error("Phase 7D must include all implementation scope lanes.");
  if (result.kpiLaneReferences.join("|") !== phase7KpiIntelligenceLanes.join("|")) throw new Error("Phase 7D must preserve KPI lane references.");
  if (result.summaryStateReferences.join("|") !== phase7KpiRevenueSummaryStates.join("|")) throw new Error("Phase 7D must preserve summary state references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 7D blocked flags cannot turn true.");
  if (!/No implementation execution/i.test(result.scopeRules.join(" ")) || !/score persistence/i.test(result.scopeRules.join(" "))) throw new Error("Phase 7D scope rules are missing.");
  if (!/implementation scope only/i.test(result.stopRules.join(" ")) || !/KPI records/i.test(result.stopRules.join(" "))) throw new Error("Phase 7D stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement UI routes APIs schema storage audit KPI report score source or CRM writes/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 7D AI boundary is missing.");
  if (!/final implementation approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/KPI interpretation/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 7D human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 7E — Minimal KPI & Revenue Intelligence Gate") throw new Error("Phase 7D must hand off to Phase 7E.");
  if (unsafePattern.test(text)) throw new Error("Phase 7D wording must not imply unsafe authorization.");
}

export function getPhase7KpiRevenueImplementationScopeSummary() {
  const result = getPhase7KpiRevenueImplementationScope();
  return `${result.phase} / ${result.phaseStep}: scopes possible future read-only KPI and revenue visibility for highest acquisition ROI per operator hour with human-owned KPI interpretation, source judgment, revenue judgment, and implementation approval. No implementation execution, no KPI persistence, no report persistence, no score persistence, no CRM mutation, no spend change, no marketing change, no revenue execution, no Phase 8 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
