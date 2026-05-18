import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceEntropyDoctrineInstitutionalMemoryContinuity,
  type CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityInput,
} from "./county-governance-entropy-doctrine-institutional-memory-continuity-intelligence";

const baseInput: CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityInput = {
  institutionalMemoryContinuityLevel: "durable",
  memorySustainabilityLevel: "durable",
  memorySafetyLevel: "safe",
  memoryDurabilityLevel: "durable",
  knowledgeTransferDurabilityLevel: "strong",
  contextPreservationLevel: "strong",
  memoryDecayLevel: "none",
  memoryDependencyConcentrationLevel: "none",
  memoryExplainabilityLevel: "strong",
  failClosedMemoryIntegrityLevel: "durable",
  memoryContinuationNeedLevel: "none",
  boundedMemoryReevaluationNeedLevel: "none",
  recursiveMemoryDependencyLevel: "none",
  collapseExposureLevel: "none",
  stewardshipCompatibilityLevel: "durable",
  oversightCompatibilityLevel: "durable",
  maintenanceCompatibilityLevel: "durable",
  finalityCompatibilityLevel: "durable",
  survivabilityCompatibilityLevel: "durable",
  operationalMemorySustainabilityLevel: "durable",
  memoryCycleCount: 1,
  knowledgeTransferEventCount: 0,
  contextHandoffEventCount: 0,
  unresolvedDoctrineConflictCount: 0,
  reevaluationEvidenceCount: 1,
  failClosedDegradationCount: 0,
  explainabilityWeaknessCount: 0,
  recursiveDependencyEventCount: 0,
  memoryDecayEventCount: 0,
  dependencyConcentrationEventCount: 0,
};

function evaluate(input: Partial<CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityInput>) {
  return evaluateCountyGovernanceEntropyDoctrineInstitutionalMemoryContinuity({
    ...baseInput,
    ...input,
  });
}

function assertFailClosedFlags(
  result: ReturnType<typeof evaluateCountyGovernanceEntropyDoctrineInstitutionalMemoryContinuity>,
): void {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Entropy Doctrine Institutional Memory Continuity Intelligence", () => {
  it("fails closed as institutional_memory_continuity_unverified for missing input", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineInstitutionalMemoryContinuity();

    assert.equal(result.institutionalMemoryContinuityClassification, "institutional_memory_continuity_unverified");
    assert.equal(result.memoryReadinessClassification, "readiness_unverified");
    assert.equal(result.memorySafetyClassification, "safety_unverified");
    assert.equal(result.warningCodes.includes("S31_INSTITUTIONAL_MEMORY_CONTINUITY_UNVERIFIED"), true);
    assertFailClosedFlags(result);
  });

  it("classifies durable institutional memory continuity", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineInstitutionalMemoryContinuity(baseInput);

    assert.equal(result.institutionalMemoryContinuityClassification, "durable_institutional_memory_continuity");
    assert.equal(result.memoryReadinessClassification, "ready");
    assert.equal(result.memorySafetyClassification, "safe");
  });

  it("classifies conditional institutional memory continuity", () => {
    const result = evaluate({
      institutionalMemoryContinuityLevel: "conditional",
      memorySustainabilityLevel: "conditional",
      memorySafetyLevel: "guarded",
      memoryDurabilityLevel: "stable",
      knowledgeTransferDurabilityLevel: "strong",
      contextPreservationLevel: "strong",
      memoryExplainabilityLevel: "adequate",
      failClosedMemoryIntegrityLevel: "stable",
    });

    assert.equal(result.institutionalMemoryContinuityClassification, "conditional_institutional_memory_continuity");
    assert.equal(result.memoryReadinessClassification, "conditionally_ready");
  });

  it("detects superficial institutional memory continuity", () => {
    const result = evaluate({
      institutionalMemoryContinuityLevel: "stable",
      memoryExplainabilityLevel: "adequate",
      knowledgeTransferDurabilityLevel: "strong",
      contextPreservationLevel: "strong",
      reevaluationEvidenceCount: 0,
    });

    assert.equal(
      result.institutionalMemoryContinuityClassification,
      "superficial_institutional_memory_continuity",
    );
    assert.equal(result.superficialInstitutionalMemoryContinuity, true);
    assert.equal(result.warningCodes.includes("S31_SUPERFICIAL_INSTITUTIONAL_MEMORY_CONTINUITY"), true);
  });

  it("detects institutional memory blocked", () => {
    const result = evaluate({
      stewardshipCompatibilityLevel: "poor",
      oversightCompatibilityLevel: "poor",
    });

    assert.equal(result.institutionalMemoryContinuityClassification, "institutional_memory_blocked");
    assert.equal(result.institutionalMemoryBlocked, true);
    assert.equal(result.warningCodes.includes("S31_INSTITUTIONAL_MEMORY_BLOCKED"), true);
  });

  it("detects institutional memory unsafe", () => {
    const result = evaluate({
      memorySafetyLevel: "unsafe",
    });

    assert.equal(result.institutionalMemoryContinuityClassification, "institutional_memory_unsafe");
    assert.equal(result.institutionalMemoryUnsafe, true);
    assert.equal(result.warningCodes.includes("S31_INSTITUTIONAL_MEMORY_UNSAFE"), true);
  });

  it("detects memory continuation required", () => {
    const result = evaluate({
      memoryContinuationNeedLevel: "moderate",
      boundedMemoryReevaluationNeedLevel: "none",
      memoryDecayLevel: "none",
      memoryDependencyConcentrationLevel: "none",
    });

    assert.equal(result.institutionalMemoryContinuityClassification, "institutional_memory_continuation_required");
    assert.equal(result.memoryContinuationRequired, true);
    assert.equal(result.warningCodes.includes("S31_MEMORY_CONTINUATION_REQUIRED"), true);
  });

  it("detects bounded memory reevaluation required", () => {
    const result = evaluate({
      boundedMemoryReevaluationNeedLevel: "moderate",
      memoryContinuationNeedLevel: "none",
    });

    assert.equal(result.institutionalMemoryContinuityClassification, "bounded_memory_reevaluation_required");
    assert.equal(result.boundedMemoryReevaluationRequired, true);
    assert.equal(result.warningCodes.includes("S31_BOUNDED_MEMORY_REEVALUATION_REQUIRED"), true);
  });

  it("reports institutional memory entropy burden warning path", () => {
    const result = evaluate({
      memoryDecayLevel: "moderate",
      boundedMemoryReevaluationNeedLevel: "none",
      memoryContinuationNeedLevel: "none",
    });

    assert.equal(result.warningCodes.includes("S31_INSTITUTIONAL_MEMORY_ENTROPY_BURDEN"), true);
  });

  it("reports memory decay detected warning path", () => {
    const result = evaluate({
      memoryDecayLevel: "moderate",
      boundedMemoryReevaluationNeedLevel: "none",
      memoryContinuationNeedLevel: "none",
    });

    assert.equal(result.warningCodes.includes("S31_MEMORY_DECAY_DETECTED"), true);
  });

  it("reports memory dependency concentration warning path", () => {
    const result = evaluate({
      memoryDependencyConcentrationLevel: "moderate",
      boundedMemoryReevaluationNeedLevel: "none",
      memoryContinuationNeedLevel: "none",
    });

    assert.equal(result.warningCodes.includes("S31_MEMORY_DEPENDENCY_CONCENTRATION"), true);
  });

  it("reports weak knowledge transfer", () => {
    const result = evaluate({
      institutionalMemoryContinuityLevel: "conditional",
      knowledgeTransferDurabilityLevel: "partial",
    });

    assert.equal(result.warningCodes.includes("S31_KNOWLEDGE_TRANSFER_WEAK"), true);
  });

  it("reports weak context preservation", () => {
    const result = evaluate({
      institutionalMemoryContinuityLevel: "conditional",
      contextPreservationLevel: "partial",
    });

    assert.equal(result.warningCodes.includes("S31_CONTEXT_PRESERVATION_WEAK"), true);
  });

  it("detects memory explainability weakness", () => {
    const result = evaluate({
      institutionalMemoryContinuityLevel: "conditional",
      memoryExplainabilityLevel: "partial",
    });

    assert.equal(result.institutionalMemoryContinuityClassification, "institutional_memory_explainability_weakness");
    assert.equal(result.warningCodes.includes("S31_MEMORY_EXPLAINABILITY_WEAK"), true);
  });

  it("detects fail-closed memory degradation", () => {
    const result = evaluate({
      failClosedDegradationCount: 1,
    });

    assert.equal(result.institutionalMemoryContinuityClassification, "institutional_memory_blocked");
    assert.equal(result.failClosedMemoryDegradation, true);
    assert.equal(result.warningCodes.includes("S31_FAIL_CLOSED_MEMORY_DEGRADATION"), true);
  });

  it("detects recursive memory dependency conflict", () => {
    const result = evaluate({
      recursiveMemoryDependencyLevel: "high",
    });

    assert.equal(result.institutionalMemoryContinuityClassification, "institutional_memory_blocked");
    assert.equal(result.recursiveMemoryDependencyConflict, true);
    assert.equal(result.warningCodes.includes("S31_RECURSIVE_MEMORY_DEPENDENCY_CONFLICT"), true);
  });

  it("detects collapse-sensitive memory rejection", () => {
    const result = evaluate({
      collapseExposureLevel: "high",
    });

    assert.equal(result.institutionalMemoryContinuityClassification, "collapse_sensitive_memory_rejection");
    assert.equal(result.collapseSensitiveMemoryRejection, true);
    assert.equal(result.warningCodes.includes("S31_COLLAPSE_SENSITIVE_MEMORY_REJECTION"), true);
  });

  it("detects institutional memory survivability weakness", () => {
    const result = evaluate({
      survivabilityCompatibilityLevel: "strained",
      memoryContinuationNeedLevel: "moderate",
    });

    assert.equal(result.institutionalMemoryContinuityClassification, "institutional_memory_survivability_weakness");
    assert.equal(result.institutionalMemorySurvivabilityWeakness, true);
    assert.equal(result.warningCodes.includes("S31_MEMORY_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects unresolved memory doctrine conflict", () => {
    const result = evaluate({
      unresolvedDoctrineConflictCount: 1,
    });

    assert.equal(result.institutionalMemoryContinuityClassification, "institutional_memory_blocked");
    assert.equal(result.unresolvedMemoryDoctrineConflict, true);
    assert.equal(result.warningCodes.includes("S31_UNRESOLVED_MEMORY_DOCTRINE_CONFLICT"), true);
  });

  it("detects operationally unsustainable memory", () => {
    const result = evaluate({
      operationalMemorySustainabilityLevel: "unsustainable",
    });

    assert.equal(result.institutionalMemoryContinuityClassification, "institutional_memory_blocked");
    assert.equal(result.operationallyUnsustainableMemory, true);
    assert.equal(result.warningCodes.includes("S31_OPERATIONALLY_UNSUSTAINABLE_MEMORY"), true);
  });

  it("reports stewardship compatibility weakness", () => {
    const result = evaluate({
      institutionalMemoryContinuityLevel: "conditional",
      stewardshipCompatibilityLevel: "strained",
    });

    assert.equal(result.warningCodes.includes("S31_STEWARDSHIP_COMPATIBILITY_WEAK"), true);
  });

  it("is deterministic for repeated identical input", () => {
    const input = {
      institutionalMemoryContinuityLevel: "conditional" as const,
      boundedMemoryReevaluationNeedLevel: "moderate" as const,
      memoryDependencyConcentrationLevel: "moderate" as const,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("keeps warning-code ordering stable", () => {
    const result = evaluate({
      stewardshipCompatibilityLevel: "poor",
      oversightCompatibilityLevel: "poor",
      memorySafetyLevel: "unsafe",
      memoryExplainabilityLevel: "opaque",
      knowledgeTransferDurabilityLevel: "weak",
      contextPreservationLevel: "weak",
    });

    assert.deepEqual(result.warningCodes, [
      "S31_INSTITUTIONAL_MEMORY_BLOCKED",
      "S31_INSTITUTIONAL_MEMORY_UNSAFE",
      "S31_MEMORY_EXPLAINABILITY_WEAK",
      "S31_UNRESOLVED_MEMORY_DOCTRINE_CONFLICT",
      "S31_KNOWLEDGE_TRANSFER_WEAK",
      "S31_CONTEXT_PRESERVATION_WEAK",
      "S31_STEWARDSHIP_COMPATIBILITY_WEAK",
    ]);
  });

  it("does not mutate the input object", () => {
    const input: CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityInput = {
      ...baseInput,
      memoryContinuationNeedLevel: "moderate",
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceEntropyDoctrineInstitutionalMemoryContinuity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("always preserves fail-closed flags", () => {
    const result = evaluate({
      collapseExposureLevel: "critical",
    });

    assertFailClosedFlags(result);
  });
});
