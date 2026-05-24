import { createZ9FinalManualRevenueRiskReviewSummary } from "./z9-final-manual-revenue-risk-review-summary";

describe("Z9F final manual revenue risk review summary", () => {
  it("summarizes Z9 readiness and recommends Z10 next", () => {
    const result = createZ9FinalManualRevenueRiskReviewSummary();
    expect(result.phase).toBe("Z9F");
    expect(result.policyReadiness.phase).toBe("Z9A");
    expect(result.signalReviewReadiness.phase).toBe("Z9B");
    expect(result.classifierReadiness.phase).toBe("Z9C");
    expect(result.riskSummaryReadiness.phase).toBe("Z9D");
    expect(result.recommendedNextExactPhase).toBe("Z10 - Manual Revenue Decision Support");
    expect(result.z9Complete).toBe(true);
  });

  it("keeps risk persistence, alerts, escalation, and execution blocked", () => {
    const result = createZ9FinalManualRevenueRiskReviewSummary();
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.queueItemCreated).toBe(false);
    expect(result.flags.recoveryCoordinationExecuted).toBe(false);
    expect(result.flags.riskEscalationCreated).toBe(false);
    expect(result.flags.riskDecisionPersisted).toBe(false);
    expect(result.flags.riskScorePersisted).toBe(false);
    expect(result.flags.riskRouteCreated).toBe(false);
    expect(result.flags.riskApprovalRequested).toBe(false);
    expect(result.flags.riskRecommendationExecuted).toBe(false);
    expect(result.flags.operatorAlertCreated).toBe(false);
    expect(result.flags.riskReviewArchived).toBe(false);
    expect(result.unresolvedBlockers.join(" ")).toMatch(/no risk persistence/);
    expect(result.scopeDiscipline.diminishingReturnsWatch).toContain("architecture inflation");
  });
});
