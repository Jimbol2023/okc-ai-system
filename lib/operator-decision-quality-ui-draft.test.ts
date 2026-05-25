import {
  assertOperatorDecisionQualityUiDraftSafe,
  getOperatorDecisionQualityUiDraft,
  operatorDecisionQualityUiDraftFlags,
  summarizeOperatorDecisionQualityUiDraft,
} from "./operator-decision-quality-ui-draft";

describe("operator decision quality UI draft", () => {
  it("creates a UI-draft-only A4.4 contract", () => {
    const result = getOperatorDecisionQualityUiDraft();

    expect(result.phase).toBe("A4.4 Operator Decision Quality UI Draft");
    expect(result.operatorDecisionQualityUiDraftStatus).toBe("ui_draft_only");
    expect(result.uiDraftDecision).toBe("draft_only");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("A4.5 Operator Decision Quality Safety And Usability Review");
    expect(result.nextStageRecommendation).toBe("A4.5 Operator Decision Quality Safety And Usability Review");
  });

  it("keeps the contract read-only advisory-only and UI-draft-only", () => {
    const result = getOperatorDecisionQualityUiDraft();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.uiDraftOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.uiDraftOnly).toBe(true);
  });

  it("keeps persistence and communication not authorized", () => {
    const result = getOperatorDecisionQualityUiDraft();

    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.flags.persistenceEnabled).toBe(false);
    expect(result.flags.outreachEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
  });

  it("covers all operator decision quality panels", () => {
    const result = getOperatorDecisionQualityUiDraft();

    expect(result.draftPanels.map((panel) => panel.panel)).toEqual(
      expect.arrayContaining([
        "lead_worthiness",
        "blocker_visibility",
        "missing_data",
        "source_provenance",
        "review_readiness",
        "safe_manual_next_action",
        "ai_assist_explanation",
      ]),
    );
  });

  it("keeps draft panels advisory and non-executing", () => {
    const result = getOperatorDecisionQualityUiDraft();
    const panelText = result.draftPanels
      .flatMap((panel) => [panel.label, panel.displayIntent, panel.safetyRule])
      .join(" ");

    expect(panelText).toMatch(/why a lead may deserve manual attention/i);
    expect(panelText).toMatch(/DNC, opt-out, property-first/i);
    expect(panelText).toMatch(/missing phone, email, address/i);
    expect(panelText).toMatch(/source attribution and provenance/i);
    expect(panelText).toMatch(/ready for manual review/i);
    expect(panelText).toMatch(/safest human review focus/i);
    expect(panelText).toMatch(/AI-style reasoning as operator support only/i);
  });

  it("keeps write save API database schema mapper storage lead CRM flags false", () => {
    const flags = getOperatorDecisionQualityUiDraft().flags;

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
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
  });

  it("keeps scoring routing provider communication runtime automation and spend flags false", () => {
    const flags = getOperatorDecisionQualityUiDraft().flags;

    expect(flags.scoringEnabled).toBe(false);
    expect(flags.hiddenScoringEnabled).toBe(false);
    expect(flags.autonomousPrioritizationEnabled).toBe(false);
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
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.propertyFactsInvented).toBe(false);
  });

  it("summarizes UI draft scope and next stage", () => {
    const result = getOperatorDecisionQualityUiDraft();
    const summary = summarizeOperatorDecisionQualityUiDraft(result);

    expect(summary).toMatch(/UI draft decision is draft_only/i);
    expect(summary).toMatch(/persistence decision is not_authorized/i);
    expect(summary).toMatch(/communication decision is not_authorized/i);
    expect(summary).toMatch(/worthiness, blockers, missing data, source\/provenance/i);
    expect(summary).toMatch(/No storage, API write, database write/i);
    expect(summary).toMatch(/no lead creation/i);
    expect(summary).toMatch(/Next stage: A4\.5 Operator Decision Quality Safety And Usability Review/i);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
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
        ...getOperatorDecisionQualityUiDraft(),
        flags: {
          ...operatorDecisionQualityUiDraftFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertOperatorDecisionQualityUiDraftSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if decisions drift", () => {
    const statusUnsafe = {
      ...getOperatorDecisionQualityUiDraft(),
      operatorDecisionQualityUiDraftStatus: "needs_safety_review" as "ui_draft_only",
    };
    const uiUnsafe = {
      ...getOperatorDecisionQualityUiDraft(),
      uiDraftDecision: "authorized" as "draft_only",
    };
    const persistenceUnsafe = {
      ...getOperatorDecisionQualityUiDraft(),
      persistenceDecision: "authorized" as "not_authorized",
    };
    const communicationUnsafe = {
      ...getOperatorDecisionQualityUiDraft(),
      communicationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertOperatorDecisionQualityUiDraftSafe(statusUnsafe)).toThrow(/cannot become implementation-ready/i);
    expect(() => assertOperatorDecisionQualityUiDraftSafe(uiUnsafe)).toThrow(/UI draft decision/i);
    expect(() => assertOperatorDecisionQualityUiDraftSafe(persistenceUnsafe)).toThrow(/persistence decision/i);
    expect(() => assertOperatorDecisionQualityUiDraftSafe(communicationUnsafe)).toThrow(/communication decision/i);
  });

  it("fails invariant checks if the roadmap skips A4.5", () => {
    const unsafeResult = {
      ...getOperatorDecisionQualityUiDraft(),
      recommendedNextExactStep: "C5 Communication Identity And Domain Planning" as "A4.5 Operator Decision Quality Safety And Usability Review",
    };

    expect(() => assertOperatorDecisionQualityUiDraftSafe(unsafeResult)).toThrow(/A4.5 Operator Decision Quality Safety And Usability Review/i);
  });
});
