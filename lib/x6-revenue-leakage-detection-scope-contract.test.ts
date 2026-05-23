import { createX6RevenueLeakageDetectionScopeContract, x6AdvisoryCategories } from "./x6-revenue-leakage-detection-scope-contract";

describe("X6A revenue leakage detection scope contract", () => {
  it("requires review and preserves leakage detection boundaries", () => {
    const result = createX6RevenueLeakageDetectionScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("revenue leakage doctrine");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(x6AdvisoryCategories).toContain("stale-opportunity-review-needed");
  });

  it("blocks execution, routing, provider, outreach, and autonomous escalation requests", () => {
    const result = createX6RevenueLeakageDetectionScopeContract({ executionRequested: true, routingRequested: true, providerRequested: true, outreachRequested: true, autonomousEscalationRequested: true });
    expect(result.status).toBe("x6_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot route work/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/outreach remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/autonomous escalation remains blocked/);
  });
});
