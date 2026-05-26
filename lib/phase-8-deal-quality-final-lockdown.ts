import { phase8MinimalDealQualityGateLanes } from "./phase-8-minimal-deal-quality-gate";

export const phase8DealQualityFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
  operatorLeverageOnly: true,
  phase8LockdownEnforced: true,
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

export type Phase8DealQualityFinalLockdown = {
  phase: "Phase 8: Deal Quality Intelligence";
  phaseStep: "Phase 8F — Deal Quality Final Lockdown";
  previousStep: "Phase 8E — Minimal Deal Quality Intelligence Gate";
  phaseDecision: "final_lockdown_only";
  implementationDecision: "not_authorized";
  analyzerDecision: "not_authorized";
  scoreDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  offerDecision: "not_authorized";
  contractDecision: "not_authorized";
  buyerDecision: "not_authorized";
  sellerDecision: "not_authorized";
  closingDecision: "not_authorized";
  recommendedNextExactStep: "Phase 9 — AI-Assisted Lead Discovery";
  nextStageRecommendation: "Phase 9 — AI-Assisted Lead Discovery";
  finalLockdownRules: string[];
  phase8eGateReferences: typeof phase8MinimalDealQualityGateLanes;
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase8DealQualityFinalLockdownFlags;
};

export const phase8DealQualityFinalLockdownRules = [
  "Phase 8F locks Phase 8 as read-only Deal Quality Intelligence planning only.",
  "Phase 8F authorizes no implementation, property fact invention, valuation fact invention, repair fact invention, analyzer mutation, deal score persistence, CRM mutation, offer generation, contract generation, buyer outreach, seller outreach, closing execution, title contact, provider activation, scraping, skip tracing, autonomous lead creation, revenue execution, Phase 9 implementation, or go-live.",
  "Phase 8F can recommend Phase 9 — AI-Assisted Lead Discovery as the next roadmap phase only after human review.",
];

export const phase8DealQualityFinalLockdownAiBoundary = [
  "summarize Phase 8 closeout for human review only",
  "summarize Phase 8A through Phase 8E continuity",
  "prepare Phase 9 transition notes for human review",
  "do not invent property valuation or repair facts",
  "do not mutate analyzer deal score CRM buyer or closing records",
  "do not generate offers contracts assignments or closing documents",
  "do not contact sellers buyers title companies or providers",
  "do not scrape or skip trace",
  "do not execute revenue or closing actions",
  "do not approve Phase 9 implementation",
  "do not authorize go-live",
];

export const phase8DealQualityFinalLockdownHumanBoundary = [
  "Phase 8 closeout approval",
  "Phase 9 transition approval",
  "deal quality judgment",
  "property fact verification",
  "valuation judgment",
  "repair judgment",
  "title occupancy seller realism review",
  "buyer-fit judgment",
  "offer contract closing decisions",
  "future implementation approval",
];

export const phase8DealQualityFinalLockdownForbiddenDrift = [
  "implementation",
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
  "autonomous lead creation",
  "revenue execution",
  "Phase 9 implementation",
  "go-live",
];

export function getPhase8DealQualityFinalLockdown(): Phase8DealQualityFinalLockdown {
  const result: Phase8DealQualityFinalLockdown = {
    phase: "Phase 8: Deal Quality Intelligence",
    phaseStep: "Phase 8F — Deal Quality Final Lockdown",
    previousStep: "Phase 8E — Minimal Deal Quality Intelligence Gate",
    phaseDecision: "final_lockdown_only",
    implementationDecision: "not_authorized",
    analyzerDecision: "not_authorized",
    scoreDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    offerDecision: "not_authorized",
    contractDecision: "not_authorized",
    buyerDecision: "not_authorized",
    sellerDecision: "not_authorized",
    closingDecision: "not_authorized",
    recommendedNextExactStep: "Phase 9 — AI-Assisted Lead Discovery",
    nextStageRecommendation: "Phase 9 — AI-Assisted Lead Discovery",
    finalLockdownRules: phase8DealQualityFinalLockdownRules,
    phase8eGateReferences: phase8MinimalDealQualityGateLanes,
    aiOperatorLeverageBoundary: phase8DealQualityFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase8DealQualityFinalLockdownHumanBoundary,
    forbiddenDrift: phase8DealQualityFinalLockdownForbiddenDrift,
    flags: phase8DealQualityFinalLockdownFlags,
  };
  assertPhase8DealQualityFinalLockdownSafe(result);
  return result;
}

export function assertPhase8DealQualityFinalLockdownSafe(result: Phase8DealQualityFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly", "phase8LockdownEnforced"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.finalLockdownRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|property fact invention is authorized|valuation fact invention is authorized|repair fact invention is authorized|analyzer mutation is authorized|deal score persistence is authorized|CRM mutation is authorized|offer generation is authorized|contract generation is authorized|buyer outreach is authorized|seller outreach is authorized|closing execution is authorized|title contact is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|revenue execution is authorized|Phase 9 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 8: Deal Quality Intelligence") throw new Error("Phase 8F phase must remain pinned.");
  if (result.phaseStep !== "Phase 8F — Deal Quality Final Lockdown") throw new Error("Phase 8F step must remain pinned.");
  if (result.previousStep !== "Phase 8E — Minimal Deal Quality Intelligence Gate") throw new Error("Phase 8F previous step must remain Phase 8E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 8F must remain final-lockdown-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 8F decisions must remain not_authorized.");
  if (result.phase8eGateReferences.join("|") !== phase8MinimalDealQualityGateLanes.join("|")) throw new Error("Phase 8F must preserve Phase 8E gate references.");
  if (unsafeTrue.length > 0 || !result.flags.phase8LockdownEnforced) throw new Error("Phase 8F blocked flags cannot turn true and lockdown must stay enforced.");
  if (!/locks Phase 8/i.test(text) || !/authorizes no implementation/i.test(text) || !/Phase 9 — AI-Assisted Lead Discovery/i.test(text)) throw new Error("Phase 8F final lockdown rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not approve Phase 9 implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 8F AI boundary is missing.");
  if (!/Phase 8 closeout approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/Phase 9 transition approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 8F human boundary is missing.");
  if (!/analyzer mutation/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 8F forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 9 — AI-Assisted Lead Discovery") throw new Error("Phase 8F must recommend Phase 9.");
  if (unsafePattern.test(text)) throw new Error("Phase 8F wording must not imply unsafe authorization.");
}

export function getPhase8DealQualityFinalLockdownSummary() {
  const result = getPhase8DealQualityFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: final lockdown for read-only Deal Quality Intelligence planning with human-owned deal quality judgment, property fact verification, valuation judgment, repair judgment, title/occupancy/seller realism review, buyer-fit judgment, and offer/contract/closing decisions. No invented property facts, no analyzer mutation, no CRM mutation, no outreach, no offer or contract generation, no closing execution, no Phase 9 implementation, and no go-live are authorized. Next stage: ${result.nextStageRecommendation}.`;
}
