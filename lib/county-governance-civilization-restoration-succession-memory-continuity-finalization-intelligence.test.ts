import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalization,
  type CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationInput,
} from "./county-governance-civilization-restoration-succession-memory-continuity-finalization-intelligence";

const durableInput: CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationInput = {
  successionMemoryContinuityScore: 94,
  finalizedMemoryTrustDurabilityScore: 93,
  memoryHandoffIntegrityScore: 92,
  finalizedMemoryAuditabilityScore: 91,
  failClosedMemoryFinalizationScore: 94,
  memoryContinuityFragmentationRiskScore: 8,
  memoryFinalizationDesynchronizationRiskScore: 8,
  recursiveMemoryDriftRiskScore: 8,
  memoryContainmentIntegrityScore: 91,
  finalizedMemoryExplainabilityScore: 90,
  memoryEntropyRecurrenceRiskScore: 8,
  memoryFinalizationReevaluationPressureScore: 10,
};

function evaluate(
  input: Partial<CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationInput>,
) {
  return evaluateCountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalization({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<
    typeof evaluateCountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalization
  >,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Civilization Restoration Succession Memory Continuity Finalization Intelligence", () => {
  it("classifies durable memory finalization", () => {
    const result =
      evaluateCountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalization(durableInput);

    assert.equal(
      result.memoryContinuityFinalizationLevel,
      "durable_succession_memory_continuity_finalization",
    );
    assert.equal(result.memoryFinalizationExposureLevel, "minimal");
    assert.equal(result.memoryFinalizationReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonMemoryContinuity, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded memory finalization", () => {
    const result = evaluate({
      successionMemoryContinuityScore: 74,
      finalizedMemoryTrustDurabilityScore: 88,
      memoryHandoffIntegrityScore: 88,
      memoryFinalizationReevaluationPressureScore: 20,
    });

    assert.equal(
      result.memoryContinuityFinalizationLevel,
      "bounded_succession_memory_continuity_finalization",
    );
    assert.equal(result.continuationRequired, false);
    assert.equal(result.memoryFinalizationExposureLevel, "contained");
  });

  it("classifies continuation-required memory finalization", () => {
    const result = evaluate({
      finalizedMemoryTrustDurabilityScore: 66,
      memoryHandoffIntegrityScore: 66,
      finalizedMemoryExplainabilityScore: 66,
      memoryFinalizationReevaluationPressureScore: 44,
    });

    assert.equal(
      result.memoryContinuityFinalizationLevel,
      "succession_memory_continuity_finalization_continuation_required",
    );
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveMemoryFinalizationEscalation, false);
    assert.equal(result.warningCodes.includes("MEMORY_FINALIZATION_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading memory finalization", () => {
    const result = evaluate({
      finalizedMemoryTrustDurabilityScore: 50,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "succession_memory_continuity_finalization_degrading");
    assert.equal(result.warningCodes.includes("FINALIZED_MEMORY_TRUST_DURABILITY_WEAKNESS"), true);
  });

  it("classifies unstable memory finalization", () => {
    const result = evaluate({
      memoryContinuityFragmentationRiskScore: 50,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "succession_memory_continuity_finalization_unstable");
    assert.equal(result.memoryContinuityFragmentationDetected, true);
  });

  it("keeps fail-closed memory finalization precedence", () => {
    const result = evaluate({
      failClosedMemoryFinalizationScore: 40,
      successionMemoryContinuityScore: 96,
      finalizedMemoryTrustDurabilityScore: 96,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "fail_closed_memory_finalization_degradation");
    assert.equal(result.failClosedMemoryFinalizationDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_MEMORY_FINALIZATION_DEGRADATION");
  });

  it("detects collapse-sensitive memory finalization escalation", () => {
    const result = evaluate({
      memoryEntropyRecurrenceRiskScore: 94,
      failClosedMemoryFinalizationScore: 60,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "collapse_sensitive_memory_finalization");
    assert.equal(result.collapseSensitiveMemoryFinalizationEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_MEMORY_FINALIZATION"), true);
  });

  it("detects memory continuity fragmentation", () => {
    const result = evaluate({
      memoryContinuityFragmentationRiskScore: 78,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "succession_memory_continuity_finalization_unstable");
    assert.equal(result.memoryContinuityFragmentationDetected, true);
    assert.equal(result.collapseSensitiveMemoryFinalizationEscalation, false);
    assert.equal(result.warningCodes.includes("MEMORY_CONTINUITY_FRAGMENTATION_RISK"), true);
  });

  it("detects memory finalization desynchronization", () => {
    const result = evaluate({
      memoryFinalizationDesynchronizationRiskScore: 78,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "succession_memory_continuity_finalization_unstable");
    assert.equal(result.memoryFinalizationDesynchronizationDetected, true);
    assert.equal(result.warningCodes.includes("MEMORY_FINALIZATION_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects recursive memory drift", () => {
    const result = evaluate({
      recursiveMemoryDriftRiskScore: 78,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "succession_memory_continuity_finalization_unstable");
    assert.equal(result.recursiveMemoryDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_MEMORY_DRIFT");
  });

  it("detects memory entropy recurrence", () => {
    const result = evaluate({
      memoryEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "succession_memory_continuity_finalization_unstable");
    assert.equal(result.memoryEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("MEMORY_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects memory containment risk", () => {
    const result = evaluate({
      memoryContainmentIntegrityScore: 50,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "succession_memory_continuity_finalization_unstable");
    assert.equal(result.memoryContainmentRiskDetected, true);
    assert.equal(result.warningCodes.includes("MEMORY_CONTAINMENT_RISK"), true);
  });

  it("detects finalized memory trust durability weakness", () => {
    const result = evaluate({
      finalizedMemoryTrustDurabilityScore: 50,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "succession_memory_continuity_finalization_degrading");
    assert.equal(result.warningCodes.includes("FINALIZED_MEMORY_TRUST_DURABILITY_WEAKNESS"), true);
  });

  it("detects memory handoff integrity weakness", () => {
    const result = evaluate({
      memoryHandoffIntegrityScore: 50,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "succession_memory_continuity_finalization_degrading");
    assert.equal(result.warningCodes.includes("MEMORY_HANDOFF_INTEGRITY_WEAKNESS"), true);
  });

  it("detects finalized memory auditability weakness", () => {
    const result = evaluate({
      finalizedMemoryAuditabilityScore: 50,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "succession_memory_continuity_finalization_degrading");
    assert.equal(result.warningCodes.includes("FINALIZED_MEMORY_AUDITABILITY_WEAKNESS"), true);
  });

  it("detects finalized memory explainability decay", () => {
    const result = evaluate({
      finalizedMemoryExplainabilityScore: 50,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "succession_memory_continuity_finalization_degrading");
    assert.equal(result.warningCodes.includes("FINALIZED_MEMORY_EXPLAINABILITY_DECAY"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      memoryFinalizationReevaluationPressureScore: 82,
    });

    assert.equal(result.memoryFinalizationReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("MEMORY_FINALIZATION_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      memoryFinalizationDesynchronizationRiskScore: 78,
      memoryContinuityFragmentationRiskScore: 78,
      finalizedMemoryTrustDurabilityScore: 50,
      memoryHandoffIntegrityScore: 50,
      finalizedMemoryAuditabilityScore: 50,
      finalizedMemoryExplainabilityScore: 50,
      memoryFinalizationReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "MEMORY_FINALIZATION_DESYNCHRONIZATION_RISK",
      "MEMORY_CONTINUITY_FRAGMENTATION_RISK",
      "FINALIZED_MEMORY_TRUST_DURABILITY_WEAKNESS",
      "MEMORY_HANDOFF_INTEGRITY_WEAKNESS",
      "FINALIZED_MEMORY_AUDITABILITY_WEAKNESS",
      "FINALIZED_MEMORY_EXPLAINABILITY_DECAY",
      "MEMORY_FINALIZATION_REEVALUATION_REQUIRED",
    ]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      successionMemoryContinuityScore: 74,
      memoryFinalizationReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalizationInput = {
      ...durableInput,
      memoryFinalizationReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalization(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("keeps scores bounded", () => {
    const result = evaluateCountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalization({
      successionMemoryContinuityScore: 150,
      finalizedMemoryTrustDurabilityScore: Number.NaN,
      memoryHandoffIntegrityScore: 100,
      finalizedMemoryAuditabilityScore: 100,
      failClosedMemoryFinalizationScore: 90,
      memoryContinuityFragmentationRiskScore: -10,
      memoryFinalizationDesynchronizationRiskScore: -10,
      recursiveMemoryDriftRiskScore: -10,
      memoryContainmentIntegrityScore: 120,
      finalizedMemoryExplainabilityScore: 100,
      memoryEntropyRecurrenceRiskScore: 200,
      memoryFinalizationReevaluationPressureScore: 500,
    });

    assert.equal(
      result.memoryFinalizationSeverityScore >= 0 && result.memoryFinalizationSeverityScore <= 100,
      true,
    );
    assert.equal(result.memoryFinalizationExposureLevel, "critical");
    assert.equal(result.memoryFinalizationReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      finalizedMemoryAuditabilityScore: 50,
      finalizedMemoryExplainabilityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps succession survivability distinct from memory finalization", () => {
    const result = evaluate({
      successionMemoryContinuityScore: 50,
      finalizedMemoryTrustDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("SUCCESSION_MEMORY_CONTINUITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("FINALIZED_MEMORY_TRUST_DURABILITY_WEAKNESS"), false);
  });

  it("keeps finalized memory auditability distinct from succession auditability", () => {
    const result = evaluate({
      finalizedMemoryAuditabilityScore: 50,
      finalizedMemoryExplainabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("FINALIZED_MEMORY_AUDITABILITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("FINALIZED_MEMORY_EXPLAINABILITY_DECAY"), false);
  });

  it("keeps finalized memory explainability distinct from succession explainability", () => {
    const result = evaluate({
      finalizedMemoryExplainabilityScore: 50,
      finalizedMemoryAuditabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("FINALIZED_MEMORY_EXPLAINABILITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("FINALIZED_MEMORY_AUDITABILITY_WEAKNESS"), false);
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveMemoryDriftRiskScore: 94,
      memoryEntropyRecurrenceRiskScore: 94,
      memoryFinalizationDesynchronizationRiskScore: 94,
      memoryContinuityFragmentationRiskScore: 94,
      failClosedMemoryFinalizationScore: 60,
      finalizedMemoryTrustDurabilityScore: 88,
    });

    assert.equal(result.memoryContinuityFinalizationLevel, "collapse_sensitive_memory_finalization");
    assert.equal(result.collapseSensitiveMemoryFinalizationEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_MEMORY_FINALIZATION");
  });

  it("saturates simultaneous memory degradation vectors deterministically", () => {
    const result = evaluate({
      memoryContinuityFragmentationRiskScore: 100,
      memoryFinalizationDesynchronizationRiskScore: 100,
      recursiveMemoryDriftRiskScore: 100,
      memoryEntropyRecurrenceRiskScore: 100,
      memoryContainmentIntegrityScore: 0,
      finalizedMemoryTrustDurabilityScore: 0,
      memoryHandoffIntegrityScore: 0,
      finalizedMemoryAuditabilityScore: 0,
      finalizedMemoryExplainabilityScore: 0,
      failClosedMemoryFinalizationScore: 80,
    });

    assert.equal(result.memoryFinalizationSeverityScore, 100);
    assert.equal(result.memoryFinalizationExposureLevel, "critical");
  });

  it("does not imply irreversible governance continuity", () => {
    const result =
      evaluateCountyGovernanceCivilizationRestorationSuccessionMemoryContinuityFinalization(durableInput);

    assert.equal(
      result.explainability.longHorizonMemoryContinuityAssessment.includes(
        "does not imply irreversible governance continuity",
      ),
      true,
    );
  });
});
