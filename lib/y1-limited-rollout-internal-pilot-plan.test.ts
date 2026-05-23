import { createY1LimitedRolloutInternalPilotPlan, y1LimitedRolloutStages } from "./y1-limited-rollout-internal-pilot-plan";

describe("Y1E limited rollout internal pilot plan", () => {
  it("creates staged future-only rollout visibility", () => {
    const result = createY1LimitedRolloutInternalPilotPlan();
    expect(y1LimitedRolloutStages).toContain("Stage 0: Manual-only operations continue");
    expect(result.activationNowAllowed).toBe(false);
    expect(result.providerUsageNowAllowed).toBe(false);
    expect(result.sendingNowAllowed).toBe(false);
  });

  it("blocks activation, providers, sending, runtime, and persistence now", () => {
    const result = createY1LimitedRolloutInternalPilotPlan({ activationNowRequested: true, providerUsageRequested: true, sendRequested: true, runtimeRequested: true, persistenceRequested: true });
    expect(result.status).toBe("rollout_plan_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/activation now remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime now remains blocked/);
  });
});
