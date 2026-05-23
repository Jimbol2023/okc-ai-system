import { deriveInternalOperationalPilot } from "./x10-internal-operational-pilot-helper";

describe("X10B internal operational pilot helper", () => {
  it("derives deterministic pilot readiness groups from in-memory input", () => {
    const result = deriveInternalOperationalPilot({ items: [
      { id: "2", label: "Provider blocked", providerBlocked: true, operationalRiskScore: 8 },
      { id: "1", label: "Pilot readiness", priority: 4, pilotReadinessScore: 62, workflowReadinessScore: 58, humanReviewRequired: true, daysSincePilotReview: 8 },
      { id: "3", label: "Execution blocked gap", executionBlocked: true, governanceReadinessScore: 52, readinessGap: true, missingPilotData: true },
    ] });
    expect(result.internalPilotItems[0]?.id).toBe("1");
    expect(result.workflowReadinessItems).toHaveLength(1);
    expect(result.providerBlockedItems).toHaveLength(1);
    expect(result.executionBlockedItems).toHaveLength(1);
    expect(result.manualPilotRecommendations.join(" ")).toMatch(/does not authorize live execution/);
  });

  it("preserves safety flags and does not imply production activation", () => {
    const result = deriveInternalOperationalPilot();
    expect(result.safetyFlags.readOnly).toBe(true);
    expect(result.safetyFlags.providerCalled).toBe(false);
    expect(result.safetyFlags.sent).toBe(false);
    expect(result.safetyFlags.runtimeActivated).toBe(false);
    expect(result.governanceWarnings.join(" ")).toMatch(/does not authorize live execution/);
  });
});
