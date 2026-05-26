import {
  assertManualActivationReadinessChecklistReviewSafe,
  getManualActivationReadinessChecklistReview,
  manualActivationReadinessChecklistReviewFlags,
  summarizeManualActivationReadinessChecklistReview,
} from "./manual-activation-readiness-checklist-review";

describe("manual activation readiness checklist review", () => {
  it("creates the pinned manual activation readiness checklist review contract", () => {
    const result = getManualActivationReadinessChecklistReview();

    expect(result.phase).toBe("Manual Activation Readiness Checklist Review");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.checklistReviewStatus).toBe("manual_checklist_review_required");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Complete Manual Activation Readiness Checklist Review");
    expect(result.nextStageRecommendation).toBe("Human Go No-Go Readiness Decision Planning");
  });

  it("keeps checklist review read-only advisory-only planning-only and manual-checklist-only", () => {
    const result = getManualActivationReadinessChecklistReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.manualChecklistReviewOnly).toBe(true);
  });

  it("includes all required checklist sections with the required shape", () => {
    const result = getManualActivationReadinessChecklistReview();

    expect(result.checklistSections.map((section) => section.sectionName)).toEqual([
      "business identity",
      "domain/DNS notes",
      "public website/private dashboard separation",
      "Google Workspace/email identity",
      "SPF/DKIM/DMARC notes",
      "Twilio readiness",
      "A2P/10DLC readiness",
      "DNC/STOP governance",
      "manual approval process",
      "rollback/stop procedure",
      "internal dry-run plan",
      "human go/no-go criteria",
    ]);

    for (const section of result.checklistSections) {
      expect(section.manualReviewRequirement).toMatch(/manually reviewed/i);
      expect(section.requiredEvidence.length).toBeGreaterThan(0);
      expect(section.blockerIfMissing).toMatch(/blocks movement/i);
      expect(section.aiRole).toEqual(
        expect.arrayContaining(["organize checklist review", "summarize missing readiness items", "explain blockers", "support operator clarity", "help prepare manual review"]),
      );
      expect(section.humanOwner).toEqual(
        expect.arrayContaining(["business evidence review", "provider decisions", "go/no-go judgment"]),
      );
      expect(section.noExecutionRule).toMatch(/cannot activate providers/i);
      expect(section.noExecutionRule).toMatch(/implement Phase 2/i);
    }
  });

  it("defines all 17 phase checklist records in order", () => {
    const result = getManualActivationReadinessChecklistReview();

    expect(result.phaseChecklistRecords.map((phase) => phase.phaseName)).toEqual([
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

  it("adds Virtual Driving for Dollars checklist review as no-drift intelligence before SEO", () => {
    const result = getManualActivationReadinessChecklistReview();
    const phaseNames = result.phaseChecklistRecords.map((phase) => phase.phaseName);
    const virtualD4d = result.phaseChecklistRecords.find((phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine");
    const virtualD4dText = [
      ...(virtualD4d?.manualReviewCriteria ?? []),
      ...(virtualD4d?.forbiddenDrift ?? []),
      virtualD4d?.noExecutionGuidance ?? "",
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
    expect(virtualD4dText).toMatch(/lead creation without human approval/i);
  });

  it("requires every phase record to include review criteria boundaries blocker status drift and no-execution guidance", () => {
    const result = getManualActivationReadinessChecklistReview();

    for (const phase of result.phaseChecklistRecords) {
      expect(phase.manualReviewCriteria.length).toBeGreaterThan(0);
      expect(phase.manualReviewCriteria.join(" ")).toMatch(/manual checklist review completed/i);
      expect(phase.evidenceCompleteRequirement).toMatch(/evidence must be complete/i);
      expect(phase.blockerStatusRequirement).toMatch(/blocker status/i);
      expect(phase.humanApprovalBoundary).toEqual(
        expect.arrayContaining(["human reviews checklist evidence", "human owns approval decisions", "human owns go/no-go judgment"]),
      );
      expect(phase.aiOperatorLeverageBoundary).toEqual(
        expect.arrayContaining(["organize checklist review", "support operator clarity", "do not activate providers", "do not trigger runtime jobs"]),
      );
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.noExecutionGuidance).toMatch(/does not authorize activation/i);
      expect(phase.noExecutionGuidance).toMatch(/provider execution/i);
      expect(phase.noExecutionGuidance).toMatch(/Phase 2 implementation/i);
    }
  });

  it("keeps all blocked flags false", () => {
    const flags = getManualActivationReadinessChecklistReview().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientsEnabled).toBe(false);
    expect(flags.envReadEnabled).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.vercelMutationEnabled).toBe(false);
    expect(flags.googleWorkspaceActivated).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.campaignEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousBuyerHandlingEnabled).toBe(false);
    expect(flags.autonomousOutreachEnabled).toBe(false);
    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.autonomousTextingEnabled).toBe(false);
    expect(flags.autonomousCallingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.blockerBypassEnabled).toBe(false);
    expect(flags.phase2ImplementationEnabled).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes the required safety and next-step language", () => {
    const result = getManualActivationReadinessChecklistReview();
    const summary = summarizeManualActivationReadinessChecklistReview(result);

    expect(summary).toMatch(/manual activation readiness checklist review/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/all 17 phases/i);
    expect(summary).toMatch(/Virtual Driving for Dollars review-only intelligence/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-approved movement/i);
    expect(summary).toMatch(/No activation/i);
    expect(summary).toMatch(/provider execution/i);
    expect(summary).toMatch(/outreach/i);
    expect(summary).toMatch(/automation/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/Phase 2 implementation/i);
    expect(summary).toMatch(/Complete Manual Activation Readiness Checklist Review/i);
    expect(summary).toMatch(/Human Go No-Go Readiness Decision Planning/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const blockedFlags = [
      "providerActivated",
      "providerClientsEnabled",
      "envReadEnabled",
      "dnsMutationEnabled",
      "vercelMutationEnabled",
      "googleWorkspaceActivated",
      "twilioActivated",
      "outboundSmsEnabled",
      "outboundEmailEnabled",
      "callingEnabled",
      "aiVoiceEnabled",
      "runtimeJobsEnabled",
      "pollingEnabled",
      "crmMutationEnabled",
      "automationEnabled",
      "campaignEnabled",
      "autonomousSellerHandlingEnabled",
      "autonomousBuyerHandlingEnabled",
      "autonomousOutreachEnabled",
      "autonomousNegotiationEnabled",
      "autonomousTextingEnabled",
      "autonomousCallingEnabled",
      "approvalGrantsExecution",
      "blockerBypassEnabled",
      "phase2ImplementationEnabled",
      "goLiveAuthorized",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getManualActivationReadinessChecklistReview(),
        flags: {
          ...manualActivationReadinessChecklistReviewFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertManualActivationReadinessChecklistReviewSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if pinned fields drift", () => {
    const statusUnsafe = {
      ...getManualActivationReadinessChecklistReview(),
      checklistReviewStatus: "activation_ready" as "manual_checklist_review_required",
    };
    const providerUnsafe = {
      ...getManualActivationReadinessChecklistReview(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getManualActivationReadinessChecklistReview(),
      communicationDecision: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getManualActivationReadinessChecklistReview(),
      automationDecision: "authorized" as "not_authorized",
    };
    const nextStepUnsafe = {
      ...getManualActivationReadinessChecklistReview(),
      recommendedNextExactStep: "Activate Providers" as "Complete Manual Activation Readiness Checklist Review",
    };
    const nextStageUnsafe = {
      ...getManualActivationReadinessChecklistReview(),
      nextStageRecommendation: "Go Live" as "Human Go No-Go Readiness Decision Planning",
    };

    expect(() => assertManualActivationReadinessChecklistReviewSafe(statusUnsafe)).toThrow(/cannot become activation-ready/i);
    expect(() => assertManualActivationReadinessChecklistReviewSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertManualActivationReadinessChecklistReviewSafe(communicationUnsafe)).toThrow(/communication decision/i);
    expect(() => assertManualActivationReadinessChecklistReviewSafe(automationUnsafe)).toThrow(/automation decision/i);
    expect(() => assertManualActivationReadinessChecklistReviewSafe(nextStepUnsafe)).toThrow(/Complete Manual Activation Readiness Checklist Review/i);
    expect(() => assertManualActivationReadinessChecklistReviewSafe(nextStageUnsafe)).toThrow(/Human Go No-Go Readiness Decision Planning/i);
  });

  it("fails invariant checks if checklist sections phase records or safety wording drift", () => {
    const missingSection = {
      ...getManualActivationReadinessChecklistReview(),
      checklistSections: getManualActivationReadinessChecklistReview().checklistSections.slice(0, 11),
    };
    const missingPhase = {
      ...getManualActivationReadinessChecklistReview(),
      phaseChecklistRecords: getManualActivationReadinessChecklistReview().phaseChecklistRecords.slice(0, 16),
    };
    const wrongOrder = {
      ...getManualActivationReadinessChecklistReview(),
      phaseChecklistRecords: [
        getManualActivationReadinessChecklistReview().phaseChecklistRecords[1],
        getManualActivationReadinessChecklistReview().phaseChecklistRecords[0],
        ...getManualActivationReadinessChecklistReview().phaseChecklistRecords.slice(2),
      ],
    };
    const missingRecordField = {
      ...getManualActivationReadinessChecklistReview(),
      phaseChecklistRecords: [
        {
          ...getManualActivationReadinessChecklistReview().phaseChecklistRecords[0],
          noExecutionGuidance: "",
        },
        ...getManualActivationReadinessChecklistReview().phaseChecklistRecords.slice(1),
      ],
    };
    const activationWording = {
      ...getManualActivationReadinessChecklistReview(),
      manualActivationReadinessChecklistReviewDoctrine: ["Activation is allowed after review."],
    };

    expect(() => assertManualActivationReadinessChecklistReviewSafe(missingSection)).toThrow(/required checklist sections/i);
    expect(() => assertManualActivationReadinessChecklistReviewSafe(missingPhase)).toThrow(/17 phase checklist records/i);
    expect(() => assertManualActivationReadinessChecklistReviewSafe(wrongOrder)).toThrow(/required 16-phase order/i);
    expect(() => assertManualActivationReadinessChecklistReviewSafe(missingRecordField)).toThrow(/Every phase checklist record/i);
    expect(() => assertManualActivationReadinessChecklistReviewSafe(activationWording)).toThrow(/forbid activation/i);
  });
});
