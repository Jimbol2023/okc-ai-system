import { createX7NearCloseDealRecoveryOperationsSafetyFinalLockdownReview } from "./x7-near-close-deal-recovery-operations-safety-final-lockdown-review";

describe("X7F near-close deal recovery operations safety final lockdown review", () => {
  it("requires final near-close recovery safety review areas", () => {
    const result = createX7NearCloseDealRecoveryOperationsSafetyFinalLockdownReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("near-close deal recovery does not execute");
    expect(result.missingReviewAreas).toContain("no fetch/network");
    expect(result.flags.pollingAllowed).toBe(false);
  });

  it("fails closed for runtime, provider, persistence, and outreach requests", () => {
    const result = createX7NearCloseDealRecoveryOperationsSafetyFinalLockdownReview({ runtimeRequested: true, providerRequested: true, persistenceRequested: true, outreachRequested: true });
    expect(result.status).toBe("x7_final_lockdown_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/runtime jobs/);
    expect(result.blockedReasons.join(" ")).toMatch(/activate providers/);
    expect(result.blockedReasons.join(" ")).toMatch(/persistence remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/outreach/);
  });
});
