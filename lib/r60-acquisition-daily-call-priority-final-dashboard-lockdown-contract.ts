export type R60FinalDashboardLockdownStatus =
  | "final_lockdown_blocked"
  | "operator_review_required"
  | "acquisition_daily_call_priority_dashboard_locked";

export type R60FinalBlockedPattern =
  | "call now"
  | "auto call"
  | "auto dial"
  | "launch dialer"
  | "send SMS"
  | "send email"
  | "activate campaign"
  | "auto follow-up"
  | "queue execution"
  | "provider activation"
  | "approve and send"
  | "execute workflow"
  | "execute call workflow"
  | "release automation"
  | "autonomous outreach"
  | "autonomous negotiation"
  | "hidden execution affordances";

export type R60FinalLockdownWarningCode =
  | "r60f_final_dashboard_lockdown_contract_only"
  | "input_missing"
  | "r60a_scope_review_required"
  | "r60b_ui_scope_review_required"
  | "r60c_implementation_scope_review_required"
  | "r60d_ui_implementation_review_required"
  | "r60e_safety_accessibility_review_required"
  | "dashboard_safety_review_required"
  | "read_only_review_required"
  | "governance_stop_dominance_review_required"
  | "forbidden_control_review_required"
  | "execution_boundary_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "new_ui_feature_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "call_execution_rejected"
  | "dialer_activation_rejected"
  | "campaign_activation_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
  | "redesign_rejected"
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
  | "approval_grants_execution_must_be_false"
  | "ui_implementation_allowed_now_required";

export type R60FinalLockdownInput = {
  r60aScopeReviewed?: boolean;
  r60bUiScopeReviewed?: boolean;
  r60cImplementationScopeReviewed?: boolean;
  r60dUiImplementationReviewed?: boolean;
  r60eSafetyAccessibilityReviewed?: boolean;
  dashboardSafetyReviewed?: boolean;
  readOnlyReviewed?: boolean;
  governanceStopDominanceReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  executionBoundariesReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  newUiFeatureRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  callExecutionRequested?: boolean;
  dialerActivationRequested?: boolean;
  campaignActivationRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  redesignRequested?: boolean;
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
  extraLockdownNotes?: string[];
};

export type R60FinalLockdownSafetyFlags = {
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

export type R60FinalLockdownResult = R60FinalLockdownSafetyFlags & {
  phase: "R60F";
  surface: "acquisition_daily_call_priority_final_dashboard_lockdown";
  lockdownStatus: R60FinalDashboardLockdownStatus;
  r60StackReviewFindings: string[];
  readOnlyEnforcementFindings: string[];
  governanceStopDominanceFindings: string[];
  forbiddenControlFindings: string[];
  accessibilityPreservationFindings: string[];
  executionBoundaryFindings: string[];
  futureSafeUiLimitations: string[];
  blockedPatterns: R60FinalBlockedPattern[];
  invariantAssertions: string[];
  allowedFinalState: string[];
  forbiddenBoundaries: string[];
  safetyFlags: R60FinalLockdownSafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  lockdownNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R60FinalLockdownInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R60FinalLockdownSafetyFlags = {
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

const r60StackReviewFindings = [
  "R60A scoped acquisition daily call priority intelligence as read-only, advisory-only, simulation-only, and manual-first.",
  "R60B audited future dashboard visibility, safe wording, accessibility expectations, and forbidden call/campaign semantics.",
  "R60C locked the read-only UI implementation scope to existing dashboard placement and existing dashboard-loaded signals.",
  "R60D implemented the first read-only dashboard surface with existing dashboard leads and manual revenue metrics only.",
  "R60E reviewed safety, accessibility, dangerous wording, forbidden controls, and governance boundaries with no fixes required.",
];

const readOnlyEnforcementFindings = [
  "The R60D dashboard surface renders advisory labels, counts, and explanatory text only.",
  "The R60D component accepts already-loaded dashboard leads and existing manual revenue metrics.",
  "The R60D component adds no fetch, localStorage, sessionStorage, polling, timers, provider imports, route changes, or persistence.",
  "The R60D component exposes no buttons, links, forms, toggles, menus, handlers, or execution controls.",
  "uiImplementationAllowedNow is true only because the read-only dashboard UI now exists; this does not permit execution.",
];

const governanceStopDominanceFindings = [
  "Governance stop signals render first in the R60D acquisition call priority section.",
  "Do-not-contact, rejected approval, and human-review states stay ahead of all seller priority guidance.",
  "No seller urgency, lead decay, momentum, high-motivation, or follow-up label can override governance stop guidance.",
  "Approval and review wording does not grant permission to call, text, email, dial, launch campaigns, or activate providers.",
];

const forbiddenControlFindings = [
  "No call now, auto call, auto dial, launch dialer, send SMS, send email, activate campaign, auto follow-up, provider activation, queue execution, approve-and-send, execute-workflow, or release-automation control is present.",
  "Forbidden phrases are allowed only as blocked-pattern definitions, rejection tests, or explicit negative safety copy.",
  "The R60D component contains no hidden execution affordance, background execution state, provider hook, or autonomous workflow path.",
];

const accessibilityPreservationFindings = [
  "The R60D component uses a semantic section with aria-labelledby.",
  "The heading id matches the aria-labelledby target.",
  "Each section has readable headings, counts, status text, and explanatory detail.",
  "Status and priority meaning are expressed in text and do not depend on color alone.",
  "No motion dependency, focus movement, auto-refresh, polling, or live-update behavior is introduced.",
];

const executionBoundaryFindings = [
  "No calls, dialing, SMS, email, campaigns, provider connectivity, Twilio access, or automation-agent behavior is enabled.",
  "No persistence, polling, runtime activation, execution controls, workflow mutation, or approval-to-execution escalation is enabled.",
  "The R60D guidance remains manual-first and advisory-only.",
  "Operators may use the visible priority labels manually outside the app after normal governance review.",
];

const futureSafeUiLimitations = [
  "Future UI changes must remain in existing dashboard placement unless a later phase explicitly authorizes a route.",
  "Future copy must keep call priority labels advisory only and governance stop signals first.",
  "Future controls must not call, dial, send, launch campaigns, activate providers, mutate workflows, persist state, or poll.",
  "Future communication systems may be professional and customizable, but execution must remain controlled, approval-gated, non-autonomous, and fail-closed.",
];

const blockedPatterns: R60FinalBlockedPattern[] = [
  "call now",
  "auto call",
  "auto dial",
  "launch dialer",
  "send SMS",
  "send email",
  "activate campaign",
  "auto follow-up",
  "queue execution",
  "provider activation",
  "approve and send",
  "execute workflow",
  "execute call workflow",
  "release automation",
  "autonomous outreach",
  "autonomous negotiation",
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
  "uiImplementationAllowedNow must remain true after R60D.",
  "Governance stop signals must dominate seller priority guidance.",
  "No execution affordances, provider connectivity, outbound communication controls, hidden execution state, or approval-to-execution escalation may appear.",
];

const allowedFinalState = [
  "R60 dashboard UI may remain visible as read-only acquisition daily call priority guidance.",
  "Existing dashboard-loaded leads and existing manual revenue metrics may feed derived labels and counts.",
  "Seller call priority labels may guide human review only.",
  "The implemented UI is allowed now only as read-only, advisory-only, non-executing dashboard intelligence.",
];

const forbiddenBoundaries = [
  "No UI redesign or new UI features in R60F.",
  "No routes, providers, Twilio, automation-agent, Prisma, schema, migrations, persistence, polling, or runtime activation.",
  "No calls, dialing, SMS, email, campaigns, execution controls, workflow mutation, or hidden execution state.",
  "No autonomous outreach, autonomous negotiation, approval-as-permission drift, or provider activation.",
  "No property facts may be invented and assumptions must remain clearly labeled.",
];

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalized = normalizeText(value);
  if (normalized.length <= maxTextLength) return normalized;

  return `${normalized.slice(0, maxTextLength)}...`;
}

function boundSummary(value: string) {
  if (value.length <= maxSummaryLength) return value;

  return `${value.slice(0, maxSummaryLength)}...`;
}

function addUnique(list: string[], value: string) {
  const bounded = boundText(value);
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function addWarning(warningCodes: string[], warningCode: R60FinalLockdownWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R60FinalLockdownInput) {
  return (
    input.newUiFeatureRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.callExecutionRequested === true ||
    input.dialerActivationRequested === true ||
    input.campaignActivationRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.redesignRequested === true ||
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
    input.uiImplementationAllowedNow === false
  );
}

export function assertR60AcquisitionDailyCallPriorityFinalLockdownInvariants(
  result: Pick<
    R60FinalLockdownResult,
    | "readOnly"
    | "advisoryOnly"
    | "simulationOnly"
    | "providerCalled"
    | "sent"
    | "persistenceAllowedNow"
    | "pollingAllowed"
    | "runtimeActivationAllowed"
    | "providerActivationAllowed"
    | "approvalGrantsExecution"
    | "uiImplementationAllowedNow"
  >,
): R60FinalLockdownInvariantCheck {
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

export function summarizeR60AcquisitionDailyCallPriorityFinalDashboardLockdown(result: R60FinalLockdownResult) {
  const invariantCheck = assertR60AcquisitionDailyCallPriorityFinalLockdownInvariants(result);

  return boundSummary(
    `R60F ${result.surface} status is ${result.lockdownStatus}. ` +
      `R60 stack findings: ${result.r60StackReviewFindings.length}. ` +
      `uiImplementationAllowedNow is ${result.uiImplementationAllowedNow}. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This lockdown allows only the completed read-only dashboard UI and cannot authorize redesign, new UI features, routes, providers, Twilio, automation-agent usage, Prisma changes, calls, dialing, SMS, email, campaigns, persistence, polling, execution controls, approval execution, autonomous outreach, negotiation, or runtime activation.",
  );
}

export function createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract(
  input: R60FinalLockdownInput = {},
): R60FinalLockdownResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const lockdownNotes = collectNotes(input.extraLockdownNotes);

  addWarning(warningCodes, "r60f_final_dashboard_lockdown_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r60aScopeReviewed !== true) addWarning(warningCodes, "r60a_scope_review_required");
  if (input.r60bUiScopeReviewed !== true) addWarning(warningCodes, "r60b_ui_scope_review_required");
  if (input.r60cImplementationScopeReviewed !== true) {
    addWarning(warningCodes, "r60c_implementation_scope_review_required");
  }
  if (input.r60dUiImplementationReviewed !== true) addWarning(warningCodes, "r60d_ui_implementation_review_required");
  if (input.r60eSafetyAccessibilityReviewed !== true) {
    addWarning(warningCodes, "r60e_safety_accessibility_review_required");
  }
  if (input.dashboardSafetyReviewed !== true) addWarning(warningCodes, "dashboard_safety_review_required");
  if (input.readOnlyReviewed !== true) addWarning(warningCodes, "read_only_review_required");
  if (input.governanceStopDominanceReviewed !== true) {
    addWarning(warningCodes, "governance_stop_dominance_review_required");
  }
  if (input.forbiddenControlsReviewed !== true) addWarning(warningCodes, "forbidden_control_review_required");
  if (input.executionBoundariesReviewed !== true) addWarning(warningCodes, "execution_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.newUiFeatureRequested === true) addWarning(warningCodes, "new_ui_feature_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.callExecutionRequested === true) addWarning(warningCodes, "call_execution_rejected");
  if (input.dialerActivationRequested === true) addWarning(warningCodes, "dialer_activation_rejected");
  if (input.campaignActivationRequested === true) addWarning(warningCodes, "campaign_activation_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.redesignRequested === true) addWarning(warningCodes, "redesign_rejected");
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
  if (input.uiImplementationAllowedNow === false) addWarning(warningCodes, "ui_implementation_allowed_now_required");

  for (const warningCode of warningCodes) {
    if (
      warningCode.endsWith("_rejected") ||
      warningCode.endsWith("_must_be_false") ||
      warningCode.endsWith("_not_allowed_now") ||
      warningCode === "ui_implementation_allowed_now_required"
    ) {
      addUnique(rejectionReasons, warningCode);
    }
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingRequiredReview =
    input.r60aScopeReviewed !== true ||
    input.r60bUiScopeReviewed !== true ||
    input.r60cImplementationScopeReviewed !== true ||
    input.r60dUiImplementationReviewed !== true ||
    input.r60eSafetyAccessibilityReviewed !== true ||
    input.dashboardSafetyReviewed !== true ||
    input.readOnlyReviewed !== true ||
    input.governanceStopDominanceReviewed !== true ||
    input.forbiddenControlsReviewed !== true ||
    input.executionBoundariesReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const lockdownStatus: R60FinalDashboardLockdownStatus = hasForbiddenRequest(input)
    ? "final_lockdown_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "acquisition_daily_call_priority_dashboard_locked";
  const result: R60FinalLockdownResult = {
    phase: "R60F",
    surface: "acquisition_daily_call_priority_final_dashboard_lockdown",
    lockdownStatus,
    r60StackReviewFindings,
    readOnlyEnforcementFindings,
    governanceStopDominanceFindings,
    forbiddenControlFindings,
    accessibilityPreservationFindings,
    executionBoundaryFindings,
    futureSafeUiLimitations,
    blockedPatterns,
    invariantAssertions,
    allowedFinalState,
    forbiddenBoundaries,
    safetyFlags,
    warningCodes,
    rejectionReasons,
    operatorReviewRequired,
    lockdownNotes,
    nextSuggestedPhase: "R61A - Buyer-Ready Disposition Priority Intelligence Scope Contract",
    summary: "R60F acquisition daily call priority final dashboard lockdown contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR60AcquisitionDailyCallPriorityFinalDashboardLockdown(result) };
}
