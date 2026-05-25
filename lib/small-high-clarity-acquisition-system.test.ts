import {
  assertSmallHighClarityAcquisitionSystemSafe,
  getSmallHighClarityAcquisitionSystem,
  smallHighClarityAcquisitionSystemFlags,
  summarizeSmallHighClarityAcquisitionSystem,
} from "./small-high-clarity-acquisition-system";

describe("small high-clarity acquisition system", () => {
  it("pins the business market mode roles metric current phase and next exact step", () => {
    const result = getSmallHighClarityAcquisitionSystem();

    expect(result.businessName).toBe("Cornerstone Property Group");
    expect(result.market).toBe("Oklahoma City, Oklahoma");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.humanRole).toBe("approval_execution_and_relationship_owner");
    expect(result.currentImmediatePhase).toBe("Phase 1 - Business Foundation & Trust Infrastructure");
    expect(result.recommendedNextExactStep).toBe("Manual Business Entity And Communication Identity Setup");
    expect(result.nextStageRecommendation).toBe("Manual Business Entity And Communication Identity Setup");
  });

  it("keeps the master roadmap read-only advisory-only and planning-only", () => {
    const result = getSmallHighClarityAcquisitionSystem();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("includes all 16 phases in order and every phase has a next recommendation", () => {
    const roadmap = getSmallHighClarityAcquisitionSystem().roadmap;

    expect(roadmap).toHaveLength(16);
    expect(roadmap.map((phase) => phase.phaseNumber)).toEqual(Array.from({ length: 16 }, (_, index) => index + 1));
    for (const phase of roadmap) {
      expect(phase.phaseName).toBeTruthy();
      expect(phase.goal).toBeTruthy();
      expect(phase.buildOrPlanningItems.length).toBeGreaterThan(0);
      expect(phase.aiRole.length).toBeGreaterThan(0);
      expect(phase.humanRole.length).toBeGreaterThan(0);
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.aroiRationale).toMatch(/operator|trust|revenue|quality|clarity|time|growth|yield|assets|money/i);
      expect(phase.nextPhaseRecommendation).toBeTruthy();
    }
  });

  it("keeps Phase 1 and Phase 16 next recommendations pinned", () => {
    const roadmap = getSmallHighClarityAcquisitionSystem().roadmap;

    expect(roadmap[0].phaseName).toBe("Business Foundation & Trust Infrastructure");
    expect(roadmap[0].nextPhaseRecommendation).toBe("Manual Business Entity And Communication Identity Setup");
    expect(roadmap[15].phaseName).toBe("KPI & Revenue Intelligence");
    expect(roadmap[15].nextPhaseRecommendation).toBe("Review KPI Evidence Before Expanding Scope");
  });

  it("includes the required roadmap phases", () => {
    const phaseNames = getSmallHighClarityAcquisitionSystem().roadmap.map((phase) => phase.phaseName);

    expect(phaseNames).toEqual([
      "Business Foundation & Trust Infrastructure",
      "Lead Intake & Simple CRM",
      "Lead Prioritization Engine",
      "Seller Review & Call Prep",
      "Follow-Up Organization System",
      "Deal Quality Intelligence",
      "AI-Assisted Lead Discovery",
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

  it("keeps AI allowed actions limited to operator leverage", () => {
    const result = getSmallHighClarityAcquisitionSystem();

    expect(result.aiAllowedActions).toEqual(
      expect.arrayContaining([
        "organize",
        "prioritize",
        "summarize",
        "prepare",
        "protect",
        "improve operational discipline",
        "reduce lead leakage",
        "improve seller review quality",
        "improve follow-up discipline",
        "improve marketing organization",
      ]),
    );
  });

  it("keeps forbidden actions focused on autonomous provider outreach scraping and skip tracing drift", () => {
    const forbiddenText = getSmallHighClarityAcquisitionSystem().aiForbiddenActions.join(" ");

    expect(forbiddenText).toMatch(/autonomous wholesaling/i);
    expect(forbiddenText).toMatch(/autonomous outreach/i);
    expect(forbiddenText).toMatch(/autonomous texting/i);
    expect(forbiddenText).toMatch(/autonomous calling/i);
    expect(forbiddenText).toMatch(/autonomous campaigns/i);
    expect(forbiddenText).toMatch(/autonomous deal blasting/i);
    expect(forbiddenText).toMatch(/autonomous seller handling/i);
    expect(forbiddenText).toMatch(/autonomous buyer handling/i);
    expect(forbiddenText).toMatch(/autonomous negotiation/i);
    expect(forbiddenText).toMatch(/provider activation/i);
    expect(forbiddenText).toMatch(/autonomous scraping/i);
    expect(forbiddenText).toMatch(/autonomous skip tracing/i);
  });

  it("keeps humans as approval review communication negotiation decision sending and closing owners", () => {
    const result = getSmallHighClarityAcquisitionSystem();

    expect(result.humanOwnedActions).toEqual(
      expect.arrayContaining([
        "approve",
        "review",
        "communicate",
        "negotiate",
        "decide",
        "send",
        "close",
        "own seller relationships",
        "own buyer relationships",
      ]),
    );
  });

  it("keeps provider communication autonomous runtime CRM campaign scraping skip tracing and go-live flags false", () => {
    const flags = getSmallHighClarityAcquisitionSystem().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.googleWorkspaceActivated).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.vercelMutationEnabled).toBe(false);
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
    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
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
      "twilioActivated",
      "googleWorkspaceActivated",
      "domainActivated",
      "dnsMutationEnabled",
      "vercelMutationEnabled",
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
      "scrapingEnabled",
      "skipTracingEnabled",
      "runtimeJobsEnabled",
      "pollingEnabled",
      "crmMutationEnabled",
      "automationEnabled",
      "goLiveAuthorized",
      "approvalGrantsExecution",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getSmallHighClarityAcquisitionSystem(),
        flags: {
          ...smallHighClarityAcquisitionSystemFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertSmallHighClarityAcquisitionSystemSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if roadmap order or next recommendations drift", () => {
    const missingPhase = {
      ...getSmallHighClarityAcquisitionSystem(),
      roadmap: getSmallHighClarityAcquisitionSystem().roadmap.slice(0, 15),
    };
    const phase1NextUnsafe = {
      ...getSmallHighClarityAcquisitionSystem(),
      roadmap: [
        {
          ...getSmallHighClarityAcquisitionSystem().roadmap[0],
          nextPhaseRecommendation: "Provider Activation",
        },
        ...getSmallHighClarityAcquisitionSystem().roadmap.slice(1),
      ],
    };
    const phase16NextUnsafe = {
      ...getSmallHighClarityAcquisitionSystem(),
      roadmap: [
        ...getSmallHighClarityAcquisitionSystem().roadmap.slice(0, 15),
        {
          ...getSmallHighClarityAcquisitionSystem().roadmap[15],
          nextPhaseRecommendation: "Autonomous Expansion",
        },
      ],
    };

    expect(() => assertSmallHighClarityAcquisitionSystemSafe(missingPhase)).toThrow(/16 phases/i);
    expect(() => assertSmallHighClarityAcquisitionSystemSafe(phase1NextUnsafe)).toThrow(/Manual Business Entity And Communication Identity Setup/i);
    expect(() => assertSmallHighClarityAcquisitionSystemSafe(phase16NextUnsafe)).toThrow(/Review KPI Evidence Before Expanding Scope/i);
  });

  it("summarizes high-clarity revenue-focused human-approved local-first operator leverage boundaries and next exact step", () => {
    const result = getSmallHighClarityAcquisitionSystem();
    const summary = summarizeSmallHighClarityAcquisitionSystem(result);
    const summaryLanguageText = result.summaryLanguage.join(" ");

    expect(summaryLanguageText).toMatch(/small high-clarity acquisition operating system/i);
    expect(summaryLanguageText).toMatch(/high-clarity, revenue-focused, human-approved, disciplined, local-first/i);
    expect(summaryLanguageText).toMatch(/AI remains operator leverage only/i);
    expect(summaryLanguageText).toMatch(/not autonomous wholesaling/i);
    expect(summaryLanguageText).toMatch(/Manual Business Entity And Communication Identity Setup/i);
    expect(summary).toMatch(/high-clarity/i);
    expect(summary).toMatch(/revenue-focused/i);
    expect(summary).toMatch(/human-approved/i);
    expect(summary).toMatch(/local-first/i);
    expect(summary).toMatch(/AI remains operator leverage only/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/Next exact step: Manual Business Entity And Communication Identity Setup/i);
  });
});
