import { deriveDealThroughputOptimizationLayer } from "./x5-deal-throughput-optimization-layer-helper";

describe("X5B deal throughput optimization layer helper", () => {
  it("derives deterministic deal throughput groups from in-memory input", () => {
    const result = deriveDealThroughputOptimizationLayer({ items: [
      { id: "2", label: "Blocked throughput", isBlockedThroughput: true, missingThroughputData: true },
      { id: "1", label: "High impact assignment", priority: 4, estimatedRevenue: 18000, assignmentReadinessScore: 82, closingReadinessScore: 75 },
      { id: "3", label: "Stage friction", stageFrictionScore: 12, daysInStage: 9, revenueDelayRisk: 7 },
    ] });
    expect(result.highImpactThroughputItems[0]?.id).toBe("1");
    expect(result.assignmentReadinessItems).toHaveLength(1);
    expect(result.closingReadinessItems).toHaveLength(1);
    expect(result.blockedThroughputItems).toHaveLength(1);
    expect(result.manualOptimizationRecommendations.join(" ")).toMatch(/manually/i);
  });

  it("preserves safety flags and does not imply execution", () => {
    const result = deriveDealThroughputOptimizationLayer();
    expect(result.safetyFlags.readOnly).toBe(true);
    expect(result.safetyFlags.providerCalled).toBe(false);
    expect(result.safetyFlags.sent).toBe(false);
    expect(result.safetyFlags.runtimeActivated).toBe(false);
    expect(result.governanceWarnings.join(" ")).toMatch(/No execution/);
  });
});
