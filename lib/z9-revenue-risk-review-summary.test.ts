import { createZ9RevenueRiskReviewList, createZ9RevenueRiskReviewSummary } from "./z9-revenue-risk-review-summary";

describe("Z9D revenue risk review summary", () => {
  it("maps summary states from risk lanes", () => {
    expect(createZ9RevenueRiskReviewSummary({ governanceStop: true }).summaryState).toBe("stop_before_risk_review");
    expect(createZ9RevenueRiskReviewSummary({ missingData: ["source"] }).summaryState).toBe("risk_review_now");
    expect(createZ9RevenueRiskReviewSummary({ nearCloseRiskSignal: true }).summaryState).toBe("risk_review_now");
    expect(createZ9RevenueRiskReviewSummary({ buyerDispositionRiskSignal: true }).summaryState).toBe("risk_review_today");
    expect(createZ9RevenueRiskReviewSummary({ recoveryLane: "multi_bottleneck_recovery" }).summaryState).toBe("risk_review_this_week");
    expect(createZ9RevenueRiskReviewSummary({ recoveryLane: "monitor_recovery", repeatedMonitorOnlyCount: 2 }).summaryState).toBe("monitor_risk_only");
    expect(createZ9RevenueRiskReviewSummary({ terminal: true }).summaryState).toBe("terminal_no_risk_review");
    expect(createZ9RevenueRiskReviewSummary({}).summaryState).toBe("not_ready");
  });

  it("sorts list output deterministically without mutating input", () => {
    const inputs = [
      { id: "c", label: "Monitor", recoveryLane: "monitor_recovery" },
      { id: "a", label: "Near close", nearCloseRiskSignal: true, advisoryRecoveryScore: 80 },
      { id: "b", label: "Stop", governanceStop: true },
    ];
    const before = JSON.stringify(inputs);
    const result = createZ9RevenueRiskReviewList(inputs);
    expect(JSON.stringify(inputs)).toBe(before);
    expect(result.ranked[0]?.inputId).toBe("b");
    expect(result.ranked[1]?.inputId).toBe("a");
    expect(result.countsBySummaryState.stop_before_risk_review).toBe(1);
    expect(result.flags.riskDecisionPersisted).toBe(false);
    expect(result.flags.operatorAlertCreated).toBe(false);
  });
});
