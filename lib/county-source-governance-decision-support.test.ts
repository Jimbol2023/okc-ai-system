import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  deriveCountySourceGovernanceDecision,
  type CountySourceGovernanceDecisionMetadata,
} from "./county-source-governance-decision-support";

const assertFailClosed = (result: CountySourceGovernanceDecisionMetadata) => {
  assert.equal(result.ingestionBlocked, true);
  assert.equal(result.automationBlocked, true);
  assert.equal(result.executionBlocked, true);
  assert.equal(result.planningOnly, true);
  assert.equal(result.failClosed, true);
};

describe("County Source Governance Decision Support", () => {
  it("should reject sources with high risk scores", () => {
    const result = deriveCountySourceGovernanceDecision(0.8, false);
    assert.equal(result.advisory, "reject_due_to_risk");
    assert.equal(result.requiresHumanReview, true);
    assertFailClosed(result);
  });

  it("should require manual review when flag is set, even with low risk", () => {
    const result = deriveCountySourceGovernanceDecision(0.3, true);
    assert.equal(result.advisory, "require_manual_review");
    assert.equal(result.requiresHumanReview, true);
    assertFailClosed(result);
  });

  it("should approve without review with low risk and no manual review flag", () => {
    const result = deriveCountySourceGovernanceDecision(0.3, false);
    assert.equal(result.advisory, "approve_without_review");
    assert.equal(result.requiresHumanReview, false);
    assertFailClosed(result);
  });

  it("should have confidence scores consistent with risk and flag", () => {
    const lowRiskApproval = deriveCountySourceGovernanceDecision(0.0, false);
    const highRiskRejection = deriveCountySourceGovernanceDecision(0.97, false);
    const manualReview = deriveCountySourceGovernanceDecision(0.4, true);

    assert(lowRiskApproval.confidence > highRiskRejection.confidence);
    assert(manualReview.confidence < lowRiskApproval.confidence);
  });

  it("should preserve fail-closed execution blockers for successful advisory planning support", () => {
    const result = deriveCountySourceGovernanceDecision(0.1, false);

    assert.equal(result.advisory, "approve_without_review");
    assertFailClosed(result);
  });

  it("should preserve fail-closed execution blockers for every advisory scenario", () => {
    const scenarios: CountySourceGovernanceDecisionMetadata[] = [
      deriveCountySourceGovernanceDecision(0.9, false),
      deriveCountySourceGovernanceDecision(0.3, true),
      deriveCountySourceGovernanceDecision(0.3, false),
    ];

    for (const result of scenarios) {
      assertFailClosed(result);
    }
  });
});
