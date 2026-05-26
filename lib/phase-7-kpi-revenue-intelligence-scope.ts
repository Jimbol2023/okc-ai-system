import {
  phase6CommandCenterFinalLockdownFlags,
  phase6CommandCenterFinalLockdownRules,
} from "./phase-6-command-center-final-lockdown";

export const phase7KpiRevenueIntelligenceScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  operatorLeverageOnly: true,
  scopeOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  automationEnabled: false,
  communicationEnabled: false,
  crmMutationEnabled: false,
  schemaChangeEnabled: false,
  storageMutationEnabled: false,
  runtimeJobsEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  taskCreationEnabled: false,
  queueCreationEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  reminderCreationEnabled: false,
  calendarCreationEnabled: false,
  notificationEnabled: false,
  dailyPlanPersistenceEnabled: false,
  auditWritingEnabled: false,
  reportPersistenceEnabled: false,
  metricPersistenceEnabled: false,
  scorePersistenceEnabled: false,
  sourceMutationEnabled: false,
  spendChangeEnabled: false,
  marketingChangeEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  revenueExecutionEnabled: false,
  phase8ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase7Decision = "not_authorized";

export type Phase7KpiRevenueIntelligenceScope = {
  phase: "Phase 7: KPI & Revenue Intelligence";
  phaseStep: "Phase 7A — KPI & Revenue Intelligence Scope";
  previousStep: "Phase 6F — Command Center Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_kpi_interpretation_source_judgment_revenue_judgment_operational_adjustment_spend_decisions_execution_owner";
  implementationDecision: Phase7Decision;
  providerDecision: Phase7Decision;
  automationDecision: Phase7Decision;
  communicationDecision: Phase7Decision;
  crmMutationDecision: Phase7Decision;
  schemaDecision: Phase7Decision;
  storageDecision: Phase7Decision;
  runtimeDecision: Phase7Decision;
  outreachDecision: Phase7Decision;
  callingDecision: Phase7Decision;
  messageSendingDecision: Phase7Decision;
  taskDecision: Phase7Decision;
  queueDecision: Phase7Decision;
  routingDecision: Phase7Decision;
  assignmentDecision: Phase7Decision;
  reminderDecision: Phase7Decision;
  calendarDecision: Phase7Decision;
  notificationDecision: Phase7Decision;
  dailyPlanDecision: Phase7Decision;
  auditDecision: Phase7Decision;
  reportDecision: Phase7Decision;
  metricDecision: Phase7Decision;
  scoreDecision: Phase7Decision;
  spendDecision: Phase7Decision;
  marketingDecision: Phase7Decision;
  recommendedNextExactStep: "Phase 7B — KPI & Revenue Signal Audit";
  nextStageRecommendation: "Phase 7B — KPI & Revenue Signal Audit";
  phase6FinalLockdownReference: {
    flags: typeof phase6CommandCenterFinalLockdownFlags;
    rules: typeof phase6CommandCenterFinalLockdownRules;
  };
  scopePurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase7KpiRevenueIntelligenceScopeFlags;
};

export const phase7KpiRevenuePurpose = [
  "Define read-only KPI & Revenue Intelligence planning for highest acquisition ROI per operator hour.",
  "Summarize KPI patterns, source quality, throughput, follow-up leakage, seller conversion, revenue bottlenecks, and operator-focus ROI for human review only.",
  "Keep all pipeline value and revenue claims assumption-labeled unless verified by the human operator.",
];

export const phase7KpiRevenueStopRules = [
  "Phase 7A is scope only.",
  "No KPI persistence, report persistence, score persistence, CRM mutation, source mutation, spend change, marketing change, task creation, queue creation, routing, assignment, reminder creation, calendar creation, notification, daily plan persistence, provider activation, outreach, calling, message sending, audit writing, storage writing, automation, scraping, skip tracing, autonomous lead creation, revenue execution, Phase 8 implementation, or go-live is authorized.",
];

export const phase7KpiRevenueAiBoundary = [
  "summarize KPI and revenue patterns for human review only",
  "surface source quality throughput leakage conversion bottleneck and operator-focus signals",
  "label pipeline value and revenue claims as assumptions unless human verified",
  "do not persist KPIs reports metrics scores or revenue claims",
  "do not mutate CRM records or lead sources",
  "do not create tasks queues routes assignments reminders calendar items notifications or daily plans",
  "do not change spend or marketing decisions",
  "do not contact or call sellers",
  "do not send messages",
  "do not activate providers or automation",
  "do not write storage or audit logs",
  "do not scrape or skip trace",
  "do not create leads autonomously",
  "do not execute revenue actions",
  "do not approve Phase 8 implementation or go-live",
];

export const phase7KpiRevenueHumanBoundary = [
  "final KPI interpretation",
  "source judgment",
  "revenue judgment",
  "pipeline value verification",
  "operational adjustment",
  "spend decisions",
  "marketing decisions",
  "seller communication",
  "manual execution",
  "future implementation approval",
];

export const phase7KpiRevenueForbiddenDrift = [
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
  "reminder creation",
  "calendar creation",
  "notification",
  "daily plan persistence",
  "provider activation",
  "outreach",
  "calling",
  "message sending",
  "audit writing",
  "storage writing",
  "automation",
  "scraping",
  "skip tracing",
  "autonomous lead creation",
  "revenue execution",
  "Phase 8 implementation",
  "go-live",
];

export function getPhase7KpiRevenueIntelligenceScope(): Phase7KpiRevenueIntelligenceScope {
  const result: Phase7KpiRevenueIntelligenceScope = {
    phase: "Phase 7: KPI & Revenue Intelligence",
    phaseStep: "Phase 7A — KPI & Revenue Intelligence Scope",
    previousStep: "Phase 6F — Command Center Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "final_kpi_interpretation_source_judgment_revenue_judgment_operational_adjustment_spend_decisions_execution_owner",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    storageDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callingDecision: "not_authorized",
    messageSendingDecision: "not_authorized",
    taskDecision: "not_authorized",
    queueDecision: "not_authorized",
    routingDecision: "not_authorized",
    assignmentDecision: "not_authorized",
    reminderDecision: "not_authorized",
    calendarDecision: "not_authorized",
    notificationDecision: "not_authorized",
    dailyPlanDecision: "not_authorized",
    auditDecision: "not_authorized",
    reportDecision: "not_authorized",
    metricDecision: "not_authorized",
    scoreDecision: "not_authorized",
    spendDecision: "not_authorized",
    marketingDecision: "not_authorized",
    recommendedNextExactStep: "Phase 7B — KPI & Revenue Signal Audit",
    nextStageRecommendation: "Phase 7B — KPI & Revenue Signal Audit",
    phase6FinalLockdownReference: {
      flags: phase6CommandCenterFinalLockdownFlags,
      rules: phase6CommandCenterFinalLockdownRules,
    },
    scopePurpose: phase7KpiRevenuePurpose,
    stopRules: phase7KpiRevenueStopRules,
    aiOperatorLeverageBoundary: phase7KpiRevenueAiBoundary,
    humanOwnershipBoundary: phase7KpiRevenueHumanBoundary,
    forbiddenDrift: phase7KpiRevenueForbiddenDrift,
    flags: phase7KpiRevenueIntelligenceScopeFlags,
  };
  assertPhase7KpiRevenueIntelligenceScopeSafe(result);
  return result;
}

export function assertPhase7KpiRevenueIntelligenceScopeSafe(result: Phase7KpiRevenueIntelligenceScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "operatorLeverageOnly", "scopeOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopePurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /KPI persistence is authorized|report persistence is authorized|score persistence is authorized|CRM mutation is authorized|source mutation is authorized|spend change is authorized|marketing change is authorized|task creation is authorized|queue creation is authorized|routing is authorized|assignment is authorized|provider activation is authorized|outreach is authorized|calling is authorized|message sending is authorized|audit writing is authorized|storage writing is authorized|scraping is authorized|skip tracing is authorized|autonomous lead creation is authorized|revenue execution is authorized|Phase 8 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 7: KPI & Revenue Intelligence") throw new Error("Phase 7A phase must remain pinned.");
  if (result.phaseStep !== "Phase 7A — KPI & Revenue Intelligence Scope") throw new Error("Phase 7A step must remain pinned.");
  if (result.previousStep !== "Phase 6F — Command Center Final Lockdown") throw new Error("Phase 7A previous step must remain Phase 6F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 7A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 7A must remain scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 7A decisions must remain not_authorized.");
  if (result.phase6FinalLockdownReference.rules.join("|") !== phase6CommandCenterFinalLockdownRules.join("|")) throw new Error("Phase 7A must preserve Phase 6F final lockdown reference.");
  if (unsafeTrue.length > 0) throw new Error("Phase 7A blocked flags cannot turn true.");
  if (!/No KPI persistence/i.test(result.stopRules.join(" ")) || !/Phase 8 implementation/i.test(result.stopRules.join(" "))) throw new Error("Phase 7A stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not persist KPIs/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 7A AI boundary is missing.");
  if (!/final KPI interpretation/i.test(result.humanOwnershipBoundary.join(" ")) || !/source judgment/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 7A human boundary is missing.");
  if (!/KPI persistence/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 7A forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 7B — KPI & Revenue Signal Audit") throw new Error("Phase 7A must hand off to Phase 7B.");
  if (unsafePattern.test(text)) throw new Error("Phase 7A wording must not imply unsafe authorization.");
}

export function getPhase7KpiRevenueIntelligenceScopeSummary() {
  const result = getPhase7KpiRevenueIntelligenceScope();
  return `${result.phase} / ${result.phaseStep}: read-only KPI & Revenue Intelligence scope for highest acquisition ROI per operator hour with human-owned KPI interpretation, source judgment, revenue judgment, operational adjustment, and spend decisions. No KPI persistence, no report persistence, no score persistence, no CRM mutation, no outreach, no automation, no revenue execution, no Phase 8 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
