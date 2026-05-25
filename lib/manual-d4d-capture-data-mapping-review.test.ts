import {
  assertManualD4dCaptureDataMappingReviewSafe,
  getManualD4dCaptureDataMappingReview,
  manualD4dCaptureDataMappingReviewFlags,
  summarizeManualD4dCaptureDataMappingReview,
} from "./manual-d4d-capture-data-mapping-review";

describe("manual D4D capture data mapping review", () => {
  it("creates a planning-only A3.9 data mapping review", () => {
    const result = getManualD4dCaptureDataMappingReview();

    expect(result.phase).toBe("A3.9 Manual D4D Capture Data Mapping Review");
    expect(result.manualD4dDataMappingReviewStatus).toBe("planning_only");
    expect(result.mappingDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("A3.10 Manual D4D Capture ROI Stop/Go Review");
    expect(result.nextStageRecommendation).toBe("A3.10 Manual D4D Capture ROI Stop/Go Review");
  });

  it("keeps the review read-only advisory-only and planning-only", () => {
    const result = getManualD4dCaptureDataMappingReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps mapping schema validation storage API database and lead creation flags false", () => {
    const flags = getManualD4dCaptureDataMappingReview().flags;

    expect(flags.mapperCreated).toBe(false);
    expect(flags.mappingImplemented).toBe(false);
    expect(flags.storedLeadConstructed).toBe(false);
    expect(flags.schemaCreated).toBe(false);
    expect(flags.zodSchemaCreated).toBe(false);
    expect(flags.validationRuntimeEnabled).toBe(false);
    expect(flags.safeParseWired).toBe(false);
    expect(flags.storageEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
    expect(flags.apiWriteEnabled).toBe(false);
    expect(flags.apiLeadsPostEnabled).toBe(false);
    expect(flags.databaseWriteEnabled).toBe(false);
    expect(flags.prismaWriteEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.manualCaptureCreatesRecord).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
  });

  it("keeps provider outreach map GPS runtime queue assignment automation and approval execution flags false", () => {
    const flags = getManualD4dCaptureDataMappingReview().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.gpsTrackingEnabled).toBe(false);
    expect(flags.mapEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.assignmentEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.propertyFactsInvented).toBe(false);
  });

  it("defines every required data mapping lane", () => {
    const result = getManualD4dCaptureDataMappingReview();

    expect(result.dataMappingLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "draft_field_inventory",
        "stored_lead_required_field_gaps",
        "source_provenance_mapping",
        "property_address_city_state_zip_mapping",
        "field_note_to_situation_details_risk",
        "distress_tag_mapping_risk",
        "missing_seller_contact_blocker",
        "property_first_blocker",
        "duplicate_review_blocker",
        "no_mapper_no_schema_no_write_boundary",
      ]),
    );
  });

  it("covers draft fields and StoredLead gaps without constructing a lead", () => {
    const result = getManualD4dCaptureDataMappingReview();
    const draftLane = result.dataMappingLanes.find((lane) => lane.lane === "draft_field_inventory");
    const gapLane = result.dataMappingLanes.find((lane) => lane.lane === "stored_lead_required_field_gaps");

    expect(draftLane?.items).toEqual(
      expect.arrayContaining([
        "property address",
        "city",
        "state",
        "ZIP",
        "source",
        "observation date",
        "field note",
        "optional distress tags",
        "operator note",
        "review status",
        "provenance note",
      ]),
    );
    expect(draftLane?.governanceRule).toMatch(/cannot become a mapper/i);
    expect(gapLane?.items).toEqual(expect.arrayContaining(["firstName missing", "phone missing", "ownerName missing"]));
    expect(gapLane?.governanceRule).toMatch(/cannot construct a StoredLead object/i);
  });

  it("keeps source provenance address notes distress tags missing contact property-first and duplicate blockers visible", () => {
    const result = getManualD4dCaptureDataMappingReview();
    const laneText = result.dataMappingLanes.flatMap((lane) => [...lane.items, lane.governanceRule]).join(" ");

    expect(laneText).toMatch(/manual D4D source label/i);
    expect(laneText).toMatch(/provenance note/i);
    expect(laneText).toMatch(/propertyAddress candidate/i);
    expect(laneText).toMatch(/field note may resemble situationDetails/i);
    expect(laneText).toMatch(/distressFlags mismatch/i);
    expect(laneText).toMatch(/missing phone/i);
    expect(laneText).toMatch(/property-first draft/i);
    expect(laneText).toMatch(/duplicate property review/i);
  });

  it("keeps mapping from writing schema API Prisma lead creation CRM mutation or outreach", () => {
    const boundaryLane = getManualD4dCaptureDataMappingReview().dataMappingLanes.find(
      (lane) => lane.lane === "no_mapper_no_schema_no_write_boundary",
    );

    expect(boundaryLane?.items).toEqual(
      expect.arrayContaining(["no conversion function", "no schema", "no runtime validation", "no storage", "no /api/leads", "no Prisma"]),
    );
    expect(boundaryLane?.governanceRule).toMatch(/cannot create mappers, schemas, validators, API calls/i);
  });

  it("summarizes no mapper schema persistence API Prisma lead creation CRM mutation and next stage", () => {
    const result = getManualD4dCaptureDataMappingReview();
    const summary = summarizeManualD4dCaptureDataMappingReview(result);

    expect(summary).toMatch(/no mapper/i);
    expect(summary).toMatch(/no schema/i);
    expect(summary).toMatch(/no persistence/i);
    expect(summary).toMatch(/no \/api\/leads calls/i);
    expect(summary).toMatch(/no Prisma or database writes/i);
    expect(summary).toMatch(/no lead creation/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/Next stage: A3\.10 Manual D4D Capture ROI Stop\/Go Review/i);
  });

  it("fails invariant checks if any mapping schema storage API database lead creation or runtime flag drifts true", () => {
    const unsafeResult = {
      ...getManualD4dCaptureDataMappingReview(),
      flags: {
        ...manualD4dCaptureDataMappingReviewFlags,
        mapperCreated: true,
      },
    };

    expect(() => assertManualD4dCaptureDataMappingReviewSafe(unsafeResult)).toThrow(/cannot authorize mappers/i);
  });

  it("fails invariant checks if mapping decision becomes authorized", () => {
    const unsafeResult = {
      ...getManualD4dCaptureDataMappingReview(),
      mappingDecision: "authorized" as "not_authorized",
    };

    expect(() => assertManualD4dCaptureDataMappingReviewSafe(unsafeResult)).toThrow(/mapping decision/i);
  });

  it("fails invariant checks if roadmap skips A3.10", () => {
    const unsafeResult = {
      ...getManualD4dCaptureDataMappingReview(),
      recommendedNextExactStep: "A3.11 Manual D4D Capture Final Implementation Gate" as "A3.10 Manual D4D Capture ROI Stop/Go Review",
    };

    expect(() => assertManualD4dCaptureDataMappingReviewSafe(unsafeResult)).toThrow(/A3.10 Manual D4D Capture ROI Stop\/Go Review/i);
  });
});
