import {
  createR70ManualOperatorActionCenterDriftRiskAudit,
  summarizeR70ManualOperatorActionCenterDriftRiskAudit,
} from "./r70-manual-operator-action-center-drift-risk-audit";

const passedInput = {
  r70aReviewed: true,
  recommendationExecutionReviewed: true,
  advisoryProviderReviewed: true,
  priorityUrgencyQueueReviewed: true,
  approvalClickReviewed: true,
  aiRecommendationReviewed: true,
  providerFetchReviewed: true,
  runtimePersistenceAuditReviewed: true,
  dangerousWordingReviewed: true,
} as const;

describe("R70B manual operator action center drift risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR70ManualOperatorActionCenterDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("operator-click-to-execution drift");
  });

  it("smoke-tests drift audit coverage", () => {
    const result = createR70ManualOperatorActionCenterDriftRiskAudit(passedInput);
    expect(result.status).toBe("manual_action_center_drift_audit_passed");
    expect(result.flags.fetchNetworkAllowed).toBe(false);
  });

  it("pressure-tests all execution and provider drift blockers", () => {
    const result = createR70ManualOperatorActionCenterDriftRiskAudit({
      ...passedInput,
      recommendationExecutionDriftFound: true,
      advisoryProviderDriftFound: true,
      prioritySendDriftFound: true,
      urgencySendDriftFound: true,
      queueProviderDriftFound: true,
      approvalSendDriftFound: true,
      operatorClickExecutionDriftFound: true,
      aiRecommendationDriftFound: true,
      providerClientDriftFound: true,
      fetchNetworkDriftFound: true,
      runtimeDriftFound: true,
      persistenceDriftFound: true,
      auditWritingDriftFound: true,
      hiddenExecutionAffordanceFound: true,
    });
    expect(result.status).toBe("manual_action_center_drift_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "recommendation-to-execution drift found",
        "operator-click-to-execution drift found",
        "provider/client drift found",
        "fetch/network drift found",
        "audit-writing drift found",
      ]),
    );
  });

  it("summarizes audit coverage", () => {
    const result = createR70ManualOperatorActionCenterDriftRiskAudit(passedInput);
    expect(summarizeR70ManualOperatorActionCenterDriftRiskAudit(result)).toMatch(/hidden affordances/i);
  });
});
