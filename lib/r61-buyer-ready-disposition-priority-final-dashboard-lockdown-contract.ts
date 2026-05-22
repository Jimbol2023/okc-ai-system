export type R61FinalDashboardLockdownStatus =
  | "final_lockdown_blocked"
  | "operator_review_required"
  | "buyer_ready_disposition_priority_dashboard_locked";

export type R61FinalBlockedPattern =
  | "send to buyers"
  | "blast buyers"
  | "auto email buyers"
  | "auto SMS buyers"
  | "launch buyer campaign"
  | "activate buyer outreach"
  | "queue buyer execution"
  | "match and send automatically"
  | "approve and send"
  | "execute disposition workflow"
  | "release buyer automation"
  | "autonomous buyer negotiation"
  | "provider activation"
  | "hidden execution affordances";

export type R61FinalLockdownWarningCode =
  | "r61f_final_dashboard_lockdown_contract_only"
  | "input_missing"
  | "r61a_scope_review_required"
  | "r61b_ui_scope_review_required"
  | "r61c_implementation_scope_review_required"
  | "r61d_ui_implementation_review_required"
  | "r61e_safety_accessibility_review_required"
  | "dashboard_safety_review_required"
  | "read_only_review_required"
  | "buyer_ready_boundary_review_required"
  | "governance_stop_dominance_review_required"
  | "package_prep_review_required"
  | "buyer_fit_review_required"
  | "demand_alignment_review_required"
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

export type R61FinalLockdownInput = {
  r61aScopeReviewed?: boolean;
  r61bUiScopeReviewed?: boolean;
  r61cImplementationScopeReviewed?: boolean;
  r61dUiImplementationReviewed?: boolean;
  r61eSafetyAccessibilityReviewed?: boolean;
  dashboardSafetyReviewed?: boolean;
  readOnlyReviewed?: boolean;
  buyerReadyBoundaryReviewed?: boolean;
  governanceStopDominanceReviewed?: boolean;
  packagePrepReviewed?: boolean;
  buyerFitReviewed?: boolean;
  demandAlignmentReviewed?: boolean;
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

export type R61FinalLockdownSafetyFlags = {
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

export type R61FinalLockdownResult = R61FinalLockdownSafetyFlags & {
  phase: "R61F";
  surface: "buyer_ready_disposition_priority_final_dashboard_lockdown";
  lockdownStatus: R61FinalDashboardLockdownStatus;
  r61StackReviewFindings: string[];
  readOnlyEnforcementFindings: string[];
  buyerReadyBoundaryFindings: string[];
  governanceStopDominanceFindings: string[];
  packagePrepFindings: string[];
  buyerFitAndDemandAlignmentFindings: string[];
  forbiddenControlFindings: string[];
  accessibilityPreservationFindings: string[];
  executionBoundaryFindings: string[];
  futureSafeUiLimitations: string[];
  blockedPatterns: R61FinalBlockedPattern[];
  invariantAssertions: string[];
  allowedFinalState: string[];
  forbiddenBoundaries: string[];
  safetyFlags: R61FinalLockdownSafetyFlags;
  warningCodes: string[];
  rejectionReasons: string[];
  operatorReviewRequired: boolean;
  lockdownNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R61FinalLockdownInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R61FinalLockdownSafetyFlags = {
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

const r61StackReviewFindings = [
  "R61A scoped buyer-ready disposition priority intelligence as read-only, advisory-only, simulation-only, governance-first, and manual-first.",
  "R61B audited future dashboard visibility, safe wording, accessibility expectations, package-prep visibility, buyer-fit visibility, and forbidden buyer outreach semantics.",
  "R61C locked implementation scope to existing dashboard placement and the allowed buyer-ready disposition priority summary component.",
  "R61D implemented the read-only dashboard surface with existing dashboard leads and existing manual revenue metrics only.",
  "R61E reviewed safety, accessibility, dangerous wording, forbidden controls, and governance boundaries, then tightened defensive copy that displayed risky terms.",
];

const readOnlyEnforcementFindings = [
  "The R61D dashboard surface renders advisory labels, counts, package gap summaries, status text, and explanatory guidance only.",
  "The R61D component accepts already-loaded dashboard leads and existing manual revenue metrics.",
  "The R61D component adds no fetch, localStorage, sessionStorage, polling, timers, provider imports, route changes, or persistence.",
  "The R61D component exposes no buttons, links, forms, toggles, menus, handlers, or execution controls.",
  "uiImplementationAllowedNow is true only because the read-only dashboard UI now exists; this does not permit execution.",
];

const buyerReadyBoundaryFindings = [
  "Buyer-ready label is advisory only.",
  "Buyer-ready does not mean send.",
  "Buyer-ready means manual review and package preparation may be prioritized after governance review.",
  "Ready-to-package, high-probability buyer review, buyer-fit review, and demand alignment labels cannot grant permission to contact buyers or release packages.",
  "Approval and review states cannot become permission to send, blast, queue, execute, automate, negotiate, or activate providers.",
];

const governanceStopDominanceFindings = [
  "Governance stop signals render first in the R61D buyer-ready disposition priority section.",
  "Governance stop signals must be resolved first before buyer-ready, near-buyer-ready, package-prep, buyer-fit, demand alignment, bottleneck, or blocked disposition labels.",
  "Do-not-contact, rejected approval, and human-review states stay ahead of all buyer disposition priority guidance.",
  "No buyer-ready urgency, package completeness, buyer-fit, demand alignment, or high-probability label can override governance stop guidance.",
];

const packagePrepFindings = [
  "Package-prep priority is review-only operator guidance.",
  "Incomplete buyer package labels show assignment, title, photos, repair, ARV, rent, or strategy gaps as manual verification needs.",
  "Ready-to-package does not release a package, share a package, contact buyers, or create execution state.",
  "Missing package data visibility cannot invent property facts, activate enrichment, persist state, poll, or trigger providers.",
];

const buyerFitAndDemandAlignmentFindings = [
  "Buyer-fit review needed is a manual review label only.",
  "Buyer demand alignment review is advisory and depends on already-visible lead context.",
  "High-probability buyer review is a prioritization label, not a buyer contact instruction.",
  "Buyer-fit and demand alignment labels cannot become autonomous matching, autonomous negotiation, outreach, sending, package release, or approval execution.",
];

const forbiddenControlFindings = [
  "No send-to-buyers, blast-buyers, auto-email, auto-SMS, campaign-launch, buyer-outreach activation, queue-execution, match-and-send, approve-and-send, workflow-execution, release-automation, autonomous-negotiation, or provider-activation control is present.",
  "Forbidden phrases are allowed only as blocked-pattern definitions, rejection tests, or scope-contract boundaries.",
  "The R61D component contains no hidden execution affordance, background execution state, provider hook, autonomous matching path, or buyer outreach path.",
];

const accessibilityPreservationFindings = [
  "The R61D component uses a semantic section with aria-labelledby and aria-describedby.",
  "The heading id and summary id match the accessibility references.",
  "Each buyer disposition priority section has readable headings, counts, status text, and explanatory detail.",
  "Status and priority meaning are expressed in text and do not depend on color alone.",
  "No motion dependency, focus movement, auto-refresh, polling, or live-update behavior is introduced.",
];

const executionBoundaryFindings = [
  "No buyer outreach, seller outreach, SMS, email, campaigns, provider connectivity, Twilio access, or automation-agent behavior is enabled.",
  "No persistence, polling, runtime activation, execution controls, workflow mutation, hidden execution state, or approval-to-execution escalation is enabled.",
  "The R61D guidance remains manual-first and advisory-only.",
  "Operators may use visible buyer-ready disposition priority labels manually outside the app after normal governance and package review.",
];

const futureSafeUiLimitations = [
  "Future R61 UI changes must remain in existing dashboard placement unless a later phase explicitly authorizes a route.",
  "Future copy must keep buyer-ready labels advisory only, buyer-ready does not mean send, and governance stop signals first.",
  "Future controls must not send, blast, email, SMS, launch campaigns, activate buyer outreach, queue buyer execution, match-and-send, approve-and-send, execute workflows, release automation, activate providers, persist state, or poll.",
  "Future buyer disposition systems must remain controlled, non-autonomous, fail-closed, provider-blocked, and manual-first until a later controlled-execution phase explicitly changes the boundary.",
];

const blockedPatterns: R61FinalBlockedPattern[] = [
  "send to buyers",
  "blast buyers",
  "auto email buyers",
  "auto SMS buyers",
  "launch buyer campaign",
  "activate buyer outreach",
  "queue buyer execution",
  "match and send automatically",
  "approve and send",
  "execute disposition workflow",
  "release buyer automation",
  "autonomous buyer negotiation",
  "provider activation",
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
  "uiImplementationAllowedNow must remain true after R61D.",
  "Buyer-ready labels must remain advisory only.",
  "Buyer-ready does not mean send.",
  "Governance stop signals must dominate buyer-ready, package-prep, buyer-fit, demand alignment, bottleneck, and urgency labels.",
  "No execution affordances, provider connectivity, outbound communication controls, hidden execution state, autonomous matching, autonomous negotiation, or approval-to-execution escalation may appear.",
];

const allowedFinalState = [
  "R61 dashboard UI may remain visible as read-only buyer-ready disposition priority guidance.",
  "Existing dashboard-loaded leads and existing manual revenue metrics may feed derived labels and counts.",
  "Buyer-ready, package-prep, buyer-fit, demand alignment, high-probability, bottleneck, and blocked labels may guide human review only.",
  "The implemented UI is allowed now only as read-only, advisory-only, non-executing dashboard intelligence.",
];

const forbiddenBoundaries = [
  "No UI redesign or new UI features in R61F.",
  "No routes, providers, Twilio, automation-agent, Prisma, schema, migrations, persistence, polling, or runtime activation.",
  "No buyer outreach, outbound communication controls, campaign controls, execution controls, workflow mutation, or hidden execution state.",
  "No autonomous buyer matching, autonomous negotiation, approval-as-permission drift, package release, or provider activation.",
  "No property, package, title, repair, ARV, rent, strategy, buyer-fit, or demand facts may be invented and assumptions must remain clearly labeled.",
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

function addWarning(warningCodes: string[], warningCode: R61FinalLockdownWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R61FinalLockdownInput) {
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

export function assertR61BuyerReadyDispositionPriorityFinalLockdownInvariants(
  result: Pick<
    R61FinalLockdownResult,
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
): R61FinalLockdownInvariantCheck {
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

export function summarizeR61BuyerReadyDispositionPriorityFinalDashboardLockdown(
  result: R61FinalLockdownResult,
) {
  const invariantCheck = assertR61BuyerReadyDispositionPriorityFinalLockdownInvariants(result);

  return boundSummary(
    `R61F ${result.surface} status is ${result.lockdownStatus}. ` +
      `R61 stack findings: ${result.r61StackReviewFindings.length}. ` +
      `uiImplementationAllowedNow is ${result.uiImplementationAllowedNow}. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This lockdown allows only the completed read-only dashboard UI and cannot authorize redesign, new UI features, routes, providers, Twilio, automation-agent usage, Prisma changes, buyer outreach, email, SMS, campaigns, persistence, polling, execution controls, approval execution, autonomous matching, autonomous negotiation, provider activation, or runtime activation.",
  );
}

export function createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract(
  input: R61FinalLockdownInput = {},
): R61FinalLockdownResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const lockdownNotes = collectNotes(input.extraLockdownNotes);

  addWarning(warningCodes, "r61f_final_dashboard_lockdown_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r61aScopeReviewed !== true) addWarning(warningCodes, "r61a_scope_review_required");
  if (input.r61bUiScopeReviewed !== true) addWarning(warningCodes, "r61b_ui_scope_review_required");
  if (input.r61cImplementationScopeReviewed !== true) {
    addWarning(warningCodes, "r61c_implementation_scope_review_required");
  }
  if (input.r61dUiImplementationReviewed !== true) addWarning(warningCodes, "r61d_ui_implementation_review_required");
  if (input.r61eSafetyAccessibilityReviewed !== true) {
    addWarning(warningCodes, "r61e_safety_accessibility_review_required");
  }
  if (input.dashboardSafetyReviewed !== true) addWarning(warningCodes, "dashboard_safety_review_required");
  if (input.readOnlyReviewed !== true) addWarning(warningCodes, "read_only_review_required");
  if (input.buyerReadyBoundaryReviewed !== true) addWarning(warningCodes, "buyer_ready_boundary_review_required");
  if (input.governanceStopDominanceReviewed !== true) {
    addWarning(warningCodes, "governance_stop_dominance_review_required");
  }
  if (input.packagePrepReviewed !== true) addWarning(warningCodes, "package_prep_review_required");
  if (input.buyerFitReviewed !== true) addWarning(warningCodes, "buyer_fit_review_required");
  if (input.demandAlignmentReviewed !== true) addWarning(warningCodes, "demand_alignment_review_required");
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
  if (input.buyerOutreachExecutionRequested === true) {
    addWarning(warningCodes, "buyer_outreach_execution_rejected");
  }
  if (input.campaignActivationRequested === true) addWarning(warningCodes, "campaign_activation_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.redesignRequested === true) addWarning(warningCodes, "redesign_rejected");
  if (input.autonomousMatchingRequested === true) addWarning(warningCodes, "autonomous_matching_rejected");
  if (input.autonomousNegotiationRequested === true) addWarning(warningCodes, "autonomous_negotiation_rejected");
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
    input.r61aScopeReviewed !== true ||
    input.r61bUiScopeReviewed !== true ||
    input.r61cImplementationScopeReviewed !== true ||
    input.r61dUiImplementationReviewed !== true ||
    input.r61eSafetyAccessibilityReviewed !== true ||
    input.dashboardSafetyReviewed !== true ||
    input.readOnlyReviewed !== true ||
    input.buyerReadyBoundaryReviewed !== true ||
    input.governanceStopDominanceReviewed !== true ||
    input.packagePrepReviewed !== true ||
    input.buyerFitReviewed !== true ||
    input.demandAlignmentReviewed !== true ||
    input.forbiddenControlsReviewed !== true ||
    input.executionBoundariesReviewed !== true ||
    input.accessibilityReviewed !== true ||
    operatorReviewRequired;
  const lockdownStatus: R61FinalDashboardLockdownStatus = hasForbiddenRequest(input)
    ? "final_lockdown_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "buyer_ready_disposition_priority_dashboard_locked";
  const result: R61FinalLockdownResult = {
    phase: "R61F",
    surface: "buyer_ready_disposition_priority_final_dashboard_lockdown",
    lockdownStatus,
    r61StackReviewFindings,
    readOnlyEnforcementFindings,
    buyerReadyBoundaryFindings,
    governanceStopDominanceFindings,
    packagePrepFindings,
    buyerFitAndDemandAlignmentFindings,
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
    nextSuggestedPhase: "R62A - Buyer Disposition Operational Intelligence Scope Contract",
    summary: "R61F buyer-ready disposition priority final dashboard lockdown contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR61BuyerReadyDispositionPriorityFinalDashboardLockdown(result) };
}
