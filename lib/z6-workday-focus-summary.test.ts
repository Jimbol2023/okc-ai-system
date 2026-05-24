import { createZ6WorkdayFocusList, createZ6WorkdayFocusSummary } from "./z6-workday-focus-summary";

describe("Z6D workday focus summary", () => {
  it("maps summary states from focus lanes", () => {
    expect(createZ6WorkdayFocusSummary({ governanceStop: true }).summaryState).toBe("stop_before_work");
    expect(createZ6WorkdayFocusSummary({ missingData: ["source"] }).summaryState).toBe("cleanup_before_work");
    expect(createZ6WorkdayFocusSummary({ summaryLevel: "review_now", advisoryScore: 90 }).summaryState).toBe("focus_now");
    expect(createZ6WorkdayFocusSummary({ summaryLevel: "work_today" }).summaryState).toBe("focus_today");
    expect(createZ6WorkdayFocusSummary({ priorityLane: "nurture_monitor" }).summaryState).toBe("monitor_only");
    expect(createZ6WorkdayFocusSummary({ priorityLane: "low_priority" }).summaryState).toBe("defer");
    expect(createZ6WorkdayFocusSummary({ terminal: true }).summaryState).toBe("no_work");
    expect(createZ6WorkdayFocusSummary({}).summaryState).toBe("not_ready");
  });

  it("sorts list output deterministically without mutating input", () => {
    const inputs = [
      { id: "c", label: "Monitor", priorityLane: "nurture_monitor" },
      { id: "a", label: "Review", summaryLevel: "review_now", advisoryScore: 90 },
      { id: "b", label: "Stop", governanceStop: true },
    ];
    const before = JSON.stringify(inputs);
    const result = createZ6WorkdayFocusList(inputs);
    expect(JSON.stringify(inputs)).toBe(before);
    expect(result.ranked[0]?.inputId).toBe("b");
    expect(result.ranked[1]?.inputId).toBe("a");
    expect(result.countsBySummaryState.stop_before_work).toBe(1);
    expect(result.flags.operatorAssigned).toBe(false);
    expect(result.flags.calendarItemCreated).toBe(false);
  });
});
