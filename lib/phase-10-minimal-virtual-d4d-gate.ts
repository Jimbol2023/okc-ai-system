import { phase10VirtualD4dForbiddenDrift, phase10VirtualD4dHumanBoundary } from "./phase-10-virtual-d4d-intelligence-scope";
import { phase10VirtualD4dImplementationLanes } from "./phase-10-virtual-d4d-implementation-scope";
import { phase10ManualVirtualD4dLanes, phase10VirtualD4dSummaryStates } from "./phase-10-manual-virtual-d4d-policy";

export const phase10MinimalVirtualD4dGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  gateOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  scrapingEnabled: false,
  mapCrawlingEnabled: false,
  mapAutomationEnabled: false,
  streetViewAutomationEnabled: false,
  gpsSurveillanceEnabled: false,
  locationTrackingEnabled: false,
  externalApiEnabled: false,
  fetchNetworkEnabled: false,
  ownerLookupEnabled: false,
  ownerContactEnabled: false,
  skipTracingEnabled: false,
  providerActivated: false,
  leadCreationEnabled: false,
  crmMutationEnabled: false,
  persistenceEnabled: false,
  auditWritingEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  phase11ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase10MinimalVirtualD4dGateChecks = [
  "minimal_readonly_virtual_d4d_package",
  "human_neighborhood_review_required",
  "property_fact_verification_required",
  "distress_signal_verification_required",
  "source_provenance_and_legal_source_review_required",
  "no_map_no_scraping_no_owner_contact_boundary_required",
  "blocked_execution_owner_contact_spend_paths",
  "phase_10f_lockdown_ready",
] as const;

export type Phase10MinimalVirtualD4dGate = {
  phase: "Phase 10: Virtual Driving for Dollars Intelligence Engine";
  phaseStep: "Phase 10E — Minimal Virtual D4D Gate";
  previousStep: "Phase 10D — Virtual D4D Implementation Scope";
  phaseDecision: "minimal_gate_only";
  implementationDecision: "not_authorized";
  scrapingDecision: "not_authorized";
  mapDecision: "not_authorized";
  gpsDecision: "not_authorized";
  locationDecision: "not_authorized";
  streetViewDecision: "not_authorized";
  externalApiDecision: "not_authorized";
  fetchNetworkDecision: "not_authorized";
  ownerContactDecision: "not_authorized";
  skipTracingDecision: "not_authorized";
  providerDecision: "not_authorized";
  leadCreationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  campaignDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 10F — Virtual D4D Final Lockdown";
  nextStageRecommendation: "Phase 10F — Virtual D4D Final Lockdown";
  gateChecks: typeof phase10MinimalVirtualD4dGateChecks;
  implementationLaneReferences: typeof phase10VirtualD4dImplementationLanes;
  policyLaneReferences: typeof phase10ManualVirtualD4dLanes;
  summaryStateReferences: typeof phase10VirtualD4dSummaryStates;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase10MinimalVirtualD4dGateFlags;
};

export const phase10MinimalVirtualD4dGateRules = [
  "Phase 10E can only decide whether a minimal read-only Virtual D4D visibility package is worth carrying to final lockdown.",
  "A minimal package is only advisory if it preserves human neighborhood judgment, property fact verification, distress-signal verification, source provenance, legal-source review, DNC/STOP governance, and no-map/no-scraping/no-owner-contact boundaries.",
  "The gate cannot approve implementation, maps, scraping, owner contact, lead creation, CRM mutation, provider activation, campaign activation, spend increases, Phase 11 implementation, or go-live.",
];

export const phase10MinimalVirtualD4dGateStopRules = [
  "Phase 10E is a minimal gate only.",
  "No implementation, scraping, map crawling, map automation, Street View automation, GPS surveillance, location tracking, external API behavior, fetch/network behavior, owner lookup, owner contact, skip tracing, provider activation, lead creation, CRM mutation, persistence, audit writing, campaign activation, spend increase, Phase 11 implementation, or go-live is authorized.",
];

export const phase10MinimalVirtualD4dGateAiBoundary = [
  "summarize whether minimal read-only Virtual D4D visibility is worth final lockdown review",
  "do not approve implementation, scrape, crawl maps, automate maps, automate Street View, track GPS/location, call external APIs, fetch network data, look up owners, contact owners, create leads, mutate CRM records, persist data, write audits, launch campaigns, increase spend, or approve go-live",
];

export function getPhase10MinimalVirtualD4dGate(): Phase10MinimalVirtualD4dGate {
  const result: Phase10MinimalVirtualD4dGate = {
    phase: "Phase 10: Virtual Driving for Dollars Intelligence Engine",
    phaseStep: "Phase 10E — Minimal Virtual D4D Gate",
    previousStep: "Phase 10D — Virtual D4D Implementation Scope",
    phaseDecision: "minimal_gate_only",
    implementationDecision: "not_authorized",
    scrapingDecision: "not_authorized",
    mapDecision: "not_authorized",
    gpsDecision: "not_authorized",
    locationDecision: "not_authorized",
    streetViewDecision: "not_authorized",
    externalApiDecision: "not_authorized",
    fetchNetworkDecision: "not_authorized",
    ownerContactDecision: "not_authorized",
    skipTracingDecision: "not_authorized",
    providerDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    campaignDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 10F — Virtual D4D Final Lockdown",
    nextStageRecommendation: "Phase 10F — Virtual D4D Final Lockdown",
    gateChecks: phase10MinimalVirtualD4dGateChecks,
    implementationLaneReferences: phase10VirtualD4dImplementationLanes,
    policyLaneReferences: phase10ManualVirtualD4dLanes,
    summaryStateReferences: phase10VirtualD4dSummaryStates,
    gateRules: phase10MinimalVirtualD4dGateRules,
    stopRules: phase10MinimalVirtualD4dGateStopRules,
    aiOperatorLeverageBoundary: phase10MinimalVirtualD4dGateAiBoundary,
    humanOwnershipBoundary: phase10VirtualD4dHumanBoundary,
    forbiddenDrift: phase10VirtualD4dForbiddenDrift,
    flags: phase10MinimalVirtualD4dGateFlags,
  };
  assertPhase10MinimalVirtualD4dGateSafe(result);
  return result;
}

export function assertPhase10MinimalVirtualD4dGateSafe(result: Phase10MinimalVirtualD4dGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "gateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateChecks].flat().join(" ");
  const unsafePattern = /implementation is authorized|scraping is authorized|map crawling is authorized|map automation is authorized|Street View automation is authorized|GPS surveillance is authorized|location tracking is authorized|external API behavior is authorized|fetch\/network behavior is authorized|owner lookup is authorized|owner contact is authorized|lead creation is authorized|CRM mutation is authorized|persistence is authorized|audit writing is authorized|campaign activation is authorized|spend increase is authorized|Phase 11 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 10E — Minimal Virtual D4D Gate") throw new Error("Phase 10E step must remain pinned.");
  if (result.previousStep !== "Phase 10D — Virtual D4D Implementation Scope") throw new Error("Phase 10E previous step must remain Phase 10D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 10E must remain minimal-gate-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 10E decisions must remain not_authorized.");
  if (result.gateChecks.join("|") !== phase10MinimalVirtualD4dGateChecks.join("|")) throw new Error("Phase 10E gate checks are missing.");
  if (result.implementationLaneReferences.join("|") !== phase10VirtualD4dImplementationLanes.join("|")) throw new Error("Phase 10E implementation lane references are missing.");
  if (result.policyLaneReferences.join("|") !== phase10ManualVirtualD4dLanes.join("|")) throw new Error("Phase 10E policy lane references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 10E blocked flags cannot turn true.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 10E stop rules are missing.");
  if (!/do not approve implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 10E AI boundary is missing.");
  if (!/property fact verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 10E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 10F — Virtual D4D Final Lockdown") throw new Error("Phase 10E must hand off to Phase 10F.");
  if (unsafePattern.test(text)) throw new Error("Phase 10E wording must not imply unsafe authorization.");
}

export function getPhase10MinimalVirtualD4dGateSummary() {
  const result = getPhase10MinimalVirtualD4dGate();
  return `${result.phase} / ${result.phaseStep}: gates a minimal read-only Virtual D4D package for highest acquisition ROI per operator hour with human-owned neighborhood judgment, property fact verification, distress-signal verification, and legal-source verification. No scraping, no map crawling, no Street View automation, no GPS surveillance, no owner contact, no autonomous lead creation, no outreach, no CRM mutation, no spend increase, no Phase 11 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
