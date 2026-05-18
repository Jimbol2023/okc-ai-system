import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceRestorationForecastSurvivabilityContinuityIntegrity,
  type CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityInput,
} from "./county-governance-restoration-forecast-survivability-continuity-integrity-intelligence";

const durableInput: CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityInput = {
  forecastSurvivabilityContinuityIntegrityScore: 94,
  longHorizonContinuityDurabilityScore: 93,
  failClosedContinuityPreservationScore: 94,
  recursiveSurvivabilityContinuityRiskScore: 8,
  rollbackSurvivabilityContinuityScore: 90,
  projectedContainmentContinuityScore: 91,
  doctrineContinuityStabilityScore: 91,
  institutionalContinuityDurabilityScore: 92,
  entropyContinuityAccelerationScore: 8,
  lineageContinuityPreservationScore: 91,
  explainabilityContinuityDurabilityScore: 90,
  continuityReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityInput>) {
  return evaluateCountyGovernanceRestorationForecastSurvivabilityContinuityIntegrity({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceRestorationForecastSurvivabilityContinuityIntegrity>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Restoration Forecast Survivability Continuity Integrity Intelligence", () => {
  it("classifies durable forecast survivability continuity", () => {
    const result = evaluateCountyGovernanceRestorationForecastSurvivabilityContinuityIntegrity(durableInput);

    assert.equal(result.continuityIntegrityLevel, "durable_forecast_survivability_continuity");
    assert.equal(result.continuityExposureLevel, "minimal");
    assert.equal(result.continuityReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonContinuity, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded forecast survivability continuity", () => {
    const result = evaluate({
      forecastSurvivabilityContinuityIntegrityScore: 74,
      longHorizonContinuityDurabilityScore: 88,
      doctrineContinuityStabilityScore: 88,
      continuityReevaluationPressureScore: 20,
    });

    assert.equal(result.continuityIntegrityLevel, "bounded_forecast_survivability_continuity");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.continuityExposureLevel, "contained");
  });

  it("classifies continuation-required continuity conditions", () => {
    const result = evaluate({
      longHorizonContinuityDurabilityScore: 66,
      lineageContinuityPreservationScore: 66,
      explainabilityContinuityDurabilityScore: 66,
      continuityReevaluationPressureScore: 44,
    });

    assert.equal(
      result.continuityIntegrityLevel,
      "forecast_survivability_continuity_continuation_required",
    );
    assert.equal(result.continuationRequired, true);
    assert.equal(result.warningCodes.includes("FORECAST_CONTINUITY_CONTINUATION_REQUIRED"), true);
  });

  it("keeps fail-closed forecast continuity degradation supreme", () => {
    const result = evaluate({
      failClosedContinuityPreservationScore: 40,
      forecastSurvivabilityContinuityIntegrityScore: 96,
      longHorizonContinuityDurabilityScore: 96,
      institutionalContinuityDurabilityScore: 96,
    });

    assert.equal(result.continuityIntegrityLevel, "fail_closed_forecast_continuity_degradation");
    assert.equal(result.failClosedContinuityDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_FORECAST_CONTINUITY_DEGRADATION");
  });

  it("detects collapse-sensitive forecast continuity escalation", () => {
    const result = evaluate({
      entropyContinuityAccelerationScore: 94,
      failClosedContinuityPreservationScore: 88,
    });

    assert.equal(result.continuityIntegrityLevel, "collapse_sensitive_forecast_continuity");
    assert.equal(result.collapseSensitiveContinuityEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_FORECAST_CONTINUITY"), true);
  });

  it("detects recursive survivability continuity degradation", () => {
    const result = evaluate({
      recursiveSurvivabilityContinuityRiskScore: 78,
      doctrineContinuityStabilityScore: 62,
    });

    assert.equal(result.continuityIntegrityLevel, "forecast_survivability_continuity_unstable");
    assert.equal(result.recursiveContinuityDegradationDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_SURVIVABILITY_CONTINUITY_DEGRADATION");
  });

  it("detects entropy continuity acceleration", () => {
    const result = evaluate({
      entropyContinuityAccelerationScore: 78,
    });

    assert.equal(result.continuityIntegrityLevel, "forecast_survivability_continuity_unstable");
    assert.equal(result.entropyContinuityAccelerationDetected, true);
    assert.equal(result.warningCodes.includes("ENTROPY_CONTINUITY_ACCELERATION"), true);
  });

  it("detects projected containment continuity risk", () => {
    const result = evaluate({
      projectedContainmentContinuityScore: 50,
    });

    assert.equal(result.continuityIntegrityLevel, "forecast_survivability_continuity_unstable");
    assert.equal(result.containmentContinuityRiskDetected, true);
    assert.equal(result.warningCodes.includes("PROJECTED_CONTAINMENT_CONTINUITY_RISK"), true);
  });

  it("detects rollback survivability continuity weakness", () => {
    const result = evaluate({
      rollbackSurvivabilityContinuityScore: 48,
      doctrineContinuityStabilityScore: 88,
    });

    assert.equal(result.continuityIntegrityLevel, "forecast_survivability_continuity_degrading");
    assert.equal(result.rollbackContinuityWeaknessDetected, true);
    assert.equal(result.collapseSensitiveContinuityEscalation, false);
    assert.equal(result.warningCodes.includes("ROLLBACK_SURVIVABILITY_CONTINUITY_WEAKNESS"), true);
  });

  it("detects doctrine continuity drift", () => {
    const result = evaluate({
      doctrineContinuityStabilityScore: 60,
    });

    assert.equal(result.continuityIntegrityLevel, "forecast_survivability_continuity_degrading");
    assert.equal(result.warningCodes.includes("DOCTRINE_CONTINUITY_DRIFT"), true);
  });

  it("detects long-horizon continuity durability weakness", () => {
    const result = evaluate({
      longHorizonContinuityDurabilityScore: 60,
    });

    assert.equal(result.continuityIntegrityLevel, "forecast_survivability_continuity_degrading");
    assert.equal(result.warningCodes.includes("LONG_HORIZON_CONTINUITY_DURABILITY_WEAKNESS"), true);
  });

  it("escalates continuity reevaluation requirements", () => {
    const result = evaluate({
      continuityReevaluationPressureScore: 82,
    });

    assert.equal(result.continuityReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("FORECAST_CONTINUITY_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      longHorizonContinuityDurabilityScore: 60,
      projectedContainmentContinuityScore: 50,
      doctrineContinuityStabilityScore: 60,
      rollbackSurvivabilityContinuityScore: 50,
      institutionalContinuityDurabilityScore: 60,
      lineageContinuityPreservationScore: 60,
      explainabilityContinuityDurabilityScore: 60,
      continuityReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "PROJECTED_CONTAINMENT_CONTINUITY_RISK",
      "ROLLBACK_SURVIVABILITY_CONTINUITY_WEAKNESS",
      "DOCTRINE_CONTINUITY_DRIFT",
      "INSTITUTIONAL_CONTINUITY_DURABILITY_RISK",
      "LONG_HORIZON_CONTINUITY_DURABILITY_WEAKNESS",
      "LINEAGE_CONTINUITY_PRESERVATION_WEAKNESS",
      "EXPLAINABILITY_CONTINUITY_DECAY",
      "FORECAST_CONTINUITY_REEVALUATION_REQUIRED",
    ]);
  });

  it("preserves deterministic precedence ordering", () => {
    const result = evaluate({
      failClosedContinuityPreservationScore: 30,
      recursiveSurvivabilityContinuityRiskScore: 94,
      entropyContinuityAccelerationScore: 94,
      projectedContainmentContinuityScore: 30,
    });

    assert.equal(result.continuityIntegrityLevel, "fail_closed_forecast_continuity_degradation");
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_FORECAST_CONTINUITY_DEGRADATION");
  });

  it("preserves explainability visibility", () => {
    const result = evaluate({
      projectedContainmentContinuityScore: 50,
    });

    assert.equal(result.explainability.primaryContinuityDriver.length > 0, true);
    assert.equal(result.explainability.dominantContinuityEscalationReason.length > 0, true);
    assert.equal(result.explainability.containmentContinuityAssessment.includes("containment"), true);
    assert.equal(result.explainability.failClosedContinuityAssessment.includes("Fail-closed"), true);
  });

  it("enforces bounded scores", () => {
    const result = evaluateCountyGovernanceRestorationForecastSurvivabilityContinuityIntegrity({
      forecastSurvivabilityContinuityIntegrityScore: 150,
      longHorizonContinuityDurabilityScore: Number.NaN,
      failClosedContinuityPreservationScore: 90,
      recursiveSurvivabilityContinuityRiskScore: -10,
      rollbackSurvivabilityContinuityScore: 100,
      projectedContainmentContinuityScore: 120,
      doctrineContinuityStabilityScore: 100,
      institutionalContinuityDurabilityScore: 100,
      entropyContinuityAccelerationScore: 200,
      lineageContinuityPreservationScore: 100,
      explainabilityContinuityDurabilityScore: 100,
      continuityReevaluationPressureScore: 500,
    });

    assert.equal(result.continuitySeverityScore >= 0 && result.continuitySeverityScore <= 100, true);
    assert.equal(result.continuityExposureLevel, "critical");
    assert.equal(result.continuityReevaluationRequirementLevel, "immediate");
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      forecastSurvivabilityContinuityIntegrityScore: 74,
      continuityReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceRestorationForecastSurvivabilityContinuityIntegrityInput = {
      ...durableInput,
      continuityReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceRestorationForecastSurvivabilityContinuityIntegrity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("preserves governance isolation guarantees", () => {
    const result = evaluate({
      lineageContinuityPreservationScore: 60,
      explainabilityContinuityDurabilityScore: 60,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });
});
