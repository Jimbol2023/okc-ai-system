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

  it("defines all 17 elite high-aROI phase evidence gap records in order", () => {
    const result = getActivationEvidenceGapResolutionPlanning();

    expect(result.phaseEvidenceGapMap.map((phase) => phase.phaseName)).toEqual([
      "Business Foundation & Trust Infrastructure",
      "Lead Intake & Simple CRM",
      "Lead Prioritization Engine",
      "Seller Review & Call Prep",
      "Follow-Up Organization System",
      "Daily Acquisition Command Center",
      "KPI & Revenue Intelligence",
      "Deal Quality Intelligence",
      "AI-Assisted Lead Discovery",
      "Virtual Driving for Dollars Intelligence Engine",
      "SEO & Local Authority Engine",
      "Conversion Optimization Engine",
      "Safety & Compliance Engine",
      "Facebook & TikTok Acquisition Engine",
      "Design & Creative AI Agent",
      "Buyer Fit Intelligence",
      "Pentest & Security Engine",
    ]);
  });

  it("adds Virtual Driving for Dollars evidence gaps as review-only intelligence before SEO", () => {
    const result = getActivationEvidenceGapResolutionPlanning();
    const phaseNames = result.phaseEvidenceGapMap.map((phase) => phase.phaseName);
    const virtualD4d = result.phaseEvidenceGapMap.find((phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine");
    const virtualD4dText = [
      ...(virtualD4d?.evidenceGapFocus ?? []),
      ...(virtualD4d?.requiredManualEvidence ?? []),
      virtualD4d?.blockerRule ?? "",
      ...(virtualD4d?.forbiddenDrift ?? []),
      virtualD4d?.nextEvidenceReviewGuidance ?? "",
    ].join(" ");

    expect(phaseNames.indexOf("Virtual Driving for Dollars Intelligence Engine")).toBe(phaseNames.indexOf("AI-Assisted Lead Discovery") + 1);
    expect(phaseNames.indexOf("Virtual Driving for Dollars Intelligence Engine")).toBeLessThan(phaseNames.indexOf("SEO & Local Authority Engine"));
    expect(virtualD4dText).toMatch(/approved target neighborhoods/i);
    expect(virtualD4dText).toMatch(/distress signal checklist/i);
    expect(virtualD4dText).toMatch(/lead approval criteria/i);
    expect(virtualD4dText).toMatch(/buyer-demand criteria/i);
    expect(virtualD4dText).toMatch(/DNC\/STOP governance/i);
    expect(virtualD4dText).toMatch(/public website\/private dashboard separation/i);
    expect(virtualD4dText).toMatch(/no-autonomous-scraping confirmation/i);
    expect(virtualD4dText).toMatch(/map scraping/i);
    expect(virtualD4dText).toMatch(/Street View automation/i);
    expect(virtualD4dText).toMatch(/GPS surveillance/i);
    expect(virtualD4dText).toMatch(/lead creation/i);
  });

  it("requires each phase gap record to include manual evidence blocker AI role human boundary forbidden drift and next guidance", () => {
    const result = getActivationEvidenceGapResolutionPlanning();

    for (const phase of result.phaseEvidenceGapMap) {
      expect(phase.evidenceGapFocus.length).toBeGreaterThan(0);
      expect(phase.requiredManualEvidence.length).toBeGreaterThan(0);
      expect(phase.blockerRule).toMatch(/block/i);
      expect(phase.aiGapSummaryRole).toEqual(
        expect.arrayContaining([
          "gap summarization",
          "missing evidence visibility",
          "manual review organization",
          "evidence-readiness explanation",
          "operator clarity support",
        ]),
      );
      expect(phase.humanApprovalExecutionBoundary).toEqual(
        expect.arrayContaining([
          "entity formation",
          "evidence collection",
          "evidence review",
          "provider approval",
          "communication approval",
          "outreach approval",
          "negotiation",
          "sending",
          "contracts",
          "closing",
          "go/no-go decisions",
        ]),
      );
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.nextEvidenceReviewGuidance).toMatch(/evidence/i);
    }
  });

  it("strengthens Phase 1 with the full manual entity and communication identity evidence set", () => {
    const result = getActivationEvidenceGapResolutionPlanning();
    const phase1 = result.phaseEvidenceGapMap[0];
    const evidenceText = phase1.requiredManualEvidence.join(" ");

    expect(phase1.phaseName).toBe("Business Foundation & Trust Infrastructure");
    expect(evidenceText).toMatch(/entity proof/i);
    expect(evidenceText).toMatch(/EIN evidence/i);
    expect(evidenceText).toMatch(/banking readiness/i);
    expect(evidenceText).toMatch(/domain ownership/i);
    expect(evidenceText).toMatch(/Google Workspace\/email identity plan/i);
    expect(evidenceText).toMatch(/SPF readiness notes/i);
    expect(evidenceText).toMatch(/DKIM readiness notes/i);
    expect(evidenceText).toMatch(/DMARC readiness notes/i);
    expect(evidenceText).toMatch(/branded signature plan/i);
    expect(evidenceText).toMatch(/Twilio readiness notes/i);
    expect(evidenceText).toMatch(/A2P\/10DLC readiness notes/i);
    expect(evidenceText).toMatch(/DNC\/STOP governance/i);
    expect(evidenceText).toMatch(/public website\/private dashboard separation/i);
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
    expect(flags.vercelMutationEnabled).toBe(false);
    expect(flags.googleWorkspaceChanged).toBe(false);
    expect(flags.googleWorkspaceActivated).toBe(false);
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
    expect(flags.autonomousOutreachEnabled).toBe(false);
    expect(flags.autonomousFollowUpEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.autonomousTextingEnabled).toBe(false);
    expect(flags.autonomousCallingEnabled).toBe(false);
    expect(flags.autonomousCampaignsEnabled).toBe(false);
    expect(flags.autonomousBuyerHandlingEnabled).toBe(false);
    expect(flags.autonomousApprovalAuthorityEnabled).toBe(false);
    expect(flags.rollbackExecutionEnabled).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.dncBypassAllowed).toBe(false);
    expect(flags.optOutBypassAllowed).toBe(false);
    expect(flags.stopBypassAllowed).toBe(false);
    expect(flags.blockerBypassEnabled).toBe(false);
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
    expect(doctrineText).toMatch(/evidence-gap planning layer for all 17/i);
    expect(doctrineText).toMatch(/gap summarization, missing evidence visibility, manual review organization/i);
    expect(doctrineText).toMatch(/AI cannot collect evidence automatically/i);
    expect(doctrineText).toMatch(/All phase movement remains human-approved/i);
  });

  it("summarizes evidence gaps only with no activation provider communication calling runtime or go-live", () => {
    const result = getActivationEvidenceGapResolutionPlanning();
    const summary = summarizeActivationEvidenceGapResolutionPlanning(result);

    expect(summary).toMatch(/Gap resolution decision is not_authorized_for_execution/i);
    expect(summary).toMatch(/evidence-gap planning for all 17 phases/i);
    expect(summary).toMatch(/Virtual Driving for Dollars evidence/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-approved movement/i);
    expect(summary).toMatch(/no Phase 2 implementation/i);
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
    expect(summary).toMatch(/No activation/i);
    expect(summary).toMatch(/provider execution/i);
    expect(summary).toMatch(/outreach/i);
    expect(summary).toMatch(/automation/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
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
      "autonomousOutreachEnabled",
      "autonomousFollowUpEnabled",
      "autonomousSellerHandlingEnabled",
      "rollbackExecutionEnabled",
      "autonomousTextingEnabled",
      "autonomousCallingEnabled",
      "autonomousCampaignsEnabled",
      "autonomousBuyerHandlingEnabled",
      "autonomousApprovalAuthorityEnabled",
      "goLiveAuthorized",
      "spendIncreaseAuthorized",
      "dncBypassAllowed",
      "optOutBypassAllowed",
      "stopBypassAllowed",
      "blockerBypassEnabled",
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

  it("fails invariant checks if the 16-phase evidence gap map drifts", () => {
    const missingPhase = {
      ...getActivationEvidenceGapResolutionPlanning(),
      phaseEvidenceGapMap: getActivationEvidenceGapResolutionPlanning().phaseEvidenceGapMap.slice(0, 16),
    };
    const wrongOrder = {
      ...getActivationEvidenceGapResolutionPlanning(),
      phaseEvidenceGapMap: [
        getActivationEvidenceGapResolutionPlanning().phaseEvidenceGapMap[1],
        getActivationEvidenceGapResolutionPlanning().phaseEvidenceGapMap[0],
        ...getActivationEvidenceGapResolutionPlanning().phaseEvidenceGapMap.slice(2),
      ],
    };
    const missingRecordFields = {
      ...getActivationEvidenceGapResolutionPlanning(),
      phaseEvidenceGapMap: [
        {
          ...getActivationEvidenceGapResolutionPlanning().phaseEvidenceGapMap[0],
          requiredManualEvidence: [],
        },
        ...getActivationEvidenceGapResolutionPlanning().phaseEvidenceGapMap.slice(1),
      ],
    };

    expect(() => assertActivationEvidenceGapResolutionPlanningSafe(missingPhase)).toThrow(/17 phase evidence gap records/i);
    expect(() => assertActivationEvidenceGapResolutionPlanningSafe(wrongOrder)).toThrow(/required 16-phase order/i);
    expect(() => assertActivationEvidenceGapResolutionPlanningSafe(missingRecordFields)).toThrow(/Every phase evidence gap record/i);
  });
});
