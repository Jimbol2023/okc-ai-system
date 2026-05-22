export type R65UiScopeStatus = "ui_scope_blocked" | "operator_review_required" | "ui_scope_ready_for_later_implementation";

export type R65UiScopeInput = {
  r65aScopeReviewed?: boolean;
  uiSurfaceReviewed?: boolean;
  dataCompletenessReviewed?: boolean;
  duplicateLeadReviewed?: boolean;
  staleLeadReviewed?: boolean;
  leadConfidenceReviewed?: boolean;
  acquisitionReadinessReviewed?: boolean;
  dispositionReadinessReviewed?: boolean;
  wordingReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  dangerousPatternsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  dashboardChangeRequested?: boolean;
  routeChangeRequested?: boolean;
  providerActivationRequested?: boolean;
  enrichmentActivationRequested?: boolean;
  skipTracingRequested?: boolean;
  scrapingRequested?: boolean;
  externalLookupRequested?: boolean;
  outreachExecutionRequested?: boolean;
  campaignLaunchRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  autonomousQualificationRequested?: boolean;
  autonomousRoutingRequested?: boolean;
  approvalGrantsExecution?: boolean;
  readOnly?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  persistenceAllowedNow?: boolean;
  pollingAllowed?: boolean;
  runtimeActivationAllowed?: boolean;
  providerActivationAllowed?: boolean;
  uiImplementationAllowedNow?: boolean;
  extraAuditNotes?: string[];
};

export type R65UiSafetyFlags = {
  readOnly: true;
  advisoryOnly: true;
  simulationOnly: true;
  providerCalled: false;
  sent: false;
  persistenceAllowedNow: false;
  pollingAllowed: false;
  runtimeActivationAllowed: false;
  providerActivationAllowed: false;
  approvalGrantsExecution: false;
  uiImplementationAllowedNow: false;
  enrichmentActivationAllowed: false;
  skipTracingAllowed: false;
};

export type R65UiScopeResult = R65UiSafetyFlags & {
  phase: "R65B";
  surface: "lead_quality_intelligence_ui_scope";
  scopeStatus: R65UiScopeStatus;
  allowedFutureUiSections: string[];
  dataCompletenessVisibility: string[];
  duplicateLeadVisibility: string[];
  staleLeadVisibility: string[];
  leadConfidenceVisibility: string[];
  readinessVisibility: string[];
  safeWording: string[];
  forbiddenControls: string[];
  dangerousWordingPatterns: string[];
  accessibilityExpectations: string[];
  governanceBoundaries: string[];
  implementationBoundaries: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R65UiSafetyFlags;
  operatorReviewRequired: boolean;
  auditNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

const safetyFlags: R65UiSafetyFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
  uiImplementationAllowedNow: false,
  enrichmentActivationAllowed: false,
  skipTracingAllowed: false,
};

const allowedFutureUiSections = [
  "governance_stop_visibility",
  "incomplete_lead_data_visibility",
  "missing_contact_and_address_visibility",
  "missing_seller_motivation_visibility",
  "missing_timeline_and_asking_price_visibility",
  "missing_property_condition_visibility",
  "missing_arv_repair_estimate_visibility",
  "duplicate_lead_visibility",
  "stale_lead_quality_review",
  "low_confidence_lead_review",
  "acquisition_readiness_visibility",
  "disposition_readiness_visibility",
  "seller_follow_up_readiness",
  "revenue_risk_visibility",
  "manual_data_cleanup_priority",
];

const dataCompletenessVisibility = [
  "Show missing phone, email, address, seller motivation, timeline, asking price, property condition, ARV, and repair estimate as read-only quality signals.",
  "Incomplete lead data visibility cannot create, enrich, reject, assign, route, persist, or execute workflow state.",
];

const duplicateLeadVisibility = [
  "Show possible duplicate lead visibility for manual review only.",
  "Duplicate visibility cannot merge, delete, mutate, reject, enrich, or route leads automatically.",
];

const staleLeadVisibility = [
  "Show stale lead quality review and low-confidence lead review as advisory signals.",
  "Stale lead visibility cannot auto launch follow-up, campaigns, SMS, email, calls, enrichment, or skip tracing.",
];

const leadConfidenceVisibility = [
  "Show inconsistent lead data review and human verification required before workflow action.",
  "Lead confidence visibility cannot auto qualify leads for execution or auto reject leads.",
];

const readinessVisibility = [
  "Show acquisition readiness, disposition readiness, buyer-fit data readiness, seller follow-up readiness, and revenue-risk visibility as manual review labels.",
  "Readiness visibility cannot activate providers, trigger outreach, or route leads automatically.",
];

const safeWording = [
  "Manual lead quality review recommended.",
  "Lead quality priority label is advisory only.",
  "Review lead data before taking action.",
  "Human verification required before workflow action.",
  "Manual data cleanup priority.",
  "Governance stop signals must be resolved first.",
  "Lead quality priority does not mean enrich or contact.",
];

const forbiddenControls = [
  "auto enrich lead",
  "auto skip trace",
  "auto contact seller",
  "auto contact buyer",
  "auto call",
  "auto SMS",
  "auto email",
  "auto campaign",
  "auto reject lead",
  "auto assign lead",
  "auto qualify lead for execution",
  "auto route lead",
  "auto create workflow",
  "auto launch follow-up",
  "provider activation",
  "external lookup activation",
  "workflow execution",
];

const dangerousWordingPatterns = [
  "AI enriches leads automatically",
  "AI skip traces automatically",
  "lead is ready to contact",
  "quality score launches workflow",
  "approval routes lead",
  "auto-qualified lead",
];

const accessibilityExpectations = [
  "Use semantic headings and readable labels.",
  "Use concise screen-reader-friendly summaries.",
  "Status meaning must be text-based and never depend on color alone.",
  "No motion dependency, focus movement, auto-refresh, live update dependency, or polling.",
  "Governance stop visibility must appear before advisory lead quality guidance.",
];

const governanceBoundaries = [
  "Governance stop signals must render first and outrank lead quality score, revenue opportunity, data completeness, acquisition readiness, disposition readiness, follow-up urgency, and operator workload pressure.",
  "Lead quality priority means manual review may be beneficial only.",
  "Lead quality priority never means contact, enrich, skip trace, launch campaign, activate provider, execute workflow, or route automatically.",
];

const implementationBoundaries = [
  "R65B cannot implement UI or modify the dashboard.",
  "Future UI must use existing dashboard placement only.",
  "Future optional component: components/dashboard/lead-quality-intelligence-summary.tsx.",
  "No routes, providers, persistence, polling, runtime activation, enrichment, skip tracing, scraping, external lookups, execution controls, autonomous routing, or outreach execution.",
];

function addUnique(list: string[], value: string) {
  const trimmed = value.trim();
  if (trimmed && !list.includes(trimmed)) list.push(trimmed.length <= 180 ? trimmed : `${trimmed.slice(0, 180)}...`);
}

function hasForbiddenRequest(input: R65UiScopeInput) {
  return (
    input.uiImplementationRequested === true ||
    input.dashboardChangeRequested === true ||
    input.routeChangeRequested === true ||
    input.providerActivationRequested === true ||
    input.enrichmentActivationRequested === true ||
    input.skipTracingRequested === true ||
    input.scrapingRequested === true ||
    input.externalLookupRequested === true ||
    input.outreachExecutionRequested === true ||
    input.campaignLaunchRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.autonomousQualificationRequested === true ||
    input.autonomousRoutingRequested === true ||
    input.approvalGrantsExecution === true ||
    input.readOnly === false ||
    input.advisoryOnly === false ||
    input.simulationOnly === false ||
    input.providerCalled === true ||
    input.sent === true ||
    input.persistenceAllowedNow === true ||
    input.pollingAllowed === true ||
    input.runtimeActivationAllowed === true ||
    input.providerActivationAllowed === true ||
    input.uiImplementationAllowedNow === true
  );
}

export function createR65LeadQualityUiScopeAudit(input: R65UiScopeInput = {}): R65UiScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const auditNotes: string[] = [];
  for (const note of input.extraAuditNotes ?? []) addUnique(auditNotes, note);

  addUnique(warningCodes, "r65b_ui_scope_audit_only");
  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r65aScopeReviewed !== true) addUnique(warningCodes, "r65a_scope_review_required");
  if (input.uiSurfaceReviewed !== true) addUnique(warningCodes, "ui_surface_review_required");
  if (input.dataCompletenessReviewed !== true) addUnique(warningCodes, "data_completeness_review_required");
  if (input.duplicateLeadReviewed !== true) addUnique(warningCodes, "duplicate_lead_review_required");
  if (input.staleLeadReviewed !== true) addUnique(warningCodes, "stale_lead_review_required");
  if (input.leadConfidenceReviewed !== true) addUnique(warningCodes, "lead_confidence_review_required");
  if (input.acquisitionReadinessReviewed !== true) addUnique(warningCodes, "acquisition_readiness_review_required");
  if (input.dispositionReadinessReviewed !== true) addUnique(warningCodes, "disposition_readiness_review_required");
  if (input.wordingReviewed !== true) addUnique(warningCodes, "wording_review_required");
  if (input.governanceBoundaryReviewed !== true) addUnique(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addUnique(warningCodes, "accessibility_review_required");
  if (input.dangerousPatternsReviewed !== true) addUnique(warningCodes, "dangerous_patterns_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");

  const rejectionMap: Array<[boolean | undefined, string]> = [
    [input.uiImplementationRequested, "ui_implementation_rejected"],
    [input.dashboardChangeRequested, "dashboard_change_rejected"],
    [input.routeChangeRequested, "route_change_rejected"],
    [input.providerActivationRequested, "provider_activation_rejected"],
    [input.enrichmentActivationRequested, "enrichment_activation_rejected"],
    [input.skipTracingRequested, "skip_tracing_rejected"],
    [input.scrapingRequested, "scraping_rejected"],
    [input.externalLookupRequested, "external_lookup_rejected"],
    [input.outreachExecutionRequested, "outreach_execution_rejected"],
    [input.campaignLaunchRequested, "campaign_launch_rejected"],
    [input.automationAgentRequested, "automation_agent_rejected"],
    [input.pollingRequested, "polling_rejected"],
    [input.persistenceRequested, "persistence_rejected"],
    [input.executionControlRequested, "execution_control_rejected"],
    [input.autonomousQualificationRequested, "autonomous_qualification_rejected"],
    [input.autonomousRoutingRequested, "autonomous_routing_rejected"],
    [input.approvalGrantsExecution, "approval_grants_execution_rejected"],
  ];
  for (const [flag, code] of rejectionMap) if (flag === true) addUnique(warningCodes, code);

  if (input.readOnly === false) addUnique(warningCodes, "read_only_required");
  if (input.advisoryOnly === false) addUnique(warningCodes, "advisory_only_required");
  if (input.simulationOnly === false) addUnique(warningCodes, "simulation_only_required");
  if (input.providerCalled === true) addUnique(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addUnique(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addUnique(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addUnique(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addUnique(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addUnique(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.uiImplementationAllowedNow === true) addUnique(warningCodes, "ui_implementation_not_allowed_now");
  for (const warningCode of warningCodes) if (warningCode.endsWith("_rejected") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed_now")) addUnique(rejectionReasons, warningCode);

  const missingReview =
    input.r65aScopeReviewed !== true ||
    input.uiSurfaceReviewed !== true ||
    input.dataCompletenessReviewed !== true ||
    input.duplicateLeadReviewed !== true ||
    input.staleLeadReviewed !== true ||
    input.leadConfidenceReviewed !== true ||
    input.acquisitionReadinessReviewed !== true ||
    input.dispositionReadinessReviewed !== true ||
    input.wordingReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    input.operatorReviewCompleted !== true;
  const scopeStatus: R65UiScopeStatus = hasForbiddenRequest(input) ? "ui_scope_blocked" : missingReview ? "operator_review_required" : "ui_scope_ready_for_later_implementation";

  const result: R65UiScopeResult = {
    phase: "R65B",
    surface: "lead_quality_intelligence_ui_scope",
    scopeStatus,
    allowedFutureUiSections,
    dataCompletenessVisibility,
    duplicateLeadVisibility,
    staleLeadVisibility,
    leadConfidenceVisibility,
    readinessVisibility,
    safeWording,
    forbiddenControls,
    dangerousWordingPatterns,
    accessibilityExpectations,
    governanceBoundaries,
    implementationBoundaries,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    operatorReviewRequired: input.operatorReviewCompleted !== true,
    auditNotes,
    nextSuggestedPhase: "R65C - Lead Quality Intelligence Read-Only UI Implementation Scope Contract",
    summary: "R65B lead quality UI scope audit only.",
    ...safetyFlags,
  };
  return {
    ...result,
    summary: `R65B ${result.surface} status is ${scopeStatus}. ${allowedFutureUiSections.length} future UI sections are scoped. This audit cannot authorize UI implementation, enrichment, skip tracing, providers, outreach, persistence, polling, execution controls, or runtime activation.`,
  };
}
