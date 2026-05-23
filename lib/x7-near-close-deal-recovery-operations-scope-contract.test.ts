import { createX7NearCloseDealRecoveryOperationsScopeContract, x7AdvisoryCategories } from "./x7-near-close-deal-recovery-operations-scope-contract";

describe("X7A near-close deal recovery operations scope contract", () => {
  it("requires review and preserves near-close recovery boundaries", () => {
    const result = createX7NearCloseDealRecoveryOperationsScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("near-close deal recovery doctrine");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(x7AdvisoryCategories).toContain("near-close-recovery-review-needed");
  });

  it("blocks execution, routing, provider, outreach, and autonomous escalation requests", () => {
    const result = createX7NearCloseDealRecoveryOperationsScopeContract({ executionRequested: true, routingRequested: true, providerRequested: true, outreachRequested: true, autonomousEscalationRequested: true });
    expect(result.status).toBe("x7_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot route work/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/outreach remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/autonomous escalation remains blocked/);
  });
});
