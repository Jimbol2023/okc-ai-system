import assert from "node:assert/strict";
import test from "node:test";

import {
  createR64DrivingForDollarsSafetyAccessibilityReview,
  type R64SafetyReviewInput,
  type R64SafetyReviewResult,
} from "./r64-driving-for-dollars-safety-accessibility-review";

const completeInput: R64SafetyReviewInput = {
  r64dUiReviewed: true,
  forbiddenControlsReviewed: true,
  dangerousWordingReviewed: true,
  executionDriftReviewed: true,
  providerDriftReviewed: true,
  gpsMapDriftReviewed: true,
  scrapingSkipTracingDriftReviewed: true,
  automationDriftReviewed: true,
  accessibilityReviewed: true,
  governanceStopDominanceReviewed: true,
  operatorReviewCompleted: true,
  unsafeUiFound: false,
  unsafeExecutionFound: false,
  accessibilityGapFound: false,
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

function assertSafety(result: R64SafetyReviewResult) {
  assert.equal(result.readOnly, true);
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.providerCalled, false);
  assert.equal(result.sent, false);
  assert.equal(result.persistenceAllowedNow, false);
  assert.equal(result.pollingAllowed, false);
  assert.equal(result.runtimeActivationAllowed, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.approvalGrantsExecution, false);
  assert.equal(result.uiImplementationAllowedNow, true);
}

test("R64E defaults to operator review when review input is missing", () => {
  const result = createR64DrivingForDollarsSafetyAccessibilityReview();
  assert.equal(result.phase, "R64E");
  assert.equal(result.reviewStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("input_missing"));
  assertSafety(result);
});

test("R64E completes when safety, governance, GPS, scraping, and accessibility reviews pass", () => {
  const result = createR64DrivingForDollarsSafetyAccessibilityReview(completeInput);
  assert.equal(result.reviewStatus, "safety_accessibility_review_complete");
  assert.equal(result.fixesRequired, false);
  assert.match(result.safetyFindings.join(" "), /No new buttons/i);
  assert.match(result.governanceFindings.join(" "), /renders first/i);
  assert.match(result.accessibilityFindings.join(" "), /aria-labelledby/i);
  assert.match(result.forbiddenControlFindings.join(" "), /No send, call, SMS/i);
  assertSafety(result);
});

test("R64E blocks unsafe UI, execution drift, accessibility gaps, or governance-order failure", () => {
  const result = createR64DrivingForDollarsSafetyAccessibilityReview({
    ...completeInput,
    unsafeUiFound: true,
    unsafeExecutionFound: true,
    accessibilityGapFound: true,
    governanceStopFirst: false,
    providerCalled: true,
    sent: true,
    pollingAllowed: true,
    runtimeActivationAllowed: true,
  });
  assert.equal(result.reviewStatus, "review_blocked");
  assert.equal(result.fixesRequired, true);
  assert.ok(result.warningCodes.includes("unsafe_ui_found"));
  assert.ok(result.warningCodes.includes("unsafe_execution_found"));
  assert.ok(result.warningCodes.includes("accessibility_gap_found"));
  assert.ok(result.warningCodes.includes("governance_stop_first_required"));
  assertSafety(result);
});
