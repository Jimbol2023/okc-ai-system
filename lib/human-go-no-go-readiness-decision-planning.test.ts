import {
  assertHumanGoNoGoReadinessDecisionPlanningSafe,
  getHumanGoNoGoReadinessDecisionPlanning,
  humanGoNoGoReadinessDecisionPlanningFlags,
  summarizeHumanGoNoGoReadinessDecisionPlanning,
} from "./human-go-no-go-readiness-decision-planning";

describe("human go no-go readiness decision planning", () => {
  it("creates the pinned human go-no-go readiness decision planning contract", () => {
    const result = getHumanGoNoGoReadinessDecisionPlanning();

    expect(result.phase).toBe("Human Go No-Go Readiness Decision Planning");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.strategicAlignment).toBe("elite_high_aroi_acquisition_os");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.decisionPlanningStatus).toBe("human_go_no_go_readiness_decision_planning_required");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.goLiveDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Complete Human Go No-Go Readiness Decision Planning");
    expect(result.nextStageRecommendation).toBe("Final Human Go/No-Go Authorization Review");
  });

  it("keeps decision planning read-only advisory-only planning-only and human-decision-only", () => {
    const result = getHumanGoNoGoReadinessDecisionPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.humanDecisionPlanningOnly).toBe(true);
  });

  it("includes all human decision planning lanes with human criteria and no-execution language", () => {
    const result = getHumanGoNoGoReadinessDecisionPlanning();

    expect(result.decisionPlanningLanes.map((lane) => lane.laneName)).toEqual([
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

    for (const lane of result.decisionPlanningLanes) {
      expect(lane.humanDecisionCriteria.join(" ")).toMatch(/manually reviewed/i);
      expect(lane.humanDecisionCriteria.join(" ")).toMatch(/go, no-go, or blocker-carried-forward/i);
      expect(lane.requiredEvidenceBasis.length).toBeGreaterThan(0);
      expect(lane.aiSupportRole).toEqual(expect.arrayContaining(["organize readiness evidence", "summarize unresolved blockers", "support operator clarity"]));
      expect(lane.noExecutionRule).toMatch(/cannot activate providers/i);
      expect(lane.noExecutionRule).toMatch(/send outreach/i);
      expect(lane.noExecutionRule).toMatch(/create leads/i);
      expect(lane.noExecutionRule).toMatch(/automate maps/i);
      expect(lane.noExecutionRule).toMatch(/go-live/i);
    }
  });

  it("defines all 17 phase decision records in order", () => {
    const result = getHumanGoNoGoReadinessDecisionPlanning();

    expect(result.phaseDecisionRecords.map((phase) => phase.phaseName)).toEqual([
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
    const result = getHumanGoNoGoReadinessDecisionPlanning();
    const phaseNames = result.phaseDecisionRecords.map((phase) => phase.phaseName);
    const virtualD4d = result.phaseDecisionRecords.find((phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine");
    const virtualD4dText = [
      ...(virtualD4d?.readinessEvidenceBasis ?? []),
      ...(virtualD4d?.forbiddenDrift ?? []),
      virtualD4d?.noExecutionNoGoLiveRule ?? "",
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

  it("requires every phase record to include readiness evidence blockers human ownership AI support drift and no-execution rules", () => {
    const result = getHumanGoNoGoReadinessDecisionPlanning();

    for (const phase of result.phaseDecisionRecords) {
      expect(phase.readinessEvidenceBasis.length).toBeGreaterThan(0);
      expect(phase.blockerDecisionCriteria.join(" ")).toMatch(/human-reviewed go, no-go, or blocker-carried-forward/i);
      expect(phase.blockerDecisionCriteria.join(" ")).toMatch(/cannot be bypassed/i);
      expect(phase.humanDecisionOwner).toEqual(expect.arrayContaining(["human owns readiness judgment", "human owns go/no-go planning decisions"]));
      expect(phase.aiOperatorLeverageSupportRole).toEqual(
        expect.arrayContaining(["organize readiness evidence", "support operator clarity", "do not approve activation", "do not create leads"]),
      );
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.noExecutionNoGoLiveRule).toMatch(/does not authorize activation/i);
      expect(phase.noExecutionNoGoLiveRule).toMatch(/provider execution/i);
      expect(phase.noExecutionNoGoLiveRule).toMatch(/lead creation/i);
      expect(phase.noExecutionNoGoLiveRule).toMatch(/map automation/i);
      expect(phase.noExecutionNoGoLiveRule).toMatch(/go-live/i);
    }
  });

  it("keeps all blocked flags false", () => {
    const flags = getHumanGoNoGoReadinessDecisionPlanning().flags;

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
    expect(flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes the highest-aROI human-owned no-drift readiness decision planning boundary", () => {
    const result = getHumanGoNoGoReadinessDecisionPlanning();
    const summary = summarizeHumanGoNoGoReadinessDecisionPlanning(result);

    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/all 17 phases/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-owned readiness judgment/i);
    expect(summary).toMatch(/human-approved movement/i);
    expect(summary).toMatch(/No activation/i);
    expect(summary).toMatch(/provider execution/i);
    expect(summary).toMatch(/outreach/i);
    expect(summary).toMatch(/automation/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/Phase 2 implementation/i);
    expect(summary).toMatch(/no-map-automation boundary/i);
    expect(summary).toMatch(/map scraping/i);
    expect(summary).toMatch(/Complete Human Go No-Go Readiness Decision Planning/i);
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
      "goLiveAuthorized",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getHumanGoNoGoReadinessDecisionPlanning(),
        flags: {
          ...humanGoNoGoReadinessDecisionPlanningFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if pinned fields drift", () => {
    const statusUnsafe = {
      ...getHumanGoNoGoReadinessDecisionPlanning(),
      decisionPlanningStatus: "activation_ready" as "human_go_no_go_readiness_decision_planning_required",
    };
    const providerUnsafe = {
      ...getHumanGoNoGoReadinessDecisionPlanning(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getHumanGoNoGoReadinessDecisionPlanning(),
      communicationDecision: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getHumanGoNoGoReadinessDecisionPlanning(),
      automationDecision: "authorized" as "not_authorized",
    };
    const goLiveUnsafe = {
      ...getHumanGoNoGoReadinessDecisionPlanning(),
      goLiveDecision: "authorized" as "not_authorized",
    };
    const nextStepUnsafe = {
      ...getHumanGoNoGoReadinessDecisionPlanning(),
      recommendedNextExactStep: "Activate Providers" as "Complete Human Go No-Go Readiness Decision Planning",
    };
    const nextStageUnsafe = {
      ...getHumanGoNoGoReadinessDecisionPlanning(),
      nextStageRecommendation: "Go Live" as "Final Human Go/No-Go Authorization Review",
    };

    expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(statusUnsafe)).toThrow(/cannot become activation-ready/i);
    expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(communicationUnsafe)).toThrow(/communication decision/i);
    expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(automationUnsafe)).toThrow(/automation decision/i);
    expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(goLiveUnsafe)).toThrow(/go-live decision/i);
    expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(nextStepUnsafe)).toThrow(/Complete Human Go No-Go Readiness Decision Planning/i);
    expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(nextStageUnsafe)).toThrow(/Final Human Go\/No-Go Authorization Review/i);
  });

  it("fails invariant checks if lanes phases or safety wording drift", () => {
    const missingLane = {
      ...getHumanGoNoGoReadinessDecisionPlanning(),
      decisionPlanningLanes: getHumanGoNoGoReadinessDecisionPlanning().decisionPlanningLanes.slice(0, 9),
    };
    const missingPhase = {
      ...getHumanGoNoGoReadinessDecisionPlanning(),
      phaseDecisionRecords: getHumanGoNoGoReadinessDecisionPlanning().phaseDecisionRecords.slice(0, 16),
    };
    const wrongOrder = {
      ...getHumanGoNoGoReadinessDecisionPlanning(),
      phaseDecisionRecords: [
        getHumanGoNoGoReadinessDecisionPlanning().phaseDecisionRecords[1],
        getHumanGoNoGoReadinessDecisionPlanning().phaseDecisionRecords[0],
        ...getHumanGoNoGoReadinessDecisionPlanning().phaseDecisionRecords.slice(2),
      ],
    };
    const missingRecordField = {
      ...getHumanGoNoGoReadinessDecisionPlanning(),
      phaseDecisionRecords: [
        {
          ...getHumanGoNoGoReadinessDecisionPlanning().phaseDecisionRecords[0],
          noExecutionNoGoLiveRule: "",
        },
        ...getHumanGoNoGoReadinessDecisionPlanning().phaseDecisionRecords.slice(1),
      ],
    };
    const activationWording = {
      ...getHumanGoNoGoReadinessDecisionPlanning(),
      humanGoNoGoReadinessDecisionPlanningDoctrine: ["Activation is allowed after human decision planning."],
    };

    expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(missingLane)).toThrow(/decision planning lanes/i);
    expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(missingPhase)).toThrow(/17 phase decision records/i);
    expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(wrongOrder)).toThrow(/17-phase order/i);
    expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(missingRecordField)).toThrow(/Every phase decision record/i);
    expect(() => assertHumanGoNoGoReadinessDecisionPlanningSafe(activationWording)).toThrow(/forbid activation/i);
  });
});
