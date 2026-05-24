import { createZ10ManualRevenueDecisionPolicyReview, z10ManualRevenueDecisionFlags, z10RevenueDecisionLaneMetadata, z10RevenueDecisionLanes } from "./z10-manual-revenue-decision-policy";

describe("Z10A manual revenue decision policy", () => {
  it("defines deterministic advisory decision lanes", () => {
    expect(z10RevenueDecisionLanes).toEqual([
      "stop_do_not_work",
      "cleanup_before_decision",
      "review_risk_first",
      "review_revenue_now",
      "review_revenue_today",
      "monitor_only",
      "defer_low_value",
      "terminal_no_decision",
      "consolidate_instead_of_expand",
    ]);

    for (const lane of z10RevenueDecisionLanes) {
      const metadata = z10RevenueDecisionLaneMetadata[lane];
      expect(metadata.label).toBeTruthy();
      expect(metadata.manualMeaning).toBeTruthy();
      expect(metadata.revenuePurpose).toBeTruthy();
      expect(metadata.requiresHumanReview).toBe(true);
      expect(metadata.blockedExecutionBoundary).toMatch(/no decision persistence/i);
    }
  });

  it("preserves all Z10 lockdown flags and stops advisory expansion", () => {
    const result = createZ10ManualRevenueDecisionPolicyReview();
    expect(result.flags).toBe(z10ManualRevenueDecisionFlags);
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
    expect(result.consolidationCheckpoint.continueAdvisoryLayerExpansion).toBe(false);
    expect(result.consolidationCheckpoint.recommendedPivot).toBe("Real Manual Lead Operations Usability Pass");
  });
});
