import {
  assertControlledManualActivationReadinessPlanningSafe,
  controlledManualActivationReadinessPlanningFlags,
  getControlledManualActivationReadinessPlanning,
  summarizeControlledManualActivationReadinessPlanning,
} from "./controlled-manual-activation-readiness-planning";

describe("controlled manual activation readiness planning", () => {
  it("creates the pinned controlled manual activation readiness planning contract", () => {
    const result = getControlledManualActivationReadinessPlanning();

    expect(result.phase).toBe("Controlled Manual Activation Readiness Planning");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.readinessStatus).toBe("manual_activation_readiness_planning_required");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Manual Activation Readiness Checklist Review");
    expect(result.nextStageRecommendation).toBe("Human Go No-Go Readiness Decision Planning");
  });

  it("keeps readiness planning read-only advisory-only planning-only and manual-readiness-only", () => {
    const result = getControlledManualActivationReadinessPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.manualActivationReadinessPlanningOnly).toBe(true);
  });

  it("includes the required controlled readiness lanes", () => {
    const result = getControlledManualActivationReadinessPlanning();
    const laneNames = result.controlledReadinessLanes.map((lane) => lane.lane);
    const laneText = result.controlledReadinessLanes.flatMap((lane) => [lane.lane, ...lane.manualReadinessFocus, lane.readinessBlockerRule]).join(" ");

    expect(laneNames).toEqual([
      "business_identity",
      "domain_dns_notes",
      "public_website_private_dashboard_separation",
      "google_workspace_email_identity",
      "spf_dkim_dmarc_notes",
      "twilio_readiness",
      "a2p_10dlc_readiness",
      "dnc_stop_governance",
      "manual_approval_process",
      "rollback_stop_procedure",
      "internal_dry_run_plan",
      "human_go_no_go_criteria",
    ]);
    expect(laneText).toMatch(/business identity/i);
    expect(laneText).toMatch(/domain and DNS/i);
    expect(laneText).toMatch(/public website stays marketing-only/i);
    expect(laneText).toMatch(/Google Workspace/i);
    expect(laneText).toMatch(/SPF/i);
    expect(laneText).toMatch(/DKIM/i);
    expect(laneText).toMatch(/DMARC/i);
    expect(laneText).toMatch(/Twilio readiness/i);
    expect(laneText).toMatch(/A2P\/10DLC/i);
    expect(laneText).toMatch(/DNC/i);
    expect(laneText).toMatch(/STOP/i);
    expect(laneText).toMatch(/approval does not execute/i);
    expect(laneText).toMatch(/manual stop procedure/i);
    expect(laneText).toMatch(/no-send dry-run/i);
    expect(laneText).toMatch(/go\/no-go criteria/i);
  });

  it("defines all 17 phase readiness records in order", () => {
    const result = getControlledManualActivationReadinessPlanning();

    expect(result.phaseReadinessRecords.map((phase) => phase.phaseName)).toEqual([
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

  it("adds Virtual Driving for Dollars readiness as review-only intelligence before SEO", () => {
    const result = getControlledManualActivationReadinessPlanning();
    const phaseNames = result.phaseReadinessRecords.map((phase) => phase.phaseName);
    const virtualD4d = result.phaseReadinessRecords.find((phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine");
    const virtualD4dText = [
      ...(virtualD4d?.readinessPrerequisites ?? []),
      ...(virtualD4d?.blockedDrift ?? []),
      virtualD4d?.nextReadinessGuidance ?? "",
    ].join(" ");

    expect(phaseNames.indexOf("Virtual Driving for Dollars Intelligence Engine")).toBe(phaseNames.indexOf("AI-Assisted Lead Discovery") + 1);
    expect(phaseNames.indexOf("Virtual Driving for Dollars Intelligence Engine")).toBeLessThan(phaseNames.indexOf("SEO & Local Authority Engine"));
    expect(virtualD4dText).toMatch(/approved target neighborhoods/i);
    expect(virtualD4dText).toMatch(/distress signal checklist/i);
    expect(virtualD4dText).toMatch(/lead approval criteria/i);
    expect(virtualD4dText).toMatch(/buyer-demand criteria/i);
    expect(virtualD4dText).toMatch(/DNC\/STOP governance/i);
    expect(virtualD4dText).toMatch(/public\/private separation/i);
    expect(virtualD4dText).toMatch(/no-autonomous-scraping confirmation/i);
    expect(virtualD4dText).toMatch(/map scraping/i);
    expect(virtualD4dText).toMatch(/Street View automation/i);
    expect(virtualD4dText).toMatch(/GPS surveillance/i);
  });

  it("requires every phase readiness record to include prerequisites boundaries blocked drift and no-execution guidance", () => {
    const result = getControlledManualActivationReadinessPlanning();

    for (const phase of result.phaseReadinessRecords) {
      const prerequisiteText = phase.readinessPrerequisites.join(" ");

      expect(prerequisiteText).toMatch(/evidence completeness confirmed/i);
      expect(prerequisiteText).toMatch(/human approval boundary documented/i);
      expect(prerequisiteText).toMatch(/AI role limited to operator leverage/i);
      expect(prerequisiteText).toMatch(/blocked drift remains blocked/i);
      expect(prerequisiteText).toMatch(/no execution authorized/i);
      expect(phase.humanApprovalBoundary).toEqual(expect.arrayContaining(["human reviews readiness checklist", "human owns go/no-go decisions"]));
      expect(phase.aiOperatorLeverageRole).toEqual(
        expect.arrayContaining(["organize readiness prerequisites", "support operator clarity", "do not activate providers", "do not send communication"]),
      );
      expect(phase.blockedDrift.length).toBeGreaterThan(0);
      expect(phase.noExecutionRule).toMatch(/cannot activate providers/i);
      expect(phase.noExecutionRule).toMatch(/cannot.*implement Phase 2/i);
      expect(phase.nextReadinessGuidance).toMatch(/review/i);
    }
  });

  it("keeps provider clients env DNS Vercel Google Workspace Twilio outbound runtime CRM automation campaigns and go-live flags false", () => {
    const flags = getControlledManualActivationReadinessPlanning().flags;

    expect(flags.evidenceCollectionAutomationEnabled).toBe(false);
    expect(flags.onlineVerificationEnabled).toBe(false);
    expect(flags.storageMutationEnabled).toBe(false);
    expect(flags.readinessDecisionAuthorized).toBe(false);
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
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.emailSendingEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.campaignActivated).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousBuyerHandlingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.blockerBypassEnabled).toBe(false);
    expect(flags.phase2ImplementationAuthorized).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes controlled manual readiness planning without activation or Phase 2 implementation", () => {
    const result = getControlledManualActivationReadinessPlanning();
    const summary = summarizeControlledManualActivationReadinessPlanning(result);

    expect(summary).toMatch(/controlled manual activation readiness planning/i);
    expect(summary).toMatch(/all 17 phases/i);
    expect(summary).toMatch(/Virtual Driving for Dollars review-only intelligence/i);
    expect(summary).toMatch(/highest ROI/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-approved/i);
    expect(summary).toMatch(/No activation/i);
    expect(summary).toMatch(/provider execution/i);
    expect(summary).toMatch(/outreach/i);
    expect(summary).toMatch(/automation/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/Phase 2 implementation/i);
    expect(summary).toMatch(/Manual Activation Readiness Checklist Review/i);
    expect(summary).toMatch(/Human Go No-Go Readiness Decision Planning/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const blockedFlags = [
      "evidenceCollectionAutomationEnabled",
      "onlineVerificationEnabled",
      "storageMutationEnabled",
      "readinessDecisionAuthorized",
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
        ...getControlledManualActivationReadinessPlanning(),
        flags: {
          ...controlledManualActivationReadinessPlanningFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertControlledManualActivationReadinessPlanningSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if pinned fields or readiness records drift", () => {
    const statusUnsafe = {
      ...getControlledManualActivationReadinessPlanning(),
      readinessStatus: "activation_ready" as "manual_activation_readiness_planning_required",
    };
    const providerUnsafe = {
      ...getControlledManualActivationReadinessPlanning(),
      providerDecision: "authorized" as "not_authorized",
    };
    const missingPhase = {
      ...getControlledManualActivationReadinessPlanning(),
      phaseReadinessRecords: getControlledManualActivationReadinessPlanning().phaseReadinessRecords.slice(0, 16),
    };
    const wrongOrder = {
      ...getControlledManualActivationReadinessPlanning(),
      phaseReadinessRecords: [
        getControlledManualActivationReadinessPlanning().phaseReadinessRecords[1],
        getControlledManualActivationReadinessPlanning().phaseReadinessRecords[0],
        ...getControlledManualActivationReadinessPlanning().phaseReadinessRecords.slice(2),
      ],
    };
    const missingGuidance = {
      ...getControlledManualActivationReadinessPlanning(),
      phaseReadinessRecords: [
        {
          ...getControlledManualActivationReadinessPlanning().phaseReadinessRecords[0],
          noExecutionRule: "",
        },
        ...getControlledManualActivationReadinessPlanning().phaseReadinessRecords.slice(1),
      ],
    };
    const nextStepUnsafe = {
      ...getControlledManualActivationReadinessPlanning(),
      recommendedNextExactStep: "Activate Providers" as "Manual Activation Readiness Checklist Review",
    };
    const nextStageUnsafe = {
      ...getControlledManualActivationReadinessPlanning(),
      nextStageRecommendation: "Go Live" as "Human Go No-Go Readiness Decision Planning",
    };

    expect(() => assertControlledManualActivationReadinessPlanningSafe(statusUnsafe)).toThrow(/cannot become activation-ready/i);
    expect(() => assertControlledManualActivationReadinessPlanningSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertControlledManualActivationReadinessPlanningSafe(missingPhase)).toThrow(/17 phase readiness records/i);
    expect(() => assertControlledManualActivationReadinessPlanningSafe(wrongOrder)).toThrow(/required 16-phase order/i);
    expect(() => assertControlledManualActivationReadinessPlanningSafe(missingGuidance)).toThrow(/Every phase readiness record/i);
    expect(() => assertControlledManualActivationReadinessPlanningSafe(nextStepUnsafe)).toThrow(/Manual Activation Readiness Checklist Review/i);
    expect(() => assertControlledManualActivationReadinessPlanningSafe(nextStageUnsafe)).toThrow(/Human Go No-Go Readiness Decision Planning/i);
  });
});
