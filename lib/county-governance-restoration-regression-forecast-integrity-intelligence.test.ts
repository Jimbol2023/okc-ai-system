import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceRestorationRegressionForecastIntegrity,
  type CountyGovernanceRestorationRegressionForecastIntegrityInput,
} from "./county-governance-restoration-regression-forecast-integrity-intelligence";

const stableInput: CountyGovernanceRestorationRegressionForecastIntegrityInput = {
  restorationForecastStabilityScore: 94,
  failClosedForecastIntegrityScore: 94,
  recursiveRegressionForecastExposureScore: 8,
  survivabilityContainmentForecastScore: 90,
  continuityForecastDurabilityScore: 92,
  doctrineForecastConsistencyScore: 91,
  rollbackForecastStabilityScore: 90,
  restorationDriftTrajectoryScore: 10,
  institutionalForecastDurabilityScore: 91,
  nonRegressionForecastConfidenceScore: 92,
  sustainabilityForecastIntegrityScore: 91,
  lineageContinuityForecastScore: 90,
  governanceEntropyAccelerationScore: 8,
  containmentBreakdownForecastScore: 9,
  forecastExplainabilityDurabilityScore: 90,
  reevaluationPressureForecastScore: 10,
};

function evaluate(input: Partial<CountyGovernanceRestorationRegressionForecastIntegrityInput>) {
  return evaluateCountyGovernanceRestorationRegressionForecastIntegrity({
    ...stableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceRestorationRegressionForecastIntegrity>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Restoration Regression Forecast Integrity Intelligence", () => {
  it("classifies stable forecast integrity", () => {
    const result = evaluateCountyGovernanceRestorationRegressionForecastIntegrity(stableInput);

    assert.equal(result.forecastIntegrityLevel, "stable_forecast_integrity");
    assert.equal(result.forecastExposureLevel, "minimal");
    assert.equal(result.forecastReevaluationRequirementLevel, "none");
    assert.equal(result.forecastSustainability, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded forecast regression risk", () => {
    const result = evaluate({
      restorationForecastStabilityScore: 74,
      restorationDriftTrajectoryScore: 24,
      governanceEntropyAccelerationScore: 20,
      reevaluationPressureForecastScore: 20,
    });

    assert.equal(result.forecastIntegrityLevel, "bounded_forecast_regression_risk");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.forecastExposureLevel, "contained");
  });

  it("classifies forecast continuation-required paths", () => {
    const result = evaluate({
      continuityForecastDurabilityScore: 62,
      lineageContinuityForecastScore: 62,
      nonRegressionForecastConfidenceScore: 62,
      forecastExplainabilityDurabilityScore: 62,
      reevaluationPressureForecastScore: 44,
      restorationDriftTrajectoryScore: 40,
    });

    assert.equal(result.forecastIntegrityLevel, "forecast_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.warningCodes.includes("FORECAST_CONTINUATION_REQUIRED"), true);
  });

  it("keeps fail-closed forecast degradation supreme", () => {
    const result = evaluate({
      failClosedForecastIntegrityScore: 40,
      continuityForecastDurabilityScore: 96,
      restorationForecastStabilityScore: 96,
      nonRegressionForecastConfidenceScore: 96,
    });

    assert.equal(result.forecastIntegrityLevel, "forecast_fail_closed_degradation");
    assert.equal(result.failClosedForecastDegrading, true);
    assert.equal(result.warningCodes[0], "FORECAST_FAIL_CLOSED_DEGRADATION");
  });

  it("detects collapse-sensitive forecast escalation", () => {
    const result = evaluate({
      governanceEntropyAccelerationScore: 94,
      failClosedForecastIntegrityScore: 88,
    });

    assert.equal(result.forecastIntegrityLevel, "forecast_collapse_sensitive");
    assert.equal(result.collapseSensitiveForecastEscalation, true);
    assert.equal(result.warningCodes.includes("FORECAST_COLLAPSE_SENSITIVE_ESCALATION"), true);
  });

  it("detects recursive forecast amplification", () => {
    const result = evaluate({
      recursiveRegressionForecastExposureScore: 78,
      restorationDriftTrajectoryScore: 58,
    });

    assert.equal(result.forecastIntegrityLevel, "forecast_regression_escalating");
    assert.equal(result.recursiveForecastAmplificationDetected, true);
    assert.equal(result.warningCodes[0], "FORECAST_RECURSIVE_REGRESSION_AMPLIFICATION");
  });

  it("detects entropy acceleration", () => {
    const result = evaluate({
      governanceEntropyAccelerationScore: 78,
    });

    assert.equal(result.forecastIntegrityLevel, "forecast_regression_escalating");
    assert.equal(result.entropyAccelerationDetected, true);
    assert.equal(result.warningCodes.includes("FORECAST_ENTROPY_ACCELERATION"), true);
  });

  it("detects containment breakdown forecast", () => {
    const result = evaluate({
      containmentBreakdownForecastScore: 78,
    });

    assert.equal(result.forecastIntegrityLevel, "forecast_regression_escalating");
    assert.equal(result.containmentBreakdownForecastDetected, true);
    assert.equal(result.warningCodes.includes("FORECAST_CONTAINMENT_BREAKDOWN"), true);
  });

  it("detects rollback forecast instability without treating it as collapse", () => {
    const result = evaluate({
      rollbackForecastStabilityScore: 48,
      restorationForecastStabilityScore: 82,
      doctrineForecastConsistencyScore: 78,
      restorationDriftTrajectoryScore: 30,
    });

    assert.equal(result.forecastIntegrityLevel, "forecast_restoration_instability");
    assert.equal(result.rollbackForecastInstabilityDetected, true);
    assert.equal(result.collapseSensitiveForecastEscalation, false);
    assert.equal(result.warningCodes.includes("FORECAST_ROLLBACK_INSTABILITY"), true);
  });

  it("detects doctrine forecast divergence", () => {
    const result = evaluate({
      doctrineForecastConsistencyScore: 60,
    });

    assert.equal(result.forecastIntegrityLevel, "forecast_restoration_instability");
    assert.equal(result.warningCodes.includes("FORECAST_DOCTRINE_DIVERGENCE"), true);
  });

  it("detects restoration drift trajectory risk", () => {
    const result = evaluate({
      restorationDriftTrajectoryScore: 68,
    });

    assert.equal(result.forecastIntegrityLevel, "forecast_restoration_instability");
    assert.equal(result.warningCodes.includes("FORECAST_RESTORATION_DRIFT_TRAJECTORY"), true);
  });

  it("detects survivability containment forecast weakness", () => {
    const result = evaluate({
      survivabilityContainmentForecastScore: 50,
    });

    assert.equal(result.forecastIntegrityLevel, "forecast_restoration_instability");
    assert.equal(result.warningCodes.includes("FORECAST_SURVIVABILITY_CONTAINMENT_WEAKNESS"), true);
  });

  it("escalates reevaluation requirements", () => {
    const result = evaluate({
      reevaluationPressureForecastScore: 82,
    });

    assert.equal(result.forecastReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("FORECAST_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      continuityForecastDurabilityScore: 50,
      survivabilityContainmentForecastScore: 50,
      doctrineForecastConsistencyScore: 50,
      rollbackForecastStabilityScore: 50,
      restorationDriftTrajectoryScore: 70,
      institutionalForecastDurabilityScore: 50,
      nonRegressionForecastConfidenceScore: 50,
      sustainabilityForecastIntegrityScore: 50,
      lineageContinuityForecastScore: 50,
      governanceEntropyAccelerationScore: 70,
      containmentBreakdownForecastScore: 70,
      forecastExplainabilityDurabilityScore: 50,
      reevaluationPressureForecastScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "FORECAST_ENTROPY_ACCELERATION",
      "FORECAST_CONTAINMENT_BREAKDOWN",
      "FORECAST_RESTORATION_INSTABILITY",
      "FORECAST_ROLLBACK_INSTABILITY",
      "FORECAST_DOCTRINE_DIVERGENCE",
      "FORECAST_RESTORATION_DRIFT_TRAJECTORY",
      "FORECAST_SURVIVABILITY_CONTAINMENT_WEAKNESS",
      "FORECAST_CONTINUITY_DECAY_RISK",
      "FORECAST_LINEAGE_CONTINUITY_WEAKNESS",
      "FORECAST_NON_REGRESSION_CONFIDENCE_WEAKNESS",
      "FORECAST_EXPLAINABILITY_DECAY",
      "FORECAST_SUSTAINABILITY_DEGRADATION",
      "FORECAST_REEVALUATION_REQUIRED",
      "FORECAST_RESTORATION_REGRESSION_EXPOSURE",
      "FORECAST_INSTITUTIONAL_REGRESSION_RISK",
    ]);
  });

  it("preserves deterministic precedence ordering", () => {
    const result = evaluate({
      failClosedForecastIntegrityScore: 30,
      recursiveRegressionForecastExposureScore: 94,
      governanceEntropyAccelerationScore: 94,
      containmentBreakdownForecastScore: 94,
    });

    assert.equal(result.forecastIntegrityLevel, "forecast_fail_closed_degradation");
    assert.equal(result.warningCodes[0], "FORECAST_FAIL_CLOSED_DEGRADATION");
  });

  it("preserves explainability visibility", () => {
    const result = evaluate({
      containmentBreakdownForecastScore: 78,
    });

    assert.equal(result.explainability.primaryForecastDriver.length > 0, true);
    assert.equal(result.explainability.dominantForecastEscalationReason.length > 0, true);
    assert.equal(result.explainability.containmentForecastAssessment.includes("containment"), true);
    assert.equal(result.explainability.entropyTrajectoryAssessment.includes("entropy"), true);
  });

  it("enforces bounded scores", () => {
    const result = evaluateCountyGovernanceRestorationRegressionForecastIntegrity({
      restorationForecastStabilityScore: 150,
      failClosedForecastIntegrityScore: 90,
      recursiveRegressionForecastExposureScore: -10,
      survivabilityContainmentForecastScore: Number.NaN,
      continuityForecastDurabilityScore: 120,
      doctrineForecastConsistencyScore: 100,
      rollbackForecastStabilityScore: 100,
      restorationDriftTrajectoryScore: 500,
      institutionalForecastDurabilityScore: 100,
      nonRegressionForecastConfidenceScore: 100,
      sustainabilityForecastIntegrityScore: 100,
      lineageContinuityForecastScore: 100,
      governanceEntropyAccelerationScore: 200,
      containmentBreakdownForecastScore: 200,
      forecastExplainabilityDurabilityScore: 100,
      reevaluationPressureForecastScore: 200,
    });

    assert.equal(result.forecastSeverityScore >= 0 && result.forecastSeverityScore <= 100, true);
    assert.equal(result.forecastExposureLevel, "critical");
    assert.equal(result.forecastReevaluationRequirementLevel, "immediate");
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      restorationForecastStabilityScore: 74,
      restorationDriftTrajectoryScore: 44,
      reevaluationPressureForecastScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceRestorationRegressionForecastIntegrityInput = {
      ...stableInput,
      restorationDriftTrajectoryScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceRestorationRegressionForecastIntegrity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("preserves governance isolation guarantees", () => {
    const result = evaluate({
      continuityForecastDurabilityScore: 60,
      lineageContinuityForecastScore: 60,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });
});
