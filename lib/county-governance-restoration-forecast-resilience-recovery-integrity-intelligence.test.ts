import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceRestorationForecastResilienceRecoveryIntegrity,
  type CountyGovernanceRestorationForecastResilienceRecoveryIntegrityInput,
} from "./county-governance-restoration-forecast-resilience-recovery-integrity-intelligence";

const durableInput: CountyGovernanceRestorationForecastResilienceRecoveryIntegrityInput = {
  forecastResilienceRecoveryIntegrityScore: 94,
  longHorizonRecoveryDurabilityScore: 93,
  failClosedRecoveryPreservationScore: 94,
  recursiveResilienceRecoveryDegradationRiskScore: 8,
  rollbackRecoveryIntegrityScore: 90,
  projectedContainmentRecoveryScore: 91,
  doctrineRecoveryStabilityScore: 91,
  institutionalRecoveryDurabilityScore: 92,
  entropyRecoveryAccelerationScore: 8,
  lineageRecoveryPreservationScore: 91,
  explainabilityRecoveryDurabilityScore: 90,
  recoveryReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceRestorationForecastResilienceRecoveryIntegrityInput>) {
  return evaluateCountyGovernanceRestorationForecastResilienceRecoveryIntegrity({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceRestorationForecastResilienceRecoveryIntegrity>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Restoration Forecast Resilience Recovery Integrity Intelligence", () => {
  it("classifies durable forecast resilience recovery", () => {
    const result = evaluateCountyGovernanceRestorationForecastResilienceRecoveryIntegrity(durableInput);

    assert.equal(result.recoveryIntegrityLevel, "durable_forecast_resilience_recovery");
    assert.equal(result.recoveryExposureLevel, "minimal");
    assert.equal(result.recoveryReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonRecovery, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded forecast resilience recovery", () => {
    const result = evaluate({
      forecastResilienceRecoveryIntegrityScore: 74,
      longHorizonRecoveryDurabilityScore: 88,
      doctrineRecoveryStabilityScore: 88,
      recoveryReevaluationPressureScore: 20,
    });

    assert.equal(result.recoveryIntegrityLevel, "bounded_forecast_resilience_recovery");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.recoveryExposureLevel, "contained");
  });

  it("classifies continuation-required recovery conditions", () => {
    const result = evaluate({
      longHorizonRecoveryDurabilityScore: 66,
      lineageRecoveryPreservationScore: 66,
      explainabilityRecoveryDurabilityScore: 66,
      recoveryReevaluationPressureScore: 44,
    });

    assert.equal(
      result.recoveryIntegrityLevel,
      "forecast_resilience_recovery_continuation_required",
    );
    assert.equal(result.continuationRequired, true);
    assert.equal(result.warningCodes.includes("FORECAST_RECOVERY_CONTINUATION_REQUIRED"), true);
  });

  it("keeps fail-closed forecast recovery degradation supreme", () => {
    const result = evaluate({
      failClosedRecoveryPreservationScore: 40,
      forecastResilienceRecoveryIntegrityScore: 96,
      longHorizonRecoveryDurabilityScore: 96,
      institutionalRecoveryDurabilityScore: 96,
    });

    assert.equal(result.recoveryIntegrityLevel, "fail_closed_forecast_recovery_degradation");
    assert.equal(result.failClosedRecoveryDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_FORECAST_RECOVERY_DEGRADATION");
  });

  it("detects collapse-sensitive forecast recovery escalation", () => {
    const result = evaluate({
      entropyRecoveryAccelerationScore: 94,
      failClosedRecoveryPreservationScore: 88,
    });

    assert.equal(result.recoveryIntegrityLevel, "collapse_sensitive_forecast_recovery");
    assert.equal(result.collapseSensitiveRecoveryEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_FORECAST_RECOVERY"), true);
  });

  it("detects recursive resilience recovery degradation", () => {
    const result = evaluate({
      recursiveResilienceRecoveryDegradationRiskScore: 78,
      doctrineRecoveryStabilityScore: 62,
    });

    assert.equal(result.recoveryIntegrityLevel, "forecast_resilience_recovery_unstable");
    assert.equal(result.recursiveRecoveryDegradationDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_RESILIENCE_RECOVERY_DEGRADATION");
  });

  it("detects entropy recovery acceleration", () => {
    const result = evaluate({
      entropyRecoveryAccelerationScore: 78,
    });

    assert.equal(result.recoveryIntegrityLevel, "forecast_resilience_recovery_unstable");
    assert.equal(result.entropyRecoveryAccelerationDetected, true);
    assert.equal(result.warningCodes.includes("ENTROPY_RECOVERY_ACCELERATION"), true);
  });

  it("detects projected containment recovery risk", () => {
    const result = evaluate({
      projectedContainmentRecoveryScore: 50,
    });

    assert.equal(result.recoveryIntegrityLevel, "forecast_resilience_recovery_unstable");
    assert.equal(result.containmentRecoveryRiskDetected, true);
    assert.equal(result.warningCodes.includes("PROJECTED_CONTAINMENT_RECOVERY_RISK"), true);
  });

  it("detects rollback recovery weakness without collapse escalation", () => {
    const result = evaluate({
      rollbackRecoveryIntegrityScore: 48,
      doctrineRecoveryStabilityScore: 88,
    });

    assert.equal(result.recoveryIntegrityLevel, "forecast_resilience_recovery_degrading");
    assert.equal(result.rollbackRecoveryWeaknessDetected, true);
    assert.equal(result.collapseSensitiveRecoveryEscalation, false);
    assert.equal(result.warningCodes.includes("ROLLBACK_RECOVERY_WEAKNESS"), true);
  });

  it("detects doctrine recovery drift", () => {
    const result = evaluate({
      doctrineRecoveryStabilityScore: 60,
    });

    assert.equal(result.recoveryIntegrityLevel, "forecast_resilience_recovery_degrading");
    assert.equal(result.warningCodes.includes("DOCTRINE_RECOVERY_DRIFT"), true);
  });

  it("detects long-horizon recovery durability weakness", () => {
    const result = evaluate({
      longHorizonRecoveryDurabilityScore: 60,
    });

    assert.equal(result.recoveryIntegrityLevel, "forecast_resilience_recovery_degrading");
    assert.equal(result.warningCodes.includes("LONG_HORIZON_RECOVERY_DURABILITY_WEAKNESS"), true);
  });

  it("detects lineage recovery preservation weakness", () => {
    const result = evaluate({
      lineageRecoveryPreservationScore: 60,
    });

    assert.equal(result.recoveryIntegrityLevel, "forecast_resilience_recovery_degrading");
    assert.equal(result.warningCodes.includes("LINEAGE_RECOVERY_PRESERVATION_WEAKNESS"), true);
  });

  it("detects explainability recovery decay", () => {
    const result = evaluate({
      explainabilityRecoveryDurabilityScore: 60,
    });

    assert.equal(result.recoveryIntegrityLevel, "forecast_resilience_recovery_degrading");
    assert.equal(result.warningCodes.includes("EXPLAINABILITY_RECOVERY_DECAY"), true);
  });

  it("escalates recovery reevaluation requirements", () => {
    const result = evaluate({
      recoveryReevaluationPressureScore: 82,
    });

    assert.equal(result.recoveryReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("FORECAST_RECOVERY_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      longHorizonRecoveryDurabilityScore: 60,
      projectedContainmentRecoveryScore: 50,
      doctrineRecoveryStabilityScore: 60,
      rollbackRecoveryIntegrityScore: 50,
      institutionalRecoveryDurabilityScore: 60,
      lineageRecoveryPreservationScore: 60,
      explainabilityRecoveryDurabilityScore: 60,
      recoveryReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "PROJECTED_CONTAINMENT_RECOVERY_RISK",
      "ROLLBACK_RECOVERY_WEAKNESS",
      "DOCTRINE_RECOVERY_DRIFT",
      "INSTITUTIONAL_RECOVERY_DURABILITY_RISK",
      "LONG_HORIZON_RECOVERY_DURABILITY_WEAKNESS",
      "LINEAGE_RECOVERY_PRESERVATION_WEAKNESS",
      "EXPLAINABILITY_RECOVERY_DECAY",
      "FORECAST_RECOVERY_REEVALUATION_REQUIRED",
    ]);
  });

  it("preserves deterministic precedence ordering", () => {
    const result = evaluate({
      failClosedRecoveryPreservationScore: 30,
      recursiveResilienceRecoveryDegradationRiskScore: 94,
      entropyRecoveryAccelerationScore: 94,
      projectedContainmentRecoveryScore: 30,
    });

    assert.equal(result.recoveryIntegrityLevel, "fail_closed_forecast_recovery_degradation");
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_FORECAST_RECOVERY_DEGRADATION");
  });

  it("preserves explainability visibility", () => {
    const result = evaluate({
      projectedContainmentRecoveryScore: 50,
    });

    assert.equal(result.explainability.primaryRecoveryDriver.length > 0, true);
    assert.equal(result.explainability.dominantRecoveryEscalationReason.length > 0, true);
    assert.equal(result.explainability.containmentRecoveryAssessment.includes("containment"), true);
    assert.equal(result.explainability.failClosedRecoveryAssessment.includes("Fail-closed"), true);
  });

  it("enforces bounded scores", () => {
    const result = evaluateCountyGovernanceRestorationForecastResilienceRecoveryIntegrity({
      forecastResilienceRecoveryIntegrityScore: 150,
      longHorizonRecoveryDurabilityScore: Number.NaN,
      failClosedRecoveryPreservationScore: 90,
      recursiveResilienceRecoveryDegradationRiskScore: -10,
      rollbackRecoveryIntegrityScore: 100,
      projectedContainmentRecoveryScore: 120,
      doctrineRecoveryStabilityScore: 100,
      institutionalRecoveryDurabilityScore: 100,
      entropyRecoveryAccelerationScore: 200,
      lineageRecoveryPreservationScore: 100,
      explainabilityRecoveryDurabilityScore: 100,
      recoveryReevaluationPressureScore: 500,
    });

    assert.equal(result.recoverySeverityScore >= 0 && result.recoverySeverityScore <= 100, true);
    assert.equal(result.recoveryExposureLevel, "critical");
    assert.equal(result.recoveryReevaluationRequirementLevel, "immediate");
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      forecastResilienceRecoveryIntegrityScore: 74,
      recoveryReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceRestorationForecastResilienceRecoveryIntegrityInput = {
      ...durableInput,
      recoveryReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceRestorationForecastResilienceRecoveryIntegrity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("preserves governance isolation guarantees", () => {
    const result = evaluate({
      lineageRecoveryPreservationScore: 60,
      explainabilityRecoveryDurabilityScore: 60,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });
});
