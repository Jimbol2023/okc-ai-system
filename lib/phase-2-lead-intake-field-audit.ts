export const phase2LeadIntakeFieldAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  fieldAuditOnly: true,
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

export type Phase2LeadIntakeFieldAuditDecision = "not_authorized";

export type Phase2LeadIntakeFieldAuditGroup =
  | "seller_identity_contact"
  | "property_location"
  | "source_tracking"
  | "seller_motivation_timeline_condition_price_context"
  | "status_and_review_state"
  | "duplicate_risk_signals"
  | "dnc_stop_contact_safety"
  | "notes_and_situation_details"
  | "approval_human_review_fields"
  | "simple_crm_usability_fields";

export type Phase2LeadIntakeFieldAuditSurface =
  | "public_intake_schema_fields"
  | "stored_lead_contact_property_owner_import_source_status_notes_followups_analyzer_distress_score_approval_metadata"
  | "prisma_lead_core_fields"
  | "prisma_lead_automation_follow_up_reply_dnc_fields"
  | "prisma_unique_property_address_phone";

export type Phase2LeadIntakeFieldAudit = {
  phase: "Phase 2: Lead Intake & Simple CRM";
  phaseStep: "Phase 2B — Lead Intake Field Audit";
  previousStep: "Phase 2A — Lead Intake & Simple CRM Scope Review";
  systemMode: "small_high_clarity_acquisition_operating_system";
  strategicAlignment: "elite_high_aroi_acquisition_os";
  primaryMetric: "acquisition_roi_per_operator_hour";
  phaseDecision: "field_audit_only";
  implementationDecision: Phase2LeadIntakeFieldAuditDecision;
  providerDecision: Phase2LeadIntakeFieldAuditDecision;
  automationDecision: Phase2LeadIntakeFieldAuditDecision;
  communicationDecision: Phase2LeadIntakeFieldAuditDecision;
  crmMutationDecision: Phase2LeadIntakeFieldAuditDecision;
  schemaDecision: Phase2LeadIntakeFieldAuditDecision;
  runtimeDecision: Phase2LeadIntakeFieldAuditDecision;
  recommendedNextExactStep: "Phase 2C — Lead Intake Gap Prioritization";
  nextStageRecommendation: "Phase 2C — Lead Intake Gap Prioritization";
  stopRule: string[];
  highestAroiAuditPurpose: string[];
  fieldAuditGroups: Phase2LeadIntakeFieldAuditGroup[];
  fieldSurfacesAudited: Phase2LeadIntakeFieldAuditSurface[];
  existingPublicIntakeFields: string[];
  existingStoredLeadFieldFamilies: string[];
  existingPrismaLeadFields: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase2LeadIntakeFieldAuditFlags;
};

export const phase2LeadIntakeFieldAuditGroups: Phase2LeadIntakeFieldAuditGroup[] = [
  "seller_identity_contact",
  "property_location",
  "source_tracking",
  "seller_motivation_timeline_condition_price_context",
  "status_and_review_state",
  "duplicate_risk_signals",
  "dnc_stop_contact_safety",
  "notes_and_situation_details",
  "approval_human_review_fields",
  "simple_crm_usability_fields",
];

export const phase2LeadIntakeFieldAuditSurfaces: Phase2LeadIntakeFieldAuditSurface[] = [
  "public_intake_schema_fields",
  "stored_lead_contact_property_owner_import_source_status_notes_followups_analyzer_distress_score_approval_metadata",
  "prisma_lead_core_fields",
  "prisma_lead_automation_follow_up_reply_dnc_fields",
  "prisma_unique_property_address_phone",
];

export const phase2LeadIntakeFieldAuditPublicIntakeFields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "propertyAddress",
  "city",
  "state",
  "zipCode",
  "message",
  "source",
];

export const phase2LeadIntakeFieldAuditStoredLeadFieldFamilies = [
  "contact",
  "property",
  "owner/import",
  "source",
  "status",
  "notes",
  "follow-ups",
  "analyzer",
  "distress flags",
  "score/priority",
  "approval/mock outreach metadata",
];

export const phase2LeadIntakeFieldAuditPrismaLeadFields = [
  "name",
  "phone",
  "propertyAddress",
  "source",
  "status",
  "score",
  "priority",
  "notes",
  "payload",
  "automation fields",
  "follow-up fields",
  "reply fields",
  "DNC fields",
  "unique propertyAddress + phone",
];

export const phase2LeadIntakeFieldAuditStopRule = [
  "Phase 2B audits existing fields only.",
  "Phase 2B creates no new governance chain, no nested readiness loop, and no Phase 1-style recursion.",
  "Phase 2B creates no schema migration, no form changes, no API changes, no CRM mutation, and no implementation work.",
  "Phase 2B stops after one lightweight field-audit contract and hands off only to Phase 2C — Lead Intake Gap Prioritization.",
];

export const phase2LeadIntakeFieldAuditHighestAroiPurpose = [
  "Identify which existing intake and CRM fields are present, missing, redundant, unclear, or high-value for faster human lead review.",
  "Improve highest acquisition ROI per operator hour through faster human lead review, missing-field visibility, source clarity, duplicate-risk awareness, simple CRM usability, better operator focus, clearer seller intake, and cleaner handoff to Phase 2C gap prioritization.",
  "Keep the audit field audit only and human-owned so the operator can prioritize the next practical lead-intake gaps without schema changes, CRM mutation, outreach, scraping, or autonomous lead creation.",
];

export const phase2LeadIntakeFieldAuditAiBoundary = [
  "summarize field coverage",
  "summarize field gaps",
  "identify missing-field visibility",
  "flag duplicate-risk indicators",
  "organize seller intake information",
  "support operator clarity",
  "explain why a field matters for human review",
  "prepare field-audit notes for human review",
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

export const phase2LeadIntakeFieldAuditHumanBoundary = [
  "field importance judgment",
  "required/optional field decisions",
  "lead acceptance decisions",
  "lead rejection decisions",
  "lead correction decisions",
  "source judgment",
  "property fact verification",
  "duplicate merge decisions",
  "seller communication",
  "CRM approval",
  "activation decisions",
  "future implementation approval",
];

export const phase2LeadIntakeFieldAuditForbiddenDrift = [
  "autonomous wholesaling",
  "autonomous lead creation",
  "invented property facts",
  "provider activation",
  "SMS sending",
  "email sending",
  "calling",
  "seller outreach",
  "buyer outreach",
  "scraping",
  "skip tracing",
  "map automation",
  "Street View automation",
  "GPS surveillance",
  "public-record crawling",
  "schema changes",
  "form changes",
  "API changes",
  "CRM mutation",
  "storage mutation",
  "runtime jobs",
  "queues",
  "campaigns",
  "paid ads",
  "offer generation",
  "contract generation",
  "Phase 3 implementation",
  "go-live",
];

export function getPhase2LeadIntakeFieldAudit(): Phase2LeadIntakeFieldAudit {
  const result: Phase2LeadIntakeFieldAudit = {
    phase: "Phase 2: Lead Intake & Simple CRM",
    phaseStep: "Phase 2B — Lead Intake Field Audit",
    previousStep: "Phase 2A — Lead Intake & Simple CRM Scope Review",
    systemMode: "small_high_clarity_acquisition_operating_system",
    strategicAlignment: "elite_high_aroi_acquisition_os",
    primaryMetric: "acquisition_roi_per_operator_hour",
    phaseDecision: "field_audit_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    recommendedNextExactStep: "Phase 2C — Lead Intake Gap Prioritization",
    nextStageRecommendation: "Phase 2C — Lead Intake Gap Prioritization",
    stopRule: phase2LeadIntakeFieldAuditStopRule,
    highestAroiAuditPurpose: phase2LeadIntakeFieldAuditHighestAroiPurpose,
    fieldAuditGroups: phase2LeadIntakeFieldAuditGroups,
    fieldSurfacesAudited: phase2LeadIntakeFieldAuditSurfaces,
    existingPublicIntakeFields: phase2LeadIntakeFieldAuditPublicIntakeFields,
    existingStoredLeadFieldFamilies: phase2LeadIntakeFieldAuditStoredLeadFieldFamilies,
    existingPrismaLeadFields: phase2LeadIntakeFieldAuditPrismaLeadFields,
    aiOperatorLeverageBoundary: phase2LeadIntakeFieldAuditAiBoundary,
    humanOwnershipBoundary: phase2LeadIntakeFieldAuditHumanBoundary,
    forbiddenDrift: phase2LeadIntakeFieldAuditForbiddenDrift,
    flags: phase2LeadIntakeFieldAuditFlags,
  };

  assertPhase2LeadIntakeFieldAuditSafe(result);

  return result;
}

export function assertPhase2LeadIntakeFieldAuditSafe(result: Phase2LeadIntakeFieldAudit) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "fieldAuditOnly", "phase2PlanningOnly", "operatorLeverageOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([flag, value]) => !allowedTrueFlags.has(flag) && value === true);
  const stopRuleText = result.stopRule.join(" ");
  const humanBoundaryText = result.humanOwnershipBoundary.join(" ");
  const forbiddenDriftText = result.forbiddenDrift.join(" ");
  const allText = [
    stopRuleText,
    result.highestAroiAuditPurpose.join(" "),
    result.fieldAuditGroups.join(" "),
    result.fieldSurfacesAudited.join(" "),
    result.existingPublicIntakeFields.join(" "),
    result.existingStoredLeadFieldFamilies.join(" "),
    result.existingPrismaLeadFields.join(" "),
    result.aiOperatorLeverageBoundary.join(" "),
    humanBoundaryText,
    forbiddenDriftText,
  ].join(" ");
  const unsafeWordingPattern =
    /schema changes? (?:is|are) authorized|form (?:changes?|edits?) (?:is|are) authorized|API (?:changes?|edits?) (?:is|are) authorized|CRM mutation (?:is|are) authorized|outreach (?:is|are) authorized|provider activation (?:is|are) authorized|scraping (?:is|are) authorized|skip tracing (?:is|are) authorized|autonomous lead creation (?:is|are) authorized|Phase 3 implementation (?:is|are) authorized|go-live (?:is|are) authorized/i;

  if (result.phase !== "Phase 2: Lead Intake & Simple CRM") {
    throw new Error("Phase 2B field audit phase must remain pinned.");
  }

  if (result.phaseStep !== "Phase 2B — Lead Intake Field Audit") {
    throw new Error("Phase 2B field audit step must remain pinned.");
  }

  if (result.previousStep !== "Phase 2A — Lead Intake & Simple CRM Scope Review") {
    throw new Error("Phase 2B field audit previous step must remain Phase 2A.");
  }

  if (
    result.systemMode !== "small_high_clarity_acquisition_operating_system" ||
    result.strategicAlignment !== "elite_high_aroi_acquisition_os" ||
    result.primaryMetric !== "acquisition_roi_per_operator_hour"
  ) {
    throw new Error("Phase 2B field audit alignment fields must remain pinned.");
  }

  if (result.phaseDecision !== "field_audit_only") {
    throw new Error("Phase 2B must remain field-audit-only.");
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
    throw new Error("Phase 2B decisions must remain not_authorized.");
  }

  if (
    result.recommendedNextExactStep !== "Phase 2C — Lead Intake Gap Prioritization" ||
    result.nextStageRecommendation !== "Phase 2C — Lead Intake Gap Prioritization"
  ) {
    throw new Error("Phase 2B must hand off only to Phase 2C — Lead Intake Gap Prioritization.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("Phase 2B cannot authorize implementation, providers, communication, automation, CRM mutation, schema changes, form changes, API changes, storage mutation, runtime jobs, queues, campaigns, paid ads, autonomous lead creation, scraping, skip tracing, map automation, outreach, offer or contract generation, Phase 3 implementation, or go-live.");
  }

  if (result.fieldAuditGroups.join("|") !== phase2LeadIntakeFieldAuditGroups.join("|")) {
    throw new Error("Phase 2B must include all required field audit groups.");
  }

  if (result.fieldSurfacesAudited.join("|") !== phase2LeadIntakeFieldAuditSurfaces.join("|")) {
    throw new Error("Phase 2B must reference the existing intake, stored lead, CRM, and Prisma field surfaces.");
  }

  if (
    result.existingPublicIntakeFields.join("|") !== phase2LeadIntakeFieldAuditPublicIntakeFields.join("|") ||
    result.existingStoredLeadFieldFamilies.join("|") !== phase2LeadIntakeFieldAuditStoredLeadFieldFamilies.join("|") ||
    result.existingPrismaLeadFields.join("|") !== phase2LeadIntakeFieldAuditPrismaLeadFields.join("|")
  ) {
    throw new Error("Phase 2B field surfaces must remain repo-grounded and unchanged.");
  }

  if (
    !/audits existing fields only/i.test(stopRuleText) ||
    !/no new governance chain/i.test(stopRuleText) ||
    !/no nested readiness loop/i.test(stopRuleText) ||
    !/no Phase 1-style recursion/i.test(stopRuleText) ||
    !/no schema migration/i.test(stopRuleText) ||
    !/no form changes/i.test(stopRuleText) ||
    !/no API changes/i.test(stopRuleText) ||
    !/no CRM mutation/i.test(stopRuleText) ||
    !/no implementation work/i.test(stopRuleText)
  ) {
    throw new Error("Phase 2B must include a stop rule preventing implementation and a new governance chain.");
  }

  if (
    result.aiOperatorLeverageBoundary.length === 0 ||
    !/summarize field coverage/i.test(result.aiOperatorLeverageBoundary.join(" ")) ||
    !/do not invent property facts/i.test(result.aiOperatorLeverageBoundary.join(" ")) ||
    !/do not enrich leads with unverified facts/i.test(result.aiOperatorLeverageBoundary.join(" ")) ||
    !/do not scrape data/i.test(result.aiOperatorLeverageBoundary.join(" ")) ||
    !/do not skip trace owners/i.test(result.aiOperatorLeverageBoundary.join(" ")) ||
    !/do not create leads/i.test(result.aiOperatorLeverageBoundary.join(" ")) ||
    !/do not mutate CRM records/i.test(result.aiOperatorLeverageBoundary.join(" ")) ||
    !/do not contact sellers/i.test(result.aiOperatorLeverageBoundary.join(" ")) ||
    !/do not make final lead quality decisions/i.test(result.aiOperatorLeverageBoundary.join(" "))
  ) {
    throw new Error("Phase 2B AI boundary must remain operator-leverage-only and execution-blocked.");
  }

  if (
    result.humanOwnershipBoundary.length === 0 ||
    !/required\/optional field decisions/i.test(humanBoundaryText) ||
    !/source judgment/i.test(humanBoundaryText) ||
    !/property fact verification/i.test(humanBoundaryText) ||
    !/duplicate merge decisions/i.test(humanBoundaryText) ||
    !/seller communication/i.test(humanBoundaryText) ||
    !/future implementation approval/i.test(humanBoundaryText)
  ) {
    throw new Error("Phase 2B must preserve human ownership for field judgment, source judgment, verification, duplicate merges, seller communication, and future implementation approval.");
  }

  if (
    result.forbiddenDrift.length === 0 ||
    !/schema changes/i.test(forbiddenDriftText) ||
    !/form changes/i.test(forbiddenDriftText) ||
    !/API changes/i.test(forbiddenDriftText) ||
    !/CRM mutation/i.test(forbiddenDriftText) ||
    !/runtime jobs/i.test(forbiddenDriftText) ||
    !/queues/i.test(forbiddenDriftText) ||
    !/campaigns/i.test(forbiddenDriftText) ||
    !/provider activation/i.test(forbiddenDriftText) ||
    !/seller outreach/i.test(forbiddenDriftText) ||
    !/scraping/i.test(forbiddenDriftText) ||
    !/skip tracing/i.test(forbiddenDriftText) ||
    !/autonomous lead creation/i.test(forbiddenDriftText) ||
    !/Phase 3 implementation/i.test(forbiddenDriftText) ||
    !/go-live/i.test(forbiddenDriftText)
  ) {
    throw new Error("Phase 2B forbidden drift must block schema, form, API, CRM, runtime, queue, campaign, provider, outreach, scraping, skip tracing, autonomous lead creation, Phase 3 implementation, and go-live drift.");
  }

  if (unsafeWordingPattern.test(allText)) {
    throw new Error("Phase 2B wording must not imply schema changes, form edits, API edits, CRM mutation, outreach, provider activation, scraping, skip tracing, autonomous lead creation, Phase 3 implementation, or go-live authorization.");
  }
}

export function getPhase2LeadIntakeFieldAuditSummary() {
  const result = getPhase2LeadIntakeFieldAudit();

  return `${result.phase} / ${result.phaseStep}: Lead Intake Field Audit for highest acquisition ROI per operator hour. This is field audit only, supports human-owned lead review, and improves missing-field visibility, source clarity, duplicate-risk awareness, simple CRM usability, and Phase 2C handoff. No schema changes, no CRM mutation, no outreach, no scraping, and no autonomous lead creation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
