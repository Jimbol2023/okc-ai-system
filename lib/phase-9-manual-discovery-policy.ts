import { phase9LeadDiscoverySignalFamilies } from "./phase-9-lead-discovery-signal-audit";

export const phase9ManualDiscoveryPolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  leadCreationEnabled: false,
  importMutationEnabled: false,
  sourceMutationEnabled: false,
  crmMutationEnabled: false,
  providerActivated: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  externalLookupEnabled: false,
  publicRecordConnectorEnabled: false,
  mapAutomationEnabled: false,
  streetViewAutomationEnabled: false,
  gpsSurveillanceEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  autonomousQualificationEnabled: false,
  phase10ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase9ManualDiscoveryLanes = [
  "stop_source_legality_first",
  "source_provenance_review",
  "legal_source_review",
  "manual_import_quality_review",
  "source_quality_review",
  "duplicate_cleanup_review",
  "property_first_review",
  "missing_contact_data_review",
  "referral_relationship_review",
  "public_record_export_review",
  "operator_throughput_review",
  "defer_until_source_verified",
] as const;

export const phase9LeadDiscoverySummaryStates = [
  "discovery_blocked",
  "source_provenance_missing",
  "legal_source_unclear",
  "manual_import_review_ready",
  "source_quality_visible",
  "duplicate_cleanup_needed",
  "property_first_cleanup_needed",
  "missing_contact_data_visible",
  "referral_review_only",
  "public_record_export_review_only",
  "operator_throughput_limited",
  "not_ready",
] as const;

export type Phase9ManualDiscoveryPolicy = {
  phase: "Phase 9: AI-Assisted Lead Discovery";
  phaseStep: "Phase 9C — Manual Lead Discovery Advisory Policy";
  previousStep: "Phase 9B — Lead Discovery Signal Audit";
  phaseDecision: "manual_policy_only";
  implementationDecision: "not_authorized";
  importDecision: "not_authorized";
  sourceDecision: "not_authorized";
  leadCreationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  scrapingDecision: "not_authorized";
  skipTracingDecision: "not_authorized";
  externalLookupDecision: "not_authorized";
  outreachDecision: "not_authorized";
  campaignDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 9D — Lead Discovery Implementation Scope";
  nextStageRecommendation: "Phase 9D — Lead Discovery Implementation Scope";
  discoveryLanes: typeof phase9ManualDiscoveryLanes;
  summaryStates: typeof phase9LeadDiscoverySummaryStates;
  signalReferences: typeof phase9LeadDiscoverySignalFamilies;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase9ManualDiscoveryPolicyFlags;
};

export const phase9ManualDiscoveryPolicyRules = [
  "Phase 9C defines manual lead discovery lanes and summary states as review labels only.",
  "Policy output may help a human compare source legality, source provenance, import quality, source quality, duplicate cleanup, property-first cleanup, referrals, public-record exports, and operator throughput.",
  "Policy output cannot create leads, mutate imports or sources, mutate CRM records, scrape, skip trace, run external lookups, activate connectors, contact anyone, launch campaigns, increase spend, or qualify leads autonomously.",
];

export const phase9ManualDiscoveryPolicyStopRules = [
  "Phase 9C is manual Lead Discovery Advisory Policy only.",
  "No lead creation, import mutation, CRM mutation, source mutation, provider activation, scraping, skip tracing, external lookup, public-record connector activation, map automation, Street View automation, GPS surveillance, owner lookup, seller outreach, buyer outreach, campaign activation, spend increase, autonomous qualification, Phase 10 implementation, or go-live is authorized.",
];

export const phase9ManualDiscoveryPolicyAiBoundary = [
  "rank and explain discovery lanes for human review only",
  "summarize source provenance legal-source clarity import quality source quality duplicate cleanup property-first cleanup referrals public-record export review and operator throughput",
  "do not create leads mutate imports sources CRM records or lead records",
  "do not scrape skip trace run external lookups activate connectors automate maps use Street View automation or perform GPS surveillance",
  "do not contact sellers buyers owners or providers",
  "do not launch campaigns increase spend or autonomously qualify leads",
  "do not approve implementation",
];

export const phase9ManualDiscoveryPolicyHumanBoundary = [
  "final source judgment",
  "legal-source verification",
  "source provenance approval",
  "lead acceptance decisions",
  "lead rejection decisions",
  "property fact verification",
  "seller communication",
  "spend decisions",
  "future implementation approval",
];

export const phase9ManualDiscoveryPolicyForbiddenDrift = [
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

export function getPhase9ManualDiscoveryPolicy(): Phase9ManualDiscoveryPolicy {
  const result: Phase9ManualDiscoveryPolicy = {
    phase: "Phase 9: AI-Assisted Lead Discovery",
    phaseStep: "Phase 9C — Manual Lead Discovery Advisory Policy",
    previousStep: "Phase 9B — Lead Discovery Signal Audit",
    phaseDecision: "manual_policy_only",
    implementationDecision: "not_authorized",
    importDecision: "not_authorized",
    sourceDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    scrapingDecision: "not_authorized",
    skipTracingDecision: "not_authorized",
    externalLookupDecision: "not_authorized",
    outreachDecision: "not_authorized",
    campaignDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 9D — Lead Discovery Implementation Scope",
    nextStageRecommendation: "Phase 9D — Lead Discovery Implementation Scope",
    discoveryLanes: phase9ManualDiscoveryLanes,
    summaryStates: phase9LeadDiscoverySummaryStates,
    signalReferences: phase9LeadDiscoverySignalFamilies,
    policyRules: phase9ManualDiscoveryPolicyRules,
    stopRules: phase9ManualDiscoveryPolicyStopRules,
    aiOperatorLeverageBoundary: phase9ManualDiscoveryPolicyAiBoundary,
    humanOwnershipBoundary: phase9ManualDiscoveryPolicyHumanBoundary,
    forbiddenDrift: phase9ManualDiscoveryPolicyForbiddenDrift,
    flags: phase9ManualDiscoveryPolicyFlags,
  };
  assertPhase9ManualDiscoveryPolicySafe(result);
  return result;
}

export function assertPhase9ManualDiscoveryPolicySafe(result: Phase9ManualDiscoveryPolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.discoveryLanes, result.summaryStates].flat().join(" ");
  const unsafePattern = /lead creation is authorized|import mutation is authorized|CRM mutation is authorized|source mutation is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|external lookup is authorized|public-record connector activation is authorized|map automation is authorized|Street View automation is authorized|GPS surveillance is authorized|owner lookup is authorized|seller outreach is authorized|buyer outreach is authorized|campaign activation is authorized|spend increase is authorized|autonomous qualification is authorized|Phase 10 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 9C — Manual Lead Discovery Advisory Policy") throw new Error("Phase 9C step must remain pinned.");
  if (result.previousStep !== "Phase 9B — Lead Discovery Signal Audit") throw new Error("Phase 9C previous step must remain Phase 9B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 9C must remain manual-policy-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 9C decisions must remain not_authorized.");
  if (result.discoveryLanes.join("|") !== phase9ManualDiscoveryLanes.join("|")) throw new Error("Phase 9C must include all discovery lanes.");
  if (result.summaryStates.join("|") !== phase9LeadDiscoverySummaryStates.join("|")) throw new Error("Phase 9C must include all summary states.");
  if (result.signalReferences.join("|") !== phase9LeadDiscoverySignalFamilies.join("|")) throw new Error("Phase 9C must preserve signal references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 9C blocked flags cannot turn true.");
  if (!/review labels only/i.test(result.policyRules.join(" ")) || !/source legality/i.test(result.policyRules.join(" "))) throw new Error("Phase 9C policy rules are missing.");
  if (!/Advisory Policy only/i.test(result.stopRules.join(" ")) || !/No lead creation/i.test(result.stopRules.join(" "))) throw new Error("Phase 9C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not create leads/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 9C AI boundary is missing.");
  if (!/final source judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/legal-source verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 9C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 9D — Lead Discovery Implementation Scope") throw new Error("Phase 9C must hand off to Phase 9D.");
  if (unsafePattern.test(text)) throw new Error("Phase 9C wording must not imply unsafe authorization.");
}

export function getPhase9ManualDiscoveryPolicySummary() {
  const result = getPhase9ManualDiscoveryPolicy();
  return `${result.phase} / ${result.phaseStep}: manual lead discovery lanes and summary states for highest acquisition ROI per operator hour. Human-owned source judgment, legal-source verification, source provenance, lead acceptance, and spend decisions remain required. No scraping, no skip tracing, no autonomous lead creation, no outreach, no CRM mutation, no import or source mutation, no spend increase, and no Phase 10 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
