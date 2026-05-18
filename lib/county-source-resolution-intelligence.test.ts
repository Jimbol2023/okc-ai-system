import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountySourceResolutionIntelligence,
  type CountySourceResolutionInput,
  type CountySourceResolutionResult,
} from "./county-source-resolution-intelligence";

const baseInput: CountySourceResolutionInput = {
  countyName: "Oklahoma County",
  sourceName: "Treasurer public record source",
  sourceType: "county_tax_record",
  priorEscalationSeverity: "high",
  priorEscalationClassification: "governance_conflict",
  priorWarningCodes: ["UNRESOLVED_GOVERNANCE_CONFLICT"],
  unresolvedGovernanceConflicts: [],
  resolvedGovernanceConflicts: ["County source review owner confirmed."],
  humanReviewCompleted: true,
  humanReviewOutcome: "approved",
  escalationPathCompleted: true,
  escalationPathResolvedConflict: true,
  governanceDeadlockPreviouslyDetected: false,
  governanceDeadlockResolved: false,
  confidenceBeforeReview: 0.61,
  confidenceAfterReview: 0.86,
  confidenceStabilized: true,
  planningRestrictionActive: false,
  requestedPlanningContinuation: true,
  explainabilityContext: {
    reviewedLayers: ["S12 decision support", "S13 escalation intelligence"],
    notes: ["resolution review complete"],
  },
};

const evaluate = (overrides: Partial<CountySourceResolutionInput> = {}) =>
  evaluateCountySourceResolutionIntelligence({
    ...baseInput,
    ...overrides,
  });

const assertFailClosed = (result: CountySourceResolutionResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Source Resolution Intelligence", () => {
  it("permits advisory planning for fully resolved conflicts while preserving fail-closed flags", () => {
    const result = evaluate();

    assert.equal(result.resolutionClassification, "fully_resolved");
    assert.equal(result.resolutionSeverity, "none");
    assert.equal(result.planningMayContinue, true);
    assert.equal(result.planningRestricted, false);
    assert.equal(result.warningDeEscalationAllowed, true);
    assertFailClosed(result);
  });

  it("downgrades approved-with-restrictions results but keeps planning restricted", () => {
    const result = evaluate({
      humanReviewOutcome: "approved_with_restrictions",
    });

    assert.equal(result.resolutionClassification, "resolved_with_restrictions");
    assert.equal(result.resolutionSeverity, "low");
    assert.equal(result.planningMayContinue, true);
    assert.equal(result.planningRestricted, true);
    assert.equal(result.additionalReviewRequired, false);
  });

  it("keeps unresolved deadlock critical and blocks planning", () => {
    const result = evaluate({
      priorEscalationSeverity: "critical",
      priorEscalationClassification: "governance_deadlock",
      governanceDeadlockPreviouslyDetected: true,
      governanceDeadlockResolved: false,
    });

    assert.equal(result.resolutionClassification, "unresolved_deadlock");
    assert.equal(result.resolutionSeverity, "critical");
    assert.equal(result.planningMayContinue, false);
    assert(result.warningCodes.includes("GOVERNANCE_DEADLOCK_REMAINS"));
    assert(result.warningCodes.includes("PLANNING_REMAINS_BLOCKED"));
  });

  it("requires additional review when human review is incomplete after moderate or higher escalation", () => {
    const result = evaluate({
      priorEscalationSeverity: "moderate",
      humanReviewCompleted: false,
      humanReviewOutcome: undefined,
    });

    assert.equal(result.resolutionClassification, "partially_resolved");
    assert.equal(result.additionalReviewRequired, true);
    assert.equal(result.mandatoryHumanReviewRequired, true);
    assert(result.warningCodes.includes("RESOLUTION_REVIEW_INCOMPLETE"));
  });

  it("blocks or restricts planning when human review rejects the resolution", () => {
    const result = evaluate({
      humanReviewOutcome: "rejected",
    });

    assert.equal(result.resolutionClassification, "resolution_rejected");
    assert.equal(result.resolutionSeverity, "high");
    assert.equal(result.planningMayContinue, false);
    assert(result.warningCodes.includes("HUMAN_REVIEW_REJECTED_RESOLUTION"));
  });

  it("requires another review cycle when human review is inconclusive", () => {
    const result = evaluate({
      humanReviewOutcome: "inconclusive",
    });

    assert.equal(result.resolutionClassification, "review_outcome_inconclusive");
    assert.equal(result.additionalReviewRequired, true);
    assert.equal(result.planningMayContinue, false);
    assert(result.warningCodes.includes("HUMAN_REVIEW_INCONCLUSIVE"));
  });

  it("prevents full de-escalation when confidence is not stabilized", () => {
    const result = evaluate({
      confidenceAfterReview: 0.54,
      confidenceStabilized: false,
    });

    assert.equal(result.resolutionClassification, "confidence_not_stabilized");
    assert.equal(result.resolutionSeverity, "moderate");
    assert.equal(result.warningDeEscalationAllowed, false);
    assert(result.warningCodes.includes("CONFIDENCE_NOT_STABILIZED"));
  });

  it("does not downgrade prior critical escalation without completed review and resolved deadlock", () => {
    const result = evaluate({
      priorEscalationSeverity: "critical",
      governanceDeadlockPreviouslyDetected: true,
      governanceDeadlockResolved: true,
      humanReviewCompleted: false,
      humanReviewOutcome: undefined,
    });

    assert.equal(result.resolutionClassification, "planning_remains_blocked");
    assert.equal(result.resolutionSeverity, "critical");
    assert.equal(result.planningMayContinue, false);
    assert(result.warningCodes.includes("PLANNING_REMAINS_BLOCKED"));
  });

  it("emits warning codes in deterministic order", () => {
    const result = evaluate({
      humanReviewCompleted: true,
      humanReviewOutcome: "inconclusive",
      unresolvedGovernanceConflicts: ["Review owner remains unresolved."],
      escalationPathCompleted: false,
      escalationPathResolvedConflict: false,
      governanceDeadlockPreviouslyDetected: true,
      governanceDeadlockResolved: false,
      confidenceStabilized: false,
      planningRestrictionActive: true,
    });

    assert.deepEqual(result.warningCodes, [
      "UNRESOLVED_GOVERNANCE_CONFLICT_REMAINS",
      "ESCALATION_PATH_NOT_COMPLETED",
      "ESCALATION_PATH_DID_NOT_RESOLVE_CONFLICT",
      "GOVERNANCE_DEADLOCK_REMAINS",
      "HUMAN_REVIEW_INCONCLUSIVE",
      "CONFIDENCE_NOT_STABILIZED",
      "PLANNING_RESTRICTION_REMAINS_ACTIVE",
      "ADDITIONAL_REVIEW_REQUIRED",
      "FAIL_CLOSED_PROTECTION_ACTIVE",
    ]);
  });

  it("produces identical results for repeated identical input", () => {
    const first = evaluate({
      resolvedGovernanceConflicts: ["Same resolution packet."],
      explainabilityContext: {
        reviewedLayers: ["S13"],
        notes: ["same input"],
      },
    });
    const second = evaluate({
      resolvedGovernanceConflicts: ["Same resolution packet."],
      explainabilityContext: {
        reviewedLayers: ["S13"],
        notes: ["same input"],
      },
    });

    assert.deepEqual(first, second);
  });

  it("introduces no forbidden runtime terms", () => {
    const implementationText = evaluateCountySourceResolutionIntelligence.toString().toLowerCase();

    assert.equal(implementationText.includes("fetch"), false);
    assert.equal(implementationText.includes("async"), false);
    assert.equal(implementationText.includes("prisma"), false);
    assert.equal(implementationText.includes("supabase"), false);
    assert.equal(implementationText.includes("twilio"), false);
    assert.equal(implementationText.includes("settimeout"), false);
    assert.equal(implementationText.includes("setinterval"), false);
  });
});
