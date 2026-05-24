import { createZ5ManualRevenuePrioritizationPolicyReview, z5ManualRevenuePrioritizationFlags, z5RevenuePriorityLaneMetadata, z5RevenuePriorityLanes } from "./z5-manual-revenue-prioritization-policy";

describe("Z5A manual revenue prioritization policy", () => {
  it("defines deterministic advisory priority lanes", () => {
    expect(z5RevenuePriorityLanes).toEqual([
      "governance_stop",
      "blocked_cleanup",
      "work_first",
      "near_conversion",
      "near_close_revenue",
      "buyer_disposition_priority",
      "follow_up_priority",
      "data_quality_priority",
      "nurture_monitor",
      "low_priority",
    ]);

    for (const lane of z5RevenuePriorityLanes) {
      const metadata = z5RevenuePriorityLaneMetadata[lane];
      expect(metadata.label).toBeTruthy();
      expect(metadata.manualMeaning).toBeTruthy();
      expect(metadata.revenuePurpose).toBeTruthy();
      expect(metadata.requiresHumanReview).toBe(true);
      expect(metadata.blockedExecutionBoundary).toMatch(/no work assignment/i);
    }
  });

  it("preserves all Z5 lockdown flags", () => {
    const result = createZ5ManualRevenuePrioritizationPolicyReview();
    expect(result.flags).toBe(z5ManualRevenuePrioritizationFlags);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.followUpTaskCreated).toBe(false);
    expect(result.flags.queueCreated).toBe(false);
    expect(result.flags.offerSent).toBe(false);
    expect(result.flags.contractGenerated).toBe(false);
    expect(result.flags.buyerContacted).toBe(false);
    expect(result.flags.sellerContacted).toBe(false);
    expect(result.flags.statusChanged).toBe(false);
    expect(result.flags.dealMovedStage).toBe(false);
    expect(result.flags.conversionActionExecuted).toBe(false);
    expect(result.flags.workAssigned).toBe(false);
    expect(result.flags.queueItemCreated).toBe(false);
    expect(result.flags.priorityPersisted).toBe(false);
    expect(result.flags.rankPersisted).toBe(false);
    expect(result.flags.operatorTaskCreated).toBe(false);
    expect(result.flags.leadRouted).toBe(false);
    expect(result.flags.revenueActionExecuted).toBe(false);
    expect(result.flags.notificationCreated).toBe(false);
  });
});
