import { phase16BuyerFitSignalFamilies } from "./phase-16-buyer-fit-signal-audit";
import {
  phase16BuyerFitForbiddenDrift,
  phase16BuyerFitHumanBoundary,
} from "./phase-16-buyer-fit-intelligence-scope";

export const phase16ManualBuyerFitPolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  buyerRecordMutationEnabled: false,
  buyerActivityMutationEnabled: false,
  leadMutationEnabled: false,
  crmMutationEnabled: false,
  dispositionMutationEnabled: false,
  matchingExecutionEnabled: false,
  scorePersistenceEnabled: false,
  assignmentGenerationEnabled: false,
  contractGenerationEnabled: false,
  dealPackageSendingEnabled: false,
  buyerOutreachEnabled: false,
  sellerOutreachEnabled: false,
  routingEnabled: false,
  queueEnabled: false,
  campaignEnabled: false,
  providerActivated: false,
  goLiveAuthorized: false,
  phase17ImplementationEnabled: false,
} as const;

export const phase16ManualBuyerFitLanes = [
  "stop_buyer_contact_safety_first",
  "buyer_profile_completeness_review",
  "buyer_demand_alignment_review",
  "deal_package_readiness_review",
  "property_type_fit_review",
  "price_range_fit_review",
  "location_fit_review",
  "financing_and_proof_of_funds_review",
  "assignment_readiness_review",
  "buyer_relationship_priority_review",
  "disposition_risk_review",
  "defer_until_human_verified",
] as const;

export const phase16BuyerFitSummaryStates = [
  "buyer_fit_blocked",
  "buyer_profile_incomplete",
  "buyer_demand_unclear",
  "deal_package_not_ready",
  "property_type_fit_visible",
  "price_range_fit_visible",
  "location_fit_visible",
  "funding_verification_needed",
  "assignment_readiness_review_only",
  "buyer_relationship_review_only",
  "disposition_risk_visible",
  "not_ready",
] as const;

export type Phase16ManualBuyerFitPolicy = {
  phase: "Phase 16: Buyer Fit Intelligence";
  phaseStep: "Phase 16C â€” Manual Buyer Fit Advisory Policy";
  previousStep: "Phase 16B â€” Buyer Fit Signal Audit";
  phaseDecision: "manual_policy_only";
  implementationDecision: "not_authorized";
  buyerRecordDecision: "not_authorized";
  buyerActivityDecision: "not_authorized";
  leadDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  dispositionDecision: "not_authorized";
  matchingDecision: "not_authorized";
  scoreDecision: "not_authorized";
  assignmentDecision: "not_authorized";
  contractDecision: "not_authorized";
  dealPackageDecision: "not_authorized";
  outreachDecision: "not_authorized";
  routingDecision: "not_authorized";
  queueDecision: "not_authorized";
  campaignDecision: "not_authorized";
  providerDecision: "not_authorized";
  recommendedNextExactStep: "Phase 16D â€” Buyer Fit Implementation Scope";
  nextStageRecommendation: "Phase 16D â€” Buyer Fit Implementation Scope";
  signalReferences: typeof phase16BuyerFitSignalFamilies;
  buyerFitLanes: typeof phase16ManualBuyerFitLanes;
  summaryStates: typeof phase16BuyerFitSummaryStates;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase16ManualBuyerFitPolicyFlags;
};

export const phase16ManualBuyerFitPolicyRules = [
  "Manual buyer-fit lanes are advisory visibility only and cannot trigger buyer outreach, deal blasting, buyer mutation, score persistence, assignment or contract generation, deal package sending, routing, queues, campaigns, providers, or go-live.",
  "Buyer profile completeness, demand alignment, deal package readiness, fit signals, funding verification, assignment readiness, buyer relationship priority, and disposition risk remain human-owned review gates.",
  "The highest-aROI policy is to stop buyer-contact safety risk first, then focus human review on the best-fit buyers for verified deal packages.",
];

export const phase16ManualBuyerFitPolicyStopRules = [
  "Phase 16C defines manual buyer-fit advisory lanes and summary states only.",
  "No implementation, buyer outreach, seller outreach, SMS/email/calling, AI voice, deal blasting, buyer record mutation, buyer activity mutation, lead mutation, CRM mutation, disposition mutation, buyer score persistence, assignment agreement generation, contract generation, offer generation, deal package sending, automated buyer matching execution, routing, queues, assignments, reminders, runtime jobs, provider activation, external API/fetch/network behavior, scraping, skip tracing, campaign activation, ad activation, spend increases, audit writing, storage mutation, final buyer-fit decisions by AI, relationship decisions by AI, assignment decisions by AI, legal/compliance approval by AI, Phase 17 implementation, or go-live is authorized.",
];

export const phase16ManualBuyerFitPolicyAiBoundary = [
  "rank and explain manual buyer-fit lanes for human review only",
  "do not contact buyers or sellers, blast deals, mutate buyer records or activities, persist scores, mutate leads CRM or disposition records, generate assignments contracts or offers, send deal packages, execute matching, route work, create queues, activate providers, launch campaigns, approve Phase 17 implementation, or authorize go-live",
];

export function getPhase16ManualBuyerFitPolicy(): Phase16ManualBuyerFitPolicy {
  const result: Phase16ManualBuyerFitPolicy = {
    phase: "Phase 16: Buyer Fit Intelligence",
    phaseStep: "Phase 16C â€” Manual Buyer Fit Advisory Policy",
    previousStep: "Phase 16B â€” Buyer Fit Signal Audit",
    phaseDecision: "manual_policy_only",
    implementationDecision: "not_authorized",
    buyerRecordDecision: "not_authorized",
    buyerActivityDecision: "not_authorized",
    leadDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    dispositionDecision: "not_authorized",
    matchingDecision: "not_authorized",
    scoreDecision: "not_authorized",
    assignmentDecision: "not_authorized",
    contractDecision: "not_authorized",
    dealPackageDecision: "not_authorized",
    outreachDecision: "not_authorized",
    routingDecision: "not_authorized",
    queueDecision: "not_authorized",
    campaignDecision: "not_authorized",
    providerDecision: "not_authorized",
    recommendedNextExactStep: "Phase 16D â€” Buyer Fit Implementation Scope",
    nextStageRecommendation: "Phase 16D â€” Buyer Fit Implementation Scope",
    signalReferences: phase16BuyerFitSignalFamilies,
    buyerFitLanes: phase16ManualBuyerFitLanes,
    summaryStates: phase16BuyerFitSummaryStates,
    policyRules: phase16ManualBuyerFitPolicyRules,
    stopRules: phase16ManualBuyerFitPolicyStopRules,
    aiOperatorLeverageBoundary: phase16ManualBuyerFitPolicyAiBoundary,
    humanOwnershipBoundary: phase16BuyerFitHumanBoundary,
    forbiddenDrift: phase16BuyerFitForbiddenDrift,
    flags: phase16ManualBuyerFitPolicyFlags,
  };
  assertPhase16ManualBuyerFitPolicySafe(result);
  return result;
}

export function assertPhase16ManualBuyerFitPolicySafe(result: Phase16ManualBuyerFitPolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.buyerFitLanes, result.summaryStates].flat().join(" ");
  const unsafePattern = /buyer outreach is authorized|deal blasting is authorized|buyer mutation is authorized|score persistence is authorized|assignment .*generation is authorized|contract generation is authorized|deal package sending is authorized|routing is authorized|queues are authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 16C â€” Manual Buyer Fit Advisory Policy") throw new Error("Phase 16C step must remain pinned.");
  if (result.previousStep !== "Phase 16B â€” Buyer Fit Signal Audit") throw new Error("Phase 16C previous step must remain Phase 16B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 16C must remain manual-policy-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 16C decisions must remain not_authorized.");
  if (result.buyerFitLanes.join("|") !== phase16ManualBuyerFitLanes.join("|")) throw new Error("Phase 16C buyer-fit lanes are missing.");
  if (result.summaryStates.join("|") !== phase16BuyerFitSummaryStates.join("|")) throw new Error("Phase 16C summary states are missing.");
  if (result.signalReferences.join("|") !== phase16BuyerFitSignalFamilies.join("|")) throw new Error("Phase 16C signal references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 16C blocked flags cannot turn true.");
  if (!/advisory lanes and summary states only/i.test(result.stopRules.join(" "))) throw new Error("Phase 16C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not contact buyers/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 16C AI boundary is missing.");
  if (!/assignment judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/buyer communication approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 16C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 16D â€” Buyer Fit Implementation Scope") throw new Error("Phase 16C must hand off to Phase 16D.");
  if (unsafePattern.test(text)) throw new Error("Phase 16C wording must not imply unsafe authorization.");
}

export function getPhase16ManualBuyerFitPolicySummary() {
  const result = getPhase16ManualBuyerFitPolicy();
  return `${result.phase} / ${result.phaseStep}: defines manual buyer-fit lanes and summary states for highest acquisition ROI per operator hour with human-owned buyer-fit judgment, buyer relationship ownership, deal-package approval, disposition judgment, assignment judgment, buyer communication approval, and compliance review. No buyer outreach, no deal blasting, no buyer mutation, no CRM mutation, no assignment/contract generation, no deal package sending, no go-live, and no Phase 17 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
