import { deriveHumanGuidedBuyerMatchingOperations } from "./x4-human-guided-buyer-matching-operations-helper";

describe("X4B human-guided buyer matching operations helper", () => {
  it("derives deterministic buyer matching groups from in-memory input", () => {
    const result = deriveHumanGuidedBuyerMatchingOperations({ items: [
      { id: "2", label: "Blocked disposition", isBlockedDisposition: true, missingBuyerData: true, buyerCapacityKnown: false },
      { id: "1", label: "Strong buyer fit", priority: 4, buyerFitScore: 84, buyerDemandScore: 78, assignmentReadinessScore: 82, estimatedRevenue: 18000 },
      { id: "3", label: "Throughput risk", throughputRisk: 8, dispositionReadinessScore: 74 },
    ] });
    expect(result.buyerFitItems[0]?.id).toBe("1");
    expect(result.assignmentReadinessItems).toHaveLength(1);
    expect(result.blockedDispositionItems).toHaveLength(1);
    expect(result.revenueThroughputItems.length).toBeGreaterThan(0);
    expect(result.manualBuyerRecommendations.join(" ")).toMatch(/manually/i);
  });

  it("preserves safety flags and does not imply buyer contact", () => {
    const result = deriveHumanGuidedBuyerMatchingOperations();
    expect(result.safetyFlags.readOnly).toBe(true);
    expect(result.safetyFlags.sent).toBe(false);
    expect(result.safetyFlags.providerCalled).toBe(false);
    expect(result.safetyFlags.persistenceWritten).toBe(false);
    expect(result.governanceWarnings.join(" ")).toMatch(/No execution/);
  });
});
