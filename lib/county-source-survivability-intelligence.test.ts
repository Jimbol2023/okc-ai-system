import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  type CountySourceSurvivabilityInput,
  evaluateCountySourceSurvivability,
} from "./county-source-survivability-intelligence";

const strongSurvivabilityInput: CountySourceSurvivabilityInput = {
  survivabilityBaselineScore: 0.95,
  dependencyFragilityScore: 0.05,
  sourceContinuityRiskScore: 0.05,
  operationalSustainabilityScore: 0.95,
  sourceDisruptionLikelihood: 0.05,
};

const assertFailClosed = (input: CountySourceSurvivabilityInput) => {
  const result = evaluateCountySourceSurvivability(input);

  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("county source survivability intelligence", () => {
  it("returns strong_source_survivability for durable source planning inputs", () => {
    const result = evaluateCountySourceSurvivability(strongSurvivabilityInput);

    assert.equal(result.sourceSurvivabilityLevel, "strong_source_survivability");
    assert.equal(result.dependencyFragility, "low");
    assert.equal(result.sourceContinuityRisk, "low");
  });

  it("returns moderate_source_survivability for moderate source planning inputs", () => {
    const result = evaluateCountySourceSurvivability({
      survivabilityBaselineScore: 0.7,
      dependencyFragilityScore: 0.35,
      sourceContinuityRiskScore: 0.35,
      operationalSustainabilityScore: 0.7,
      sourceDisruptionLikelihood: 0.35,
    });

    assert.equal(result.sourceSurvivabilityLevel, "moderate_source_survivability");
    assert.equal(result.dependencyFragility, "low");
    assert.equal(result.sourceContinuityRisk, "low");
  });

  it("returns fragile_source_survivability for fragile but usable source planning inputs", () => {
    const result = evaluateCountySourceSurvivability({
      survivabilityBaselineScore: 0.5,
      dependencyFragilityScore: 0.45,
      sourceContinuityRiskScore: 0.45,
      operationalSustainabilityScore: 0.65,
      sourceDisruptionLikelihood: 0.45,
    });

    assert.equal(result.sourceSurvivabilityLevel, "fragile_source_survivability");
    assert.equal(result.dependencyFragility, "moderate");
    assert.equal(result.sourceContinuityRisk, "moderate");
  });

  it("returns disruption_prone_source for low survivability planning inputs", () => {
    const result = evaluateCountySourceSurvivability({
      survivabilityBaselineScore: 0.3,
      dependencyFragilityScore: 0.8,
      sourceContinuityRiskScore: 0.8,
      operationalSustainabilityScore: 0.3,
      sourceDisruptionLikelihood: 0.8,
    });

    assert.equal(result.sourceSurvivabilityLevel, "disruption_prone_source");
    assert.equal(result.dependencyFragility, "high");
    assert.equal(result.sourceContinuityRisk, "elevated");
  });

  it("returns unsafe_unknown_survivability when core source metadata is missing", () => {
    const result = evaluateCountySourceSurvivability({});

    assert.equal(result.sourceSurvivabilityLevel, "unsafe_unknown_survivability");
    assert.equal(result.dependencyFragility, "unknown");
    assert.equal(result.sourceContinuityRisk, "unknown");
  });

  it("generates deterministic warning codes for unknown source survivability", () => {
    const result = evaluateCountySourceSurvivability({});

    assert.deepEqual(result.warningCodes, [
      "missing_survivability_baseline",
      "missing_operational_sustainability",
      "operational_sustainability_low",
      "survivability_confidence_low",
      "unsafe_unknown_survivability",
      "manual_review_required",
      "execution_blocked",
      "planning_only_no_connectivity",
    ]);
  });

  it("preserves long-term source survivability scoring behavior", () => {
    const strong = evaluateCountySourceSurvivability(strongSurvivabilityInput);
    const fragile = evaluateCountySourceSurvivability({
      ...strongSurvivabilityInput,
      survivabilityBaselineScore: 0.42,
    });

    assert.equal(strong.survivabilityScore > fragile.survivabilityScore, true);
    assert.equal(fragile.survivabilityBaselineScore, 0.42);
  });

  it("preserves dependency fragility estimation behavior", () => {
    const result = evaluateCountySourceSurvivability({
      ...strongSurvivabilityInput,
      dependencyFragilityScore: 0.85,
    });

    assert.equal(result.dependencyFragilityScore, 0.85);
    assert.equal(result.dependencyFragility, "critical");
    assert.equal(result.warningCodes.includes("dependency_fragility_high"), true);
  });

  it("preserves source continuity risk behavior", () => {
    const result = evaluateCountySourceSurvivability({
      ...strongSurvivabilityInput,
      sourceContinuityRiskScore: 0.85,
    });

    assert.equal(result.sourceContinuityRiskScore, 0.85);
    assert.equal(result.sourceContinuityRisk, "severe");
    assert.equal(result.warningCodes.includes("source_continuity_risk_high"), true);
  });

  it("preserves operational sustainability scoring behavior", () => {
    const result = evaluateCountySourceSurvivability({
      ...strongSurvivabilityInput,
      operationalSustainabilityScore: 0.64,
    });

    assert.equal(result.operationalSustainabilityScore, 0.64);
    assert.equal(result.warningCodes.includes("operational_sustainability_low"), true);
  });

  it("preserves source disruption likelihood behavior", () => {
    const result = evaluateCountySourceSurvivability({
      ...strongSurvivabilityInput,
      sourceDisruptionLikelihood: 0.7,
    });

    assert.equal(result.sourceDisruptionLikelihood, 0.7);
    assert.equal(result.warningCodes.includes("source_disruption_likelihood_high"), true);
  });

  it("preserves survivability confidence scoring behavior", () => {
    const inferred = evaluateCountySourceSurvivability(strongSurvivabilityInput);
    const explicit = evaluateCountySourceSurvivability({
      ...strongSurvivabilityInput,
      survivabilityConfidenceScore: 0.42,
    });

    assert.equal(inferred.survivabilityConfidenceScore > explicit.survivabilityConfidenceScore, true);
    assert.equal(explicit.survivabilityConfidenceScore, 0.42);
    assert.equal(explicit.warningCodes.includes("survivability_confidence_low"), true);
  });

  it("always preserves fail-closed flags", () => {
    for (const input of [
      strongSurvivabilityInput,
      {
        survivabilityBaselineScore: 0.7,
        dependencyFragilityScore: 0.35,
        sourceContinuityRiskScore: 0.35,
        operationalSustainabilityScore: 0.7,
        sourceDisruptionLikelihood: 0.35,
      },
      {
        survivabilityBaselineScore: 0.3,
        dependencyFragilityScore: 0.8,
        sourceContinuityRiskScore: 0.8,
        operationalSustainabilityScore: 0.3,
        sourceDisruptionLikelihood: 0.8,
      },
      {},
    ] satisfies CountySourceSurvivabilityInput[]) {
      assertFailClosed(input);
    }
  });

  it("returns the same output for the same input", () => {
    assert.deepEqual(
      evaluateCountySourceSurvivability(strongSurvivabilityInput),
      evaluateCountySourceSurvivability(strongSurvivabilityInput),
    );
  });
});
