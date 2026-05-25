import {
  assertHumanTriggeredProviderPilotPlanningSafe,
  getHumanTriggeredProviderPilotPlanning,
  humanTriggeredProviderPilotPlanningFlags,
  summarizeHumanTriggeredProviderPilotPlanning,
} from "./human-triggered-provider-pilot-planning";

describe("human-triggered provider pilot planning", () => {
  it("creates a planning-only C6.1 human-triggered provider pilot contract", () => {
    const result = getHumanTriggeredProviderPilotPlanning();

    expect(result.phase).toBe("C6.1 Human-Triggered Provider Pilot Planning");
    expect(result.humanTriggeredProviderPilotPlanningStatus).toBe("planning_only");
    expect(result.pilotDecision).toBe("not_authorized_for_activation");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationExecutionDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Go-Live Readiness Gate");
    expect(result.nextStageRecommendation).toBe("Go-Live Readiness Gate");
  });

  it("keeps C6.1 read-only advisory-only and planning-only", () => {
    const result = getHumanTriggeredProviderPilotPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps pilot provider communication execution and automation decisions not authorized", () => {
    const result = getHumanTriggeredProviderPilotPlanning();

    expect(result.pilotDecision).toBe("not_authorized_for_activation");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationExecutionDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.flags.pilotActivationAuthorized).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.communicationExecutionAuthorized).toBe(false);
    expect(result.flags.automationEnabled).toBe(false);
  });

  it("defines all C6.1 human-triggered provider pilot planning lanes", () => {
    const result = getHumanTriggeredProviderPilotPlanning();

    expect(result.humanTriggeredProviderPilotPlanningLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "c6_infrastructure_gate_prerequisite",
        "human_triggered_only_pilot_boundary",
        "approval_gated_send_call_review",
        "audited_pilot_evidence",
        "revocation_rollback_planning",
        "dnc_opt_out_stop_hard_blocker_preservation",
        "provider_credential_env_boundary",
        "no_campaign_no_autonomy_boundary",
        "pilot_failure_state_planning",
        "go_live_readiness",
      ]),
    );
  });

  it("preserves human-triggered approval-gated audited revocable blocker and no-autonomy requirements", () => {
    const result = getHumanTriggeredProviderPilotPlanning();
    const laneText = result.humanTriggeredProviderPilotPlanningLanes
      .flatMap((lane) => [lane.lane, ...lane.planningFocus, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/C6 infrastructure gate prerequisite/i);
    expect(laneText).toMatch(/human-triggered only/i);
    expect(laneText).toMatch(/approval-gated message review/i);
    expect(laneText).toMatch(/future reviewer identity/i);
    expect(laneText).toMatch(/revocation expectation/i);
    expect(laneText).toMatch(/DNC hard blocker/i);
    expect(laneText).toMatch(/no provider credentials/i);
    expect(laneText).toMatch(/no campaigns/i);
    expect(laneText).toMatch(/provider failure states/i);
    expect(laneText).toMatch(/go-live readiness gate next/i);
  });

  it("keeps provider Twilio env SDK route webhook and activation flags false", () => {
    const flags = getHumanTriggeredProviderPilotPlanning().flags;

    expect(flags.pilotActivationAuthorized).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.providerSdkImported).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.emailProviderActivated).toBe(false);
    expect(flags.smsProviderActivated).toBe(false);
    expect(flags.phoneProviderActivated).toBe(false);
    expect(flags.inboundWebhookCreated).toBe(false);
    expect(flags.routeCreated).toBe(false);
  });

  it("keeps outbound communication calling AI voice campaign and runtime infrastructure flags false", () => {
    const flags = getHumanTriggeredProviderPilotPlanning().flags;

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
    expect(flags.runtimeJobCreated).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
  });

  it("keeps CRM audit automation blocker bypass go-live and spend flags false", () => {
    const flags = getHumanTriggeredProviderPilotPlanning().flags;

    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.communicationExecutionAuthorized).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.autonomousFollowUpEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.dncBypassAllowed).toBe(false);
    expect(flags.optOutBypassAllowed).toBe(false);
    expect(flags.stopBypassAllowed).toBe(false);
    expect(flags.rollbackExecutionEnabled).toBe(false);
  });

  it("keeps doctrine focused on a future manual pilot without activation", () => {
    const result = getHumanTriggeredProviderPilotPlanning();
    const doctrineText = result.humanTriggeredProviderPilotDoctrine.join(" ");

    expect(doctrineText).toMatch(/future human-triggered provider pilot only/i);
    expect(doctrineText).toMatch(/not_authorized_for_activation/i);
    expect(doctrineText).toMatch(/human-triggered, approval-gated, audited, revocable, and non-autonomous/i);
    expect(doctrineText).toMatch(/No provider activation, SDK import, env read/i);
    expect(doctrineText).toMatch(/DNC, opt-out, STOP, and revocation blockers remain non-bypassable/i);
    expect(doctrineText).toMatch(/Existing \/api\/send-sms and Twilio inbound webhook routes are not changed/i);
  });

  it("summarizes C6.1 planning and includes the go-live readiness next stage", () => {
    const result = getHumanTriggeredProviderPilotPlanning();
    const summary = summarizeHumanTriggeredProviderPilotPlanning(result);

    expect(summary).toMatch(/Pilot decision is not_authorized_for_activation/i);
    expect(summary).toMatch(/provider decision is not_authorized/i);
    expect(summary).toMatch(/communication execution decision is not_authorized/i);
    expect(summary).toMatch(/automation decision is not_authorized/i);
    expect(summary).toMatch(/human-triggered, approval-gated, audited, revocable, non-autonomous/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/no outbound communication/i);
    expect(summary).toMatch(/runtime job/i);
    expect(summary).toMatch(/campaign/i);
    expect(summary).toMatch(/autonomous follow-up/i);
    expect(summary).toMatch(/Next stage: Go-Live Readiness Gate/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "pilotActivationAuthorized",
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
      "auditWritingEnabled",
      "autonomousFollowUpEnabled",
      "autonomousSellerHandlingEnabled",
      "goLiveAuthorized",
      "spendIncreaseAuthorized",
      "dncBypassAllowed",
      "optOutBypassAllowed",
      "rollbackExecutionEnabled",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getHumanTriggeredProviderPilotPlanning(),
        flags: {
          ...humanTriggeredProviderPilotPlanningFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertHumanTriggeredProviderPilotPlanningSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions or status drift", () => {
    const statusUnsafe = {
      ...getHumanTriggeredProviderPilotPlanning(),
      humanTriggeredProviderPilotPlanningStatus: "pilot_shape_defined" as "planning_only",
    };
    const pilotUnsafe = {
      ...getHumanTriggeredProviderPilotPlanning(),
      pilotDecision: "authorized" as "not_authorized_for_activation",
    };
    const providerUnsafe = {
      ...getHumanTriggeredProviderPilotPlanning(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getHumanTriggeredProviderPilotPlanning(),
      communicationExecutionDecision: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getHumanTriggeredProviderPilotPlanning(),
      automationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertHumanTriggeredProviderPilotPlanningSafe(statusUnsafe)).toThrow(/cannot become pilot-ready/i);
    expect(() => assertHumanTriggeredProviderPilotPlanningSafe(pilotUnsafe)).toThrow(/pilot decision/i);
    expect(() => assertHumanTriggeredProviderPilotPlanningSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertHumanTriggeredProviderPilotPlanningSafe(communicationUnsafe)).toThrow(/communication execution decision/i);
    expect(() => assertHumanTriggeredProviderPilotPlanningSafe(automationUnsafe)).toThrow(/automation decision/i);
  });

  it("fails invariant checks if the roadmap skips go-live readiness", () => {
    const unsafeResult = {
      ...getHumanTriggeredProviderPilotPlanning(),
      recommendedNextExactStep: "Provider Activation Pilot" as "Go-Live Readiness Gate",
    };

    expect(() => assertHumanTriggeredProviderPilotPlanningSafe(unsafeResult)).toThrow(/Go-Live Readiness Gate/i);
  });
});
