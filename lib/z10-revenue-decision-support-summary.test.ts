import { createZ10RevenueDecisionSupportList, createZ10RevenueDecisionSupportSummary } from "./z10-revenue-decision-support-summary";

describe("Z10D revenue decision support summary", () => {
  it("maps summary states from decision lanes", () => {
    expect(createZ10RevenueDecisionSupportSummary({ governanceStop: true }).summaryState).toBe("stop_before_decision");
    expect(createZ10RevenueDecisionSupportSummary({ missingData: ["source"] }).summaryState).toBe("needs_cleanup");
    expect(createZ10RevenueDecisionSupportSummary({ riskLane: "near_close_risk" }).summaryState).toBe("risk_review_first");
    expect(createZ10RevenueDecisionSupportSummary({ estimatedRevenue: 25000 }).summaryState).toBe("decision_review_now");
    expect(createZ10RevenueDecisionSupportSummary({ priorityLane: "near_conversion" }).summaryState).toBe("decision_review_today");
    expect(createZ10RevenueDecisionSupportSummary({ riskLane: "monitor_risk" }).summaryState).toBe("monitor_only");
    expect(createZ10RevenueDecisionSupportSummary({ priorityLane: "low_priority", estimatedRevenue: 1000 }).summaryState).toBe("defer");
    expect(createZ10RevenueDecisionSupportSummary({ terminal: true }).summaryState).toBe("terminal_no_decision");
    expect(createZ10RevenueDecisionSupportSummary({ redundantSignalCount: 3, riskLane: "monitor_risk" }).summaryState).toBe("consolidate_next");
    expect(createZ10RevenueDecisionSupportSummary({}).summaryState).toBe("not_ready");
  });

  it("sorts list output deterministically without mutating input", () => {
    const inputs = [
      { id: "c", label: "Monitor", riskLane: "monitor_risk" },
      { id: "a", label: "Revenue", estimatedRevenue: 30000, advisoryScore: 80 },
      { id: "b", label: "Stop", governanceStop: true },
    ];
    const before = JSON.stringify(inputs);
    const result = createZ10RevenueDecisionSupportList(inputs);
    expect(JSON.stringify(inputs)).toBe(before);
    expect(result.ranked[0]?.inputId).toBe("b");
    expect(result.ranked[1]?.inputId).toBe("a");
    expect(result.countsBySummaryState.stop_before_decision).toBe(1);
    expect(result.flags.decisionPersisted).toBe(false);
    expect(result.flags.leadStatusChanged).toBe(false);
  });
});
