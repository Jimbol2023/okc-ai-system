import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceCivilizationRestorationReplaySurvivability,
  type CountyGovernanceCivilizationRestorationReplaySurvivabilityInput,
} from "./county-governance-civilization-restoration-replay-survivability-intelligence";

const durableInput: CountyGovernanceCivilizationRestorationReplaySurvivabilityInput = {
  civilizationReplaySurvivabilityIntegrityScore: 94,
  restorationReplayReconstructionFidelityScore: 93,
  failClosedReplaySurvivabilityScore: 94,
  replayArchiveCorruptionRiskScore: 8,
  recursiveReplayDegradationRiskScore: 8,
  replayContinuityDurabilityScore: 92,
  replayContainmentStabilityScore: 91,
  doctrineReplayContinuityStabilityScore: 91,
  replayExplainabilityDurabilityScore: 90,
  replayEntropyRecurrenceRiskScore: 8,
  replayRestorationTraceIntegrityScore: 91,
  replayReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceCivilizationRestorationReplaySurvivabilityInput>) {
  return evaluateCountyGovernanceCivilizationRestorationReplaySurvivability({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceCivilizationRestorationReplaySurvivability>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Civilization Restoration Replay Survivability Intelligence", () => {
  it("classifies durable replay survivability", () => {
    const result = evaluateCountyGovernanceCivilizationRestorationReplaySurvivability(durableInput);

    assert.equal(
      result.replaySurvivabilityIntegrityLevel,
      "durable_civilization_restoration_replay_survivability",
    );
    assert.equal(result.replaySurvivabilityExposureLevel, "minimal");
    assert.equal(result.replaySurvivabilityReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonReplaySurvivability, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded replay survivability", () => {
    const result = evaluate({
      civilizationReplaySurvivabilityIntegrityScore: 74,
      restorationReplayReconstructionFidelityScore: 88,
      doctrineReplayContinuityStabilityScore: 88,
      replayReevaluationPressureScore: 20,
    });

    assert.equal(
      result.replaySurvivabilityIntegrityLevel,
      "bounded_civilization_restoration_replay_survivability",
    );
    assert.equal(result.continuationRequired, false);
    assert.equal(result.replaySurvivabilityExposureLevel, "contained");
  });

  it("classifies continuation-required replay restoration", () => {
    const result = evaluate({
      replayContinuityDurabilityScore: 66,
      replayRestorationTraceIntegrityScore: 66,
      replayExplainabilityDurabilityScore: 66,
      replayReevaluationPressureScore: 44,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "civilization_restoration_replay_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveReplayEscalation, false);
    assert.equal(result.warningCodes.includes("REPLAY_CONTINUATION_REQUIRED"), true);
  });

  it("classifies replay degradation", () => {
    const result = evaluate({
      restorationReplayReconstructionFidelityScore: 50,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "civilization_restoration_replay_degrading");
    assert.equal(
      result.warningCodes.includes("RESTORATION_REPLAY_RECONSTRUCTION_FIDELITY_WEAKNESS"),
      true,
    );
  });

  it("classifies replay instability", () => {
    const result = evaluate({
      replayArchiveCorruptionRiskScore: 50,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "civilization_restoration_replay_unstable");
    assert.equal(result.replayArchiveCorruptionDetected, true);
  });

  it("keeps fail-closed replay survivability precedence", () => {
    const result = evaluate({
      failClosedReplaySurvivabilityScore: 40,
      civilizationReplaySurvivabilityIntegrityScore: 96,
      restorationReplayReconstructionFidelityScore: 96,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "fail_closed_replay_survivability_degradation");
    assert.equal(result.failClosedReplaySurvivabilityDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_REPLAY_SURVIVABILITY_DEGRADATION");
  });

  it("detects collapse-sensitive replay survivability escalation", () => {
    const result = evaluate({
      replayEntropyRecurrenceRiskScore: 94,
      failClosedReplaySurvivabilityScore: 60,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "collapse_sensitive_replay_survivability");
    assert.equal(result.collapseSensitiveReplayEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_REPLAY_SURVIVABILITY"), true);
  });

  it("detects replay archive corruption", () => {
    const result = evaluate({
      replayArchiveCorruptionRiskScore: 78,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "civilization_restoration_replay_unstable");
    assert.equal(result.replayArchiveCorruptionDetected, true);
    assert.equal(result.collapseSensitiveReplayEscalation, false);
    assert.equal(result.warningCodes.includes("REPLAY_ARCHIVE_CORRUPTION_RISK"), true);
  });

  it("detects recursive replay degradation", () => {
    const result = evaluate({
      recursiveReplayDegradationRiskScore: 78,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "civilization_restoration_replay_unstable");
    assert.equal(result.recursiveReplayDegradationDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_REPLAY_DEGRADATION");
  });

  it("detects replay entropy recurrence escalation", () => {
    const result = evaluate({
      replayEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "civilization_restoration_replay_unstable");
    assert.equal(result.replayEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("REPLAY_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects replay containment risk", () => {
    const result = evaluate({
      replayContainmentStabilityScore: 50,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "civilization_restoration_replay_unstable");
    assert.equal(result.replayContainmentRiskDetected, true);
    assert.equal(result.warningCodes.includes("REPLAY_CONTAINMENT_RISK"), true);
  });

  it("detects doctrine replay continuity drift", () => {
    const result = evaluate({
      doctrineReplayContinuityStabilityScore: 50,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "civilization_restoration_replay_degrading");
    assert.equal(result.warningCodes.includes("DOCTRINE_REPLAY_CONTINUITY_DRIFT"), true);
  });

  it("detects replay continuity weakness", () => {
    const result = evaluate({
      replayContinuityDurabilityScore: 50,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "civilization_restoration_replay_degrading");
    assert.equal(result.replayContinuityWeaknessDetected, true);
    assert.equal(result.warningCodes.includes("REPLAY_CONTINUITY_DURABILITY_WEAKNESS"), true);
  });

  it("detects replay reconstruction fidelity weakness", () => {
    const result = evaluate({
      restorationReplayReconstructionFidelityScore: 50,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "civilization_restoration_replay_degrading");
    assert.equal(
      result.warningCodes.includes("RESTORATION_REPLAY_RECONSTRUCTION_FIDELITY_WEAKNESS"),
      true,
    );
  });

  it("detects replay trace integrity weakness", () => {
    const result = evaluate({
      replayRestorationTraceIntegrityScore: 50,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "civilization_restoration_replay_degrading");
    assert.equal(result.warningCodes.includes("REPLAY_RESTORATION_TRACE_INTEGRITY_WEAKNESS"), true);
  });

  it("detects replay explainability decay", () => {
    const result = evaluate({
      replayExplainabilityDurabilityScore: 50,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "civilization_restoration_replay_degrading");
    assert.equal(result.warningCodes.includes("REPLAY_EXPLAINABILITY_DECAY"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      replayReevaluationPressureScore: 82,
    });

    assert.equal(result.replaySurvivabilityReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("REPLAY_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      replayArchiveCorruptionRiskScore: 78,
      replayContainmentStabilityScore: 50,
      doctrineReplayContinuityStabilityScore: 50,
      replayContinuityDurabilityScore: 50,
      restorationReplayReconstructionFidelityScore: 50,
      replayRestorationTraceIntegrityScore: 50,
      replayExplainabilityDurabilityScore: 50,
      replayReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "REPLAY_CONTAINMENT_RISK",
      "REPLAY_ARCHIVE_CORRUPTION_RISK",
      "DOCTRINE_REPLAY_CONTINUITY_DRIFT",
      "REPLAY_CONTINUITY_DURABILITY_WEAKNESS",
      "RESTORATION_REPLAY_RECONSTRUCTION_FIDELITY_WEAKNESS",
      "REPLAY_RESTORATION_TRACE_INTEGRITY_WEAKNESS",
      "REPLAY_EXPLAINABILITY_DECAY",
      "REPLAY_REEVALUATION_REQUIRED",
    ]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      civilizationReplaySurvivabilityIntegrityScore: 74,
      replayReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceCivilizationRestorationReplaySurvivabilityInput = {
      ...durableInput,
      replayReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceCivilizationRestorationReplaySurvivability(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("keeps scores bounded", () => {
    const result = evaluateCountyGovernanceCivilizationRestorationReplaySurvivability({
      civilizationReplaySurvivabilityIntegrityScore: 150,
      restorationReplayReconstructionFidelityScore: Number.NaN,
      failClosedReplaySurvivabilityScore: 90,
      replayArchiveCorruptionRiskScore: -10,
      recursiveReplayDegradationRiskScore: -10,
      replayContinuityDurabilityScore: 100,
      replayContainmentStabilityScore: 120,
      doctrineReplayContinuityStabilityScore: 100,
      replayExplainabilityDurabilityScore: 100,
      replayEntropyRecurrenceRiskScore: 200,
      replayRestorationTraceIntegrityScore: 100,
      replayReevaluationPressureScore: 500,
    });

    assert.equal(
      result.replaySurvivabilitySeverityScore >= 0 && result.replaySurvivabilitySeverityScore <= 100,
      true,
    );
    assert.equal(result.replaySurvivabilityExposureLevel, "critical");
    assert.equal(result.replaySurvivabilityReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      replayExplainabilityDurabilityScore: 50,
      replayRestorationTraceIntegrityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveReplayDegradationRiskScore: 94,
      replayEntropyRecurrenceRiskScore: 94,
      replayArchiveCorruptionRiskScore: 94,
      failClosedReplaySurvivabilityScore: 60,
      replayContinuityDurabilityScore: 88,
    });

    assert.equal(result.replaySurvivabilityIntegrityLevel, "collapse_sensitive_replay_survivability");
    assert.equal(result.collapseSensitiveReplayEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_REPLAY_SURVIVABILITY");
  });

  it("saturates simultaneous replay degradation deterministically", () => {
    const result = evaluate({
      recursiveReplayDegradationRiskScore: 100,
      replayEntropyRecurrenceRiskScore: 100,
      replayArchiveCorruptionRiskScore: 100,
      replayContainmentStabilityScore: 0,
      doctrineReplayContinuityStabilityScore: 0,
      replayContinuityDurabilityScore: 0,
      restorationReplayReconstructionFidelityScore: 0,
      replayRestorationTraceIntegrityScore: 0,
      replayExplainabilityDurabilityScore: 0,
      failClosedReplaySurvivabilityScore: 80,
    });

    assert.equal(result.replaySurvivabilitySeverityScore, 100);
    assert.equal(result.replaySurvivabilityExposureLevel, "critical");
  });

  it("does not imply irreversible restoration capability", () => {
    const result = evaluateCountyGovernanceCivilizationRestorationReplaySurvivability(durableInput);

    assert.equal(
      result.explainability.longHorizonReplaySurvivabilityAssessment.includes(
        "does not imply irreversible restoration capability",
      ),
      true,
    );
  });
});
