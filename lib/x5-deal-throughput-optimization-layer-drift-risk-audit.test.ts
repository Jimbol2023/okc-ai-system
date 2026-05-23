import { classifyX5DealThroughputDangerousWording, createX5DealThroughputOptimizationLayerDriftRiskAudit } from "./x5-deal-throughput-optimization-layer-drift-risk-audit";

describe("X5C deal throughput optimization layer drift risk audit", () => {
  it("detects missing drift reviews", () => {
    const result = createX5DealThroughputOptimizationLayerDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("throughput-review-to-execution drift");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("blocks execution, automation, routing, and dangerous wording", () => {
    const result = createX5DealThroughputOptimizationLayerDriftRiskAudit({ executionRequested: true, automationRequested: true, routingRequested: true });
    expect(result.status).toBe("x5_drift_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot automate/);
    expect(result.blockedReasons.join(" ")).toMatch(/route work/);
    expect(classifyX5DealThroughputDangerousWording("optimize automatically")).toBe("dangerous_wording_detected");
    expect(classifyX5DealThroughputDangerousWording("Manual throughput review only")).toBe("wording_clear");
  });
});
