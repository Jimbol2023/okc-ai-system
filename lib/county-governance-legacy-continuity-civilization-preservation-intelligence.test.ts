import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceLegacyContinuityCivilizationPreservation,
  type CountyGovernanceLegacyContinuityCivilizationPreservationInput,
} from "./county-governance-legacy-continuity-civilization-preservation-intelligence";

const durableInput: CountyGovernanceLegacyContinuityCivilizationPreservationInput = {
  legacyContinuityCivilizationPreservationIntegrityScore: 94,
  longHorizonCivilizationPreservationDurabilityScore: 93,
  failClosedCivilizationPreservationScore: 94,
  civilizationArchiveDegradationRiskScore: 8,
  recursiveCivilizationPreservationDegradationRiskScore: 8,
  institutionalCivilizationDurabilityScore: 92,
  containmentCivilizationPreservationStabilityScore: 91,
  doctrineCivilizationContinuityStabilityScore: 91,
  lineageCivilizationPreservationScore: 91,
  entropyCivilizationRecurrenceRiskScore: 8,
  explainabilityCivilizationDurabilityScore: 90,
  civilizationPreservationReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceLegacyContinuityCivilizationPreservationInput>) {
  return evaluateCountyGovernanceLegacyContinuityCivilizationPreservation({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceLegacyContinuityCivilizationPreservation>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Legacy Continuity Civilization Preservation Intelligence", () => {
  it("classifies durable civilization preservation", () => {
    const result = evaluateCountyGovernanceLegacyContinuityCivilizationPreservation(durableInput);

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "durable_legacy_continuity_civilization_preservation",
    );
    assert.equal(result.civilizationPreservationExposureLevel, "minimal");
    assert.equal(result.civilizationPreservationReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonCivilizationPreservation, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded civilization preservation", () => {
    const result = evaluate({
      legacyContinuityCivilizationPreservationIntegrityScore: 74,
      longHorizonCivilizationPreservationDurabilityScore: 88,
      doctrineCivilizationContinuityStabilityScore: 88,
      civilizationPreservationReevaluationPressureScore: 20,
    });

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "bounded_legacy_continuity_civilization_preservation",
    );
    assert.equal(result.continuationRequired, false);
    assert.equal(result.civilizationPreservationExposureLevel, "contained");
  });

  it("classifies continuation-required civilization preservation distinctly from collapse", () => {
    const result = evaluate({
      longHorizonCivilizationPreservationDurabilityScore: 66,
      lineageCivilizationPreservationScore: 66,
      explainabilityCivilizationDurabilityScore: 66,
      civilizationPreservationReevaluationPressureScore: 44,
    });

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "legacy_continuity_civilization_preservation_continuation_required",
    );
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveCivilizationPreservationEscalation, false);
    assert.equal(result.warningCodes.includes("CIVILIZATION_PRESERVATION_CONTINUATION_REQUIRED"), true);
  });

  it("keeps fail-closed civilization preservation degradation supreme when collapse is absent", () => {
    const result = evaluate({
      failClosedCivilizationPreservationScore: 40,
      legacyContinuityCivilizationPreservationIntegrityScore: 96,
      longHorizonCivilizationPreservationDurabilityScore: 96,
      institutionalCivilizationDurabilityScore: 96,
    });

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "fail_closed_civilization_preservation_degradation",
    );
    assert.equal(result.failClosedCivilizationPreservationDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_CIVILIZATION_PRESERVATION_DEGRADATION");
  });

  it("detects collapse-sensitive civilization preservation escalation", () => {
    const result = evaluate({
      entropyCivilizationRecurrenceRiskScore: 94,
      failClosedCivilizationPreservationScore: 60,
    });

    assert.equal(result.civilizationPreservationIntegrityLevel, "collapse_sensitive_civilization_preservation");
    assert.equal(result.collapseSensitiveCivilizationPreservationEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_CIVILIZATION_PRESERVATION"), true);
  });

  it("keeps civilization archive degradation visible without automatic collapse", () => {
    const result = evaluate({
      civilizationArchiveDegradationRiskScore: 78,
    });

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "legacy_continuity_civilization_preservation_unstable",
    );
    assert.equal(result.civilizationArchiveDegradationDetected, true);
    assert.equal(result.collapseSensitiveCivilizationPreservationEscalation, false);
    assert.equal(result.warningCodes.includes("CIVILIZATION_ARCHIVE_DEGRADATION_RISK"), true);
  });

  it("detects recursive civilization preservation degradation", () => {
    const result = evaluate({
      recursiveCivilizationPreservationDegradationRiskScore: 78,
    });

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "legacy_continuity_civilization_preservation_unstable",
    );
    assert.equal(result.recursiveCivilizationPreservationDegradationDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_CIVILIZATION_PRESERVATION_DEGRADATION");
  });

  it("detects entropy civilization recurrence risk", () => {
    const result = evaluate({
      entropyCivilizationRecurrenceRiskScore: 78,
    });

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "legacy_continuity_civilization_preservation_unstable",
    );
    assert.equal(result.entropyCivilizationRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("ENTROPY_CIVILIZATION_RECURRENCE_RISK"), true);
  });

  it("detects containment civilization preservation risk", () => {
    const result = evaluate({
      containmentCivilizationPreservationStabilityScore: 50,
    });

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "legacy_continuity_civilization_preservation_unstable",
    );
    assert.equal(result.containmentCivilizationPreservationRiskDetected, true);
    assert.equal(result.warningCodes.includes("CONTAINMENT_CIVILIZATION_PRESERVATION_RISK"), true);
  });

  it("detects doctrine civilization continuity drift", () => {
    const result = evaluate({
      doctrineCivilizationContinuityStabilityScore: 50,
    });

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "legacy_continuity_civilization_preservation_degrading",
    );
    assert.equal(result.warningCodes.includes("DOCTRINE_CIVILIZATION_CONTINUITY_DRIFT"), true);
  });

  it("detects institutional civilization durability risk", () => {
    const result = evaluate({
      institutionalCivilizationDurabilityScore: 50,
    });

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "legacy_continuity_civilization_preservation_degrading",
    );
    assert.equal(result.institutionalCivilizationWeaknessDetected, true);
    assert.equal(result.warningCodes.includes("INSTITUTIONAL_CIVILIZATION_DURABILITY_RISK"), true);
  });

  it("detects long-horizon civilization preservation weakness", () => {
    const result = evaluate({
      longHorizonCivilizationPreservationDurabilityScore: 50,
    });

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "legacy_continuity_civilization_preservation_degrading",
    );
    assert.equal(result.warningCodes.includes("LONG_HORIZON_CIVILIZATION_PRESERVATION_DURABILITY_WEAKNESS"), true);
  });

  it("detects lineage civilization preservation weakness", () => {
    const result = evaluate({
      lineageCivilizationPreservationScore: 50,
    });

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "legacy_continuity_civilization_preservation_degrading",
    );
    assert.equal(result.warningCodes.includes("LINEAGE_CIVILIZATION_PRESERVATION_WEAKNESS"), true);
  });

  it("detects explainability civilization decay", () => {
    const result = evaluate({
      explainabilityCivilizationDurabilityScore: 50,
    });

    assert.equal(
      result.civilizationPreservationIntegrityLevel,
      "legacy_continuity_civilization_preservation_degrading",
    );
    assert.equal(result.warningCodes.includes("EXPLAINABILITY_CIVILIZATION_DECAY"), true);
  });

  it("escalates civilization preservation reevaluation requirements", () => {
    const result = evaluate({
      civilizationPreservationReevaluationPressureScore: 82,
    });

    assert.equal(result.civilizationPreservationReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("CIVILIZATION_PRESERVATION_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      longHorizonCivilizationPreservationDurabilityScore: 50,
      containmentCivilizationPreservationStabilityScore: 50,
      civilizationArchiveDegradationRiskScore: 78,
      doctrineCivilizationContinuityStabilityScore: 50,
      institutionalCivilizationDurabilityScore: 50,
      lineageCivilizationPreservationScore: 50,
      explainabilityCivilizationDurabilityScore: 50,
      civilizationPreservationReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "CONTAINMENT_CIVILIZATION_PRESERVATION_RISK",
      "CIVILIZATION_ARCHIVE_DEGRADATION_RISK",
      "DOCTRINE_CIVILIZATION_CONTINUITY_DRIFT",
      "INSTITUTIONAL_CIVILIZATION_DURABILITY_RISK",
      "LONG_HORIZON_CIVILIZATION_PRESERVATION_DURABILITY_WEAKNESS",
      "LINEAGE_CIVILIZATION_PRESERVATION_WEAKNESS",
      "EXPLAINABILITY_CIVILIZATION_DECAY",
      "CIVILIZATION_PRESERVATION_REEVALUATION_REQUIRED",
    ]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      legacyContinuityCivilizationPreservationIntegrityScore: 74,
      civilizationPreservationReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceLegacyContinuityCivilizationPreservationInput = {
      ...durableInput,
      civilizationPreservationReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceLegacyContinuityCivilizationPreservation(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("enforces bounded scores", () => {
    const result = evaluateCountyGovernanceLegacyContinuityCivilizationPreservation({
      legacyContinuityCivilizationPreservationIntegrityScore: 150,
      longHorizonCivilizationPreservationDurabilityScore: Number.NaN,
      failClosedCivilizationPreservationScore: 90,
      civilizationArchiveDegradationRiskScore: -10,
      recursiveCivilizationPreservationDegradationRiskScore: -10,
      institutionalCivilizationDurabilityScore: 100,
      containmentCivilizationPreservationStabilityScore: 120,
      doctrineCivilizationContinuityStabilityScore: 100,
      lineageCivilizationPreservationScore: 100,
      entropyCivilizationRecurrenceRiskScore: 200,
      explainabilityCivilizationDurabilityScore: 100,
      civilizationPreservationReevaluationPressureScore: 500,
    });

    assert.equal(
      result.civilizationPreservationSeverityScore >= 0 &&
        result.civilizationPreservationSeverityScore <= 100,
      true,
    );
    assert.equal(result.civilizationPreservationExposureLevel, "critical");
    assert.equal(result.civilizationPreservationReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only governance invariants", () => {
    const result = evaluate({
      lineageCivilizationPreservationScore: 50,
      explainabilityCivilizationDurabilityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps collapse escalation terminal and non-stackable in classification", () => {
    const result = evaluate({
      recursiveCivilizationPreservationDegradationRiskScore: 94,
      entropyCivilizationRecurrenceRiskScore: 94,
      civilizationArchiveDegradationRiskScore: 94,
      failClosedCivilizationPreservationScore: 60,
      longHorizonCivilizationPreservationDurabilityScore: 88,
    });

    assert.equal(result.civilizationPreservationIntegrityLevel, "collapse_sensitive_civilization_preservation");
    assert.equal(result.collapseSensitiveCivilizationPreservationEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_CIVILIZATION_PRESERVATION");
  });

  it("saturates simultaneous degradation vectors deterministically", () => {
    const result = evaluate({
      recursiveCivilizationPreservationDegradationRiskScore: 100,
      entropyCivilizationRecurrenceRiskScore: 100,
      civilizationArchiveDegradationRiskScore: 100,
      containmentCivilizationPreservationStabilityScore: 0,
      doctrineCivilizationContinuityStabilityScore: 0,
      institutionalCivilizationDurabilityScore: 0,
      lineageCivilizationPreservationScore: 0,
      explainabilityCivilizationDurabilityScore: 0,
      failClosedCivilizationPreservationScore: 80,
      longHorizonCivilizationPreservationDurabilityScore: 80,
    });

    assert.equal(result.civilizationPreservationSeverityScore, 100);
    assert.equal(result.civilizationPreservationExposureLevel, "critical");
  });

  it("keeps civilization preservation from implying irreversible governance preservation", () => {
    const result = evaluateCountyGovernanceLegacyContinuityCivilizationPreservation(durableInput);

    assert.equal(
      result.explainability.longHorizonCivilizationPreservationAssessment.includes(
        "does not imply irreversible governance preservation",
      ),
      true,
    );
  });
});
