import { createZ10FinalManualRevenueDecisionSupportSummary } from "./z10-final-manual-revenue-decision-support-summary";

describe("Z10F final manual revenue decision support summary", () => {
  it("summarizes Z10 readiness and pivots to real lead operations usability", () => {
    const result = createZ10FinalManualRevenueDecisionSupportSummary();
    expect(result.phase).toBe("Z10F");
    expect(result.policyReadiness.phase).toBe("Z10A");
    expect(result.signalReviewReadiness.phase).toBe("Z10B");
    expect(result.classifierReadiness.phase).toBe("Z10C");
    expect(result.decisionSummaryReadiness.phase).toBe("Z10D");
    expect(result.recommendedNextExactPhase).toBe("Real Manual Lead Operations Usability Pass");
    expect(result.scopeDiscipline.continueAdvisoryLayerExpansion).toBe(false);
    expect(result.scopeDiscipline.rationale).toMatch(/highest ROI/i);
    expect(result.z10Complete).toBe(true);
  });

  it("keeps decision persistence, approval, assignment, notification, status, and audit blocked", () => {
    const result = createZ10FinalManualRevenueDecisionSupportSummary();
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.recoveryCoordinationExecuted).toBe(false);
    expect(result.flags.riskRecommendationExecuted).toBe(false);
    expect(result.flags.decisionPersisted).toBe(false);
    expect(result.flags.decisionRouteCreated).toBe(false);
    expect(result.flags.decisionApprovalRequested).toBe(false);
    expect(result.flags.decisionExecuted).toBe(false);
    expect(result.flags.operatorAssignmentCreated).toBe(false);
    expect(result.flags.decisionNotificationCreated).toBe(false);
    expect(result.flags.leadStatusChanged).toBe(false);
    expect(result.flags.decisionAuditWritten).toBe(false);
    expect(result.unresolvedBlockers.join(" ")).toMatch(/no decision persistence/);
    expect(result.scopeDiscipline.consolidationPrinciple).toMatch(/instead of adding Z11/);
  });
});
