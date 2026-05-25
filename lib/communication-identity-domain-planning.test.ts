import {
  assertCommunicationIdentityDomainPlanningSafe,
  communicationIdentityDomainPlanningFlags,
  getCommunicationIdentityDomainPlanning,
  summarizeCommunicationIdentityDomainPlanning,
} from "./communication-identity-domain-planning";

describe("communication identity and domain planning", () => {
  it("creates a planning-only C5 communication identity and domain contract", () => {
    const result = getCommunicationIdentityDomainPlanning();

    expect(result.phase).toBe("C5 Communication Identity And Domain Planning");
    expect(result.communicationIdentityDomainPlanningStatus).toBe("planning_only");
    expect(result.domainDecision).toBe("not_authorized_for_activation");
    expect(result.emailDecision).toBe("not_authorized_for_sending");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("C5.1 Business Number Text/Call Identity Planning");
    expect(result.nextStageRecommendation).toBe("C5.1 Business Number Text/Call Identity Planning");
  });

  it("keeps C5 read-only advisory-only and planning-only", () => {
    const result = getCommunicationIdentityDomainPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps domain email provider and communication decisions not authorized", () => {
    const result = getCommunicationIdentityDomainPlanning();

    expect(result.domainDecision).toBe("not_authorized_for_activation");
    expect(result.emailDecision).toBe("not_authorized_for_sending");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.flags.domainActivated).toBe(false);
    expect(result.flags.emailSendingEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.communicationExecutionAuthorized).toBe(false);
  });

  it("defines all C5 identity and domain planning lanes", () => {
    const result = getCommunicationIdentityDomainPlanning();

    expect(result.identityDomainPlanningLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "business_domain_identity",
        "sender_name_policy",
        "reply_inbox_planning",
        "spf_dkim_dmarc_evidence_planning",
        "can_spam_sender_opt_out_visibility",
        "human_approval_audit_boundary",
        "no_send_no_provider_boundary",
        "c5_1_phone_text_call_readiness",
      ]),
    );
  });

  it("covers domain identity sender policy reply inbox SPF DKIM DMARC CAN-SPAM audit no-send and C5.1 readiness", () => {
    const result = getCommunicationIdentityDomainPlanning();
    const laneText = result.identityDomainPlanningLanes
      .flatMap((lane) => [lane.lane, ...lane.planningFocus, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/future business domain name/i);
    expect(laneText).toMatch(/truthful sender name/i);
    expect(laneText).toMatch(/reply handling expectations/i);
    expect(laneText).toMatch(/SPF evidence/i);
    expect(laneText).toMatch(/DKIM evidence/i);
    expect(laneText).toMatch(/DMARC evidence/i);
    expect(laneText).toMatch(/opt-out procedure visibility/i);
    expect(laneText).toMatch(/human-supervised communication/i);
    expect(laneText).toMatch(/no provider activation/i);
    expect(laneText).toMatch(/business number planning next/i);
  });

  it("keeps DNS domain mailbox authentication and provider flags false", () => {
    const flags = getCommunicationIdentityDomainPlanning().flags;

    expect(flags.domainPurchaseAuthorized).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.dnsMutationAuthorized).toBe(false);
    expect(flags.dnsRecordPublished).toBe(false);
    expect(flags.spfPublished).toBe(false);
    expect(flags.dkimPublished).toBe(false);
    expect(flags.dmarcPublished).toBe(false);
    expect(flags.mailboxCreated).toBe(false);
    expect(flags.replyInboxCreated).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.emailProviderActivated).toBe(false);
    expect(flags.smsProviderActivated).toBe(false);
    expect(flags.phoneProviderActivated).toBe(false);
  });

  it("keeps email SMS calling campaigns queues reminders runtime CRM and automation flags false", () => {
    const flags = getCommunicationIdentityDomainPlanning().flags;

    expect(flags.sendPathCreated).toBe(false);
    expect(flags.emailSendingEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.campaignActivated).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.autonomousFollowUpEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.communicationQueueCreated).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.reminderCreated).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.runtimeJobCreated).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.communicationExecutionAuthorized).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
  });

  it("keeps doctrine focused on identity requirements and blocked activation", () => {
    const result = getCommunicationIdentityDomainPlanning();
    const doctrineText = result.identityDomainDoctrine.join(" ");

    expect(doctrineText).toMatch(/identity and domain requirements only/i);
    expect(doctrineText).toMatch(/No DNS mutation, domain purchase, mailbox creation/i);
    expect(doctrineText).toMatch(/truthful sender identity/i);
    expect(doctrineText).toMatch(/reply handling/i);
    expect(doctrineText).toMatch(/opt-out visibility/i);
    expect(doctrineText).toMatch(/provider-blocked/i);
    expect(doctrineText).toMatch(/before number, text, and call identity planning/i);
  });

  it("summarizes C5 planning and includes the C5.1 next stage", () => {
    const result = getCommunicationIdentityDomainPlanning();
    const summary = summarizeCommunicationIdentityDomainPlanning(result);

    expect(summary).toMatch(/Domain decision is not_authorized_for_activation/i);
    expect(summary).toMatch(/email decision is not_authorized_for_sending/i);
    expect(summary).toMatch(/provider decision is not_authorized/i);
    expect(summary).toMatch(/communication decision is not_authorized/i);
    expect(summary).toMatch(/business\/domain identity/i);
    expect(summary).toMatch(/SPF\/DKIM\/DMARC evidence/i);
    expect(summary).toMatch(/CAN-SPAM sender and opt-out visibility/i);
    expect(summary).toMatch(/No domain activation, DNS change/i);
    expect(summary).toMatch(/no email sending/i);
    expect(summary).toMatch(/Next stage: C5\.1 Business Number Text\/Call Identity Planning/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "domainPurchaseAuthorized",
      "domainActivated",
      "dnsMutationAuthorized",
      "dnsRecordPublished",
      "spfPublished",
      "dkimPublished",
      "dmarcPublished",
      "mailboxCreated",
      "providerActivated",
      "providerClientCreated",
      "providerEnvRead",
      "twilioActivated",
      "emailSendingEnabled",
      "outboundSmsEnabled",
      "callingEnabled",
      "campaignActivated",
      "queueSystemEnabled",
      "reminderSystemEnabled",
      "runtimeJobsEnabled",
      "crmMutationEnabled",
      "approvalGrantsExecution",
      "goLiveAuthorized",
      "spendIncreaseAuthorized",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getCommunicationIdentityDomainPlanning(),
        flags: {
          ...communicationIdentityDomainPlanningFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertCommunicationIdentityDomainPlanningSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions or status drift", () => {
    const statusUnsafe = {
      ...getCommunicationIdentityDomainPlanning(),
      communicationIdentityDomainPlanningStatus: "identity_shape_defined" as "planning_only",
    };
    const domainUnsafe = {
      ...getCommunicationIdentityDomainPlanning(),
      domainDecision: "authorized" as "not_authorized_for_activation",
    };
    const emailUnsafe = {
      ...getCommunicationIdentityDomainPlanning(),
      emailDecision: "authorized" as "not_authorized_for_sending",
    };
    const providerUnsafe = {
      ...getCommunicationIdentityDomainPlanning(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getCommunicationIdentityDomainPlanning(),
      communicationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertCommunicationIdentityDomainPlanningSafe(statusUnsafe)).toThrow(/cannot become domain-ready/i);
    expect(() => assertCommunicationIdentityDomainPlanningSafe(domainUnsafe)).toThrow(/domain decision/i);
    expect(() => assertCommunicationIdentityDomainPlanningSafe(emailUnsafe)).toThrow(/email decision/i);
    expect(() => assertCommunicationIdentityDomainPlanningSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertCommunicationIdentityDomainPlanningSafe(communicationUnsafe)).toThrow(/communication decision/i);
  });

  it("fails invariant checks if the roadmap skips C5.1", () => {
    const unsafeResult = {
      ...getCommunicationIdentityDomainPlanning(),
      recommendedNextExactStep: "C6 Controlled Communication Infrastructure Gate" as "C5.1 Business Number Text/Call Identity Planning",
    };

    expect(() => assertCommunicationIdentityDomainPlanningSafe(unsafeResult)).toThrow(/C5\.1 Business Number Text\/Call Identity Planning/i);
  });
});
