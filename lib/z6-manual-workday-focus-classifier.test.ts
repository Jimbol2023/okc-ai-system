import { classifyZ6ManualWorkdayFocus } from "./z6-manual-workday-focus-classifier";

describe("Z6C manual workday focus classifier", () => {
  it("follows precedence for stop, terminal, cleanup, and review-now", () => {
    expect(classifyZ6ManualWorkdayFocus({ governanceStop: true }).workdayLane).toBe("stop_first");
    expect(classifyZ6ManualWorkdayFocus({ terminal: true }).workdayLane).toBe("no_work_terminal");
    expect(classifyZ6ManualWorkdayFocus({ missingData: ["source"] }).workdayLane).toBe("cleanup_first");
    expect(classifyZ6ManualWorkdayFocus({ summaryLevel: "review_now", advisoryScore: 90 }).workdayLane).toBe("review_now");
  });

  it("classifies near-close, buyer review, follow-up, work-today, monitor, and defer lanes", () => {
    expect(classifyZ6ManualWorkdayFocus({ nearCloseSignal: true }).workdayLane).toBe("near_close_today");
    expect(classifyZ6ManualWorkdayFocus({ buyerReviewSignal: true }).workdayLane).toBe("buyer_review_today");
    expect(classifyZ6ManualWorkdayFocus({ dueFollowUp: true }).workdayLane).toBe("follow_up_today");
    expect(classifyZ6ManualWorkdayFocus({ summaryLevel: "work_today", estimatedRevenue: 20000 }).workdayLane).toBe("work_today");
    expect(classifyZ6ManualWorkdayFocus({ priorityLane: "nurture_monitor" }).workdayLane).toBe("monitor_today");
    expect(classifyZ6ManualWorkdayFocus({ priorityLane: "low_priority" }).workdayLane).toBe("defer_low_priority");
  });

  it("keeps focus score advisory and in-memory only", () => {
    const result = classifyZ6ManualWorkdayFocus({ summaryLevel: "work_today", advisoryScore: 77 });
    expect(result.advisoryFocusScore).toBeGreaterThan(0);
    expect(result.flags.dailyPlanPersisted).toBe(false);
    expect(result.flags.focusMovedToQueue).toBe(false);
  });
});
