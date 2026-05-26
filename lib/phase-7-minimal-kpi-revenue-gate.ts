import { phase7KpiRevenueImplementationLanes } from "./phase-7-kpi-revenue-implementation-scope";

export const phase7MinimalKpiRevenueGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  gateOnly: true,
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

export type Phase7MinimalKpiRevenueGateLane =
  | "minimal_readonly_kpi_package"
  | "human_revenue_claim_review"
  | "source_quality_confidence_review"
  | "operator_roi_usefulness_review"
  | "blocked_persistence_execution_spend_paths"
  | "phase_7f_lockdown_requirements";

export const phase7MinimalKpiRevenueGateLanes: Phase7MinimalKpiRevenueGateLane[] = [
  "minimal_readonly_kpi_package",
  "human_revenue_claim_review",
  "source_quality_confidence_review",
  "operator_roi_usefulness_review",
  "blocked_persistence_execution_spend_paths",
  "phase_7f_lockdown_requirements",
];

export type Phase7MinimalKpiRevenueGate = {
  phase: "Phase 7: KPI & Revenue Intelligence";
  phaseStep: "Phase 7E — Minimal KPI & Revenue Intelligence Gate";
  previousStep: "Phase 7D — KPI & Revenue Intelligence Implementation Scope";
  phaseDecision: "minimal_gate_only";
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
  recommendedNextExactStep: "Phase 7F — KPI & Revenue Final Lockdown";
  nextStageRecommendation: "Phase 7F — KPI & Revenue Final Lockdown";
  gateLanes: Phase7MinimalKpiRevenueGateLane[];
  implementationScopeReferences: typeof phase7KpiRevenueImplementationLanes;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase7MinimalKpiRevenueGateFlags;
};

export const phase7MinimalKpiRevenueGateRules = [
  "Phase 7E gates whether a minimal read-only KPI package is worth considering later.",
  "The gate requires human review of revenue claims, source quality confidence, and operator ROI usefulness before any future build is considered.",
  "The gate cannot authorize KPI persistence, report persistence, metric persistence, score persistence, CRM mutation, source mutation, spend change, marketing change, execution, providers, outreach, automation, or go-live.",
];

export const phase7MinimalKpiRevenueGateStopRules = [
  "Phase 7E is a minimal gate only.",
  "No implementation, KPI persistence, report persistence, metric persistence, score persistence, CRM mutation, source mutation, task creation, queue creation, routing, assignment, notification, daily plan persistence, spend change, marketing change, audit writing, storage writing, provider activation, outreach, calling, message sending, automation, scraping, skip tracing, revenue execution, Phase 8 implementation, or go-live is authorized.",
];

export const phase7MinimalKpiRevenueGateAiBoundary = [
  "summarize minimal KPI gate readiness for human review only",
  "explain whether KPI visibility would improve operator ROI clarity",
  "do not persist KPI reports metrics scores or revenue claims",
  "do not mutate CRM records or source fields",
  "do not change spend or marketing decisions",
  "do not create tasks queues routing assignments notifications or daily plans",
  "do not activate providers send messages call sellers scrape skip trace automate or execute revenue actions",
  "do not approve implementation",
];

export const phase7MinimalKpiRevenueGateHumanBoundary = [
  "minimal KPI gate approval",
  "revenue claim review",
  "source quality confidence judgment",
  "operator ROI usefulness judgment",
  "spend decisions",
  "marketing decisions",
  "future implementation approval",
];

export function getPhase7MinimalKpiRevenueGate(): Phase7MinimalKpiRevenueGate {
  const result: Phase7MinimalKpiRevenueGate = {
    phase: "Phase 7: KPI & Revenue Intelligence",
    phaseStep: "Phase 7E — Minimal KPI & Revenue Intelligence Gate",
    previousStep: "Phase 7D — KPI & Revenue Intelligence Implementation Scope",
    phaseDecision: "minimal_gate_only",
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
    recommendedNextExactStep: "Phase 7F — KPI & Revenue Final Lockdown",
    nextStageRecommendation: "Phase 7F — KPI & Revenue Final Lockdown",
    gateLanes: phase7MinimalKpiRevenueGateLanes,
    implementationScopeReferences: phase7KpiRevenueImplementationLanes,
    gateRules: phase7MinimalKpiRevenueGateRules,
    stopRules: phase7MinimalKpiRevenueGateStopRules,
    aiOperatorLeverageBoundary: phase7MinimalKpiRevenueGateAiBoundary,
    humanOwnershipBoundary: phase7MinimalKpiRevenueGateHumanBoundary,
    forbiddenDrift: phase7MinimalKpiRevenueGateStopRules,
    flags: phase7MinimalKpiRevenueGateFlags,
  };
  assertPhase7MinimalKpiRevenueGateSafe(result);
  return result;
}

export function assertPhase7MinimalKpiRevenueGateSafe(result: Phase7MinimalKpiRevenueGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "gateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateLanes].flat().join(" ");
  const unsafePattern = /implementation is authorized|KPI persistence is authorized|report persistence is authorized|score persistence is authorized|CRM mutation is authorized|source mutation is authorized|spend change is authorized|marketing change is authorized|task creation is authorized|queue creation is authorized|routing is authorized|assignment is authorized|provider activation is authorized|outreach is authorized|calling is authorized|message sending is authorized|audit writing is authorized|storage writing is authorized|scraping is authorized|skip tracing is authorized|revenue execution is authorized|Phase 8 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 7E — Minimal KPI & Revenue Intelligence Gate") throw new Error("Phase 7E step must remain pinned.");
  if (result.previousStep !== "Phase 7D — KPI & Revenue Intelligence Implementation Scope") throw new Error("Phase 7E previous step must remain Phase 7D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 7E must remain minimal-gate-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 7E decisions must remain not_authorized.");
  if (result.gateLanes.join("|") !== phase7MinimalKpiRevenueGateLanes.join("|")) throw new Error("Phase 7E must include all gate lanes.");
  if (result.implementationScopeReferences.join("|") !== phase7KpiRevenueImplementationLanes.join("|")) throw new Error("Phase 7E must preserve implementation scope references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 7E blocked flags cannot turn true.");
  if (!/minimal read-only KPI package/i.test(result.gateRules.join(" ")) || !/cannot authorize KPI persistence/i.test(result.gateRules.join(" "))) throw new Error("Phase 7E gate rules are missing.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 7E stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not persist KPI/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 7E AI boundary is missing.");
  if (!/minimal KPI gate approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/revenue claim review/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 7E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 7F — KPI & Revenue Final Lockdown") throw new Error("Phase 7E must hand off to Phase 7F.");
  if (unsafePattern.test(text)) throw new Error("Phase 7E wording must not imply unsafe authorization.");
}

export function getPhase7MinimalKpiRevenueGateSummary() {
  const result = getPhase7MinimalKpiRevenueGate();
  return `${result.phase} / ${result.phaseStep}: minimal KPI & Revenue Intelligence gate for highest acquisition ROI per operator hour with human-owned revenue claim review, source quality judgment, and operator ROI usefulness judgment. No KPI persistence, no CRM mutation, no spend change, no marketing change, no outreach, no automation, no revenue execution, no Phase 8 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
