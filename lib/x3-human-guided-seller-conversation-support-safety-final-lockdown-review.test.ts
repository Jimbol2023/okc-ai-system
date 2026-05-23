import { createX3HumanGuidedSellerConversationSupportSafetyFinalLockdownReview } from "./x3-human-guided-seller-conversation-support-safety-final-lockdown-review";

describe("X3F human-guided seller conversation support safety final lockdown review", () => {
  it("requires final safety review areas", () => {
    const result = createX3HumanGuidedSellerConversationSupportSafetyFinalLockdownReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("seller conversation support does not contact");
    expect(result.missingReviewAreas).toContain("no fetch/network");
    expect(result.flags.runtimeActivationAllowed).toBe(false);
  });

  it("fails closed for contact, sending, provider, and persistence requests", () => {
    const result = createX3HumanGuidedSellerConversationSupportSafetyFinalLockdownReview({ contactRequested: true, sendRequested: true, providerRequested: true, persistenceRequested: true });
    expect(result.status).toBe("x3_final_lockdown_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot contact/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot send messages/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot activate providers/);
    expect(result.blockedReasons.join(" ")).toMatch(/persistence remains blocked/);
  });
});
