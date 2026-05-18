import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceSurvivability,
  type CountyGovernanceSurvivabilityInput,
  type CountyGovernanceSurvivabilityResult,
} from "./county-governance-survivability-intelligence";

const baseInput: CountyGovernanceSurvivabilityInput = {
  governanceMaturityLevel: "institutional",
  convergenceLevel: "institutional",
  continuityLevel: "durable",
  driftLevel: "none",
  escalationPressureLevel: "none",
  contradictionFrequency: "none",
  explainabilityLevel: "institutional",
  recoveryCapabilityLevel: "institutional",
  failClosedDisciplineLevel: "institutional",
  suppressionDependencyLevel: "none",
  degradationBehavior: "graceful",
  institutionalIntegrityLevel: "institutional",
};

const evaluate = (overrides: Partial<CountyGovernanceSurvivabilityInput> = {}) =>
  evaluateCountyGovernanceSurvivability({
    ...baseInput,
    ...overrides,
  });

const assertFailClosed = (result: CountyGovernanceSurvivabilityResult) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Governance Survivability Intelligence", () => {
  it("classifies institutional durable governance as survivable governance", () => {
    const result = evaluate();

    assert.equal(result.survivabilityClassification, "survivable_governance");
    assert.equal(result.catastrophicCollapseRisk, false);
    assert.equal(result.recoveryPossible, true);
    assert.equal(result.survivabilityScore >= 84, true);
    assertFailClosed(result);
  });

  it("applies catastrophic collapse override over otherwise strong signals", () => {
    const result = evaluate({
      degradationBehavior: "catastrophic",
    });

    assert.equal(result.survivabilityClassification, "catastrophic_collapse_risk");
    assert.equal(result.catastrophicCollapseRisk, true);
    assert(result.warningCodes.includes("S19_CATASTROPHIC_DEGRADATION_PATTERN"));
    assert(result.warningCodes.includes("S19_NON_RECOVERABLE_COLLAPSE_RISK"));
  });

  it("detects collapse from critical drift, persistent contradiction, and absent recovery", () => {
    const result = evaluate({
      driftLevel: "critical",
      contradictionFrequency: "persistent",
      recoveryCapabilityLevel: "none",
      degradationBehavior: "volatile",
    });

    assert.equal(result.survivabilityClassification, "catastrophic_collapse_risk");
    assert.equal(result.catastrophicCollapseRisk, true);
    assert(result.warningCodes.includes("S19_RECOVERY_CAPABILITY_ABSENT"));
  });

  it("classifies non-recoverable governance after catastrophic checks", () => {
    const result = evaluate({
      governanceMaturityLevel: "developing",
      convergenceLevel: "partial",
      continuityLevel: "unstable",
      driftLevel: "high",
      escalationPressureLevel: "high",
      contradictionFrequency: "frequent",
      explainabilityLevel: "partial",
      recoveryCapabilityLevel: "none",
      failClosedDisciplineLevel: "partial",
      suppressionDependencyLevel: "moderate",
      degradationBehavior: "volatile",
      institutionalIntegrityLevel: "partial",
    });

    assert.equal(result.survivabilityClassification, "non_recoverable_governance");
    assert.equal(result.recoveryPossible, false);
    assert(result.warningCodes.includes("S19_NON_RECOVERABLE_COLLAPSE_RISK"));
  });

  it("detects survivability without integrity from suppression-based stability", () => {
    const result = evaluate({
      continuityLevel: "durable",
      suppressionDependencyLevel: "high",
      institutionalIntegrityLevel: "partial",
    });

    assert.equal(result.survivabilityClassification, "survivability_without_integrity");
    assert.equal(result.survivabilityWithoutIntegrityDetected, true);
    assert(result.warningCodes.includes("S19_SURVIVABILITY_WITHOUT_INTEGRITY"));
    assert(result.warningCodes.includes("S19_SUPPRESSION_DEPENDENCY_HIGH"));
  });

  it("detects survivability without integrity from opaque advanced governance", () => {
    const result = evaluate({
      governanceMaturityLevel: "advanced",
      explainabilityLevel: "opaque",
      institutionalIntegrityLevel: "strong",
    });

    assert.equal(result.survivabilityClassification, "survivability_without_integrity");
    assert(result.warningCodes.includes("S19_EXPLAINABILITY_COLLAPSE"));
  });

  it("downgrades suppression-dependent adaptive governance to unsafe", () => {
    const result = evaluate({
      governanceMaturityLevel: "advanced",
      suppressionDependencyLevel: "high",
      continuityLevel: "recoverable",
      institutionalIntegrityLevel: "strong",
      recoveryCapabilityLevel: "strong",
    });

    assert.equal(result.survivabilityClassification, "adaptive_but_unsafe");
    assert(result.warningCodes.includes("S19_ADAPTIVE_BUT_UNSAFE_PATTERN"));
  });

  it("classifies brittle governance under high pressure", () => {
    const result = evaluate({
      governanceMaturityLevel: "stable",
      convergenceLevel: "aligned",
      continuityLevel: "stable",
      driftLevel: "high",
      escalationPressureLevel: "high",
      contradictionFrequency: "frequent",
      explainabilityLevel: "adequate",
      recoveryCapabilityLevel: "partial",
      failClosedDisciplineLevel: "stable",
      degradationBehavior: "unstable",
      institutionalIntegrityLevel: "stable",
    });

    assert.equal(result.survivabilityClassification, "brittle_governance");
    assert(result.warningCodes.includes("S19_BRITTLE_GOVERNANCE_PATTERN"));
    assert(result.warningCodes.includes("S19_DRIFT_SURVIVABILITY_UNSTABLE"));
  });

  it("classifies temporary endurance when recovery is partial but not durable", () => {
    const result = evaluate({
      governanceMaturityLevel: "stable",
      convergenceLevel: "aligned",
      continuityLevel: "recoverable",
      driftLevel: "moderate",
      escalationPressureLevel: "moderate",
      contradictionFrequency: "periodic",
      explainabilityLevel: "adequate",
      recoveryCapabilityLevel: "partial",
      failClosedDisciplineLevel: "stable",
      degradationBehavior: "unstable",
      institutionalIntegrityLevel: "stable",
    });

    assert.equal(result.survivabilityClassification, "temporary_endurance");
    assert(result.warningCodes.includes("S19_TEMPORARY_ENDURANCE_ONLY"));
  });

  it("classifies graceful degradation when degradation is controlled and recoverable", () => {
    const result = evaluate({
      governanceMaturityLevel: "stable",
      convergenceLevel: "strong",
      continuityLevel: "stable",
      driftLevel: "low",
      escalationPressureLevel: "low",
      contradictionFrequency: "rare",
      explainabilityLevel: "strong",
      recoveryCapabilityLevel: "strong",
      failClosedDisciplineLevel: "stable",
      degradationBehavior: "graceful",
      institutionalIntegrityLevel: "strong",
    });

    assert.equal(result.survivabilityClassification, "graceful_degradation");
    assert.equal(result.gracefulDegradationDetected, true);
    assert(result.warningCodes.includes("S19_GRACEFUL_DEGRADATION_DETECTED"));
  });

  it("classifies resilient governance below institutional survivability", () => {
    const result = evaluate({
      governanceMaturityLevel: "advanced",
      convergenceLevel: "strong",
      continuityLevel: "stable",
      driftLevel: "low",
      escalationPressureLevel: "low",
      contradictionFrequency: "rare",
      explainabilityLevel: "strong",
      recoveryCapabilityLevel: "strong",
      failClosedDisciplineLevel: "stable",
      degradationBehavior: "unknown",
      institutionalIntegrityLevel: "strong",
    });

    assert.equal(result.survivabilityClassification, "resilient_governance");
    assert.equal(result.recoveryPossible, true);
  });

  it("flags weak fail-closed discipline", () => {
    const result = evaluate({
      failClosedDisciplineLevel: "inconsistent",
      governanceMaturityLevel: "stable",
    });

    assert(result.warningCodes.includes("S19_FAIL_CLOSED_DISCIPLINE_WEAK"));
  });

  it("flags absent recovery capability", () => {
    const result = evaluate({
      recoveryCapabilityLevel: "none",
      continuityLevel: "fragile",
      degradationBehavior: "unstable",
    });

    assert(result.warningCodes.includes("S19_RECOVERY_CAPABILITY_ABSENT"));
  });

  it("flags explainability collapse", () => {
    const result = evaluate({
      explainabilityLevel: "opaque",
      governanceMaturityLevel: "developing",
    });

    assert(result.warningCodes.includes("S19_EXPLAINABILITY_COLLAPSE"));
  });

  it("flags drift, contradiction, and convergence survivability warnings", () => {
    const result = evaluate({
      convergenceLevel: "partial",
      driftLevel: "high",
      contradictionFrequency: "frequent",
      governanceMaturityLevel: "stable",
      continuityLevel: "stable",
      degradationBehavior: "unstable",
    });

    assert(result.warningCodes.includes("S19_DRIFT_SURVIVABILITY_UNSTABLE"));
    assert(result.warningCodes.includes("S19_CONTRADICTION_SURVIVABILITY_WEAK"));
    assert(result.warningCodes.includes("S19_CONVERGENCE_SURVIVABILITY_UNSTABLE"));
  });

  it("flags governance coherence collapse", () => {
    const result = evaluate({
      convergenceLevel: "fragmented",
      contradictionFrequency: "persistent",
      institutionalIntegrityLevel: "weak",
      degradationBehavior: "unstable",
    });

    assert.equal(result.survivabilityClassification, "catastrophic_collapse_risk");
    assert(result.warningCodes.includes("S19_GOVERNANCE_COHERENCE_COLLAPSE"));
  });

  it("is deterministic for repeated identical input", () => {
    const first = evaluate({
      convergenceLevel: "aligned",
      driftLevel: "moderate",
      contradictionFrequency: "periodic",
      continuityLevel: "recoverable",
    });
    const second = evaluate({
      convergenceLevel: "aligned",
      driftLevel: "moderate",
      contradictionFrequency: "periodic",
      continuityLevel: "recoverable",
    });

    assert.deepEqual(second, first);
  });

  it("preserves immutable fail-closed flags across classifications", () => {
    const scenarios = [
      evaluate(),
      evaluate({ degradationBehavior: "catastrophic" }),
      evaluate({ suppressionDependencyLevel: "critical", institutionalIntegrityLevel: "weak" }),
      evaluate({ recoveryCapabilityLevel: "none", continuityLevel: "unstable", driftLevel: "high" }),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });
});
