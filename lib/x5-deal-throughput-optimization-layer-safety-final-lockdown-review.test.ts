import { createX5DealThroughputOptimizationLayerSafetyFinalLockdownReview } from "./x5-deal-throughput-optimization-layer-safety-final-lockdown-review";

describe("X5F deal throughput optimization layer safety final lockdown review", () => {
  it("requires final throughput safety review areas", () => {
    const result = createX5DealThroughputOptimizationLayerSafetyFinalLockdownReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("deal throughput optimization does not execute");
    expect(result.missingReviewAreas).toContain("no fetch/network");
    expect(result.flags.pollingAllowed).toBe(false);
  });

  it("fails closed for runtime, workflow execution, persistence, and outreach requests", () => {
    const result = createX5DealThroughputOptimizationLayerSafetyFinalLockdownReview({ runtimeRequested: true, workflowExecutionRequested: true, persistenceRequested: true, outreachRequested: true });
    expect(result.status).toBe("x5_final_lockdown_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/runtime jobs/);
    expect(result.blockedReasons.join(" ")).toMatch(/workflow actions/);
    expect(result.blockedReasons.join(" ")).toMatch(/persistence remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/outreach/);
  });
});
