import { phase4CallPrepImplementationLanes } from "./phase-4-call-prep-implementation-scope";

export const phase4MinimalCallPrepGateFlags = {
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

export type Phase4MinimalCallPrepGateLane =
  | "minimal_internal_call_prep_package"
  | "operator_roi_review"
  | "contact_safety_review"
  | "blocked_execution_paths"
  | "phase_4f_lockdown_requirements";

export const phase4MinimalCallPrepGateLanes: Phase4MinimalCallPrepGateLane[] = [
  "minimal_internal_call_prep_package",
  "operator_roi_review",
  "contact_safety_review",
  "blocked_execution_paths",
  "phase_4f_lockdown_requirements",
];

export type Phase4MinimalCallPrepGate = {
  phase: "Phase 4: Seller Review & Call Prep";
  phaseStep: "Phase 4E — Minimal Call Prep Gate";
  previousStep: "Phase 4D — Call Prep Implementation Scope";
  phaseDecision: "minimal_gate_only";
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
  recommendedNextExactStep: "Phase 4F — Seller Review Final Lockdown";
  nextStageRecommendation: "Phase 4F — Seller Review Final Lockdown";
  gateLanes: Phase4MinimalCallPrepGateLane[];
  implementationScopeReferences: typeof phase4CallPrepImplementationLanes;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase4MinimalCallPrepGateFlags;
};

export const phase4MinimalCallPrepGateRules = [
  "Phase 4E gates whether a minimal internal call-prep package is worth considering.",
  "Phase 4E cannot authorize implementation, CRM mutation, seller-call record mutation, follow-up creation, reminders, queues, outreach, calling, providers, scraping, skip tracing, offer generation, contract generation, Phase 5 implementation, or go-live.",
  "Phase 4E hands off only to Phase 4 final lockdown.",
];

export const phase4MinimalCallPrepGateStopRules = [
  "Phase 4E is a minimal gate only.",
  "The gate does not build, activate, send, call, schedule, persist, mutate, route, assign, scrape, skip trace, generate offers, generate contracts, or approve go-live.",
];

export const phase4MinimalCallPrepGateAiBoundary = [
  "summarize minimal internal call-prep package value for human review only",
  "explain operator ROI and contact-safety tradeoffs",
  "do not implement call prep",
  "do not contact or call sellers",
  "do not mutate CRM or seller-call records",
  "do not create follow-ups queues or reminders",
  "do not activate providers",
  "do not scrape or skip trace",
  "do not generate offers or contracts",
  "do not approve implementation or go-live",
];

export const phase4MinimalCallPrepGateHumanBoundary = [
  "final minimal package decision",
  "seller communication",
  "call execution",
  "negotiation",
  "property fact verification",
  "CRM approval",
  "implementation approval",
  "go-live approval ownership",
];

export function getPhase4MinimalCallPrepGate(): Phase4MinimalCallPrepGate {
  const result: Phase4MinimalCallPrepGate = {
    phase: "Phase 4: Seller Review & Call Prep",
    phaseStep: "Phase 4E — Minimal Call Prep Gate",
    previousStep: "Phase 4D — Call Prep Implementation Scope",
    phaseDecision: "minimal_gate_only",
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
    recommendedNextExactStep: "Phase 4F — Seller Review Final Lockdown",
    nextStageRecommendation: "Phase 4F — Seller Review Final Lockdown",
    gateLanes: phase4MinimalCallPrepGateLanes,
    implementationScopeReferences: phase4CallPrepImplementationLanes,
    gateRules: phase4MinimalCallPrepGateRules,
    stopRules: phase4MinimalCallPrepGateStopRules,
    aiOperatorLeverageBoundary: phase4MinimalCallPrepGateAiBoundary,
    humanOwnershipBoundary: phase4MinimalCallPrepGateHumanBoundary,
    forbiddenDrift: phase4MinimalCallPrepGateRules,
    flags: phase4MinimalCallPrepGateFlags,
  };
  assertPhase4MinimalCallPrepGateSafe(result);
  return result;
}

export function assertPhase4MinimalCallPrepGateSafe(result: Phase4MinimalCallPrepGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "minimalGateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateLanes].flat().join(" ");
  const unsafePattern = /implementation is authorized|CRM mutation is authorized|seller-call record mutation is authorized|follow-up creation is authorized|reminders? are authorized|queues? are authorized|outreach is authorized|calling is authorized|providers? are authorized|scraping is authorized|skip tracing is authorized|offer generation is authorized|contract generation is authorized|Phase 5 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 4E — Minimal Call Prep Gate") throw new Error("Phase 4E step must remain pinned.");
  if (result.previousStep !== "Phase 4D — Call Prep Implementation Scope") throw new Error("Phase 4E previous step must remain Phase 4D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 4E must remain minimal-gate-only.");
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
  ) throw new Error("Phase 4E decisions must remain not_authorized.");
  if (result.gateLanes.join("|") !== phase4MinimalCallPrepGateLanes.join("|")) throw new Error("Phase 4E must include all minimal call-prep gate lanes.");
  if (result.implementationScopeReferences.join("|") !== phase4CallPrepImplementationLanes.join("|")) throw new Error("Phase 4E must preserve Phase 4D implementation scope references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 4E blocked flags cannot turn true.");
  if (!/cannot authorize implementation/i.test(result.gateRules.join(" ")) || !/seller-call record mutation/i.test(result.gateRules.join(" "))) throw new Error("Phase 4E gate rules are missing.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 4E stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not contact or call sellers/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 4E AI boundary is missing.");
  if (!/final minimal package decision/i.test(result.humanOwnershipBoundary.join(" ")) || !/seller communication/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 4E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 4F — Seller Review Final Lockdown") throw new Error("Phase 4E must hand off to Phase 4F.");
  if (unsafePattern.test(text)) throw new Error("Phase 4E wording must not imply unsafe authorization.");
}

export function getPhase4MinimalCallPrepGateSummary() {
  const result = getPhase4MinimalCallPrepGate();
  return `${result.phase} / ${result.phaseStep}: gates whether a minimal internal call-prep package is worth considering for highest acquisition ROI per operator hour. Human-owned seller communication remains required. No implementation, no outreach, no calling, no CRM mutation, no seller-call mutation, no scraping, no autonomous lead creation, no offer or contract generation, no Phase 5 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
