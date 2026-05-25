import {
  assertBusinessNumberTextCallIdentityPlanningSafe,
  businessNumberTextCallIdentityPlanningFlags,
  getBusinessNumberTextCallIdentityPlanning,
  summarizeBusinessNumberTextCallIdentityPlanning,
} from "./business-number-text-call-identity-planning";

describe("business number text call identity planning", () => {
  it("creates a planning-only C5.1 business number text/call identity contract", () => {
    const result = getBusinessNumberTextCallIdentityPlanning();

    expect(result.phase).toBe("C5.1 Business Number Text/Call Identity Planning");
    expect(result.businessNumberTextCallIdentityPlanningStatus).toBe("planning_only");
    expect(result.numberDecision).toBe("not_authorized_for_activation");
    expect(result.smsDecision).toBe("not_authorized_for_sending");
    expect(result.callingDecision).toBe("not_authorized_for_calling");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("C5.2 Consent, DNC, Opt-Out, And Sender Policy Review");
    expect(result.nextStageRecommendation).toBe("C5.2 Consent, DNC, Opt-Out, And Sender Policy Review");
  });

  it("keeps C5.1 read-only advisory-only and planning-only", () => {
    const result = getBusinessNumberTextCallIdentityPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps number SMS calling and provider decisions not authorized", () => {
    const result = getBusinessNumberTextCallIdentityPlanning();

    expect(result.numberDecision).toBe("not_authorized_for_activation");
    expect(result.smsDecision).toBe("not_authorized_for_sending");
    expect(result.callingDecision).toBe("not_authorized_for_calling");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.flags.numberActivated).toBe(false);
    expect(result.flags.outboundSmsEnabled).toBe(false);
    expect(result.flags.callingEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
  });

  it("defines all C5.1 text and call identity planning lanes", () => {
    const result = getBusinessNumberTextCallIdentityPlanning();

    expect(result.textCallIdentityPlanningLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "business_number_identity",
        "local_toll_free_number_type_planning",
        "caller_id_business_naming",
        "sms_identity_10dlc_evidence_planning",
        "tcpa_consent_boundary",
        "dnc_opt_out_visibility",
        "inbound_reply_stop_handling_expectations",
        "human_approval_audit_boundary",
        "no_provider_no_send_no_call_boundary",
        "c5_2_readiness",
      ]),
    );
  });

  it("covers number identity caller ID 10DLC TCPA DNC STOP audit no-send and C5.2 readiness", () => {
    const result = getBusinessNumberTextCallIdentityPlanning();
    const laneText = result.textCallIdentityPlanningLanes
      .flatMap((lane) => [lane.lane, ...lane.planningFocus, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/future business number identity/i);
    expect(laneText).toMatch(/local number option/i);
    expect(laneText).toMatch(/truthful caller identity/i);
    expect(laneText).toMatch(/10DLC business evidence/i);
    expect(laneText).toMatch(/consent evidence needed/i);
    expect(laneText).toMatch(/DNC visibility/i);
    expect(laneText).toMatch(/STOP handling expectations/i);
    expect(laneText).toMatch(/human-supervised communication/i);
    expect(laneText).toMatch(/no Twilio activation/i);
    expect(laneText).toMatch(/consent policy review next/i);
  });

  it("keeps number purchase activation 10DLC consent and webhook flags false", () => {
    const flags = getBusinessNumberTextCallIdentityPlanning().flags;

    expect(flags.numberPurchaseAuthorized).toBe(false);
    expect(flags.numberActivated).toBe(false);
    expect(flags.localNumberActivated).toBe(false);
    expect(flags.tollFreeNumberActivated).toBe(false);
    expect(flags.callerIdActivated).toBe(false);
    expect(flags.smsIdentityActivated).toBe(false);
    expect(flags.tenDlcRegistrationStarted).toBe(false);
    expect(flags.tenDlcBrandRegistered).toBe(false);
    expect(flags.tenDlcCampaignRegistered).toBe(false);
    expect(flags.consentCollectionEnabled).toBe(false);
    expect(flags.dncBypassAllowed).toBe(false);
    expect(flags.optOutBypassAllowed).toBe(false);
    expect(flags.stopHandlingActivated).toBe(false);
    expect(flags.inboundWebhookCreated).toBe(false);
    expect(flags.routeCreated).toBe(false);
  });

  it("keeps Twilio provider env SDK SMS calling AI voice and campaign flags false", () => {
    const flags = getBusinessNumberTextCallIdentityPlanning().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.providerSdkImported).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.smsProviderActivated).toBe(false);
    expect(flags.phoneProviderActivated).toBe(false);
    expect(flags.sendPathCreated).toBe(false);
    expect(flags.callPathCreated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.campaignActivated).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
  });

  it("keeps queues reminders runtime polling CRM automation approval go-live and spend flags false", () => {
    const flags = getBusinessNumberTextCallIdentityPlanning().flags;

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
    const result = getBusinessNumberTextCallIdentityPlanning();
    const doctrineText = result.textCallIdentityDoctrine.join(" ");

    expect(doctrineText).toMatch(/future text and call identity requirements only/i);
    expect(doctrineText).toMatch(/No number purchase, Twilio\/provider activation/i);
    expect(doctrineText).toMatch(/business identity/i);
    expect(doctrineText).toMatch(/consent sensitivity/i);
    expect(doctrineText).toMatch(/opt-out handling/i);
    expect(doctrineText).toMatch(/DNC visibility/i);
    expect(doctrineText).toMatch(/C5\.2 must review consent/i);
  });

  it("summarizes C5.1 planning and includes the C5.2 next stage", () => {
    const result = getBusinessNumberTextCallIdentityPlanning();
    const summary = summarizeBusinessNumberTextCallIdentityPlanning(result);

    expect(summary).toMatch(/Number decision is not_authorized_for_activation/i);
    expect(summary).toMatch(/SMS decision is not_authorized_for_sending/i);
    expect(summary).toMatch(/calling decision is not_authorized_for_calling/i);
    expect(summary).toMatch(/provider decision is not_authorized/i);
    expect(summary).toMatch(/business number identity/i);
    expect(summary).toMatch(/10DLC evidence/i);
    expect(summary).toMatch(/TCPA consent boundary/i);
    expect(summary).toMatch(/DNC\/opt-out visibility/i);
    expect(summary).toMatch(/No number activation/i);
    expect(summary).toMatch(/no Twilio\/provider activation/i);
    expect(summary).toMatch(/no SMS/i);
    expect(summary).toMatch(/no calling/i);
    expect(summary).toMatch(/no AI voice/i);
    expect(summary).toMatch(/Next stage: C5\.2 Consent, DNC, Opt-Out, And Sender Policy Review/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "numberPurchaseAuthorized",
      "numberActivated",
      "localNumberActivated",
      "tenDlcRegistrationStarted",
      "tenDlcBrandRegistered",
      "consentCollectionEnabled",
      "dncBypassAllowed",
      "optOutBypassAllowed",
      "inboundWebhookCreated",
      "routeCreated",
      "providerActivated",
      "providerClientCreated",
      "providerEnvRead",
      "providerSdkImported",
      "twilioActivated",
      "outboundSmsEnabled",
      "callingEnabled",
      "aiVoiceEnabled",
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
        ...getBusinessNumberTextCallIdentityPlanning(),
        flags: {
          ...businessNumberTextCallIdentityPlanningFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertBusinessNumberTextCallIdentityPlanningSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions or status drift", () => {
    const statusUnsafe = {
      ...getBusinessNumberTextCallIdentityPlanning(),
      businessNumberTextCallIdentityPlanningStatus: "number_identity_shape_defined" as "planning_only",
    };
    const numberUnsafe = {
      ...getBusinessNumberTextCallIdentityPlanning(),
      numberDecision: "authorized" as "not_authorized_for_activation",
    };
    const smsUnsafe = {
      ...getBusinessNumberTextCallIdentityPlanning(),
      smsDecision: "authorized" as "not_authorized_for_sending",
    };
    const callingUnsafe = {
      ...getBusinessNumberTextCallIdentityPlanning(),
      callingDecision: "authorized" as "not_authorized_for_calling",
    };
    const providerUnsafe = {
      ...getBusinessNumberTextCallIdentityPlanning(),
      providerDecision: "authorized" as "not_authorized",
    };

    expect(() => assertBusinessNumberTextCallIdentityPlanningSafe(statusUnsafe)).toThrow(/cannot become number-ready/i);
    expect(() => assertBusinessNumberTextCallIdentityPlanningSafe(numberUnsafe)).toThrow(/number decision/i);
    expect(() => assertBusinessNumberTextCallIdentityPlanningSafe(smsUnsafe)).toThrow(/SMS decision/i);
    expect(() => assertBusinessNumberTextCallIdentityPlanningSafe(callingUnsafe)).toThrow(/calling decision/i);
    expect(() => assertBusinessNumberTextCallIdentityPlanningSafe(providerUnsafe)).toThrow(/provider decision/i);
  });

  it("fails invariant checks if the roadmap skips C5.2", () => {
    const unsafeResult = {
      ...getBusinessNumberTextCallIdentityPlanning(),
      recommendedNextExactStep: "C6 Controlled Communication Infrastructure Gate" as "C5.2 Consent, DNC, Opt-Out, And Sender Policy Review",
    };

    expect(() => assertBusinessNumberTextCallIdentityPlanningSafe(unsafeResult)).toThrow(/C5\.2 Consent, DNC, Opt-Out, And Sender Policy Review/i);
  });
});
