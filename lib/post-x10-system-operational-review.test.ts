import { createPostX10SystemOperationalReview, postX10OperationalReviewAreas } from "./post-x10-system-operational-review";

describe("POST-X10A system operational review", () => {
  it("requires operational review areas and preserves review-only flags", () => {
    const result = createPostX10SystemOperationalReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("X1-X10 operational cohesion");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.providerCalled).toBe(false);
    expect(postX10OperationalReviewAreas).toContain("operator cognitive load");
  });

  it("blocks operational activation requests", () => {
    const result = createPostX10SystemOperationalReview({ executionRequested: true, providerRequested: true, runtimeRequested: true });
    expect(result.status).toBe("post_x10_operational_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime jobs remain blocked/);
  });
});
