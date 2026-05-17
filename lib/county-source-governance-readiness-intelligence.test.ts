import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  type CountySourceGovernanceReadinessInput,
  evaluateCountySourceGovernanceReadiness,
} from "./county-source-governance-readiness-intelligence";

const readyInput: CountySourceGovernanceReadinessInput = {
  sourceFormatClassification: 0.9,
  universalSchemaReadiness: 0.9,
  fieldMappingReadiness: 0.9,
  parserStrategyReadiness: 0.9,
  countyCapabilityReadiness: 0.9,
  normalizationReadiness: 0.9,
  sourceIntakeReadiness: 0.9,
  dataQualityReadiness: 0.9,
  countyRiskReadiness: 0.9,
  reviewBurdenReadiness: 0.9,
  confidenceStabilityReadiness: 0.9,
  sourceSurvivabilityReadiness: 0.9,
  constraintDocumentationPresent: true,
  explainabilityDocumentationPresent: true,
  humanReviewAvailable: true,
};

const assertFailClosed = (input: CountySourceGovernanceReadinessInput) => {
  const result = evaluateCountySourceGovernanceReadiness(input);

  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("county source governance readiness intelligence", () => {
  it("returns governance_ready when all planning signals and documentation are ready", () => {
    const result = evaluateCountySourceGovernanceReadiness(readyInput);

    assert.equal(result.governanceReadinessClassification, "governance_ready");
    assert.equal(result.governanceReadinessScore, 0.9);
    assert.equal(result.humanReviewRequired, false);
    assert.deepEqual(result.warningCodes, []);
    assert.deepEqual(result.blockingReasons, []);
  });

  it("returns review_required when documentation is missing but signals are strong", () => {
    const result = evaluateCountySourceGovernanceReadiness({
      ...readyInput,
      constraintDocumentationPresent: false,
      explainabilityDocumentationPresent: false,
    });

    assert.equal(result.governanceReadinessClassification, "review_required");
    assert.equal(result.humanReviewRequired, true);
    assert.deepEqual(result.warningCodes, [
      "MISSING_CONSTRAINT_DOCUMENTATION",
      "MISSING_EXPLAINABILITY_DOCUMENTATION",
    ]);
  });

  it("returns not_governance_ready for low aggregate readiness without blocking signals", () => {
    const result = evaluateCountySourceGovernanceReadiness({
      sourceFormatClassification: 0.6,
      universalSchemaReadiness: 0.6,
      fieldMappingReadiness: 0.6,
      parserStrategyReadiness: 0.6,
      countyCapabilityReadiness: 0.6,
      normalizationReadiness: 0.6,
      sourceIntakeReadiness: 0.6,
      dataQualityReadiness: 0.6,
      countyRiskReadiness: 0.6,
      reviewBurdenReadiness: 0.6,
      confidenceStabilityReadiness: 0.6,
      sourceSurvivabilityReadiness: 0.6,
      constraintDocumentationPresent: true,
      explainabilityDocumentationPresent: true,
      humanReviewAvailable: true,
    });

    assert.equal(result.governanceReadinessClassification, "not_governance_ready");
    assert.equal(result.governanceReadinessScore, 0.6);
    assert.equal(result.humanReviewRequired, true);
  });

  it("returns blocked when human review is unavailable", () => {
    const result = evaluateCountySourceGovernanceReadiness({
      ...readyInput,
      humanReviewAvailable: false,
    });

    assert.equal(result.governanceReadinessClassification, "blocked");
    assert.equal(result.humanReviewRequired, true);
    assert.equal(result.warningCodes.includes("HUMAN_REVIEW_UNAVAILABLE"), true);
    assert.equal(result.warningCodes.includes("GOVERNANCE_BLOCKED"), true);
  });

  it("returns blocked when a planning signal is below blocking threshold", () => {
    const result = evaluateCountySourceGovernanceReadiness({
      ...readyInput,
      dataQualityReadiness: 0.1,
    });

    assert.equal(result.governanceReadinessClassification, "blocked");
    assert.equal(result.warningCodes.includes("LOW_DATA_QUALITY"), true);
    assert.equal(result.warningCodes.includes("GOVERNANCE_BLOCKED"), true);
    assert.equal(result.blockingReasons, [
      "data quality readiness is below blocking threshold",
    ]);
  });

  it("generates missing documentation warnings deterministically", () => {
    const result = evaluateCountySourceGovernanceReadiness({
      ...readyInput,
      constraintDocumentationPresent: null,
      explainabilityDocumentationPresent: null,
    });

    assert.deepEqual(result.warningCodes, [
      "MISSING_CONSTRAINT_DOCUMENTATION",
      "MISSING_EXPLAINABILITY_DOCUMENTATION",
    ]);
  });

  it("generates high-risk signal warnings deterministically", () => {
    const result = evaluateCountySourceGovernanceReadiness({
      ...readyInput,
      dataQualityReadiness: 0.49,
      countyRiskReadiness: 0.49,
      reviewBurdenReadiness: 0.49,
      confidenceStabilityReadiness: 0.49,
      sourceSurvivabilityReadiness: 0.49,
    });

    assert.deepEqual(result.warningCodes, [
      "HIGH_REVIEW_BURDEN",
      "LOW_CONFIDENCE_STABILITY",
      "HIGH_SOURCE_RISK",
      "LOW_DATA_QUALITY",
      "LOW_SURVIVABILITY",
    ]);
    assert.equal(result.humanReviewRequired, true);
  });

  it("summarizes explainability and recommended next step deterministically", () => {
    const result = evaluateCountySourceGovernanceReadiness({
      ...readyInput,
      constraintDocumentationPresent: false,
    });

    assert.equal(
      result.explainabilitySummary,
      "Governance readiness evaluated from 12 deterministic planning signals with fail-closed execution controls preserved.",
    );
    assert.equal(
      result.recommendedNextStep,
      "Document source constraints before advancing governance readiness.",
    );
  });

  it("always preserves fail-closed flags", () => {
    for (const input of [
      readyInput,
      {
        ...readyInput,
        constraintDocumentationPresent: false,
      },
      {
        ...readyInput,
        humanReviewAvailable: false,
      },
      {},
    ] satisfies CountySourceGovernanceReadinessInput[]) {
      assertFailClosed(input);
    }
  });

  it("returns the same output for the same input", () => {
    assert.deepEqual(
      evaluateCountySourceGovernanceReadiness(readyInput),
      evaluateCountySourceGovernanceReadiness(readyInput),
    );
  });
});
