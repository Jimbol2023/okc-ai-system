import { createX4HumanGuidedBuyerMatchingOperationsSafetyFinalLockdownReview } from "./x4-human-guided-buyer-matching-operations-safety-final-lockdown-review";

describe("X4F human-guided buyer matching operations safety final lockdown review", () => {
  it("requires final buyer operations safety review areas", () => {
    const result = createX4HumanGuidedBuyerMatchingOperationsSafetyFinalLockdownReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("buyer operations do not execute");
    expect(result.missingReviewAreas).toContain("no fetch/network");
    expect(result.flags.pollingAllowed).toBe(false);
  });

  it("fails closed for outreach, provider, runtime, and persistence requests", () => {
    const result = createX4HumanGuidedBuyerMatchingOperationsSafetyFinalLockdownReview({ outreachRequested: true, providerRequested: true, runtimeRequested: true, persistenceRequested: true });
    expect(result.status).toBe("x4_final_lockdown_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/outreach/);
    expect(result.blockedReasons.join(" ")).toMatch(/activate providers/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime jobs/);
    expect(result.blockedReasons.join(" ")).toMatch(/persistence remains blocked/);
  });
});
