import {
  phase2LeadIntakeMinimalImplementationGateHighestAroiPurpose,
  phase2LeadIntakeMinimalImplementationGateLaneDetails,
  phase2LeadIntakeMinimalImplementationGateLanes,
} from "./phase-2-lead-intake-minimal-implementation-gate";

export const phase2LeadIntakeFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  finalLockdownOnly: true,
  phase2PlanningOnly: true,
  operatorLeverageOnly: true,
  phase2LockdownEnforced: true,
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
  autonomousLeadCreationEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  sellerOutreachEnabled: false,
  buyerOutreachEnabled: false,
  phase3ImplementationEnabled: false,
  phase3TransitionApproved: false,
  goLiveAuthorized: false,
} as const;

export type Phase2LeadIntakeFinalLockdownDecision = "not_authorized";

export type Phase2LeadIntakeFinalLockdown = {
  phase: "Phase 2: Lead Intake & Simple CRM";
  phaseStep: "Phase 2F — Lead Intake Final Lockdown";
  previousStep: "Phase 2E — Lead Intake Minimal Implementation Gate";
  systemMode: "small_high_clarity_acquisition_operating_system";
  strategicAlignment: "elite_high_aroi_acquisition_os";
  primaryMetric: "acquisition_roi_per_operator_hour";
  phaseDecision: "final_lockdown_only";
  implementationDecision: Phase2LeadIntakeFinalLockdownDecision;
  providerDecision: Phase2LeadIntakeFinalLockdownDecision;
  automationDecision: Phase2LeadIntakeFinalLockdownDecision;
  communicationDecision: Phase2LeadIntakeFinalLockdownDecision;
  crmMutationDecision: Phase2LeadIntakeFinalLockdownDecision;
  schemaDecision: Phase2LeadIntakeFinalLockdownDecision;
  runtimeDecision: Phase2LeadIntakeFinalLockdownDecision;
  recommendedNextExactStep: "Phase 3 — Lead Prioritization Engine";
  nextStageRecommendation: "Phase 3 — Lead Prioritization Engine";
  finalLockdownRules: string[];
  phase2eGateReferences: {
    gateLanes: typeof phase2LeadIntakeMinimalImplementationGateLanes;
    gateLaneDetails: typeof phase2LeadIntakeMinimalImplementationGateLaneDetails;
    highestAroiPurpose: typeof phase2LeadIntakeMinimalImplementationGateHighestAroiPurpose;
  };
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase2LeadIntakeFinalLockdownFlags;
};

export const phase2LeadIntakeFinalLockdownRules = [
  "Phase 2F closes Phase 2 as final lockdown only.",
  "Phase 2F authorizes no implementation execution, no schema edits, no form edits, no API edits, no CRM mutation, no storage mutation, and no runtime work.",
  "Phase 2F authorizes no provider activation, no outreach, no automation, no scraping, no skip tracing, no autonomous lead creation, no Phase 3 implementation, and no go-live.",
  "Phase 2F can recommend Phase 3 — Lead Prioritization Engine as the next roadmap phase only after human Phase 2 closeout review.",
];

export const phase2LeadIntakeFinalLockdownAiBoundary = [
  "summarize Phase 2 closeout for human review only",
  "summarize Phase 2A through Phase 2E continuity",
  "summarize remaining blocked paths",
  "prepare Phase 3 transition notes for human review",
  "do not invent property facts",
  "do not enrich leads with unverified facts",
  "do not create leads",
  "do not mutate CRM records",
  "do not edit schema",
  "do not edit forms",
  "do not edit APIs",
  "do not contact sellers",
  "do not activate providers",
  "do not scrape data",
  "do not skip trace owners",
  "do not run automation",
  "do not approve Phase 3 implementation",
  "do not authorize go-live",
];

export const phase2LeadIntakeFinalLockdownHumanBoundary = [
  "Phase 2 closeout approval",
  "Phase 3 transition approval",
  "final implementation approval",
  "required/optional field judgment",
  "source judgment",
  "property fact verification",
  "duplicate merge decisions",
  "seller communication",
  "CRM approval",
];

export const phase2LeadIntakeFinalLockdownForbiddenDrift = [
  "implementation execution",
  "schema edits",
  "form edits",
  "API edits",
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
  "scraping",
  "skip tracing",
  "autonomous lead creation",
  "invented property facts",
  "Phase 3 implementation",
  "go-live",
];

export function getPhase2LeadIntakeFinalLockdown(): Phase2LeadIntakeFinalLockdown {
  const result: Phase2LeadIntakeFinalLockdown = {
    phase: "Phase 2: Lead Intake & Simple CRM",
    phaseStep: "Phase 2F — Lead Intake Final Lockdown",
    previousStep: "Phase 2E — Lead Intake Minimal Implementation Gate",
    systemMode: "small_high_clarity_acquisition_operating_system",
    strategicAlignment: "elite_high_aroi_acquisition_os",
    primaryMetric: "acquisition_roi_per_operator_hour",
    phaseDecision: "final_lockdown_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    recommendedNextExactStep: "Phase 3 — Lead Prioritization Engine",
    nextStageRecommendation: "Phase 3 — Lead Prioritization Engine",
    finalLockdownRules: phase2LeadIntakeFinalLockdownRules,
    phase2eGateReferences: {
      gateLanes: phase2LeadIntakeMinimalImplementationGateLanes,
      gateLaneDetails: phase2LeadIntakeMinimalImplementationGateLaneDetails,
      highestAroiPurpose: phase2LeadIntakeMinimalImplementationGateHighestAroiPurpose,
    },
    aiOperatorLeverageBoundary: phase2LeadIntakeFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase2LeadIntakeFinalLockdownHumanBoundary,
    forbiddenDrift: phase2LeadIntakeFinalLockdownForbiddenDrift,
    flags: phase2LeadIntakeFinalLockdownFlags,
  };

  assertPhase2LeadIntakeFinalLockdownSafe(result);

  return result;
}

export function assertPhase2LeadIntakeFinalLockdownSafe(result: Phase2LeadIntakeFinalLockdown) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "finalLockdownOnly", "phase2PlanningOnly", "operatorLeverageOnly", "phase2LockdownEnforced"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([flag, value]) => !allowedTrueFlags.has(flag) && value === true);
  const rulesText = result.finalLockdownRules.join(" ");
  const aiBoundaryText = result.aiOperatorLeverageBoundary.join(" ");
  const humanBoundaryText = result.humanOwnershipBoundary.join(" ");
  const forbiddenDriftText = result.forbiddenDrift.join(" ");
  const allText = [rulesText, aiBoundaryText, humanBoundaryText, forbiddenDriftText].join(" ");
  const unsafeWordingPattern =
    /implementation execution (?:is|are) authorized|schema edits? (?:is|are) authorized|form edits? (?:is|are) authorized|API edits? (?:is|are) authorized|CRM mutation (?:is|are) authorized|outreach (?:is|are) authorized|provider activation (?:is|are) authorized|scraping (?:is|are) authorized|skip tracing (?:is|are) authorized|autonomous lead creation (?:is|are) authorized|Phase 3 implementation (?:is|are) authorized|go-live (?:is|are) authorized/i;

  if (result.phase !== "Phase 2: Lead Intake & Simple CRM") throw new Error("Phase 2F final lockdown phase must remain pinned.");
  if (result.phaseStep !== "Phase 2F — Lead Intake Final Lockdown") throw new Error("Phase 2F final lockdown step must remain pinned.");
  if (result.previousStep !== "Phase 2E — Lead Intake Minimal Implementation Gate") throw new Error("Phase 2F previous step must remain Phase 2E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 2F must remain final-lockdown-only.");
  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.schemaDecision !== "not_authorized" ||
    result.runtimeDecision !== "not_authorized"
  ) {
    throw new Error("Phase 2F decisions must remain not_authorized.");
  }
  if (
    result.recommendedNextExactStep !== "Phase 3 — Lead Prioritization Engine" ||
    result.nextStageRecommendation !== "Phase 3 — Lead Prioritization Engine"
  ) {
    throw new Error("Phase 2F must hand off only to Phase 3 — Lead Prioritization Engine.");
  }
  if (!result.flags.phase2LockdownEnforced || unsafeTrueFlags.length > 0) {
    throw new Error("Phase 2F must enforce lockdown and cannot authorize implementation, providers, communication, automation, CRM mutation, schema changes, form changes, API changes, storage mutation, runtime jobs, autonomous lead creation, scraping, skip tracing, outreach, Phase 3 implementation, or go-live.");
  }
  if (
    result.phase2eGateReferences.gateLanes.join("|") !== phase2LeadIntakeMinimalImplementationGateLanes.join("|") ||
    result.phase2eGateReferences.gateLaneDetails.map((detail) => detail.lane).join("|") !== phase2LeadIntakeMinimalImplementationGateLaneDetails.map((detail) => detail.lane).join("|") ||
    result.phase2eGateReferences.highestAroiPurpose.join("|") !== phase2LeadIntakeMinimalImplementationGateHighestAroiPurpose.join("|")
  ) {
    throw new Error("Phase 2F must preserve Phase 2E gate references without modifying them.");
  }
  if (
    !/final lockdown only/i.test(rulesText) ||
    !/authorizes no implementation execution/i.test(rulesText) ||
    !/no schema edits/i.test(rulesText) ||
    !/no form edits/i.test(rulesText) ||
    !/no API edits/i.test(rulesText) ||
    !/no CRM mutation/i.test(rulesText) ||
    !/no storage mutation/i.test(rulesText) ||
    !/no runtime work/i.test(rulesText) ||
    !/no provider activation/i.test(rulesText) ||
    !/no outreach/i.test(rulesText) ||
    !/no automation/i.test(rulesText) ||
    !/no scraping/i.test(rulesText) ||
    !/no skip tracing/i.test(rulesText) ||
    !/no autonomous lead creation/i.test(rulesText) ||
    !/no Phase 3 implementation/i.test(rulesText) ||
    !/no go-live/i.test(rulesText)
  ) {
    throw new Error("Phase 2F must include final lockdown rules preventing unsafe drift.");
  }
  if (
    result.aiOperatorLeverageBoundary.length === 0 ||
    !/summarize Phase 2 closeout for human review only/i.test(aiBoundaryText) ||
    !/do not invent property facts/i.test(aiBoundaryText) ||
    !/do not create leads/i.test(aiBoundaryText) ||
    !/do not mutate CRM records/i.test(aiBoundaryText) ||
    !/do not approve Phase 3 implementation/i.test(aiBoundaryText) ||
    !/do not authorize go-live/i.test(aiBoundaryText)
  ) {
    throw new Error("Phase 2F AI boundary must remain closeout-summary-only and execution-blocked.");
  }
  if (
    result.humanOwnershipBoundary.length === 0 ||
    !/Phase 2 closeout approval/i.test(humanBoundaryText) ||
    !/Phase 3 transition approval/i.test(humanBoundaryText) ||
    !/final implementation approval/i.test(humanBoundaryText) ||
    !/source judgment/i.test(humanBoundaryText) ||
    !/property fact verification/i.test(humanBoundaryText) ||
    !/duplicate merge decisions/i.test(humanBoundaryText) ||
    !/seller communication/i.test(humanBoundaryText) ||
    !/CRM approval/i.test(humanBoundaryText)
  ) {
    throw new Error("Phase 2F must preserve human ownership for closeout, Phase 3 transition, implementation approval, source judgment, verification, duplicate merges, seller communication, and CRM approval.");
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
    throw new Error("Phase 2F forbidden drift must block implementation, schema, form, API, CRM, provider, outreach, scraping, skip tracing, autonomous lead creation, Phase 3 implementation, and go-live drift.");
  }
  if (unsafeWordingPattern.test(allText)) {
    throw new Error("Phase 2F wording must not imply implementation execution, schema edits, form edits, API edits, CRM mutation, outreach, provider activation, scraping, skip tracing, autonomous lead creation, Phase 3 implementation, or go-live authorization.");
  }
}

export function getPhase2LeadIntakeFinalLockdownSummary() {
  const result = getPhase2LeadIntakeFinalLockdown();

  return `${result.phase} / ${result.phaseStep}: Phase 2 final lockdown only. Phase 2 is closed for highest acquisition ROI per operator hour with human-owned Phase 2 closeout and Phase 3 transition approval. No implementation execution, no schema edits, no form edits, no API edits, no CRM mutation, no outreach, no scraping, no autonomous lead creation, no Phase 3 implementation, and no go-live are authorized. Next stage: ${result.nextStageRecommendation}.`;
}
