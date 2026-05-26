import { phase4MinimalCallPrepGateLanes } from "./phase-4-minimal-call-prep-gate";

export const phase4SellerReviewFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
  operatorLeverageOnly: true,
  phase4LockdownEnforced: true,
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

export type Phase4SellerReviewFinalLockdown = {
  phase: "Phase 4: Seller Review & Call Prep";
  phaseStep: "Phase 4F — Seller Review Final Lockdown";
  previousStep: "Phase 4E — Minimal Call Prep Gate";
  phaseDecision: "final_lockdown_only";
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
  recommendedNextExactStep: "Phase 5 — Follow-Up Organization System";
  nextStageRecommendation: "Phase 5 — Follow-Up Organization System";
  finalLockdownRules: string[];
  phase4eGateReferences: typeof phase4MinimalCallPrepGateLanes;
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase4SellerReviewFinalLockdownFlags;
};

export const phase4SellerReviewFinalLockdownRules = [
  "Phase 4F locks Phase 4 as read-only Seller Review & Call Prep planning only.",
  "Phase 4F authorizes no implementation, outreach, calling, SMS, email, provider activation, CRM mutation, seller-call record mutation, follow-up creation, reminders, queues, scraping, skip tracing, offer generation, contract generation, Phase 5 implementation, or go-live.",
  "Phase 4F can recommend Phase 5 — Follow-Up Organization System as the next roadmap phase only after human review.",
];

export const phase4SellerReviewFinalLockdownAiBoundary = [
  "summarize Phase 4 closeout for human review only",
  "summarize Phase 4A through Phase 4E continuity",
  "prepare Phase 5 transition notes for human review",
  "do not invent property facts",
  "do not contact or call sellers",
  "do not send SMS or email",
  "do not mutate CRM or seller-call records",
  "do not create follow-ups queues or reminders",
  "do not activate providers",
  "do not scrape or skip trace",
  "do not generate offers or contracts",
  "do not approve Phase 5 implementation",
  "do not authorize go-live",
];

export const phase4SellerReviewFinalLockdownHumanBoundary = [
  "Phase 4 closeout approval",
  "Phase 5 transition approval",
  "seller communication",
  "call execution",
  "negotiation",
  "property fact verification",
  "CRM approval",
  "future implementation approval",
];

export const phase4SellerReviewFinalLockdownForbiddenDrift = [
  "implementation",
  "seller outreach",
  "calling",
  "SMS sending",
  "email sending",
  "provider activation",
  "CRM mutation",
  "seller-call record mutation",
  "follow-up creation",
  "reminders",
  "queues",
  "scraping",
  "skip tracing",
  "invented property facts",
  "offer generation",
  "contract generation",
  "Phase 5 implementation",
  "go-live",
];

export function getPhase4SellerReviewFinalLockdown(): Phase4SellerReviewFinalLockdown {
  const result: Phase4SellerReviewFinalLockdown = {
    phase: "Phase 4: Seller Review & Call Prep",
    phaseStep: "Phase 4F — Seller Review Final Lockdown",
    previousStep: "Phase 4E — Minimal Call Prep Gate",
    phaseDecision: "final_lockdown_only",
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
    recommendedNextExactStep: "Phase 5 — Follow-Up Organization System",
    nextStageRecommendation: "Phase 5 — Follow-Up Organization System",
    finalLockdownRules: phase4SellerReviewFinalLockdownRules,
    phase4eGateReferences: phase4MinimalCallPrepGateLanes,
    aiOperatorLeverageBoundary: phase4SellerReviewFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase4SellerReviewFinalLockdownHumanBoundary,
    forbiddenDrift: phase4SellerReviewFinalLockdownForbiddenDrift,
    flags: phase4SellerReviewFinalLockdownFlags,
  };
  assertPhase4SellerReviewFinalLockdownSafe(result);
  return result;
}

export function assertPhase4SellerReviewFinalLockdownSafe(result: Phase4SellerReviewFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly", "phase4LockdownEnforced"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.finalLockdownRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|outreach is authorized|calling is authorized|SMS is authorized|email is authorized|provider activation is authorized|CRM mutation is authorized|seller-call record mutation is authorized|follow-up creation is authorized|reminders? are authorized|queues? are authorized|scraping is authorized|skip tracing is authorized|offer generation is authorized|contract generation is authorized|Phase 5 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 4: Seller Review & Call Prep") throw new Error("Phase 4F phase must remain pinned.");
  if (result.phaseStep !== "Phase 4F — Seller Review Final Lockdown") throw new Error("Phase 4F step must remain pinned.");
  if (result.previousStep !== "Phase 4E — Minimal Call Prep Gate") throw new Error("Phase 4F previous step must remain Phase 4E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 4F must remain final-lockdown-only.");
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
  ) throw new Error("Phase 4F decisions must remain not_authorized.");
  if (result.phase4eGateReferences.join("|") !== phase4MinimalCallPrepGateLanes.join("|")) throw new Error("Phase 4F must preserve Phase 4E gate references.");
  if (unsafeTrue.length > 0 || !result.flags.phase4LockdownEnforced) throw new Error("Phase 4F blocked flags cannot turn true and lockdown must stay enforced.");
  if (!/locks Phase 4/i.test(text) || !/authorizes no implementation/i.test(text) || !/Phase 5 — Follow-Up Organization System/i.test(text)) throw new Error("Phase 4F final lockdown rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not approve Phase 5 implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 4F AI boundary is missing.");
  if (!/Phase 4 closeout approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/Phase 5 transition approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 4F human boundary is missing.");
  if (!/seller outreach/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 4F forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 5 — Follow-Up Organization System") throw new Error("Phase 4F must recommend Phase 5.");
  if (unsafePattern.test(text)) throw new Error("Phase 4F wording must not imply unsafe authorization.");
}

export function getPhase4SellerReviewFinalLockdownSummary() {
  const result = getPhase4SellerReviewFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: final lockdown for read-only Seller Review & Call Prep planning with human-owned seller communication, call execution, negotiation, and verification. No implementation, no outreach, no calling, no CRM mutation, no seller-call mutation, no scraping, no autonomous lead creation, no offer or contract generation, no Phase 5 implementation, and no go-live are authorized. Next stage: ${result.nextStageRecommendation}.`;
}
