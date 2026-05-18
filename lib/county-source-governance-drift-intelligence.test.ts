import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountySourceGovernanceDrift,
  type CountySourceGovernanceDriftInput,
  type CountySourceGovernanceDriftResult,
} from "./county-source-governance-drift-intelligence";

const baseInput: CountySourceGovernanceDriftInput = {
  countyName: "Oklahoma County",
  sourceName: "Treasurer public record source",
  sourceType: "county_tax_record",
  currentGovernanceConfidenceScore: 86,
  previousGovernanceConfidenceScore: 84,
  baselineGovernanceConfidenceScore: 82,
  currentRiskScore: 22,
  previousRiskScore: 24,
  baselineRiskScore: 25,
  currentReviewBurdenScore: 34,
  previousReviewBurdenScore: 33,
  currentContinuityClassification: "stable_with_monitoring",
  previousContinuityClassification: "stable_with_monitoring",
  escalationThresholdChangeCount: 0,
  escalationCycleCount: 0,
  resolutionReversalCount: 0,
  governanceDecisionChangeCount: 0,
  inconsistentDecisionCount: 0,
  warningCodeHistory: ["FAIL_CLOSED_PROTECTION_ACTIVE"],
  currentWarningCodes: ["FAIL_CLOSED_PROTECTION_ACTIVE"],
  newlyIntroducedWarningCodes: [],
  monitoringWindowComplete: true,
  failClosedElevatedCurrently: false,
  explainabilityContext: {
    reviewedSignals: ["S15 continuity intelligence", "S14 resolution intelligence"],
    notes: ["drift monitoring packet complete"],
  },
};

const evaluate = (overrides: Partial<CountySourceGovernanceDriftInput> = {}) =>
  evaluateCountySourceGovernanceDrift({
    ...baseInput,
    ...overrides,
  });

const assertFailClosed = (result: CountySourceGovernanceDriftResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Source Governance Drift Intelligence", () => {
  it("returns drift unverified and fail-closed flags for missing input", () => {
    const result = evaluateCountySourceGovernanceDrift();

    assert.equal(result.driftClassification, "drift_unverified");
    assert.equal(result.driftSeverity, "elevated");
    assert(result.warningCodes.includes("INSUFFICIENT_DRIFT_EVIDENCE"));
    assertFailClosed(result);
  });

  it("classifies stable supplied governance drift signals as no drift detected", () => {
    const result = evaluate();

    assert.equal(result.driftClassification, "no_drift_detected");
    assert.equal(result.driftSeverity, "low");
    assert.equal(result.planningMayContinue, true);
    assert.equal(result.monitoringRequired, false);
  });

  it("flags governance confidence erosion", () => {
    const result = evaluate({
      currentGovernanceConfidenceScore: 68,
      previousGovernanceConfidenceScore: 82,
    });

    assert.equal(result.driftClassification, "confidence_erosion");
    assert.equal(result.confidenceTrend, "eroding");
    assert(result.warningCodes.includes("GOVERNANCE_CONFIDENCE_ERODING"));
  });

  it("flags risk posture degradation", () => {
    const result = evaluate({
      currentRiskScore: 44,
      previousRiskScore: 28,
    });

    assert.equal(result.driftClassification, "risk_posture_degradation");
    assert.equal(result.riskTrend, "degrading");
    assert(result.warningCodes.includes("RISK_POSTURE_DEGRADING"));
  });

  it("flags warning pattern expansion", () => {
    const result = evaluate({
      currentWarningCodes: ["FAIL_CLOSED_PROTECTION_ACTIVE", "NEW_REVIEW_WARNING"],
      newlyIntroducedWarningCodes: ["NEW_REVIEW_WARNING"],
    });

    assert.equal(result.driftClassification, "warning_pattern_expansion");
    assert.equal(result.warningPatternExpanded, true);
    assert(result.warningCodes.includes("WARNING_PATTERN_EXPANDING"));
  });

  it("flags escalation threshold instability", () => {
    const result = evaluate({
      escalationThresholdChangeCount: 2,
    });

    assert.equal(result.driftClassification, "escalation_threshold_instability");
    assert.equal(result.escalationThresholdUnstable, true);
    assert(result.warningCodes.includes("ESCALATION_THRESHOLD_UNSTABLE"));
  });

  it("flags governance decision inconsistency", () => {
    const result = evaluate({
      governanceDecisionChangeCount: 2,
    });

    assert.equal(result.driftClassification, "governance_decision_inconsistency");
    assert.equal(result.governanceDecisionInconsistencyDetected, true);
    assert(result.warningCodes.includes("GOVERNANCE_DECISION_INCONSISTENCY"));
  });

  it("flags continuity deterioration", () => {
    const result = evaluate({
      previousContinuityClassification: "stable_with_monitoring",
      currentContinuityClassification: "fragile_continuity",
    });

    assert.equal(result.driftClassification, "continuity_deterioration");
    assert.equal(result.continuityDeteriorationDetected, true);
    assert(result.warningCodes.includes("CONTINUITY_CLASSIFICATION_DETERIORATED"));
  });

  it("flags review burden increase as minor monitoring drift", () => {
    const result = evaluate({
      currentReviewBurdenScore: 58,
      previousReviewBurdenScore: 42,
    });

    assert.equal(result.driftClassification, "minor_monitoring_drift");
    assert.equal(result.reviewBurdenTrend, "increasing");
    assert(result.warningCodes.includes("REVIEW_BURDEN_INCREASING"));
  });

  it("flags resolution reversals as hidden instability and fail-closed tightening", () => {
    const result = evaluate({
      resolutionReversalCount: 1,
    });

    assert.equal(result.driftClassification, "fail_closed_tightening_required");
    assert.equal(result.hiddenInstabilitySuspected, true);
    assert.equal(result.failClosedShouldTighten, true);
    assert(result.warningCodes.includes("RESOLUTION_REVERSALS_DETECTED"));
    assert(result.warningCodes.includes("HIDDEN_INSTABILITY_SUSPECTED"));
    assert(result.warningCodes.includes("FAIL_CLOSED_TIGHTENING_RECOMMENDED"));
  });

  it("recommends fail-closed tightening for combined confidence and risk drift", () => {
    const result = evaluate({
      currentGovernanceConfidenceScore: 55,
      previousGovernanceConfidenceScore: 80,
      currentRiskScore: 62,
      previousRiskScore: 35,
    });

    assert.equal(result.driftClassification, "fail_closed_tightening_required");
    assert.equal(result.driftSeverity, "critical");
    assert.equal(result.failClosedShouldTighten, true);
  });

  it("clamps scores and counts deterministically", () => {
    const result = evaluate({
      currentGovernanceConfidenceScore: 140,
      previousGovernanceConfidenceScore: -20,
      baselineGovernanceConfidenceScore: Number.NaN,
      currentRiskScore: 101,
      previousRiskScore: -1,
      currentReviewBurdenScore: 150,
      previousReviewBurdenScore: 101,
      escalationThresholdChangeCount: 2.9,
    });

    assert.equal(result.governanceConfidenceScore, 100);
    assert.equal(result.previousGovernanceConfidenceScore, 0);
    assert.equal(result.baselineGovernanceConfidenceScore, 0);
    assert.equal(result.riskScore, 100);
    assert.equal(result.previousRiskScore, 0);
    assert.equal(result.reviewBurdenScore, 100);
    assert.equal(result.previousReviewBurdenScore, 100);
    assert.equal(result.escalationThresholdUnstable, true);
  });

  it("preserves literal fail-closed flags for all outputs", () => {
    const scenarios = [
      evaluate(),
      evaluate({ currentGovernanceConfidenceScore: 68, previousGovernanceConfidenceScore: 82 }),
      evaluate({ resolutionReversalCount: 1 }),
      evaluateCountySourceGovernanceDrift(),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });
});
