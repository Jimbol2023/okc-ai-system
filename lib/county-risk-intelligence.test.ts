import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  type CountyRiskIntelligenceInput,
  evaluateCountyRisk,
} from "./county-risk-intelligence";

const lowRiskInput: CountyRiskIntelligenceInput = {
  operationalVolatility: 0.1,
  ocrDependency: 0.1,
  ambiguityEscalation: 0.1,
  manualReviewDependency: 0.1,
  structureInstability: 0.1,
  unsupportedFormatExposure: 0.1,
};

const assertFailClosed = (input: CountyRiskIntelligenceInput) => {
  const result = evaluateCountyRisk(input);

  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("county risk intelligence", () => {
  it("returns low_operational_risk for stable planning inputs", () => {
    const result = evaluateCountyRisk(lowRiskInput);

    assert.equal(result.riskLevel, "low_operational_risk");
    assert.equal(result.expectedHumanReviewIntensity, "low");
  });

  it("returns moderate_operational_risk for moderate planning pressure", () => {
    const result = evaluateCountyRisk({
      operationalVolatility: 0.45,
      ocrDependency: 0.35,
      ambiguityEscalation: 0.4,
      manualReviewDependency: 0.35,
      structureInstability: 0.45,
      unsupportedFormatExposure: 0.3,
    });

    assert.equal(result.riskLevel, "moderate_operational_risk");
    assert.equal(result.expectedHumanReviewIntensity, "medium");
  });

  it("returns elevated_review_risk for elevated planning pressure", () => {
    const result = evaluateCountyRisk({
      operationalVolatility: 0.65,
      ocrDependency: 0.55,
      ambiguityEscalation: 0.6,
      manualReviewDependency: 0.55,
      structureInstability: 0.65,
      unsupportedFormatExposure: 0.5,
    });

    assert.equal(result.riskLevel, "elevated_review_risk");
    assert.equal(result.expectedHumanReviewIntensity, "high");
  });

  it("returns unstable_high_risk for unstable high-risk planning pressure", () => {
    const result = evaluateCountyRisk({
      operationalVolatility: 0.9,
      ocrDependency: 0.85,
      ambiguityEscalation: 0.9,
      manualReviewDependency: 0.85,
      structureInstability: 0.9,
      unsupportedFormatExposure: 0.85,
    });

    assert.equal(result.riskLevel, "unstable_high_risk");
    assert.equal(result.expectedHumanReviewIntensity, "mandatory");
  });

  it("returns unsafe_unknown_risk when core metadata is missing", () => {
    const result = evaluateCountyRisk({});

    assert.equal(result.riskLevel, "unsafe_unknown_risk");
    assert.equal(result.expectedHumanReviewIntensity, "mandatory");
  });

  it("generates deterministic warning codes for unknown risk", () => {
    const result = evaluateCountyRisk({});

    assert.deepEqual(result.warningCodes, [
      "missing_operational_volatility",
      "missing_structure_instability",
      "risk_confidence_low",
      "unsafe_unknown_risk",
      "manual_review_required",
      "execution_blocked",
      "planning_only_no_connectivity",
    ]);
  });

  it("preserves risk confidence scoring behavior", () => {
    const inferred = evaluateCountyRisk(lowRiskInput);
    const explicit = evaluateCountyRisk({
      ...lowRiskInput,
      riskConfidenceScore: 0.42,
    });

    assert.equal(inferred.riskConfidenceScore > explicit.riskConfidenceScore, true);
    assert.equal(explicit.riskConfidenceScore, 0.42);
    assert.equal(explicit.warningCodes.includes("risk_confidence_low"), true);
  });

  it("preserves operational volatility scoring", () => {
    const result = evaluateCountyRisk({
      ...lowRiskInput,
      operationalVolatility: 0.8,
    });

    assert.equal(result.operationalVolatility, 0.8);
    assert.equal(result.warningCodes.includes("operational_volatility_high"), true);
  });

  it("preserves OCR dependency scoring", () => {
    const result = evaluateCountyRisk({
      ...lowRiskInput,
      ocrDependency: 0.8,
    });

    assert.equal(result.ocrDependency, 0.8);
    assert.equal(result.warningCodes.includes("ocr_dependency_high"), true);
  });

  it("preserves ambiguity escalation scoring", () => {
    const result = evaluateCountyRisk({
      ...lowRiskInput,
      ambiguityEscalation: 0.8,
    });

    assert.equal(result.ambiguityEscalation, 0.8);
    assert.equal(result.warningCodes.includes("ambiguity_escalation_high"), true);
  });

  it("preserves manual review dependency scoring", () => {
    const result = evaluateCountyRisk({
      ...lowRiskInput,
      manualReviewDependency: 0.8,
    });

    assert.equal(result.manualReviewDependency, 0.8);
    assert.equal(result.warningCodes.includes("manual_review_dependency_high"), true);
  });

  it("preserves structure instability scoring", () => {
    const result = evaluateCountyRisk({
      ...lowRiskInput,
      structureInstability: 0.8,
    });

    assert.equal(result.structureInstability, 0.8);
    assert.equal(result.warningCodes.includes("structure_instability_high"), true);
  });

  it("preserves unsupported format exposure scoring", () => {
    const result = evaluateCountyRisk({
      ...lowRiskInput,
      unsupportedFormatExposure: 0.8,
    });

    assert.equal(result.unsupportedFormatExposure, 0.8);
    assert.equal(result.warningCodes.includes("unsupported_format_exposure_high"), true);
  });

  it("always preserves fail-closed flags", () => {
    for (const input of [
      lowRiskInput,
      {
        operationalVolatility: 0.65,
        ocrDependency: 0.55,
        ambiguityEscalation: 0.6,
        manualReviewDependency: 0.55,
        structureInstability: 0.65,
        unsupportedFormatExposure: 0.5,
      },
      {
        operationalVolatility: 0.9,
        ocrDependency: 0.85,
        ambiguityEscalation: 0.9,
        manualReviewDependency: 0.85,
        structureInstability: 0.9,
        unsupportedFormatExposure: 0.85,
      },
      {},
    ] satisfies CountyRiskIntelligenceInput[]) {
      assertFailClosed(input);
    }
  });

  it("returns the same output for the same input", () => {
    assert.deepEqual(evaluateCountyRisk(lowRiskInput), evaluateCountyRisk(lowRiskInput));
  });
});
