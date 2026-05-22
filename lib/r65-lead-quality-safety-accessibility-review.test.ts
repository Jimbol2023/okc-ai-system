import assert from "node:assert/strict";
import test from "node:test";

import { createR65LeadQualitySafetyAccessibilityReview, type R65SafetyReviewInput, type R65SafetyReviewResult } from "./r65-lead-quality-safety-accessibility-review";

const completeInput: R65SafetyReviewInput = {
  r65dUiReviewed: true,
  forbiddenControlsReviewed: true,
  dangerousWordingReviewed: true,
  executionDriftReviewed: true,
  providerDriftReviewed: true,
  enrichmentDriftReviewed: true,
  skipTracingDriftReviewed: true,
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

function assertSafety(result: R65SafetyReviewResult) {
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
  assert.equal(result.enrichmentActivationAllowed, false);
  assert.equal(result.skipTracingAllowed, false);
}

test("R65E completes when safety, governance, enrichment, tracing, and accessibility reviews pass", () => {
  const result = createR65LeadQualitySafetyAccessibilityReview(completeInput);
  assert.equal(result.reviewStatus, "safety_accessibility_review_complete");
  assert.match(result.safetyFindings.join(" "), /No new buttons/i);
  assert.match(result.governanceFindings.join(" "), /renders first/i);
  assert.match(result.accessibilityFindings.join(" "), /aria-labelledby/i);
  assertSafety(result);
});

test("R65E blocks unsafe UI, execution drift, accessibility gaps, or governance-order failure", () => {
  const result = createR65LeadQualitySafetyAccessibilityReview({
    ...completeInput,
    unsafeUiFound: true,
    unsafeExecutionFound: true,
    accessibilityGapFound: true,
    governanceStopFirst: false,
    providerCalled: true,
    sent: true,
    pollingAllowed: true,
  });
  assert.equal(result.reviewStatus, "review_blocked");
  assert.ok(result.warningCodes.includes("unsafe_ui_found"));
  assert.ok(result.warningCodes.includes("governance_stop_first_required"));
  assertSafety(result);
});
