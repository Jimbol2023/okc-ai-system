export type R51AccessibilityGovernanceStatus =
  | "accessibility_scope_blocked"
  | "accessibility_review_required"
  | "accessibility_baseline_planned";

export type R51AccessibilityReadinessStatus = "missing" | "review_required" | "planned";

export type R51AccessibilityConformanceTarget = "wcag_2_2_aa_direction" | "missing";

export type R51AccessibilityGovernanceReasonCode =
  | "r51a_accessibility_governance_baseline_scope_contract_only"
  | "input_missing"
  | "wcag_2_2_aa_direction_required"
  | "ada_conscious_usability_required"
  | "keyboard_navigation_required"
  | "visible_focus_states_required"
  | "screen_reader_readiness_required"
  | "semantic_html_required"
  | "forms_errors_labels_required"
  | "dashboard_table_status_badge_accessibility_required"
  | "color_contrast_review_required"
  | "reduced_motion_support_required"
  | "non_color_indicator_required"
  | "accessibility_testing_plan_required"
  | "bounded_scope_required"
  | "advisory_only_required"
  | "planning_only_required"
  | "ui_rewrite_not_allowed"
  | "runtime_change_not_allowed"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "live_test_ready_must_be_false";

export type R51AccessibilityGovernanceBaselineScopeInput = {
  wcag22AADirectionAccepted?: boolean;
  adaConsciousUsabilityPlanned?: boolean;
  keyboardNavigationReadinessPlanned?: boolean;
  visibleFocusStateRequirementsPlanned?: boolean;
  screenReaderReadinessPlanned?: boolean;
  semanticHTMLExpectationsPlanned?: boolean;
  accessibleFormsErrorsLabelsPlanned?: boolean;
  dashboardTableStatusBadgeAccessibilityPlanned?: boolean;
  colorContrastReviewPlanned?: boolean;
  reducedMotionSupportPlanned?: boolean;
  nonColorOnlyIndicatorsPlanned?: boolean;
  accessibilityTestingPlanStructured?: boolean;
  advisoryOnly?: boolean;
  planningOnly?: boolean;
  uiRewriteRequested?: boolean;
  runtimeChangeRequested?: boolean;
  scopeNotes?: string[];
  requiredReviewActions?: string[];
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  liveTestReady?: boolean;
};

export type R51AccessibilityGovernanceBaselineScopeResult = {
  accessibilityGovernanceStatus: R51AccessibilityGovernanceStatus;
  conformanceTarget: R51AccessibilityConformanceTarget;
  wcag22AADirectionStatus: R51AccessibilityReadinessStatus;
  adaUsabilityStatus: R51AccessibilityReadinessStatus;
  keyboardNavigationStatus: R51AccessibilityReadinessStatus;
  visibleFocusStateStatus: R51AccessibilityReadinessStatus;
  screenReaderStatus: R51AccessibilityReadinessStatus;
  semanticHTMLStatus: R51AccessibilityReadinessStatus;
  formErrorLabelStatus: R51AccessibilityReadinessStatus;
  dashboardTableStatusBadgeStatus: R51AccessibilityReadinessStatus;
  colorContrastReviewStatus: R51AccessibilityReadinessStatus;
  reducedMotionStatus: R51AccessibilityReadinessStatus;
  nonColorIndicatorStatus: R51AccessibilityReadinessStatus;
  accessibilityTestingPlanStatus: R51AccessibilityReadinessStatus;
  advisoryOnly: true;
  planningOnly: true;
  uiRewriteAllowed: false;
  runtimeChangeAllowed: false;
  scopeNotes: string[];
  reasonCodes: string[];
  requiredReviewActions: string[];
  blockingFindings: string[];
  prohibitedFindings: string[];
  summary: string;
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  liveTestReady: false;
};

export type R51AccessibilityGovernanceInvariantCheck = {
  passed: boolean;
  reasonCodes: Array<
    | "activation_executed_must_be_false"
    | "provider_activation_allowed_must_be_false"
    | "live_execution_allowed_must_be_false"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
    | "live_test_ready_must_be_false"
    | "advisory_only_required"
    | "planning_only_required"
  >;
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 700;

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalizedValue = normalizeText(value);

  if (normalizedValue.length <= maxTextLength) return normalizedValue;

  return `${normalizedValue.slice(0, maxTextLength)}...`;
}

function boundSummary(value: string) {
  if (value.length <= maxSummaryLength) return value;

  return `${value.slice(0, maxSummaryLength)}...`;
}

function addUnique(list: string[], value: string) {
  const boundedValue = boundText(value);

  if (boundedValue && !list.includes(boundedValue) && list.length < maxListItems) {
    list.push(boundedValue);
  }
}

function addReason(reasonCodes: string[], reasonCode: R51AccessibilityGovernanceReasonCode) {
  addUnique(reasonCodes, reasonCode);
}

function collectText(values: string[] | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    addUnique(result, value);
  }

  return result;
}

function plannedStatus(isPlanned: boolean | undefined): R51AccessibilityReadinessStatus {
  return isPlanned === true ? "planned" : "missing";
}

function addMissingScopeFinding(
  isPlanned: boolean | undefined,
  reasonCode: R51AccessibilityGovernanceReasonCode,
  finding: string,
  reasonCodes: string[],
  blockingFindings: string[],
  requiredReviewActions: string[],
) {
  if (isPlanned === true) return;

  addReason(reasonCodes, reasonCode);
  addUnique(blockingFindings, finding);
  addUnique(requiredReviewActions, finding);
}

function hasExecutionIndicators(input: R51AccessibilityGovernanceBaselineScopeInput) {
  return (
    input.activationExecuted === true ||
    input.providerActivationAllowed === true ||
    input.liveExecutionAllowed === true ||
    input.sent === true ||
    input.providerCalled === true ||
    input.canSendNow === true ||
    input.liveTestReady === true
  );
}

export function assertR51AccessibilityGovernanceBaselineScopeInvariants(
  result: Pick<
    R51AccessibilityGovernanceBaselineScopeResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "liveTestReady"
    | "advisoryOnly"
    | "planningOnly"
  >,
): R51AccessibilityGovernanceInvariantCheck {
  const reasonCodes: R51AccessibilityGovernanceInvariantCheck["reasonCodes"] = [];

  if (result.activationExecuted !== false) reasonCodes.push("activation_executed_must_be_false");
  if (result.providerActivationAllowed !== false) reasonCodes.push("provider_activation_allowed_must_be_false");
  if (result.liveExecutionAllowed !== false) reasonCodes.push("live_execution_allowed_must_be_false");
  if (result.sent !== false) reasonCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) reasonCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) reasonCodes.push("can_send_now_must_be_false");
  if (result.liveTestReady !== false) reasonCodes.push("live_test_ready_must_be_false");
  if (result.advisoryOnly !== true) reasonCodes.push("advisory_only_required");
  if (result.planningOnly !== true) reasonCodes.push("planning_only_required");

  return {
    passed: reasonCodes.length === 0,
    reasonCodes,
  };
}

export function summarizeR51AccessibilityGovernanceBaselineScope(result: R51AccessibilityGovernanceBaselineScopeResult) {
  const invariantCheck = assertR51AccessibilityGovernanceBaselineScopeInvariants(result);

  return boundSummary(
    `R51A accessibility governance baseline scope is ${result.accessibilityGovernanceStatus}. ` +
      `Target is ${result.conformanceTarget}. Keyboard: ${result.keyboardNavigationStatus}; focus: ${result.visibleFocusStateStatus}; ` +
      `screen reader: ${result.screenReaderStatus}; semantic HTML: ${result.semanticHTMLStatus}; testing plan: ${result.accessibilityTestingPlanStatus}. ` +
      `${result.blockingFindings.length} blocking findings and ${result.prohibitedFindings.length} prohibited findings are present. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Contract is advisory-only and planning-only; it performs no UI rewrite, route change, DB work, provider call, network call, automation, or live execution.",
  );
}

export function createR51AccessibilityGovernanceBaselineScope(
  input: R51AccessibilityGovernanceBaselineScopeInput = {},
): R51AccessibilityGovernanceBaselineScopeResult {
  const reasonCodes: string[] = [];
  const scopeNotes = collectText(input.scopeNotes);
  const requiredReviewActions = collectText(input.requiredReviewActions);
  const blockingFindings: string[] = [];
  const prohibitedFindings: string[] = [];

  addReason(reasonCodes, "r51a_accessibility_governance_baseline_scope_contract_only");

  if (Object.keys(input).length === 0) {
    addReason(reasonCodes, "input_missing");
    addUnique(prohibitedFindings, "Accessibility governance baseline input is missing.");
  }

  addMissingScopeFinding(
    input.wcag22AADirectionAccepted,
    "wcag_2_2_aa_direction_required",
    "Define WCAG 2.2 AA direction for professional accessibility readiness.",
    reasonCodes,
    blockingFindings,
    requiredReviewActions,
  );
  addMissingScopeFinding(
    input.adaConsciousUsabilityPlanned,
    "ada_conscious_usability_required",
    "Define ADA-conscious usability expectations.",
    reasonCodes,
    blockingFindings,
    requiredReviewActions,
  );
  addMissingScopeFinding(
    input.keyboardNavigationReadinessPlanned,
    "keyboard_navigation_required",
    "Plan keyboard navigation readiness.",
    reasonCodes,
    blockingFindings,
    requiredReviewActions,
  );
  addMissingScopeFinding(
    input.visibleFocusStateRequirementsPlanned,
    "visible_focus_states_required",
    "Plan visible focus state requirements.",
    reasonCodes,
    blockingFindings,
    requiredReviewActions,
  );
  addMissingScopeFinding(
    input.screenReaderReadinessPlanned,
    "screen_reader_readiness_required",
    "Plan screen-reader readiness expectations.",
    reasonCodes,
    blockingFindings,
    requiredReviewActions,
  );
  addMissingScopeFinding(
    input.semanticHTMLExpectationsPlanned,
    "semantic_html_required",
    "Plan semantic HTML expectations.",
    reasonCodes,
    blockingFindings,
    requiredReviewActions,
  );
  addMissingScopeFinding(
    input.accessibleFormsErrorsLabelsPlanned,
    "forms_errors_labels_required",
    "Plan accessible form, error, and label standards.",
    reasonCodes,
    blockingFindings,
    requiredReviewActions,
  );
  addMissingScopeFinding(
    input.dashboardTableStatusBadgeAccessibilityPlanned,
    "dashboard_table_status_badge_accessibility_required",
    "Plan dashboard, table, and status badge accessibility expectations.",
    reasonCodes,
    blockingFindings,
    requiredReviewActions,
  );
  addMissingScopeFinding(
    input.colorContrastReviewPlanned,
    "color_contrast_review_required",
    "Plan color contrast review.",
    reasonCodes,
    blockingFindings,
    requiredReviewActions,
  );
  addMissingScopeFinding(
    input.reducedMotionSupportPlanned,
    "reduced_motion_support_required",
    "Plan reduced-motion support.",
    reasonCodes,
    blockingFindings,
    requiredReviewActions,
  );
  addMissingScopeFinding(
    input.nonColorOnlyIndicatorsPlanned,
    "non_color_indicator_required",
    "Plan non-color-only indicators.",
    reasonCodes,
    blockingFindings,
    requiredReviewActions,
  );
  addMissingScopeFinding(
    input.accessibilityTestingPlanStructured,
    "accessibility_testing_plan_required",
    "Define accessibility testing plan structure.",
    reasonCodes,
    blockingFindings,
    requiredReviewActions,
  );

  if (input.advisoryOnly !== true) {
    addReason(reasonCodes, "advisory_only_required");
    addUnique(prohibitedFindings, "Input is not explicitly advisory-only.");
  }
  if (input.planningOnly !== true) {
    addReason(reasonCodes, "planning_only_required");
    addUnique(prohibitedFindings, "Input is not explicitly planning-only.");
  }
  if (input.uiRewriteRequested === true) {
    addReason(reasonCodes, "ui_rewrite_not_allowed");
    addUnique(prohibitedFindings, "UI rewrite is not allowed in R51A baseline scope planning.");
  }
  if (input.runtimeChangeRequested === true) {
    addReason(reasonCodes, "runtime_change_not_allowed");
    addUnique(prohibitedFindings, "Runtime changes are not allowed in R51A baseline scope planning.");
  }
  if (hasExecutionIndicators(input)) {
    addUnique(prohibitedFindings, "Input contains execution, provider activation, live readiness, sending, or runtime indicators.");
  }
  if (input.activationExecuted === true) addReason(reasonCodes, "activation_executed_must_be_false");
  if (input.providerActivationAllowed === true) addReason(reasonCodes, "provider_activation_allowed_must_be_false");
  if (input.liveExecutionAllowed === true) addReason(reasonCodes, "live_execution_allowed_must_be_false");
  if (input.sent === true) addReason(reasonCodes, "sent_must_be_false");
  if (input.providerCalled === true) addReason(reasonCodes, "provider_called_must_be_false");
  if (input.canSendNow === true) addReason(reasonCodes, "can_send_now_must_be_false");
  if (input.liveTestReady === true) addReason(reasonCodes, "live_test_ready_must_be_false");

  if (reasonCodes.length >= maxListItems) {
    addReason(reasonCodes, "bounded_scope_required");
  }

  const accessibilityGovernanceStatus: R51AccessibilityGovernanceStatus =
    prohibitedFindings.length > 0
      ? "accessibility_scope_blocked"
      : blockingFindings.length > 0
        ? "accessibility_review_required"
        : "accessibility_baseline_planned";

  const result: R51AccessibilityGovernanceBaselineScopeResult = {
    accessibilityGovernanceStatus,
    conformanceTarget: input.wcag22AADirectionAccepted === true ? "wcag_2_2_aa_direction" : "missing",
    wcag22AADirectionStatus: plannedStatus(input.wcag22AADirectionAccepted),
    adaUsabilityStatus: plannedStatus(input.adaConsciousUsabilityPlanned),
    keyboardNavigationStatus: plannedStatus(input.keyboardNavigationReadinessPlanned),
    visibleFocusStateStatus: plannedStatus(input.visibleFocusStateRequirementsPlanned),
    screenReaderStatus: plannedStatus(input.screenReaderReadinessPlanned),
    semanticHTMLStatus: plannedStatus(input.semanticHTMLExpectationsPlanned),
    formErrorLabelStatus: plannedStatus(input.accessibleFormsErrorsLabelsPlanned),
    dashboardTableStatusBadgeStatus: plannedStatus(input.dashboardTableStatusBadgeAccessibilityPlanned),
    colorContrastReviewStatus: plannedStatus(input.colorContrastReviewPlanned),
    reducedMotionStatus: plannedStatus(input.reducedMotionSupportPlanned),
    nonColorIndicatorStatus: plannedStatus(input.nonColorOnlyIndicatorsPlanned),
    accessibilityTestingPlanStatus: plannedStatus(input.accessibilityTestingPlanStructured),
    advisoryOnly: true,
    planningOnly: true,
    uiRewriteAllowed: false,
    runtimeChangeAllowed: false,
    scopeNotes,
    reasonCodes,
    requiredReviewActions,
    blockingFindings,
    prohibitedFindings,
    summary: "R51A accessibility governance baseline scope contract only.",
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    liveTestReady: false,
  };

  return {
    ...result,
    summary: summarizeR51AccessibilityGovernanceBaselineScope(result),
  };
}
