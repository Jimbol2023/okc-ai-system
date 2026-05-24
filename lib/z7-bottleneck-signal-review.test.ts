import { reviewZ7BottleneckSignals } from "./z7-bottleneck-signal-review";

describe("Z7B bottleneck signal review", () => {
  it("detects stop, contact safety, terminal, and missing data signals", () => {
    expect(reviewZ7BottleneckSignals({ governanceStop: true }).bottleneckSignalLevel).toBe("governance_stop");
    expect(reviewZ7BottleneckSignals({ doNotContact: true }).bottleneckSignalLevel).toBe("contact_safety_blocker");
    expect(reviewZ7BottleneckSignals({ terminal: true }).bottleneckSignalLevel).toBe("terminal");
    expect(reviewZ7BottleneckSignals({ missingData: ["property facts"] }).bottleneckSignalLevel).toBe("missing_critical_data");
  });

  it("detects revenue bottleneck pressure signals", () => {
    expect(reviewZ7BottleneckSignals({ valuationReady: false }).bottleneckSignalLevel).toBe("valuation_bottleneck");
    expect(reviewZ7BottleneckSignals({ overdueFollowUp: true }).bottleneckSignalLevel).toBe("follow_up_bottleneck");
    expect(reviewZ7BottleneckSignals({ conversionReadinessLevel: "needs_contract_review" }).bottleneckSignalLevel).toBe("conversion_bottleneck");
    expect(reviewZ7BottleneckSignals({ buyerReviewSignal: true }).bottleneckSignalLevel).toBe("buyer_disposition_bottleneck");
    expect(reviewZ7BottleneckSignals({ closingSignal: true }).bottleneckSignalLevel).toBe("closing_bottleneck");
    expect(reviewZ7BottleneckSignals({ daysStalled: 9 }).bottleneckSignalLevel).toBe("workflow_stall");
    expect(reviewZ7BottleneckSignals({ priorityLane: "nurture_monitor" }).bottleneckSignalLevel).toBe("monitor_only");
  });

  it("does not authorize cleanup or enrichment behavior", () => {
    const result = reviewZ7BottleneckSignals({ closingSignal: true });
    expect(result.flags.cleanupPersisted).toBe(false);
    expect(result.flags.dataChanged).toBe(false);
    expect(result.flags.enrichmentTriggered).toBe(false);
    expect(result.flags.scrapingTriggered).toBe(false);
    expect(result.flags.skipTraceTriggered).toBe(false);
    expect(result.flags.externalLookupTriggered).toBe(false);
    expect(result.flags.recoveryActionExecuted).toBe(false);
  });
});
