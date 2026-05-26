export const phase2LeadIntakeSimpleCrmScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  scopeReviewOnly: true,
  phase2PlanningOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  communicationEnabled: false,
  automationEnabled: false,
  crmMutationEnabled: false,
  autonomousLeadCreationEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  mapAutomationEnabled: false,
  streetViewAutomationEnabled: false,
  gpsSurveillanceEnabled: false,
  runtimeJobsEnabled: false,
  queueSystemEnabled: false,
  campaignEnabled: false,
  paidAdsEnabled: false,
  sellerOutreachEnabled: false,
  buyerOutreachEnabled: false,
  offerGenerationEnabled: false,
  contractGenerationEnabled: false,
  phase3ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase2LeadIntakeSimpleCrmDecision = "not_authorized";

export type Phase2LeadIntakeSimpleCrmEvidenceCategory =
  | "existing_intake_fields"
  | "existing_crm_lead_fields"
  | "required_seller_contact_fields"
  | "required_property_fields"
  | "required_motivation_timeline_fields"
  | "required_source_tracking_fields"
  | "existing_lead_status_fields"
  | "missing_data_handling"
  | "duplicate_lead_handling"
  | "manual_review_workflow"
  | "human_approval_boundary"
  | "no_provider_no_outreach_boundary";

export type Phase2LeadIntakeSimpleCrmScopeReview = {
  phase: "Phase 2: Lead Intake & Simple CRM";
  phaseStep: "Phase 2A — Lead Intake & Simple CRM Scope Review";
  previousPhase: "Phase 1: Business Foundation & Trust Infrastructure";
  previousPhaseStatus: "readiness_governance_chain_sufficient_for_transition";
  systemMode: "small_high_clarity_acquisition_operating_system";
  strategicAlignment: "elite_high_aroi_acquisition_os";
  primaryMetric: "acquisition_roi_per_operator_hour";
  phaseDecision: "scope_review_only";
  implementationDecision: Phase2LeadIntakeSimpleCrmDecision;
  providerDecision: Phase2LeadIntakeSimpleCrmDecision;
  automationDecision: Phase2LeadIntakeSimpleCrmDecision;
  communicationDecision: Phase2LeadIntakeSimpleCrmDecision;
  crmMutationDecision: Phase2LeadIntakeSimpleCrmDecision;
  stopRule: string[];
  highestAroiUseCase: string[];
  evidenceCategories: Phase2LeadIntakeSimpleCrmEvidenceCategory[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  recommendedNextExactStep: "Phase 2B — Lead Intake Field Audit";
  nextStageRecommendation: "Phase 2B — Lead Intake Field Audit";
  flags: typeof phase2LeadIntakeSimpleCrmScopeFlags;
};

export const phase2LeadIntakeSimpleCrmEvidenceCategories: Phase2LeadIntakeSimpleCrmEvidenceCategory[] = [
  "existing_intake_fields",
  "existing_crm_lead_fields",
  "required_seller_contact_fields",
  "required_property_fields",
  "required_motivation_timeline_fields",
  "required_source_tracking_fields",
  "existing_lead_status_fields",
  "missing_data_handling",
  "duplicate_lead_handling",
  "manual_review_workflow",
  "human_approval_boundary",
  "no_provider_no_outreach_boundary",
];

export const phase2LeadIntakeSimpleCrmStopRule = [
  "Phase 2A produces one lightweight scope-review contract and stops.",
  "Phase 2A creates no additional readiness loop, nested review chain, Phase 1-style recursion, implementation plan, provider activation path, outreach path, CRM mutation path, runtime job, schema change, or go-live path.",
  "The next exact step is only Phase 2B — Lead Intake Field Audit.",
];

export const phase2LeadIntakeSimpleCrmHighestAroiUseCase = [
  "Help the human operator capture, review, organize, and understand seller lead information faster and more clearly.",
  "Improve clean seller intake review, missing information visibility, lead source clarity, property address clarity, seller contact completeness, motivation/timeline/condition/price visibility, manual review readiness, duplicate-risk awareness, operator next-review clarity, simple CRM usability, and human-owned decisions.",
  "Protect highest acquisition ROI per operator hour by reducing intake confusion and review time without autonomous outreach, autonomous lead creation, invented property facts, scraping, skip tracing, provider activation, uncontrolled CRM mutation, or scope expansion.",
];

export const phase2LeadIntakeSimpleCrmAiBoundary = [
  "summarize intake completeness",
  "identify missing fields",
  "flag duplicate-risk indicators",
  "help organize seller information",
  "suggest manual review priorities",
  "support operator clarity",
  "explain why a lead is incomplete",
  "do not create leads autonomously",
  "do not enrich leads with invented facts",
  "do not scrape property data",
  "do not skip trace owners",
  "do not contact sellers",
  "do not send SMS",
  "do not send email",
  "do not call leads",
  "do not activate providers",
  "do not mutate CRM records without explicit future authorization",
  "do not decide final lead quality without human review",
];

export const phase2LeadIntakeSimpleCrmHumanBoundary = [
  "lead acceptance",
  "lead rejection",
  "lead correction",
  "lead source judgment",
  "seller communication",
  "CRM record approval",
  "property fact verification",
  "duplicate merge decisions",
  "activation decisions",
  "Phase 2 implementation approval",
];

export const phase2LeadIntakeSimpleCrmForbiddenDrift = [
  "autonomous wholesaling",
  "autonomous lead creation",
  "provider activation",
  "SMS sending",
  "email sending",
  "calling",
  "skip tracing",
  "scraping",
  "map automation",
  "Street View automation",
  "GPS surveillance",
  "public-record crawling",
  "CRM mutation",
  "schema changes",
  "runtime jobs",
  "queues",
  "campaigns",
  "paid ads",
  "buyer outreach",
  "seller outreach",
  "offer generation",
  "contract generation",
  "Phase 3 implementation",
  "go-live",
];

export function getPhase2LeadIntakeSimpleCrmScopeReview(): Phase2LeadIntakeSimpleCrmScopeReview {
  const result: Phase2LeadIntakeSimpleCrmScopeReview = {
    phase: "Phase 2: Lead Intake & Simple CRM",
    phaseStep: "Phase 2A — Lead Intake & Simple CRM Scope Review",
    previousPhase: "Phase 1: Business Foundation & Trust Infrastructure",
    previousPhaseStatus: "readiness_governance_chain_sufficient_for_transition",
    systemMode: "small_high_clarity_acquisition_operating_system",
    strategicAlignment: "elite_high_aroi_acquisition_os",
    primaryMetric: "acquisition_roi_per_operator_hour",
    phaseDecision: "scope_review_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    stopRule: phase2LeadIntakeSimpleCrmStopRule,
    highestAroiUseCase: phase2LeadIntakeSimpleCrmHighestAroiUseCase,
    evidenceCategories: phase2LeadIntakeSimpleCrmEvidenceCategories,
    aiOperatorLeverageBoundary: phase2LeadIntakeSimpleCrmAiBoundary,
    humanOwnershipBoundary: phase2LeadIntakeSimpleCrmHumanBoundary,
    forbiddenDrift: phase2LeadIntakeSimpleCrmForbiddenDrift,
    recommendedNextExactStep: "Phase 2B — Lead Intake Field Audit",
    nextStageRecommendation: "Phase 2B — Lead Intake Field Audit",
    flags: phase2LeadIntakeSimpleCrmScopeFlags,
  };

  assertPhase2LeadIntakeSimpleCrmScopeSafe(result);

  return result;
}

export function assertPhase2LeadIntakeSimpleCrmScopeSafe(result: Phase2LeadIntakeSimpleCrmScopeReview) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "scopeReviewOnly", "phase2PlanningOnly", "operatorLeverageOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([flag, value]) => !allowedTrueFlags.has(flag) && value === true);
  const allText = [
    ...result.stopRule,
    ...result.highestAroiUseCase,
    ...result.aiOperatorLeverageBoundary,
    ...result.humanOwnershipBoundary,
    ...result.forbiddenDrift,
  ].join(" ");
  const unsafeWordingPattern =
    /outreach is authorized|provider activation is authorized|autonomous lead creation is authorized|scraping is authorized|skip tracing is authorized|CRM mutation is authorized|Phase 3 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 2: Lead Intake & Simple CRM") {
    throw new Error("Phase 2A scope review phase must remain pinned.");
  }

  if (result.phaseStep !== "Phase 2A — Lead Intake & Simple CRM Scope Review") {
    throw new Error("Phase 2A scope review step must remain pinned.");
  }

  if (result.previousPhase !== "Phase 1: Business Foundation & Trust Infrastructure") {
    throw new Error("Phase 2A scope review must preserve Phase 1 as the previous phase.");
  }

  if (result.previousPhaseStatus !== "readiness_governance_chain_sufficient_for_transition") {
    throw new Error("Phase 2A scope review must preserve the Phase 1 transition status.");
  }

  if (
    result.systemMode !== "small_high_clarity_acquisition_operating_system" ||
    result.strategicAlignment !== "elite_high_aroi_acquisition_os" ||
    result.primaryMetric !== "acquisition_roi_per_operator_hour"
  ) {
    throw new Error("Phase 2A scope review alignment fields must remain pinned.");
  }

  if (result.phaseDecision !== "scope_review_only") {
    throw new Error("Phase 2A must remain scope-review-only.");
  }

  if (
    result.implementationDecision !== "not_authorized" ||
    result.providerDecision !== "not_authorized" ||
    result.automationDecision !== "not_authorized" ||
    result.communicationDecision !== "not_authorized" ||
    result.crmMutationDecision !== "not_authorized"
  ) {
    throw new Error("Phase 2A implementation, provider, automation, communication, and CRM mutation decisions must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("Phase 2A cannot authorize implementation, providers, communication, automation, CRM mutation, autonomous lead creation, scraping, skip tracing, map automation, runtime jobs, queues, campaigns, paid ads, outreach, offer or contract generation, Phase 3 implementation, or go-live.");
  }

  if (result.evidenceCategories.join("|") !== phase2LeadIntakeSimpleCrmEvidenceCategories.join("|")) {
    throw new Error("Phase 2A must include all required lead intake and simple CRM evidence categories.");
  }

  if (!/one lightweight scope-review contract and stops/i.test(result.stopRule.join(" ")) || !/no additional readiness loop/i.test(result.stopRule.join(" "))) {
    throw new Error("Phase 2A must include a stop rule preventing a new governance chain.");
  }

  if (
    result.aiOperatorLeverageBoundary.length === 0 ||
    !/summarize intake completeness/i.test(result.aiOperatorLeverageBoundary.join(" ")) ||
    !/do not create leads autonomously/i.test(result.aiOperatorLeverageBoundary.join(" ")) ||
    !/do not mutate CRM records/i.test(result.aiOperatorLeverageBoundary.join(" "))
  ) {
    throw new Error("Phase 2A AI boundary must remain operator-leverage-only and cannot permit execution.");
  }

  if (
    result.humanOwnershipBoundary.length === 0 ||
    !/lead acceptance/i.test(result.humanOwnershipBoundary.join(" ")) ||
    !/seller communication/i.test(result.humanOwnershipBoundary.join(" ")) ||
    !/duplicate merge decisions/i.test(result.humanOwnershipBoundary.join(" ")) ||
    !/Phase 2 implementation approval/i.test(result.humanOwnershipBoundary.join(" "))
  ) {
    throw new Error("Phase 2A must preserve human ownership for lead review, communication, duplicate decisions, and implementation approval.");
  }

  if (
    result.forbiddenDrift.length === 0 ||
    !/autonomous lead creation/i.test(result.forbiddenDrift.join(" ")) ||
    !/provider activation/i.test(result.forbiddenDrift.join(" ")) ||
    !/seller outreach/i.test(result.forbiddenDrift.join(" ")) ||
    !/scraping/i.test(result.forbiddenDrift.join(" ")) ||
    !/skip tracing/i.test(result.forbiddenDrift.join(" ")) ||
    !/CRM mutation/i.test(result.forbiddenDrift.join(" ")) ||
    !/Phase 3 implementation/i.test(result.forbiddenDrift.join(" ")) ||
    !/go-live/i.test(result.forbiddenDrift.join(" "))
  ) {
    throw new Error("Phase 2A forbidden drift must block autonomous lead creation, outreach, providers, scraping, skip tracing, CRM mutation, Phase 3 implementation, and go-live.");
  }

  if (unsafeWordingPattern.test(allText)) {
    throw new Error("Phase 2A wording must not imply outreach, provider activation, autonomous lead creation, scraping, skip tracing, CRM mutation, Phase 3 implementation, or go-live authorization.");
  }

  if (
    result.recommendedNextExactStep !== "Phase 2B — Lead Intake Field Audit" ||
    result.nextStageRecommendation !== "Phase 2B — Lead Intake Field Audit"
  ) {
    throw new Error("Phase 2A must stop at Phase 2B — Lead Intake Field Audit.");
  }
}

export function getPhase2LeadIntakeSimpleCrmScopeSummary() {
  const result = getPhase2LeadIntakeSimpleCrmScopeReview();

  return `${result.phase} / ${result.phaseStep}: one lightweight scope-review contract and stop. This protects highest acquisition ROI per operator hour through operator leverage only, human-owned lead review, cleaner seller intake, missing-field visibility, source clarity, duplicate-risk awareness, and simple CRM clarity. No autonomous lead creation, no provider activation, no outreach, no scraping, no skip tracing, no CRM mutation, no schema changes, no runtime jobs, no Phase 3 implementation, and no go-live is authorized. Next step: ${result.recommendedNextExactStep}.`;
}
