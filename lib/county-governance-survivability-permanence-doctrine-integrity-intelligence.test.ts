import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceSurvivabilityPermanenceDoctrineIntegrity,
  type CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityInput,
} from "./county-governance-survivability-permanence-doctrine-integrity-intelligence";

const durableInput: CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityInput = {
  survivabilityPermanenceDoctrineIntegrityScore: 94,
  longHorizonPermanenceDurabilityScore: 93,
  failClosedPermanencePreservationScore: 94,
  permanenceAssumptionRiskScore: 8,
  recursivePermanenceDegradationRiskScore: 8,
  institutionalPermanenceDurabilityScore: 92,
  containmentPermanenceStabilityScore: 91,
  doctrinePermanenceStabilityScore: 91,
  lineagePermanencePreservationScore: 91,
  entropyRecurrenceRiskScore: 8,
  explainabilityPermanenceDurabilityScore: 90,
  permanenceReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityInput>) {
  return evaluateCountyGovernanceSurvivabilityPermanenceDoctrineIntegrity({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceSurvivabilityPermanenceDoctrineIntegrity>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Survivability Permanence Doctrine Integrity Intelligence", () => {
  it("classifies durable permanence doctrine integrity", () => {
    const result = evaluateCountyGovernanceSurvivabilityPermanenceDoctrineIntegrity(durableInput);

    assert.equal(result.permanenceDoctrineIntegrityLevel, "durable_survivability_permanence_doctrine_integrity");
    assert.equal(result.permanenceExposureLevel, "minimal");
    assert.equal(result.permanenceReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonPermanence, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded permanence doctrine integrity", () => {
    const result = evaluate({
      survivabilityPermanenceDoctrineIntegrityScore: 74,
      longHorizonPermanenceDurabilityScore: 88,
      doctrinePermanenceStabilityScore: 88,
      permanenceReevaluationPressureScore: 20,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "bounded_survivability_permanence_doctrine_integrity");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.permanenceExposureLevel, "contained");
  });

  it("classifies continuation-required permanence distinctly from collapse", () => {
    const result = evaluate({
      longHorizonPermanenceDurabilityScore: 66,
      lineagePermanencePreservationScore: 66,
      explainabilityPermanenceDurabilityScore: 66,
      permanenceReevaluationPressureScore: 44,
    });

    assert.equal(
      result.permanenceDoctrineIntegrityLevel,
      "survivability_permanence_doctrine_continuation_required",
    );
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitivePermanenceEscalation, false);
    assert.equal(result.warningCodes.includes("PERMANENCE_CONTINUATION_REQUIRED"), true);
  });

  it("keeps fail-closed permanence doctrine degradation supreme", () => {
    const result = evaluate({
      failClosedPermanencePreservationScore: 40,
      survivabilityPermanenceDoctrineIntegrityScore: 96,
      longHorizonPermanenceDurabilityScore: 96,
      institutionalPermanenceDurabilityScore: 96,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "fail_closed_permanence_doctrine_degradation");
    assert.equal(result.failClosedPermanenceDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_PERMANENCE_DOCTRINE_DEGRADATION");
  });

  it("detects collapse-sensitive permanence doctrine escalation", () => {
    const result = evaluate({
      entropyRecurrenceRiskScore: 94,
      failClosedPermanencePreservationScore: 88,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "collapse_sensitive_permanence_doctrine");
    assert.equal(result.collapseSensitivePermanenceEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_PERMANENCE_DOCTRINE"), true);
  });

  it("detects false permanence assumption risk without automatic collapse", () => {
    const result = evaluate({
      permanenceAssumptionRiskScore: 78,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "survivability_permanence_doctrine_unstable");
    assert.equal(result.falsePermanenceAssumptionDetected, true);
    assert.equal(result.collapseSensitivePermanenceEscalation, false);
    assert.equal(result.warningCodes.includes("FALSE_PERMANENCE_ASSUMPTION_RISK"), true);
  });

  it("detects recursive permanence degradation", () => {
    const result = evaluate({
      recursivePermanenceDegradationRiskScore: 78,
      doctrinePermanenceStabilityScore: 62,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "survivability_permanence_doctrine_unstable");
    assert.equal(result.recursivePermanenceDegradationDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_PERMANENCE_DEGRADATION");
  });

  it("detects entropy recurrence permanence risk", () => {
    const result = evaluate({
      entropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "survivability_permanence_doctrine_unstable");
    assert.equal(result.entropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("ENTROPY_RECURRENCE_PERMANENCE_RISK"), true);
  });

  it("detects containment permanence risk", () => {
    const result = evaluate({
      containmentPermanenceStabilityScore: 50,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "survivability_permanence_doctrine_unstable");
    assert.equal(result.containmentPermanenceRiskDetected, true);
    assert.equal(result.warningCodes.includes("CONTAINMENT_PERMANENCE_RISK"), true);
  });

  it("detects doctrine permanence drift", () => {
    const result = evaluate({
      doctrinePermanenceStabilityScore: 60,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "survivability_permanence_doctrine_degrading");
    assert.equal(result.warningCodes.includes("DOCTRINE_PERMANENCE_DRIFT"), true);
  });

  it("detects institutional permanence durability risk", () => {
    const result = evaluate({
      institutionalPermanenceDurabilityScore: 60,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "survivability_permanence_doctrine_degrading");
    assert.equal(result.institutionalPermanenceWeaknessDetected, true);
    assert.equal(result.warningCodes.includes("INSTITUTIONAL_PERMANENCE_DURABILITY_RISK"), true);
  });

  it("detects long-horizon permanence weakness", () => {
    const result = evaluate({
      longHorizonPermanenceDurabilityScore: 60,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "survivability_permanence_doctrine_degrading");
    assert.equal(result.warningCodes.includes("LONG_HORIZON_PERMANENCE_DURABILITY_WEAKNESS"), true);
  });

  it("detects lineage permanence weakness", () => {
    const result = evaluate({
      lineagePermanencePreservationScore: 60,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "survivability_permanence_doctrine_degrading");
    assert.equal(result.warningCodes.includes("LINEAGE_PERMANENCE_PRESERVATION_WEAKNESS"), true);
  });

  it("detects explainability permanence decay", () => {
    const result = evaluate({
      explainabilityPermanenceDurabilityScore: 60,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "survivability_permanence_doctrine_degrading");
    assert.equal(result.warningCodes.includes("EXPLAINABILITY_PERMANENCE_DECAY"), true);
  });

  it("escalates permanence reevaluation requirements", () => {
    const result = evaluate({
      permanenceReevaluationPressureScore: 82,
    });

    assert.equal(result.permanenceReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("PERMANENCE_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      longHorizonPermanenceDurabilityScore: 60,
      containmentPermanenceStabilityScore: 50,
      permanenceAssumptionRiskScore: 78,
      doctrinePermanenceStabilityScore: 60,
      institutionalPermanenceDurabilityScore: 60,
      lineagePermanencePreservationScore: 60,
      explainabilityPermanenceDurabilityScore: 60,
      permanenceReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "CONTAINMENT_PERMANENCE_RISK",
      "FALSE_PERMANENCE_ASSUMPTION_RISK",
      "DOCTRINE_PERMANENCE_DRIFT",
      "INSTITUTIONAL_PERMANENCE_DURABILITY_RISK",
      "LONG_HORIZON_PERMANENCE_DURABILITY_WEAKNESS",
      "LINEAGE_PERMANENCE_PRESERVATION_WEAKNESS",
      "EXPLAINABILITY_PERMANENCE_DECAY",
      "PERMANENCE_REEVALUATION_REQUIRED",
    ]);
  });

  it("preserves deterministic precedence ordering", () => {
    const result = evaluate({
      failClosedPermanencePreservationScore: 30,
      recursivePermanenceDegradationRiskScore: 94,
      entropyRecurrenceRiskScore: 94,
      containmentPermanenceStabilityScore: 30,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "fail_closed_permanence_doctrine_degradation");
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_PERMANENCE_DOCTRINE_DEGRADATION");
  });

  it("preserves explainability population", () => {
    const result = evaluate({
      containmentPermanenceStabilityScore: 50,
    });

    assert.equal(result.explainability.primaryPermanenceDriver.length > 0, true);
    assert.equal(result.explainability.dominantPermanenceEscalationReason.length > 0, true);
    assert.equal(result.explainability.containmentPermanenceAssessment.includes("containment"), true);
    assert.equal(result.explainability.failClosedPermanenceAssessment.includes("Fail-closed"), true);
  });

  it("enforces bounded scores", () => {
    const result = evaluateCountyGovernanceSurvivabilityPermanenceDoctrineIntegrity({
      survivabilityPermanenceDoctrineIntegrityScore: 150,
      longHorizonPermanenceDurabilityScore: Number.NaN,
      failClosedPermanencePreservationScore: 90,
      permanenceAssumptionRiskScore: -10,
      recursivePermanenceDegradationRiskScore: -10,
      institutionalPermanenceDurabilityScore: 100,
      containmentPermanenceStabilityScore: 120,
      doctrinePermanenceStabilityScore: 100,
      lineagePermanencePreservationScore: 100,
      entropyRecurrenceRiskScore: 200,
      explainabilityPermanenceDurabilityScore: 100,
      permanenceReevaluationPressureScore: 500,
    });

    assert.equal(result.permanenceSeverityScore >= 0 && result.permanenceSeverityScore <= 100, true);
    assert.equal(result.permanenceExposureLevel, "critical");
    assert.equal(result.permanenceReevaluationRequirementLevel, "immediate");
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      survivabilityPermanenceDoctrineIntegrityScore: 74,
      permanenceReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceSurvivabilityPermanenceDoctrineIntegrityInput = {
      ...durableInput,
      permanenceReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceSurvivabilityPermanenceDoctrineIntegrity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      lineagePermanencePreservationScore: 60,
      explainabilityPermanenceDurabilityScore: 60,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps collapse escalation terminal and non-stackable in classification", () => {
    const result = evaluate({
      recursivePermanenceDegradationRiskScore: 94,
      entropyRecurrenceRiskScore: 94,
      containmentPermanenceStabilityScore: 30,
      failClosedPermanencePreservationScore: 88,
      longHorizonPermanenceDurabilityScore: 88,
    });

    assert.equal(result.permanenceDoctrineIntegrityLevel, "collapse_sensitive_permanence_doctrine");
    assert.equal(result.collapseSensitivePermanenceEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_PERMANENCE_DOCTRINE");
  });

  it("gates continuation-required when false permanence assumption risk is present", () => {
    const result = evaluate({
      permanenceAssumptionRiskScore: 90,
      longHorizonPermanenceDurabilityScore: 88,
      doctrinePermanenceStabilityScore: 88,
    });

    assert.equal(result.continuationRequired, false);
    assert.equal(result.falsePermanenceAssumptionDetected, true);
    assert.equal(result.permanenceDoctrineIntegrityLevel, "survivability_permanence_doctrine_unstable");
  });

  it("keeps false permanence assumption risk isolated from automatic collapse", () => {
    const result = evaluate({
      permanenceAssumptionRiskScore: 100,
      failClosedPermanencePreservationScore: 92,
      longHorizonPermanenceDurabilityScore: 92,
      containmentPermanenceStabilityScore: 92,
      recursivePermanenceDegradationRiskScore: 8,
      entropyRecurrenceRiskScore: 8,
    });

    assert.equal(result.falsePermanenceAssumptionDetected, true);
    assert.equal(result.collapseSensitivePermanenceEscalation, false);
    assert.equal(result.permanenceDoctrineIntegrityLevel, "survivability_permanence_doctrine_unstable");
  });

  it("keeps permanence doctrine from implying indefinite safety", () => {
    const result = evaluateCountyGovernanceSurvivabilityPermanenceDoctrineIntegrity(durableInput);

    assert.equal(
      result.explainability.longHorizonPermanenceAssessment.includes("does not imply indefinite safety"),
      true,
    );
  });
});
