import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  type CountyConfidenceStabilityInput,
  evaluateCountyConfidenceStability,
} from "./county-confidence-stability-intelligence";

const durableConfidenceInput: CountyConfidenceStabilityInput = {
  confidenceDurabilityScore: 0.9,
  confidenceDriftEstimate: 0.1,
  crossSourceConsistencyScore: 0.9,
  confidenceVolatilityScore: 0.1,
  reviewerCertaintyDegradation: 0.1,
};

const assertFailClosed = (input: CountyConfidenceStabilityInput) => {
  const result = evaluateCountyConfidenceStability(input);

  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("county confidence stability intelligence", () => {
  it("returns durable_confidence for stable confidence inputs", () => {
    const result = evaluateCountyConfidenceStability(durableConfidenceInput);

    assert.equal(result.confidenceStabilityLevel, "durable_confidence");
    assert.equal(result.confidenceDurability, "strong");
    assert.equal(result.crossSourceConsistency, "consistent");
  });

  it("returns moderate_confidence_monitoring for moderate confidence stability", () => {
    const result = evaluateCountyConfidenceStability({
      confidenceDurabilityScore: 0.7,
      confidenceDriftEstimate: 0.3,
      crossSourceConsistencyScore: 0.7,
      confidenceVolatilityScore: 0.3,
      reviewerCertaintyDegradation: 0.3,
    });

    assert.equal(result.confidenceStabilityLevel, "moderate_confidence_monitoring");
    assert.equal(result.confidenceDurability, "moderate");
    assert.equal(result.crossSourceConsistency, "mostly_consistent");
  });

  it("returns volatile_confidence_review for weak but usable confidence stability", () => {
    const result = evaluateCountyConfidenceStability({
      confidenceDurabilityScore: 0.5,
      confidenceDriftEstimate: 0.5,
      crossSourceConsistencyScore: 0.5,
      confidenceVolatilityScore: 0.5,
      reviewerCertaintyDegradation: 0.5,
    });

    assert.equal(result.confidenceStabilityLevel, "volatile_confidence_review");
    assert.equal(result.confidenceDurability, "weak");
    assert.equal(result.crossSourceConsistency, "mixed");
  });

  it("returns degraded_confidence_manual_review for degraded confidence stability", () => {
    const result = evaluateCountyConfidenceStability({
      confidenceDurabilityScore: 0.3,
      confidenceDriftEstimate: 0.7,
      crossSourceConsistencyScore: 0.3,
      confidenceVolatilityScore: 0.7,
      reviewerCertaintyDegradation: 0.7,
    });

    assert.equal(result.confidenceStabilityLevel, "degraded_confidence_manual_review");
    assert.equal(result.confidenceDurability, "degraded");
    assert.equal(result.crossSourceConsistency, "conflicting");
  });

  it("returns unsafe_unknown_confidence when core metadata is missing", () => {
    const result = evaluateCountyConfidenceStability({});

    assert.equal(result.confidenceStabilityLevel, "unsafe_unknown_confidence");
    assert.equal(result.confidenceDurability, "unknown");
    assert.equal(result.crossSourceConsistency, "unknown");
  });

  it("generates deterministic warning codes for unknown confidence stability", () => {
    const result = evaluateCountyConfidenceStability({});

    assert.deepEqual(result.warningCodes, [
      "missing_confidence_durability",
      "missing_cross_source_consistency",
      "cross_source_consistency_low",
      "confidence_stability_low",
      "confidence_stability_low",
      "unsafe_unknown_confidence",
      "manual_review_required",
      "execution_blocked",
      "planning_only_no_connectivity",
    ]);
  });

  it("preserves confidence durability behavior", () => {
    const result = evaluateCountyConfidenceStability({
      ...durableConfidenceInput,
      confidenceDurabilityScore: 0.42,
    });

    assert.equal(result.confidenceDurabilityScore, 0.42);
    assert.equal(result.confidenceDurability, "weak");
    assert.equal(result.warningCodes.includes("confidence_stability_low"), true);
  });

  it("preserves confidence drift estimation behavior", () => {
    const result = evaluateCountyConfidenceStability({
      ...durableConfidenceInput,
      confidenceDriftEstimate: 0.7,
    });

    assert.equal(result.confidenceDriftEstimate, 0.7);
    assert.equal(result.warningCodes.includes("confidence_drift_high"), true);
  });

  it("preserves cross-source consistency behavior", () => {
    const result = evaluateCountyConfidenceStability({
      ...durableConfidenceInput,
      crossSourceConsistencyScore: 0.42,
    });

    assert.equal(result.crossSourceConsistencyScore, 0.42);
    assert.equal(result.crossSourceConsistency, "mixed");
    assert.equal(result.warningCodes.includes("cross_source_consistency_low"), true);
  });

  it("preserves confidence volatility scoring behavior", () => {
    const result = evaluateCountyConfidenceStability({
      ...durableConfidenceInput,
      confidenceVolatilityScore: 0.7,
    });

    assert.equal(result.confidenceVolatilityScore, 0.7);
    assert.equal(result.warningCodes.includes("confidence_volatility_high"), true);
  });

  it("preserves reviewer certainty degradation behavior", () => {
    const result = evaluateCountyConfidenceStability({
      ...durableConfidenceInput,
      reviewerCertaintyDegradation: 0.7,
    });

    assert.equal(result.reviewerCertaintyDegradation, 0.7);
    assert.equal(result.warningCodes.includes("reviewer_certainty_degradation_high"), true);
  });

  it("preserves explicit confidence stability scoring behavior", () => {
    const inferred = evaluateCountyConfidenceStability(durableConfidenceInput);
    const explicit = evaluateCountyConfidenceStability({
      ...durableConfidenceInput,
      confidenceStabilityScore: 0.41,
    });

    assert.equal(inferred.confidenceStabilityScore > explicit.confidenceStabilityScore, true);
    assert.equal(explicit.confidenceStabilityScore, 0.41);
    assert.equal(explicit.confidenceStabilityLevel, "degraded_confidence_manual_review");
    assert.equal(explicit.warningCodes.includes("confidence_stability_low"), true);
  });

  it("always preserves fail-closed flags", () => {
    for (const input of [
      durableConfidenceInput,
      {
        confidenceDurabilityScore: 0.7,
        confidenceDriftEstimate: 0.3,
        crossSourceConsistencyScore: 0.7,
        confidenceVolatilityScore: 0.3,
        reviewerCertaintyDegradation: 0.3,
      },
      {
        confidenceDurabilityScore: 0.3,
        confidenceDriftEstimate: 0.7,
        crossSourceConsistencyScore: 0.3,
        confidenceVolatilityScore: 0.7,
        reviewerCertaintyDegradation: 0.7,
      },
      {},
    ] satisfies CountyConfidenceStabilityInput[]) {
      assertFailClosed(input);
    }
  });

  it("returns the same output for the same input", () => {
    assert.deepEqual(
      evaluateCountyConfidenceStability(durableConfidenceInput),
      evaluateCountyConfidenceStability(durableConfidenceInput),
    );
  });
});
