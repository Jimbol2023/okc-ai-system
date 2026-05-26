import {
  phase2LeadIntakeGapCategories,
  phase2LeadIntakeGapPriorities,
  phase2LeadIntakeGapPriorityLevels,
} from "./phase-2-lead-intake-gap-prioritization";

export const phase2LeadIntakeGapImplementationScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  implementationScopeOnly: true,
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
  goLiveAuthorized: false,
} as const;

export type Phase2LeadIntakeGapImplementationScopeDecision = "not_authorized";

export type Phase2LeadIntakeImplementationLane =
  | "candidate_highest_aroi_fields"
  | "candidate_review_clarity_fields"
  | "deferred_schema_or_crm_work"
  | "blocked_execution_work";

export type Phase2LeadIntakeImplementationLaneDetail = {
  lane: Phase2LeadIntakeImplementationLane;
  scopeMeaning: string;
  candidateItems: string[];
};

export type Phase2LeadIntakeGapImplementationScope = {
  phase: "Phase 2: Lead Intake & Simple CRM";
  phaseStep: "Phase 2D — Lead Intake Gap Implementation Scope";
  previousStep: "Phase 2C — Lead Intake Gap Prioritization";
  systemMode: "small_high_clarity_acquisition_operating_system";
  strategicAlignment: "elite_high_aroi_acquisition_os";
  primaryMetric: "acquisition_roi_per_operator_hour";
  phaseDecision: "implementation_scope_only";
  implementationDecision: Phase2LeadIntakeGapImplementationScopeDecision;
  providerDecision: Phase2LeadIntakeGapImplementationScopeDecision;
  automationDecision: Phase2LeadIntakeGapImplementationScopeDecision;
  communicationDecision: Phase2LeadIntakeGapImplementationScopeDecision;
  crmMutationDecision: Phase2LeadIntakeGapImplementationScopeDecision;
  schemaDecision: Phase2LeadIntakeGapImplementationScopeDecision;
  runtimeDecision: Phase2LeadIntakeGapImplementationScopeDecision;
  recommendedNextExactStep: "Phase 2E — Lead Intake Minimal Implementation Gate";
  nextStageRecommendation: "Phase 2E — Lead Intake Minimal Implementation Gate";
  stopRule: string[];
  highestAroiImplementationScopePurpose: string[];
  implementationLanes: Phase2LeadIntakeImplementationLane[];
  implementationLaneDetails: Phase2LeadIntakeImplementationLaneDetail[];
  phase2cPriorityReferences: {
    prioritizedGapCategories: typeof phase2LeadIntakeGapCategories;
    priorityLevels: typeof phase2LeadIntakeGapPriorityLevels;
    gapPriorities: typeof phase2LeadIntakeGapPriorities;
  };
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase2LeadIntakeGapImplementationScopeFlags;
};

export const phase2LeadIntakeImplementationLanes: Phase2LeadIntakeImplementationLane[] = [
  "candidate_highest_aroi_fields",
  "candidate_review_clarity_fields",
  "deferred_schema_or_crm_work",
  "blocked_execution_work",
];

export const phase2LeadIntakeImplementationLaneDetails: Phase2LeadIntakeImplementationLaneDetail[] = [
  {
    lane: "candidate_highest_aroi_fields",
    scopeMeaning: "Fields likely worth considering first in Phase 2E because they reduce review time or prevent bad follow-up decisions.",
    candidateItems: ["seller contact clarity", "source attribution clarity", "duplicate-risk handling", "DNC/STOP/contact safety visibility"],
  },
  {
    lane: "candidate_review_clarity_fields",
    scopeMeaning: "Fields that improve human review quality and may remain optional until a human approves implementation.",
    candidateItems: ["property location completeness", "motivation/timeline/condition/price context", "human review/approval visibility"],
  },
  {
    lane: "deferred_schema_or_crm_work",
    scopeMeaning: "Items that may require explicit future schema, form, API, CRM, or storage authorization before any build work.",
    candidateItems: ["simple CRM operator usability", "new structured intake fields", "stored CRM field changes", "future validation changes"],
  },
  {
    lane: "blocked_execution_work",
    scopeMeaning: "Execution paths outside Phase 2D and not eligible for implementation scope approval here.",
    candidateItems: ["outreach", "automation", "providers", "scraping", "skip tracing", "runtime jobs", "go-live"],
  },
];

export const phase2LeadIntakeGapImplementationScopeStopRule = [
  "Phase 2D scopes possible future lead intake gap implementation only.",
  "Phase 2D is not a build step and creates no implementation execution, no schema changes, no form edits, no API edits, no CRM mutation, no storage mutation, and no runtime work.",
  "Phase 2D creates no provider activation, no outreach, no automation, no scraping, no skip tracing, no autonomous lead creation, no Phase 3 implementation, and no go-live path.",
  "Phase 2D stops after one lightweight implementation-scope contract and hands off only to Phase 2E — Lead Intake Minimal Implementation Gate.",
];

export const phase2LeadIntakeGapImplementationScopeHighestAroiPurpose = [
  "Scope a possible future minimal implementation path for highest acquisition ROI per operator hour while keeping implementation approval human-owned.",
  "Focus future scope on faster human review, missing-field visibility, source clarity, duplicate-risk awareness, contact safety, simple CRM usability, and minimal future implementation.",
  "Keep all schema changes, form edits, API edits, CRM mutation, and storage changes blocked until a later human-approved implementation gate.",
];

export const phase2LeadIntakeGapImplementationScopeAiBoundary = [
  "explain implementation scope for human review only",
  "summarize candidate highest-aROI fields",
  "summarize candidate review-clarity fields",
  "identify deferred schema or CRM work",
  "identify blocked execution work",
  "support operator implementation-scope clarity",
  "do not invent property facts",
  "do not enrich leads with unverified facts",
  "do not scrape data",
  "do not skip trace owners",
  "do not create leads",
  "do not mutate CRM records",
  "do not contact sellers",
  "do not send SMS",
  "do not send email",
  "do not call leads",
  "do not activate providers",
  "do not run automation",
  "do not make final lead quality decisions",
  "do not approve implementation",
];

export const phase2LeadIntakeGapImplementationScopeHumanBoundary = [
  "final implementation approval",
  "field importance judgment",
  "required/optional field decisions",
  "source judgment",
  "lead acceptance decisions",
  "lead rejection decisions",
  "lead correction decisions",
  "property fact verification",
  "duplicate merge decisions",
  "seller communication",
  "CRM approval",
  "future implementation gate approval",
];

export const phase2LeadIntakeGapImplementationScopeForbiddenDrift = [
  "implementation execution",
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
  "map automation",
  "Street View automation",
  "GPS surveillance",
  "autonomous lead creation",
  "invented property facts",
  "offer generation",
  "contract generation",
  "Phase 3 implementation",
  "go-live",
];

export function getPhase2LeadIntakeGapImplementationScope(): Phase2LeadIntakeGapImplementationScope {
  const result: Phase2LeadIntakeGapImplementationScope = {
    phase: "Phase 2: Lead Intake & Simple CRM",
    phaseStep: "Phase 2D — Lead Intake Gap Implementation Scope",
    previousStep: "Phase 2C — Lead Intake Gap Prioritization",
    systemMode: "small_high_clarity_acquisition_operating_system",
    strategicAlignment: "elite_high_aroi_acquisition_os",
    primaryMetric: "acquisition_roi_per_operator_hour",
    phaseDecision: "implementation_scope_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    recommendedNextExactStep: "Phase 2E — Lead Intake Minimal Implementation Gate",
    nextStageRecommendation: "Phase 2E — Lead Intake Minimal Implementation Gate",
    stopRule: phase2LeadIntakeGapImplementationScopeStopRule,
    highestAroiImplementationScopePurpose: phase2LeadIntakeGapImplementationScopeHighestAroiPurpose,
    implementationLanes: phase2LeadIntakeImplementationLanes,
    implementationLaneDetails: phase2LeadIntakeImplementationLaneDetails,
    phase2cPriorityReferences: {
      prioritizedGapCategories: phase2LeadIntakeGapCategories,
      priorityLevels: phase2LeadIntakeGapPriorityLevels,
      gapPriorities: phase2LeadIntakeGapPriorities,
    },
    aiOperatorLeverageBoundary: phase2LeadIntakeGapImplementationScopeAiBoundary,
    humanOwnershipBoundary: phase2LeadIntakeGapImplementationScopeHumanBoundary,
    forbiddenDrift: phase2LeadIntakeGapImplementationScopeForbiddenDrift,
    flags: phase2LeadIntakeGapImplementationScopeFlags,
  };

  assertPhase2LeadIntakeGapImplementationScopeSafe(result);

  return result;
}

export function assertPhase2LeadIntakeGapImplementationScopeSafe(result: Phase2LeadIntakeGapImplementationScope) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "implementationScopeOnly", "phase2PlanningOnly", "operatorLeverageOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([flag, value]) => !allowedTrueFlags.has(flag) && value === true);
  const stopRuleText = result.stopRule.join(" ");
  const aiBoundaryText = result.aiOperatorLeverageBoundary.join(" ");
  const humanBoundaryText = result.humanOwnershipBoundary.join(" ");
  const forbiddenDriftText = result.forbiddenDrift.join(" ");
  const laneText = result.implementationLaneDetails.map((detail) => `${detail.lane} ${detail.scopeMeaning} ${detail.candidateItems.join(" ")}`).join(" ");
  const allText = [
    stopRuleText,
    result.highestAroiImplementationScopePurpose.join(" "),
    result.implementationLanes.join(" "),
    laneText,
    aiBoundaryText,
    humanBoundaryText,
    forbiddenDriftText,
  ].join(" ");
  const unsafeWordingPattern =
    /implementation execution (?:is|are) authorized|schema changes? (?:is|are) authorized|form (?:changes?|edits?) (?:is|are) authorized|API (?:changes?|edits?) (?:is|are) authorized|CRM mutation (?:is|are) authorized|outreach (?:is|are) authorized|provider activation (?:is|are) authorized|scraping (?:is|are) authorized|skip tracing (?:is|are) authorized|autonomous lead creation (?:is|are) authorized|Phase 3 implementation (?:is|are) authorized|go-live (?:is|are) authorized/i;

  if (result.phase !== "Phase 2: Lead Intake & Simple CRM") {
    throw new Error("Phase 2D implementation scope phase must remain pinned.");
  }

  if (result.phaseStep !== "Phase 2D — Lead Intake Gap Implementation Scope") {
    throw new Error("Phase 2D implementation scope step must remain pinned.");
  }

  if (result.previousStep !== "Phase 2C — Lead Intake Gap Prioritization") {
    throw new Error("Phase 2D implementation scope previous step must remain Phase 2C.");
  }

  if (
    result.systemMode !== "small_high_clarity_acquisition_operating_system" ||
    result.strategicAlignment !== "elite_high_aroi_acquisition_os" ||
    result.primaryMetric !== "acquisition_roi_per_operator_hour"
  ) {
    throw new Error("Phase 2D implementation scope alignment fields must remain pinned.");
  }

  if (result.phaseDecision !== "implementation_scope_only") {
    throw new Error("Phase 2D must remain implementation-scope-only.");
  }

  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized" ||
    result.schemaDecision !== "not_authorized" ||
    result.runtimeDecision !== "not_authorized"
  ) {
    throw new Error("Phase 2D decisions must remain not_authorized.");
  }

  if (
    result.recommendedNextExactStep !== "Phase 2E — Lead Intake Minimal Implementation Gate" ||
    result.nextStageRecommendation !== "Phase 2E — Lead Intake Minimal Implementation Gate"
  ) {
    throw new Error("Phase 2D must hand off only to Phase 2E — Lead Intake Minimal Implementation Gate.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("Phase 2D cannot authorize implementation execution, providers, communication, automation, CRM mutation, schema changes, form changes, API changes, storage mutation, runtime jobs, queues, campaigns, paid ads, autonomous lead creation, scraping, skip tracing, map automation, outreach, offer or contract generation, Phase 3 implementation, or go-live.");
  }

  if (result.implementationLanes.join("|") !== phase2LeadIntakeImplementationLanes.join("|")) {
    throw new Error("Phase 2D must include all required implementation scope lanes.");
  }

  if (
    result.phase2cPriorityReferences.prioritizedGapCategories.join("|") !== phase2LeadIntakeGapCategories.join("|") ||
    result.phase2cPriorityReferences.priorityLevels.join("|") !== phase2LeadIntakeGapPriorityLevels.join("|") ||
    result.phase2cPriorityReferences.gapPriorities.map((priority) => `${priority.category}:${priority.priorityLevel}`).join("|") !==
      phase2LeadIntakeGapPriorities.map((priority) => `${priority.category}:${priority.priorityLevel}`).join("|")
  ) {
    throw new Error("Phase 2D must preserve Phase 2C priority references without modifying them.");
  }

  if (
    !/scopes possible future lead intake gap implementation only/i.test(stopRuleText) ||
    !/not a build step/i.test(stopRuleText) ||
    !/no implementation execution/i.test(stopRuleText) ||
    !/no schema changes/i.test(stopRuleText) ||
    !/no form edits/i.test(stopRuleText) ||
    !/no API edits/i.test(stopRuleText) ||
    !/no CRM mutation/i.test(stopRuleText) ||
    !/no storage mutation/i.test(stopRuleText) ||
    !/no runtime work/i.test(stopRuleText) ||
    !/no provider activation/i.test(stopRuleText) ||
    !/no outreach/i.test(stopRuleText) ||
    !/no automation/i.test(stopRuleText) ||
    !/no scraping/i.test(stopRuleText) ||
    !/no skip tracing/i.test(stopRuleText) ||
    !/no autonomous lead creation/i.test(stopRuleText) ||
    !/no Phase 3 implementation/i.test(stopRuleText) ||
    !/no go-live path/i.test(stopRuleText)
  ) {
    throw new Error("Phase 2D must include a stop rule preventing build work and unsafe drift.");
  }

  if (
    result.aiOperatorLeverageBoundary.length === 0 ||
    !/explain implementation scope for human review only/i.test(aiBoundaryText) ||
    !/do not invent property facts/i.test(aiBoundaryText) ||
    !/do not enrich leads with unverified facts/i.test(aiBoundaryText) ||
    !/do not scrape data/i.test(aiBoundaryText) ||
    !/do not skip trace owners/i.test(aiBoundaryText) ||
    !/do not create leads/i.test(aiBoundaryText) ||
    !/do not mutate CRM records/i.test(aiBoundaryText) ||
    !/do not contact sellers/i.test(aiBoundaryText) ||
    !/do not make final lead quality decisions/i.test(aiBoundaryText) ||
    !/do not approve implementation/i.test(aiBoundaryText)
  ) {
    throw new Error("Phase 2D AI boundary must remain implementation-scope explanation only and execution-blocked.");
  }

  if (
    result.humanOwnershipBoundary.length === 0 ||
    !/final implementation approval/i.test(humanBoundaryText) ||
    !/source judgment/i.test(humanBoundaryText) ||
    !/required\/optional field decisions/i.test(humanBoundaryText) ||
    !/property fact verification/i.test(humanBoundaryText) ||
    !/duplicate merge decisions/i.test(humanBoundaryText) ||
    !/seller communication/i.test(humanBoundaryText) ||
    !/CRM approval/i.test(humanBoundaryText)
  ) {
    throw new Error("Phase 2D must preserve human ownership for implementation approval, source judgment, field decisions, verification, duplicate merges, seller communication, and CRM approval.");
  }

  if (
    result.forbiddenDrift.length === 0 ||
    !/implementation execution/i.test(forbiddenDriftText) ||
    !/schema changes/i.test(forbiddenDriftText) ||
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
    throw new Error("Phase 2D forbidden drift must block implementation execution, schema, form, API, CRM, provider, outreach, scraping, skip tracing, autonomous lead creation, Phase 3 implementation, and go-live drift.");
  }

  if (unsafeWordingPattern.test(allText)) {
    throw new Error("Phase 2D wording must not imply implementation execution, schema changes, form edits, API edits, CRM mutation, outreach, provider activation, scraping, skip tracing, autonomous lead creation, Phase 3 implementation, or go-live authorization.");
  }
}

export function getPhase2LeadIntakeGapImplementationScopeSummary() {
  const result = getPhase2LeadIntakeGapImplementationScope();

  return `${result.phase} / ${result.phaseStep}: Lead Intake Gap Implementation Scope for highest acquisition ROI per operator hour. This is implementation scope only, supports human-owned implementation approval, and frames minimal future implementation for faster human review, missing-field visibility, source clarity, duplicate-risk awareness, contact safety, and simple CRM usability. No schema changes, no form edits, no API edits, no CRM mutation, no outreach, no scraping, and no autonomous lead creation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
