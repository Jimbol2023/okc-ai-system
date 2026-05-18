import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceLongHorizonEntropy,
  type CountyGovernanceLongHorizonEntropyInput,
  type CountyGovernanceLongHorizonEntropyResult,
} from "./county-governance-long-horizon-entropy-intelligence";

const lowEntropyInput: CountyGovernanceLongHorizonEntropyInput = {
  governanceComplexityScore: 12,
  governanceDriftScore: 8,
  contradictionRecurrenceScore: 6,
  survivabilityMaintenanceLoadScore: 12,
  resilienceEfficiencyScore: 92,
  institutionalDurabilityScore: 90,
  stabilizationCostScore: 10,
  explainabilityIntegrityScore: 92,
  failClosedIntegrityScore: 94,
  governanceRecoveryPressureScore: 10,
  governanceCoherenceScore: 92,
  governanceSaturationPressureScore: 8,
};

const evaluate = (overrides: Partial<CountyGovernanceLongHorizonEntropyInput> = {}) =>
  evaluateCountyGovernanceLongHorizonEntropy({
    ...lowEntropyInput,
    ...overrides,
  });

const assertFailClosed = (result: CountyGovernanceLongHorizonEntropyResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Governance Long-Horizon Entropy Intelligence", () => {
  it("classifies valid low-entropy scenarios as stable order", () => {
    const result = evaluate();

    assert.equal(result.entropyClassification, "stable_order");
    assert.equal(result.governanceStabilityClassification, "stable");
    assert.equal(result.sustainabilityClassification, "sustainable");
    assert.equal(result.entropyWarnings.length, 0);
    assertFailClosed(result);
  });

  it("classifies maintenance-heavy low-risk scenarios as temporary order", () => {
    const result = evaluate({
      survivabilityMaintenanceLoadScore: 40,
      governanceRecoveryPressureScore: 38,
    });

    assert.equal(result.entropyClassification, "temporary_order");
    assert.equal(result.sustainabilityClassification, "maintenance_heavy");
  });

  it("detects accumulating entropy scenarios", () => {
    const result = evaluate({
      governanceComplexityScore: 50,
      governanceDriftScore: 48,
      contradictionRecurrenceScore: 45,
      survivabilityMaintenanceLoadScore: 48,
      governanceRecoveryPressureScore: 50,
      governanceCoherenceScore: 70,
    });

    assert.equal(result.entropyClassification, "entropy_accumulating");
    assert(result.entropyWarnings.includes("ENTROPY_ACCUMULATION_DETECTED"));
  });

  it("detects accelerating entropy scenarios", () => {
    const result = evaluate({
      governanceComplexityScore: 74,
      governanceDriftScore: 72,
      contradictionRecurrenceScore: 70,
      survivabilityMaintenanceLoadScore: 68,
      governanceRecoveryPressureScore: 72,
      stabilizationCostScore: 70,
      resilienceEfficiencyScore: 45,
    });

    assert.equal(result.entropyClassification, "entropy_accelerating");
    assert(result.entropyWarnings.includes("CHRONIC_COMPLEXITY_PRESSURE"));
    assert(result.entropyWarnings.includes("CONTRADICTION_RECURRENCE_ACCELERATION"));
  });

  it("detects entropy saturation scenarios", () => {
    const result = evaluate({
      governanceComplexityScore: 82,
      governanceDriftScore: 82,
      contradictionRecurrenceScore: 80,
      survivabilityMaintenanceLoadScore: 82,
      governanceRecoveryPressureScore: 82,
      stabilizationCostScore: 82,
      resilienceEfficiencyScore: 24,
      governanceSaturationPressureScore: 84,
      failClosedIntegrityScore: 80,
      explainabilityIntegrityScore: 78,
    });

    assert.equal(result.entropyClassification, "entropy_saturated");
    assert.equal(result.governanceStabilityClassification, "structurally_unstable");
    assert(result.entropyWarnings.includes("ENTROPY_SATURATION_DETECTED"));
  });

  it("detects irreversible entropy scenarios", () => {
    const result = evaluate({
      governanceComplexityScore: 94,
      governanceDriftScore: 94,
      contradictionRecurrenceScore: 94,
      survivabilityMaintenanceLoadScore: 94,
      governanceRecoveryPressureScore: 94,
      stabilizationCostScore: 94,
      resilienceEfficiencyScore: 20,
      governanceSaturationPressureScore: 96,
      failClosedIntegrityScore: 25,
      explainabilityIntegrityScore: 30,
      institutionalDurabilityScore: 30,
    });

    assert.equal(result.entropyClassification, "irreversible_entropy");
    assert.equal(result.governanceStabilityClassification, "entropy_collapse_exposed");
    assert.equal(result.sustainabilityClassification, "irrecoverable");
    assert(result.entropyWarnings.includes("IRREVERSIBLE_ENTROPY_DETECTED"));
  });

  it("detects deterministic probabilistic instability without randomness", () => {
    const result = evaluate({
      governanceComplexityScore: 72,
      governanceDriftScore: 78,
      contradictionRecurrenceScore: 78,
      survivabilityMaintenanceLoadScore: 62,
      governanceRecoveryPressureScore: 62,
      stabilizationCostScore: 70,
      governanceCoherenceScore: 45,
      failClosedIntegrityScore: 45,
      resilienceEfficiencyScore: 58,
    });

    assert.equal(result.governanceStabilityClassification, "probabilistically_unstable");
    assert(result.entropyWarnings.includes("PROBABILISTIC_INSTABILITY_DETECTED"));
  });

  it("preserves fail-closed flags across outputs", () => {
    const scenarios = [
      evaluate(),
      evaluate({ governanceDriftScore: 80, contradictionRecurrenceScore: 80 }),
      evaluate({ resilienceEfficiencyScore: 20, failClosedIntegrityScore: 25, explainabilityIntegrityScore: 30 }),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });

  it("normalizes NaN and invalid numeric input deterministically", () => {
    const result = evaluateCountyGovernanceLongHorizonEntropy({
      governanceComplexityScore: Number.NaN,
      governanceDriftScore: -10,
      contradictionRecurrenceScore: 120,
      survivabilityMaintenanceLoadScore: Number.NaN,
      resilienceEfficiencyScore: 150,
      institutionalDurabilityScore: -5,
      stabilizationCostScore: 50.4,
      explainabilityIntegrityScore: Number.NaN,
      failClosedIntegrityScore: 100.4,
      governanceRecoveryPressureScore: 49.6,
      governanceCoherenceScore: 80,
      governanceSaturationPressureScore: 101,
    });

    assert.equal(result.entropyAccumulationScore, 30);
    assert.equal(result.resilienceEfficiencyDecayScore, 0);
    assert.equal(result.stabilizationCostEscalationScore, 20);
  });

  it("handles threshold boundary conditions", () => {
    const result = evaluate({
      governanceComplexityScore: 45,
      governanceDriftScore: 45,
      contradictionRecurrenceScore: 45,
      survivabilityMaintenanceLoadScore: 45,
      governanceRecoveryPressureScore: 45,
      governanceCoherenceScore: 100,
      explainabilityIntegrityScore: 100,
    });

    assert.equal(result.entropyClassification, "entropy_accumulating");
    assert(result.entropyWarnings.includes("ENTROPY_ACCUMULATION_DETECTED"));
  });

  it("generates expected warning codes for entropy pressure", () => {
    const result = evaluate({
      governanceComplexityScore: 75,
      governanceDriftScore: 70,
      contradictionRecurrenceScore: 70,
      survivabilityMaintenanceLoadScore: 75,
      resilienceEfficiencyScore: 45,
      stabilizationCostScore: 70,
      explainabilityIntegrityScore: 50,
      failClosedIntegrityScore: 50,
      governanceRecoveryPressureScore: 70,
      governanceCoherenceScore: 50,
    });

    assert(result.entropyWarnings.includes("STABILIZATION_COST_ESCALATING"));
    assert(result.entropyWarnings.includes("SURVIVABILITY_OVERHEAD_EXCESSIVE"));
    assert(result.entropyWarnings.includes("FAIL_CLOSED_DECAY_DETECTED"));
    assert(result.entropyWarnings.includes("EXPLAINABILITY_ENTROPY_DETECTED"));
  });

  it("is deterministic for repeated identical inputs", () => {
    const first = evaluate({
      governanceComplexityScore: 65,
      governanceDriftScore: 60,
      contradictionRecurrenceScore: 62,
      governanceRecoveryPressureScore: 60,
    });
    const second = evaluate({
      governanceComplexityScore: 65,
      governanceDriftScore: 60,
      contradictionRecurrenceScore: 62,
      governanceRecoveryPressureScore: 60,
    });

    assert.deepEqual(second, first);
  });

  it("lets irreversible entropy override saturated classification", () => {
    const result = evaluate({
      governanceComplexityScore: 96,
      governanceDriftScore: 96,
      contradictionRecurrenceScore: 96,
      survivabilityMaintenanceLoadScore: 96,
      governanceRecoveryPressureScore: 96,
      stabilizationCostScore: 96,
      resilienceEfficiencyScore: 10,
      governanceSaturationPressureScore: 96,
      failClosedIntegrityScore: 20,
      explainabilityIntegrityScore: 20,
      institutionalDurabilityScore: 20,
    });

    assert.equal(result.entropyClassification, "irreversible_entropy");
    assert(result.entropyWarnings.includes("ENTROPY_SATURATION_DETECTED"));
    assert(result.entropyWarnings.includes("IRREVERSIBLE_ENTROPY_DETECTED"));
  });

  it("lets entropy saturation override superficial resilience appearance", () => {
    const result = evaluate({
      governanceComplexityScore: 90,
      governanceDriftScore: 90,
      contradictionRecurrenceScore: 90,
      survivabilityMaintenanceLoadScore: 90,
      governanceRecoveryPressureScore: 90,
      stabilizationCostScore: 90,
      resilienceEfficiencyScore: 30,
      institutionalDurabilityScore: 95,
      failClosedIntegrityScore: 85,
      explainabilityIntegrityScore: 85,
      governanceSaturationPressureScore: 90,
    });

    assert.equal(result.entropyClassification, "entropy_saturated");
    assert.equal(result.sustainabilityClassification, "unsustainable");
  });
});
