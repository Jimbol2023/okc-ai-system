import { deriveNearCloseDealRecoveryOperations } from "./x7-near-close-deal-recovery-operations-helper";

describe("X7B near-close deal recovery operations helper", () => {
  it("derives deterministic near-close recovery groups from in-memory input", () => {
    const result = deriveNearCloseDealRecoveryOperations({ items: [
      { id: "2", label: "Blocked closing", isBlockedClosing: true, missingClosingData: true },
      { id: "1", label: "Near close risk", priority: 4, estimatedRevenue: 19000, daysToClose: 4, recoveryRiskScore: 7, nearCloseRisk: true },
      { id: "3", label: "Stalled assignment", daysStalled: 8, assignmentReadinessScore: 48, buyerReadinessScore: 55 },
    ] });
    expect(result.nearCloseRecoveryItems[0]?.id).toBe("1");
    expect(result.blockedClosingItems).toHaveLength(1);
    expect(result.stalledNearCloseItems).toHaveLength(1);
    expect(result.assignmentRiskItems).toHaveLength(1);
    expect(result.manualRecoveryRecommendations.join(" ")).toMatch(/manually/i);
  });

  it("preserves safety flags and does not imply recovery execution", () => {
    const result = deriveNearCloseDealRecoveryOperations();
    expect(result.safetyFlags.readOnly).toBe(true);
    expect(result.safetyFlags.providerCalled).toBe(false);
    expect(result.safetyFlags.sent).toBe(false);
    expect(result.safetyFlags.runtimeActivated).toBe(false);
    expect(result.governanceWarnings.join(" ")).toMatch(/No execution/);
  });
});
