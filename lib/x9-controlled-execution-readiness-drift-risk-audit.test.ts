import { classifyX9ControlledExecutionReadinessDangerousWording, createX9ControlledExecutionReadinessDriftRiskAudit } from "./x9-controlled-execution-readiness-drift-risk-audit";

describe("X9C controlled execution readiness drift risk audit", () => {
  it("detects missing drift reviews", () => {
    const result = createX9ControlledExecutionReadinessDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("readiness-to-execution drift");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("blocks execution, activation, approval execution, and dangerous wording", () => {
    const result = createX9ControlledExecutionReadinessDriftRiskAudit({ executionRequested: true, activationRequested: true, approvalExecutionRequested: true });
    expect(result.status).toBe("x9_drift_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot activate/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot grant approval execution/);
    expect(classifyX9ControlledExecutionReadinessDangerousWording("ready to execute")).toBe("dangerous_wording_detected");
    expect(classifyX9ControlledExecutionReadinessDangerousWording("Controlled readiness visibility only")).toBe("wording_clear");
  });
});
