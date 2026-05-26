import { phase10VirtualD4dForbiddenDrift, phase10VirtualD4dHumanBoundary } from "./phase-10-virtual-d4d-intelligence-scope";
import { phase10MinimalVirtualD4dGateChecks } from "./phase-10-minimal-virtual-d4d-gate";

export const phase10VirtualD4dFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
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
  sourceMutationEnabled: false,
  importMutationEnabled: false,
  persistenceEnabled: false,
  auditWritingEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  autonomousAcquisitionEnabled: false,
  autonomousQualificationEnabled: false,
  phase11ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase10VirtualD4dFinalLockdown = {
  phase: "Phase 10: Virtual Driving for Dollars Intelligence Engine";
  phaseStep: "Phase 10F — Virtual D4D Final Lockdown";
  previousStep: "Phase 10E — Minimal Virtual D4D Gate";
  phaseDecision: "final_lockdown_only";
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
  sourceDecision: "not_authorized";
  importDecision: "not_authorized";
  campaignDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 11 — SEO & Local Authority Engine";
  nextStageRecommendation: "Phase 11 — SEO & Local Authority Engine";
  gateReferences: typeof phase10MinimalVirtualD4dGateChecks;
  lockdownRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase10VirtualD4dFinalLockdownFlags;
};

export const phase10VirtualD4dFinalLockdownRules = [
  "Phase 10F locks Phase 10 as read-only planning for Virtual Driving for Dollars intelligence.",
  "Phase 10F preserves the no-scraping, no-map-crawling, no-Street-View-automation, no-GPS-surveillance, no-owner-contact, no-lead-creation, no-CRM-mutation, and no-spend-increase boundary.",
  "Phase 10F can recommend Phase 11 — SEO & Local Authority Engine, but cannot implement Phase 11.",
];

export const phase10VirtualD4dFinalLockdownStopRules = [
  "Phase 10F is final lockdown only.",
  "No implementation, scraping, map crawling, map automation, Street View automation, GPS surveillance, location tracking, external API behavior, fetch/network behavior, owner lookup, owner contact, skip tracing, provider activation, lead creation, import mutation, source mutation, CRM mutation, persistence, audit writing, campaign activation, spend increase, autonomous acquisition, autonomous qualification, Phase 11 implementation, or go-live is authorized.",
];

export const phase10VirtualD4dFinalLockdownAiBoundary = [
  "summarize Phase 10 lockdown boundaries for human review only",
  "do not implement Phase 11, scrape, crawl maps, automate maps, automate Street View, track GPS/location, call external APIs, fetch network data, look up owners, contact owners, create leads, mutate records, persist data, write audits, launch campaigns, increase spend, or authorize go-live",
];

export function getPhase10VirtualD4dFinalLockdown(): Phase10VirtualD4dFinalLockdown {
  const result: Phase10VirtualD4dFinalLockdown = {
    phase: "Phase 10: Virtual Driving for Dollars Intelligence Engine",
    phaseStep: "Phase 10F — Virtual D4D Final Lockdown",
    previousStep: "Phase 10E — Minimal Virtual D4D Gate",
    phaseDecision: "final_lockdown_only",
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
    sourceDecision: "not_authorized",
    importDecision: "not_authorized",
    campaignDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 11 — SEO & Local Authority Engine",
    nextStageRecommendation: "Phase 11 — SEO & Local Authority Engine",
    gateReferences: phase10MinimalVirtualD4dGateChecks,
    lockdownRules: phase10VirtualD4dFinalLockdownRules,
    stopRules: phase10VirtualD4dFinalLockdownStopRules,
    aiOperatorLeverageBoundary: phase10VirtualD4dFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase10VirtualD4dHumanBoundary,
    forbiddenDrift: phase10VirtualD4dForbiddenDrift,
    flags: phase10VirtualD4dFinalLockdownFlags,
  };
  assertPhase10VirtualD4dFinalLockdownSafe(result);
  return result;
}

export function assertPhase10VirtualD4dFinalLockdownSafe(result: Phase10VirtualD4dFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.lockdownRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|scraping is authorized|map crawling is authorized|map automation is authorized|Street View automation is authorized|GPS surveillance is authorized|location tracking is authorized|external API behavior is authorized|fetch\/network behavior is authorized|owner lookup is authorized|owner contact is authorized|lead creation is authorized|CRM mutation is authorized|persistence is authorized|audit writing is authorized|campaign activation is authorized|spend increase is authorized|Phase 11 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 10F — Virtual D4D Final Lockdown") throw new Error("Phase 10F step must remain pinned.");
  if (result.previousStep !== "Phase 10E — Minimal Virtual D4D Gate") throw new Error("Phase 10F previous step must remain Phase 10E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 10F must remain final-lockdown-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 10F decisions must remain not_authorized.");
  if (result.gateReferences.join("|") !== phase10MinimalVirtualD4dGateChecks.join("|")) throw new Error("Phase 10F gate references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 10F blocked flags cannot turn true.");
  if (!/final lockdown only/i.test(result.stopRules.join(" "))) throw new Error("Phase 10F stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement Phase 11/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 10F AI boundary is missing.");
  if (!/legal-source verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 10F human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 11 — SEO & Local Authority Engine") throw new Error("Phase 10F must recommend Phase 11.");
  if (unsafePattern.test(text)) throw new Error("Phase 10F wording must not imply unsafe authorization.");
}

export function getPhase10VirtualD4dFinalLockdownSummary() {
  const result = getPhase10VirtualD4dFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: locks Phase 10 Virtual D4D planning for highest acquisition ROI per operator hour with human-owned neighborhood judgment, property fact verification, distress-signal verification, source provenance, legal-source verification, lead acceptance, seller communication, and spend decisions. No scraping, no map crawling, no Street View automation, no GPS surveillance, no owner contact, no autonomous lead creation, no outreach, no CRM mutation, no spend increase, no Phase 11 implementation, and no go-live are authorized. Next phase: ${result.recommendedNextExactStep}.`;
}
