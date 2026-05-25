import {
  assertManualD4dCaptureMinimalSavePrototypePlanningSafe,
  getManualD4dCaptureMinimalSavePrototypePlanning,
  manualD4dCaptureMinimalSavePrototypePlanningFlags,
  summarizeManualD4dCaptureMinimalSavePrototypePlanning,
} from "./manual-d4d-capture-minimal-save-prototype-planning";

describe("manual D4D capture minimal save prototype planning", () => {
  it("creates a planning-only A3.12 minimal save prototype planning contract", () => {
    const result = getManualD4dCaptureMinimalSavePrototypePlanning();

    expect(result.phase).toBe("A3.12 Manual D4D Capture Minimal Save Prototype Planning");
    expect(result.manualD4dMinimalSavePrototypePlanningStatus).toBe("planning_only");
    expect(result.savePrototypeDecision).toBe("not_authorized");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.leadCreationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("A4 Acquisition Bottleneck Reassessment");
    expect(result.nextStageRecommendation).toBe("A4 Acquisition Bottleneck Reassessment");
  });

  it("keeps the contract read-only advisory-only and planning-only", () => {
    const result = getManualD4dCaptureMinimalSavePrototypePlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps save persistence and lead creation decisions not authorized", () => {
    const result = getManualD4dCaptureMinimalSavePrototypePlanning();

    expect(result.savePrototypeDecision).toBe("not_authorized");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.leadCreationDecision).toBe("not_authorized");
  });

  it("keeps save write API schema mapper storage lead CRM and audit flags false", () => {
    const flags = getManualD4dCaptureMinimalSavePrototypePlanning().flags;

    expect(flags.savePrototypeImplemented).toBe(false);
    expect(flags.saveButtonCreated).toBe(false);
    expect(flags.saveHandlerCreated).toBe(false);
    expect(flags.apiRouteCreated).toBe(false);
    expect(flags.apiWriteEnabled).toBe(false);
    expect(flags.apiLeadsPostEnabled).toBe(false);
    expect(flags.schemaCreated).toBe(false);
    expect(flags.zodSchemaCreated).toBe(false);
    expect(flags.mapperCreated).toBe(false);
    expect(flags.validationRuntimeEnabled).toBe(false);
    expect(flags.safeParseWired).toBe(false);
    expect(flags.storageEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
    expect(flags.databaseWriteEnabled).toBe(false);
    expect(flags.prismaWriteEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.manualCaptureCreatesRecord).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.rollbackImplemented).toBe(false);
    expect(flags.deleteImplemented).toBe(false);
  });

  it("keeps provider outreach maps GPS runtime queue routing assignment reminder automation and approval execution flags false", () => {
    const flags = getManualD4dCaptureMinimalSavePrototypePlanning().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.gpsTrackingEnabled).toBe(false);
    expect(flags.mapEnabled).toBe(false);
    expect(flags.routePlanningEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.routingEnabled).toBe(false);
    expect(flags.assignmentEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.followUpAutomationEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.propertyFactsInvented).toBe(false);
  });

  it("defines all minimal save prototype planning lanes", () => {
    const result = getManualD4dCaptureMinimalSavePrototypePlanning();

    expect(result.minimalSavePrototypePlanningLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "minimal_write_target_question",
        "draft_to_record_mapping_prerequisite",
        "validation_schema_prerequisite",
        "source_provenance_preservation",
        "property_first_blocker_preservation",
        "duplicate_blocker_preservation",
        "missing_contact_blocker_preservation",
        "audit_trail_prerequisite",
        "rollback_delete_prerequisite",
        "a4_bottleneck_reassessment_readiness",
      ]),
    );
  });

  it("covers write target mapping validation provenance blockers audit rollback delete and A4 readiness", () => {
    const result = getManualD4dCaptureMinimalSavePrototypePlanning();
    const laneText = result.minimalSavePrototypePlanningLanes
      .flatMap((lane) => [lane.lane, ...lane.items, lane.governanceRule])
      .join(" ");

    expect(laneText).toMatch(/smallest future write target|future write target/i);
    expect(laneText).toMatch(/Draft-to-record mapping/i);
    expect(laneText).toMatch(/Validation and schema/i);
    expect(laneText).toMatch(/source and provenance/i);
    expect(laneText).toMatch(/Property-first records remain blocked/i);
    expect(laneText).toMatch(/Duplicate uncertainty/i);
    expect(laneText).toMatch(/Missing-contact blockers/i);
    expect(laneText).toMatch(/Audit trail requirements/i);
    expect(laneText).toMatch(/rollback and delete/i);
    expect(laneText).toMatch(/A4 must reassess/i);
  });

  it("states that A3.12 is planning only and cannot imply outreach routing assignments reminders or follow-up", () => {
    const result = getManualD4dCaptureMinimalSavePrototypePlanning();
    const doctrineText = result.minimalSavePrototypeDoctrine.join(" ");

    expect(doctrineText).toMatch(/plans a future save prototype only/i);
    expect(doctrineText).toMatch(/No save button, handler, API route, schema, mapper, storage/i);
    expect(doctrineText).toMatch(/cannot imply outreach, routing, assignments, reminders, follow-up/i);
    expect(doctrineText).toMatch(/ROI must be reassessed in A4/i);
  });

  it("summarizes that no save prototype is implemented and A4 is next", () => {
    const result = getManualD4dCaptureMinimalSavePrototypePlanning();
    const summary = summarizeManualD4dCaptureMinimalSavePrototypePlanning(result);

    expect(summary).toMatch(/implements no save prototype/i);
    expect(summary).toMatch(/no save button/i);
    expect(summary).toMatch(/no handler/i);
    expect(summary).toMatch(/no \/api\/leads write/i);
    expect(summary).toMatch(/no schema/i);
    expect(summary).toMatch(/no mapper/i);
    expect(summary).toMatch(/no storage/i);
    expect(summary).toMatch(/no lead creation/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/ROI must be reassessed/i);
    expect(summary).toMatch(/Next stage: A4 Acquisition Bottleneck Reassessment/i);
  });

  it("fails invariant checks if a save or write flag drifts true", () => {
    const unsafeResult = {
      ...getManualD4dCaptureMinimalSavePrototypePlanning(),
      flags: {
        ...manualD4dCaptureMinimalSavePrototypePlanningFlags,
        saveHandlerCreated: true,
      },
    };

    expect(() => assertManualD4dCaptureMinimalSavePrototypePlanningSafe(unsafeResult)).toThrow(/cannot authorize save, write/i);
  });

  it("fails invariant checks if lead provider or runtime flags drift true", () => {
    const leadUnsafe = {
      ...getManualD4dCaptureMinimalSavePrototypePlanning(),
      flags: {
        ...manualD4dCaptureMinimalSavePrototypePlanningFlags,
        leadCreationEnabled: true,
      },
    };
    const providerUnsafe = {
      ...getManualD4dCaptureMinimalSavePrototypePlanning(),
      flags: {
        ...manualD4dCaptureMinimalSavePrototypePlanningFlags,
        providerActivated: true,
      },
    };
    const runtimeUnsafe = {
      ...getManualD4dCaptureMinimalSavePrototypePlanning(),
      flags: {
        ...manualD4dCaptureMinimalSavePrototypePlanningFlags,
        runtimeJobsEnabled: true,
      },
    };

    expect(() => assertManualD4dCaptureMinimalSavePrototypePlanningSafe(leadUnsafe)).toThrow(/lead/i);
    expect(() => assertManualD4dCaptureMinimalSavePrototypePlanningSafe(providerUnsafe)).toThrow(/provider/i);
    expect(() => assertManualD4dCaptureMinimalSavePrototypePlanningSafe(runtimeUnsafe)).toThrow(/runtime/i);
  });

  it("fails invariant checks if decisions become authorized", () => {
    const saveUnsafe = {
      ...getManualD4dCaptureMinimalSavePrototypePlanning(),
      savePrototypeDecision: "authorized" as "not_authorized",
    };
    const persistenceUnsafe = {
      ...getManualD4dCaptureMinimalSavePrototypePlanning(),
      persistenceDecision: "authorized" as "not_authorized",
    };
    const leadUnsafe = {
      ...getManualD4dCaptureMinimalSavePrototypePlanning(),
      leadCreationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertManualD4dCaptureMinimalSavePrototypePlanningSafe(saveUnsafe)).toThrow(/save prototype decision/i);
    expect(() => assertManualD4dCaptureMinimalSavePrototypePlanningSafe(persistenceUnsafe)).toThrow(/persistence decision/i);
    expect(() => assertManualD4dCaptureMinimalSavePrototypePlanningSafe(leadUnsafe)).toThrow(/lead creation decision/i);
  });

  it("fails invariant checks if the roadmap skips A4", () => {
    const unsafeResult = {
      ...getManualD4dCaptureMinimalSavePrototypePlanning(),
      recommendedNextExactStep: "A3.13 Save Prototype" as "A4 Acquisition Bottleneck Reassessment",
    };

    expect(() => assertManualD4dCaptureMinimalSavePrototypePlanningSafe(unsafeResult)).toThrow(/A4 Acquisition Bottleneck Reassessment/i);
  });
});
