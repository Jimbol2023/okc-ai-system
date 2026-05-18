import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceRecoveryIntegrity,
  type CountyGovernanceRecoveryIntegrityInput,
  type CountyGovernanceRecoveryIntegrityResult,
} from "./county-governance-recovery-integrity-intelligence";

const baseInput: CountyGovernanceRecoveryIntegrityInput = {
  recoveryStatus: "institutional",
  recoveryDurabilityLevel: "institutional",
  recoveryIntegrityLevel: "institutional",
  governanceDebtLevel: "none",
  postRecoveryStabilityLevel: "stress_tested",
  explainabilityPersistenceLevel: "institutional",
  failClosedRecoveryDiscipline: "institutional",
  contradictionPersistenceLevel: "none",
  driftAmplificationLevel: "none",
  degradationCycleResistance: "institutional",
  recoveryReversibility: "reversible",
  survivabilityPersistenceLevel: "institutional",
  collapseRiskLevel: "none",
  unresolvedFailureSuppression: "none",
  recoveryCycleCount: 1,
  unresolvedGovernanceFailureCount: 0,
  repeatedDegradationCount: 0,
};

const evaluate = (overrides: Partial<CountyGovernanceRecoveryIntegrityInput> = {}) =>
  evaluateCountyGovernanceRecoveryIntegrity({
    ...baseInput,
    ...overrides,
  });

const assertFailClosed = (result: CountyGovernanceRecoveryIntegrityResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Governance Recovery Integrity Intelligence", () => {
  it("returns recovery integrity unverified for missing input", () => {
    const result = evaluateCountyGovernanceRecoveryIntegrity();

    assert.equal(result.recoveryClassification, "recovery_integrity_unverified");
    assert.equal(result.recoveryScore, 0);
    assert(result.warningCodes.includes("S20_RECOVERY_INTEGRITY_UNVERIFIED"));
    assertFailClosed(result);
  });

  it("classifies institutional recovery integrity", () => {
    const result = evaluate();

    assert.equal(result.recoveryClassification, "institutional_recovery_integrity");
    assert.equal(result.durableRecoveryDetected, true);
    assert.equal(result.failClosedRecoveryDurable, true);
    assert.equal(result.warningCodes.includes("S20_INSTITUTIONAL_RECOVERY_NOT_PROVEN"), false);
  });

  it("classifies durable integrity-preserving recovery below institutional recovery", () => {
    const result = evaluate({
      recoveryStatus: "durable",
      recoveryDurabilityLevel: "durable",
      recoveryIntegrityLevel: "strong",
      explainabilityPersistenceLevel: "strong",
      failClosedRecoveryDiscipline: "durable",
      survivabilityPersistenceLevel: "durable",
      degradationCycleResistance: "strong",
    });

    assert.equal(result.recoveryClassification, "durable_integrity_preserving_recovery");
    assert.equal(result.durableRecoveryDetected, true);
  });

  it("detects cosmetic recovery and blocks operational recovery", () => {
    const result = evaluate({
      recoveryStatus: "operational",
      recoveryDurabilityLevel: "stable",
      recoveryIntegrityLevel: "partial",
      explainabilityPersistenceLevel: "strong",
      survivabilityPersistenceLevel: "resilient",
    });

    assert.equal(result.recoveryClassification, "cosmetic_recovery");
    assert.equal(result.cosmeticRecoveryDetected, true);
    assert(result.warningCodes.includes("S20_COSMETIC_RECOVERY_DETECTED"));
  });

  it("lets recovery without integrity override durable recovery", () => {
    const result = evaluate({
      recoveryStatus: "durable",
      recoveryDurabilityLevel: "durable",
      recoveryIntegrityLevel: "weak",
      postRecoveryStabilityLevel: "durable",
    });

    assert.equal(result.recoveryClassification, "recovery_without_integrity");
    assert.equal(result.recoveryWithoutIntegrityDetected, true);
    assert(result.warningCodes.includes("S20_RECOVERY_WITHOUT_INTEGRITY"));
  });

  it("classifies governance debt accumulation before resilient recovery", () => {
    const result = evaluate({
      recoveryStatus: "stabilized",
      recoveryDurabilityLevel: "stable",
      recoveryIntegrityLevel: "strong",
      governanceDebtLevel: "high",
      survivabilityPersistenceLevel: "resilient",
      recoveryCycleCount: 4,
    });

    assert.equal(result.recoveryClassification, "governance_debt_accumulation");
    assert.equal(result.governanceDebtAccumulating, true);
    assert(result.warningCodes.includes("S20_GOVERNANCE_DEBT_ACCUMULATING"));
  });

  it("reports critical governance debt warning", () => {
    const result = evaluate({
      governanceDebtLevel: "critical",
    });

    assert(result.warningCodes.includes("S20_GOVERNANCE_DEBT_CRITICAL"));
  });

  it("classifies recovery-induced drift amplification", () => {
    const result = evaluate({
      recoveryStatus: "stabilized",
      recoveryDurabilityLevel: "stable",
      driftAmplificationLevel: "high",
      postRecoveryStabilityLevel: "stable",
      survivabilityPersistenceLevel: "resilient",
    });

    assert.equal(result.recoveryClassification, "recovery_induced_drift_amplification");
    assert.equal(result.recoveryInducedDriftAmplificationDetected, true);
    assert(result.warningCodes.includes("S20_RECOVERY_DRIFT_AMPLIFICATION"));
  });

  it("classifies recovery-induced instability", () => {
    const result = evaluate({
      recoveryStatus: "operational",
      recoveryDurabilityLevel: "stable",
      postRecoveryStabilityLevel: "unstable",
      contradictionPersistenceLevel: "periodic",
      survivabilityPersistenceLevel: "recovering",
    });

    assert.equal(result.recoveryClassification, "recovery_induced_instability");
    assert.equal(result.recoveryInducedInstabilityDetected, true);
    assert(result.warningCodes.includes("S20_RECOVERY_INDUCED_INSTABILITY"));
  });

  it("applies post-recovery collapse risk precedence", () => {
    const result = evaluate({
      collapseRiskLevel: "critical",
      recoveryIntegrityLevel: "partial",
      governanceDebtLevel: "critical",
    });

    assert.equal(result.recoveryClassification, "post_recovery_collapse_risk");
    assert.equal(result.postRecoveryCollapseRisk, true);
    assert(result.warningCodes.includes("S20_POST_RECOVERY_COLLAPSE_RISK"));
  });

  it("classifies irreversible governance degradation", () => {
    const result = evaluate({
      recoveryReversibility: "irreversible",
      collapseRiskLevel: "none",
      failClosedRecoveryDiscipline: "durable",
    });

    assert.equal(result.recoveryClassification, "irreversible_governance_degradation");
    assert(result.warningCodes.includes("S20_IRREVERSIBLE_DEGRADATION_RISK"));
  });

  it("classifies temporary recovery", () => {
    const result = evaluate({
      recoveryStatus: "partial",
      recoveryDurabilityLevel: "temporary",
      recoveryIntegrityLevel: "credible",
      postRecoveryStabilityLevel: "stable",
      survivabilityPersistenceLevel: "temporary",
    });

    assert.equal(result.recoveryClassification, "temporary_recovery");
    assert(result.warningCodes.includes("S20_TEMPORARY_RECOVERY_ONLY"));
  });

  it("classifies brittle recovery", () => {
    const result = evaluate({
      recoveryStatus: "operational",
      recoveryDurabilityLevel: "brittle",
      recoveryIntegrityLevel: "credible",
      postRecoveryStabilityLevel: "fragile",
      degradationCycleResistance: "partial",
      survivabilityPersistenceLevel: "recovering",
    });

    assert.equal(result.recoveryClassification, "brittle_recovery");
    assert(result.warningCodes.includes("S20_BRITTLE_RECOVERY_PATTERN"));
  });

  it("classifies fail-closed recovery required first", () => {
    const result = evaluate({
      recoveryStatus: "institutional",
      failClosedRecoveryDiscipline: "absent",
      collapseRiskLevel: "critical",
      recoveryReversibility: "irreversible",
    });

    assert.equal(result.recoveryClassification, "fail_closed_recovery_required");
    assert(result.warningCodes.includes("S20_FAIL_CLOSED_RECOVERY_REQUIRED"));
  });

  it("reports explainability weakness warnings", () => {
    const result = evaluate({
      recoveryStatus: "operational",
      recoveryIntegrityLevel: "credible",
      explainabilityPersistenceLevel: "partial",
    });

    assert(result.warningCodes.includes("S20_RECOVERY_EXPLAINABILITY_WEAK"));
  });

  it("reports repeated degradation cycle warnings", () => {
    const result = evaluate({
      recoveryCycleCount: 2,
      repeatedDegradationCount: 2,
      governanceDebtLevel: "moderate",
    });

    assert(result.warningCodes.includes("S20_REPEATED_DEGRADATION_CYCLE_RISK"));
  });

  it("is deterministic for repeated identical input", () => {
    const first = evaluate({
      recoveryStatus: "stabilized",
      recoveryDurabilityLevel: "stable",
      contradictionPersistenceLevel: "periodic",
      survivabilityPersistenceLevel: "resilient",
    });
    const second = evaluate({
      recoveryStatus: "stabilized",
      recoveryDurabilityLevel: "stable",
      contradictionPersistenceLevel: "periodic",
      survivabilityPersistenceLevel: "resilient",
    });

    assert.deepEqual(second, first);
  });

  it("preserves immutable fail-closed flags across classifications", () => {
    const scenarios = [
      evaluate(),
      evaluate({ recoveryStatus: "operational", recoveryIntegrityLevel: "partial" }),
      evaluate({ governanceDebtLevel: "critical" }),
      evaluate({ failClosedRecoveryDiscipline: "absent" }),
      evaluateCountyGovernanceRecoveryIntegrity(),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });
});
