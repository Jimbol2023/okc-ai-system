import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceEntropyDoctrineOversightSustainability,
  type CountyGovernanceEntropyDoctrineOversightSustainabilityInput,
} from "./county-governance-entropy-doctrine-oversight-sustainability-intelligence";

const baseInput: CountyGovernanceEntropyDoctrineOversightSustainabilityInput = {
  oversightSustainabilityLevel: "durable",
  oversightSafetyLevel: "safe",
  oversightDurabilityLevel: "durable",
  oversightBurdenLevel: "none",
  oversightFatigueLevel: "none",
  oversightExplainabilityLevel: "strong",
  failClosedOversightIntegrityLevel: "durable",
  oversightContinuationNeedLevel: "none",
  boundedOversightReevaluationNeedLevel: "none",
  stewardshipCapacityLevel: "strong",
  recursiveOversightDependencyLevel: "none",
  collapseExposureLevel: "none",
  maintenanceCompatibilityLevel: "compatible",
  finalityCompatibilityLevel: "compatible",
  survivabilityCompatibilityLevel: "compatible",
  operationalOversightSustainabilityLevel: "durable",
  resourcePressureLevel: "none",
  oversightCycleCount: 1,
  oversightFatigueEventCount: 0,
  unresolvedDoctrineConflictCount: 0,
  reevaluationEvidenceCount: 1,
  failClosedDegradationCount: 0,
  explainabilityWeaknessCount: 0,
  recursiveDependencyEventCount: 0,
  resourceEscalationEventCount: 0,
};

function evaluate(input: Partial<CountyGovernanceEntropyDoctrineOversightSustainabilityInput>) {
  return evaluateCountyGovernanceEntropyDoctrineOversightSustainability({
    ...baseInput,
    ...input,
  });
}

function assertFailClosedFlags(
  result: ReturnType<typeof evaluateCountyGovernanceEntropyDoctrineOversightSustainability>,
): void {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Entropy Doctrine Oversight Sustainability Intelligence", () => {
  it("fails closed as oversight_sustainability_unverified for missing input", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineOversightSustainability();

    assert.equal(result.oversightSustainabilityClassification, "oversight_sustainability_unverified");
    assert.equal(result.oversightReadinessClassification, "readiness_unverified");
    assert.equal(result.oversightSafetyClassification, "safety_unverified");
    assert.equal(result.warningCodes.includes("S29_OVERSIGHT_SUSTAINABILITY_UNVERIFIED"), true);
    assertFailClosedFlags(result);
  });

  it("classifies durable oversight sustainability", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineOversightSustainability(baseInput);

    assert.equal(result.oversightSustainabilityClassification, "durable_oversight_sustainability");
    assert.equal(result.oversightReadinessClassification, "ready");
    assert.equal(result.oversightSafetyClassification, "safe");
  });

  it("classifies conditional oversight sustainability", () => {
    const result = evaluate({
      oversightSustainabilityLevel: "conditional",
      oversightSafetyLevel: "guarded",
      oversightDurabilityLevel: "stable",
      oversightExplainabilityLevel: "adequate",
      failClosedOversightIntegrityLevel: "stable",
      stewardshipCapacityLevel: "strong",
      maintenanceCompatibilityLevel: "compatible",
      finalityCompatibilityLevel: "compatible",
      survivabilityCompatibilityLevel: "compatible",
    });

    assert.equal(result.oversightSustainabilityClassification, "conditional_oversight_sustainability");
    assert.equal(result.oversightReadinessClassification, "conditionally_ready");
  });

  it("detects superficial oversight sustainability", () => {
    const result = evaluate({
      oversightSustainabilityLevel: "sustainable",
      oversightExplainabilityLevel: "adequate",
      reevaluationEvidenceCount: 0,
    });

    assert.equal(result.oversightSustainabilityClassification, "superficial_oversight_sustainability");
    assert.equal(result.superficialOversightSustainability, true);
    assert.equal(result.warningCodes.includes("S29_SUPERFICIAL_OVERSIGHT_SUSTAINABILITY"), true);
  });

  it("detects oversight blocked", () => {
    const result = evaluate({
      maintenanceCompatibilityLevel: "poor",
      finalityCompatibilityLevel: "poor",
    });

    assert.equal(result.oversightSustainabilityClassification, "oversight_blocked");
    assert.equal(result.oversightBlocked, true);
    assert.equal(result.warningCodes.includes("S29_OVERSIGHT_BLOCKED"), true);
  });

  it("detects oversight unsafe", () => {
    const result = evaluate({
      oversightSafetyLevel: "unsafe",
    });

    assert.equal(result.oversightSustainabilityClassification, "oversight_unsafe");
    assert.equal(result.oversightUnsafe, true);
    assert.equal(result.warningCodes.includes("S29_OVERSIGHT_UNSAFE"), true);
  });

  it("detects oversight continuation required", () => {
    const result = evaluate({
      oversightContinuationNeedLevel: "moderate",
      boundedOversightReevaluationNeedLevel: "none",
      oversightBurdenLevel: "none",
      oversightFatigueLevel: "none",
      resourcePressureLevel: "none",
    });

    assert.equal(result.oversightSustainabilityClassification, "oversight_continuation_required");
    assert.equal(result.oversightContinuationRequired, true);
    assert.equal(result.warningCodes.includes("S29_OVERSIGHT_CONTINUATION_REQUIRED"), true);
  });

  it("detects bounded oversight reevaluation required", () => {
    const result = evaluate({
      boundedOversightReevaluationNeedLevel: "moderate",
      oversightContinuationNeedLevel: "none",
    });

    assert.equal(result.oversightSustainabilityClassification, "bounded_oversight_reevaluation_required");
    assert.equal(result.boundedOversightReevaluationRequired, true);
    assert.equal(result.warningCodes.includes("S29_BOUNDED_OVERSIGHT_REEVALUATION_REQUIRED"), true);
  });

  it("reports entropy burden warning path", () => {
    const result = evaluate({
      oversightBurdenLevel: "moderate",
      boundedOversightReevaluationNeedLevel: "none",
      oversightContinuationNeedLevel: "none",
    });

    assert.equal(result.oversightSustainabilityClassification, "bounded_oversight_reevaluation_required");
    assert.equal(result.warningCodes.includes("S29_OVERSIGHT_ENTROPY_BURDEN"), true);
  });

  it("reports fatigue accumulation warning path", () => {
    const result = evaluate({
      oversightFatigueLevel: "moderate",
      boundedOversightReevaluationNeedLevel: "none",
      oversightContinuationNeedLevel: "none",
    });

    assert.equal(result.warningCodes.includes("S29_OVERSIGHT_FATIGUE_ACCUMULATION"), true);
  });

  it("detects explainability weakness", () => {
    const result = evaluate({
      oversightSustainabilityLevel: "conditional",
      oversightExplainabilityLevel: "partial",
    });

    assert.equal(result.oversightSustainabilityClassification, "oversight_explainability_weakness");
    assert.equal(result.warningCodes.includes("S29_OVERSIGHT_EXPLAINABILITY_WEAK"), true);
  });

  it("detects fail-closed degradation", () => {
    const result = evaluate({
      failClosedOversightIntegrityLevel: "absent",
    });

    assert.equal(result.oversightSustainabilityClassification, "fail_closed_oversight_degradation");
    assert.equal(result.failClosedOversightDegradation, true);
    assert.equal(result.warningCodes.includes("S29_FAIL_CLOSED_OVERSIGHT_DEGRADATION"), true);
  });

  it("detects recursive oversight dependency conflict", () => {
    const result = evaluate({
      recursiveOversightDependencyLevel: "high",
    });

    assert.equal(result.oversightSustainabilityClassification, "recursive_oversight_dependency_conflict");
    assert.equal(result.recursiveOversightDependencyConflict, true);
    assert.equal(result.warningCodes.includes("S29_RECURSIVE_OVERSIGHT_DEPENDENCY_CONFLICT"), true);
  });

  it("detects collapse-sensitive rejection", () => {
    const result = evaluate({
      collapseExposureLevel: "high",
    });

    assert.equal(result.oversightSustainabilityClassification, "collapse_sensitive_oversight_rejection");
    assert.equal(result.collapseSensitiveOversightRejection, true);
    assert.equal(result.warningCodes.includes("S29_COLLAPSE_SENSITIVE_OVERSIGHT_REJECTION"), true);
  });

  it("detects survivability weakness", () => {
    const result = evaluate({
      survivabilityCompatibilityLevel: "strained",
      oversightContinuationNeedLevel: "moderate",
    });

    assert.equal(result.oversightSustainabilityClassification, "oversight_survivability_weakness");
    assert.equal(result.oversightSurvivabilityWeakness, true);
    assert.equal(result.warningCodes.includes("S29_OVERSIGHT_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects unresolved doctrine conflict", () => {
    const result = evaluate({
      unresolvedDoctrineConflictCount: 1,
    });

    assert.equal(result.oversightSustainabilityClassification, "unresolved_oversight_doctrine_conflict");
    assert.equal(result.unresolvedOversightDoctrineConflict, true);
    assert.equal(result.warningCodes.includes("S29_UNRESOLVED_OVERSIGHT_DOCTRINE_CONFLICT"), true);
  });

  it("detects operationally unsustainable oversight", () => {
    const result = evaluate({
      operationalOversightSustainabilityLevel: "unsustainable",
    });

    assert.equal(result.oversightSustainabilityClassification, "operationally_unsustainable_oversight");
    assert.equal(result.operationallyUnsustainableOversight, true);
    assert.equal(result.warningCodes.includes("S29_OPERATIONALLY_UNSUSTAINABLE_OVERSIGHT"), true);
  });

  it("reports stewardship capacity weakness", () => {
    const result = evaluate({
      oversightSustainabilityLevel: "conditional",
      stewardshipCapacityLevel: "strained",
    });

    assert.equal(result.warningCodes.includes("S29_STEWARDSHIP_CAPACITY_WEAK"), true);
  });

  it("reports resource pressure", () => {
    const result = evaluate({
      resourcePressureLevel: "moderate",
      boundedOversightReevaluationNeedLevel: "none",
      oversightContinuationNeedLevel: "none",
    });

    assert.equal(result.warningCodes.includes("S29_OVERSIGHT_RESOURCE_PRESSURE"), true);
  });

  it("is deterministic for repeated identical input", () => {
    const input = {
      oversightSustainabilityLevel: "conditional" as const,
      boundedOversightReevaluationNeedLevel: "moderate" as const,
      resourcePressureLevel: "moderate" as const,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("keeps warning-code ordering stable", () => {
    const result = evaluate({
      maintenanceCompatibilityLevel: "poor",
      finalityCompatibilityLevel: "poor",
      oversightSafetyLevel: "unsafe",
      oversightExplainabilityLevel: "opaque",
      resourcePressureLevel: "moderate",
      stewardshipCapacityLevel: "weak",
    });

    assert.deepEqual(result.warningCodes, [
      "S29_OVERSIGHT_BLOCKED",
      "S29_OVERSIGHT_UNSAFE",
      "S29_OVERSIGHT_EXPLAINABILITY_WEAK",
      "S29_OVERSIGHT_RESOURCE_PRESSURE",
      "S29_STEWARDSHIP_CAPACITY_WEAK",
    ]);
  });

  it("does not mutate the input object", () => {
    const input: CountyGovernanceEntropyDoctrineOversightSustainabilityInput = {
      ...baseInput,
      oversightContinuationNeedLevel: "moderate",
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceEntropyDoctrineOversightSustainability(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("always preserves fail-closed flags", () => {
    const result = evaluate({
      collapseExposureLevel: "critical",
    });

    assertFailClosedFlags(result);
  });
});
