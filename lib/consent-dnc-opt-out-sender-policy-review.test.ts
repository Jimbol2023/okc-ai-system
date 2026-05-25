import {
  assertConsentDncOptOutSenderPolicyReviewSafe,
  consentDncOptOutSenderPolicyReviewFlags,
  getConsentDncOptOutSenderPolicyReview,
  summarizeConsentDncOptOutSenderPolicyReview,
} from "./consent-dnc-opt-out-sender-policy-review";

describe("consent DNC opt-out and sender policy review", () => {
  it("creates a planning-only C5.2 consent DNC opt-out and sender policy contract", () => {
    const result = getConsentDncOptOutSenderPolicyReview();

    expect(result.phase).toBe("C5.2 Consent, DNC, Opt-Out, And Sender Policy Review");
    expect(result.consentDncOptOutSenderPolicyReviewStatus).toBe("planning_only");
    expect(result.consentDecision).toBe("not_authorized_for_collection");
    expect(result.dncDecision).toBe("hard_blocker");
    expect(result.optOutDecision).toBe("hard_blocker");
    expect(result.senderPolicyDecision).toBe("review_only");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("C6 Controlled Communication Infrastructure Gate");
    expect(result.nextStageRecommendation).toBe("C6 Controlled Communication Infrastructure Gate");
  });

  it("keeps C5.2 read-only advisory-only and planning-only", () => {
    const result = getConsentDncOptOutSenderPolicyReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps consent collection provider and communication decisions blocked", () => {
    const result = getConsentDncOptOutSenderPolicyReview();

    expect(result.consentDecision).toBe("not_authorized_for_collection");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.flags.consentCollectionEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.communicationExecutionAuthorized).toBe(false);
  });

  it("keeps DNC and opt-out as hard blockers", () => {
    const result = getConsentDncOptOutSenderPolicyReview();
    const doctrineText = result.consentDncOptOutSenderPolicyDoctrine.join(" ");

    expect(result.dncDecision).toBe("hard_blocker");
    expect(result.optOutDecision).toBe("hard_blocker");
    expect(result.flags.dncBypassAllowed).toBe(false);
    expect(result.flags.optOutBypassAllowed).toBe(false);
    expect(doctrineText).toMatch(/DNC and opt-out remain non-bypassable hard blockers/i);
  });

  it("defines all C5.2 consent DNC opt-out and sender policy lanes", () => {
    const result = getConsentDncOptOutSenderPolicyReview();

    expect(result.consentDncOptOutSenderPolicyLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "consent_evidence_requirements",
        "dnc_hard_blocker_policy",
        "opt_out_hard_blocker_policy",
        "stop_revocation_handling_expectations",
        "sender_identity_policy",
        "email_opt_out_visibility",
        "sms_call_consent_sensitivity",
        "human_approval_audit_boundary",
        "no_provider_no_send_no_call_boundary",
        "c6_readiness",
      ]),
    );
  });

  it("covers consent evidence DNC opt-out STOP sender email SMS/call audit no-send and C6 readiness", () => {
    const result = getConsentDncOptOutSenderPolicyReview();
    const laneText = result.consentDncOptOutSenderPolicyLanes
      .flatMap((lane) => [lane.lane, ...lane.reviewFocus, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/future consent evidence/i);
    expect(laneText).toMatch(/DNC visibility/i);
    expect(laneText).toMatch(/opt-out reason/i);
    expect(laneText).toMatch(/STOP language/i);
    expect(laneText).toMatch(/truthful sender identity/i);
    expect(laneText).toMatch(/email opt-out notice/i);
    expect(laneText).toMatch(/SMS consent sensitivity/i);
    expect(laneText).toMatch(/human approval/i);
    expect(laneText).toMatch(/no provider activation/i);
    expect(laneText).toMatch(/controlled infrastructure gate next/i);
  });

  it("keeps consent DNC opt-out STOP sender policy route and provider flags false", () => {
    const flags = getConsentDncOptOutSenderPolicyReview().flags;

    expect(flags.consentCollectionEnabled).toBe(false);
    expect(flags.consentPersistenceEnabled).toBe(false);
    expect(flags.consentBypassAllowed).toBe(false);
    expect(flags.dncBypassAllowed).toBe(false);
    expect(flags.optOutBypassAllowed).toBe(false);
    expect(flags.stopHandlingActivated).toBe(false);
    expect(flags.revocationHandlingActivated).toBe(false);
    expect(flags.senderPolicyActivated).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.providerSdkImported).toBe(false);
    expect(flags.inboundWebhookCreated).toBe(false);
    expect(flags.routeCreated).toBe(false);
  });

  it("keeps communication infrastructure and activation flags false", () => {
    const flags = getConsentDncOptOutSenderPolicyReview().flags;

    expect(flags.twilioActivated).toBe(false);
    expect(flags.numberActivated).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.emailProviderActivated).toBe(false);
    expect(flags.smsProviderActivated).toBe(false);
    expect(flags.phoneProviderActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.emailSendingEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.sendPathCreated).toBe(false);
    expect(flags.callPathCreated).toBe(false);
  });

  it("keeps campaigns queues reminders runtime polling CRM automation approval go-live and spend flags false", () => {
    const flags = getConsentDncOptOutSenderPolicyReview().flags;

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
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.communicationExecutionAuthorized).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
  });

  it("keeps doctrine focused on policy boundaries without execution", () => {
    const result = getConsentDncOptOutSenderPolicyReview();
    const doctrineText = result.consentDncOptOutSenderPolicyDoctrine.join(" ");

    expect(doctrineText).toMatch(/policy boundaries only/i);
    expect(doctrineText).toMatch(/does not collect consent or activate communication/i);
    expect(doctrineText).toMatch(/Approval remains separate from execution/i);
    expect(doctrineText).toMatch(/truthful identity/i);
    expect(doctrineText).toMatch(/reply handling/i);
    expect(doctrineText).toMatch(/opt-out visibility/i);
    expect(doctrineText).toMatch(/human supervision/i);
  });

  it("summarizes C5.2 planning and includes the C6 next stage", () => {
    const result = getConsentDncOptOutSenderPolicyReview();
    const summary = summarizeConsentDncOptOutSenderPolicyReview(result);

    expect(summary).toMatch(/Consent decision is not_authorized_for_collection/i);
    expect(summary).toMatch(/DNC decision is hard_blocker/i);
    expect(summary).toMatch(/opt-out decision is hard_blocker/i);
    expect(summary).toMatch(/sender policy decision is review_only/i);
    expect(summary).toMatch(/provider decision is not_authorized/i);
    expect(summary).toMatch(/No consent collection/i);
    expect(summary).toMatch(/provider activation/i);
    expect(summary).toMatch(/SMS, email, calling/i);
    expect(summary).toMatch(/approval-as-execution/i);
    expect(summary).toMatch(/Next stage: C6 Controlled Communication Infrastructure Gate/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "consentCollectionEnabled",
      "consentPersistenceEnabled",
      "consentBypassAllowed",
      "dncBypassAllowed",
      "optOutBypassAllowed",
      "stopHandlingActivated",
      "providerActivated",
      "providerClientCreated",
      "providerEnvRead",
      "providerSdkImported",
      "twilioActivated",
      "outboundSmsEnabled",
      "outboundEmailEnabled",
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
        ...getConsentDncOptOutSenderPolicyReview(),
        flags: {
          ...consentDncOptOutSenderPolicyReviewFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertConsentDncOptOutSenderPolicyReviewSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions or status drift", () => {
    const statusUnsafe = {
      ...getConsentDncOptOutSenderPolicyReview(),
      consentDncOptOutSenderPolicyReviewStatus: "policy_shape_defined" as "planning_only",
    };
    const consentUnsafe = {
      ...getConsentDncOptOutSenderPolicyReview(),
      consentDecision: "authorized" as "not_authorized_for_collection",
    };
    const dncUnsafe = {
      ...getConsentDncOptOutSenderPolicyReview(),
      dncDecision: "review_only" as "hard_blocker",
    };
    const optOutUnsafe = {
      ...getConsentDncOptOutSenderPolicyReview(),
      optOutDecision: "review_only" as "hard_blocker",
    };
    const senderUnsafe = {
      ...getConsentDncOptOutSenderPolicyReview(),
      senderPolicyDecision: "active" as "review_only",
    };
    const providerUnsafe = {
      ...getConsentDncOptOutSenderPolicyReview(),
      providerDecision: "authorized" as "not_authorized",
    };

    expect(() => assertConsentDncOptOutSenderPolicyReviewSafe(statusUnsafe)).toThrow(/cannot become policy-ready/i);
    expect(() => assertConsentDncOptOutSenderPolicyReviewSafe(consentUnsafe)).toThrow(/consent decision/i);
    expect(() => assertConsentDncOptOutSenderPolicyReviewSafe(dncUnsafe)).toThrow(/DNC decision/i);
    expect(() => assertConsentDncOptOutSenderPolicyReviewSafe(optOutUnsafe)).toThrow(/opt-out decision/i);
    expect(() => assertConsentDncOptOutSenderPolicyReviewSafe(senderUnsafe)).toThrow(/sender policy decision/i);
    expect(() => assertConsentDncOptOutSenderPolicyReviewSafe(providerUnsafe)).toThrow(/provider decision/i);
  });

  it("fails invariant checks if the roadmap skips C6", () => {
    const unsafeResult = {
      ...getConsentDncOptOutSenderPolicyReview(),
      recommendedNextExactStep: "C6.1 Human-Triggered Provider Pilot Planning" as "C6 Controlled Communication Infrastructure Gate",
    };

    expect(() => assertConsentDncOptOutSenderPolicyReviewSafe(unsafeResult)).toThrow(/C6 Controlled Communication Infrastructure Gate/i);
  });
});
