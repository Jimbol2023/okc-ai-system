export type R63UiScopeStatus = "ui_scope_blocked" | "operator_review_required" | "ui_scope_ready_for_later_implementation";

export type R63AllowedUiSection =
  | "governance_stop_visibility"
  | "highest_priority_operator_review"
  | "overdue_operational_review"
  | "workflow_bottleneck_visibility"
  | "stale_workflow_visibility"
  | "revenue_priority_workload_review"
  | "operator_workload_pressure_review"
  | "assignment_readiness_workload_review"
  | "buyer_review_workload_visibility"
  | "acquisition_follow_up_workload_visibility"
  | "blocked_workflow_visibility"
  | "incomplete_operational_workflow_visibility"
  | "queue_pressure_visibility"
  | "workflow_aging_visibility"
  | "delayed_review_visibility"
  | "high_value_review_priority"
  | "workload_balancing_visibility"
  | "manual_review_guidance";

export type R63UiWarningCode =
  | "r63b_ui_scope_audit_only"
  | "input_missing"
  | "r63a_scope_review_required"
  | "ui_surface_review_required"
  | "workload_visibility_review_required"
  | "queue_pressure_review_required"
  | "stale_workflow_review_required"
  | "bottleneck_visibility_review_required"
  | "review_priority_visibility_review_required"
  | "wording_review_required"
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

export type R63UiScopeInput = {
  r63aScopeReviewed?: boolean;
  uiSurfaceReviewed?: boolean;
  workloadVisibilityReviewed?: boolean;
  queuePressureReviewed?: boolean;
  staleWorkflowReviewed?: boolean;
  bottleneckVisibilityReviewed?: boolean;
  reviewPriorityVisibilityReviewed?: boolean;
  wordingReviewed?: boolean;
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
  extraAuditNotes?: string[];
};

export type R63UiSafetyFlags = {
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

export type R63UiScopeResult = R63UiSafetyFlags & {
  phase: "R63B";
  surface: "operator_work_queue_intelligence_ui_scope";
  scopeStatus: R63UiScopeStatus;
  allowedFutureUiSections: R63AllowedUiSection[];
  workloadVisibility: string[];
  queuePressureVisibility: string[];
  staleWorkflowVisibility: string[];
  bottleneckVisibility: string[];
  reviewPriorityVisibility: string[];
  safeWording: string[];
  forbiddenControls: string[];
  dangerousWordingPatterns: string[];
  accessibilityExpectations: string[];
  governanceBoundaries: string[];
  implementationBoundaries: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R63UiSafetyFlags;
  operatorReviewRequired: boolean;
  auditNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R63UiInvariantCheck = { passed: boolean; warningCodes: string[] };

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 800;

const safetyFlags: R63UiSafetyFlags = {
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

const allowedFutureUiSections: R63AllowedUiSection[] = [
  "governance_stop_visibility",
  "highest_priority_operator_review",
  "overdue_operational_review",
  "workflow_bottleneck_visibility",
  "stale_workflow_visibility",
  "revenue_priority_workload_review",
  "operator_workload_pressure_review",
  "assignment_readiness_workload_review",
  "buyer_review_workload_visibility",
  "acquisition_follow_up_workload_visibility",
  "blocked_workflow_visibility",
  "incomplete_operational_workflow_visibility",
  "queue_pressure_visibility",
  "workflow_aging_visibility",
  "delayed_review_visibility",
  "high_value_review_priority",
  "workload_balancing_visibility",
  "manual_review_guidance",
];

const workloadVisibility = [
  "Show highest-priority operator review as manual review guidance only.",
  "Show workload pressure, workload balancing, and high-value review priority as read-only labels.",
  "Workload labels cannot assign tasks, execute workflows, persist state, or route automatically.",
];

const queuePressureVisibility = [
  "Queue pressure visibility is not an execution queue.",
  "Queue pressure may show overloaded review areas and delayed review counts only.",
  "Queue pressure cannot auto escalate, auto approve, auto assign, or auto route.",
];

const staleWorkflowVisibility = [
  "Stale workflow visibility may show workflow aging, delayed review, and stagnation labels.",
  "Stale workflow labels do not launch campaigns, send messages, or activate providers.",
  "Manual stale-workflow recovery review only.",
];

const bottleneckVisibility = [
  "Workflow bottleneck visibility may show blocked and incomplete operational workflows.",
  "Bottleneck labels cannot mutate workflow state or execute workflow.",
  "Revenue-risk visibility remains advisory only.",
];

const reviewPriorityVisibility = [
  "High-value review priority is a manual attention label only.",
  "Review-needed prioritization does not contact sellers or buyers.",
  "Operator attention guidance remains advisory text.",
];

const safeWording = [
  "Manual review may be beneficial.",
  "Operator attention may be warranted.",
  "Workflow review may deserve prioritization.",
  "Governance stop signals must be resolved first.",
  "Operational priority label is advisory only.",
  "Queue pressure is visibility only.",
];

const forbiddenControls = [
  "auto assign tasks",
  "auto execute workflows",
  "auto contact sellers",
  "auto contact buyers",
  "launch campaign",
  "activate provider",
  "auto dial",
  "send SMS",
  "send email",
  "execute workflow",
  "autonomous negotiation",
  "autonomous outreach",
  "auto escalation",
  "auto approval",
  "autonomous workflow routing",
  "hidden execution affordances",
];

const dangerousWordingPatterns = [
  "AI closes deals automatically",
  "AI negotiates automatically",
  "AI manages workflow automatically",
  "send-ready workflow",
  "auto-routed task",
  "approval launches workflow",
];

const accessibilityExpectations = [
  "Use semantic headings and readable labels.",
  "Use concise screen-reader-friendly summaries.",
  "Status meaning must be text-based and never depend on color alone.",
  "No motion dependency, focus movement, auto-refresh, live update dependency, or polling.",
  "Governance stop visibility must appear before advisory workload guidance.",
];

const governanceBoundaries = [
  "Governance stop signals must render first and outrank urgency, workload pressure, stale workflow pressure, revenue priority, and operational momentum.",
  "Operational priority means manual review may be beneficial only.",
  "Operational priority never means execute, contact, activate, automate, launch, send, or route automatically.",
];

const implementationBoundaries = [
  "R63B cannot implement UI or modify the dashboard.",
  "Future UI must use existing dashboard placement only.",
  "Future optional component: components/dashboard/operator-work-queue-intelligence-summary.tsx.",
  "No routes, providers, persistence, polling, runtime activation, execution controls, autonomous routing, or outreach execution.",
];

function addUnique(list: string[], value: string) {
  const bounded = value.trim().length <= maxTextLength ? value.trim() : `${value.trim().slice(0, maxTextLength)}...`;
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function addWarning(warningCodes: string[], warningCode: R63UiWarningCode) {
  addUnique(warningCodes, warningCode);
}

function hasForbiddenRequest(input: R63UiScopeInput) {
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

export function assertR63OperatorWorkQueueUiScopeInvariants(
  result: Pick<R63UiScopeResult, keyof R63UiSafetyFlags>,
): R63UiInvariantCheck {
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

export function summarizeR63OperatorWorkQueueUiScopeAudit(result: R63UiScopeResult) {
  const invariantCheck = assertR63OperatorWorkQueueUiScopeInvariants(result);
  const summary =
    `R63B ${result.surface} status is ${result.scopeStatus}. ` +
    `${result.allowedFutureUiSections.length} future UI sections are scoped. ` +
    `${result.forbiddenControls.length} controls are forbidden. ` +
    `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
    "This audit cannot authorize UI implementation, dashboard changes, routes, execution controls, providers, outreach, campaigns, polling, persistence, autonomous workflow routing, or runtime activation.";
  return summary.length <= maxSummaryLength ? summary : `${summary.slice(0, maxSummaryLength)}...`;
}

export function createR63OperatorWorkQueueUiScopeAudit(input: R63UiScopeInput = {}): R63UiScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const auditNotes: string[] = [];
  for (const note of input.extraAuditNotes ?? []) addUnique(auditNotes, note);

  addWarning(warningCodes, "r63b_ui_scope_audit_only");
  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r63aScopeReviewed !== true) addWarning(warningCodes, "r63a_scope_review_required");
  if (input.uiSurfaceReviewed !== true) addWarning(warningCodes, "ui_surface_review_required");
  if (input.workloadVisibilityReviewed !== true) addWarning(warningCodes, "workload_visibility_review_required");
  if (input.queuePressureReviewed !== true) addWarning(warningCodes, "queue_pressure_review_required");
  if (input.staleWorkflowReviewed !== true) addWarning(warningCodes, "stale_workflow_review_required");
  if (input.bottleneckVisibilityReviewed !== true) addWarning(warningCodes, "bottleneck_visibility_review_required");
  if (input.reviewPriorityVisibilityReviewed !== true) addWarning(warningCodes, "review_priority_visibility_review_required");
  if (input.wordingReviewed !== true) addWarning(warningCodes, "wording_review_required");
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
    input.r63aScopeReviewed !== true ||
    input.uiSurfaceReviewed !== true ||
    input.workloadVisibilityReviewed !== true ||
    input.queuePressureReviewed !== true ||
    input.staleWorkflowReviewed !== true ||
    input.bottleneckVisibilityReviewed !== true ||
    input.reviewPriorityVisibilityReviewed !== true ||
    input.wordingReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R63UiScopeStatus = hasForbiddenRequest(input)
    ? "ui_scope_blocked"
    : missingReview
      ? "operator_review_required"
      : "ui_scope_ready_for_later_implementation";
  const result: R63UiScopeResult = {
    phase: "R63B",
    surface: "operator_work_queue_intelligence_ui_scope",
    scopeStatus,
    allowedFutureUiSections,
    workloadVisibility,
    queuePressureVisibility,
    staleWorkflowVisibility,
    bottleneckVisibility,
    reviewPriorityVisibility,
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
    nextSuggestedPhase: "R63C - Operator Work Queue Intelligence Read-Only UI Implementation Scope Contract",
    summary: "R63B operator work queue UI scope audit only.",
    ...safetyFlags,
  };
  return { ...result, summary: summarizeR63OperatorWorkQueueUiScopeAudit(result) };
}
