import assert from "node:assert/strict";
import test from "node:test";

import { createR66ControlledExecutionSafetyAccessibilityReview } from "./r66-controlled-execution-safety-accessibility-review";

const completeInput = {
  r66dUiReviewed: true,
  forbiddenControlsReviewed: true,
  dangerousWordingReviewed: true,
  hiddenExecutionReviewed: true,
  approvalPermissionReviewed: true,
  providerDriftReviewed: true,
  runtimeDriftReviewed: true,
  accessibilityReviewed: true,
  governanceReviewed: true,
  operatorReviewCompleted: true,
  unsafeUiFound: false,
  hiddenExecutionFound: false,
  approvalExecutionFound: false,
  providerDriftFound: false,
  runtimeDriftFound: false,
  accessibilityGapFound: false,
  governanceStopFirst: true,
  providerCalled: false,
  sent: false,
  approvalGrantsExecution: false,
};

test("R66E completes when safety and accessibility review passes", () => {
  const result = createR66ControlledExecutionSafetyAccessibilityReview(completeInput);
  assert.equal(result.reviewStatus, "safety_accessibility_review_complete");
  assert.match(result.safetyFindings.join(" "), /No buttons/i);
  assert.match(result.accessibilityFindings.join(" "), /aria-labelledby/i);
  assert.equal(result.executionAllowedNow, false);
});

test("R66E blocks hidden execution and approval drift", () => {
  const result = createR66ControlledExecutionSafetyAccessibilityReview({
    ...completeInput,
    hiddenExecutionFound: true,
    approvalExecutionFound: true,
    providerDriftFound: true,
    runtimeDriftFound: true,
    sent: true,
  });
  assert.equal(result.reviewStatus, "review_blocked");
  assert.ok(result.warningCodes.includes("hidden_execution_found"));
  assert.ok(result.warningCodes.includes("approval_execution_found"));
  assert.ok(result.warningCodes.includes("sent_must_be_false"));
});
