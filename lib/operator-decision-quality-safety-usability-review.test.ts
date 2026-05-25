import {
  assertOperatorDecisionQualitySafetyUsabilityReviewSafe,
  getOperatorDecisionQualitySafetyUsabilityReview,
  operatorDecisionQualitySafetyUsabilityReviewFlags,
  summarizeOperatorDecisionQualitySafetyUsabilityReview,
} from "./operator-decision-quality-safety-usability-review";

describe("operator decision quality safety and usability review", () => {
  it("creates a planning-only A4.5 safety and usability review contract", () => {
    const result = getOperatorDecisionQualitySafetyUsabilityReview();

    expect(result.phase).toBe("A4.5 Operator Decision Quality Safety And Usability Review");
    expect(result.operatorDecisionQualitySafetyUsabilityReviewStatus).toBe("planning_only");
    expect(result.uiSafetyDecision).toBe("review_only");
    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("A4.6 Operator Decision Quality Minimal Implementation Gate");
    expect(result.nextStageRecommendation).toBe("A4.6 Operator Decision Quality Minimal Implementation Gate");
  });

  it("keeps A4.5 read-only advisory-only and safety-review-only", () => {
    const result = getOperatorDecisionQualitySafetyUsabilityReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.safetyReviewOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.safetyReviewOnly).toBe(true);
  });

  it("keeps implementation persistence and communication not authorized", () => {
    const result = getOperatorDecisionQualitySafetyUsabilityReview();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.persistenceEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
  });

  it("defines all safety and usability review lanes", () => {
    const result = getOperatorDecisionQualitySafetyUsabilityReview();

    expect(result.safetyUsabilityReviewLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "visible_safety_copy",
        "accessible_heading_description_structure",
        "disabled_action_clarity",
        "no_execution_wording",
        "blocker_visibility",
        "source_provenance_visibility",
        "ai_assist_explanation_clarity",
        "mobile_scanability",
        "no_score_no_routing_boundary",
        "no_write_no_lead_boundary",
        "communication_identity_deferred_boundary",
        "a4_6_readiness",
      ]),
    );
  });

  it("covers safety copy accessibility disabled action blockers source AI mobile and boundaries", () => {
    const result = getOperatorDecisionQualitySafetyUsabilityReview();
    const laneText = result.safetyUsabilityReviewLanes
      .flatMap((lane) => [lane.lane, ...lane.reviewFocus, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/manual review only/i);
    expect(laneText).toMatch(/aria-labelledby/i);
    expect(laneText).toMatch(/Review only control/i);
    expect(laneText).toMatch(/no send wording/i);
    expect(laneText).toMatch(/DNC/i);
    expect(laneText).toMatch(/source context/i);
    expect(laneText).toMatch(/AI-style assistance/i);
    expect(laneText).toMatch(/responsive grid/i);
    expect(laneText).toMatch(/no score/i);
    expect(laneText).toMatch(/no storage/i);
    expect(laneText).toMatch(/no provider activation/i);
    expect(laneText).toMatch(/minimal implementation gate/i);
  });

  it("keeps write API database schema mapper scoring storage lead CRM flags false", () => {
    const flags = getOperatorDecisionQualitySafetyUsabilityReview().flags;

    expect(flags.reviewSurfaceWritesEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.storageEnabled).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
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
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
  });

  it("keeps routing provider communication runtime automation and spend flags false", () => {
    const flags = getOperatorDecisionQualitySafetyUsabilityReview().flags;

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
    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.externalLookupEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.enrichmentEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.acquisitionExecutionAuthorized).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.propertyFactsInvented).toBe(false);
  });

  it("summarizes safety review and next stage", () => {
    const result = getOperatorDecisionQualitySafetyUsabilityReview();
    const summary = summarizeOperatorDecisionQualitySafetyUsabilityReview(result);

    expect(summary).toMatch(/UI safety decision is review_only/i);
    expect(summary).toMatch(/implementation decision is not_authorized/i);
    expect(summary).toMatch(/persistence decision is not_authorized/i);
    expect(summary).toMatch(/communication decision is not_authorized/i);
    expect(summary).toMatch(/visible safety copy/i);
    expect(summary).toMatch(/disabled action clarity/i);
    expect(summary).toMatch(/mobile scanability/i);
    expect(summary).toMatch(/No UI expansion/i);
    expect(summary).toMatch(/no writes\/leads/i);
    expect(summary).toMatch(/Next stage: A4\.6 Operator Decision Quality Minimal Implementation Gate/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "uiExpansionAuthorized",
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
        ...getOperatorDecisionQualitySafetyUsabilityReview(),
        flags: {
          ...operatorDecisionQualitySafetyUsabilityReviewFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertOperatorDecisionQualitySafetyUsabilityReviewSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions drift", () => {
    const statusUnsafe = {
      ...getOperatorDecisionQualitySafetyUsabilityReview(),
      operatorDecisionQualitySafetyUsabilityReviewStatus: "ui_safety_reviewed" as "planning_only",
    };
    const uiSafetyUnsafe = {
      ...getOperatorDecisionQualitySafetyUsabilityReview(),
      uiSafetyDecision: "authorized" as "review_only",
    };
    const implementationUnsafe = {
      ...getOperatorDecisionQualitySafetyUsabilityReview(),
      implementationDecision: "authorized" as "not_authorized",
    };
    const persistenceUnsafe = {
      ...getOperatorDecisionQualitySafetyUsabilityReview(),
      persistenceDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getOperatorDecisionQualitySafetyUsabilityReview(),
      communicationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertOperatorDecisionQualitySafetyUsabilityReviewSafe(statusUnsafe)).toThrow(/cannot become implementation-ready/i);
    expect(() => assertOperatorDecisionQualitySafetyUsabilityReviewSafe(uiSafetyUnsafe)).toThrow(/UI safety decision/i);
    expect(() => assertOperatorDecisionQualitySafetyUsabilityReviewSafe(implementationUnsafe)).toThrow(/implementation decision/i);
    expect(() => assertOperatorDecisionQualitySafetyUsabilityReviewSafe(persistenceUnsafe)).toThrow(/persistence decision/i);
    expect(() => assertOperatorDecisionQualitySafetyUsabilityReviewSafe(communicationUnsafe)).toThrow(/communication decision/i);
  });

  it("fails invariant checks if the roadmap skips A4.6", () => {
    const unsafeResult = {
      ...getOperatorDecisionQualitySafetyUsabilityReview(),
      recommendedNextExactStep: "C5 Communication Identity And Domain Planning" as "A4.6 Operator Decision Quality Minimal Implementation Gate",
    };

    expect(() => assertOperatorDecisionQualitySafetyUsabilityReviewSafe(unsafeResult)).toThrow(/A4.6 Operator Decision Quality Minimal Implementation Gate/i);
  });
});
