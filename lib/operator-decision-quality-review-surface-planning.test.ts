import {
  assertOperatorDecisionQualityReviewSurfacePlanningSafe,
  getOperatorDecisionQualityReviewSurfacePlanning,
  operatorDecisionQualityReviewSurfacePlanningFlags,
  summarizeOperatorDecisionQualityReviewSurfacePlanning,
} from "./operator-decision-quality-review-surface-planning";

describe("operator decision quality review surface planning", () => {
  it("creates a planning-only A4.3 operator decision quality review surface planning contract", () => {
    const result = getOperatorDecisionQualityReviewSurfacePlanning();

    expect(result.phase).toBe("A4.3 Operator Decision Quality Review Surface Planning");
    expect(result.operatorDecisionQualityReviewSurfacePlanningStatus).toBe("planning_only");
    expect(result.reviewSurfaceDecision).toBe("not_authorized");
    expect(result.uiDecision).toBe("not_authorized");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("A4.4 Operator Decision Quality UI Draft");
    expect(result.nextStageRecommendation).toBe("A4.4 Operator Decision Quality UI Draft");
  });

  it("keeps A4.3 read-only advisory-only and planning-only", () => {
    const result = getOperatorDecisionQualityReviewSurfacePlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps review surface UI persistence and communication decisions not authorized", () => {
    const result = getOperatorDecisionQualityReviewSurfacePlanning();

    expect(result.reviewSurfaceDecision).toBe("not_authorized");
    expect(result.uiDecision).toBe("not_authorized");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.flags.reviewSurfaceAuthorized).toBe(false);
    expect(result.flags.uiAuthorized).toBe(false);
    expect(result.flags.persistenceEnabled).toBe(false);
    expect(result.flags.outreachEnabled).toBe(false);
  });

  it("keeps UI component form route write save API database schema mapper scoring storage lead CRM and audit flags false", () => {
    const flags = getOperatorDecisionQualityReviewSurfacePlanning().flags;

    expect(flags.reviewSurfaceCreated).toBe(false);
    expect(flags.uiCreated).toBe(false);
    expect(flags.componentCreated).toBe(false);
    expect(flags.formCreated).toBe(false);
    expect(flags.routeChanged).toBe(false);
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

  it("keeps provider email SMS calling domain runtime routing automation and spend flags false", () => {
    const flags = getOperatorDecisionQualityReviewSurfacePlanning().flags;

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

  it("defines all review surface planning lanes", () => {
    const result = getOperatorDecisionQualityReviewSurfacePlanning();

    expect(result.reviewSurfacePlanningLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "lead_worthiness_panel",
        "blocker_visibility_panel",
        "missing_data_panel",
        "source_provenance_panel",
        "review_ready_explanation_panel",
        "safe_manual_next_action_panel",
        "ai_assist_explanation_panel",
        "no_score_no_routing_boundary",
        "no_write_no_lead_boundary",
        "communication_identity_deferred_boundary",
        "a4_4_ui_draft_readiness",
      ]),
    );
  });

  it("covers worthiness blockers missing data source provenance review readiness next action and AI explanation", () => {
    const result = getOperatorDecisionQualityReviewSurfacePlanning();
    const laneText = result.reviewSurfacePlanningLanes
      .flatMap((lane) => [lane.lane, ...lane.plannedPanelContent, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/why this lead matters/i);
    expect(laneText).toMatch(/Blocker visibility/i);
    expect(laneText).toMatch(/Missing-data panel/i);
    expect(laneText).toMatch(/Source\/provenance planning/i);
    expect(laneText).toMatch(/Review-ready explanations/i);
    expect(laneText).toMatch(/what is safe to review next/i);
    expect(laneText).toMatch(/AI assist may explain and summarize only/i);
  });

  it("keeps AI explainable and non-executing", () => {
    const result = getOperatorDecisionQualityReviewSurfacePlanning();
    const doctrineText = result.reviewSurfaceDoctrine.join(" ");

    expect(doctrineText).toMatch(/AI may explain and summarize only/i);
    expect(doctrineText).toMatch(/No hidden scoring, autonomous prioritization, persuasion, seller contact/i);
    expect(doctrineText).toMatch(/why this lead matters, what is blocked, what is missing/i);
    expect(doctrineText).toMatch(/D4D save path remains deferred/i);
    expect(doctrineText).toMatch(/provider activation comes last/i);
  });

  it("summarizes A4.3 planning and includes A4.4 next", () => {
    const result = getOperatorDecisionQualityReviewSurfacePlanning();
    const summary = summarizeOperatorDecisionQualityReviewSurfacePlanning(result);

    expect(summary).toMatch(/Review surface decision is not_authorized/i);
    expect(summary).toMatch(/UI decision is not_authorized/i);
    expect(summary).toMatch(/persistence decision is not_authorized/i);
    expect(summary).toMatch(/communication decision is not_authorized/i);
    expect(summary).toMatch(/lead worthiness, blocker visibility, missing data/i);
    expect(summary).toMatch(/No UI, component, form, route change/i);
    expect(summary).toMatch(/no scoring/i);
    expect(summary).toMatch(/no lead creation/i);
    expect(summary).toMatch(/Next stage: A4\.4 Operator Decision Quality UI Draft/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "reviewSurfaceCreated",
      "uiCreated",
      "componentCreated",
      "formCreated",
      "routeChanged",
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
        ...getOperatorDecisionQualityReviewSurfacePlanning(),
        flags: {
          ...operatorDecisionQualityReviewSurfacePlanningFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertOperatorDecisionQualityReviewSurfacePlanningSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions become authorized", () => {
    const reviewUnsafe = {
      ...getOperatorDecisionQualityReviewSurfacePlanning(),
      reviewSurfaceDecision: "authorized" as "not_authorized",
    };
    const uiUnsafe = {
      ...getOperatorDecisionQualityReviewSurfacePlanning(),
      uiDecision: "authorized" as "not_authorized",
    };
    const persistenceUnsafe = {
      ...getOperatorDecisionQualityReviewSurfacePlanning(),
      persistenceDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getOperatorDecisionQualityReviewSurfacePlanning(),
      communicationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertOperatorDecisionQualityReviewSurfacePlanningSafe(reviewUnsafe)).toThrow(/review surface decision/i);
    expect(() => assertOperatorDecisionQualityReviewSurfacePlanningSafe(uiUnsafe)).toThrow(/UI decision/i);
    expect(() => assertOperatorDecisionQualityReviewSurfacePlanningSafe(persistenceUnsafe)).toThrow(/persistence decision/i);
    expect(() => assertOperatorDecisionQualityReviewSurfacePlanningSafe(communicationUnsafe)).toThrow(/communication decision/i);
  });

  it("fails invariant checks if the roadmap skips A4.4", () => {
    const unsafeResult = {
      ...getOperatorDecisionQualityReviewSurfacePlanning(),
      recommendedNextExactStep: "C5 Communication Identity And Domain Planning" as "A4.4 Operator Decision Quality UI Draft",
    };

    expect(() => assertOperatorDecisionQualityReviewSurfacePlanningSafe(unsafeResult)).toThrow(/A4.4 Operator Decision Quality UI Draft/i);
  });
});
