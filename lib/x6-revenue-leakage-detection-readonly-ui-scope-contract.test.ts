import { createX6RevenueLeakageDetectionReadonlyUiScopeContract, x6ReadonlyUiAuthorizedSurfaces, x6ReadonlyUiWording } from "./x6-revenue-leakage-detection-readonly-ui-scope-contract";

describe("X6D revenue leakage detection read-only UI scope contract", () => {
  it("defines authorized read-only revenue-risk surfaces and wording", () => {
    const result = createX6RevenueLeakageDetectionReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(x6ReadonlyUiAuthorizedSurfaces).toContain("components/dashboard/revenue-leakage-detection-layer-summary.tsx");
    expect(x6ReadonlyUiWording.staleOpportunity).toMatch(/does not trigger outreach/);
    expect(result.flags.sent).toBe(false);
  });

  it("blocks controls and side-effect behavior", () => {
    const result = createX6RevenueLeakageDetectionReadonlyUiScopeContract({ sendControlRequested: true, routingControlRequested: true, fetchNetworkRequested: true });
    expect(result.status).toBe("x6_ui_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/send controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/routing controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/fetch\/network remains blocked/);
  });
});
