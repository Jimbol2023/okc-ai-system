import { classifyX6RevenueLeakageDangerousWording, createX6RevenueLeakageDetectionDriftRiskAudit } from "./x6-revenue-leakage-detection-drift-risk-audit";

describe("X6C revenue leakage detection drift risk audit", () => {
  it("detects missing drift reviews", () => {
    const result = createX6RevenueLeakageDetectionDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("revenue-review-to-execution drift");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("blocks outreach, routing, escalation, and dangerous wording", () => {
    const result = createX6RevenueLeakageDetectionDriftRiskAudit({ outreachRequested: true, routingRequested: true, escalationRequested: true });
    expect(result.status).toBe("x6_drift_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/outreach/);
    expect(result.blockedReasons.join(" ")).toMatch(/route work/);
    expect(result.blockedReasons.join(" ")).toMatch(/escalate automatically/);
    expect(classifyX6RevenueLeakageDangerousWording("recover automatically")).toBe("dangerous_wording_detected");
    expect(classifyX6RevenueLeakageDangerousWording("Revenue review visibility only")).toBe("wording_clear");
  });
});
