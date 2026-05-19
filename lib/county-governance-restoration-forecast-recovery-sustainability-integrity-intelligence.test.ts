import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceRestorationForecastRecoverySustainabilityIntegrity,
  type CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityInput,
} from "./county-governance-restoration-forecast-recovery-sustainability-integrity-intelligence";

const durableInput: CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityInput = {
  forecastRecoverySustainabilityIntegrityScore: 94,
  longHorizonRecoverySustainabilityDurabilityScore: 93,
  failClosedRecoverySustainabilityPreservationScore: 94,
  recursiveRecoverySustainabilityDegradationRiskScore: 8,
  rollbackRecoverySustainabilityScore: 90,
  projectedContainmentSustainabilityScore: 91,
  doctrineSustainabilityStabilityScore: 91,
  institutionalSustainabilityDurabilityScore: 92,
  entropySustainabilityAccelerationScore: 8,
  lineageSustainabilityPreservationScore: 91,
  explainabilitySustainabilityDurabilityScore: 90,
  sustainabilityReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityInput>) {
  return evaluateCountyGovernanceRestorationForecastRecoverySustainabilityIntegrity({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceRestorationForecastRecoverySustainabilityIntegrity>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Restoration Forecast Recovery Sustainability Integrity Intelligence", () => {
  it("classifies durable forecast recovery sustainability", () => {
    const result = evaluateCountyGovernanceRestorationForecastRecoverySustainabilityIntegrity(durableInput);

    assert.equal(result.sustainabilityIntegrityLevel, "durable_forecast_recovery_sustainability");
    assert.equal(result.sustainabilityExposureLevel, "minimal");
    assert.equal(result.sustainabilityReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonSustainability, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded forecast recovery sustainability", () => {
    const result = evaluate({
      forecastRecoverySustainabilityIntegrityScore: 74,
      longHorizonRecoverySustainabilityDurabilityScore: 88,
      doctrineSustainabilityStabilityScore: 88,
      sustainabilityReevaluationPressureScore: 20,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "bounded_forecast_recovery_sustainability");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.sustainabilityExposureLevel, "contained");
  });

  it("classifies continuation-required sustainability conditions", () => {
    const result = evaluate({
      longHorizonRecoverySustainabilityDurabilityScore: 66,
      lineageSustainabilityPreservationScore: 66,
      explainabilitySustainabilityDurabilityScore: 66,
      sustainabilityReevaluationPressureScore: 44,
    });

    assert.equal(
      result.sustainabilityIntegrityLevel,
      "forecast_recovery_sustainability_continuation_required",
    );
    assert.equal(result.continuationRequired, true);
    assert.equal(result.warningCodes.includes("FORECAST_SUSTAINABILITY_CONTINUATION_REQUIRED"), true);
  });

  it("keeps fail-closed forecast sustainability degradation supreme", () => {
    const result = evaluate({
      failClosedRecoverySustainabilityPreservationScore: 40,
      forecastRecoverySustainabilityIntegrityScore: 96,
      longHorizonRecoverySustainabilityDurabilityScore: 96,
      institutionalSustainabilityDurabilityScore: 96,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "fail_closed_forecast_sustainability_degradation");
    assert.equal(result.failClosedSustainabilityDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_FORECAST_SUSTAINABILITY_DEGRADATION");
  });

  it("detects collapse-sensitive forecast sustainability escalation", () => {
    const result = evaluate({
      entropySustainabilityAccelerationScore: 94,
      failClosedRecoverySustainabilityPreservationScore: 88,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "collapse_sensitive_forecast_sustainability");
    assert.equal(result.collapseSensitiveSustainabilityEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_FORECAST_SUSTAINABILITY"), true);
  });

  it("detects recursive recovery sustainability degradation", () => {
    const result = evaluate({
      recursiveRecoverySustainabilityDegradationRiskScore: 78,
      doctrineSustainabilityStabilityScore: 62,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "forecast_recovery_sustainability_unstable");
    assert.equal(result.recursiveSustainabilityDegradationDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_RECOVERY_SUSTAINABILITY_DEGRADATION");
  });

  it("detects entropy sustainability acceleration", () => {
    const result = evaluate({
      entropySustainabilityAccelerationScore: 78,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "forecast_recovery_sustainability_unstable");
    assert.equal(result.entropySustainabilityAccelerationDetected, true);
    assert.equal(result.warningCodes.includes("ENTROPY_SUSTAINABILITY_ACCELERATION"), true);
  });

  it("detects projected containment sustainability risk", () => {
    const result = evaluate({
      projectedContainmentSustainabilityScore: 50,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "forecast_recovery_sustainability_unstable");
    assert.equal(result.containmentSustainabilityRiskDetected, true);
    assert.equal(result.warningCodes.includes("PROJECTED_CONTAINMENT_SUSTAINABILITY_RISK"), true);
  });

  it("detects rollback sustainability weakness without collapse escalation", () => {
    const result = evaluate({
      rollbackRecoverySustainabilityScore: 48,
      doctrineSustainabilityStabilityScore: 88,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "forecast_recovery_sustainability_degrading");
    assert.equal(result.rollbackSustainabilityWeaknessDetected, true);
    assert.equal(result.collapseSensitiveSustainabilityEscalation, false);
    assert.equal(result.warningCodes.includes("ROLLBACK_SUSTAINABILITY_WEAKNESS"), true);
  });

  it("detects doctrine sustainability drift", () => {
    const result = evaluate({
      doctrineSustainabilityStabilityScore: 60,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "forecast_recovery_sustainability_degrading");
    assert.equal(result.warningCodes.includes("DOCTRINE_SUSTAINABILITY_DRIFT"), true);
  });

  it("detects institutional sustainability durability risk", () => {
    const result = evaluate({
      institutionalSustainabilityDurabilityScore: 60,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "forecast_recovery_sustainability_degrading");
    assert.equal(result.warningCodes.includes("INSTITUTIONAL_SUSTAINABILITY_DURABILITY_RISK"), true);
  });

  it("detects long-horizon sustainability durability weakness", () => {
    const result = evaluate({
      longHorizonRecoverySustainabilityDurabilityScore: 60,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "forecast_recovery_sustainability_degrading");
    assert.equal(result.warningCodes.includes("LONG_HORIZON_SUSTAINABILITY_DURABILITY_WEAKNESS"), true);
  });

  it("detects lineage sustainability preservation weakness", () => {
    const result = evaluate({
      lineageSustainabilityPreservationScore: 60,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "forecast_recovery_sustainability_degrading");
    assert.equal(result.warningCodes.includes("LINEAGE_SUSTAINABILITY_PRESERVATION_WEAKNESS"), true);
  });

  it("detects explainability sustainability decay", () => {
    const result = evaluate({
      explainabilitySustainabilityDurabilityScore: 60,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "forecast_recovery_sustainability_degrading");
    assert.equal(result.warningCodes.includes("EXPLAINABILITY_SUSTAINABILITY_DECAY"), true);
  });

  it("escalates sustainability reevaluation requirements", () => {
    const result = evaluate({
      sustainabilityReevaluationPressureScore: 82,
    });

    assert.equal(result.sustainabilityReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("FORECAST_SUSTAINABILITY_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      longHorizonRecoverySustainabilityDurabilityScore: 60,
      projectedContainmentSustainabilityScore: 50,
      doctrineSustainabilityStabilityScore: 60,
      rollbackRecoverySustainabilityScore: 50,
      institutionalSustainabilityDurabilityScore: 60,
      lineageSustainabilityPreservationScore: 60,
      explainabilitySustainabilityDurabilityScore: 60,
      sustainabilityReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "PROJECTED_CONTAINMENT_SUSTAINABILITY_RISK",
      "ROLLBACK_SUSTAINABILITY_WEAKNESS",
      "DOCTRINE_SUSTAINABILITY_DRIFT",
      "INSTITUTIONAL_SUSTAINABILITY_DURABILITY_RISK",
      "LONG_HORIZON_SUSTAINABILITY_DURABILITY_WEAKNESS",
      "LINEAGE_SUSTAINABILITY_PRESERVATION_WEAKNESS",
      "EXPLAINABILITY_SUSTAINABILITY_DECAY",
      "FORECAST_SUSTAINABILITY_REEVALUATION_REQUIRED",
    ]);
  });

  it("preserves deterministic precedence ordering", () => {
    const result = evaluate({
      failClosedRecoverySustainabilityPreservationScore: 30,
      recursiveRecoverySustainabilityDegradationRiskScore: 94,
      entropySustainabilityAccelerationScore: 94,
      projectedContainmentSustainabilityScore: 30,
    });

    assert.equal(result.sustainabilityIntegrityLevel, "fail_closed_forecast_sustainability_degradation");
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_FORECAST_SUSTAINABILITY_DEGRADATION");
  });

  it("preserves explainability visibility", () => {
    const result = evaluate({
      projectedContainmentSustainabilityScore: 50,
    });

    assert.equal(result.explainability.primarySustainabilityDriver.length > 0, true);
    assert.equal(result.explainability.dominantSustainabilityEscalationReason.length > 0, true);
    assert.equal(result.explainability.containmentSustainabilityAssessment.includes("containment"), true);
    assert.equal(result.explainability.failClosedSustainabilityAssessment.includes("Fail-closed"), true);
  });

  it("enforces bounded scores", () => {
    const result = evaluateCountyGovernanceRestorationForecastRecoverySustainabilityIntegrity({
      forecastRecoverySustainabilityIntegrityScore: 150,
      longHorizonRecoverySustainabilityDurabilityScore: Number.NaN,
      failClosedRecoverySustainabilityPreservationScore: 90,
      recursiveRecoverySustainabilityDegradationRiskScore: -10,
      rollbackRecoverySustainabilityScore: 100,
      projectedContainmentSustainabilityScore: 120,
      doctrineSustainabilityStabilityScore: 100,
      institutionalSustainabilityDurabilityScore: 100,
      entropySustainabilityAccelerationScore: 200,
      lineageSustainabilityPreservationScore: 100,
      explainabilitySustainabilityDurabilityScore: 100,
      sustainabilityReevaluationPressureScore: 500,
    });

    assert.equal(result.sustainabilitySeverityScore >= 0 && result.sustainabilitySeverityScore <= 100, true);
    assert.equal(result.sustainabilityExposureLevel, "critical");
    assert.equal(result.sustainabilityReevaluationRequirementLevel, "immediate");
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      forecastRecoverySustainabilityIntegrityScore: 74,
      sustainabilityReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceRestorationForecastRecoverySustainabilityIntegrityInput = {
      ...durableInput,
      sustainabilityReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceRestorationForecastRecoverySustainabilityIntegrity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("preserves governance isolation guarantees", () => {
    const result = evaluate({
      lineageSustainabilityPreservationScore: 60,
      explainabilitySustainabilityDurabilityScore: 60,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });
});
