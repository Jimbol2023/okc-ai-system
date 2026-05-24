import { classifyZ7BottleneckCleanup } from "./z7-bottleneck-cleanup-classifier";

describe("Z7C bottleneck cleanup classifier", () => {
  it("follows precedence for stop, terminal, and missing data", () => {
    expect(classifyZ7BottleneckCleanup({ governanceStop: true }).cleanupLane).toBe("governance_stop");
    expect(classifyZ7BottleneckCleanup({ doNotContact: true }).cleanupLane).toBe("contact_safety_blocker");
    expect(classifyZ7BottleneckCleanup({ terminal: true }).cleanupLane).toBe("monitor_only");
    expect(classifyZ7BottleneckCleanup({ missingData: ["source"] }).cleanupLane).toBe("missing_critical_data");
  });

  it("classifies closing, buyer, conversion, follow-up, valuation, stall, and monitor lanes", () => {
    expect(classifyZ7BottleneckCleanup({ closingSignal: true }).cleanupLane).toBe("closing_bottleneck");
    expect(classifyZ7BottleneckCleanup({ buyerReviewSignal: true }).cleanupLane).toBe("buyer_disposition_bottleneck");
    expect(classifyZ7BottleneckCleanup({ conversionReadinessLevel: "needs_offer_review" }).cleanupLane).toBe("conversion_bottleneck");
    expect(classifyZ7BottleneckCleanup({ staleFollowUp: true }).cleanupLane).toBe("follow_up_bottleneck");
    expect(classifyZ7BottleneckCleanup({ valuationReady: false }).cleanupLane).toBe("valuation_bottleneck");
    expect(classifyZ7BottleneckCleanup({ daysInStage: 21 }).cleanupLane).toBe("workflow_stall");
    expect(classifyZ7BottleneckCleanup({ priorityLane: "nurture_monitor" }).cleanupLane).toBe("monitor_only");
  });

  it("keeps cleanup score advisory and in-memory only", () => {
    const result = classifyZ7BottleneckCleanup({ closingSignal: true, advisoryScore: 80 });
    expect(result.advisoryCleanupScore).toBeGreaterThan(0);
    expect(result.flags.cleanupPersisted).toBe(false);
    expect(result.flags.bottleneckResolved).toBe(false);
    expect(result.flags.resolutionTaskCreated).toBe(false);
  });
});
