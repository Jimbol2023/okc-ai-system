import { createX10InternalOperationalPilotSafetyFinalLockdownReview } from "./x10-internal-operational-pilot-safety-final-lockdown-review";

describe("X10F internal operational pilot safety final lockdown review", () => {
  it("requires final pilot safety review areas", () => {
    const result = createX10InternalOperationalPilotSafetyFinalLockdownReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("pilot workspace does not execute");
    expect(result.missingReviewAreas).toContain("no fetch/network");
    expect(result.flags.pollingAllowed).toBe(false);
  });

  it("fails closed for sending, provider, runtime, and outreach requests", () => {
    const result = createX10InternalOperationalPilotSafetyFinalLockdownReview({ sendRequested: true, providerRequested: true, runtimeRequested: true, outreachRequested: true });
    expect(result.status).toBe("x10_final_lockdown_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot send/);
    expect(result.blockedReasons.join(" ")).toMatch(/activate providers/);
    expect(result.blockedReasons.join(" ")).toMatch(/activate runtime/);
    expect(result.blockedReasons.join(" ")).toMatch(/outreach/);
  });
});
