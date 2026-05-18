import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceRecoverySurvivabilityContinuity,
  type CountyGovernanceRecoverySurvivabilityContinuityInput,
  type CountyGovernanceRecoverySurvivabilityContinuityResult,
} from "./county-governance-recovery-survivability-continuity-intelligence";

const baseInput: CountyGovernanceRecoverySurvivabilityContinuityInput = {
  recoveryContinuityLevel: "institutional",
  postRecoverySurvivabilityLevel: "institutional",
  recoveryFatigueLevel: "none",
  repeatedCycleResistanceLevel: "institutional",
  compoundedFragilityLevel: "none",
  compoundedResilienceLevel: "institutional",
  repeatedCycleGovernanceDebtLevel: "none",
  continuityExplainabilityLevel: "institutional",
  failClosedContinuityPreservation: "institutional",
  postRecoveryDriftContinuityLevel: "none",
  postRecoveryContradictionContinuityLevel: "none",
  futureCollapseExposureLevel: "none",
  institutionalContinuityCoherence: "institutional",
  longHorizonContinuityLevel: "institutional",
  recoveryCycleCount: 1,
  repeatedRecoveryCount: 0,
  stressCycleCount: 0,
  driftRecurrenceCount: 0,
  contradictionRecurrenceCount: 0,
  escalationPressureRecurrenceCount: 0,
};

const evaluate = (overrides: Partial<CountyGovernanceRecoverySurvivabilityContinuityInput> = {}) =>
  evaluateCountyGovernanceRecoverySurvivabilityContinuity({
    ...baseInput,
    ...overrides,
  });

const assertFailClosed = (result: CountyGovernanceRecoverySurvivabilityContinuityResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Governance Recovery Survivability Continuity Intelligence", () => {
  it("returns recovery continuity unverified for missing input", () => {
    const result = evaluateCountyGovernanceRecoverySurvivabilityContinuity();

    assert.equal(result.recoveryContinuityClassification, "recovery_continuity_unverified");
    assert.equal(result.recoveryContinuityScore, 0);
    assert(result.warningCodes.includes("S21_RECOVERY_CONTINUITY_UNVERIFIED"));
    assertFailClosed(result);
  });

  it("classifies institutional recovery continuity", () => {
    const result = evaluate();

    assert.equal(result.recoveryContinuityClassification, "institutional_recovery_continuity");
    assert.equal(result.institutionalContinuityDetected, true);
    assert.equal(result.failClosedContinuityPreserved, true);
  });

  it("classifies durable recovery continuity", () => {
    const result = evaluate({
      recoveryContinuityLevel: "durable",
      postRecoverySurvivabilityLevel: "durable",
      repeatedCycleResistanceLevel: "strong",
      compoundedResilienceLevel: "strong",
      continuityExplainabilityLevel: "strong",
      failClosedContinuityPreservation: "durable",
      institutionalContinuityCoherence: "strong",
      longHorizonContinuityLevel: "durable",
    });

    assert.equal(result.recoveryContinuityClassification, "durable_recovery_continuity");
  });

  it("classifies resilient recovery continuity", () => {
    const result = evaluate({
      recoveryContinuityLevel: "stable",
      postRecoverySurvivabilityLevel: "resilient",
      repeatedCycleResistanceLevel: "stable",
      compoundedResilienceLevel: "strong",
      continuityExplainabilityLevel: "strong",
      failClosedContinuityPreservation: "stable",
      institutionalContinuityCoherence: "strong",
      longHorizonContinuityLevel: "stable",
    });

    assert.equal(result.recoveryContinuityClassification, "resilient_recovery_continuity");
  });

  it("classifies stable recovery continuity", () => {
    const result = evaluate({
      recoveryContinuityLevel: "stable",
      postRecoverySurvivabilityLevel: "resilient",
      repeatedCycleResistanceLevel: "stable",
      compoundedResilienceLevel: "moderate",
      continuityExplainabilityLevel: "adequate",
      failClosedContinuityPreservation: "stable",
      institutionalContinuityCoherence: "stable",
      longHorizonContinuityLevel: "stable",
    });

    assert.equal(result.recoveryContinuityClassification, "stable_recovery_continuity");
  });

  it("classifies temporary recovery continuity", () => {
    const result = evaluate({
      recoveryContinuityLevel: "temporary",
      postRecoverySurvivabilityLevel: "temporary",
      longHorizonContinuityLevel: "temporary",
      compoundedResilienceLevel: "moderate",
      failClosedContinuityPreservation: "stable",
    });

    assert.equal(result.recoveryContinuityClassification, "temporary_recovery_continuity");
    assert(result.warningCodes.includes("S21_TEMPORARY_RECOVERY_CONTINUITY"));
  });

  it("classifies cosmetic recovery continuity", () => {
    const result = evaluate({
      recoveryContinuityLevel: "stable",
      continuityExplainabilityLevel: "partial",
      institutionalContinuityCoherence: "stable",
      postRecoverySurvivabilityLevel: "resilient",
    });

    assert.equal(result.recoveryContinuityClassification, "cosmetic_recovery_continuity");
    assert.equal(result.cosmeticRecoveryContinuityDetected, true);
    assert(result.warningCodes.includes("S21_COSMETIC_RECOVERY_CONTINUITY"));
  });

  it("classifies brittle recovery continuity", () => {
    const result = evaluate({
      recoveryContinuityLevel: "broken",
      postRecoverySurvivabilityLevel: "recovering",
      repeatedCycleResistanceLevel: "partial",
      longHorizonContinuityLevel: "stable",
    });

    assert.equal(result.recoveryContinuityClassification, "brittle_recovery_continuity");
    assert(result.warningCodes.includes("S21_BRITTLE_RECOVERY_CONTINUITY"));
  });

  it("classifies exhausted recovery continuity through fatigue precedence", () => {
    const result = evaluate({
      recoveryFatigueLevel: "critical",
      repeatedRecoveryCount: 4,
      stressCycleCount: 4,
    });

    assert.equal(result.recoveryContinuityClassification, "recovery_fatigue_accumulation");
    assert.equal(result.exhaustedRecoveryContinuityDetected, true);
    assert(result.warningCodes.includes("S21_EXHAUSTED_RECOVERY_CONTINUITY"));
  });

  it("detects continuity without survivability", () => {
    const result = evaluate({
      recoveryContinuityLevel: "durable",
      postRecoverySurvivabilityLevel: "temporary",
      compoundedResilienceLevel: "strong",
    });

    assert.equal(result.recoveryContinuityClassification, "continuity_without_survivability");
    assert.equal(result.continuityWithoutSurvivabilityDetected, true);
    assert(result.warningCodes.includes("S21_CONTINUITY_WITHOUT_SURVIVABILITY"));
  });

  it("detects survivability without continuity", () => {
    const result = evaluate({
      recoveryContinuityLevel: "temporary",
      postRecoverySurvivabilityLevel: "durable",
      longHorizonContinuityLevel: "stable",
    });

    assert.equal(result.recoveryContinuityClassification, "survivability_without_continuity");
    assert.equal(result.survivabilityWithoutContinuityDetected, true);
    assert(result.warningCodes.includes("S21_SURVIVABILITY_WITHOUT_CONTINUITY"));
  });

  it("applies compounded fragility precedence", () => {
    const result = evaluate({
      compoundedFragilityLevel: "high",
      repeatedRecoveryCount: 2,
      driftRecurrenceCount: 1,
      contradictionRecurrenceCount: 1,
    });

    assert.equal(result.recoveryContinuityClassification, "compounded_fragility");
    assert.equal(result.compoundedFragilityDetected, true);
    assert(result.warningCodes.includes("S21_COMPOUNDED_FRAGILITY"));
  });

  it("applies recovery fatigue accumulation precedence", () => {
    const result = evaluate({
      recoveryFatigueLevel: "high",
      repeatedRecoveryCount: 3,
      stressCycleCount: 3,
      compoundedFragilityLevel: "high",
    });

    assert.equal(result.recoveryContinuityClassification, "recovery_fatigue_accumulation");
    assert.equal(result.recoveryFatigueDetected, true);
    assert(result.warningCodes.includes("S21_RECOVERY_FATIGUE_ACCUMULATION"));
  });

  it("applies repeated-cycle governance debt precedence", () => {
    const result = evaluate({
      repeatedCycleGovernanceDebtLevel: "high",
      recoveryCycleCount: 4,
      repeatedRecoveryCount: 4,
      recoveryFatigueLevel: "high",
    });

    assert.equal(result.recoveryContinuityClassification, "repeated_cycle_governance_debt");
    assert(result.warningCodes.includes("S21_REPEATED_CYCLE_GOVERNANCE_DEBT"));
  });

  it("applies future collapse exposure precedence", () => {
    const result = evaluate({
      futureCollapseExposureLevel: "critical",
      repeatedCycleGovernanceDebtLevel: "critical",
      recoveryFatigueLevel: "critical",
    });

    assert.equal(result.recoveryContinuityClassification, "future_collapse_exposure");
    assert.equal(result.futureCollapseExposureDetected, true);
    assert(result.warningCodes.includes("S21_FUTURE_COLLAPSE_EXPOSURE"));
  });

  it("applies fail-closed recovery continuity required precedence", () => {
    const result = evaluate({
      failClosedContinuityPreservation: "absent",
      futureCollapseExposureLevel: "critical",
    });

    assert.equal(result.recoveryContinuityClassification, "fail_closed_recovery_continuity_required");
    assert(result.warningCodes.includes("S21_FAIL_CLOSED_RECOVERY_CONTINUITY_REQUIRED"));
  });

  it("reports drift, contradiction, escalation, and repeated recovery warnings", () => {
    const result = evaluate({
      recoveryContinuityLevel: "stable",
      postRecoveryDriftContinuityLevel: "high",
      postRecoveryContradictionContinuityLevel: "frequent",
      escalationPressureRecurrenceCount: 2,
      repeatedRecoveryCount: 2,
    });

    assert(result.warningCodes.includes("S21_DRIFT_CONTINUITY_UNSTABLE"));
    assert(result.warningCodes.includes("S21_CONTRADICTION_CONTINUITY_UNSTABLE"));
    assert(result.warningCodes.includes("S21_ESCALATION_PRESSURE_RECURRENCE"));
    assert(result.warningCodes.includes("S21_REPEATED_RECOVERY_CYCLE_RISK"));
  });

  it("is deterministic for repeated identical input", () => {
    const first = evaluate({
      recoveryContinuityLevel: "stable",
      postRecoverySurvivabilityLevel: "recovering",
      compoundedResilienceLevel: "moderate",
    });
    const second = evaluate({
      recoveryContinuityLevel: "stable",
      postRecoverySurvivabilityLevel: "recovering",
      compoundedResilienceLevel: "moderate",
    });

    assert.deepEqual(second, first);
  });

  it("preserves immutable fail-closed flags across classifications", () => {
    const scenarios = [
      evaluate(),
      evaluate({ failClosedContinuityPreservation: "absent" }),
      evaluate({ futureCollapseExposureLevel: "critical" }),
      evaluate({ repeatedCycleGovernanceDebtLevel: "critical" }),
      evaluateCountyGovernanceRecoverySurvivabilityContinuity(),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });
});
