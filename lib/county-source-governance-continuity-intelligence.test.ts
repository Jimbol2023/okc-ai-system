import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountySourceGovernanceContinuity,
  type CountySourceGovernanceContinuityInput,
  type CountySourceGovernanceContinuityResult,
} from "./county-source-governance-continuity-intelligence";

const baseInput: CountySourceGovernanceContinuityInput = {
  countyName: "Oklahoma County",
  sourceName: "Treasurer public record source",
  sourceType: "county_tax_record",
  continuityEvidenceScore: 88,
  governanceStabilityScore: 90,
  continuityConfidenceScore: 92,
  previousContinuityConfidenceScore: 78,
  escalationCycleCount: 0,
  resolutionCycleCount: 1,
  durableResolutionCount: 1,
  reviewLoopCount: 1,
  unresolvedWarningCount: 0,
  warningSuppressionRequested: false,
  warningSuppressionJustified: false,
  temporaryResolutionActive: false,
  monitoringWindowComplete: true,
  failClosedElevatedCurrently: false,
  explainabilityContext: {
    reviewedSignals: ["S13 escalation intelligence", "S14 resolution intelligence"],
    notes: ["continuity review packet complete"],
  },
};

const evaluate = (overrides: Partial<CountySourceGovernanceContinuityInput> = {}) =>
  evaluateCountySourceGovernanceContinuity({
    ...baseInput,
    ...overrides,
  });

const assertFailClosed = (result: CountySourceGovernanceContinuityResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Source Governance Continuity Intelligence", () => {
  it("returns continuity unverified and fail-closed flags for missing input", () => {
    const result = evaluateCountySourceGovernanceContinuity();

    assert.equal(result.continuityClassification, "continuity_unverified");
    assert.equal(result.continuitySeverity, "elevated");
    assert(result.warningCodes.includes("INSUFFICIENT_CONTINUITY_EVIDENCE"));
    assertFailClosed(result);
  });

  it("classifies durable governance signals as durable continuity", () => {
    const result = evaluate();

    assert.equal(result.continuityClassification, "durable_continuity");
    assert.equal(result.continuitySeverity, "low");
    assert.equal(result.planningMayContinue, true);
  });

  it("classifies acceptable governance signals as stable with monitoring", () => {
    const result = evaluate({
      continuityEvidenceScore: 76,
      governanceStabilityScore: 78,
      continuityConfidenceScore: 79,
      previousContinuityConfidenceScore: 76,
    });

    assert.equal(result.continuityClassification, "stable_with_monitoring");
    assert.equal(result.continuitySeverity, "moderate");
    assert.equal(result.monitoringRequired, true);
  });

  it("flags repeated escalation cycles", () => {
    const result = evaluate({
      escalationCycleCount: 2,
      resolutionCycleCount: 1,
      durableResolutionCount: 1,
    });

    assert(result.warningCodes.includes("REPEATED_ESCALATION_CYCLES"));
    assert.equal(result.repeatedEscalationDetected, true);
  });

  it("flags weakening governance confidence trends", () => {
    const result = evaluate({
      continuityConfidenceScore: 61,
      previousContinuityConfidenceScore: 82,
    });

    assert(result.warningCodes.includes("GOVERNANCE_CONFIDENCE_WEAKENING"));
    assert.equal(result.governanceStabilityOverTime, "weakening");
  });

  it("elevates unsafe warning suppression", () => {
    const result = evaluate({
      warningSuppressionRequested: true,
      warningSuppressionJustified: false,
    });

    assert.equal(result.continuityClassification, "fail_closed_continuity_required");
    assert.equal(result.continuitySeverity, "critical");
    assert.equal(result.warningSuppressionUnsafe, true);
    assert(result.warningCodes.includes("WARNING_SUPPRESSION_UNSAFE"));
  });

  it("flags repeated review loops as fragility", () => {
    const result = evaluate({
      reviewLoopCount: 3,
    });

    assert.equal(result.reviewLoopFragilityDetected, true);
    assert(result.warningCodes.includes("REVIEW_LOOP_FRAGILITY"));
  });

  it("flags unresolved warnings", () => {
    const result = evaluate({
      unresolvedWarningCount: 1,
    });

    assert.equal(result.unresolvedWarningsRemain, true);
    assert(result.warningCodes.includes("UNRESOLVED_WARNINGS_REMAIN"));
  });

  it("clamps scores between 0 and 100", () => {
    const result = evaluate({
      continuityEvidenceScore: 140,
      governanceStabilityScore: -20,
      continuityConfidenceScore: Number.NaN,
      previousContinuityConfidenceScore: 101,
    });

    assert.equal(result.continuityEvidenceScore, 100);
    assert.equal(result.governanceStabilityScore, 0);
    assert.equal(result.continuityConfidenceScore, 0);
    assert.equal(result.previousContinuityConfidenceScore, 100);
  });

  it("preserves literal fail-closed flags for all outputs", () => {
    const scenarios = [
      evaluate(),
      evaluate({ escalationCycleCount: 2 }),
      evaluate({ warningSuppressionRequested: true, warningSuppressionJustified: false }),
      evaluateCountySourceGovernanceContinuity(),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });

  it("keeps repeated escalation plus weak durability in churn or fail-closed handling", () => {
    const result = evaluate({
      escalationCycleCount: 3,
      resolutionCycleCount: 3,
      durableResolutionCount: 1,
      continuityEvidenceScore: 52,
      governanceStabilityScore: 50,
      continuityConfidenceScore: 58,
      previousContinuityConfidenceScore: 83,
    });

    assert(["churn_risk", "fail_closed_continuity_required"].includes(result.continuityClassification));
    assert(result.warningCodes.includes("GOVERNANCE_CHURN_RISK"));
  });
});
