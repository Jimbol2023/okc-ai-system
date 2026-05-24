import { createZ6ManualRevenueWorkdayPolicyReview, z6ManualRevenueWorkdayFlags, z6WorkdayFocusLaneMetadata, z6WorkdayFocusLanes } from "./z6-manual-revenue-workday-policy";

describe("Z6A manual revenue workday policy", () => {
  it("defines deterministic advisory workday focus lanes", () => {
    expect(z6WorkdayFocusLanes).toEqual([
      "stop_first",
      "cleanup_first",
      "review_now",
      "work_today",
      "follow_up_today",
      "near_close_today",
      "buyer_review_today",
      "monitor_today",
      "defer_low_priority",
      "no_work_terminal",
    ]);

    for (const lane of z6WorkdayFocusLanes) {
      const metadata = z6WorkdayFocusLaneMetadata[lane];
      expect(metadata.label).toBeTruthy();
      expect(metadata.manualMeaning).toBeTruthy();
      expect(metadata.revenuePurpose).toBeTruthy();
      expect(metadata.requiresHumanReview).toBe(true);
      expect(metadata.blockedExecutionBoundary).toMatch(/no task/i);
    }
  });

  it("preserves all Z6 lockdown flags", () => {
    const result = createZ6ManualRevenueWorkdayPolicyReview();
    expect(result.flags).toBe(z6ManualRevenueWorkdayFlags);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.queueCreated).toBe(false);
    expect(result.flags.workAssigned).toBe(false);
    expect(result.flags.leadRouted).toBe(false);
    expect(result.flags.revenueActionExecuted).toBe(false);
    expect(result.flags.calendarItemCreated).toBe(false);
    expect(result.flags.reminderScheduled).toBe(false);
    expect(result.flags.dailyPlanPersisted).toBe(false);
    expect(result.flags.workBlockCreated).toBe(false);
    expect(result.flags.operatorAssigned).toBe(false);
    expect(result.flags.focusMovedToQueue).toBe(false);
    expect(result.flags.workdayAutomationTriggered).toBe(false);
  });
});
