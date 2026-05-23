import { createPostX10FinalInstitutionalReviewSummary } from "./post-x10-final-institutional-review-summary";

describe("POST-X10F final institutional review summary", () => {
  it("generates deterministic institutional maturity summary", () => {
    const result = createPostX10FinalInstitutionalReviewSummary();
    expect(result.status).toBe("operator_review_required");
    expect(result.maturity.governance).toMatch(/fail-closed/);
    expect(result.readinessGaps).toContain("provider activation strategy remains unscoped");
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("blocks execution, provider, and persistence authorization", () => {
    const result = createPostX10FinalInstitutionalReviewSummary({ executionRequested: true, providerRequested: true, persistenceRequested: true });
    expect(result.status).toBe("post_x10_summary_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot authorize execution/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot activate providers/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot enable persistence/);
  });
});
