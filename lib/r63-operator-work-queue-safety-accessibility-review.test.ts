import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR63OperatorWorkQueueSafetyReviewInvariants,
  createR63OperatorWorkQueueSafetyAccessibilityReview,
  type R63SafetyReviewInput,
  type R63SafetyReviewResult,
} from "./r63-operator-work-queue-safety-accessibility-review";

const readyInput: R63SafetyReviewInput = {
  r63dUiReviewed: true,
  forbiddenControlsReviewed: true,
  dangerousWordingReviewed: true,
  executionDriftReviewed: true,
  providerDriftReviewed: true,
  automationDriftReviewed: true,
  accessibilityReviewed: true,
  governanceStopDominanceReviewed: true,
  operatorReviewCompleted: true,
  governanceStopFirst: true,
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

function assertSafety(result: R63SafetyReviewResult) {
  assert.equal(result.readOnly, true);
  assert.equal(result.providerCalled, false);
  assert.equal(result.sent, false);
  assert.equal(result.pollingAllowed, false);
  assert.equal(result.uiImplementationAllowedNow, true);
  assert.equal(assertR63OperatorWorkQueueSafetyReviewInvariants(result).passed, true);
}

test("R63E defaults to operator review", () => {
  const result = createR63OperatorWorkQueueSafetyAccessibilityReview();
  assert.equal(result.phase, "R63E");
  assert.equal(result.reviewStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r63d_ui_review_required"));
  assertSafety(result);
});

test("R63E completes clean review with no fixes", () => {
  const result = createR63OperatorWorkQueueSafetyAccessibilityReview(readyInput);
  assert.equal(result.reviewStatus, "safety_accessibility_review_complete");
  assert.equal(result.fixesRequired, false);
  assert.match(result.safetyFindings.join(" "), /read-only and advisory-only/i);
  assert.match(result.accessibilityFindings.join(" "), /aria-labelledby and aria-describedby/i);
  assert.match(result.governanceFindings.join(" "), /Governance stop visibility renders first/i);
  assert.match(result.forbiddenControlFindings.join(" "), /No R63D buttons, links, forms/i);
  assertSafety(result);
});

test("R63E blocks unsafe findings", () => {
  const result = createR63OperatorWorkQueueSafetyAccessibilityReview({
    ...readyInput,
    unsafeUiFound: true,
    unsafeExecutionFound: true,
    accessibilityGapFound: true,
    governanceStopFirst: false,
    readOnly: false,
    providerCalled: true,
    sent: true,
    pollingAllowed: true,
    uiImplementationAllowedNow: false,
  });
  assert.equal(result.reviewStatus, "review_blocked");
  assert.equal(result.fixesRequired, true);
  assert.ok(result.warningCodes.includes("unsafe_ui_found"));
  assert.ok(result.warningCodes.includes("unsafe_execution_found"));
  assert.ok(result.warningCodes.includes("read_only_required"));
  assertSafety(result);
});
