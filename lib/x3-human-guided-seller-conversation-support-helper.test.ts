import { deriveHumanGuidedSellerConversationSupport } from "./x3-human-guided-seller-conversation-support-helper";

describe("X3B human-guided seller conversation support helper", () => {
  it("derives deterministic seller conversation review groups", () => {
    const result = deriveHumanGuidedSellerConversationSupport({ items: [
      { id: "2", label: "Missing timeline", priority: 2, motivationKnown: true, timelineKnown: false, askingPriceKnown: true },
      { id: "1", label: "High opportunity seller", priority: 4, estimatedRevenue: 18000, offerReadinessScore: 82, hasObjection: true, motivationKnown: true, timelineKnown: true, askingPriceKnown: true },
      { id: "3", label: "Stale follow-up", daysSinceSellerTouch: 7, needsFollowUpLanguageReview: true, motivationKnown: false },
    ] });
    expect(result.highOpportunitySellerItems[0]?.id).toBe("1");
    expect(result.timelineReviewItems).toHaveLength(1);
    expect(result.objectionReviewItems).toHaveLength(1);
    expect(result.followUpLanguageReviewItems).toHaveLength(1);
    expect(result.manualConversationGuidance.join(" ")).toMatch(/manually/i);
  });

  it("preserves safety flags and does not imply contact", () => {
    const result = deriveHumanGuidedSellerConversationSupport();
    expect(result.safetyFlags.readOnly).toBe(true);
    expect(result.safetyFlags.sent).toBe(false);
    expect(result.safetyFlags.providerCalled).toBe(false);
    expect(result.safetyFlags.persistenceWritten).toBe(false);
    expect(result.governanceWarnings.join(" ")).toMatch(/No seller contact/);
  });
});
