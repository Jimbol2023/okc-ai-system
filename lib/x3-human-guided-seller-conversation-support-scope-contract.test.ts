import { createX3HumanGuidedSellerConversationSupportScopeContract, x3AdvisoryCategories } from "./x3-human-guided-seller-conversation-support-scope-contract";

describe("X3A human-guided seller conversation support scope contract", () => {
  it("requires scope review and preserves advisory flags", () => {
    const result = createX3HumanGuidedSellerConversationSupportScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("human-guided seller conversation support doctrine");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(x3AdvisoryCategories).toContain("manual-conversation-guidance-only");
  });

  it("blocks contact, sending, execution, and provider requests", () => {
    const result = createX3HumanGuidedSellerConversationSupportScopeContract({ contactRequested: true, sendRequested: true, executionRequested: true, providerRequested: true });
    expect(result.status).toBe("x3_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot contact sellers/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot send messages/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
  });
});
