import { phase7MinimalKpiRevenueGateLanes } from "./phase-7-minimal-kpi-revenue-gate";

export const phase7KpiRevenueFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
  operatorLeverageOnly: true,
  phase7LockdownEnforced: true,
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

export type Phase7KpiRevenueFinalLockdown = {
  phase: "Phase 7: KPI & Revenue Intelligence";
  phaseStep: "Phase 7F — KPI & Revenue Final Lockdown";
  previousStep: "Phase 7E — Minimal KPI & Revenue Intelligence Gate";
  phaseDecision: "final_lockdown_only";
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
  recommendedNextExactStep: "Phase 8 — Deal Quality Intelligence";
  nextStageRecommendation: "Phase 8 — Deal Quality Intelligence";
  finalLockdownRules: string[];
  phase7eGateReferences: typeof phase7MinimalKpiRevenueGateLanes;
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase7KpiRevenueFinalLockdownFlags;
};

export const phase7KpiRevenueFinalLockdownRules = [
  "Phase 7F locks Phase 7 as read-only KPI & Revenue Intelligence planning only.",
  "Phase 7F authorizes no implementation, KPI persistence, report persistence, metric persistence, score persistence, CRM mutation, source mutation, spend change, marketing change, task creation, queue creation, routing, assignment, notification, daily plan persistence, provider activation, outreach, calling, message sending, audit writing, storage writing, automation, scraping, skip tracing, autonomous lead creation, revenue execution, Phase 8 implementation, or go-live.",
  "Phase 7F can recommend Phase 8 — Deal Quality Intelligence as the next roadmap phase only after human review.",
];

export const phase7KpiRevenueFinalLockdownAiBoundary = [
  "summarize Phase 7 closeout for human review only",
  "summarize Phase 7A through Phase 7E continuity",
  "prepare Phase 8 transition notes for human review",
  "do not persist KPI reports metrics scores or revenue claims",
  "do not mutate CRM records or source fields",
  "do not change spend or marketing decisions",
  "do not create tasks queues routing assignments notifications or daily plans",
  "do not send messages call sellers activate providers trigger automation scrape or skip trace",
  "do not execute revenue actions",
  "do not approve Phase 8 implementation",
  "do not authorize go-live",
];

export const phase7KpiRevenueFinalLockdownHumanBoundary = [
  "Phase 7 closeout approval",
  "Phase 8 transition approval",
  "KPI interpretation",
  "source judgment",
  "revenue judgment",
  "pipeline value verification",
  "operational adjustment",
  "spend decisions",
  "marketing decisions",
  "future implementation approval",
];

export const phase7KpiRevenueFinalLockdownForbiddenDrift = [
  "implementation",
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

export function getPhase7KpiRevenueFinalLockdown(): Phase7KpiRevenueFinalLockdown {
  const result: Phase7KpiRevenueFinalLockdown = {
    phase: "Phase 7: KPI & Revenue Intelligence",
    phaseStep: "Phase 7F — KPI & Revenue Final Lockdown",
    previousStep: "Phase 7E — Minimal KPI & Revenue Intelligence Gate",
    phaseDecision: "final_lockdown_only",
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
    recommendedNextExactStep: "Phase 8 — Deal Quality Intelligence",
    nextStageRecommendation: "Phase 8 — Deal Quality Intelligence",
    finalLockdownRules: phase7KpiRevenueFinalLockdownRules,
    phase7eGateReferences: phase7MinimalKpiRevenueGateLanes,
    aiOperatorLeverageBoundary: phase7KpiRevenueFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase7KpiRevenueFinalLockdownHumanBoundary,
    forbiddenDrift: phase7KpiRevenueFinalLockdownForbiddenDrift,
    flags: phase7KpiRevenueFinalLockdownFlags,
  };
  assertPhase7KpiRevenueFinalLockdownSafe(result);
  return result;
}

export function assertPhase7KpiRevenueFinalLockdownSafe(result: Phase7KpiRevenueFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly", "phase7LockdownEnforced"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.finalLockdownRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|KPI persistence is authorized|report persistence is authorized|score persistence is authorized|CRM mutation is authorized|source mutation is authorized|spend change is authorized|marketing change is authorized|task creation is authorized|queue creation is authorized|routing is authorized|assignment is authorized|provider activation is authorized|outreach is authorized|calling is authorized|message sending is authorized|audit writing is authorized|storage writing is authorized|scraping is authorized|skip tracing is authorized|revenue execution is authorized|Phase 8 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 7: KPI & Revenue Intelligence") throw new Error("Phase 7F phase must remain pinned.");
  if (result.phaseStep !== "Phase 7F — KPI & Revenue Final Lockdown") throw new Error("Phase 7F step must remain pinned.");
  if (result.previousStep !== "Phase 7E — Minimal KPI & Revenue Intelligence Gate") throw new Error("Phase 7F previous step must remain Phase 7E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 7F must remain final-lockdown-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 7F decisions must remain not_authorized.");
  if (result.phase7eGateReferences.join("|") !== phase7MinimalKpiRevenueGateLanes.join("|")) throw new Error("Phase 7F must preserve Phase 7E gate references.");
  if (unsafeTrue.length > 0 || !result.flags.phase7LockdownEnforced) throw new Error("Phase 7F blocked flags cannot turn true and lockdown must stay enforced.");
  if (!/locks Phase 7/i.test(text) || !/authorizes no implementation/i.test(text) || !/Phase 8 — Deal Quality Intelligence/i.test(text)) throw new Error("Phase 7F final lockdown rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not approve Phase 8 implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 7F AI boundary is missing.");
  if (!/Phase 7 closeout approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/Phase 8 transition approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 7F human boundary is missing.");
  if (!/KPI persistence/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 7F forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 8 — Deal Quality Intelligence") throw new Error("Phase 7F must recommend Phase 8.");
  if (unsafePattern.test(text)) throw new Error("Phase 7F wording must not imply unsafe authorization.");
}

export function getPhase7KpiRevenueFinalLockdownSummary() {
  const result = getPhase7KpiRevenueFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: final lockdown for read-only KPI & Revenue Intelligence planning with human-owned KPI interpretation, source judgment, revenue judgment, operational adjustment, spend decisions, and future implementation approval. No KPI persistence, no report persistence, no score persistence, no CRM mutation, no spend change, no marketing change, no outreach, no automation, no revenue execution, no Phase 8 implementation, and no go-live are authorized. Next stage: ${result.nextStageRecommendation}.`;
}
