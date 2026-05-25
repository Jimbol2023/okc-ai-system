import {
  activationEvidenceGapResolutionPlanningFlags,
  assertActivationEvidenceGapResolutionPlanningSafe,
  getActivationEvidenceGapResolutionPlanning,
  summarizeActivationEvidenceGapResolutionPlanning,
} from "./activation-evidence-gap-resolution-planning";

describe("activation evidence gap resolution planning", () => {
  it("creates a planning-only activation evidence gap resolution contract", () => {
    const result = getActivationEvidenceGapResolutionPlanning();

    expect(result.phase).toBe("Activation Evidence Gap Resolution Planning");
    expect(result.activationEvidenceGapResolutionPlanningStatus).toBe("planning_only");
    expect(result.gapResolutionDecision).toBe("not_authorized_for_execution");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Activation Evidence Completeness Review");
    expect(result.nextStageRecommendation).toBe("Activation Evidence Completeness Review");
  });

  it("keeps gap resolution read-only advisory-only planning-only and evidence-gap-planning-only", () => {
    const result = getActivationEvidenceGapResolutionPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.evidenceGapPlanningOnly).toBe(true);
  });

  it("keeps gap resolution provider communication and automation decisions not authorized", () => {
    const result = getActivationEvidenceGapResolutionPlanning();

    expect(result.gapResolutionDecision).toBe("not_authorized_for_execution");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.flags.gapResolutionExecutionAuthorized).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.communicationExecutionAuthorized).toBe(false);
    expect(result.flags.automationEnabled).toBe(false);
  });

  it("defines all activation evidence gap lanes", () => {
    const result = getActivationEvidenceGapResolutionPlanning();

    expect(result.activationEvidenceGapLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "llc_business_identity_evidence",
        "domain_ownership_evidence",
        "vercel_domain_connection_evidence",
        "google_workspace_email_evidence",
        "spf_dkim_dmarc_evidence",
        "email_signature_evidence",
        "twilio_number_readiness",
        "a2p_10dlc_status",
        "stop_dnc_handling_evidence",
        "manual_approval_checklist_evidence",
        "rollback_checklist_evidence",
        "internal_test_evidence",
      ]),
    );
  });

  it("maps the required real-world evidence gaps without collecting evidence", () => {
    const result = getActivationEvidenceGapResolutionPlanning();
    const laneText = result.activationEvidenceGapLanes
      .flatMap((lane) => [lane.lane, ...lane.missingEvidenceFocus, lane.blockerRule])
      .join(" ");

    expect(laneText).toMatch(/LLC record evidence/i);
    expect(laneText).toMatch(/domain ownership evidence/i);
    expect(laneText).toMatch(/Vercel domain connection evidence/i);
    expect(laneText).toMatch(/Google Workspace mailbox evidence/i);
    expect(laneText).toMatch(/SPF evidence/i);
    expect(laneText).toMatch(/DKIM evidence/i);
    expect(laneText).toMatch(/DMARC evidence/i);
    expect(laneText).toMatch(/email signature evidence/i);
    expect(laneText).toMatch(/Twilio number readiness evidence/i);
    expect(laneText).toMatch(/A2P\/10DLC status evidence/i);
    expect(laneText).toMatch(/STOP handling evidence/i);
    expect(laneText).toMatch(/DNC handling evidence/i);
    expect(laneText).toMatch(/manual approval checklist evidence/i);
    expect(laneText).toMatch(/rollback checklist evidence/i);
    expect(laneText).toMatch(/internal dry-run evidence/i);
  });

  it("keeps provider domain Vercel Google Workspace mailbox number and activation flags false", () => {
    const flags = getActivationEvidenceGapResolutionPlanning().flags;

    expect(flags.evidenceCollectionAutomationEnabled).toBe(false);
    expect(flags.gapResolutionExecutionAuthorized).toBe(false);
    expect(flags.providerActivationAuthorized).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.providerSdkImported).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.vercelDomainConnectionChanged).toBe(false);
    expect(flags.googleWorkspaceChanged).toBe(false);
    expect(flags.mailboxCreated).toBe(false);
    expect(flags.spfDkimDmarcPublished).toBe(false);
    expect(flags.emailSignatureActivated).toBe(false);
    expect(flags.numberActivated).toBe(false);
    expect(flags.a2p10DlcSubmitted).toBe(false);
  });

  it("keeps outbound communication AI voice route webhook campaign queue reminder polling and runtime flags false", () => {
    const flags = getActivationEvidenceGapResolutionPlanning().flags;

    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.emailSendingEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.routeCreated).toBe(false);
    expect(flags.inboundWebhookCreated).toBe(false);
    expect(flags.campaignActivated).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
  });

  it("keeps CRM audit approval execution automation rollback go-live spend and blocker bypass flags false", () => {
    const flags = getActivationEvidenceGapResolutionPlanning().flags;

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

  it("keeps doctrine focused on gap identification without setup or evidence automation", () => {
    const result = getActivationEvidenceGapResolutionPlanning();
    const doctrineText = result.activationEvidenceGapDoctrine.join(" ");

    expect(doctrineText).toMatch(/identifies missing evidence only/i);
    expect(doctrineText).toMatch(/not_authorized_for_execution/i);
    expect(doctrineText).toMatch(/Provider decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Communication decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Automation decision remains not_authorized/i);
    expect(doctrineText).toMatch(/not fetched, stored, verified online, or written/i);
    expect(doctrineText).toMatch(/No evidence collection automation, DNS mutation, Vercel configuration/i);
    expect(doctrineText).toMatch(/Missing LLC\/business identity/i);
    expect(doctrineText).toMatch(/AI may summarize gaps and suggest manual evidence categories only/i);
  });

  it("summarizes evidence gaps only with no activation provider communication calling runtime or go-live", () => {
    const result = getActivationEvidenceGapResolutionPlanning();
    const summary = summarizeActivationEvidenceGapResolutionPlanning(result);

    expect(summary).toMatch(/Gap resolution decision is not_authorized_for_execution/i);
    expect(summary).toMatch(/provider decision is not_authorized/i);
    expect(summary).toMatch(/communication decision is not_authorized/i);
    expect(summary).toMatch(/automation decision is not_authorized/i);
    expect(summary).toMatch(/LLC\/business identity evidence/i);
    expect(summary).toMatch(/domain ownership evidence/i);
    expect(summary).toMatch(/Vercel domain connection evidence/i);
    expect(summary).toMatch(/Google Workspace email evidence/i);
    expect(summary).toMatch(/Twilio number readiness/i);
    expect(summary).toMatch(/A2P\/10DLC status/i);
    expect(summary).toMatch(/No evidence collection automation/i);
    expect(summary).toMatch(/provider activation/i);
    expect(summary).toMatch(/outbound communication/i);
    expect(summary).toMatch(/calling/i);
    expect(summary).toMatch(/runtime job/i);
    expect(summary).toMatch(/go-live/i);
    expect(summary).toMatch(/Next stage: Activation Evidence Completeness Review/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "evidenceCollectionAutomationEnabled",
      "gapResolutionExecutionAuthorized",
      "providerActivationAuthorized",
      "providerActivated",
      "providerClientCreated",
      "providerEnvRead",
      "providerSdkImported",
      "twilioActivated",
      "dnsMutationEnabled",
      "domainActivated",
      "vercelDomainConnectionChanged",
      "googleWorkspaceChanged",
      "mailboxCreated",
      "spfDkimDmarcPublished",
      "emailSignatureActivated",
      "numberActivated",
      "a2p10DlcSubmitted",
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
        ...getActivationEvidenceGapResolutionPlanning(),
        flags: {
          ...activationEvidenceGapResolutionPlanningFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertActivationEvidenceGapResolutionPlanningSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions or status drift", () => {
    const statusUnsafe = {
      ...getActivationEvidenceGapResolutionPlanning(),
      activationEvidenceGapResolutionPlanningStatus: "evidence_gaps_identified" as "planning_only",
    };
    const gapUnsafe = {
      ...getActivationEvidenceGapResolutionPlanning(),
      gapResolutionDecision: "authorized" as "not_authorized_for_execution",
    };
    const providerUnsafe = {
      ...getActivationEvidenceGapResolutionPlanning(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getActivationEvidenceGapResolutionPlanning(),
      communicationDecision: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getActivationEvidenceGapResolutionPlanning(),
      automationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertActivationEvidenceGapResolutionPlanningSafe(statusUnsafe)).toThrow(/cannot become evidence-complete/i);
    expect(() => assertActivationEvidenceGapResolutionPlanningSafe(gapUnsafe)).toThrow(/Gap Resolution decision/i);
    expect(() => assertActivationEvidenceGapResolutionPlanningSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertActivationEvidenceGapResolutionPlanningSafe(communicationUnsafe)).toThrow(/communication decision/i);
    expect(() => assertActivationEvidenceGapResolutionPlanningSafe(automationUnsafe)).toThrow(/automation decision/i);
  });

  it("fails invariant checks if the roadmap skips evidence completeness review", () => {
    const unsafeResult = {
      ...getActivationEvidenceGapResolutionPlanning(),
      recommendedNextExactStep: "Activate Providers" as "Activation Evidence Completeness Review",
    };

    expect(() => assertActivationEvidenceGapResolutionPlanningSafe(unsafeResult)).toThrow(/Activation Evidence Completeness Review/i);
  });
});
