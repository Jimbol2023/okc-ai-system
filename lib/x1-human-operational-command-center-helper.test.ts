import { deriveHumanOperationalCommandCenter } from "./x1-human-operational-command-center-helper";

describe("X1B human operational command center helper", () => {
  it("derives deterministic command center groups from in-memory input", () => {
    const result = deriveHumanOperationalCommandCenter({ items: [
      { id: "2", label: "Buyer ready", isBuyerReady: true, estimatedRevenue: 12000 },
      { id: "1", label: "Hot seller", priority: 4, isHotSeller: true, daysSinceFollowUp: 5 },
      { id: "3", label: "Blocked", isBlocked: true, missingCriticalData: true },
    ] });
    expect(result.topFocusItems[0]?.id).toBe("1");
    expect(result.hotSellerItems).toHaveLength(1);
    expect(result.blockedItems).toHaveLength(1);
    expect(result.manualNextBestActions.join(" ")).toMatch(/manually/i);
  });

  it("preserves safety flags and does not imply side effects", () => {
    const result = deriveHumanOperationalCommandCenter();
    expect(result.safetyFlags.readOnly).toBe(true);
    expect(result.safetyFlags.providerCalled).toBe(false);
    expect(result.safetyFlags.persistenceWritten).toBe(false);
    expect(result.governanceWarnings.join(" ")).toMatch(/No execution/);
  });
});
