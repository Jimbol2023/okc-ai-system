import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountySourceEscalationIntelligence,
  type CountySourceEscalationInput,
  type CountySourceEscalationResult,
} from "./county-source-escalation-intelligence";

const baseInput: CountySourceEscalationInput = {
  countyName: "Oklahoma County",
  sourceName: "Treasurer public record source",
  sourceType: "county_tax_record",
  governanceReadinessScore: 0.91,
  governanceDecisionConfidence: 0.88,
  unresolvedGovernanceConflicts: [],
  blockingWarnings: [],
  governanceOverrideDetected: false,
  policyContradictionDetected: false,
  survivabilityInstabilityDetected: false,
  reviewBurdenExceeded: false,
  confidenceCollapseDetected: false,
  riskEscalationDetected: false,
  requiresHumanReview: false,
  planningContinuationRequested: true,
  explainabilityContext: {
    reviewedLayers: ["S11 governance readiness", "S12 decision support"],
    notes: ["advisory-only verification"],
  },
};

const evaluate = (overrides: Partial<CountySourceEscalationInput> = {}) =>
  evaluateCountySourceEscalationIntelligence({
    ...baseInput,
    ...overrides,
  });

const assertFailClosed = (result: CountySourceEscalationResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Source Escalation Intelligence", () => {
  it("returns no escalation required when advisory signals are acceptable", () => {
    const result = evaluate();

    assert.equal(result.escalationRequired, false);
    assert.equal(result.escalationSeverity, "none");
    assert.equal(result.escalationClassification, "no_escalation_required");
    assert.equal(result.planningMayContinue, true);
    assert.equal(result.planningRestricted, false);
    assert.equal(result.mandatoryHumanReview, false);
  });

  it("returns advisory escalation for warning-only inputs", () => {
    const result = evaluate({
      blockingWarnings: ["Document source refresh assumptions before activation planning."],
    });

    assert.equal(result.escalationRequired, true);
    assert.equal(result.escalationSeverity, "low");
    assert.equal(result.escalationClassification, "advisory_escalation");
    assert.equal(result.warningsOverridePlanning, true);
    assert.equal(result.planningMayContinue, true);
  });

  it("escalates unresolved governance conflicts to at least moderate severity", () => {
    const result = evaluate({
      unresolvedGovernanceConflicts: ["County source review owner is unresolved."],
    });

    assert.equal(result.escalationClassification, "governance_conflict");
    assert.equal(result.escalationSeverity, "moderate");
    assert.equal(result.planningRestricted, true);
    assert(result.warningCodes.includes("UNRESOLVED_GOVERNANCE_CONFLICT"));
  });

  it("classifies policy contradiction as high severity", () => {
    const result = evaluate({
      policyContradictionDetected: true,
    });

    assert.equal(result.escalationClassification, "policy_conflict");
    assert.equal(result.escalationSeverity, "high");
    assert.equal(result.mandatoryHumanReview, true);
    assert(result.warningCodes.includes("POLICY_CONTRADICTION_DETECTED"));
  });

  it("classifies governance override plus policy contradiction as critical governance deadlock", () => {
    const result = evaluate({
      governanceOverrideDetected: true,
      policyContradictionDetected: true,
    });

    assert.equal(result.escalationClassification, "governance_deadlock");
    assert.equal(result.escalationSeverity, "critical");
    assert.equal(result.planningMayContinue, false);
    assert(result.warningCodes.includes("GOVERNANCE_DEADLOCK"));
  });

  it("uses confidence instability and warnings override planning when confidence collapses", () => {
    const result = evaluate({
      confidenceCollapseDetected: true,
      governanceDecisionConfidence: 0.2,
    });

    assert.equal(result.escalationClassification, "confidence_instability");
    assert.equal(result.escalationSeverity, "moderate");
    assert.equal(result.warningsOverridePlanning, true);
    assert(result.warningCodes.includes("CONFIDENCE_COLLAPSE"));
  });

  it("classifies exceeded review burden as a review burden override", () => {
    const result = evaluate({
      reviewBurdenExceeded: true,
    });

    assert.equal(result.escalationClassification, "review_burden_override");
    assert.equal(result.escalationSeverity, "moderate");
    assert.equal(result.planningRestricted, true);
    assert(result.warningCodes.includes("REVIEW_BURDEN_EXCEEDED"));
  });

  it("classifies risk escalation as a risk override", () => {
    const result = evaluate({
      riskEscalationDetected: true,
    });

    assert.equal(result.escalationClassification, "risk_override");
    assert.equal(result.escalationSeverity, "high");
    assert.equal(result.mandatoryHumanReview, true);
    assert(result.warningCodes.includes("RISK_ESCALATION_ACTIVE"));
  });

  it("forces high severity when human review is required", () => {
    const result = evaluate({
      requiresHumanReview: true,
    });

    assert.equal(result.escalationClassification, "mandatory_human_review");
    assert.equal(result.escalationSeverity, "high");
    assert.equal(result.mandatoryHumanReview, true);
    assert(result.warningCodes.includes("MANDATORY_HUMAN_REVIEW_REQUIRED"));
  });

  it("blocks planning for critical escalation", () => {
    const result = evaluate({
      blockingWarnings: ["CRITICAL escalation requires executive review."],
    });

    assert.equal(result.escalationClassification, "critical_escalation");
    assert.equal(result.escalationSeverity, "critical");
    assert.equal(result.planningMayContinue, false);
    assert(result.warningCodes.includes("PLANNING_BLOCKED"));
  });

  it("restricts planning for moderate and high escalation", () => {
    const moderate = evaluate({
      unresolvedGovernanceConflicts: ["Missing review authority."],
    });
    const high = evaluate({
      policyContradictionDetected: true,
    });

    assert.equal(moderate.planningRestricted, true);
    assert.equal(moderate.planningMayContinue, true);
    assert.equal(high.planningRestricted, true);
    assert.equal(high.planningMayContinue, true);
  });

  it("emits deterministic warning codes in stable order", () => {
    const result = evaluate({
      unresolvedGovernanceConflicts: ["Missing review authority."],
      policyContradictionDetected: true,
      confidenceCollapseDetected: true,
      reviewBurdenExceeded: true,
      riskEscalationDetected: true,
      requiresHumanReview: true,
    });

    assert.deepEqual(result.warningCodes, [
      "UNRESOLVED_GOVERNANCE_CONFLICT",
      "POLICY_CONTRADICTION_DETECTED",
      "CONFIDENCE_COLLAPSE",
      "REVIEW_BURDEN_EXCEEDED",
      "RISK_ESCALATION_ACTIVE",
      "MANDATORY_HUMAN_REVIEW_REQUIRED",
      "PLANNING_RESTRICTED",
      "FAIL_CLOSED_PROTECTION_ACTIVE",
    ]);
  });

  it("always preserves fail-closed flags", () => {
    const scenarios = [
      evaluate(),
      evaluate({ blockingWarnings: ["Advisory note."] }),
      evaluate({ policyContradictionDetected: true }),
      evaluate({ governanceOverrideDetected: true, policyContradictionDetected: true }),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });

  it("produces identical results for repeated identical input", () => {
    const first = evaluate({
      unresolvedGovernanceConflicts: ["Unresolved chain of authority."],
      explainabilityContext: {
        reviewedLayers: ["S11", "S12"],
        notes: ["same input"],
      },
    });
    const second = evaluate({
      unresolvedGovernanceConflicts: ["Unresolved chain of authority."],
      explainabilityContext: {
        reviewedLayers: ["S11", "S12"],
        notes: ["same input"],
      },
    });

    assert.deepEqual(first, second);
  });

  it("introduces no runtime/provider/automation behavior", () => {
    const implementationText = evaluateCountySourceEscalationIntelligence.toString();

    assert.equal(implementationText.includes("fetch("), false);
    assert.equal(implementationText.includes("async "), false);
    assert.equal(implementationText.includes("prisma"), false);
    assert.equal(implementationText.includes("supabase"), false);
    assert.equal(implementationText.includes("twilio"), false);
    assert.equal(implementationText.includes("setTimeout"), false);
    assert.equal(implementationText.includes("setInterval"), false);
  });
});
