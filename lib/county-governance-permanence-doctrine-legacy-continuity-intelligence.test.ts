import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernancePermanenceDoctrineLegacyContinuity,
  type CountyGovernancePermanenceDoctrineLegacyContinuityInput,
} from "./county-governance-permanence-doctrine-legacy-continuity-intelligence";

const durableInput: CountyGovernancePermanenceDoctrineLegacyContinuityInput = {
  permanenceDoctrineLegacyContinuityIntegrityScore: 94,
  longHorizonLegacyContinuityDurabilityScore: 93,
  failClosedLegacyContinuityPreservationScore: 94,
  doctrineSuccessionInstabilityRiskScore: 8,
  recursiveLegacyContinuityDegradationRiskScore: 8,
  institutionalLegacyContinuityDurabilityScore: 92,
  containmentLegacyContinuityStabilityScore: 91,
  doctrineLegacyContinuityStabilityScore: 91,
  lineageLegacyContinuityPreservationScore: 91,
  entropyLegacyRecurrenceRiskScore: 8,
  explainabilityLegacyContinuityDurabilityScore: 90,
  legacyContinuityReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernancePermanenceDoctrineLegacyContinuityInput>) {
  return evaluateCountyGovernancePermanenceDoctrineLegacyContinuity({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernancePermanenceDoctrineLegacyContinuity>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Permanence Doctrine Legacy Continuity Intelligence", () => {
  it("classifies durable legacy continuity", () => {
    const result = evaluateCountyGovernancePermanenceDoctrineLegacyContinuity(durableInput);

    assert.equal(result.legacyContinuityIntegrityLevel, "durable_permanence_doctrine_legacy_continuity");
    assert.equal(result.legacyContinuityExposureLevel, "minimal");
    assert.equal(result.legacyContinuityReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonLegacyContinuity, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded legacy continuity", () => {
    const result = evaluate({
      permanenceDoctrineLegacyContinuityIntegrityScore: 74,
      longHorizonLegacyContinuityDurabilityScore: 88,
      doctrineLegacyContinuityStabilityScore: 88,
      legacyContinuityReevaluationPressureScore: 20,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "bounded_permanence_doctrine_legacy_continuity");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.legacyContinuityExposureLevel, "contained");
  });

  it("classifies continuation-required legacy continuity distinctly from collapse", () => {
    const result = evaluate({
      longHorizonLegacyContinuityDurabilityScore: 66,
      lineageLegacyContinuityPreservationScore: 66,
      explainabilityLegacyContinuityDurabilityScore: 66,
      legacyContinuityReevaluationPressureScore: 44,
    });

    assert.equal(
      result.legacyContinuityIntegrityLevel,
      "permanence_doctrine_legacy_continuity_continuation_required",
    );
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveLegacyContinuityEscalation, false);
    assert.equal(result.warningCodes.includes("LEGACY_CONTINUITY_CONTINUATION_REQUIRED"), true);
  });

  it("keeps fail-closed legacy continuity degradation supreme", () => {
    const result = evaluate({
      failClosedLegacyContinuityPreservationScore: 40,
      permanenceDoctrineLegacyContinuityIntegrityScore: 96,
      longHorizonLegacyContinuityDurabilityScore: 96,
      institutionalLegacyContinuityDurabilityScore: 96,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "fail_closed_legacy_continuity_degradation");
    assert.equal(result.failClosedLegacyContinuityDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_LEGACY_CONTINUITY_DEGRADATION");
  });

  it("detects collapse-sensitive legacy continuity escalation", () => {
    const result = evaluate({
      entropyLegacyRecurrenceRiskScore: 94,
      failClosedLegacyContinuityPreservationScore: 60,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "collapse_sensitive_legacy_continuity");
    assert.equal(result.collapseSensitiveLegacyContinuityEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_LEGACY_CONTINUITY"), true);
  });

  it("detects doctrine succession instability without automatic collapse", () => {
    const result = evaluate({
      doctrineSuccessionInstabilityRiskScore: 78,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "permanence_doctrine_legacy_continuity_unstable");
    assert.equal(result.doctrineSuccessionInstabilityDetected, true);
    assert.equal(result.collapseSensitiveLegacyContinuityEscalation, false);
    assert.equal(result.warningCodes.includes("DOCTRINE_SUCCESSION_INSTABILITY_RISK"), true);
  });

  it("detects recursive legacy continuity degradation", () => {
    const result = evaluate({
      recursiveLegacyContinuityDegradationRiskScore: 78,
      doctrineLegacyContinuityStabilityScore: 62,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "permanence_doctrine_legacy_continuity_unstable");
    assert.equal(result.recursiveLegacyContinuityDegradationDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_LEGACY_CONTINUITY_DEGRADATION");
  });

  it("detects entropy legacy recurrence escalation", () => {
    const result = evaluate({
      entropyLegacyRecurrenceRiskScore: 78,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "permanence_doctrine_legacy_continuity_unstable");
    assert.equal(result.entropyLegacyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("ENTROPY_LEGACY_RECURRENCE_RISK"), true);
  });

  it("detects containment legacy continuity risk", () => {
    const result = evaluate({
      containmentLegacyContinuityStabilityScore: 50,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "permanence_doctrine_legacy_continuity_unstable");
    assert.equal(result.containmentLegacyContinuityRiskDetected, true);
    assert.equal(result.warningCodes.includes("CONTAINMENT_LEGACY_CONTINUITY_RISK"), true);
  });

  it("detects doctrine legacy continuity drift", () => {
    const result = evaluate({
      doctrineLegacyContinuityStabilityScore: 60,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "permanence_doctrine_legacy_continuity_degrading");
    assert.equal(result.warningCodes.includes("DOCTRINE_LEGACY_CONTINUITY_DRIFT"), true);
  });

  it("detects institutional legacy continuity durability risk", () => {
    const result = evaluate({
      institutionalLegacyContinuityDurabilityScore: 60,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "permanence_doctrine_legacy_continuity_degrading");
    assert.equal(result.institutionalLegacyContinuityWeaknessDetected, true);
    assert.equal(result.warningCodes.includes("INSTITUTIONAL_LEGACY_CONTINUITY_DURABILITY_RISK"), true);
  });

  it("detects long-horizon legacy continuity weakness", () => {
    const result = evaluate({
      longHorizonLegacyContinuityDurabilityScore: 60,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "permanence_doctrine_legacy_continuity_degrading");
    assert.equal(result.warningCodes.includes("LONG_HORIZON_LEGACY_CONTINUITY_DURABILITY_WEAKNESS"), true);
  });

  it("detects lineage legacy continuity weakness", () => {
    const result = evaluate({
      lineageLegacyContinuityPreservationScore: 60,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "permanence_doctrine_legacy_continuity_degrading");
    assert.equal(result.warningCodes.includes("LINEAGE_LEGACY_CONTINUITY_PRESERVATION_WEAKNESS"), true);
  });

  it("detects explainability legacy continuity decay", () => {
    const result = evaluate({
      explainabilityLegacyContinuityDurabilityScore: 60,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "permanence_doctrine_legacy_continuity_degrading");
    assert.equal(result.warningCodes.includes("EXPLAINABILITY_LEGACY_CONTINUITY_DECAY"), true);
  });

  it("escalates legacy continuity reevaluation requirements", () => {
    const result = evaluate({
      legacyContinuityReevaluationPressureScore: 82,
    });

    assert.equal(result.legacyContinuityReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("LEGACY_CONTINUITY_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      longHorizonLegacyContinuityDurabilityScore: 60,
      containmentLegacyContinuityStabilityScore: 50,
      doctrineSuccessionInstabilityRiskScore: 78,
      doctrineLegacyContinuityStabilityScore: 60,
      institutionalLegacyContinuityDurabilityScore: 60,
      lineageLegacyContinuityPreservationScore: 60,
      explainabilityLegacyContinuityDurabilityScore: 60,
      legacyContinuityReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "CONTAINMENT_LEGACY_CONTINUITY_RISK",
      "DOCTRINE_SUCCESSION_INSTABILITY_RISK",
      "DOCTRINE_LEGACY_CONTINUITY_DRIFT",
      "INSTITUTIONAL_LEGACY_CONTINUITY_DURABILITY_RISK",
      "LONG_HORIZON_LEGACY_CONTINUITY_DURABILITY_WEAKNESS",
      "LINEAGE_LEGACY_CONTINUITY_PRESERVATION_WEAKNESS",
      "EXPLAINABILITY_LEGACY_CONTINUITY_DECAY",
      "LEGACY_CONTINUITY_REEVALUATION_REQUIRED",
    ]);
  });

  it("preserves deterministic precedence ordering", () => {
    const result = evaluate({
      failClosedLegacyContinuityPreservationScore: 30,
      recursiveLegacyContinuityDegradationRiskScore: 94,
      entropyLegacyRecurrenceRiskScore: 94,
      doctrineSuccessionInstabilityRiskScore: 94,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "fail_closed_legacy_continuity_degradation");
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_LEGACY_CONTINUITY_DEGRADATION");
  });

  it("preserves explainability population", () => {
    const result = evaluate({
      containmentLegacyContinuityStabilityScore: 50,
    });

    assert.equal(result.explainability.primaryLegacyContinuityDriver.length > 0, true);
    assert.equal(result.explainability.dominantLegacyContinuityEscalationReason.length > 0, true);
    assert.equal(result.explainability.containmentLegacyContinuityAssessment.includes("containment"), true);
    assert.equal(result.explainability.failClosedLegacyContinuityAssessment.includes("Fail-closed"), true);
  });

  it("enforces bounded scores", () => {
    const result = evaluateCountyGovernancePermanenceDoctrineLegacyContinuity({
      permanenceDoctrineLegacyContinuityIntegrityScore: 150,
      longHorizonLegacyContinuityDurabilityScore: Number.NaN,
      failClosedLegacyContinuityPreservationScore: 90,
      doctrineSuccessionInstabilityRiskScore: -10,
      recursiveLegacyContinuityDegradationRiskScore: -10,
      institutionalLegacyContinuityDurabilityScore: 100,
      containmentLegacyContinuityStabilityScore: 120,
      doctrineLegacyContinuityStabilityScore: 100,
      lineageLegacyContinuityPreservationScore: 100,
      entropyLegacyRecurrenceRiskScore: 200,
      explainabilityLegacyContinuityDurabilityScore: 100,
      legacyContinuityReevaluationPressureScore: 500,
    });

    assert.equal(result.legacyContinuitySeverityScore >= 0 && result.legacyContinuitySeverityScore <= 100, true);
    assert.equal(result.legacyContinuityExposureLevel, "critical");
    assert.equal(result.legacyContinuityReevaluationRequirementLevel, "immediate");
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      permanenceDoctrineLegacyContinuityIntegrityScore: 74,
      legacyContinuityReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernancePermanenceDoctrineLegacyContinuityInput = {
      ...durableInput,
      legacyContinuityReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernancePermanenceDoctrineLegacyContinuity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      lineageLegacyContinuityPreservationScore: 60,
      explainabilityLegacyContinuityDurabilityScore: 60,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps collapse escalation terminal and non-stackable in classification", () => {
    const result = evaluate({
      recursiveLegacyContinuityDegradationRiskScore: 94,
      entropyLegacyRecurrenceRiskScore: 94,
      doctrineSuccessionInstabilityRiskScore: 94,
      failClosedLegacyContinuityPreservationScore: 60,
      longHorizonLegacyContinuityDurabilityScore: 88,
    });

    assert.equal(result.legacyContinuityIntegrityLevel, "collapse_sensitive_legacy_continuity");
    assert.equal(result.collapseSensitiveLegacyContinuityEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_LEGACY_CONTINUITY");
  });

  it("gates continuation-required when doctrine succession instability is present", () => {
    const result = evaluate({
      doctrineSuccessionInstabilityRiskScore: 90,
      longHorizonLegacyContinuityDurabilityScore: 88,
      doctrineLegacyContinuityStabilityScore: 88,
    });

    assert.equal(result.continuationRequired, false);
    assert.equal(result.doctrineSuccessionInstabilityDetected, true);
    assert.equal(result.legacyContinuityIntegrityLevel, "permanence_doctrine_legacy_continuity_unstable");
  });

  it("keeps doctrine succession instability bounded and visible", () => {
    const result = evaluate({
      doctrineSuccessionInstabilityRiskScore: 100,
      failClosedLegacyContinuityPreservationScore: 92,
      longHorizonLegacyContinuityDurabilityScore: 92,
      containmentLegacyContinuityStabilityScore: 92,
      recursiveLegacyContinuityDegradationRiskScore: 8,
      entropyLegacyRecurrenceRiskScore: 8,
    });

    assert.equal(result.doctrineSuccessionInstabilityDetected, true);
    assert.equal(result.collapseSensitiveLegacyContinuityEscalation, false);
    assert.equal(result.legacyContinuityIntegrityLevel, "permanence_doctrine_legacy_continuity_unstable");
  });

  it("keeps legacy continuity from implying irreversible governance preservation", () => {
    const result = evaluateCountyGovernancePermanenceDoctrineLegacyContinuity(durableInput);

    assert.equal(
      result.explainability.longHorizonLegacyContinuityAssessment.includes(
        "does not imply irreversible governance preservation",
      ),
      true,
    );
  });
});
