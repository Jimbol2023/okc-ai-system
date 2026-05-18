import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceEntropyDoctrineMaintenanceReadiness,
  type CountyGovernanceEntropyDoctrineMaintenanceReadinessInput,
} from "./county-governance-entropy-doctrine-maintenance-readiness-intelligence";

const baseInput: CountyGovernanceEntropyDoctrineMaintenanceReadinessInput = {
  maintenanceReadinessLevel: "durable",
  maintenanceSafetyLevel: "safe",
  maintenanceSustainabilityLevel: "durable",
  maintenanceEntropyBurdenLevel: "none",
  maintenanceExplainabilityLevel: "strong",
  failClosedMaintenanceIntegrityLevel: "durable",
  maintenanceContinuationNeedLevel: "none",
  boundedReevaluationNeedLevel: "none",
  survivabilityConflictLevel: "none",
  finalityConflictLevel: "none",
  recursiveDependencyLevel: "none",
  collapseExposureLevel: "none",
  operationalSustainabilityLevel: "durable",
  oversightRequirementLevel: "none",
  unresolvedDoctrineConflictCount: 0,
  maintenanceCycleCount: 1,
  reevaluationEvidenceCount: 1,
  failClosedDegradationCount: 0,
  explainabilityWeaknessCount: 0,
  recursiveDependencyEventCount: 0,
};

function evaluate(input: Partial<CountyGovernanceEntropyDoctrineMaintenanceReadinessInput>) {
  return evaluateCountyGovernanceEntropyDoctrineMaintenanceReadiness({
    ...baseInput,
    ...input,
  });
}

function assertFailClosedFlags(
  result: ReturnType<typeof evaluateCountyGovernanceEntropyDoctrineMaintenanceReadiness>,
): void {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Entropy Doctrine Maintenance Readiness Intelligence", () => {
  it("fails closed as maintenance_readiness_unverified for missing input", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineMaintenanceReadiness();

    assert.equal(result.maintenanceReadinessClassification, "maintenance_readiness_unverified");
    assert.equal(result.readinessClassification, "readiness_unverified");
    assert.equal(result.maintenanceSafetyClassification, "safety_unverified");
    assert.equal(result.warningCodes.includes("S28_MAINTENANCE_READINESS_UNVERIFIED"), true);
    assertFailClosedFlags(result);
  });

  it("classifies durable maintenance ready", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineMaintenanceReadiness(baseInput);

    assert.equal(result.maintenanceReadinessClassification, "durable_maintenance_ready");
    assert.equal(result.readinessClassification, "ready");
    assert.equal(result.maintenanceSafetyClassification, "safe");
  });

  it("classifies conditional maintenance ready", () => {
    const result = evaluate({
      maintenanceReadinessLevel: "conditional",
      maintenanceSafetyLevel: "guarded",
      maintenanceSustainabilityLevel: "conditional",
      maintenanceExplainabilityLevel: "adequate",
      failClosedMaintenanceIntegrityLevel: "stable",
      maintenanceCycleCount: 1,
    });

    assert.equal(result.maintenanceReadinessClassification, "conditional_maintenance_ready");
    assert.equal(result.readinessClassification, "conditionally_ready");
  });

  it("detects superficial maintenance readiness", () => {
    const result = evaluate({
      maintenanceReadinessLevel: "ready",
      maintenanceExplainabilityLevel: "adequate",
      reevaluationEvidenceCount: 0,
    });

    assert.equal(result.maintenanceReadinessClassification, "superficial_maintenance_ready");
    assert.equal(result.superficialMaintenanceReadiness, true);
    assert.equal(result.warningCodes.includes("S28_SUPERFICIAL_MAINTENANCE_READY"), true);
  });

  it("detects maintenance blocked", () => {
    const result = evaluate({
      maintenanceReadinessLevel: "blocked",
      maintenanceContinuationNeedLevel: "low",
    });

    assert.equal(result.maintenanceReadinessClassification, "maintenance_blocked");
    assert.equal(result.maintenanceBlocked, true);
    assert.equal(result.warningCodes.includes("S28_MAINTENANCE_BLOCKED"), true);
  });

  it("detects maintenance unsafe", () => {
    const result = evaluate({
      maintenanceSafetyLevel: "unsafe",
    });

    assert.equal(result.maintenanceReadinessClassification, "maintenance_unsafe");
    assert.equal(result.maintenanceUnsafe, true);
    assert.equal(result.warningCodes.includes("S28_MAINTENANCE_UNSAFE"), true);
  });

  it("detects maintenance continuation required", () => {
    const result = evaluate({
      maintenanceContinuationNeedLevel: "moderate",
      boundedReevaluationNeedLevel: "none",
      maintenanceEntropyBurdenLevel: "none",
      oversightRequirementLevel: "none",
    });

    assert.equal(result.maintenanceReadinessClassification, "maintenance_continuation_required");
    assert.equal(result.maintenanceContinuationRequired, true);
    assert.equal(result.warningCodes.includes("S28_MAINTENANCE_CONTINUATION_REQUIRED"), true);
  });

  it("detects bounded reevaluation required", () => {
    const result = evaluate({
      boundedReevaluationNeedLevel: "moderate",
      maintenanceContinuationNeedLevel: "none",
    });

    assert.equal(result.maintenanceReadinessClassification, "bounded_reevaluation_required");
    assert.equal(result.boundedReevaluationRequired, true);
    assert.equal(result.warningCodes.includes("S28_BOUNDED_REEVALUATION_REQUIRED"), true);
  });

  it("reports entropy burden warning path", () => {
    const result = evaluate({
      maintenanceEntropyBurdenLevel: "moderate",
      boundedReevaluationNeedLevel: "none",
      maintenanceContinuationNeedLevel: "none",
    });

    assert.equal(result.maintenanceReadinessClassification, "bounded_reevaluation_required");
    assert.equal(result.warningCodes.includes("S28_MAINTENANCE_ENTROPY_BURDEN"), true);
  });

  it("detects explainability weakness", () => {
    const result = evaluate({
      maintenanceReadinessLevel: "conditional",
      maintenanceExplainabilityLevel: "partial",
    });

    assert.equal(result.maintenanceReadinessClassification, "maintenance_explainability_weakness");
    assert.equal(result.warningCodes.includes("S28_MAINTENANCE_EXPLAINABILITY_WEAK"), true);
  });

  it("detects fail-closed degradation", () => {
    const result = evaluate({
      failClosedMaintenanceIntegrityLevel: "absent",
    });

    assert.equal(result.maintenanceReadinessClassification, "fail_closed_maintenance_degradation");
    assert.equal(result.failClosedMaintenanceDegradation, true);
    assert.equal(result.warningCodes.includes("S28_FAIL_CLOSED_MAINTENANCE_DEGRADATION"), true);
  });

  it("detects recursive dependency conflict", () => {
    const result = evaluate({
      recursiveDependencyLevel: "high",
    });

    assert.equal(result.maintenanceReadinessClassification, "recursive_dependency_conflict");
    assert.equal(result.recursiveDependencyConflict, true);
    assert.equal(result.warningCodes.includes("S28_RECURSIVE_DEPENDENCY_CONFLICT"), true);
  });

  it("detects collapse-sensitive rejection", () => {
    const result = evaluate({
      collapseExposureLevel: "high",
    });

    assert.equal(result.maintenanceReadinessClassification, "collapse_sensitive_maintenance_rejection");
    assert.equal(result.collapseSensitiveRejection, true);
    assert.equal(result.warningCodes.includes("S28_COLLAPSE_SENSITIVE_MAINTENANCE_REJECTION"), true);
  });

  it("detects survivability weakness", () => {
    const result = evaluate({
      survivabilityConflictLevel: "moderate",
      maintenanceContinuationNeedLevel: "moderate",
    });

    assert.equal(result.maintenanceReadinessClassification, "maintenance_survivability_weakness");
    assert.equal(result.maintenanceSurvivabilityWeakness, true);
    assert.equal(result.warningCodes.includes("S28_MAINTENANCE_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects unresolved doctrine conflict", () => {
    const result = evaluate({
      unresolvedDoctrineConflictCount: 1,
    });

    assert.equal(result.maintenanceReadinessClassification, "unresolved_doctrine_conflict");
    assert.equal(result.unresolvedDoctrineConflict, true);
    assert.equal(result.warningCodes.includes("S28_UNRESOLVED_DOCTRINE_CONFLICT"), true);
  });

  it("detects operationally unsustainable maintenance", () => {
    const result = evaluate({
      operationalSustainabilityLevel: "unsustainable",
    });

    assert.equal(result.maintenanceReadinessClassification, "operationally_unsustainable_maintenance");
    assert.equal(result.warningCodes.includes("S28_OPERATIONALLY_UNSUSTAINABLE_MAINTENANCE"), true);
  });

  it("is deterministic for repeated identical input", () => {
    const input = {
      maintenanceReadinessLevel: "conditional" as const,
      boundedReevaluationNeedLevel: "moderate" as const,
      oversightRequirementLevel: "moderate" as const,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("always preserves fail-closed flags", () => {
    const result = evaluate({
      maintenanceReadinessLevel: "blocked",
      collapseExposureLevel: "critical",
    });

    assertFailClosedFlags(result);
  });

  it("keeps warning-code ordering stable", () => {
    const result = evaluate({
      maintenanceReadinessLevel: "blocked",
      maintenanceSafetyLevel: "unsafe",
      maintenanceExplainabilityLevel: "opaque",
      oversightRequirementLevel: "elevated",
    });

    assert.deepEqual(result.warningCodes, [
      "S28_MAINTENANCE_BLOCKED",
      "S28_MAINTENANCE_UNSAFE",
      "S28_MAINTENANCE_EXPLAINABILITY_WEAK",
      "S28_OVERSIGHT_REQUIRED",
    ]);
  });

  it("does not mutate the input object", () => {
    const input: CountyGovernanceEntropyDoctrineMaintenanceReadinessInput = {
      ...baseInput,
      maintenanceContinuationNeedLevel: "moderate",
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceEntropyDoctrineMaintenanceReadiness(input);

    assert.equal(JSON.stringify(input), before);
  });
});
