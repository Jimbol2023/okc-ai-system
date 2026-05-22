import {
  createR72RevenueCommandCenterDriftExecutionRiskAudit,
  summarizeR72RevenueCommandCenterDriftAudit,
} from "./r72-revenue-command-center-drift-execution-risk-audit";

const reviewedInput = {
  revenuePriorityToExecutionReviewed: true,
  revenueScoreToSendReviewed: true,
  nearCloseToExecutionReviewed: true,
  stuckDealToProviderReviewed: true,
  buyerReadyToOutreachReviewed: true,
  overdueFollowUpToSendReviewed: true,
  providerBoundaryReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R72B revenue command center drift execution risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR72RevenueCommandCenterDriftExecutionRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.executionAllowed).toBe(false);
  });

  it("smoke-tests drift audit clearance", () => {
    const result = createR72RevenueCommandCenterDriftExecutionRiskAudit(reviewedInput);
    expect(result.status).toBe("revenue_drift_audit_clear");
    expect(result.riskCategories).toContain("revenue-priority-to-execution drift");
    expect(result.nextPhase).toBe("R72C - Revenue Command Center Read-Only UI Scope Contract");
  });

  it("pressure-tests every revenue drift path as blocked", () => {
    const result = createR72RevenueCommandCenterDriftExecutionRiskAudit({
      ...reviewedInput,
      revenuePriorityExecutionRequested: true,
      revenueScoreSendRequested: true,
      nearCloseExecutionRequested: true,
      stuckDealProviderRequested: true,
      buyerReadyOutreachRequested: true,
      overdueFollowUpSendRequested: true,
      urgencyExecutionRequested: true,
      commandCenterWorkflowRequested: true,
      recommendationExecutionRequested: true,
      approvalExecutionRequested: true,
      providerReadinessExecutionRequested: true,
      aiSuggestionExecutionRequested: true,
      envReadRequested: true,
      fetchNetworkRequested: true,
      providerClientRequested: true,
      runtimeRequested: true,
      campaignRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      hiddenExecutionAffordanceRequested: true,
    });
    expect(result.status).toBe("revenue_drift_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "revenue priority cannot execute",
        "revenue score cannot send",
        "stuck-deal status cannot activate providers",
        "buyer-ready status cannot trigger outreach",
        "hidden execution affordances remain forbidden",
      ]),
    );
  });

  it("summarizes pressure-based unsafe behavior prevention", () => {
    const result = createR72RevenueCommandCenterDriftExecutionRiskAudit(reviewedInput);
    expect(summarizeR72RevenueCommandCenterDriftAudit(result)).toMatch(/blocks revenue-priority/i);
  });
});
