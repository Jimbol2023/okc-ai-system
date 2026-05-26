import {
  assertControlledManualActivationRunbookPlanningSafe,
  controlledManualActivationRunbookPlanningFlags,
  getControlledManualActivationRunbookPlanning,
  summarizeControlledManualActivationRunbookPlanning,
} from "./controlled-manual-activation-runbook-planning";

describe("controlled manual activation runbook planning", () => {
  it("creates the pinned controlled manual activation runbook planning contract", () => {
    const result = getControlledManualActivationRunbookPlanning();

    expect(result.phase).toBe("Controlled Manual Activation Runbook Planning");
    expect(result.controlledManualActivationRunbookPlanningStatus).toBe("planning_only");
    expect(result.runbookDecision).toBe("not_authorized_for_execution");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.currentPhasePosition).toBe("Phase 1: Business Foundation & Trust Infrastructure");
    expect(result.previousRequiredStep).toBe("Final Human Go/No-Go Authorization Review");
    expect(result.recommendedNextExactStep).toBe("Manual Activation Dry-Run Evidence Review");
    expect(result.nextStageRecommendation).toBe("Manual Activation Dry-Run Evidence Review");
  });

  it("keeps runbook planning read-only advisory-only planning-only and runbook-planning-only", () => {
    const result = getControlledManualActivationRunbookPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
    expect(result.flags.runbookPlanningOnly).toBe(true);
  });

  it("keeps runbook provider communication and automation decisions not authorized", () => {
    const result = getControlledManualActivationRunbookPlanning();

    expect(result.runbookDecision).toBe("not_authorized_for_execution");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.flags.runbookApprovedForExecution).toBe(false);
    expect(result.flags.runbookExecutionEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.communicationExecutionAuthorized).toBe(false);
    expect(result.flags.automationEnabled).toBe(false);
  });

  it("defines all controlled manual activation runbook lanes with human-owned checklist support only", () => {
    const result = getControlledManualActivationRunbookPlanning();

    expect(result.controlledManualActivationRunbookLanes.map((lane) => lane.lane)).toEqual([
      "final_human_review_prerequisite",
      "manual_checklist_sequence",
      "identity_evidence_check",
      "consent_dnc_opt_out_stop_check",
      "blocker_preflight_check",
      "credential_env_boundary",
      "manual_activation_step_planning",
      "audit_expectation_planning",
      "rollback_rule_planning",
      "failure_state_planning",
      "no_send_no_provider_boundary",
      "dry_run_evidence_readiness",
    ]);

    for (const lane of result.controlledManualActivationRunbookLanes) {
      expect(lane.checklistFocus.length).toBeGreaterThan(0);
      expect(lane.governanceRule).toBeTruthy();
      expect(lane.humanOwner).toEqual(expect.arrayContaining(["human owns runbook planning judgment", "human owns checklist approval"]));
      expect(lane.aiChecklistSupportOnlyRole).toEqual(
        expect.arrayContaining(["support checklist organization", "summarize runbook planning gaps", "support operator clarity", "do not execute runbooks"]),
      );
      expect(lane.noExecutionRule).toMatch(/manual planning only/i);
      expect(lane.noExecutionRule).toMatch(/execute dry-runs/i);
      expect(lane.noExecutionRule).toMatch(/create leads/i);
      expect(lane.noExecutionRule).toMatch(/automate maps/i);
      expect(lane.noExecutionRule).toMatch(/go-live/i);
    }
  });

  it("defines checklist blocker rollback audit and dry-run planning without execution", () => {
    const result = getControlledManualActivationRunbookPlanning();
    const laneText = result.controlledManualActivationRunbookLanes
      .flatMap((lane) => [lane.lane, ...lane.checklistFocus, lane.governanceRule, lane.noExecutionRule])
      .join(" ");

    expect(laneText).toMatch(/Final Human Go\/No-Go prerequisite/i);
    expect(laneText).toMatch(/step-by-step human checklist/i);
    expect(laneText).toMatch(/domain identity evidence/i);
    expect(laneText).toMatch(/consent evidence check/i);
    expect(laneText).toMatch(/missing approval blocker/i);
    expect(laneText).toMatch(/no env reads/i);
    expect(laneText).toMatch(/future activation step names/i);
    expect(laneText).toMatch(/future audit fields/i);
    expect(laneText).toMatch(/rollback checklist/i);
    expect(laneText).toMatch(/failed preflight state/i);
    expect(laneText).toMatch(/no provider activation/i);
    expect(laneText).toMatch(/manual dry-run next/i);
  });

  it("defines all 17 phase runbook records in order", () => {
    const result = getControlledManualActivationRunbookPlanning();

    expect(result.phaseRunbookRecords.map((phase) => phase.phaseName)).toEqual([
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

  it("requires every phase runbook record to include planning evidence checklist blocker human AI drift and no-execution rule", () => {
    const result = getControlledManualActivationRunbookPlanning();

    for (const phase of result.phaseRunbookRecords) {
      expect(phase.runbookPlanningEvidence.length).toBeGreaterThan(0);
      expect(phase.manualChecklistRequirement).toMatch(/manual checklist steps/i);
      expect(phase.blockerPreflightRule).toMatch(/blockers must be checked/i);
      expect(phase.humanOwner).toEqual(expect.arrayContaining(["human owns final review evidence", "human owns dry-run authorization decisions"]));
      expect(phase.aiChecklistSupportOnlyRole).toEqual(expect.arrayContaining(["support checklist organization", "do not execute dry-runs", "do not implement Phase 2"]));
      expect(phase.forbiddenDrift.length).toBeGreaterThan(0);
      expect(phase.noExecutionRule).toMatch(/no runbook execution/i);
      expect(phase.noExecutionRule).toMatch(/no dry-run execution/i);
      expect(phase.noExecutionRule).toMatch(/no provider execution/i);
      expect(phase.noExecutionRule).toMatch(/no lead creation/i);
      expect(phase.noExecutionRule).toMatch(/no map automation/i);
      expect(phase.noExecutionRule).toMatch(/no Phase 2 implementation/i);
      expect(phase.noExecutionRule).toMatch(/no go-live/i);
    }
  });

  it("keeps Virtual Driving for Dollars runbook planning review-only and no-map automation", () => {
    const result = getControlledManualActivationRunbookPlanning();
    const phaseNames = result.phaseRunbookRecords.map((phase) => phase.phaseName);
    const virtualD4d = result.phaseRunbookRecords.find((phase) => phase.phaseName === "Virtual Driving for Dollars Intelligence Engine");
    const virtualD4dText = [
      ...(virtualD4d?.runbookPlanningEvidence ?? []),
      ...(virtualD4d?.forbiddenDrift ?? []),
      virtualD4d?.noExecutionRule ?? "",
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

  it("keeps all blocked execution flags false", () => {
    const flags = getControlledManualActivationRunbookPlanning().flags;

    expect(flags.runbookApprovedForExecution).toBe(false);
    expect(flags.runbookExecutionEnabled).toBe(false);
    expect(flags.dryRunExecutionEnabled).toBe(false);
    expect(flags.finalAuthorizationGranted).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.providerActivationAuthorized).toBe(false);
    expect(flags.providerExecutionEnabled).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.providerClientCreated).toBe(false);
    expect(flags.providerClientsEnabled).toBe(false);
    expect(flags.providerEnvRead).toBe(false);
    expect(flags.envReadEnabled).toBe(false);
    expect(flags.providerSdkImported).toBe(false);
    expect(flags.sdkImportEnabled).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.domainMutationEnabled).toBe(false);
    expect(flags.vercelMutationEnabled).toBe(false);
    expect(flags.mailboxCreated).toBe(false);
    expect(flags.googleWorkspaceActivated).toBe(false);
    expect(flags.numberActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.emailSendingEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.routeCreated).toBe(false);
    expect(flags.inboundWebhookCreated).toBe(false);
    expect(flags.routeOrWebhookCreated).toBe(false);
    expect(flags.campaignActivated).toBe(false);
    expect(flags.campaignEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.auditWriteEnabled).toBe(false);
    expect(flags.communicationExecutionAuthorized).toBe(false);
    expect(flags.communicationExecutionEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.rollbackExecutionEnabled).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.mapScrapingEnabled).toBe(false);
    expect(flags.streetViewAutomationEnabled).toBe(false);
    expect(flags.gpsSurveillanceEnabled).toBe(false);
    expect(flags.skipTracingAutomationEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.phase2ImplementationEnabled).toBe(false);
  });

  it("keeps doctrine focused on manual runbook planning without activation", () => {
    const result = getControlledManualActivationRunbookPlanning();
    const doctrineText = result.controlledManualActivationRunbookDoctrine.join(" ");

    expect(doctrineText).toMatch(/contract-only and planning-only/i);
    expect(doctrineText).toMatch(/Phase 1: Business Foundation & Trust Infrastructure/i);
    expect(doctrineText).toMatch(/Final Human Go\/No-Go Authorization Review/i);
    expect(doctrineText).toMatch(/all 17 phases/i);
    expect(doctrineText).toMatch(/not_authorized_for_execution/i);
    expect(doctrineText).toMatch(/Provider decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Communication decision remains not_authorized/i);
    expect(doctrineText).toMatch(/Automation decision remains not_authorized/i);
    expect(doctrineText).toMatch(/human checklist steps, blocker checks, rollback rules, audit expectations/i);
    expect(doctrineText).toMatch(/operator leverage only/i);
    expect(doctrineText).toMatch(/No runbook execution, dry-run execution/i);
    expect(doctrineText).toMatch(/provider execution/i);
    expect(doctrineText).toMatch(/lead creation/i);
    expect(doctrineText).toMatch(/map scraping/i);
    expect(doctrineText).toMatch(/Google Street View automation/i);
    expect(doctrineText).toMatch(/GPS surveillance/i);
    expect(doctrineText).toMatch(/Phase 2 implementation/i);
    expect(doctrineText).toMatch(/not autonomous wholesaling/i);
  });

  it("summarizes the highest-aROI no-drift controlled runbook boundary", () => {
    const result = getControlledManualActivationRunbookPlanning();
    const summary = summarizeControlledManualActivationRunbookPlanning(result);

    expect(summary).toMatch(/Phase 1: Business Foundation & Trust Infrastructure/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/all 17 phases/i);
    expect(summary).toMatch(/operator leverage only/i);
    expect(summary).toMatch(/human-owned runbook planning/i);
    expect(summary).toMatch(/Runbook decision is not_authorized_for_execution/i);
    expect(summary).toMatch(/No runbook execution/i);
    expect(summary).toMatch(/dry-run execution/i);
    expect(summary).toMatch(/provider activation/i);
    expect(summary).toMatch(/provider execution/i);
    expect(summary).toMatch(/outbound communication/i);
    expect(summary).toMatch(/lead creation/i);
    expect(summary).toMatch(/map scraping/i);
    expect(summary).toMatch(/Google Street View automation/i);
    expect(summary).toMatch(/GPS surveillance/i);
    expect(summary).toMatch(/Phase 2 implementation/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/Next stage: Manual Activation Dry-Run Evidence Review/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "runbookApprovedForExecution",
      "runbookExecutionEnabled",
      "dryRunExecutionEnabled",
      "finalAuthorizationGranted",
      "goLiveAuthorized",
      "providerActivationAuthorized",
      "providerExecutionEnabled",
      "providerActivated",
      "providerClientCreated",
      "providerClientsEnabled",
      "providerEnvRead",
      "envReadEnabled",
      "providerSdkImported",
      "sdkImportEnabled",
      "twilioActivated",
      "dnsMutationEnabled",
      "domainActivated",
      "domainMutationEnabled",
      "vercelMutationEnabled",
      "mailboxCreated",
      "googleWorkspaceActivated",
      "numberActivated",
      "outboundSmsEnabled",
      "outboundEmailEnabled",
      "callingEnabled",
      "aiVoiceEnabled",
      "routeCreated",
      "inboundWebhookCreated",
      "routeOrWebhookCreated",
      "campaignActivated",
      "campaignEnabled",
      "queueSystemEnabled",
      "runtimeJobsEnabled",
      "crmMutationEnabled",
      "auditWritingEnabled",
      "auditWriteEnabled",
      "automationEnabled",
      "autonomousSellerHandlingEnabled",
      "rollbackExecutionEnabled",
      "spendIncreaseAuthorized",
      "mapScrapingEnabled",
      "streetViewAutomationEnabled",
      "gpsSurveillanceEnabled",
      "skipTracingAutomationEnabled",
      "leadCreationEnabled",
      "phase2ImplementationEnabled",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getControlledManualActivationRunbookPlanning(),
        flags: {
          ...controlledManualActivationRunbookPlanningFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertControlledManualActivationRunbookPlanningSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions or status drift", () => {
    const statusUnsafe = {
      ...getControlledManualActivationRunbookPlanning(),
      controlledManualActivationRunbookPlanningStatus: "manual_runbook_shape_defined" as "planning_only",
    };
    const runbookUnsafe = {
      ...getControlledManualActivationRunbookPlanning(),
      runbookDecision: "authorized" as "not_authorized_for_execution",
    };
    const providerUnsafe = {
      ...getControlledManualActivationRunbookPlanning(),
      providerDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getControlledManualActivationRunbookPlanning(),
      communicationDecision: "authorized" as "not_authorized",
    };
    const automationUnsafe = {
      ...getControlledManualActivationRunbookPlanning(),
      automationDecision: "authorized" as "not_authorized",
    };
    const phasePositionUnsafe = {
      ...getControlledManualActivationRunbookPlanning(),
      currentPhasePosition: "Phase 2: Lead Intake & Simple CRM" as "Phase 1: Business Foundation & Trust Infrastructure",
    };

    expect(() => assertControlledManualActivationRunbookPlanningSafe(statusUnsafe)).toThrow(/cannot become execution-ready/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(phasePositionUnsafe)).toThrow(/Phase 1/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(runbookUnsafe)).toThrow(/Runbook decision/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(providerUnsafe)).toThrow(/provider decision/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(communicationUnsafe)).toThrow(/communication decision/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(automationUnsafe)).toThrow(/automation decision/i);
  });

  it("fails invariant checks if previous step phase records or safety wording drift", () => {
    const missingPreviousStep = {
      ...getControlledManualActivationRunbookPlanning(),
      previousRequiredStep: "Complete Human Go No-Go Readiness Decision Planning" as "Final Human Go/No-Go Authorization Review",
    };
    const missingPhase = {
      ...getControlledManualActivationRunbookPlanning(),
      phaseRunbookRecords: getControlledManualActivationRunbookPlanning().phaseRunbookRecords.slice(0, 16),
    };
    const wrongOrder = {
      ...getControlledManualActivationRunbookPlanning(),
      phaseRunbookRecords: [
        getControlledManualActivationRunbookPlanning().phaseRunbookRecords[1],
        getControlledManualActivationRunbookPlanning().phaseRunbookRecords[0],
        ...getControlledManualActivationRunbookPlanning().phaseRunbookRecords.slice(2),
      ],
    };
    const missingRecordField = {
      ...getControlledManualActivationRunbookPlanning(),
      phaseRunbookRecords: [
        {
          ...getControlledManualActivationRunbookPlanning().phaseRunbookRecords[0],
          noExecutionRule: "",
        },
        ...getControlledManualActivationRunbookPlanning().phaseRunbookRecords.slice(1),
      ],
    };
    const activationWording = {
      ...getControlledManualActivationRunbookPlanning(),
      controlledManualActivationRunbookDoctrine: ["Activation and dry-run execution are allowed after planning."],
    };
    const stalePhaseCountWording = {
      ...getControlledManualActivationRunbookPlanning(),
      controlledManualActivationRunbookDoctrine: [
        ...getControlledManualActivationRunbookPlanning().controlledManualActivationRunbookDoctrine,
        "This stale sentence says 16 phases.",
      ],
    };

    expect(() => assertControlledManualActivationRunbookPlanningSafe(missingPreviousStep)).toThrow(/Final Human Go\/No-Go Authorization Review/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(missingPhase)).toThrow(/17 phase runbook records/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(wrongOrder)).toThrow(/17-phase order/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(missingRecordField)).toThrow(/Every phase runbook record/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(activationWording)).toThrow(/forbid activation/i);
    expect(() => assertControlledManualActivationRunbookPlanningSafe(stalePhaseCountWording)).toThrow(/stale 16-phase wording/i);
  });

  it("fails invariant checks if the roadmap skips manual dry-run evidence review", () => {
    const unsafeResult = {
      ...getControlledManualActivationRunbookPlanning(),
      recommendedNextExactStep: "Activate Providers" as "Manual Activation Dry-Run Evidence Review",
    };

    expect(() => assertControlledManualActivationRunbookPlanningSafe(unsafeResult)).toThrow(/Manual Activation Dry-Run Evidence Review/i);
  });
});
