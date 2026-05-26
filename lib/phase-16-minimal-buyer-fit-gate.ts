import { phase16ManualBuyerFitLanes, phase16BuyerFitSummaryStates } from "./phase-16-manual-buyer-fit-policy";
import { phase16BuyerFitImplementationLanes } from "./phase-16-buyer-fit-implementation-scope";
import {
  phase16BuyerFitForbiddenDrift,
  phase16BuyerFitHumanBoundary,
} from "./phase-16-buyer-fit-intelligence-scope";

export const phase16MinimalBuyerFitGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  gateOnly: true,
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
  routingEnabled: false,
  queueEnabled: false,
  providerActivated: false,
  campaignEnabled: false,
  goLiveAuthorized: false,
  phase17ImplementationEnabled: false,
} as const;

export const phase16MinimalBuyerFitGateChecks = [
  "minimal_readonly_buyer_fit_package",
  "human_buyer_fit_judgment_required",
  "buyer_relationship_ownership_required",
  "deal_package_assignment_disposition_approval_required",
  "buyer_communication_compliance_review_required",
  "no_buyer_mutation_score_persistence_boundary_required",
  "no_outreach_matching_assignment_contract_go_live_boundary_required",
  "phase_16f_lockdown_ready",
] as const;

export type Phase16MinimalBuyerFitGate = {
  phase: "Phase 16: Buyer Fit Intelligence";
  phaseStep: "Phase 16E â€” Minimal Buyer Fit Gate";
  previousStep: "Phase 16D â€” Buyer Fit Implementation Scope";
  phaseDecision: "minimal_gate_only";
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
  providerDecision: "not_authorized";
  campaignDecision: "not_authorized";
  recommendedNextExactStep: "Phase 16F â€” Buyer Fit Final Lockdown";
  nextStageRecommendation: "Phase 16F â€” Buyer Fit Final Lockdown";
  gateChecks: typeof phase16MinimalBuyerFitGateChecks;
  implementationLaneReferences: typeof phase16BuyerFitImplementationLanes;
  policyLaneReferences: typeof phase16ManualBuyerFitLanes;
  summaryStateReferences: typeof phase16BuyerFitSummaryStates;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase16MinimalBuyerFitGateFlags;
};

export const phase16MinimalBuyerFitGateRules = [
  "Phase 16E can only decide whether a minimal read-only buyer-fit visibility package is worth carrying to final lockdown.",
  "A minimal package is only advisory if it preserves human buyer-fit judgment, buyer relationship ownership, deal-package approval, disposition judgment, assignment judgment, buyer communication approval, compliance review, and go-live boundaries.",
  "The gate cannot approve implementation, buyer mutation, score persistence, matching execution, buyer outreach, deal blasting, deal package sending, assignment generation, contract generation, campaigns, providers, Phase 17 implementation, or go-live.",
];

export const phase16MinimalBuyerFitGateStopRules = [
  "Phase 16E is a minimal gate only.",
  "No implementation, buyer outreach, seller outreach, SMS/email/calling, AI voice, deal blasting, buyer record mutation, buyer activity mutation, lead mutation, CRM mutation, disposition mutation, buyer score persistence, assignment agreement generation, contract generation, offer generation, deal package sending, automated buyer matching execution, routing, queues, assignments, reminders, runtime jobs, provider activation, external API/fetch/network behavior, scraping, skip tracing, campaign activation, ad activation, spend increases, audit writing, storage mutation, final buyer-fit decisions by AI, relationship decisions by AI, assignment decisions by AI, legal/compliance approval by AI, Phase 17 implementation, or go-live is authorized.",
];

export const phase16MinimalBuyerFitGateAiBoundary = [
  "summarize whether minimal read-only buyer-fit visibility is worth final lockdown review",
  "do not approve implementation, contact buyers or sellers, blast deals, mutate buyer records or activities, persist scores, mutate CRM or disposition records, generate assignments contracts or offers, send deal packages, execute matching, route work, create queues, activate providers, launch campaigns, approve Phase 17 implementation, or authorize go-live",
];

export function getPhase16MinimalBuyerFitGate(): Phase16MinimalBuyerFitGate {
  const result: Phase16MinimalBuyerFitGate = {
    phase: "Phase 16: Buyer Fit Intelligence",
    phaseStep: "Phase 16E â€” Minimal Buyer Fit Gate",
    previousStep: "Phase 16D â€” Buyer Fit Implementation Scope",
    phaseDecision: "minimal_gate_only",
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
    providerDecision: "not_authorized",
    campaignDecision: "not_authorized",
    recommendedNextExactStep: "Phase 16F â€” Buyer Fit Final Lockdown",
    nextStageRecommendation: "Phase 16F â€” Buyer Fit Final Lockdown",
    gateChecks: phase16MinimalBuyerFitGateChecks,
    implementationLaneReferences: phase16BuyerFitImplementationLanes,
    policyLaneReferences: phase16ManualBuyerFitLanes,
    summaryStateReferences: phase16BuyerFitSummaryStates,
    gateRules: phase16MinimalBuyerFitGateRules,
    stopRules: phase16MinimalBuyerFitGateStopRules,
    aiOperatorLeverageBoundary: phase16MinimalBuyerFitGateAiBoundary,
    humanOwnershipBoundary: phase16BuyerFitHumanBoundary,
    forbiddenDrift: phase16BuyerFitForbiddenDrift,
    flags: phase16MinimalBuyerFitGateFlags,
  };
  assertPhase16MinimalBuyerFitGateSafe(result);
  return result;
}

export function assertPhase16MinimalBuyerFitGateSafe(result: Phase16MinimalBuyerFitGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "gateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateChecks].flat().join(" ");
  const unsafePattern = /implementation is authorized|buyer mutation is authorized|score persistence is authorized|matching execution is authorized|buyer outreach is authorized|deal blasting is authorized|deal package sending is authorized|assignment generation is authorized|contract generation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 16E â€” Minimal Buyer Fit Gate") throw new Error("Phase 16E step must remain pinned.");
  if (result.previousStep !== "Phase 16D â€” Buyer Fit Implementation Scope") throw new Error("Phase 16E previous step must remain Phase 16D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 16E must remain minimal-gate-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 16E decisions must remain not_authorized.");
  if (result.gateChecks.join("|") !== phase16MinimalBuyerFitGateChecks.join("|")) throw new Error("Phase 16E gate checks are missing.");
  if (result.implementationLaneReferences.join("|") !== phase16BuyerFitImplementationLanes.join("|")) throw new Error("Phase 16E implementation lane references are missing.");
  if (result.policyLaneReferences.join("|") !== phase16ManualBuyerFitLanes.join("|")) throw new Error("Phase 16E policy lane references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 16E blocked flags cannot turn true.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 16E stop rules are missing.");
  if (!/do not approve implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 16E AI boundary is missing.");
  if (!/deal-package approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/buyer communication approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 16E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 16F â€” Buyer Fit Final Lockdown") throw new Error("Phase 16E must hand off to Phase 16F.");
  if (unsafePattern.test(text)) throw new Error("Phase 16E wording must not imply unsafe authorization.");
}

export function getPhase16MinimalBuyerFitGateSummary() {
  const result = getPhase16MinimalBuyerFitGate();
  return `${result.phase} / ${result.phaseStep}: gates a minimal read-only buyer-fit package for highest acquisition ROI per operator hour with human-owned buyer-fit judgment, buyer relationship ownership, deal-package approval, disposition judgment, assignment judgment, buyer communication approval, compliance review, and go-live approval. No buyer outreach, no deal blasting, no buyer mutation, no CRM mutation, no assignment/contract generation, no deal package sending, no go-live, and no Phase 17 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
