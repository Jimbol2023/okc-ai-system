import { phase4SellerReviewSignalFamilies } from "./phase-4-seller-review-signal-audit";

export const phase4CallPrepAdvisoryPolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  automationEnabled: false,
  communicationEnabled: false,
  crmMutationEnabled: false,
  sellerCallRecordMutationEnabled: false,
  followUpCreationEnabled: false,
  queueAssignmentEnabled: false,
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

export type Phase4CallPrepAdvisoryLane =
  | "stop_contact_safety_first"
  | "missing_seller_context_review"
  | "motivation_timeline_review"
  | "condition_price_expectation_review"
  | "seller_reply_review"
  | "objection_and_question_prep"
  | "offer_readiness_context_review"
  | "manual_next_step_review"
  | "defer_until_data_quality_improves";

export const phase4CallPrepAdvisoryLanes: Phase4CallPrepAdvisoryLane[] = [
  "stop_contact_safety_first",
  "missing_seller_context_review",
  "motivation_timeline_review",
  "condition_price_expectation_review",
  "seller_reply_review",
  "objection_and_question_prep",
  "offer_readiness_context_review",
  "manual_next_step_review",
  "defer_until_data_quality_improves",
];

export type Phase4CallPrepAdvisoryPolicy = {
  phase: "Phase 4: Seller Review & Call Prep";
  phaseStep: "Phase 4C — Call Prep Advisory Policy";
  previousStep: "Phase 4B — Seller Review Signal Audit";
  phaseDecision: "advisory_policy_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  automationDecision: "not_authorized";
  communicationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  sellerCallMutationDecision: "not_authorized";
  followUpCreationDecision: "not_authorized";
  outreachDecision: "not_authorized";
  callingDecision: "not_authorized";
  queueDecision: "not_authorized";
  recommendedNextExactStep: "Phase 4D — Call Prep Implementation Scope";
  nextStageRecommendation: "Phase 4D — Call Prep Implementation Scope";
  advisoryLanes: Phase4CallPrepAdvisoryLane[];
  signalReferences: typeof phase4SellerReviewSignalFamilies;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase4CallPrepAdvisoryPolicyFlags;
};

export const phase4CallPrepAdvisoryPolicyRules = [
  "Call-prep lanes may organize internal review only.",
  "Stop-contact safety, DNC, wrong-number, rejected, and sensitive-context signals outrank revenue interest.",
  "Question-prep notes must remain internal and must not become generated outreach, calling scripts for autonomous use, SMS, email, offer instructions, or contract terms.",
];

export const phase4CallPrepAdvisoryPolicyStopRules = [
  "Phase 4C is advisory policy only.",
  "No generated outreach, calling, message sending, provider activation, CRM mutation, seller-call mutation, follow-up creation, queue assignment, scraping, skip tracing, offer generation, contract generation, Phase 5 implementation, or go-live is authorized.",
];

export const phase4CallPrepAdvisoryPolicyAiBoundary = [
  "rank seller review context into advisory call-prep lanes for human review only",
  "prepare internal question-prep notes",
  "explain missing context and safety concerns",
  "do not invent property facts",
  "do not contact or call sellers",
  "do not send SMS or email",
  "do not mutate CRM or seller-call records",
  "do not create follow-ups or queues",
  "do not activate providers",
  "do not scrape or skip trace",
  "do not generate offers or contracts",
];

export const phase4CallPrepAdvisoryPolicyHumanBoundary = [
  "final call-prep judgment",
  "seller communication",
  "call execution",
  "negotiation",
  "property fact verification",
  "offer readiness judgment",
  "future implementation approval",
];

export const phase4CallPrepForbiddenDrift = [
  "generated outreach",
  "calling",
  "SMS sending",
  "email sending",
  "provider activation",
  "CRM mutation",
  "seller-call record mutation",
  "follow-up creation",
  "queue assignment",
  "scraping",
  "skip tracing",
  "invented property facts",
  "offer generation",
  "contract generation",
  "Phase 5 implementation",
  "go-live",
];

export function getPhase4CallPrepAdvisoryPolicy(): Phase4CallPrepAdvisoryPolicy {
  const result: Phase4CallPrepAdvisoryPolicy = {
    phase: "Phase 4: Seller Review & Call Prep",
    phaseStep: "Phase 4C — Call Prep Advisory Policy",
    previousStep: "Phase 4B — Seller Review Signal Audit",
    phaseDecision: "advisory_policy_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    sellerCallMutationDecision: "not_authorized",
    followUpCreationDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callingDecision: "not_authorized",
    queueDecision: "not_authorized",
    recommendedNextExactStep: "Phase 4D — Call Prep Implementation Scope",
    nextStageRecommendation: "Phase 4D — Call Prep Implementation Scope",
    advisoryLanes: phase4CallPrepAdvisoryLanes,
    signalReferences: phase4SellerReviewSignalFamilies,
    policyRules: phase4CallPrepAdvisoryPolicyRules,
    stopRules: phase4CallPrepAdvisoryPolicyStopRules,
    aiOperatorLeverageBoundary: phase4CallPrepAdvisoryPolicyAiBoundary,
    humanOwnershipBoundary: phase4CallPrepAdvisoryPolicyHumanBoundary,
    forbiddenDrift: phase4CallPrepForbiddenDrift,
    flags: phase4CallPrepAdvisoryPolicyFlags,
  };
  assertPhase4CallPrepAdvisoryPolicySafe(result);
  return result;
}

export function assertPhase4CallPrepAdvisoryPolicySafe(result: Phase4CallPrepAdvisoryPolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.advisoryLanes].flat().join(" ");
  const unsafePattern = /generated outreach is authorized|calling is authorized|message sending is authorized|provider activation is authorized|CRM mutation is authorized|seller-call mutation is authorized|follow-up creation is authorized|queue assignment is authorized|scraping is authorized|skip tracing is authorized|offer generation is authorized|contract generation is authorized|Phase 5 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 4C — Call Prep Advisory Policy") throw new Error("Phase 4C step must remain pinned.");
  if (result.previousStep !== "Phase 4B — Seller Review Signal Audit") throw new Error("Phase 4C previous step must remain Phase 4B.");
  if (result.phaseDecision !== "advisory_policy_only") throw new Error("Phase 4C must remain advisory-policy-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.sellerCallMutationDecision !== "not_authorized" ||
    result.followUpCreationDecision !== "not_authorized" ||
    result.outreachDecision !== "not_authorized" ||
    result.callingDecision !== "not_authorized" ||
    result.queueDecision !== "not_authorized"
  ) throw new Error("Phase 4C decisions must remain not_authorized.");
  if (result.advisoryLanes.join("|") !== phase4CallPrepAdvisoryLanes.join("|")) throw new Error("Phase 4C must include all advisory call-prep lanes.");
  if (result.signalReferences.join("|") !== phase4SellerReviewSignalFamilies.join("|")) throw new Error("Phase 4C must preserve Phase 4B signal references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 4C blocked flags cannot turn true.");
  if (!/internal review only/i.test(result.policyRules.join(" ")) || !/must not become generated outreach/i.test(result.policyRules.join(" "))) throw new Error("Phase 4C policy rules must block generated outreach and calling drift.");
  if (!/advisory policy only/i.test(result.stopRules.join(" "))) throw new Error("Phase 4C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not contact or call sellers/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 4C AI boundary is missing.");
  if (!/final call-prep judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/seller communication/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 4C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 4D — Call Prep Implementation Scope") throw new Error("Phase 4C must hand off to Phase 4D.");
  if (unsafePattern.test(text)) throw new Error("Phase 4C wording must not imply unsafe authorization.");
}

export function getPhase4CallPrepAdvisoryPolicySummary() {
  const result = getPhase4CallPrepAdvisoryPolicy();
  return `${result.phase} / ${result.phaseStep}: defines advisory call-prep lanes for highest acquisition ROI per operator hour and human-owned seller communication. No generated outreach, no calling, no SMS/email sending, no CRM mutation, no seller-call mutation, no scraping, no autonomous lead creation, no offer or contract generation, no Phase 5 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
