import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceDoctrineClosureArchivalTransferContinuity,
  type CountyGovernanceDoctrineClosureArchivalTransferContinuityInput,
} from "./county-governance-doctrine-closure-archival-transfer-continuity-intelligence";

const durableInput: CountyGovernanceDoctrineClosureArchivalTransferContinuityInput = {
  archivalTransferReadinessScore: 94,
  closureArchiveContinuityScore: 93,
  archivalReplayDurabilityScore: 92,
  archivalExplainabilitySurvivabilityScore: 91,
  archivalAuditIntegrityScore: 90,
  failClosedArchivalTransferScore: 94,
  archivalFragmentationRiskScore: 8,
  archivalDesynchronizationRiskScore: 8,
  recursiveArchiveDriftRiskScore: 8,
  archivalContainmentIntegrityScore: 91,
  archivalEntropyRecurrenceRiskScore: 8,
  archivalReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceDoctrineClosureArchivalTransferContinuityInput>) {
  return evaluateCountyGovernanceDoctrineClosureArchivalTransferContinuity({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceDoctrineClosureArchivalTransferContinuity>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Doctrine Closure Archival Transfer Continuity Intelligence", () => {
  it("classifies durable archival transfer continuity", () => {
    const result = evaluateCountyGovernanceDoctrineClosureArchivalTransferContinuity(durableInput);

    assert.equal(result.archivalTransferContinuityLevel, "durable_archival_transfer_continuity");
    assert.equal(result.archivalTransferExposureLevel, "minimal");
    assert.equal(result.archivalReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonArchivalContinuity, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded archival transfer continuity", () => {
    const result = evaluate({
      archivalTransferReadinessScore: 74,
      closureArchiveContinuityScore: 88,
      archivalReplayDurabilityScore: 88,
      archivalReevaluationPressureScore: 20,
    });

    assert.equal(result.archivalTransferContinuityLevel, "bounded_archival_transfer_continuity");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.archivalTransferExposureLevel, "contained");
  });

  it("classifies continuation-required archival transfer", () => {
    const result = evaluate({
      closureArchiveContinuityScore: 66,
      archivalReplayDurabilityScore: 66,
      archivalExplainabilitySurvivabilityScore: 66,
      archivalReevaluationPressureScore: 44,
    });

    assert.equal(result.archivalTransferContinuityLevel, "archival_transfer_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveArchivalEscalation, false);
    assert.equal(result.warningCodes.includes("ARCHIVAL_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading archival transfer", () => {
    const result = evaluate({
      archivalReplayDurabilityScore: 50,
    });

    assert.equal(result.archivalTransferContinuityLevel, "archival_transfer_degrading");
    assert.equal(result.warningCodes.includes("ARCHIVAL_REPLAY_DURABILITY_WEAKNESS"), true);
  });

  it("classifies unstable archival transfer", () => {
    const result = evaluate({
      archivalFragmentationRiskScore: 50,
    });

    assert.equal(result.archivalTransferContinuityLevel, "archival_transfer_unstable");
    assert.equal(result.archivalFragmentationDetected, true);
  });

  it("keeps fail-closed archival transfer precedence", () => {
    const result = evaluate({
      failClosedArchivalTransferScore: 40,
      archivalTransferReadinessScore: 96,
      archivalReplayDurabilityScore: 96,
    });

    assert.equal(result.archivalTransferContinuityLevel, "fail_closed_archival_transfer_degradation");
    assert.equal(result.failClosedArchivalTransferDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_ARCHIVAL_TRANSFER_DEGRADATION");
  });

  it("detects collapse-sensitive archival transfer escalation", () => {
    const result = evaluate({
      archivalEntropyRecurrenceRiskScore: 94,
      failClosedArchivalTransferScore: 60,
    });

    assert.equal(result.archivalTransferContinuityLevel, "collapse_sensitive_archival_transfer");
    assert.equal(result.collapseSensitiveArchivalEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_ARCHIVAL_TRANSFER"), true);
  });

  it("detects archival fragmentation", () => {
    const result = evaluate({
      archivalFragmentationRiskScore: 78,
    });

    assert.equal(result.archivalTransferContinuityLevel, "archival_transfer_unstable");
    assert.equal(result.archivalFragmentationDetected, true);
    assert.equal(result.collapseSensitiveArchivalEscalation, false);
    assert.equal(result.warningCodes.includes("ARCHIVAL_FRAGMENTATION_RISK"), true);
  });

  it("detects archival desynchronization", () => {
    const result = evaluate({
      archivalDesynchronizationRiskScore: 78,
    });

    assert.equal(result.archivalTransferContinuityLevel, "archival_transfer_unstable");
    assert.equal(result.archivalDesynchronizationDetected, true);
    assert.equal(result.warningCodes.includes("ARCHIVAL_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects recursive archive drift", () => {
    const result = evaluate({
      recursiveArchiveDriftRiskScore: 78,
    });

    assert.equal(result.archivalTransferContinuityLevel, "archival_transfer_unstable");
    assert.equal(result.recursiveArchiveDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_ARCHIVE_DRIFT");
  });

  it("detects archival entropy recurrence", () => {
    const result = evaluate({
      archivalEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.archivalTransferContinuityLevel, "archival_transfer_unstable");
    assert.equal(result.archivalEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("ARCHIVAL_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects archival containment risk", () => {
    const result = evaluate({
      archivalContainmentIntegrityScore: 50,
    });

    assert.equal(result.archivalTransferContinuityLevel, "archival_transfer_unstable");
    assert.equal(result.archivalContainmentRiskDetected, true);
    assert.equal(result.warningCodes.includes("ARCHIVAL_CONTAINMENT_RISK"), true);
  });

  it("detects archival replay durability weakness", () => {
    const result = evaluate({
      archivalReplayDurabilityScore: 50,
    });

    assert.equal(result.archivalTransferContinuityLevel, "archival_transfer_degrading");
    assert.equal(result.warningCodes.includes("ARCHIVAL_REPLAY_DURABILITY_WEAKNESS"), true);
  });

  it("detects archival audit integrity weakness", () => {
    const result = evaluate({
      archivalAuditIntegrityScore: 50,
    });

    assert.equal(result.archivalTransferContinuityLevel, "archival_transfer_degrading");
    assert.equal(result.warningCodes.includes("ARCHIVAL_AUDIT_INTEGRITY_WEAKNESS"), true);
  });

  it("detects archival explainability survivability decay", () => {
    const result = evaluate({
      archivalExplainabilitySurvivabilityScore: 50,
    });

    assert.equal(result.archivalTransferContinuityLevel, "archival_transfer_degrading");
    assert.equal(result.warningCodes.includes("ARCHIVAL_EXPLAINABILITY_SURVIVABILITY_DECAY"), true);
  });

  it("detects closure archive continuity weakness", () => {
    const result = evaluate({
      closureArchiveContinuityScore: 50,
    });

    assert.equal(result.archivalTransferContinuityLevel, "archival_transfer_degrading");
    assert.equal(result.warningCodes.includes("CLOSURE_ARCHIVE_CONTINUITY_WEAKNESS"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      archivalReevaluationPressureScore: 82,
    });

    assert.equal(result.archivalReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("ARCHIVAL_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      archivalDesynchronizationRiskScore: 78,
      archivalFragmentationRiskScore: 78,
      archivalReplayDurabilityScore: 50,
      archivalAuditIntegrityScore: 50,
      archivalExplainabilitySurvivabilityScore: 50,
      closureArchiveContinuityScore: 50,
      archivalReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "ARCHIVAL_DESYNCHRONIZATION_RISK",
      "ARCHIVAL_FRAGMENTATION_RISK",
      "ARCHIVAL_REPLAY_DURABILITY_WEAKNESS",
      "ARCHIVAL_AUDIT_INTEGRITY_WEAKNESS",
      "ARCHIVAL_EXPLAINABILITY_SURVIVABILITY_DECAY",
      "CLOSURE_ARCHIVE_CONTINUITY_WEAKNESS",
      "ARCHIVAL_REEVALUATION_REQUIRED",
    ]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      archivalTransferReadinessScore: 74,
      archivalReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceDoctrineClosureArchivalTransferContinuityInput = {
      ...durableInput,
      archivalReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceDoctrineClosureArchivalTransferContinuity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("keeps scores bounded to 0..100", () => {
    const result = evaluateCountyGovernanceDoctrineClosureArchivalTransferContinuity({
      archivalTransferReadinessScore: 150,
      closureArchiveContinuityScore: Number.NaN,
      archivalReplayDurabilityScore: 100,
      archivalExplainabilitySurvivabilityScore: 100,
      archivalAuditIntegrityScore: 100,
      failClosedArchivalTransferScore: 90,
      archivalFragmentationRiskScore: -10,
      archivalDesynchronizationRiskScore: -10,
      recursiveArchiveDriftRiskScore: -10,
      archivalContainmentIntegrityScore: 120,
      archivalEntropyRecurrenceRiskScore: 200,
      archivalReevaluationPressureScore: 500,
    });

    assert.equal(result.archivalTransferSeverityScore >= 0 && result.archivalTransferSeverityScore <= 100, true);
    assert.equal(result.archivalTransferExposureLevel, "critical");
    assert.equal(result.archivalReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      archivalExplainabilitySurvivabilityScore: 50,
      archivalAuditIntegrityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps closure readiness distinct from archival transfer continuity", () => {
    const result = evaluate({
      archivalTransferReadinessScore: 50,
      archivalReplayDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("ARCHIVAL_TRANSFER_READINESS_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("ARCHIVAL_REPLAY_DURABILITY_WEAKNESS"), false);
  });

  it("keeps audit preservation distinct from archival replay durability", () => {
    const result = evaluate({
      archivalReplayDurabilityScore: 50,
      archivalAuditIntegrityScore: 95,
    });

    assert.equal(result.warningCodes.includes("ARCHIVAL_REPLAY_DURABILITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("ARCHIVAL_AUDIT_INTEGRITY_WEAKNESS"), false);
  });

  it("keeps archival explainability distinct from archival replay durability", () => {
    const result = evaluate({
      archivalExplainabilitySurvivabilityScore: 50,
      archivalReplayDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("ARCHIVAL_EXPLAINABILITY_SURVIVABILITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("ARCHIVAL_REPLAY_DURABILITY_WEAKNESS"), false);
  });

  it("keeps archive transfer from implying permanent governance survivability", () => {
    const result = evaluateCountyGovernanceDoctrineClosureArchivalTransferContinuity(durableInput);

    assert.equal(
      result.explainability.longHorizonArchivalContinuityAssessment.includes(
        "does not imply permanent governance survivability",
      ),
      true,
    );
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveArchiveDriftRiskScore: 94,
      archivalEntropyRecurrenceRiskScore: 94,
      archivalDesynchronizationRiskScore: 94,
      archivalFragmentationRiskScore: 94,
      failClosedArchivalTransferScore: 60,
      archivalReplayDurabilityScore: 88,
    });

    assert.equal(result.archivalTransferContinuityLevel, "collapse_sensitive_archival_transfer");
    assert.equal(result.collapseSensitiveArchivalEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_ARCHIVAL_TRANSFER");
  });

  it("saturates simultaneous archival degradation deterministically", () => {
    const result = evaluate({
      archivalFragmentationRiskScore: 100,
      archivalDesynchronizationRiskScore: 100,
      recursiveArchiveDriftRiskScore: 100,
      archivalEntropyRecurrenceRiskScore: 100,
      archivalContainmentIntegrityScore: 0,
      archivalReplayDurabilityScore: 0,
      archivalAuditIntegrityScore: 0,
      archivalExplainabilitySurvivabilityScore: 0,
      closureArchiveContinuityScore: 0,
      failClosedArchivalTransferScore: 80,
    });

    assert.equal(result.archivalTransferSeverityScore, 100);
    assert.equal(result.archivalTransferExposureLevel, "critical");
  });
});
