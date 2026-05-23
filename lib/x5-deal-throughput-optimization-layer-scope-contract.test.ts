import { createX5DealThroughputOptimizationLayerScopeContract, x5AdvisoryCategories } from "./x5-deal-throughput-optimization-layer-scope-contract";

describe("X5A deal throughput optimization layer scope contract", () => {
  it("requires review and preserves throughput boundaries", () => {
    const result = createX5DealThroughputOptimizationLayerScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("deal throughput optimization doctrine");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(x5AdvisoryCategories).toContain("deal-throughput-review-needed");
  });

  it("blocks execution, routing, automation, provider, and outreach requests", () => {
    const result = createX5DealThroughputOptimizationLayerScopeContract({ executionRequested: true, routingRequested: true, automationRequested: true, providerRequested: true, outreachRequested: true });
    expect(result.status).toBe("x5_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot route work/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot automate/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/outreach remains blocked/);
  });
});
