import { createY2ManualWorkflowEfficiencyReview } from "./y2-manual-workflow-efficiency-review";

describe("Y2A manual workflow efficiency review", () => {
  it("defaults to review-only optimization output", () => {
    const result = createY2ManualWorkflowEfficiencyReview();
    expect(result.reviewOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.optimizationOnly).toBe(true);
    expect(result.executionAllowed).toBe(false);
  });

  it("blocks execution, provider, runtime, and persistence drift", () => {
    const result = createY2ManualWorkflowEfficiencyReview({ executionRequested: true, providerRequested: true, runtimeRequested: true, persistenceRequested: true });
    expect(result.status).toBe("workflow_efficiency_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/execution remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
  });
});
