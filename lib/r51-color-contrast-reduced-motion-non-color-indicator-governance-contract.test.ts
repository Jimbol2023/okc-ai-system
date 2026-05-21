import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR51ColorContrastReducedMotionNonColorIndicatorInvariants,
  createR51ColorContrastReducedMotionNonColorIndicatorGovernance,
  type R51ColorContrastReducedMotionNonColorIndicatorGovernanceInput,
  type R51ColorContrastReducedMotionNonColorIndicatorGovernanceResult,
} from "./r51-color-contrast-reduced-motion-non-color-indicator-governance-contract";

const completeInput: R51ColorContrastReducedMotionNonColorIndicatorGovernanceInput = {
  wcagContrastExpectationsPlanned: true,
  textBackgroundContrastPlanned: true,
  iconButtonContrastPlanned: true,
  focusRingContrastPlanned: true,
  badgeStatusContrastPlanned: true,
  darkLightModeContrastReadinessPlanned: true,
  reducedMotionSupportPlanned: true,
  animationMotionSafetyPlanned: true,
  nonColorOnlyIndicatorsPlanned: true,
  visualStateRedundancyPlanned: true,
  statusIconTextPatternPlanned: true,
  accessibilityVisualTestingPlanned: true,
  lowContrastApproved: false,
  colorOnlyStatusApproved: false,
  motionOnlyFeedbackApproved: false,
  unsafeAnimationApproved: false,
  missingReducedMotionApproved: false,
  invisibleLowContrastFocusApproved: false,
  inaccessibleDarkLightContrastApproved: false,
  runtimeAccessibilityMutationAttempted: false,
  uiRewriteRequested: false,
  themeMutationAttempted: false,
  advisoryOnly: true,
  simulationOnly: true,
  accessibilityGovernanceOnly: true,
  accessibilityReviewNotes: ["R51E planning scope only."],
  operatorRecommendations: [],
  visualRemediationRecommendations: [],
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

function assertNoExecution(result: R51ColorContrastReducedMotionNonColorIndicatorGovernanceResult) {
  const invariantCheck = assertR51ColorContrastReducedMotionNonColorIndicatorInvariants(result);

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
  assert.equal(result.themeMutationAllowed, false);
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

describe("R51 color contrast reduced motion non-color indicator governance contract", () => {
  it("missing default input fails closed", () => {
    const result = createR51ColorContrastReducedMotionNonColorIndicatorGovernance();

    assert.equal(result.visualAccessibilityGovernanceStatus, "visual_accessibility_scope_blocked");
    assert.equal(result.wcagContrastStatus, "missing");
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("wcag_contrast_expectations_required"));
    assert.ok(result.warningCodes.includes("reduced_motion_support_required"));
    assertNoExecution(result);
  });

  it("complete visual accessibility governance can become planned", () => {
    const result = createR51ColorContrastReducedMotionNonColorIndicatorGovernance(completeInput);

    assert.equal(result.visualAccessibilityGovernanceStatus, "visual_accessibility_governance_planned");
    assert.equal(result.wcagContrastStatus, "planned");
    assert.equal(result.textBackgroundContrastStatus, "planned");
    assert.equal(result.reducedMotionStatus, "planned");
    assert.equal(result.nonColorIndicatorStatus, "planned");
    assertNoExecution(result);
  });

  it("missing contrast focus dark light and badge planning requires review", () => {
    const result = createR51ColorContrastReducedMotionNonColorIndicatorGovernance({
      ...completeInput,
      wcagContrastExpectationsPlanned: false,
      textBackgroundContrastPlanned: false,
      iconButtonContrastPlanned: false,
      focusRingContrastPlanned: false,
      badgeStatusContrastPlanned: false,
      darkLightModeContrastReadinessPlanned: false,
    });

    assert.equal(result.visualAccessibilityGovernanceStatus, "visual_accessibility_review_required");
    assert.ok(result.warningCodes.includes("wcag_contrast_expectations_required"));
    assert.ok(result.warningCodes.includes("text_background_contrast_required"));
    assert.ok(result.warningCodes.includes("icon_button_contrast_required"));
    assert.ok(result.warningCodes.includes("focus_ring_contrast_required"));
    assert.ok(result.warningCodes.includes("badge_status_contrast_required"));
    assert.ok(result.warningCodes.includes("dark_light_mode_contrast_required"));
    assertNoExecution(result);
  });

  it("missing motion non-color redundancy status pattern and visual testing planning requires review", () => {
    const result = createR51ColorContrastReducedMotionNonColorIndicatorGovernance({
      ...completeInput,
      reducedMotionSupportPlanned: false,
      animationMotionSafetyPlanned: false,
      nonColorOnlyIndicatorsPlanned: false,
      visualStateRedundancyPlanned: false,
      statusIconTextPatternPlanned: false,
      accessibilityVisualTestingPlanned: false,
    });

    assert.equal(result.visualAccessibilityGovernanceStatus, "visual_accessibility_review_required");
    assert.ok(result.warningCodes.includes("reduced_motion_support_required"));
    assert.ok(result.warningCodes.includes("animation_motion_safety_required"));
    assert.ok(result.warningCodes.includes("non_color_indicator_required"));
    assert.ok(result.warningCodes.includes("visual_state_redundancy_required"));
    assert.ok(result.warningCodes.includes("status_icon_text_pattern_required"));
    assert.ok(result.warningCodes.includes("visual_testing_required"));
    assertNoExecution(result);
  });

  it("unsafe visual approvals are prohibited", () => {
    const result = createR51ColorContrastReducedMotionNonColorIndicatorGovernance({
      ...completeInput,
      lowContrastApproved: true,
      colorOnlyStatusApproved: true,
      motionOnlyFeedbackApproved: true,
      unsafeAnimationApproved: true,
      missingReducedMotionApproved: true,
      invisibleLowContrastFocusApproved: true,
      inaccessibleDarkLightContrastApproved: true,
    });

    assert.equal(result.visualAccessibilityGovernanceStatus, "visual_accessibility_scope_blocked");
    assert.ok(result.warningCodes.includes("low_contrast_rejected"));
    assert.ok(result.warningCodes.includes("color_only_status_rejected"));
    assert.ok(result.warningCodes.includes("motion_only_feedback_rejected"));
    assert.ok(result.warningCodes.includes("unsafe_animation_rejected"));
    assert.ok(result.warningCodes.includes("missing_reduced_motion_rejected"));
    assert.ok(result.warningCodes.includes("invisible_focus_rejected"));
    assert.ok(result.warningCodes.includes("dark_light_contrast_rejected"));
    assertNoExecution(result);
  });

  it("runtime accessibility mutation UI rewrite and theme mutation attempts are prohibited", () => {
    const result = createR51ColorContrastReducedMotionNonColorIndicatorGovernance({
      ...completeInput,
      runtimeAccessibilityMutationAttempted: true,
      uiRewriteRequested: true,
      themeMutationAttempted: true,
    });

    assert.equal(result.visualAccessibilityGovernanceStatus, "visual_accessibility_scope_blocked");
    assert.ok(result.warningCodes.includes("runtime_accessibility_mutation_rejected"));
    assert.ok(result.warningCodes.includes("ui_rewrite_not_allowed"));
    assert.ok(result.warningCodes.includes("theme_mutation_not_allowed"));
    assertNoExecution(result);
  });

  it("advisory simulation and governance-only flags are forced safe", () => {
    const result = createR51ColorContrastReducedMotionNonColorIndicatorGovernance({
      ...completeInput,
      advisoryOnly: false,
      simulationOnly: false,
      accessibilityGovernanceOnly: false,
    });

    assert.equal(result.visualAccessibilityGovernanceStatus, "visual_accessibility_scope_blocked");
    assert.equal(result.advisoryOnly, true);
    assert.equal(result.simulationOnly, true);
    assert.equal(result.accessibilityGovernanceOnly, true);
    assert.ok(result.warningCodes.includes("advisory_only_required"));
    assert.ok(result.warningCodes.includes("simulation_only_required"));
    assert.ok(result.warningCodes.includes("accessibility_governance_only_required"));
    assertNoExecution(result);
  });

  it("execution and persistence flags are rejected and never become true", () => {
    const result = createR51ColorContrastReducedMotionNonColorIndicatorGovernance({
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

    assert.equal(result.visualAccessibilityGovernanceStatus, "visual_accessibility_scope_blocked");
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("can_send_now_must_be_false"));
    assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
    assertNoExecution(result);
  });

  it("bounded notes recommendations remediation and review actions are enforced", () => {
    const manyValues = Array.from({ length: 90 }, (_, index) => `item_${index}_${"x".repeat(220)}`);
    const result = createR51ColorContrastReducedMotionNonColorIndicatorGovernance({
      ...completeInput,
      accessibilityReviewNotes: manyValues,
      operatorRecommendations: manyValues,
      visualRemediationRecommendations: manyValues,
      accessibilityReviewActions: manyValues,
    });

    assert.equal(result.accessibilityReviewNotes.length, 40);
    assert.equal(result.operatorRecommendations.length, 40);
    assert.equal(result.visualRemediationRecommendations.length, 40);
    assert.equal(result.accessibilityReviewActions.length, 40);
    assert.ok(result.accessibilityReviewNotes.every((value) => value.length <= 183));
    assert.ok(result.operatorRecommendations.every((value) => value.length <= 183));
    assert.ok(result.visualRemediationRecommendations.every((value) => value.length <= 183));
    assert.ok(result.accessibilityReviewActions.every((value) => value.length <= 183));
    assertNoExecution(result);
  });

  it("hard invariants are preserved in every result", () => {
    const results = [
      createR51ColorContrastReducedMotionNonColorIndicatorGovernance(),
      createR51ColorContrastReducedMotionNonColorIndicatorGovernance(completeInput),
      createR51ColorContrastReducedMotionNonColorIndicatorGovernance({
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
