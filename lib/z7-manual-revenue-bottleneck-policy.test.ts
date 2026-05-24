import { createZ7ManualRevenueBottleneckPolicyReview, z7BottleneckCleanupLaneMetadata, z7BottleneckCleanupLanes, z7ManualRevenueBottleneckFlags } from "./z7-manual-revenue-bottleneck-policy";

describe("Z7A manual revenue bottleneck policy", () => {
  it("defines deterministic advisory bottleneck cleanup lanes", () => {
    expect(z7BottleneckCleanupLanes).toEqual([
      "governance_stop",
      "contact_safety_blocker",
      "missing_critical_data",
      "valuation_bottleneck",
      "follow_up_bottleneck",
      "conversion_bottleneck",
      "buyer_disposition_bottleneck",
      "closing_bottleneck",
      "workflow_stall",
      "monitor_only",
    ]);

    for (const lane of z7BottleneckCleanupLanes) {
      const metadata = z7BottleneckCleanupLaneMetadata[lane];
      expect(metadata.label).toBeTruthy();
      expect(metadata.manualMeaning).toBeTruthy();
      expect(metadata.revenuePurpose).toBeTruthy();
      expect(metadata.requiresHumanReview).toBe(true);
      expect(metadata.blockedExecutionBoundary).toMatch(/no cleanup persistence/i);
    }
  });

  it("preserves all Z7 lockdown flags", () => {
    const result = createZ7ManualRevenueBottleneckPolicyReview();
    expect(result.flags).toBe(z7ManualRevenueBottleneckFlags);
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
    expect(result.flags.workdayAutomationTriggered).toBe(false);
    expect(result.flags.bottleneckResolved).toBe(false);
    expect(result.flags.cleanupPersisted).toBe(false);
    expect(result.flags.dataChanged).toBe(false);
    expect(result.flags.enrichmentTriggered).toBe(false);
    expect(result.flags.skipTraceTriggered).toBe(false);
    expect(result.flags.scrapingTriggered).toBe(false);
    expect(result.flags.externalLookupTriggered).toBe(false);
    expect(result.flags.resolutionTaskCreated).toBe(false);
    expect(result.flags.recoveryActionExecuted).toBe(false);
  });
});
