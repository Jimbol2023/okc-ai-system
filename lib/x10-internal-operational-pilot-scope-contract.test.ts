import { createX10InternalOperationalPilotScopeContract, x10AdvisoryCategories } from "./x10-internal-operational-pilot-scope-contract";

describe("X10A internal operational pilot scope contract", () => {
  it("requires review and preserves pilot-only boundaries", () => {
    const result = createX10InternalOperationalPilotScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("internal operational pilot doctrine");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.productionActivationAllowed).toBe(false);
    expect(x10AdvisoryCategories).toContain("internal-pilot-review-needed");
  });

  it("blocks execution, sending, provider, routing, and production activation requests", () => {
    const result = createX10InternalOperationalPilotScopeContract({ executionRequested: true, sendRequested: true, providerRequested: true, routingRequested: true, productionActivationRequested: true });
    expect(result.status).toBe("x10_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot send messages/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot route work/);
    expect(result.blockedReasons.join(" ")).toMatch(/production activation remains outside X10 scope/);
  });
});
