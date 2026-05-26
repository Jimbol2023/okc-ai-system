import {
  phase15DesignCreativeFinalLockdownFlags,
  phase15DesignCreativeFinalLockdownRules,
} from "./phase-15-design-creative-final-lockdown";

export const phase16BuyerFitIntelligenceScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  scopeOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  automationEnabled: false,
  communicationEnabled: false,
  crmMutationEnabled: false,
  schemaChangeEnabled: false,
  storageMutationEnabled: false,
  runtimeJobsEnabled: false,
  routeChangeEnabled: false,
  uiChangeEnabled: false,
  apiChangeEnabled: false,
  auditWritingEnabled: false,
  buyerRecordMutationEnabled: false,
  buyerActivityMutationEnabled: false,
  leadMutationEnabled: false,
  dealMutationEnabled: false,
  dispositionMutationEnabled: false,
  assignmentGenerationEnabled: false,
  contractGenerationEnabled: false,
  offerGenerationEnabled: false,
  buyerOutreachEnabled: false,
  sellerOutreachEnabled: false,
  messageSendingEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  matchingExecutionEnabled: false,
  scorePersistenceEnabled: false,
  goLiveAuthorized: false,
  phase17ImplementationEnabled: false,
} as const;

export type Phase16Decision = "not_authorized";

export type Phase16BuyerFitIntelligenceScope = {
  phase: "Phase 16: Buyer Fit Intelligence";
  phaseStep: "Phase 16A â€” Buyer Fit Intelligence Scope";
  previousStep: "Phase 15F â€” Design & Creative Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_buyer_fit_judgment_buyer_relationship_ownership_deal_package_approval_disposition_judgment_assignment_judgment_buyer_communication_approval_compliance_review_execution_owner";
  implementationDecision: Phase16Decision;
  providerDecision: Phase16Decision;
  automationDecision: Phase16Decision;
  communicationDecision: Phase16Decision;
  crmMutationDecision: Phase16Decision;
  schemaDecision: Phase16Decision;
  storageDecision: Phase16Decision;
  runtimeDecision: Phase16Decision;
  routeDecision: Phase16Decision;
  uiDecision: Phase16Decision;
  apiDecision: Phase16Decision;
  auditDecision: Phase16Decision;
  buyerRecordDecision: Phase16Decision;
  buyerActivityDecision: Phase16Decision;
  leadDecision: Phase16Decision;
  dealDecision: Phase16Decision;
  dispositionDecision: Phase16Decision;
  assignmentDecision: Phase16Decision;
  contractDecision: Phase16Decision;
  outreachDecision: Phase16Decision;
  messageDecision: Phase16Decision;
  campaignDecision: Phase16Decision;
  spendDecision: Phase16Decision;
  goLiveDecision: Phase16Decision;
  recommendedNextExactStep: "Phase 16B â€” Buyer Fit Signal Audit";
  nextStageRecommendation: "Phase 16B â€” Buyer Fit Signal Audit";
  phase15FinalLockdownReference: {
    flags: typeof phase15DesignCreativeFinalLockdownFlags;
    rules: typeof phase15DesignCreativeFinalLockdownRules;
  };
  scopePurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase16BuyerFitIntelligenceScopeFlags;
};

export const phase16BuyerFitPurpose = [
  "Define read-only Buyer Fit Intelligence planning for highest acquisition ROI per operator hour.",
  "Summarize buyer profile fit, buyer demand alignment, deal-package readiness, property type fit, price/location fit, funding verification gaps, assignment readiness, buyer relationship priority, and disposition risk for human review only.",
  "Improve disposition clarity without mutating buyer records, buyer activities, leads, CRM, deals, disposition records, assignments, contracts, providers, outreach, campaigns, spend, runtime jobs, or go-live state.",
];

export const phase16BuyerFitStopRules = [
  "Phase 16A is scope only.",
  "No implementation, buyer outreach, seller outreach, SMS/email/calling, AI voice, deal blasting, buyer record mutation, buyer activity mutation, lead mutation, CRM mutation, disposition mutation, buyer score persistence, assignment agreement generation, contract generation, offer generation, deal package sending, automated buyer matching execution, routing, queues, assignments, reminders, runtime jobs, provider activation, external API/fetch/network behavior, scraping, skip tracing, campaign activation, ad activation, spend increases, audit writing, storage mutation, final buyer-fit decisions by AI, relationship decisions by AI, assignment decisions by AI, legal/compliance approval by AI, Phase 17 implementation, or go-live is authorized.",
];

export const phase16BuyerFitAiBoundary = [
  "summarize buyer-fit planning signals for human review only",
  "surface buyer profile completeness, buyer demand alignment, deal package readiness, property type fit, price range fit, location fit, proof-of-funds gaps, assignment readiness, buyer relationship priority, and disposition risk",
  "do not contact buyers or sellers, blast deals, mutate buyer records, persist scores, mutate leads CRM or disposition records, generate assignments contracts or offers, send deal packages, execute matching, route work, activate providers, scrape, skip trace, launch campaigns, increase spend, make final buyer-fit decisions, implement Phase 17, or authorize go-live",
];

export const phase16BuyerFitHumanBoundary = [
  "final buyer-fit judgment",
  "buyer relationship ownership",
  "deal-package approval",
  "disposition judgment",
  "assignment judgment",
  "buyer communication approval",
  "compliance review",
  "manual execution",
  "future implementation approval",
];

export const phase16BuyerFitForbiddenDrift = [
  "buyer outreach",
  "seller outreach",
  "deal blasting",
  "SMS/email/calling",
  "AI voice",
  "buyer record mutation",
  "buyer activity mutation",
  "lead/CRM/disposition mutation",
  "buyer score persistence",
  "assignment agreement generation",
  "contract generation",
  "offer generation",
  "deal package sending",
  "automated buyer matching execution",
  "routing",
  "queues",
  "assignments",
  "runtime jobs",
  "provider activation",
  "external API/fetch/network behavior",
  "scraping",
  "skip tracing",
  "campaign/ad/spend activation",
  "audit writing",
  "storage mutation",
  "final buyer-fit decisions by AI",
  "legal/compliance approval by AI",
  "Phase 17 implementation",
  "go-live",
];

export function getPhase16BuyerFitIntelligenceScope(): Phase16BuyerFitIntelligenceScope {
  const result: Phase16BuyerFitIntelligenceScope = {
    phase: "Phase 16: Buyer Fit Intelligence",
    phaseStep: "Phase 16A â€” Buyer Fit Intelligence Scope",
    previousStep: "Phase 15F â€” Design & Creative Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "final_buyer_fit_judgment_buyer_relationship_ownership_deal_package_approval_disposition_judgment_assignment_judgment_buyer_communication_approval_compliance_review_execution_owner",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    storageDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    routeDecision: "not_authorized",
    uiDecision: "not_authorized",
    apiDecision: "not_authorized",
    auditDecision: "not_authorized",
    buyerRecordDecision: "not_authorized",
    buyerActivityDecision: "not_authorized",
    leadDecision: "not_authorized",
    dealDecision: "not_authorized",
    dispositionDecision: "not_authorized",
    assignmentDecision: "not_authorized",
    contractDecision: "not_authorized",
    outreachDecision: "not_authorized",
    messageDecision: "not_authorized",
    campaignDecision: "not_authorized",
    spendDecision: "not_authorized",
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 16B â€” Buyer Fit Signal Audit",
    nextStageRecommendation: "Phase 16B â€” Buyer Fit Signal Audit",
    phase15FinalLockdownReference: { flags: phase15DesignCreativeFinalLockdownFlags, rules: phase15DesignCreativeFinalLockdownRules },
    scopePurpose: phase16BuyerFitPurpose,
    stopRules: phase16BuyerFitStopRules,
    aiOperatorLeverageBoundary: phase16BuyerFitAiBoundary,
    humanOwnershipBoundary: phase16BuyerFitHumanBoundary,
    forbiddenDrift: phase16BuyerFitForbiddenDrift,
    flags: phase16BuyerFitIntelligenceScopeFlags,
  };
  assertPhase16BuyerFitIntelligenceScopeSafe(result);
  return result;
}

export function assertPhase16BuyerFitIntelligenceScopeSafe(result: Phase16BuyerFitIntelligenceScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "scopeOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopePurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /buyer outreach is authorized|deal blasting is authorized|buyer record mutation is authorized|buyer score persistence is authorized|assignment agreement generation is authorized|contract generation is authorized|deal package sending is authorized|automated buyer matching execution is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|spend increases are authorized|final buyer-fit decisions by AI are authorized|Phase 17 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 16: Buyer Fit Intelligence") throw new Error("Phase 16A phase must remain pinned.");
  if (result.phaseStep !== "Phase 16A â€” Buyer Fit Intelligence Scope") throw new Error("Phase 16A step must remain pinned.");
  if (result.previousStep !== "Phase 15F â€” Design & Creative Final Lockdown") throw new Error("Phase 16A previous step must remain Phase 15F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 16A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 16A must remain scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 16A decisions must remain not_authorized.");
  if (result.phase15FinalLockdownReference.rules.join("|") !== phase15DesignCreativeFinalLockdownRules.join("|")) throw new Error("Phase 16A must preserve Phase 15F final lockdown reference.");
  if (unsafeTrue.length > 0) throw new Error("Phase 16A blocked flags cannot turn true.");
  if (!/scope only/i.test(result.stopRules.join(" ")) || !/Phase 17 implementation/i.test(result.stopRules.join(" "))) throw new Error("Phase 16A stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not contact buyers/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 16A AI boundary is missing.");
  if (!/final buyer-fit judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/buyer relationship ownership/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 16A human boundary is missing.");
  if (!/deal package sending/i.test(result.forbiddenDrift.join(" ")) || !/buyer score persistence/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 16A forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 16B â€” Buyer Fit Signal Audit") throw new Error("Phase 16A must hand off to Phase 16B.");
  if (unsafePattern.test(text)) throw new Error("Phase 16A wording must not imply unsafe authorization.");
}

export function getPhase16BuyerFitIntelligenceScopeSummary() {
  const result = getPhase16BuyerFitIntelligenceScope();
  return `${result.phase} / ${result.phaseStep}: read-only Buyer Fit Intelligence scope for highest acquisition ROI per operator hour with human-owned buyer-fit judgment, buyer relationship ownership, deal-package approval, disposition judgment, assignment judgment, buyer communication approval, and compliance review. No buyer outreach, no deal blasting, no buyer mutation, no CRM mutation, no assignment/contract generation, no deal package sending, no go-live, and no Phase 17 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
