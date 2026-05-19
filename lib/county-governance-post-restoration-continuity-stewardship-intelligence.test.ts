import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernancePostRestorationContinuityStewardship,
  type CountyGovernancePostRestorationContinuityStewardshipInput,
} from "./county-governance-post-restoration-continuity-stewardship-intelligence";

const durableInput: CountyGovernancePostRestorationContinuityStewardshipInput = {
  stewardshipContinuityDurabilityScore: 94,
  stewardshipSurvivabilityScore: 93,
  stewardshipContainmentPersistenceScore: 92,
  stewardshipExplainabilityContinuityScore: 91,
  failClosedStewardshipScore: 94,
  stewardshipFragmentationRiskScore: 8,
  stewardshipDesynchronizationRiskScore: 8,
  recursiveStewardshipDriftRiskScore: 8,
  stewardshipEntropyRecurrenceRiskScore: 8,
  stewardshipReevaluationPressureScore: 10,
  stewardshipSaturationRiskScore: 8,
  longHorizonStewardshipViabilityScore: 90,
};

function evaluate(input: Partial<CountyGovernancePostRestorationContinuityStewardshipInput>) {
  return evaluateCountyGovernancePostRestorationContinuityStewardship({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernancePostRestorationContinuityStewardship>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Post-Restoration Continuity Stewardship Intelligence", () => {
  it("classifies durable stewardship", () => {
    const result = evaluateCountyGovernancePostRestorationContinuityStewardship(durableInput);

    assert.equal(result.stewardshipContinuityLevel, "durable_post_restoration_stewardship");
    assert.equal(result.stewardshipExposureLevel, "minimal");
    assert.equal(result.stewardshipReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonStewardshipViability, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded stewardship", () => {
    const result = evaluate({
      stewardshipContinuityDurabilityScore: 74,
      stewardshipSurvivabilityScore: 88,
      longHorizonStewardshipViabilityScore: 88,
      stewardshipReevaluationPressureScore: 20,
    });

    assert.equal(result.stewardshipContinuityLevel, "bounded_post_restoration_stewardship");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.stewardshipExposureLevel, "contained");
  });

  it("classifies continuation-required stewardship", () => {
    const result = evaluate({
      stewardshipSurvivabilityScore: 66,
      stewardshipExplainabilityContinuityScore: 66,
      longHorizonStewardshipViabilityScore: 66,
      stewardshipReevaluationPressureScore: 44,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveStewardshipEscalation, false);
    assert.equal(result.warningCodes.includes("STEWARDSHIP_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading stewardship", () => {
    const result = evaluate({
      stewardshipSurvivabilityScore: 50,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_degrading");
    assert.equal(result.warningCodes.includes("STEWARDSHIP_SURVIVABILITY_WEAKNESS"), true);
  });

  it("classifies unstable stewardship", () => {
    const result = evaluate({
      stewardshipFragmentationRiskScore: 50,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_unstable");
    assert.equal(result.stewardshipFragmentationDetected, true);
  });

  it("keeps fail-closed stewardship precedence", () => {
    const result = evaluate({
      failClosedStewardshipScore: 40,
      stewardshipContinuityDurabilityScore: 96,
      stewardshipSurvivabilityScore: 96,
    });

    assert.equal(result.stewardshipContinuityLevel, "fail_closed_stewardship_degradation");
    assert.equal(result.failClosedStewardshipDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_STEWARDSHIP_DEGRADATION");
  });

  it("detects collapse-sensitive stewardship escalation", () => {
    const result = evaluate({
      stewardshipEntropyRecurrenceRiskScore: 94,
      failClosedStewardshipScore: 60,
    });

    assert.equal(result.stewardshipContinuityLevel, "collapse_sensitive_stewardship");
    assert.equal(result.collapseSensitiveStewardshipEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_STEWARDSHIP"), true);
  });

  it("detects stewardship fragmentation", () => {
    const result = evaluate({
      stewardshipFragmentationRiskScore: 78,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_unstable");
    assert.equal(result.stewardshipFragmentationDetected, true);
    assert.equal(result.collapseSensitiveStewardshipEscalation, false);
    assert.equal(result.warningCodes.includes("STEWARDSHIP_FRAGMENTATION_RISK"), true);
  });

  it("detects stewardship desynchronization", () => {
    const result = evaluate({
      stewardshipDesynchronizationRiskScore: 78,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_unstable");
    assert.equal(result.stewardshipDesynchronizationDetected, true);
    assert.equal(result.warningCodes.includes("STEWARDSHIP_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects recursive stewardship drift", () => {
    const result = evaluate({
      recursiveStewardshipDriftRiskScore: 78,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_unstable");
    assert.equal(result.recursiveStewardshipDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_STEWARDSHIP_DRIFT");
  });

  it("detects stewardship entropy recurrence", () => {
    const result = evaluate({
      stewardshipEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_unstable");
    assert.equal(result.stewardshipEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("STEWARDSHIP_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects containment persistence risk", () => {
    const result = evaluate({
      stewardshipContainmentPersistenceScore: 50,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_unstable");
    assert.equal(result.warningCodes.includes("STEWARDSHIP_CONTAINMENT_PERSISTENCE_RISK"), true);
  });

  it("detects saturation risk", () => {
    const result = evaluate({
      stewardshipSaturationRiskScore: 78,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_unstable");
    assert.equal(result.stewardshipSaturationDetected, true);
    assert.equal(result.warningCodes.includes("STEWARDSHIP_SATURATION_RISK"), true);
  });

  it("detects stewardship survivability weakness", () => {
    const result = evaluate({
      stewardshipSurvivabilityScore: 50,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_degrading");
    assert.equal(result.warningCodes.includes("STEWARDSHIP_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects long-horizon viability weakness", () => {
    const result = evaluate({
      longHorizonStewardshipViabilityScore: 50,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_degrading");
    assert.equal(result.warningCodes.includes("LONG_HORIZON_STEWARDSHIP_VIABILITY_WEAKNESS"), true);
  });

  it("detects stewardship explainability decay", () => {
    const result = evaluate({
      stewardshipExplainabilityContinuityScore: 50,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_degrading");
    assert.equal(result.warningCodes.includes("STEWARDSHIP_EXPLAINABILITY_CONTINUITY_DECAY"), true);
  });

  it("detects stewardship continuity durability weakness", () => {
    const result = evaluate({
      stewardshipContinuityDurabilityScore: 50,
    });

    assert.equal(result.stewardshipContinuityLevel, "post_restoration_stewardship_degrading");
    assert.equal(result.warningCodes.includes("STEWARDSHIP_CONTINUITY_DURABILITY_WEAKNESS"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      stewardshipReevaluationPressureScore: 82,
    });

    assert.equal(result.stewardshipReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("STEWARDSHIP_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      stewardshipDesynchronizationRiskScore: 78,
      stewardshipFragmentationRiskScore: 78,
      stewardshipSurvivabilityScore: 50,
      longHorizonStewardshipViabilityScore: 50,
      stewardshipExplainabilityContinuityScore: 50,
      stewardshipReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "STEWARDSHIP_DESYNCHRONIZATION_RISK",
      "STEWARDSHIP_FRAGMENTATION_RISK",
      "STEWARDSHIP_SURVIVABILITY_WEAKNESS",
      "LONG_HORIZON_STEWARDSHIP_VIABILITY_WEAKNESS",
      "STEWARDSHIP_EXPLAINABILITY_CONTINUITY_DECAY",
      "STEWARDSHIP_REEVALUATION_REQUIRED",
    ]);
  });

  it("deduplicates warnings while preserving precedence", () => {
    const result = evaluate({
      stewardshipEntropyRecurrenceRiskScore: 94,
      stewardshipSaturationRiskScore: 94,
      failClosedStewardshipScore: 60,
      stewardshipSurvivabilityScore: 88,
    });

    assert.equal(result.warningCodes.filter((warning) => warning === "COLLAPSE_SENSITIVE_STEWARDSHIP").length, 1);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_STEWARDSHIP");
  });

  it("keeps deterministic explainability ordering", () => {
    const result = evaluate({
      stewardshipSurvivabilityScore: 40,
      longHorizonStewardshipViabilityScore: 40,
    });

    assert.equal(result.explainability.primaryStewardshipDriver, "stewardship survivability weakness");
    assert.equal(result.explainability.dominantStewardshipEscalationReason, result.warningCodes[0]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      stewardshipContinuityDurabilityScore: 74,
      stewardshipReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernancePostRestorationContinuityStewardshipInput = {
      ...durableInput,
      stewardshipReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernancePostRestorationContinuityStewardship(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("normalizes non-finite values and keeps scores bounded to 0..100", () => {
    const result = evaluateCountyGovernancePostRestorationContinuityStewardship({
      stewardshipContinuityDurabilityScore: 150,
      stewardshipSurvivabilityScore: Number.NaN,
      stewardshipContainmentPersistenceScore: 120,
      stewardshipExplainabilityContinuityScore: 100,
      failClosedStewardshipScore: 90,
      stewardshipFragmentationRiskScore: -10,
      stewardshipDesynchronizationRiskScore: -10,
      recursiveStewardshipDriftRiskScore: -10,
      stewardshipEntropyRecurrenceRiskScore: 200,
      stewardshipReevaluationPressureScore: 500,
      stewardshipSaturationRiskScore: 200,
      longHorizonStewardshipViabilityScore: 100,
    });

    assert.equal(result.stewardshipSeverityScore >= 0 && result.stewardshipSeverityScore <= 100, true);
    assert.equal(result.stewardshipExposureLevel, "critical");
    assert.equal(result.stewardshipReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      stewardshipExplainabilityContinuityScore: 50,
      longHorizonStewardshipViabilityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps closure preservation distinct from stewardship continuity", () => {
    const result = evaluate({
      stewardshipContinuityDurabilityScore: 50,
      stewardshipSurvivabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("STEWARDSHIP_CONTINUITY_DURABILITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("STEWARDSHIP_SURVIVABILITY_WEAKNESS"), false);
  });

  it("keeps stewardship survivability distinct from irreversible stabilization", () => {
    const result = evaluate({
      stewardshipSurvivabilityScore: 50,
      stewardshipContinuityDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("STEWARDSHIP_SURVIVABILITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("STEWARDSHIP_CONTINUITY_DURABILITY_WEAKNESS"), false);
  });

  it("keeps containment persistence distinct from permanent containment", () => {
    const result = evaluate({
      stewardshipContainmentPersistenceScore: 50,
      stewardshipContinuityDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("STEWARDSHIP_CONTAINMENT_PERSISTENCE_RISK"), true);
    assert.equal(result.warningCodes.includes("STEWARDSHIP_CONTINUITY_DURABILITY_WEAKNESS"), false);
  });

  it("keeps stewardship explainability distinct from survivability", () => {
    const result = evaluate({
      stewardshipExplainabilityContinuityScore: 50,
      stewardshipSurvivabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("STEWARDSHIP_EXPLAINABILITY_CONTINUITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("STEWARDSHIP_SURVIVABILITY_WEAKNESS"), false);
  });

  it("keeps stewardship continuity from implying permanent governance recovery", () => {
    const result = evaluateCountyGovernancePostRestorationContinuityStewardship(durableInput);

    assert.equal(
      result.explainability.longHorizonStewardshipAssessment.includes(
        "does not imply permanent governance recovery",
      ),
      true,
    );
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveStewardshipDriftRiskScore: 94,
      stewardshipEntropyRecurrenceRiskScore: 94,
      stewardshipDesynchronizationRiskScore: 94,
      stewardshipFragmentationRiskScore: 94,
      stewardshipSaturationRiskScore: 94,
      failClosedStewardshipScore: 60,
      stewardshipSurvivabilityScore: 88,
    });

    assert.equal(result.stewardshipContinuityLevel, "collapse_sensitive_stewardship");
    assert.equal(result.collapseSensitiveStewardshipEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_STEWARDSHIP");
  });

  it("saturates simultaneous stewardship degradation deterministically", () => {
    const result = evaluate({
      stewardshipFragmentationRiskScore: 100,
      stewardshipDesynchronizationRiskScore: 100,
      recursiveStewardshipDriftRiskScore: 100,
      stewardshipEntropyRecurrenceRiskScore: 100,
      stewardshipSaturationRiskScore: 100,
      stewardshipContainmentPersistenceScore: 0,
      stewardshipSurvivabilityScore: 0,
      stewardshipExplainabilityContinuityScore: 0,
      longHorizonStewardshipViabilityScore: 0,
      failClosedStewardshipScore: 80,
    });

    assert.equal(result.stewardshipSeverityScore, 100);
    assert.equal(result.stewardshipExposureLevel, "critical");
  });
});
