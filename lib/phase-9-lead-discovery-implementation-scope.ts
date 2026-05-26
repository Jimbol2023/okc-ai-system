import { phase9LeadDiscoverySummaryStates, phase9ManualDiscoveryLanes } from "./phase-9-manual-discovery-policy";

export const phase9LeadDiscoveryImplementationScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  implementationScopeOnly: true,
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
  queueCreationEnabled: false,
  assignmentEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  phase10ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase9LeadDiscoveryImplementationLane =
  | "candidate_readonly_source_provenance_visibility"
  | "candidate_manual_import_quality_visibility"
  | "candidate_source_quality_cleanup_visibility"
  | "candidate_operator_throughput_visibility"
  | "blocked_execution_sourcing_map_spend_paths"
  | "phase_9e_gate_requirements";

export const phase9LeadDiscoveryImplementationLanes: Phase9LeadDiscoveryImplementationLane[] = [
  "candidate_readonly_source_provenance_visibility",
  "candidate_manual_import_quality_visibility",
  "candidate_source_quality_cleanup_visibility",
  "candidate_operator_throughput_visibility",
  "blocked_execution_sourcing_map_spend_paths",
  "phase_9e_gate_requirements",
];

export type Phase9LeadDiscoveryImplementationScope = {
  phase: "Phase 9: AI-Assisted Lead Discovery";
  phaseStep: "Phase 9D — Lead Discovery Implementation Scope";
  previousStep: "Phase 9C — Manual Lead Discovery Advisory Policy";
  phaseDecision: "implementation_scope_only";
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
  recommendedNextExactStep: "Phase 9E — Minimal Lead Discovery Gate";
  nextStageRecommendation: "Phase 9E — Minimal Lead Discovery Gate";
  implementationScopeLanes: Phase9LeadDiscoveryImplementationLane[];
  discoveryLaneReferences: typeof phase9ManualDiscoveryLanes;
  summaryStateReferences: typeof phase9LeadDiscoverySummaryStates;
  scopeRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase9LeadDiscoveryImplementationScopeFlags;
};

export const phase9LeadDiscoveryImplementationScopeRules = [
  "Phase 9D scopes possible future read-only lead-discovery visibility only.",
  "No implementation execution, lead creation, import mutation, CRM mutation, source mutation, provider activation, scraping, skip tracing, external lookup, public-record connector activation, map automation, Street View automation, GPS surveillance, queue creation, assignment, campaign activation, spend increase, Phase 10 implementation, or go-live is authorized.",
  "Any future build must keep source provenance and legal-source review human-owned before any discovery expansion is considered.",
];

export const phase9LeadDiscoveryImplementationScopeStopRules = [
  "Phase 9D is implementation scope only, not implementation execution.",
  "Candidate work cannot create UI, routes, APIs, schema, storage writes, audit writes, imports, source mutations, CRM writes, leads, providers, external lookups, public-record connectors, scraping, skip tracing, maps, Street View automation, GPS surveillance, campaigns, queues, assignments, spend changes, or runtime jobs.",
];

export const phase9LeadDiscoveryImplementationScopeAiBoundary = [
  "explain future read-only lead-discovery visibility scope for human review only",
  "map discovery lanes and summary states to candidate internal review surfaces",
  "do not implement UI routes APIs schema storage audit import source CRM or lead writes",
  "do not scrape skip trace run external lookups activate public-record connectors automate maps use Street View automation or perform GPS surveillance",
  "do not create leads queues assignments campaigns or spend changes",
  "do not contact sellers buyers owners or providers",
  "do not approve implementation",
];

export const phase9LeadDiscoveryImplementationScopeHumanBoundary = [
  "final implementation approval",
  "source judgment",
  "legal-source verification",
  "source provenance approval",
  "lead acceptance decisions",
  "property fact verification",
  "seller communication",
  "spend decisions",
  "future Phase 10 transition approval",
];

export function getPhase9LeadDiscoveryImplementationScope(): Phase9LeadDiscoveryImplementationScope {
  const result: Phase9LeadDiscoveryImplementationScope = {
    phase: "Phase 9: AI-Assisted Lead Discovery",
    phaseStep: "Phase 9D — Lead Discovery Implementation Scope",
    previousStep: "Phase 9C — Manual Lead Discovery Advisory Policy",
    phaseDecision: "implementation_scope_only",
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
    recommendedNextExactStep: "Phase 9E — Minimal Lead Discovery Gate",
    nextStageRecommendation: "Phase 9E — Minimal Lead Discovery Gate",
    implementationScopeLanes: phase9LeadDiscoveryImplementationLanes,
    discoveryLaneReferences: phase9ManualDiscoveryLanes,
    summaryStateReferences: phase9LeadDiscoverySummaryStates,
    scopeRules: phase9LeadDiscoveryImplementationScopeRules,
    stopRules: phase9LeadDiscoveryImplementationScopeStopRules,
    aiOperatorLeverageBoundary: phase9LeadDiscoveryImplementationScopeAiBoundary,
    humanOwnershipBoundary: phase9LeadDiscoveryImplementationScopeHumanBoundary,
    forbiddenDrift: phase9LeadDiscoveryImplementationScopeRules,
    flags: phase9LeadDiscoveryImplementationScopeFlags,
  };
  assertPhase9LeadDiscoveryImplementationScopeSafe(result);
  return result;
}

export function assertPhase9LeadDiscoveryImplementationScopeSafe(result: Phase9LeadDiscoveryImplementationScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "implementationScopeOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.implementationScopeLanes].flat().join(" ");
  const unsafePattern = /implementation execution is authorized|lead creation is authorized|import mutation is authorized|CRM mutation is authorized|source mutation is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|external lookup is authorized|public-record connector activation is authorized|map automation is authorized|Street View automation is authorized|GPS surveillance is authorized|campaign activation is authorized|spend increase is authorized|Phase 10 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 9D — Lead Discovery Implementation Scope") throw new Error("Phase 9D step must remain pinned.");
  if (result.previousStep !== "Phase 9C — Manual Lead Discovery Advisory Policy") throw new Error("Phase 9D previous step must remain Phase 9C.");
  if (result.phaseDecision !== "implementation_scope_only") throw new Error("Phase 9D must remain implementation-scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 9D decisions must remain not_authorized.");
  if (result.implementationScopeLanes.join("|") !== phase9LeadDiscoveryImplementationLanes.join("|")) throw new Error("Phase 9D must include all implementation scope lanes.");
  if (result.discoveryLaneReferences.join("|") !== phase9ManualDiscoveryLanes.join("|")) throw new Error("Phase 9D must preserve discovery lane references.");
  if (result.summaryStateReferences.join("|") !== phase9LeadDiscoverySummaryStates.join("|")) throw new Error("Phase 9D must preserve summary state references.");
  if (unsafeTrue.length > 0) throw new Error("Phase 9D blocked flags cannot turn true.");
  if (!/No implementation execution/i.test(result.scopeRules.join(" ")) || !/map automation/i.test(result.scopeRules.join(" "))) throw new Error("Phase 9D scope rules are missing.");
  if (!/implementation scope only/i.test(result.stopRules.join(" ")) || !/public-record connectors/i.test(result.stopRules.join(" "))) throw new Error("Phase 9D stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement UI routes APIs schema storage audit import source CRM or lead writes/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 9D AI boundary is missing.");
  if (!/final implementation approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/legal-source verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 9D human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 9E — Minimal Lead Discovery Gate") throw new Error("Phase 9D must hand off to Phase 9E.");
  if (unsafePattern.test(text)) throw new Error("Phase 9D wording must not imply unsafe authorization.");
}

export function getPhase9LeadDiscoveryImplementationScopeSummary() {
  const result = getPhase9LeadDiscoveryImplementationScope();
  return `${result.phase} / ${result.phaseStep}: scopes possible future read-only lead-discovery visibility for highest acquisition ROI per operator hour with human-owned source judgment, legal-source verification, source provenance, and implementation approval. No implementation execution, no scraping, no skip tracing, no autonomous lead creation, no CRM mutation, no import or source mutation, no map automation, no spend increase, no Phase 10 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
