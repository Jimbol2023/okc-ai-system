import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceEntropyDoctrineFinality,
  type CountyGovernanceEntropyDoctrineFinalityInput,
} from "./county-governance-entropy-doctrine-finality-intelligence";

const baseInput: CountyGovernanceEntropyDoctrineFinalityInput = {
  finalityReadinessLevel: "durable",
  finalityDurabilityLevel: "durable",
  finalitySafetyLevel: "safe",
  closureRiskLevel: "none",
  maintenanceOnlyReadinessLevel: "ready",
  unresolvedEntropyLevel: "none",
  recoveryDoctrineRiskLevel: "none",
  continuityDoctrineRiskLevel: "none",
  survivabilityDoctrineRiskLevel: "none",
  recursiveDependencyLevel: "none",
  failClosedFinalityIntegrityLevel: "durable",
  finalityExplainabilityLevel: "strong",
  irreversibleDegradationLevel: "none",
  collapseSensitivityLevel: "none",
  boundedContinuationNeedLevel: "none",
  unresolvedRiskCount: 0,
  finalityReviewCycleCount: 1,
  closureAttemptCount: 0,
  maintenanceReadinessEvidenceCount: 1,
  failClosedDegradationCount: 0,
  explainabilityWeaknessCount: 0,
};

function assertFailClosedFlags(result: ReturnType<typeof evaluateCountyGovernanceEntropyDoctrineFinality>): void {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Entropy Doctrine Finality Intelligence", () => {
  it("returns doctrine finality unverified for missing input", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality();

    assert.equal(result.finalityClassification, "doctrine_finality_unverified");
    assert.equal(result.readinessClassification, "readiness_unverified");
    assert.equal(result.closureClassification, "closure_unverified");
    assert.equal(result.warningCodes.includes("S27_DOCTRINE_FINALITY_UNVERIFIED"), true);
  });

  it("classifies durable doctrine finality", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality(baseInput);

    assert.equal(result.finalityClassification, "durable_doctrine_finality");
    assert.equal(result.durableFinalityDetected, true);
    assert.equal(result.maintenanceOnlyReady, true);
    assert.equal(result.closureClassification, "closure_safe_advisory_only");
  });

  it("classifies conditional doctrine finality", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      finalityReadinessLevel: "conditional",
      finalityDurabilityLevel: "stable",
      finalitySafetyLevel: "guarded",
      maintenanceOnlyReadinessLevel: "limited",
      maintenanceReadinessEvidenceCount: 0,
      finalityReviewCycleCount: 1,
    });

    assert.equal(result.finalityClassification, "conditional_doctrine_finality");
    assert.equal(result.readinessClassification, "conditionally_ready");
  });

  it("classifies temporary doctrine finality", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      finalityReadinessLevel: "temporary",
      finalityDurabilityLevel: "temporary",
      finalitySafetyLevel: "guarded",
      maintenanceOnlyReadinessLevel: "limited",
      finalityReviewCycleCount: 1,
    });

    assert.equal(result.finalityClassification, "temporary_doctrine_finality");
  });

  it("detects maintenance-only readiness", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      finalityReadinessLevel: "conditional",
      finalityDurabilityLevel: "stable",
      finalitySafetyLevel: "safe",
    });

    assert.equal(result.finalityClassification, "maintenance_only_ready");
    assert.equal(result.maintenanceOnlyReady, true);
    assert.equal(result.readinessClassification, "ready_for_maintenance_only");
  });

  it("detects bounded continuation required", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      finalityReadinessLevel: "conditional",
      finalityDurabilityLevel: "stable",
      finalitySafetyLevel: "safe",
      maintenanceOnlyReadinessLevel: "conditional",
      boundedContinuationNeedLevel: "moderate",
      finalityReviewCycleCount: 1,
    });

    assert.equal(result.finalityClassification, "bounded_continuation_required");
    assert.equal(result.boundedContinuationRequired, true);
    assert.equal(result.warningCodes.includes("S27_BOUNDED_CONTINUATION_REQUIRED"), true);
  });

  it("detects superficial finality", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      finalitySafetyLevel: "guarded",
      finalityExplainabilityLevel: "adequate",
      maintenanceOnlyReadinessLevel: "ready",
      finalityReviewCycleCount: 1,
    });

    assert.equal(result.finalityClassification, "superficial_finality");
    assert.equal(result.superficialFinalityDetected, true);
    assert.equal(result.warningCodes.includes("S27_SUPERFICIAL_FINALITY_DETECTED"), true);
  });

  it("detects finality blocked", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      finalityReadinessLevel: "blocked",
      closureRiskLevel: "low",
      finalityReviewCycleCount: 1,
    });

    assert.equal(result.finalityClassification, "finality_blocked");
    assert.equal(result.finalityBlocked, true);
    assert.equal(result.warningCodes.includes("S27_FINALITY_BLOCKED"), true);
  });

  it("detects finality unsafe", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      finalitySafetyLevel: "unsafe",
      finalityReadinessLevel: "durable",
      finalityReviewCycleCount: 1,
    });

    assert.equal(result.finalityClassification, "finality_unsafe");
    assert.equal(result.finalityUnsafe, true);
    assert.equal(result.warningCodes.includes("S27_FINALITY_UNSAFE"), true);
  });

  it("detects fail-closed finality block", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      failClosedFinalityIntegrityLevel: "absent",
      finalityReviewCycleCount: 1,
    });

    assert.equal(result.finalityClassification, "fail_closed_finality_block");
    assert.equal(result.failClosedFinalityBlockDetected, true);
    assert.equal(result.warningCodes.includes("S27_FAIL_CLOSED_FINALITY_BLOCK"), true);
  });

  it("prioritizes irreversible finality failure", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      irreversibleDegradationLevel: "critical",
      failClosedFinalityIntegrityLevel: "absent",
      closureRiskLevel: "critical",
    });

    assert.equal(result.finalityClassification, "irreversible_finality_failure");
    assert.equal(result.irreversibleFinalityFailureDetected, true);
    assert.equal(result.warningCodes.includes("S27_IRREVERSIBLE_FINALITY_FAILURE"), true);
  });

  it("detects recursive dependency finality conflict", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      recursiveDependencyLevel: "high",
      finalityReviewCycleCount: 1,
    });

    assert.equal(result.finalityClassification, "finality_blocked");
    assert.equal(result.recursiveDependencyFinalityConflictDetected, true);
    assert.equal(result.warningCodes.includes("S27_RECURSIVE_DEPENDENCY_FINALITY_CONFLICT"), true);
  });

  it("detects unresolved entropy conflict", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      unresolvedEntropyLevel: "high",
      finalityReviewCycleCount: 1,
    });

    assert.equal(result.finalityClassification, "finality_blocked");
    assert.equal(result.unresolvedEntropyFinalityConflictDetected, true);
    assert.equal(result.warningCodes.includes("S27_UNRESOLVED_ENTROPY_FINALITY_CONFLICT"), true);
  });

  it("detects collapse-sensitive finality rejection", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      collapseSensitivityLevel: "high",
      finalityReviewCycleCount: 1,
    });

    assert.equal(result.finalityClassification, "finality_unsafe");
    assert.equal(result.collapseSensitiveFinalityRejected, true);
    assert.equal(result.warningCodes.includes("S27_COLLAPSE_SENSITIVE_FINALITY_REJECTED"), true);
  });

  it("reports weak explainability warning", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      finalityReadinessLevel: "conditional",
      finalityDurabilityLevel: "stable",
      finalitySafetyLevel: "guarded",
      finalityExplainabilityLevel: "partial",
      maintenanceOnlyReadinessLevel: "limited",
      finalityReviewCycleCount: 1,
    });

    assert.equal(result.warningCodes.includes("S27_FINALITY_EXPLAINABILITY_WEAK"), true);
  });

  it("is deterministic for repeated identical input", () => {
    const first = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      closureRiskLevel: "moderate",
      boundedContinuationNeedLevel: "moderate",
      finalityReviewCycleCount: 1,
    });
    const second = evaluateCountyGovernanceEntropyDoctrineFinality({
      ...baseInput,
      closureRiskLevel: "moderate",
      boundedContinuationNeedLevel: "moderate",
      finalityReviewCycleCount: 1,
    });

    assert.deepEqual(second, first);
  });

  it("preserves immutable fail-closed flags", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineFinality(baseInput);

    assertFailClosedFlags(result);
  });
});
