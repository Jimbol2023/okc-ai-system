import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateCountyGovernanceRestorationNonRegression,
  type CountyGovernanceRestorationNonRegressionInput,
} from "./county-governance-restoration-non-regression-intelligence";

const stableInput: CountyGovernanceRestorationNonRegressionInput = {
  restorationIntegrityScore: 92,
  continuityDurabilityScore: 90,
  survivabilityContainmentScore: 88,
  traceIntegrityScore: 91,
  doctrineConsistencyScore: 90,
  failClosedIntegrityScore: 94,
  rollbackStabilityScore: 89,
  restorationDriftScore: 12,
  recursiveRestorationExposureScore: 10,
  institutionalRegressionExposureScore: 14,
  explainabilityDurabilityScore: 90,
  lineageContinuityScore: 91,
  reevaluationPressureScore: 12,
};

function evaluate(input: Partial<CountyGovernanceRestorationNonRegressionInput>) {
  return evaluateCountyGovernanceRestorationNonRegression({
    ...stableInput,
    ...input,
  });
}

function assertAdvisoryInvariants(
  result: ReturnType<typeof evaluateCountyGovernanceRestorationNonRegression>,
): void {
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.failClosed, true);
}

describe("County Governance Restoration Non-Regression Intelligence", () => {
  it("classifies stable non-regressive evaluations", () => {
    const result = evaluateCountyGovernanceRestorationNonRegression(stableInput);

    assert.equal(result.nonRegressionLevel, "stable_non_regressive");
    assert.equal(result.regressionExposureLevel, "minimal");
    assert.equal(result.reevaluationRequirementLevel, "none");
    assert.equal(result.restorationSustainability, "stable");
    assert.deepEqual(result.warningCodes, []);
    assertAdvisoryInvariants(result);
  });

  it("classifies bounded regression risk", () => {
    const result = evaluate({
      restorationIntegrityScore: 72,
      restorationDriftScore: 24,
      reevaluationPressureScore: 20,
    });

    assert.equal(result.nonRegressionLevel, "bounded_regression_risk");
    assert.equal(result.continuationRequired, false);
    assert.equal(result.regressionExposureLevel, "contained");
  });

  it("classifies continuation-required regression conditions", () => {
    const result = evaluate({
      continuityDurabilityScore: 62,
      traceIntegrityScore: 62,
      lineageContinuityScore: 62,
      explainabilityDurabilityScore: 62,
      reevaluationPressureScore: 44,
      restorationDriftScore: 40,
    });

    assert.equal(result.nonRegressionLevel, "continuation_required");
    assert.equal(result.continuationRequired, true);
    assert.equal(result.warningCodes.includes("REEVALUATION_REQUIRED"), true);
  });

  it("escalates recursive regression amplification", () => {
    const result = evaluate({
      recursiveRestorationExposureScore: 78,
      restorationDriftScore: 58,
    });

    assert.equal(result.nonRegressionLevel, "regression_escalating");
    assert.equal(result.recursiveRegressionDetected, true);
    assert.equal(result.warningCodes[0], "RECURSIVE_REGRESSION_AMPLIFICATION");
  });

  it("keeps fail-closed degradation supreme over superficial continuity stability", () => {
    const result = evaluate({
      failClosedIntegrityScore: 40,
      continuityDurabilityScore: 96,
      traceIntegrityScore: 96,
      restorationIntegrityScore: 96,
    });

    assert.equal(result.nonRegressionLevel, "fail_closed_degradation");
    assert.equal(result.failClosedProtectionDegrading, true);
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_DEGRADATION");
  });

  it("detects collapse-sensitive escalation", () => {
    const result = evaluate({
      recursiveRestorationExposureScore: 90,
      failClosedIntegrityScore: 88,
    });

    assert.equal(result.nonRegressionLevel, "collapse_sensitive");
    assert.equal(result.collapseSensitiveEscalation, true);
    assert.equal(result.warningCodes.includes("COLLAPSE_SENSITIVE_ESCALATION"), true);
  });

  it("detects rollback instability without treating it as irreversible regression", () => {
    const result = evaluate({
      rollbackStabilityScore: 48,
      restorationIntegrityScore: 82,
      doctrineConsistencyScore: 78,
      restorationDriftScore: 30,
    });

    assert.equal(result.nonRegressionLevel, "restoration_instability");
    assert.equal(result.rollbackInstabilityDetected, true);
    assert.equal(result.collapseSensitiveEscalation, false);
    assert.equal(result.warningCodes.includes("ROLLBACK_INSTABILITY_DETECTED"), true);
  });

  it("escalates reevaluation requirements", () => {
    const result = evaluate({
      reevaluationPressureScore: 82,
    });

    assert.equal(result.reevaluationRequirementLevel, "immediate");
    assert.equal(result.warningCodes.includes("REEVALUATION_REQUIRED"), true);
  });

  it("keeps warning-code order deterministic", () => {
    const result = evaluate({
      continuityDurabilityScore: 50,
      survivabilityContainmentScore: 50,
      traceIntegrityScore: 50,
      doctrineConsistencyScore: 50,
      rollbackStabilityScore: 50,
      restorationDriftScore: 70,
      institutionalRegressionExposureScore: 70,
      explainabilityDurabilityScore: 50,
      lineageContinuityScore: 50,
      reevaluationPressureScore: 70,
    });

    assert.deepEqual(result.warningCodes, [
      "ROLLBACK_INSTABILITY_DETECTED",
      "DOCTRINE_REGRESSION_ACCUMULATION",
      "RESTORATION_DRIFT_ESCALATION",
      "SURVIVABILITY_CONTAINMENT_FAILURE",
      "CONTINUITY_NON_REGRESSION_WEAKNESS",
      "TRACE_REGRESSION_EXPOSURE",
      "LINEAGE_CONTINUITY_WEAKNESS",
      "NON_REGRESSION_EXPLAINABILITY_DECAY",
      "REEVALUATION_REQUIRED",
      "RESTORATION_REGRESSION_DRIFT",
      "INSTITUTIONAL_REGRESSION_RISK",
    ]);
  });

  it("preserves deterministic precedence ordering", () => {
    const result = evaluate({
      failClosedIntegrityScore: 30,
      recursiveRestorationExposureScore: 92,
      restorationDriftScore: 92,
      rollbackStabilityScore: 30,
    });

    assert.equal(result.nonRegressionLevel, "fail_closed_degradation");
    assert.equal(result.warningCodes[0], "FAIL_CLOSED_DEGRADATION");
  });

  it("preserves explainability visibility", () => {
    const result = evaluate({
      survivabilityContainmentScore: 45,
    });

    assert.equal(result.explainability.primaryRegressionDriver.length > 0, true);
    assert.equal(result.explainability.dominantEscalationReason.length > 0, true);
    assert.equal(result.explainability.containmentAssessment.includes("containment"), true);
    assert.equal(result.explainability.restorationDurabilityAssessment.includes("Restoration durability"), true);
  });

  it("enforces bounded scores", () => {
    const result = evaluateCountyGovernanceRestorationNonRegression({
      restorationIntegrityScore: 150,
      continuityDurabilityScore: Number.NaN,
      survivabilityContainmentScore: 120,
      traceIntegrityScore: -20,
      doctrineConsistencyScore: 101,
      failClosedIntegrityScore: 88,
      rollbackStabilityScore: 88,
      restorationDriftScore: 110,
      recursiveRestorationExposureScore: -8,
      institutionalRegressionExposureScore: 200,
      explainabilityDurabilityScore: 88,
      lineageContinuityScore: 88,
      reevaluationPressureScore: 500,
    });

    assert.equal(result.regressionSeverityScore >= 0 && result.regressionSeverityScore <= 100, true);
    assert.equal(result.reevaluationRequirementLevel, "immediate");
  });

  it("is memoryless and repeatable for identical input", () => {
    const input = {
      restorationIntegrityScore: 72,
      restorationDriftScore: 44,
      reevaluationPressureScore: 35,
    };

    const first = evaluate(input);
    const second = evaluate(input);

    assert.deepEqual(second, first);
  });

  it("does not mutate caller input", () => {
    const input: CountyGovernanceRestorationNonRegressionInput = {
      ...stableInput,
      restorationDriftScore: 44,
    };
    const before = JSON.stringify(input);

    evaluateCountyGovernanceRestorationNonRegression(input);

    assert.equal(JSON.stringify(input), before);
  });

  it("preserves governance isolation guarantees", () => {
    const result = evaluate({
      traceIntegrityScore: 60,
      survivabilityContainmentScore: 60,
    });

    assertAdvisoryInvariants(result);
    assert.equal(Array.isArray(result.warningCodes), true);
    assert.equal(result.warningCodes.every((warning) => warning === warning.toUpperCase()), true);
  });
});
