import { classifyPostX10DangerousWording, createPostX10GovernanceSafetyAudit } from "./post-x10-governance-safety-audit";

describe("POST-X10B governance safety audit", () => {
  it("requires governance drift review and preserves provider blocking", () => {
    const result = createPostX10GovernanceSafetyAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("execution drift");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("blocks activation drift and detects dangerous wording", () => {
    const result = createPostX10GovernanceSafetyAudit({ executionRequested: true, providerRequested: true, approvalExecutionRequested: true });
    expect(result.status).toBe("post_x10_governance_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/execution remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/approval does not grant execution/);
    expect(classifyPostX10DangerousWording("approval grants execution")).toBe("dangerous_wording_detected");
  });
});
