import { createX7NearCloseDealRecoveryOperationsReadonlyUiScopeContract, x7ReadonlyUiAuthorizedSurfaces, x7ReadonlyUiWording } from "./x7-near-close-deal-recovery-operations-readonly-ui-scope-contract";

describe("X7D near-close deal recovery operations read-only UI scope contract", () => {
  it("defines authorized read-only near-close recovery surfaces and wording", () => {
    const result = createX7NearCloseDealRecoveryOperationsReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(x7ReadonlyUiAuthorizedSurfaces).toContain("components/dashboard/near-close-deal-recovery-operations-summary.tsx");
    expect(x7ReadonlyUiWording.stalledNearClose).toMatch(/does not trigger outreach/);
    expect(result.flags.sent).toBe(false);
  });

  it("blocks controls and side-effect behavior", () => {
    const result = createX7NearCloseDealRecoveryOperationsReadonlyUiScopeContract({ sendControlRequested: true, routingControlRequested: true, fetchNetworkRequested: true });
    expect(result.status).toBe("x7_ui_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/send controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/routing controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/fetch\/network remains blocked/);
  });
});
