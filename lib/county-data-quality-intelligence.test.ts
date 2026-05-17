import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  type CountyDataQualityInput,
  evaluateCountyDataQuality,
} from "./county-data-quality-intelligence";

const highConfidenceInput: CountyDataQualityInput = {
  completenessConfidence: 0.95,
  duplicationRisk: 0.05,
  ambiguityRisk: 0.05,
  structureConsistency: 0.95,
  expectedCleanupBurden: "low",
};

const assertFailClosed = (input: CountyDataQualityInput) => {
  const result = evaluateCountyDataQuality(input);

  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("county data quality intelligence", () => {
  it("returns high_confidence_structured for clean structured quality signals", () => {
    const result = evaluateCountyDataQuality(highConfidenceInput);

    assert.equal(result.qualityLevel, "high_confidence_structured");
    assert.equal(result.expectedCleanupBurden, "low");
    assert.equal(result.expectedHumanReviewIntensity, "low");
  });

  it("returns moderate_quality_review_needed for usable but incomplete quality signals", () => {
    const result = evaluateCountyDataQuality({
      completenessConfidence: 0.68,
      duplicationRisk: 0.2,
      ambiguityRisk: 0.2,
      structureConsistency: 0.82,
      expectedCleanupBurden: "medium",
    });

    assert.equal(result.qualityLevel, "moderate_quality_review_needed");
    assert.equal(result.expectedHumanReviewIntensity, "medium");
    assert.equal(result.warningCodes.includes("completeness_confidence_low"), true);
  });

  it("returns inconsistent_high_review for high duplication or ambiguity risk", () => {
    const result = evaluateCountyDataQuality({
      completenessConfidence: 0.9,
      duplicationRisk: 0.75,
      ambiguityRisk: 0.2,
      structureConsistency: 0.85,
      expectedCleanupBurden: "medium",
    });

    assert.equal(result.qualityLevel, "inconsistent_high_review");
    assert.equal(result.expectedHumanReviewIntensity, "high");
    assert.equal(result.warningCodes.includes("duplication_risk_high"), true);
  });

  it("returns fragmented_manual_cleanup for manual rebuild quality signals", () => {
    const result = evaluateCountyDataQuality({
      completenessConfidence: 0.35,
      duplicationRisk: 0.3,
      ambiguityRisk: 0.3,
      structureConsistency: 0.35,
    });

    assert.equal(result.qualityLevel, "fragmented_manual_cleanup");
    assert.equal(result.expectedCleanupBurden, "manual_rebuild");
    assert.equal(result.expectedHumanReviewIntensity, "mandatory");
  });

  it("returns unsafe_unknown_quality for missing core quality signals", () => {
    const result = evaluateCountyDataQuality({});

    assert.equal(result.qualityLevel, "unsafe_unknown_quality");
    assert.equal(result.expectedCleanupBurden, "unknown");
    assert.equal(result.expectedHumanReviewIntensity, "mandatory");
  });

  it("generates deterministic warning codes for unsafe unknown quality", () => {
    const result = evaluateCountyDataQuality({});

    assert.deepEqual(result.warningCodes, [
      "missing_completeness_confidence",
      "missing_structure_consistency",
      "structure_consistency_low",
      "completeness_confidence_low",
      "cleanup_burden_high",
      "quality_confidence_low",
      "unsafe_unknown_quality",
      "manual_review_required",
      "execution_blocked",
      "planning_only_no_mutation",
    ]);
  });

  it("always preserves fail-closed flags", () => {
    for (const input of [
      highConfidenceInput,
      {
        completenessConfidence: 0.68,
        duplicationRisk: 0.2,
        ambiguityRisk: 0.2,
        structureConsistency: 0.82,
        expectedCleanupBurden: "medium",
      },
      {
        completenessConfidence: 0.9,
        duplicationRisk: 0.75,
        ambiguityRisk: 0.2,
        structureConsistency: 0.85,
        expectedCleanupBurden: "medium",
      },
      {
        completenessConfidence: 0.35,
        duplicationRisk: 0.3,
        ambiguityRisk: 0.3,
        structureConsistency: 0.35,
      },
      {},
    ] satisfies CountyDataQualityInput[]) {
      assertFailClosed(input);
    }
  });
});
