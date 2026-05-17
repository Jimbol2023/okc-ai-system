import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  type NormalizationReadinessInput,
  evaluateNormalizationReadiness,
} from "./normalization-readiness-intelligence";

const readyInput: NormalizationReadinessInput = {
  sourceFormat: "csv",
  parserFamily: "csv_structured",
  ocrBurdenLevel: "none",
  structuredDataQuality: 0.9,
  completenessScore: 0.95,
  ambiguityScore: 0.1,
  parserReadinessScore: 0.9,
  riskScore: 0.1,
};

const assertFailClosed = (input: NormalizationReadinessInput) => {
  const result = evaluateNormalizationReadiness(input);

  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.normalizationExecutionAllowed, false);
  assert.equal(result.normalizationPlanningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("normalization readiness intelligence", () => {
  it("returns ready_for_future_normalization for high-quality structured planning inputs", () => {
    const result = evaluateNormalizationReadiness(readyInput);

    assert.equal(result.readinessLevel, "ready_for_future_normalization");
    assert.equal(result.humanReviewIntensity, "low");
    assert.equal(result.estimatedNormalizationDifficulty, "low");
  });

  it("returns moderate_review_required for usable but not ready inputs", () => {
    const result = evaluateNormalizationReadiness({
      ...readyInput,
      structuredDataQuality: 0.75,
      completenessScore: 0.75,
      ambiguityScore: 0.3,
      parserReadinessScore: 0.75,
      riskScore: 0.4,
    });

    assert.equal(result.readinessLevel, "moderate_review_required");
    assert.equal(result.humanReviewIntensity, "medium");
    assert.equal(result.estimatedNormalizationDifficulty, "medium");
  });

  it("returns heavy_review_required for incomplete low-readiness inputs without unsafe unknowns", () => {
    const result = evaluateNormalizationReadiness({
      ...readyInput,
      completenessScore: 0.45,
      parserReadinessScore: 0.5,
    });

    assert.equal(result.readinessLevel, "heavy_review_required");
    assert.equal(result.humanReviewIntensity, "high");
    assert.equal(result.estimatedNormalizationDifficulty, "high");
  });

  it("returns manual_only for OCR-heavy or high-risk inputs", () => {
    const result = evaluateNormalizationReadiness({
      sourceFormat: "pdf",
      parserFamily: "text_pdf",
      completenessScore: 0.8,
      ambiguityScore: 0.3,
    });

    assert.equal(result.readinessLevel, "manual_only");
    assert.equal(result.humanReviewIntensity, "mandatory");
    assert.equal(result.estimatedNormalizationDifficulty, "manual_only");
  });

  it("returns unsafe_unknown for unknown or missing source/parser metadata", () => {
    const result = evaluateNormalizationReadiness({
      sourceFormat: "unknown",
      parserFamily: "unknown",
    });

    assert.equal(result.readinessLevel, "unsafe_unknown");
    assert.equal(result.humanReviewIntensity, "mandatory");
    assert.equal(result.estimatedNormalizationDifficulty, "unsafe_unknown");
  });

  it("generates deterministic warning codes for unsafe missing inputs", () => {
    const result = evaluateNormalizationReadiness({});

    assert.deepEqual(result.warningCodes, [
      "missing_source_format",
      "missing_parser_family",
      "structured_data_quality_low",
      "completeness_low",
      "ambiguity_high",
      "parser_readiness_low",
      "risk_high",
      "manual_review_required",
      "normalization_execution_blocked",
      "planning_only_no_execution",
    ]);
  });

  it("always preserves fail-closed flags", () => {
    for (const input of [
      readyInput,
      { ...readyInput, completenessScore: 0.45, parserReadinessScore: 0.5 },
      { sourceFormat: "pdf", parserFamily: "text_pdf" },
      { sourceFormat: "unknown", parserFamily: "unknown" },
      {},
    ]) {
      assertFailClosed(input);
    }
  });
});
