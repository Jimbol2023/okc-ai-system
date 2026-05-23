import { classifyX4BuyerMatchingDangerousWording, createX4HumanGuidedBuyerMatchingOperationsDriftRiskAudit } from "./x4-human-guided-buyer-matching-operations-drift-risk-audit";

describe("X4C human-guided buyer matching operations drift risk audit", () => {
  it("detects missing drift reviews", () => {
    const result = createX4HumanGuidedBuyerMatchingOperationsDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("buyer-review-to-execution drift");
    expect(result.flags.runtimeActivationAllowed).toBe(false);
  });

  it("blocks outreach, routing, autonomous assignment, and dangerous wording", () => {
    const result = createX4HumanGuidedBuyerMatchingOperationsDriftRiskAudit({ outreachRequested: true, routingRequested: true, autonomousAssignmentRequested: true });
    expect(result.status).toBe("x4_drift_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/outreach/);
    expect(result.blockedReasons.join(" ")).toMatch(/route work/);
    expect(result.blockedReasons.join(" ")).toMatch(/autonomous buyer assignment/);
    expect(classifyX4BuyerMatchingDangerousWording("assign automatically")).toBe("dangerous_wording_detected");
    expect(classifyX4BuyerMatchingDangerousWording("Manual buyer review visibility only")).toBe("wording_clear");
  });
});
