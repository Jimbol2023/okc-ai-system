import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceEntropyDoctrineRestorationSurvivability,
  type CountyGovernanceEntropyDoctrineRestorationSurvivabilityInput,
} from "./county-governance-entropy-doctrine-restoration-survivability-intelligence";

const baseInput: CountyGovernanceEntropyDoctrineRestorationSurvivabilityInput = {
  restorationSurvivabilityLevel: "durable",
  survivabilitySustainabilityLevel: "durable",
  survivabilitySafetyLevel: "safe",
  longHorizonViabilityLevel: "durable",
  repeatedCycleSurvivabilityLevel: "strong",
  cycleFragilityAccumulationLevel: "none",
  restorationExhaustionPressureLevel: "none",
  survivabilityDependencyConcentrationLevel: "none",
  survivabilityExplainabilityLevel: "strong",
  failClosedSurvivabilityIntegrityLevel: "durable",
  survivabilityContinuationNeedLevel: "none",
  boundedSurvivabilityReevaluationNeedLevel: "none",
  recursiveSurvivabilityDependencyLevel: "none",
  collapseExposureLevel: "none",
  oversightCompatibilityLevel: "durable",
  stewardshipCompatibilityLevel: "durable",
  memoryCompatibilityLevel: "durable",
  successionCompatibilityLevel: "durable",
  restorationCompatibilityLevel: "durable",
  operationalSurvivabilitySustainabilityLevel: "durable",
  restorationCycleCount: 1,
  repeatedDisruptionCount: 0,
  fragilityAccumulationEventCount: 0,
  exhaustionEventCount: 0,
  unresolvedDoctrineConflictCount: 0,
  reevaluationEvidenceCount: 1,
  failClosedDegradationCount: 0,
  explainabilityWeaknessCount: 0,
  recursiveDependencyEventCount: 0,
  dependencyConcentrationEventCount: 0,
};

function evaluate(input: Partial<CountyGovernanceEntropyDoctrineRestorationSurvivabilityInput>) {
  return evaluateCountyGovernanceEntropyDoctrineRestorationSurvivability({
    ...baseInput,
    ...input,
  });
}

function assertFailClosedFlags(
  result: ReturnType<typeof evaluateCountyGovernanceEntropyDoctrineRestorationSurvivability>,
): void {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Entropy Doctrine Restoration Survivability Intelligence", () => {
  it("fails closed as restoration_survivability_unverified for missing input", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineRestorationSurvivability();

    assert.equal(result.restorationSurvivabilityClassification, "restoration_survivability_unverified");
    assert.equal(result.survivabilityReadinessClassification, "readiness_unverified");
    assert.equal(result.survivabilitySafetyClassification, "safety_unverified");
    assert.equal(result.warningCodes.includes("S34_RESTORATION_SURVIVABILITY_UNVERIFIED"), true);
    assertFailClosedFlags(result);
  });

  it("classifies durable restoration survivability", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineRestorationSurvivability(baseInput);

    assert.equal(result.restorationSurvivabilityClassification, "durable_restoration_survivability");
    assert.equal(result.survivabilityReadinessClassification, "ready");
    assert.equal(result.survivabilitySafetyClassification, "safe");
  });

  it("classifies conditional restoration survivability", () => {
    const result = evaluate({
      restorationSurvivabilityLevel: "conditional",
      survivabilitySustainabilityLevel: "conditional",
      survivabilitySafetyLevel: "guarded",
      longHorizonViabilityLevel: "conditional",
      repeatedCycleSurvivabilityLevel: "conditional",
      failClosedSurvivabilityIntegrityLevel: "stable",
      survivabilityExplainabilityLevel: "adequate",
      restorationCycleCount: 0,
    });

    assert.equal(result.restorationSurvivabilityClassification, "conditional_restoration_survivability");
  });

  it("classifies fragile restoration survivability", () => {
    const result = evaluate({
      restorationSurvivabilityLevel: "fragile",
      survivabilitySustainabilityLevel: "strained",
      survivabilitySafetyLevel: "guarded",
      longHorizonViabilityLevel: "fragile",
      repeatedCycleSurvivabilityLevel: "partial",
      failClosedSurvivabilityIntegrityLevel: "stable",
      restorationCycleCount: 0,
    });

    assert.equal(result.restorationSurvivabilityClassification, "fragile_restoration_survivability");
  });

  it("detects restoration survivability exhaustion", () => {
    const result = evaluate({
      restorationExhaustionPressureLevel: "high",
      collapseExposureLevel: "none",
    });

    assert.equal(result.restorationSurvivabilityClassification, "restoration_survivability_exhaustion");
    assert.equal(result.restorationSurvivabilityExhaustion, true);
    assert.equal(result.warningCodes.includes("S34_RESTORATION_SURVIVABILITY_EXHAUSTION"), true);
  });

  it("detects restoration survivability blocked", () => {
    const result = evaluate({
      restorationCompatibilityLevel: "poor",
    });

    assert.equal(result.restorationSurvivabilityClassification, "restoration_survivability_blocked");
    assert.equal(result.restorationSurvivabilityBlocked, true);
    assert.equal(result.warningCodes.includes("S34_RESTORATION_SURVIVABILITY_BLOCKED"), true);
  });

  it("detects restoration survivability unsafe", () => {
    const result = evaluate({
      survivabilitySafetyLevel: "unsafe",
    });

    assert.equal(result.restorationSurvivabilityClassification, "restoration_survivability_unsafe");
    assert.equal(result.restorationSurvivabilityUnsafe, true);
    assert.equal(result.warningCodes.includes("S34_RESTORATION_SURVIVABILITY_UNSAFE"), true);
  });

  it("detects continuation required", () => {
    const result = evaluate({
      survivabilityContinuationNeedLevel: "moderate",
      boundedSurvivabilityReevaluationNeedLevel: "none",
      restorationCycleCount: 0,
    });

    assert.equal(result.restorationSurvivabilityClassification, "restoration_survivability_continuation_required");
    assert.equal(result.survivabilityContinuationRequired, true);
  });

  it("detects bounded reevaluation required", () => {
    const result = evaluate({
      boundedSurvivabilityReevaluationNeedLevel: "moderate",
      restorationCycleCount: 0,
    });

    assert.equal(result.restorationSurvivabilityClassification, "bounded_survivability_reevaluation_required");
    assert.equal(result.boundedSurvivabilityReevaluationRequired, true);
  });

  it("detects entropy burden", () => {
    const result = evaluate({
      survivabilityDependencyConcentrationLevel: "moderate",
      restorationCycleCount: 0,
    });

    assert.equal(result.restorationSurvivabilityClassification, "restoration_survivability_entropy_burden");
    assert.equal(result.warningCodes.includes("S34_RESTORATION_SURVIVABILITY_ENTROPY_BURDEN"), true);
  });

  it("detects explainability weakness", () => {
    const result = evaluate({
      survivabilityExplainabilityLevel: "partial",
      restorationCycleCount: 0,
    });

    assert.equal(
      result.restorationSurvivabilityClassification,
      "restoration_survivability_explainability_weakness",
    );
    assert.equal(result.warningCodes.includes("S34_RESTORATION_SURVIVABILITY_EXPLAINABILITY_WEAK"), true);
  });

  it("detects fail-closed degradation", () => {
    const result = evaluate({
      failClosedDegradationCount: 1,
    });

    assert.equal(result.restorationSurvivabilityClassification, "restoration_survivability_blocked");
    assert.equal(result.failClosedSurvivabilityDegradation, true);
    assert.equal(result.warningCodes.includes("S34_FAIL_CLOSED_SURVIVABILITY_DEGRADATION"), true);
  });

  it("detects recursive dependency conflict", () => {
    const result = evaluate({
      recursiveSurvivabilityDependencyLevel: "high",
    });

    assert.equal(result.restorationSurvivabilityClassification, "restoration_survivability_blocked");
    assert.equal(result.recursiveSurvivabilityDependencyConflict, true);
    assert.equal(result.warningCodes.includes("S34_RECURSIVE_SURVIVABILITY_DEPENDENCY_CONFLICT"), true);
  });

  it("gives collapse-sensitive rejection precedence", () => {
    const result = evaluate({
      collapseExposureLevel: "high",
      survivabilitySafetyLevel: "unsafe",
      failClosedDegradationCount: 1,
    });

    assert.equal(result.restorationSurvivabilityClassification, "collapse_sensitive_survivability_rejection");
    assert.equal(result.collapseSensitiveSurvivabilityRejection, true);
    assert.equal(result.warningCodes.includes("S34_COLLAPSE_SENSITIVE_SURVIVABILITY_REJECTION"), true);
  });

  it("detects cycle fragility accumulation", () => {
    const result = evaluate({
      cycleFragilityAccumulationLevel: "high",
      collapseExposureLevel: "none",
    });

    assert.equal(result.restorationSurvivabilityClassification, "restoration_cycle_fragility_accumulation");
    assert.equal(result.restorationCycleFragilityAccumulation, true);
    assert.equal(result.warningCodes.includes("S34_RESTORATION_CYCLE_FRAGILITY_ACCUMULATION"), true);
  });

  it("detects unresolved doctrine conflict", () => {
    const result = evaluate({
      unresolvedDoctrineConflictCount: 1,
    });

    assert.equal(result.restorationSurvivabilityClassification, "restoration_survivability_blocked");
    assert.equal(result.unresolvedSurvivabilityDoctrineConflict, true);
    assert.equal(result.warningCodes.includes("S34_UNRESOLVED_SURVIVABILITY_DOCTRINE_CONFLICT"), true);
  });

  it("detects operational unsustainability", () => {
    const result = evaluate({
      operationalSurvivabilitySustainabilityLevel: "unsustainable",
    });

    assert.equal(result.restorationSurvivabilityClassification, "restoration_survivability_blocked");
    assert.equal(result.operationallyUnsustainableSurvivability, true);
    assert.equal(result.warningCodes.includes("S34_OPERATIONALLY_UNSUSTAINABLE_SURVIVABILITY"), true);
  });

  it("reports dependency concentration", () => {
    const result = evaluate({
      survivabilityDependencyConcentrationLevel: "moderate",
      restorationCycleCount: 0,
    });

    assert.equal(result.warningCodes.includes("S34_SURVIVABILITY_DEPENDENCY_CONCENTRATION"), true);
  });

  it("reports weak long-horizon viability", () => {
    const result = evaluate({
      longHorizonViabilityLevel: "fragile",
      restorationCycleCount: 0,
    });

    assert.equal(result.warningCodes.includes("S34_LONG_HORIZON_VIABILITY_WEAK"), true);
  });

  it("reports weak repeated-cycle survivability", () => {
    const result = evaluate({
      repeatedCycleSurvivabilityLevel: "partial",
      restorationCycleCount: 0,
    });

    assert.equal(result.warningCodes.includes("S34_REPEATED_CYCLE_SURVIVABILITY_WEAK"), true);
  });

  it("reports weak restoration compatibility", () => {
    const result = evaluate({
      restorationCompatibilityLevel: "strained",
      restorationCycleCount: 0,
    });

    assert.equal(result.warningCodes.includes("S34_RESTORATION_COMPATIBILITY_WEAK"), true);
  });

  it("is deterministic for repeated identical input", () => {
    const input = {
      restorationSurvivabilityLevel: "conditional" as const,
      boundedSurvivabilityReevaluationNeedLevel: "moderate" as const,
      survivabilityDependencyConcentrationLevel: "moderate" as const,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("keeps warning-code ordering stable", () => {
    const result = evaluate({
      restorationCompatibilityLevel: "poor",
      survivabilitySafetyLevel: "unsafe",
      survivabilityExplainabilityLevel: "partial",
      failClosedDegradationCount: 1,
      recursiveDependencyEventCount: 1,
    });

    assert.deepEqual(result.warningCodes, [
      "S34_RESTORATION_SURVIVABILITY_BLOCKED",
      "S34_RESTORATION_SURVIVABILITY_UNSAFE",
      "S34_RESTORATION_SURVIVABILITY_EXPLAINABILITY_WEAK",
      "S34_FAIL_CLOSED_SURVIVABILITY_DEGRADATION",
      "S34_RECURSIVE_SURVIVABILITY_DEPENDENCY_CONFLICT",
      "S34_UNRESOLVED_SURVIVABILITY_DOCTRINE_CONFLICT",
      "S34_RESTORATION_COMPATIBILITY_WEAK",
    ]);
  });

  it("does not mutate the input object", () => {
    const input: CountyGovernanceEntropyDoctrineRestorationSurvivabilityInput = {
      ...baseInput,
      survivabilityContinuationNeedLevel: "moderate",
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceEntropyDoctrineRestorationSurvivability(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("always preserves fail-closed flags", () => {
    const result = evaluate({
      collapseExposureLevel: "critical",
    });

    assertFailClosedFlags(result);
  });
});
