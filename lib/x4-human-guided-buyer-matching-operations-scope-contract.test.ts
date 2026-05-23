import { createX4HumanGuidedBuyerMatchingOperationsScopeContract, x4AdvisoryCategories } from "./x4-human-guided-buyer-matching-operations-scope-contract";

describe("X4A human-guided buyer matching operations scope contract", () => {
  it("requires review and preserves buyer matching boundaries", () => {
    const result = createX4HumanGuidedBuyerMatchingOperationsScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("human-guided buyer matching doctrine");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(x4AdvisoryCategories).toContain("buyer-fit-review-needed");
  });

  it("blocks execution, contact, routing, provider, and autonomous assignment requests", () => {
    const result = createX4HumanGuidedBuyerMatchingOperationsScopeContract({ executionRequested: true, contactRequested: true, routingRequested: true, providerRequested: true, autonomousAssignmentRequested: true });
    expect(result.status).toBe("x4_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot contact/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot route work/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/autonomous buyer assignment remains blocked/);
  });
});
