export type R62FinalDashboardLockdownStatus =
  | "final_lockdown_blocked"
  | "operator_review_required"
  | "buyer_disposition_operational_dashboard_locked";

export type R62FinalBlockedPattern =
  | "send to buyers"
  | "blast buyers"
  | "auto email buyers"
  | "auto SMS buyers"
  | "launch buyer campaign"
  | "activate buyer outreach"
  | "queue buyer execution"
  | "execute disposition workflow"
  | "match and send automatically"
  | "autonomous buyer matching"
  | "autonomous buyer negotiation"
  | "approve and send"
  | "release automation"
  | "provider activation"
  | "campaign launch"
  | "AI closes deals automatically"
  | "AI negotiates automatically"
  | "auto assignment workflow"
  | "buyer communication execution"
  | "hidden execution affordances";

export type R62FinalLockdownWarningCode =
  | "r62f_final_dashboard_lockdown_contract_only"
  | "input_missing"
  | "r62a_scope_review_required"
  | "r62b_ui_scope_review_required"
  | "r62c_implementation_scope_review_required"
  | "r62d_ui_implementation_review_required"
  | "r62e_safety_accessibility_review_required"
  | "dashboard_safety_review_required"
  | "read_only_review_required"
  | "operational_priority_boundary_review_required"
  | "governance_stop_dominance_review_required"
  | "stale_deal_package_review_required"
  | "assignment_readiness_review_required"
  | "buyer_engagement_demand_review_required"
  | "workload_priority_review_required"
  | "forbidden_control_review_required"
  | "execution_boundary_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "new_ui_feature_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "email_sms_sending_rejected"
  | "buyer_outreach_execution_rejected"
  | "campaign_activation_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
  | "redesign_rejected"
  | "autonomous_matching_rejected"
  | "autonomous_negotiation_rejected"
  | "auto_assignment_workflow_rejected"
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

export type R62FinalLockdownInput = {
  r62aScopeReviewed?: boolean;
  r62bUiScopeReviewed?: boolean;
  r62cImplementationScopeReviewed?: boolean;
  r62dUiImplementationReviewed?: boolean;
  r62eSafetyAccessibilityReviewed?: boolean;
  dashboardSafetyReviewed?: boolean;
  readOnlyReviewed?: boolean;
  operationalPriorityBoundaryReviewed?: boolean;
  governanceStopDominanceReviewed?: boolean;
  staleDealPackageReviewed?: boolean;
  assignmentReadinessReviewed?: boolean;
  buyerEngagementDemandReviewed?: boolean;
  workloadPriorityReviewed?: boolean;
  forbiddenControlsReviewed?: boolean;
  executionBoundariesReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  newUiFeatureRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  emailSmsSendingRequested?: boolean;
  buyerOutreachExecutionRequested?: boolean;
  campaignActivationRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  redesignRequested?: boolean;
  autonomousMatchingRequested?: boolean;
  autonomousNegotiationRequested?: boolean;
  autoAssignmentWorkflowRequested?: boolean;
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

export type R62FinalLockdownSafetyFlags = {
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

export type R62FinalLockdownResult = R62FinalLockdownSafetyFlags & {
  phase: "R62F";
  surface: "buyer_disposition_operational_intelligence_final_dashboard_lockdown";
  lockdownStatus: R62FinalDashboardLockdownStatus;
  r62StackReviewFindings: string[];
  readOnlyEnforcementFindings: string[];
  operationalPriorityBoundaryFindings: string[];
  governanceStopDominanceFindings: string[];
  staleDealPackageFindings: string[];
  assignmentReadinessFindings: string[];
  buyerEngagementDemandFindings: string[];
  workloadPriorityFindings: string[];
  forbiddenControlFindings: string[];
  accessibilityPreservationFindings: string[];
  executionBoundaryFindings: string[];
  futureSafeUiLimitations: string[];
  blockedPatterns: R62FinalBlockedPattern[];
  invariantAssertions: string[];
  allowedFinalState: string[];
  forbiddenBoundaries: string[];
  safetyFlags: R62FinalLockdownSafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  lockdownNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R62FinalLockdownInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R62FinalLockdownSafetyFlags = {
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

const r62StackReviewFindings = [
  "R62A scoped buyer disposition operational intelligence as governed, manual-first, read-only, advisory-only, and revenue-priority focused.",
  "R62B audited future UI boundaries for stale-deal visibility, assignment readiness, buyer engagement, demand mismatch, bottlenecks, workload priority, and accessibility.",
  "R62C locked read-only UI implementation scope to existing dashboard placement and the allowed buyer disposition operational intelligence summary component.",
  "R62D implemented the read-only dashboard surface with already-loaded dashboard leads and existing manual revenue metrics only.",
  "R62E reviewed safety, accessibility, dangerous wording, forbidden controls, governance boundaries, and found no UI fixes required.",
];

const readOnlyEnforcementFindings = [
  "The R62D dashboard surface renders advisory labels, counts, status text, and explanatory guidance only.",
  "The R62D component accepts already-loaded dashboard leads and existing manual revenue metrics.",
  "The R62D component adds no fetch, localStorage, sessionStorage, polling, timers, provider imports, route changes, or persistence.",
  "The R62D component exposes no buttons, links, forms, toggles, menus, handlers, or execution controls.",
  "uiImplementationAllowedNow is true only because the read-only dashboard UI now exists; this does not permit execution.",
];

const operationalPriorityBoundaryFindings = [
  "Disposition priority label is advisory only.",
  "Manual disposition review recommended means operator review may be prioritized, not executed.",
  "High assignment probability does not mean send.",
  "Buyer response probability, buyer engagement, demand mismatch, and buyer-fit labels cannot authorize contact.",
  "Approval and review states cannot become permission to send, blast, queue, execute, automate, negotiate, or activate providers.",
];

const governanceStopDominanceFindings = [
  "Governance stop signals render first in the R62D buyer disposition operational intelligence section.",
  "Governance stop signals must be resolved first before revenue priority, assignment readiness, buyer engagement, demand mismatch, stale-deal, workload, or bottleneck labels.",
  "Do-not-contact, rejected approval, and human-review states stay ahead of all buyer disposition operational guidance.",
  "No urgency, package completeness, buyer-fit, demand alignment, high-likelihood assignment, or workload label can override governance stop guidance.",
];

const staleDealPackageFindings = [
  "Stale buyer package and stale deal visibility are review-only operator guidance.",
  "Buyer package completeness review shows manual verification needs and cannot invent property facts.",
  "Package-prep priority does not release a package, share a package, contact buyers, or create execution state.",
  "Stale visibility cannot activate reactivation, persistence, polling, campaigns, providers, or buyer communication.",
];

const assignmentReadinessFindings = [
  "Assignment-readiness review needed is a manual review label only.",
  "High-likelihood assignment review remains advisory prioritization.",
  "Assignment-readiness momentum and assignment-risk review cannot become execution queues.",
  "High assignment probability does not mean send, negotiate, approve, or release automation.",
];

const buyerEngagementDemandFindings = [
  "Buyer engagement review needed is a manual review label only.",
  "Buyer response probability review is advisory visibility and does not authorize contact.",
  "Buyer demand mismatch is advisory visibility and does not perform autonomous matching.",
  "Buyer-fit, engagement, and demand labels cannot become autonomous matching, autonomous negotiation, outreach, sending, package release, or approval execution.",
];

const workloadPriorityFindings = [
  "Revenue-priority disposition review is advisory prioritization only.",
  "Disposition workload priority is not an execution queue.",
  "High-value disposition review remains manual operator prioritization.",
  "Operator disposition workflow guidance cannot assign work, mutate tasks, poll, persist, or execute.",
];

const forbiddenControlFindings = [
  "No send-to-buyers, blast-buyers, auto-email, auto-SMS, campaign-launch, buyer-outreach activation, queue-execution, disposition-workflow execution, match-and-send, approve-and-send, release-automation, autonomous matching, autonomous-negotiation, or provider-activation control is present in R62D.",
  "Forbidden phrases are allowed only as blocked-pattern definitions, rejection tests, or negative scope boundaries.",
  "The R62D component contains no hidden execution affordance, background execution state, provider hook, autonomous matching path, or buyer outreach path.",
];

const accessibilityPreservationFindings = [
  "The R62D component uses a semantic section with aria-labelledby and aria-describedby.",
  "The heading id and summary id match the accessibility references.",
  "Each buyer disposition operational section has readable headings, counts, status text, and explanatory detail.",
  "Status and priority meaning are expressed in text and do not depend on color alone.",
  "No motion dependency, focus movement, auto-refresh, polling, or live-update behavior is introduced.",
];

const executionBoundaryFindings = [
  "No buyer outreach, seller outreach, SMS, email, campaigns, provider connectivity, Twilio access, or automation-agent behavior is enabled.",
  "No persistence, polling, runtime activation, execution controls, workflow mutation, hidden execution state, or approval-to-execution escalation is enabled.",
  "R62 remains manual-first and advisory-only; it accelerates operator review without autonomous disposition.",
];

const futureSafeUiLimitations = [
  "Future changes must keep R62 inside existing dashboard placement unless a later phase explicitly authorizes another surface.",
  "Future R62 enhancements may add only read-only operational visibility unless explicitly scoped and reviewed.",
  "High assignment probability does not mean send.",
  "Disposition workload priority is not an execution queue.",
  "Any future buyer-facing execution must remain outside this lockdown and require a separate controlled-execution phase.",
  "Future UI must remain deterministic, accessible, non-autonomous, fail-closed, and manual-first.",
];

const blockedPatterns: R62FinalBlockedPattern[] = [
  "send to buyers",
  "blast buyers",
  "auto email buyers",
  "auto SMS buyers",
  "launch buyer campaign",
  "activate buyer outreach",
  "queue buyer execution",
  "execute disposition workflow",
  "match and send automatically",
  "autonomous buyer matching",
  "autonomous buyer negotiation",
  "approve and send",
  "release automation",
  "provider activation",
  "campaign launch",
  "AI closes deals automatically",
  "AI negotiates automatically",
  "auto assignment workflow",
  "buyer communication execution",
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
  "uiImplementationAllowedNow must remain true only because the read-only R62 dashboard surface exists.",
  "Governance stop signals must render first and outrank all operational priority labels.",
  "No hidden execution affordances are allowed.",
];

const allowedFinalState = [
  "Read-only buyer disposition operational dashboard summary.",
  "Advisory-only revenue-priority disposition review labels.",
  "Manual stale-deal, package-prep, assignment-readiness, buyer engagement, demand mismatch, bottleneck, and workload visibility.",
  "Governance-stop-first display ordering.",
  "Screen-reader-friendly summaries and text-based status meaning.",
];

const forbiddenBoundaries = [
  "No UI redesign or new UI features in R62F.",
  "No new routes, provider connectivity, Twilio, email, SMS, buyer outreach execution, buyer blasts, campaigns, automation-agent usage, Prisma/schema/migrations, persistence, polling, runtime activation, or execution controls.",
  "No autonomous buyer matching, autonomous negotiation, autonomous outreach, auto assignment workflow, approval-as-permission drift, or hidden execution state.",
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

function addWarning(warningCodes: string[], warningCode: R62FinalLockdownWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R62FinalLockdownInput) {
  return (
    input.newUiFeatureRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.emailSmsSendingRequested === true ||
    input.buyerOutreachExecutionRequested === true ||
    input.campaignActivationRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.redesignRequested === true ||
    input.autonomousMatchingRequested === true ||
    input.autonomousNegotiationRequested === true ||
    input.autoAssignmentWorkflowRequested === true ||
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

export function assertR62BuyerDispositionOperationalFinalLockdownInvariants(
  result: Pick<
    R62FinalLockdownResult,
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
): R62FinalLockdownInvariantCheck {
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

export function summarizeR62BuyerDispositionOperationalFinalDashboardLockdown(result: R62FinalLockdownResult) {
  const invariantCheck = assertR62BuyerDispositionOperationalFinalLockdownInvariants(result);

  return boundSummary(
    `R62F ${result.surface} status is ${result.lockdownStatus}. ` +
      `${result.r62StackReviewFindings.length} stack findings, ${result.blockedPatterns.length} blocked patterns, and ${result.invariantAssertions.length} invariants are locked. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "The final dashboard lockdown preserves governed, manual-first, read-only buyer disposition operational intelligence without buyer outreach execution, providers, campaigns, polling, persistence, runtime activation, autonomous matching, autonomous negotiation, or approval-to-execution escalation.",
  );
}

export function createR62BuyerDispositionOperationalFinalDashboardLockdownContract(
  input: R62FinalLockdownInput = {},
): R62FinalLockdownResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const lockdownNotes = collectNotes(input.extraLockdownNotes);

  addWarning(warningCodes, "r62f_final_dashboard_lockdown_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r62aScopeReviewed !== true) addWarning(warningCodes, "r62a_scope_review_required");
  if (input.r62bUiScopeReviewed !== true) addWarning(warningCodes, "r62b_ui_scope_review_required");
  if (input.r62cImplementationScopeReviewed !== true) {
    addWarning(warningCodes, "r62c_implementation_scope_review_required");
  }
  if (input.r62dUiImplementationReviewed !== true) addWarning(warningCodes, "r62d_ui_implementation_review_required");
  if (input.r62eSafetyAccessibilityReviewed !== true) {
    addWarning(warningCodes, "r62e_safety_accessibility_review_required");
  }
  if (input.dashboardSafetyReviewed !== true) addWarning(warningCodes, "dashboard_safety_review_required");
  if (input.readOnlyReviewed !== true) addWarning(warningCodes, "read_only_review_required");
  if (input.operationalPriorityBoundaryReviewed !== true) {
    addWarning(warningCodes, "operational_priority_boundary_review_required");
  }
  if (input.governanceStopDominanceReviewed !== true) {
    addWarning(warningCodes, "governance_stop_dominance_review_required");
  }
  if (input.staleDealPackageReviewed !== true) addWarning(warningCodes, "stale_deal_package_review_required");
  if (input.assignmentReadinessReviewed !== true) addWarning(warningCodes, "assignment_readiness_review_required");
  if (input.buyerEngagementDemandReviewed !== true) {
    addWarning(warningCodes, "buyer_engagement_demand_review_required");
  }
  if (input.workloadPriorityReviewed !== true) addWarning(warningCodes, "workload_priority_review_required");
  if (input.forbiddenControlsReviewed !== true) addWarning(warningCodes, "forbidden_control_review_required");
  if (input.executionBoundariesReviewed !== true) addWarning(warningCodes, "execution_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.newUiFeatureRequested === true) addWarning(warningCodes, "new_ui_feature_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.emailSmsSendingRequested === true) addWarning(warningCodes, "email_sms_sending_rejected");
  if (input.buyerOutreachExecutionRequested === true) addWarning(warningCodes, "buyer_outreach_execution_rejected");
  if (input.campaignActivationRequested === true) addWarning(warningCodes, "campaign_activation_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.redesignRequested === true) addWarning(warningCodes, "redesign_rejected");
  if (input.autonomousMatchingRequested === true) addWarning(warningCodes, "autonomous_matching_rejected");
  if (input.autonomousNegotiationRequested === true) addWarning(warningCodes, "autonomous_negotiation_rejected");
  if (input.autoAssignmentWorkflowRequested === true) addWarning(warningCodes, "auto_assignment_workflow_rejected");
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
      warningCode.endsWith("_not_allowed_now")
    ) {
      addUnique(rejectionReasons, warningCode);
    }
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingRequiredReview =
    input.r62aScopeReviewed !== true ||
    input.r62bUiScopeReviewed !== true ||
    input.r62cImplementationScopeReviewed !== true ||
    input.r62dUiImplementationReviewed !== true ||
    input.r62eSafetyAccessibilityReviewed !== true ||
    input.dashboardSafetyReviewed !== true ||
    input.readOnlyReviewed !== true ||
    input.operationalPriorityBoundaryReviewed !== true ||
    input.governanceStopDominanceReviewed !== true ||
    input.staleDealPackageReviewed !== true ||
    input.assignmentReadinessReviewed !== true ||
    input.buyerEngagementDemandReviewed !== true ||
    input.workloadPriorityReviewed !== true ||
    input.forbiddenControlsReviewed !== true ||
    input.executionBoundariesReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const lockdownStatus: R62FinalDashboardLockdownStatus = hasForbiddenRequest(input)
    ? "final_lockdown_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "buyer_disposition_operational_dashboard_locked";
  const result: R62FinalLockdownResult = {
    phase: "R62F",
    surface: "buyer_disposition_operational_intelligence_final_dashboard_lockdown",
    lockdownStatus,
    r62StackReviewFindings,
    readOnlyEnforcementFindings,
    operationalPriorityBoundaryFindings,
    governanceStopDominanceFindings,
    staleDealPackageFindings,
    assignmentReadinessFindings,
    buyerEngagementDemandFindings,
    workloadPriorityFindings,
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
    nextSuggestedPhase: "R63A - Operator Work Queue Intelligence Scope Contract",
    summary: "R62F buyer disposition operational intelligence final dashboard lockdown contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR62BuyerDispositionOperationalFinalDashboardLockdown(result) };
}
