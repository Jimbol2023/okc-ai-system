import { classifyX2LeadOperationsDangerousWording, createX2LiveManualLeadOperationsDriftRiskAudit } from "./x2-live-manual-lead-operations-drift-risk-audit";

describe("X2C live manual lead operations drift risk audit", () => {
  it("detects required drift review gaps", () => {
    const result = createX2LiveManualLeadOperationsDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("lead-review-to-execution drift");
    expect(result.flags.runtimeActivationAllowed).toBe(false);
  });

  it("blocks forbidden drift requests and dangerous wording", () => {
    const result = createX2LiveManualLeadOperationsDriftRiskAudit({ outreachRequested: true, routingRequested: true, providerRequested: true });
    expect(result.status).toBe("x2_drift_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/outreach/);
    expect(result.blockedReasons.join(" ")).toMatch(/route work/);
    expect(classifyX2LeadOperationsDangerousWording("trigger outreach")).toBe("dangerous_wording_detected");
    expect(classifyX2LeadOperationsDangerousWording("Manual workflow visibility only")).toBe("wording_clear");
  });
});
