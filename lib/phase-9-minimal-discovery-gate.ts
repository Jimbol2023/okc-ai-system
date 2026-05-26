import { phase9LeadDiscoveryImplementationLanes } from "./phase-9-lead-discovery-implementation-scope";

export const phase9MinimalDiscoveryGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  gateOnly: true,
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
  phase10ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase9MinimalDiscoveryGateLane =
  | "minimal_readonly_discovery_package"
  | "human_source_legality_review"
  | "source_provenance_confidence_review"
  | "import_quality_cleanup_review"
  | "blocked_sourcing_execution_map_spend_paths"
  | "phase_9f_lockdown_requirements";

export const phase9MinimalDiscoveryGateLanes: Phase9MinimalDiscoveryGateLane[] = [
  "minimal_readonly_discovery_package",
  "human_source_legality_review",
  "source_provenance_confidence_review",
  "import_quality_cleanup_review",
  "blocked_sourcing_execution_map_spend_paths",
  "phase_9f_lockdown_requirements",
];

export type Phase9MinimalDiscoveryGate = {
  phase: "Phase 9: AI-Assisted Lead Discovery";
  phaseStep: "Phase 9E — Minimal Lead Discovery Gate";
  previousStep: "Phase 9D — Lead Discovery Implementation Scope";
  phaseDecision: "minimal_gate_only";
  implementationDecision: "not_authorized";
  importDecision: "not_authorized";
  sourceDecision: "not_authorized";
  leadCreationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  providerDecision: "not_authorized";
  scrapingDecision: "not_authorized";
  skipTracingDecision: "not_authorized";
  externalLookupDecision: "not_authorized";
  mapDecision: "not_authorized";
  gpsDecision: "not_authorized";
  spendDecision: "not_authorized";
  campaignDecision: "not_authorized";
  recommendedNextExactStep: "Phase 9F — Lead Discovery Final Lockdown";
  nextStageRecommendation: "Phase 9F — Lead Discovery Final Lockdown";
  gateLanes: Phase9MinimalDiscoveryGateLane[];
  implementationScopeReferences: typeof phase9LeadDiscoveryImplementationLanes;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase9MinimalDiscoveryGateFlags;
};

export const phase9MinimalDiscoveryGateRules = [
  "Phase 9E gates whether a minimal read-only lead-discovery package is worth considering later.",
  "The gate requires human source legality review, source provenance confidence review, and import-quality cleanup review before any future build is considered.",
  "The gate cannot authorize lead creation, import mutation, source mutation, CRM mutation, providers, scraping, skip tracing, external lookup, public-record connectors, map automation, GPS surveillance, campaigns, spend increases, Phase 10 implementation, or go-live.",
];

export const phase9MinimalDiscoveryGateStopRules = [
  "Phase 9E is a minimal gate only.",
  "No implementation, lead creation, import mutation, CRM mutation, source mutation, provider activation, scraping, skip tracing, external lookup, public-record connector activation, map automation, Street View automation, GPS surveillance, seller outreach, buyer outreach, campaign activation, spend increase, autonomous qualification, Phase 10 implementation, or go-live is authorized.",
];

export const phase9MinimalDiscoveryGateAiBoundary = [
  "summarize minimal lead-discovery gate readiness for human review only",
  "explain whether discovery visibility would improve operator ROI clarity",
  "do not create leads mutate imports sources CRM records or lead records",
  "do not scrape skip trace run external lookups activate connectors automate maps use Street View automation or perform GPS surveillance",
  "do not contact sellers buyers owners or providers launch campaigns increase spend or autonomously qualify leads",
  "do not approve implementation",
];

export const phase9MinimalDiscoveryGateHumanBoundary = [
  "minimal discovery gate approval",
  "source legality review",
  "source provenance confidence judgment",
  "import quality cleanup judgment",
  "lead acceptance decisions",
  "spend decisions",
  "future implementation approval",
];

export function getPhase9MinimalDiscoveryGate(): Phase9MinimalDiscoveryGate {
  const result: Phase9MinimalDiscoveryGate = {
    phase: "Phase 9: AI-Assisted Lead Discovery",
    phaseStep: "Phase 9E — Minimal Lead Discovery Gate",
    previousStep: "Phase 9D — Lead Discovery Implementation Scope",
    phaseDecision: "minimal_gate_only",
    implementationDecision: "not_authorized",
    importDecision: "not_authorized",
    sourceDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    providerDecision: "not_authorized",
    scrapingDecision: "not_authorized",
    skipTracingDecision: "not_authorized",
    externalLookupDecision: "not_authorized",
    mapDecision: "not_authorized",
    gpsDecision: "not_authorized",
    spendDecision: "not_authorized",
    campaignDecision: "not_authorized",
    recommendedNextExactStep: "Phase 9F — Lead Discovery Final Lockdown",
    nextStageRecommendation: "Phase 9F — Lead Discovery Final Lockdown",
    gateLanes: phase9MinimalDiscoveryGateLanes,
    implementationScopeReferences: phase9LeadDiscoveryImplementationLanes,
    gateRules: phase9MinimalDiscoveryGateRules,
    stopRules: phase9MinimalDiscoveryGateStopRules,
    aiOperatorLeverageBoundary: phase9MinimalDiscoveryGateAiBoundary,
    humanOwnershipBoundary: phase9MinimalDiscoveryGateHumanBoundary,
    forbiddenDrift: phase9MinimalDiscoveryGateStopRules,
    flags: phase9MinimalDiscoveryGateFlags,
  };
  assertPhase9MinimalDiscoveryGateSafe(result);
  return result;
}

export function assertPhase9MinimalDiscoveryGateSafe(result: Phase9MinimalDiscoveryGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "gateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateLanes].flat().join(" ");
  const unsafePattern = /implementation is authorized|lead creation is authorized|import mutation is authorized|CRM mutation is authorized|source mutation is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|external lookup is authorized|public-record connector activation is authorized|map automation is authorized|Street View automation is authorized|GPS surveillance is authorized|seller outreach is authorized|buyer outreach is authorized|campaign activation is authorized|spend increase is authorized|autonomous qualification is authorized|Phase 10 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 9E — Minimal Lead Discovery Gate") throw new Error("Phase 9E step must remain pinned.");
  if (result.previousStep !== "Phase 9D — Lead Discovery Implementation Scope") throw new Error("Phase 9E previous step must remain Phase 9D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 9E must remain minimal-gate-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 9E decisions must remain not_authorized.");
  if (result.gateLanes.join("|") !== phase9MinimalDiscoveryGateLanes.join("|")) throw new Error("Phase 9E must include all gate lanes.");
  if (result.implementationScopeReferences.join("|") !== phase9LeadDiscoveryImplementationLanes.join("|")) throw new Error("Phase 9E must preserve implementation scope references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 9E blocked flags cannot turn true.");
  if (!/minimal read-only lead-discovery package/i.test(result.gateRules.join(" ")) || !/cannot authorize lead creation/i.test(result.gateRules.join(" "))) throw new Error("Phase 9E gate rules are missing.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 9E stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not create leads/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 9E AI boundary is missing.");
  if (!/minimal discovery gate approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/source legality review/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 9E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 9F — Lead Discovery Final Lockdown") throw new Error("Phase 9E must hand off to Phase 9F.");
  if (unsafePattern.test(text)) throw new Error("Phase 9E wording must not imply unsafe authorization.");
}

export function getPhase9MinimalDiscoveryGateSummary() {
  const result = getPhase9MinimalDiscoveryGate();
  return `${result.phase} / ${result.phaseStep}: minimal Lead Discovery gate for highest acquisition ROI per operator hour with human-owned source legality review, source provenance confidence, import quality cleanup, lead acceptance, and spend decisions. No scraping, no skip tracing, no autonomous lead creation, no CRM mutation, no import or source mutation, no spend increase, no Phase 10 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
