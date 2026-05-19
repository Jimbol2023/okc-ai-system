import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceCivilizationRestorationReconstructionIntegrity,
  type CountyGovernanceCivilizationRestorationReconstructionIntegrityInput,
} from "./county-governance-civilization-restoration-reconstruction-integrity-intelligence";

const durableInput: CountyGovernanceCivilizationRestorationReconstructionIntegrityInput = {
  replayReconstructionIntegrityScore: 94,
  reconstructionTrustDurabilityScore: 93,
  reconstructionCoherenceScore: 92,
  reconstructionAuditabilityScore: 91,
  failClosedReconstructionIntegrityScore: 94,
  reconstructionDesynchronizationRiskScore: 8,
  reconstructionDoctrineDivergenceRiskScore: 8,
  recursiveReconstructionDriftRiskScore: 8,
  reconstructionContainmentIntegrityScore: 91,
  replayReconstructionExplainabilityScore: 90,
  reconstructionEntropyRecurrenceRiskScore: 8,
  reconstructionReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceCivilizationRestorationReconstructionIntegrityInput>) {
  return evaluateCountyGovernanceCivilizationRestorationReconstructionIntegrity({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceCivilizationRestorationReconstructionIntegrity>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Civilization Restoration Reconstruction Integrity Intelligence", () => {
  it("classifies durable reconstruction integrity", () => {
    const result = evaluateCountyGovernanceCivilizationRestorationReconstructionIntegrity(durableInput);

    assert.equal(result.reconstructionIntegrityLevel, "durable_restoration_reconstruction_integrity");
    assert.equal(result.reconstructionExposureLevel, "minimal");
    assert.equal(result.reconstructionReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonReconstructionIntegrity, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded reconstruction integrity", () => {
    const result = evaluate({
      replayReconstructionIntegrityScore: 74,
      reconstructionTrustDurabilityScore: 88,
      reconstructionCoherenceScore: 88,
      reconstructionReevaluationPressureScore: 20,
    });

    assert.equal(result.reconstructionIntegrityLevel, "bounded_restoration_reconstruction_integrity");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.reconstructionExposureLevel, "contained");
  });

  it("classifies continuation-required reconstruction", () => {
    const result = evaluate({
      reconstructionTrustDurabilityScore: 66,
      reconstructionCoherenceScore: 66,
      replayReconstructionExplainabilityScore: 66,
      reconstructionReevaluationPressureScore: 44,
    });

    assert.equal(result.reconstructionIntegrityLevel, "restoration_reconstruction_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveReconstructionEscalation, false);
    assert.equal(result.warningCodes.includes("RECONSTRUCTION_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading reconstruction", () => {
    const result = evaluate({
      reconstructionTrustDurabilityScore: 50,
    });

    assert.equal(result.reconstructionIntegrityLevel, "restoration_reconstruction_degrading");
    assert.equal(result.warningCodes.includes("RECONSTRUCTION_TRUST_DURABILITY_WEAKNESS"), true);
  });

  it("classifies unstable reconstruction", () => {
    const result = evaluate({
      reconstructionDesynchronizationRiskScore: 50,
    });

    assert.equal(result.reconstructionIntegrityLevel, "restoration_reconstruction_unstable");
    assert.equal(result.reconstructionDesynchronizationDetected, true);
  });

  it("keeps fail-closed reconstruction precedence", () => {
    const result = evaluate({
      failClosedReconstructionIntegrityScore: 40,
      replayReconstructionIntegrityScore: 96,
      reconstructionTrustDurabilityScore: 96,
    });

    assert.equal(result.reconstructionIntegrityLevel, "fail_closed_reconstruction_integrity_degradation");
    assert.equal(result.failClosedReconstructionIntegrityDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_RECONSTRUCTION_INTEGRITY_DEGRADATION");
  });

  it("detects collapse-sensitive reconstruction escalation", () => {
    const result = evaluate({
      reconstructionEntropyRecurrenceRiskScore: 94,
      failClosedReconstructionIntegrityScore: 60,
    });

    assert.equal(result.reconstructionIntegrityLevel, "collapse_sensitive_reconstruction_integrity");
    assert.equal(result.collapseSensitiveReconstructionEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_RECONSTRUCTION_INTEGRITY"), true);
  });

  it("detects reconstruction desynchronization", () => {
    const result = evaluate({
      reconstructionDesynchronizationRiskScore: 78,
    });

    assert.equal(result.reconstructionIntegrityLevel, "restoration_reconstruction_unstable");
    assert.equal(result.reconstructionDesynchronizationDetected, true);
    assert.equal(result.collapseSensitiveReconstructionEscalation, false);
    assert.equal(result.warningCodes.includes("RECONSTRUCTION_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects reconstruction doctrine divergence", () => {
    const result = evaluate({
      reconstructionDoctrineDivergenceRiskScore: 78,
    });

    assert.equal(result.reconstructionIntegrityLevel, "restoration_reconstruction_unstable");
    assert.equal(result.reconstructionDoctrineDivergenceDetected, true);
    assert.equal(result.warningCodes.includes("RECONSTRUCTION_DOCTRINE_DIVERGENCE_RISK"), true);
  });

  it("detects recursive reconstruction drift", () => {
    const result = evaluate({
      recursiveReconstructionDriftRiskScore: 78,
    });

    assert.equal(result.reconstructionIntegrityLevel, "restoration_reconstruction_unstable");
    assert.equal(result.recursiveReconstructionDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_RECONSTRUCTION_DRIFT");
  });

  it("detects reconstruction entropy recurrence", () => {
    const result = evaluate({
      reconstructionEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.reconstructionIntegrityLevel, "restoration_reconstruction_unstable");
    assert.equal(result.reconstructionEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("RECONSTRUCTION_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects reconstruction containment risk", () => {
    const result = evaluate({
      reconstructionContainmentIntegrityScore: 50,
    });

    assert.equal(result.reconstructionIntegrityLevel, "restoration_reconstruction_unstable");
    assert.equal(result.reconstructionContainmentRiskDetected, true);
    assert.equal(result.warningCodes.includes("RECONSTRUCTION_CONTAINMENT_RISK"), true);
  });

  it("detects reconstruction trust durability weakness", () => {
    const result = evaluate({
      reconstructionTrustDurabilityScore: 50,
    });

    assert.equal(result.reconstructionIntegrityLevel, "restoration_reconstruction_degrading");
    assert.equal(result.warningCodes.includes("RECONSTRUCTION_TRUST_DURABILITY_WEAKNESS"), true);
  });

  it("detects reconstruction coherence weakness", () => {
    const result = evaluate({
      reconstructionCoherenceScore: 50,
    });

    assert.equal(result.reconstructionIntegrityLevel, "restoration_reconstruction_degrading");
    assert.equal(result.warningCodes.includes("RECONSTRUCTION_COHERENCE_WEAKNESS"), true);
  });

  it("detects reconstruction auditability weakness", () => {
    const result = evaluate({
      reconstructionAuditabilityScore: 50,
    });

    assert.equal(result.reconstructionIntegrityLevel, "restoration_reconstruction_degrading");
    assert.equal(result.warningCodes.includes("RECONSTRUCTION_AUDITABILITY_WEAKNESS"), true);
  });

  it("detects replay reconstruction explainability decay", () => {
    const result = evaluate({
      replayReconstructionExplainabilityScore: 50,
    });

    assert.equal(result.reconstructionIntegrityLevel, "restoration_reconstruction_degrading");
    assert.equal(result.warningCodes.includes("REPLAY_RECONSTRUCTION_EXPLAINABILITY_DECAY"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      reconstructionReevaluationPressureScore: 82,
    });

    assert.equal(result.reconstructionReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("RECONSTRUCTION_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      reconstructionDesynchronizationRiskScore: 78,
      reconstructionDoctrineDivergenceRiskScore: 78,
      reconstructionTrustDurabilityScore: 50,
      reconstructionCoherenceScore: 50,
      reconstructionAuditabilityScore: 50,
      replayReconstructionExplainabilityScore: 50,
      reconstructionReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "RECONSTRUCTION_DESYNCHRONIZATION_RISK",
      "RECONSTRUCTION_DOCTRINE_DIVERGENCE_RISK",
      "RECONSTRUCTION_TRUST_DURABILITY_WEAKNESS",
      "RECONSTRUCTION_COHERENCE_WEAKNESS",
      "RECONSTRUCTION_AUDITABILITY_WEAKNESS",
      "REPLAY_RECONSTRUCTION_EXPLAINABILITY_DECAY",
      "RECONSTRUCTION_REEVALUATION_REQUIRED",
    ]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      replayReconstructionIntegrityScore: 74,
      reconstructionReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceCivilizationRestorationReconstructionIntegrityInput = {
      ...durableInput,
      reconstructionReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceCivilizationRestorationReconstructionIntegrity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("keeps scores bounded", () => {
    const result = evaluateCountyGovernanceCivilizationRestorationReconstructionIntegrity({
      replayReconstructionIntegrityScore: 150,
      reconstructionTrustDurabilityScore: Number.NaN,
      reconstructionCoherenceScore: 100,
      reconstructionAuditabilityScore: 100,
      failClosedReconstructionIntegrityScore: 90,
      reconstructionDesynchronizationRiskScore: -10,
      reconstructionDoctrineDivergenceRiskScore: -10,
      recursiveReconstructionDriftRiskScore: -10,
      reconstructionContainmentIntegrityScore: 120,
      replayReconstructionExplainabilityScore: 100,
      reconstructionEntropyRecurrenceRiskScore: 200,
      reconstructionReevaluationPressureScore: 500,
    });

    assert.equal(result.reconstructionSeverityScore >= 0 && result.reconstructionSeverityScore <= 100, true);
    assert.equal(result.reconstructionExposureLevel, "critical");
    assert.equal(result.reconstructionReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      reconstructionAuditabilityScore: 50,
      replayReconstructionExplainabilityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps reconstruction continuity distinct from reconstruction trust durability", () => {
    const result = evaluate({
      replayReconstructionIntegrityScore: 95,
      reconstructionTrustDurabilityScore: 50,
    });

    assert.equal(result.warningCodes.includes("REPLAY_RECONSTRUCTION_INTEGRITY_WEAKNESS"), false);
    assert.equal(result.warningCodes.includes("RECONSTRUCTION_TRUST_DURABILITY_WEAKNESS"), true);
  });

  it("keeps replay explainability distinct from reconstruction auditability", () => {
    const result = evaluate({
      replayReconstructionExplainabilityScore: 50,
      reconstructionAuditabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("REPLAY_RECONSTRUCTION_EXPLAINABILITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("RECONSTRUCTION_AUDITABILITY_WEAKNESS"), false);
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveReconstructionDriftRiskScore: 94,
      reconstructionEntropyRecurrenceRiskScore: 94,
      reconstructionDesynchronizationRiskScore: 94,
      failClosedReconstructionIntegrityScore: 60,
      reconstructionTrustDurabilityScore: 88,
    });

    assert.equal(result.reconstructionIntegrityLevel, "collapse_sensitive_reconstruction_integrity");
    assert.equal(result.collapseSensitiveReconstructionEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_RECONSTRUCTION_INTEGRITY");
  });

  it("saturates simultaneous degradation vectors deterministically", () => {
    const result = evaluate({
      reconstructionDesynchronizationRiskScore: 100,
      reconstructionDoctrineDivergenceRiskScore: 100,
      recursiveReconstructionDriftRiskScore: 100,
      reconstructionEntropyRecurrenceRiskScore: 100,
      reconstructionContainmentIntegrityScore: 0,
      reconstructionTrustDurabilityScore: 0,
      reconstructionCoherenceScore: 0,
      reconstructionAuditabilityScore: 0,
      replayReconstructionExplainabilityScore: 0,
      failClosedReconstructionIntegrityScore: 80,
    });

    assert.equal(result.reconstructionSeverityScore, 100);
    assert.equal(result.reconstructionExposureLevel, "critical");
  });

  it("does not imply irreversible governance restoration capability", () => {
    const result = evaluateCountyGovernanceCivilizationRestorationReconstructionIntegrity(durableInput);

    assert.equal(
      result.explainability.longHorizonReconstructionAssessment.includes(
        "does not imply irreversible governance restoration capability",
      ),
      true,
    );
  });
});
