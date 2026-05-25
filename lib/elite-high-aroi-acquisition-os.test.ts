import {
  assertEliteHighAroiAcquisitionOsSafe,
  eliteHighAroiAcquisitionOsFlags,
  getEliteHighAroiAcquisitionOsAlignment,
  summarizeEliteHighAroiAcquisitionOs,
} from "./elite-high-aroi-acquisition-os";

describe("elite high-aROI acquisition OS alignment", () => {
  it("pins the system mode business identity market metric and next stage", () => {
    const result = getEliteHighAroiAcquisitionOsAlignment();

    expect(result.systemMode).toBe("elite_high_aroi_acquisition_os");
    expect(result.businessName).toBe("Cornerstone Property Group");
    expect(result.market).toBe("Oklahoma City, Oklahoma");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.humanRole).toBe("approval_execution_and_relationship_owner");
    expect(result.currentImmediatePhase).toBe("Phase 1 Business Foundation & Trust Infrastructure");
    expect(result.recommendedNextExactStep).toBe("Phase 1 Elite Business Foundation & Trust Infrastructure Planning");
    expect(result.nextStageRecommendation).toBe("Phase 1 Elite Business Foundation & Trust Infrastructure Planning");
  });

  it("keeps the alignment read-only advisory-only and planning-only", () => {
    const result = getEliteHighAroiAcquisitionOsAlignment();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("defines the required elite aROI principles", () => {
    const result = getEliteHighAroiAcquisitionOsAlignment();

    expect(result.eliteAroiPrinciples).toEqual(
      expect.arrayContaining([
        "maximize revenue-producing operator focus",
        "reduce lead leakage",
        "improve seller review quality",
        "improve follow-up discipline",
        "increase trust and conversion",
        "protect reputation and compliance",
        "reduce wasted actions",
        "reduce operator decision fatigue",
        "improve acquisition clarity",
        "avoid low-ROI complexity",
        "block autonomous wholesaling",
        "preserve human-approved execution",
        "preserve operational realism",
        "preserve explainability",
        "preserve deterministic behavior",
      ]),
    );
  });

  it("keeps AI assistive only and forbids autonomous wholesaling actions", () => {
    const result = getEliteHighAroiAcquisitionOsAlignment();

    expect(result.aiAllowedActions).toEqual(
      expect.arrayContaining([
        "operator leverage only",
        "prioritization assistance",
        "seller review assistance",
        "follow-up organization",
        "lead organization",
        "deal quality visibility",
        "communication safety visibility",
        "conversion support",
        "operational clarity",
        "may assist",
        "may summarize",
        "may organize",
        "may prioritize",
        "may prepare reviews",
      ]),
    );
    expect(result.aiForbiddenActions).toEqual(
      expect.arrayContaining([
        "autonomously negotiate",
        "autonomously contact sellers",
        "autonomously text",
        "autonomously call",
        "autonomously blast deals",
        "autonomously approve actions",
        "autonomously close deals",
        "autonomously activate providers",
      ]),
    );
  });

  it("keeps the human as approval communication negotiation sending contract and closing owner", () => {
    const result = getEliteHighAroiAcquisitionOsAlignment();

    expect(result.humanOwnedActions).toEqual(
      expect.arrayContaining([
        "approval owner",
        "communication owner",
        "negotiation owner",
        "relationship owner",
        "sending owner",
        "contract owner",
        "closing owner",
      ]),
    );
  });

  it("includes all 16 roadmap phases with tier purpose and operator leverage explanation", () => {
    const result = getEliteHighAroiAcquisitionOsAlignment();

    expect(result.roadmap).toHaveLength(16);
    for (const phase of result.roadmap) {
      expect(phase.name).toBeTruthy();
      expect(phase.aroiTier).toMatch(/^Tier [123]/);
      expect(phase.purpose).toBeTruthy();
      expect(phase.operatorLeverageExplanation).toBeTruthy();
    }
    expect(result.roadmap.map((phase) => phase.order)).toEqual(Array.from({ length: 16 }, (_, index) => index + 1));
  });

  it("ranks the required Tier 1 phases highest", () => {
    const result = getEliteHighAroiAcquisitionOsAlignment();
    const tierOneNames = result.roadmap.filter((phase) => phase.aroiTier === "Tier 1 - Highest aROI Leverage").map((phase) => phase.name);

    expect(tierOneNames).toEqual(
      expect.arrayContaining([
        "Business Foundation & Trust Infrastructure",
        "Lead Intake & Simple CRM",
        "Lead Prioritization Engine",
        "Seller Review & Call Prep",
        "Follow-Up Organization System",
        "Daily Acquisition Command Center",
        "KPI & Revenue Intelligence",
      ]),
    );
    expect(tierOneNames).toHaveLength(7);
  });

  it("assigns Tier 2 and Tier 3 phases according to the elite aROI ranking", () => {
    const result = getEliteHighAroiAcquisitionOsAlignment();
    const tierTwoNames = result.roadmap.filter((phase) => phase.aroiTier === "Tier 2 - High Value Support").map((phase) => phase.name);
    const tierThreeNames = result.roadmap.filter((phase) => phase.aroiTier === "Tier 3 - Deferred / Secondary").map((phase) => phase.name);

    expect(tierTwoNames).toEqual(
      expect.arrayContaining([
        "Deal Quality Intelligence",
        "AI-Assisted Lead Discovery",
        "SEO & Local Authority Engine",
        "Conversion Optimization Engine",
        "Safety & Compliance Engine",
      ]),
    );
    expect(tierThreeNames).toEqual(
      expect.arrayContaining([
        "Facebook & TikTok Acquisition Engine",
        "Design & Creative AI Agent",
        "Buyer Fit Intelligence",
        "Pentest & Security Engine",
      ]),
    );
  });

  it("includes the exact Phase 1 trust infrastructure checklist", () => {
    const result = getEliteHighAroiAcquisitionOsAlignment();

    expect(result.phase1ImmediateChecklist).toEqual([
      "J Capital Trust",
      "J Capital Holdings LLC",
      "Cornerstone Property Group LLC",
      "EIN",
      "business banking",
      "domain",
      "Google Workspace",
      "professional emails",
      "branded signatures",
      "SPF/DKIM/DMARC",
      "Twilio readiness only",
      "DNC/STOP process",
      "communication governance",
    ]);
  });

  it("keeps Twilio readiness-only and blocks live outreach or autonomous communication", () => {
    const result = getEliteHighAroiAcquisitionOsAlignment();
    const doctrineText = result.twilioReadinessDoctrine.join(" ");

    expect(doctrineText).toMatch(/readiness only/i);
    expect(doctrineText).toMatch(/NOT live activation/i);
    expect(doctrineText).toMatch(/NOT live outreach/i);
    expect(doctrineText).toMatch(/NOT autonomous communication/i);
    expect(result.flags.twilioActivated).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.outboundSmsEnabled).toBe(false);
  });

  it("keeps autonomous provider runtime go-live and approval execution flags false", () => {
    const flags = getEliteHighAroiAcquisitionOsAlignment().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.autonomousOutreachEnabled).toBe(false);
    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.autonomousTextingEnabled).toBe(false);
    expect(flags.autonomousCallingEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousBuyerHandlingEnabled).toBe(false);
    expect(flags.autonomousCampaignsEnabled).toBe(false);
    expect(flags.autonomousDealBlastingEnabled).toBe(false);
    expect(flags.autonomousApprovalAuthorityEnabled).toBe(false);
    expect(flags.providerMutationEnabled).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
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

  it("summarizes the elite high-aROI alignment and next exact stage", () => {
    const result = getEliteHighAroiAcquisitionOsAlignment();
    const summary = summarizeEliteHighAroiAcquisitionOs(result);

    expect(summary).toMatch(/elite_high_aroi_acquisition_os/i);
    expect(summary).toMatch(/acquisition_roi_per_operator_hour/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/AI is operator leverage only/i);
    expect(summary).toMatch(/human operator owns communication and execution/i);
    expect(summary).toMatch(/prioritization, seller clarity, follow-up discipline, trust, and operational focus/i);
    expect(summary).toMatch(/Twilio remains readiness only/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/Next stage: Phase 1 Elite Business Foundation & Trust Infrastructure Planning/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "providerActivated",
      "twilioActivated",
      "autonomousOutreachEnabled",
      "autonomousNegotiationEnabled",
      "autonomousTextingEnabled",
      "autonomousCallingEnabled",
      "autonomousSellerHandlingEnabled",
      "autonomousBuyerHandlingEnabled",
      "autonomousCampaignsEnabled",
      "autonomousDealBlastingEnabled",
      "autonomousApprovalAuthorityEnabled",
      "providerMutationEnabled",
      "outboundSmsEnabled",
      "outboundEmailEnabled",
      "callingEnabled",
      "aiVoiceEnabled",
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
        ...getEliteHighAroiAcquisitionOsAlignment(),
        flags: {
          ...eliteHighAroiAcquisitionOsFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertEliteHighAroiAcquisitionOsSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if core alignment drifts", () => {
    const modeUnsafe = {
      ...getEliteHighAroiAcquisitionOsAlignment(),
      systemMode: "enterprise_ai_sprawl" as "elite_high_aroi_acquisition_os",
    };
    const metricUnsafe = {
      ...getEliteHighAroiAcquisitionOsAlignment(),
      primaryMetric: "feature_count" as "acquisition_roi_per_operator_hour",
    };
    const aiUnsafe = {
      ...getEliteHighAroiAcquisitionOsAlignment(),
      aiRole: "autonomous_wholesaler" as "operator_leverage_only",
    };
    const nextUnsafe = {
      ...getEliteHighAroiAcquisitionOsAlignment(),
      nextStageRecommendation: "Provider Activation" as "Phase 1 Elite Business Foundation & Trust Infrastructure Planning",
    };

    expect(() => assertEliteHighAroiAcquisitionOsSafe(modeUnsafe)).toThrow(/elite_high_aroi_acquisition_os/i);
    expect(() => assertEliteHighAroiAcquisitionOsSafe(metricUnsafe)).toThrow(/acquisition_roi_per_operator_hour/i);
    expect(() => assertEliteHighAroiAcquisitionOsSafe(aiUnsafe)).toThrow(/operator_leverage_only/i);
    expect(() => assertEliteHighAroiAcquisitionOsSafe(nextUnsafe)).toThrow(/next stage recommendation/i);
  });
});
