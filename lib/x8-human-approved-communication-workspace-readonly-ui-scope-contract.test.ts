import { createX8HumanApprovedCommunicationWorkspaceReadonlyUiScopeContract, x8ReadonlyUiAuthorizedSurfaces, x8ReadonlyUiWording } from "./x8-human-approved-communication-workspace-readonly-ui-scope-contract";

describe("X8D human-approved communication workspace read-only UI scope contract", () => {
  it("defines authorized read-only communication surfaces and wording", () => {
    const result = createX8HumanApprovedCommunicationWorkspaceReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(x8ReadonlyUiAuthorizedSurfaces).toContain("components/dashboard/human-approved-communication-workspace-summary.tsx");
    expect(x8ReadonlyUiWording.communicationReadiness).toMatch(/does not send messages/);
    expect(result.flags.sent).toBe(false);
  });

  it("blocks controls and side-effect behavior", () => {
    const result = createX8HumanApprovedCommunicationWorkspaceReadonlyUiScopeContract({ sendControlRequested: true, providerControlRequested: true, fetchNetworkRequested: true });
    expect(result.status).toBe("x8_ui_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/send controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/fetch\/network remains blocked/);
  });
});
