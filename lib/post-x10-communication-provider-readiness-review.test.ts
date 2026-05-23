import { createPostX10CommunicationProviderReadinessReview } from "./post-x10-communication-provider-readiness-review";

describe("POST-X10D communication provider readiness review", () => {
  it("requires communication provider readiness review", () => {
    const result = createPostX10CommunicationProviderReadinessReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("communication workspace readiness");
    expect(result.flags.sent).toBe(false);
  });

  it("blocks provider and sending activation", () => {
    const result = createPostX10CommunicationProviderReadinessReview({ smsSendingRequested: true, twilioActivationRequested: true, providerRuntimeRequested: true });
    expect(result.status).toBe("post_x10_communication_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/SMS sending remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/Twilio activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider runtime remains blocked/);
  });
});
