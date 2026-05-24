import { classifyZ9ManualRiskReview } from "./z9-manual-risk-review-classifier";

describe("Z9C manual risk review classifier", () => {
  it("follows precedence for stop, terminal, and data confidence risk", () => {
    expect(classifyZ9ManualRiskReview({ governanceStop: true }).riskLane).toBe("governance_stop");
    expect(classifyZ9ManualRiskReview({ blocked: true }).riskLane).toBe("contact_risk_stop");
    expect(classifyZ9ManualRiskReview({ terminal: true }).riskLane).toBe("terminal_no_risk_review");
    expect(classifyZ9ManualRiskReview({ dataQualityScore: 30 }).riskLane).toBe("data_confidence_risk");
  });

  it("classifies near-close, buyer, conversion, follow-up, complexity, and monitor risk", () => {
    expect(classifyZ9ManualRiskReview({ nearCloseRiskSignal: true }).riskLane).toBe("near_close_risk");
    expect(classifyZ9ManualRiskReview({ buyerDispositionRiskSignal: true }).riskLane).toBe("buyer_disposition_risk");
    expect(classifyZ9ManualRiskReview({ conversionQualityRiskSignal: true }).riskLane).toBe("conversion_quality_risk");
    expect(classifyZ9ManualRiskReview({ followUpLeakageRiskSignal: true }).riskLane).toBe("follow_up_leakage_risk");
    expect(classifyZ9ManualRiskReview({ recoveryLane: "multi_bottleneck_recovery" }).riskLane).toBe("recovery_complexity_risk");
    expect(classifyZ9ManualRiskReview({ recoveryLane: "monitor_recovery", repeatedMonitorOnlyCount: 3 }).riskLane).toBe("monitor_risk");
  });

  it("keeps risk score advisory and penalizes redundant monitor signals", () => {
    const strong = classifyZ9ManualRiskReview({ followUpLeakageRiskSignal: true, advisoryRecoveryScore: 70 });
    const redundant = classifyZ9ManualRiskReview({ followUpLeakageRiskSignal: true, advisoryRecoveryScore: 70, redundantSignalCount: 4 });
    expect(strong.advisoryRiskScore).toBeGreaterThan(redundant.advisoryRiskScore);
    expect(redundant.confidence).toBe("low");
    expect(strong.flags.riskScorePersisted).toBe(false);
    expect(strong.flags.riskRecommendationExecuted).toBe(false);
  });
});
