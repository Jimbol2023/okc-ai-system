import {
  phase7KpiRevenueFinalLockdownFlags,
  phase7KpiRevenueFinalLockdownRules,
} from "./phase-7-kpi-revenue-final-lockdown";

export const phase8DealQualityIntelligenceScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  operatorLeverageOnly: true,
  scopeOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  automationEnabled: false,
  communicationEnabled: false,
  crmMutationEnabled: false,
  schemaChangeEnabled: false,
  storageMutationEnabled: false,
  runtimeJobsEnabled: false,
  outreachEnabled: false,
  callingEnabled: false,
  messageSendingEnabled: false,
  taskCreationEnabled: false,
  queueCreationEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  notificationEnabled: false,
  auditWritingEnabled: false,
  reportPersistenceEnabled: false,
  dealScorePersistenceEnabled: false,
  analyzerMutationEnabled: false,
  offerGenerationEnabled: false,
  contractGenerationEnabled: false,
  buyerMutationEnabled: false,
  closingMutationEnabled: false,
  titleContactEnabled: false,
  propertyFactInventionEnabled: false,
  valuationFactInventionEnabled: false,
  repairFactInventionEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  autonomousLeadCreationEnabled: false,
  revenueExecutionEnabled: false,
  phase9ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase8Decision = "not_authorized";

export type Phase8DealQualityIntelligenceScope = {
  phase: "Phase 8: Deal Quality Intelligence";
  phaseStep: "Phase 8A — Deal Quality Intelligence Scope";
  previousStep: "Phase 7F — KPI & Revenue Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_deal_quality_judgment_property_fact_verification_valuation_repair_title_occupancy_seller_realism_buyer_fit_offer_contract_closing_execution_owner";
  implementationDecision: Phase8Decision;
  providerDecision: Phase8Decision;
  automationDecision: Phase8Decision;
  communicationDecision: Phase8Decision;
  crmMutationDecision: Phase8Decision;
  schemaDecision: Phase8Decision;
  storageDecision: Phase8Decision;
  runtimeDecision: Phase8Decision;
  outreachDecision: Phase8Decision;
  callingDecision: Phase8Decision;
  messageSendingDecision: Phase8Decision;
  taskDecision: Phase8Decision;
  queueDecision: Phase8Decision;
  routingDecision: Phase8Decision;
  assignmentDecision: Phase8Decision;
  notificationDecision: Phase8Decision;
  auditDecision: Phase8Decision;
  reportDecision: Phase8Decision;
  scoreDecision: Phase8Decision;
  analyzerDecision: Phase8Decision;
  offerDecision: Phase8Decision;
  contractDecision: Phase8Decision;
  buyerDecision: Phase8Decision;
  closingDecision: Phase8Decision;
  recommendedNextExactStep: "Phase 8B — Deal Quality Signal Audit";
  nextStageRecommendation: "Phase 8B — Deal Quality Signal Audit";
  phase7FinalLockdownReference: {
    flags: typeof phase7KpiRevenueFinalLockdownFlags;
    rules: typeof phase7KpiRevenueFinalLockdownRules;
  };
  scopePurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase8DealQualityIntelligenceScopeFlags;
};

export const phase8DealQualityPurpose = [
  "Define read-only Deal Quality Intelligence planning for highest acquisition ROI per operator hour.",
  "Summarize deal-quality gaps, valuation uncertainty, repair uncertainty, title/closing risk, occupancy/access gaps, seller realism, buyer fit, spread assumptions, and bottlenecks for human review only.",
  "Keep all property facts, valuation facts, repair facts, deal quality claims, and revenue claims advisory and assumption-labeled unless verified by the human operator.",
];

export const phase8DealQualityStopRules = [
  "Phase 8A is scope only.",
  "No property fact invention, valuation fact invention, repair fact invention, analyzer mutation, deal score persistence, CRM mutation, offer generation, contract generation, buyer outreach, seller outreach, closing execution, title contact, provider activation, scraping, skip tracing, autonomous lead creation, revenue execution, Phase 9 implementation, or go-live is authorized.",
];

export const phase8DealQualityAiBoundary = [
  "summarize deal-quality signals for human review only",
  "surface valuation uncertainty repair uncertainty title risk occupancy access seller realism buyer fit spread assumptions and quality bottlenecks",
  "label deal quality claims as assumptions unless human verified",
  "do not invent property facts valuation facts or repair facts",
  "do not mutate analyzer values deal scores CRM records buyer records or closing records",
  "do not generate offers contracts assignments or closing documents",
  "do not contact sellers buyers title companies or providers",
  "do not create tasks queues routing assignments notifications reports or audit logs",
  "do not scrape or skip trace",
  "do not create leads autonomously",
  "do not execute revenue actions",
  "do not approve Phase 9 implementation or go-live",
];

export const phase8DealQualityHumanBoundary = [
  "final deal quality judgment",
  "property fact verification",
  "valuation judgment",
  "repair judgment",
  "title review",
  "occupancy review",
  "seller realism review",
  "buyer-fit judgment",
  "offer decisions",
  "contract decisions",
  "closing decisions",
  "communication",
  "manual execution",
  "future implementation approval",
];

export const phase8DealQualityForbiddenDrift = [
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

export function getPhase8DealQualityIntelligenceScope(): Phase8DealQualityIntelligenceScope {
  const result: Phase8DealQualityIntelligenceScope = {
    phase: "Phase 8: Deal Quality Intelligence",
    phaseStep: "Phase 8A — Deal Quality Intelligence Scope",
    previousStep: "Phase 7F — KPI & Revenue Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "final_deal_quality_judgment_property_fact_verification_valuation_repair_title_occupancy_seller_realism_buyer_fit_offer_contract_closing_execution_owner",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    storageDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    outreachDecision: "not_authorized",
    callingDecision: "not_authorized",
    messageSendingDecision: "not_authorized",
    taskDecision: "not_authorized",
    queueDecision: "not_authorized",
    routingDecision: "not_authorized",
    assignmentDecision: "not_authorized",
    notificationDecision: "not_authorized",
    auditDecision: "not_authorized",
    reportDecision: "not_authorized",
    scoreDecision: "not_authorized",
    analyzerDecision: "not_authorized",
    offerDecision: "not_authorized",
    contractDecision: "not_authorized",
    buyerDecision: "not_authorized",
    closingDecision: "not_authorized",
    recommendedNextExactStep: "Phase 8B — Deal Quality Signal Audit",
    nextStageRecommendation: "Phase 8B — Deal Quality Signal Audit",
    phase7FinalLockdownReference: { flags: phase7KpiRevenueFinalLockdownFlags, rules: phase7KpiRevenueFinalLockdownRules },
    scopePurpose: phase8DealQualityPurpose,
    stopRules: phase8DealQualityStopRules,
    aiOperatorLeverageBoundary: phase8DealQualityAiBoundary,
    humanOwnershipBoundary: phase8DealQualityHumanBoundary,
    forbiddenDrift: phase8DealQualityForbiddenDrift,
    flags: phase8DealQualityIntelligenceScopeFlags,
  };
  assertPhase8DealQualityIntelligenceScopeSafe(result);
  return result;
}

export function assertPhase8DealQualityIntelligenceScopeSafe(result: Phase8DealQualityIntelligenceScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "operatorLeverageOnly", "scopeOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopePurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /property fact invention is authorized|valuation fact invention is authorized|repair fact invention is authorized|analyzer mutation is authorized|deal score persistence is authorized|CRM mutation is authorized|offer generation is authorized|contract generation is authorized|buyer outreach is authorized|seller outreach is authorized|closing execution is authorized|title contact is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|autonomous lead creation is authorized|revenue execution is authorized|Phase 9 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 8: Deal Quality Intelligence") throw new Error("Phase 8A phase must remain pinned.");
  if (result.phaseStep !== "Phase 8A — Deal Quality Intelligence Scope") throw new Error("Phase 8A step must remain pinned.");
  if (result.previousStep !== "Phase 7F — KPI & Revenue Final Lockdown") throw new Error("Phase 8A previous step must remain Phase 7F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 8A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 8A must remain scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 8A decisions must remain not_authorized.");
  if (result.phase7FinalLockdownReference.rules.join("|") !== phase7KpiRevenueFinalLockdownRules.join("|")) throw new Error("Phase 8A must preserve Phase 7F final lockdown reference.");
  if (unsafeTrue.length > 0) throw new Error("Phase 8A blocked flags cannot turn true.");
  if (!/No property fact invention/i.test(result.stopRules.join(" ")) || !/Phase 9 implementation/i.test(result.stopRules.join(" "))) throw new Error("Phase 8A stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not invent property facts/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 8A AI boundary is missing.");
  if (!/final deal quality judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/property fact verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 8A human boundary is missing.");
  if (!/analyzer mutation/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 8A forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 8B — Deal Quality Signal Audit") throw new Error("Phase 8A must hand off to Phase 8B.");
  if (unsafePattern.test(text)) throw new Error("Phase 8A wording must not imply unsafe authorization.");
}

export function getPhase8DealQualityIntelligenceScopeSummary() {
  const result = getPhase8DealQualityIntelligenceScope();
  return `${result.phase} / ${result.phaseStep}: read-only Deal Quality Intelligence scope for highest acquisition ROI per operator hour with human-owned deal quality judgment, property fact verification, valuation judgment, repair judgment, title/occupancy/seller realism review, buyer-fit judgment, and offer/contract/closing decisions. No invented property facts, no analyzer mutation, no CRM mutation, no outreach, no offer or contract generation, no closing execution, no Phase 9 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
