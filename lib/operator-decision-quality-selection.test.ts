import {
  assertOperatorDecisionQualitySelectionSafe,
  getOperatorDecisionQualitySelection,
  operatorDecisionQualitySelectionFlags,
  summarizeOperatorDecisionQualitySelection,
} from "./operator-decision-quality-selection";

describe("operator decision quality selection", () => {
  it("creates a planning-only A4.1 operator decision quality selection contract", () => {
    const result = getOperatorDecisionQualitySelection();

    expect(result.phase).toBe("A4.1 Operator Decision Quality Selection");
    expect(result.operatorDecisionQualitySelectionStatus).toBe("planning_only");
    expect(result.selectedBottleneck).toBe("operator_decision_quality");
    expect(result.d4dSavePathDecision).toBe("not_authorized");
    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("A4.2 Operator Decision Quality Implementation Gate");
    expect(result.nextStageRecommendation).toBe("A4.2 Operator Decision Quality Implementation Gate");
  });

  it("keeps A4.1 read-only advisory-only and planning-only", () => {
    const result = getOperatorDecisionQualitySelection();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps D4D save path and implementation not authorized", () => {
    const result = getOperatorDecisionQualitySelection();

    expect(result.d4dSavePathDecision).toBe("not_authorized");
    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.flags.d4dSavePathAuthorized).toBe(false);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.implementationStarted).toBe(false);
  });

  it("keeps implementation write save API database schema mapper storage lead CRM and audit flags false", () => {
    const flags = getOperatorDecisionQualitySelection().flags;

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
    expect(flags.storageEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
  });

  it("keeps provider outreach maps GPS scraping enrichment runtime queue routing assignment reminder automation and spend flags false", () => {
    const flags = getOperatorDecisionQualitySelection().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
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

  it("defines all decision-quality selection lanes", () => {
    const result = getOperatorDecisionQualitySelection();

    expect(result.selectionLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "lead_worthiness_clarity",
        "blocker_clarity",
        "missing_data_clarity",
        "source_provenance_clarity",
        "review_ready_clarity",
        "operator_next_action_clarity",
        "import_cleanup_comparison",
        "source_quality_comparison",
        "public_records_referral_comparison",
        "d4d_save_path_deferral",
        "no_execution_boundary",
      ]),
    );
  });

  it("covers worthiness blockers missing data source provenance review readiness and next manual action", () => {
    const result = getOperatorDecisionQualitySelection();
    const laneText = result.selectionLanes
      .flatMap((lane) => [lane.lane, ...lane.decisionValue, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/why the lead matters/i);
    expect(laneText).toMatch(/Blocker clarity/i);
    expect(laneText).toMatch(/Missing-data clarity/i);
    expect(laneText).toMatch(/Source and provenance clarity/i);
    expect(laneText).toMatch(/Review-ready clarity/i);
    expect(laneText).toMatch(/what to review next/i);
    expect(laneText).toMatch(/what to fix manually/i);
  });

  it("still compares import cleanup source quality public records referrals operator throughput and D4D save work", () => {
    const result = getOperatorDecisionQualitySelection();
    const laneText = result.selectionLanes
      .flatMap((lane) => [lane.lane, ...lane.decisionValue, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/Import cleanup/i);
    expect(laneText).toMatch(/Source quality/i);
    expect(laneText).toMatch(/Public records and referrals/i);
    expect(laneText).toMatch(/manual relationship sourcing/i);
    expect(laneText).toMatch(/Operator Decision Quality|operator decision quality|operator/i);
    expect(laneText).toMatch(/D4D save work remains deferred/i);
  });

  it("prioritizes decision quality per operator hour without increasing spend or communication volume", () => {
    const result = getOperatorDecisionQualitySelection();
    const doctrineText = result.decisionQualityDoctrine.join(" ");

    expect(doctrineText).toMatch(/improves decisions per operator hour/i);
    expect(doctrineText).toMatch(/not just task cost/i);
    expect(doctrineText).toMatch(/Cheapest bottleneck remains a comparison input/i);
    expect(doctrineText).toMatch(/what matters, what is blocked, what is missing/i);
    expect(doctrineText).toMatch(/Spend and communication volume must not increase/i);
  });

  it("summarizes Operator Decision Quality selection and includes A4.2 next", () => {
    const result = getOperatorDecisionQualitySelection();
    const summary = summarizeOperatorDecisionQualitySelection(result);

    expect(summary).toMatch(/Selected bottleneck is operator_decision_quality/i);
    expect(summary).toMatch(/decisions per operator hour/i);
    expect(summary).toMatch(/D4D save path decision is not_authorized/i);
    expect(summary).toMatch(/implementation decision is not_authorized/i);
    expect(summary).toMatch(/import cleanup, source quality, public-record review, referrals/i);
    expect(summary).toMatch(/No implementation/i);
    expect(summary).toMatch(/no save path/i);
    expect(summary).toMatch(/no lead creation/i);
    expect(summary).toMatch(/Next stage: A4\.2 Operator Decision Quality Implementation Gate/i);
  });

  it("fails invariant checks if implementation write lead provider runtime automation scraping enrichment spend or approval execution flags drift true", () => {
    const implementationUnsafe = {
      ...getOperatorDecisionQualitySelection(),
      flags: {
        ...operatorDecisionQualitySelectionFlags,
        implementationAuthorized: true,
      },
    };
    const writeUnsafe = {
      ...getOperatorDecisionQualitySelection(),
      flags: {
        ...operatorDecisionQualitySelectionFlags,
        apiWriteEnabled: true,
      },
    };
    const leadUnsafe = {
      ...getOperatorDecisionQualitySelection(),
      flags: {
        ...operatorDecisionQualitySelectionFlags,
        leadCreationEnabled: true,
      },
    };
    const providerUnsafe = {
      ...getOperatorDecisionQualitySelection(),
      flags: {
        ...operatorDecisionQualitySelectionFlags,
        providerActivated: true,
      },
    };
    const runtimeUnsafe = {
      ...getOperatorDecisionQualitySelection(),
      flags: {
        ...operatorDecisionQualitySelectionFlags,
        runtimeJobsEnabled: true,
      },
    };
    const automationUnsafe = {
      ...getOperatorDecisionQualitySelection(),
      flags: {
        ...operatorDecisionQualitySelectionFlags,
        automationEnabled: true,
      },
    };
    const scrapingUnsafe = {
      ...getOperatorDecisionQualitySelection(),
      flags: {
        ...operatorDecisionQualitySelectionFlags,
        scrapingEnabled: true,
      },
    };
    const enrichmentUnsafe = {
      ...getOperatorDecisionQualitySelection(),
      flags: {
        ...operatorDecisionQualitySelectionFlags,
        enrichmentEnabled: true,
      },
    };
    const spendUnsafe = {
      ...getOperatorDecisionQualitySelection(),
      flags: {
        ...operatorDecisionQualitySelectionFlags,
        spendIncreaseAuthorized: true,
      },
    };
    const approvalUnsafe = {
      ...getOperatorDecisionQualitySelection(),
      flags: {
        ...operatorDecisionQualitySelectionFlags,
        approvalGrantsExecution: true,
      },
    };

    expect(() => assertOperatorDecisionQualitySelectionSafe(implementationUnsafe)).toThrow(/implementation/i);
    expect(() => assertOperatorDecisionQualitySelectionSafe(writeUnsafe)).toThrow(/writes/i);
    expect(() => assertOperatorDecisionQualitySelectionSafe(leadUnsafe)).toThrow(/leads/i);
    expect(() => assertOperatorDecisionQualitySelectionSafe(providerUnsafe)).toThrow(/providers/i);
    expect(() => assertOperatorDecisionQualitySelectionSafe(runtimeUnsafe)).toThrow(/runtime/i);
    expect(() => assertOperatorDecisionQualitySelectionSafe(automationUnsafe)).toThrow(/automation/i);
    expect(() => assertOperatorDecisionQualitySelectionSafe(scrapingUnsafe)).toThrow(/scraping/i);
    expect(() => assertOperatorDecisionQualitySelectionSafe(enrichmentUnsafe)).toThrow(/enrichment/i);
    expect(() => assertOperatorDecisionQualitySelectionSafe(spendUnsafe)).toThrow(/spend/i);
    expect(() => assertOperatorDecisionQualitySelectionSafe(approvalUnsafe)).toThrow(/approval-as-execution/i);
  });

  it("fails invariant checks if the selected bottleneck changes", () => {
    const unsafeResult = {
      ...getOperatorDecisionQualitySelection(),
      selectedBottleneck: "cheapest_bottleneck" as "operator_decision_quality",
    };

    expect(() => assertOperatorDecisionQualitySelectionSafe(unsafeResult)).toThrow(/operator_decision_quality/i);
  });

  it("fails invariant checks if decisions become authorized", () => {
    const d4dUnsafe = {
      ...getOperatorDecisionQualitySelection(),
      d4dSavePathDecision: "authorized" as "not_authorized",
    };
    const implementationUnsafe = {
      ...getOperatorDecisionQualitySelection(),
      implementationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertOperatorDecisionQualitySelectionSafe(d4dUnsafe)).toThrow(/D4D save path decision/i);
    expect(() => assertOperatorDecisionQualitySelectionSafe(implementationUnsafe)).toThrow(/implementation decision/i);
  });

  it("fails invariant checks if the roadmap skips A4.2", () => {
    const unsafeResult = {
      ...getOperatorDecisionQualitySelection(),
      recommendedNextExactStep: "A4.2 Save Path Implementation Gate" as "A4.2 Operator Decision Quality Implementation Gate",
    };

    expect(() => assertOperatorDecisionQualitySelectionSafe(unsafeResult)).toThrow(/A4.2 Operator Decision Quality Implementation Gate/i);
  });
});
