import { createPostX10FutureActivationStrategyReview } from "./post-x10-future-activation-strategy-review";

describe("POST-X10E future activation strategy review", () => {
  it("requires future planning areas while preserving advisory mode", () => {
    const result = createPostX10FutureActivationStrategyReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingPlanningAreas).toContain("controlled provider activation");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("blocks activation, provider builds, sending builds, and deployment", () => {
    const result = createPostX10FutureActivationStrategyReview({ activateNowRequested: true, providerBuildRequested: true, sendingBuildRequested: true, deploymentRequested: true });
    expect(result.status).toBe("post_x10_strategy_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider builds remain blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/deployment remains blocked/);
  });
});
