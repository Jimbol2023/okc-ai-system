import {
  assertEliteHighAroiPhaseTransitionEvidenceSafe,
  eliteHighAroiPhaseTransitionEvidenceFlags,
  getEliteHighAroiPhaseTransitionEvidence,
  summarizeEliteHighAroiPhaseTransitionEvidence,
} from "./elite-high-aroi-phase-transition-evidence";

describe("elite high-aROI phase transition evidence", () => {
  it("pins business market alignment metric next exact step and next stage", () => {
    const result = getEliteHighAroiPhaseTransitionEvidence();

    expect(result.businessName).toBe("Cornerstone Property Group");
    expect(result.market).toBe("Oklahoma City, Oklahoma");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.currentNextExactStep).toBe("Complete Manual Entity Formation And Identity Evidence Checklist");
    expect(result.recommendedNextExactStep).toBe("Complete Manual Entity Formation And Identity Evidence Checklist");
    expect(result.nextStageRecommendation).toBe("Activation Evidence Gap Resolution Planning");
  });

  it("keeps transition evidence read-only advisory-only and planning-only", () => {
    const result = getEliteHighAroiPhaseTransitionEvidence();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("includes all 17 phases with evidence AI role human boundary forbidden drift and next recommendation", () => {
    const phases = getEliteHighAroiPhaseTransitionEvidence().phaseTransitionMap;

    expect(phases).toHaveLength(17);
    expect(phases.map((phase) => phase.phaseNumber)).toEqual(Array.from({ length: 17 }, (_, index) => index + 1));
    for (const phase of phases) {
      expect(phase.phaseName).toBeTruthy();
      expect(phase.highAroiReason).toMatch(/trust|lead|operator|preparation|discipline|time|source|inbound|traffic|design|conversion|buyer|view|safety|security|revenue/i);
      expect(phase.requiredEvidenceBeforeMovingForward.length).toBeGreaterThan(0);
      expect(phase.humanOwnedExecutionBoundary.length).toBeGreaterThan(0);
      expect(phase.aiOperatorLeverageRole.length).toBeGreaterThan(0);
      expect(phase.blockedAutomationProviderDrift.length).toBeGreaterThan(0);
      expect(phase.nextRecommendation).toBeTruthy();
    }
  });

  it("requires Phase 1 manual entity and communication identity evidence before activation gap planning", () => {
    const result = getEliteHighAroiPhaseTransitionEvidence();
    const phase1 = result.phaseTransitionMap[0];
    const checklistText = result.phase1EvidenceChecklist.join(" ");
    const phase1EvidenceText = phase1.requiredEvidenceBeforeMovingForward.join(" ");

    expect(phase1.phaseName).toBe("Business Foundation & Trust Infrastructure");
    expect(phase1.nextRecommendation).toBe("Activation Evidence Gap Resolution Planning");
    expect(checklistText).toMatch(/entity proof/i);
    expect(checklistText).toMatch(/EIN evidence/i);
    expect(checklistText).toMatch(/banking readiness/i);
    expect(checklistText).toMatch(/domain ownership/i);
    expect(checklistText).toMatch(/Google Workspace\/email identity plan/i);
    expect(checklistText).toMatch(/SPF\/DKIM\/DMARC readiness notes/i);
    expect(checklistText).toMatch(/branded signature plan/i);
    expect(checklistText).toMatch(/Twilio readiness notes/i);
    expect(checklistText).toMatch(/A2P\/10DLC readiness notes/i);
    expect(checklistText).toMatch(/DNC\/STOP governance/i);
    expect(checklistText).toMatch(/public website\/private dashboard separation notes/i);
    expect(phase1EvidenceText).toBe(checklistText);
  });

  it("includes the full high-aROI phase sequence", () => {
    const phaseNames = getEliteHighAroiPhaseTransitionEvidence().phaseTransitionMap.map((phase) => phase.phaseName);

    expect(phaseNames).toEqual([
      "Business Foundation & Trust Infrastructure",
      "Lead Intake & Simple CRM",
      "Lead Prioritization Engine",
      "Seller Review & Call Prep",
      "Follow-Up Organization System",
      "Deal Quality Intelligence",
      "AI-Assisted Lead Discovery",
      "Virtual Driving for Dollars Intelligence Engine",
      "Facebook & TikTok Acquisition Engine",
      "SEO & Local Authority Engine",
      "Design & Creative AI Agent",
      "Conversion Optimization Engine",
      "Buyer Fit Intelligence",
      "Daily Acquisition Command Center",
      "Safety & Compliance Engine",
      "Pentest & Security Engine",
      "KPI & Revenue Intelligence",
    ]);
  });

  it("adds Virtual Driving for Dollars evidence-first boundaries after AI-assisted lead discovery", () => {
    const phases = getEliteHighAroiPhaseTransitionEvidence().phaseTransitionMap;
    const phaseNames = phases.map((phase) => phase.phaseName);
    const virtualD4d = phases.find((phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine");
    const virtualD4dText = [
      virtualD4d?.highAroiReason ?? "",
      ...(virtualD4d?.requiredEvidenceBeforeMovingForward ?? []),
      ...(virtualD4d?.humanOwnedExecutionBoundary ?? []),
      ...(virtualD4d?.aiOperatorLeverageRole ?? []),
      ...(virtualD4d?.blockedAutomationProviderDrift ?? []),
    ].join(" ");

    expect(phaseNames.indexOf("Virtual Driving for Dollars Intelligence Engine")).toBe(phaseNames.indexOf("AI-Assisted Lead Discovery") + 1);
    expect(phaseNames.indexOf("Virtual Driving for Dollars Intelligence Engine")).toBeLessThan(phaseNames.indexOf("SEO & Local Authority Engine"));
    expect(virtualD4dText).toMatch(/distressed/i);
    expect(virtualD4dText).toMatch(/approved target neighborhoods/i);
    expect(virtualD4dText).toMatch(/distress signal checklist/i);
    expect(virtualD4dText).toMatch(/lead approval criteria/i);
    expect(virtualD4dText).toMatch(/buyer-demand criteria/i);
    expect(virtualD4dText).toMatch(/DNC\/STOP governance/i);
    expect(virtualD4dText).toMatch(/public website\/private dashboard separation/i);
    expect(virtualD4dText).toMatch(/no-autonomous-scraping confirmation/i);
    expect(virtualD4dText).toMatch(/suggest neighborhoods/i);
    expect(virtualD4dText).toMatch(/verify property observations/i);
    expect(virtualD4dText).toMatch(/autonomous map scraping/i);
    expect(virtualD4dText).toMatch(/Google Street View automation/i);
    expect(virtualD4dText).toMatch(/GPS surveillance/i);
    expect(virtualD4dText).toMatch(/lead creation without human approval/i);
  });

  it("keeps provider communication automation CRM runtime autonomous DNS Vercel Twilio Google Workspace and go-live flags false", () => {
    const flags = getEliteHighAroiPhaseTransitionEvidence().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.providerActivationAuthorized).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.googleWorkspaceActivated).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.vercelMutationEnabled).toBe(false);
    expect(flags.mailboxCreated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.autonomousOutreachEnabled).toBe(false);
    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.autonomousTextingEnabled).toBe(false);
    expect(flags.autonomousCallingEnabled).toBe(false);
    expect(flags.autonomousCampaignsEnabled).toBe(false);
    expect(flags.autonomousDealBlastingEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousBuyerHandlingEnabled).toBe(false);
    expect(flags.autonomousApprovalAuthorityEnabled).toBe(false);
    expect(flags.campaignEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "providerActivated",
      "providerActivationAuthorized",
      "twilioActivated",
      "googleWorkspaceActivated",
      "domainActivated",
      "dnsMutationEnabled",
      "vercelMutationEnabled",
      "mailboxCreated",
      "outboundSmsEnabled",
      "outboundEmailEnabled",
      "callingEnabled",
      "aiVoiceEnabled",
      "autonomousOutreachEnabled",
      "autonomousNegotiationEnabled",
      "autonomousTextingEnabled",
      "autonomousCallingEnabled",
      "autonomousCampaignsEnabled",
      "autonomousDealBlastingEnabled",
      "autonomousSellerHandlingEnabled",
      "autonomousBuyerHandlingEnabled",
      "autonomousApprovalAuthorityEnabled",
      "campaignEnabled",
      "runtimeJobsEnabled",
      "pollingEnabled",
      "crmMutationEnabled",
      "automationEnabled",
      "goLiveAuthorized",
      "approvalGrantsExecution",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getEliteHighAroiPhaseTransitionEvidence(),
        flags: {
          ...eliteHighAroiPhaseTransitionEvidenceFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertEliteHighAroiPhaseTransitionEvidenceSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if next step next stage or map shape drifts", () => {
    const nextStepUnsafe = {
      ...getEliteHighAroiPhaseTransitionEvidence(),
      currentNextExactStep: "Activate Providers" as "Complete Manual Entity Formation And Identity Evidence Checklist",
    };
    const nextStageUnsafe = {
      ...getEliteHighAroiPhaseTransitionEvidence(),
      nextStageRecommendation: "Phase 2 Implementation" as "Activation Evidence Gap Resolution Planning",
    };
    const missingPhaseUnsafe = {
      ...getEliteHighAroiPhaseTransitionEvidence(),
      phaseTransitionMap: getEliteHighAroiPhaseTransitionEvidence().phaseTransitionMap.slice(0, 16),
    };

    expect(() => assertEliteHighAroiPhaseTransitionEvidenceSafe(nextStepUnsafe)).toThrow(/Complete Manual Entity Formation/i);
    expect(() => assertEliteHighAroiPhaseTransitionEvidenceSafe(nextStageUnsafe)).toThrow(/Activation Evidence Gap Resolution Planning/i);
    expect(() => assertEliteHighAroiPhaseTransitionEvidenceSafe(missingPhaseUnsafe)).toThrow(/17 phases/i);
  });

  it("summarizes high-aROI evidence-first operator leverage human-approved boundaries and next stage", () => {
    const result = getEliteHighAroiPhaseTransitionEvidence();
    const summary = summarizeEliteHighAroiPhaseTransitionEvidence(result);
    const doctrineText = result.doctrine.join(" ");

    expect(doctrineText).toMatch(/elite high-aROI evidence-first/i);
    expect(doctrineText).toMatch(/Complete Manual Entity Formation And Identity Evidence Checklist/i);
    expect(doctrineText).toMatch(/Activation Evidence Gap Resolution Planning/i);
    expect(doctrineText).toMatch(/operator leverage only/i);
    expect(doctrineText).toMatch(/No provider activation/i);
    expect(doctrineText).toMatch(/No outreach/i);
    expect(doctrineText).toMatch(/No autonomous wholesaling/i);
    expect(summary).toMatch(/elite high-aROI/i);
    expect(summary).toMatch(/evidence-first/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-approved/i);
    expect(summary).toMatch(/not activation/i);
    expect(summary).toMatch(/not outreach/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/Complete Manual Entity Formation And Identity Evidence Checklist/i);
    expect(summary).toMatch(/Activation Evidence Gap Resolution Planning/i);
  });
});
