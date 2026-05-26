import { phase16ManualBuyerFitLanes, phase16BuyerFitSummaryStates } from "./phase-16-manual-buyer-fit-policy";
import { phase16BuyerFitSignalFamilies } from "./phase-16-buyer-fit-signal-audit";
import {
  phase16BuyerFitForbiddenDrift,
  phase16BuyerFitHumanBoundary,
} from "./phase-16-buyer-fit-intelligence-scope";

export const phase16BuyerFitImplementationScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  implementationScopeOnly: true,
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
  spendIncreaseEnabled: false,
  goLiveAuthorized: false,
  phase17ImplementationEnabled: false,
} as const;

export const phase16BuyerFitImplementationLanes = [
  "candidate_readonly_buyer_profile_visibility",
  "candidate_buyer_demand_and_fit_signal_visibility",
  "candidate_deal_package_and_assignment_readiness_visibility",
  "candidate_funding_relationship_disposition_risk_visibility",
  "deferred_human_approved_future_buyer_fit_scope_only",
  "blocked_outreach_mutation_matching_assignment_contract_execution_paths",
] as const;

export type Phase16BuyerFitImplementationScope = {
  phase: "Phase 16: Buyer Fit Intelligence";
  phaseStep: "Phase 16D â€” Buyer Fit Implementation Scope";
  previousStep: "Phase 16C â€” Manual Buyer Fit Advisory Policy";
  phaseDecision: "implementation_scope_only";
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
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 16E â€” Minimal Buyer Fit Gate";
  nextStageRecommendation: "Phase 16E â€” Minimal Buyer Fit Gate";
  implementationLanes: typeof phase16BuyerFitImplementationLanes;
  signalReferences: typeof phase16BuyerFitSignalFamilies;
  policyLaneReferences: typeof phase16ManualBuyerFitLanes;
  summaryStateReferences: typeof phase16BuyerFitSummaryStates;
  scopeRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase16BuyerFitImplementationScopeFlags;
};

export const phase16BuyerFitImplementationScopeRules = [
  "Phase 16D may describe a future read-only buyer-fit visibility package, but cannot execute implementation, buyer mutation, score persistence, matching, routing, queues, outreach, deal package sending, assignment generation, contract generation, providers, campaigns, spend changes, or go-live.",
  "Future candidates must remain limited to readonly buyer profile visibility, buyer demand fit visibility, deal package readiness visibility, assignment readiness visibility, funding verification visibility, relationship priority visibility, and disposition risk visibility.",
  "Any actual buyer-fit implementation is deferred until explicit human approval in a future authorized step.",
];

export const phase16BuyerFitImplementationScopeStopRules = [
  "Phase 16D scopes a possible future implementation only.",
  "No implementation execution, buyer outreach, seller outreach, SMS/email/calling, AI voice, deal blasting, buyer record mutation, buyer activity mutation, lead mutation, CRM mutation, disposition mutation, buyer score persistence, assignment agreement generation, contract generation, offer generation, deal package sending, automated buyer matching execution, routing, queues, assignments, reminders, runtime jobs, provider activation, external API/fetch/network behavior, scraping, skip tracing, campaign activation, ad activation, spend increases, audit writing, storage mutation, final buyer-fit decisions by AI, relationship decisions by AI, assignment decisions by AI, legal/compliance approval by AI, Phase 17 implementation, or go-live is authorized.",
];

export const phase16BuyerFitImplementationScopeAiBoundary = [
  "explain future read-only buyer-fit implementation scope for human review only",
  "do not execute implementation, contact buyers or sellers, blast deals, mutate buyer records or activities, persist scores, mutate CRM leads or disposition records, generate assignments contracts or offers, send deal packages, execute matching, route work, create queues, activate providers, launch campaigns, approve Phase 17 implementation, or authorize go-live",
];

export function getPhase16BuyerFitImplementationScope(): Phase16BuyerFitImplementationScope {
  const result: Phase16BuyerFitImplementationScope = {
    phase: "Phase 16: Buyer Fit Intelligence",
    phaseStep: "Phase 16D â€” Buyer Fit Implementation Scope",
    previousStep: "Phase 16C â€” Manual Buyer Fit Advisory Policy",
    phaseDecision: "implementation_scope_only",
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
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 16E â€” Minimal Buyer Fit Gate",
    nextStageRecommendation: "Phase 16E â€” Minimal Buyer Fit Gate",
    implementationLanes: phase16BuyerFitImplementationLanes,
    signalReferences: phase16BuyerFitSignalFamilies,
    policyLaneReferences: phase16ManualBuyerFitLanes,
    summaryStateReferences: phase16BuyerFitSummaryStates,
    scopeRules: phase16BuyerFitImplementationScopeRules,
    stopRules: phase16BuyerFitImplementationScopeStopRules,
    aiOperatorLeverageBoundary: phase16BuyerFitImplementationScopeAiBoundary,
    humanOwnershipBoundary: phase16BuyerFitHumanBoundary,
    forbiddenDrift: phase16BuyerFitForbiddenDrift,
    flags: phase16BuyerFitImplementationScopeFlags,
  };
  assertPhase16BuyerFitImplementationScopeSafe(result);
  return result;
}

export function assertPhase16BuyerFitImplementationScopeSafe(result: Phase16BuyerFitImplementationScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "implementationScopeOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.implementationLanes].flat().join(" ");
  const unsafePattern = /implementation execution is authorized|buyer mutation is authorized|score persistence is authorized|matching is authorized|routing is authorized|queues are authorized|outreach is authorized|deal package sending is authorized|assignment generation is authorized|contract generation is authorized|providers are authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 16D â€” Buyer Fit Implementation Scope") throw new Error("Phase 16D step must remain pinned.");
  if (result.previousStep !== "Phase 16C â€” Manual Buyer Fit Advisory Policy") throw new Error("Phase 16D previous step must remain Phase 16C.");
  if (result.phaseDecision !== "implementation_scope_only") throw new Error("Phase 16D must remain implementation-scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 16D decisions must remain not_authorized.");
  if (result.implementationLanes.join("|") !== phase16BuyerFitImplementationLanes.join("|")) throw new Error("Phase 16D implementation lanes are missing.");
  if (result.policyLaneReferences.join("|") !== phase16ManualBuyerFitLanes.join("|")) throw new Error("Phase 16D policy lane references are missing.");
  if (result.summaryStateReferences.join("|") !== phase16BuyerFitSummaryStates.join("|")) throw new Error("Phase 16D summary state references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 16D blocked flags cannot turn true.");
  if (!/possible future implementation only/i.test(result.stopRules.join(" "))) throw new Error("Phase 16D stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not execute implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 16D AI boundary is missing.");
  if (!/future implementation approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 16D human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 16E â€” Minimal Buyer Fit Gate") throw new Error("Phase 16D must hand off to Phase 16E.");
  if (unsafePattern.test(text)) throw new Error("Phase 16D wording must not imply unsafe authorization.");
}

export function getPhase16BuyerFitImplementationScopeSummary() {
  const result = getPhase16BuyerFitImplementationScope();
  return `${result.phase} / ${result.phaseStep}: scopes a possible future read-only buyer-fit visibility package for highest acquisition ROI per operator hour with human-owned buyer-fit judgment, buyer relationship ownership, deal-package approval, disposition judgment, assignment judgment, buyer communication approval, compliance review, and future implementation approval. No buyer outreach, no deal blasting, no buyer mutation, no CRM mutation, no assignment/contract generation, no deal package sending, no go-live, and no Phase 17 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
