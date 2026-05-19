import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceNormalizedOperationsBoundedActivationReadiness,
  type CountyGovernanceNormalizedOperationsBoundedActivationReadinessInput,
} from "./county-governance-normalized-operations-bounded-activation-readiness-intelligence";

const durableInput: CountyGovernanceNormalizedOperationsBoundedActivationReadinessInput = {
  activationReadinessScore: 94,
  activationSurvivabilityScore: 93,
  operationalContinuityReadinessScore: 92,
  activationContainmentPersistenceScore: 92,
  activationExplainabilityContinuityScore: 91,
  failClosedActivationScore: 94,
  activationFragmentationRiskScore: 8,
  activationDesynchronizationRiskScore: 8,
  recursiveActivationDriftRiskScore: 8,
  activationEntropyRecurrenceRiskScore: 8,
  activationReevaluationPressureScore: 10,
  activationSaturationRiskScore: 8,
  longHorizonActivationViabilityScore: 90,
};

function evaluate(input: Partial<CountyGovernanceNormalizedOperationsBoundedActivationReadinessInput>) {
  return evaluateCountyGovernanceNormalizedOperationsBoundedActivationReadiness({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceNormalizedOperationsBoundedActivationReadiness>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Normalized Operations Bounded Activation Readiness Intelligence", () => {
  it("classifies ready-for-bounded-activation", () => {
    const result = evaluateCountyGovernanceNormalizedOperationsBoundedActivationReadiness(durableInput);

    assert.equal(result.boundedActivationReadinessLevel, "ready_for_bounded_activation");
    assert.equal(result.activationExposureLevel, "minimal");
    assert.equal(result.activationReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonActivationViability, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded activation readiness", () => {
    const result = evaluate({
      activationReadinessScore: 74,
      activationSurvivabilityScore: 88,
      operationalContinuityReadinessScore: 88,
      longHorizonActivationViabilityScore: 88,
      activationReevaluationPressureScore: 20,
    });

    assert.equal(result.boundedActivationReadinessLevel, "bounded_activation_readiness");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.activationExposureLevel, "contained");
  });

  it("classifies continuation-required activation readiness", () => {
    const result = evaluate({
      activationSurvivabilityScore: 66,
      activationExplainabilityContinuityScore: 66,
      longHorizonActivationViabilityScore: 66,
      activationReevaluationPressureScore: 44,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveActivationEscalation, false);
    assert.equal(result.warningCodes.includes("ACTIVATION_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading activation readiness", () => {
    const result = evaluate({
      activationSurvivabilityScore: 50,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_degrading");
    assert.equal(result.warningCodes.includes("ACTIVATION_SURVIVABILITY_WEAKNESS"), true);
  });

  it("classifies unstable activation readiness", () => {
    const result = evaluate({
      activationFragmentationRiskScore: 50,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_unstable");
    assert.equal(result.activationFragmentationDetected, true);
  });

  it("keeps fail-closed activation precedence", () => {
    const result = evaluate({
      failClosedActivationScore: 40,
      activationReadinessScore: 96,
      activationSurvivabilityScore: 96,
    });

    assert.equal(result.boundedActivationReadinessLevel, "fail_closed_activation_degradation");
    assert.equal(result.failClosedActivationDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_ACTIVATION_DEGRADATION");
  });

  it("detects collapse-sensitive activation escalation", () => {
    const result = evaluate({
      activationEntropyRecurrenceRiskScore: 94,
      failClosedActivationScore: 60,
    });

    assert.equal(result.boundedActivationReadinessLevel, "collapse_sensitive_activation");
    assert.equal(result.collapseSensitiveActivationEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_ACTIVATION"), true);
  });

  it("detects activation fragmentation without forcing collapse", () => {
    const result = evaluate({
      activationFragmentationRiskScore: 78,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_unstable");
    assert.equal(result.activationFragmentationDetected, true);
    assert.equal(result.collapseSensitiveActivationEscalation, false);
    assert.equal(result.warningCodes.includes("ACTIVATION_FRAGMENTATION_RISK"), true);
  });

  it("detects activation desynchronization without forcing collapse", () => {
    const result = evaluate({
      activationDesynchronizationRiskScore: 78,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_unstable");
    assert.equal(result.activationDesynchronizationDetected, true);
    assert.equal(result.collapseSensitiveActivationEscalation, false);
    assert.equal(result.warningCodes.includes("ACTIVATION_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects recursive activation drift", () => {
    const result = evaluate({
      recursiveActivationDriftRiskScore: 78,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_unstable");
    assert.equal(result.recursiveActivationDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_ACTIVATION_DRIFT");
  });

  it("detects activation entropy recurrence", () => {
    const result = evaluate({
      activationEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_unstable");
    assert.equal(result.activationEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("ACTIVATION_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects activation containment persistence risk", () => {
    const result = evaluate({
      activationContainmentPersistenceScore: 50,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_unstable");
    assert.equal(result.warningCodes.includes("ACTIVATION_CONTAINMENT_PERSISTENCE_RISK"), true);
  });

  it("detects activation saturation risk", () => {
    const result = evaluate({
      activationSaturationRiskScore: 78,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_unstable");
    assert.equal(result.activationSaturationDetected, true);
    assert.equal(result.warningCodes.includes("ACTIVATION_SATURATION_RISK"), true);
  });

  it("detects activation survivability weakness", () => {
    const result = evaluate({
      activationSurvivabilityScore: 50,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_degrading");
    assert.equal(result.warningCodes.includes("ACTIVATION_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects long-horizon activation viability weakness", () => {
    const result = evaluate({
      longHorizonActivationViabilityScore: 50,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_degrading");
    assert.equal(result.warningCodes.includes("LONG_HORIZON_ACTIVATION_VIABILITY_WEAKNESS"), true);
  });

  it("detects activation explainability decay", () => {
    const result = evaluate({
      activationExplainabilityContinuityScore: 50,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_degrading");
    assert.equal(result.warningCodes.includes("ACTIVATION_EXPLAINABILITY_CONTINUITY_DECAY"), true);
  });

  it("detects operational continuity readiness weakness", () => {
    const result = evaluate({
      operationalContinuityReadinessScore: 50,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_degrading");
    assert.equal(result.warningCodes.includes("OPERATIONAL_CONTINUITY_READINESS_WEAKNESS"), true);
  });

  it("detects activation readiness weakness", () => {
    const result = evaluate({
      activationReadinessScore: 50,
    });

    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_degrading");
    assert.equal(result.warningCodes.includes("ACTIVATION_READINESS_WEAKNESS"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      activationReevaluationPressureScore: 82,
    });

    assert.equal(result.activationReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("ACTIVATION_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      activationDesynchronizationRiskScore: 78,
      activationFragmentationRiskScore: 78,
      activationSurvivabilityScore: 50,
      longHorizonActivationViabilityScore: 50,
      activationExplainabilityContinuityScore: 50,
      operationalContinuityReadinessScore: 50,
      activationReadinessScore: 50,
      activationReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "ACTIVATION_DESYNCHRONIZATION_RISK",
      "ACTIVATION_FRAGMENTATION_RISK",
      "ACTIVATION_SURVIVABILITY_WEAKNESS",
      "LONG_HORIZON_ACTIVATION_VIABILITY_WEAKNESS",
      "ACTIVATION_EXPLAINABILITY_CONTINUITY_DECAY",
      "OPERATIONAL_CONTINUITY_READINESS_WEAKNESS",
      "ACTIVATION_READINESS_WEAKNESS",
      "ACTIVATION_REEVALUATION_REQUIRED",
    ]);
  });

  it("deduplicates warnings while preserving precedence", () => {
    const result = evaluate({
      activationEntropyRecurrenceRiskScore: 94,
      activationSaturationRiskScore: 94,
      failClosedActivationScore: 60,
      activationSurvivabilityScore: 88,
    });

    assert.equal(result.warningCodes.filter((warning) => warning === "COLLAPSE_SENSITIVE_ACTIVATION").length, 1);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_ACTIVATION");
  });

  it("keeps deterministic explainability ordering", () => {
    const result = evaluate({
      activationSurvivabilityScore: 40,
      longHorizonActivationViabilityScore: 40,
    });

    assert.equal(result.explainability.primaryActivationDriver, "activation survivability weakness");
    assert.equal(result.explainability.dominantActivationEscalationReason, result.warningCodes[0]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      activationReadinessScore: 74,
      activationReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceNormalizedOperationsBoundedActivationReadinessInput = {
      ...durableInput,
      activationReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceNormalizedOperationsBoundedActivationReadiness(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("normalizes non-finite values and keeps scores bounded to 0..100", () => {
    const result = evaluateCountyGovernanceNormalizedOperationsBoundedActivationReadiness({
      activationReadinessScore: 150,
      activationSurvivabilityScore: Number.NaN,
      operationalContinuityReadinessScore: 120,
      activationContainmentPersistenceScore: 120,
      activationExplainabilityContinuityScore: 100,
      failClosedActivationScore: 90,
      activationFragmentationRiskScore: -10,
      activationDesynchronizationRiskScore: -10,
      recursiveActivationDriftRiskScore: -10,
      activationEntropyRecurrenceRiskScore: 200,
      activationReevaluationPressureScore: 500,
      activationSaturationRiskScore: 200,
      longHorizonActivationViabilityScore: 100,
    });

    assert.equal(result.activationSeverityScore >= 0 && result.activationSeverityScore <= 100, true);
    assert.equal(result.activationExposureLevel, "critical");
    assert.equal(result.activationReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      activationExplainabilityContinuityScore: 50,
      longHorizonActivationViabilityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps transition readiness distinct from bounded activation readiness", () => {
    const result = evaluate({
      activationReadinessScore: 50,
      activationSurvivabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("ACTIVATION_READINESS_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("ACTIVATION_SURVIVABILITY_WEAKNESS"), false);
  });

  it("keeps activation readiness distinct from permanent activation", () => {
    const result = evaluateCountyGovernanceNormalizedOperationsBoundedActivationReadiness(durableInput);

    assert.equal(result.explainability.longHorizonActivationAssessment.includes("permanent activation"), true);
  });

  it("keeps operational continuity readiness distinct from irreversible normalization", () => {
    const result = evaluate({
      operationalContinuityReadinessScore: 50,
      activationReadinessScore: 95,
    });

    assert.equal(result.warningCodes.includes("OPERATIONAL_CONTINUITY_READINESS_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("ACTIVATION_READINESS_WEAKNESS"), false);
  });

  it("keeps activation containment persistence distinct from permanent containment", () => {
    const result = evaluate({
      activationContainmentPersistenceScore: 50,
      activationReadinessScore: 95,
    });

    assert.equal(result.warningCodes.includes("ACTIVATION_CONTAINMENT_PERSISTENCE_RISK"), true);
    assert.equal(result.warningCodes.includes("ACTIVATION_READINESS_WEAKNESS"), false);
  });

  it("keeps activation explainability continuity distinct from survivability", () => {
    const result = evaluate({
      activationExplainabilityContinuityScore: 50,
      activationSurvivabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("ACTIVATION_EXPLAINABILITY_CONTINUITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("ACTIVATION_SURVIVABILITY_WEAKNESS"), false);
  });

  it("keeps activation readiness from implying permanent governance recovery", () => {
    const result = evaluateCountyGovernanceNormalizedOperationsBoundedActivationReadiness(durableInput);

    assert.equal(
      result.explainability.longHorizonActivationAssessment.includes("does not imply permanent governance recovery"),
      true,
    );
  });

  it("keeps continuation-required gated away from instability vectors", () => {
    const result = evaluate({
      activationSurvivabilityScore: 66,
      activationReevaluationPressureScore: 44,
      activationFragmentationRiskScore: 45,
    });

    assert.equal(result.continuationRequired, false);
    assert.equal(result.boundedActivationReadinessLevel, "activation_readiness_unstable");
    assert.equal(result.warningCodes.includes("ACTIVATION_CONTINUATION_REQUIRED"), false);
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveActivationDriftRiskScore: 94,
      activationEntropyRecurrenceRiskScore: 94,
      activationDesynchronizationRiskScore: 94,
      activationFragmentationRiskScore: 94,
      activationSaturationRiskScore: 94,
      failClosedActivationScore: 60,
      activationSurvivabilityScore: 88,
    });

    assert.equal(result.boundedActivationReadinessLevel, "collapse_sensitive_activation");
    assert.equal(result.collapseSensitiveActivationEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_ACTIVATION");
  });

  it("saturates simultaneous activation degradation deterministically", () => {
    const result = evaluate({
      activationFragmentationRiskScore: 100,
      activationDesynchronizationRiskScore: 100,
      recursiveActivationDriftRiskScore: 100,
      activationEntropyRecurrenceRiskScore: 100,
      activationSaturationRiskScore: 100,
      activationContainmentPersistenceScore: 0,
      activationSurvivabilityScore: 0,
      activationExplainabilityContinuityScore: 0,
      operationalContinuityReadinessScore: 0,
      longHorizonActivationViabilityScore: 0,
      failClosedActivationScore: 80,
    });

    assert.equal(result.activationSeverityScore, 100);
    assert.equal(result.activationExposureLevel, "critical");
  });
});
