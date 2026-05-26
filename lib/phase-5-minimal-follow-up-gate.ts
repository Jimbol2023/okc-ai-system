import { phase5FollowUpImplementationLanes } from "./phase-5-follow-up-implementation-scope";

export const phase5MinimalFollowUpGateFlags = {
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
  followUpCreationEnabled: false,
  taskCreationEnabled: false,
  queueCreationEnabled: false,
  reminderCreationEnabled: false,
  calendarCreationEnabled: false,
  scheduleWritingEnabled: false,
  messageDraftPersistenceEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  phase6ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase5MinimalFollowUpGateLane =
  | "minimal_internal_follow_up_package"
  | "operator_roi_review"
  | "contact_safety_review"
  | "blocked_execution_paths"
  | "phase_5f_lockdown_requirements";

export const phase5MinimalFollowUpGateLanes: Phase5MinimalFollowUpGateLane[] = [
  "minimal_internal_follow_up_package",
  "operator_roi_review",
  "contact_safety_review",
  "blocked_execution_paths",
  "phase_5f_lockdown_requirements",
];

export type Phase5MinimalFollowUpGate = {
  phase: "Phase 5: Follow-Up Organization System";
  phaseStep: "Phase 5E — Minimal Follow-Up Organization Gate";
  previousStep: "Phase 5D — Follow-Up Organization Implementation Scope";
  phaseDecision: "minimal_gate_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  followUpCreationDecision: "not_authorized";
  taskDecision: "not_authorized";
  queueDecision: "not_authorized";
  reminderDecision: "not_authorized";
  calendarDecision: "not_authorized";
  outreachDecision: "not_authorized";
  callingDecision: "not_authorized";
  recommendedNextExactStep: "Phase 5F — Follow-Up Organization Final Lockdown";
  nextStageRecommendation: "Phase 5F — Follow-Up Organization Final Lockdown";
  gateLanes: Phase5MinimalFollowUpGateLane[];
  implementationScopeReferences: typeof phase5FollowUpImplementationLanes;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase5MinimalFollowUpGateFlags;
};

export const phase5MinimalFollowUpGateRules = [
  "Phase 5E gates whether a minimal internal follow-up organization package is worth considering.",
  "Phase 5E cannot authorize implementation, CRM mutation, follow-up creation, task creation, queue creation, reminder creation, calendar creation, schedule writing, message draft persistence, outreach, calling, message sending, providers, automation, scraping, skip tracing, Phase 6 implementation, or go-live.",
  "Phase 5E hands off only to Phase 5 final lockdown.",
];

export const phase5MinimalFollowUpGateStopRules = [
  "Phase 5E is a minimal gate only.",
  "The gate does not build, activate, send, call, schedule, persist, mutate, route, assign, scrape, skip trace, create tasks, create queues, create reminders, create calendar items, or approve go-live.",
];

export const phase5MinimalFollowUpGateAiBoundary = [
  "summarize minimal internal follow-up package value for human review only",
  "explain operator ROI and contact-safety tradeoffs",
  "do not implement follow-up organization",
  "do not send messages or call sellers",
  "do not mutate CRM records",
  "do not create follow-ups tasks queues reminders calendar items schedules or message drafts",
  "do not activate providers or automation",
  "do not scrape or skip trace",
  "do not approve implementation or go-live",
];

export const phase5MinimalFollowUpGateHumanBoundary = [
  "final minimal package decision",
  "follow-up timing",
  "seller communication",
  "task ownership",
  "manual execution",
  "CRM approval",
  "implementation approval",
  "go-live approval ownership",
];

export function getPhase5MinimalFollowUpGate(): Phase5MinimalFollowUpGate {
  const result: Phase5MinimalFollowUpGate = {
    phase: "Phase 5: Follow-Up Organization System",
    phaseStep: "Phase 5E — Minimal Follow-Up Organization Gate",
    previousStep: "Phase 5D — Follow-Up Organization Implementation Scope",
    phaseDecision: "minimal_gate_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    followUpCreationDecision: "not_authorized",
    taskDecision: "not_authorized",
    queueDecision: "not_authorized",
    reminderDecision: "not_authorized",
    calendarDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callingDecision: "not_authorized",
    recommendedNextExactStep: "Phase 5F — Follow-Up Organization Final Lockdown",
    nextStageRecommendation: "Phase 5F — Follow-Up Organization Final Lockdown",
    gateLanes: phase5MinimalFollowUpGateLanes,
    implementationScopeReferences: phase5FollowUpImplementationLanes,
    gateRules: phase5MinimalFollowUpGateRules,
    stopRules: phase5MinimalFollowUpGateStopRules,
    aiOperatorLeverageBoundary: phase5MinimalFollowUpGateAiBoundary,
    humanOwnershipBoundary: phase5MinimalFollowUpGateHumanBoundary,
    forbiddenDrift: phase5MinimalFollowUpGateRules,
    flags: phase5MinimalFollowUpGateFlags,
  };
  assertPhase5MinimalFollowUpGateSafe(result);
  return result;
}

export function assertPhase5MinimalFollowUpGateSafe(result: Phase5MinimalFollowUpGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "minimalGateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateLanes].flat().join(" ");
  const unsafePattern = /implementation is authorized|CRM mutation is authorized|follow-up creation is authorized|task creation is authorized|queue creation is authorized|reminder creation is authorized|calendar creation is authorized|schedule writing is authorized|message draft persistence is authorized|outreach is authorized|calling is authorized|message sending is authorized|providers? are authorized|automation is authorized|scraping is authorized|skip tracing is authorized|Phase 6 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 5E — Minimal Follow-Up Organization Gate") throw new Error("Phase 5E step must remain pinned.");
  if (result.previousStep !== "Phase 5D — Follow-Up Organization Implementation Scope") throw new Error("Phase 5E previous step must remain Phase 5D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 5E must remain minimal-gate-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.followUpCreationDecision !== "not_authorized" ||
    result.taskDecision !== "not_authorized" ||
    result.queueDecision !== "not_authorized" ||
    result.reminderDecision !== "not_authorized" ||
    result.calendarDecision !== "not_authorized" ||
    result.outreachDecision !== "not_authorized" ||
    result.callingDecision !== "not_authorized"
  ) throw new Error("Phase 5E decisions must remain not_authorized.");
  if (result.gateLanes.join("|") !== phase5MinimalFollowUpGateLanes.join("|")) throw new Error("Phase 5E must include all minimal follow-up gate lanes.");
  if (result.implementationScopeReferences.join("|") !== phase5FollowUpImplementationLanes.join("|")) throw new Error("Phase 5E must preserve Phase 5D implementation scope references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 5E blocked flags cannot turn true.");
  if (!/cannot authorize implementation/i.test(result.gateRules.join(" ")) || !/queue creation/i.test(result.gateRules.join(" "))) throw new Error("Phase 5E gate rules are missing.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 5E stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement follow-up organization/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 5E AI boundary is missing.");
  if (!/final minimal package decision/i.test(result.humanOwnershipBoundary.join(" ")) || !/seller communication/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 5E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 5F — Follow-Up Organization Final Lockdown") throw new Error("Phase 5E must hand off to Phase 5F.");
  if (unsafePattern.test(text)) throw new Error("Phase 5E wording must not imply unsafe authorization.");
}

export function getPhase5MinimalFollowUpGateSummary() {
  const result = getPhase5MinimalFollowUpGate();
  return `${result.phase} / ${result.phaseStep}: gates whether a minimal internal follow-up organization package is worth considering for highest acquisition ROI per operator hour. Human-owned follow-up judgment remains required. No implementation, no outreach, no calling, no message sending, no CRM mutation, no follow-up, task, queue, reminder, or calendar creation, no scraping, no autonomous lead creation, no Phase 6 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
