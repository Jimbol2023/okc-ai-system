export type R64ReadonlyUiScopeStatus =
  | "implementation_scope_blocked"
  | "operator_review_required"
  | "read_only_ui_implementation_scope_ready";

export type R64FutureUiSurface = {
  surface: "existing_dashboard";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  futureComponentAllowed: "components/dashboard/driving-for-dollars-intelligence-summary.tsx";
  placement: "dashboard_read_only_revenue_operations_section";
  routeChangesAllowed: false;
  redesignAllowed: false;
  implementationAllowedNow: false;
};

export type R64ReadonlyUiWarningCode =
  | "r64c_readonly_ui_implementation_scope_contract_only"
  | "input_missing"
  | "r64b_ui_scope_audit_required"
  | "future_surface_review_required"
  | "read_only_display_review_required"
  | "safe_copy_review_required"
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

export type R64ReadonlyUiScopeInput = {
  r64bUiScopeAuditReviewed?: boolean;
  futureSurfaceReviewed?: boolean;
  readOnlyDisplayReviewed?: boolean;
  safeCopyReviewed?: boolean;
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
  extraScopeNotes?: string[];
};

export type R64ReadonlyUiSafetyFlags = {
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

export type R64ReadonlyUiScopeResult = R64ReadonlyUiSafetyFlags & {
  phase: "R64C";
  surface: "driving_for_dollars_readonly_ui_implementation_scope";
  scopeStatus: R64ReadonlyUiScopeStatus;
  allowedFutureUiSurface: R64FutureUiSurface;
  forbiddenSurfaces: string[];
  allowedReadOnlyDisplayRules: string[];
  safeCopyRules: string[];
  noExecutionGuarantees: string[];
  accessibilityGuarantees: string[];
  invariantAssertions: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R64ReadonlyUiSafetyFlags;
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R64ReadonlyUiInvariantCheck = { passed: boolean; warningCodes: string[] };

const maxTextLength = 180;
const maxListItems = 44;
const maxSummaryLength = 900;

const safetyFlags: R64ReadonlyUiSafetyFlags = {
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

const allowedFutureUiSurface: R64FutureUiSurface = {
  surface: "existing_dashboard",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  futureComponentAllowed: "components/dashboard/driving-for-dollars-intelligence-summary.tsx",
  placement: "dashboard_read_only_revenue_operations_section",
  routeChangesAllowed: false,
  redesignAllowed: false,
  implementationAllowedNow: false,
};

const forbiddenSurfaces = [
  "new GPS map console",
  "new route-planning tab",
  "new provider/Twilio console",
  "new scraping panel",
  "new skip-tracing panel",
  "new seller outreach console",
  "new campaign tab",
  "new execution queue",
  "new autonomous property targeting panel",
  "new approval-to-execution workflow",
  "new route unless later explicitly authorized",
];

const allowedReadOnlyDisplayRules = [
  "Show governance stop visibility before all property opportunity signals.",
  "Show manual property review priority, visible distress signal review, vacancy signal visibility, deferred maintenance review, overgrowth signal review, boarded/broken feature visibility, stale-property recovery visibility, field-note quality review, revenue-potential visibility, acquisition bottleneck visibility, and human verification required as read-only labels.",
  "Show incomplete property data and duplicate property review as quality warnings without inventing property facts.",
  "Show ownership research needed as manual research guidance only.",
  "Do not show buttons, links, execution handlers, provider activation, map/GPS activation, scraping, skip tracing, campaigns, polling, persistence, or runtime activation.",
];

const safeCopyRules = [
  "Manual property review recommended.",
  "Driving-for-dollars priority label is advisory only.",
  "Review property context before taking action.",
  "Human verification required before acquisition action.",
  "Field-note quality review needed.",
  "Governance stop signals must be resolved first.",
  "Property priority does not mean contact owner.",
];

const noExecutionGuarantees = [
  "No owner contact, SMS, email, calls, mailers, campaigns, or outreach execution.",
  "No provider/Twilio connectivity, GPS/map activation, scraping, skip tracing, route automation, or phone-number pulling.",
  "No persistence, polling, auto-refresh, runtime activation, execution queue, workflow execution, autonomous acquisition, autonomous property targeting, autonomous route planning, or approval-grants-execution.",
];

const accessibilityGuarantees = [
  "Use semantic headings.",
  "Use aria-labelledby and concise screen-reader-friendly summary text.",
  "Use readable labels and text-based status meaning.",
  "Do not rely on color alone.",
  "No motion dependency, focus movement, auto-refresh, or polling.",
  "Place governance stop visibility first in reading order.",
];

const invariantAssertions = [
  "readOnly:true",
  "advisoryOnly:true",
  "simulationOnly:true",
  "providerCalled:false",
  "sent:false",
  "persistenceAllowedNow:false",
  "pollingAllowed:false",
  "runtimeActivationAllowed:false",
  "providerActivationAllowed:false",
  "approvalGrantsExecution:false",
  "uiImplementationAllowedNow:false",
];

function addUnique(list: string[], value: string) {
  const bounded = value.trim().length <= maxTextLength ? value.trim() : `${value.trim().slice(0, maxTextLength)}...`;
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function addWarning(warningCodes: string[], warningCode: R64ReadonlyUiWarningCode) {
  addUnique(warningCodes, warningCode);
}

function hasForbiddenRequest(input: R64ReadonlyUiScopeInput) {
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

export function assertR64DrivingForDollarsReadonlyUiScopeInvariants(
  result: Pick<R64ReadonlyUiScopeResult, keyof R64ReadonlyUiSafetyFlags>,
): R64ReadonlyUiInvariantCheck {
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

export function summarizeR64DrivingForDollarsReadonlyUiScope(result: R64ReadonlyUiScopeResult) {
  const invariantCheck = assertR64DrivingForDollarsReadonlyUiScopeInvariants(result);
  const summary =
    `R64C ${result.surface} status is ${result.scopeStatus}. ` +
    `Future surface is ${result.allowedFutureUiSurface.surface} with component ${result.allowedFutureUiSurface.futureComponentAllowed}. ` +
    `${result.forbiddenSurfaces.length} forbidden surfaces are blocked. ` +
    `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "This contract cannot authorize implementation, routes, providers, GPS/map activation, scraping, skip tracing, outreach, campaigns, polling, persistence, execution controls, autonomous acquisition, or runtime activation.";
  return summary.length <= maxSummaryLength ? summary : `${summary.slice(0, maxSummaryLength)}...`;
}

export function createR64DrivingForDollarsReadonlyUiImplementationScopeContract(
  input: R64ReadonlyUiScopeInput = {},
): R64ReadonlyUiScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes: string[] = [];
  for (const note of input.extraScopeNotes ?? []) addUnique(scopeNotes, note);

  addWarning(warningCodes, "r64c_readonly_ui_implementation_scope_contract_only");
  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r64bUiScopeAuditReviewed !== true) addWarning(warningCodes, "r64b_ui_scope_audit_required");
  if (input.futureSurfaceReviewed !== true) addWarning(warningCodes, "future_surface_review_required");
  if (input.readOnlyDisplayReviewed !== true) addWarning(warningCodes, "read_only_display_review_required");
  if (input.safeCopyReviewed !== true) addWarning(warningCodes, "safe_copy_review_required");
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
    input.r64bUiScopeAuditReviewed !== true ||
    input.futureSurfaceReviewed !== true ||
    input.readOnlyDisplayReviewed !== true ||
    input.safeCopyReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R64ReadonlyUiScopeStatus = hasForbiddenRequest(input)
    ? "implementation_scope_blocked"
    : missingReview
      ? "operator_review_required"
      : "read_only_ui_implementation_scope_ready";

  const result: R64ReadonlyUiScopeResult = {
    phase: "R64C",
    surface: "driving_for_dollars_readonly_ui_implementation_scope",
    scopeStatus,
    allowedFutureUiSurface,
    forbiddenSurfaces,
    allowedReadOnlyDisplayRules,
    safeCopyRules,
    noExecutionGuarantees,
    accessibilityGuarantees,
    invariantAssertions,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase: "R64D - Driving-for-Dollars Intelligence Read-Only UI Implementation",
    summary: "R64C driving-for-dollars read-only UI implementation scope contract only.",
    ...safetyFlags,
  };
  return { ...result, summary: summarizeR64DrivingForDollarsReadonlyUiScope(result) };
}
