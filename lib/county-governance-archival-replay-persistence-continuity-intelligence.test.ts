import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceArchivalReplayPersistenceContinuity,
  type CountyGovernanceArchivalReplayPersistenceContinuityInput,
} from "./county-governance-archival-replay-persistence-continuity-intelligence";

const durableInput: CountyGovernanceArchivalReplayPersistenceContinuityInput = {
  archivalReplayPersistenceScore: 94,
  restorationTraceContinuityScore: 93,
  replayAuditDurabilityScore: 92,
  replayExplainabilitySurvivabilityScore: 91,
  archiveRestorationIntegrityScore: 90,
  failClosedReplayPersistenceScore: 94,
  replayFragmentationRiskScore: 8,
  replayDesynchronizationRiskScore: 8,
  recursiveReplayDriftRiskScore: 8,
  replayContainmentIntegrityScore: 91,
  replayEntropyRecurrenceRiskScore: 8,
  replayReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceArchivalReplayPersistenceContinuityInput>) {
  return evaluateCountyGovernanceArchivalReplayPersistenceContinuity({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceArchivalReplayPersistenceContinuity>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Archival Replay Persistence Continuity Intelligence", () => {
  it("classifies durable archival replay persistence", () => {
    const result = evaluateCountyGovernanceArchivalReplayPersistenceContinuity(durableInput);

    assert.equal(result.archivalReplayPersistenceLevel, "durable_archival_replay_persistence");
    assert.equal(result.replayPersistenceExposureLevel, "minimal");
    assert.equal(result.replayReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonReplayContinuity, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded archival replay persistence", () => {
    const result = evaluate({
      archivalReplayPersistenceScore: 74,
      restorationTraceContinuityScore: 88,
      replayAuditDurabilityScore: 88,
      replayReevaluationPressureScore: 20,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "bounded_archival_replay_persistence");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.replayPersistenceExposureLevel, "contained");
  });

  it("classifies continuation-required replay persistence", () => {
    const result = evaluate({
      restorationTraceContinuityScore: 66,
      replayAuditDurabilityScore: 66,
      replayExplainabilitySurvivabilityScore: 66,
      replayReevaluationPressureScore: 44,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveReplayEscalation, false);
    assert.equal(result.warningCodes.includes("REPLAY_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading replay persistence", () => {
    const result = evaluate({
      replayAuditDurabilityScore: 50,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_degrading");
    assert.equal(result.warningCodes.includes("REPLAY_AUDIT_DURABILITY_WEAKNESS"), true);
  });

  it("classifies unstable replay persistence", () => {
    const result = evaluate({
      replayFragmentationRiskScore: 50,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_unstable");
    assert.equal(result.replayFragmentationDetected, true);
  });

  it("keeps fail-closed replay persistence precedence", () => {
    const result = evaluate({
      failClosedReplayPersistenceScore: 40,
      archivalReplayPersistenceScore: 96,
      replayAuditDurabilityScore: 96,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "fail_closed_replay_persistence_degradation");
    assert.equal(result.failClosedReplayPersistenceDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_REPLAY_PERSISTENCE_DEGRADATION");
  });

  it("detects collapse-sensitive replay persistence escalation", () => {
    const result = evaluate({
      replayEntropyRecurrenceRiskScore: 94,
      failClosedReplayPersistenceScore: 60,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "collapse_sensitive_replay_persistence");
    assert.equal(result.collapseSensitiveReplayEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_REPLAY_PERSISTENCE"), true);
  });

  it("detects replay fragmentation", () => {
    const result = evaluate({
      replayFragmentationRiskScore: 78,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_unstable");
    assert.equal(result.replayFragmentationDetected, true);
    assert.equal(result.collapseSensitiveReplayEscalation, false);
    assert.equal(result.warningCodes.includes("REPLAY_FRAGMENTATION_RISK"), true);
  });

  it("detects replay desynchronization", () => {
    const result = evaluate({
      replayDesynchronizationRiskScore: 78,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_unstable");
    assert.equal(result.replayDesynchronizationDetected, true);
    assert.equal(result.warningCodes.includes("REPLAY_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects recursive replay drift", () => {
    const result = evaluate({
      recursiveReplayDriftRiskScore: 78,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_unstable");
    assert.equal(result.recursiveReplayDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_REPLAY_DRIFT");
  });

  it("detects replay entropy recurrence", () => {
    const result = evaluate({
      replayEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_unstable");
    assert.equal(result.replayEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("REPLAY_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects replay containment risk", () => {
    const result = evaluate({
      replayContainmentIntegrityScore: 50,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_unstable");
    assert.equal(result.replayContainmentRiskDetected, true);
    assert.equal(result.warningCodes.includes("REPLAY_CONTAINMENT_RISK"), true);
  });

  it("detects replay audit durability weakness", () => {
    const result = evaluate({
      replayAuditDurabilityScore: 50,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_degrading");
    assert.equal(result.warningCodes.includes("REPLAY_AUDIT_DURABILITY_WEAKNESS"), true);
  });

  it("detects archive restoration integrity weakness", () => {
    const result = evaluate({
      archiveRestorationIntegrityScore: 50,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_degrading");
    assert.equal(result.warningCodes.includes("ARCHIVE_RESTORATION_INTEGRITY_WEAKNESS"), true);
  });

  it("detects replay explainability survivability decay", () => {
    const result = evaluate({
      replayExplainabilitySurvivabilityScore: 50,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_degrading");
    assert.equal(result.warningCodes.includes("REPLAY_EXPLAINABILITY_SURVIVABILITY_DECAY"), true);
  });

  it("detects restoration trace continuity weakness", () => {
    const result = evaluate({
      restorationTraceContinuityScore: 50,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_TRACE_CONTINUITY_WEAKNESS"), true);
  });

  it("detects archival replay persistence weakness", () => {
    const result = evaluate({
      archivalReplayPersistenceScore: 50,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "archival_replay_degrading");
    assert.equal(result.warningCodes.includes("ARCHIVAL_REPLAY_PERSISTENCE_WEAKNESS"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      replayReevaluationPressureScore: 82,
    });

    assert.equal(result.replayReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("REPLAY_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      replayDesynchronizationRiskScore: 78,
      replayFragmentationRiskScore: 78,
      replayAuditDurabilityScore: 50,
      archiveRestorationIntegrityScore: 50,
      replayExplainabilitySurvivabilityScore: 50,
      restorationTraceContinuityScore: 50,
      replayReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "REPLAY_DESYNCHRONIZATION_RISK",
      "REPLAY_FRAGMENTATION_RISK",
      "REPLAY_AUDIT_DURABILITY_WEAKNESS",
      "ARCHIVE_RESTORATION_INTEGRITY_WEAKNESS",
      "REPLAY_EXPLAINABILITY_SURVIVABILITY_DECAY",
      "RESTORATION_TRACE_CONTINUITY_WEAKNESS",
      "REPLAY_REEVALUATION_REQUIRED",
    ]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      archivalReplayPersistenceScore: 74,
      replayReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceArchivalReplayPersistenceContinuityInput = {
      ...durableInput,
      replayReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceArchivalReplayPersistenceContinuity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("keeps scores bounded to 0..100", () => {
    const result = evaluateCountyGovernanceArchivalReplayPersistenceContinuity({
      archivalReplayPersistenceScore: 150,
      restorationTraceContinuityScore: Number.NaN,
      replayAuditDurabilityScore: 100,
      replayExplainabilitySurvivabilityScore: 100,
      archiveRestorationIntegrityScore: 100,
      failClosedReplayPersistenceScore: 90,
      replayFragmentationRiskScore: -10,
      replayDesynchronizationRiskScore: -10,
      recursiveReplayDriftRiskScore: -10,
      replayContainmentIntegrityScore: 120,
      replayEntropyRecurrenceRiskScore: 200,
      replayReevaluationPressureScore: 500,
    });

    assert.equal(result.replayPersistenceSeverityScore >= 0 && result.replayPersistenceSeverityScore <= 100, true);
    assert.equal(result.replayPersistenceExposureLevel, "critical");
    assert.equal(result.replayReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      replayExplainabilitySurvivabilityScore: 50,
      archiveRestorationIntegrityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps archival transfer continuity distinct from replay persistence", () => {
    const result = evaluate({
      archivalReplayPersistenceScore: 50,
      replayAuditDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("ARCHIVAL_REPLAY_PERSISTENCE_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("REPLAY_AUDIT_DURABILITY_WEAKNESS"), false);
  });

  it("keeps audit integrity distinct from replay audit durability", () => {
    const result = evaluate({
      replayAuditDurabilityScore: 50,
      archiveRestorationIntegrityScore: 95,
    });

    assert.equal(result.warningCodes.includes("REPLAY_AUDIT_DURABILITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("ARCHIVE_RESTORATION_INTEGRITY_WEAKNESS"), false);
  });

  it("keeps replay explainability distinct from replay audit durability", () => {
    const result = evaluate({
      replayExplainabilitySurvivabilityScore: 50,
      replayAuditDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("REPLAY_EXPLAINABILITY_SURVIVABILITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("REPLAY_AUDIT_DURABILITY_WEAKNESS"), false);
  });

  it("keeps replay persistence from implying permanent governance restoration", () => {
    const result = evaluateCountyGovernanceArchivalReplayPersistenceContinuity(durableInput);

    assert.equal(
      result.explainability.longHorizonReplayContinuityAssessment.includes(
        "does not imply permanent governance restoration",
      ),
      true,
    );
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveReplayDriftRiskScore: 94,
      replayEntropyRecurrenceRiskScore: 94,
      replayDesynchronizationRiskScore: 94,
      replayFragmentationRiskScore: 94,
      failClosedReplayPersistenceScore: 60,
      replayAuditDurabilityScore: 88,
    });

    assert.equal(result.archivalReplayPersistenceLevel, "collapse_sensitive_replay_persistence");
    assert.equal(result.collapseSensitiveReplayEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_REPLAY_PERSISTENCE");
  });

  it("saturates simultaneous replay degradation deterministically", () => {
    const result = evaluate({
      replayFragmentationRiskScore: 100,
      replayDesynchronizationRiskScore: 100,
      recursiveReplayDriftRiskScore: 100,
      replayEntropyRecurrenceRiskScore: 100,
      replayContainmentIntegrityScore: 0,
      replayAuditDurabilityScore: 0,
      archiveRestorationIntegrityScore: 0,
      replayExplainabilitySurvivabilityScore: 0,
      restorationTraceContinuityScore: 0,
      failClosedReplayPersistenceScore: 80,
    });

    assert.equal(result.replayPersistenceSeverityScore, 100);
    assert.equal(result.replayPersistenceExposureLevel, "critical");
  });
});
