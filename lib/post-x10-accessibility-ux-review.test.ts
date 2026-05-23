import { createPostX10AccessibilityUxReview, postX10AccessibilityReviewAreas } from "./post-x10-accessibility-ux-review";

describe("POST-X10C accessibility UX review", () => {
  it("requires accessibility review areas", () => {
    const result = createPostX10AccessibilityUxReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("semantic headings");
    expect(postX10AccessibilityReviewAreas).toContain("mobile responsiveness review");
    expect(result.flags.readOnly).toBe(true);
  });

  it("blocks redesign scope creep", () => {
    const result = createPostX10AccessibilityUxReview({ redesignRequested: true, animationSystemRequested: true });
    expect(result.status).toBe("post_x10_accessibility_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/redesign remains outside/);
    expect(result.blockedReasons.join(" ")).toMatch(/animation systems remain outside/);
  });
});
