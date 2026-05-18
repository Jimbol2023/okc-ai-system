import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceConvergence,
  type CountyGovernanceConvergenceInput,
  type CountyGovernanceConvergenceResult,
} from "./county-governance-convergence-intelligence";

const baseInput: CountyGovernanceConvergenceInput = {
  countyName: "Oklahoma County",
  sourceName: "Treasurer public record source",
  sourceType: "county_tax_record",
  currentGovernanceConfidenceScore: 86,
  previousGovernanceConfidenceScore: 84,
  baselineGovernanceConfidenceScore: 82,
  currentRiskScore: 28,
  previousRiskScore: 36,
  currentReviewBurdenScore: 32,
  previousReviewBurdenScore: 41,
  currentContinuityClassification: "stable_with_monitoring",
  previousContinuityClassification: "fragile_continuity",
  currentWarningCodes: ["FAIL_CLOSED_PROTECTION_ACTIVE"],
  previousWarningCodes: ["FAIL_CLOSED_PROTECTION_ACTIVE", "REVIEW_BURDEN_NOT_NORMALIZED"],
  unresolvedWarningCodes: [],
  suppressedWarningCodes: [],
  escalationCycleCount: 1,
  previousEscalationCycleCount: 2,
  governanceDecisionChangeCount: 0,
  inconsistentDecisionCount: 0,
  unresolvedDivergenceCount: 0,
  resolutionReversalCount: 0,
  convergenceEvidenceScore: 88,
  coherenceEvidenceScore: 90,
  stabilizationDurabilityScore: 89,
  monitoringWindowComplete: true,
  failClosedElevatedCurrently: false,
  explainabilityContext: {
    reviewedSignals: ["S16 drift intelligence", "S15 continuity intelligence"],
    notes: ["convergence review packet complete"],
  },
};

const evaluate = (overrides: Partial<CountyGovernanceConvergenceInput> = {}) =>
  evaluateCountyGovernanceConvergence({
    ...baseInput,
    ...overrides,
  });

const assertFailClosed = (result: CountyGovernanceConvergenceResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Governance Convergence Intelligence", () => {
  it("returns convergence unverified and fail-closed flags for missing input", () => {
    const result = evaluateCountyGovernanceConvergence();

    assert.equal(result.convergenceClassification, "convergence_unverified");
    assert.equal(result.convergenceSeverity, "elevated");
    assert.equal(result.convergenceStabilityLevel, "unverified");
    assert(result.warningCodes.includes("INSUFFICIENT_CONVERGENCE_EVIDENCE"));
    assertFailClosed(result);
  });

  it("classifies strong converging signals as durable convergence", () => {
    const result = evaluate();

    assert.equal(result.convergenceClassification, "durable_convergence");
    assert.equal(result.convergenceSeverity, "low");
    assert.equal(result.convergenceStabilityLevel, "durable");
    assert.equal(result.convergenceDurable, true);
    assert.equal(result.planningMayContinue, true);
  });

  it("classifies coherent improving decisions as governance coherence maturing", () => {
    const result = evaluate({
      convergenceEvidenceScore: 78,
      coherenceEvidenceScore: 84,
      stabilizationDurabilityScore: 82,
      currentWarningCodes: ["FAIL_CLOSED_PROTECTION_ACTIVE", "REVIEW_BURDEN_NOT_NORMALIZED"],
      previousWarningCodes: ["FAIL_CLOSED_PROTECTION_ACTIVE", "REVIEW_BURDEN_NOT_NORMALIZED"],
    });

    assert.equal(result.convergenceClassification, "governance_coherence_maturing");
    assert.equal(result.convergenceStabilityLevel, "stable");
    assert.equal(result.governanceDecisionsConsistent, true);
  });

  it("classifies partial improvement with weak evidence as fragile convergence", () => {
    const result = evaluate({
      convergenceEvidenceScore: 62,
      coherenceEvidenceScore: 68,
      stabilizationDurabilityScore: 66,
      currentWarningCodes: ["FAIL_CLOSED_PROTECTION_ACTIVE", "REVIEW_BURDEN_NOT_NORMALIZED"],
      previousWarningCodes: ["FAIL_CLOSED_PROTECTION_ACTIVE", "REVIEW_BURDEN_NOT_NORMALIZED"],
    });

    assert.equal(result.convergenceClassification, "fragile_convergence");
    assert.equal(result.convergenceFragile, true);
    assert(result.warningCodes.includes("CONVERGENCE_FRAGILE"));
  });

  it("flags temporary stabilization when durability is weak", () => {
    const result = evaluate({
      convergenceEvidenceScore: 82,
      coherenceEvidenceScore: 82,
      stabilizationDurabilityScore: 52,
    });

    assert.equal(result.convergenceClassification, "temporary_stabilization");
    assert.equal(result.temporaryStabilizationSuspected, true);
    assert(result.warningCodes.includes("TEMPORARY_STABILIZATION_SUSPECTED"));
  });

  it("flags warning suppression without resolution", () => {
    const result = evaluate({
      suppressedWarningCodes: ["REVIEW_BURDEN_NOT_NORMALIZED"],
      unresolvedWarningCodes: ["REVIEW_BURDEN_NOT_NORMALIZED"],
    });

    assert.equal(result.convergenceClassification, "fail_closed_convergence_required");
    assert.equal(result.suppressionWithoutResolutionDetected, true);
    assert.equal(result.failClosedShouldRemainElevated, true);
    assert(result.warningCodes.includes("WARNING_SUPPRESSION_WITHOUT_RESOLUTION"));
    assert(result.warningCodes.includes("FAIL_CLOSED_CONVERGENCE_REQUIRED"));
  });

  it("flags unresolved divergence beneath apparent convergence", () => {
    const result = evaluate({
      unresolvedDivergenceCount: 1,
      convergenceEvidenceScore: 82,
      coherenceEvidenceScore: 82,
      stabilizationDurabilityScore: 82,
    });

    assert.equal(result.convergenceClassification, "unresolved_divergence");
    assert.equal(result.unresolvedDivergenceDetected, true);
    assert(result.warningCodes.includes("UNRESOLVED_DIVERGENCE_REMAINS"));
  });

  it("flags coherent but unresolved governance state", () => {
    const result = evaluate({
      currentContinuityClassification: "fragile_continuity",
      previousContinuityClassification: "fragile_continuity",
      currentRiskScore: 28,
      currentReviewBurdenScore: 32,
      unresolvedWarningCodes: [],
      unresolvedDivergenceCount: 0,
      convergenceEvidenceScore: 82,
      coherenceEvidenceScore: 86,
      stabilizationDurabilityScore: 82,
    });

    assert.equal(result.convergenceClassification, "coherent_but_unresolved");
    assert(result.warningCodes.includes("COHERENT_BUT_UNRESOLVED_STATE"));
  });

  it("flags masked instability when confidence stabilizes but risk remains high", () => {
    const result = evaluate({
      currentRiskScore: 68,
      previousRiskScore: 70,
      currentReviewBurdenScore: 36,
      previousReviewBurdenScore: 43,
    });

    assert.equal(result.convergenceClassification, "fail_closed_convergence_required");
    assert.equal(result.maskedInstabilitySuspected, true);
    assert(result.warningCodes.includes("MASKED_INSTABILITY_SUSPECTED"));
  });

  it("flags decision inconsistency as not mature convergence", () => {
    const result = evaluate({
      governanceDecisionChangeCount: 2,
      convergenceEvidenceScore: 82,
      coherenceEvidenceScore: 82,
      stabilizationDurabilityScore: 82,
    });

    assert.notEqual(result.convergenceClassification, "durable_convergence");
    assert.equal(result.governanceDecisionsConsistent, false);
    assert(result.warningCodes.includes("GOVERNANCE_DECISIONS_STILL_INCONSISTENT"));
  });

  it("clamps scores and counts deterministically", () => {
    const result = evaluate({
      currentGovernanceConfidenceScore: 120,
      previousGovernanceConfidenceScore: -10,
      baselineGovernanceConfidenceScore: Number.NaN,
      currentRiskScore: 101,
      previousRiskScore: -1,
      currentReviewBurdenScore: 150,
      previousReviewBurdenScore: 100,
      convergenceEvidenceScore: 140,
      coherenceEvidenceScore: -20,
      stabilizationDurabilityScore: Number.NaN,
      escalationCycleCount: 1.8,
      previousEscalationCycleCount: 4.4,
    });

    assert.equal(result.governanceConfidenceDelta, 100);
    assert.equal(result.riskDelta, 100);
    assert.equal(result.reviewBurdenDelta, 0);
    assert.equal(result.escalationCycleDelta, -3);
  });

  it("reports convergence integrity, confidence reliability, suppression risk, and maturity levels", () => {
    const result = evaluate();

    assert.equal(result.convergenceIntegrityLevel, "strong");
    assert.equal(result.confidenceReliabilityLevel, "strong");
    assert.equal(result.suppressionRiskLevel, "none");
    assert.equal(result.governanceCoherenceMaturity, "mature");
  });

  it("reports signal agreement summary and durability explainability", () => {
    const result = evaluate();

    assert.equal(result.signalAgreementSummary.positiveSignalCount, 7);
    assert.equal(result.signalAgreementSummary.conflictingSignalCount, 0);
    assert.equal(result.signalAgreementSummary.unresolvedSignalCount, 0);
    assert(result.explainability.durabilityEvidence.stabilizationSignals.length > 0);
    assert(result.explainability.durabilityEvidence.continuitySignals.length > 0);
    assert(result.explainability.durabilityEvidence.divergenceSignals.length > 0);
    assert(result.explainability.durabilityEvidence.suppressionSignals.length > 0);
  });

  it("normalizes and de-duplicates warning codes before evaluating warning deltas", () => {
    const result = evaluate({
      previousWarningCodes: [" warning_a ", "WARNING_A", "WARNING_B"],
      currentWarningCodes: ["warning_a"],
      unresolvedWarningCodes: [],
    });

    assert.equal(result.warningCountDelta, -1);
    assert.equal(result.warningPatternShrinking, true);
  });

  it("preserves literal fail-closed flags for all outputs", () => {
    const scenarios = [
      evaluate(),
      evaluate({ stabilizationDurabilityScore: 52 }),
      evaluate({ suppressedWarningCodes: ["WARNING"], unresolvedWarningCodes: ["WARNING"] }),
      evaluateCountyGovernanceConvergence(),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });
});
