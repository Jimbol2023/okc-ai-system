import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR51AccessibilityGovernanceBaselineScopeInvariants,
  createR51AccessibilityGovernanceBaselineScope,
  type R51AccessibilityGovernanceBaselineScopeInput,
  type R51AccessibilityGovernanceBaselineScopeResult,
} from "./r51-accessibility-governance-baseline-scope-contract";

const completeInput: R51AccessibilityGovernanceBaselineScopeInput = {
  wcag22AADirectionAccepted: true,
  adaConsciousUsabilityPlanned: true,
  keyboardNavigationReadinessPlanned: true,
  visibleFocusStateRequirementsPlanned: true,
  screenReaderReadinessPlanned: true,
  semanticHTMLExpectationsPlanned: true,
  accessibleFormsErrorsLabelsPlanned: true,
  dashboardTableStatusBadgeAccessibilityPlanned: true,
  colorContrastReviewPlanned: true,
  reducedMotionSupportPlanned: true,
  nonColorOnlyIndicatorsPlanned: true,
  accessibilityTestingPlanStructured: true,
  advisoryOnly: true,
  planningOnly: true,
  uiRewriteRequested: false,
  runtimeChangeRequested: false,
  scopeNotes: ["R51A planning scope only."],
  requiredReviewActions: [],
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  liveTestReady: false,
};

function assertNoExecution(result: R51AccessibilityGovernanceBaselineScopeResult) {
  const invariantCheck = assertR51AccessibilityGovernanceBaselineScopeInvariants(result);

  assert.equal(result.activationExecuted, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.sent, false);
  assert.equal(result.providerCalled, false);
  assert.equal(result.canSendNow, false);
  assert.equal(result.liveTestReady, false);
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.uiRewriteAllowed, false);
  assert.equal(result.runtimeChangeAllowed, false);
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.reasonCodes, []);
}

describe("R51 accessibility governance baseline scope contract", () => {
  it("missing default input fails closed", () => {
    const result = createR51AccessibilityGovernanceBaselineScope();

    assert.equal(result.accessibilityGovernanceStatus, "accessibility_scope_blocked");
    assert.equal(result.conformanceTarget, "missing");
    assert.ok(result.reasonCodes.includes("input_missing"));
    assert.ok(result.reasonCodes.includes("wcag_2_2_aa_direction_required"));
    assert.ok(result.reasonCodes.includes("keyboard_navigation_required"));
    assertNoExecution(result);
  });

  it("complete accessibility baseline can become planned", () => {
    const result = createR51AccessibilityGovernanceBaselineScope(completeInput);

    assert.equal(result.accessibilityGovernanceStatus, "accessibility_baseline_planned");
    assert.equal(result.conformanceTarget, "wcag_2_2_aa_direction");
    assert.equal(result.keyboardNavigationStatus, "planned");
    assert.equal(result.visibleFocusStateStatus, "planned");
    assert.equal(result.screenReaderStatus, "planned");
    assert.equal(result.accessibilityTestingPlanStatus, "planned");
    assertNoExecution(result);
  });

  it("missing WCAG ADA keyboard focus and screen-reader scope requires review", () => {
    const result = createR51AccessibilityGovernanceBaselineScope({
      ...completeInput,
      wcag22AADirectionAccepted: false,
      adaConsciousUsabilityPlanned: false,
      keyboardNavigationReadinessPlanned: false,
      visibleFocusStateRequirementsPlanned: false,
      screenReaderReadinessPlanned: false,
    });

    assert.equal(result.accessibilityGovernanceStatus, "accessibility_review_required");
    assert.ok(result.reasonCodes.includes("wcag_2_2_aa_direction_required"));
    assert.ok(result.reasonCodes.includes("ada_conscious_usability_required"));
    assert.ok(result.reasonCodes.includes("keyboard_navigation_required"));
    assert.ok(result.reasonCodes.includes("visible_focus_states_required"));
    assert.ok(result.reasonCodes.includes("screen_reader_readiness_required"));
    assertNoExecution(result);
  });

  it("missing semantic HTML forms dashboard contrast motion and non-color planning requires review", () => {
    const result = createR51AccessibilityGovernanceBaselineScope({
      ...completeInput,
      semanticHTMLExpectationsPlanned: false,
      accessibleFormsErrorsLabelsPlanned: false,
      dashboardTableStatusBadgeAccessibilityPlanned: false,
      colorContrastReviewPlanned: false,
      reducedMotionSupportPlanned: false,
      nonColorOnlyIndicatorsPlanned: false,
    });

    assert.equal(result.accessibilityGovernanceStatus, "accessibility_review_required");
    assert.ok(result.reasonCodes.includes("semantic_html_required"));
    assert.ok(result.reasonCodes.includes("forms_errors_labels_required"));
    assert.ok(result.reasonCodes.includes("dashboard_table_status_badge_accessibility_required"));
    assert.ok(result.reasonCodes.includes("color_contrast_review_required"));
    assert.ok(result.reasonCodes.includes("reduced_motion_support_required"));
    assert.ok(result.reasonCodes.includes("non_color_indicator_required"));
    assertNoExecution(result);
  });

  it("missing accessibility testing plan requires review", () => {
    const result = createR51AccessibilityGovernanceBaselineScope({
      ...completeInput,
      accessibilityTestingPlanStructured: false,
    });

    assert.equal(result.accessibilityGovernanceStatus, "accessibility_review_required");
    assert.equal(result.accessibilityTestingPlanStatus, "missing");
    assert.ok(result.reasonCodes.includes("accessibility_testing_plan_required"));
    assertNoExecution(result);
  });

  it("UI rewrite and runtime change requests are prohibited", () => {
    const result = createR51AccessibilityGovernanceBaselineScope({
      ...completeInput,
      uiRewriteRequested: true,
      runtimeChangeRequested: true,
    });

    assert.equal(result.accessibilityGovernanceStatus, "accessibility_scope_blocked");
    assert.ok(result.reasonCodes.includes("ui_rewrite_not_allowed"));
    assert.ok(result.reasonCodes.includes("runtime_change_not_allowed"));
    assertNoExecution(result);
  });

  it("advisory-only and planning-only flags are forced safe", () => {
    const result = createR51AccessibilityGovernanceBaselineScope({
      ...completeInput,
      advisoryOnly: false,
      planningOnly: false,
    });

    assert.equal(result.accessibilityGovernanceStatus, "accessibility_scope_blocked");
    assert.equal(result.advisoryOnly, true);
    assert.equal(result.planningOnly, true);
    assert.ok(result.reasonCodes.includes("advisory_only_required"));
    assert.ok(result.reasonCodes.includes("planning_only_required"));
    assertNoExecution(result);
  });

  it("execution enabling flags are rejected and never become true", () => {
    const result = createR51AccessibilityGovernanceBaselineScope({
      ...completeInput,
      activationExecuted: true,
      providerActivationAllowed: true,
      liveExecutionAllowed: true,
      sent: true,
      providerCalled: true,
      canSendNow: true,
      liveTestReady: true,
    });

    assert.equal(result.accessibilityGovernanceStatus, "accessibility_scope_blocked");
    assert.ok(result.reasonCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.reasonCodes.includes("can_send_now_must_be_false"));
    assertNoExecution(result);
  });

  it("bounded notes and review actions are enforced", () => {
    const manyValues = Array.from({ length: 90 }, (_, index) => `item_${index}_${"x".repeat(220)}`);
    const result = createR51AccessibilityGovernanceBaselineScope({
      ...completeInput,
      scopeNotes: manyValues,
      requiredReviewActions: manyValues,
    });

    assert.equal(result.scopeNotes.length, 40);
    assert.equal(result.requiredReviewActions.length, 40);
    assert.ok(result.scopeNotes.every((value) => value.length <= 183));
    assert.ok(result.requiredReviewActions.every((value) => value.length <= 183));
    assertNoExecution(result);
  });

  it("hard invariants are preserved in every result", () => {
    const results = [
      createR51AccessibilityGovernanceBaselineScope(),
      createR51AccessibilityGovernanceBaselineScope(completeInput),
      createR51AccessibilityGovernanceBaselineScope({
        ...completeInput,
        activationExecuted: true,
        providerActivationAllowed: true,
        liveExecutionAllowed: true,
        sent: true,
        providerCalled: true,
        canSendNow: true,
        liveTestReady: true,
        advisoryOnly: false,
        planningOnly: false,
      }),
    ];

    for (const result of results) {
      assertNoExecution(result);
    }
  });
});
