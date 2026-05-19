import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceRecoverySustainabilityContinuitySurvivability,
  type CountyGovernanceRecoverySustainabilityContinuitySurvivabilityInput,
} from "./county-governance-recovery-sustainability-continuity-survivability-intelligence";

const durableInput: CountyGovernanceRecoverySustainabilityContinuitySurvivabilityInput = {
  sustainabilityContinuitySurvivabilityIntegrityScore: 94,
  longHorizonSurvivabilityDurabilityScore: 93,
  failClosedSurvivabilityPreservationScore: 94,
  continuityFatigueRiskScore: 8,
  recursiveSurvivabilityDegradationRiskScore: 8,
  institutionalSurvivabilityDurabilityScore: 92,
  containmentSurvivabilityStabilityScore: 91,
  doctrineSurvivabilityStabilityScore: 91,
  lineageSurvivabilityPreservationScore: 91,
  entropySurvivabilityAccelerationScore: 8,
  explainabilitySurvivabilityDurabilityScore: 90,
  survivabilityReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceRecoverySustainabilityContinuitySurvivabilityInput>) {
  return evaluateCountyGovernanceRecoverySustainabilityContinuitySurvivability({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceRecoverySustainabilityContinuitySurvivability>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Recovery Sustainability Continuity Survivability Intelligence", () => {
  it("classifies durable survivability", () => {
    const result = evaluateCountyGovernanceRecoverySustainabilityContinuitySurvivability(durableInput);

    assert.equal(result.survivabilityIntegrityLevel, "durable_sustainability_continuity_survivability");
    assert.equal(result.survivabilityExposureLevel, "minimal");
    assert.equal(result.survivabilityReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonSurvivability, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded survivability", () => {
    const result = evaluate({
      sustainabilityContinuitySurvivabilityIntegrityScore: 74,
      longHorizonSurvivabilityDurabilityScore: 88,
      doctrineSurvivabilityStabilityScore: 88,
      survivabilityReevaluationPressureScore: 20,
    });

    assert.equal(result.survivabilityIntegrityLevel, "bounded_sustainability_continuity_survivability");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.survivabilityExposureLevel, "contained");
  });

  it("classifies continuation-required survivability distinctly from collapse", () => {
    const result = evaluate({
      longHorizonSurvivabilityDurabilityScore: 66,
      lineageSurvivabilityPreservationScore: 66,
      explainabilitySurvivabilityDurabilityScore: 66,
      survivabilityReevaluationPressureScore: 44,
    });

    assert.equal(
      result.survivabilityIntegrityLevel,
      "sustainability_continuity_survivability_continuation_required",
    );
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveSurvivabilityEscalation, false);
    assert.equal(result.warningCodes.includes("SURVIVABILITY_CONTINUATION_REQUIRED"), true);
  });

  it("keeps fail-closed survivability degradation supreme", () => {
    const result = evaluate({
      failClosedSurvivabilityPreservationScore: 40,
      sustainabilityContinuitySurvivabilityIntegrityScore: 96,
      longHorizonSurvivabilityDurabilityScore: 96,
      institutionalSurvivabilityDurabilityScore: 96,
    });

    assert.equal(result.survivabilityIntegrityLevel, "fail_closed_survivability_degradation");
    assert.equal(result.failClosedSurvivabilityDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_SURVIVABILITY_DEGRADATION");
  });

  it("detects collapse-sensitive survivability escalation", () => {
    const result = evaluate({
      entropySurvivabilityAccelerationScore: 94,
      failClosedSurvivabilityPreservationScore: 88,
    });

    assert.equal(result.survivabilityIntegrityLevel, "collapse_sensitive_survivability");
    assert.equal(result.collapseSensitiveSurvivabilityEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_SURVIVABILITY"), true);
  });

  it("detects continuity survivability fatigue without automatic collapse", () => {
    const result = evaluate({
      continuityFatigueRiskScore: 78,
    });

    assert.equal(result.survivabilityIntegrityLevel, "sustainability_continuity_survivability_unstable");
    assert.equal(result.continuityFatigueDetected, true);
    assert.equal(result.collapseSensitiveSurvivabilityEscalation, false);
    assert.equal(result.warningCodes.includes("CONTINUITY_SURVIVABILITY_FATIGUE"), true);
  });

  it("detects recursive survivability degradation", () => {
    const result = evaluate({
      recursiveSurvivabilityDegradationRiskScore: 78,
      doctrineSurvivabilityStabilityScore: 62,
    });

    assert.equal(result.survivabilityIntegrityLevel, "sustainability_continuity_survivability_unstable");
    assert.equal(result.recursiveSurvivabilityDegradationDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_SURVIVABILITY_DEGRADATION");
  });

  it("detects entropy survivability acceleration", () => {
    const result = evaluate({
      entropySurvivabilityAccelerationScore: 78,
    });

    assert.equal(result.survivabilityIntegrityLevel, "sustainability_continuity_survivability_unstable");
    assert.equal(result.entropySurvivabilityAccelerationDetected, true);
    assert.equal(result.warningCodes.includes("ENTROPY_SURVIVABILITY_ACCELERATION"), true);
  });

  it("detects containment survivability risk", () => {
    const result = evaluate({
      containmentSurvivabilityStabilityScore: 50,
    });

    assert.equal(result.survivabilityIntegrityLevel, "sustainability_continuity_survivability_unstable");
    assert.equal(result.containmentSurvivabilityRiskDetected, true);
    assert.equal(result.warningCodes.includes("CONTAINMENT_SURVIVABILITY_RISK"), true);
  });

  it("detects doctrine survivability drift", () => {
    const result = evaluate({
      doctrineSurvivabilityStabilityScore: 60,
    });

    assert.equal(result.survivabilityIntegrityLevel, "sustainability_continuity_survivability_degrading");
    assert.equal(result.warningCodes.includes("DOCTRINE_SURVIVABILITY_DRIFT"), true);
  });

  it("detects institutional survivability durability risk", () => {
    const result = evaluate({
      institutionalSurvivabilityDurabilityScore: 60,
    });

    assert.equal(result.survivabilityIntegrityLevel, "sustainability_continuity_survivability_degrading");
    assert.equal(result.institutionalSurvivabilityWeaknessDetected, true);
    assert.equal(result.warningCodes.includes("INSTITUTIONAL_SURVIVABILITY_DURABILITY_RISK"), true);
  });

  it("detects long-horizon survivability weakness", () => {
    const result = evaluate({
      longHorizonSurvivabilityDurabilityScore: 60,
    });

    assert.equal(result.survivabilityIntegrityLevel, "sustainability_continuity_survivability_degrading");
    assert.equal(result.warningCodes.includes("LONG_HORIZON_SURVIVABILITY_DURABILITY_WEAKNESS"), true);
  });

  it("detects lineage survivability weakness", () => {
    const result = evaluate({
      lineageSurvivabilityPreservationScore: 60,
    });

    assert.equal(result.survivabilityIntegrityLevel, "sustainability_continuity_survivability_degrading");
    assert.equal(result.warningCodes.includes("LINEAGE_SURVIVABILITY_PRESERVATION_WEAKNESS"), true);
  });

  it("detects explainability survivability decay", () => {
    const result = evaluate({
      explainabilitySurvivabilityDurabilityScore: 60,
    });

    assert.equal(result.survivabilityIntegrityLevel, "sustainability_continuity_survivability_degrading");
    assert.equal(result.warningCodes.includes("EXPLAINABILITY_SURVIVABILITY_DECAY"), true);
  });

  it("escalates survivability reevaluation requirements", () => {
    const result = evaluate({
      survivabilityReevaluationPressureScore: 82,
    });

    assert.equal(result.survivabilityReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("SURVIVABILITY_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      longHorizonSurvivabilityDurabilityScore: 60,
      containmentSurvivabilityStabilityScore: 50,
      continuityFatigueRiskScore: 78,
      doctrineSurvivabilityStabilityScore: 60,
      institutionalSurvivabilityDurabilityScore: 60,
      lineageSurvivabilityPreservationScore: 60,
      explainabilitySurvivabilityDurabilityScore: 60,
      survivabilityReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "CONTAINMENT_SURVIVABILITY_RISK",
      "CONTINUITY_SURVIVABILITY_FATIGUE",
      "DOCTRINE_SURVIVABILITY_DRIFT",
      "INSTITUTIONAL_SURVIVABILITY_DURABILITY_RISK",
      "LONG_HORIZON_SURVIVABILITY_DURABILITY_WEAKNESS",
      "LINEAGE_SURVIVABILITY_PRESERVATION_WEAKNESS",
      "EXPLAINABILITY_SURVIVABILITY_DECAY",
      "SURVIVABILITY_REEVALUATION_REQUIRED",
    ]);
  });

  it("preserves deterministic precedence ordering", () => {
    const result = evaluate({
      failClosedSurvivabilityPreservationScore: 30,
      recursiveSurvivabilityDegradationRiskScore: 94,
      entropySurvivabilityAccelerationScore: 94,
      containmentSurvivabilityStabilityScore: 30,
    });

    assert.equal(result.survivabilityIntegrityLevel, "fail_closed_survivability_degradation");
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_SURVIVABILITY_DEGRADATION");
  });

  it("preserves explainability population", () => {
    const result = evaluate({
      containmentSurvivabilityStabilityScore: 50,
    });

    assert.equal(result.explainability.primarySurvivabilityDriver.length > 0, true);
    assert.equal(result.explainability.dominantSurvivabilityEscalationReason.length > 0, true);
    assert.equal(result.explainability.containmentSurvivabilityAssessment.includes("containment"), true);
    assert.equal(result.explainability.failClosedSurvivabilityAssessment.includes("Fail-closed"), true);
  });

  it("enforces bounded scores", () => {
    const result = evaluateCountyGovernanceRecoverySustainabilityContinuitySurvivability({
      sustainabilityContinuitySurvivabilityIntegrityScore: 150,
      longHorizonSurvivabilityDurabilityScore: Number.NaN,
      failClosedSurvivabilityPreservationScore: 90,
      continuityFatigueRiskScore: -10,
      recursiveSurvivabilityDegradationRiskScore: -10,
      institutionalSurvivabilityDurabilityScore: 100,
      containmentSurvivabilityStabilityScore: 120,
      doctrineSurvivabilityStabilityScore: 100,
      lineageSurvivabilityPreservationScore: 100,
      entropySurvivabilityAccelerationScore: 200,
      explainabilitySurvivabilityDurabilityScore: 100,
      survivabilityReevaluationPressureScore: 500,
    });

    assert.equal(result.survivabilitySeverityScore >= 0 && result.survivabilitySeverityScore <= 100, true);
    assert.equal(result.survivabilityExposureLevel, "critical");
    assert.equal(result.survivabilityReevaluationRequirementLevel, "immediate");
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      sustainabilityContinuitySurvivabilityIntegrityScore: 74,
      survivabilityReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceRecoverySustainabilityContinuitySurvivabilityInput = {
      ...durableInput,
      survivabilityReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceRecoverySustainabilityContinuitySurvivability(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      lineageSurvivabilityPreservationScore: 60,
      explainabilitySurvivabilityDurabilityScore: 60,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps collapse escalation terminal and non-stackable in classification", () => {
    const result = evaluate({
      recursiveSurvivabilityDegradationRiskScore: 94,
      entropySurvivabilityAccelerationScore: 94,
      containmentSurvivabilityStabilityScore: 30,
      failClosedSurvivabilityPreservationScore: 88,
      longHorizonSurvivabilityDurabilityScore: 88,
    });

    assert.equal(result.survivabilityIntegrityLevel, "collapse_sensitive_survivability");
    assert.equal(result.collapseSensitiveSurvivabilityEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_SURVIVABILITY");
  });

  it("gates continuation-required when severe continuity fatigue is present", () => {
    const result = evaluate({
      continuityFatigueRiskScore: 90,
      longHorizonSurvivabilityDurabilityScore: 88,
      doctrineSurvivabilityStabilityScore: 88,
    });

    assert.equal(result.continuationRequired, false);
    assert.equal(result.continuityFatigueDetected, true);
    assert.equal(result.survivabilityIntegrityLevel, "sustainability_continuity_survivability_unstable");
  });

  it("keeps survivability fatigue isolated from automatic collapse", () => {
    const result = evaluate({
      continuityFatigueRiskScore: 100,
      failClosedSurvivabilityPreservationScore: 92,
      longHorizonSurvivabilityDurabilityScore: 92,
      containmentSurvivabilityStabilityScore: 92,
      recursiveSurvivabilityDegradationRiskScore: 8,
      entropySurvivabilityAccelerationScore: 8,
    });

    assert.equal(result.continuityFatigueDetected, true);
    assert.equal(result.collapseSensitiveSurvivabilityEscalation, false);
    assert.equal(result.survivabilityIntegrityLevel, "sustainability_continuity_survivability_unstable");
  });
});
