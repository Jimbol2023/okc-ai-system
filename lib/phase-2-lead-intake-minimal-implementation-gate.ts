import {
  phase2LeadIntakeGapImplementationScopeHighestAroiPurpose,
  phase2LeadIntakeImplementationLaneDetails,
  phase2LeadIntakeImplementationLanes,
} from "./phase-2-lead-intake-gap-implementation-scope";

export const phase2LeadIntakeMinimalImplementationGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  minimalImplementationGateOnly: true,
  phase2PlanningOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  communicationEnabled: false,
  automationEnabled: false,
  crmMutationEnabled: false,
  schemaChangeEnabled: false,
  formChangeEnabled: false,
  apiChangeEnabled: false,
  storageMutationEnabled: false,
  runtimeJobsEnabled: false,
  queueSystemEnabled: false,
  campaignEnabled: false,
  paidAdsEnabled: false,
  autonomousLeadCreationEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  mapAutomationEnabled: false,
  streetViewAutomationEnabled: false,
  gpsSurveillanceEnabled: false,
  sellerOutreachEnabled: false,
  buyerOutreachEnabled: false,
  offerGenerationEnabled: false,
  contractGenerationEnabled: false,
  phase3ImplementationEnabled: false,
  phase3TransitionApproved: false,
  goLiveAuthorized: false,
} as const;

export type Phase2LeadIntakeMinimalImplementationGateDecision = "not_authorized";

export type Phase2LeadIntakeMinimalImplementationGateLane =
  | "highest_aroi_minimal_package"
  | "operator_review_quality_package"
  | "implementation_blockers"
  | "phase_2f_lockdown_requirements";

export type Phase2LeadIntakeMinimalImplementationGateLaneDetail = {
  lane: Phase2LeadIntakeMinimalImplementationGateLane;
  gateMeaning: string;
  reviewItems: string[];
};

export type Phase2LeadIntakeMinimalImplementationGate = {
  phase: "Phase 2: Lead Intake & Simple CRM";
  phaseStep: "Phase 2E — Lead Intake Minimal Implementation Gate";
  previousStep: "Phase 2D — Lead Intake Gap Implementation Scope";
  systemMode: "small_high_clarity_acquisition_operating_system";
  strategicAlignment: "elite_high_aroi_acquisition_os";
  primaryMetric: "acquisition_roi_per_operator_hour";
  phaseDecision: "minimal_implementation_gate_only";
  implementationDecision: Phase2LeadIntakeMinimalImplementationGateDecision;
  providerDecision: Phase2LeadIntakeMinimalImplementationGateDecision;
  automationDecision: Phase2LeadIntakeMinimalImplementationGateDecision;
  communicationDecision: Phase2LeadIntakeMinimalImplementationGateDecision;
  crmMutationDecision: Phase2LeadIntakeMinimalImplementationGateDecision;
  schemaDecision: Phase2LeadIntakeMinimalImplementationGateDecision;
  runtimeDecision: Phase2LeadIntakeMinimalImplementationGateDecision;
  recommendedNextExactStep: "Phase 2F — Lead Intake Final Lockdown";
  nextStageRecommendation: "Phase 2F — Lead Intake Final Lockdown";
  stopRule: string[];
  highestAroiGatePurpose: string[];
  gateLanes: Phase2LeadIntakeMinimalImplementationGateLane[];
  gateLaneDetails: Phase2LeadIntakeMinimalImplementationGateLaneDetail[];
  phase2dScopeReferences: {
    implementationLanes: typeof phase2LeadIntakeImplementationLanes;
    implementationLaneDetails: typeof phase2LeadIntakeImplementationLaneDetails;
    highestAroiPurpose: typeof phase2LeadIntakeGapImplementationScopeHighestAroiPurpose;
  };
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase2LeadIntakeMinimalImplementationGateFlags;
};

export const phase2LeadIntakeMinimalImplementationGateLanes: Phase2LeadIntakeMinimalImplementationGateLane[] = [
  "highest_aroi_minimal_package",
  "operator_review_quality_package",
  "implementation_blockers",
  "phase_2f_lockdown_requirements",
];

export const phase2LeadIntakeMinimalImplementationGateLaneDetails: Phase2LeadIntakeMinimalImplementationGateLaneDetail[] = [
  {
    lane: "highest_aroi_minimal_package",
    gateMeaning: "Review whether a future minimal package should focus first on the highest-aROI intake clarity gaps.",
    reviewItems: ["seller contact clarity", "source clarity", "duplicate-risk visibility", "DNC/STOP contact safety"],
  },
  {
    lane: "operator_review_quality_package",
    gateMeaning: "Review optional clarity improvements that make human lead review faster without automating decisions.",
    reviewItems: ["property completeness", "motivation/timeline/condition/price context", "human-review visibility"],
  },
  {
    lane: "implementation_blockers",
    gateMeaning: "Keep every actual build path closed until a later human-approved implementation request.",
    reviewItems: ["schema edits", "form edits", "API edits", "CRM mutation", "storage mutation"],
  },
  {
    lane: "phase_2f_lockdown_requirements",
    gateMeaning: "Confirm Phase 2 can close without drift into Phase 3 implementation, outreach, providers, automation, or go-live.",
    reviewItems: ["Phase 2A reviewed", "Phase 2B reviewed", "Phase 2C reviewed", "Phase 2D reviewed", "Phase 2E reviewed", "final lockdown ready"],
  },
];

export const phase2LeadIntakeMinimalImplementationGateStopRule = [
  "Phase 2E is a minimal implementation gate only.",
  "Phase 2E does not execute implementation, edit schema, edit forms, edit APIs, mutate CRM records, mutate storage, or create runtime behavior.",
  "Phase 2E does not activate providers, contact sellers, send SMS, send email, call leads, scrape, skip trace, automate, create leads, approve Phase 3 implementation, or authorize go-live.",
  "Phase 2E stops after one lightweight minimal implementation gate and hands off only to Phase 2F — Lead Intake Final Lockdown.",
];

export const phase2LeadIntakeMinimalImplementationGateHighestAroiPurpose = [
  "Evaluate whether a future minimal lead-intake package is worth considering for highest acquisition ROI per operator hour.",
  "Protect operator focus by favoring seller contact clarity, source clarity, duplicate-risk visibility, DNC/STOP safety, faster human review, and simple CRM usability.",
  "Keep all implementation approval human-owned and block actual build work until after this gate is reviewed.",
];

export const phase2LeadIntakeMinimalImplementationGateAiBoundary = [
  "summarize gate readiness for human review only",
  "rank minimal-package candidates for human review only",
  "explain operator ROI for proposed minimal scope",
  "identify missing review areas",
  "prepare human-review notes",
  "do not invent property facts",
  "do not enrich leads with unverified facts",
  "do not scrape data",
  "do not skip trace owners",
  "do not create leads",
  "do not mutate CRM records",
  "do not edit schema",
  "do not edit forms",
  "do not edit APIs",
  "do not contact sellers",
  "do not send SMS",
  "do not send email",
  "do not call leads",
  "do not activate providers",
  "do not run automation",
  "do not make final lead quality decisions",
  "do not approve implementation",
  "do not authorize go-live",
];

export const phase2LeadIntakeMinimalImplementationGateHumanBoundary = [
  "final implementation approval",
  "required/optional field judgment",
  "source judgment",
  "property fact verification",
  "duplicate merge decisions",
  "seller communication",
  "CRM approval",
  "Phase 2 closeout approval",
  "Phase 3 transition approval",
];

export const phase2LeadIntakeMinimalImplementationGateForbiddenDrift = [
  "implementation execution",
  "schema edits",
  "schema changes",
  "form edits",
  "form changes",
  "API edits",
  "API changes",
  "CRM mutation",
  "storage mutation",
  "provider activation",
  "seller outreach",
  "buyer outreach",
  "SMS sending",
  "email sending",
  "calling",
  "automation",
  "runtime jobs",
  "queues",
  "campaigns",
  "paid ads",
  "scraping",
  "skip tracing",
  "autonomous lead creation",
  "invented property facts",
  "offer generation",
  "contract generation",
  "Phase 3 implementation",
  "go-live",
];

export function getPhase2LeadIntakeMinimalImplementationGate(): Phase2LeadIntakeMinimalImplementationGate {
  const result: Phase2LeadIntakeMinimalImplementationGate = {
    phase: "Phase 2: Lead Intake & Simple CRM",
    phaseStep: "Phase 2E — Lead Intake Minimal Implementation Gate",
    previousStep: "Phase 2D — Lead Intake Gap Implementation Scope",
    systemMode: "small_high_clarity_acquisition_operating_system",
    strategicAlignment: "elite_high_aroi_acquisition_os",
    primaryMetric: "acquisition_roi_per_operator_hour",
    phaseDecision: "minimal_implementation_gate_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    recommendedNextExactStep: "Phase 2F — Lead Intake Final Lockdown",
    nextStageRecommendation: "Phase 2F — Lead Intake Final Lockdown",
    stopRule: phase2LeadIntakeMinimalImplementationGateStopRule,
    highestAroiGatePurpose: phase2LeadIntakeMinimalImplementationGateHighestAroiPurpose,
    gateLanes: phase2LeadIntakeMinimalImplementationGateLanes,
    gateLaneDetails: phase2LeadIntakeMinimalImplementationGateLaneDetails,
    phase2dScopeReferences: {
      implementationLanes: phase2LeadIntakeImplementationLanes,
      implementationLaneDetails: phase2LeadIntakeImplementationLaneDetails,
      highestAroiPurpose: phase2LeadIntakeGapImplementationScopeHighestAroiPurpose,
    },
    aiOperatorLeverageBoundary: phase2LeadIntakeMinimalImplementationGateAiBoundary,
    humanOwnershipBoundary: phase2LeadIntakeMinimalImplementationGateHumanBoundary,
    forbiddenDrift: phase2LeadIntakeMinimalImplementationGateForbiddenDrift,
    flags: phase2LeadIntakeMinimalImplementationGateFlags,
  };

  assertPhase2LeadIntakeMinimalImplementationGateSafe(result);

  return result;
}

export function assertPhase2LeadIntakeMinimalImplementationGateSafe(result: Phase2LeadIntakeMinimalImplementationGate) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "minimalImplementationGateOnly", "phase2PlanningOnly", "operatorLeverageOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([flag, value]) => !allowedTrueFlags.has(flag) && value === true);
  const stopRuleText = result.stopRule.join(" ");
  const aiBoundaryText = result.aiOperatorLeverageBoundary.join(" ");
  const humanBoundaryText = result.humanOwnershipBoundary.join(" ");
  const forbiddenDriftText = result.forbiddenDrift.join(" ");
  const allText = [
    stopRuleText,
    result.highestAroiGatePurpose.join(" "),
    result.gateLanes.join(" "),
    result.gateLaneDetails.map((detail) => `${detail.lane} ${detail.gateMeaning} ${detail.reviewItems.join(" ")}`).join(" "),
    aiBoundaryText,
    humanBoundaryText,
    forbiddenDriftText,
  ].join(" ");
  const unsafeWordingPattern =
    /implementation execution (?:is|are) authorized|schema (?:edits?|changes?) (?:is|are) authorized|form (?:changes?|edits?) (?:is|are) authorized|API (?:changes?|edits?) (?:is|are) authorized|CRM mutation (?:is|are) authorized|outreach (?:is|are) authorized|provider activation (?:is|are) authorized|scraping (?:is|are) authorized|skip tracing (?:is|are) authorized|autonomous lead creation (?:is|are) authorized|Phase 3 implementation (?:is|are) authorized|go-live (?:is|are) authorized/i;

  if (result.phase !== "Phase 2: Lead Intake & Simple CRM") throw new Error("Phase 2E minimal implementation gate phase must remain pinned.");
  if (result.phaseStep !== "Phase 2E — Lead Intake Minimal Implementation Gate") throw new Error("Phase 2E minimal implementation gate step must remain pinned.");
  if (result.previousStep !== "Phase 2D — Lead Intake Gap Implementation Scope") throw new Error("Phase 2E previous step must remain Phase 2D.");
  if (
    result.systemMode !== "small_high_clarity_acquisition_operating_system" ||
    result.strategicAlignment !== "elite_high_aroi_acquisition_os" ||
    result.primaryMetric !== "acquisition_roi_per_operator_hour"
  ) {
    throw new Error("Phase 2E alignment fields must remain pinned.");
  }
  if (result.phaseDecision !== "minimal_implementation_gate_only") throw new Error("Phase 2E must remain minimal-implementation-gate-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.schemaDecision !== "not_authorized" ||
    result.runtimeDecision !== "not_authorized"
  ) {
    throw new Error("Phase 2E decisions must remain not_authorized.");
  }
  if (
    result.recommendedNextExactStep !== "Phase 2F — Lead Intake Final Lockdown" ||
    result.nextStageRecommendation !== "Phase 2F — Lead Intake Final Lockdown"
  ) {
    throw new Error("Phase 2E must hand off only to Phase 2F — Lead Intake Final Lockdown.");
  }
  if (unsafeTrueFlags.length > 0) {
    throw new Error("Phase 2E cannot authorize implementation, providers, communication, automation, CRM mutation, schema changes, form changes, API changes, storage mutation, runtime jobs, campaigns, autonomous lead creation, scraping, skip tracing, outreach, Phase 3 implementation, or go-live.");
  }
  if (result.gateLanes.join("|") !== phase2LeadIntakeMinimalImplementationGateLanes.join("|")) {
    throw new Error("Phase 2E must include all required minimal implementation gate lanes.");
  }
  if (
    result.phase2dScopeReferences.implementationLanes.join("|") !== phase2LeadIntakeImplementationLanes.join("|") ||
    result.phase2dScopeReferences.implementationLaneDetails.map((detail) => detail.lane).join("|") !== phase2LeadIntakeImplementationLaneDetails.map((detail) => detail.lane).join("|") ||
    result.phase2dScopeReferences.highestAroiPurpose.join("|") !== phase2LeadIntakeGapImplementationScopeHighestAroiPurpose.join("|")
  ) {
    throw new Error("Phase 2E must preserve Phase 2D scope references without modifying them.");
  }
  if (
    !/minimal implementation gate only/i.test(stopRuleText) ||
    !/does not execute implementation/i.test(stopRuleText) ||
    !/edit schema/i.test(stopRuleText) ||
    !/edit forms/i.test(stopRuleText) ||
    !/edit APIs/i.test(stopRuleText) ||
    !/mutate CRM records/i.test(stopRuleText) ||
    !/mutate storage/i.test(stopRuleText) ||
    !/runtime behavior/i.test(stopRuleText) ||
    !/activate providers/i.test(stopRuleText) ||
    !/contact sellers/i.test(stopRuleText) ||
    !/scrape/i.test(stopRuleText) ||
    !/skip trace/i.test(stopRuleText) ||
    !/automate/i.test(stopRuleText) ||
    !/create leads/i.test(stopRuleText) ||
    !/approve Phase 3 implementation/i.test(stopRuleText) ||
    !/authorize go-live/i.test(stopRuleText)
  ) {
    throw new Error("Phase 2E must include a stop rule preventing implementation and unsafe drift.");
  }
  if (
    result.aiOperatorLeverageBoundary.length === 0 ||
    !/summarize gate readiness for human review only/i.test(aiBoundaryText) ||
    !/do not invent property facts/i.test(aiBoundaryText) ||
    !/do not enrich leads with unverified facts/i.test(aiBoundaryText) ||
    !/do not scrape data/i.test(aiBoundaryText) ||
    !/do not skip trace owners/i.test(aiBoundaryText) ||
    !/do not create leads/i.test(aiBoundaryText) ||
    !/do not mutate CRM records/i.test(aiBoundaryText) ||
    !/do not approve implementation/i.test(aiBoundaryText) ||
    !/do not authorize go-live/i.test(aiBoundaryText)
  ) {
    throw new Error("Phase 2E AI boundary must remain gate-readiness-only and execution-blocked.");
  }
  if (
    result.humanOwnershipBoundary.length === 0 ||
    !/final implementation approval/i.test(humanBoundaryText) ||
    !/required\/optional field judgment/i.test(humanBoundaryText) ||
    !/source judgment/i.test(humanBoundaryText) ||
    !/property fact verification/i.test(humanBoundaryText) ||
    !/duplicate merge decisions/i.test(humanBoundaryText) ||
    !/seller communication/i.test(humanBoundaryText) ||
    !/CRM approval/i.test(humanBoundaryText) ||
    !/Phase 3 transition approval/i.test(humanBoundaryText)
  ) {
    throw new Error("Phase 2E must preserve human ownership for implementation approval, field judgment, source judgment, verification, duplicate merges, seller communication, CRM approval, and Phase 3 transition approval.");
  }
  if (
    result.forbiddenDrift.length === 0 ||
    !/implementation execution/i.test(forbiddenDriftText) ||
    !/schema edits/i.test(forbiddenDriftText) ||
    !/form edits/i.test(forbiddenDriftText) ||
    !/API edits/i.test(forbiddenDriftText) ||
    !/CRM mutation/i.test(forbiddenDriftText) ||
    !/provider activation/i.test(forbiddenDriftText) ||
    !/seller outreach/i.test(forbiddenDriftText) ||
    !/scraping/i.test(forbiddenDriftText) ||
    !/skip tracing/i.test(forbiddenDriftText) ||
    !/autonomous lead creation/i.test(forbiddenDriftText) ||
    !/Phase 3 implementation/i.test(forbiddenDriftText) ||
    !/go-live/i.test(forbiddenDriftText)
  ) {
    throw new Error("Phase 2E forbidden drift must block implementation, schema, form, API, CRM, provider, outreach, scraping, skip tracing, autonomous lead creation, Phase 3 implementation, and go-live drift.");
  }
  if (unsafeWordingPattern.test(allText)) {
    throw new Error("Phase 2E wording must not imply implementation execution, schema edits, form edits, API edits, CRM mutation, outreach, provider activation, scraping, skip tracing, autonomous lead creation, Phase 3 implementation, or go-live authorization.");
  }
}

export function getPhase2LeadIntakeMinimalImplementationGateSummary() {
  const result = getPhase2LeadIntakeMinimalImplementationGate();

  return `${result.phase} / ${result.phaseStep}: highest acquisition ROI per operator hour minimal implementation gate only. This supports human-owned implementation approval for seller contact clarity, source clarity, duplicate-risk visibility, DNC/STOP safety, faster human review, and simple CRM usability. No schema edits, no form edits, no API edits, no CRM mutation, no outreach, no scraping, no autonomous lead creation, no Phase 3 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
