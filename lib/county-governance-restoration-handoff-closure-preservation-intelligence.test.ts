import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceRestorationHandoffClosurePreservation,
  type CountyGovernanceRestorationHandoffClosurePreservationInput,
} from "./county-governance-restoration-handoff-closure-preservation-intelligence";

const durableInput: CountyGovernanceRestorationHandoffClosurePreservationInput = {
  restorationClosurePreservationScore: 94,
  restorationClosureSurvivabilityScore: 93,
  restorationStewardshipContinuityScore: 92,
  restorationClosureContainmentIntegrityScore: 91,
  restorationClosureExplainabilityContinuityScore: 90,
  failClosedRestorationClosureScore: 94,
  restorationClosureFragmentationRiskScore: 8,
  restorationClosureDesynchronizationRiskScore: 8,
  recursiveRestorationClosureDriftRiskScore: 8,
  restorationClosureEntropyRecurrenceRiskScore: 8,
  restorationClosureReevaluationPressureScore: 10,
  restorationClosureSaturationRiskScore: 8,
};

function evaluate(input: Partial<CountyGovernanceRestorationHandoffClosurePreservationInput>) {
  return evaluateCountyGovernanceRestorationHandoffClosurePreservation({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceRestorationHandoffClosurePreservation>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Restoration Handoff Closure Preservation Intelligence", () => {
  it("classifies durable restoration closure preservation", () => {
    const result = evaluateCountyGovernanceRestorationHandoffClosurePreservation(durableInput);

    assert.equal(result.restorationClosurePreservationLevel, "durable_restoration_closure_preservation");
    assert.equal(result.restorationClosureExposureLevel, "minimal");
    assert.equal(result.restorationClosureReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonRestorationClosureViability, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded restoration closure preservation", () => {
    const result = evaluate({
      restorationClosurePreservationScore: 74,
      restorationClosureSurvivabilityScore: 88,
      restorationStewardshipContinuityScore: 88,
      restorationClosureReevaluationPressureScore: 20,
    });

    assert.equal(result.restorationClosurePreservationLevel, "bounded_restoration_closure_preservation");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.restorationClosureExposureLevel, "contained");
  });

  it("classifies continuation-required restoration closure", () => {
    const result = evaluate({
      restorationClosureSurvivabilityScore: 66,
      restorationStewardshipContinuityScore: 66,
      restorationClosureExplainabilityContinuityScore: 66,
      restorationClosureReevaluationPressureScore: 44,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveRestorationClosureEscalation, false);
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading restoration closure", () => {
    const result = evaluate({
      restorationClosureSurvivabilityScore: 50,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_SURVIVABILITY_WEAKNESS"), true);
  });

  it("classifies unstable restoration closure", () => {
    const result = evaluate({
      restorationClosureFragmentationRiskScore: 50,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_unstable");
    assert.equal(result.restorationClosureFragmentationDetected, true);
  });

  it("keeps fail-closed restoration closure precedence", () => {
    const result = evaluate({
      failClosedRestorationClosureScore: 40,
      restorationClosurePreservationScore: 96,
      restorationClosureSurvivabilityScore: 96,
    });

    assert.equal(result.restorationClosurePreservationLevel, "fail_closed_restoration_closure_degradation");
    assert.equal(result.failClosedRestorationClosureDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_RESTORATION_CLOSURE_DEGRADATION");
  });

  it("detects collapse-sensitive restoration closure escalation", () => {
    const result = evaluate({
      restorationClosureEntropyRecurrenceRiskScore: 94,
      failClosedRestorationClosureScore: 60,
    });

    assert.equal(result.restorationClosurePreservationLevel, "collapse_sensitive_restoration_closure");
    assert.equal(result.collapseSensitiveRestorationClosureEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_RESTORATION_CLOSURE"), true);
  });

  it("detects restoration closure fragmentation", () => {
    const result = evaluate({
      restorationClosureFragmentationRiskScore: 78,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_unstable");
    assert.equal(result.restorationClosureFragmentationDetected, true);
    assert.equal(result.collapseSensitiveRestorationClosureEscalation, false);
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_FRAGMENTATION_RISK"), true);
  });

  it("detects restoration closure desynchronization", () => {
    const result = evaluate({
      restorationClosureDesynchronizationRiskScore: 78,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_unstable");
    assert.equal(result.restorationClosureDesynchronizationDetected, true);
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects recursive restoration closure drift", () => {
    const result = evaluate({
      recursiveRestorationClosureDriftRiskScore: 78,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_unstable");
    assert.equal(result.recursiveRestorationClosureDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_RESTORATION_CLOSURE_DRIFT");
  });

  it("detects restoration closure entropy recurrence", () => {
    const result = evaluate({
      restorationClosureEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_unstable");
    assert.equal(result.restorationClosureEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects restoration closure containment risk", () => {
    const result = evaluate({
      restorationClosureContainmentIntegrityScore: 50,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_unstable");
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_CONTAINMENT_RISK"), true);
  });

  it("detects restoration closure saturation risk", () => {
    const result = evaluate({
      restorationClosureSaturationRiskScore: 78,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_unstable");
    assert.equal(result.restorationClosureSaturationDetected, true);
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_SATURATION_RISK"), true);
  });

  it("detects restoration closure survivability weakness", () => {
    const result = evaluate({
      restorationClosureSurvivabilityScore: 50,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects stewardship continuity weakness", () => {
    const result = evaluate({
      restorationStewardshipContinuityScore: 50,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_STEWARDSHIP_CONTINUITY_WEAKNESS"), true);
  });

  it("detects closure explainability decay", () => {
    const result = evaluate({
      restorationClosureExplainabilityContinuityScore: 50,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_EXPLAINABILITY_DECAY"), true);
  });

  it("detects closure preservation weakness", () => {
    const result = evaluate({
      restorationClosurePreservationScore: 50,
    });

    assert.equal(result.restorationClosurePreservationLevel, "restoration_closure_degrading");
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_PRESERVATION_WEAKNESS"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      restorationClosureReevaluationPressureScore: 82,
    });

    assert.equal(result.restorationClosureReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      restorationClosureDesynchronizationRiskScore: 78,
      restorationClosureFragmentationRiskScore: 78,
      restorationClosureSurvivabilityScore: 50,
      restorationStewardshipContinuityScore: 50,
      restorationClosureExplainabilityContinuityScore: 50,
      restorationClosureReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "RESTORATION_CLOSURE_DESYNCHRONIZATION_RISK",
      "RESTORATION_CLOSURE_FRAGMENTATION_RISK",
      "RESTORATION_CLOSURE_SURVIVABILITY_WEAKNESS",
      "RESTORATION_STEWARDSHIP_CONTINUITY_WEAKNESS",
      "RESTORATION_CLOSURE_EXPLAINABILITY_DECAY",
      "RESTORATION_CLOSURE_REEVALUATION_REQUIRED",
    ]);
  });

  it("deduplicates warnings while preserving precedence", () => {
    const result = evaluate({
      restorationClosureEntropyRecurrenceRiskScore: 94,
      restorationClosureSaturationRiskScore: 94,
      failClosedRestorationClosureScore: 60,
      restorationClosureSurvivabilityScore: 88,
    });

    assert.equal(
      result.warningCodes.filter((warning) => warning === "COLLAPSE_SENSITIVE_RESTORATION_CLOSURE").length,
      1,
    );
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_RESTORATION_CLOSURE");
  });

  it("keeps deterministic explainability ordering", () => {
    const result = evaluate({
      restorationClosureSurvivabilityScore: 40,
      restorationStewardshipContinuityScore: 40,
    });

    assert.equal(result.explainability.primaryRestorationClosureDriver, "restoration closure survivability weakness");
    assert.equal(result.explainability.dominantRestorationClosureEscalationReason, result.warningCodes[0]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      restorationClosurePreservationScore: 74,
      restorationClosureReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceRestorationHandoffClosurePreservationInput = {
      ...durableInput,
      restorationClosureReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceRestorationHandoffClosurePreservation(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("normalizes non-finite values and keeps scores bounded to 0..100", () => {
    const result = evaluateCountyGovernanceRestorationHandoffClosurePreservation({
      restorationClosurePreservationScore: 150,
      restorationClosureSurvivabilityScore: Number.NaN,
      restorationStewardshipContinuityScore: 100,
      restorationClosureContainmentIntegrityScore: 120,
      restorationClosureExplainabilityContinuityScore: 100,
      failClosedRestorationClosureScore: 90,
      restorationClosureFragmentationRiskScore: -10,
      restorationClosureDesynchronizationRiskScore: -10,
      recursiveRestorationClosureDriftRiskScore: -10,
      restorationClosureEntropyRecurrenceRiskScore: 200,
      restorationClosureReevaluationPressureScore: 500,
      restorationClosureSaturationRiskScore: 200,
    });

    assert.equal(result.restorationClosureSeverityScore >= 0 && result.restorationClosureSeverityScore <= 100, true);
    assert.equal(result.restorationClosureExposureLevel, "critical");
    assert.equal(result.restorationClosureReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      restorationClosureExplainabilityContinuityScore: 50,
      restorationStewardshipContinuityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps handoff durability distinct from closure preservation", () => {
    const result = evaluate({
      restorationClosurePreservationScore: 50,
      restorationClosureSurvivabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_PRESERVATION_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_SURVIVABILITY_WEAKNESS"), false);
  });

  it("keeps stewardship continuity distinct from irreversible stabilization", () => {
    const result = evaluate({
      restorationStewardshipContinuityScore: 50,
      restorationClosurePreservationScore: 95,
    });

    assert.equal(result.warningCodes.includes("RESTORATION_STEWARDSHIP_CONTINUITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_PRESERVATION_WEAKNESS"), false);
  });

  it("keeps closure explainability distinct from closure survivability", () => {
    const result = evaluate({
      restorationClosureExplainabilityContinuityScore: 50,
      restorationClosureSurvivabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_EXPLAINABILITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("RESTORATION_CLOSURE_SURVIVABILITY_WEAKNESS"), false);
  });

  it("keeps closure preservation from implying permanent governance recovery", () => {
    const result = evaluateCountyGovernanceRestorationHandoffClosurePreservation(durableInput);

    assert.equal(
      result.explainability.longHorizonRestorationClosureAssessment.includes(
        "does not imply permanent governance recovery",
      ),
      true,
    );
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveRestorationClosureDriftRiskScore: 94,
      restorationClosureEntropyRecurrenceRiskScore: 94,
      restorationClosureDesynchronizationRiskScore: 94,
      restorationClosureFragmentationRiskScore: 94,
      restorationClosureSaturationRiskScore: 94,
      failClosedRestorationClosureScore: 60,
      restorationClosureSurvivabilityScore: 88,
    });

    assert.equal(result.restorationClosurePreservationLevel, "collapse_sensitive_restoration_closure");
    assert.equal(result.collapseSensitiveRestorationClosureEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_RESTORATION_CLOSURE");
  });

  it("saturates simultaneous closure degradation deterministically", () => {
    const result = evaluate({
      restorationClosureFragmentationRiskScore: 100,
      restorationClosureDesynchronizationRiskScore: 100,
      recursiveRestorationClosureDriftRiskScore: 100,
      restorationClosureEntropyRecurrenceRiskScore: 100,
      restorationClosureSaturationRiskScore: 100,
      restorationClosureContainmentIntegrityScore: 0,
      restorationClosureSurvivabilityScore: 0,
      restorationStewardshipContinuityScore: 0,
      restorationClosureExplainabilityContinuityScore: 0,
      failClosedRestorationClosureScore: 80,
    });

    assert.equal(result.restorationClosureSeverityScore, 100);
    assert.equal(result.restorationClosureExposureLevel, "critical");
  });
});
