import {
  assertCommunicationReadinessReviewInvariants,
  communicationReadinessReviewFlags,
  reviewCommunicationReadiness,
  summarizeCommunicationReadinessReview,
} from "./communication-readiness-review";

describe("communication readiness review", () => {
  it("surfaces property-first and missing-contact records as not ready for outreach", () => {
    const result = reviewCommunicationReadiness({
      propertyAddress: "123 Main St",
      source: "tax_delinquent",
      importReadiness: "property_first_review",
      approvalStatus: "needs_human_review",
      doNotContact: true,
      automationStatus: "idle",
    });

    expect(result.communicationReadinessStatus).toBe("not_ready");
    expect(result.blockers).toEqual(expect.arrayContaining(["missing phone/email", "doNotContact true", "property-first cleanup required"]));
    expect(result.readinessLanes.find((lane) => lane.lane === "property_first_blocks")?.ready).toBe(false);
  });

  it("treats DNC and opt-out states as hard blockers", () => {
    const result = reviewCommunicationReadiness({
      phone: "4055551212",
      doNotContact: true,
      optOutReason: "Seller requested stop.",
      approvalStatus: "approved_for_outreach",
      humanApprovalWorkflowPlanned: true,
    });

    expect(result.communicationReadinessStatus).toBe("not_ready");
    expect(result.blockers).toEqual(expect.arrayContaining(["doNotContact true", "opt-out present"]));
    expect(result.readinessLanes.find((lane) => lane.lane === "dnc_opt_out")?.ready).toBe(false);
  });

  it("surfaces planning blockers even when basic contact data exists", () => {
    const result = reviewCommunicationReadiness({
      phone: "4055551212",
      approvalStatus: "pending_review",
      automationStatus: "scheduled",
    });

    expect(result.communicationReadinessStatus).toBe("needs_operator_review");
    expect(result.blockers).toEqual(
      expect.arrayContaining([
        "approval missing",
        "provider identity not planned",
        "no approved send path",
        "no human approval workflow",
        "no conversation memory plan",
        "no communication audit plan",
      ]),
    );
  });

  it("keeps AI VA readiness operator-support only and recommends conversation memory when reply context is missing", () => {
    const result = reviewCommunicationReadiness({
      phone: "4055551212",
      approvalStatus: "approved_for_outreach",
      humanApprovalWorkflowPlanned: true,
      providerIdentityPlanned: true,
      approvedSendPathPlanned: true,
      communicationAuditPlanned: true,
      aiVaOperatorSupportPlanned: false,
      automationStatus: "idle",
    });

    expect(result.recommendedNextExactStep).toBe("C3 Seller Conversation Memory Planning");
    expect(result.blockers).toEqual(expect.arrayContaining(["AI VA operator-support workflow not planned", "no conversation memory plan"]));
    expect(result.flags.aiOnlySellerHandlingAllowed).toBe(false);
  });

  it("recommends AI VA operator workflow review after conversation memory is planned", () => {
    const result = reviewCommunicationReadiness({
      phone: "4055551212",
      lastSellerReply: "Call me next week.",
      conversationMemoryPlanned: true,
      approvalStatus: "approved_for_outreach",
      humanApprovalWorkflowPlanned: true,
      providerIdentityPlanned: true,
      approvedSendPathPlanned: true,
      communicationAuditPlanned: true,
      aiVaOperatorSupportPlanned: false,
      automationStatus: "idle",
    });

    expect(result.recommendedNextExactStep).toBe("C2 AI VA Operator Workflow Review");
    expect(result.blockers).toContain("AI VA operator-support workflow not planned");
  });

  it("keeps all provider outbound queue reminder runtime automation and negotiation flags false", () => {
    const flags = reviewCommunicationReadiness().flags;

    expect(flags.readOnly).toBe(true);
    expect(flags.advisoryOnly).toBe(true);
    expect(flags.planningOnly).toBe(true);
    expect(flags.providerCalled).toBe(false);
    expect(flags.providerActivationAllowed).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.emailActivated).toBe(false);
    expect(flags.smsActivated).toBe(false);
    expect(flags.callingActivated).toBe(false);
    expect(flags.aiVoiceActivated).toBe(false);
    expect(flags.campaignActivated).toBe(false);
    expect(flags.communicationQueueCreated).toBe(false);
    expect(flags.reminderCreated).toBe(false);
    expect(flags.runtimeJobCreated).toBe(false);
    expect(flags.pollingAllowed).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.outboundSendPathCreated).toBe(false);
    expect(flags.crmAutomationAllowed).toBe(false);
    expect(flags.autonomousNegotiationAllowed).toBe(false);
    expect(flags.autonomousSellerHandlingAllowed).toBe(false);
    expect(flags.autonomousFollowUpAllowed).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
  });

  it("keeps approval from granting execution", () => {
    const result = reviewCommunicationReadiness({
      phone: "4055551212",
      approvalStatus: "approved_for_outreach",
      humanApprovalWorkflowPlanned: true,
    });

    expect(result.flags.approvalGrantsExecution).toBe(false);
    expect(result.readinessLanes.find((lane) => lane.lane === "human_approval")?.guidance).toMatch(/never grant execution/i);
  });

  it("summarizes and enforces the planning-only boundary", () => {
    const result = reviewCommunicationReadiness();

    expect(() => assertCommunicationReadinessReviewInvariants(result)).not.toThrow();
    expect(summarizeCommunicationReadinessReview(result)).toMatch(/No provider activation/i);
    expect(summarizeCommunicationReadinessReview(result)).toMatch(/C3 Seller Conversation Memory Planning|C2 AI VA Operator Workflow Review/i);
  });

  it("fails invariant checks if provider activation drifts true", () => {
    const unsafeResult = {
      ...reviewCommunicationReadiness(),
      flags: {
        ...communicationReadinessReviewFlags,
        providerActivationAllowed: true,
      },
    };

    expect(() => assertCommunicationReadinessReviewInvariants(unsafeResult)).toThrow(/cannot authorize providers/i);
  });
});
