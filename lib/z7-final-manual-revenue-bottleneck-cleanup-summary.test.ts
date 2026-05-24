import { createZ7FinalManualRevenueBottleneckCleanupSummary } from "./z7-final-manual-revenue-bottleneck-cleanup-summary";

describe("Z7F final manual revenue bottleneck cleanup summary", () => {
  it("summarizes Z7 readiness and recommends Z8 next", () => {
    const result = createZ7FinalManualRevenueBottleneckCleanupSummary();
    expect(result.phase).toBe("Z7F");
    expect(result.policyReadiness.phase).toBe("Z7A");
    expect(result.signalReviewReadiness.phase).toBe("Z7B");
    expect(result.classifierReadiness.phase).toBe("Z7C");
    expect(result.cleanupSummaryReadiness.phase).toBe("Z7D");
    expect(result.recommendedNextExactPhase).toBe("Z8 - Manual Revenue Recovery Coordination");
    expect(result.z7Complete).toBe(true);
  });

  it("keeps cleanup, enrichment, and recovery execution blocked", () => {
    const result = createZ7FinalManualRevenueBottleneckCleanupSummary();
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.workAssigned).toBe(false);
    expect(result.flags.queueItemCreated).toBe(false);
    expect(result.flags.calendarItemCreated).toBe(false);
    expect(result.flags.reminderScheduled).toBe(false);
    expect(result.flags.cleanupPersisted).toBe(false);
    expect(result.flags.dataChanged).toBe(false);
    expect(result.flags.enrichmentTriggered).toBe(false);
    expect(result.flags.scrapingTriggered).toBe(false);
    expect(result.flags.skipTraceTriggered).toBe(false);
    expect(result.flags.externalLookupTriggered).toBe(false);
    expect(result.flags.recoveryActionExecuted).toBe(false);
    expect(result.unresolvedBlockers.join(" ")).toMatch(/no cleanup persistence/);
    expect(result.unresolvedBlockers.join(" ")).toMatch(/no enrichment\/scraping\/skip tracing\/external lookup/);
  });
});
