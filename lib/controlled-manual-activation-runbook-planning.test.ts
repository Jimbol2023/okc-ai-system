import {
  assertControlledManualActivationRunbookPlanningSafe,
  controlledManualActivationRunbookPlanningFlags,
  getControlledManualActivationRunbookPlanning,
  summarizeControlledManualActivationRunbookPlanning,
} from "./controlled-manual-activation-runbook-planning";

describe("controlled manual activation runbook planning", () => {
  it("creates a planning-only controlled manual activation runbook contract", () => {
    const result = getControlledManualActivationRunbookPlanning();

    expect(result.phase).toBe("Controlled Manual Activation Runbook Planning");
    expect(result.controlledManualActivationRunbookPlanningStatus).toBe("planning_only");
    expect(result.runbookDecision).toBe("not_authorized_for_execution");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Manual Activation Dry-Run Evidence Review");
    expect(result.nextStageRecommendation).toBe("Manual Activation Dry-Run Evidence Review");
  });

  it("keeps runbook planning read-only advisory-only planning-only and runbook-planning-only", () => {
    const result = getControlledManualActivationRunbookPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.runbookPlanningOnly).toBe(true);
  });

  it("keeps runbook provider communication and automation decisions not authorized", () => {
    const result = getControlledManualActivationRunbookPlanning();

    expect(result.runbookDecision).toBe("not_authorized_for_execution");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.flags.runbookApprovedForExecution).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.communicationExecutionAuthorized).toBe(false);
    expect(result.flags.automationEnabled).toBe(false);
  });

  it("defines all controlled manual activation runbook lanes", () => {
    const result = getControlledManualActivationRunbookPlanning();

    expect(result.controlledManualActivationRunbookLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "final_human_review_prerequisite",
        "manual_checklist_sequence",
        "identity_evidence_check",
        "consent_dnc_opt_out_stop_check",
        "blocker_preflight_check",
        "credential_env_boundary",
        "manual_activation_step_planning",
        "audit_expectation_planning",
        "rollback_rule_planning",
        "failure_state_planning",
        "no_send_no_provider_boundary",
        "dry_run_evidence_readiness",
      ]),
    );
  });

  it("defines checklist blocker rollback audit and dry-run planning without execution", () => {
    const result = getControlledManualActivationRunbookPlanning();
    const laneText = result.controlledManualActivationRunbookLanes
      .flatMap((lane) => [lane.lane, ...lane.checklistFocus, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/Final Human Go\/No-Go prerequisite/i);
    expect(laneText).toMatch(/step-by-step human checklist/i);
    expect(laneText).toMatch(/domain identity evidence/i);
    expect(laneText).toMatch(/consent evidence check/i);
    expect(laneText).toMatch(/missing approval blocker/i);
    expect(laneText).toMatch(/no env reads/i);
    expect(laneText).toMatch(/future activation step names/i);
    expect(laneText).toMatch(/future audit fields/i);
    expect(laneText).toMatch(/rollback checklist/i);
    expect(laneText).toMatch(/failed preflight state/i);
    expect(laneText).toMatch(/no provider activation/i);
    expect(laneText).toMatch(/manual dry-run next/i);
  });

  it("keeps provider domain number env SDK route webhook and activation flags false", () => {
    const flags = getControlledManualActivationRunbookPlanning().flags;

    expect(flags.runbookApprovedForExecution).toBe(false);
    expect(flags.finalAuthorizationGranted).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.providerActivationAuthorized).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.providerSdkImported).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.mailboxCreated).toBe(false);
    expect(flags.numberActivated).toBe(false);
    expect(flags.routeCreated).toBe(false);
    expect(flags.inboundWebhookCreated).toBe(false);
  });

  it("keeps outbound communication AI voice campaign queue reminder polling and runtime flags false", () => {
    const flags = getControlledManualActivationRunbookPlanning().flags;

    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.emailSendingEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.campaignActivated).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
  });

  it("keeps CRM audit approval execution automation dry-run rollback spend and blocker bypass flags false", () => {
    const flags = getControlledManualActivationRunbookPlanning().flags;

    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.communicationExecutionAuthorized).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.autonomousFollowUpEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.dryRunExecutionEnabled).toBe(false);
    expect(flags.rollbackExecutionEnabled).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.dncBypassAllowed).toBe(false);
    expect(flags.optOutBypassAllowed).toBe(false);
    expect(flags.stopBypassAllowed).toBe(false);
  });

  it("keeps doctrine focused on manual runbook planning without activation", () => {
    const result = getControlledManualActivationRunbookPlanning();
    const doctrineText = result.controlledManualActivationRunbookDoctrine.join(" ");

    expect(doctrineText).toMatch(/contract-only and planning-only/i);
    expect(doctrineText).toMatch(/not_authorized_for_execution/i);
    expect(doctrineText).toMatch(/Provider decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Communication decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Automation decision remains not_authorized/i);
    expect(doctrineText).toMatch(/human checklist steps, blocker checks, rollback rules, audit expectations/i);
    expect(doctrineText).toMatch(/No provider activation, DNS\/domain activation/i);
    expect(doctrineText).toMatch(/DNC, opt-out, STOP, revocation, missing approval/i);
    expect(doctrineText).toMatch(/AI may explain the checklist and summarize evidence only/i);
  });

  it("summarizes no activation send runtime rollback automation or spend and includes next stage", () => {
    const result = getControlledManualActivationRunbookPlanning();
    const summary = summarizeControlledManualActivationRunbookPlanning(result);

    expect(summary).toMatch(/Runbook decision is not_authorized_for_execution/i);
    expect(summary).toMatch(/provider decision is not_authorized/i);
    expect(summary).toMatch(/communication decision is not_authorized/i);
    expect(summary).toMatch(/automation decision is not_authorized/i);
    expect(summary).toMatch(/manual checklist sequence/i);
    expect(summary).toMatch(/rollback rules/i);
    expect(summary).toMatch(/No runbook execution/i);
    expect(summary).toMatch(/provider activation/i);
    expect(summary).toMatch(/outbound communication/i);
    expect(summary).toMatch(/runtime job/i);
    expect(summary).toMatch(/rollback execution/i);
    expect(summary).toMatch(/spend increase/i);
    expect(summary).toMatch(/Next stage: Manual Activation Dry-Run Evidence Review/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "runbookApprovedForExecution",
      "finalAuthorizationGranted",
      "goLiveAuthorized",
      "providerActivationAuthorized",
      "providerActivated",
      "providerClientCreated",
      "providerEnvRead",
      "providerSdkImported",
      "twilioActivated",
      "dnsMutationEnabled",
      "domainActivated",
      "mailboxCreated",
      "numberActivated",
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
      "automationEnabled",
      "autonomousFollowUpEnabled",
      "autonomousSellerHandlingEnabled",
      "dryRunExecutionEnabled",
      "rollbackExecutionEnabled",
      "spendIncreaseAuthorized",
      "dncBypassAllowed",
      "optOutBypassAllowed",
      "stopBypassAllowed",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getControlledManualActivationRunbookPlanning(),
        flags: {
          ...controlledManualActivationRunbookPlanningFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertControlledManualActivationRunbookPlanningSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions or status drift", () => {
    const statusUnsafe = {
      ...getControlledManualActivationRunbookPlanning(),
      controlledManualActivationRunbookPlanningStatus: "manual_runbook_shape_defined" as "planning_only",
    };
    const runbookUnsafe = {
      ...getControlledManualActivationRunbookPlanning(),
      runbookDecision: "authorized" as "not_authorized_for_execution",
    };
    const providerUnsafe = {
      ...getControlledManualActivationRunbookPlanning(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getControlledManualActivationRunbookPlanning(),
      communicationDecision: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getControlledManualActivationRunbookPlanning(),
      automationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertControlledManualActivationRunbookPlanningSafe(statusUnsafe)).toThrow(/cannot become execution-ready/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(runbookUnsafe)).toThrow(/Runbook decision/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(communicationUnsafe)).toThrow(/communication decision/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(automationUnsafe)).toThrow(/automation decision/i);
  });

  it("fails invariant checks if the roadmap skips manual dry-run evidence review", () => {
    const unsafeResult = {
      ...getControlledManualActivationRunbookPlanning(),
      recommendedNextExactStep: "Activate Providers" as "Manual Activation Dry-Run Evidence Review",
    };

    expect(() => assertControlledManualActivationRunbookPlanningSafe(unsafeResult)).toThrow(/Manual Activation Dry-Run Evidence Review/i);
  });
});
