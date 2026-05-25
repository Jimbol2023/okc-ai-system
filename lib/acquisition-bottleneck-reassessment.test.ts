import {
  acquisitionBottleneckReassessmentFlags,
  assertAcquisitionBottleneckReassessmentSafe,
  getAcquisitionBottleneckReassessment,
  summarizeAcquisitionBottleneckReassessment,
} from "./acquisition-bottleneck-reassessment";

describe("acquisition bottleneck reassessment", () => {
  it("creates a planning-only A4 acquisition bottleneck reassessment contract", () => {
    const result = getAcquisitionBottleneckReassessment();

    expect(result.phase).toBe("A4 Acquisition Bottleneck Reassessment");
    expect(result.acquisitionBottleneckReassessmentStatus).toBe("planning_only");
    expect(result.d4dSavePathDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("A4.1 Cheapest Bottleneck Reducer Selection");
    expect(result.nextStageRecommendation).toBe("A4.1 Cheapest Bottleneck Reducer Selection");
  });

  it("keeps A4 read-only advisory-only and planning-only", () => {
    const result = getAcquisitionBottleneckReassessment();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps the D4D save path not authorized", () => {
    const result = getAcquisitionBottleneckReassessment();

    expect(result.d4dSavePathDecision).toBe("not_authorized");
    expect(result.flags.d4dSavePathAuthorized).toBe(false);
    expect(result.flags.savePathImplemented).toBe(false);
  });

  it("keeps write save API database schema mapper storage lead CRM and audit flags false", () => {
    const flags = getAcquisitionBottleneckReassessment().flags;

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

  it("keeps provider outreach maps GPS scraping runtime queue routing assignment reminder automation and spend flags false", () => {
    const flags = getAcquisitionBottleneckReassessment().flags;

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

  it("defines all reassessment lanes for ROI comparison and A4.1 readiness", () => {
    const result = getAcquisitionBottleneckReassessment();

    expect(result.reassessmentLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "d4d_save_path_roi",
        "import_cleanup_roi",
        "source_quality_roi",
        "public_records_review_roi",
        "referrals_manual_relationship_sourcing_roi",
        "operator_throughput_roi",
        "no_write_no_lead_boundary",
        "acquisition_spend_discipline",
        "a4_1_selection_readiness",
      ]),
    );
  });

  it("compares D4D against import cleanup source quality public records referrals and operator throughput", () => {
    const result = getAcquisitionBottleneckReassessment();
    const laneText = result.reassessmentLanes
      .flatMap((lane) => [lane.lane, ...lane.comparedBottlenecks, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/D4D save work remains blocked/i);
    expect(laneText).toMatch(/Import cleanup/i);
    expect(laneText).toMatch(/Source quality/i);
    expect(laneText).toMatch(/Public-record review/i);
    expect(laneText).toMatch(/Referral and relationship sourcing/i);
    expect(laneText).toMatch(/Operator throughput/i);
    expect(laneText).toMatch(/cannot authorize writes/i);
    expect(laneText).toMatch(/cheapest bottleneck reducer/i);
    expect(laneText).toMatch(/A4\.1 should select/i);
  });

  it("prioritizes cheapest bottleneck reduction before save work", () => {
    const result = getAcquisitionBottleneckReassessment();
    const doctrineText = result.roiDoctrine.join(" ");

    expect(doctrineText).toMatch(/decides priority only/i);
    expect(doctrineText).toMatch(/D4D save work remains blocked until it beats cheaper bottleneck fixes/i);
    expect(doctrineText).toMatch(/cheapest bottleneck reducer/i);
    expect(doctrineText).toMatch(/without increasing spend or communication volume/i);
    expect(doctrineText).toMatch(/Import cleanup, source quality, public-record review, referrals, and operator throughput/i);
    expect(doctrineText).toMatch(/avoid invented property facts/i);
  });

  it("summarizes that no implementation is authorized and includes A4.1 next", () => {
    const result = getAcquisitionBottleneckReassessment();
    const summary = summarizeAcquisitionBottleneckReassessment(result);

    expect(summary).toMatch(/D4D save path decision is not_authorized/i);
    expect(summary).toMatch(/import cleanup, source quality, public-record review, referrals/i);
    expect(summary).toMatch(/operator throughput/i);
    expect(summary).toMatch(/No implementation/i);
    expect(summary).toMatch(/no save path/i);
    expect(summary).toMatch(/no \/api\/leads write/i);
    expect(summary).toMatch(/no lead creation/i);
    expect(summary).toMatch(/no spend increase/i);
    expect(summary).toMatch(/Next stage: A4\.1 Cheapest Bottleneck Reducer Selection/i);
  });

  it("fails invariant checks if write lead provider runtime automation scraping spend or approval execution flags drift true", () => {
    const writeUnsafe = {
      ...getAcquisitionBottleneckReassessment(),
      flags: {
        ...acquisitionBottleneckReassessmentFlags,
        apiWriteEnabled: true,
      },
    };
    const leadUnsafe = {
      ...getAcquisitionBottleneckReassessment(),
      flags: {
        ...acquisitionBottleneckReassessmentFlags,
        leadCreationEnabled: true,
      },
    };
    const providerUnsafe = {
      ...getAcquisitionBottleneckReassessment(),
      flags: {
        ...acquisitionBottleneckReassessmentFlags,
        providerActivated: true,
      },
    };
    const runtimeUnsafe = {
      ...getAcquisitionBottleneckReassessment(),
      flags: {
        ...acquisitionBottleneckReassessmentFlags,
        runtimeJobsEnabled: true,
      },
    };
    const automationUnsafe = {
      ...getAcquisitionBottleneckReassessment(),
      flags: {
        ...acquisitionBottleneckReassessmentFlags,
        automationEnabled: true,
      },
    };
    const scrapingUnsafe = {
      ...getAcquisitionBottleneckReassessment(),
      flags: {
        ...acquisitionBottleneckReassessmentFlags,
        scrapingEnabled: true,
      },
    };
    const spendUnsafe = {
      ...getAcquisitionBottleneckReassessment(),
      flags: {
        ...acquisitionBottleneckReassessmentFlags,
        spendIncreaseAuthorized: true,
      },
    };
    const approvalUnsafe = {
      ...getAcquisitionBottleneckReassessment(),
      flags: {
        ...acquisitionBottleneckReassessmentFlags,
        approvalGrantsExecution: true,
      },
    };

    expect(() => assertAcquisitionBottleneckReassessmentSafe(writeUnsafe)).toThrow(/writes/i);
    expect(() => assertAcquisitionBottleneckReassessmentSafe(leadUnsafe)).toThrow(/leads/i);
    expect(() => assertAcquisitionBottleneckReassessmentSafe(providerUnsafe)).toThrow(/providers/i);
    expect(() => assertAcquisitionBottleneckReassessmentSafe(runtimeUnsafe)).toThrow(/runtime/i);
    expect(() => assertAcquisitionBottleneckReassessmentSafe(automationUnsafe)).toThrow(/automation/i);
    expect(() => assertAcquisitionBottleneckReassessmentSafe(scrapingUnsafe)).toThrow(/scraping/i);
    expect(() => assertAcquisitionBottleneckReassessmentSafe(spendUnsafe)).toThrow(/spend/i);
    expect(() => assertAcquisitionBottleneckReassessmentSafe(approvalUnsafe)).toThrow(/approval-as-execution/i);
  });

  it("fails invariant checks if the D4D save path becomes authorized", () => {
    const unsafeResult = {
      ...getAcquisitionBottleneckReassessment(),
      d4dSavePathDecision: "authorized" as "not_authorized",
    };

    expect(() => assertAcquisitionBottleneckReassessmentSafe(unsafeResult)).toThrow(/D4D save path decision/i);
  });

  it("fails invariant checks if the roadmap skips A4.1", () => {
    const unsafeResult = {
      ...getAcquisitionBottleneckReassessment(),
      recommendedNextExactStep: "A3.13 D4D Save Prototype" as "A4.1 Cheapest Bottleneck Reducer Selection",
    };

    expect(() => assertAcquisitionBottleneckReassessmentSafe(unsafeResult)).toThrow(/A4.1 Cheapest Bottleneck Reducer Selection/i);
  });
});
