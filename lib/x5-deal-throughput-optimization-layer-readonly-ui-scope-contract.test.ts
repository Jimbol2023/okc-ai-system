import { createX5DealThroughputOptimizationLayerReadonlyUiScopeContract, x5ReadonlyUiAuthorizedSurfaces, x5ReadonlyUiWording } from "./x5-deal-throughput-optimization-layer-readonly-ui-scope-contract";

describe("X5D deal throughput optimization layer read-only UI scope contract", () => {
  it("defines authorized read-only throughput surfaces and wording", () => {
    const result = createX5DealThroughputOptimizationLayerReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(x5ReadonlyUiAuthorizedSurfaces).toContain("components/dashboard/deal-throughput-optimization-layer-summary.tsx");
    expect(x5ReadonlyUiWording.stageFriction).toMatch(/does not route work/);
    expect(result.flags.providerCalled).toBe(false);
  });

  it("blocks controls and side-effect behavior", () => {
    const result = createX5DealThroughputOptimizationLayerReadonlyUiScopeContract({ buttonRequested: true, routingControlRequested: true, fetchNetworkRequested: true });
    expect(result.status).toBe("x5_ui_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/buttons remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/routing controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/fetch\/network remains blocked/);
  });
});
