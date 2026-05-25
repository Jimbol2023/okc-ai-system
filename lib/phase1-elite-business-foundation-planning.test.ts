import {
  assertPhase1EliteBusinessFoundationPlanningSafe,
  getPhase1EliteBusinessFoundationPlanning,
  phase1EliteBusinessFoundationPlanningFlags,
  summarizePhase1EliteBusinessFoundationPlanning,
} from "./phase1-elite-business-foundation-planning";

describe("phase 1 elite business foundation planning", () => {
  it("pins the Phase 1 identity status metric and next exact step", () => {
    const result = getPhase1EliteBusinessFoundationPlanning();

    expect(result.phase).toBe("phase1_elite_business_foundation_trust_infrastructure_planning");
    expect(result.businessName).toBe("Cornerstone Property Group");
    expect(result.market).toBe("Oklahoma City, Oklahoma");
    expect(result.planningMode).toBe("read_only_advisory_planning");
    expect(result.foundationStatus).toBe("planning_incomplete");
    expect(result.providerStatus).toBe("not_activated");
    expect(result.communicationStatus).toBe("not_authorized");
    expect(result.automationStatus).toBe("blocked");
    expect(result.currentPriority).toBe("business_trust_and_identity_foundation");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.recommendedNextExactStep).toBe("Manual Business Entity And Communication Identity Setup");
    expect(result.nextStageRecommendation).toBe("Manual Business Entity And Communication Identity Setup");
  });

  it("keeps Phase 1 read-only advisory-only and planning-only", () => {
    const result = getPhase1EliteBusinessFoundationPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("includes the exact business foundation checklist", () => {
    const result = getPhase1EliteBusinessFoundationPlanning();

    expect(result.businessFoundationChecklist).toEqual([
      "J Capital Trust",
      "J Capital Holdings LLC",
      "Cornerstone Property Group LLC",
      "EIN",
      "business banking",
      "domain purchase",
      "domain verification readiness",
      "Vercel domain connection planning",
      "Google Workspace planning",
      "professional emails",
      "branded signatures",
      "SPF readiness",
      "DKIM readiness",
      "DMARC readiness",
      "Twilio readiness only",
      "A2P/10DLC readiness planning",
      "DNC/STOP governance",
      "communication governance",
      "seller trust infrastructure",
      "local brand authority planning",
    ]);
  });

  it("covers LLC structure EIN banking domain Vercel Google Workspace email signatures authentication Twilio A2P and DNC STOP planning", () => {
    const checklistText = getPhase1EliteBusinessFoundationPlanning().businessFoundationChecklist.join(" ");

    expect(checklistText).toMatch(/J Capital Holdings LLC/i);
    expect(checklistText).toMatch(/Cornerstone Property Group LLC/i);
    expect(checklistText).toMatch(/EIN/i);
    expect(checklistText).toMatch(/business banking/i);
    expect(checklistText).toMatch(/domain purchase/i);
    expect(checklistText).toMatch(/Vercel domain connection planning/i);
    expect(checklistText).toMatch(/Google Workspace planning/i);
    expect(checklistText).toMatch(/professional emails/i);
    expect(checklistText).toMatch(/branded signatures/i);
    expect(checklistText).toMatch(/SPF readiness/i);
    expect(checklistText).toMatch(/DKIM readiness/i);
    expect(checklistText).toMatch(/DMARC readiness/i);
    expect(checklistText).toMatch(/Twilio readiness only/i);
    expect(checklistText).toMatch(/A2P\/10DLC readiness planning/i);
    expect(checklistText).toMatch(/DNC\/STOP governance/i);
  });

  it("defines public website and private dashboard separation planning", () => {
    const result = getPhase1EliteBusinessFoundationPlanning();
    const surfaces = result.websiteDashboardSecurityDirection;

    expect(surfaces.map((surface) => surface.surface)).toEqual(expect.arrayContaining(["public_website", "private_dashboard"]));
    expect(surfaces.every((surface) => surface.planningOnly)).toBe(true);
    expect(surfaces.every((surface) => surface.implementationAuthorized === false)).toBe(true);
    expect(surfaces.every((surface) => surface.deploymentAuthorized === false)).toBe(true);
  });

  it("keeps the public website marketing-only with no operator CRM access or internal lead visibility", () => {
    const publicWebsite = getPhase1EliteBusinessFoundationPlanning().websiteDashboardSecurityDirection.find(
      (surface) => surface.surface === "public_website",
    );
    const publicWebsiteText = [...(publicWebsite?.purpose ?? []), ...(publicWebsite?.mustRemain ?? [])].join(" ");

    expect(publicWebsite?.example).toBe("cornerstonepropertygroup.com");
    expect(publicWebsiteText).toMatch(/SEO/i);
    expect(publicWebsiteText).toMatch(/seller education/i);
    expect(publicWebsiteText).toMatch(/inbound seller leads/i);
    expect(publicWebsiteText).toMatch(/lead forms/i);
    expect(publicWebsiteText).toMatch(/trust pages/i);
    expect(publicWebsiteText).toMatch(/public-facing only/i);
    expect(publicWebsiteText).toMatch(/no operator CRM access/i);
    expect(publicWebsiteText).toMatch(/no internal lead visibility/i);
    expect(publicWebsiteText).toMatch(/marketing-only/i);
  });

  it("keeps the dashboard authenticated protected private and separated from public marketing surfaces", () => {
    const privateDashboard = getPhase1EliteBusinessFoundationPlanning().websiteDashboardSecurityDirection.find(
      (surface) => surface.surface === "private_dashboard",
    );
    const privateDashboardText = [...(privateDashboard?.purpose ?? []), ...(privateDashboard?.mustRemain ?? [])].join(" ");

    expect(privateDashboard?.example).toBe("app.cornerstonepropertygroup.com");
    expect(privateDashboardText).toMatch(/operator CRM/i);
    expect(privateDashboardText).toMatch(/prioritization/i);
    expect(privateDashboardText).toMatch(/follow-up organization/i);
    expect(privateDashboardText).toMatch(/seller review/i);
    expect(privateDashboardText).toMatch(/KPI intelligence/i);
    expect(privateDashboardText).toMatch(/acquisition command center/i);
    expect(privateDashboardText).toMatch(/authenticated/i);
    expect(privateDashboardText).toMatch(/protected/i);
    expect(privateDashboardText).toMatch(/private/i);
    expect(privateDashboardText).toMatch(/separated from public marketing surfaces/i);
  });

  it("defines the required trust infrastructure principles", () => {
    const result = getPhase1EliteBusinessFoundationPlanning();

    expect(result.trustInfrastructurePrinciples).toEqual(
      expect.arrayContaining([
        "local trust matters more than feature count",
        "communication reputation is an acquisition asset",
        "professional identity increases seller conversion",
        "trust infrastructure improves inbound lead quality",
        "clear branding reduces seller skepticism",
        "disciplined communication reduces long-term risk",
        "operator clarity improves acquisition ROI",
        "high-aROI systems avoid low-value complexity",
        "operational focus beats feature sprawl",
      ]),
    );
  });

  it("keeps Twilio readiness-only and blocks activation texting calling campaigns and autonomous communication", () => {
    const result = getPhase1EliteBusinessFoundationPlanning();
    const doctrineText = result.twilioDoctrine.join(" ");

    expect(doctrineText).toMatch(/readiness only/i);
    expect(doctrineText).toMatch(/NOT activated/i);
    expect(doctrineText).toMatch(/NOT authorized for live texting/i);
    expect(doctrineText).toMatch(/NOT authorized for live calling/i);
    expect(doctrineText).toMatch(/NOT authorized for campaigns/i);
    expect(doctrineText).toMatch(/NOT autonomous communication/i);
    expect(result.flags.twilioActivated).toBe(false);
    expect(result.flags.outboundSmsEnabled).toBe(false);
    expect(result.flags.callingEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
  });

  it("keeps Google Workspace and email planning blocked from mailbox DNS sending automation and provider activation", () => {
    const result = getPhase1EliteBusinessFoundationPlanning();
    const doctrineText = result.googleWorkspaceEmailDoctrine.join(" ");

    expect(doctrineText).toMatch(/acquisitions@/i);
    expect(doctrineText).toMatch(/offers@/i);
    expect(doctrineText).toMatch(/support@/i);
    expect(doctrineText).toMatch(/operations@/i);
    expect(doctrineText).toMatch(/review@/i);
    expect(doctrineText).toMatch(/No live mailbox creation/i);
    expect(doctrineText).toMatch(/No DNS mutation/i);
    expect(doctrineText).toMatch(/No email sending/i);
    expect(doctrineText).toMatch(/No outbound automation/i);
    expect(doctrineText).toMatch(/No provider activation/i);
    expect(result.flags.googleWorkspaceActivated).toBe(false);
    expect(result.flags.dnsMutationEnabled).toBe(false);
    expect(result.flags.outboundEmailEnabled).toBe(false);
  });

  it("keeps all autonomous provider runtime CRM and go-live flags false", () => {
    const flags = getPhase1EliteBusinessFoundationPlanning().flags;

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
        ...getPhase1EliteBusinessFoundationPlanning(),
        flags: {
          ...phase1EliteBusinessFoundationPlanningFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertPhase1EliteBusinessFoundationPlanningSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if pinned statuses drift", () => {
    const providerUnsafe = {
      ...getPhase1EliteBusinessFoundationPlanning(),
      providerStatus: "activated" as "not_activated",
    };
    const communicationUnsafe = {
      ...getPhase1EliteBusinessFoundationPlanning(),
      communicationStatus: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getPhase1EliteBusinessFoundationPlanning(),
      automationStatus: "enabled" as "blocked",
    };
    const nextUnsafe = {
      ...getPhase1EliteBusinessFoundationPlanning(),
      recommendedNextExactStep: "Provider Activation" as "Manual Business Entity And Communication Identity Setup",
    };

    expect(() => assertPhase1EliteBusinessFoundationPlanningSafe(providerUnsafe)).toThrow(/provider status/i);
    expect(() => assertPhase1EliteBusinessFoundationPlanningSafe(communicationUnsafe)).toThrow(/communication status/i);
    expect(() => assertPhase1EliteBusinessFoundationPlanningSafe(automationUnsafe)).toThrow(/automation status/i);
    expect(() => assertPhase1EliteBusinessFoundationPlanningSafe(nextUnsafe)).toThrow(/Manual Business Entity And Communication Identity Setup/i);
  });

  it("summarizes planning-only boundaries and next exact step", () => {
    const result = getPhase1EliteBusinessFoundationPlanning();
    const summary = summarizePhase1EliteBusinessFoundationPlanning(result);
    const summaryLanguageText = result.summaryLanguage.join(" ");

    expect(summaryLanguageText).toMatch(/this phase is planning only/i);
    expect(summaryLanguageText).toMatch(/does not authorize provider activation/i);
    expect(summaryLanguageText).toMatch(/does not authorize outreach/i);
    expect(summaryLanguageText).toMatch(/does not authorize live communication/i);
    expect(summaryLanguageText).toMatch(/does not authorize automation/i);
    expect(summaryLanguageText).toMatch(/not autonomous wholesaling/i);
    expect(summaryLanguageText).toMatch(/operator leverage only/i);
    expect(summaryLanguageText).toMatch(/humans retain communication and execution authority/i);
    expect(summary).toMatch(/planning only/i);
    expect(summary).toMatch(/does not authorize provider activation/i);
    expect(summary).toMatch(/outreach/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/AI remains operator leverage only/i);
    expect(summary).toMatch(/Manual Business Entity And Communication Identity Setup/i);
  });
});
