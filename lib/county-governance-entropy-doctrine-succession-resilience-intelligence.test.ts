import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceEntropyDoctrineSuccessionResilience,
  type CountyGovernanceEntropyDoctrineSuccessionResilienceInput,
} from "./county-governance-entropy-doctrine-succession-resilience-intelligence";

const baseInput: CountyGovernanceEntropyDoctrineSuccessionResilienceInput = {
  successionResilienceLevel: "durable",
  successionSustainabilityLevel: "durable",
  successionSafetyLevel: "safe",
  successionDurabilityLevel: "durable",
  transitionSurvivabilityLevel: "strong",
  handoffDurabilityLevel: "strong",
  knowledgeTransferSurvivabilityLevel: "strong",
  successionInstabilityLevel: "none",
  successionDependencyConcentrationLevel: "none",
  successionExplainabilityLevel: "strong",
  failClosedSuccessionIntegrityLevel: "durable",
  successionContinuationNeedLevel: "none",
  boundedSuccessionReevaluationNeedLevel: "none",
  recursiveSuccessionDependencyLevel: "none",
  collapseExposureLevel: "none",
  memoryCompatibilityLevel: "durable",
  stewardshipCompatibilityLevel: "durable",
  oversightCompatibilityLevel: "durable",
  maintenanceCompatibilityLevel: "durable",
  finalityCompatibilityLevel: "durable",
  survivabilityCompatibilityLevel: "durable",
  operationalSuccessionSustainabilityLevel: "durable",
  successionCycleCount: 1,
  transitionEventCount: 0,
  handoffEventCount: 0,
  knowledgeTransferEventCount: 0,
  unresolvedDoctrineConflictCount: 0,
  reevaluationEvidenceCount: 1,
  failClosedDegradationCount: 0,
  explainabilityWeaknessCount: 0,
  recursiveDependencyEventCount: 0,
  successionInstabilityEventCount: 0,
  dependencyConcentrationEventCount: 0,
};

function evaluate(input: Partial<CountyGovernanceEntropyDoctrineSuccessionResilienceInput>) {
  return evaluateCountyGovernanceEntropyDoctrineSuccessionResilience({
    ...baseInput,
    ...input,
  });
}

function assertFailClosedFlags(result: ReturnType<typeof evaluateCountyGovernanceEntropyDoctrineSuccessionResilience>) {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Entropy Doctrine Succession Resilience Intelligence", () => {
  it("fails closed as succession_resilience_unverified for missing input", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSuccessionResilience();

    assert.equal(result.successionResilienceClassification, "succession_resilience_unverified");
    assert.equal(result.successionReadinessClassification, "readiness_unverified");
    assert.equal(result.successionSafetyClassification, "safety_unverified");
    assert.equal(result.warningCodes.includes("S32_SUCCESSION_RESILIENCE_UNVERIFIED"), true);
    assertFailClosedFlags(result);
  });

  it("classifies durable succession resilience", () => {
    const result = evaluateCountyGovernanceEntropyDoctrineSuccessionResilience(baseInput);

    assert.equal(result.successionResilienceClassification, "durable_succession_resilience");
    assert.equal(result.successionReadinessClassification, "ready");
    assert.equal(result.successionSafetyClassification, "safe");
  });

  it("classifies conditional succession resilience", () => {
    const result = evaluate({
      successionResilienceLevel: "conditional",
      successionSustainabilityLevel: "conditional",
      successionSafetyLevel: "guarded",
      successionDurabilityLevel: "stable",
      transitionSurvivabilityLevel: "strong",
      handoffDurabilityLevel: "strong",
      knowledgeTransferSurvivabilityLevel: "strong",
      successionExplainabilityLevel: "adequate",
      failClosedSuccessionIntegrityLevel: "stable",
    });

    assert.equal(result.successionResilienceClassification, "conditional_succession_resilience");
    assert.equal(result.successionReadinessClassification, "conditionally_ready");
  });

  it("detects superficial succession resilience", () => {
    const result = evaluate({
      successionResilienceLevel: "stable",
      successionExplainabilityLevel: "adequate",
      handoffDurabilityLevel: "strong",
      knowledgeTransferSurvivabilityLevel: "strong",
      reevaluationEvidenceCount: 0,
    });

    assert.equal(result.successionResilienceClassification, "superficial_succession_resilience");
    assert.equal(result.superficialSuccessionResilience, true);
    assert.equal(result.warningCodes.includes("S32_SUPERFICIAL_SUCCESSION_RESILIENCE"), true);
  });

  it("detects succession blocked", () => {
    const result = evaluate({
      memoryCompatibilityLevel: "poor",
      stewardshipCompatibilityLevel: "poor",
    });

    assert.equal(result.successionResilienceClassification, "succession_blocked");
    assert.equal(result.successionBlocked, true);
    assert.equal(result.warningCodes.includes("S32_SUCCESSION_BLOCKED"), true);
  });

  it("detects succession unsafe", () => {
    const result = evaluate({
      successionSafetyLevel: "unsafe",
    });

    assert.equal(result.successionResilienceClassification, "succession_unsafe");
    assert.equal(result.successionUnsafe, true);
    assert.equal(result.warningCodes.includes("S32_SUCCESSION_UNSAFE"), true);
  });

  it("detects succession continuation required", () => {
    const result = evaluate({
      successionContinuationNeedLevel: "moderate",
      boundedSuccessionReevaluationNeedLevel: "none",
      successionInstabilityLevel: "none",
      successionDependencyConcentrationLevel: "none",
    });

    assert.equal(result.successionResilienceClassification, "succession_continuation_required");
    assert.equal(result.successionContinuationRequired, true);
    assert.equal(result.warningCodes.includes("S32_SUCCESSION_CONTINUATION_REQUIRED"), true);
  });

  it("detects bounded succession reevaluation required", () => {
    const result = evaluate({
      boundedSuccessionReevaluationNeedLevel: "moderate",
      successionContinuationNeedLevel: "none",
    });

    assert.equal(result.successionResilienceClassification, "bounded_succession_reevaluation_required");
    assert.equal(result.boundedSuccessionReevaluationRequired, true);
    assert.equal(result.warningCodes.includes("S32_BOUNDED_SUCCESSION_REEVALUATION_REQUIRED"), true);
  });

  it("reports succession entropy burden warning path", () => {
    const result = evaluate({
      successionInstabilityLevel: "moderate",
      boundedSuccessionReevaluationNeedLevel: "none",
      successionContinuationNeedLevel: "none",
    });

    assert.equal(result.warningCodes.includes("S32_SUCCESSION_ENTROPY_BURDEN"), true);
  });

  it("reports succession instability warning path", () => {
    const result = evaluate({
      successionInstabilityLevel: "moderate",
      boundedSuccessionReevaluationNeedLevel: "none",
      successionContinuationNeedLevel: "none",
    });

    assert.equal(result.warningCodes.includes("S32_SUCCESSION_INSTABILITY_DETECTED"), true);
  });

  it("reports succession dependency concentration warning path", () => {
    const result = evaluate({
      successionDependencyConcentrationLevel: "moderate",
      boundedSuccessionReevaluationNeedLevel: "none",
      successionContinuationNeedLevel: "none",
    });

    assert.equal(result.warningCodes.includes("S32_SUCCESSION_DEPENDENCY_CONCENTRATION"), true);
  });

  it("reports weak transition survivability", () => {
    const result = evaluate({
      successionResilienceLevel: "conditional",
      transitionSurvivabilityLevel: "partial",
    });

    assert.equal(result.warningCodes.includes("S32_TRANSITION_SURVIVABILITY_WEAK"), true);
  });

  it("reports weak handoff durability", () => {
    const result = evaluate({
      successionResilienceLevel: "conditional",
      handoffDurabilityLevel: "partial",
    });

    assert.equal(result.warningCodes.includes("S32_HANDOFF_DURABILITY_WEAK"), true);
  });

  it("reports weak knowledge transfer survivability", () => {
    const result = evaluate({
      successionResilienceLevel: "conditional",
      knowledgeTransferSurvivabilityLevel: "partial",
    });

    assert.equal(result.warningCodes.includes("S32_KNOWLEDGE_TRANSFER_SURVIVABILITY_WEAK"), true);
  });

  it("detects succession explainability weakness", () => {
    const result = evaluate({
      successionResilienceLevel: "conditional",
      successionExplainabilityLevel: "partial",
    });

    assert.equal(result.successionResilienceClassification, "succession_explainability_weakness");
    assert.equal(result.warningCodes.includes("S32_SUCCESSION_EXPLAINABILITY_WEAK"), true);
  });

  it("detects fail-closed succession degradation", () => {
    const result = evaluate({
      failClosedDegradationCount: 1,
    });

    assert.equal(result.successionResilienceClassification, "succession_blocked");
    assert.equal(result.failClosedSuccessionDegradation, true);
    assert.equal(result.warningCodes.includes("S32_FAIL_CLOSED_SUCCESSION_DEGRADATION"), true);
  });

  it("detects recursive succession dependency conflict", () => {
    const result = evaluate({
      recursiveSuccessionDependencyLevel: "high",
    });

    assert.equal(result.successionResilienceClassification, "succession_blocked");
    assert.equal(result.recursiveSuccessionDependencyConflict, true);
    assert.equal(result.warningCodes.includes("S32_RECURSIVE_SUCCESSION_DEPENDENCY_CONFLICT"), true);
  });

  it("detects collapse-sensitive succession rejection", () => {
    const result = evaluate({
      collapseExposureLevel: "high",
    });

    assert.equal(result.successionResilienceClassification, "collapse_sensitive_succession_rejection");
    assert.equal(result.collapseSensitiveSuccessionRejection, true);
    assert.equal(result.warningCodes.includes("S32_COLLAPSE_SENSITIVE_SUCCESSION_REJECTION"), true);
  });

  it("detects succession survivability weakness", () => {
    const result = evaluate({
      survivabilityCompatibilityLevel: "strained",
      successionContinuationNeedLevel: "moderate",
    });

    assert.equal(result.successionResilienceClassification, "succession_survivability_weakness");
    assert.equal(result.successionSurvivabilityWeakness, true);
    assert.equal(result.warningCodes.includes("S32_SUCCESSION_SURVIVABILITY_WEAKNESS"), true);
  });

  it("detects unresolved succession doctrine conflict", () => {
    const result = evaluate({
      unresolvedDoctrineConflictCount: 1,
    });

    assert.equal(result.successionResilienceClassification, "succession_blocked");
    assert.equal(result.unresolvedSuccessionDoctrineConflict, true);
    assert.equal(result.warningCodes.includes("S32_UNRESOLVED_SUCCESSION_DOCTRINE_CONFLICT"), true);
  });

  it("detects operationally unsustainable succession", () => {
    const result = evaluate({
      operationalSuccessionSustainabilityLevel: "unsustainable",
    });

    assert.equal(result.successionResilienceClassification, "succession_blocked");
    assert.equal(result.operationallyUnsustainableSuccession, true);
    assert.equal(result.warningCodes.includes("S32_OPERATIONALLY_UNSUSTAINABLE_SUCCESSION"), true);
  });

  it("reports memory compatibility weakness", () => {
    const result = evaluate({
      successionResilienceLevel: "conditional",
      memoryCompatibilityLevel: "strained",
    });

    assert.equal(result.warningCodes.includes("S32_MEMORY_COMPATIBILITY_WEAK"), true);
  });

  it("is deterministic for repeated identical input", () => {
    const input = {
      successionResilienceLevel: "conditional" as const,
      boundedSuccessionReevaluationNeedLevel: "moderate" as const,
      successionDependencyConcentrationLevel: "moderate" as const,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("keeps warning-code ordering stable", () => {
    const result = evaluate({
      memoryCompatibilityLevel: "poor",
      stewardshipCompatibilityLevel: "poor",
      successionSafetyLevel: "unsafe",
      successionExplainabilityLevel: "opaque",
      transitionSurvivabilityLevel: "weak",
      handoffDurabilityLevel: "weak",
      knowledgeTransferSurvivabilityLevel: "weak",
    });

    assert.deepEqual(result.warningCodes, [
      "S32_SUCCESSION_BLOCKED",
      "S32_SUCCESSION_UNSAFE",
      "S32_SUCCESSION_EXPLAINABILITY_WEAK",
      "S32_UNRESOLVED_SUCCESSION_DOCTRINE_CONFLICT",
      "S32_TRANSITION_SURVIVABILITY_WEAK",
      "S32_HANDOFF_DURABILITY_WEAK",
      "S32_KNOWLEDGE_TRANSFER_SURVIVABILITY_WEAK",
      "S32_MEMORY_COMPATIBILITY_WEAK",
    ]);
  });

  it("does not mutate the input object", () => {
    const input: CountyGovernanceEntropyDoctrineSuccessionResilienceInput = {
      ...baseInput,
      successionContinuationNeedLevel: "moderate",
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceEntropyDoctrineSuccessionResilience(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("always preserves fail-closed flags", () => {
    const result = evaluate({
      collapseExposureLevel: "critical",
    });

    assertFailClosedFlags(result);
  });
});
