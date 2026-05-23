import { createX10InternalOperationalPilotReadonlyUiScopeContract, x10ReadonlyUiAuthorizedSurfaces, x10ReadonlyUiWording } from "./x10-internal-operational-pilot-readonly-ui-scope-contract";

describe("X10D internal operational pilot read-only UI scope contract", () => {
  it("defines authorized read-only pilot surfaces and wording", () => {
    const result = createX10InternalOperationalPilotReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(x10ReadonlyUiAuthorizedSurfaces).toContain("components/dashboard/internal-operational-pilot-summary.tsx");
    expect(x10ReadonlyUiWording.pilotReadiness).toMatch(/advisory only/);
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("blocks controls and side-effect behavior", () => {
    const result = createX10InternalOperationalPilotReadonlyUiScopeContract({ sendControlRequested: true, providerControlRequested: true, fetchNetworkRequested: true });
    expect(result.status).toBe("x10_ui_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/send controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/fetch\/network remains blocked/);
  });
});
