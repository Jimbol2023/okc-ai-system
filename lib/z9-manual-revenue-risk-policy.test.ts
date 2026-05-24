import { createZ9ManualRevenueRiskPolicyReview, z9ManualRevenueRiskFlags, z9RevenueRiskReviewLaneMetadata, z9RevenueRiskReviewLanes } from "./z9-manual-revenue-risk-policy";

describe("Z9A manual revenue risk policy", () => {
  it("defines deterministic advisory risk review lanes", () => {
    expect(z9RevenueRiskReviewLanes).toEqual([
      "governance_stop",
      "contact_risk_stop",
      "data_confidence_risk",
      "recovery_complexity_risk",
      "near_close_risk",
      "buyer_disposition_risk",
      "conversion_quality_risk",
      "follow_up_leakage_risk",
      "monitor_risk",
      "terminal_no_risk_review",
    ]);

    for (const lane of z9RevenueRiskReviewLanes) {
      const metadata = z9RevenueRiskReviewLaneMetadata[lane];
      expect(metadata.label).toBeTruthy();
      expect(metadata.manualMeaning).toBeTruthy();
      expect(metadata.revenuePurpose).toBeTruthy();
      expect(metadata.requiresHumanReview).toBe(true);
      expect(metadata.blockedExecutionBoundary).toMatch(/no risk escalation/i);
    }
  });

  it("preserves all Z9 lockdown flags", () => {
    const result = createZ9ManualRevenueRiskPolicyReview();
    expect(result.flags).toBe(z9ManualRevenueRiskFlags);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.flags.queueCreated).toBe(false);
    expect(result.flags.recoveryPlanCreated).toBe(false);
    expect(result.flags.recoveryCoordinationExecuted).toBe(false);
    expect(result.flags.riskEscalationCreated).toBe(false);
    expect(result.flags.riskDecisionPersisted).toBe(false);
    expect(result.flags.riskScorePersisted).toBe(false);
    expect(result.flags.riskRouteCreated).toBe(false);
    expect(result.flags.riskApprovalRequested).toBe(false);
    expect(result.flags.riskRecommendationExecuted).toBe(false);
    expect(result.flags.operatorAlertCreated).toBe(false);
    expect(result.flags.riskReviewArchived).toBe(false);
    expect(result.scopeDiscipline.consolidateInsteadWhen).toMatch(/rename Z7\/Z8/i);
  });
});
