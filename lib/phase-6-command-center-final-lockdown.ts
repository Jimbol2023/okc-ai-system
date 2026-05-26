import { phase6MinimalCommandCenterGateLanes } from "./phase-6-minimal-command-center-gate";

export const phase6CommandCenterFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
  operatorLeverageOnly: true,
  phase6LockdownEnforced: true,
  implementationAuthorized: false,
  providerActivated: false,
  automationEnabled: false,
  communicationEnabled: false,
  crmMutationEnabled: false,
  taskCreationEnabled: false,
  queueCreationEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  reminderCreationEnabled: false,
  calendarCreationEnabled: false,
  notificationEnabled: false,
  dailyPlanPersistenceEnabled: false,
  auditWritingEnabled: false,
  storageWritingEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  revenueExecutionEnabled: false,
  phase7ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase6CommandCenterFinalLockdown = {
  phase: "Phase 6: Daily Acquisition Command Center";
  phaseStep: "Phase 6F — Command Center Final Lockdown";
  previousStep: "Phase 6E — Minimal Command Center Gate";
  phaseDecision: "final_lockdown_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  taskDecision: "not_authorized";
  queueDecision: "not_authorized";
  routingDecision: "not_authorized";
  assignmentDecision: "not_authorized";
  reminderDecision: "not_authorized";
  calendarDecision: "not_authorized";
  notificationDecision: "not_authorized";
  dailyPlanDecision: "not_authorized";
  auditDecision: "not_authorized";
  recommendedNextExactStep: "Phase 7 — KPI & Revenue Intelligence";
  nextStageRecommendation: "Phase 7 — KPI & Revenue Intelligence";
  finalLockdownRules: string[];
  phase6eGateReferences: typeof phase6MinimalCommandCenterGateLanes;
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase6CommandCenterFinalLockdownFlags;
};

export const phase6CommandCenterFinalLockdownRules = [
  "Phase 6F locks Phase 6 as read-only Daily Acquisition Command Center planning only.",
  "Phase 6F authorizes no implementation, task creation, queue creation, routing, assignment, reminder creation, calendar creation, notification, daily plan persistence, CRM mutation, provider activation, outreach, calling, message sending, audit writing, storage writing, automation, scraping, skip tracing, revenue execution, Phase 7 implementation, or go-live.",
  "Phase 6F can recommend Phase 7 — KPI & Revenue Intelligence as the next roadmap phase only after human review.",
];

export const phase6CommandCenterFinalLockdownAiBoundary = [
  "summarize Phase 6 closeout for human review only",
  "summarize Phase 6A through Phase 6E continuity",
  "prepare Phase 7 transition notes for human review",
  "do not create tasks queues routing assignments reminders calendar items notifications or daily plans",
  "do not mutate CRM records or write storage or audit logs",
  "do not send messages call sellers activate providers or trigger automation",
  "do not scrape or skip trace",
  "do not execute revenue actions",
  "do not approve Phase 7 implementation",
  "do not authorize go-live",
];

export const phase6CommandCenterFinalLockdownHumanBoundary = [
  "Phase 6 closeout approval",
  "Phase 7 transition approval",
  "daily work selection",
  "operator prioritization",
  "seller communication",
  "task ownership",
  "manual execution",
  "CRM approval",
  "future implementation approval",
];

export const phase6CommandCenterFinalLockdownForbiddenDrift = [
  "implementation",
  "task creation",
  "queue creation",
  "routing",
  "assignment",
  "reminder creation",
  "calendar creation",
  "notification",
  "daily plan persistence",
  "CRM mutation",
  "provider activation",
  "outreach",
  "calling",
  "message sending",
  "audit writing",
  "storage writing",
  "automation",
  "scraping",
  "skip tracing",
  "revenue execution",
  "Phase 7 implementation",
  "go-live",
];

export function getPhase6CommandCenterFinalLockdown(): Phase6CommandCenterFinalLockdown {
  const result: Phase6CommandCenterFinalLockdown = {
    phase: "Phase 6: Daily Acquisition Command Center",
    phaseStep: "Phase 6F — Command Center Final Lockdown",
    previousStep: "Phase 6E — Minimal Command Center Gate",
    phaseDecision: "final_lockdown_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    taskDecision: "not_authorized",
    queueDecision: "not_authorized",
    routingDecision: "not_authorized",
    assignmentDecision: "not_authorized",
    reminderDecision: "not_authorized",
    calendarDecision: "not_authorized",
    notificationDecision: "not_authorized",
    dailyPlanDecision: "not_authorized",
    auditDecision: "not_authorized",
    recommendedNextExactStep: "Phase 7 — KPI & Revenue Intelligence",
    nextStageRecommendation: "Phase 7 — KPI & Revenue Intelligence",
    finalLockdownRules: phase6CommandCenterFinalLockdownRules,
    phase6eGateReferences: phase6MinimalCommandCenterGateLanes,
    aiOperatorLeverageBoundary: phase6CommandCenterFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase6CommandCenterFinalLockdownHumanBoundary,
    forbiddenDrift: phase6CommandCenterFinalLockdownForbiddenDrift,
    flags: phase6CommandCenterFinalLockdownFlags,
  };
  assertPhase6CommandCenterFinalLockdownSafe(result);
  return result;
}

export function assertPhase6CommandCenterFinalLockdownSafe(result: Phase6CommandCenterFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly", "phase6LockdownEnforced"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.finalLockdownRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|task creation is authorized|queue creation is authorized|routing is authorized|assignment is authorized|reminder creation is authorized|calendar creation is authorized|notification is authorized|daily plan persistence is authorized|CRM mutation is authorized|provider activation is authorized|outreach is authorized|calling is authorized|message sending is authorized|audit writing is authorized|storage writing is authorized|automation is authorized|scraping is authorized|skip tracing is authorized|revenue execution is authorized|Phase 7 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 6: Daily Acquisition Command Center") throw new Error("Phase 6F phase must remain pinned.");
  if (result.phaseStep !== "Phase 6F — Command Center Final Lockdown") throw new Error("Phase 6F step must remain pinned.");
  if (result.previousStep !== "Phase 6E — Minimal Command Center Gate") throw new Error("Phase 6F previous step must remain Phase 6E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 6F must remain final-lockdown-only.");
  if (result.phase6eGateReferences.join("|") !== phase6MinimalCommandCenterGateLanes.join("|")) throw new Error("Phase 6F must preserve Phase 6E gate references.");
  if (unsafeTrue.length > 0 || !result.flags.phase6LockdownEnforced) throw new Error("Phase 6F blocked flags cannot turn true and lockdown must stay enforced.");
  if (!/locks Phase 6/i.test(text) || !/authorizes no implementation/i.test(text) || !/Phase 7 — KPI & Revenue Intelligence/i.test(text)) throw new Error("Phase 6F final lockdown rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not approve Phase 7 implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 6F AI boundary is missing.");
  if (!/Phase 6 closeout approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/Phase 7 transition approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 6F human boundary is missing.");
  if (!/queue creation/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 6F forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 7 — KPI & Revenue Intelligence") throw new Error("Phase 6F must recommend Phase 7.");
  if (unsafePattern.test(text)) throw new Error("Phase 6F wording must not imply unsafe authorization.");
}

export function getPhase6CommandCenterFinalLockdownSummary() {
  const result = getPhase6CommandCenterFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: final lockdown for read-only Daily Acquisition Command Center planning with human-owned daily work selection, prioritization, task ownership, seller communication, and execution. No implementation, no task, queue, routing, assignment, reminder, calendar, notification, daily plan, CRM mutation, automation, revenue execution, Phase 7 implementation, and no go-live are authorized. Next stage: ${result.nextStageRecommendation}.`;
}
