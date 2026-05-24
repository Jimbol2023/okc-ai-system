import { createZ6FinalManualRevenueWorkdayFocusSummary } from "./z6-final-manual-revenue-workday-focus-summary";

describe("Z6F final manual revenue workday focus summary", () => {
  it("summarizes Z6 readiness and recommends Z7 next", () => {
    const result = createZ6FinalManualRevenueWorkdayFocusSummary();
    expect(result.phase).toBe("Z6F");
    expect(result.policyReadiness.phase).toBe("Z6A");
    expect(result.signalReadiness.phase).toBe("Z6B");
    expect(result.classifierReadiness.phase).toBe("Z6C");
    expect(result.focusSummaryReadiness.phase).toBe("Z6D");
    expect(result.recommendedNextExactPhase).toBe("Z7 - Manual Revenue Bottleneck Cleanup");
    expect(result.z6Complete).toBe(true);
  });

  it("keeps workday execution and persistence blocked", () => {
    const result = createZ6FinalManualRevenueWorkdayFocusSummary();
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.workAssigned).toBe(false);
    expect(result.flags.queueItemCreated).toBe(false);
    expect(result.flags.calendarItemCreated).toBe(false);
    expect(result.flags.reminderScheduled).toBe(false);
    expect(result.flags.dailyPlanPersisted).toBe(false);
    expect(result.flags.workBlockCreated).toBe(false);
    expect(result.flags.operatorAssigned).toBe(false);
    expect(result.flags.focusMovedToQueue).toBe(false);
    expect(result.flags.workdayAutomationTriggered).toBe(false);
    expect(result.unresolvedBlockers.join(" ")).toMatch(/no workday persistence/);
  });
});
