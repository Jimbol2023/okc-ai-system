import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  type CountyReviewBurdenIntelligenceInput,
  evaluateCountyReviewBurden,
} from "./county-review-burden-intelligence";

const lowBurdenInput: CountyReviewBurdenIntelligenceInput = {
  reviewerEffortScore: 0.1,
  escalationLikelihood: 0.1,
  manualRemediationBurden: 0.1,
  reviewQueueComplexityScore: 0.1,
  confidenceDegradationScore: 0.1,
};

const assertFailClosed = (input: CountyReviewBurdenIntelligenceInput) => {
  const result = evaluateCountyReviewBurden(input);

  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("county review burden intelligence", () => {
  it("returns low_review_burden for low planning burden inputs", () => {
    const result = evaluateCountyReviewBurden(lowBurdenInput);

    assert.equal(result.reviewBurdenLevel, "low_review_burden");
    assert.equal(result.reviewerEffortEstimate, "low");
    assert.equal(result.reviewQueueComplexity, "simple");
  });

  it("returns moderate_review_burden for moderate review pressure", () => {
    const result = evaluateCountyReviewBurden({
      reviewerEffortScore: 0.4,
      escalationLikelihood: 0.4,
      manualRemediationBurden: 0.4,
      reviewQueueComplexityScore: 0.4,
      confidenceDegradationScore: 0.4,
    });

    assert.equal(result.reviewBurdenLevel, "moderate_review_burden");
    assert.equal(result.reviewerEffortEstimate, "medium");
    assert.equal(result.reviewQueueComplexity, "moderate");
  });

  it("returns elevated_review_burden for elevated review pressure", () => {
    const result = evaluateCountyReviewBurden({
      reviewerEffortScore: 0.6,
      escalationLikelihood: 0.6,
      manualRemediationBurden: 0.6,
      reviewQueueComplexityScore: 0.6,
      confidenceDegradationScore: 0.6,
    });

    assert.equal(result.reviewBurdenLevel, "elevated_review_burden");
    assert.equal(result.reviewerEffortEstimate, "high");
    assert.equal(result.reviewQueueComplexity, "complex");
  });

  it("returns manual_remediation_heavy for heavy review pressure", () => {
    const result = evaluateCountyReviewBurden({
      reviewerEffortScore: 0.9,
      escalationLikelihood: 0.9,
      manualRemediationBurden: 0.9,
      reviewQueueComplexityScore: 0.9,
      confidenceDegradationScore: 0.9,
    });

    assert.equal(result.reviewBurdenLevel, "manual_remediation_heavy");
    assert.equal(result.reviewerEffortEstimate, "manual_rebuild");
    assert.equal(result.reviewQueueComplexity, "manual_triage");
  });

  it("returns unsafe_unknown_review_burden when core review metadata is missing", () => {
    const result = evaluateCountyReviewBurden({});

    assert.equal(result.reviewBurdenLevel, "unsafe_unknown_review_burden");
    assert.equal(result.reviewerEffortEstimate, "unknown");
    assert.equal(result.reviewQueueComplexity, "unknown");
  });

  it("generates deterministic warning codes for unknown review burden", () => {
    const result = evaluateCountyReviewBurden({});

    assert.deepEqual(result.warningCodes, [
      "missing_reviewer_effort",
      "missing_review_queue_complexity",
      "review_confidence_low",
      "unsafe_unknown_review_burden",
      "manual_review_required",
      "execution_blocked",
      "planning_only_no_mutation",
    ]);
  });

  it("preserves reviewer effort estimation behavior", () => {
    const result = evaluateCountyReviewBurden({
      ...lowBurdenInput,
      reviewerEffortScore: 0.75,
    });

    assert.equal(result.reviewerEffortEstimate, "manual_rebuild");
    assert.equal(result.warningCodes.includes("reviewer_effort_high"), true);
  });

  it("preserves escalation likelihood behavior", () => {
    const result = evaluateCountyReviewBurden({
      ...lowBurdenInput,
      escalationLikelihood: 0.7,
    });

    assert.equal(result.escalationLikelihood, 0.7);
    assert.equal(result.warningCodes.includes("escalation_likelihood_high"), true);
  });

  it("preserves manual remediation burden behavior", () => {
    const result = evaluateCountyReviewBurden({
      ...lowBurdenInput,
      manualRemediationBurden: 0.7,
    });

    assert.equal(result.manualRemediationBurden, 0.7);
    assert.equal(result.warningCodes.includes("manual_remediation_burden_high"), true);
  });

  it("preserves review queue complexity behavior", () => {
    const result = evaluateCountyReviewBurden({
      ...lowBurdenInput,
      reviewQueueComplexityScore: 0.75,
    });

    assert.equal(result.reviewQueueComplexityScore, 0.75);
    assert.equal(result.reviewQueueComplexity, "manual_triage");
    assert.equal(result.warningCodes.includes("review_queue_complexity_high"), true);
  });

  it("preserves confidence degradation behavior", () => {
    const result = evaluateCountyReviewBurden({
      ...lowBurdenInput,
      confidenceDegradationScore: 0.7,
    });

    assert.equal(result.confidenceDegradationScore, 0.7);
    assert.equal(result.warningCodes.includes("confidence_degradation_high"), true);
  });

  it("preserves review confidence scoring behavior", () => {
    const inferred = evaluateCountyReviewBurden(lowBurdenInput);
    const explicit = evaluateCountyReviewBurden({
      ...lowBurdenInput,
      reviewConfidenceScore: 0.42,
    });

    assert.equal(inferred.reviewConfidenceScore > explicit.reviewConfidenceScore, true);
    assert.equal(explicit.reviewConfidenceScore, 0.42);
    assert.equal(explicit.warningCodes.includes("review_confidence_low"), true);
  });

  it("always preserves fail-closed flags", () => {
    for (const input of [
      lowBurdenInput,
      {
        reviewerEffortScore: 0.6,
        escalationLikelihood: 0.6,
        manualRemediationBurden: 0.6,
        reviewQueueComplexityScore: 0.6,
        confidenceDegradationScore: 0.6,
      },
      {
        reviewerEffortScore: 0.9,
        escalationLikelihood: 0.9,
        manualRemediationBurden: 0.9,
        reviewQueueComplexityScore: 0.9,
        confidenceDegradationScore: 0.9,
      },
      {},
    ] satisfies CountyReviewBurdenIntelligenceInput[]) {
      assertFailClosed(input);
    }
  });

  it("returns the same output for the same input", () => {
    assert.deepEqual(
      evaluateCountyReviewBurden(lowBurdenInput),
      evaluateCountyReviewBurden(lowBurdenInput),
    );
  });
});
