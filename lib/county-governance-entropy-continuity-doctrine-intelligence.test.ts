import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceEntropyContinuityDoctrine,
  type CountyGovernanceEntropyContinuityDoctrineInput,
  type CountyGovernanceEntropyContinuityDoctrineResult,
} from "./county-governance-entropy-continuity-doctrine-intelligence";

const baseInput: CountyGovernanceEntropyContinuityDoctrineInput = {
  continuityDurabilityLevel: "institutional",
  continuitySustainabilityLevel: "self_sustaining",
  continuityRecoveryDependencyLevel: "none",
  continuityEntropyBurdenLevel: "none",
  continuityAmplificationRiskLevel: "none",
  continuitySequencingCoherenceLevel: "institutional",
  continuityFragmentationPressureLevel: "none",
  continuityExplainabilityLevel: "institutional",
  failClosedContinuityIntegrityLevel: "institutional",
  continuityCollapseExposureLevel: "none",
  recursiveStabilizationDependencyLevel: "none",
  longHorizonContinuitySurvivabilityLevel: "institutional",
  operationalContinuityViabilityLevel: "institutional",
  continuityDoctrineResilienceLimitLevel: "institutional",
  continuityCycleCount: 1,
  recoveryDependencyCycleCount: 0,
  entropyAmplificationEventCount: 0,
  sequencingInstabilityEventCount: 0,
  doctrineFragmentationEventCount: 0,
  explainabilityDegradationCount: 0,
  failClosedDegradationCount: 0,
  recursiveDependencyGrowthCount: 0,
};

const evaluate = (overrides: Partial<CountyGovernanceEntropyContinuityDoctrineInput> = {}) =>
  evaluateCountyGovernanceEntropyContinuityDoctrine({
    ...baseInput,
    ...overrides,
  });

const assertFailClosed = (result: CountyGovernanceEntropyContinuityDoctrineResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Governance Entropy Continuity Doctrine Intelligence", () => {
  it("returns continuity doctrine unverified for missing input", () => {
    const result = evaluateCountyGovernanceEntropyContinuityDoctrine();

    assert.equal(result.continuityDoctrineClassification, "continuity_doctrine_unverified");
    assert.equal(result.continuityDurabilityClassification, "durability_unverified");
    assert.equal(result.continuityViabilityClassification, "viability_unverified");
    assert(result.warningCodes.includes("S25_CONTINUITY_DOCTRINE_UNVERIFIED"));
    assertFailClosed(result);
  });

  it("classifies institutional continuity doctrine", () => {
    const result = evaluate();

    assert.equal(result.continuityDoctrineClassification, "institutional_continuity_doctrine");
    assert.equal(result.continuityDurabilityClassification, "durable_continuity");
    assert.equal(result.continuityViabilityClassification, "operationally_viable");
    assert.equal(result.sustainableContinuityDetected, true);
    assert.equal(result.warningCodes.includes("S25_INSTITUTIONAL_CONTINUITY_DOCTRINE_NOT_PROVEN"), false);
  });

  it("classifies sustainable entropy continuity below institutional doctrine", () => {
    const result = evaluate({
      continuityDurabilityLevel: "durable",
      continuitySustainabilityLevel: "sustainable",
      continuitySequencingCoherenceLevel: "durable",
      continuityExplainabilityLevel: "strong",
      failClosedContinuityIntegrityLevel: "durable",
      longHorizonContinuitySurvivabilityLevel: "durable",
      operationalContinuityViabilityLevel: "strong",
      continuityDoctrineResilienceLimitLevel: "durable",
    });

    assert.equal(result.continuityDoctrineClassification, "sustainable_entropy_continuity");
    assert.equal(result.sustainableContinuityDetected, true);
  });

  it("classifies temporary continuity doctrine", () => {
    const result = evaluate({
      continuityDurabilityLevel: "temporary",
      continuitySustainabilityLevel: "sustainable",
      longHorizonContinuitySurvivabilityLevel: "resilient",
    });

    assert.equal(result.continuityDoctrineClassification, "temporary_continuity_doctrine");
    assert.equal(result.continuityDurabilityClassification, "temporary_continuity");
  });

  it("classifies recovery-dependent continuity", () => {
    const result = evaluate({
      continuityRecoveryDependencyLevel: "moderate",
      continuitySustainabilityLevel: "sustainable",
    });

    assert.equal(result.continuityDoctrineClassification, "recovery_dependent_continuity");
    assert(result.warningCodes.includes("S25_RECOVERY_DEPENDENT_CONTINUITY"));
  });

  it("classifies entropy-burdened continuity", () => {
    const result = evaluate({
      continuityEntropyBurdenLevel: "moderate",
      continuityRecoveryDependencyLevel: "low",
      recursiveStabilizationDependencyLevel: "low",
      continuityCollapseExposureLevel: "moderate",
    });

    assert.equal(result.continuityDoctrineClassification, "entropy_burdened_continuity");
    assert(result.warningCodes.includes("S25_ENTROPY_BURDENED_CONTINUITY"));
  });

  it("detects continuity doctrine fragmentation", () => {
    const result = evaluate({
      continuityFragmentationPressureLevel: "high",
    });

    assert.equal(result.continuityDoctrineClassification, "continuity_doctrine_fragmentation");
    assert.equal(result.continuityFragmentationDetected, true);
    assert(result.warningCodes.includes("S25_CONTINUITY_DOCTRINE_FRAGMENTATION"));
  });

  it("detects continuity sequencing instability", () => {
    const result = evaluate({
      continuitySequencingCoherenceLevel: "fragile",
    });

    assert.equal(result.continuityDoctrineClassification, "continuity_sequencing_instability");
    assert.equal(result.continuitySequencingInstabilityDetected, true);
    assert(result.warningCodes.includes("S25_CONTINUITY_SEQUENCING_INSTABILITY"));
  });

  it("detects continuity amplification instability", () => {
    const result = evaluate({
      continuityAmplificationRiskLevel: "high",
      continuityEntropyBurdenLevel: "moderate",
    });

    assert.equal(result.continuityDoctrineClassification, "continuity_amplification_instability");
    assert.equal(result.continuityAmplificationDetected, true);
    assert(result.warningCodes.includes("S25_CONTINUITY_AMPLIFIES_ENTROPY"));
  });

  it("detects recursive continuity dependency", () => {
    const result = evaluate({
      recursiveStabilizationDependencyLevel: "high",
      continuityRecoveryDependencyLevel: "low",
    });

    assert.equal(result.continuityDoctrineClassification, "recursive_continuity_dependency");
    assert.equal(result.recursiveContinuityDependencyDetected, true);
    assert(result.warningCodes.includes("S25_RECURSIVE_CONTINUITY_DEPENDENCY"));
  });

  it("detects probabilistically unstable continuity deterministically", () => {
    const result = evaluate({
      continuityCollapseExposureLevel: "high",
      operationalContinuityViabilityLevel: "strong",
      failClosedContinuityIntegrityLevel: "durable",
    });

    assert.equal(result.continuityDoctrineClassification, "probabilistically_unstable_continuity");
    assert.equal(result.probabilisticallyUnstableContinuityDetected, true);
    assert(result.warningCodes.includes("S25_PROBABILISTIC_CONTINUITY_INSTABILITY"));
  });

  it("applies operationally nonviable continuity precedence", () => {
    const result = evaluate({
      operationalContinuityViabilityLevel: "nonviable",
      failClosedContinuityIntegrityLevel: "absent",
      continuityCollapseExposureLevel: "critical",
    });

    assert.equal(result.continuityDoctrineClassification, "operationally_nonviable_continuity");
    assert.equal(result.continuityViabilityClassification, "operationally_nonviable");
    assert(result.warningCodes.includes("S25_OPERATIONALLY_NONVIABLE_CONTINUITY"));
  });

  it("applies fail-closed continuity degradation precedence after operational nonviability", () => {
    const result = evaluate({
      failClosedContinuityIntegrityLevel: "absent",
      operationalContinuityViabilityLevel: "strong",
      continuityCollapseExposureLevel: "none",
    });

    assert.equal(result.continuityDoctrineClassification, "fail_closed_continuity_degradation");
    assert.equal(result.failClosedContinuityDegradationDetected, true);
    assert(result.warningCodes.includes("S25_FAIL_CLOSED_CONTINUITY_DEGRADATION"));
  });

  it("reports continuity explainability degradation warning", () => {
    const result = evaluate({
      continuityExplainabilityLevel: "partial",
    });

    assert(result.warningCodes.includes("S25_CONTINUITY_EXPLAINABILITY_DEGRADATION"));
  });

  it("reports long-horizon survivability weakness warning", () => {
    const result = evaluate({
      longHorizonContinuitySurvivabilityLevel: "declining",
      continuityCollapseExposureLevel: "none",
      failClosedContinuityIntegrityLevel: "durable",
    });

    assert(result.warningCodes.includes("S25_LONG_HORIZON_CONTINUITY_SURVIVABILITY_WEAK"));
  });

  it("reports collapse exposure warning", () => {
    const result = evaluate({
      continuityCollapseExposureLevel: "high",
      operationalContinuityViabilityLevel: "strong",
      failClosedContinuityIntegrityLevel: "durable",
    });

    assert(result.warningCodes.includes("S25_CONTINUITY_COLLAPSE_EXPOSURE"));
  });

  it("is deterministic for repeated identical input", () => {
    const first = evaluate({
      continuityCycleCount: 2,
      continuitySustainabilityLevel: "sustainable",
      continuityDurabilityLevel: "durable",
    });
    const second = evaluate({
      continuityCycleCount: 2,
      continuitySustainabilityLevel: "sustainable",
      continuityDurabilityLevel: "durable",
    });

    assert.deepEqual(second, first);
  });

  it("preserves immutable fail-closed flags across classifications", () => {
    const scenarios = [
      evaluate(),
      evaluate({ operationalContinuityViabilityLevel: "nonviable" }),
      evaluate({ failClosedContinuityIntegrityLevel: "absent" }),
      evaluate({ continuityAmplificationRiskLevel: "high" }),
      evaluateCountyGovernanceEntropyContinuityDoctrine(),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });
});
