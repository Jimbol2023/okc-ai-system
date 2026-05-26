import { phase8DealQualityImplementationLanes } from "./phase-8-deal-quality-implementation-scope";

export const phase8MinimalDealQualityGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  gateOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  propertyFactInventionEnabled: false,
  analyzerMutationEnabled: false,
  dealScorePersistenceEnabled: false,
  crmMutationEnabled: false,
  offerGenerationEnabled: false,
  contractGenerationEnabled: false,
  buyerOutreachEnabled: false,
  sellerOutreachEnabled: false,
  closingExecutionEnabled: false,
  titleContactEnabled: false,
  providerActivated: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  revenueExecutionEnabled: false,
  phase9ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase8MinimalDealQualityGateLane =
  | "minimal_readonly_deal_quality_package"
  | "human_property_fact_verification_review"
  | "valuation_repair_confidence_review"
  | "title_occupancy_seller_buyer_fit_review"
  | "blocked_mutation_offer_contract_execution_paths"
  | "phase_8f_lockdown_requirements";

export const phase8MinimalDealQualityGateLanes: Phase8MinimalDealQualityGateLane[] = [
  "minimal_readonly_deal_quality_package",
  "human_property_fact_verification_review",
  "valuation_repair_confidence_review",
  "title_occupancy_seller_buyer_fit_review",
  "blocked_mutation_offer_contract_execution_paths",
  "phase_8f_lockdown_requirements",
];

export type Phase8MinimalDealQualityGate = {
  phase: "Phase 8: Deal Quality Intelligence";
  phaseStep: "Phase 8E — Minimal Deal Quality Intelligence Gate";
  previousStep: "Phase 8D — Deal Quality Intelligence Implementation Scope";
  phaseDecision: "minimal_gate_only";
  implementationDecision: "not_authorized";
  analyzerDecision: "not_authorized";
  scoreDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  offerDecision: "not_authorized";
  contractDecision: "not_authorized";
  buyerDecision: "not_authorized";
  sellerDecision: "not_authorized";
  closingDecision: "not_authorized";
  recommendedNextExactStep: "Phase 8F — Deal Quality Final Lockdown";
  nextStageRecommendation: "Phase 8F — Deal Quality Final Lockdown";
  gateLanes: Phase8MinimalDealQualityGateLane[];
  implementationScopeReferences: typeof phase8DealQualityImplementationLanes;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase8MinimalDealQualityGateFlags;
};

export const phase8MinimalDealQualityGateRules = [
  "Phase 8E gates whether a minimal read-only deal-quality package is worth considering later.",
  "The gate requires human property fact verification, valuation/repair confidence review, and title/occupancy/seller/buyer-fit judgment before any future build is considered.",
  "The gate cannot authorize analyzer mutation, deal score persistence, CRM mutation, offer generation, contract generation, buyer or seller outreach, title contact, closing execution, providers, scraping, skip tracing, revenue execution, or go-live.",
];

export const phase8MinimalDealQualityGateStopRules = [
  "Phase 8E is a minimal gate only.",
  "No implementation, property fact invention, analyzer mutation, deal score persistence, CRM mutation, offer generation, contract generation, buyer outreach, seller outreach, closing execution, title contact, provider activation, scraping, skip tracing, revenue execution, Phase 9 implementation, or go-live is authorized.",
];

export const phase8MinimalDealQualityGateAiBoundary = [
  "summarize minimal deal-quality gate readiness for human review only",
  "explain whether deal-quality visibility would improve operator ROI clarity",
  "do not invent facts mutate analyzer values persist scores mutate CRM generate offers generate contracts contact anyone or execute closing",
  "do not activate providers scrape skip trace automate or execute revenue actions",
  "do not approve implementation",
];

export const phase8MinimalDealQualityGateHumanBoundary = [
  "minimal deal-quality gate approval",
  "property fact verification",
  "valuation and repair confidence judgment",
  "title occupancy seller realism buyer-fit judgment",
  "offer contract closing decisions",
  "future implementation approval",
];

export function getPhase8MinimalDealQualityGate(): Phase8MinimalDealQualityGate {
  const result: Phase8MinimalDealQualityGate = {
    phase: "Phase 8: Deal Quality Intelligence",
    phaseStep: "Phase 8E — Minimal Deal Quality Intelligence Gate",
    previousStep: "Phase 8D — Deal Quality Intelligence Implementation Scope",
    phaseDecision: "minimal_gate_only",
    implementationDecision: "not_authorized",
    analyzerDecision: "not_authorized",
    scoreDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    offerDecision: "not_authorized",
    contractDecision: "not_authorized",
    buyerDecision: "not_authorized",
    sellerDecision: "not_authorized",
    closingDecision: "not_authorized",
    recommendedNextExactStep: "Phase 8F — Deal Quality Final Lockdown",
    nextStageRecommendation: "Phase 8F — Deal Quality Final Lockdown",
    gateLanes: phase8MinimalDealQualityGateLanes,
    implementationScopeReferences: phase8DealQualityImplementationLanes,
    gateRules: phase8MinimalDealQualityGateRules,
    stopRules: phase8MinimalDealQualityGateStopRules,
    aiOperatorLeverageBoundary: phase8MinimalDealQualityGateAiBoundary,
    humanOwnershipBoundary: phase8MinimalDealQualityGateHumanBoundary,
    forbiddenDrift: phase8MinimalDealQualityGateStopRules,
    flags: phase8MinimalDealQualityGateFlags,
  };
  assertPhase8MinimalDealQualityGateSafe(result);
  return result;
}

export function assertPhase8MinimalDealQualityGateSafe(result: Phase8MinimalDealQualityGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "gateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateLanes].flat().join(" ");
  const unsafePattern = /implementation is authorized|property fact invention is authorized|analyzer mutation is authorized|deal score persistence is authorized|CRM mutation is authorized|offer generation is authorized|contract generation is authorized|buyer outreach is authorized|seller outreach is authorized|closing execution is authorized|title contact is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|revenue execution is authorized|Phase 9 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 8E — Minimal Deal Quality Intelligence Gate") throw new Error("Phase 8E step must remain pinned.");
  if (result.previousStep !== "Phase 8D — Deal Quality Intelligence Implementation Scope") throw new Error("Phase 8E previous step must remain Phase 8D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 8E must remain minimal-gate-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 8E decisions must remain not_authorized.");
  if (result.gateLanes.join("|") !== phase8MinimalDealQualityGateLanes.join("|")) throw new Error("Phase 8E must include all gate lanes.");
  if (result.implementationScopeReferences.join("|") !== phase8DealQualityImplementationLanes.join("|")) throw new Error("Phase 8E must preserve implementation scope references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 8E blocked flags cannot turn true.");
  if (!/minimal read-only deal-quality package/i.test(result.gateRules.join(" ")) || !/cannot authorize analyzer mutation/i.test(result.gateRules.join(" "))) throw new Error("Phase 8E gate rules are missing.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 8E stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not invent facts/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 8E AI boundary is missing.");
  if (!/minimal deal-quality gate approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/property fact verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 8E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 8F — Deal Quality Final Lockdown") throw new Error("Phase 8E must hand off to Phase 8F.");
  if (unsafePattern.test(text)) throw new Error("Phase 8E wording must not imply unsafe authorization.");
}

export function getPhase8MinimalDealQualityGateSummary() {
  const result = getPhase8MinimalDealQualityGate();
  return `${result.phase} / ${result.phaseStep}: minimal Deal Quality Intelligence gate for highest acquisition ROI per operator hour with human-owned property fact verification, valuation and repair confidence judgment, title/occupancy/seller/buyer-fit review, and offer/contract/closing decisions. No invented property facts, no analyzer mutation, no CRM mutation, no outreach, no offer or contract generation, no closing execution, no Phase 9 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
