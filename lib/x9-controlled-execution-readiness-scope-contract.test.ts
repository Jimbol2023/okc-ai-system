import { createX9ControlledExecutionReadinessScopeContract, x9AdvisoryCategories } from "./x9-controlled-execution-readiness-scope-contract";

describe("X9A controlled execution readiness scope contract", () => {
  it("requires review and preserves readiness-only boundaries", () => {
    const result = createX9ControlledExecutionReadinessScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("controlled execution readiness doctrine");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(x9AdvisoryCategories).toContain("controlled-execution-readiness-review-needed");
  });

  it("blocks execution, activation, approval execution, provider, and routing requests", () => {
    const result = createX9ControlledExecutionReadinessScopeContract({ executionRequested: true, activationRequested: true, approvalExecutionRequested: true, providerRequested: true, routingRequested: true });
    expect(result.status).toBe("x9_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot activate/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot grant approval execution/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot route work/);
  });
});
