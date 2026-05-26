import { phase9MinimalDiscoveryGateLanes } from "./phase-9-minimal-discovery-gate";

export const phase9LeadDiscoveryFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
  operatorLeverageOnly: true,
  phase9LockdownEnforced: true,
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

export type Phase9LeadDiscoveryFinalLockdown = {
  phase: "Phase 9: AI-Assisted Lead Discovery";
  phaseStep: "Phase 9F — Lead Discovery Final Lockdown";
  previousStep: "Phase 9E — Minimal Lead Discovery Gate";
  phaseDecision: "final_lockdown_only";
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
  recommendedNextExactStep: "Phase 10 — Virtual Driving for Dollars Intelligence Engine";
  nextStageRecommendation: "Phase 10 — Virtual Driving for Dollars Intelligence Engine";
  finalLockdownRules: string[];
  phase9eGateReferences: typeof phase9MinimalDiscoveryGateLanes;
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase9LeadDiscoveryFinalLockdownFlags;
};

export const phase9LeadDiscoveryFinalLockdownRules = [
  "Phase 9F locks Phase 9 as read-only AI-Assisted Lead Discovery planning only.",
  "Phase 9F authorizes no implementation, lead creation, import mutation, CRM mutation, source mutation, provider activation, scraping, skip tracing, external lookup, public-record connector activation, map automation, Street View automation, GPS surveillance, owner lookup, seller outreach, buyer outreach, campaign activation, spend increase, autonomous qualification, Phase 10 implementation, or go-live.",
  "Phase 9F can recommend Phase 10 — Virtual Driving for Dollars Intelligence Engine as the next roadmap phase only after human review.",
];

export const phase9LeadDiscoveryFinalLockdownAiBoundary = [
  "summarize Phase 9 closeout for human review only",
  "summarize Phase 9A through Phase 9E continuity",
  "prepare Phase 10 transition notes for human review",
  "do not create leads mutate imports sources CRM records or lead records",
  "do not scrape skip trace run external lookups activate connectors automate maps use Street View automation or perform GPS surveillance",
  "do not contact sellers buyers owners or providers",
  "do not launch campaigns increase spend or autonomously qualify leads",
  "do not approve Phase 10 implementation",
  "do not authorize go-live",
];

export const phase9LeadDiscoveryFinalLockdownHumanBoundary = [
  "Phase 9 closeout approval",
  "Phase 10 transition approval",
  "source judgment",
  "legal-source verification",
  "source provenance approval",
  "lead acceptance decisions",
  "property fact verification",
  "seller communication",
  "spend decisions",
  "future implementation approval",
];

export const phase9LeadDiscoveryFinalLockdownForbiddenDrift = [
  "implementation",
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

export function getPhase9LeadDiscoveryFinalLockdown(): Phase9LeadDiscoveryFinalLockdown {
  const result: Phase9LeadDiscoveryFinalLockdown = {
    phase: "Phase 9: AI-Assisted Lead Discovery",
    phaseStep: "Phase 9F — Lead Discovery Final Lockdown",
    previousStep: "Phase 9E — Minimal Lead Discovery Gate",
    phaseDecision: "final_lockdown_only",
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
    recommendedNextExactStep: "Phase 10 — Virtual Driving for Dollars Intelligence Engine",
    nextStageRecommendation: "Phase 10 — Virtual Driving for Dollars Intelligence Engine",
    finalLockdownRules: phase9LeadDiscoveryFinalLockdownRules,
    phase9eGateReferences: phase9MinimalDiscoveryGateLanes,
    aiOperatorLeverageBoundary: phase9LeadDiscoveryFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase9LeadDiscoveryFinalLockdownHumanBoundary,
    forbiddenDrift: phase9LeadDiscoveryFinalLockdownForbiddenDrift,
    flags: phase9LeadDiscoveryFinalLockdownFlags,
  };
  assertPhase9LeadDiscoveryFinalLockdownSafe(result);
  return result;
}

export function assertPhase9LeadDiscoveryFinalLockdownSafe(result: Phase9LeadDiscoveryFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly", "phase9LockdownEnforced"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.finalLockdownRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|lead creation is authorized|import mutation is authorized|CRM mutation is authorized|source mutation is authorized|provider activation is authorized|scraping is authorized|skip tracing is authorized|external lookup is authorized|public-record connector activation is authorized|map automation is authorized|Street View automation is authorized|GPS surveillance is authorized|owner lookup is authorized|seller outreach is authorized|buyer outreach is authorized|campaign activation is authorized|spend increase is authorized|autonomous qualification is authorized|Phase 10 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 9: AI-Assisted Lead Discovery") throw new Error("Phase 9F phase must remain pinned.");
  if (result.phaseStep !== "Phase 9F — Lead Discovery Final Lockdown") throw new Error("Phase 9F step must remain pinned.");
  if (result.previousStep !== "Phase 9E — Minimal Lead Discovery Gate") throw new Error("Phase 9F previous step must remain Phase 9E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 9F must remain final-lockdown-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 9F decisions must remain not_authorized.");
  if (result.phase9eGateReferences.join("|") !== phase9MinimalDiscoveryGateLanes.join("|")) throw new Error("Phase 9F must preserve Phase 9E gate references.");
  if (unsafeTrue.length > 0 || !result.flags.phase9LockdownEnforced) throw new Error("Phase 9F blocked flags cannot turn true and lockdown must stay enforced.");
  if (!/locks Phase 9/i.test(text) || !/authorizes no implementation/i.test(text) || !/Phase 10 — Virtual Driving for Dollars Intelligence Engine/i.test(text)) throw new Error("Phase 9F final lockdown rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not approve Phase 10 implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 9F AI boundary is missing.");
  if (!/Phase 9 closeout approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/Phase 10 transition approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 9F human boundary is missing.");
  if (!/scraping/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 9F forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 10 — Virtual Driving for Dollars Intelligence Engine") throw new Error("Phase 9F must recommend Phase 10.");
  if (unsafePattern.test(text)) throw new Error("Phase 9F wording must not imply unsafe authorization.");
}

export function getPhase9LeadDiscoveryFinalLockdownSummary() {
  const result = getPhase9LeadDiscoveryFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: final lockdown for read-only AI-Assisted Lead Discovery planning with human-owned source judgment, legal-source verification, source provenance, lead acceptance, property fact verification, seller communication, and spend decisions. No scraping, no skip tracing, no autonomous lead creation, no outreach, no CRM mutation, no import or source mutation, no spend increase, no Phase 10 implementation, and no go-live are authorized. Next stage: ${result.nextStageRecommendation}.`;
}
