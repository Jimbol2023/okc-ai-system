import {
  assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe,
  completeHumanGoNoGoReadinessDecisionPlanningFlags,
  getCompleteHumanGoNoGoReadinessDecisionPlanning,
  summarizeCompleteHumanGoNoGoReadinessDecisionPlanning,
} from "./complete-human-go-no-go-readiness-decision-planning";

describe("complete human go no-go readiness decision planning", () => {
  it("creates the pinned complete human go-no-go readiness decision planning contract", () => {
    const result = getCompleteHumanGoNoGoReadinessDecisionPlanning();

    expect(result.phase).toBe("Complete Human Go No-Go Readiness Decision Planning");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.completionStatus).toBe("human_go_no_go_readiness_decision_completion_required");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.goLiveDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Final Human Go/No-Go Authorization Review");
    expect(result.nextStageRecommendation).toBe("Final Human Go/No-Go Authorization Review");
  });

  it("keeps completion read-only advisory-only planning-only and human-decision-completion-only", () => {
    const result = getCompleteHumanGoNoGoReadinessDecisionPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.humanDecisionCompletionOnly).toBe(true);
  });

  it("includes all completion lanes with completion evidence blocker clarity human ownership AI support and no-execution language", () => {
    const result = getCompleteHumanGoNoGoReadinessDecisionPlanning();

    expect(result.completionLanes.map((lane) => lane.laneName)).toEqual([
      "evidence completeness",
      "unresolved blockers",
      "identity/trust readiness",
      "communication governance",
      "manual approval process",
      "rollback/stop procedure",
      "internal dry-run readiness",
      "public/private separation",
      "Virtual Driving for Dollars no-map-automation boundary",
      "final human decision authority",
    ]);

    for (const lane of result.completionLanes) {
      expect(lane.completionEvidence.length).toBeGreaterThan(0);
      expect(lane.blockerClarityRequirement.join(" ")).toMatch(/go, no-go, or blocker-carried-forward/i);
      expect(lane.humanOwner).toEqual(expect.arrayContaining(["human owns readiness completion judgment", "human owns blocker clarity"]));
      expect(lane.aiOperatorLeverageSupportRole).toEqual(
        expect.arrayContaining(["organize completion evidence", "summarize remaining blockers", "support operator clarity", "do not grant final authorization"]),
      );
      expect(lane.noExecutionRule).toMatch(/cannot activate providers/i);
      expect(lane.noExecutionRule).toMatch(/send outreach/i);
      expect(lane.noExecutionRule).toMatch(/create leads/i);
      expect(lane.noExecutionRule).toMatch(/automate maps/i);
      expect(lane.noExecutionRule).toMatch(/grant final authorization/i);
      expect(lane.noExecutionRule).toMatch(/go-live/i);
    }
  });

  it("defines all 17 phase completion records in order", () => {
    const result = getCompleteHumanGoNoGoReadinessDecisionPlanning();

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

  it("keeps Virtual Driving for Dollars between lead discovery and SEO with no-map-automation drift blocked", () => {
    const result = getCompleteHumanGoNoGoReadinessDecisionPlanning();
    const phaseNames = result.phaseCompletionRecords.map((phase) => phase.phaseName);
    const virtualD4d = result.phaseCompletionRecords.find((phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine");
    const virtualD4dText = [
      ...(virtualD4d?.completedReadinessBasis ?? []),
      ...(virtualD4d?.forbiddenDrift ?? []),
      virtualD4d?.noExecutionNoGoLiveConfirmation ?? "",
    ].join(" ");

    expect(phaseNames.indexOf("Virtual Driving for Dollars Intelligence Engine")).toBe(phaseNames.indexOf("AI-Assisted Lead Discovery") + 1);
    expect(phaseNames.indexOf("Virtual Driving for Dollars Intelligence Engine")).toBeLessThan(phaseNames.indexOf("SEO & Local Authority Engine"));
    expect(virtualD4dText).toMatch(/approved target neighborhoods/i);
    expect(virtualD4dText).toMatch(/manual review process/i);
    expect(virtualD4dText).toMatch(/distress signal checklist/i);
    expect(virtualD4dText).toMatch(/lead approval criteria/i);
    expect(virtualD4dText).toMatch(/buyer-demand criteria/i);
    expect(virtualD4dText).toMatch(/DNC\/STOP governance/i);
    expect(virtualD4dText).toMatch(/public\/private separation/i);
    expect(virtualD4dText).toMatch(/map scraping/i);
    expect(virtualD4dText).toMatch(/Google Street View automation/i);
    expect(virtualD4dText).toMatch(/GPS surveillance/i);
    expect(virtualD4dText).toMatch(/skip tracing automation/i);
    expect(virtualD4dText).toMatch(/owner contact automation/i);
    expect(virtualD4dText).toMatch(/autonomous outreach/i);
    expect(virtualD4dText).toMatch(/campaign activation/i);
    expect(virtualD4dText).toMatch(/lead creation without human approval/i);
  });

  it("requires every phase record to include completed readiness blocker clarity human owner AI boundary drift and no-execution confirmation", () => {
    const result = getCompleteHumanGoNoGoReadinessDecisionPlanning();

    for (const phase of result.phaseCompletionRecords) {
      expect(phase.completedReadinessBasis.length).toBeGreaterThan(0);
      expect(phase.blockerClarityRequirement.join(" ")).toMatch(/human-reviewed blocker clarity/i);
      expect(phase.blockerClarityRequirement.join(" ")).toMatch(/cannot be bypassed/i);
      expect(phase.humanOwner).toEqual(expect.arrayContaining(["human owns readiness completion judgment", "human owns final authorization review preparation"]));
      expect(phase.aiOperatorLeverageBoundary).toEqual(
        expect.arrayContaining(["organize completion evidence", "support operator clarity", "do not grant final authorization", "do not create leads"]),
      );
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.noExecutionNoGoLiveConfirmation).toMatch(/no activation/i);
      expect(phase.noExecutionNoGoLiveConfirmation).toMatch(/no provider execution/i);
      expect(phase.noExecutionNoGoLiveConfirmation).toMatch(/no lead creation/i);
      expect(phase.noExecutionNoGoLiveConfirmation).toMatch(/no map automation/i);
      expect(phase.noExecutionNoGoLiveConfirmation).toMatch(/no final authorization/i);
      expect(phase.noExecutionNoGoLiveConfirmation).toMatch(/no go-live/i);
    }
  });

  it("keeps all blocked flags false", () => {
    const flags = getCompleteHumanGoNoGoReadinessDecisionPlanning().flags;

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
    expect(flags.mapScrapingEnabled).toBe(false);
    expect(flags.streetViewAutomationEnabled).toBe(false);
    expect(flags.gpsSurveillanceEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.finalAuthorizationGranted).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes the highest-aROI human-owned no-drift completion boundary", () => {
    const result = getCompleteHumanGoNoGoReadinessDecisionPlanning();
    const summary = summarizeCompleteHumanGoNoGoReadinessDecisionPlanning(result);

    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/all 17 phases/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-owned completion judgment/i);
    expect(summary).toMatch(/human-approved movement/i);
    expect(summary).toMatch(/No activation/i);
    expect(summary).toMatch(/provider execution/i);
    expect(summary).toMatch(/outreach/i);
    expect(summary).toMatch(/automation/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/Phase 2 implementation/i);
    expect(summary).toMatch(/no-map-automation boundary/i);
    expect(summary).toMatch(/map scraping/i);
    expect(summary).toMatch(/final authorization/i);
    expect(summary).toMatch(/Final Human Go\/No-Go Authorization Review/i);
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
      "mapScrapingEnabled",
      "streetViewAutomationEnabled",
      "gpsSurveillanceEnabled",
      "skipTracingEnabled",
      "leadCreationEnabled",
      "finalAuthorizationGranted",
      "goLiveAuthorized",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
        flags: {
          ...completeHumanGoNoGoReadinessDecisionPlanningFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if pinned fields drift", () => {
    const statusUnsafe = {
      ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
      completionStatus: "activation_ready" as "human_go_no_go_readiness_decision_completion_required",
    };
    const providerUnsafe = {
      ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
      communicationDecision: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
      automationDecision: "authorized" as "not_authorized",
    };
    const goLiveUnsafe = {
      ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
      goLiveDecision: "authorized" as "not_authorized",
    };
    const nextStepUnsafe = {
      ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
      recommendedNextExactStep: "Activate Providers" as "Final Human Go/No-Go Authorization Review",
    };
    const nextStageUnsafe = {
      ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
      nextStageRecommendation: "Go Live" as "Final Human Go/No-Go Authorization Review",
    };

    expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(statusUnsafe)).toThrow(/cannot become activation-ready/i);
    expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(communicationUnsafe)).toThrow(/communication decision/i);
    expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(automationUnsafe)).toThrow(/automation decision/i);
    expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(goLiveUnsafe)).toThrow(/go-live decision/i);
    expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(nextStepUnsafe)).toThrow(/Final Human Go\/No-Go Authorization Review/i);
    expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(nextStageUnsafe)).toThrow(/Final Human Go\/No-Go Authorization Review/i);
  });

  it("fails invariant checks if lanes phases or safety wording drift", () => {
    const missingLane = {
      ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
      completionLanes: getCompleteHumanGoNoGoReadinessDecisionPlanning().completionLanes.slice(0, 9),
    };
    const missingPhase = {
      ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
      phaseCompletionRecords: getCompleteHumanGoNoGoReadinessDecisionPlanning().phaseCompletionRecords.slice(0, 16),
    };
    const wrongOrder = {
      ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
      phaseCompletionRecords: [
        getCompleteHumanGoNoGoReadinessDecisionPlanning().phaseCompletionRecords[1],
        getCompleteHumanGoNoGoReadinessDecisionPlanning().phaseCompletionRecords[0],
        ...getCompleteHumanGoNoGoReadinessDecisionPlanning().phaseCompletionRecords.slice(2),
      ],
    };
    const missingRecordField = {
      ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
      phaseCompletionRecords: [
        {
          ...getCompleteHumanGoNoGoReadinessDecisionPlanning().phaseCompletionRecords[0],
          noExecutionNoGoLiveConfirmation: "",
        },
        ...getCompleteHumanGoNoGoReadinessDecisionPlanning().phaseCompletionRecords.slice(1),
      ],
    };
    const activationWording = {
      ...getCompleteHumanGoNoGoReadinessDecisionPlanning(),
      completeHumanGoNoGoReadinessDecisionPlanningDoctrine: ["Activation and final authorization are allowed after completion."],
    };

    expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(missingLane)).toThrow(/completion lanes/i);
    expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(missingPhase)).toThrow(/17 phase completion records/i);
    expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(wrongOrder)).toThrow(/17-phase order/i);
    expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(missingRecordField)).toThrow(/Every phase completion record/i);
    expect(() => assertCompleteHumanGoNoGoReadinessDecisionPlanningSafe(activationWording)).toThrow(/forbid activation/i);
  });
});
