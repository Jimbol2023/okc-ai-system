import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceEntropyDoctrineContinuityRestorationIntelligence,
  type CountyGovernanceEntropyDoctrineContinuityRestorationIntelligenceInput,
} from "./county-governance-entropy-doctrine-continuity-restoration-intelligence";

const baseInput: CountyGovernanceEntropyDoctrineContinuityRestorationIntelligenceInput = {
  restorationContinuityScore: 88,
  restorationDurabilityScore: 88,
  restorationSustainabilityScore: 88,
  restorationExplainabilityScore: 86,
  restorationDependencyConcentrationScore: 10,
  restorationCollapseExposureScore: 10,
  restorationConflictPressureScore: 10,
  restorationSurvivabilityScore: 88,
  stewardshipContinuityScore: 85,
  institutionalMemoryContinuityScore: 85,
  successionResilienceScore: 85,
  repeatedDisruptionExposureScore: 10,
  boundedReevaluationRequired: false,
  unresolvedDoctrineConflictPresent: false,
  restorationDependencyRecursive: false,
  restorationIntegrityDegrading: false,
  operationalRestorationSustainable: true,
  continuationModeRequired: false,
  restorationConditionsStable: true,
  restorationEvidenceVerified: true,
};

function evaluate(input: Partial<CountyGovernanceEntropyDoctrineContinuityRestorationIntelligenceInput>) {
  return evaluateCountyGovernanceEntropyDoctrineContinuityRestorationIntelligence({
    ...baseInput,
    ...input,
  });
}

function assertFailClosedFlags(
  result: ReturnType<typeof evaluateCountyGovernanceEntropyDoctrineContinuityRestorationIntelligence>,
): void {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Entropy Doctrine Continuity Restoration Intelligence", () => {
  it("classifies durable restoration path", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineContinuityRestorationIntelligence(baseInput);

    assert.equal(result.restorationClassification, "durable_continuity_restoration");
    assert.equal(result.restorationSafetyStatus, "safe");
    assert.equal(result.restorationSustainabilityStatus, "sustainable");
    assertFailClosedFlags(result);
  });

  it("classifies conditional restoration path", () => {
    const result = evaluate({
      restorationContinuityScore: 72,
      restorationDurabilityScore: 68,
      restorationSustainabilityScore: 70,
      restorationSurvivabilityScore: 70,
      restorationExplainabilityScore: 70,
      restorationDependencyConcentrationScore: 20,
      repeatedDisruptionExposureScore: 20,
    });

    assert.equal(result.restorationClassification, "conditional_continuity_restoration");
  });

  it("detects superficial restoration", () => {
    const result = evaluate({
      restorationContinuityScore: 82,
      restorationDurabilityScore: 74,
      restorationSustainabilityScore: 86,
      restorationSurvivabilityScore: 86,
      restorationExplainabilityScore: 86,
    });

    assert.equal(result.restorationClassification, "superficial_continuity_restoration");
    assert.equal(result.restorationWarnings.includes("S33_SUPERFICIAL_RESTORATION"), true);
  });

  it("detects restoration blocked", () => {
    const result = evaluate({
      restorationIntegrityDegrading: true,
    });

    assert.equal(result.restorationClassification, "continuity_restoration_blocked");
    assert.equal(result.restorationBlocked, true);
    assert.equal(result.restorationWarnings.includes("S33_RESTORATION_BLOCKED"), true);
  });

  it("classifies unsafe restoration", () => {
    const result = evaluate({
      restorationConditionsStable: false,
    });

    assert.equal(result.restorationClassification, "continuity_restoration_unsafe");
    assert.equal(result.restorationUnsafe, true);
    assert.equal(result.restorationWarnings.includes("S33_RESTORATION_UNSAFE"), true);
  });

  it("uses recursive dependency conflict override", () => {
    const result = evaluate({
      restorationDependencyRecursive: true,
      restorationIntegrityDegrading: false,
    });

    assert.equal(result.restorationClassification, "continuity_restoration_blocked");
    assert.equal(result.recursiveRestorationDependencyConflict, true);
    assert.equal(result.restorationWarnings.includes("S33_RECURSIVE_RESTORATION_DEPENDENCY"), true);
  });

  it("uses fail-closed degradation override", () => {
    const result = evaluate({
      restorationIntegrityDegrading: true,
    });

    assert.equal(result.failClosedRestorationIntegrityWeakness, true);
    assert.equal(result.restorationWarnings.includes("S33_FAIL_CLOSED_RESTORATION_DEGRADATION"), true);
  });

  it("classifies bounded reevaluation", () => {
    const result = evaluate({
      boundedReevaluationRequired: true,
    });

    assert.equal(result.restorationClassification, "bounded_restoration_reevaluation_required");
    assert.equal(result.boundedReevaluationRequired, true);
    assert.equal(result.restorationWarnings.includes("S33_BOUNDED_REEVALUATION_REQUIRED"), true);
  });

  it("classifies continuation required", () => {
    const result = evaluate({
      continuationModeRequired: true,
      boundedReevaluationRequired: false,
      restorationDependencyConcentrationScore: 10,
      repeatedDisruptionExposureScore: 10,
    });

    assert.equal(result.restorationClassification, "continuity_restoration_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.restorationWarnings.includes("S33_RESTORATION_CONTINUATION_REQUIRED"), true);
  });

  it("detects unresolved doctrine conflict", () => {
    const result = evaluate({
      unresolvedDoctrineConflictPresent: true,
    });

    assert.equal(result.restorationClassification, "continuity_restoration_blocked");
    assert.equal(result.restorationWarnings.includes("S33_UNRESOLVED_RESTORATION_CONFLICT"), true);
  });

  it("gives collapse-sensitive rejection precedence", () => {
    const result = evaluate({
      restorationCollapseExposureScore: 90,
      restorationConditionsStable: false,
      restorationIntegrityDegrading: true,
    });

    assert.equal(result.restorationClassification, "collapse_sensitive_restoration_rejection");
    assert.equal(result.collapseSensitiveRestorationRejected, true);
    assert.equal(result.restorationWarnings.includes("S33_COLLAPSE_SENSITIVE_RESTORATION_REJECTION"), true);
  });

  it("detects operational unsustainability", () => {
    const result = evaluate({
      operationalRestorationSustainable: false,
    });

    assert.equal(result.restorationClassification, "continuity_restoration_blocked");
    assert.equal(result.operationalRestorationUnsustainable, true);
    assert.equal(result.restorationWarnings.includes("S33_OPERATIONAL_RESTORATION_UNSUSTAINABLE"), true);
  });

  it("detects survivability weakness", () => {
    const result = evaluate({
      restorationSurvivabilityScore: 55,
      stewardshipContinuityScore: 85,
      institutionalMemoryContinuityScore: 85,
      successionResilienceScore: 85,
      boundedReevaluationRequired: false,
    });

    assert.equal(result.restorationClassification, "continuity_restoration_survivability_weakness");
    assert.equal(result.restorationWarnings.includes("S33_RESTORATION_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects explainability weakness", () => {
    const result = evaluate({
      restorationContinuityScore: 65,
      restorationExplainabilityScore: 50,
      restorationDependencyConcentrationScore: 10,
      repeatedDisruptionExposureScore: 10,
    });

    assert.equal(result.restorationClassification, "continuity_restoration_explainability_weakness");
    assert.equal(result.restorationWarnings.includes("S33_RESTORATION_EXPLAINABILITY_WEAKNESS"), true);
  });

  it("keeps deterministic warning-code behavior", () => {
    const result = evaluate({
      restorationDependencyConcentrationScore: 55,
      restorationCollapseExposureScore: 55,
      restorationExplainabilityScore: 50,
      restorationSurvivabilityScore: 55,
    });

    assert.deepEqual(result.restorationWarnings, [
      "S33_BOUNDED_REEVALUATION_REQUIRED",
      "S33_RESTORATION_ENTROPY_BURDEN",
      "S33_RESTORATION_EXPLAINABILITY_WEAKNESS",
      "S33_RESTORATION_SURVIVABILITY_WEAKNESS",
      "S33_RESTORATION_DEPENDENCY_CONCENTRATION",
      "S33_RESTORATION_COLLAPSE_EXPOSURE",
    ]);
  });

  it("preserves deterministic precedence ordering", () => {
    const result = evaluate({
      restorationCollapseExposureScore: 85,
      restorationIntegrityDegrading: true,
      restorationDependencyRecursive: true,
      unresolvedDoctrineConflictPresent: true,
    });

    assert.equal(result.restorationClassification, "collapse_sensitive_restoration_rejection");
  });

  it("preserves fail-closed flags", () => {
    const result = evaluate({
      restorationCollapseExposureScore: 90,
    });

    assertFailClosedFlags(result);
  });

  it("is deterministic for repeated identical input", () => {
    const input = {
      restorationContinuityScore: 72,
      restorationDependencyConcentrationScore: 55,
      repeatedDisruptionExposureScore: 20,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not expose runtime-provider behavior", () => {
    const result = evaluate({});

    assert.equal(result.explainability.deterministicRulesApplied.some((rule) => rule.includes("No runtime")), true);
    assert.equal(result.explainability.deterministicRulesApplied.some((rule) => rule.includes("clock")), true);
  });
});
