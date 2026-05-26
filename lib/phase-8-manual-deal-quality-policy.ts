import { phase8DealQualitySignalFamilies } from "./phase-8-deal-quality-signal-audit";

export const phase8ManualDealQualityPolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  propertyFactInventionEnabled: false,
  valuationFactInventionEnabled: false,
  repairFactInventionEnabled: false,
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
  autonomousLeadCreationEnabled: false,
  revenueExecutionEnabled: false,
  phase9ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase8DealQualityReviewLanes = [
  "stop_safety_or_governance_first",
  "missing_property_fact_review",
  "valuation_confidence_review",
  "repair_uncertainty_review",
  "title_or_closing_risk_review",
  "occupancy_or_access_review",
  "seller_realism_review",
  "buyer_fit_review",
  "spread_assumption_review",
  "deal_quality_bottleneck_review",
  "monitor_quality_baseline",
  "defer_until_verified",
] as const;

export const phase8DealQualitySummaryStates = [
  "quality_blocked",
  "missing_property_facts",
  "valuation_uncertain",
  "repair_risk_visible",
  "title_or_closing_risk",
  "occupancy_access_unknown",
  "seller_realism_unclear",
  "buyer_fit_unclear",
  "spread_assumption_only",
  "quality_review_ready",
  "monitor_only",
  "not_ready",
] as const;

export type Phase8ManualDealQualityPolicy = {
  phase: "Phase 8: Deal Quality Intelligence";
  phaseStep: "Phase 8C — Manual Deal Quality Review Policy";
  previousStep: "Phase 8B — Deal Quality Signal Audit";
  phaseDecision: "manual_policy_only";
  implementationDecision: "not_authorized";
  analyzerDecision: "not_authorized";
  scoreDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  offerDecision: "not_authorized";
  contractDecision: "not_authorized";
  buyerDecision: "not_authorized";
  sellerDecision: "not_authorized";
  closingDecision: "not_authorized";
  recommendedNextExactStep: "Phase 8D — Deal Quality Intelligence Implementation Scope";
  nextStageRecommendation: "Phase 8D — Deal Quality Intelligence Implementation Scope";
  dealQualityReviewLanes: typeof phase8DealQualityReviewLanes;
  summaryStates: typeof phase8DealQualitySummaryStates;
  signalReferences: typeof phase8DealQualitySignalFamilies;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase8ManualDealQualityPolicyFlags;
};

export const phase8ManualDealQualityPolicyRules = [
  "Phase 8C defines manual deal-quality review lanes and summary states as review labels only.",
  "Policy output may help a human compare property fact completeness, valuation confidence, repair uncertainty, title/closing risk, occupancy/access, seller realism, buyer fit, spread assumptions, and quality bottlenecks.",
  "Policy output cannot invent facts, mutate analyzer values, persist deal scores, mutate CRM records, generate offers, generate contracts, contact buyers or sellers, contact title, activate providers, or execute closing/revenue actions.",
];

export const phase8ManualDealQualityPolicyStopRules = [
  "Phase 8C is manual Deal Quality Review policy only.",
  "No property fact invention, valuation fact invention, repair fact invention, analyzer mutation, deal score persistence, CRM mutation, offer generation, contract generation, buyer outreach, seller outreach, closing execution, title contact, provider activation, scraping, skip tracing, revenue execution, Phase 9 implementation, or go-live is authorized.",
];

export const phase8ManualDealQualityPolicyAiBoundary = [
  "rank and explain deal-quality review lanes for human review only",
  "summarize property fact gaps valuation uncertainty repair uncertainty title/closing risk occupancy/access gaps seller realism buyer fit spread assumptions and bottlenecks",
  "do not invent property facts valuation facts or repair facts",
  "do not mutate analyzer values deal scores CRM records buyer records or closing records",
  "do not generate offers contracts assignments or closing documents",
  "do not contact sellers buyers title companies providers scrape or skip trace",
  "do not execute revenue or closing actions",
  "do not approve implementation",
];

export const phase8ManualDealQualityPolicyHumanBoundary = [
  "final deal quality judgment",
  "property fact verification",
  "valuation judgment",
  "repair judgment",
  "title review",
  "occupancy review",
  "seller realism review",
  "buyer-fit judgment",
  "offer contract closing decisions",
  "future implementation approval",
];

export const phase8ManualDealQualityPolicyForbiddenDrift = [
  "property fact invention",
  "valuation fact invention",
  "repair fact invention",
  "analyzer mutation",
  "deal score persistence",
  "CRM mutation",
  "offer generation",
  "contract generation",
  "buyer outreach",
  "seller outreach",
  "closing execution",
  "title contact",
  "provider activation",
  "scraping",
  "skip tracing",
  "revenue execution",
  "Phase 9 implementation",
  "go-live",
];

export function getPhase8ManualDealQualityPolicy(): Phase8ManualDealQualityPolicy {
  const result: Phase8ManualDealQualityPolicy = {
    phase: "Phase 8: Deal Quality Intelligence",
    phaseStep: "Phase 8C — Manual Deal Quality Review Policy",
    previousStep: "Phase 8B — Deal Quality Signal Audit",
    phaseDecision: "manual_policy_only",
    implementationDecision: "not_authorized",
    analyzerDecision: "not_authorized",
    scoreDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    offerDecision: "not_authorized",
    contractDecision: "not_authorized",
    buyerDecision: "not_authorized",
    sellerDecision: "not_authorized",
    closingDecision: "not_authorized",
    recommendedNextExactStep: "Phase 8D — Deal Quality Intelligence Implementation Scope",
    nextStageRecommendation: "Phase 8D — Deal Quality Intelligence Implementation Scope",
    dealQualityReviewLanes: phase8DealQualityReviewLanes,
    summaryStates: phase8DealQualitySummaryStates,
    signalReferences: phase8DealQualitySignalFamilies,
    policyRules: phase8ManualDealQualityPolicyRules,
    stopRules: phase8ManualDealQualityPolicyStopRules,
    aiOperatorLeverageBoundary: phase8ManualDealQualityPolicyAiBoundary,
    humanOwnershipBoundary: phase8ManualDealQualityPolicyHumanBoundary,
    forbiddenDrift: phase8ManualDealQualityPolicyForbiddenDrift,
    flags: phase8ManualDealQualityPolicyFlags,
  };
  assertPhase8ManualDealQualityPolicySafe(result);
  return result;
}

export function assertPhase8ManualDealQualityPolicySafe(result: Phase8ManualDealQualityPolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.dealQualityReviewLanes, result.summaryStates].flat().join(" ");
  const unsafePattern = /property fact invention is authorized|valuation fact invention is authorized|repair fact invention is authorized|analyzer mutation is authorized|deal score persistence is authorized|CRM mutation is authorized|offer generation is authorized|contract generation is authorized|buyer outreach is authorized|seller outreach is authorized|closing execution is authorized|title contact is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|revenue execution is authorized|Phase 9 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 8C — Manual Deal Quality Review Policy") throw new Error("Phase 8C step must remain pinned.");
  if (result.previousStep !== "Phase 8B — Deal Quality Signal Audit") throw new Error("Phase 8C previous step must remain Phase 8B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 8C must remain manual-policy-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 8C decisions must remain not_authorized.");
  if (result.dealQualityReviewLanes.join("|") !== phase8DealQualityReviewLanes.join("|")) throw new Error("Phase 8C must include all deal-quality review lanes.");
  if (result.summaryStates.join("|") !== phase8DealQualitySummaryStates.join("|")) throw new Error("Phase 8C must include all summary states.");
  if (result.signalReferences.join("|") !== phase8DealQualitySignalFamilies.join("|")) throw new Error("Phase 8C must preserve signal references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 8C blocked flags cannot turn true.");
  if (!/review labels only/i.test(result.policyRules.join(" ")) || !/buyer fit/i.test(result.policyRules.join(" "))) throw new Error("Phase 8C policy rules are missing.");
  if (!/policy only/i.test(result.stopRules.join(" ")) || !/No property fact invention/i.test(result.stopRules.join(" "))) throw new Error("Phase 8C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not invent property facts/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 8C AI boundary is missing.");
  if (!/final deal quality judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/property fact verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 8C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 8D — Deal Quality Intelligence Implementation Scope") throw new Error("Phase 8C must hand off to Phase 8D.");
  if (unsafePattern.test(text)) throw new Error("Phase 8C wording must not imply unsafe authorization.");
}

export function getPhase8ManualDealQualityPolicySummary() {
  const result = getPhase8ManualDealQualityPolicy();
  return `${result.phase} / ${result.phaseStep}: manual deal-quality lanes and summary states for highest acquisition ROI per operator hour. Human-owned deal quality judgment, property fact verification, valuation judgment, repair judgment, and buyer-fit judgment remain required. No invented property facts, no analyzer mutation, no CRM mutation, no outreach, no offer or contract generation, no closing execution, and no Phase 9 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
