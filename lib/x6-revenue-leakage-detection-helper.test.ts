import { deriveRevenueLeakageDetection } from "./x6-revenue-leakage-detection-helper";

describe("X6B revenue leakage detection helper", () => {
  it("derives deterministic leakage groups from in-memory input", () => {
    const result = deriveRevenueLeakageDetection({ items: [
      { id: "2", label: "Blocked revenue", isBlockedRevenue: true, missingCriticalData: true },
      { id: "1", label: "Near close risk", priority: 4, estimatedRevenue: 18000, daysToClose: 5, revenueRiskScore: 7, nearCloseRisk: true },
      { id: "3", label: "Stale friction", daysStale: 12, workflowFrictionScore: 9, momentumLossScore: 8, assignmentDelayDays: 4 },
    ] });
    expect(result.nearCloseRiskItems[0]?.id).toBe("1");
    expect(result.blockedRevenueItems).toHaveLength(1);
    expect(result.staleOpportunityItems).toHaveLength(1);
    expect(result.momentumLossItems).toHaveLength(1);
    expect(result.manualRevenueRecommendations.join(" ")).toMatch(/manually/i);
  });

  it("preserves safety flags and does not imply recovery", () => {
    const result = deriveRevenueLeakageDetection();
    expect(result.safetyFlags.readOnly).toBe(true);
    expect(result.safetyFlags.providerCalled).toBe(false);
    expect(result.safetyFlags.sent).toBe(false);
    expect(result.safetyFlags.runtimeActivated).toBe(false);
    expect(result.governanceWarnings.join(" ")).toMatch(/No execution/);
  });
});
