import {
  createR71ControlledHumanOutreachDriftSendRiskAudit,
  summarizeR71ControlledHumanOutreachDriftSendRiskAudit,
} from "./r71-controlled-human-outreach-drift-send-risk-audit";

const passedInput = {
  r71aReviewed: true,
  preparationSendReviewed: true,
  approvalPreviewCallReviewed: true,
  queueUrgencyRevenueReviewed: true,
  providerAiActionCenterReviewed: true,
  credentialEnvFetchReviewed: true,
  runtimeCampaignPersistenceAuditReviewed: true,
  dangerousWordingReviewed: true,
} as const;

describe("R71B controlled human outreach drift send risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR71ControlledHumanOutreachDriftSendRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("message-preview-to-send drift");
  });

  it("smoke-tests drift audit coverage", () => {
    const result = createR71ControlledHumanOutreachDriftSendRiskAudit(passedInput);
    expect(result.status).toBe("controlled_outreach_drift_audit_passed");
    expect(result.flags.sent).toBe(false);
  });

  it("pressure-tests send outreach and provider drift blockers", () => {
    const result = createR71ControlledHumanOutreachDriftSendRiskAudit({
      ...passedInput,
      preparationSendDriftFound: true,
      approvalSendDriftFound: true,
      messagePreviewSendDriftFound: true,
      callPrepCallDriftFound: true,
      queueOutreachDriftFound: true,
      urgencyOutreachDriftFound: true,
      revenueOutreachDriftFound: true,
      providerReadinessSendDriftFound: true,
      aiSuggestionSendDriftFound: true,
      actionCenterSendDriftFound: true,
    });
    expect(result.status).toBe("controlled_outreach_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["preparation-to-send drift found", "message-preview-to-send drift found", "call-prep-to-call drift found", "AI suggestion-to-send drift found"]));
  });

  it("pressure-tests credential fetch runtime campaign persistence and audit blockers", () => {
    const result = createR71ControlledHumanOutreachDriftSendRiskAudit({
      ...passedInput,
      credentialEnvDriftFound: true,
      fetchNetworkDriftFound: true,
      providerClientDriftFound: true,
      runtimeDriftFound: true,
      campaignDriftFound: true,
      persistenceDriftFound: true,
      auditWritingDriftFound: true,
      dangerousWordingFound: true,
    });
    expect(result.status).toBe("controlled_outreach_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["credential/env-read drift found", "fetch/network drift found", "campaign drift found", "audit-writing drift found"]));
  });

  it("summarizes audit coverage", () => {
    const result = createR71ControlledHumanOutreachDriftSendRiskAudit(passedInput);
    expect(summarizeR71ControlledHumanOutreachDriftSendRiskAudit(result)).toMatch(/call prep/i);
  });
});
