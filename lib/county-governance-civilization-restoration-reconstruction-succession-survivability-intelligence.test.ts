import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivability,
  type CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityInput,
} from "./county-governance-civilization-restoration-reconstruction-succession-survivability-intelligence";

const durableInput: CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityInput = {
  reconstructionSuccessionIntegrityScore: 94,
  successionTrustDurabilityScore: 93,
  successionTransferStabilityScore: 92,
  successionAuditabilityScore: 91,
  failClosedSuccessionSurvivabilityScore: 94,
  successionDesynchronizationRiskScore: 8,
  successionFragmentationRiskScore: 8,
  recursiveSuccessionDriftRiskScore: 8,
  successionContainmentIntegrityScore: 91,
  successionExplainabilityDurabilityScore: 90,
  successionEntropyRecurrenceRiskScore: 8,
  successionReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityInput>) {
  return evaluateCountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivability({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivability>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Civilization Restoration Reconstruction Succession Survivability Intelligence", () => {
  it("classifies durable succession survivability", () => {
    const result = evaluateCountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivability(durableInput);

    assert.equal(result.successionSurvivabilityLevel, "durable_reconstruction_succession_survivability");
    assert.equal(result.successionExposureLevel, "minimal");
    assert.equal(result.successionReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonSuccessionSurvivability, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded succession survivability", () => {
    const result = evaluate({
      reconstructionSuccessionIntegrityScore: 74,
      successionTrustDurabilityScore: 88,
      successionTransferStabilityScore: 88,
      successionReevaluationPressureScore: 20,
    });

    assert.equal(result.successionSurvivabilityLevel, "bounded_reconstruction_succession_survivability");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.successionExposureLevel, "contained");
  });

  it("classifies continuation-required succession", () => {
    const result = evaluate({
      successionTrustDurabilityScore: 66,
      successionTransferStabilityScore: 66,
      successionExplainabilityDurabilityScore: 66,
      successionReevaluationPressureScore: 44,
    });

    assert.equal(result.successionSurvivabilityLevel, "reconstruction_succession_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveSuccessionEscalation, false);
    assert.equal(result.warningCodes.includes("SUCCESSION_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading succession", () => {
    const result = evaluate({
      successionTrustDurabilityScore: 50,
    });

    assert.equal(result.successionSurvivabilityLevel, "reconstruction_succession_degrading");
    assert.equal(result.warningCodes.includes("SUCCESSION_TRUST_DURABILITY_WEAKNESS"), true);
  });

  it("classifies unstable succession", () => {
    const result = evaluate({
      successionDesynchronizationRiskScore: 50,
    });

    assert.equal(result.successionSurvivabilityLevel, "reconstruction_succession_unstable");
    assert.equal(result.successionDesynchronizationDetected, true);
  });

  it("keeps fail-closed succession precedence", () => {
    const result = evaluate({
      failClosedSuccessionSurvivabilityScore: 40,
      reconstructionSuccessionIntegrityScore: 96,
      successionTrustDurabilityScore: 96,
    });

    assert.equal(result.successionSurvivabilityLevel, "fail_closed_succession_survivability_degradation");
    assert.equal(result.failClosedSuccessionSurvivabilityDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_SUCCESSION_SURVIVABILITY_DEGRADATION");
  });

  it("detects collapse-sensitive succession escalation", () => {
    const result = evaluate({
      successionEntropyRecurrenceRiskScore: 94,
      failClosedSuccessionSurvivabilityScore: 60,
    });

    assert.equal(result.successionSurvivabilityLevel, "collapse_sensitive_succession_survivability");
    assert.equal(result.collapseSensitiveSuccessionEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_SUCCESSION_SURVIVABILITY"), true);
  });

  it("detects succession desynchronization", () => {
    const result = evaluate({
      successionDesynchronizationRiskScore: 78,
    });

    assert.equal(result.successionSurvivabilityLevel, "reconstruction_succession_unstable");
    assert.equal(result.successionDesynchronizationDetected, true);
    assert.equal(result.collapseSensitiveSuccessionEscalation, false);
    assert.equal(result.warningCodes.includes("SUCCESSION_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects succession fragmentation", () => {
    const result = evaluate({
      successionFragmentationRiskScore: 78,
    });

    assert.equal(result.successionSurvivabilityLevel, "reconstruction_succession_unstable");
    assert.equal(result.successionFragmentationDetected, true);
    assert.equal(result.warningCodes.includes("SUCCESSION_FRAGMENTATION_RISK"), true);
  });

  it("detects recursive succession drift", () => {
    const result = evaluate({
      recursiveSuccessionDriftRiskScore: 78,
    });

    assert.equal(result.successionSurvivabilityLevel, "reconstruction_succession_unstable");
    assert.equal(result.recursiveSuccessionDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_SUCCESSION_DRIFT");
  });

  it("detects succession entropy recurrence", () => {
    const result = evaluate({
      successionEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.successionSurvivabilityLevel, "reconstruction_succession_unstable");
    assert.equal(result.successionEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("SUCCESSION_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects succession containment risk", () => {
    const result = evaluate({
      successionContainmentIntegrityScore: 50,
    });

    assert.equal(result.successionSurvivabilityLevel, "reconstruction_succession_unstable");
    assert.equal(result.successionContainmentRiskDetected, true);
    assert.equal(result.warningCodes.includes("SUCCESSION_CONTAINMENT_RISK"), true);
  });

  it("detects succession trust durability weakness", () => {
    const result = evaluate({
      successionTrustDurabilityScore: 50,
    });

    assert.equal(result.successionSurvivabilityLevel, "reconstruction_succession_degrading");
    assert.equal(result.warningCodes.includes("SUCCESSION_TRUST_DURABILITY_WEAKNESS"), true);
  });

  it("detects succession transfer stability weakness", () => {
    const result = evaluate({
      successionTransferStabilityScore: 50,
    });

    assert.equal(result.successionSurvivabilityLevel, "reconstruction_succession_degrading");
    assert.equal(result.warningCodes.includes("SUCCESSION_TRANSFER_STABILITY_WEAKNESS"), true);
  });

  it("detects succession auditability weakness", () => {
    const result = evaluate({
      successionAuditabilityScore: 50,
    });

    assert.equal(result.successionSurvivabilityLevel, "reconstruction_succession_degrading");
    assert.equal(result.warningCodes.includes("SUCCESSION_AUDITABILITY_WEAKNESS"), true);
  });

  it("detects succession explainability decay", () => {
    const result = evaluate({
      successionExplainabilityDurabilityScore: 50,
    });

    assert.equal(result.successionSurvivabilityLevel, "reconstruction_succession_degrading");
    assert.equal(result.warningCodes.includes("SUCCESSION_EXPLAINABILITY_DECAY"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      successionReevaluationPressureScore: 82,
    });

    assert.equal(result.successionReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("SUCCESSION_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      successionDesynchronizationRiskScore: 78,
      successionFragmentationRiskScore: 78,
      successionTrustDurabilityScore: 50,
      successionTransferStabilityScore: 50,
      successionAuditabilityScore: 50,
      successionExplainabilityDurabilityScore: 50,
      successionReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "SUCCESSION_DESYNCHRONIZATION_RISK",
      "SUCCESSION_FRAGMENTATION_RISK",
      "SUCCESSION_TRUST_DURABILITY_WEAKNESS",
      "SUCCESSION_TRANSFER_STABILITY_WEAKNESS",
      "SUCCESSION_AUDITABILITY_WEAKNESS",
      "SUCCESSION_EXPLAINABILITY_DECAY",
      "SUCCESSION_REEVALUATION_REQUIRED",
    ]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      reconstructionSuccessionIntegrityScore: 74,
      successionReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivabilityInput = {
      ...durableInput,
      successionReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivability(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("keeps scores bounded", () => {
    const result = evaluateCountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivability({
      reconstructionSuccessionIntegrityScore: 150,
      successionTrustDurabilityScore: Number.NaN,
      successionTransferStabilityScore: 100,
      successionAuditabilityScore: 100,
      failClosedSuccessionSurvivabilityScore: 90,
      successionDesynchronizationRiskScore: -10,
      successionFragmentationRiskScore: -10,
      recursiveSuccessionDriftRiskScore: -10,
      successionContainmentIntegrityScore: 120,
      successionExplainabilityDurabilityScore: 100,
      successionEntropyRecurrenceRiskScore: 200,
      successionReevaluationPressureScore: 500,
    });

    assert.equal(result.successionSeverityScore >= 0 && result.successionSeverityScore <= 100, true);
    assert.equal(result.successionExposureLevel, "critical");
    assert.equal(result.successionReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      successionAuditabilityScore: 50,
      successionExplainabilityDurabilityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps succession continuity distinct from succession trust durability", () => {
    const result = evaluate({
      reconstructionSuccessionIntegrityScore: 95,
      successionTrustDurabilityScore: 50,
    });

    assert.equal(result.warningCodes.includes("RECONSTRUCTION_SUCCESSION_INTEGRITY_WEAKNESS"), false);
    assert.equal(result.warningCodes.includes("SUCCESSION_TRUST_DURABILITY_WEAKNESS"), true);
  });

  it("keeps succession explainability distinct from succession auditability", () => {
    const result = evaluate({
      successionExplainabilityDurabilityScore: 50,
      successionAuditabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("SUCCESSION_EXPLAINABILITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("SUCCESSION_AUDITABILITY_WEAKNESS"), false);
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveSuccessionDriftRiskScore: 94,
      successionEntropyRecurrenceRiskScore: 94,
      successionDesynchronizationRiskScore: 94,
      successionFragmentationRiskScore: 94,
      failClosedSuccessionSurvivabilityScore: 60,
      successionTrustDurabilityScore: 88,
    });

    assert.equal(result.successionSurvivabilityLevel, "collapse_sensitive_succession_survivability");
    assert.equal(result.collapseSensitiveSuccessionEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_SUCCESSION_SURVIVABILITY");
  });

  it("saturates simultaneous degradation vectors deterministically", () => {
    const result = evaluate({
      successionDesynchronizationRiskScore: 100,
      successionFragmentationRiskScore: 100,
      recursiveSuccessionDriftRiskScore: 100,
      successionEntropyRecurrenceRiskScore: 100,
      successionContainmentIntegrityScore: 0,
      successionTrustDurabilityScore: 0,
      successionTransferStabilityScore: 0,
      successionAuditabilityScore: 0,
      successionExplainabilityDurabilityScore: 0,
      failClosedSuccessionSurvivabilityScore: 80,
    });

    assert.equal(result.successionSeverityScore, 100);
    assert.equal(result.successionExposureLevel, "critical");
  });

  it("does not imply irreversible governance continuity capability", () => {
    const result = evaluateCountyGovernanceCivilizationRestorationReconstructionSuccessionSurvivability(durableInput);

    assert.equal(
      result.explainability.longHorizonSuccessionAssessment.includes(
        "does not imply irreversible governance continuity capability",
      ),
      true,
    );
  });
});
