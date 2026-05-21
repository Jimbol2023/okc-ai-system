export type R51KeyboardFocusGovernanceStatus =
  | "keyboard_focus_scope_blocked"
  | "keyboard_focus_review_required"
  | "keyboard_focus_governance_planned";

export type R51KeyboardFocusReadinessStatus = "missing" | "review_required" | "planned";

export type R51KeyboardFocusWarningCode =
  | "r51b_keyboard_focus_governance_contract_only"
  | "input_missing"
  | "keyboard_only_navigation_required"
  | "tab_order_governance_required"
  | "focus_visibility_required"
  | "focus_trap_prevention_required"
  | "skip_link_planning_required"
  | "modal_keyboard_access_required"
  | "dropdown_keyboard_access_required"
  | "dialog_keyboard_access_required"
  | "table_card_keyboard_access_required"
  | "dashboard_control_keyboard_access_required"
  | "no_mouse_only_workflow_required"
  | "reduced_motion_focus_behavior_required"
  | "keyboard_testing_required"
  | "mouse_only_workflow_rejected"
  | "hidden_focus_state_rejected"
  | "unsafe_tab_order_rejected"
  | "inaccessible_modal_dialog_rejected"
  | "inaccessible_dashboard_interaction_rejected"
  | "inaccessible_keyboard_workflow_rejected"
  | "runtime_accessibility_mutation_rejected"
  | "ui_rewrite_not_allowed"
  | "unbounded_accessibility_scope_rejected"
  | "advisory_only_required"
  | "accessibility_governance_only_required"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "persistence_not_allowed_now";

export type R51KeyboardNavigationFocusVisibilityGovernanceInput = {
  keyboardOnlyNavigationPlanned?: boolean;
  tabOrderGovernancePlanned?: boolean;
  focusVisibilityRequirementsPlanned?: boolean;
  focusTrapPreventionPlanned?: boolean;
  skipLinkPlanningCompleted?: boolean;
  modalKeyboardAccessPlanned?: boolean;
  dropdownKeyboardAccessPlanned?: boolean;
  dialogKeyboardAccessPlanned?: boolean;
  tableCardKeyboardAccessPlanned?: boolean;
  dashboardControlKeyboardAccessPlanned?: boolean;
  noMouseOnlyWorkflowPlanned?: boolean;
  reducedMotionSafeFocusBehaviorPlanned?: boolean;
  keyboardAccessibilityTestingPlanned?: boolean;
  mouseOnlyWorkflowApproved?: boolean;
  hiddenFocusStateApproved?: boolean;
  unsafeTabOrderApproved?: boolean;
  inaccessibleModalDialogApproved?: boolean;
  inaccessibleDashboardInteractionApproved?: boolean;
  inaccessibleKeyboardWorkflowApproved?: boolean;
  runtimeAccessibilityMutationAttempted?: boolean;
  uiRewriteRequested?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  accessibilityGovernanceOnly?: boolean;
  reviewNotes?: string[];
  operatorRecommendations?: string[];
  accessibilityReviewActions?: string[];
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  liveTestReady?: boolean;
  persistenceAllowedNow?: boolean;
};

export type R51KeyboardNavigationFocusVisibilityGovernanceResult = {
  keyboardFocusGovernanceStatus: R51KeyboardFocusGovernanceStatus;
  keyboardOnlyNavigationStatus: R51KeyboardFocusReadinessStatus;
  tabOrderGovernanceStatus: R51KeyboardFocusReadinessStatus;
  focusVisibilityStatus: R51KeyboardFocusReadinessStatus;
  focusTrapPreventionStatus: R51KeyboardFocusReadinessStatus;
  skipLinkPlanningStatus: R51KeyboardFocusReadinessStatus;
  modalKeyboardAccessStatus: R51KeyboardFocusReadinessStatus;
  dropdownKeyboardAccessStatus: R51KeyboardFocusReadinessStatus;
  dialogKeyboardAccessStatus: R51KeyboardFocusReadinessStatus;
  tableCardKeyboardAccessStatus: R51KeyboardFocusReadinessStatus;
  dashboardControlKeyboardAccessStatus: R51KeyboardFocusReadinessStatus;
  noMouseOnlyWorkflowStatus: R51KeyboardFocusReadinessStatus;
  reducedMotionFocusBehaviorStatus: R51KeyboardFocusReadinessStatus;
  keyboardTestingStatus: R51KeyboardFocusReadinessStatus;
  advisoryOnly: true;
  simulationOnly: true;
  accessibilityGovernanceOnly: true;
  runtimeMutationAllowed: false;
  uiRewriteAllowed: false;
  persistenceAllowedNow: false;
  warningCodes: string[];
  reviewNotes: string[];
  operatorRecommendations: string[];
  accessibilityReviewActions: string[];
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

export type R51KeyboardFocusInvariantCheck = {
  passed: boolean;
  warningCodes: Array<
    | "activation_executed_must_be_false"
    | "provider_activation_allowed_must_be_false"
    | "live_execution_allowed_must_be_false"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
    | "simulation_only_required"
    | "live_test_ready_must_be_false"
    | "persistence_not_allowed_now"
    | "advisory_only_required"
    | "accessibility_governance_only_required"
  >;
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 760;

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

function addWarning(warningCodes: string[], warningCode: R51KeyboardFocusWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectText(values: string[] | undefined) {
  const result: string[] = [];

  for (const value of values ?? []) {
    addUnique(result, value);
  }

  return result;
}

function plannedStatus(value: boolean | undefined): R51KeyboardFocusReadinessStatus {
  return value === true ? "planned" : "missing";
}

function addMissingPlanningFinding(
  planned: boolean | undefined,
  warningCode: R51KeyboardFocusWarningCode,
  finding: string,
  warningCodes: string[],
  blockingFindings: string[],
  accessibilityReviewActions: string[],
) {
  if (planned === true) return;

  addWarning(warningCodes, warningCode);
  addUnique(blockingFindings, finding);
  addUnique(accessibilityReviewActions, finding);
}

function hasExecutionIndicators(input: R51KeyboardNavigationFocusVisibilityGovernanceInput) {
  return (
    input.activationExecuted === true ||
    input.providerActivationAllowed === true ||
    input.liveExecutionAllowed === true ||
    input.sent === true ||
    input.providerCalled === true ||
    input.canSendNow === true ||
    input.liveTestReady === true ||
    input.persistenceAllowedNow === true
  );
}

export function assertR51KeyboardNavigationFocusVisibilityInvariants(
  result: Pick<
    R51KeyboardNavigationFocusVisibilityGovernanceResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
    | "persistenceAllowedNow"
    | "advisoryOnly"
    | "accessibilityGovernanceOnly"
  >,
): R51KeyboardFocusInvariantCheck {
  const warningCodes: R51KeyboardFocusInvariantCheck["warningCodes"] = [];

  if (result.activationExecuted !== false) warningCodes.push("activation_executed_must_be_false");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.liveExecutionAllowed !== false) warningCodes.push("live_execution_allowed_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) warningCodes.push("can_send_now_must_be_false");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.liveTestReady !== false) warningCodes.push("live_test_ready_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");
  if (result.advisoryOnly !== true) warningCodes.push("advisory_only_required");
  if (result.accessibilityGovernanceOnly !== true) warningCodes.push("accessibility_governance_only_required");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR51KeyboardNavigationFocusVisibilityGovernance(
  result: R51KeyboardNavigationFocusVisibilityGovernanceResult,
) {
  const invariantCheck = assertR51KeyboardNavigationFocusVisibilityInvariants(result);

  return boundSummary(
    `R51B keyboard navigation and focus visibility governance is ${result.keyboardFocusGovernanceStatus}. ` +
      `Keyboard-only navigation: ${result.keyboardOnlyNavigationStatus}; tab order: ${result.tabOrderGovernanceStatus}; ` +
      `focus visibility: ${result.focusVisibilityStatus}; skip links: ${result.skipLinkPlanningStatus}; testing: ${result.keyboardTestingStatus}. ` +
      `${result.blockingFindings.length} blocking findings and ${result.prohibitedFindings.length} prohibited findings are present. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "Contract is advisory-only, simulation-only, and accessibility-governance-only; it performs no UI rewrite, runtime mutation, provider activation, persistence, or live execution.",
  );
}

export function createR51KeyboardNavigationFocusVisibilityGovernance(
  input: R51KeyboardNavigationFocusVisibilityGovernanceInput = {},
): R51KeyboardNavigationFocusVisibilityGovernanceResult {
  const warningCodes: string[] = [];
  const reviewNotes = collectText(input.reviewNotes);
  const operatorRecommendations = collectText(input.operatorRecommendations);
  const accessibilityReviewActions = collectText(input.accessibilityReviewActions);
  const blockingFindings: string[] = [];
  const prohibitedFindings: string[] = [];

  addWarning(warningCodes, "r51b_keyboard_focus_governance_contract_only");
  addWarning(warningCodes, "persistence_not_allowed_now");

  if (Object.keys(input).length === 0) {
    addWarning(warningCodes, "input_missing");
    addUnique(prohibitedFindings, "Keyboard and focus governance input is missing.");
  }

  addMissingPlanningFinding(
    input.keyboardOnlyNavigationPlanned,
    "keyboard_only_navigation_required",
    "Plan keyboard-only navigation expectations.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );
  addMissingPlanningFinding(
    input.tabOrderGovernancePlanned,
    "tab_order_governance_required",
    "Plan logical tab-order governance.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );
  addMissingPlanningFinding(
    input.focusVisibilityRequirementsPlanned,
    "focus_visibility_required",
    "Plan visible focus state requirements.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );
  addMissingPlanningFinding(
    input.focusTrapPreventionPlanned,
    "focus_trap_prevention_required",
    "Plan focus trap prevention expectations.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );
  addMissingPlanningFinding(
    input.skipLinkPlanningCompleted,
    "skip_link_planning_required",
    "Plan skip-link behavior for repeated navigation.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );
  addMissingPlanningFinding(
    input.modalKeyboardAccessPlanned,
    "modal_keyboard_access_required",
    "Plan keyboard access for modals.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );
  addMissingPlanningFinding(
    input.dropdownKeyboardAccessPlanned,
    "dropdown_keyboard_access_required",
    "Plan keyboard access for dropdowns.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );
  addMissingPlanningFinding(
    input.dialogKeyboardAccessPlanned,
    "dialog_keyboard_access_required",
    "Plan keyboard access for dialogs.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );
  addMissingPlanningFinding(
    input.tableCardKeyboardAccessPlanned,
    "table_card_keyboard_access_required",
    "Plan keyboard access for tables and cards.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );
  addMissingPlanningFinding(
    input.dashboardControlKeyboardAccessPlanned,
    "dashboard_control_keyboard_access_required",
    "Plan keyboard access for dashboard controls.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );
  addMissingPlanningFinding(
    input.noMouseOnlyWorkflowPlanned,
    "no_mouse_only_workflow_required",
    "Plan rejection of mouse-only workflows.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );
  addMissingPlanningFinding(
    input.reducedMotionSafeFocusBehaviorPlanned,
    "reduced_motion_focus_behavior_required",
    "Plan reduced-motion-safe focus behavior.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );
  addMissingPlanningFinding(
    input.keyboardAccessibilityTestingPlanned,
    "keyboard_testing_required",
    "Plan keyboard accessibility testing expectations.",
    warningCodes,
    blockingFindings,
    accessibilityReviewActions,
  );

  if (input.mouseOnlyWorkflowApproved === true) {
    addWarning(warningCodes, "mouse_only_workflow_rejected");
    addUnique(prohibitedFindings, "Mouse-only workflow approval is rejected.");
  }
  if (input.hiddenFocusStateApproved === true) {
    addWarning(warningCodes, "hidden_focus_state_rejected");
    addUnique(prohibitedFindings, "Hidden focus-state approval is rejected.");
  }
  if (input.unsafeTabOrderApproved === true) {
    addWarning(warningCodes, "unsafe_tab_order_rejected");
    addUnique(prohibitedFindings, "Unsafe tab-order approval is rejected.");
  }
  if (input.inaccessibleModalDialogApproved === true) {
    addWarning(warningCodes, "inaccessible_modal_dialog_rejected");
    addUnique(prohibitedFindings, "Inaccessible modal or dialog approval is rejected.");
  }
  if (input.inaccessibleDashboardInteractionApproved === true) {
    addWarning(warningCodes, "inaccessible_dashboard_interaction_rejected");
    addUnique(prohibitedFindings, "Inaccessible dashboard interaction approval is rejected.");
  }
  if (input.inaccessibleKeyboardWorkflowApproved === true) {
    addWarning(warningCodes, "inaccessible_keyboard_workflow_rejected");
    addUnique(prohibitedFindings, "Inaccessible keyboard workflow approval is rejected.");
  }
  if (input.runtimeAccessibilityMutationAttempted === true) {
    addWarning(warningCodes, "runtime_accessibility_mutation_rejected");
    addUnique(prohibitedFindings, "Runtime accessibility mutation attempts are rejected in R51B.");
  }
  if (input.uiRewriteRequested === true) {
    addWarning(warningCodes, "ui_rewrite_not_allowed");
    addUnique(prohibitedFindings, "UI rewrite is not allowed in R51B planning.");
  }
  if (input.advisoryOnly !== true) {
    addWarning(warningCodes, "advisory_only_required");
    addUnique(prohibitedFindings, "Input is not explicitly advisory-only.");
  }
  if (input.simulationOnly !== true) {
    addWarning(warningCodes, "simulation_only_required");
    addUnique(prohibitedFindings, "Input is not explicitly simulation-only.");
  }
  if (input.accessibilityGovernanceOnly !== true) {
    addWarning(warningCodes, "accessibility_governance_only_required");
    addUnique(prohibitedFindings, "Input is not explicitly accessibility-governance-only.");
  }
  if (hasExecutionIndicators(input)) {
    addUnique(prohibitedFindings, "Input contains execution, provider activation, live readiness, sending, or persistence indicators.");
  }
  if (input.activationExecuted === true) addWarning(warningCodes, "activation_executed_must_be_false");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.liveExecutionAllowed === true) addWarning(warningCodes, "live_execution_allowed_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.canSendNow === true) addWarning(warningCodes, "can_send_now_must_be_false");
  if (input.liveTestReady === true) addWarning(warningCodes, "live_test_ready_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");

  if (warningCodes.length >= maxListItems) {
    addWarning(warningCodes, "unbounded_accessibility_scope_rejected");
  }

  const keyboardFocusGovernanceStatus: R51KeyboardFocusGovernanceStatus =
    prohibitedFindings.length > 0
      ? "keyboard_focus_scope_blocked"
      : blockingFindings.length > 0
        ? "keyboard_focus_review_required"
        : "keyboard_focus_governance_planned";

  const result: R51KeyboardNavigationFocusVisibilityGovernanceResult = {
    keyboardFocusGovernanceStatus,
    keyboardOnlyNavigationStatus: plannedStatus(input.keyboardOnlyNavigationPlanned),
    tabOrderGovernanceStatus: plannedStatus(input.tabOrderGovernancePlanned),
    focusVisibilityStatus: plannedStatus(input.focusVisibilityRequirementsPlanned),
    focusTrapPreventionStatus: plannedStatus(input.focusTrapPreventionPlanned),
    skipLinkPlanningStatus: plannedStatus(input.skipLinkPlanningCompleted),
    modalKeyboardAccessStatus: plannedStatus(input.modalKeyboardAccessPlanned),
    dropdownKeyboardAccessStatus: plannedStatus(input.dropdownKeyboardAccessPlanned),
    dialogKeyboardAccessStatus: plannedStatus(input.dialogKeyboardAccessPlanned),
    tableCardKeyboardAccessStatus: plannedStatus(input.tableCardKeyboardAccessPlanned),
    dashboardControlKeyboardAccessStatus: plannedStatus(input.dashboardControlKeyboardAccessPlanned),
    noMouseOnlyWorkflowStatus: plannedStatus(input.noMouseOnlyWorkflowPlanned),
    reducedMotionFocusBehaviorStatus: plannedStatus(input.reducedMotionSafeFocusBehaviorPlanned),
    keyboardTestingStatus: plannedStatus(input.keyboardAccessibilityTestingPlanned),
    advisoryOnly: true,
    simulationOnly: true,
    accessibilityGovernanceOnly: true,
    runtimeMutationAllowed: false,
    uiRewriteAllowed: false,
    persistenceAllowedNow: false,
    warningCodes,
    reviewNotes,
    operatorRecommendations,
    accessibilityReviewActions,
    blockingFindings,
    prohibitedFindings,
    summary: "R51B keyboard navigation and focus visibility governance contract only.",
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
    summary: summarizeR51KeyboardNavigationFocusVisibilityGovernance(result),
  };
}
