export type R63FinalLockdownStatus =
  | "final_lockdown_blocked"
  | "operator_review_required"
  | "operator_work_queue_dashboard_locked";

export type R63FinalLockdownInput = {
  r63aScopeReviewed?: boolean;
  r63bUiScopeReviewed?: boolean;
  r63cImplementationScopeReviewed?: boolean;
  r63dUiImplementationReviewed?: boolean;
  r63eSafetyAccessibilityReviewed?: boolean;
  dashboardSafetyReviewed?: boolean;
  readOnlyReviewed?: boolean;
  governanceStopDominanceReviewed?: boolean;
  workloadPriorityReviewed?: boolean;
  staleWorkflowReviewed?: boolean;
  bottleneckReviewed?: boolean;
  queuePressureReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  executionBoundariesReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  newUiFeatureRequested?: boolean;
  routeChangeRequested?: boolean;
  providerActivationRequested?: boolean;
  outreachExecutionRequested?: boolean;
  campaignActivationRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  autonomousWorkflowRequested?: boolean;
  autonomousNegotiationRequested?: boolean;
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
  extraLockdownNotes?: string[];
};

export type R63FinalSafetyFlags = {
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
  uiImplementationAllowedNow: true;
};

export type R63FinalLockdownResult = R63FinalSafetyFlags & {
  phase: "R63F";
  surface: "operator_work_queue_final_dashboard_lockdown";
  lockdownStatus: R63FinalLockdownStatus;
  r63StackReviewFindings: string[];
  readOnlyEnforcementFindings: string[];
  governanceStopDominanceFindings: string[];
  workloadPriorityFindings: string[];
  staleWorkflowFindings: string[];
  bottleneckAndQueuePressureFindings: string[];
  forbiddenControlFindings: string[];
  accessibilityPreservationFindings: string[];
  executionBoundaryFindings: string[];
  futureSafeUiLimitations: string[];
  blockedPatterns: string[];
  invariantAssertions: string[];
  allowedFinalState: string[];
  forbiddenBoundaries: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R63FinalSafetyFlags;
  operatorReviewRequired: boolean;
  lockdownNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

const safetyFlags: R63FinalSafetyFlags = {
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
  uiImplementationAllowedNow: true,
};

const r63StackReviewFindings = [
  "R63A scoped operator work queue intelligence as governed, manual-first, read-only, advisory-only, and workflow-priority focused.",
  "R63B audited future UI boundaries for workload visibility, queue pressure, stale workflows, bottlenecks, review priority, dangerous wording, and accessibility.",
  "R63C locked implementation scope to existing dashboard placement and the allowed operator work queue intelligence summary component.",
  "R63D implemented the read-only dashboard surface with already-loaded dashboard leads and existing manual revenue metrics only.",
  "R63E reviewed safety, accessibility, dangerous wording, forbidden controls, governance boundaries, and found no UI fixes required.",
];

const readOnlyEnforcementFindings = [
  "The R63D surface renders advisory labels, counts, status text, and explanatory guidance only.",
  "The R63D component accepts already-loaded dashboard leads and existing manual revenue metrics.",
  "The R63D component adds no fetch, localStorage, sessionStorage, polling, timers, provider imports, route changes, or persistence.",
  "The R63D component exposes no buttons, links, forms, toggles, menus, handlers, or execution controls.",
  "uiImplementationAllowedNow is true only because the read-only dashboard UI now exists; this does not permit execution.",
];

const governanceStopDominanceFindings = [
  "Governance stop visibility renders first in the R63D operator work queue intelligence section.",
  "Governance stop signals must be resolved first before urgency, workload pressure, stale workflow pressure, revenue priority, or operational momentum.",
  "No operational priority label can override do-not-contact, rejection, or human-review guidance.",
];

const workloadPriorityFindings = [
  "Operational priority label is advisory only.",
  "Manual review may be beneficial means operator review may be prioritized, not executed.",
  "Queue pressure is visibility only and not an execution queue.",
  "Workload balancing and high-value review priority cannot auto assign, auto approve, or auto route.",
];

const staleWorkflowFindings = [
  "Stale workflow visibility, workflow aging, delayed review, and workflow stagnation labels are review-only.",
  "Stale workflow visibility does not launch campaigns, send messages, activate providers, persist state, poll, or execute workflows.",
];

const bottleneckAndQueuePressureFindings = [
  "Workflow bottleneck visibility and blocked workflow visibility are read-only stop or friction labels.",
  "Bottleneck labels cannot mutate workflow state, assign tasks, persist, poll, or execute.",
  "Revenue-risk visibility remains advisory only.",
];

const forbiddenControlFindings = [
  "No auto-assign, auto-execute, auto-contact, campaign launch, provider activation, auto-dial, SMS, email, workflow execution, autonomous negotiation, autonomous outreach, auto escalation, auto approval, or autonomous workflow routing control is present.",
  "Forbidden phrases are allowed only as blocked-pattern definitions, rejection tests, or negative boundary copy.",
  "The R63D component contains no hidden execution affordance, provider hook, autonomous workflow path, or outreach path.",
];

const accessibilityPreservationFindings = [
  "The R63D component uses a semantic section with aria-labelledby and aria-describedby.",
  "The heading id and summary id match the accessibility references.",
  "Each operator work queue section has readable headings, counts, status text, and explanatory detail.",
  "Status and priority meaning are expressed in text and do not depend on color alone.",
  "No motion dependency, focus movement, auto-refresh, polling, or live-update behavior is introduced.",
];

const executionBoundaryFindings = [
  "No outbound communication, SMS, email, campaigns, provider connectivity, Twilio access, or automation-agent behavior is enabled.",
  "No persistence, polling, runtime activation, execution controls, workflow mutation, hidden execution state, or approval-to-execution escalation is enabled.",
  "R63 remains manual-first and advisory-only; it accelerates operator review without autonomous workflow execution.",
];

const futureSafeUiLimitations = [
  "Future R63 changes must remain inside existing dashboard placement unless explicitly authorized.",
  "Future enhancements may add only read-only workload visibility unless separately scoped and reviewed.",
  "Operational priority never means execute, contact, activate, automate, launch, send, or route automatically.",
  "Future UI must remain deterministic, accessible, non-autonomous, fail-closed, and manual-first.",
];

const blockedPatterns = [
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
  "AI closes deals automatically",
  "AI negotiates automatically",
  "AI manages workflow automatically",
  "hidden execution affordances",
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
  "uiImplementationAllowedNow must remain true only because the read-only R63 dashboard surface exists.",
  "Governance stop signals must render first and outrank all operational workload labels.",
];

const allowedFinalState = [
  "Read-only operator work queue dashboard summary.",
  "Advisory-only workload, queue pressure, stale workflow, bottleneck, and revenue-priority labels.",
  "Governance-stop-first display ordering.",
  "Screen-reader-friendly summaries and text-based status meaning.",
];

const forbiddenBoundaries = [
  "No UI redesign or new UI features in R63F.",
  "No new routes, provider connectivity, Twilio, email, SMS, outreach execution, campaigns, automation-agent usage, Prisma/schema/migrations, persistence, polling, runtime activation, or execution controls.",
  "No autonomous workflow routing, autonomous negotiation, autonomous outreach, auto assignment, auto approval, approval-as-permission drift, or hidden execution state.",
];

function addUnique(list: string[], value: string) {
  const bounded = value.trim().length <= 180 ? value.trim() : `${value.trim().slice(0, 180)}...`;
  if (bounded && !list.includes(bounded)) list.push(bounded);
}

function hasForbidden(input: R63FinalLockdownInput) {
  return (
    input.newUiFeatureRequested === true ||
    input.routeChangeRequested === true ||
    input.providerActivationRequested === true ||
    input.outreachExecutionRequested === true ||
    input.campaignActivationRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.autonomousWorkflowRequested === true ||
    input.autonomousNegotiationRequested === true ||
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
    input.uiImplementationAllowedNow === false
  );
}

export function assertR63OperatorWorkQueueFinalLockdownInvariants(result: Pick<R63FinalLockdownResult, keyof R63FinalSafetyFlags>) {
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
  if (result.uiImplementationAllowedNow !== true) warningCodes.push("ui_implementation_allowed_now_required");
  return { passed: warningCodes.length === 0, warningCodes };
}

export function summarizeR63OperatorWorkQueueFinalDashboardLockdown(result: R63FinalLockdownResult) {
  const invariantCheck = assertR63OperatorWorkQueueFinalLockdownInvariants(result);
  return `R63F ${result.surface} status is ${result.lockdownStatus}. ${result.blockedPatterns.length} blocked patterns and ${result.invariantAssertions.length} invariants are locked. Invariants ${invariantCheck.passed ? "passed" : "failed"}. Final lockdown preserves read-only, manual-first operator work queue intelligence without execution, providers, outreach, campaigns, polling, persistence, autonomous routing, or approval escalation.`;
}

export function createR63OperatorWorkQueueFinalDashboardLockdownContract(input: R63FinalLockdownInput = {}): R63FinalLockdownResult {
  const warningCodes: string[] = ["r63f_final_dashboard_lockdown_contract_only"];
  const rejectionReasons: string[] = [];
  const lockdownNotes: string[] = [];
  for (const note of input.extraLockdownNotes ?? []) addUnique(lockdownNotes, note);

  if (Object.keys(input).length === 0) warningCodes.push("input_missing");
  if (input.r63aScopeReviewed !== true) warningCodes.push("r63a_scope_review_required");
  if (input.r63bUiScopeReviewed !== true) warningCodes.push("r63b_ui_scope_review_required");
  if (input.r63cImplementationScopeReviewed !== true) warningCodes.push("r63c_implementation_scope_review_required");
  if (input.r63dUiImplementationReviewed !== true) warningCodes.push("r63d_ui_implementation_review_required");
  if (input.r63eSafetyAccessibilityReviewed !== true) warningCodes.push("r63e_safety_accessibility_review_required");
  if (input.dashboardSafetyReviewed !== true) warningCodes.push("dashboard_safety_review_required");
  if (input.readOnlyReviewed !== true) warningCodes.push("read_only_review_required");
  if (input.governanceStopDominanceReviewed !== true) warningCodes.push("governance_stop_dominance_review_required");
  if (input.workloadPriorityReviewed !== true) warningCodes.push("workload_priority_review_required");
  if (input.staleWorkflowReviewed !== true) warningCodes.push("stale_workflow_review_required");
  if (input.bottleneckReviewed !== true) warningCodes.push("bottleneck_review_required");
  if (input.queuePressureReviewed !== true) warningCodes.push("queue_pressure_review_required");
  if (input.forbiddenControlsReviewed !== true) warningCodes.push("forbidden_control_review_required");
  if (input.executionBoundariesReviewed !== true) warningCodes.push("execution_boundary_review_required");
  if (input.accessibilityReviewed !== true) warningCodes.push("accessibility_review_required");
  if (input.operatorReviewCompleted !== true) warningCodes.push("operator_review_required");
  if (input.newUiFeatureRequested === true) warningCodes.push("new_ui_feature_rejected");
  if (input.providerActivationRequested === true) warningCodes.push("provider_activation_rejected");
  if (input.outreachExecutionRequested === true) warningCodes.push("outreach_execution_rejected");
  if (input.campaignActivationRequested === true) warningCodes.push("campaign_activation_rejected");
  if (input.automationAgentRequested === true) warningCodes.push("automation_agent_rejected");
  if (input.pollingRequested === true) warningCodes.push("polling_rejected");
  if (input.persistenceRequested === true) warningCodes.push("persistence_rejected");
  if (input.executionControlRequested === true) warningCodes.push("execution_control_rejected");
  if (input.autonomousWorkflowRequested === true) warningCodes.push("autonomous_workflow_rejected");
  if (input.readOnly === false) warningCodes.push("read_only_required");
  if (input.providerCalled === true) warningCodes.push("provider_called_must_be_false");
  if (input.sent === true) warningCodes.push("sent_must_be_false");
  if (input.pollingAllowed === true) warningCodes.push("polling_not_allowed");
  if (input.uiImplementationAllowedNow === false) warningCodes.push("ui_implementation_allowed_now_required");
  for (const code of warningCodes) if (code.endsWith("_rejected") || code.endsWith("_must_be_false")) addUnique(rejectionReasons, code);

  const missingReview =
    input.r63aScopeReviewed !== true ||
    input.r63bUiScopeReviewed !== true ||
    input.r63cImplementationScopeReviewed !== true ||
    input.r63dUiImplementationReviewed !== true ||
    input.r63eSafetyAccessibilityReviewed !== true ||
    input.dashboardSafetyReviewed !== true ||
    input.readOnlyReviewed !== true ||
    input.governanceStopDominanceReviewed !== true ||
    input.workloadPriorityReviewed !== true ||
    input.staleWorkflowReviewed !== true ||
    input.bottleneckReviewed !== true ||
    input.queuePressureReviewed !== true ||
    input.forbiddenControlsReviewed !== true ||
    input.executionBoundariesReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.operatorReviewCompleted !== true;
  const lockdownStatus: R63FinalLockdownStatus = hasForbidden(input)
    ? "final_lockdown_blocked"
    : missingReview
      ? "operator_review_required"
      : "operator_work_queue_dashboard_locked";
  const result: R63FinalLockdownResult = {
    phase: "R63F",
    surface: "operator_work_queue_final_dashboard_lockdown",
    lockdownStatus,
    r63StackReviewFindings,
    readOnlyEnforcementFindings,
    governanceStopDominanceFindings,
    workloadPriorityFindings,
    staleWorkflowFindings,
    bottleneckAndQueuePressureFindings,
    forbiddenControlFindings,
    accessibilityPreservationFindings,
    executionBoundaryFindings,
    futureSafeUiLimitations,
    blockedPatterns,
    invariantAssertions,
    allowedFinalState,
    forbiddenBoundaries,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    operatorReviewRequired: input.operatorReviewCompleted !== true,
    lockdownNotes,
    nextSuggestedPhase: "R64A - Driving-for-Dollars Intelligence Scope Contract",
    summary: "R63F operator work queue final dashboard lockdown contract only.",
    ...safetyFlags,
  };
  return { ...result, summary: summarizeR63OperatorWorkQueueFinalDashboardLockdown(result) };
}
