import { createZ7BottleneckCleanupList, createZ7BottleneckCleanupSummary } from "./z7-bottleneck-cleanup-summary";

describe("Z7D bottleneck cleanup summary", () => {
  it("maps summary states from cleanup lanes", () => {
    expect(createZ7BottleneckCleanupSummary({ governanceStop: true }).summaryState).toBe("stop_before_cleanup");
    expect(createZ7BottleneckCleanupSummary({ missingData: ["source"] }).summaryState).toBe("cleanup_now");
    expect(createZ7BottleneckCleanupSummary({ closingSignal: true }).summaryState).toBe("cleanup_now");
    expect(createZ7BottleneckCleanupSummary({ conversionReadinessLevel: "needs_contract_review" }).summaryState).toBe("cleanup_today");
    expect(createZ7BottleneckCleanupSummary({ valuationReady: false }).summaryState).toBe("cleanup_this_week");
    expect(createZ7BottleneckCleanupSummary({ priorityLane: "nurture_monitor" }).summaryState).toBe("monitor_only");
    expect(createZ7BottleneckCleanupSummary({ terminal: true }).summaryState).toBe("no_cleanup_terminal");
    expect(createZ7BottleneckCleanupSummary({}).summaryState).toBe("not_ready");
  });

  it("sorts list output deterministically without mutating input", () => {
    const inputs = [
      { id: "c", label: "Monitor", priorityLane: "nurture_monitor" },
      { id: "a", label: "Closing", closingSignal: true, advisoryScore: 80 },
      { id: "b", label: "Stop", governanceStop: true },
    ];
    const before = JSON.stringify(inputs);
    const result = createZ7BottleneckCleanupList(inputs);
    expect(JSON.stringify(inputs)).toBe(before);
    expect(result.ranked[0]?.inputId).toBe("b");
    expect(result.ranked[1]?.inputId).toBe("a");
    expect(result.countsBySummaryState.stop_before_cleanup).toBe(1);
    expect(result.flags.cleanupPersisted).toBe(false);
    expect(result.flags.dataChanged).toBe(false);
  });
});
