import {
  createR74HitlRevenueExecutionDriftRiskAudit,
  summarizeR74HitlRevenueExecutionDriftAudit,
} from "./r74-hitl-revenue-execution-drift-risk-audit";

const reviewedInput = {
  approvalToExecutionReviewed: true,
  recommendationToExecutionReviewed: true,
  readinessToSendReviewed: true,
  providerReadinessReviewed: true,
  autonomyBoundaryReviewed: true,
  workflowAutomationReviewed: true,
  providerBoundaryReviewed: true,
  auditBoundaryReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R74B HITL revenue execution drift risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR74HitlRevenueExecutionDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.autonomousExecutionAllowed).toBe(false);
  });

  it("smoke-tests drift audit clearance", () => {
    const result = createR74HitlRevenueExecutionDriftRiskAudit(reviewedInput);
    expect(result.status).toBe("hitl_drift_audit_clear");
    expect(result.riskCategories).toContain("approval-to-execution drift");
  });

  it("pressure-tests autonomy drift paths as blocked", () => {
    const result = createR74HitlRevenueExecutionDriftRiskAudit({
      ...reviewedInput,
      approvalExecutionRequested: true,
      recommendationExecutionRequested: true,
      readinessSendRequested: true,
      providerReadinessProviderRequested: true,
      queueAutonomyRequested: true,
      urgencyAutonomyRequested: true,
      revenuePressureAutonomyRequested: true,
      aiRecommendationExecutionRequested: true,
      workflowAutomationRequested: true,
      simulationExecutionRequested: true,
      previewProviderRequested: true,
      providerClientRequested: true,
      credentialEnvReadRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      campaignRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      hiddenExecutionAffordanceRequested: true,
    });
    expect(result.status).toBe("hitl_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["approval cannot execute", "queue cannot create autonomy", "provider clients remain blocked", "fetch/network remains blocked", "audit writing remains blocked"]));
  });

  it("summarizes drift prevention", () => {
    const result = createR74HitlRevenueExecutionDriftRiskAudit(reviewedInput);
    expect(summarizeR74HitlRevenueExecutionDriftAudit(result)).toMatch(/blocks approval/i);
  });
});
