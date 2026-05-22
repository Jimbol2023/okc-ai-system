export type R64UiScopeStatus = "ui_scope_blocked" | "operator_review_required" | "ui_scope_ready_for_later_implementation";

export type R64AllowedFutureUiSection =
  | "governance_stop_visibility"
  | "manual_property_review_priority"
  | "visible_distress_signal_review"
  | "vacancy_signal_visibility"
  | "deferred_maintenance_review"
  | "overgrowth_signal_review"
  | "boarded_broken_feature_visibility"
  | "neighborhood_opportunity_visibility"
  | "acquisition_review_priority"
  | "ownership_research_needed"
  | "property_condition_review_needed"
  | "lead_quality_concern_visibility"
  | "stale_field_observation_review"
  | "incomplete_property_data_visibility"
  | "duplicate_property_review"
  | "human_verification_required"
  | "revenue_potential_visibility"
  | "acquisition_bottleneck_visibility"
  | "field_note_quality_review"
  | "human_only_decision_support";

export type R64UiWarningCode =
  | "r64b_ui_scope_audit_only"
  | "input_missing"
  | "r64a_scope_review_required"
  | "ui_surface_review_required"
  | "distress_visibility_review_required"
  | "stale_property_visibility_review_required"
  | "acquisition_review_visibility_required"
  | "field_note_visibility_review_required"
  | "revenue_opportunity_visibility_required"
  | "wording_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
  | "dangerous_patterns_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "dashboard_change_rejected"
  | "route_change_rejected"
  | "provider_activation_rejected"
  | "gps_map_activation_rejected"
  | "scraping_rejected"
  | "skip_tracing_rejected"
  | "outreach_execution_rejected"
  | "campaign_launch_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
  | "autonomous_acquisition_rejected"
  | "autonomous_property_targeting_rejected"
  | "autonomous_route_planning_rejected"
  | "approval_grants_execution_rejected"
  | "read_only_required"
  | "advisory_only_required"
  | "simulation_only_required"
  | "provider_called_must_be_false"
  | "sent_must_be_false"
  | "persistence_not_allowed_now"
  | "polling_not_allowed"
  | "runtime_activation_not_allowed"
  | "provider_activation_allowed_must_be_false"
  | "ui_implementation_not_allowed_now";

export type R64UiScopeInput = {
  r64aScopeReviewed?: boolean;
  uiSurfaceReviewed?: boolean;
  distressVisibilityReviewed?: boolean;
  stalePropertyVisibilityReviewed?: boolean;
  acquisitionReviewVisibilityReviewed?: boolean;
  fieldNoteVisibilityReviewed?: boolean;
  revenueOpportunityVisibilityReviewed?: boolean;
  wordingReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  dangerousPatternsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  dashboardChangeRequested?: boolean;
  routeChangeRequested?: boolean;
  providerActivationRequested?: boolean;
  gpsMapActivationRequested?: boolean;
  scrapingRequested?: boolean;
  skipTracingRequested?: boolean;
  outreachExecutionRequested?: boolean;
  campaignLaunchRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  autonomousAcquisitionRequested?: boolean;
  autonomousPropertyTargetingRequested?: boolean;
  autonomousRoutePlanningRequested?: boolean;
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

export type R64UiSafetyFlags = {
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
};

export type R64UiScopeResult = R64UiSafetyFlags & {
  phase: "R64B";
  surface: "driving_for_dollars_intelligence_ui_scope";
  scopeStatus: R64UiScopeStatus;
  allowedFutureUiSections: R64AllowedFutureUiSection[];
  distressVisibility: string[];
  stalePropertyVisibility: string[];
  acquisitionReviewVisibility: string[];
  fieldNoteVisibility: string[];
  revenueOpportunityVisibility: string[];
  safeWording: string[];
  forbiddenControls: string[];
  dangerousWordingPatterns: string[];
  accessibilityExpectations: string[];
  governanceBoundaries: string[];
  implementationBoundaries: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R64UiSafetyFlags;
  operatorReviewRequired: boolean;
  auditNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R64UiInvariantCheck = { passed: boolean; warningCodes: string[] };

const maxListItems = 44;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R64UiSafetyFlags = {
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
};

const allowedFutureUiSections: R64AllowedFutureUiSection[] = [
  "governance_stop_visibility",
  "manual_property_review_priority",
  "visible_distress_signal_review",
  "vacancy_signal_visibility",
  "deferred_maintenance_review",
  "overgrowth_signal_review",
  "boarded_broken_feature_visibility",
  "neighborhood_opportunity_visibility",
  "acquisition_review_priority",
  "ownership_research_needed",
  "property_condition_review_needed",
  "lead_quality_concern_visibility",
  "stale_field_observation_review",
  "incomplete_property_data_visibility",
  "duplicate_property_review",
  "human_verification_required",
  "revenue_potential_visibility",
  "acquisition_bottleneck_visibility",
  "field_note_quality_review",
  "human_only_decision_support",
];

const distressVisibility = [
  "Visible distress signal review may summarize condition signals for manual property review only.",
  "Vacancy, deferred maintenance, overgrowth, and boarded/broken feature visibility cannot infer owner intent or trigger outreach.",
  "Distress visibility must label unknown facts as incomplete property data rather than inventing property facts.",
];

const stalePropertyVisibility = [
  "Stale field observation review may surface aging observations for human verification.",
  "Stale-property recovery visibility is advisory only and cannot launch mail, SMS, email, calls, scraping, skip tracing, or route planning.",
];

const acquisitionReviewVisibility = [
  "Acquisition review priority may show manual follow-up guidance after governance stop signals.",
  "Ownership research needed remains a manual research label and cannot auto scrape owner data or pull phone numbers.",
  "Duplicate property review and incomplete data visibility must remain read-only quality signals.",
];

const fieldNoteVisibility = [
  "Field-note quality review may identify missing source, address, observation, or verification context.",
  "Human verification required must be visible when property context is incomplete or stale.",
];

const revenueOpportunityVisibility = [
  "Revenue-potential visibility may prioritize review attention but cannot generate offers or negotiate.",
  "Neighborhood opportunity visibility is a human-review signal and cannot become autonomous property targeting.",
  "Acquisition bottleneck visibility may identify blockers without mutating workflow state.",
];

const safeWording = [
  "Manual property review recommended.",
  "Driving-for-dollars priority label is advisory only.",
  "Review property context before taking action.",
  "Human verification required before acquisition action.",
  "Field-note quality review needed.",
  "Governance stop signals must be resolved first.",
  "Property priority does not mean contact owner.",
];

const forbiddenControls = [
  "auto contact owner",
  "auto skip trace",
  "auto call",
  "auto SMS",
  "auto email",
  "auto mailer",
  "auto campaign",
  "auto route driver",
  "auto assign acquisition rep",
  "auto scrape owner data",
  "auto pull phone numbers",
  "auto generate offers",
  "auto negotiate",
  "GPS activation",
  "provider activation",
  "workflow execution",
];

const dangerousWordingPatterns = [
  "AI finds owners automatically",
  "AI routes drivers automatically",
  "send-ready owner",
  "auto skip-traced",
  "approval launches campaign",
  "property targeted automatically",
];

const accessibilityExpectations = [
  "Use semantic headings and readable labels.",
  "Use concise screen-reader-friendly summaries.",
  "Status meaning must be text-based and never depend on color alone.",
  "No motion dependency, focus movement, auto-refresh, live update dependency, or polling.",
  "Governance stop visibility must appear before advisory property review guidance.",
];

const governanceBoundaries = [
  "Governance stop signals must render first and outrank distress visibility, revenue opportunity, stale-property urgency, acquisition momentum, workload pressure, and neighborhood opportunity visibility.",
  "Driving-for-dollars priority means manual review may be beneficial only.",
  "Driving-for-dollars priority never means contact owner, send communication, launch outreach, activate providers, execute acquisition workflow, trigger campaigns, route operators automatically, or automate lead generation.",
];

const implementationBoundaries = [
  "R64B cannot implement UI or modify the dashboard.",
  "Future UI must use existing dashboard placement only.",
  "Future optional component: components/dashboard/driving-for-dollars-intelligence-summary.tsx.",
  "No routes, providers, persistence, polling, runtime activation, GPS/map activation, scraping, skip tracing, execution controls, autonomous routing, or outreach execution.",
];

function addUnique(list: string[], value: string) {
  const bounded = value.trim().length <= maxTextLength ? value.trim() : `${value.trim().slice(0, maxTextLength)}...`;
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function addWarning(warningCodes: string[], warningCode: R64UiWarningCode) {
  addUnique(warningCodes, warningCode);
}

function hasForbiddenRequest(input: R64UiScopeInput) {
  return (
    input.uiImplementationRequested === true ||
    input.dashboardChangeRequested === true ||
    input.routeChangeRequested === true ||
    input.providerActivationRequested === true ||
    input.gpsMapActivationRequested === true ||
    input.scrapingRequested === true ||
    input.skipTracingRequested === true ||
    input.outreachExecutionRequested === true ||
    input.campaignLaunchRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.autonomousAcquisitionRequested === true ||
    input.autonomousPropertyTargetingRequested === true ||
    input.autonomousRoutePlanningRequested === true ||
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

export function assertR64DrivingForDollarsUiScopeInvariants(
  result: Pick<R64UiScopeResult, keyof R64UiSafetyFlags>,
): R64UiInvariantCheck {
  const warningCodes: string[] = [];
  if (result.readOnly !== true) warningCodes.push("read_only_required");
  if (result.advisoryOnly !== true) warningCodes.push("advisory_only_required");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");
  if (result.pollingAllowed !== false) warningCodes.push("polling_not_allowed");
  if (result.runtimeActivationAllowed !== false) warningCodes.push("runtime_activation_not_allowed");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.approvalGrantsExecution !== false) warningCodes.push("approval_grants_execution_must_be_false");
  if (result.uiImplementationAllowedNow !== false) warningCodes.push("ui_implementation_not_allowed_now");
  return { passed: warningCodes.length === 0, warningCodes };
}

export function summarizeR64DrivingForDollarsUiScopeAudit(result: R64UiScopeResult) {
  const invariantCheck = assertR64DrivingForDollarsUiScopeInvariants(result);
  const summary =
    `R64B ${result.surface} status is ${result.scopeStatus}. ` +
    `${result.allowedFutureUiSections.length} future UI sections are scoped. ` +
    `${result.forbiddenControls.length} controls are forbidden. ` +
    `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "This audit cannot authorize UI implementation, dashboard changes, routes, execution controls, providers, GPS/map activation, scraping, skip tracing, outreach, campaigns, polling, persistence, autonomous acquisition, or runtime activation.";
  return summary.length <= maxSummaryLength ? summary : `${summary.slice(0, maxSummaryLength)}...`;
}

export function createR64DrivingForDollarsUiScopeAudit(input: R64UiScopeInput = {}): R64UiScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const auditNotes: string[] = [];
  for (const note of input.extraAuditNotes ?? []) addUnique(auditNotes, note);

  addWarning(warningCodes, "r64b_ui_scope_audit_only");
  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r64aScopeReviewed !== true) addWarning(warningCodes, "r64a_scope_review_required");
  if (input.uiSurfaceReviewed !== true) addWarning(warningCodes, "ui_surface_review_required");
  if (input.distressVisibilityReviewed !== true) addWarning(warningCodes, "distress_visibility_review_required");
  if (input.stalePropertyVisibilityReviewed !== true) addWarning(warningCodes, "stale_property_visibility_review_required");
  if (input.acquisitionReviewVisibilityReviewed !== true) addWarning(warningCodes, "acquisition_review_visibility_required");
  if (input.fieldNoteVisibilityReviewed !== true) addWarning(warningCodes, "field_note_visibility_review_required");
  if (input.revenueOpportunityVisibilityReviewed !== true) addWarning(warningCodes, "revenue_opportunity_visibility_required");
  if (input.wordingReviewed !== true) addWarning(warningCodes, "wording_review_required");
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.dangerousPatternsReviewed !== true) addWarning(warningCodes, "dangerous_patterns_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.dashboardChangeRequested === true) addWarning(warningCodes, "dashboard_change_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.gpsMapActivationRequested === true) addWarning(warningCodes, "gps_map_activation_rejected");
  if (input.scrapingRequested === true) addWarning(warningCodes, "scraping_rejected");
  if (input.skipTracingRequested === true) addWarning(warningCodes, "skip_tracing_rejected");
  if (input.outreachExecutionRequested === true) addWarning(warningCodes, "outreach_execution_rejected");
  if (input.campaignLaunchRequested === true) addWarning(warningCodes, "campaign_launch_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.autonomousAcquisitionRequested === true) addWarning(warningCodes, "autonomous_acquisition_rejected");
  if (input.autonomousPropertyTargetingRequested === true) addWarning(warningCodes, "autonomous_property_targeting_rejected");
  if (input.autonomousRoutePlanningRequested === true) addWarning(warningCodes, "autonomous_route_planning_rejected");
  if (input.approvalGrantsExecution === true) addWarning(warningCodes, "approval_grants_execution_rejected");
  if (input.readOnly === false) addWarning(warningCodes, "read_only_required");
  if (input.advisoryOnly === false) addWarning(warningCodes, "advisory_only_required");
  if (input.simulationOnly === false) addWarning(warningCodes, "simulation_only_required");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addWarning(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addWarning(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.uiImplementationAllowedNow === true) addWarning(warningCodes, "ui_implementation_not_allowed_now");

  for (const warningCode of warningCodes) {
    if (warningCode.endsWith("_rejected") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed_now")) addUnique(rejectionReasons, warningCode);
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingReview =
    input.r64aScopeReviewed !== true ||
    input.uiSurfaceReviewed !== true ||
    input.distressVisibilityReviewed !== true ||
    input.stalePropertyVisibilityReviewed !== true ||
    input.acquisitionReviewVisibilityReviewed !== true ||
    input.fieldNoteVisibilityReviewed !== true ||
    input.revenueOpportunityVisibilityReviewed !== true ||
    input.wordingReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R64UiScopeStatus = hasForbiddenRequest(input) ? "ui_scope_blocked" : missingReview ? "operator_review_required" : "ui_scope_ready_for_later_implementation";

  const result: R64UiScopeResult = {
    phase: "R64B",
    surface: "driving_for_dollars_intelligence_ui_scope",
    scopeStatus,
    allowedFutureUiSections,
    distressVisibility,
    stalePropertyVisibility,
    acquisitionReviewVisibility,
    fieldNoteVisibility,
    revenueOpportunityVisibility,
    safeWording,
    forbiddenControls,
    dangerousWordingPatterns,
    accessibilityExpectations,
    governanceBoundaries,
    implementationBoundaries,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    operatorReviewRequired,
    auditNotes,
    nextSuggestedPhase: "R64C - Driving-for-Dollars Intelligence Read-Only UI Implementation Scope Contract",
    summary: "R64B driving-for-dollars UI scope audit only.",
    ...safetyFlags,
  };
  return { ...result, summary: summarizeR64DrivingForDollarsUiScopeAudit(result) };
}
