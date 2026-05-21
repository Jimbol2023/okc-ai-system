import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR51KeyboardNavigationFocusVisibilityInvariants,
  createR51KeyboardNavigationFocusVisibilityGovernance,
  type R51KeyboardNavigationFocusVisibilityGovernanceInput,
  type R51KeyboardNavigationFocusVisibilityGovernanceResult,
} from "./r51-keyboard-navigation-focus-visibility-governance-contract";

const completeInput: R51KeyboardNavigationFocusVisibilityGovernanceInput = {
  keyboardOnlyNavigationPlanned: true,
  tabOrderGovernancePlanned: true,
  focusVisibilityRequirementsPlanned: true,
  focusTrapPreventionPlanned: true,
  skipLinkPlanningCompleted: true,
  modalKeyboardAccessPlanned: true,
  dropdownKeyboardAccessPlanned: true,
  dialogKeyboardAccessPlanned: true,
  tableCardKeyboardAccessPlanned: true,
  dashboardControlKeyboardAccessPlanned: true,
  noMouseOnlyWorkflowPlanned: true,
  reducedMotionSafeFocusBehaviorPlanned: true,
  keyboardAccessibilityTestingPlanned: true,
  mouseOnlyWorkflowApproved: false,
  hiddenFocusStateApproved: false,
  unsafeTabOrderApproved: false,
  inaccessibleModalDialogApproved: false,
  inaccessibleDashboardInteractionApproved: false,
  inaccessibleKeyboardWorkflowApproved: false,
  runtimeAccessibilityMutationAttempted: false,
  uiRewriteRequested: false,
  advisoryOnly: true,
  simulationOnly: true,
  accessibilityGovernanceOnly: true,
  reviewNotes: ["R51B planning scope only."],
  operatorRecommendations: [],
  accessibilityReviewActions: [],
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  liveTestReady: false,
  persistenceAllowedNow: false,
};

function assertNoExecution(result: R51KeyboardNavigationFocusVisibilityGovernanceResult) {
  const invariantCheck = assertR51KeyboardNavigationFocusVisibilityInvariants(result);

  assert.equal(result.activationExecuted, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.sent, false);
  assert.equal(result.providerCalled, false);
  assert.equal(result.canSendNow, false);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.liveTestReady, false);
  assert.equal(result.persistenceAllowedNow, false);
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.accessibilityGovernanceOnly, true);
  assert.equal(result.runtimeMutationAllowed, false);
  assert.equal(result.uiRewriteAllowed, false);
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

describe("R51 keyboard navigation and focus visibility governance contract", () => {
  it("missing default input fails closed", () => {
    const result = createR51KeyboardNavigationFocusVisibilityGovernance();

    assert.equal(result.keyboardFocusGovernanceStatus, "keyboard_focus_scope_blocked");
    assert.equal(result.keyboardOnlyNavigationStatus, "missing");
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("keyboard_only_navigation_required"));
    assert.ok(result.warningCodes.includes("focus_visibility_required"));
    assertNoExecution(result);
  });

  it("complete keyboard and focus governance can become planned", () => {
    const result = createR51KeyboardNavigationFocusVisibilityGovernance(completeInput);

    assert.equal(result.keyboardFocusGovernanceStatus, "keyboard_focus_governance_planned");
    assert.equal(result.keyboardOnlyNavigationStatus, "planned");
    assert.equal(result.tabOrderGovernanceStatus, "planned");
    assert.equal(result.focusVisibilityStatus, "planned");
    assert.equal(result.keyboardTestingStatus, "planned");
    assertNoExecution(result);
  });

  it("missing core keyboard focus and tab-order planning requires review", () => {
    const result = createR51KeyboardNavigationFocusVisibilityGovernance({
      ...completeInput,
      keyboardOnlyNavigationPlanned: false,
      tabOrderGovernancePlanned: false,
      focusVisibilityRequirementsPlanned: false,
      focusTrapPreventionPlanned: false,
    });

    assert.equal(result.keyboardFocusGovernanceStatus, "keyboard_focus_review_required");
    assert.ok(result.warningCodes.includes("keyboard_only_navigation_required"));
    assert.ok(result.warningCodes.includes("tab_order_governance_required"));
    assert.ok(result.warningCodes.includes("focus_visibility_required"));
    assert.ok(result.warningCodes.includes("focus_trap_prevention_required"));
    assertNoExecution(result);
  });

  it("missing skip links modals dropdowns dialogs tables cards and dashboard controls requires review", () => {
    const result = createR51KeyboardNavigationFocusVisibilityGovernance({
      ...completeInput,
      skipLinkPlanningCompleted: false,
      modalKeyboardAccessPlanned: false,
      dropdownKeyboardAccessPlanned: false,
      dialogKeyboardAccessPlanned: false,
      tableCardKeyboardAccessPlanned: false,
      dashboardControlKeyboardAccessPlanned: false,
    });

    assert.equal(result.keyboardFocusGovernanceStatus, "keyboard_focus_review_required");
    assert.ok(result.warningCodes.includes("skip_link_planning_required"));
    assert.ok(result.warningCodes.includes("modal_keyboard_access_required"));
    assert.ok(result.warningCodes.includes("dropdown_keyboard_access_required"));
    assert.ok(result.warningCodes.includes("dialog_keyboard_access_required"));
    assert.ok(result.warningCodes.includes("table_card_keyboard_access_required"));
    assert.ok(result.warningCodes.includes("dashboard_control_keyboard_access_required"));
    assertNoExecution(result);
  });

  it("missing no-mouse reduced-motion focus and keyboard testing planning requires review", () => {
    const result = createR51KeyboardNavigationFocusVisibilityGovernance({
      ...completeInput,
      noMouseOnlyWorkflowPlanned: false,
      reducedMotionSafeFocusBehaviorPlanned: false,
      keyboardAccessibilityTestingPlanned: false,
    });

    assert.equal(result.keyboardFocusGovernanceStatus, "keyboard_focus_review_required");
    assert.ok(result.warningCodes.includes("no_mouse_only_workflow_required"));
    assert.ok(result.warningCodes.includes("reduced_motion_focus_behavior_required"));
    assert.ok(result.warningCodes.includes("keyboard_testing_required"));
    assertNoExecution(result);
  });

  it("unsafe keyboard and focus approvals are prohibited", () => {
    const result = createR51KeyboardNavigationFocusVisibilityGovernance({
      ...completeInput,
      mouseOnlyWorkflowApproved: true,
      hiddenFocusStateApproved: true,
      unsafeTabOrderApproved: true,
      inaccessibleModalDialogApproved: true,
      inaccessibleDashboardInteractionApproved: true,
      inaccessibleKeyboardWorkflowApproved: true,
    });

    assert.equal(result.keyboardFocusGovernanceStatus, "keyboard_focus_scope_blocked");
    assert.ok(result.warningCodes.includes("mouse_only_workflow_rejected"));
    assert.ok(result.warningCodes.includes("hidden_focus_state_rejected"));
    assert.ok(result.warningCodes.includes("unsafe_tab_order_rejected"));
    assert.ok(result.warningCodes.includes("inaccessible_modal_dialog_rejected"));
    assert.ok(result.warningCodes.includes("inaccessible_dashboard_interaction_rejected"));
    assert.ok(result.warningCodes.includes("inaccessible_keyboard_workflow_rejected"));
    assertNoExecution(result);
  });

  it("runtime accessibility mutation and UI rewrite attempts are prohibited", () => {
    const result = createR51KeyboardNavigationFocusVisibilityGovernance({
      ...completeInput,
      runtimeAccessibilityMutationAttempted: true,
      uiRewriteRequested: true,
    });

    assert.equal(result.keyboardFocusGovernanceStatus, "keyboard_focus_scope_blocked");
    assert.ok(result.warningCodes.includes("runtime_accessibility_mutation_rejected"));
    assert.ok(result.warningCodes.includes("ui_rewrite_not_allowed"));
    assertNoExecution(result);
  });

  it("advisory simulation and governance-only flags are forced safe", () => {
    const result = createR51KeyboardNavigationFocusVisibilityGovernance({
      ...completeInput,
      advisoryOnly: false,
      simulationOnly: false,
      accessibilityGovernanceOnly: false,
    });

    assert.equal(result.keyboardFocusGovernanceStatus, "keyboard_focus_scope_blocked");
    assert.equal(result.advisoryOnly, true);
    assert.equal(result.simulationOnly, true);
    assert.equal(result.accessibilityGovernanceOnly, true);
    assert.ok(result.warningCodes.includes("advisory_only_required"));
    assert.ok(result.warningCodes.includes("simulation_only_required"));
    assert.ok(result.warningCodes.includes("accessibility_governance_only_required"));
    assertNoExecution(result);
  });

  it("execution and persistence flags are rejected and never become true", () => {
    const result = createR51KeyboardNavigationFocusVisibilityGovernance({
      ...completeInput,
      activationExecuted: true,
      providerActivationAllowed: true,
      liveExecutionAllowed: true,
      sent: true,
      providerCalled: true,
      canSendNow: true,
      liveTestReady: true,
      persistenceAllowedNow: true,
    });

    assert.equal(result.keyboardFocusGovernanceStatus, "keyboard_focus_scope_blocked");
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
    assertNoExecution(result);
  });

  it("bounded notes recommendations and accessibility actions are enforced", () => {
    const manyValues = Array.from({ length: 90 }, (_, index) => `item_${index}_${"x".repeat(220)}`);
    const result = createR51KeyboardNavigationFocusVisibilityGovernance({
      ...completeInput,
      reviewNotes: manyValues,
      operatorRecommendations: manyValues,
      accessibilityReviewActions: manyValues,
    });

    assert.equal(result.reviewNotes.length, 40);
    assert.equal(result.operatorRecommendations.length, 40);
    assert.equal(result.accessibilityReviewActions.length, 40);
    assert.ok(result.reviewNotes.every((value) => value.length <= 183));
    assert.ok(result.operatorRecommendations.every((value) => value.length <= 183));
    assert.ok(result.accessibilityReviewActions.every((value) => value.length <= 183));
    assertNoExecution(result);
  });

  it("hard invariants are preserved in every result", () => {
    const results = [
      createR51KeyboardNavigationFocusVisibilityGovernance(),
      createR51KeyboardNavigationFocusVisibilityGovernance(completeInput),
      createR51KeyboardNavigationFocusVisibilityGovernance({
        ...completeInput,
        activationExecuted: true,
        providerActivationAllowed: true,
        liveExecutionAllowed: true,
        sent: true,
        providerCalled: true,
        canSendNow: true,
        advisoryOnly: false,
        simulationOnly: false,
        accessibilityGovernanceOnly: false,
        liveTestReady: true,
        persistenceAllowedNow: true,
      }),
    ];

    for (const result of results) {
      assertNoExecution(result);
    }
  });
});
