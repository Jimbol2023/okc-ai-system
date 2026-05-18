import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceEntropyDoctrineStewardshipContinuity,
  type CountyGovernanceEntropyDoctrineStewardshipContinuityInput,
} from "./county-governance-entropy-doctrine-stewardship-continuity-intelligence";

const baseInput: CountyGovernanceEntropyDoctrineStewardshipContinuityInput = {
  stewardshipContinuityLevel: "durable",
  stewardshipSustainabilityLevel: "durable",
  stewardshipSafetyLevel: "safe",
  stewardshipDurabilityLevel: "durable",
  stewardshipBurdenLevel: "none",
  dependencyConcentrationLevel: "none",
  transferabilityLevel: "strong",
  stewardshipExplainabilityLevel: "strong",
  failClosedStewardshipIntegrityLevel: "durable",
  stewardshipContinuationNeedLevel: "none",
  boundedStewardshipReevaluationNeedLevel: "none",
  recursiveStewardshipDependencyLevel: "none",
  collapseExposureLevel: "none",
  oversightCompatibilityLevel: "durable",
  maintenanceCompatibilityLevel: "durable",
  finalityCompatibilityLevel: "durable",
  survivabilityCompatibilityLevel: "durable",
  operationalStewardshipSustainabilityLevel: "durable",
  stewardshipCycleCount: 1,
  transferEventCount: 0,
  unresolvedDoctrineConflictCount: 0,
  reevaluationEvidenceCount: 1,
  failClosedDegradationCount: 0,
  explainabilityWeaknessCount: 0,
  recursiveDependencyEventCount: 0,
  dependencyConcentrationEventCount: 0,
};

function evaluate(input: Partial<CountyGovernanceEntropyDoctrineStewardshipContinuityInput>) {
  return evaluateCountyGovernanceEntropyDoctrineStewardshipContinuity({
    ...baseInput,
    ...input,
  });
}

function assertFailClosedFlags(
  result: ReturnType<typeof evaluateCountyGovernanceEntropyDoctrineStewardshipContinuity>,
): void {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Entropy Doctrine Stewardship Continuity Intelligence", () => {
  it("fails closed as stewardship_continuity_unverified for missing input", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineStewardshipContinuity();

    assert.equal(result.stewardshipContinuityClassification, "stewardship_continuity_unverified");
    assert.equal(result.stewardshipReadinessClassification, "readiness_unverified");
    assert.equal(result.stewardshipSafetyClassification, "safety_unverified");
    assert.equal(result.warningCodes.includes("S30_STEWARDSHIP_CONTINUITY_UNVERIFIED"), true);
    assertFailClosedFlags(result);
  });

  it("classifies durable stewardship continuity", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineStewardshipContinuity(baseInput);

    assert.equal(result.stewardshipContinuityClassification, "durable_stewardship_continuity");
    assert.equal(result.stewardshipReadinessClassification, "ready");
    assert.equal(result.stewardshipSafetyClassification, "safe");
  });

  it("classifies conditional stewardship continuity", () => {
    const result = evaluate({
      stewardshipContinuityLevel: "conditional",
      stewardshipSustainabilityLevel: "conditional",
      stewardshipSafetyLevel: "guarded",
      stewardshipDurabilityLevel: "stable",
      transferabilityLevel: "strong",
      stewardshipExplainabilityLevel: "adequate",
      failClosedStewardshipIntegrityLevel: "stable",
    });

    assert.equal(result.stewardshipContinuityClassification, "conditional_stewardship_continuity");
    assert.equal(result.stewardshipReadinessClassification, "conditionally_ready");
  });

  it("detects superficial stewardship continuity", () => {
    const result = evaluate({
      stewardshipContinuityLevel: "stable",
      stewardshipExplainabilityLevel: "adequate",
      transferabilityLevel: "strong",
      reevaluationEvidenceCount: 0,
    });

    assert.equal(result.stewardshipContinuityClassification, "superficial_stewardship_continuity");
    assert.equal(result.superficialStewardshipContinuity, true);
    assert.equal(result.warningCodes.includes("S30_SUPERFICIAL_STEWARDSHIP_CONTINUITY"), true);
  });

  it("detects stewardship blocked", () => {
    const result = evaluate({
      oversightCompatibilityLevel: "poor",
      maintenanceCompatibilityLevel: "poor",
    });

    assert.equal(result.stewardshipContinuityClassification, "stewardship_blocked");
    assert.equal(result.stewardshipBlocked, true);
    assert.equal(result.warningCodes.includes("S30_STEWARDSHIP_BLOCKED"), true);
  });

  it("detects stewardship unsafe", () => {
    const result = evaluate({
      stewardshipSafetyLevel: "unsafe",
    });

    assert.equal(result.stewardshipContinuityClassification, "stewardship_unsafe");
    assert.equal(result.stewardshipUnsafe, true);
    assert.equal(result.warningCodes.includes("S30_STEWARDSHIP_UNSAFE"), true);
  });

  it("detects stewardship continuation required", () => {
    const result = evaluate({
      stewardshipContinuationNeedLevel: "moderate",
      boundedStewardshipReevaluationNeedLevel: "none",
      stewardshipBurdenLevel: "none",
      dependencyConcentrationLevel: "none",
    });

    assert.equal(result.stewardshipContinuityClassification, "stewardship_continuation_required");
    assert.equal(result.stewardshipContinuationRequired, true);
    assert.equal(result.warningCodes.includes("S30_STEWARDSHIP_CONTINUATION_REQUIRED"), true);
  });

  it("detects bounded stewardship reevaluation required", () => {
    const result = evaluate({
      boundedStewardshipReevaluationNeedLevel: "moderate",
      stewardshipContinuationNeedLevel: "none",
    });

    assert.equal(result.stewardshipContinuityClassification, "bounded_stewardship_reevaluation_required");
    assert.equal(result.boundedStewardshipReevaluationRequired, true);
    assert.equal(result.warningCodes.includes("S30_BOUNDED_STEWARDSHIP_REEVALUATION_REQUIRED"), true);
  });

  it("reports entropy burden warning path", () => {
    const result = evaluate({
      stewardshipBurdenLevel: "moderate",
      boundedStewardshipReevaluationNeedLevel: "none",
      stewardshipContinuationNeedLevel: "none",
    });

    assert.equal(result.warningCodes.includes("S30_STEWARDSHIP_ENTROPY_BURDEN"), true);
  });

  it("reports dependency concentration warning path", () => {
    const result = evaluate({
      dependencyConcentrationLevel: "moderate",
      boundedStewardshipReevaluationNeedLevel: "none",
      stewardshipContinuationNeedLevel: "none",
    });

    assert.equal(result.warningCodes.includes("S30_STEWARDSHIP_DEPENDENCY_CONCENTRATION"), true);
  });

  it("reports transferability weakness", () => {
    const result = evaluate({
      stewardshipContinuityLevel: "conditional",
      transferabilityLevel: "partial",
    });

    assert.equal(result.warningCodes.includes("S30_STEWARDSHIP_TRANSFERABILITY_WEAK"), true);
  });

  it("detects explainability weakness", () => {
    const result = evaluate({
      stewardshipContinuityLevel: "conditional",
      stewardshipExplainabilityLevel: "partial",
    });

    assert.equal(result.stewardshipContinuityClassification, "stewardship_explainability_weakness");
    assert.equal(result.warningCodes.includes("S30_STEWARDSHIP_EXPLAINABILITY_WEAK"), true);
  });

  it("detects fail-closed degradation", () => {
    const result = evaluate({
      failClosedStewardshipIntegrityLevel: "absent",
    });

    assert.equal(result.stewardshipContinuityClassification, "fail_closed_stewardship_degradation");
    assert.equal(result.failClosedStewardshipDegradation, true);
    assert.equal(result.warningCodes.includes("S30_FAIL_CLOSED_STEWARDSHIP_DEGRADATION"), true);
  });

  it("detects recursive stewardship dependency conflict", () => {
    const result = evaluate({
      recursiveStewardshipDependencyLevel: "high",
    });

    assert.equal(result.stewardshipContinuityClassification, "recursive_stewardship_dependency_conflict");
    assert.equal(result.recursiveStewardshipDependencyConflict, true);
    assert.equal(result.warningCodes.includes("S30_RECURSIVE_STEWARDSHIP_DEPENDENCY_CONFLICT"), true);
  });

  it("detects collapse-sensitive rejection", () => {
    const result = evaluate({
      collapseExposureLevel: "high",
    });

    assert.equal(result.stewardshipContinuityClassification, "collapse_sensitive_stewardship_rejection");
    assert.equal(result.collapseSensitiveStewardshipRejection, true);
    assert.equal(result.warningCodes.includes("S30_COLLAPSE_SENSITIVE_STEWARDSHIP_REJECTION"), true);
  });

  it("detects survivability weakness", () => {
    const result = evaluate({
      survivabilityCompatibilityLevel: "strained",
      stewardshipContinuationNeedLevel: "moderate",
    });

    assert.equal(result.stewardshipContinuityClassification, "stewardship_survivability_weakness");
    assert.equal(result.stewardshipSurvivabilityWeakness, true);
    assert.equal(result.warningCodes.includes("S30_STEWARDSHIP_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects unresolved doctrine conflict", () => {
    const result = evaluate({
      unresolvedDoctrineConflictCount: 1,
    });

    assert.equal(result.stewardshipContinuityClassification, "unresolved_stewardship_doctrine_conflict");
    assert.equal(result.unresolvedStewardshipDoctrineConflict, true);
    assert.equal(result.warningCodes.includes("S30_UNRESOLVED_STEWARDSHIP_DOCTRINE_CONFLICT"), true);
  });

  it("detects operationally unsustainable stewardship", () => {
    const result = evaluate({
      operationalStewardshipSustainabilityLevel: "unsustainable",
    });

    assert.equal(result.stewardshipContinuityClassification, "operationally_unsustainable_stewardship");
    assert.equal(result.operationallyUnsustainableStewardship, true);
    assert.equal(result.warningCodes.includes("S30_OPERATIONALLY_UNSUSTAINABLE_STEWARDSHIP"), true);
  });

  it("reports oversight compatibility weakness", () => {
    const result = evaluate({
      stewardshipContinuityLevel: "conditional",
      oversightCompatibilityLevel: "strained",
    });

    assert.equal(result.warningCodes.includes("S30_OVERSIGHT_COMPATIBILITY_WEAK"), true);
  });

  it("is deterministic for repeated identical input", () => {
    const input = {
      stewardshipContinuityLevel: "conditional" as const,
      boundedStewardshipReevaluationNeedLevel: "moderate" as const,
      dependencyConcentrationLevel: "moderate" as const,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("keeps warning-code ordering stable", () => {
    const result = evaluate({
      oversightCompatibilityLevel: "poor",
      maintenanceCompatibilityLevel: "poor",
      stewardshipSafetyLevel: "unsafe",
      stewardshipExplainabilityLevel: "opaque",
      transferabilityLevel: "weak",
    });

    assert.deepEqual(result.warningCodes, [
      "S30_STEWARDSHIP_BLOCKED",
      "S30_STEWARDSHIP_UNSAFE",
      "S30_STEWARDSHIP_EXPLAINABILITY_WEAK",
      "S30_STEWARDSHIP_TRANSFERABILITY_WEAK",
      "S30_OVERSIGHT_COMPATIBILITY_WEAK",
    ]);
  });

  it("does not mutate the input object", () => {
    const input: CountyGovernanceEntropyDoctrineStewardshipContinuityInput = {
      ...baseInput,
      stewardshipContinuationNeedLevel: "moderate",
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceEntropyDoctrineStewardshipContinuity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("always preserves fail-closed flags", () => {
    const result = evaluate({
      collapseExposureLevel: "critical",
    });

    assertFailClosedFlags(result);
  });
});
