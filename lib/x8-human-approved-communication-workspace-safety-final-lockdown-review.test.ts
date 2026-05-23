import { createX8HumanApprovedCommunicationWorkspaceSafetyFinalLockdownReview } from "./x8-human-approved-communication-workspace-safety-final-lockdown-review";

describe("X8F human-approved communication workspace safety final lockdown review", () => {
  it("requires final communication workspace safety review areas", () => {
    const result = createX8HumanApprovedCommunicationWorkspaceSafetyFinalLockdownReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("communication workspace does not execute");
    expect(result.missingReviewAreas).toContain("no fetch/network");
    expect(result.flags.pollingAllowed).toBe(false);
  });

  it("fails closed for sending, provider, persistence, and outreach requests", () => {
    const result = createX8HumanApprovedCommunicationWorkspaceSafetyFinalLockdownReview({ sendRequested: true, providerRequested: true, persistenceRequested: true, outreachRequested: true });
    expect(result.status).toBe("x8_final_lockdown_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot send/);
    expect(result.blockedReasons.join(" ")).toMatch(/activate providers/);
    expect(result.blockedReasons.join(" ")).toMatch(/persistence remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/outreach/);
  });
});
