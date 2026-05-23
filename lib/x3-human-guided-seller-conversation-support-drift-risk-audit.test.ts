import { classifyX3SellerConversationDangerousWording, createX3HumanGuidedSellerConversationSupportDriftRiskAudit } from "./x3-human-guided-seller-conversation-support-drift-risk-audit";

describe("X3C human-guided seller conversation support drift risk audit", () => {
  it("detects missing drift reviews", () => {
    const result = createX3HumanGuidedSellerConversationSupportDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("conversation-guidance-to-contact drift");
    expect(result.flags.sent).toBe(false);
  });

  it("blocks contact, sending, routing, and dangerous wording", () => {
    const result = createX3HumanGuidedSellerConversationSupportDriftRiskAudit({ contactRequested: true, sendRequested: true, routingRequested: true });
    expect(result.status).toBe("x3_drift_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/contact sellers/);
    expect(result.blockedReasons.join(" ")).toMatch(/send messages/);
    expect(result.blockedReasons.join(" ")).toMatch(/route work/);
    expect(classifyX3SellerConversationDangerousWording("contact seller")).toBe("dangerous_wording_detected");
    expect(classifyX3SellerConversationDangerousWording("Manual conversation guidance only")).toBe("wording_clear");
  });
});
