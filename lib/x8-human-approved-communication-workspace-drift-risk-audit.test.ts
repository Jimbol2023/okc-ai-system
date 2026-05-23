import { classifyX8CommunicationWorkspaceDangerousWording, createX8HumanApprovedCommunicationWorkspaceDriftRiskAudit } from "./x8-human-approved-communication-workspace-drift-risk-audit";

describe("X8C human-approved communication workspace drift risk audit", () => {
  it("detects missing drift reviews", () => {
    const result = createX8HumanApprovedCommunicationWorkspaceDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("communication-review-to-execution drift");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("blocks sending, provider activation, contact, and dangerous wording", () => {
    const result = createX8HumanApprovedCommunicationWorkspaceDriftRiskAudit({ sendRequested: true, providerRequested: true, dncContactRequested: true });
    expect(result.status).toBe("x8_drift_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/cannot send/);
    expect(result.blockedReasons.join(" ")).toMatch(/activate providers/);
    expect(result.blockedReasons.join(" ")).toMatch(/cannot permit contact/);
    expect(classifyX8CommunicationWorkspaceDangerousWording("send now")).toBe("dangerous_wording_detected");
    expect(classifyX8CommunicationWorkspaceDangerousWording("Human-approved communication visibility only")).toBe("wording_clear");
  });
});
