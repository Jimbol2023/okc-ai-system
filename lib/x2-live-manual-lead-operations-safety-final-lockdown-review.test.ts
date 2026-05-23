import { createX2LiveManualLeadOperationsSafetyFinalLockdownReview } from "./x2-live-manual-lead-operations-safety-final-lockdown-review";

describe("X2F live manual lead operations safety final lockdown review", () => {
  it("requires final safety review areas", () => {
    const result = createX2LiveManualLeadOperationsSafetyFinalLockdownReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("lead operations do not execute");
    expect(result.missingReviewAreas).toContain("no fetch/network");
    expect(result.flags.pollingAllowed).toBe(false);
  });

  it("fails closed for runtime, outreach, persistence, and provider requests", () => {
    const result = createX2LiveManualLeadOperationsSafetyFinalLockdownReview({ runtimeRequested: true, outreachRequested: true, persistenceRequested: true, providerRequested: true });
    expect(result.status).toBe("x2_final_lockdown_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/runtime jobs/);
    expect(result.blockedReasons.join(" ")).toMatch(/outreach/);
    expect(result.blockedReasons.join(" ")).toMatch(/persistence remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/providers/);
  });
});
