import {
  assertGoLiveReadinessGateSafe,
  getGoLiveReadinessGate,
  goLiveReadinessGateFlags,
  summarizeGoLiveReadinessGate,
} from "./go-live-readiness-gate";

describe("go-live readiness gate", () => {
  it("creates a planning-only go-live readiness contract", () => {
    const result = getGoLiveReadinessGate();

    expect(result.phase).toBe("Go-Live Readiness Gate");
    expect(result.goLiveReadinessGateStatus).toBe("planning_only");
    expect(result.goLiveDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationExecutionDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Final Human Go/No-Go Authorization Review");
    expect(result.nextStageRecommendation).toBe("Final Human Go/No-Go Authorization Review");
  });

  it("keeps go-live readiness read-only advisory-only and planning-only", () => {
    const result = getGoLiveReadinessGate();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps go-live provider communication execution and automation decisions not authorized", () => {
    const result = getGoLiveReadinessGate();

    expect(result.goLiveDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationExecutionDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.flags.goLiveAuthorized).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.communicationExecutionAuthorized).toBe(false);
    expect(result.flags.automationEnabled).toBe(false);
  });

  it("defines all go-live readiness lanes", () => {
    const result = getGoLiveReadinessGate();

    expect(result.goLiveReadinessGateLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "c5_domain_email_identity_evidence",
        "c5_1_business_number_text_call_identity_evidence",
        "c5_2_consent_dnc_opt_out_sender_policy_evidence",
        "c6_controlled_infrastructure_gate_evidence",
        "c6_1_human_triggered_pilot_evidence",
        "operator_workflow_readiness",
        "dnc_opt_out_stop_hard_blocker_preservation",
        "provider_credential_env_boundary",
        "audit_rollback_failure_state_readiness",
        "no_campaign_no_autonomy_boundary",
        "no_go_live_no_provider_boundary",
        "final_human_authorization_readiness",
      ]),
    );
  });

  it("references C5 C5.1 C5.2 C6 and C6.1 prerequisites", () => {
    const result = getGoLiveReadinessGate();
    const laneText = result.goLiveReadinessGateLanes
      .flatMap((lane) => [lane.lane, ...lane.readinessFocus, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/C5 domain\/email identity evidence/i);
    expect(laneText).toMatch(/C5\.1 business number evidence/i);
    expect(laneText).toMatch(/C5\.2 consent evidence/i);
    expect(laneText).toMatch(/C6 controlled infrastructure gate evidence/i);
    expect(laneText).toMatch(/C6\.1 pilot planning evidence/i);
    expect(laneText).toMatch(/operator clarity/i);
    expect(laneText).toMatch(/final human go\/no-go review/i);
  });

  it("preserves DNC opt-out STOP hard blockers and no-campaign no-autonomy boundaries", () => {
    const result = getGoLiveReadinessGate();
    const laneText = result.goLiveReadinessGateLanes
      .flatMap((lane) => [lane.lane, ...lane.readinessFocus, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/DNC hard blocker/i);
    expect(laneText).toMatch(/opt-out hard blocker/i);
    expect(laneText).toMatch(/STOP hard blocker/i);
    expect(laneText).toMatch(/revocation hard blocker/i);
    expect(laneText).toMatch(/no campaigns/i);
    expect(laneText).toMatch(/no autonomous follow-up/i);
    expect(laneText).toMatch(/no go-live/i);
    expect(laneText).toMatch(/no provider activation/i);
  });

  it("keeps provider Twilio DNS domain env SDK route webhook and activation flags false", () => {
    const flags = getGoLiveReadinessGate().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.providerSdkImported).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.mailboxCreated).toBe(false);
    expect(flags.spfDkimDmarcPublished).toBe(false);
    expect(flags.emailProviderActivated).toBe(false);
    expect(flags.smsProviderActivated).toBe(false);
    expect(flags.phoneProviderActivated).toBe(false);
    expect(flags.routeCreated).toBe(false);
    expect(flags.inboundWebhookCreated).toBe(false);
  });

  it("keeps outbound communication calling AI voice campaigns queues reminders polling and runtime jobs false", () => {
    const flags = getGoLiveReadinessGate().flags;

    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.emailSendingEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.sendPathCreated).toBe(false);
    expect(flags.callPathCreated).toBe(false);
    expect(flags.campaignActivated).toBe(false);
    expect(flags.communicationQueueCreated).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.reminderCreated).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.runtimeJobCreated).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
  });

  it("keeps CRM audit approval execution autonomy go-live spend and blocker bypass flags false", () => {
    const flags = getGoLiveReadinessGate().flags;

    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.communicationExecutionAuthorized).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.autonomousFollowUpEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.finalHumanAuthorizationGranted).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.dncBypassAllowed).toBe(false);
    expect(flags.optOutBypassAllowed).toBe(false);
    expect(flags.stopBypassAllowed).toBe(false);
    expect(flags.rollbackExecutionEnabled).toBe(false);
  });

  it("keeps doctrine focused on readiness review without live activation", () => {
    const result = getGoLiveReadinessGate();
    const doctrineText = result.goLiveReadinessDoctrine.join(" ");

    expect(doctrineText).toMatch(/review-only/i);
    expect(doctrineText).toMatch(/Go-live decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Provider decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Communication execution decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Automation decision remains not_authorized/i);
    expect(doctrineText).toMatch(/No provider activation, DNS\/domain activation, env read/i);
    expect(doctrineText).toMatch(/Final authorization must remain separate/i);
    expect(doctrineText).toMatch(/DNC, opt-out, STOP, and revocation blockers remain non-bypassable/i);
    expect(doctrineText).toMatch(/Highest ROI route remains/i);
  });

  it("summarizes no go-live no provider activation no outbound communication no runtime infrastructure no campaigns no autonomy and next stage", () => {
    const result = getGoLiveReadinessGate();
    const summary = summarizeGoLiveReadinessGate(result);

    expect(summary).toMatch(/Go-live decision is not_authorized/i);
    expect(summary).toMatch(/provider decision is not_authorized/i);
    expect(summary).toMatch(/communication execution decision is not_authorized/i);
    expect(summary).toMatch(/automation decision is not_authorized/i);
    expect(summary).toMatch(/No go-live/i);
    expect(summary).toMatch(/provider activation/i);
    expect(summary).toMatch(/outbound communication/i);
    expect(summary).toMatch(/runtime infrastructure/i);
    expect(summary).toMatch(/campaign/i);
    expect(summary).toMatch(/autonomous follow-up/i);
    expect(summary).toMatch(/Next stage: Final Human Go\/No-Go Authorization Review/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "goLiveAuthorized",
      "finalHumanAuthorizationGranted",
      "providerActivated",
      "providerClientCreated",
      "providerEnvRead",
      "providerSdkImported",
      "twilioActivated",
      "dnsMutationEnabled",
      "domainActivated",
      "mailboxCreated",
      "spfDkimDmarcPublished",
      "outboundSmsEnabled",
      "outboundEmailEnabled",
      "callingEnabled",
      "aiVoiceEnabled",
      "routeCreated",
      "inboundWebhookCreated",
      "campaignActivated",
      "queueSystemEnabled",
      "reminderSystemEnabled",
      "pollingEnabled",
      "runtimeJobsEnabled",
      "crmMutationEnabled",
      "auditWritingEnabled",
      "autonomousFollowUpEnabled",
      "autonomousSellerHandlingEnabled",
      "spendIncreaseAuthorized",
      "dncBypassAllowed",
      "optOutBypassAllowed",
      "stopBypassAllowed",
      "rollbackExecutionEnabled",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getGoLiveReadinessGate(),
        flags: {
          ...goLiveReadinessGateFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertGoLiveReadinessGateSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions or status drift", () => {
    const statusUnsafe = {
      ...getGoLiveReadinessGate(),
      goLiveReadinessGateStatus: "go_live_review_required" as "planning_only",
    };
    const goLiveUnsafe = {
      ...getGoLiveReadinessGate(),
      goLiveDecision: "authorized" as "not_authorized",
    };
    const providerUnsafe = {
      ...getGoLiveReadinessGate(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getGoLiveReadinessGate(),
      communicationExecutionDecision: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getGoLiveReadinessGate(),
      automationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertGoLiveReadinessGateSafe(statusUnsafe)).toThrow(/cannot become go-live-ready/i);
    expect(() => assertGoLiveReadinessGateSafe(goLiveUnsafe)).toThrow(/go-live decision/i);
    expect(() => assertGoLiveReadinessGateSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertGoLiveReadinessGateSafe(communicationUnsafe)).toThrow(/communication execution decision/i);
    expect(() => assertGoLiveReadinessGateSafe(automationUnsafe)).toThrow(/automation decision/i);
  });

  it("fails invariant checks if the roadmap skips final human authorization review", () => {
    const unsafeResult = {
      ...getGoLiveReadinessGate(),
      recommendedNextExactStep: "Provider Activation" as "Final Human Go/No-Go Authorization Review",
    };

    expect(() => assertGoLiveReadinessGateSafe(unsafeResult)).toThrow(/Final Human Go\/No-Go Authorization Review/i);
  });
});
