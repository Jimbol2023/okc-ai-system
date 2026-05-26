import { manualFollowUpWorkspaceLanes } from "./manual-follow-up-workspace-usability";
import { z3ManualCadenceBands } from "./z3-follow-up-velocity-policy";

export const phase5FollowUpImplementationScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  implementationScopeOnly: true,
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

export type Phase5FollowUpImplementationLane =
  | "candidate_manual_follow_up_visibility"
  | "candidate_staleness_and_due_soon_review"
  | "candidate_cleanup_and_contact_safety_review"
  | "blocked_execution_and_mutation_paths"
  | "phase_5e_gate_requirements";

export const phase5FollowUpImplementationLanes: Phase5FollowUpImplementationLane[] = [
  "candidate_manual_follow_up_visibility",
  "candidate_staleness_and_due_soon_review",
  "candidate_cleanup_and_contact_safety_review",
  "blocked_execution_and_mutation_paths",
  "phase_5e_gate_requirements",
];

export type Phase5FollowUpImplementationScope = {
  phase: "Phase 5: Follow-Up Organization System";
  phaseStep: "Phase 5D — Follow-Up Organization Implementation Scope";
  previousStep: "Phase 5C — Manual Follow-Up Organization Policy";
  phaseDecision: "implementation_scope_only";
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
  recommendedNextExactStep: "Phase 5E — Minimal Follow-Up Organization Gate";
  nextStageRecommendation: "Phase 5E — Minimal Follow-Up Organization Gate";
  implementationScopeLanes: Phase5FollowUpImplementationLane[];
  manualFollowUpLaneReferences: typeof manualFollowUpWorkspaceLanes;
  cadenceBandReferences: typeof z3ManualCadenceBands;
  scopeRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase5FollowUpImplementationScopeFlags;
};

export const phase5FollowUpImplementationScopeRules = [
  "Phase 5D scopes possible future internal follow-up organization visibility only.",
  "No implementation execution, CRM mutation, follow-up creation, task creation, queue creation, reminder creation, calendar creation, schedule writing, message draft persistence, outreach, calling, provider activation, automation, scraping, skip tracing, Phase 6 implementation, or go-live is authorized.",
  "Any future build must stay internal-review-only until explicit human approval.",
];

export const phase5FollowUpImplementationScopeStopRules = [
  "Phase 5D is implementation scope only, not implementation execution.",
  "Candidate work cannot create UI, routes, APIs, schema, storage, CRM writes, follow-up writes, tasks, queues, reminders, calendar items, schedules, message drafts, messages, calls, providers, or runtime jobs.",
];

export const phase5FollowUpImplementationScopeAiBoundary = [
  "explain future follow-up organization scope for human review only",
  "map manual lanes and cadence bands to candidate internal review surfaces",
  "do not implement UI routes APIs schema storage or CRM writes",
  "do not create follow-ups tasks queues reminders calendar items schedules or message drafts",
  "do not send messages or call sellers",
  "do not activate providers or automation",
  "do not scrape or skip trace",
  "do not approve implementation",
];

export const phase5FollowUpImplementationScopeHumanBoundary = [
  "final implementation approval",
  "follow-up timing",
  "seller communication",
  "task ownership",
  "manual execution",
  "CRM approval",
  "future Phase 6 transition approval",
];

export function getPhase5FollowUpImplementationScope(): Phase5FollowUpImplementationScope {
  const result: Phase5FollowUpImplementationScope = {
    phase: "Phase 5: Follow-Up Organization System",
    phaseStep: "Phase 5D — Follow-Up Organization Implementation Scope",
    previousStep: "Phase 5C — Manual Follow-Up Organization Policy",
    phaseDecision: "implementation_scope_only",
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
    recommendedNextExactStep: "Phase 5E — Minimal Follow-Up Organization Gate",
    nextStageRecommendation: "Phase 5E — Minimal Follow-Up Organization Gate",
    implementationScopeLanes: phase5FollowUpImplementationLanes,
    manualFollowUpLaneReferences: manualFollowUpWorkspaceLanes,
    cadenceBandReferences: z3ManualCadenceBands,
    scopeRules: phase5FollowUpImplementationScopeRules,
    stopRules: phase5FollowUpImplementationScopeStopRules,
    aiOperatorLeverageBoundary: phase5FollowUpImplementationScopeAiBoundary,
    humanOwnershipBoundary: phase5FollowUpImplementationScopeHumanBoundary,
    forbiddenDrift: phase5FollowUpImplementationScopeRules,
    flags: phase5FollowUpImplementationScopeFlags,
  };
  assertPhase5FollowUpImplementationScopeSafe(result);
  return result;
}

export function assertPhase5FollowUpImplementationScopeSafe(result: Phase5FollowUpImplementationScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "implementationScopeOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.implementationScopeLanes].flat().join(" ");
  const unsafePattern = /implementation execution is authorized|CRM mutation is authorized|follow-up creation is authorized|task creation is authorized|queue creation is authorized|reminder creation is authorized|calendar creation is authorized|schedule writing is authorized|message draft persistence is authorized|outreach is authorized|calling is authorized|provider activation is authorized|automation is authorized|scraping is authorized|skip tracing is authorized|Phase 6 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 5D — Follow-Up Organization Implementation Scope") throw new Error("Phase 5D step must remain pinned.");
  if (result.previousStep !== "Phase 5C — Manual Follow-Up Organization Policy") throw new Error("Phase 5D previous step must remain Phase 5C.");
  if (result.phaseDecision !== "implementation_scope_only") throw new Error("Phase 5D must remain implementation-scope-only.");
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
  ) throw new Error("Phase 5D decisions must remain not_authorized.");
  if (result.implementationScopeLanes.join("|") !== phase5FollowUpImplementationLanes.join("|")) throw new Error("Phase 5D must include all implementation scope lanes.");
  if (result.manualFollowUpLaneReferences.join("|") !== manualFollowUpWorkspaceLanes.join("|")) throw new Error("Phase 5D must preserve manual follow-up lane references.");
  if (result.cadenceBandReferences.join("|") !== z3ManualCadenceBands.join("|")) throw new Error("Phase 5D must preserve cadence band references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 5D blocked flags cannot turn true.");
  if (!/No implementation execution/i.test(result.scopeRules.join(" ")) || !/queue creation/i.test(result.scopeRules.join(" "))) throw new Error("Phase 5D scope rules are missing.");
  if (!/implementation scope only/i.test(result.stopRules.join(" "))) throw new Error("Phase 5D stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement UI routes APIs schema storage or CRM writes/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 5D AI boundary is missing.");
  if (!/final implementation approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/seller communication/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 5D human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 5E — Minimal Follow-Up Organization Gate") throw new Error("Phase 5D must hand off to Phase 5E.");
  if (unsafePattern.test(text)) throw new Error("Phase 5D wording must not imply unsafe authorization.");
}

export function getPhase5FollowUpImplementationScopeSummary() {
  const result = getPhase5FollowUpImplementationScope();
  return `${result.phase} / ${result.phaseStep}: scopes possible future internal follow-up organization visibility for highest acquisition ROI per operator hour with human-owned follow-up judgment and implementation approval. No implementation execution, no outreach, no calling, no message sending, no CRM mutation, no follow-up, task, queue, reminder, or calendar creation, no schedule writing, no message draft persistence, no scraping, no autonomous lead creation, no Phase 6 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
