import { createX6RevenueLeakageDetectionSafetyFinalLockdownReview } from "./x6-revenue-leakage-detection-safety-final-lockdown-review";

describe("X6F revenue leakage detection safety final lockdown review", () => {
  it("requires final leakage safety review areas", () => {
    const result = createX6RevenueLeakageDetectionSafetyFinalLockdownReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("revenue leakage detection does not execute");
    expect(result.missingReviewAreas).toContain("no fetch/network");
    expect(result.flags.pollingAllowed).toBe(false);
  });

  it("fails closed for runtime, escalation, persistence, and outreach requests", () => {
    const result = createX6RevenueLeakageDetectionSafetyFinalLockdownReview({ runtimeRequested: true, escalationRequested: true, persistenceRequested: true, outreachRequested: true });
    expect(result.status).toBe("x6_final_lockdown_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/runtime jobs/);
    expect(result.blockedReasons.join(" ")).toMatch(/escalate automatically/);
    expect(result.blockedReasons.join(" ")).toMatch(/persistence remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/outreach/);
  });
});
