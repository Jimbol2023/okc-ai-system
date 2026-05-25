import {
  assertOperatorDecisionQualityImplementationGateSafe,
  getOperatorDecisionQualityImplementationGate,
  operatorDecisionQualityImplementationGateFlags,
  summarizeOperatorDecisionQualityImplementationGate,
} from "./operator-decision-quality-implementation-gate";

describe("operator decision quality implementation gate", () => {
  it("creates a planning-only A4.2 operator decision quality implementation gate", () => {
    const result = getOperatorDecisionQualityImplementationGate();

    expect(result.phase).toBe("A4.2 Operator Decision Quality Implementation Gate");
    expect(result.operatorDecisionQualityImplementationGateStatus).toBe("planning_only");
    expect(result.selectedImplementationScope).toBe("operator_review_clarity_only");
    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.uiDecision).toBe("not_authorized");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("A4.3 Operator Decision Quality Review Surface Planning");
    expect(result.nextStageRecommendation).toBe("A4.3 Operator Decision Quality Review Surface Planning");
  });

  it("keeps A4.2 read-only advisory-only and planning-only", () => {
    const result = getOperatorDecisionQualityImplementationGate();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps implementation UI persistence and communication decisions not authorized", () => {
    const result = getOperatorDecisionQualityImplementationGate();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.uiDecision).toBe("not_authorized");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.uiAuthorized).toBe(false);
    expect(result.flags.persistenceEnabled).toBe(false);
    expect(result.flags.outreachEnabled).toBe(false);
  });

  it("keeps UI write save API database schema mapper scoring storage lead CRM and audit flags false", () => {
    const flags = getOperatorDecisionQualityImplementationGate().flags;

    expect(flags.uiCreated).toBe(false);
    expect(flags.reviewSurfaceCreated).toBe(false);
    expect(flags.savePathImplemented).toBe(false);
    expect(flags.saveButtonCreated).toBe(false);
    expect(flags.saveHandlerCreated).toBe(false);
    expect(flags.apiRouteCreated).toBe(false);
    expect(flags.apiWriteEnabled).toBe(false);
    expect(flags.apiLeadsPostEnabled).toBe(false);
    expect(flags.databaseWriteEnabled).toBe(false);
    expect(flags.prismaWriteEnabled).toBe(false);
    expect(flags.schemaCreated).toBe(false);
    expect(flags.zodSchemaCreated).toBe(false);
    expect(flags.mapperCreated).toBe(false);
    expect(flags.validationRuntimeEnabled).toBe(false);
    expect(flags.safeParseWired).toBe(false);
    expect(flags.scoringEnabled).toBe(false);
    expect(flags.hiddenScoringEnabled).toBe(false);
    expect(flags.autonomousPrioritizationEnabled).toBe(false);
    expect(flags.storageEnabled).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
  });

  it("keeps provider email SMS calling domain runtime routing automation and spend flags false", () => {
    const flags = getOperatorDecisionQualityImplementationGate().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
    expect(flags.emailSendingEnabled).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.customEmailActivated).toBe(false);
    expect(flags.phoneNumberActivated).toBe(false);
    expect(flags.smsNumberActivated).toBe(false);
    expect(flags.gpsTrackingEnabled).toBe(false);
    expect(flags.mapEnabled).toBe(false);
    expect(flags.routePlanningEnabled).toBe(false);
    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.publicRecordConnectorsEnabled).toBe(false);
    expect(flags.externalLookupEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.enrichmentEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.routingEnabled).toBe(false);
    expect(flags.assignmentEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.followUpAutomationEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.acquisitionExecutionAuthorized).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.communicationVolumeIncreaseAuthorized).toBe(false);
    expect(flags.leadVolumeAutomationEnabled).toBe(false);
    expect(flags.propertyFactsInvented).toBe(false);
  });

  it("defines all implementation gate lanes", () => {
    const result = getOperatorDecisionQualityImplementationGate();

    expect(result.implementationGateLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "lead_worthiness_display_scope",
        "blocker_display_scope",
        "missing_data_display_scope",
        "source_provenance_display_scope",
        "review_ready_display_scope",
        "operator_next_action_display_scope",
        "ai_assist_explanation_scope",
        "no_score_no_routing_boundary",
        "no_write_no_lead_boundary",
        "communication_identity_deferred_boundary",
        "a4_3_readiness",
      ]),
    );
  });

  it("covers worthiness blockers missing data source provenance review readiness next action and AI explanation scope", () => {
    const result = getOperatorDecisionQualityImplementationGate();
    const laneText = result.implementationGateLanes
      .flatMap((lane) => [lane.lane, ...lane.futureScope, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/why this lead matters/i);
    expect(laneText).toMatch(/Blocker display scope/i);
    expect(laneText).toMatch(/Missing-data display scope/i);
    expect(laneText).toMatch(/Source\/provenance display scope/i);
    expect(laneText).toMatch(/Review-ready display scope/i);
    expect(laneText).toMatch(/what is safe to review next/i);
    expect(laneText).toMatch(/AI assist may explain and summarize only/i);
  });

  it("keeps AI assist explainable and non-executing", () => {
    const result = getOperatorDecisionQualityImplementationGate();
    const doctrineText = result.implementationGateDoctrine.join(" ");

    expect(doctrineText).toMatch(/AI may assist with explanations, summaries, and decision prompts only/i);
    expect(doctrineText).toMatch(/No hidden scoring, autonomous prioritization, CRM movement, seller contact/i);
    expect(doctrineText).toMatch(/why this lead matters, what is blocked, what is missing/i);
    expect(doctrineText).toMatch(/D4D save path remains deferred/i);
  });

  it("includes the highest ROI route through communication identity and go-live gates", () => {
    const result = getOperatorDecisionQualityImplementationGate();
    const phases = result.highestRoiRouteAfterA42.map((routePhase) => routePhase.phase);

    expect(phases).toEqual([
      "A4.3 Operator Decision Quality Review Surface Planning",
      "A4.4 Operator Decision Quality UI Draft",
      "A4.5 Operator Decision Quality Safety And Usability Review",
      "A4.6 Operator Decision Quality Minimal Implementation Gate",
      "C5 Communication Identity And Domain Planning",
      "C5.1 Business Number Text/Call Identity Planning",
      "C5.2 Consent, DNC, Opt-Out, And Sender Policy Review",
      "C6 Controlled Communication Infrastructure Gate",
      "C6.1 Human-Triggered Provider Pilot Planning",
      "Go-Live Readiness Gate",
    ]);

    const routeText = result.highestRoiRouteAfterA42
      .flatMap((routePhase) => [routePhase.phase, routePhase.purpose, ...routePhase.blockedCapabilities])
      .join(" ");

    expect(routeText).toMatch(/SPF\/DKIM\/DMARC/i);
    expect(routeText).toMatch(/10DLC\/TCPA/i);
    expect(routeText).toMatch(/human-triggered/i);
    expect(routeText).toMatch(/Go-Live Readiness Gate/i);
  });

  it("summarizes A4.2 gate and includes A4.3 next", () => {
    const result = getOperatorDecisionQualityImplementationGate();
    const summary = summarizeOperatorDecisionQualityImplementationGate(result);

    expect(summary).toMatch(/Selected implementation scope is operator_review_clarity_only/i);
    expect(summary).toMatch(/Implementation decision is not_authorized/i);
    expect(summary).toMatch(/UI decision is not_authorized/i);
    expect(summary).toMatch(/persistence decision is not_authorized/i);
    expect(summary).toMatch(/communication decision is not_authorized/i);
    expect(summary).toMatch(/why the lead matters, what is blocked, what is missing/i);
    expect(summary).toMatch(/No UI, implementation, save path/i);
    expect(summary).toMatch(/C5 domain\/email planning/i);
    expect(summary).toMatch(/C5\.1 number text\/call planning/i);
    expect(summary).toMatch(/Go-Live Readiness Gate/i);
    expect(summary).toMatch(/Next stage: A4\.3 Operator Decision Quality Review Surface Planning/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "uiCreated",
      "apiWriteEnabled",
      "leadCreationEnabled",
      "scoringEnabled",
      "routingEnabled",
      "providerActivated",
      "emailSendingEnabled",
      "outboundSmsEnabled",
      "callingEnabled",
      "domainActivated",
      "runtimeJobsEnabled",
      "automationEnabled",
      "spendIncreaseAuthorized",
      "approvalGrantsExecution",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getOperatorDecisionQualityImplementationGate(),
        flags: {
          ...operatorDecisionQualityImplementationGateFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertOperatorDecisionQualityImplementationGateSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions become authorized", () => {
    const implementationUnsafe = {
      ...getOperatorDecisionQualityImplementationGate(),
      implementationDecision: "authorized" as "not_authorized",
    };
    const uiUnsafe = {
      ...getOperatorDecisionQualityImplementationGate(),
      uiDecision: "authorized" as "not_authorized",
    };
    const persistenceUnsafe = {
      ...getOperatorDecisionQualityImplementationGate(),
      persistenceDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getOperatorDecisionQualityImplementationGate(),
      communicationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertOperatorDecisionQualityImplementationGateSafe(implementationUnsafe)).toThrow(/implementation decision/i);
    expect(() => assertOperatorDecisionQualityImplementationGateSafe(uiUnsafe)).toThrow(/UI decision/i);
    expect(() => assertOperatorDecisionQualityImplementationGateSafe(persistenceUnsafe)).toThrow(/persistence decision/i);
    expect(() => assertOperatorDecisionQualityImplementationGateSafe(communicationUnsafe)).toThrow(/communication decision/i);
  });

  it("fails invariant checks if the roadmap skips A4.3", () => {
    const unsafeResult = {
      ...getOperatorDecisionQualityImplementationGate(),
      recommendedNextExactStep: "A4.4 Operator Decision Quality UI Draft" as "A4.3 Operator Decision Quality Review Surface Planning",
    };

    expect(() => assertOperatorDecisionQualityImplementationGateSafe(unsafeResult)).toThrow(/A4.3 Operator Decision Quality Review Surface Planning/i);
  });
});
