import { classifyX10InternalOperationalPilotDangerousWording, createX10InternalOperationalPilotDriftRiskAudit } from "./x10-internal-operational-pilot-drift-risk-audit";

describe("X10C internal operational pilot drift risk audit", () => {
  it("detects missing drift reviews", () => {
    const result = createX10InternalOperationalPilotDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("pilot-review-to-execution drift");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("blocks execution, sending, provider activation, and production activation", () => {
    const result = createX10InternalOperationalPilotDriftRiskAudit({ executionRequested: true, sendRequested: true, providerRequested: true, productionActivationRequested: true });
    expect(result.status).toBe("x10_drift_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot send/);
    expect(result.blockedReasons.join(" ")).toMatch(/activate providers/);
    expect(result.blockedReasons.join(" ")).toMatch(/production activation remains blocked/);
    expect(classifyX10InternalOperationalPilotDangerousWording("activate live")).toBe("dangerous_wording_detected");
  });
});
