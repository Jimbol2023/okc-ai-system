import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceEntropyDoctrineRestorationTraceIntegrity,
  type CountyGovernanceEntropyDoctrineRestorationTraceIntegrityInput,
} from "./county-governance-entropy-doctrine-restoration-trace-integrity-intelligence";

const baseInput: CountyGovernanceEntropyDoctrineRestorationTraceIntegrityInput = {
  restorationTraceIntegrityLevel: "strong",
  warningTraceabilityLevel: "strong",
  classificationTraceabilityLevel: "strong",
  evidenceChainCompletenessLevel: "strong",
  doctrineTransitionAuditabilityLevel: "strong",
  nonRegressionTraceConfidenceLevel: "strong",
  survivabilityContinuityTraceConsistencyLevel: "strong",
  failClosedTracePreservationLevel: "strong",
  decisionLineageClarityLevel: "strong",
  traceConflictLevel: "low",
  traceCollapseExposureLevel: "low",
  operationalTraceSustainabilityLevel: "viable",
  missingTraceEvidenceCount: 0,
  unresolvedTraceConflictCount: 0,
  untraceableWarningCount: 0,
  untraceableClassificationCount: 0,
  transitionGapCount: 0,
  nonRegressionGapCount: 0,
  lineageBreakCount: 0,
  traceRegressionEventCount: 0,
};

function evaluate(input: Partial<CountyGovernanceEntropyDoctrineRestorationTraceIntegrityInput>) {
  return evaluateCountyGovernanceEntropyDoctrineRestorationTraceIntegrity({
    ...baseInput,
    ...input,
  });
}

function assertFailClosedFlags(
  result: ReturnType<typeof evaluateCountyGovernanceEntropyDoctrineRestorationTraceIntegrity>,
): void {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Entropy Doctrine Restoration Trace Integrity Intelligence", () => {
  it("fails closed as restoration_trace_integrity_unverified for missing input", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineRestorationTraceIntegrity();

    assert.equal(result.restorationTraceIntegrityClassification, "restoration_trace_integrity_unverified");
    assert.equal(result.traceReadinessClassification, "readiness_unverified");
    assert.equal(result.traceSafetyClassification, "safety_unverified");
    assert.equal(result.restorationTraceIntegrityUnverified, true);
    assert.equal(result.warningCodes.includes("S35_RESTORATION_TRACE_INTEGRITY_UNVERIFIED"), true);
    assertFailClosedFlags(result);
  });

  it("classifies durable restoration trace integrity", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineRestorationTraceIntegrity(baseInput);

    assert.equal(result.restorationTraceIntegrityClassification, "durable_restoration_trace_integrity");
    assert.equal(result.traceReadinessClassification, "ready");
    assert.equal(result.traceSafetyClassification, "safe");
  });

  it("classifies conditional restoration trace integrity", () => {
    const result = evaluate({
      restorationTraceIntegrityLevel: "adequate",
      warningTraceabilityLevel: "adequate",
      classificationTraceabilityLevel: "adequate",
      evidenceChainCompletenessLevel: "adequate",
      doctrineTransitionAuditabilityLevel: "adequate",
      nonRegressionTraceConfidenceLevel: "adequate",
      survivabilityContinuityTraceConsistencyLevel: "adequate",
      failClosedTracePreservationLevel: "adequate",
      decisionLineageClarityLevel: "adequate",
      traceConflictLevel: "none",
      traceCollapseExposureLevel: "none",
      operationalTraceSustainabilityLevel: "viable",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "conditional_restoration_trace_integrity");
  });

  it("classifies partial restoration trace integrity", () => {
    const result = evaluate({
      restorationTraceIntegrityLevel: "partial",
      warningTraceabilityLevel: "adequate",
      classificationTraceabilityLevel: "adequate",
      evidenceChainCompletenessLevel: "adequate",
      doctrineTransitionAuditabilityLevel: "adequate",
      nonRegressionTraceConfidenceLevel: "adequate",
      survivabilityContinuityTraceConsistencyLevel: "adequate",
      failClosedTracePreservationLevel: "adequate",
      decisionLineageClarityLevel: "adequate",
      traceConflictLevel: "none",
      traceCollapseExposureLevel: "none",
      operationalTraceSustainabilityLevel: "viable",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "partial_restoration_trace_integrity");
  });

  it("detects blocked trace classification", () => {
    const result = evaluate({
      operationalTraceSustainabilityLevel: "unknown",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "restoration_trace_integrity_blocked");
    assert.equal(result.traceIntegrityBlocked, true);
    assert.equal(result.warningCodes.includes("S35_RESTORATION_TRACE_BLOCKED"), true);
  });

  it("detects unsafe trace classification", () => {
    const result = evaluate({
      restorationTraceIntegrityLevel: "weak",
      warningTraceabilityLevel: "strong",
      classificationTraceabilityLevel: "strong",
      evidenceChainCompletenessLevel: "strong",
      failClosedTracePreservationLevel: "strong",
      decisionLineageClarityLevel: "strong",
      traceCollapseExposureLevel: "none",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "restoration_trace_integrity_unsafe");
    assert.equal(result.traceIntegrityUnsafe, true);
    assert.equal(result.warningCodes.includes("S35_RESTORATION_TRACE_UNSAFE"), true);
  });

  it("detects missing trace evidence", () => {
    const result = evaluate({
      missingTraceEvidenceCount: 2,
      evidenceChainCompletenessLevel: "strong",
      warningTraceabilityLevel: "strong",
      classificationTraceabilityLevel: "strong",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "incomplete_evidence_chain");
    assert.equal(result.missingTraceEvidenceDetected, true);
    assert.equal(result.warningCodes.includes("S35_MISSING_TRACE_EVIDENCE"), true);
  });

  it("detects incomplete evidence chain", () => {
    const result = evaluate({
      evidenceChainCompletenessLevel: "weak",
      warningTraceabilityLevel: "strong",
      classificationTraceabilityLevel: "strong",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "incomplete_evidence_chain");
    assert.equal(result.evidenceChainIncomplete, true);
    assert.equal(result.warningCodes.includes("S35_INCOMPLETE_EVIDENCE_CHAIN"), true);
  });

  it("detects warning traceability failure", () => {
    const result = evaluate({
      warningTraceabilityLevel: "weak",
      untraceableWarningCount: 1,
      evidenceChainCompletenessLevel: "strong",
      classificationTraceabilityLevel: "strong",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "warning_traceability_failure");
    assert.equal(result.warningTraceabilityWeakness, true);
    assert.equal(result.warningCodes.includes("S35_WARNING_TRACEABILITY_FAILURE"), true);
  });

  it("detects classification traceability failure", () => {
    const result = evaluate({
      classificationTraceabilityLevel: "weak",
      untraceableClassificationCount: 1,
      evidenceChainCompletenessLevel: "strong",
      warningTraceabilityLevel: "strong",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "classification_traceability_failure");
    assert.equal(result.classificationTraceabilityWeakness, true);
    assert.equal(result.warningCodes.includes("S35_CLASSIFICATION_TRACEABILITY_FAILURE"), true);
  });

  it("detects doctrine transition audit gap", () => {
    const result = evaluate({
      doctrineTransitionAuditabilityLevel: "weak",
      transitionGapCount: 1,
      failClosedTracePreservationLevel: "strong",
      decisionLineageClarityLevel: "strong",
      warningTraceabilityLevel: "strong",
      classificationTraceabilityLevel: "strong",
      evidenceChainCompletenessLevel: "strong",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "doctrine_transition_audit_gap");
    assert.equal(result.warningCodes.includes("S35_DOCTRINE_TRANSITION_AUDIT_GAP"), true);
  });

  it("detects non-regression trace gap", () => {
    const result = evaluate({
      nonRegressionTraceConfidenceLevel: "weak",
      nonRegressionGapCount: 1,
      failClosedTracePreservationLevel: "strong",
      decisionLineageClarityLevel: "strong",
      warningTraceabilityLevel: "strong",
      classificationTraceabilityLevel: "strong",
      evidenceChainCompletenessLevel: "strong",
      doctrineTransitionAuditabilityLevel: "strong",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "non_regression_trace_gap");
    assert.equal(result.nonRegressionTraceGapDetected, true);
    assert.equal(result.warningCodes.includes("S35_NON_REGRESSION_TRACE_GAP"), true);
  });

  it("detects survivability-continuity inconsistency", () => {
    const result = evaluate({
      survivabilityContinuityTraceConsistencyLevel: "weak",
      failClosedTracePreservationLevel: "strong",
      decisionLineageClarityLevel: "strong",
      warningTraceabilityLevel: "strong",
      classificationTraceabilityLevel: "strong",
      evidenceChainCompletenessLevel: "strong",
      doctrineTransitionAuditabilityLevel: "strong",
      nonRegressionTraceConfidenceLevel: "strong",
    });

    assert.equal(
      result.warningCodes.includes("S35_SURVIVABILITY_CONTINUITY_TRACE_INCONSISTENCY"),
      true,
    );
  });

  it("detects decision lineage break", () => {
    const result = evaluate({
      decisionLineageClarityLevel: "weak",
      lineageBreakCount: 1,
      failClosedTracePreservationLevel: "strong",
      warningTraceabilityLevel: "strong",
      classificationTraceabilityLevel: "strong",
      evidenceChainCompletenessLevel: "strong",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "decision_lineage_break");
    assert.equal(result.decisionLineageBreakDetected, true);
    assert.equal(result.warningCodes.includes("S35_DECISION_LINEAGE_BREAK"), true);
  });

  it("detects fail-closed trace degradation override", () => {
    const result = evaluate({
      failClosedTracePreservationLevel: "weak",
      warningTraceabilityLevel: "strong",
      classificationTraceabilityLevel: "strong",
      evidenceChainCompletenessLevel: "strong",
      decisionLineageClarityLevel: "strong",
      traceCollapseExposureLevel: "none",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "fail_closed_trace_degradation");
    assert.equal(result.failClosedTraceDegradation, true);
    assert.equal(result.warningCodes.includes("S35_FAIL_CLOSED_TRACE_DEGRADATION"), true);
  });

  it("detects unresolved trace conflict", () => {
    const result = evaluate({
      traceConflictLevel: "moderate",
      unresolvedTraceConflictCount: 1,
      failClosedTracePreservationLevel: "strong",
      decisionLineageClarityLevel: "strong",
      warningTraceabilityLevel: "strong",
      classificationTraceabilityLevel: "strong",
      evidenceChainCompletenessLevel: "strong",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "unresolved_trace_conflict");
    assert.equal(result.unresolvedTraceConflictDetected, true);
    assert.equal(result.warningCodes.includes("S35_UNRESOLVED_TRACE_CONFLICT"), true);
  });

  it("gives collapse-sensitive rejection precedence", () => {
    const result = evaluate({
      traceCollapseExposureLevel: "high",
      failClosedTracePreservationLevel: "weak",
      decisionLineageClarityLevel: "weak",
      traceConflictLevel: "high",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "trace_collapse_sensitive_rejection");
    assert.equal(result.traceCollapseSensitiveRejection, true);
    assert.equal(result.warningCodes.includes("S35_TRACE_COLLAPSE_SENSITIVE_REJECTION"), true);
  });

  it("detects bounded trace reevaluation classification", () => {
    const result = evaluate({
      restorationTraceIntegrityLevel: "strong",
      warningTraceabilityLevel: "strong",
      classificationTraceabilityLevel: "strong",
      evidenceChainCompletenessLevel: "strong",
      doctrineTransitionAuditabilityLevel: "adequate",
      nonRegressionTraceConfidenceLevel: "strong",
      survivabilityContinuityTraceConsistencyLevel: "strong",
      failClosedTracePreservationLevel: "strong",
      decisionLineageClarityLevel: "strong",
      traceConflictLevel: "none",
      traceCollapseExposureLevel: "none",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "bounded_trace_reevaluation_required");
    assert.equal(result.boundedTraceReevaluationRequired, true);
  });

  it("detects continuation-required classification", () => {
    const result = evaluate({
      warningTraceabilityLevel: "adequate",
      classificationTraceabilityLevel: "adequate",
      evidenceChainCompletenessLevel: "adequate",
      doctrineTransitionAuditabilityLevel: "strong",
      nonRegressionTraceConfidenceLevel: "strong",
      survivabilityContinuityTraceConsistencyLevel: "strong",
      failClosedTracePreservationLevel: "strong",
      decisionLineageClarityLevel: "strong",
      traceConflictLevel: "none",
      traceCollapseExposureLevel: "none",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "restoration_trace_continuation_required");
    assert.equal(result.traceContinuationRequired, true);
  });

  it("detects operational unsustainability", () => {
    const result = evaluate({
      operationalTraceSustainabilityLevel: "unsustainable",
      traceConflictLevel: "none",
      traceCollapseExposureLevel: "none",
    });

    assert.equal(result.restorationTraceIntegrityClassification, "operationally_unsustainable_trace_integrity");
    assert.equal(result.operationalTraceUnsustainable, true);
    assert.equal(result.warningCodes.includes("S35_OPERATIONALLY_UNSUSTAINABLE_TRACE_INTEGRITY"), true);
  });

  it("keeps warning ordering deterministic", () => {
    const result = evaluate({
      warningTraceabilityLevel: "weak",
      classificationTraceabilityLevel: "weak",
      evidenceChainCompletenessLevel: "weak",
      doctrineTransitionAuditabilityLevel: "weak",
      nonRegressionTraceConfidenceLevel: "weak",
      survivabilityContinuityTraceConsistencyLevel: "weak",
      failClosedTracePreservationLevel: "weak",
      decisionLineageClarityLevel: "weak",
      missingTraceEvidenceCount: 1,
      unresolvedTraceConflictCount: 1,
      untraceableWarningCount: 1,
      untraceableClassificationCount: 1,
      transitionGapCount: 1,
      nonRegressionGapCount: 1,
      lineageBreakCount: 1,
      traceRegressionEventCount: 1,
      traceCollapseExposureLevel: "high",
      operationalTraceSustainabilityLevel: "unsustainable",
    });

    assert.deepEqual(result.warningCodes, [
      "S35_RESTORATION_TRACE_BLOCKED",
      "S35_MISSING_TRACE_EVIDENCE",
      "S35_INCOMPLETE_EVIDENCE_CHAIN",
      "S35_WARNING_TRACEABILITY_FAILURE",
      "S35_CLASSIFICATION_TRACEABILITY_FAILURE",
      "S35_DOCTRINE_TRANSITION_AUDIT_GAP",
      "S35_NON_REGRESSION_TRACE_GAP",
      "S35_SURVIVABILITY_CONTINUITY_TRACE_INCONSISTENCY",
      "S35_DECISION_LINEAGE_BREAK",
      "S35_FAIL_CLOSED_TRACE_DEGRADATION",
      "S35_UNRESOLVED_TRACE_CONFLICT",
      "S35_TRACE_COLLAPSE_SENSITIVE_REJECTION",
      "S35_OPERATIONALLY_UNSUSTAINABLE_TRACE_INTEGRITY",
    ]);
  });

  it("is deterministic for repeated identical input", () => {
    const input = {
      restorationTraceIntegrityLevel: "adequate" as const,
      warningTraceabilityLevel: "adequate" as const,
      classificationTraceabilityLevel: "adequate" as const,
      traceConflictLevel: "moderate" as const,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate the input object", () => {
    const input: CountyGovernanceEntropyDoctrineRestorationTraceIntegrityInput = {
      ...baseInput,
      transitionGapCount: 1,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceEntropyDoctrineRestorationTraceIntegrity(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("always preserves fail-closed flags", () => {
    const result = evaluate({
      traceCollapseExposureLevel: "critical",
    });

    assertFailClosedFlags(result);
  });

  it("does not expose runtime or provider behavior", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineRestorationTraceIntegrity(baseInput);

    assert.equal(result.explainability.deterministicRulesApplied.some((rule) => rule.includes("No runtime")), true);
    assert.equal(result.warningCodes.every((warning) => warning.startsWith("S35_")), true);
  });
});
