import { createY2RevenueOperationsBottleneckReview } from "./y2-revenue-operations-bottleneck-review";

describe("Y2B revenue operations bottleneck review", () => {
  it("remains advisory, non-executing, and planning-only", () => {
    const result = createY2RevenueOperationsBottleneckReview();
    expect(result.advisoryOnly).toBe(true);
    expect(result.nonExecuting).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.sent).toBe(false);
  });

  it("blocks outreach and automation drift", () => {
    const result = createY2RevenueOperationsBottleneckReview({ outreachRequested: true, automationRequested: true });
    expect(result.status).toBe("bottleneck_review_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/outreach remains blocked/);
  });
});
