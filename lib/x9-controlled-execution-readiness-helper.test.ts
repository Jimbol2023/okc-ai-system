import { deriveControlledExecutionReadiness } from "./x9-controlled-execution-readiness-helper";

describe("X9B controlled execution readiness helper", () => {
  it("derives deterministic readiness groups from in-memory input", () => {
    const result = deriveControlledExecutionReadiness({ items: [
      { id: "2", label: "Provider blocked", providerReadinessBlocked: true, governanceRiskScore: 8 },
      { id: "1", label: "Readiness review", priority: 4, readinessScore: 62, humanReviewRequired: true, daysSinceReadinessReview: 8 },
      { id: "3", label: "Approval execution boundary", approvalExecutionRisk: true, runtimeReadinessBlocked: true, missingReadinessData: true },
    ] });
    expect(result.readinessReviewItems[0]?.id).toBe("1");
    expect(result.providerBlockedItems).toHaveLength(1);
    expect(result.runtimeBlockedItems).toHaveLength(1);
    expect(result.approvalExecutionBoundaryItems).toHaveLength(1);
    expect(result.manualReadinessRecommendations.join(" ")).toMatch(/does not authorize execution/);
  });

  it("preserves safety flags and does not imply activation", () => {
    const result = deriveControlledExecutionReadiness();
    expect(result.safetyFlags.readOnly).toBe(true);
    expect(result.safetyFlags.providerCalled).toBe(false);
    expect(result.safetyFlags.sent).toBe(false);
    expect(result.safetyFlags.runtimeActivated).toBe(false);
    expect(result.governanceWarnings.join(" ")).toMatch(/does not authorize activation/);
  });
});
