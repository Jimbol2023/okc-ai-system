import {
  assertManualActivationDryRunEvidenceReviewSafe,
  getManualActivationDryRunEvidenceReview,
  manualActivationDryRunEvidenceReviewFlags,
  summarizeManualActivationDryRunEvidenceReview,
} from "./manual-activation-dry-run-evidence-review";

describe("manual activation dry-run evidence review", () => {
  it("creates a planning-only manual activation dry-run evidence review contract", () => {
    const result = getManualActivationDryRunEvidenceReview();

    expect(result.phase).toBe("Manual Activation Dry-Run Evidence Review");
    expect(result.manualActivationDryRunEvidenceReviewStatus).toBe("planning_only");
    expect(result.dryRunDecision).toBe("not_authorized_for_execution");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Activation Evidence Gap Resolution Planning");
    expect(result.nextStageRecommendation).toBe("Activation Evidence Gap Resolution Planning");
  });

  it("keeps dry-run evidence review read-only advisory-only planning-only and evidence-review-only", () => {
    const result = getManualActivationDryRunEvidenceReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.evidenceReviewOnly).toBe(true);
  });

  it("keeps dry-run provider communication and automation decisions not authorized", () => {
    const result = getManualActivationDryRunEvidenceReview();

    expect(result.dryRunDecision).toBe("not_authorized_for_execution");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.flags.dryRunExecutionAuthorized).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.communicationExecutionAuthorized).toBe(false);
    expect(result.flags.automationEnabled).toBe(false);
  });

  it("defines all manual activation dry-run evidence lanes", () => {
    const result = getManualActivationDryRunEvidenceReview();

    expect(result.manualActivationDryRunEvidenceLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "domain_email_checklist_readiness",
        "business_number_twilio_readiness",
        "consent_dnc_opt_out_stop_blocker_evidence",
        "manual_approval_step_evidence",
        "rollback_checklist_evidence",
        "failure_state_handling_evidence",
        "audit_expectation_evidence",
        "credential_env_boundary",
        "no_send_no_call_no_provider_boundary",
        "evidence_gap_resolution_readiness",
      ]),
    );
  });

  it("covers domain email number Twilio consent approval rollback failure audit no-send and gap evidence", () => {
    const result = getManualActivationDryRunEvidenceReview();
    const laneText = result.manualActivationDryRunEvidenceLanes
      .flatMap((lane) => [lane.lane, ...lane.evidenceFocus, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/domain checklist evidence/i);
    expect(laneText).toMatch(/SPF\/DKIM\/DMARC evidence/i);
    expect(laneText).toMatch(/business number evidence/i);
    expect(laneText).toMatch(/Twilio readiness evidence/i);
    expect(laneText).toMatch(/consent evidence/i);
    expect(laneText).toMatch(/DNC blocker evidence/i);
    expect(laneText).toMatch(/STOP\/revocation blocker evidence/i);
    expect(laneText).toMatch(/manual approval checklist/i);
    expect(laneText).toMatch(/rollback checklist evidence/i);
    expect(laneText).toMatch(/failed preflight handling/i);
    expect(laneText).toMatch(/audit field evidence/i);
    expect(laneText).toMatch(/no provider activation/i);
    expect(laneText).toMatch(/evidence gap list/i);
  });

  it("keeps provider domain mailbox number env SDK route webhook and activation flags false", () => {
    const flags = getManualActivationDryRunEvidenceReview().flags;

    expect(flags.dryRunExecutionAuthorized).toBe(false);
    expect(flags.dryRunExecutionEnabled).toBe(false);
    expect(flags.providerActivationAuthorized).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.providerSdkImported).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.mailboxCreated).toBe(false);
    expect(flags.spfDkimDmarcPublished).toBe(false);
    expect(flags.numberActivated).toBe(false);
    expect(flags.routeCreated).toBe(false);
    expect(flags.inboundWebhookCreated).toBe(false);
  });

  it("keeps outbound communication AI voice campaign queue reminder polling and runtime flags false", () => {
    const flags = getManualActivationDryRunEvidenceReview().flags;

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

  it("keeps CRM audit approval execution automation rollback go-live spend and blocker bypass flags false", () => {
    const flags = getManualActivationDryRunEvidenceReview().flags;

    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.communicationExecutionAuthorized).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.autonomousFollowUpEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.rollbackExecutionEnabled).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.dncBypassAllowed).toBe(false);
    expect(flags.optOutBypassAllowed).toBe(false);
    expect(flags.stopBypassAllowed).toBe(false);
  });

  it("keeps doctrine focused on evidence review without dry-run execution", () => {
    const result = getManualActivationDryRunEvidenceReview();
    const doctrineText = result.manualActivationDryRunEvidenceDoctrine.join(" ");

    expect(doctrineText).toMatch(/evidence-only/i);
    expect(doctrineText).toMatch(/not_authorized_for_execution/i);
    expect(doctrineText).toMatch(/Provider decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Communication decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Automation decision remains not_authorized/i);
    expect(doctrineText).toMatch(/domain\/email readiness, business number\/Twilio readiness/i);
    expect(doctrineText).toMatch(/No dry-run execution, provider activation/i);
    expect(doctrineText).toMatch(/Missing blocker evidence must stop the process/i);
    expect(doctrineText).toMatch(/AI may summarize gaps only/i);
  });

  it("summarizes no provider activation communication calling runtime audit rollback go-live or spend and includes next stage", () => {
    const result = getManualActivationDryRunEvidenceReview();
    const summary = summarizeManualActivationDryRunEvidenceReview(result);

    expect(summary).toMatch(/Dry-run decision is not_authorized_for_execution/i);
    expect(summary).toMatch(/provider decision is not_authorized/i);
    expect(summary).toMatch(/communication decision is not_authorized/i);
    expect(summary).toMatch(/automation decision is not_authorized/i);
    expect(summary).toMatch(/domain\/email checklist readiness/i);
    expect(summary).toMatch(/business number\/Twilio readiness/i);
    expect(summary).toMatch(/No dry-run execution/i);
    expect(summary).toMatch(/provider activation/i);
    expect(summary).toMatch(/outbound communication/i);
    expect(summary).toMatch(/calling/i);
    expect(summary).toMatch(/runtime job/i);
    expect(summary).toMatch(/audit writing/i);
    expect(summary).toMatch(/rollback execution/i);
    expect(summary).toMatch(/go-live/i);
    expect(summary).toMatch(/spend increase/i);
    expect(summary).toMatch(/Next stage: Activation Evidence Gap Resolution Planning/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "dryRunExecutionAuthorized",
      "dryRunExecutionEnabled",
      "providerActivationAuthorized",
      "providerActivated",
      "providerClientCreated",
      "providerEnvRead",
      "providerSdkImported",
      "twilioActivated",
      "dnsMutationEnabled",
      "domainActivated",
      "mailboxCreated",
      "spfDkimDmarcPublished",
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
      "rollbackExecutionEnabled",
      "goLiveAuthorized",
      "spendIncreaseAuthorized",
      "dncBypassAllowed",
      "optOutBypassAllowed",
      "stopBypassAllowed",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getManualActivationDryRunEvidenceReview(),
        flags: {
          ...manualActivationDryRunEvidenceReviewFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertManualActivationDryRunEvidenceReviewSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions or status drift", () => {
    const statusUnsafe = {
      ...getManualActivationDryRunEvidenceReview(),
      manualActivationDryRunEvidenceReviewStatus: "dry_run_evidence_review_required" as "planning_only",
    };
    const dryRunUnsafe = {
      ...getManualActivationDryRunEvidenceReview(),
      dryRunDecision: "authorized" as "not_authorized_for_execution",
    };
    const providerUnsafe = {
      ...getManualActivationDryRunEvidenceReview(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getManualActivationDryRunEvidenceReview(),
      communicationDecision: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getManualActivationDryRunEvidenceReview(),
      automationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertManualActivationDryRunEvidenceReviewSafe(statusUnsafe)).toThrow(/cannot become dry-run-ready/i);
    expect(() => assertManualActivationDryRunEvidenceReviewSafe(dryRunUnsafe)).toThrow(/Dry-Run decision/i);
    expect(() => assertManualActivationDryRunEvidenceReviewSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertManualActivationDryRunEvidenceReviewSafe(communicationUnsafe)).toThrow(/communication decision/i);
    expect(() => assertManualActivationDryRunEvidenceReviewSafe(automationUnsafe)).toThrow(/automation decision/i);
  });

  it("fails invariant checks if the roadmap skips evidence gap resolution planning", () => {
    const unsafeResult = {
      ...getManualActivationDryRunEvidenceReview(),
      recommendedNextExactStep: "Activate Providers" as "Activation Evidence Gap Resolution Planning",
    };

    expect(() => assertManualActivationDryRunEvidenceReviewSafe(unsafeResult)).toThrow(/Activation Evidence Gap Resolution Planning/i);
  });
});
