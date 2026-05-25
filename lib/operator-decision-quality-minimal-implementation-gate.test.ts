import {
  assertOperatorDecisionQualityMinimalImplementationGateSafe,
  getOperatorDecisionQualityMinimalImplementationGate,
  operatorDecisionQualityMinimalImplementationGateFlags,
  summarizeOperatorDecisionQualityMinimalImplementationGate,
} from "./operator-decision-quality-minimal-implementation-gate";

describe("operator decision quality minimal implementation gate", () => {
  it("creates a planning-only A4.6 minimal implementation gate contract", () => {
    const result = getOperatorDecisionQualityMinimalImplementationGate();

    expect(result.phase).toBe("A4.6 Operator Decision Quality Minimal Implementation Gate");
    expect(result.operatorDecisionQualityMinimalImplementationGateStatus).toBe("planning_only");
    expect(result.selectedMinimalScope).toBe("existing_operator_review_surface_only");
    expect(result.uiOnlyDecision).toBe("authorized_for_existing_review_surface_only");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.leadCreationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("C5 Communication Identity And Domain Planning");
    expect(result.nextStageRecommendation).toBe("C5 Communication Identity And Domain Planning");
  });

  it("keeps A4.6 read-only advisory-only and planning-only", () => {
    const result = getOperatorDecisionQualityMinimalImplementationGate();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("limits the UI-only decision to the existing review surface", () => {
    const result = getOperatorDecisionQualityMinimalImplementationGate();
    const doctrineText = result.minimalImplementationDoctrine.join(" ");

    expect(result.selectedMinimalScope).toBe("existing_operator_review_surface_only");
    expect(result.uiOnlyDecision).toBe("authorized_for_existing_review_surface_only");
    expect(doctrineText).toMatch(/confirms only the existing review-only/i);
    expect(doctrineText).toMatch(/No new UI expansion/i);
    expect(doctrineText).toMatch(/Decision quality remains the ROI priority/i);
  });

  it("keeps persistence lead creation and communication not authorized", () => {
    const result = getOperatorDecisionQualityMinimalImplementationGate();

    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.leadCreationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.flags.persistenceEnabled).toBe(false);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
  });

  it("defines all minimal implementation gate lanes", () => {
    const result = getOperatorDecisionQualityMinimalImplementationGate();

    expect(result.minimalImplementationGateLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "a4_4_ui_draft_confirmation",
        "a4_5_safety_usability_confirmation",
        "lead_worthiness_clarity",
        "blocker_visibility",
        "missing_data_clarity",
        "source_provenance_clarity",
        "ai_assist_explanation_boundary",
        "no_score_no_routing_boundary",
        "no_write_no_lead_boundary",
        "communication_identity_planning_readiness",
      ]),
    );
  });

  it("references A4.4 and A4.5 prerequisites and preserves review clarity", () => {
    const result = getOperatorDecisionQualityMinimalImplementationGate();
    const laneText = result.minimalImplementationGateLanes
      .flatMap((lane) => [lane.lane, ...lane.confirmationFocus, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/existing A4\.4 UI-only draft/i);
    expect(laneText).toMatch(/A4\.5 safety review/i);
    expect(laneText).toMatch(/why this lead matters/i);
    expect(laneText).toMatch(/DNC/i);
    expect(laneText).toMatch(/missing owner/i);
    expect(laneText).toMatch(/source attribution/i);
    expect(laneText).toMatch(/explainable operator assist/i);
    expect(laneText).toMatch(/no scoring/i);
    expect(laneText).toMatch(/no save path/i);
    expect(laneText).toMatch(/C5 domain planning/i);
  });

  it("keeps write API database schema mapper scoring storage lead CRM and audit flags false", () => {
    const flags = getOperatorDecisionQualityMinimalImplementationGate().flags;

    expect(flags.reviewSurfaceWritesEnabled).toBe(false);
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
    expect(flags.storageEnabled).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
  });

  it("keeps UI expansion routing provider communication domain runtime automation and spend flags false", () => {
    const flags = getOperatorDecisionQualityMinimalImplementationGate().flags;

    expect(flags.implementationAuthorized).toBe(false);
    expect(flags.uiExpansionAuthorized).toBe(false);
    expect(flags.newUiCreated).toBe(false);
    expect(flags.componentCreated).toBe(false);
    expect(flags.formCreated).toBe(false);
    expect(flags.routeChanged).toBe(false);
    expect(flags.routingEnabled).toBe(false);
    expect(flags.assignmentEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
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
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.communicationVolumeIncreaseAuthorized).toBe(false);
    expect(flags.propertyFactsInvented).toBe(false);
  });

  it("keeps lookup maps scraping enrichment approval and execution flags false", () => {
    const flags = getOperatorDecisionQualityMinimalImplementationGate().flags;

    expect(flags.gpsTrackingEnabled).toBe(false);
    expect(flags.mapEnabled).toBe(false);
    expect(flags.routePlanningEnabled).toBe(false);
    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.publicRecordConnectorsEnabled).toBe(false);
    expect(flags.externalLookupEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.enrichmentEnabled).toBe(false);
    expect(flags.followUpAutomationEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.acquisitionExecutionAuthorized).toBe(false);
    expect(flags.leadVolumeAutomationEnabled).toBe(false);
  });

  it("summarizes existing UI-only scope and C5 next stage", () => {
    const result = getOperatorDecisionQualityMinimalImplementationGate();
    const summary = summarizeOperatorDecisionQualityMinimalImplementationGate(result);

    expect(summary).toMatch(/existing UI-only operator decision quality review surface/i);
    expect(summary).toMatch(/UI-only decision is authorized_for_existing_review_surface_only/i);
    expect(summary).toMatch(/persistence decision is not_authorized/i);
    expect(summary).toMatch(/lead creation decision is not_authorized/i);
    expect(summary).toMatch(/communication decision is not_authorized/i);
    expect(summary).toMatch(/A4\.4 UI draft confirmation/i);
    expect(summary).toMatch(/A4\.5 safety\/usability confirmation/i);
    expect(summary).toMatch(/no scoring\/routing/i);
    expect(summary).toMatch(/no writes\/leads/i);
    expect(summary).toMatch(/No new UI expansion/i);
    expect(summary).toMatch(/Next stage: C5 Communication Identity And Domain Planning/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "uiExpansionAuthorized",
      "newUiCreated",
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
      "propertyFactsInvented",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getOperatorDecisionQualityMinimalImplementationGate(),
        flags: {
          ...operatorDecisionQualityMinimalImplementationGateFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertOperatorDecisionQualityMinimalImplementationGateSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions or status drift", () => {
    const statusUnsafe = {
      ...getOperatorDecisionQualityMinimalImplementationGate(),
      operatorDecisionQualityMinimalImplementationGateStatus: "ui_only_review_surface_confirmed" as "planning_only",
    };
    const scopeUnsafe = {
      ...getOperatorDecisionQualityMinimalImplementationGate(),
      selectedMinimalScope: "expanded_review_surface" as "existing_operator_review_surface_only",
    };
    const uiUnsafe = {
      ...getOperatorDecisionQualityMinimalImplementationGate(),
      uiOnlyDecision: "authorized_for_expansion" as "authorized_for_existing_review_surface_only",
    };
    const persistenceUnsafe = {
      ...getOperatorDecisionQualityMinimalImplementationGate(),
      persistenceDecision: "authorized" as "not_authorized",
    };
    const leadUnsafe = {
      ...getOperatorDecisionQualityMinimalImplementationGate(),
      leadCreationDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getOperatorDecisionQualityMinimalImplementationGate(),
      communicationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertOperatorDecisionQualityMinimalImplementationGateSafe(statusUnsafe)).toThrow(/cannot become implementation-ready/i);
    expect(() => assertOperatorDecisionQualityMinimalImplementationGateSafe(scopeUnsafe)).toThrow(/selected minimal scope/i);
    expect(() => assertOperatorDecisionQualityMinimalImplementationGateSafe(uiUnsafe)).toThrow(/UI-only decision/i);
    expect(() => assertOperatorDecisionQualityMinimalImplementationGateSafe(persistenceUnsafe)).toThrow(/persistence decision/i);
    expect(() => assertOperatorDecisionQualityMinimalImplementationGateSafe(leadUnsafe)).toThrow(/lead creation decision/i);
    expect(() => assertOperatorDecisionQualityMinimalImplementationGateSafe(communicationUnsafe)).toThrow(/communication decision/i);
  });

  it("fails invariant checks if the roadmap skips C5", () => {
    const unsafeResult = {
      ...getOperatorDecisionQualityMinimalImplementationGate(),
      recommendedNextExactStep: "C6 Controlled Communication Infrastructure Gate" as "C5 Communication Identity And Domain Planning",
    };

    expect(() => assertOperatorDecisionQualityMinimalImplementationGateSafe(unsafeResult)).toThrow(/C5 Communication Identity And Domain Planning/i);
  });
});
