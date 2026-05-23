import { createX4HumanGuidedBuyerMatchingOperationsReadonlyUiScopeContract, x4ReadonlyUiAuthorizedSurfaces, x4ReadonlyUiWording } from "./x4-human-guided-buyer-matching-operations-readonly-ui-scope-contract";

describe("X4D human-guided buyer matching operations read-only UI scope contract", () => {
  it("defines authorized read-only buyer operations surfaces and wording", () => {
    const result = createX4HumanGuidedBuyerMatchingOperationsReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(x4ReadonlyUiAuthorizedSurfaces).toContain("components/dashboard/human-guided-buyer-matching-operations-summary.tsx");
    expect(x4ReadonlyUiWording.assignmentReadiness).toMatch(/does not assign buyers/);
    expect(result.flags.sent).toBe(false);
  });

  it("blocks controls and side-effect behavior", () => {
    const result = createX4HumanGuidedBuyerMatchingOperationsReadonlyUiScopeContract({ sendControlRequested: true, routingControlRequested: true, fetchNetworkRequested: true });
    expect(result.status).toBe("x4_ui_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/send controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/routing controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/fetch\/network remains blocked/);
  });
});
