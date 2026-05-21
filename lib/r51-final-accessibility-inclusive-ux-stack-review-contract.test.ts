import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR51FinalAccessibilityInclusiveUxStackInvariants,
  createR51FinalAccessibilityInclusiveUxStackReview,
  type R51FinalAccessibilityInclusiveUxStackReviewInput,
  type R51FinalAccessibilityInclusiveUxStackReviewResult,
} from "./r51-final-accessibility-inclusive-ux-stack-review-contract";

const completeInput: R51FinalAccessibilityInclusiveUxStackReviewInput = {
  baselineScopeStatus: "planned",
  keyboardFocusStatus: "planned",
  semanticAriaStatus: "planned",
  formsDashboardStatus: "planned",
  visualAccessibilityStatus: "planned",
  wcagDirectionConsistent: true,
  keyboardAccessibilityConsistent: true,
  semanticAccessibilityConsistent: true,
  screenReaderReadinessConsistent: true,
  formsTablesDashboardConsistent: true,
  contrastReducedMotionConsistent: true,
  nonColorIndicatorConsistent: true,
  boundedOutputsConfirmed: true,
  invariantsPreserved: true,
  runtimeMutationIntroduced: false,
  uiComponentMutationIntroduced: false,
  themeMutationIntroduced: false,
  accessibilityGovernanceWeakened: false,
  inaccessibleWorkflowApproved: false,
  colorOnlyCommunicationApproved: false,
  keyboardExpectationsWeakened: false,
  semanticAriaGovernanceWeakened: false,
  reducedMotionExpectationsWeakened: false,
  unboundedAccessibilityScopesPresent: false,
  advisoryOnly: true,
  simulationOnly: true,
  accessibilityGovernanceOnly: true,
  accessibilityImplementationAllowedNow: false,
  accessibilityReviewNotes: ["R51 planning stack reviewed."],
  operatorRecommendations: [],
  accessibilityRemediationRecommendations: [],
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  liveTestReady: false,
  persistenceAllowedNow: false,
};

function assertNoExecution(result: R51FinalAccessibilityInclusiveUxStackReviewResult) {
  const invariantCheck = assertR51FinalAccessibilityInclusiveUxStackInvariants(result);

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
  assert.equal(result.componentMutationAllowed, false);
  assert.equal(result.themeMutationAllowed, false);
  assert.equal(result.accessibilityImplementationAllowedNow, false);
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

describe("R51 final accessibility inclusive UX stack review contract", () => {
  it("missing default input fails closed", () => {
    const result = createR51FinalAccessibilityInclusiveUxStackReview();

    assert.equal(result.accessibilityStackReviewStatus, "accessibility_stack_blocked");
    assert.equal(result.consistencyStatus, "inconsistent");
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("baseline_scope_not_planned"));
    assert.ok(result.warningCodes.includes("wcag_direction_not_confirmed"));
    assertNoExecution(result);
  });

  it("complete R51 accessibility planning stack can close planning", () => {
    const result = createR51FinalAccessibilityInclusiveUxStackReview(completeInput);

    assert.equal(result.accessibilityStackReviewStatus, "r51_accessibility_planning_complete");
    assert.equal(result.consistencyStatus, "consistent");
    assert.equal(result.baselineScopeStatus, "planned");
    assert.equal(result.keyboardFocusStatus, "planned");
    assert.equal(result.semanticAriaStatus, "planned");
    assert.equal(result.formsDashboardStatus, "planned");
    assert.equal(result.visualAccessibilityStatus, "planned");
    assertNoExecution(result);
  });

  it("incomplete child layers produce stack incomplete", () => {
    const result = createR51FinalAccessibilityInclusiveUxStackReview({
      ...completeInput,
      keyboardFocusStatus: "review_required",
      visualAccessibilityStatus: "missing",
    });

    assert.equal(result.accessibilityStackReviewStatus, "accessibility_stack_incomplete");
    assert.equal(result.consistencyStatus, "needs_review");
    assert.ok(result.warningCodes.includes("keyboard_focus_not_planned"));
    assert.ok(result.warningCodes.includes("visual_accessibility_not_planned"));
    assertNoExecution(result);
  });

  it("missing consistency confirmations require review", () => {
    const result = createR51FinalAccessibilityInclusiveUxStackReview({
      ...completeInput,
      wcagDirectionConsistent: false,
      keyboardAccessibilityConsistent: false,
      semanticAccessibilityConsistent: false,
      screenReaderReadinessConsistent: false,
      formsTablesDashboardConsistent: false,
      contrastReducedMotionConsistent: false,
      nonColorIndicatorConsistent: false,
      boundedOutputsConfirmed: false,
      invariantsPreserved: false,
    });

    assert.equal(result.accessibilityStackReviewStatus, "accessibility_review_required");
    assert.equal(result.consistencyStatus, "needs_review");
    assert.ok(result.warningCodes.includes("wcag_direction_not_confirmed"));
    assert.ok(result.warningCodes.includes("keyboard_consistency_not_confirmed"));
    assert.ok(result.warningCodes.includes("bounded_output_consistency_not_confirmed"));
    assert.ok(result.warningCodes.includes("invariant_consistency_not_confirmed"));
    assertNoExecution(result);
  });

  it("runtime UI component theme and governance weakening signals block review", () => {
    const result = createR51FinalAccessibilityInclusiveUxStackReview({
      ...completeInput,
      runtimeMutationIntroduced: true,
      uiComponentMutationIntroduced: true,
      themeMutationIntroduced: true,
      accessibilityGovernanceWeakened: true,
    });

    assert.equal(result.accessibilityStackReviewStatus, "accessibility_stack_blocked");
    assert.equal(result.consistencyStatus, "inconsistent");
    assert.ok(result.warningCodes.includes("runtime_mutation_rejected"));
    assert.ok(result.warningCodes.includes("ui_component_mutation_rejected"));
    assert.ok(result.warningCodes.includes("theme_mutation_rejected"));
    assert.ok(result.warningCodes.includes("accessibility_governance_weakening_rejected"));
    assertNoExecution(result);
  });

  it("inaccessible workflow color-only keyboard semantic reduced-motion and unbounded signals block review", () => {
    const result = createR51FinalAccessibilityInclusiveUxStackReview({
      ...completeInput,
      inaccessibleWorkflowApproved: true,
      colorOnlyCommunicationApproved: true,
      keyboardExpectationsWeakened: true,
      semanticAriaGovernanceWeakened: true,
      reducedMotionExpectationsWeakened: true,
      unboundedAccessibilityScopesPresent: true,
    });

    assert.equal(result.accessibilityStackReviewStatus, "accessibility_stack_blocked");
    assert.ok(result.warningCodes.includes("inaccessible_workflow_approval_rejected"));
    assert.ok(result.warningCodes.includes("color_only_communication_rejected"));
    assert.ok(result.warningCodes.includes("keyboard_expectation_weakening_rejected"));
    assert.ok(result.warningCodes.includes("semantic_aria_weakening_rejected"));
    assert.ok(result.warningCodes.includes("reduced_motion_weakening_rejected"));
    assert.ok(result.warningCodes.includes("unbounded_accessibility_scope_rejected"));
    assertNoExecution(result);
  });

  it("implementation permission and execution flags are rejected and never become true", () => {
    const result = createR51FinalAccessibilityInclusiveUxStackReview({
      ...completeInput,
      accessibilityImplementationAllowedNow: true,
      activationExecuted: true,
      providerActivationAllowed: true,
      liveExecutionAllowed: true,
      sent: true,
      providerCalled: true,
      canSendNow: true,
      liveTestReady: true,
      persistenceAllowedNow: true,
    });

    assert.equal(result.accessibilityStackReviewStatus, "accessibility_stack_blocked");
    assert.ok(result.warningCodes.includes("accessibility_implementation_not_allowed_now"));
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("can_send_now_must_be_false"));
    assertNoExecution(result);
  });

  it("advisory simulation and governance-only flags are forced safe", () => {
    const result = createR51FinalAccessibilityInclusiveUxStackReview({
      ...completeInput,
      advisoryOnly: false,
      simulationOnly: false,
      accessibilityGovernanceOnly: false,
    });

    assert.equal(result.accessibilityStackReviewStatus, "accessibility_stack_blocked");
    assert.equal(result.advisoryOnly, true);
    assert.equal(result.simulationOnly, true);
    assert.equal(result.accessibilityGovernanceOnly, true);
    assert.ok(result.warningCodes.includes("advisory_only_required"));
    assert.ok(result.warningCodes.includes("simulation_only_required"));
    assert.ok(result.warningCodes.includes("accessibility_governance_only_required"));
    assertNoExecution(result);
  });

  it("bounded notes recommendations and remediation items are enforced", () => {
    const manyValues = Array.from({ length: 90 }, (_, index) => `item_${index}_${"x".repeat(220)}`);
    const result = createR51FinalAccessibilityInclusiveUxStackReview({
      ...completeInput,
      accessibilityReviewNotes: manyValues,
      operatorRecommendations: manyValues,
      accessibilityRemediationRecommendations: manyValues,
    });

    assert.equal(result.accessibilityReviewNotes.length, 40);
    assert.equal(result.operatorRecommendations.length, 40);
    assert.equal(result.accessibilityRemediationRecommendations.length, 40);
    assert.ok(result.accessibilityReviewNotes.every((value) => value.length <= 183));
    assert.ok(result.operatorRecommendations.every((value) => value.length <= 183));
    assert.ok(result.accessibilityRemediationRecommendations.every((value) => value.length <= 183));
    assertNoExecution(result);
  });

  it("hard invariants are preserved in every result", () => {
    const results = [
      createR51FinalAccessibilityInclusiveUxStackReview(),
      createR51FinalAccessibilityInclusiveUxStackReview(completeInput),
      createR51FinalAccessibilityInclusiveUxStackReview({
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
        accessibilityImplementationAllowedNow: true,
      }),
    ];

    for (const result of results) {
      assertNoExecution(result);
    }
  });
});
