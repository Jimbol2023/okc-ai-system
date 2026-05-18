import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceInstitutionalDurabilityExhaustion,
  type CountyGovernanceInstitutionalDurabilityExhaustionInput,
  type CountyGovernanceInstitutionalDurabilityExhaustionResult,
} from "./county-governance-institutional-durability-exhaustion-intelligence";

const baseInput: CountyGovernanceInstitutionalDurabilityExhaustionInput = {
  institutionalDurabilityLevel: "institutional",
  durabilitySustainabilityLevel: "self_sustaining",
  resilienceExhaustionLevel: "none",
  governanceFatigueSaturationLevel: "none",
  exhaustionDebtLevel: "none",
  chronicRecoveryBurdenLevel: "none",
  survivabilityInducedFragilityLevel: "none",
  failClosedDurabilityLevel: "institutional",
  explainabilityDurabilityLevel: "institutional",
  institutionalCoherenceLevel: "institutional",
  recoveryInfrastructureLoadLevel: "none",
  futureExhaustionCollapseExposure: "none",
  exhaustionReversibilityLevel: "recoverable",
  resilienceRiskVectorLevel: "none",
  longHorizonResilienceLevel: "self_sustaining",
  resilienceCycleCount: 1,
  recoveryMaintenanceCycleCount: 1,
  chronicStressCycleCount: 0,
  governanceDebtAccumulationCount: 0,
  failClosedDecayEventCount: 0,
  explainabilityDegradationCount: 0,
  coherenceDecayEventCount: 0,
};

const evaluate = (overrides: Partial<CountyGovernanceInstitutionalDurabilityExhaustionInput> = {}) =>
  evaluateCountyGovernanceInstitutionalDurabilityExhaustion({
    ...baseInput,
    ...overrides,
  });

const assertFailClosed = (result: CountyGovernanceInstitutionalDurabilityExhaustionResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Governance Institutional Durability Exhaustion Intelligence", () => {
  it("returns durability exhaustion unverified for missing input", () => {
    const result = evaluateCountyGovernanceInstitutionalDurabilityExhaustion();

    assert.equal(result.durabilityExhaustionClassification, "durability_exhaustion_unverified");
    assert.equal(result.durabilitySustainabilityScore, 0);
    assert(result.warningCodes.includes("S22_DURABILITY_EXHAUSTION_UNVERIFIED"));
    assertFailClosed(result);
  });

  it("classifies self-sustaining institutional durability", () => {
    const result = evaluate();

    assert.equal(result.durabilityExhaustionClassification, "self_sustaining_institutional_durability");
    assert.equal(result.sustainableDurabilityDetected, true);
    assert.equal(result.structuralDurabilityDetected, true);
    assert.equal(result.warningCodes.includes("S22_INSTITUTIONAL_DURABILITY_NOT_PROVEN"), false);
  });

  it("classifies structural durability", () => {
    const result = evaluate({
      institutionalDurabilityLevel: "structural",
      durabilitySustainabilityLevel: "sustainable",
      failClosedDurabilityLevel: "durable",
      explainabilityDurabilityLevel: "strong",
      institutionalCoherenceLevel: "strong",
      longHorizonResilienceLevel: "durable",
    });

    assert.equal(result.durabilityExhaustionClassification, "structural_durability");
  });

  it("classifies sustainable durability", () => {
    const result = evaluate({
      institutionalDurabilityLevel: "stable",
      durabilitySustainabilityLevel: "sustainable",
      failClosedDurabilityLevel: "durable",
      explainabilityDurabilityLevel: "strong",
      institutionalCoherenceLevel: "stable",
      longHorizonResilienceLevel: "durable",
    });

    assert.equal(result.durabilityExhaustionClassification, "sustainable_durability");
  });

  it("classifies temporary durability", () => {
    const result = evaluate({
      institutionalDurabilityLevel: "temporary",
      durabilitySustainabilityLevel: "sustainable",
      longHorizonResilienceLevel: "stable",
    });

    assert.equal(result.durabilityExhaustionClassification, "temporary_durability");
    assert(result.warningCodes.includes("S22_TEMPORARY_DURABILITY_ONLY"));
  });

  it("detects cosmetic institutional durability", () => {
    const result = evaluate({
      institutionalDurabilityLevel: "institutional",
      durabilitySustainabilityLevel: "partial",
      explainabilityDurabilityLevel: "strong",
      institutionalCoherenceLevel: "strong",
    });

    assert.equal(result.durabilityExhaustionClassification, "cosmetic_institutional_durability");
    assert.equal(result.cosmeticInstitutionalDurabilityDetected, true);
    assert(result.warningCodes.includes("S22_COSMETIC_INSTITUTIONAL_DURABILITY"));
  });

  it("detects resilience exhaustion", () => {
    const result = evaluate({
      resilienceExhaustionLevel: "high",
      resilienceCycleCount: 4,
      chronicRecoveryBurdenLevel: "moderate",
    });

    assert.equal(result.durabilityExhaustionClassification, "resilience_exhaustion");
    assert.equal(result.resilienceExhaustionDetected, true);
    assert(result.warningCodes.includes("S22_RESILIENCE_EXHAUSTION"));
  });

  it("detects governance fatigue saturation", () => {
    const result = evaluate({
      governanceFatigueSaturationLevel: "high",
      chronicStressCycleCount: 3,
    });

    assert.equal(result.durabilityExhaustionClassification, "governance_fatigue_saturation");
    assert(result.warningCodes.includes("S22_GOVERNANCE_FATIGUE_SATURATION"));
  });

  it("detects compounded exhaustion debt", () => {
    const result = evaluate({
      exhaustionDebtLevel: "high",
      governanceDebtAccumulationCount: 3,
      recoveryMaintenanceCycleCount: 4,
    });

    assert.equal(result.durabilityExhaustionClassification, "compounded_exhaustion_debt");
    assert.equal(result.compoundedExhaustionDebtDetected, true);
    assert(result.warningCodes.includes("S22_COMPOUNDED_EXHAUSTION_DEBT"));
  });

  it("detects survivability-induced fragility", () => {
    const result = evaluate({
      survivabilityInducedFragilityLevel: "high",
      resilienceRiskVectorLevel: "moderate",
    });

    assert.equal(result.durabilityExhaustionClassification, "survivability_induced_fragility");
    assert.equal(result.survivabilityInducedFragilityDetected, true);
    assert(result.warningCodes.includes("S22_SURVIVABILITY_INDUCED_FRAGILITY"));
  });

  it("detects resilience as risk vector", () => {
    const result = evaluate({
      resilienceRiskVectorLevel: "high",
      survivabilityInducedFragilityLevel: "moderate",
    });

    assert.equal(result.durabilityExhaustionClassification, "survivability_induced_fragility");
    assert.equal(result.resilienceAsRiskVectorDetected, true);
    assert(result.warningCodes.includes("S22_RESILIENCE_AS_RISK_VECTOR"));
  });

  it("detects fail-closed durability decay", () => {
    const result = evaluate({
      failClosedDurabilityLevel: "partial",
      failClosedDecayEventCount: 1,
    });

    assert.equal(result.durabilityExhaustionClassification, "fail_closed_durability_decay");
    assert.equal(result.failClosedDurabilityDecayDetected, true);
    assert(result.warningCodes.includes("S22_FAIL_CLOSED_DURABILITY_DECAY"));
  });

  it("detects explainability exhaustion", () => {
    const result = evaluate({
      explainabilityDurabilityLevel: "partial",
      institutionalCoherenceLevel: "strong",
    });

    assert.equal(result.durabilityExhaustionClassification, "explainability_exhaustion");
    assert.equal(result.explainabilityExhaustionDetected, true);
    assert(result.warningCodes.includes("S22_EXPLAINABILITY_EXHAUSTION"));
  });

  it("detects institutional coherence decay", () => {
    const result = evaluate({
      institutionalCoherenceLevel: "weak",
      coherenceDecayEventCount: 2,
    });

    assert.equal(result.durabilityExhaustionClassification, "institutional_coherence_decay");
    assert.equal(result.institutionalCoherenceDecayDetected, true);
    assert(result.warningCodes.includes("S22_INSTITUTIONAL_COHERENCE_DECAY"));
  });

  it("detects recovery infrastructure overload", () => {
    const result = evaluate({
      recoveryInfrastructureLoadLevel: "overloaded",
      resilienceExhaustionLevel: "moderate",
    });

    assert.equal(result.durabilityExhaustionClassification, "recovery_infrastructure_overload");
    assert.equal(result.recoveryInfrastructureOverloaded, true);
    assert(result.warningCodes.includes("S22_RECOVERY_INFRASTRUCTURE_OVERLOAD"));
  });

  it("applies irreversible exhaustion precedence over durable classifications", () => {
    const result = evaluate({
      exhaustionReversibilityLevel: "irreversible",
      recoveryInfrastructureLoadLevel: "high",
    });

    assert.equal(result.durabilityExhaustionClassification, "irreversible_exhaustion");
    assert.equal(result.irreversibleExhaustionDetected, true);
    assert(result.warningCodes.includes("S22_IRREVERSIBLE_EXHAUSTION"));
  });

  it("applies future exhaustion collapse exposure precedence", () => {
    const result = evaluate({
      futureExhaustionCollapseExposure: "critical",
      exhaustionReversibilityLevel: "irreversible",
      exhaustionDebtLevel: "critical",
    });

    assert.equal(result.durabilityExhaustionClassification, "future_exhaustion_collapse_exposure");
    assert.equal(result.futureExhaustionCollapseExposureDetected, true);
    assert(result.warningCodes.includes("S22_FUTURE_EXHAUSTION_COLLAPSE_EXPOSURE"));
  });

  it("applies fail-closed exhaustion required precedence", () => {
    const result = evaluate({
      failClosedDurabilityLevel: "absent",
      futureExhaustionCollapseExposure: "critical",
    });

    assert.equal(result.durabilityExhaustionClassification, "fail_closed_exhaustion_required");
    assert(result.warningCodes.includes("S22_FAIL_CLOSED_EXHAUSTION_REQUIRED"));
  });

  it("reports chronic recovery burden and long-horizon degradation warnings", () => {
    const result = evaluate({
      chronicRecoveryBurdenLevel: "high",
      longHorizonResilienceLevel: "degrading",
      resilienceExhaustionLevel: "moderate",
    });

    assert(result.warningCodes.includes("S22_CHRONIC_RECOVERY_BURDEN"));
    assert(result.warningCodes.includes("S22_LONG_HORIZON_RESILIENCE_DEGRADING"));
  });

  it("is deterministic for repeated identical input", () => {
    const first = evaluate({
      exhaustionDebtLevel: "moderate",
      recoveryMaintenanceCycleCount: 2,
    });
    const second = evaluate({
      exhaustionDebtLevel: "moderate",
      recoveryMaintenanceCycleCount: 2,
    });

    assert.deepEqual(second, first);
  });

  it("preserves immutable fail-closed flags across classifications", () => {
    const scenarios = [
      evaluate(),
      evaluate({ failClosedDurabilityLevel: "absent" }),
      evaluate({ futureExhaustionCollapseExposure: "critical" }),
      evaluate({ exhaustionReversibilityLevel: "irreversible" }),
      evaluateCountyGovernanceInstitutionalDurabilityExhaustion(),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });
});
