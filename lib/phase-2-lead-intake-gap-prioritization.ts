import {
  phase2LeadIntakeFieldAuditGroups,
  phase2LeadIntakeFieldAuditPublicIntakeFields,
  phase2LeadIntakeFieldAuditStoredLeadFieldFamilies,
  phase2LeadIntakeFieldAuditSurfaces,
  phase2LeadIntakeFieldAuditPrismaLeadFields,
} from "./phase-2-lead-intake-field-audit";

export const phase2LeadIntakeGapPrioritizationFlags = {
  readOnly: true,
  advisoryOnly: true,
  gapPrioritizationOnly: true,
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

export type Phase2LeadIntakeGapPrioritizationDecision = "not_authorized";

export type Phase2LeadIntakeGapCategory =
  | "seller_contact_clarity"
  | "property_location_completeness"
  | "source_attribution_clarity"
  | "motivation_timeline_condition_price_context"
  | "duplicate_risk_handling"
  | "dnc_stop_contact_safety_visibility"
  | "human_review_approval_visibility"
  | "simple_crm_operator_usability";

export type Phase2LeadIntakeGapPriorityLevel =
  | "highest_aroi_now"
  | "important_next"
  | "defer_until_implementation_scope";

export type Phase2LeadIntakeGapPriority = {
  category: Phase2LeadIntakeGapCategory;
  priorityLevel: Phase2LeadIntakeGapPriorityLevel;
  operatorRoiReason: string;
};

export type Phase2LeadIntakeGapPrioritization = {
  phase: "Phase 2: Lead Intake & Simple CRM";
  phaseStep: "Phase 2C — Lead Intake Gap Prioritization";
  previousStep: "Phase 2B — Lead Intake Field Audit";
  systemMode: "small_high_clarity_acquisition_operating_system";
  strategicAlignment: "elite_high_aroi_acquisition_os";
  primaryMetric: "acquisition_roi_per_operator_hour";
  phaseDecision: "gap_prioritization_only";
  implementationDecision: Phase2LeadIntakeGapPrioritizationDecision;
  providerDecision: Phase2LeadIntakeGapPrioritizationDecision;
  automationDecision: Phase2LeadIntakeGapPrioritizationDecision;
  communicationDecision: Phase2LeadIntakeGapPrioritizationDecision;
  crmMutationDecision: Phase2LeadIntakeGapPrioritizationDecision;
  schemaDecision: Phase2LeadIntakeGapPrioritizationDecision;
  runtimeDecision: Phase2LeadIntakeGapPrioritizationDecision;
  recommendedNextExactStep: "Phase 2D — Lead Intake Gap Implementation Scope";
  nextStageRecommendation: "Phase 2D — Lead Intake Gap Implementation Scope";
  stopRule: string[];
  highestAroiPrioritizationPurpose: string[];
  prioritizedGapCategories: Phase2LeadIntakeGapCategory[];
  priorityLevels: Phase2LeadIntakeGapPriorityLevel[];
  gapPriorities: Phase2LeadIntakeGapPriority[];
  phase2bFieldAuditReferences: {
    auditGroups: typeof phase2LeadIntakeFieldAuditGroups;
    fieldSurfaces: typeof phase2LeadIntakeFieldAuditSurfaces;
    publicIntakeFields: typeof phase2LeadIntakeFieldAuditPublicIntakeFields;
    storedLeadFieldFamilies: typeof phase2LeadIntakeFieldAuditStoredLeadFieldFamilies;
    prismaLeadFields: typeof phase2LeadIntakeFieldAuditPrismaLeadFields;
  };
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase2LeadIntakeGapPrioritizationFlags;
};

export const phase2LeadIntakeGapCategories: Phase2LeadIntakeGapCategory[] = [
  "seller_contact_clarity",
  "property_location_completeness",
  "source_attribution_clarity",
  "motivation_timeline_condition_price_context",
  "duplicate_risk_handling",
  "dnc_stop_contact_safety_visibility",
  "human_review_approval_visibility",
  "simple_crm_operator_usability",
];

export const phase2LeadIntakeGapPriorityLevels: Phase2LeadIntakeGapPriorityLevel[] = [
  "highest_aroi_now",
  "important_next",
  "defer_until_implementation_scope",
];

export const phase2LeadIntakeGapPriorities: Phase2LeadIntakeGapPriority[] = [
  {
    category: "seller_contact_clarity",
    priorityLevel: "highest_aroi_now",
    operatorRoiReason: "Clear seller contact fields directly reduce review time and prevent bad follow-up decisions.",
  },
  {
    category: "source_attribution_clarity",
    priorityLevel: "highest_aroi_now",
    operatorRoiReason: "Clear source attribution helps the operator judge lead quality and campaign signal without extra research.",
  },
  {
    category: "duplicate_risk_handling",
    priorityLevel: "highest_aroi_now",
    operatorRoiReason: "Duplicate-risk visibility protects operator time and prevents confusing repeated review of the same seller or property.",
  },
  {
    category: "dnc_stop_contact_safety_visibility",
    priorityLevel: "highest_aroi_now",
    operatorRoiReason: "Contact safety visibility prevents unsafe follow-up decisions before any seller communication happens outside the app.",
  },
  {
    category: "property_location_completeness",
    priorityLevel: "important_next",
    operatorRoiReason: "Complete property location context improves review clarity but can remain human-reviewed before implementation scope.",
  },
  {
    category: "motivation_timeline_condition_price_context",
    priorityLevel: "important_next",
    operatorRoiReason: "Motivation, timeline, condition, and price context improve seller review quality without becoming automated scoring.",
  },
  {
    category: "human_review_approval_visibility",
    priorityLevel: "important_next",
    operatorRoiReason: "Human-review visibility helps the operator see what needs attention while keeping approval human-owned.",
  },
  {
    category: "simple_crm_operator_usability",
    priorityLevel: "defer_until_implementation_scope",
    operatorRoiReason: "CRM usability gaps may require schema, form, API, or CRM changes, so they wait for Phase 2D scope.",
  },
];

export const phase2LeadIntakeGapPrioritizationStopRule = [
  "Phase 2C prioritizes existing lead intake and CRM gaps only.",
  "Phase 2C creates no implementation, no schema changes, no form edits, no API edits, no CRM mutation, no storage mutation, and no runtime work.",
  "Phase 2C creates no provider activation, no outreach, no automation, no scraping, no skip tracing, no autonomous lead creation, no Phase 3 implementation, and no go-live path.",
  "Phase 2C stops after one lightweight gap-prioritization contract and hands off only to Phase 2D — Lead Intake Gap Implementation Scope.",
];

export const phase2LeadIntakeGapPrioritizationHighestAroiPurpose = [
  "Rank existing intake and CRM gaps by highest acquisition ROI per operator hour while keeping final prioritization human-owned.",
  "Prioritize gaps that improve faster human review, missing-field visibility, source clarity, duplicate-risk awareness, contact safety, simple CRM usability, and cleaner seller intake.",
  "Defer gaps that need schema changes, form edits, API edits, or CRM mutation until Phase 2D implementation scope.",
];

export const phase2LeadIntakeGapPrioritizationAiBoundary = [
  "rank and explain gaps for human review only",
  "summarize which gaps reduce review time",
  "summarize missing-field visibility",
  "summarize source clarity gaps",
  "summarize duplicate-risk awareness gaps",
  "summarize contact safety visibility gaps",
  "support operator prioritization clarity",
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

export const phase2LeadIntakeGapPrioritizationHumanBoundary = [
  "final prioritization",
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
  "future implementation approval",
];

export const phase2LeadIntakeGapPrioritizationForbiddenDrift = [
  "implementation",
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

export function getPhase2LeadIntakeGapPrioritization(): Phase2LeadIntakeGapPrioritization {
  const result: Phase2LeadIntakeGapPrioritization = {
    phase: "Phase 2: Lead Intake & Simple CRM",
    phaseStep: "Phase 2C — Lead Intake Gap Prioritization",
    previousStep: "Phase 2B — Lead Intake Field Audit",
    systemMode: "small_high_clarity_acquisition_operating_system",
    strategicAlignment: "elite_high_aroi_acquisition_os",
    primaryMetric: "acquisition_roi_per_operator_hour",
    phaseDecision: "gap_prioritization_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    recommendedNextExactStep: "Phase 2D — Lead Intake Gap Implementation Scope",
    nextStageRecommendation: "Phase 2D — Lead Intake Gap Implementation Scope",
    stopRule: phase2LeadIntakeGapPrioritizationStopRule,
    highestAroiPrioritizationPurpose: phase2LeadIntakeGapPrioritizationHighestAroiPurpose,
    prioritizedGapCategories: phase2LeadIntakeGapCategories,
    priorityLevels: phase2LeadIntakeGapPriorityLevels,
    gapPriorities: phase2LeadIntakeGapPriorities,
    phase2bFieldAuditReferences: {
      auditGroups: phase2LeadIntakeFieldAuditGroups,
      fieldSurfaces: phase2LeadIntakeFieldAuditSurfaces,
      publicIntakeFields: phase2LeadIntakeFieldAuditPublicIntakeFields,
      storedLeadFieldFamilies: phase2LeadIntakeFieldAuditStoredLeadFieldFamilies,
      prismaLeadFields: phase2LeadIntakeFieldAuditPrismaLeadFields,
    },
    aiOperatorLeverageBoundary: phase2LeadIntakeGapPrioritizationAiBoundary,
    humanOwnershipBoundary: phase2LeadIntakeGapPrioritizationHumanBoundary,
    forbiddenDrift: phase2LeadIntakeGapPrioritizationForbiddenDrift,
    flags: phase2LeadIntakeGapPrioritizationFlags,
  };

  assertPhase2LeadIntakeGapPrioritizationSafe(result);

  return result;
}

export function assertPhase2LeadIntakeGapPrioritizationSafe(result: Phase2LeadIntakeGapPrioritization) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "gapPrioritizationOnly", "phase2PlanningOnly", "operatorLeverageOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([flag, value]) => !allowedTrueFlags.has(flag) && value === true);
  const stopRuleText = result.stopRule.join(" ");
  const aiBoundaryText = result.aiOperatorLeverageBoundary.join(" ");
  const humanBoundaryText = result.humanOwnershipBoundary.join(" ");
  const forbiddenDriftText = result.forbiddenDrift.join(" ");
  const allText = [
    stopRuleText,
    result.highestAroiPrioritizationPurpose.join(" "),
    result.prioritizedGapCategories.join(" "),
    result.priorityLevels.join(" "),
    result.gapPriorities.map((priority) => `${priority.category} ${priority.priorityLevel} ${priority.operatorRoiReason}`).join(" "),
    aiBoundaryText,
    humanBoundaryText,
    forbiddenDriftText,
  ].join(" ");
  const unsafeWordingPattern =
    /implementation (?:is|are) authorized|schema changes? (?:is|are) authorized|form (?:changes?|edits?) (?:is|are) authorized|API (?:changes?|edits?) (?:is|are) authorized|CRM mutation (?:is|are) authorized|outreach (?:is|are) authorized|provider activation (?:is|are) authorized|scraping (?:is|are) authorized|skip tracing (?:is|are) authorized|autonomous lead creation (?:is|are) authorized|Phase 3 implementation (?:is|are) authorized|go-live (?:is|are) authorized/i;

  if (result.phase !== "Phase 2: Lead Intake & Simple CRM") {
    throw new Error("Phase 2C gap prioritization phase must remain pinned.");
  }

  if (result.phaseStep !== "Phase 2C — Lead Intake Gap Prioritization") {
    throw new Error("Phase 2C gap prioritization step must remain pinned.");
  }

  if (result.previousStep !== "Phase 2B — Lead Intake Field Audit") {
    throw new Error("Phase 2C gap prioritization previous step must remain Phase 2B.");
  }

  if (
    result.systemMode !== "small_high_clarity_acquisition_operating_system" ||
    result.strategicAlignment !== "elite_high_aroi_acquisition_os" ||
    result.primaryMetric !== "acquisition_roi_per_operator_hour"
  ) {
    throw new Error("Phase 2C gap prioritization alignment fields must remain pinned.");
  }

  if (result.phaseDecision !== "gap_prioritization_only") {
    throw new Error("Phase 2C must remain gap-prioritization-only.");
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
    throw new Error("Phase 2C decisions must remain not_authorized.");
  }

  if (
    result.recommendedNextExactStep !== "Phase 2D — Lead Intake Gap Implementation Scope" ||
    result.nextStageRecommendation !== "Phase 2D — Lead Intake Gap Implementation Scope"
  ) {
    throw new Error("Phase 2C must hand off only to Phase 2D — Lead Intake Gap Implementation Scope.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("Phase 2C cannot authorize implementation, providers, communication, automation, CRM mutation, schema changes, form changes, API changes, storage mutation, runtime jobs, queues, campaigns, paid ads, autonomous lead creation, scraping, skip tracing, map automation, outreach, offer or contract generation, Phase 3 implementation, or go-live.");
  }

  if (result.prioritizedGapCategories.join("|") !== phase2LeadIntakeGapCategories.join("|")) {
    throw new Error("Phase 2C must include all required prioritized gap categories.");
  }

  if (result.priorityLevels.join("|") !== phase2LeadIntakeGapPriorityLevels.join("|")) {
    throw new Error("Phase 2C must include all required priority levels.");
  }

  if (
    result.phase2bFieldAuditReferences.auditGroups.join("|") !== phase2LeadIntakeFieldAuditGroups.join("|") ||
    result.phase2bFieldAuditReferences.fieldSurfaces.join("|") !== phase2LeadIntakeFieldAuditSurfaces.join("|") ||
    result.phase2bFieldAuditReferences.publicIntakeFields.join("|") !== phase2LeadIntakeFieldAuditPublicIntakeFields.join("|") ||
    result.phase2bFieldAuditReferences.storedLeadFieldFamilies.join("|") !== phase2LeadIntakeFieldAuditStoredLeadFieldFamilies.join("|") ||
    result.phase2bFieldAuditReferences.prismaLeadFields.join("|") !== phase2LeadIntakeFieldAuditPrismaLeadFields.join("|")
  ) {
    throw new Error("Phase 2C must preserve Phase 2B field audit references without modifying them.");
  }

  if (
    !/prioritizes existing lead intake and CRM gaps only/i.test(stopRuleText) ||
    !/no implementation/i.test(stopRuleText) ||
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
    throw new Error("Phase 2C must include a stop rule preventing implementation and unsafe drift.");
  }

  if (
    result.aiOperatorLeverageBoundary.length === 0 ||
    !/rank and explain gaps for human review only/i.test(aiBoundaryText) ||
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
    throw new Error("Phase 2C AI boundary must remain human-review-only and execution-blocked.");
  }

  if (
    result.humanOwnershipBoundary.length === 0 ||
    !/final prioritization/i.test(humanBoundaryText) ||
    !/source judgment/i.test(humanBoundaryText) ||
    !/required\/optional field decisions/i.test(humanBoundaryText) ||
    !/property fact verification/i.test(humanBoundaryText) ||
    !/duplicate merge decisions/i.test(humanBoundaryText) ||
    !/seller communication/i.test(humanBoundaryText) ||
    !/future implementation approval/i.test(humanBoundaryText)
  ) {
    throw new Error("Phase 2C must preserve human ownership for prioritization, source judgment, field decisions, verification, duplicate merges, seller communication, and implementation approval.");
  }

  if (
    result.forbiddenDrift.length === 0 ||
    !/implementation/i.test(forbiddenDriftText) ||
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
    throw new Error("Phase 2C forbidden drift must block implementation, schema, form, API, CRM, provider, outreach, scraping, skip tracing, autonomous lead creation, Phase 3 implementation, and go-live drift.");
  }

  if (unsafeWordingPattern.test(allText)) {
    throw new Error("Phase 2C wording must not imply implementation, schema changes, form edits, API edits, CRM mutation, outreach, provider activation, scraping, skip tracing, autonomous lead creation, Phase 3 implementation, or go-live authorization.");
  }
}

export function getPhase2LeadIntakeGapPrioritizationSummary() {
  const result = getPhase2LeadIntakeGapPrioritization();

  return `${result.phase} / ${result.phaseStep}: Lead Intake Gap Prioritization for highest acquisition ROI per operator hour. This is gap prioritization only, supports human-owned prioritization, and improves faster human review, missing-field visibility, source clarity, duplicate-risk awareness, contact safety, and simple CRM usability. No schema changes, no CRM mutation, no outreach, no scraping, and no autonomous lead creation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
