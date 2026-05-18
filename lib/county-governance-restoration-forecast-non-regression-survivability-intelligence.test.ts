import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceRestorationForecastNonRegressionSurvivability,
  type CountyGovernanceRestorationForecastNonRegressionSurvivabilityInput,
} from "./county-governance-restoration-forecast-non-regression-survivability-intelligence";

const durableInput: CountyGovernanceRestorationForecastNonRegressionSurvivabilityInput = {
  forecastNonRegressionSurvivabilityScore: 94,
  longHorizonForecastDurabilityScore: 93,
  failClosedForecastSurvivabilityScore: 94,
  recursiveForecastSurvivabilityRiskScore: 8,
  projectedContainmentSurvivabilityScore: 91,
  restorationDriftSurvivabilityScore: 92,
  doctrineForecastSurvivabilityScore: 91,
  rollbackForecastSurvivabilityScore: 90,
  institutionalForecastSurvivabilityScore: 92,
  entropyAccelerationSurvivabilityScore: 8,
  lineageForecastSurvivabilityScore: 91,
  explainabilitySurvivabilityScore: 90,
  survivabilityReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceRestorationForecastNonRegressionSurvivabilityInput>) {
  return evaluateCountyGovernanceRestorationForecastNonRegressionSurvivability({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceRestorationForecastNonRegressionSurvivability>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Restoration Forecast Non-Regression Survivability Intelligence", () => {
  it("classifies durable forecast survivability", () => {
    const result = evaluateCountyGovernanceRestorationForecastNonRegressionSurvivability(durableInput);

    assert.equal(result.forecastSurvivabilityLevel, "durable_forecast_survivability");
    assert.equal(result.forecastSurvivabilityExposureLevel, "minimal");
    assert.equal(result.survivabilityReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonSurvivability, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded forecast survivability", () => {
    const result = evaluate({
      forecastNonRegressionSurvivabilityScore: 74,
      longHorizonForecastDurabilityScore: 88,
      restorationDriftSurvivabilityScore: 88,
      survivabilityReevaluationPressureScore: 20,
    });

    assert.equal(result.forecastSurvivabilityLevel, "bounded_forecast_survivability");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.forecastSurvivabilityExposureLevel, "contained");
  });

  it("classifies continuation-required survivability conditions", () => {
    const result = evaluate({
      longHorizonForecastDurabilityScore: 66,
      lineageForecastSurvivabilityScore: 66,
      explainabilitySurvivabilityScore: 66,
      survivabilityReevaluationPressureScore: 44,
    });

    assert.equal(result.forecastSurvivabilityLevel, "forecast_survivability_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.warningCodes.includes("FORECAST_SURVIVABILITY_CONTINUATION_REQUIRED"), true);
  });

  it("keeps fail-closed forecast survivability degradation supreme", () => {
    const result = evaluate({
      failClosedForecastSurvivabilityScore: 40,
      forecastNonRegressionSurvivabilityScore: 96,
      longHorizonForecastDurabilityScore: 96,
      institutionalForecastSurvivabilityScore: 96,
    });

    assert.equal(result.forecastSurvivabilityLevel, "fail_closed_forecast_survivability_degradation");
    assert.equal(result.failClosedForecastSurvivabilityDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_FORECAST_SURVIVABILITY_DEGRADATION");
  });

  it("detects collapse-sensitive forecast survivability escalation", () => {
    const result = evaluate({
      entropyAccelerationSurvivabilityScore: 94,
      failClosedForecastSurvivabilityScore: 88,
    });

    assert.equal(result.forecastSurvivabilityLevel, "collapse_sensitive_forecast_survivability");
    assert.equal(result.collapseSensitiveSurvivabilityEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_FORECAST_SURVIVABILITY"), true);
  });

  it("detects recursive forecast survivability threat", () => {
    const result = evaluate({
      recursiveForecastSurvivabilityRiskScore: 78,
      restorationDriftSurvivabilityScore: 62,
    });

    assert.equal(result.forecastSurvivabilityLevel, "forecast_survivability_unstable");
    assert.equal(result.recursiveForecastSurvivabilityThreatDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_FORECAST_SURVIVABILITY_THREAT");
  });

  it("detects entropy acceleration survivability threat", () => {
    const result = evaluate({
      entropyAccelerationSurvivabilityScore: 78,
    });

    assert.equal(result.forecastSurvivabilityLevel, "forecast_survivability_unstable");
    assert.equal(result.entropyAccelerationSurvivabilityThreatDetected, true);
    assert.equal(result.warningCodes.includes("ENTROPY_ACCELERATION_SURVIVABILITY_THREAT"), true);
  });

  it("detects projected containment survivability failure", () => {
    const result = evaluate({
      projectedContainmentSurvivabilityScore: 50,
    });

    assert.equal(result.forecastSurvivabilityLevel, "forecast_survivability_unstable");
    assert.equal(result.containmentSurvivabilityBreakdownDetected, true);
    assert.equal(result.warningCodes.includes("PROJECTED_CONTAINMENT_SURVIVABILITY_FAILURE"), true);
  });

  it("detects rollback forecast survivability weakness", () => {
    const result = evaluate({
      rollbackForecastSurvivabilityScore: 48,
      restorationDriftSurvivabilityScore: 88,
    });

    assert.equal(result.forecastSurvivabilityLevel, "forecast_survivability_degrading");
    assert.equal(result.rollbackForecastSurvivabilityWeaknessDetected, true);
    assert.equal(result.collapseSensitiveSurvivabilityEscalation, false);
    assert.equal(result.warningCodes.includes("ROLLBACK_FORECAST_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects doctrine forecast survivability weakness", () => {
    const result = evaluate({
      doctrineForecastSurvivabilityScore: 60,
    });

    assert.equal(result.forecastSurvivabilityLevel, "forecast_survivability_degrading");
    assert.equal(result.warningCodes.includes("DOCTRINE_FORECAST_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects long-horizon forecast durability weakness", () => {
    const result = evaluate({
      longHorizonForecastDurabilityScore: 60,
    });

    assert.equal(result.forecastSurvivabilityLevel, "forecast_survivability_degrading");
    assert.equal(result.warningCodes.includes("LONG_HORIZON_FORECAST_DURABILITY_WEAKNESS"), true);
  });

  it("escalates survivability reevaluation requirements", () => {
    const result = evaluate({
      survivabilityReevaluationPressureScore: 82,
    });

    assert.equal(result.survivabilityReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("FORECAST_SURVIVABILITY_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      longHorizonForecastDurabilityScore: 60,
      projectedContainmentSurvivabilityScore: 50,
      restorationDriftSurvivabilityScore: 60,
      doctrineForecastSurvivabilityScore: 60,
      rollbackForecastSurvivabilityScore: 50,
      institutionalForecastSurvivabilityScore: 60,
      lineageForecastSurvivabilityScore: 60,
      explainabilitySurvivabilityScore: 60,
      survivabilityReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "PROJECTED_CONTAINMENT_SURVIVABILITY_FAILURE",
      "ROLLBACK_FORECAST_SURVIVABILITY_WEAKNESS",
      "DOCTRINE_FORECAST_SURVIVABILITY_WEAKNESS",
      "RESTORATION_DRIFT_SURVIVABILITY_WEAKNESS",
      "INSTITUTIONAL_FORECAST_SURVIVABILITY_RISK",
      "LONG_HORIZON_FORECAST_DURABILITY_WEAKNESS",
      "LINEAGE_FORECAST_SURVIVABILITY_WEAKNESS",
      "EXPLAINABILITY_SURVIVABILITY_DECAY",
      "FORECAST_SURVIVABILITY_REEVALUATION_REQUIRED",
    ]);
  });

  it("preserves deterministic precedence ordering", () => {
    const result = evaluate({
      failClosedForecastSurvivabilityScore: 30,
      recursiveForecastSurvivabilityRiskScore: 94,
      entropyAccelerationSurvivabilityScore: 94,
      projectedContainmentSurvivabilityScore: 30,
    });

    assert.equal(result.forecastSurvivabilityLevel, "fail_closed_forecast_survivability_degradation");
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_FORECAST_SURVIVABILITY_DEGRADATION");
  });

  it("preserves explainability visibility", () => {
    const result = evaluate({
      projectedContainmentSurvivabilityScore: 50,
    });

    assert.equal(result.explainability.primarySurvivabilityDriver.length > 0, true);
    assert.equal(result.explainability.dominantSurvivabilityEscalationReason.length > 0, true);
    assert.equal(result.explainability.containmentSurvivabilityAssessment.includes("containment"), true);
    assert.equal(result.explainability.failClosedSurvivabilityAssessment.includes("Fail-closed"), true);
  });

  it("enforces bounded scores", () => {
    const result = evaluateCountyGovernanceRestorationForecastNonRegressionSurvivability({
      forecastNonRegressionSurvivabilityScore: 150,
      longHorizonForecastDurabilityScore: Number.NaN,
      failClosedForecastSurvivabilityScore: 90,
      recursiveForecastSurvivabilityRiskScore: -10,
      projectedContainmentSurvivabilityScore: 120,
      restorationDriftSurvivabilityScore: 100,
      doctrineForecastSurvivabilityScore: 100,
      rollbackForecastSurvivabilityScore: 100,
      institutionalForecastSurvivabilityScore: 100,
      entropyAccelerationSurvivabilityScore: 200,
      lineageForecastSurvivabilityScore: 100,
      explainabilitySurvivabilityScore: 100,
      survivabilityReevaluationPressureScore: 500,
    });

    assert.equal(result.forecastSurvivabilitySeverityScore >= 0 && result.forecastSurvivabilitySeverityScore <= 100, true);
    assert.equal(result.forecastSurvivabilityExposureLevel, "critical");
    assert.equal(result.survivabilityReevaluationRequirementLevel, "immediate");
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      forecastNonRegressionSurvivabilityScore: 74,
      survivabilityReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceRestorationForecastNonRegressionSurvivabilityInput = {
      ...durableInput,
      survivabilityReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceRestorationForecastNonRegressionSurvivability(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("preserves governance isolation guarantees", () => {
    const result = evaluate({
      lineageForecastSurvivabilityScore: 60,
      explainabilitySurvivabilityScore: 60,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });
});
