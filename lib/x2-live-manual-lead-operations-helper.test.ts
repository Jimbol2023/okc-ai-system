import { deriveLiveManualLeadOperations } from "./x2-live-manual-lead-operations-helper";

describe("X2B live manual lead operations helper", () => {
  it("derives deterministic lead operation groups from in-memory input", () => {
    const result = deriveLiveManualLeadOperations({ items: [
      { id: "2", label: "Aging lead", leadAgeDays: 20, estimatedRevenue: 8000 },
      { id: "1", label: "High priority seller", priority: 4, daysSinceFollowUp: 5, needsSellerStatusReview: true },
      { id: "3", label: "Blocked workflow", isBlockedWorkflow: true, missingCriticalData: true },
    ] });
    expect(result.highPriorityLeads[0]?.id).toBe("1");
    expect(result.overdueFollowUps).toHaveLength(1);
    expect(result.agingLeads).toHaveLength(1);
    expect(result.blockedWorkflowItems).toHaveLength(1);
    expect(result.manualWorkflowRecommendations.join(" ")).toMatch(/manually/i);
  });

  it("preserves safety flags and does not imply side effects", () => {
    const result = deriveLiveManualLeadOperations();
    expect(result.safetyFlags.readOnly).toBe(true);
    expect(result.safetyFlags.providerCalled).toBe(false);
    expect(result.safetyFlags.persistenceWritten).toBe(false);
    expect(result.safetyFlags.runtimeActivated).toBe(false);
    expect(result.governanceWarnings.join(" ")).toMatch(/No execution/);
  });
});
