import { phase6CommandCenterImplementationLanes } from "./phase-6-command-center-implementation-scope";

export const phase6MinimalCommandCenterGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  minimalGateOnly: true,
  operatorLeverageOnly: true,
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

export type Phase6MinimalCommandCenterGateLane =
  | "minimal_internal_command_center_package"
  | "operator_roi_review"
  | "blocked_work_safety_review"
  | "blocked_execution_paths"
  | "phase_6f_lockdown_requirements";

export const phase6MinimalCommandCenterGateLanes: Phase6MinimalCommandCenterGateLane[] = [
  "minimal_internal_command_center_package",
  "operator_roi_review",
  "blocked_work_safety_review",
  "blocked_execution_paths",
  "phase_6f_lockdown_requirements",
];

export type Phase6MinimalCommandCenterGate = {
  phase: "Phase 6: Daily Acquisition Command Center";
  phaseStep: "Phase 6E — Minimal Command Center Gate";
  previousStep: "Phase 6D — Command Center Implementation Scope";
  phaseDecision: "minimal_gate_only";
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
  recommendedNextExactStep: "Phase 6F — Command Center Final Lockdown";
  nextStageRecommendation: "Phase 6F — Command Center Final Lockdown";
  gateLanes: Phase6MinimalCommandCenterGateLane[];
  implementationScopeReferences: typeof phase6CommandCenterImplementationLanes;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase6MinimalCommandCenterGateFlags;
};

export const phase6MinimalCommandCenterGateRules = [
  "Phase 6E gates whether a minimal internal command-center package is worth considering.",
  "Phase 6E cannot authorize implementation, task creation, queue creation, routing, assignment, reminder creation, calendar creation, notification, daily plan persistence, CRM mutation, provider activation, outreach, calling, message sending, audit writing, storage writing, automation, scraping, skip tracing, revenue execution, Phase 7 implementation, or go-live.",
  "Phase 6E hands off only to Phase 6 final lockdown.",
];

export const phase6MinimalCommandCenterGateStopRules = [
  "Phase 6E is a minimal gate only.",
  "The gate does not build, activate, send, call, schedule, persist, mutate, route, assign, notify, create tasks, create queues, create reminders, create calendar items, write audits, write storage, execute revenue actions, or approve go-live.",
];

export const phase6MinimalCommandCenterGateAiBoundary = [
  "summarize minimal internal command-center package value for human review only",
  "explain operator ROI and blocked-work safety tradeoffs",
  "do not implement command-center behavior",
  "do not create tasks queues routing assignments reminders calendar items notifications or daily plans",
  "do not mutate CRM records or write storage or audit logs",
  "do not send messages call sellers activate providers or trigger automation",
  "do not scrape or skip trace",
  "do not execute revenue actions",
  "do not approve implementation or go-live",
];

export const phase6MinimalCommandCenterGateHumanBoundary = [
  "final minimal package decision",
  "daily work selection",
  "operator prioritization",
  "seller communication",
  "task ownership",
  "manual execution",
  "CRM approval",
  "implementation approval",
  "go-live approval ownership",
];

export function getPhase6MinimalCommandCenterGate(): Phase6MinimalCommandCenterGate {
  const result: Phase6MinimalCommandCenterGate = {
    phase: "Phase 6: Daily Acquisition Command Center",
    phaseStep: "Phase 6E — Minimal Command Center Gate",
    previousStep: "Phase 6D — Command Center Implementation Scope",
    phaseDecision: "minimal_gate_only",
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
    recommendedNextExactStep: "Phase 6F — Command Center Final Lockdown",
    nextStageRecommendation: "Phase 6F — Command Center Final Lockdown",
    gateLanes: phase6MinimalCommandCenterGateLanes,
    implementationScopeReferences: phase6CommandCenterImplementationLanes,
    gateRules: phase6MinimalCommandCenterGateRules,
    stopRules: phase6MinimalCommandCenterGateStopRules,
    aiOperatorLeverageBoundary: phase6MinimalCommandCenterGateAiBoundary,
    humanOwnershipBoundary: phase6MinimalCommandCenterGateHumanBoundary,
    forbiddenDrift: phase6MinimalCommandCenterGateRules,
    flags: phase6MinimalCommandCenterGateFlags,
  };
  assertPhase6MinimalCommandCenterGateSafe(result);
  return result;
}

export function assertPhase6MinimalCommandCenterGateSafe(result: Phase6MinimalCommandCenterGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "minimalGateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateLanes].flat().join(" ");
  const unsafePattern = /implementation is authorized|task creation is authorized|queue creation is authorized|routing is authorized|assignment is authorized|reminder creation is authorized|calendar creation is authorized|notification is authorized|daily plan persistence is authorized|CRM mutation is authorized|provider activation is authorized|outreach is authorized|calling is authorized|message sending is authorized|audit writing is authorized|storage writing is authorized|automation is authorized|scraping is authorized|skip tracing is authorized|revenue execution is authorized|Phase 7 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 6E — Minimal Command Center Gate") throw new Error("Phase 6E step must remain pinned.");
  if (result.previousStep !== "Phase 6D — Command Center Implementation Scope") throw new Error("Phase 6E previous step must remain Phase 6D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 6E must remain minimal-gate-only.");
  if (result.gateLanes.join("|") !== phase6MinimalCommandCenterGateLanes.join("|")) throw new Error("Phase 6E must include all minimal command center gate lanes.");
  if (result.implementationScopeReferences.join("|") !== phase6CommandCenterImplementationLanes.join("|")) throw new Error("Phase 6E must preserve Phase 6D implementation scope references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 6E blocked flags cannot turn true.");
  if (!/cannot authorize implementation/i.test(result.gateRules.join(" ")) || !/queue creation/i.test(result.gateRules.join(" "))) throw new Error("Phase 6E gate rules are missing.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 6E stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement command-center behavior/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 6E AI boundary is missing.");
  if (!/final minimal package decision/i.test(result.humanOwnershipBoundary.join(" ")) || !/daily work selection/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 6E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 6F — Command Center Final Lockdown") throw new Error("Phase 6E must hand off to Phase 6F.");
  if (unsafePattern.test(text)) throw new Error("Phase 6E wording must not imply unsafe authorization.");
}

export function getPhase6MinimalCommandCenterGateSummary() {
  const result = getPhase6MinimalCommandCenterGate();
  return `${result.phase} / ${result.phaseStep}: gates whether a minimal internal command-center package is worth considering for highest acquisition ROI per operator hour. Human-owned daily work selection remains required. No implementation, no task, queue, routing, assignment, reminder, calendar, notification, daily plan, CRM mutation, automation, revenue execution, Phase 7 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
