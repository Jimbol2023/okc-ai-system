import { phase4CallPrepAdvisoryLanes } from "./phase-4-call-prep-advisory-policy";

export const phase4CallPrepImplementationScopeFlags = {
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
  sellerCallRecordMutationEnabled: false,
  followUpCreationEnabled: false,
  queueAssignmentEnabled: false,
  reminderCreationEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  offerGenerationEnabled: false,
  contractGenerationEnabled: false,
  phase5ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase4CallPrepImplementationLane =
  | "candidate_seller_context_summary"
  | "candidate_question_prep_visibility"
  | "candidate_safety_and_missing_data_review"
  | "blocked_execution_and_mutation_paths"
  | "phase_4e_gate_requirements";

export const phase4CallPrepImplementationLanes: Phase4CallPrepImplementationLane[] = [
  "candidate_seller_context_summary",
  "candidate_question_prep_visibility",
  "candidate_safety_and_missing_data_review",
  "blocked_execution_and_mutation_paths",
  "phase_4e_gate_requirements",
];

export type Phase4CallPrepImplementationScope = {
  phase: "Phase 4: Seller Review & Call Prep";
  phaseStep: "Phase 4D — Call Prep Implementation Scope";
  previousStep: "Phase 4C — Call Prep Advisory Policy";
  phaseDecision: "implementation_scope_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  sellerCallMutationDecision: "not_authorized";
  followUpCreationDecision: "not_authorized";
  reminderCreationDecision: "not_authorized";
  outreachDecision: "not_authorized";
  callingDecision: "not_authorized";
  queueDecision: "not_authorized";
  recommendedNextExactStep: "Phase 4E — Minimal Call Prep Gate";
  nextStageRecommendation: "Phase 4E — Minimal Call Prep Gate";
  implementationScopeLanes: Phase4CallPrepImplementationLane[];
  advisoryLaneReferences: typeof phase4CallPrepAdvisoryLanes;
  scopeRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase4CallPrepImplementationScopeFlags;
};

export const phase4CallPrepImplementationScopeRules = [
  "Phase 4D scopes possible future internal call-prep visibility only.",
  "No implementation execution, CRM mutation, seller-call record mutation, follow-up creation, reminders, queues, outreach, calling, providers, scraping, skip tracing, offer generation, contract generation, Phase 5 implementation, or go-live is authorized.",
  "Any future build must stay internal-review-only until explicit human approval.",
];

export const phase4CallPrepImplementationScopeStopRules = [
  "Phase 4D is implementation scope only, not implementation execution.",
  "Candidate work cannot create routes, UI, schema, storage, CRM writes, seller-call writes, follow-up queues, reminders, messages, calls, offers, contracts, providers, or runtime jobs.",
];

export const phase4CallPrepImplementationScopeAiBoundary = [
  "explain future call-prep visibility scope for human review only",
  "map advisory lanes to candidate internal review surfaces",
  "do not implement UI routes APIs schema storage or CRM writes",
  "do not mutate seller-call records",
  "do not create follow-ups queues reminders messages or calls",
  "do not activate providers",
  "do not scrape or skip trace",
  "do not generate offers or contracts",
  "do not approve implementation",
];

export const phase4CallPrepImplementationScopeHumanBoundary = [
  "final implementation approval",
  "seller communication",
  "call execution",
  "property fact verification",
  "CRM approval",
  "seller-call record approval",
  "future Phase 5 transition approval",
];

export function getPhase4CallPrepImplementationScope(): Phase4CallPrepImplementationScope {
  const result: Phase4CallPrepImplementationScope = {
    phase: "Phase 4: Seller Review & Call Prep",
    phaseStep: "Phase 4D — Call Prep Implementation Scope",
    previousStep: "Phase 4C — Call Prep Advisory Policy",
    phaseDecision: "implementation_scope_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    sellerCallMutationDecision: "not_authorized",
    followUpCreationDecision: "not_authorized",
    reminderCreationDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callingDecision: "not_authorized",
    queueDecision: "not_authorized",
    recommendedNextExactStep: "Phase 4E — Minimal Call Prep Gate",
    nextStageRecommendation: "Phase 4E — Minimal Call Prep Gate",
    implementationScopeLanes: phase4CallPrepImplementationLanes,
    advisoryLaneReferences: phase4CallPrepAdvisoryLanes,
    scopeRules: phase4CallPrepImplementationScopeRules,
    stopRules: phase4CallPrepImplementationScopeStopRules,
    aiOperatorLeverageBoundary: phase4CallPrepImplementationScopeAiBoundary,
    humanOwnershipBoundary: phase4CallPrepImplementationScopeHumanBoundary,
    forbiddenDrift: phase4CallPrepImplementationScopeRules,
    flags: phase4CallPrepImplementationScopeFlags,
  };
  assertPhase4CallPrepImplementationScopeSafe(result);
  return result;
}

export function assertPhase4CallPrepImplementationScopeSafe(result: Phase4CallPrepImplementationScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "implementationScopeOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.implementationScopeLanes].flat().join(" ");
  const unsafePattern = /implementation execution is authorized|CRM mutation is authorized|seller-call record mutation is authorized|follow-up creation is authorized|reminders? are authorized|queues? are authorized|outreach is authorized|calling is authorized|providers? are authorized|scraping is authorized|skip tracing is authorized|offer generation is authorized|contract generation is authorized|Phase 5 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 4D — Call Prep Implementation Scope") throw new Error("Phase 4D step must remain pinned.");
  if (result.previousStep !== "Phase 4C — Call Prep Advisory Policy") throw new Error("Phase 4D previous step must remain Phase 4C.");
  if (result.phaseDecision !== "implementation_scope_only") throw new Error("Phase 4D must remain implementation-scope-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.sellerCallMutationDecision !== "not_authorized" ||
    result.followUpCreationDecision !== "not_authorized" ||
    result.reminderCreationDecision !== "not_authorized" ||
    result.outreachDecision !== "not_authorized" ||
    result.callingDecision !== "not_authorized" ||
    result.queueDecision !== "not_authorized"
  ) throw new Error("Phase 4D decisions must remain not_authorized.");
  if (result.implementationScopeLanes.join("|") !== phase4CallPrepImplementationLanes.join("|")) throw new Error("Phase 4D must include all implementation scope lanes.");
  if (result.advisoryLaneReferences.join("|") !== phase4CallPrepAdvisoryLanes.join("|")) throw new Error("Phase 4D must preserve Phase 4C advisory lanes.");
  if (unsafeTrue.length > 0) throw new Error("Phase 4D blocked flags cannot turn true.");
  if (!/No implementation execution/i.test(result.scopeRules.join(" ")) || !/seller-call record mutation/i.test(result.scopeRules.join(" "))) throw new Error("Phase 4D scope rules are missing.");
  if (!/implementation scope only/i.test(result.stopRules.join(" "))) throw new Error("Phase 4D stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement UI routes APIs schema storage or CRM writes/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 4D AI boundary is missing.");
  if (!/final implementation approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/seller communication/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 4D human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 4E — Minimal Call Prep Gate") throw new Error("Phase 4D must hand off to Phase 4E.");
  if (unsafePattern.test(text)) throw new Error("Phase 4D wording must not imply unsafe authorization.");
}

export function getPhase4CallPrepImplementationScopeSummary() {
  const result = getPhase4CallPrepImplementationScope();
  return `${result.phase} / ${result.phaseStep}: scopes possible future internal call-prep visibility for highest acquisition ROI per operator hour with human-owned seller communication and implementation approval. No implementation execution, no calling, no outreach, no CRM mutation, no seller-call mutation, no follow-up creation, no queues, no scraping, no autonomous lead creation, no offer or contract generation, no Phase 5 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
