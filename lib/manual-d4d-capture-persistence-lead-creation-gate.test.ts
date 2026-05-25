import {
  assertManualD4dCapturePersistenceLeadCreationGateSafe,
  getManualD4dCapturePersistenceLeadCreationGate,
  manualD4dCapturePersistenceLeadCreationGateFlags,
  summarizeManualD4dCapturePersistenceLeadCreationGate,
} from "./manual-d4d-capture-persistence-lead-creation-gate";

describe("manual D4D capture persistence and lead creation gate", () => {
  it("creates a planning-only A3.8 persistence and lead creation gate", () => {
    const result = getManualD4dCapturePersistenceLeadCreationGate();

    expect(result.phase).toBe("A3.8 Manual D4D Capture Persistence And Lead Creation Gate");
    expect(result.manualD4dPersistenceLeadCreationGateStatus).toBe("planning_only");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.leadCreationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("A3.9 Manual D4D Capture Data Mapping Review");
    expect(result.nextStageRecommendation).toBe("A3.9 Manual D4D Capture Data Mapping Review");
  });

  it("keeps the gate read-only advisory-only and planning-only", () => {
    const result = getManualD4dCapturePersistenceLeadCreationGate();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps persistence localStorage API database schema save lead creation CRM and audit flags false", () => {
    const flags = getManualD4dCapturePersistenceLeadCreationGate().flags;

    expect(flags.persistenceAuthorized).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
    expect(flags.legacyLeadsStorageWriteEnabled).toBe(false);
    expect(flags.apiWriteEnabled).toBe(false);
    expect(flags.apiLeadsPostEnabled).toBe(false);
    expect(flags.databaseWriteEnabled).toBe(false);
    expect(flags.prismaWriteEnabled).toBe(false);
    expect(flags.schemaCreated).toBe(false);
    expect(flags.zodSchemaCreated).toBe(false);
    expect(flags.routeChanged).toBe(false);
    expect(flags.saveEnabled).toBe(false);
    expect(flags.formSubmitEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.manualCaptureCreatesRecord).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
  });

  it("keeps provider outreach map GPS queue runtime automation and approval execution flags false", () => {
    const flags = getManualD4dCapturePersistenceLeadCreationGate().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
    expect(flags.gpsTrackingEnabled).toBe(false);
    expect(flags.mapEnabled).toBe(false);
    expect(flags.routePlanningEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.assignmentEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.propertyFactsInvented).toBe(false);
  });

  it("defines every required gate lane", () => {
    const result = getManualD4dCapturePersistenceLeadCreationGate();

    expect(result.gateLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "local_draft_state_review",
        "legacy_localstorage_boundary",
        "database_api_lead_creation_boundary",
        "stored_lead_field_mapping_risk",
        "source_provenance_requirement",
        "duplicate_property_first_blocker_review",
        "missing_owner_contact_blocker_review",
        "audit_write_boundary",
        "approval_separation",
        "a3_9_data_mapping_readiness",
      ]),
    );
  });

  it("keeps local draft state from becoming storage or lead creation", () => {
    const lane = getManualD4dCapturePersistenceLeadCreationGate().gateLanes.find(
      (item) => item.lane === "local_draft_state_review",
    );

    expect(lane?.items).toEqual(expect.arrayContaining(["A3.6 local React state", "screen-only draft preview"]));
    expect(lane?.governanceRule).toMatch(/cannot become storage or lead creation/i);
  });

  it("blocks legacy localStorage leads-storage API database Prisma and lead creation targets", () => {
    const result = getManualD4dCapturePersistenceLeadCreationGate();
    const laneText = result.gateLanes.flatMap((lane) => [...lane.items, lane.governanceRule]).join(" ");

    expect(laneText).toMatch(/localStorage/i);
    expect(laneText).toMatch(/leads-storage/i);
    expect(laneText).toMatch(/\/api\/leads/i);
    expect(laneText).toMatch(/Prisma/i);
    expect(laneText).toMatch(/database/i);
    expect(laneText).toMatch(/lead creation remains blocked/i);
  });

  it("requires source provenance and blocker visibility before future mapping work", () => {
    const result = getManualD4dCapturePersistenceLeadCreationGate();
    const sourceLane = result.gateLanes.find((item) => item.lane === "source_provenance_requirement");
    const duplicateLane = result.gateLanes.find((item) => item.lane === "duplicate_property_first_blocker_review");
    const missingContactLane = result.gateLanes.find((item) => item.lane === "missing_owner_contact_blocker_review");

    expect(sourceLane?.governanceRule).toMatch(/before any future data mapping/i);
    expect(duplicateLane?.governanceRule).toMatch(/cannot be bypassed/i);
    expect(missingContactLane?.governanceRule).toMatch(/cannot trigger lookup, skip tracing, outreach, enrichment, or lead creation/i);
  });

  it("keeps audit writing and approval separate from execution", () => {
    const result = getManualD4dCapturePersistenceLeadCreationGate();
    const auditLane = result.gateLanes.find((item) => item.lane === "audit_write_boundary");
    const approvalLane = result.gateLanes.find((item) => item.lane === "approval_separation");

    expect(auditLane?.governanceRule).toMatch(/cannot write audit records/i);
    expect(approvalLane?.governanceRule).toMatch(/Approval cannot grant save, persistence, lead creation/i);
  });

  it("summarizes no persistence localStorage API Prisma lead creation CRM mutation and next stage", () => {
    const result = getManualD4dCapturePersistenceLeadCreationGate();
    const summary = summarizeManualD4dCapturePersistenceLeadCreationGate(result);

    expect(summary).toMatch(/no persistence/i);
    expect(summary).toMatch(/no localStorage writes/i);
    expect(summary).toMatch(/no leads-storage writes/i);
    expect(summary).toMatch(/no \/api\/leads calls/i);
    expect(summary).toMatch(/no Prisma or database writes/i);
    expect(summary).toMatch(/no lead creation/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/Next stage: A3\.9 Manual D4D Capture Data Mapping Review/i);
  });

  it("fails invariant checks if any write storage API database schema route or lead creation flag drifts true", () => {
    const unsafeResult = {
      ...getManualD4dCapturePersistenceLeadCreationGate(),
      flags: {
        ...manualD4dCapturePersistenceLeadCreationGateFlags,
        apiLeadsPostEnabled: true,
      },
    };

    expect(() => assertManualD4dCapturePersistenceLeadCreationGateSafe(unsafeResult)).toThrow(/cannot authorize writes/i);
  });

  it("fails invariant checks if persistence or lead creation decisions become authorized", () => {
    const persistenceUnsafe = {
      ...getManualD4dCapturePersistenceLeadCreationGate(),
      persistenceDecision: "authorized" as "not_authorized",
    };
    const leadUnsafe = {
      ...getManualD4dCapturePersistenceLeadCreationGate(),
      leadCreationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertManualD4dCapturePersistenceLeadCreationGateSafe(persistenceUnsafe)).toThrow(/persistence decision/i);
    expect(() => assertManualD4dCapturePersistenceLeadCreationGateSafe(leadUnsafe)).toThrow(/lead creation decision/i);
  });

  it("fails invariant checks if the roadmap skips A3.9", () => {
    const unsafeResult = {
      ...getManualD4dCapturePersistenceLeadCreationGate(),
      recommendedNextExactStep: "A3.10 Manual D4D Capture Save Flow" as "A3.9 Manual D4D Capture Data Mapping Review",
    };

    expect(() => assertManualD4dCapturePersistenceLeadCreationGateSafe(unsafeResult)).toThrow(/A3.9 Manual D4D Capture Data Mapping Review/i);
  });
});
