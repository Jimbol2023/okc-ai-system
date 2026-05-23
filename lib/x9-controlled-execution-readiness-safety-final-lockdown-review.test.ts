import { createX9ControlledExecutionReadinessSafetyFinalLockdownReview } from "./x9-controlled-execution-readiness-safety-final-lockdown-review";

describe("X9F controlled execution readiness safety final lockdown review", () => {
  it("requires final execution readiness safety review areas", () => {
    const result = createX9ControlledExecutionReadinessSafetyFinalLockdownReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("controlled execution readiness does not execute");
    expect(result.missingReviewAreas).toContain("no fetch/network");
    expect(result.flags.pollingAllowed).toBe(false);
  });

  it("fails closed for activation, provider, approval execution, and outreach requests", () => {
    const result = createX9ControlledExecutionReadinessSafetyFinalLockdownReview({ activationRequested: true, providerRequested: true, approvalExecutionRequested: true, outreachRequested: true });
    expect(result.status).toBe("x9_final_lockdown_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot authorize activation/);
    expect(result.blockedReasons.join(" ")).toMatch(/activate providers/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot grant approval execution/);
    expect(result.blockedReasons.join(" ")).toMatch(/outreach/);
  });
});
