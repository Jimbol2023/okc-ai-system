import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceEntropyRecoveryDoctrine,
  type CountyGovernanceEntropyRecoveryDoctrineInput,
  type CountyGovernanceEntropyRecoveryDoctrineResult,
} from "./county-governance-entropy-recovery-doctrine-intelligence";

const baseInput: CountyGovernanceEntropyRecoveryDoctrineInput = {
  entropyRecoveryFeasibilityLevel: "institutional",
  recoverySustainabilityLevel: "self_sustaining",
  entropyReversibilityLevel: "reversible",
  recoveryStabilityLevel: "durable",
  recoveryDoctrineCoherenceLevel: "institutional",
  recoverySequencingStabilityLevel: "durable",
  stabilizationCostBurdenLevel: "none",
  recoveryAmplificationRiskLevel: "none",
  recoveryDependencyLevel: "none",
  recoveryContradictionPressureLevel: "none",
  failClosedRecoveryIntegrityLevel: "institutional",
  recoveryExplainabilityLevel: "institutional",
  longHorizonRecoverySurvivabilityLevel: "institutional",
  recoveryCollapseExposureLevel: "none",
  recoveryCycleCount: 1,
  failedRecoveryAttemptCount: 0,
  recoveryAmplificationEventCount: 0,
  sequencingInstabilityEventCount: 0,
  doctrineFragmentationEventCount: 0,
  recoveryDependencyGrowthCount: 0,
  failClosedRecoveryDegradationCount: 0,
  explainabilityRecoveryDegradationCount: 0,
};

const evaluate = (overrides: Partial<CountyGovernanceEntropyRecoveryDoctrineInput> = {}) =>
  evaluateCountyGovernanceEntropyRecoveryDoctrine({
    ...baseInput,
    ...overrides,
  });

const assertFailClosed = (result: CountyGovernanceEntropyRecoveryDoctrineResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Governance Entropy Recovery Doctrine Intelligence", () => {
  it("returns recovery doctrine unverified for missing input", () => {
    const result = evaluateCountyGovernanceEntropyRecoveryDoctrine();

    assert.equal(result.recoveryDoctrineClassification, "recovery_doctrine_unverified");
    assert.equal(result.recoveryFeasibilityScore, 0);
    assert(result.warningCodes.includes("S24_RECOVERY_DOCTRINE_UNVERIFIED"));
    assertFailClosed(result);
  });

  it("classifies institutional recovery doctrine", () => {
    const result = evaluate();

    assert.equal(result.recoveryDoctrineClassification, "institutional_recovery_doctrine");
    assert.equal(result.recoveryReversibilityClassification, "reversible");
    assert.equal(result.recoveryStabilityClassification, "stable_recovery");
    assert.equal(result.sustainableRecoveryDetected, true);
    assert.equal(result.warningCodes.includes("S24_INSTITUTIONAL_RECOVERY_DOCTRINE_NOT_PROVEN"), false);
  });

  it("classifies sustainable entropy recovery below institutional doctrine", () => {
    const result = evaluate({
      entropyRecoveryFeasibilityLevel: "strong",
      recoverySustainabilityLevel: "sustainable",
      recoveryDoctrineCoherenceLevel: "strong",
      failClosedRecoveryIntegrityLevel: "durable",
      recoveryExplainabilityLevel: "strong",
      longHorizonRecoverySurvivabilityLevel: "durable",
    });

    assert.equal(result.recoveryDoctrineClassification, "sustainable_entropy_recovery");
    assert.equal(result.sustainableRecoveryDetected, true);
  });

  it("classifies partially recoverable entropy", () => {
    const result = evaluate({
      entropyRecoveryFeasibilityLevel: "partial",
      entropyReversibilityLevel: "reversible",
      recoverySustainabilityLevel: "sustainable",
      recoveryStabilityLevel: "stable",
      recoveryDependencyLevel: "none",
      failedRecoveryAttemptCount: 0,
    });

    assert.equal(result.recoveryDoctrineClassification, "partially_recoverable_entropy");
    assert.equal(result.recoveryReversibilityClassification, "reversible");
  });

  it("classifies unstable recovery doctrine", () => {
    const result = evaluate({
      recoveryStabilityLevel: "fragile",
      recoverySequencingStabilityLevel: "stable",
    });

    assert.equal(result.recoveryDoctrineClassification, "unstable_recovery_doctrine");
    assert.equal(result.recoveryStabilityClassification, "fragile_recovery");
  });

  it("detects recovery doctrine fragmentation", () => {
    const result = evaluate({
      recoveryDoctrineCoherenceLevel: "fragmented",
    });

    assert.equal(result.recoveryDoctrineClassification, "recovery_doctrine_fragmentation");
    assert.equal(result.doctrineFragmentationDetected, true);
    assert(result.warningCodes.includes("S24_RECOVERY_DOCTRINE_FRAGMENTATION"));
  });

  it("detects stabilization-driven instability", () => {
    const result = evaluate({
      stabilizationCostBurdenLevel: "high",
      recoveryContradictionPressureLevel: "high",
      recoveryAmplificationRiskLevel: "moderate",
    });

    assert.equal(result.recoveryDoctrineClassification, "stabilization_driven_instability");
    assert(result.warningCodes.includes("S24_STABILIZATION_DRIVEN_INSTABILITY"));
  });

  it("detects recovery amplified entropy", () => {
    const result = evaluate({
      recoveryAmplificationRiskLevel: "high",
      recoveryContradictionPressureLevel: "moderate",
      stabilizationCostBurdenLevel: "moderate",
    });

    assert.equal(result.recoveryDoctrineClassification, "recovery_amplified_entropy");
    assert.equal(result.recoveryAmplificationDetected, true);
    assert(result.warningCodes.includes("S24_RECOVERY_AMPLIFIES_ENTROPY"));
  });

  it("detects recovery-trapped governance", () => {
    const result = evaluate({
      recoveryDependencyLevel: "high",
      recoveryCycleCount: 4,
      entropyRecoveryFeasibilityLevel: "recoverable",
      recoverySustainabilityLevel: "sustainable",
    });

    assert.equal(result.recoveryDoctrineClassification, "recovery_trapped_governance");
    assert.equal(result.recoveryTrapDetected, true);
    assert(result.warningCodes.includes("S24_RECOVERY_TRAP_DETECTED"));
  });

  it("detects probabilistically nonviable recovery deterministically", () => {
    const result = evaluate({
      entropyRecoveryFeasibilityLevel: "nonviable",
      entropyReversibilityLevel: "partial",
      longHorizonRecoverySurvivabilityLevel: "recovering",
    });

    assert.equal(result.recoveryDoctrineClassification, "probabilistically_nonviable_recovery");
    assert.equal(result.probabilisticNonviableRecoveryDetected, true);
    assert(result.warningCodes.includes("S24_PROBABILISTIC_RECOVERY_NONVIABLE"));
  });

  it("applies irreversible recovery collapse precedence", () => {
    const result = evaluate({
      entropyReversibilityLevel: "irreversible",
      failClosedRecoveryIntegrityLevel: "absent",
      recoveryCollapseExposureLevel: "critical",
      recoveryAmplificationRiskLevel: "critical",
    });

    assert.equal(result.recoveryDoctrineClassification, "irreversible_recovery_collapse");
    assert.equal(result.irreversibleRecoveryCollapseDetected, true);
    assert(result.warningCodes.includes("S24_IRREVERSIBLE_RECOVERY_COLLAPSE"));
  });

  it("applies fail-closed recovery degradation precedence after irreversible collapse", () => {
    const result = evaluate({
      failClosedRecoveryIntegrityLevel: "absent",
      recoveryAmplificationRiskLevel: "high",
      entropyReversibilityLevel: "reversible",
      recoveryCollapseExposureLevel: "none",
    });

    assert.equal(result.recoveryDoctrineClassification, "fail_closed_recovery_degradation");
    assert.equal(result.failClosedRecoveryDegradationDetected, true);
    assert(result.warningCodes.includes("S24_FAIL_CLOSED_RECOVERY_DEGRADATION"));
  });

  it("reports recovery sequencing instability warning", () => {
    const result = evaluate({
      recoverySequencingStabilityLevel: "unstable",
    });

    assert(result.warningCodes.includes("S24_RECOVERY_SEQUENCING_INSTABILITY"));
  });

  it("reports recovery contradiction pressure warning", () => {
    const result = evaluate({
      recoveryContradictionPressureLevel: "high",
    });

    assert(result.warningCodes.includes("S24_RECOVERY_CONTRADICTION_PRESSURE"));
  });

  it("reports recovery dependency warning", () => {
    const result = evaluate({
      recoveryDependencyLevel: "moderate",
      recoveryDependencyGrowthCount: 1,
    });

    assert(result.warningCodes.includes("S24_RECOVERY_DEPENDENCY_UNSUSTAINABLE"));
  });

  it("reports explainability recovery degradation warning", () => {
    const result = evaluate({
      recoveryExplainabilityLevel: "partial",
    });

    assert(result.warningCodes.includes("S24_RECOVERY_EXPLAINABILITY_DEGRADATION"));
  });

  it("reports long-horizon survivability weakness warning", () => {
    const result = evaluate({
      longHorizonRecoverySurvivabilityLevel: "declining",
      entropyRecoveryFeasibilityLevel: "recoverable",
      entropyReversibilityLevel: "reversible",
    });

    assert(result.warningCodes.includes("S24_LONG_HORIZON_RECOVERY_SURVIVABILITY_WEAK"));
  });

  it("is deterministic for repeated identical input", () => {
    const first = evaluate({
      recoveryCycleCount: 2,
      recoverySustainabilityLevel: "sustainable",
      entropyRecoveryFeasibilityLevel: "strong",
    });
    const second = evaluate({
      recoveryCycleCount: 2,
      recoverySustainabilityLevel: "sustainable",
      entropyRecoveryFeasibilityLevel: "strong",
    });

    assert.deepEqual(second, first);
  });

  it("preserves immutable fail-closed flags across classifications", () => {
    const scenarios = [
      evaluate(),
      evaluate({ entropyReversibilityLevel: "irreversible" }),
      evaluate({ failClosedRecoveryIntegrityLevel: "absent" }),
      evaluate({ recoveryDependencyLevel: "high" }),
      evaluateCountyGovernanceEntropyRecoveryDoctrine(),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });
});
