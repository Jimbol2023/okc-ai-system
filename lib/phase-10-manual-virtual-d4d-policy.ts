import { phase10VirtualD4dForbiddenDrift, phase10VirtualD4dHumanBoundary } from "./phase-10-virtual-d4d-intelligence-scope";
import { phase10VirtualD4dSignalFamilies } from "./phase-10-virtual-d4d-signal-audit";

export const phase10ManualVirtualD4dPolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  scrapingEnabled: false,
  mapCrawlingEnabled: false,
  mapAutomationEnabled: false,
  streetViewAutomationEnabled: false,
  gpsSurveillanceEnabled: false,
  locationTrackingEnabled: false,
  ownerLookupEnabled: false,
  ownerContactEnabled: false,
  leadCreationEnabled: false,
  crmMutationEnabled: false,
  sourceMutationEnabled: false,
  importMutationEnabled: false,
  campaignEnabled: false,
  externalApiEnabled: false,
  spendIncreaseEnabled: false,
  phase11ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase10ManualVirtualD4dLanes = [
  "stop_no_map_or_scraping_first",
  "approved_neighborhood_review",
  "manual_distress_signal_review",
  "property_opportunity_pattern_review",
  "source_provenance_review",
  "manual_property_capture_shape_review",
  "duplicate_overlap_review",
  "property_first_cleanup_review",
  "buyer_demand_fit_review",
  "dnc_stop_governance_review",
  "operator_route_focus_review",
  "defer_until_human_verified",
] as const;

export const phase10VirtualD4dSummaryStates = [
  "virtual_d4d_blocked",
  "no_map_boundary_required",
  "neighborhood_review_ready",
  "distress_signal_unverified",
  "property_pattern_visible",
  "source_provenance_needed",
  "manual_capture_shape_visible",
  "duplicate_overlap_visible",
  "property_first_cleanup_needed",
  "buyer_demand_fit_visible",
  "operator_focus_only",
  "not_ready",
] as const;

export type Phase10ManualVirtualD4dPolicy = {
  phase: "Phase 10: Virtual Driving for Dollars Intelligence Engine";
  phaseStep: "Phase 10C — Manual Virtual D4D Advisory Policy";
  previousStep: "Phase 10B — Virtual D4D Signal Audit";
  phaseDecision: "manual_policy_only";
  implementationDecision: "not_authorized";
  scrapingDecision: "not_authorized";
  mapDecision: "not_authorized";
  gpsDecision: "not_authorized";
  locationDecision: "not_authorized";
  streetViewDecision: "not_authorized";
  ownerContactDecision: "not_authorized";
  leadCreationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  sourceDecision: "not_authorized";
  importDecision: "not_authorized";
  externalApiDecision: "not_authorized";
  campaignDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 10D — Virtual D4D Implementation Scope";
  nextStageRecommendation: "Phase 10D — Virtual D4D Implementation Scope";
  signalReferences: typeof phase10VirtualD4dSignalFamilies;
  manualVirtualD4dLanes: typeof phase10ManualVirtualD4dLanes;
  summaryStates: typeof phase10VirtualD4dSummaryStates;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase10ManualVirtualD4dPolicyFlags;
};

export const phase10ManualVirtualD4dPolicyRules = [
  "Manual Virtual D4D lanes are advisory visibility only and cannot trigger scraping, maps, GPS/location, Street View, owner contact, lead creation, CRM/source/import mutation, external APIs, campaigns, or spend increases.",
  "Distress-signal and property-opportunity language must remain unverified until the human operator verifies property facts and legal-source provenance.",
  "The highest-aROI policy is to stop unsafe map/scraping drift first, then focus human review on approved neighborhoods, source provenance, manual capture shape, duplicate overlap, buyer-demand fit, DNC/STOP governance, and operator-route focus.",
];

export const phase10ManualVirtualD4dPolicyStopRules = [
  "Phase 10C defines manual Virtual D4D advisory lanes and summary states only.",
  "No implementation, scraping, map crawling, map automation, Street View automation, GPS surveillance, location tracking, owner lookup, owner contact, lead creation, import mutation, source mutation, CRM mutation, external API behavior, campaign activation, spend increase, autonomous acquisition, autonomous qualification, Phase 11 implementation, or go-live is authorized.",
];

export const phase10ManualVirtualD4dPolicyAiBoundary = [
  "rank and explain manual Virtual D4D lanes for human review only",
  "do not invent property facts or mark distress signals verified",
  "do not scrape, use maps, automate Street View, track GPS/location, call external APIs, look up owners, contact owners, create leads, mutate records, launch campaigns, increase spend, or approve implementation",
];

export function getPhase10ManualVirtualD4dPolicy(): Phase10ManualVirtualD4dPolicy {
  const result: Phase10ManualVirtualD4dPolicy = {
    phase: "Phase 10: Virtual Driving for Dollars Intelligence Engine",
    phaseStep: "Phase 10C — Manual Virtual D4D Advisory Policy",
    previousStep: "Phase 10B — Virtual D4D Signal Audit",
    phaseDecision: "manual_policy_only",
    implementationDecision: "not_authorized",
    scrapingDecision: "not_authorized",
    mapDecision: "not_authorized",
    gpsDecision: "not_authorized",
    locationDecision: "not_authorized",
    streetViewDecision: "not_authorized",
    ownerContactDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    sourceDecision: "not_authorized",
    importDecision: "not_authorized",
    externalApiDecision: "not_authorized",
    campaignDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 10D — Virtual D4D Implementation Scope",
    nextStageRecommendation: "Phase 10D — Virtual D4D Implementation Scope",
    signalReferences: phase10VirtualD4dSignalFamilies,
    manualVirtualD4dLanes: phase10ManualVirtualD4dLanes,
    summaryStates: phase10VirtualD4dSummaryStates,
    policyRules: phase10ManualVirtualD4dPolicyRules,
    stopRules: phase10ManualVirtualD4dPolicyStopRules,
    aiOperatorLeverageBoundary: phase10ManualVirtualD4dPolicyAiBoundary,
    humanOwnershipBoundary: phase10VirtualD4dHumanBoundary,
    forbiddenDrift: phase10VirtualD4dForbiddenDrift,
    flags: phase10ManualVirtualD4dPolicyFlags,
  };
  assertPhase10ManualVirtualD4dPolicySafe(result);
  return result;
}

export function assertPhase10ManualVirtualD4dPolicySafe(result: Phase10ManualVirtualD4dPolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.manualVirtualD4dLanes, result.summaryStates].flat().join(" ");
  const unsafePattern = /scraping is authorized|map crawling is authorized|map automation is authorized|Street View automation is authorized|GPS surveillance is authorized|owner contact is authorized|lead creation is authorized|CRM mutation is authorized|external API behavior is authorized|campaign activation is authorized|spend increase is authorized|Phase 11 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 10C — Manual Virtual D4D Advisory Policy") throw new Error("Phase 10C step must remain pinned.");
  if (result.previousStep !== "Phase 10B — Virtual D4D Signal Audit") throw new Error("Phase 10C previous step must remain Phase 10B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 10C must remain manual-policy-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 10C decisions must remain not_authorized.");
  if (result.manualVirtualD4dLanes.join("|") !== phase10ManualVirtualD4dLanes.join("|")) throw new Error("Phase 10C manual Virtual D4D lanes are missing.");
  if (result.summaryStates.join("|") !== phase10VirtualD4dSummaryStates.join("|")) throw new Error("Phase 10C summary states are missing.");
  if (result.signalReferences.join("|") !== phase10VirtualD4dSignalFamilies.join("|")) throw new Error("Phase 10C signal references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 10C blocked flags cannot turn true.");
  if (!/advisory lanes and summary states only/i.test(result.stopRules.join(" "))) throw new Error("Phase 10C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not invent property facts/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 10C AI boundary is missing.");
  if (!/final neighborhood judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/distress-signal verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 10C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 10D — Virtual D4D Implementation Scope") throw new Error("Phase 10C must hand off to Phase 10D.");
  if (unsafePattern.test(text)) throw new Error("Phase 10C wording must not imply unsafe authorization.");
}

export function getPhase10ManualVirtualD4dPolicySummary() {
  const result = getPhase10ManualVirtualD4dPolicy();
  return `${result.phase} / ${result.phaseStep}: defines manual Virtual D4D lanes and summary states for highest acquisition ROI per operator hour with human-owned neighborhood judgment, property fact verification, distress-signal verification, and legal-source verification. No scraping, no map crawling, no Street View automation, no GPS surveillance, no owner contact, no autonomous lead creation, no outreach, no CRM mutation, no spend increase, no Phase 11 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
