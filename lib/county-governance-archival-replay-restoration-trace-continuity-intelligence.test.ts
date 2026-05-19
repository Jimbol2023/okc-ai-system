import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceArchivalReplayRestorationTraceContinuity,
  type CountyGovernanceArchivalReplayRestorationTraceContinuityInput,
} from "./county-governance-archival-replay-restoration-trace-continuity-intelligence";

const durableInput: CountyGovernanceArchivalReplayRestorationTraceContinuityInput = {
  restorationTraceContinuityScore: 94,
  replayToRestorationContinuityScore: 93,
  restorationAuditTraceIntegrityScore: 92,
  restorationExplainabilitySurvivabilityScore: 91,
  restorationHandoffDurabilityScore: 90,
  failClosedRestorationContinuityScore: 94,
  restorationFragmentationRiskScore: 8,
  restorationDesynchronizationRiskScore: 8,
  recursiveRestorationDriftRiskScore: 8,
  restorationContainmentIntegrityScore: 91,
  restorationEntropyRecurrenceRiskScore: 8,
  restorationReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceArchivalReplayRestorationTraceContinuityInput>) {
  return evaluateCountyGovernanceArchivalReplayRestorationTraceContinuity({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceArchivalReplayRestorationTraceContinuity>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Archival Replay Restoration Trace Continuity Intelligence", () => {
  it("classifies durable restoration trace continuity", () => {
    const result = evaluateCountyGovernanceArchivalReplayRestorationTraceContinuity(durableInput);

    assert.equal(result.restorationTraceContinuityLevel, "durable_restoration_trace_continuity");
    assert.equal(result.restorationContinuityExposureLevel, "minimal");
    assert.equal(result.restorationReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonRestorationContinuity, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded restoration trace continuity", () => {
    const result = evaluate({
      restorationTraceContinuityScore: 74,
      replayToRestorationContinuityScore: 88,
      restorationAuditTraceIntegrityScore: 88,
      restorationReevaluationPressureScore: 20,
    });

    assert.equal(result.restorationTraceContinuityLevel, "bounded_restoration_trace_continuity");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.restorationContinuityExposureLevel, "contained");
  });

  it("classifies continuation-required restoration continuity", () => {
    const result = evaluate({
      replayToRestorationContinuityScore: 66,
      restorationAuditTraceIntegrityScore: 66,
      restorationExplainabilitySurvivabilityScore: 66,
      restorationReevaluationPressureScore: 44,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveRestorationEscalation, false);
    assert.equal(result.warningCodes.includes("RESTORATION_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading restoration continuity", () => {
    const result = evaluate({
      restorationAuditTraceIntegrityScore: 50,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_AUDIT_TRACE_INTEGRITY_WEAKNESS"), true);
  });

  it("classifies unstable restoration continuity", () => {
    const result = evaluate({
      restorationFragmentationRiskScore: 50,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_unstable");
    assert.equal(result.restorationFragmentationDetected, true);
  });

  it("keeps fail-closed restoration continuity precedence", () => {
    const result = evaluate({
      failClosedRestorationContinuityScore: 40,
      restorationTraceContinuityScore: 96,
      restorationAuditTraceIntegrityScore: 96,
    });

    assert.equal(result.restorationTraceContinuityLevel, "fail_closed_restoration_continuity_degradation");
    assert.equal(result.failClosedRestorationContinuityDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_RESTORATION_CONTINUITY_DEGRADATION");
  });

  it("detects collapse-sensitive restoration continuity escalation", () => {
    const result = evaluate({
      restorationEntropyRecurrenceRiskScore: 94,
      failClosedRestorationContinuityScore: 60,
    });

    assert.equal(result.restorationTraceContinuityLevel, "collapse_sensitive_restoration_continuity");
    assert.equal(result.collapseSensitiveRestorationEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_RESTORATION_CONTINUITY"), true);
  });

  it("detects restoration fragmentation", () => {
    const result = evaluate({
      restorationFragmentationRiskScore: 78,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_unstable");
    assert.equal(result.restorationFragmentationDetected, true);
    assert.equal(result.collapseSensitiveRestorationEscalation, false);
    assert.equal(result.warningCodes.includes("RESTORATION_FRAGMENTATION_RISK"), true);
  });

  it("detects restoration desynchronization", () => {
    const result = evaluate({
      restorationDesynchronizationRiskScore: 78,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_unstable");
    assert.equal(result.restorationDesynchronizationDetected, true);
    assert.equal(result.warningCodes.includes("RESTORATION_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects recursive restoration drift", () => {
    const result = evaluate({
      recursiveRestorationDriftRiskScore: 78,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_unstable");
    assert.equal(result.recursiveRestorationDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_RESTORATION_DRIFT");
  });

  it("detects restoration entropy recurrence", () => {
    const result = evaluate({
      restorationEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_unstable");
    assert.equal(result.restorationEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("RESTORATION_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects restoration containment risk", () => {
    const result = evaluate({
      restorationContainmentIntegrityScore: 50,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_unstable");
    assert.equal(result.restorationContainmentRiskDetected, true);
    assert.equal(result.warningCodes.includes("RESTORATION_CONTAINMENT_RISK"), true);
  });

  it("detects restoration audit-trace integrity weakness", () => {
    const result = evaluate({
      restorationAuditTraceIntegrityScore: 50,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_AUDIT_TRACE_INTEGRITY_WEAKNESS"), true);
  });

  it("detects restoration handoff durability weakness", () => {
    const result = evaluate({
      restorationHandoffDurabilityScore: 50,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_HANDOFF_DURABILITY_WEAKNESS"), true);
  });

  it("detects restoration explainability survivability decay", () => {
    const result = evaluate({
      restorationExplainabilitySurvivabilityScore: 50,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_EXPLAINABILITY_SURVIVABILITY_DECAY"), true);
  });

  it("detects replay-to-restoration continuity weakness", () => {
    const result = evaluate({
      replayToRestorationContinuityScore: 50,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_degrading");
    assert.equal(result.warningCodes.includes("REPLAY_TO_RESTORATION_CONTINUITY_WEAKNESS"), true);
  });

  it("detects restoration trace continuity weakness", () => {
    const result = evaluate({
      restorationTraceContinuityScore: 50,
    });

    assert.equal(result.restorationTraceContinuityLevel, "restoration_trace_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_TRACE_CONTINUITY_WEAKNESS"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      restorationReevaluationPressureScore: 82,
    });

    assert.equal(result.restorationReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("RESTORATION_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      restorationDesynchronizationRiskScore: 78,
      restorationFragmentationRiskScore: 78,
      restorationAuditTraceIntegrityScore: 50,
      restorationHandoffDurabilityScore: 50,
      restorationExplainabilitySurvivabilityScore: 50,
      replayToRestorationContinuityScore: 50,
      restorationReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "RESTORATION_DESYNCHRONIZATION_RISK",
      "RESTORATION_FRAGMENTATION_RISK",
      "RESTORATION_AUDIT_TRACE_INTEGRITY_WEAKNESS",
      "RESTORATION_HANDOFF_DURABILITY_WEAKNESS",
      "RESTORATION_EXPLAINABILITY_SURVIVABILITY_DECAY",
      "REPLAY_TO_RESTORATION_CONTINUITY_WEAKNESS",
      "RESTORATION_REEVALUATION_REQUIRED",
    ]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      restorationTraceContinuityScore: 74,
      restorationReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceArchivalReplayRestorationTraceContinuityInput = {
      ...durableInput,
      restorationReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceArchivalReplayRestorationTraceContinuity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("keeps scores bounded to 0..100", () => {
    const result = evaluateCountyGovernanceArchivalReplayRestorationTraceContinuity({
      restorationTraceContinuityScore: 150,
      replayToRestorationContinuityScore: Number.NaN,
      restorationAuditTraceIntegrityScore: 100,
      restorationExplainabilitySurvivabilityScore: 100,
      restorationHandoffDurabilityScore: 100,
      failClosedRestorationContinuityScore: 90,
      restorationFragmentationRiskScore: -10,
      restorationDesynchronizationRiskScore: -10,
      recursiveRestorationDriftRiskScore: -10,
      restorationContainmentIntegrityScore: 120,
      restorationEntropyRecurrenceRiskScore: 200,
      restorationReevaluationPressureScore: 500,
    });

    assert.equal(
      result.restorationContinuitySeverityScore >= 0 && result.restorationContinuitySeverityScore <= 100,
      true,
    );
    assert.equal(result.restorationContinuityExposureLevel, "critical");
    assert.equal(result.restorationReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      restorationExplainabilitySurvivabilityScore: 50,
      restorationHandoffDurabilityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps replay persistence distinct from restoration trace continuity", () => {
    const result = evaluate({
      restorationTraceContinuityScore: 50,
      restorationAuditTraceIntegrityScore: 95,
    });

    assert.equal(result.warningCodes.includes("RESTORATION_TRACE_CONTINUITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("RESTORATION_AUDIT_TRACE_INTEGRITY_WEAKNESS"), false);
  });

  it("keeps replay audit durability distinct from restoration audit-trace integrity", () => {
    const result = evaluate({
      restorationAuditTraceIntegrityScore: 50,
      restorationHandoffDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("RESTORATION_AUDIT_TRACE_INTEGRITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("RESTORATION_HANDOFF_DURABILITY_WEAKNESS"), false);
  });

  it("keeps restoration explainability distinct from restoration audit-trace integrity", () => {
    const result = evaluate({
      restorationExplainabilitySurvivabilityScore: 50,
      restorationAuditTraceIntegrityScore: 95,
    });

    assert.equal(result.warningCodes.includes("RESTORATION_EXPLAINABILITY_SURVIVABILITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("RESTORATION_AUDIT_TRACE_INTEGRITY_WEAKNESS"), false);
  });

  it("keeps restoration continuity from implying permanent governance recovery", () => {
    const result = evaluateCountyGovernanceArchivalReplayRestorationTraceContinuity(durableInput);

    assert.equal(
      result.explainability.longHorizonRestorationContinuityAssessment.includes(
        "does not imply permanent governance recovery",
      ),
      true,
    );
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveRestorationDriftRiskScore: 94,
      restorationEntropyRecurrenceRiskScore: 94,
      restorationDesynchronizationRiskScore: 94,
      restorationFragmentationRiskScore: 94,
      failClosedRestorationContinuityScore: 60,
      restorationAuditTraceIntegrityScore: 88,
    });

    assert.equal(result.restorationTraceContinuityLevel, "collapse_sensitive_restoration_continuity");
    assert.equal(result.collapseSensitiveRestorationEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_RESTORATION_CONTINUITY");
  });

  it("saturates simultaneous restoration degradation deterministically", () => {
    const result = evaluate({
      restorationFragmentationRiskScore: 100,
      restorationDesynchronizationRiskScore: 100,
      recursiveRestorationDriftRiskScore: 100,
      restorationEntropyRecurrenceRiskScore: 100,
      restorationContainmentIntegrityScore: 0,
      restorationAuditTraceIntegrityScore: 0,
      restorationHandoffDurabilityScore: 0,
      restorationExplainabilitySurvivabilityScore: 0,
      replayToRestorationContinuityScore: 0,
      failClosedRestorationContinuityScore: 80,
    });

    assert.equal(result.restorationContinuitySeverityScore, 100);
    assert.equal(result.restorationContinuityExposureLevel, "critical");
  });
});
