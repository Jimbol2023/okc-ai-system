import {
  assertCompleteManualActivationReadinessChecklistReviewSafe,
  completeManualActivationReadinessChecklistReviewFlags,
  getCompleteManualActivationReadinessChecklistReview,
  summarizeCompleteManualActivationReadinessChecklistReview,
} from "./complete-manual-activation-readiness-checklist-review";

describe("complete manual activation readiness checklist review", () => {
  it("creates the pinned complete manual activation readiness checklist review contract", () => {
    const result = getCompleteManualActivationReadinessChecklistReview();

    expect(result.phase).toBe("Complete Manual Activation Readiness Checklist Review");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.currentPhasePosition).toBe("Phase 1: Business Foundation & Trust Infrastructure");
    expect(result.previousRequiredStep).toBe("Manual Activation Readiness Checklist Review");
    expect(result.completionStatus).toBe("manual_completion_review_required");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Human Go No-Go Readiness Decision Planning");
    expect(result.nextStageRecommendation).toBe("Human Go No-Go Readiness Decision Planning");
  });

  it("keeps completion review read-only advisory-only planning-only and manual-completion-only", () => {
    const result = getCompleteManualActivationReadinessChecklistReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.manualCompletionReviewOnly).toBe(true);
  });

  it("includes all 12 completion sections with the required shape", () => {
    const result = getCompleteManualActivationReadinessChecklistReview();

    expect(result.completionSections.map((section) => section.sectionName)).toEqual([
      "business identity",
      "domain/DNS notes",
      "public/private separation",
      "Google Workspace/email identity",
      "SPF/DKIM/DMARC",
      "Twilio",
      "A2P/10DLC",
      "DNC/STOP",
      "manual approval",
      "rollback/stop",
      "internal dry-run",
      "human go/no-go criteria",
    ]);

    for (const section of result.completionSections) {
      expect(section.evidenceReviewedRequirement).toMatch(/evidence must be manually reviewed/i);
      expect(section.blockerStatusRequirement).toMatch(/blocker status/i);
      expect(section.humanOwner).toEqual(expect.arrayContaining(["completion review", "readiness judgment", "go/no-go planning decisions"]));
      expect(section.aiRole).toEqual(
        expect.arrayContaining(["organize completion review", "summarize readiness gaps", "explain blockers", "support operator clarity", "help prepare human go/no-go planning"]),
      );
      expect(section.noExecutionRule).toMatch(/cannot activate providers/i);
      expect(section.noExecutionRule).toMatch(/provider actions/i);
      expect(section.noExecutionRule).toMatch(/implement Phase 2/i);
      expect(section.noExecutionRule).toMatch(/go-live/i);
    }
  });

  it("defines all 17 phase completion records in order", () => {
    const result = getCompleteManualActivationReadinessChecklistReview();

    expect(result.phaseCompletionRecords.map((phase) => phase.phaseName)).toEqual([
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

  it("adds Virtual Driving for Dollars completion review as no-drift intelligence before SEO", () => {
    const result = getCompleteManualActivationReadinessChecklistReview();
    const phaseNames = result.phaseCompletionRecords.map((phase) => phase.phaseName);
    const virtualD4d = result.phaseCompletionRecords.find((phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine");
    const virtualD4dText = [
      ...(virtualD4d?.completedManualReviewCriteria ?? []),
      ...(virtualD4d?.forbiddenDrift ?? []),
      virtualD4d?.noExecutionConfirmation ?? "",
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

  it("requires every phase record to include completion criteria boundaries drift and no-execution confirmation", () => {
    const result = getCompleteManualActivationReadinessChecklistReview();

    for (const phase of result.phaseCompletionRecords) {
      expect(phase.completedManualReviewCriteria.length).toBeGreaterThan(0);
      expect(phase.completedManualReviewCriteria.join(" ")).toMatch(/completion reviewed/i);
      expect(phase.evidenceCompletenessRequirement).toMatch(/evidence completeness/i);
      expect(phase.blockerClarityRequirement).toMatch(/blockers must be clear/i);
      expect(phase.humanBoundary).toEqual(expect.arrayContaining(["human owns completion review", "human owns readiness judgment", "human owns go/no-go planning decisions"]));
      expect(phase.aiOperatorLeverageBoundary).toEqual(
        expect.arrayContaining(["organize completion review", "support operator clarity", "do not activate providers", "do not trigger runtime jobs"]),
      );
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.noExecutionConfirmation).toMatch(/no activation/i);
      expect(phase.noExecutionConfirmation).toMatch(/no provider execution/i);
      expect(phase.noExecutionConfirmation).toMatch(/no dry-run execution/i);
      expect(phase.noExecutionConfirmation).toMatch(/no rollback execution/i);
      expect(phase.noExecutionConfirmation).toMatch(/no map automation/i);
      expect(phase.noExecutionConfirmation).toMatch(/no lead creation/i);
      expect(phase.noExecutionConfirmation).toMatch(/no final authorization/i);
      expect(phase.noExecutionConfirmation).toMatch(/no Phase 2 implementation/i);
      expect(phase.noExecutionConfirmation).toMatch(/no go-live/i);
    }
  });

  it("keeps all blocked flags false", () => {
    const flags = getCompleteManualActivationReadinessChecklistReview().flags;

    expect(flags.dryRunExecutionEnabled).toBe(false);
    expect(flags.rollbackExecutionEnabled).toBe(false);
    expect(flags.providerExecutionEnabled).toBe(false);
    expect(flags.finalAuthorizationGranted).toBe(false);
    expect(flags.mapScrapingEnabled).toBe(false);
    expect(flags.streetViewAutomationEnabled).toBe(false);
    expect(flags.gpsSurveillanceEnabled).toBe(false);
    expect(flags.skipTracingAutomationEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
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

  it("summarizes the highest-aROI no-drift completion review boundary", () => {
    const result = getCompleteManualActivationReadinessChecklistReview();
    const summary = summarizeCompleteManualActivationReadinessChecklistReview(result);

    expect(summary).toMatch(/Phase 1: Business Foundation & Trust Infrastructure/i);
    expect(summary).toMatch(/Manual Activation Readiness Checklist Review/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/all 17 phases/i);
    expect(summary).toMatch(/Virtual Driving for Dollars review-only intelligence/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-approved movement/i);
    expect(summary).toMatch(/No activation/i);
    expect(summary).toMatch(/provider execution/i);
    expect(summary).toMatch(/outreach/i);
    expect(summary).toMatch(/automation/i);
    expect(summary).toMatch(/dry-run execution/i);
    expect(summary).toMatch(/rollback execution/i);
    expect(summary).toMatch(/map automation/i);
    expect(summary).toMatch(/lead creation without human approval/i);
    expect(summary).toMatch(/final authorization/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/Phase 2 implementation/i);
    expect(summary).toMatch(/Human Go No-Go Readiness Decision Planning/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const blockedFlags = [
      "dryRunExecutionEnabled",
      "rollbackExecutionEnabled",
      "providerExecutionEnabled",
      "finalAuthorizationGranted",
      "mapScrapingEnabled",
      "streetViewAutomationEnabled",
      "gpsSurveillanceEnabled",
      "skipTracingAutomationEnabled",
      "leadCreationEnabled",
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
        ...getCompleteManualActivationReadinessChecklistReview(),
        flags: {
          ...completeManualActivationReadinessChecklistReviewFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if pinned fields drift", () => {
    const statusUnsafe = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      completionStatus: "activation_ready" as "manual_completion_review_required",
    };
    const providerUnsafe = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      communicationDecision: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      automationDecision: "authorized" as "not_authorized",
    };
    const nextStepUnsafe = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      recommendedNextExactStep: "Activate Providers" as "Human Go No-Go Readiness Decision Planning",
    };
    const nextStageUnsafe = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      nextStageRecommendation: "Go Live" as "Human Go No-Go Readiness Decision Planning",
    };
    const phasePositionUnsafe = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      currentPhasePosition: "Phase 2: Lead Intake & Simple CRM" as "Phase 1: Business Foundation & Trust Infrastructure",
    };
    const previousStepUnsafe = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      previousRequiredStep: "Controlled Manual Activation Readiness Planning" as "Manual Activation Readiness Checklist Review",
    };

    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(statusUnsafe)).toThrow(/cannot become activation-ready/i);
    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(phasePositionUnsafe)).toThrow(/Phase 1/i);
    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(previousStepUnsafe)).toThrow(/Manual Activation Readiness Checklist Review/i);
    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(communicationUnsafe)).toThrow(/communication decision/i);
    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(automationUnsafe)).toThrow(/automation decision/i);
    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(nextStepUnsafe)).toThrow(/Human Go No-Go Readiness Decision Planning/i);
    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(nextStageUnsafe)).toThrow(/Human Go No-Go Readiness Decision Planning/i);
  });

  it("fails invariant checks if sections phases or safety wording drift", () => {
    const missingSection = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      completionSections: getCompleteManualActivationReadinessChecklistReview().completionSections.slice(0, 11),
    };
    const missingPhase = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      phaseCompletionRecords: getCompleteManualActivationReadinessChecklistReview().phaseCompletionRecords.slice(0, 16),
    };
    const wrongOrder = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      phaseCompletionRecords: [
        getCompleteManualActivationReadinessChecklistReview().phaseCompletionRecords[1],
        getCompleteManualActivationReadinessChecklistReview().phaseCompletionRecords[0],
        ...getCompleteManualActivationReadinessChecklistReview().phaseCompletionRecords.slice(2),
      ],
    };
    const missingRecordField = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      phaseCompletionRecords: [
        {
          ...getCompleteManualActivationReadinessChecklistReview().phaseCompletionRecords[0],
          noExecutionConfirmation: "",
        },
        ...getCompleteManualActivationReadinessChecklistReview().phaseCompletionRecords.slice(1),
      ],
    };
    const activationWording = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      completeManualActivationReadinessChecklistReviewDoctrine: ["Activation is allowed after review."],
    };
    const stalePhaseCountWording = {
      ...getCompleteManualActivationReadinessChecklistReview(),
      completeManualActivationReadinessChecklistReviewDoctrine: [
        ...getCompleteManualActivationReadinessChecklistReview().completeManualActivationReadinessChecklistReviewDoctrine,
        "This stale sentence says 16 phases.",
      ],
    };

    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(missingSection)).toThrow(/required completion sections/i);
    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(missingPhase)).toThrow(/17 phase completion records/i);
    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(wrongOrder)).toThrow(/required 17-phase order/i);
    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(missingRecordField)).toThrow(/Every phase completion record/i);
    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(activationWording)).toThrow(/forbid activation/i);
    expect(() => assertCompleteManualActivationReadinessChecklistReviewSafe(stalePhaseCountWording)).toThrow(/stale 16-phase wording/i);
  });
});
