import { reviewZ9RevenueRiskSignals } from "./z9-revenue-risk-signal-review";

describe("Z9B revenue risk signal review", () => {
  it("detects stop, contact, terminal, and data confidence risk", () => {
    expect(reviewZ9RevenueRiskSignals({ governanceStop: true }).riskSignalLevel).toBe("governance_stop");
    expect(reviewZ9RevenueRiskSignals({ doNotContact: true }).riskSignalLevel).toBe("contact_risk_stop");
    expect(reviewZ9RevenueRiskSignals({ terminal: true }).riskSignalLevel).toBe("terminal");
    expect(reviewZ9RevenueRiskSignals({ confidenceScore: 40 }).riskSignalLevel).toBe("data_confidence_risk");
    expect(reviewZ9RevenueRiskSignals({ missingData: ["ARV"] }).riskSignalLevel).toBe("data_confidence_risk");
  });

  it("detects revenue risk factors without creating execution", () => {
    expect(reviewZ9RevenueRiskSignals({ nearCloseRiskSignal: true }).riskSignalLevel).toBe("near_close_risk");
    expect(reviewZ9RevenueRiskSignals({ buyerDispositionRiskSignal: true }).riskSignalLevel).toBe("buyer_disposition_risk");
    expect(reviewZ9RevenueRiskSignals({ conversionQualityRiskSignal: true }).riskSignalLevel).toBe("conversion_quality_risk");
    expect(reviewZ9RevenueRiskSignals({ followUpLeakageRiskSignal: true }).riskSignalLevel).toBe("follow_up_leakage_risk");
    expect(reviewZ9RevenueRiskSignals({ recoveryOpportunities: ["follow-up recovery", "conversion recovery", "closing recovery"] }).riskSignalLevel).toBe("near_close_risk");
    expect(reviewZ9RevenueRiskSignals({ daysStalled: 15 }).riskSignalLevel).toBe("recovery_complexity_risk");
    expect(reviewZ9RevenueRiskSignals({ recoveryLane: "monitor_recovery", repeatedMonitorOnlyCount: 2 }).riskSignalLevel).toBe("monitor_risk");
    expect(reviewZ9RevenueRiskSignals({}).riskSignalLevel).toBe("data_confidence_risk");
  });

  it("keeps risk persistence, alerts, and escalation blocked", () => {
    const result = reviewZ9RevenueRiskSignals({ nearCloseRiskSignal: true });
    expect(result.flags.riskEscalationCreated).toBe(false);
    expect(result.flags.riskDecisionPersisted).toBe(false);
    expect(result.flags.riskScorePersisted).toBe(false);
    expect(result.flags.riskRouteCreated).toBe(false);
    expect(result.flags.riskApprovalRequested).toBe(false);
    expect(result.flags.operatorAlertCreated).toBe(false);
    expect(result.flags.riskRecommendationExecuted).toBe(false);
    expect(result.diminishingReturnsNote).toMatch(/monitor-only/);
  });
});
