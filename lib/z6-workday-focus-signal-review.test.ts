import { reviewZ6WorkdayFocusSignals } from "./z6-workday-focus-signal-review";

describe("Z6B workday focus signal review", () => {
  it("detects stop, blocked, terminal, and cleanup signals", () => {
    expect(reviewZ6WorkdayFocusSignals({ governanceStop: true }).focusSignalLevel).toBe("governance_stop");
    expect(reviewZ6WorkdayFocusSignals({ doNotContact: true }).focusSignalLevel).toBe("blocked");
    expect(reviewZ6WorkdayFocusSignals({ terminal: true }).focusSignalLevel).toBe("terminal");
    expect(reviewZ6WorkdayFocusSignals({ priorityLane: "data_quality_priority" }).focusSignalLevel).toBe("cleanup");
  });

  it("detects workday focus pressure signals", () => {
    expect(reviewZ6WorkdayFocusSignals({ summaryLevel: "review_now" }).focusSignalLevel).toBe("review_now");
    expect(reviewZ6WorkdayFocusSignals({ summaryLevel: "work_today" }).focusSignalLevel).toBe("work_today");
    expect(reviewZ6WorkdayFocusSignals({ overdueFollowUp: true }).focusSignalLevel).toBe("follow_up_today");
    expect(reviewZ6WorkdayFocusSignals({ nearCloseSignal: true }).focusSignalLevel).toBe("near_close_today");
    expect(reviewZ6WorkdayFocusSignals({ buyerReviewSignal: true }).focusSignalLevel).toBe("buyer_review_today");
    expect(reviewZ6WorkdayFocusSignals({ priorityLane: "nurture_monitor" }).focusSignalLevel).toBe("monitor");
    expect(reviewZ6WorkdayFocusSignals({ priorityLane: "low_priority" }).focusSignalLevel).toBe("defer_low_priority");
  });

  it("does not authorize workday artifacts", () => {
    const result = reviewZ6WorkdayFocusSignals({ summaryLevel: "work_today" });
    expect(result.flags.calendarItemCreated).toBe(false);
    expect(result.flags.reminderScheduled).toBe(false);
    expect(result.flags.dailyPlanPersisted).toBe(false);
    expect(result.flags.workdayAutomationTriggered).toBe(false);
  });
});
