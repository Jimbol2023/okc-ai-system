import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernancePostRestorationStewardshipArchivalSurvivability,
  type CountyGovernancePostRestorationStewardshipArchivalSurvivabilityInput,
} from "./county-governance-post-restoration-stewardship-archival-survivability-intelligence";

const durableInput: CountyGovernancePostRestorationStewardshipArchivalSurvivabilityInput = {
  archivalContinuityDurabilityScore: 94,
  archivalSurvivabilityScore: 93,
  archivalContainmentPersistenceScore: 92,
  archivalExplainabilityContinuityScore: 91,
  failClosedArchivalScore: 94,
  archivalFragmentationRiskScore: 8,
  archivalDesynchronizationRiskScore: 8,
  recursiveArchivalDriftRiskScore: 8,
  archivalEntropyRecurrenceRiskScore: 8,
  archivalReevaluationPressureScore: 10,
  archivalSaturationRiskScore: 8,
  longHorizonArchivalViabilityScore: 90,
};

function evaluate(input: Partial<CountyGovernancePostRestorationStewardshipArchivalSurvivabilityInput>) {
  return evaluateCountyGovernancePostRestorationStewardshipArchivalSurvivability({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernancePostRestorationStewardshipArchivalSurvivability>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Post-Restoration Stewardship Archival Survivability Intelligence", () => {
  it("classifies durable archival survivability", () => {
    const result = evaluateCountyGovernancePostRestorationStewardshipArchivalSurvivability(durableInput);

    assert.equal(result.archivalSurvivabilityLevel, "durable_post_restoration_archival_survivability");
    assert.equal(result.archivalExposureLevel, "minimal");
    assert.equal(result.archivalReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonArchivalViability, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded archival survivability", () => {
    const result = evaluate({
      archivalContinuityDurabilityScore: 74,
      archivalSurvivabilityScore: 88,
      longHorizonArchivalViabilityScore: 88,
      archivalReevaluationPressureScore: 20,
    });

    assert.equal(result.archivalSurvivabilityLevel, "bounded_post_restoration_archival_survivability");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.archivalExposureLevel, "contained");
  });

  it("classifies continuation-required archival survivability", () => {
    const result = evaluate({
      archivalSurvivabilityScore: 66,
      archivalExplainabilityContinuityScore: 66,
      longHorizonArchivalViabilityScore: 66,
      archivalReevaluationPressureScore: 44,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveArchivalEscalation, false);
    assert.equal(result.warningCodes.includes("ARCHIVAL_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading archival survivability", () => {
    const result = evaluate({
      archivalSurvivabilityScore: 50,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_degrading");
    assert.equal(result.warningCodes.includes("ARCHIVAL_SURVIVABILITY_WEAKNESS"), true);
  });

  it("classifies unstable archival survivability", () => {
    const result = evaluate({
      archivalFragmentationRiskScore: 50,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_unstable");
    assert.equal(result.archivalFragmentationDetected, true);
  });

  it("keeps fail-closed archival precedence", () => {
    const result = evaluate({
      failClosedArchivalScore: 40,
      archivalContinuityDurabilityScore: 96,
      archivalSurvivabilityScore: 96,
    });

    assert.equal(result.archivalSurvivabilityLevel, "fail_closed_archival_degradation");
    assert.equal(result.failClosedArchivalDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_ARCHIVAL_DEGRADATION");
  });

  it("detects collapse-sensitive archival escalation", () => {
    const result = evaluate({
      archivalEntropyRecurrenceRiskScore: 94,
      failClosedArchivalScore: 60,
    });

    assert.equal(result.archivalSurvivabilityLevel, "collapse_sensitive_archival");
    assert.equal(result.collapseSensitiveArchivalEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_ARCHIVAL"), true);
  });

  it("detects archival fragmentation without forcing collapse", () => {
    const result = evaluate({
      archivalFragmentationRiskScore: 78,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_unstable");
    assert.equal(result.archivalFragmentationDetected, true);
    assert.equal(result.collapseSensitiveArchivalEscalation, false);
    assert.equal(result.warningCodes.includes("ARCHIVAL_FRAGMENTATION_RISK"), true);
  });

  it("detects archival desynchronization without forcing collapse", () => {
    const result = evaluate({
      archivalDesynchronizationRiskScore: 78,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_unstable");
    assert.equal(result.archivalDesynchronizationDetected, true);
    assert.equal(result.collapseSensitiveArchivalEscalation, false);
    assert.equal(result.warningCodes.includes("ARCHIVAL_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects recursive archival drift", () => {
    const result = evaluate({
      recursiveArchivalDriftRiskScore: 78,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_unstable");
    assert.equal(result.recursiveArchivalDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_ARCHIVAL_DRIFT");
  });

  it("detects archival entropy recurrence", () => {
    const result = evaluate({
      archivalEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_unstable");
    assert.equal(result.archivalEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("ARCHIVAL_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects containment persistence risk", () => {
    const result = evaluate({
      archivalContainmentPersistenceScore: 50,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_unstable");
    assert.equal(result.warningCodes.includes("ARCHIVAL_CONTAINMENT_PERSISTENCE_RISK"), true);
  });

  it("detects archival saturation risk", () => {
    const result = evaluate({
      archivalSaturationRiskScore: 78,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_unstable");
    assert.equal(result.archivalSaturationDetected, true);
    assert.equal(result.warningCodes.includes("ARCHIVAL_SATURATION_RISK"), true);
  });

  it("detects archival survivability weakness", () => {
    const result = evaluate({
      archivalSurvivabilityScore: 50,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_degrading");
    assert.equal(result.warningCodes.includes("ARCHIVAL_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects long-horizon archival viability weakness", () => {
    const result = evaluate({
      longHorizonArchivalViabilityScore: 50,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_degrading");
    assert.equal(result.warningCodes.includes("LONG_HORIZON_ARCHIVAL_VIABILITY_WEAKNESS"), true);
  });

  it("detects archival explainability continuity decay", () => {
    const result = evaluate({
      archivalExplainabilityContinuityScore: 50,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_degrading");
    assert.equal(result.warningCodes.includes("ARCHIVAL_EXPLAINABILITY_CONTINUITY_DECAY"), true);
  });

  it("detects archival continuity durability weakness", () => {
    const result = evaluate({
      archivalContinuityDurabilityScore: 50,
    });

    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_degrading");
    assert.equal(result.warningCodes.includes("ARCHIVAL_CONTINUITY_DURABILITY_WEAKNESS"), true);
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
      archivalSurvivabilityScore: 50,
      longHorizonArchivalViabilityScore: 50,
      archivalExplainabilityContinuityScore: 50,
      archivalReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "ARCHIVAL_DESYNCHRONIZATION_RISK",
      "ARCHIVAL_FRAGMENTATION_RISK",
      "ARCHIVAL_SURVIVABILITY_WEAKNESS",
      "LONG_HORIZON_ARCHIVAL_VIABILITY_WEAKNESS",
      "ARCHIVAL_EXPLAINABILITY_CONTINUITY_DECAY",
      "ARCHIVAL_REEVALUATION_REQUIRED",
    ]);
  });

  it("deduplicates warnings while preserving precedence", () => {
    const result = evaluate({
      archivalEntropyRecurrenceRiskScore: 94,
      archivalSaturationRiskScore: 94,
      failClosedArchivalScore: 60,
      archivalSurvivabilityScore: 88,
    });

    assert.equal(result.warningCodes.filter((warning) => warning === "COLLAPSE_SENSITIVE_ARCHIVAL").length, 1);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_ARCHIVAL");
  });

  it("keeps deterministic explainability ordering", () => {
    const result = evaluate({
      archivalSurvivabilityScore: 40,
      longHorizonArchivalViabilityScore: 40,
    });

    assert.equal(result.explainability.primaryArchivalDriver, "archival survivability weakness");
    assert.equal(result.explainability.dominantArchivalEscalationReason, result.warningCodes[0]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      archivalContinuityDurabilityScore: 74,
      archivalReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernancePostRestorationStewardshipArchivalSurvivabilityInput = {
      ...durableInput,
      archivalReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernancePostRestorationStewardshipArchivalSurvivability(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("normalizes non-finite values and keeps scores bounded to 0..100", () => {
    const result = evaluateCountyGovernancePostRestorationStewardshipArchivalSurvivability({
      archivalContinuityDurabilityScore: 150,
      archivalSurvivabilityScore: Number.NaN,
      archivalContainmentPersistenceScore: 120,
      archivalExplainabilityContinuityScore: 100,
      failClosedArchivalScore: 90,
      archivalFragmentationRiskScore: -10,
      archivalDesynchronizationRiskScore: -10,
      recursiveArchivalDriftRiskScore: -10,
      archivalEntropyRecurrenceRiskScore: 200,
      archivalReevaluationPressureScore: 500,
      archivalSaturationRiskScore: 200,
      longHorizonArchivalViabilityScore: 100,
    });

    assert.equal(result.archivalSeverityScore >= 0 && result.archivalSeverityScore <= 100, true);
    assert.equal(result.archivalExposureLevel, "critical");
    assert.equal(result.archivalReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      archivalExplainabilityContinuityScore: 50,
      longHorizonArchivalViabilityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps stewardship continuity distinct from archival survivability", () => {
    const result = evaluate({
      archivalContinuityDurabilityScore: 95,
      archivalSurvivabilityScore: 50,
    });

    assert.equal(result.warningCodes.includes("ARCHIVAL_SURVIVABILITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("ARCHIVAL_CONTINUITY_DURABILITY_WEAKNESS"), false);
  });

  it("keeps archival survivability distinct from irreversible preservation", () => {
    const result = evaluateCountyGovernancePostRestorationStewardshipArchivalSurvivability(durableInput);

    assert.equal(
      result.explainability.longHorizonArchivalAssessment.includes("irreversible preservation"),
      true,
    );
  });

  it("keeps archival containment persistence distinct from permanent containment", () => {
    const result = evaluate({
      archivalContainmentPersistenceScore: 50,
      archivalContinuityDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("ARCHIVAL_CONTAINMENT_PERSISTENCE_RISK"), true);
    assert.equal(result.warningCodes.includes("ARCHIVAL_CONTINUITY_DURABILITY_WEAKNESS"), false);
  });

  it("keeps archival explainability continuity distinct from survivability", () => {
    const result = evaluate({
      archivalExplainabilityContinuityScore: 50,
      archivalSurvivabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("ARCHIVAL_EXPLAINABILITY_CONTINUITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("ARCHIVAL_SURVIVABILITY_WEAKNESS"), false);
  });

  it("keeps archival continuity from implying permanent governance recovery", () => {
    const result = evaluateCountyGovernancePostRestorationStewardshipArchivalSurvivability(durableInput);

    assert.equal(
      result.explainability.longHorizonArchivalAssessment.includes("does not imply permanent governance recovery"),
      true,
    );
  });

  it("keeps continuation-required gated away from instability vectors", () => {
    const result = evaluate({
      archivalSurvivabilityScore: 66,
      archivalReevaluationPressureScore: 44,
      archivalFragmentationRiskScore: 45,
    });

    assert.equal(result.continuationRequired, false);
    assert.equal(result.archivalSurvivabilityLevel, "post_restoration_archival_unstable");
    assert.equal(result.warningCodes.includes("ARCHIVAL_CONTINUATION_REQUIRED"), false);
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveArchivalDriftRiskScore: 94,
      archivalEntropyRecurrenceRiskScore: 94,
      archivalDesynchronizationRiskScore: 94,
      archivalFragmentationRiskScore: 94,
      archivalSaturationRiskScore: 94,
      failClosedArchivalScore: 60,
      archivalSurvivabilityScore: 88,
    });

    assert.equal(result.archivalSurvivabilityLevel, "collapse_sensitive_archival");
    assert.equal(result.collapseSensitiveArchivalEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_ARCHIVAL");
  });

  it("saturates simultaneous archival degradation deterministically", () => {
    const result = evaluate({
      archivalFragmentationRiskScore: 100,
      archivalDesynchronizationRiskScore: 100,
      recursiveArchivalDriftRiskScore: 100,
      archivalEntropyRecurrenceRiskScore: 100,
      archivalSaturationRiskScore: 100,
      archivalContainmentPersistenceScore: 0,
      archivalSurvivabilityScore: 0,
      archivalExplainabilityContinuityScore: 0,
      longHorizonArchivalViabilityScore: 0,
      failClosedArchivalScore: 80,
    });

    assert.equal(result.archivalSeverityScore, 100);
    assert.equal(result.archivalExposureLevel, "critical");
  });
});
