import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceRestorationForecastContinuityResilienceIntegrity,
  type CountyGovernanceRestorationForecastContinuityResilienceIntegrityInput,
} from "./county-governance-restoration-forecast-continuity-resilience-integrity-intelligence";

const durableInput: CountyGovernanceRestorationForecastContinuityResilienceIntegrityInput = {
  forecastContinuityResilienceIntegrityScore: 94,
  longHorizonResilienceDurabilityScore: 93,
  failClosedResiliencePreservationScore: 94,
  recursiveContinuityResilienceRiskScore: 8,
  rollbackContinuityResilienceScore: 90,
  projectedContainmentResilienceScore: 91,
  doctrineResilienceStabilityScore: 91,
  institutionalResilienceDurabilityScore: 92,
  entropyResilienceAccelerationScore: 8,
  lineageResiliencePreservationScore: 91,
  explainabilityResilienceDurabilityScore: 90,
  resilienceReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceRestorationForecastContinuityResilienceIntegrityInput>) {
  return evaluateCountyGovernanceRestorationForecastContinuityResilienceIntegrity({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceRestorationForecastContinuityResilienceIntegrity>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Restoration Forecast Continuity Resilience Integrity Intelligence", () => {
  it("classifies durable forecast continuity resilience", () => {
    const result = evaluateCountyGovernanceRestorationForecastContinuityResilienceIntegrity(durableInput);

    assert.equal(result.resilienceIntegrityLevel, "durable_forecast_continuity_resilience");
    assert.equal(result.resilienceExposureLevel, "minimal");
    assert.equal(result.resilienceReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonResilience, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded forecast continuity resilience", () => {
    const result = evaluate({
      forecastContinuityResilienceIntegrityScore: 74,
      longHorizonResilienceDurabilityScore: 88,
      doctrineResilienceStabilityScore: 88,
      resilienceReevaluationPressureScore: 20,
    });

    assert.equal(result.resilienceIntegrityLevel, "bounded_forecast_continuity_resilience");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.resilienceExposureLevel, "contained");
  });

  it("classifies continuation-required resilience conditions", () => {
    const result = evaluate({
      longHorizonResilienceDurabilityScore: 66,
      lineageResiliencePreservationScore: 66,
      explainabilityResilienceDurabilityScore: 66,
      resilienceReevaluationPressureScore: 44,
    });

    assert.equal(
      result.resilienceIntegrityLevel,
      "forecast_continuity_resilience_continuation_required",
    );
    assert.equal(result.continuationRequired, true);
    assert.equal(result.warningCodes.includes("FORECAST_RESILIENCE_CONTINUATION_REQUIRED"), true);
  });

  it("keeps fail-closed forecast resilience degradation supreme", () => {
    const result = evaluate({
      failClosedResiliencePreservationScore: 40,
      forecastContinuityResilienceIntegrityScore: 96,
      longHorizonResilienceDurabilityScore: 96,
      institutionalResilienceDurabilityScore: 96,
    });

    assert.equal(result.resilienceIntegrityLevel, "fail_closed_forecast_resilience_degradation");
    assert.equal(result.failClosedResilienceDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_FORECAST_RESILIENCE_DEGRADATION");
  });

  it("detects collapse-sensitive forecast resilience escalation", () => {
    const result = evaluate({
      entropyResilienceAccelerationScore: 94,
      failClosedResiliencePreservationScore: 88,
    });

    assert.equal(result.resilienceIntegrityLevel, "collapse_sensitive_forecast_resilience");
    assert.equal(result.collapseSensitiveResilienceEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_FORECAST_RESILIENCE"), true);
  });

  it("detects recursive continuity resilience degradation", () => {
    const result = evaluate({
      recursiveContinuityResilienceRiskScore: 78,
      doctrineResilienceStabilityScore: 62,
    });

    assert.equal(result.resilienceIntegrityLevel, "forecast_continuity_resilience_unstable");
    assert.equal(result.recursiveResilienceDegradationDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_CONTINUITY_RESILIENCE_DEGRADATION");
  });

  it("detects entropy resilience acceleration", () => {
    const result = evaluate({
      entropyResilienceAccelerationScore: 78,
    });

    assert.equal(result.resilienceIntegrityLevel, "forecast_continuity_resilience_unstable");
    assert.equal(result.entropyResilienceAccelerationDetected, true);
    assert.equal(result.warningCodes.includes("ENTROPY_RESILIENCE_ACCELERATION"), true);
  });

  it("detects projected containment resilience risk", () => {
    const result = evaluate({
      projectedContainmentResilienceScore: 50,
    });

    assert.equal(result.resilienceIntegrityLevel, "forecast_continuity_resilience_unstable");
    assert.equal(result.containmentResilienceRiskDetected, true);
    assert.equal(result.warningCodes.includes("PROJECTED_CONTAINMENT_RESILIENCE_RISK"), true);
  });

  it("detects rollback continuity resilience weakness", () => {
    const result = evaluate({
      rollbackContinuityResilienceScore: 48,
      doctrineResilienceStabilityScore: 88,
    });

    assert.equal(result.resilienceIntegrityLevel, "forecast_continuity_resilience_degrading");
    assert.equal(result.rollbackResilienceWeaknessDetected, true);
    assert.equal(result.collapseSensitiveResilienceEscalation, false);
    assert.equal(result.warningCodes.includes("ROLLBACK_CONTINUITY_RESILIENCE_WEAKNESS"), true);
  });

  it("detects doctrine resilience drift", () => {
    const result = evaluate({
      doctrineResilienceStabilityScore: 60,
    });

    assert.equal(result.resilienceIntegrityLevel, "forecast_continuity_resilience_degrading");
    assert.equal(result.warningCodes.includes("DOCTRINE_RESILIENCE_DRIFT"), true);
  });

  it("detects long-horizon resilience durability weakness", () => {
    const result = evaluate({
      longHorizonResilienceDurabilityScore: 60,
    });

    assert.equal(result.resilienceIntegrityLevel, "forecast_continuity_resilience_degrading");
    assert.equal(result.warningCodes.includes("LONG_HORIZON_RESILIENCE_DURABILITY_WEAKNESS"), true);
  });

  it("escalates resilience reevaluation requirements", () => {
    const result = evaluate({
      resilienceReevaluationPressureScore: 82,
    });

    assert.equal(result.resilienceReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("FORECAST_RESILIENCE_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      longHorizonResilienceDurabilityScore: 60,
      projectedContainmentResilienceScore: 50,
      doctrineResilienceStabilityScore: 60,
      rollbackContinuityResilienceScore: 50,
      institutionalResilienceDurabilityScore: 60,
      lineageResiliencePreservationScore: 60,
      explainabilityResilienceDurabilityScore: 60,
      resilienceReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "PROJECTED_CONTAINMENT_RESILIENCE_RISK",
      "ROLLBACK_CONTINUITY_RESILIENCE_WEAKNESS",
      "DOCTRINE_RESILIENCE_DRIFT",
      "INSTITUTIONAL_RESILIENCE_DURABILITY_RISK",
      "LONG_HORIZON_RESILIENCE_DURABILITY_WEAKNESS",
      "LINEAGE_RESILIENCE_PRESERVATION_WEAKNESS",
      "EXPLAINABILITY_RESILIENCE_DECAY",
      "FORECAST_RESILIENCE_REEVALUATION_REQUIRED",
    ]);
  });

  it("preserves deterministic precedence ordering", () => {
    const result = evaluate({
      failClosedResiliencePreservationScore: 30,
      recursiveContinuityResilienceRiskScore: 94,
      entropyResilienceAccelerationScore: 94,
      projectedContainmentResilienceScore: 30,
    });

    assert.equal(result.resilienceIntegrityLevel, "fail_closed_forecast_resilience_degradation");
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_FORECAST_RESILIENCE_DEGRADATION");
  });

  it("preserves explainability visibility", () => {
    const result = evaluate({
      projectedContainmentResilienceScore: 50,
    });

    assert.equal(result.explainability.primaryResilienceDriver.length > 0, true);
    assert.equal(result.explainability.dominantResilienceEscalationReason.length > 0, true);
    assert.equal(result.explainability.containmentResilienceAssessment.includes("containment"), true);
    assert.equal(result.explainability.failClosedResilienceAssessment.includes("Fail-closed"), true);
  });

  it("enforces bounded scores", () => {
    const result = evaluateCountyGovernanceRestorationForecastContinuityResilienceIntegrity({
      forecastContinuityResilienceIntegrityScore: 150,
      longHorizonResilienceDurabilityScore: Number.NaN,
      failClosedResiliencePreservationScore: 90,
      recursiveContinuityResilienceRiskScore: -10,
      rollbackContinuityResilienceScore: 100,
      projectedContainmentResilienceScore: 120,
      doctrineResilienceStabilityScore: 100,
      institutionalResilienceDurabilityScore: 100,
      entropyResilienceAccelerationScore: 200,
      lineageResiliencePreservationScore: 100,
      explainabilityResilienceDurabilityScore: 100,
      resilienceReevaluationPressureScore: 500,
    });

    assert.equal(result.resilienceSeverityScore >= 0 && result.resilienceSeverityScore <= 100, true);
    assert.equal(result.resilienceExposureLevel, "critical");
    assert.equal(result.resilienceReevaluationRequirementLevel, "immediate");
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      forecastContinuityResilienceIntegrityScore: 74,
      resilienceReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceRestorationForecastContinuityResilienceIntegrityInput = {
      ...durableInput,
      resilienceReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceRestorationForecastContinuityResilienceIntegrity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("preserves governance isolation guarantees", () => {
    const result = evaluate({
      lineageResiliencePreservationScore: 60,
      explainabilityResilienceDurabilityScore: 60,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });
});
