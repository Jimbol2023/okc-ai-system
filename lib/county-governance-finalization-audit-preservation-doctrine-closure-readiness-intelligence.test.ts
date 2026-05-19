import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceFinalizationAuditPreservationDoctrineClosureReadiness,
  type CountyGovernanceFinalizationAuditPreservationDoctrineClosureReadinessInput,
} from "./county-governance-finalization-audit-preservation-doctrine-closure-readiness-intelligence";

const durableInput: CountyGovernanceFinalizationAuditPreservationDoctrineClosureReadinessInput = {
  doctrineClosureReadinessScore: 94,
  closureAuditTrustDurabilityScore: 93,
  finalizedClosureExplainabilityScore: 92,
  closureContinuitySurvivabilityScore: 91,
  failClosedClosureReadinessScore: 94,
  closureFragmentationRiskScore: 8,
  closureDesynchronizationRiskScore: 8,
  recursiveClosureDriftRiskScore: 8,
  closureContainmentIntegrityScore: 91,
  auditPreservationDurabilityScore: 90,
  closureEntropyRecurrenceRiskScore: 8,
  closureReevaluationPressureScore: 10,
};

function evaluate(input: Partial<CountyGovernanceFinalizationAuditPreservationDoctrineClosureReadinessInput>) {
  return evaluateCountyGovernanceFinalizationAuditPreservationDoctrineClosureReadiness({
    ...durableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceFinalizationAuditPreservationDoctrineClosureReadiness>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Finalization Audit Preservation Doctrine Closure Readiness Intelligence", () => {
  it("classifies durable closure readiness", () => {
    const result = evaluateCountyGovernanceFinalizationAuditPreservationDoctrineClosureReadiness(durableInput);

    assert.equal(result.doctrineClosureReadinessLevel, "durable_doctrine_closure_readiness");
    assert.equal(result.closureReadinessExposureLevel, "minimal");
    assert.equal(result.closureReevaluationRequirementLevel, "none");
    assert.equal(result.longHorizonClosureReadiness, "durable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded closure readiness", () => {
    const result = evaluate({
      doctrineClosureReadinessScore: 74,
      closureAuditTrustDurabilityScore: 88,
      auditPreservationDurabilityScore: 88,
      closureReevaluationPressureScore: 20,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "bounded_doctrine_closure_readiness");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.closureReadinessExposureLevel, "contained");
  });

  it("classifies continuation-required closure readiness", () => {
    const result = evaluate({
      closureAuditTrustDurabilityScore: 66,
      finalizedClosureExplainabilityScore: 66,
      auditPreservationDurabilityScore: 66,
      closureReevaluationPressureScore: 44,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "doctrine_closure_continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.collapseSensitiveClosureEscalation, false);
    assert.equal(result.warningCodes.includes("CLOSURE_CONTINUATION_REQUIRED"), true);
  });

  it("classifies degrading closure readiness", () => {
    const result = evaluate({
      closureAuditTrustDurabilityScore: 50,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "doctrine_closure_degrading");
    assert.equal(result.warningCodes.includes("CLOSURE_AUDIT_TRUST_DURABILITY_WEAKNESS"), true);
  });

  it("classifies unstable closure readiness", () => {
    const result = evaluate({
      closureFragmentationRiskScore: 50,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "doctrine_closure_unstable");
    assert.equal(result.closureFragmentationDetected, true);
  });

  it("keeps fail-closed closure readiness precedence", () => {
    const result = evaluate({
      failClosedClosureReadinessScore: 40,
      doctrineClosureReadinessScore: 96,
      closureAuditTrustDurabilityScore: 96,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "fail_closed_doctrine_closure_degradation");
    assert.equal(result.failClosedClosureReadinessDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_CLOSURE_READINESS_DEGRADATION");
  });

  it("detects collapse-sensitive doctrine closure escalation", () => {
    const result = evaluate({
      closureEntropyRecurrenceRiskScore: 94,
      failClosedClosureReadinessScore: 60,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "collapse_sensitive_doctrine_closure");
    assert.equal(result.collapseSensitiveClosureEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_DOCTRINE_CLOSURE"), true);
  });

  it("detects closure fragmentation", () => {
    const result = evaluate({
      closureFragmentationRiskScore: 78,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "doctrine_closure_unstable");
    assert.equal(result.closureFragmentationDetected, true);
    assert.equal(result.collapseSensitiveClosureEscalation, false);
    assert.equal(result.warningCodes.includes("CLOSURE_FRAGMENTATION_RISK"), true);
  });

  it("detects closure desynchronization", () => {
    const result = evaluate({
      closureDesynchronizationRiskScore: 78,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "doctrine_closure_unstable");
    assert.equal(result.closureDesynchronizationDetected, true);
    assert.equal(result.warningCodes.includes("CLOSURE_DESYNCHRONIZATION_RISK"), true);
  });

  it("detects recursive closure drift", () => {
    const result = evaluate({
      recursiveClosureDriftRiskScore: 78,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "doctrine_closure_unstable");
    assert.equal(result.recursiveClosureDriftDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_CLOSURE_DRIFT");
  });

  it("detects entropy recurrence", () => {
    const result = evaluate({
      closureEntropyRecurrenceRiskScore: 78,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "doctrine_closure_unstable");
    assert.equal(result.closureEntropyRecurrenceDetected, true);
    assert.equal(result.warningCodes.includes("CLOSURE_ENTROPY_RECURRENCE_RISK"), true);
  });

  it("detects containment risk", () => {
    const result = evaluate({
      closureContainmentIntegrityScore: 50,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "doctrine_closure_unstable");
    assert.equal(result.closureContainmentRiskDetected, true);
    assert.equal(result.warningCodes.includes("CLOSURE_CONTAINMENT_RISK"), true);
  });

  it("detects closure audit trust durability weakness", () => {
    const result = evaluate({
      closureAuditTrustDurabilityScore: 50,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "doctrine_closure_degrading");
    assert.equal(result.warningCodes.includes("CLOSURE_AUDIT_TRUST_DURABILITY_WEAKNESS"), true);
  });

  it("detects audit preservation durability weakness", () => {
    const result = evaluate({
      auditPreservationDurabilityScore: 50,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "doctrine_closure_degrading");
    assert.equal(result.warningCodes.includes("AUDIT_PRESERVATION_DURABILITY_WEAKNESS"), true);
  });

  it("detects finalized closure explainability decay", () => {
    const result = evaluate({
      finalizedClosureExplainabilityScore: 50,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "doctrine_closure_degrading");
    assert.equal(result.warningCodes.includes("FINALIZED_CLOSURE_EXPLAINABILITY_DECAY"), true);
  });

  it("detects closure continuity survivability weakness", () => {
    const result = evaluate({
      closureContinuitySurvivabilityScore: 50,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "doctrine_closure_degrading");
    assert.equal(result.warningCodes.includes("CLOSURE_CONTINUITY_SURVIVABILITY_WEAKNESS"), true);
  });

  it("escalates reevaluation thresholds", () => {
    const result = evaluate({
      closureReevaluationPressureScore: 82,
    });

    assert.equal(result.closureReevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("CLOSURE_REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      closureDesynchronizationRiskScore: 78,
      closureFragmentationRiskScore: 78,
      closureAuditTrustDurabilityScore: 50,
      auditPreservationDurabilityScore: 50,
      finalizedClosureExplainabilityScore: 50,
      closureContinuitySurvivabilityScore: 50,
      closureReevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "CLOSURE_DESYNCHRONIZATION_RISK",
      "CLOSURE_FRAGMENTATION_RISK",
      "CLOSURE_AUDIT_TRUST_DURABILITY_WEAKNESS",
      "AUDIT_PRESERVATION_DURABILITY_WEAKNESS",
      "FINALIZED_CLOSURE_EXPLAINABILITY_DECAY",
      "CLOSURE_CONTINUITY_SURVIVABILITY_WEAKNESS",
      "CLOSURE_REEVALUATION_REQUIRED",
    ]);
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      doctrineClosureReadinessScore: 74,
      closureReevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceFinalizationAuditPreservationDoctrineClosureReadinessInput = {
      ...durableInput,
      closureReevaluationPressureScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceFinalizationAuditPreservationDoctrineClosureReadiness(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("keeps scores bounded to 0..100", () => {
    const result = evaluateCountyGovernanceFinalizationAuditPreservationDoctrineClosureReadiness({
      doctrineClosureReadinessScore: 150,
      closureAuditTrustDurabilityScore: Number.NaN,
      finalizedClosureExplainabilityScore: 100,
      closureContinuitySurvivabilityScore: 100,
      failClosedClosureReadinessScore: 90,
      closureFragmentationRiskScore: -10,
      closureDesynchronizationRiskScore: -10,
      recursiveClosureDriftRiskScore: -10,
      closureContainmentIntegrityScore: 120,
      auditPreservationDurabilityScore: 100,
      closureEntropyRecurrenceRiskScore: 200,
      closureReevaluationPressureScore: 500,
    });

    assert.equal(result.closureReadinessSeverityScore >= 0 && result.closureReadinessSeverityScore <= 100, true);
    assert.equal(result.closureReadinessExposureLevel, "critical");
    assert.equal(result.closureReevaluationRequirementLevel, "immediate");
  });

  it("preserves advisory-only invariants", () => {
    const result = evaluate({
      finalizedClosureExplainabilityScore: 50,
      auditPreservationDurabilityScore: 50,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });

  it("keeps memory continuity finalization distinct from closure readiness", () => {
    const result = evaluate({
      doctrineClosureReadinessScore: 50,
      closureAuditTrustDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("DOCTRINE_CLOSURE_READINESS_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("CLOSURE_AUDIT_TRUST_DURABILITY_WEAKNESS"), false);
  });

  it("keeps finalized auditability distinct from closure audit durability", () => {
    const result = evaluate({
      closureAuditTrustDurabilityScore: 50,
      auditPreservationDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("CLOSURE_AUDIT_TRUST_DURABILITY_WEAKNESS"), true);
    assert.equal(result.warningCodes.includes("AUDIT_PRESERVATION_DURABILITY_WEAKNESS"), false);
  });

  it("keeps closure explainability distinct from closure audit durability", () => {
    const result = evaluate({
      finalizedClosureExplainabilityScore: 50,
      closureAuditTrustDurabilityScore: 95,
    });

    assert.equal(result.warningCodes.includes("FINALIZED_CLOSURE_EXPLAINABILITY_DECAY"), true);
    assert.equal(result.warningCodes.includes("CLOSURE_AUDIT_TRUST_DURABILITY_WEAKNESS"), false);
  });

  it("keeps collapse escalation terminal and non-stackable", () => {
    const result = evaluate({
      recursiveClosureDriftRiskScore: 94,
      closureEntropyRecurrenceRiskScore: 94,
      closureDesynchronizationRiskScore: 94,
      closureFragmentationRiskScore: 94,
      failClosedClosureReadinessScore: 60,
      closureAuditTrustDurabilityScore: 88,
    });

    assert.equal(result.doctrineClosureReadinessLevel, "collapse_sensitive_doctrine_closure");
    assert.equal(result.collapseSensitiveClosureEscalation, true);
    assert.equal(result.warningCodes[0], "COLLAPSE_SENSITIVE_DOCTRINE_CLOSURE");
  });

  it("saturates simultaneous closure degradation deterministically", () => {
    const result = evaluate({
      closureFragmentationRiskScore: 100,
      closureDesynchronizationRiskScore: 100,
      recursiveClosureDriftRiskScore: 100,
      closureEntropyRecurrenceRiskScore: 100,
      closureContainmentIntegrityScore: 0,
      closureAuditTrustDurabilityScore: 0,
      finalizedClosureExplainabilityScore: 0,
      closureContinuitySurvivabilityScore: 0,
      auditPreservationDurabilityScore: 0,
      failClosedClosureReadinessScore: 80,
    });

    assert.equal(result.closureReadinessSeverityScore, 100);
    assert.equal(result.closureReadinessExposureLevel, "critical");
  });

  it("does not imply irreversible governance continuity", () => {
    const result = evaluateCountyGovernanceFinalizationAuditPreservationDoctrineClosureReadiness(durableInput);

    assert.equal(
      result.explainability.longHorizonClosureReadinessAssessment.includes(
        "does not imply irreversible governance continuity",
      ),
      true,
    );
  });
});
