import { createX2LiveManualLeadOperationsScopeContract, x2AdvisoryCategories } from "./x2-live-manual-lead-operations-scope-contract";

describe("X2A live manual lead operations scope contract", () => {
  it("requires all scope review areas before ready status", () => {
    const result = createX2LiveManualLeadOperationsScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("live manual lead operations doctrine");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(x2AdvisoryCategories).toContain("manual-lead-review-needed");
  });

  it("fails closed when forbidden behavior is requested", () => {
    const result = createX2LiveManualLeadOperationsScopeContract({ executionRequested: true, contactRequested: true, providerRequested: true });
    expect(result.status).toBe("x2_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot contact/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
  });
});
