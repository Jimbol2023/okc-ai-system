import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceStewardshipNormalizedOperationsTransitionReadiness,
  type CountyGovernanceStewardshipNormalizedOperationsTransitionReadinessInput,
} from "./county-governance-stewardship-normalized-operations-transition-readiness-intelligence";

const durableInput: CountyGovernanceStewardshipNormalizedOperationsTransitionReadinessInput = {
  transitionReadinessScore: 94,
  transitionSurvivabilityScore: 93,
  normalizedGovernanceContinuityReadinessScore: 92,
  transitionContainmentPersistenceScore: 92,
  transitionExplainabilityContinuityScore: 91,
  failClosedTransitionScore: 94,
  transitionFragmentationRiskScore: 8,
  transitionDesynchronizationRiskScore: 8,
  recursiveTransitionDriftRiskScore: 8,
  transitionEntropyRecurrenceRiskScore: 8,
  transitionReevaluationPressureScore: 10,
  transitionSaturationRiskScore: 8,
  longHorizonTransitionViabilityScore: 90,
};

function evaluate(input: Partial<CountyGovernanceStewardshipNormalizedOperationsTransitionReadinessInput>) {
  return evaluateCountyGovernanceStewardshipNormalizedOperationsTransitionReadiness({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceStewardshipNormalizedOperationsTransitionReadiness>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Stewardship Normalized Operations Transition Readiness Intelligence", () => {
  it("classifies ready-for-bounded-normalized-operations transition", () => {
    const result = evaluateCountyGovernanceStewardshipNormalizedOperationsTransitionReadiness(durableInput);

    assert.equal(result.transitionReadinessLevel, "ready_for_bounded_normalized_operations_transition");
    assert.equal(result.transitionExposureLevel, "minimal");
    assert.equal(result.transitionReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonTransitionViability, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded transition readiness", () => {
    const result = evaluate({
      transitionReadinessScore: 74,
      transitionSurvivabilityScore: 88,
      normalizedGovernanceContinuityReadinessScore: 88,
      longHorizonTransitionViabilityScore: 88,
      transitionReevaluationPressureScore: 20,
    });

    assert.equal(result.transitionReadinessLevel, "bounded_transition_readiness");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.transitionExposureLevel, "contained");
  });

  it("classifies continuation-required transition readiness", () => {
    const result = evaluate({
      transitionSurvivabilityScore: 66,
      transitionExplainabilityContinuityScore: 66,
      longHorizonTransitionViabilityScore: 66,
      transitionReevaluationPressureScore: 44,
    });

    assert.equal(result.transitionReadinessLevel, "transition_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveTransitionEscalation, false);
    assert.equal(result.warningCodes.includes("TRANSITION_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading transition readiness", () => {
    const result = evaluate({
      transitionSurvivabilityScore: 50,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_degrading");
    assert.equal(result.warningCodes.includes("TRANSITION_SURVIVABILITY_WEAKNESS"), true);
  });

  it("classifies unstable transition readiness", () => {
    const result = evaluate({
      transitionFragmentationRiskScore: 50,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_unstable");
    assert.equal(result.transitionFragmentationDetected, true);
  });

  it("keeps fail-closed transition precedence", () => {
    const result = evaluate({
      failClosedTransitionScore: 40,
      transitionReadinessScore: 96,
      transitionSurvivabilityScore: 96,
    });

    assert.equal(result.transitionReadinessLevel, "fail_closed_transition_degradation");
    assert.equal(result.failClosedTransitionDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_TRANSITION_DEGRADATION");
  });

  it("detects collapse-sensitive transition escalation", () => {
    const result = evaluate({
      transitionEntropyRecurrenceRiskScore: 94,
      failClosedTransitionScore: 60,
    });

    assert.equal(result.transitionReadinessLevel, "collapse_sensitive_transition");
    assert.equal(result.collapseSensitiveTransitionEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_TRANSITION"), true);
  });

  it("detects transition fragmentation without forcing collapse", () => {
    const result = evaluate({
      transitionFragmentationRiskScore: 78,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_unstable");
    assert.equal(result.transitionFragmentationDetected, true);
    assert.equal(result.collapseSensitiveTransitionEscalation, false);
    assert.equal(result.warningCodes.includes("TRANSITION_FRAGMENTATION_RISK"), true);
  });

  it("detects transition desynchronization without forcing collapse", () => {
    const result = evaluate({
      transitionDesynchronizationRiskScore: 78,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_unstable");
    assert.equal(result.transitionDesynchronizationDetected, true);
    assert.equal(result.collapseSensitiveTransitionEscalation, false);
    assert.equal(result.warningCodes.includes("TRANSITION_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects recursive transition drift", () => {
    const result = evaluate({
      recursiveTransitionDriftRiskScore: 78,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_unstable");
    assert.equal(result.recursiveTransitionDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_TRANSITION_DRIFT");
  });

  it("detects transition entropy recurrence", () => {
    const result = evaluate({
      transitionEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_unstable");
    assert.equal(result.transitionEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("TRANSITION_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects transition containment persistence risk", () => {
    const result = evaluate({
      transitionContainmentPersistenceScore: 50,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_unstable");
    assert.equal(result.warningCodes.includes("TRANSITION_CONTAINMENT_PERSISTENCE_RISK"), true);
  });

  it("detects transition saturation risk", () => {
    const result = evaluate({
      transitionSaturationRiskScore: 78,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_unstable");
    assert.equal(result.transitionSaturationDetected, true);
    assert.equal(result.warningCodes.includes("TRANSITION_SATURATION_RISK"), true);
  });

  it("detects transition survivability weakness", () => {
    const result = evaluate({
      transitionSurvivabilityScore: 50,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_degrading");
    assert.equal(result.warningCodes.includes("TRANSITION_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects long-horizon transition viability weakness", () => {
    const result = evaluate({
      longHorizonTransitionViabilityScore: 50,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_degrading");
    assert.equal(result.warningCodes.includes("LONG_HORIZON_TRANSITION_VIABILITY_WEAKNESS"), true);
  });

  it("detects transition explainability decay", () => {
    const result = evaluate({
      transitionExplainabilityContinuityScore: 50,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_degrading");
    assert.equal(result.warningCodes.includes("TRANSITION_EXPLAINABILITY_CONTINUITY_DECAY"), true);
  });

  it("detects normalized governance continuity readiness weakness", () => {
    const result = evaluate({
      normalizedGovernanceContinuityReadinessScore: 50,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_degrading");
    assert.equal(result.warningCodes.includes("NORMALIZED_GOVERNANCE_CONTINUITY_READINESS_WEAKNESS"), true);
  });

  it("detects transition readiness weakness", () => {
    const result = evaluate({
      transitionReadinessScore: 50,
    });

    assert.equal(result.transitionReadinessLevel, "transition_readiness_degrading");
    assert.equal(result.warningCodes.includes("TRANSITION_READINESS_WEAKNESS"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      transitionReevaluationPressureScore: 82,
    });

    assert.equal(result.transitionReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("TRANSITION_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      transitionDesynchronizationRiskScore: 78,
      transitionFragmentationRiskScore: 78,
      transitionSurvivabilityScore: 50,
      longHorizonTransitionViabilityScore: 50,
      transitionExplainabilityContinuityScore: 50,
      normalizedGovernanceContinuityReadinessScore: 50,
      transitionReadinessScore: 50,
      transitionReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "TRANSITION_DESYNCHRONIZATION_RISK",
      "TRANSITION_FRAGMENTATION_RISK",
      "TRANSITION_SURVIVABILITY_WEAKNESS",
      "LONG_HORIZON_TRANSITION_VIABILITY_WEAKNESS",
      "TRANSITION_EXPLAINABILITY_CONTINUITY_DECAY",
      "NORMALIZED_GOVERNANCE_CONTINUITY_READINESS_WEAKNESS",
      "TRANSITION_READINESS_WEAKNESS",
      "TRANSITION_REEVALUATION_REQUIRED",
    ]);
  });

  it("deduplicates warnings while preserving precedence", () => {
    const result = evaluate({
      transitionEntropyRecurrenceRiskScore: 94,
      transitionSaturationRiskScore: 94,
      failClosedTransitionScore: 60,
      transitionSurvivabilityScore: 88,
    });

    assert.equal(result.warningCodes.filter((warning) => warning === "COLLAPSE_SENSITIVE_TRANSITION").length, 1);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_TRANSITION");
  });

  it("keeps deterministic explainability ordering", () => {
    const result = evaluate({
      transitionSurvivabilityScore: 40,
      longHorizonTransitionViabilityScore: 40,
    });

    assert.equal(result.explainability.primaryTransitionDriver, "transition survivability weakness");
    assert.equal(result.explainability.dominantTransitionEscalationReason, result.warningCodes[0]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      transitionReadinessScore: 74,
      transitionReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceStewardshipNormalizedOperationsTransitionReadinessInput = {
      ...durableInput,
      transitionReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceStewardshipNormalizedOperationsTransitionReadiness(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("normalizes non-finite values and keeps scores bounded to 0..100", () => {
    const result = evaluateCountyGovernanceStewardshipNormalizedOperationsTransitionReadiness({
      transitionReadinessScore: 150,
      transitionSurvivabilityScore: Number.NaN,
      normalizedGovernanceContinuityReadinessScore: 120,
      transitionContainmentPersistenceScore: 120,
      transitionExplainabilityContinuityScore: 100,
      failClosedTransitionScore: 90,
      transitionFragmentationRiskScore: -10,
      transitionDesynchronizationRiskScore: -10,
      recursiveTransitionDriftRiskScore: -10,
      transitionEntropyRecurrenceRiskScore: 200,
      transitionReevaluationPressureScore: 500,
      transitionSaturationRiskScore: 200,
      longHorizonTransitionViabilityScore: 100,
    });

    assert.equal(result.transitionSeverityScore >= 0 && result.transitionSeverityScore <= 100, true);
    assert.equal(result.transitionExposureLevel, "critical");
    assert.equal(result.transitionReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      transitionExplainabilityContinuityScore: 50,
      longHorizonTransitionViabilityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps archival survivability distinct from normalized operations readiness", () => {
    const result = evaluate({
      transitionReadinessScore: 50,
      transitionSurvivabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("TRANSITION_READINESS_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("TRANSITION_SURVIVABILITY_WEAKNESS"), false);
  });

  it("keeps transition readiness distinct from permanent stabilization", () => {
    const result = evaluateCountyGovernanceStewardshipNormalizedOperationsTransitionReadiness(durableInput);

    assert.equal(result.explainability.longHorizonTransitionAssessment.includes("permanent stabilization"), true);
  });

  it("keeps normalized governance continuity readiness distinct from irreversible normalization", () => {
    const result = evaluate({
      normalizedGovernanceContinuityReadinessScore: 50,
      transitionReadinessScore: 95,
    });

    assert.equal(result.warningCodes.includes("NORMALIZED_GOVERNANCE_CONTINUITY_READINESS_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("TRANSITION_READINESS_WEAKNESS"), false);
  });

  it("keeps transition containment persistence distinct from permanent containment", () => {
    const result = evaluate({
      transitionContainmentPersistenceScore: 50,
      transitionReadinessScore: 95,
    });

    assert.equal(result.warningCodes.includes("TRANSITION_CONTAINMENT_PERSISTENCE_RISK"), true);
    assert.equal(result.warningCodes.includes("TRANSITION_READINESS_WEAKNESS"), false);
  });

  it("keeps transition explainability continuity distinct from survivability", () => {
    const result = evaluate({
      transitionExplainabilityContinuityScore: 50,
      transitionSurvivabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("TRANSITION_EXPLAINABILITY_CONTINUITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("TRANSITION_SURVIVABILITY_WEAKNESS"), false);
  });

  it("keeps transition readiness from implying permanent governance recovery", () => {
    const result = evaluateCountyGovernanceStewardshipNormalizedOperationsTransitionReadiness(durableInput);

    assert.equal(
      result.explainability.longHorizonTransitionAssessment.includes("does not imply permanent governance recovery"),
      true,
    );
  });

  it("keeps continuation-required gated away from instability vectors", () => {
    const result = evaluate({
      transitionSurvivabilityScore: 66,
      transitionReevaluationPressureScore: 44,
      transitionFragmentationRiskScore: 45,
    });

    assert.equal(result.continuationRequired, false);
    assert.equal(result.transitionReadinessLevel, "transition_readiness_unstable");
    assert.equal(result.warningCodes.includes("TRANSITION_CONTINUATION_REQUIRED"), false);
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveTransitionDriftRiskScore: 94,
      transitionEntropyRecurrenceRiskScore: 94,
      transitionDesynchronizationRiskScore: 94,
      transitionFragmentationRiskScore: 94,
      transitionSaturationRiskScore: 94,
      failClosedTransitionScore: 60,
      transitionSurvivabilityScore: 88,
    });

    assert.equal(result.transitionReadinessLevel, "collapse_sensitive_transition");
    assert.equal(result.collapseSensitiveTransitionEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_TRANSITION");
  });

  it("saturates simultaneous transition degradation deterministically", () => {
    const result = evaluate({
      transitionFragmentationRiskScore: 100,
      transitionDesynchronizationRiskScore: 100,
      recursiveTransitionDriftRiskScore: 100,
      transitionEntropyRecurrenceRiskScore: 100,
      transitionSaturationRiskScore: 100,
      transitionContainmentPersistenceScore: 0,
      transitionSurvivabilityScore: 0,
      transitionExplainabilityContinuityScore: 0,
      normalizedGovernanceContinuityReadinessScore: 0,
      longHorizonTransitionViabilityScore: 0,
      failClosedTransitionScore: 80,
    });

    assert.equal(result.transitionSeverityScore, 100);
    assert.equal(result.transitionExposureLevel, "critical");
  });
});
