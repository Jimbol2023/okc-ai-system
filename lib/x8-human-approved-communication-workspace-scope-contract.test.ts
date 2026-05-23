import { createX8HumanApprovedCommunicationWorkspaceScopeContract, x8AdvisoryCategories } from "./x8-human-approved-communication-workspace-scope-contract";

describe("X8A human-approved communication workspace scope contract", () => {
  it("requires review and preserves communication workspace boundaries", () => {
    const result = createX8HumanApprovedCommunicationWorkspaceScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("human-approved communication doctrine");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.sent).toBe(false);
    expect(x8AdvisoryCategories).toContain("communication-review-needed");
  });

  it("blocks execution, sending, provider, contact, and autonomous approval requests", () => {
    const result = createX8HumanApprovedCommunicationWorkspaceScopeContract({ executionRequested: true, sendRequested: true, providerRequested: true, contactRequested: true, autonomousCommunicationApprovalRequested: true });
    expect(result.status).toBe("x8_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot execute/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot send messages/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot contact/);
    expect(result.blockedReasons.join(" ")).toMatch(/autonomous communication approval remains blocked/);
  });
});
