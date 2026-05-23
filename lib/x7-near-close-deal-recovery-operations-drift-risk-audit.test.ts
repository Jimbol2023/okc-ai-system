import { classifyX7NearCloseDealRecoveryDangerousWording, createX7NearCloseDealRecoveryOperationsDriftRiskAudit } from "./x7-near-close-deal-recovery-operations-drift-risk-audit";

describe("X7C near-close deal recovery operations drift risk audit", () => {
  it("detects missing drift reviews", () => {
    const result = createX7NearCloseDealRecoveryOperationsDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("near-close-recovery-to-execution drift");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("blocks outreach, routing, provider activation, and dangerous wording", () => {
    const result = createX7NearCloseDealRecoveryOperationsDriftRiskAudit({ outreachRequested: true, routingRequested: true, providerRequested: true });
    expect(result.status).toBe("x7_drift_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/outreach/);
    expect(result.blockedReasons.join(" ")).toMatch(/route work/);
    expect(result.blockedReasons.join(" ")).toMatch(/activate providers/);
    expect(classifyX7NearCloseDealRecoveryDangerousWording("recover automatically")).toBe("dangerous_wording_detected");
    expect(classifyX7NearCloseDealRecoveryDangerousWording("Near-close recovery visibility only")).toBe("wording_clear");
  });
});
