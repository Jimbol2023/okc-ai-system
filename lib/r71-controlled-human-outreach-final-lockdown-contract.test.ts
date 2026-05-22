import {
  createR71ControlledHumanOutreachFinalLockdownContract,
  summarizeR71ControlledHumanOutreachFinalLockdown,
} from "./r71-controlled-human-outreach-final-lockdown-contract";

const lockedInput = {
  r71aReviewed: true,
  r71bReviewed: true,
  r71cReviewed: true,
  r71dReviewed: true,
  r71eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R71F controlled human outreach final lockdown", () => {
  it("defaults to operator review required", () => {
    const result = createR71ControlledHumanOutreachFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.controlledOutreachLocked).toBe(true);
  });

  it("smoke-tests final outreach lockdown enforcement", () => {
    const result = createR71ControlledHumanOutreachFinalLockdownContract(lockedInput);
    expect(result.status).toBe("controlled_outreach_lockdown_enforced");
    expect(result.lockdownRules).toEqual(
      expect.arrayContaining([
        "Outreach preparation never sends.",
        "Message preview never sends.",
        "Call preparation never calls.",
        "Approval never grants sending.",
        "Recommendation never grants outreach.",
        "Revenue priority never grants outreach.",
        "Provider activation remains blocked.",
        "Credential and env reads remain blocked.",
        "Provider clients remain blocked.",
        "Execution remains blocked.",
      ]),
    );
    expect(result.nextPhase).toBe("R72A - Revenue Command Center Scope Contract");
  });

  it("pressure-tests all outreach activation pathways as blocked", () => {
    const result = createR71ControlledHumanOutreachFinalLockdownContract({
      ...lockedInput,
      outreachPreparationSendRequested: true,
      messagePreviewSendRequested: true,
      callPreparationCallRequested: true,
      approvalSendRequested: true,
      recommendationOutreachRequested: true,
      urgencyOutreachRequested: true,
      revenueOutreachRequested: true,
      queueOutreachRequested: true,
      readinessOutreachRequested: true,
      providerReadinessOutreachRequested: true,
      simulationOutreachRequested: true,
      providerActivationRequested: true,
      credentialEnvReadRequested: true,
      fetchNetworkRequested: true,
      providerClientRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      campaignRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("controlled_outreach_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "outreach preparation never sends",
        "call preparation never calls",
        "provider activation remains blocked",
        "credential and env reads remain blocked",
        "provider clients remain blocked",
        "campaigns remain blocked",
        "audit logging remains inactive",
      ]),
    );
  });

  it("summarizes final lockdown", () => {
    const result = createR71ControlledHumanOutreachFinalLockdownContract(lockedInput);
    expect(summarizeR71ControlledHumanOutreachFinalLockdown(result)).toMatch(/preparation-only/i);
  });
});
