import {
  activationEvidenceCompletenessReviewFlags,
  assertActivationEvidenceCompletenessReviewSafe,
  getActivationEvidenceCompletenessReview,
  summarizeActivationEvidenceCompletenessReview,
} from "./activation-evidence-completeness-review";

describe("activation evidence completeness review", () => {
  it("creates the pinned activation evidence completeness review contract", () => {
    const result = getActivationEvidenceCompletenessReview();

    expect(result.phase).toBe("Activation Evidence Completeness Review");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.reviewStatus).toBe("completeness_review_required");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Manual Evidence Completeness Review");
    expect(result.nextStageRecommendation).toBe("Controlled Manual Activation Readiness Planning");
  });

  it("keeps completeness review read-only advisory-only planning-only and review-only", () => {
    const result = getActivationEvidenceCompletenessReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.evidenceCompletenessReviewOnly).toBe(true);
  });

  it("defines all 16 phase completeness records in order", () => {
    const result = getActivationEvidenceCompletenessReview();

    expect(result.phaseCompletenessRecords.map((phase) => phase.phaseName)).toEqual([
      "Business Foundation & Trust Infrastructure",
      "Lead Intake & Simple CRM",
      "Lead Prioritization Engine",
      "Seller Review & Call Prep",
      "Follow-Up Organization System",
      "Daily Acquisition Command Center",
      "KPI & Revenue Intelligence",
      "Deal Quality Intelligence",
      "AI-Assisted Lead Discovery",
      "SEO & Local Authority Engine",
      "Conversion Optimization Engine",
      "Safety & Compliance Engine",
      "Facebook & TikTok Acquisition Engine",
      "Design & Creative AI Agent",
      "Buyer Fit Intelligence",
      "Pentest & Security Engine",
    ]);
  });

  it("requires every phase record to include completeness criteria and boundaries", () => {
    const result = getActivationEvidenceCompletenessReview();

    for (const phase of result.phaseCompletenessRecords) {
      const evidenceText = phase.manualEvidenceCriteria.join(" ");

      expect(evidenceText).toMatch(/evidence present/i);
      expect(evidenceText).toMatch(/evidence manually reviewed/i);
      expect(evidenceText).toMatch(/blocker status clear/i);
      expect(evidenceText).toMatch(/human approval boundary documented/i);
      expect(evidenceText).toMatch(/AI role limited to operator leverage/i);
      expect(evidenceText).toMatch(/forbidden drift still blocked/i);
      expect(evidenceText).toMatch(/no provider or communication execution/i);
      expect(phase.humanReviewBoundary).toEqual(expect.arrayContaining(["human reviews evidence completeness", "human owns go/no-go decisions"]));
      expect(phase.aiOperatorLeverageBoundary).toEqual(
        expect.arrayContaining(["summarize completeness gaps", "support operator clarity", "do not activate providers", "do not send communication"]),
      );
      expect(phase.blockerRule).toMatch(/blocks movement/i);
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.nextReviewGuidance).toMatch(/review/i);
    }
  });

  it("includes the full Phase 1 entity and communication identity completeness set", () => {
    const result = getActivationEvidenceCompletenessReview();
    const phase1 = result.phaseCompletenessRecords[0];
    const checklistText = result.phase1CompletenessChecklist.join(" ");
    const phase1Text = phase1.manualEvidenceCriteria.join(" ");

    expect(phase1.phaseName).toBe("Business Foundation & Trust Infrastructure");
    expect(checklistText).toMatch(/entity proof/i);
    expect(checklistText).toMatch(/EIN evidence/i);
    expect(checklistText).toMatch(/banking readiness/i);
    expect(checklistText).toMatch(/domain ownership/i);
    expect(checklistText).toMatch(/Google Workspace\/email identity plan/i);
    expect(checklistText).toMatch(/SPF readiness notes/i);
    expect(checklistText).toMatch(/DKIM readiness notes/i);
    expect(checklistText).toMatch(/DMARC readiness notes/i);
    expect(checklistText).toMatch(/branded signature plan/i);
    expect(checklistText).toMatch(/Twilio readiness/i);
    expect(checklistText).toMatch(/A2P\/10DLC readiness/i);
    expect(checklistText).toMatch(/DNC\/STOP governance/i);
    expect(checklistText).toMatch(/public website\/private dashboard separation/i);
    expect(phase1Text).toMatch(/entity proof/i);
    expect(phase1Text).toMatch(/Google Workspace\/email identity plan/i);
    expect(phase1Text).toMatch(/public website\/private dashboard separation/i);
  });

  it("keeps provider domain Vercel Google Workspace Twilio outbound runtime CRM automation and go-live flags false", () => {
    const flags = getActivationEvidenceCompletenessReview().flags;

    expect(flags.evidenceCollectionAutomationEnabled).toBe(false);
    expect(flags.onlineVerificationEnabled).toBe(false);
    expect(flags.storageMutationEnabled).toBe(false);
    expect(flags.completenessDecisionAuthorized).toBe(false);
    expect(flags.providerActivationAuthorized).toBe(false);
    expect(flags.providerExecutionAuthorized).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.providerSdkImported).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.vercelDomainConnectionChanged).toBe(false);
    expect(flags.vercelMutationEnabled).toBe(false);
    expect(flags.googleWorkspaceChanged).toBe(false);
    expect(flags.googleWorkspaceActivated).toBe(false);
    expect(flags.mailboxCreated).toBe(false);
    expect(flags.spfDkimDmarcPublished).toBe(false);
    expect(flags.emailSignatureActivated).toBe(false);
    expect(flags.numberActivated).toBe(false);
    expect(flags.a2p10DlcSubmitted).toBe(false);
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
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.communicationExecutionAuthorized).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.blockerBypassEnabled).toBe(false);
    expect(flags.phase2ImplementationAuthorized).toBe(false);
  });

  it("keeps doctrine focused on highest ROI evidence completeness without activation", () => {
    const result = getActivationEvidenceCompletenessReview();
    const doctrineText = result.activationEvidenceCompletenessDoctrine.join(" ");

    expect(doctrineText).toMatch(/evidence completeness review only/i);
    expect(doctrineText).toMatch(/all 16 phases/i);
    expect(doctrineText).toMatch(/Highest ROI/i);
    expect(doctrineText).toMatch(/AI remains operator leverage only/i);
    expect(doctrineText).toMatch(/human-approved/i);
    expect(doctrineText).toMatch(/Provider decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Communication decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Automation decision remains not_authorized/i);
    expect(doctrineText).toMatch(/No activation, provider execution, outreach/i);
    expect(doctrineText).toMatch(/not autonomous wholesaling/i);
    expect(doctrineText).toMatch(/Manual Evidence Completeness Review/i);
  });

  it("summarizes the completeness review boundaries and next step", () => {
    const result = getActivationEvidenceCompletenessReview();
    const summary = summarizeActivationEvidenceCompletenessReview(result);

    expect(summary).toMatch(/evidence completeness review/i);
    expect(summary).toMatch(/all 16 phases/i);
    expect(summary).toMatch(/highest ROI/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-approved/i);
    expect(summary).toMatch(/Provider decision is not_authorized/i);
    expect(summary).toMatch(/communication decision is not_authorized/i);
    expect(summary).toMatch(/automation decision is not_authorized/i);
    expect(summary).toMatch(/No activation/i);
    expect(summary).toMatch(/provider execution/i);
    expect(summary).toMatch(/outreach/i);
    expect(summary).toMatch(/automation/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/Phase 2 implementation/i);
    expect(summary).toMatch(/Manual Evidence Completeness Review/i);
    expect(summary).toMatch(/Controlled Manual Activation Readiness Planning/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const blockedFlags = [
      "evidenceCollectionAutomationEnabled",
      "onlineVerificationEnabled",
      "storageMutationEnabled",
      "completenessDecisionAuthorized",
      "providerActivationAuthorized",
      "providerExecutionAuthorized",
      "providerActivated",
      "providerClientCreated",
      "providerEnvRead",
      "providerSdkImported",
      "twilioActivated",
      "dnsMutationEnabled",
      "domainActivated",
      "vercelDomainConnectionChanged",
      "vercelMutationEnabled",
      "googleWorkspaceChanged",
      "googleWorkspaceActivated",
      "mailboxCreated",
      "spfDkimDmarcPublished",
      "emailSignatureActivated",
      "numberActivated",
      "a2p10DlcSubmitted",
      "outboundSmsEnabled",
      "outboundEmailEnabled",
      "emailSendingEnabled",
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
      "approvalGrantsExecution",
      "communicationExecutionAuthorized",
      "automationEnabled",
      "autonomousOutreachEnabled",
      "autonomousFollowUpEnabled",
      "autonomousSellerHandlingEnabled",
      "autonomousNegotiationEnabled",
      "autonomousTextingEnabled",
      "autonomousCallingEnabled",
      "autonomousCampaignsEnabled",
      "autonomousBuyerHandlingEnabled",
      "autonomousApprovalAuthorityEnabled",
      "rollbackExecutionEnabled",
      "goLiveAuthorized",
      "spendIncreaseAuthorized",
      "dncBypassAllowed",
      "optOutBypassAllowed",
      "stopBypassAllowed",
      "blockerBypassEnabled",
      "phase2ImplementationAuthorized",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getActivationEvidenceCompletenessReview(),
        flags: {
          ...activationEvidenceCompletenessReviewFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertActivationEvidenceCompletenessReviewSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if status decisions or next steps drift", () => {
    const statusUnsafe = {
      ...getActivationEvidenceCompletenessReview(),
      reviewStatus: "complete" as "completeness_review_required",
    };
    const providerUnsafe = {
      ...getActivationEvidenceCompletenessReview(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getActivationEvidenceCompletenessReview(),
      communicationDecision: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getActivationEvidenceCompletenessReview(),
      automationDecision: "authorized" as "not_authorized",
    };
    const nextStepUnsafe = {
      ...getActivationEvidenceCompletenessReview(),
      recommendedNextExactStep: "Activate Providers" as "Manual Evidence Completeness Review",
    };
    const nextStageUnsafe = {
      ...getActivationEvidenceCompletenessReview(),
      nextStageRecommendation: "Phase 2 Implementation" as "Controlled Manual Activation Readiness Planning",
    };

    expect(() => assertActivationEvidenceCompletenessReviewSafe(statusUnsafe)).toThrow(/cannot become complete/i);
    expect(() => assertActivationEvidenceCompletenessReviewSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertActivationEvidenceCompletenessReviewSafe(communicationUnsafe)).toThrow(/communication decision/i);
    expect(() => assertActivationEvidenceCompletenessReviewSafe(automationUnsafe)).toThrow(/automation decision/i);
    expect(() => assertActivationEvidenceCompletenessReviewSafe(nextStepUnsafe)).toThrow(/Manual Evidence Completeness Review/i);
    expect(() => assertActivationEvidenceCompletenessReviewSafe(nextStageUnsafe)).toThrow(/Controlled Manual Activation Readiness Planning/i);
  });

  it("fails invariant checks if the 16-phase completeness map drifts", () => {
    const missingPhase = {
      ...getActivationEvidenceCompletenessReview(),
      phaseCompletenessRecords: getActivationEvidenceCompletenessReview().phaseCompletenessRecords.slice(0, 15),
    };
    const wrongOrder = {
      ...getActivationEvidenceCompletenessReview(),
      phaseCompletenessRecords: [
        getActivationEvidenceCompletenessReview().phaseCompletenessRecords[1],
        getActivationEvidenceCompletenessReview().phaseCompletenessRecords[0],
        ...getActivationEvidenceCompletenessReview().phaseCompletenessRecords.slice(2),
      ],
    };
    const missingCriteria = {
      ...getActivationEvidenceCompletenessReview(),
      phaseCompletenessRecords: [
        {
          ...getActivationEvidenceCompletenessReview().phaseCompletenessRecords[0],
          manualEvidenceCriteria: [],
        },
        ...getActivationEvidenceCompletenessReview().phaseCompletenessRecords.slice(1),
      ],
    };

    expect(() => assertActivationEvidenceCompletenessReviewSafe(missingPhase)).toThrow(/16 phase completeness records/i);
    expect(() => assertActivationEvidenceCompletenessReviewSafe(wrongOrder)).toThrow(/required 16-phase order/i);
    expect(() => assertActivationEvidenceCompletenessReviewSafe(missingCriteria)).toThrow(/Every phase completeness record/i);
  });
});
