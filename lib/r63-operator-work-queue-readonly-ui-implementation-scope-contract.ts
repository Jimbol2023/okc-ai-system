export type R63ReadonlyUiScopeStatus =
  | "implementation_scope_blocked"
  | "operator_review_required"
  | "read_only_ui_implementation_scope_ready";

export type R63FutureUiSurface = {
  surface: "existing_dashboard";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  futureComponentAllowed: "components/dashboard/operator-work-queue-intelligence-summary.tsx";
  placement: "dashboard_read_only_revenue_operations_section";
  routeChangesAllowed: false;
  redesignAllowed: false;
  implementationAllowedNow: false;
};

export type R63ReadonlyUiWarningCode =
  | "r63c_readonly_ui_implementation_scope_contract_only"
  | "input_missing"
  | "r63b_ui_scope_audit_required"
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
  | "outreach_execution_rejected"
  | "campaign_launch_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
  | "autonomous_workflow_rejected"
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

export type R63ReadonlyUiScopeInput = {
  r63bUiScopeAuditReviewed?: boolean;
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
  outreachExecutionRequested?: boolean;
  campaignLaunchRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  autonomousWorkflowRequested?: boolean;
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

export type R63ReadonlyUiSafetyFlags = {
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

export type R63ReadonlyUiScopeResult = R63ReadonlyUiSafetyFlags & {
  phase: "R63C";
  surface: "operator_work_queue_readonly_ui_implementation_scope";
  scopeStatus: R63ReadonlyUiScopeStatus;
  allowedFutureUiSurface: R63FutureUiSurface;
  forbiddenSurfaces: string[];
  allowedReadOnlyDisplayRules: string[];
  safeCopyRules: string[];
  noExecutionGuarantees: string[];
  accessibilityGuarantees: string[];
  invariantAssertions: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R63ReadonlyUiSafetyFlags;
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R63ReadonlyUiInvariantCheck = { passed: boolean; warningCodes: string[] };

const maxTextLength = 180;
const maxSummaryLength = 850;

const safetyFlags: R63ReadonlyUiSafetyFlags = {
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

const allowedFutureUiSurface: R63FutureUiSurface = {
  surface: "existing_dashboard",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  futureComponentAllowed: "components/dashboard/operator-work-queue-intelligence-summary.tsx",
  placement: "dashboard_read_only_revenue_operations_section",
  routeChangesAllowed: false,
  redesignAllowed: false,
  implementationAllowedNow: false,
};

const forbiddenSurfaces = [
  "new execution queue",
  "new automation-agent panel",
  "new campaign tab",
  "new provider console",
  "new autonomous routing panel",
  "new approval-to-execution workflow",
  "new route unless explicitly authorized later",
];

const allowedReadOnlyDisplayRules = [
  "Governance stop signals must render first.",
  "Highest-priority operator review may display only as manual review guidance.",
  "Overdue operational review, queue pressure, stale workflow, workflow bottleneck, and revenue-risk labels are advisory only.",
  "Operator workload pressure and workload balancing are visibility only and cannot assign work.",
  "Acquisition follow-up, buyer-review, and assignment-readiness workload labels cannot contact sellers or buyers.",
  "Operational priority never means execute, contact, activate, automate, launch, send, or route automatically.",
];

const safeCopyRules = [
  "Manual review may be beneficial.",
  "Operator attention may be warranted.",
  "Workflow review may deserve prioritization.",
  "Governance stop signals must be resolved first.",
  "Operational priority label is advisory only.",
  "Queue pressure is visibility only.",
];

const noExecutionGuarantees = [
  "No UI implementation, dashboard change, route, provider, Twilio, email, SMS, campaign, automation-agent, Prisma, persistence, polling, runtime activation, execution handler, or workflow mutation is authorized in R63C.",
  "No buttons, links, forms, toggles, menus, controls, or hidden execution affordances may be introduced by this scope contract.",
  "No autonomous workflow routing, autonomous outreach, autonomous negotiation, auto approval, auto escalation, or auto assignment is allowed.",
];

const accessibilityGuarantees = [
  "Future UI must use a semantic section with aria-labelledby and concise summary text.",
  "Future sections must use readable headings, readable labels, and text-based status meaning.",
  "Future UI must not rely on color alone, motion, focus movement, auto-refresh, polling, or live update dependency.",
  "Governance stop visibility must appear before advisory work queue guidance.",
];

const invariantAssertions = [
  "readOnly must remain true.",
  "advisoryOnly must remain true.",
  "simulationOnly must remain true.",
  "providerCalled must remain false.",
  "sent must remain false.",
  "persistenceAllowedNow must remain false.",
  "pollingAllowed must remain false.",
  "runtimeActivationAllowed must remain false.",
  "providerActivationAllowed must remain false.",
  "approvalGrantsExecution must remain false.",
  "uiImplementationAllowedNow must remain false in R63C.",
];

function addUnique(list: string[], value: string) {
  const bounded = value.trim().length <= maxTextLength ? value.trim() : `${value.trim().slice(0, maxTextLength)}...`;
  if (bounded && !list.includes(bounded)) list.push(bounded);
}

function addWarning(warningCodes: string[], warningCode: R63ReadonlyUiWarningCode) {
  addUnique(warningCodes, warningCode);
}

function hasForbiddenRequest(input: R63ReadonlyUiScopeInput) {
  return (
    input.uiImplementationRequested === true ||
    input.dashboardChangeRequested === true ||
    input.routeChangeRequested === true ||
    input.providerActivationRequested === true ||
    input.outreachExecutionRequested === true ||
    input.campaignLaunchRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.autonomousWorkflowRequested === true ||
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

export function assertR63OperatorWorkQueueReadonlyUiScopeInvariants(
  result: Pick<R63ReadonlyUiScopeResult, keyof R63ReadonlyUiSafetyFlags>,
): R63ReadonlyUiInvariantCheck {
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

export function summarizeR63OperatorWorkQueueReadonlyUiScope(result: R63ReadonlyUiScopeResult) {
  const invariantCheck = assertR63OperatorWorkQueueReadonlyUiScopeInvariants(result);
  const summary =
    `R63C ${result.surface} status is ${result.scopeStatus}. Existing dashboard placement and ${result.allowedFutureUiSurface.futureComponentAllowed} are scoped for later only. ` +
    `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "This contract cannot authorize UI implementation, dashboard changes, routes, execution controls, providers, outreach, campaigns, persistence, polling, autonomous workflow routing, or runtime activation.";
  return summary.length <= maxSummaryLength ? summary : `${summary.slice(0, maxSummaryLength)}...`;
}

export function createR63OperatorWorkQueueReadonlyUiImplementationScopeContract(
  input: R63ReadonlyUiScopeInput = {},
): R63ReadonlyUiScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes: string[] = [];
  for (const note of input.extraScopeNotes ?? []) addUnique(scopeNotes, note);

  addWarning(warningCodes, "r63c_readonly_ui_implementation_scope_contract_only");
  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r63bUiScopeAuditReviewed !== true) addWarning(warningCodes, "r63b_ui_scope_audit_required");
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
  if (input.outreachExecutionRequested === true) addWarning(warningCodes, "outreach_execution_rejected");
  if (input.campaignLaunchRequested === true) addWarning(warningCodes, "campaign_launch_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.autonomousWorkflowRequested === true) addWarning(warningCodes, "autonomous_workflow_rejected");
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
    if (warningCode.endsWith("_rejected") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed_now")) {
      addUnique(rejectionReasons, warningCode);
    }
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingReview =
    input.r63bUiScopeAuditReviewed !== true ||
    input.futureSurfaceReviewed !== true ||
    input.readOnlyDisplayReviewed !== true ||
    input.safeCopyReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R63ReadonlyUiScopeStatus = hasForbiddenRequest(input)
    ? "implementation_scope_blocked"
    : missingReview
      ? "operator_review_required"
      : "read_only_ui_implementation_scope_ready";
  const result: R63ReadonlyUiScopeResult = {
    phase: "R63C",
    surface: "operator_work_queue_readonly_ui_implementation_scope",
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
    nextSuggestedPhase: "R63D - Operator Work Queue Intelligence Read-Only UI Implementation",
    summary: "R63C operator work queue read-only UI implementation scope contract only.",
    ...safetyFlags,
  };
  return { ...result, summary: summarizeR63OperatorWorkQueueReadonlyUiScope(result) };
}
