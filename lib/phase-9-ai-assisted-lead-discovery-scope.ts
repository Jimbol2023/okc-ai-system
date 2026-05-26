import {
  phase8DealQualityFinalLockdownFlags,
  phase8DealQualityFinalLockdownRules,
} from "./phase-8-deal-quality-final-lockdown";

export const phase9AiAssistedLeadDiscoveryScopeFlags = {
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
  importMutationEnabled: false,
  sourceMutationEnabled: false,
  leadCreationEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  externalLookupEnabled: false,
  publicRecordConnectorEnabled: false,
  mapAutomationEnabled: false,
  streetViewAutomationEnabled: false,
  gpsSurveillanceEnabled: false,
  ownerLookupEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  autonomousQualificationEnabled: false,
  phase10ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase9Decision = "not_authorized";

export type Phase9AiAssistedLeadDiscoveryScope = {
  phase: "Phase 9: AI-Assisted Lead Discovery";
  phaseStep: "Phase 9A — AI-Assisted Lead Discovery Scope";
  previousStep: "Phase 8F — Deal Quality Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_source_judgment_legal_source_verification_lead_acceptance_property_fact_verification_seller_communication_spend_decisions_execution_owner";
  implementationDecision: Phase9Decision;
  providerDecision: Phase9Decision;
  automationDecision: Phase9Decision;
  communicationDecision: Phase9Decision;
  crmMutationDecision: Phase9Decision;
  schemaDecision: Phase9Decision;
  storageDecision: Phase9Decision;
  runtimeDecision: Phase9Decision;
  outreachDecision: Phase9Decision;
  callingDecision: Phase9Decision;
  messageSendingDecision: Phase9Decision;
  taskDecision: Phase9Decision;
  queueDecision: Phase9Decision;
  routingDecision: Phase9Decision;
  assignmentDecision: Phase9Decision;
  notificationDecision: Phase9Decision;
  auditDecision: Phase9Decision;
  importDecision: Phase9Decision;
  sourceDecision: Phase9Decision;
  leadCreationDecision: Phase9Decision;
  scrapingDecision: Phase9Decision;
  skipTracingDecision: Phase9Decision;
  mapDecision: Phase9Decision;
  gpsDecision: Phase9Decision;
  spendDecision: Phase9Decision;
  campaignDecision: Phase9Decision;
  recommendedNextExactStep: "Phase 9B — Lead Discovery Signal Audit";
  nextStageRecommendation: "Phase 9B — Lead Discovery Signal Audit";
  phase8FinalLockdownReference: {
    flags: typeof phase8DealQualityFinalLockdownFlags;
    rules: typeof phase8DealQualityFinalLockdownRules;
  };
  scopePurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase9AiAssistedLeadDiscoveryScopeFlags;
};

export const phase9LeadDiscoveryPurpose = [
  "Define read-only AI-Assisted Lead Discovery planning for highest acquisition ROI per operator hour.",
  "Summarize source provenance, legal-source clarity, import quality, source quality, duplicate cleanup, property-first cleanup, referral/manual sourcing, public-record export review, and operator-throughput signals for human review only.",
  "Improve acquisition focus without creating leads, mutating imports or sources, scraping, skip tracing, contacting anyone, activating providers, increasing spend, or launching campaigns.",
];

export const phase9LeadDiscoveryStopRules = [
  "Phase 9A is scope only.",
  "No implementation, lead creation, import mutation, CRM mutation, source mutation, provider activation, scraping, skip tracing, external lookup, public-record connector activation, map automation, Street View automation, GPS surveillance, owner lookup, seller outreach, buyer outreach, campaign activation, spend increase, autonomous qualification, Phase 10 implementation, or go-live is authorized.",
];

export const phase9LeadDiscoveryAiBoundary = [
  "summarize lead-discovery signals for human review only",
  "surface source provenance legal-source clarity import quality source quality duplicate cleanup property-first cleanup referral public-record export and operator-throughput signals",
  "do not create leads or mutate imports sources CRM records lead records or storage",
  "do not scrape skip trace run external lookups activate public-record connectors automate maps use Street View automation or perform GPS surveillance",
  "do not contact sellers buyers owners or providers",
  "do not create tasks queues routing assignments notifications audit logs campaigns or spend changes",
  "do not autonomously qualify leads",
  "do not approve Phase 10 implementation or go-live",
];

export const phase9LeadDiscoveryHumanBoundary = [
  "final source judgment",
  "legal-source verification",
  "source provenance approval",
  "lead acceptance decisions",
  "lead rejection decisions",
  "property fact verification",
  "seller communication",
  "spend decisions",
  "manual execution",
  "future implementation approval",
];

export const phase9LeadDiscoveryForbiddenDrift = [
  "lead creation",
  "import mutation",
  "CRM mutation",
  "source mutation",
  "provider activation",
  "scraping",
  "skip tracing",
  "external lookup",
  "public-record connector activation",
  "map automation",
  "Street View automation",
  "GPS surveillance",
  "owner lookup",
  "seller outreach",
  "buyer outreach",
  "campaign activation",
  "spend increase",
  "autonomous qualification",
  "Phase 10 implementation",
  "go-live",
];

export function getPhase9AiAssistedLeadDiscoveryScope(): Phase9AiAssistedLeadDiscoveryScope {
  const result: Phase9AiAssistedLeadDiscoveryScope = {
    phase: "Phase 9: AI-Assisted Lead Discovery",
    phaseStep: "Phase 9A — AI-Assisted Lead Discovery Scope",
    previousStep: "Phase 8F — Deal Quality Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "final_source_judgment_legal_source_verification_lead_acceptance_property_fact_verification_seller_communication_spend_decisions_execution_owner",
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
    importDecision: "not_authorized",
    sourceDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    scrapingDecision: "not_authorized",
    skipTracingDecision: "not_authorized",
    mapDecision: "not_authorized",
    gpsDecision: "not_authorized",
    spendDecision: "not_authorized",
    campaignDecision: "not_authorized",
    recommendedNextExactStep: "Phase 9B — Lead Discovery Signal Audit",
    nextStageRecommendation: "Phase 9B — Lead Discovery Signal Audit",
    phase8FinalLockdownReference: { flags: phase8DealQualityFinalLockdownFlags, rules: phase8DealQualityFinalLockdownRules },
    scopePurpose: phase9LeadDiscoveryPurpose,
    stopRules: phase9LeadDiscoveryStopRules,
    aiOperatorLeverageBoundary: phase9LeadDiscoveryAiBoundary,
    humanOwnershipBoundary: phase9LeadDiscoveryHumanBoundary,
    forbiddenDrift: phase9LeadDiscoveryForbiddenDrift,
    flags: phase9AiAssistedLeadDiscoveryScopeFlags,
  };
  assertPhase9AiAssistedLeadDiscoveryScopeSafe(result);
  return result;
}

export function assertPhase9AiAssistedLeadDiscoveryScopeSafe(result: Phase9AiAssistedLeadDiscoveryScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "operatorLeverageOnly", "scopeOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopePurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /lead creation is authorized|import mutation is authorized|CRM mutation is authorized|source mutation is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|external lookup is authorized|public-record connector activation is authorized|map automation is authorized|Street View automation is authorized|GPS surveillance is authorized|owner lookup is authorized|seller outreach is authorized|buyer outreach is authorized|campaign activation is authorized|spend increase is authorized|autonomous qualification is authorized|Phase 10 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 9: AI-Assisted Lead Discovery") throw new Error("Phase 9A phase must remain pinned.");
  if (result.phaseStep !== "Phase 9A — AI-Assisted Lead Discovery Scope") throw new Error("Phase 9A step must remain pinned.");
  if (result.previousStep !== "Phase 8F — Deal Quality Final Lockdown") throw new Error("Phase 9A previous step must remain Phase 8F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 9A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 9A must remain scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 9A decisions must remain not_authorized.");
  if (result.phase8FinalLockdownReference.rules.join("|") !== phase8DealQualityFinalLockdownRules.join("|")) throw new Error("Phase 9A must preserve Phase 8F final lockdown reference.");
  if (unsafeTrue.length > 0) throw new Error("Phase 9A blocked flags cannot turn true.");
  if (!/No implementation, lead creation/i.test(result.stopRules.join(" ")) || !/Phase 10 implementation/i.test(result.stopRules.join(" "))) throw new Error("Phase 9A stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not create leads/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 9A AI boundary is missing.");
  if (!/final source judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/legal-source verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 9A human boundary is missing.");
  if (!/scraping/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 9A forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 9B — Lead Discovery Signal Audit") throw new Error("Phase 9A must hand off to Phase 9B.");
  if (unsafePattern.test(text)) throw new Error("Phase 9A wording must not imply unsafe authorization.");
}

export function getPhase9AiAssistedLeadDiscoveryScopeSummary() {
  const result = getPhase9AiAssistedLeadDiscoveryScope();
  return `${result.phase} / ${result.phaseStep}: read-only AI-Assisted Lead Discovery scope for highest acquisition ROI per operator hour with human-owned source judgment, legal-source verification, source provenance, lead acceptance, property fact verification, seller communication, and spend decisions. No scraping, no skip tracing, no autonomous lead creation, no outreach, no CRM mutation, no import mutation, no source mutation, no spend increase, no Phase 10 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
