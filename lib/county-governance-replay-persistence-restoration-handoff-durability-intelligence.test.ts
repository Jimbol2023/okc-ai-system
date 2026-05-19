import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceReplayPersistenceRestorationHandoffDurability,
  type CountyGovernanceReplayPersistenceRestorationHandoffDurabilityInput,
} from "./county-governance-replay-persistence-restoration-handoff-durability-intelligence";

const durableInput: CountyGovernanceReplayPersistenceRestorationHandoffDurabilityInput = {
  restorationHandoffDurabilityScore: 94,
  replayToRestorationHandoffScore: 93,
  restorationTransferContinuityScore: 92,
  auditHandoffDurabilityScore: 91,
  restorationExplainabilityContinuityScore: 90,
  failClosedRestorationHandoffScore: 94,
  restorationHandoffFragmentationRiskScore: 8,
  restorationHandoffDesynchronizationRiskScore: 8,
  recursiveRestorationHandoffDriftRiskScore: 8,
  restorationHandoffContainmentIntegrityScore: 91,
  restorationHandoffEntropyRecurrenceRiskScore: 8,
  restorationHandoffReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceReplayPersistenceRestorationHandoffDurabilityInput>) {
  return evaluateCountyGovernanceReplayPersistenceRestorationHandoffDurability({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceReplayPersistenceRestorationHandoffDurability>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Replay Persistence Restoration Handoff Durability Intelligence", () => {
  it("classifies durable restoration handoff durability", () => {
    const result = evaluateCountyGovernanceReplayPersistenceRestorationHandoffDurability(durableInput);

    assert.equal(result.restorationHandoffDurabilityLevel, "durable_restoration_handoff_durability");
    assert.equal(result.restorationHandoffExposureLevel, "minimal");
    assert.equal(result.restorationHandoffReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonRestorationHandoff, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded restoration handoff durability", () => {
    const result = evaluate({
      restorationHandoffDurabilityScore: 74,
      replayToRestorationHandoffScore: 88,
      auditHandoffDurabilityScore: 88,
      restorationHandoffReevaluationPressureScore: 20,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "bounded_restoration_handoff_durability");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.restorationHandoffExposureLevel, "contained");
  });

  it("classifies continuation-required restoration handoff", () => {
    const result = evaluate({
      replayToRestorationHandoffScore: 66,
      auditHandoffDurabilityScore: 66,
      restorationExplainabilityContinuityScore: 66,
      restorationHandoffReevaluationPressureScore: 44,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "restoration_handoff_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveRestorationHandoffEscalation, false);
    assert.equal(result.warningCodes.includes("RESTORATION_HANDOFF_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading restoration handoff", () => {
    const result = evaluate({
      auditHandoffDurabilityScore: 50,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "restoration_handoff_degrading");
    assert.equal(result.warningCodes.includes("AUDIT_HANDOFF_DURABILITY_WEAKNESS"), true);
  });

  it("classifies unstable restoration handoff", () => {
    const result = evaluate({
      restorationHandoffFragmentationRiskScore: 50,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "restoration_handoff_unstable");
    assert.equal(result.restorationHandoffFragmentationDetected, true);
  });

  it("keeps fail-closed restoration handoff precedence", () => {
    const result = evaluate({
      failClosedRestorationHandoffScore: 40,
      restorationHandoffDurabilityScore: 96,
      auditHandoffDurabilityScore: 96,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "fail_closed_restoration_handoff_degradation");
    assert.equal(result.failClosedRestorationHandoffDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_RESTORATION_HANDOFF_DEGRADATION");
  });

  it("detects collapse-sensitive restoration handoff escalation", () => {
    const result = evaluate({
      restorationHandoffEntropyRecurrenceRiskScore: 94,
      failClosedRestorationHandoffScore: 60,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "collapse_sensitive_restoration_handoff");
    assert.equal(result.collapseSensitiveRestorationHandoffEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_RESTORATION_HANDOFF"), true);
  });

  it("detects restoration handoff fragmentation", () => {
    const result = evaluate({
      restorationHandoffFragmentationRiskScore: 78,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "restoration_handoff_unstable");
    assert.equal(result.restorationHandoffFragmentationDetected, true);
    assert.equal(result.collapseSensitiveRestorationHandoffEscalation, false);
    assert.equal(result.warningCodes.includes("RESTORATION_HANDOFF_FRAGMENTATION_RISK"), true);
  });

  it("detects restoration handoff desynchronization", () => {
    const result = evaluate({
      restorationHandoffDesynchronizationRiskScore: 78,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "restoration_handoff_unstable");
    assert.equal(result.restorationHandoffDesynchronizationDetected, true);
    assert.equal(result.warningCodes.includes("RESTORATION_HANDOFF_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects recursive restoration handoff drift", () => {
    const result = evaluate({
      recursiveRestorationHandoffDriftRiskScore: 78,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "restoration_handoff_unstable");
    assert.equal(result.recursiveRestorationHandoffDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_RESTORATION_HANDOFF_DRIFT");
  });

  it("detects restoration handoff entropy recurrence", () => {
    const result = evaluate({
      restorationHandoffEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "restoration_handoff_unstable");
    assert.equal(result.restorationHandoffEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("RESTORATION_HANDOFF_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects restoration handoff containment risk", () => {
    const result = evaluate({
      restorationHandoffContainmentIntegrityScore: 50,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "restoration_handoff_unstable");
    assert.equal(result.restorationHandoffContainmentRiskDetected, true);
    assert.equal(result.warningCodes.includes("RESTORATION_HANDOFF_CONTAINMENT_RISK"), true);
  });

  it("detects audit handoff durability weakness", () => {
    const result = evaluate({
      auditHandoffDurabilityScore: 50,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "restoration_handoff_degrading");
    assert.equal(result.warningCodes.includes("AUDIT_HANDOFF_DURABILITY_WEAKNESS"), true);
  });

  it("detects restoration transfer continuity weakness", () => {
    const result = evaluate({
      restorationTransferContinuityScore: 50,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "restoration_handoff_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_TRANSFER_CONTINUITY_WEAKNESS"), true);
  });

  it("detects restoration explainability continuity decay", () => {
    const result = evaluate({
      restorationExplainabilityContinuityScore: 50,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "restoration_handoff_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_EXPLAINABILITY_CONTINUITY_DECAY"), true);
  });

  it("detects replay-to-restoration handoff weakness", () => {
    const result = evaluate({
      replayToRestorationHandoffScore: 50,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "restoration_handoff_degrading");
    assert.equal(result.warningCodes.includes("REPLAY_TO_RESTORATION_HANDOFF_WEAKNESS"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      restorationHandoffReevaluationPressureScore: 82,
    });

    assert.equal(result.restorationHandoffReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("RESTORATION_HANDOFF_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      restorationHandoffDesynchronizationRiskScore: 78,
      restorationHandoffFragmentationRiskScore: 78,
      auditHandoffDurabilityScore: 50,
      restorationTransferContinuityScore: 50,
      restorationExplainabilityContinuityScore: 50,
      replayToRestorationHandoffScore: 50,
      restorationHandoffReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "RESTORATION_HANDOFF_DESYNCHRONIZATION_RISK",
      "RESTORATION_HANDOFF_FRAGMENTATION_RISK",
      "AUDIT_HANDOFF_DURABILITY_WEAKNESS",
      "RESTORATION_TRANSFER_CONTINUITY_WEAKNESS",
      "RESTORATION_EXPLAINABILITY_CONTINUITY_DECAY",
      "REPLAY_TO_RESTORATION_HANDOFF_WEAKNESS",
      "RESTORATION_HANDOFF_REEVALUATION_REQUIRED",
    ]);
  });

  it("deduplicates warnings while preserving precedence", () => {
    const result = evaluate({
      restorationHandoffEntropyRecurrenceRiskScore: 94,
      restorationHandoffDesynchronizationRiskScore: 94,
      failClosedRestorationHandoffScore: 60,
      auditHandoffDurabilityScore: 88,
    });

    assert.equal(
      result.warningCodes.filter((warning) => warning === "COLLAPSE_SENSITIVE_RESTORATION_HANDOFF").length,
      1,
    );
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_RESTORATION_HANDOFF");
  });

  it("keeps deterministic explainability ordering", () => {
    const result = evaluate({
      auditHandoffDurabilityScore: 40,
      restorationTransferContinuityScore: 40,
    });

    assert.equal(result.explainability.primaryRestorationHandoffDriver, "audit handoff durability weakness");
    assert.equal(result.explainability.dominantRestorationHandoffEscalationReason, result.warningCodes[0]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      restorationHandoffDurabilityScore: 74,
      restorationHandoffReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceReplayPersistenceRestorationHandoffDurabilityInput = {
      ...durableInput,
      restorationHandoffReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceReplayPersistenceRestorationHandoffDurability(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("normalizes non-finite values and keeps scores bounded to 0..100", () => {
    const result = evaluateCountyGovernanceReplayPersistenceRestorationHandoffDurability({
      restorationHandoffDurabilityScore: 150,
      replayToRestorationHandoffScore: Number.NaN,
      restorationTransferContinuityScore: 100,
      auditHandoffDurabilityScore: 100,
      restorationExplainabilityContinuityScore: 100,
      failClosedRestorationHandoffScore: 90,
      restorationHandoffFragmentationRiskScore: -10,
      restorationHandoffDesynchronizationRiskScore: -10,
      recursiveRestorationHandoffDriftRiskScore: -10,
      restorationHandoffContainmentIntegrityScore: 120,
      restorationHandoffEntropyRecurrenceRiskScore: 200,
      restorationHandoffReevaluationPressureScore: 500,
    });

    assert.equal(
      result.restorationHandoffSeverityScore >= 0 && result.restorationHandoffSeverityScore <= 100,
      true,
    );
    assert.equal(result.restorationHandoffExposureLevel, "critical");
    assert.equal(result.restorationHandoffReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      restorationExplainabilityContinuityScore: 50,
      restorationTransferContinuityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps restoration continuity distinct from handoff durability", () => {
    const result = evaluate({
      restorationHandoffDurabilityScore: 50,
      auditHandoffDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("RESTORATION_HANDOFF_DURABILITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("AUDIT_HANDOFF_DURABILITY_WEAKNESS"), false);
  });

  it("keeps audit durability distinct from audit integrity", () => {
    const result = evaluate({
      auditHandoffDurabilityScore: 50,
      restorationTransferContinuityScore: 95,
    });

    assert.equal(result.warningCodes.includes("AUDIT_HANDOFF_DURABILITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("RESTORATION_TRANSFER_CONTINUITY_WEAKNESS"), false);
  });

  it("keeps restoration explainability continuity distinct from audit handoff durability", () => {
    const result = evaluate({
      restorationExplainabilityContinuityScore: 50,
      auditHandoffDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("RESTORATION_EXPLAINABILITY_CONTINUITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("AUDIT_HANDOFF_DURABILITY_WEAKNESS"), false);
  });

  it("keeps restoration handoff durability from implying permanent recovery", () => {
    const result = evaluateCountyGovernanceReplayPersistenceRestorationHandoffDurability(durableInput);

    assert.equal(
      result.explainability.longHorizonRestorationHandoffAssessment.includes(
        "does not imply permanent governance recovery",
      ),
      true,
    );
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveRestorationHandoffDriftRiskScore: 94,
      restorationHandoffEntropyRecurrenceRiskScore: 94,
      restorationHandoffDesynchronizationRiskScore: 94,
      restorationHandoffFragmentationRiskScore: 94,
      failClosedRestorationHandoffScore: 60,
      auditHandoffDurabilityScore: 88,
    });

    assert.equal(result.restorationHandoffDurabilityLevel, "collapse_sensitive_restoration_handoff");
    assert.equal(result.collapseSensitiveRestorationHandoffEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_RESTORATION_HANDOFF");
  });

  it("saturates simultaneous restoration handoff degradation deterministically", () => {
    const result = evaluate({
      restorationHandoffFragmentationRiskScore: 100,
      restorationHandoffDesynchronizationRiskScore: 100,
      recursiveRestorationHandoffDriftRiskScore: 100,
      restorationHandoffEntropyRecurrenceRiskScore: 100,
      restorationHandoffContainmentIntegrityScore: 0,
      auditHandoffDurabilityScore: 0,
      restorationTransferContinuityScore: 0,
      restorationExplainabilityContinuityScore: 0,
      replayToRestorationHandoffScore: 0,
      failClosedRestorationHandoffScore: 80,
    });

    assert.equal(result.restorationHandoffSeverityScore, 100);
    assert.equal(result.restorationHandoffExposureLevel, "critical");
  });
});
