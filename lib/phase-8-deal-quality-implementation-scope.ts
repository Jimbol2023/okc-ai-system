import { phase8DealQualityReviewLanes, phase8DealQualitySummaryStates } from "./phase-8-manual-deal-quality-policy";

export const phase8DealQualityImplementationScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  implementationScopeOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  propertyFactInventionEnabled: false,
  valuationFactInventionEnabled: false,
  repairFactInventionEnabled: false,
  analyzerMutationEnabled: false,
  dealScorePersistenceEnabled: false,
  crmMutationEnabled: false,
  taskCreationEnabled: false,
  queueCreationEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  offerGenerationEnabled: false,
  contractGenerationEnabled: false,
  buyerOutreachEnabled: false,
  sellerOutreachEnabled: false,
  closingExecutionEnabled: false,
  titleContactEnabled: false,
  providerActivated: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  phase9ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase8DealQualityImplementationLane =
  | "candidate_readonly_quality_visibility"
  | "candidate_property_fact_gap_visibility"
  | "candidate_valuation_repair_uncertainty_visibility"
  | "candidate_title_occupancy_buyer_fit_visibility"
  | "blocked_execution_mutation_offer_contract_paths"
  | "phase_8e_gate_requirements";

export const phase8DealQualityImplementationLanes: Phase8DealQualityImplementationLane[] = [
  "candidate_readonly_quality_visibility",
  "candidate_property_fact_gap_visibility",
  "candidate_valuation_repair_uncertainty_visibility",
  "candidate_title_occupancy_buyer_fit_visibility",
  "blocked_execution_mutation_offer_contract_paths",
  "phase_8e_gate_requirements",
];

export type Phase8DealQualityImplementationScope = {
  phase: "Phase 8: Deal Quality Intelligence";
  phaseStep: "Phase 8D — Deal Quality Intelligence Implementation Scope";
  previousStep: "Phase 8C — Manual Deal Quality Review Policy";
  phaseDecision: "implementation_scope_only";
  implementationDecision: "not_authorized";
  analyzerDecision: "not_authorized";
  scoreDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  offerDecision: "not_authorized";
  contractDecision: "not_authorized";
  buyerDecision: "not_authorized";
  sellerDecision: "not_authorized";
  closingDecision: "not_authorized";
  recommendedNextExactStep: "Phase 8E — Minimal Deal Quality Intelligence Gate";
  nextStageRecommendation: "Phase 8E — Minimal Deal Quality Intelligence Gate";
  implementationScopeLanes: Phase8DealQualityImplementationLane[];
  dealQualityLaneReferences: typeof phase8DealQualityReviewLanes;
  summaryStateReferences: typeof phase8DealQualitySummaryStates;
  scopeRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase8DealQualityImplementationScopeFlags;
};

export const phase8DealQualityImplementationScopeRules = [
  "Phase 8D scopes possible future read-only deal-quality visibility only.",
  "No implementation execution, property fact invention, valuation fact invention, repair fact invention, analyzer mutation, deal score persistence, CRM mutation, task creation, queue creation, routing, assignment, offer generation, contract generation, buyer outreach, seller outreach, closing execution, title contact, provider activation, scraping, skip tracing, Phase 9 implementation, or go-live is authorized.",
  "Any future build must keep deal quality claims advisory and assumption-labeled until human verification.",
];

export const phase8DealQualityImplementationScopeStopRules = [
  "Phase 8D is implementation scope only, not implementation execution.",
  "Candidate work cannot create UI, routes, APIs, schema, storage writes, audit writes, analyzer writes, deal score writes, CRM writes, tasks, queues, routing, assignments, offers, contracts, buyer outreach, seller outreach, title contact, closing execution, providers, runtime jobs, or revenue execution.",
];

export const phase8DealQualityImplementationScopeAiBoundary = [
  "explain future read-only deal-quality visibility scope for human review only",
  "map deal-quality lanes and summary states to candidate internal review surfaces",
  "do not implement UI routes APIs schema storage audit analyzer score or CRM writes",
  "do not invent property valuation or repair facts",
  "do not create offers contracts tasks queues routing assignments or notifications",
  "do not contact sellers buyers title companies or providers",
  "do not scrape or skip trace",
  "do not execute revenue or closing actions",
  "do not approve implementation",
];

export const phase8DealQualityImplementationScopeHumanBoundary = [
  "final implementation approval",
  "deal quality judgment",
  "property fact verification",
  "valuation judgment",
  "repair judgment",
  "title occupancy seller realism review",
  "buyer-fit judgment",
  "offer contract closing decisions",
  "future Phase 9 transition approval",
];

export function getPhase8DealQualityImplementationScope(): Phase8DealQualityImplementationScope {
  const result: Phase8DealQualityImplementationScope = {
    phase: "Phase 8: Deal Quality Intelligence",
    phaseStep: "Phase 8D — Deal Quality Intelligence Implementation Scope",
    previousStep: "Phase 8C — Manual Deal Quality Review Policy",
    phaseDecision: "implementation_scope_only",
    implementationDecision: "not_authorized",
    analyzerDecision: "not_authorized",
    scoreDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    offerDecision: "not_authorized",
    contractDecision: "not_authorized",
    buyerDecision: "not_authorized",
    sellerDecision: "not_authorized",
    closingDecision: "not_authorized",
    recommendedNextExactStep: "Phase 8E — Minimal Deal Quality Intelligence Gate",
    nextStageRecommendation: "Phase 8E — Minimal Deal Quality Intelligence Gate",
    implementationScopeLanes: phase8DealQualityImplementationLanes,
    dealQualityLaneReferences: phase8DealQualityReviewLanes,
    summaryStateReferences: phase8DealQualitySummaryStates,
    scopeRules: phase8DealQualityImplementationScopeRules,
    stopRules: phase8DealQualityImplementationScopeStopRules,
    aiOperatorLeverageBoundary: phase8DealQualityImplementationScopeAiBoundary,
    humanOwnershipBoundary: phase8DealQualityImplementationScopeHumanBoundary,
    forbiddenDrift: phase8DealQualityImplementationScopeRules,
    flags: phase8DealQualityImplementationScopeFlags,
  };
  assertPhase8DealQualityImplementationScopeSafe(result);
  return result;
}

export function assertPhase8DealQualityImplementationScopeSafe(result: Phase8DealQualityImplementationScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "implementationScopeOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.implementationScopeLanes].flat().join(" ");
  const unsafePattern = /implementation execution is authorized|property fact invention is authorized|analyzer mutation is authorized|deal score persistence is authorized|CRM mutation is authorized|offer generation is authorized|contract generation is authorized|buyer outreach is authorized|seller outreach is authorized|closing execution is authorized|title contact is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|Phase 9 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 8D — Deal Quality Intelligence Implementation Scope") throw new Error("Phase 8D step must remain pinned.");
  if (result.previousStep !== "Phase 8C — Manual Deal Quality Review Policy") throw new Error("Phase 8D previous step must remain Phase 8C.");
  if (result.phaseDecision !== "implementation_scope_only") throw new Error("Phase 8D must remain implementation-scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 8D decisions must remain not_authorized.");
  if (result.implementationScopeLanes.join("|") !== phase8DealQualityImplementationLanes.join("|")) throw new Error("Phase 8D must include all implementation scope lanes.");
  if (result.dealQualityLaneReferences.join("|") !== phase8DealQualityReviewLanes.join("|")) throw new Error("Phase 8D must preserve deal-quality lane references.");
  if (result.summaryStateReferences.join("|") !== phase8DealQualitySummaryStates.join("|")) throw new Error("Phase 8D must preserve summary state references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 8D blocked flags cannot turn true.");
  if (!/No implementation execution/i.test(result.scopeRules.join(" ")) || !/offer generation/i.test(result.scopeRules.join(" "))) throw new Error("Phase 8D scope rules are missing.");
  if (!/implementation scope only/i.test(result.stopRules.join(" ")) || !/analyzer writes/i.test(result.stopRules.join(" "))) throw new Error("Phase 8D stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement UI routes APIs schema storage audit analyzer score or CRM writes/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 8D AI boundary is missing.");
  if (!/final implementation approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/property fact verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 8D human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 8E — Minimal Deal Quality Intelligence Gate") throw new Error("Phase 8D must hand off to Phase 8E.");
  if (unsafePattern.test(text)) throw new Error("Phase 8D wording must not imply unsafe authorization.");
}

export function getPhase8DealQualityImplementationScopeSummary() {
  const result = getPhase8DealQualityImplementationScope();
  return `${result.phase} / ${result.phaseStep}: scopes possible future read-only deal-quality visibility for highest acquisition ROI per operator hour with human-owned deal quality judgment, property fact verification, valuation and repair judgment, and implementation approval. No implementation execution, no invented property facts, no analyzer mutation, no deal score persistence, no CRM mutation, no offer or contract generation, no closing execution, no Phase 9 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
