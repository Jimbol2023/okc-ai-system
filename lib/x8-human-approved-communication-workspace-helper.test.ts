import { deriveHumanApprovedCommunicationWorkspace } from "./x8-human-approved-communication-workspace-helper";

describe("X8B human-approved communication workspace helper", () => {
  it("derives deterministic communication review groups from in-memory input", () => {
    const result = deriveHumanApprovedCommunicationWorkspace({ items: [
      { id: "2", label: "DNC risk", hasDncFlag: true, communicationRiskScore: 8 },
      { id: "1", label: "Approval ready context", priority: 4, humanApprovalReady: true, communicationReadinessScore: 62, daysSinceLastHumanReview: 8 },
      { id: "3", label: "Provider blocked", providerBlocked: true, governanceBlocked: true, missingCommunicationContext: true },
    ] });
    expect(result.communicationReadinessItems[0]?.id).toBe("1");
    expect(result.dncAwarenessItems).toHaveLength(1);
    expect(result.providerBlockedItems).toHaveLength(1);
    expect(result.communicationGovernanceItems.length).toBeGreaterThan(0);
    expect(result.manualCommunicationRecommendations.join(" ")).toMatch(/manually/i);
  });

  it("preserves safety flags and does not imply communication sending", () => {
    const result = deriveHumanApprovedCommunicationWorkspace();
    expect(result.safetyFlags.readOnly).toBe(true);
    expect(result.safetyFlags.providerCalled).toBe(false);
    expect(result.safetyFlags.sent).toBe(false);
    expect(result.safetyFlags.runtimeActivated).toBe(false);
    expect(result.governanceWarnings.join(" ")).toMatch(/No execution/);
  });
});
