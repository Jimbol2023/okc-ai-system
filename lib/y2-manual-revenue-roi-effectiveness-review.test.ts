import { createY2ManualRevenueRoiEffectivenessReview } from "./y2-manual-revenue-roi-effectiveness-review";

describe("Y2D manual revenue ROI effectiveness review", () => {
  it("defaults to ROI review only with manual operations primary", () => {
    const result = createY2ManualRevenueRoiEffectivenessReview();
    expect(result.roiReviewOnly).toBe(true);
    expect(result.activationNotAuthorized).toBe(true);
    expect(result.manualOperationsRemainPrimary).toBe(true);
  });

  it("blocks activation and execution requests", () => {
    const result = createY2ManualRevenueRoiEffectivenessReview({ activationRequested: true, executionRequested: true });
    expect(result.status).toBe("roi_review_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/activation remains unauthorized/);
  });
});
