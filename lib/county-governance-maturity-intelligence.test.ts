import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceMaturity,
  type CountyGovernanceMaturityInput,
  type CountyGovernanceMaturityResult,
} from "./county-governance-maturity-intelligence";

const baseInput: CountyGovernanceMaturityInput = {
  countyName: "Oklahoma County",
  sourceName: "Treasurer public record source",
  sourceType: "county_tax_record",
  governanceReadinessClassification: "governance_ready",
  decisionSupportClassification: "stable_decision_supported",
  escalationClassification: "no_escalation_required",
  resolutionClassification: "fully_resolved",
  continuityClassification: "durable_continuity",
  driftClassification: "no_drift_detected",
  convergenceClassification: "durable_convergence",
  governanceConfidenceScore: 92,
  governanceReliabilityScore: 91,
  explainabilityScore: 93,
  resilienceEvidenceScore: 92,
  coherenceEvidenceScore: 94,
  durabilityEvidenceScore: 93,
  failClosedDisciplineScore: 94,
  unresolvedWarningCount: 0,
  suppressedWarningCount: 0,
  escalationCycleCount: 0,
  resolutionReversalCount: 0,
  inconsistentDecisionCount: 0,
  driftEventCount: 0,
  convergenceEvidenceScore: 93,
  currentWarningCodes: ["FAIL_CLOSED_PROTECTION_ACTIVE"],
  priorWarningCodes: ["FAIL_CLOSED_PROTECTION_ACTIVE"],
  unresolvedWarningCodes: [],
  suppressedWarningCodes: [],
  monitoringWindowComplete: true,
  stressSignalsPresent: true,
  failClosedElevatedCurrently: true,
  explainabilityContext: {
    reviewedSignals: ["S11 readiness", "S17 convergence"],
    notes: ["maturity review packet complete"],
  },
};

const evaluate = (overrides: Partial<CountyGovernanceMaturityInput> = {}) =>
  evaluateCountyGovernanceMaturity({
    ...baseInput,
    ...overrides,
  });

const assertFailClosed = (result: CountyGovernanceMaturityResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Governance Maturity Intelligence", () => {
  it("returns maturity unverified and fail-closed flags for missing input", () => {
    const result = evaluateCountyGovernanceMaturity();

    assert.equal(result.maturityClassification, "maturity_unverified");
    assert.equal(result.maturitySeverity, "elevated");
    assert.equal(result.stabilityLevel, "unverified");
    assert(result.warningCodes.includes("INSUFFICIENT_MATURITY_EVIDENCE"));
    assertFailClosed(result);
  });

  it("classifies complete stress-tested evidence as institutional grade governance", () => {
    const result = evaluate();

    assert.equal(result.maturityClassification, "institutional_grade_governance");
    assert.equal(result.maturitySeverity, "low");
    assert.equal(result.maturityLevel, "institutional");
    assert.equal(result.stabilityLevel, "stress_tested");
    assert.equal(result.integrityLevel, "institutional");
    assert.equal(result.resilienceLevel, "stress_resilient");
    assert.equal(result.coherenceLevel, "institutional");
    assert.equal(result.institutionalReadinessDetected, true);
    assert.equal(result.planningMayContinue, true);
  });

  it("classifies durable but not institutional maturity when stress testing is absent", () => {
    const result = evaluate({
      stressSignalsPresent: false,
    });

    assert.equal(result.maturityClassification, "durable_maturity");
    assert.equal(result.institutionalReadinessDetected, false);
    assert(result.warningCodes.includes("INSTITUTIONAL_GRADE_NOT_PROVEN"));
  });

  it("detects false maturity when high scores conflict with unresolved warnings", () => {
    const result = evaluate({
      unresolvedWarningCount: 1,
      unresolvedWarningCodes: ["REVIEW_BURDEN_NOT_NORMALIZED"],
    });

    assert.equal(result.maturityClassification, "false_maturity_suspected");
    assert.equal(result.falseMaturitySuspected, true);
    assert.equal(result.failClosedShouldRemainElevated, true);
    assert(result.warningCodes.includes("FALSE_MATURITY_SUSPECTED"));
  });

  it("requires fail-closed maturity when suppression is mistaken for maturity", () => {
    const result = evaluate({
      suppressedWarningCount: 1,
      suppressedWarningCodes: ["CONVERGENCE_FRAGILE"],
      durabilityEvidenceScore: 70,
    });

    assert.equal(result.maturityClassification, "fail_closed_maturity_required");
    assert(result.warningCodes.includes("SUPPRESSION_MISTAKEN_FOR_MATURITY"));
    assert(result.warningCodes.includes("FAIL_CLOSED_MATURITY_REQUIRED"));
  });

  it("detects surface maturity from low warnings with weak supporting evidence", () => {
    const result = evaluate({
      explainabilityScore: 60,
      resilienceEvidenceScore: 62,
      durabilityEvidenceScore: 62,
      currentWarningCodes: [],
      priorWarningCodes: ["REVIEW_BURDEN_NOT_NORMALIZED", "DRIFT_RESISTANCE_WEAK"],
      failClosedElevatedCurrently: false,
    });

    assert.equal(result.maturityClassification, "surface_maturity");
    assert.equal(result.surfaceMaturityDetected, true);
    assert(result.warningCodes.includes("SURFACE_MATURITY_DETECTED"));
    assert(result.warningCodes.includes("LOW_WARNINGS_WITH_WEAK_EVIDENCE"));
  });

  it("detects mature but not resilient governance before durable maturity", () => {
    const result = evaluate({
      resilienceEvidenceScore: 52,
      driftClassification: "no_drift_detected",
      driftEventCount: 0,
      stressSignalsPresent: false,
    });

    assert.equal(result.maturityClassification, "mature_but_not_resilient");
    assert.equal(result.matureButNotResilientDetected, true);
    assert(result.warningCodes.includes("MATURE_BUT_NOT_RESILIENT"));
  });

  it("detects maturity under stress when stress signals expose weak resilience", () => {
    const result = evaluate({
      resilienceEvidenceScore: 74,
      driftClassification: "minor_monitoring_drift",
      stressSignalsPresent: true,
      failClosedElevatedCurrently: false,
    });

    assert.equal(result.maturityClassification, "maturity_under_stress");
    assert.equal(result.maturityUnderStress, true);
    assert(result.warningCodes.includes("MATURITY_UNDER_STRESS"));
  });

  it("detects governance discipline degradation from inconsistent decisions", () => {
    const result = evaluate({
      inconsistentDecisionCount: 1,
      coherenceEvidenceScore: 72,
      failClosedElevatedCurrently: false,
    });

    assert.equal(result.maturityClassification, "governance_discipline_degradation");
    assert.equal(result.escalationResolutionHealthy, false);
    assert(result.warningCodes.includes("GOVERNANCE_DISCIPLINE_DEGRADING"));
  });

  it("detects fragile maturity when durability is weak despite usable progress", () => {
    const result = evaluate({
      governanceConfidenceScore: 72,
      governanceReliabilityScore: 72,
      explainabilityScore: 72,
      resilienceEvidenceScore: 72,
      coherenceEvidenceScore: 72,
      durabilityEvidenceScore: 50,
      failClosedDisciplineScore: 82,
      continuityClassification: "fragile_continuity",
      convergenceEvidenceScore: 72,
      stressSignalsPresent: false,
      failClosedElevatedCurrently: false,
    });

    assert.equal(result.maturityClassification, "fragile_maturity");
    assert.equal(result.fragileMaturityDetected, true);
    assert(result.warningCodes.includes("FRAGILE_MATURITY_DETECTED"));
  });

  it("classifies coherent but immature governance separately from mature governance", () => {
    const result = evaluate({
      governanceReadinessClassification: "readiness_unverified",
      governanceConfidenceScore: 44,
      governanceReliabilityScore: 48,
      explainabilityScore: 78,
      resilienceEvidenceScore: 82,
      coherenceEvidenceScore: 84,
      durabilityEvidenceScore: 82,
      failClosedDisciplineScore: 84,
      convergenceEvidenceScore: 82,
      stressSignalsPresent: false,
      failClosedElevatedCurrently: false,
    });

    assert.equal(result.maturityClassification, "coherent_but_immature");
    assert.equal(result.coherenceLevel, "durable");
    assert.notEqual(result.maturityLevel, "mature");
  });

  it("flags resolution reversals as undercutting maturity", () => {
    const result = evaluate({
      resolutionReversalCount: 1,
      failClosedElevatedCurrently: false,
    });

    assert.equal(result.maturityClassification, "false_maturity_suspected");
    assert(result.warningCodes.includes("RESOLUTION_REVERSALS_UNDERCUT_MATURITY"));
  });

  it("clamps scores, counts, and warning codes deterministically", () => {
    const result = evaluate({
      governanceConfidenceScore: 120,
      governanceReliabilityScore: -10,
      explainabilityScore: Number.NaN,
      resilienceEvidenceScore: 140,
      coherenceEvidenceScore: -20,
      durabilityEvidenceScore: 80.6,
      failClosedDisciplineScore: 88.4,
      unresolvedWarningCount: -2,
      suppressedWarningCount: 1.8,
      escalationCycleCount: 2.9,
      resolutionReversalCount: Number.NaN,
      inconsistentDecisionCount: -1,
      driftEventCount: 1.9,
      convergenceEvidenceScore: 101,
      unresolvedWarningCodes: [" warning_a ", "WARNING_A"],
      suppressedWarningCodes: [" warning_b ", "WARNING_B"],
    });

    assert.equal(result.governanceMaturityScore >= 0, true);
    assert.equal(result.governanceMaturityScore <= 100, true);
    assert.equal(result.maturityContradictionSummary.unresolvedContradictionsPresent, true);
  });

  it("reports maturity evidence explainability buckets", () => {
    const result = evaluate();

    assert(result.explainability.maturityEvidence.governanceSignals.length > 0);
    assert(result.explainability.maturityEvidence.resilienceSignals.length > 0);
    assert(result.explainability.maturityEvidence.durabilitySignals.length > 0);
    assert(result.explainability.maturityEvidence.contradictionSignals.length > 0);
    assert(result.explainability.maturityEvidence.failClosedSignals.length > 0);
  });

  it("preserves literal fail-closed flags for all outputs", () => {
    const scenarios = [
      evaluate(),
      evaluate({ unresolvedWarningCount: 1 }),
      evaluate({ resilienceEvidenceScore: 50 }),
      evaluateCountyGovernanceMaturity(),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });
});
