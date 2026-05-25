import {
  assertManualD4dCaptureFinalImplementationGateSafe,
  getManualD4dCaptureFinalImplementationGate,
  manualD4dCaptureFinalImplementationGateFlags,
  summarizeManualD4dCaptureFinalImplementationGate,
} from "./manual-d4d-capture-final-implementation-gate";

describe("manual D4D capture final implementation gate", () => {
  it("creates a planning-only A3.11 final implementation gate", () => {
    const result = getManualD4dCaptureFinalImplementationGate();

    expect(result.phase).toBe("A3.11 Manual D4D Capture Final Implementation Gate");
    expect(result.manualD4dFinalImplementationGateStatus).toBe("planning_only");
    expect(result.uiOnlyImplementationDecision).toBe("authorized_for_existing_ui_only");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.leadCreationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("A3.12 Manual D4D Capture Minimal Save Prototype Planning");
    expect(result.nextStageRecommendation).toBe("A3.12 Manual D4D Capture Minimal Save Prototype Planning");
  });

  it("keeps the gate read-only advisory-only and planning-only", () => {
    const result = getManualD4dCaptureFinalImplementationGate();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("authorizes only the existing UI-only manual review scope", () => {
    const result = getManualD4dCaptureFinalImplementationGate();

    expect(result.flags.uiOnlyMvpAuthorized).toBe(true);
    expect(result.flags.implementationBeyondExistingUiAuthorized).toBe(false);
    expect(result.uiOnlyImplementationDecision).toBe("authorized_for_existing_ui_only");
  });

  it("keeps write API database schema mapper lead CRM and audit flags false", () => {
    const flags = getManualD4dCaptureFinalImplementationGate().flags;

    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
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
    expect(flags.manualCaptureCreatesRecord).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
  });

  it("keeps provider outreach maps GPS queue assignment runtime automation and approval execution flags false", () => {
    const flags = getManualD4dCaptureFinalImplementationGate().flags;

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
    expect(flags.assignmentEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.propertyFactsInvented).toBe(false);
  });

  it("references A3.6 through A3.10 prerequisite confirmations", () => {
    const result = getManualD4dCaptureFinalImplementationGate();
    const laneText = result.finalImplementationGateLanes.flatMap((lane) => [lane.lane, ...lane.items, lane.governanceRule]).join(" ");

    expect(laneText).toMatch(/A3\.6 UI draft exists/i);
    expect(laneText).toMatch(/A3\.7/i);
    expect(laneText).toMatch(/A3\.8/i);
    expect(laneText).toMatch(/A3\.9/i);
    expect(laneText).toMatch(/A3\.10/i);
  });

  it("defines UI-only no-write blocker and future save planning boundaries", () => {
    const result = getManualD4dCaptureFinalImplementationGate();

    expect(result.finalImplementationGateLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "ui_only_authorization_boundary",
        "no_write_no_lead_boundary",
        "blocker_preservation",
        "future_save_prototype_planning_boundary",
      ]),
    );

    const uiLane = result.finalImplementationGateLanes.find((lane) => lane.lane === "ui_only_authorization_boundary");
    const writeLane = result.finalImplementationGateLanes.find((lane) => lane.lane === "no_write_no_lead_boundary");
    const blockerLane = result.finalImplementationGateLanes.find((lane) => lane.lane === "blocker_preservation");
    const futureLane = result.finalImplementationGateLanes.find((lane) => lane.lane === "future_save_prototype_planning_boundary");

    expect(uiLane?.governanceRule).toMatch(/limited to the existing UI-only draft surface/i);
    expect(writeLane?.governanceRule).toMatch(/No final implementation gate output can authorize writes/i);
    expect(blockerLane?.items).toEqual(expect.arrayContaining(["property-first blocker", "duplicate blocker", "missing owner/contact blocker"]));
    expect(futureLane?.governanceRule).toMatch(/cannot implement or authorize a save path/i);
  });

  it("summarizes UI-only authorization while blocking persistence and lead creation", () => {
    const result = getManualD4dCaptureFinalImplementationGate();
    const summary = summarizeManualD4dCaptureFinalImplementationGate(result);

    expect(summary).toMatch(/UI-only MVP is authorized only for the existing manual D4D draft surface/i);
    expect(summary).toMatch(/no implementation expansion/i);
    expect(summary).toMatch(/no persistence/i);
    expect(summary).toMatch(/no \/api\/leads calls/i);
    expect(summary).toMatch(/no Prisma or database writes/i);
    expect(summary).toMatch(/no lead creation/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/Next stage: A3\.12 Manual D4D Capture Minimal Save Prototype Planning/i);
  });

  it("fails invariant checks if UI-only expands into writes lead creation providers runtime or property invention", () => {
    const unsafeResult = {
      ...getManualD4dCaptureFinalImplementationGate(),
      flags: {
        ...manualD4dCaptureFinalImplementationGateFlags,
        implementationBeyondExistingUiAuthorized: true,
      },
    };

    expect(() => assertManualD4dCaptureFinalImplementationGateSafe(unsafeResult)).toThrow(/cannot authorize implementation expansion/i);
  });

  it("fails invariant checks if UI-only decision changes", () => {
    const unsafeResult = {
      ...getManualD4dCaptureFinalImplementationGate(),
      uiOnlyImplementationDecision: "blocked" as "authorized_for_existing_ui_only",
    };

    expect(() => assertManualD4dCaptureFinalImplementationGateSafe(unsafeResult)).toThrow(/authorized_for_existing_ui_only/i);
  });

  it("fails invariant checks if persistence or lead creation decisions become authorized", () => {
    const persistenceUnsafe = {
      ...getManualD4dCaptureFinalImplementationGate(),
      persistenceDecision: "authorized" as "not_authorized",
    };
    const leadUnsafe = {
      ...getManualD4dCaptureFinalImplementationGate(),
      leadCreationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertManualD4dCaptureFinalImplementationGateSafe(persistenceUnsafe)).toThrow(/persistence decision/i);
    expect(() => assertManualD4dCaptureFinalImplementationGateSafe(leadUnsafe)).toThrow(/lead creation decision/i);
  });

  it("fails invariant checks if the roadmap skips A3.12", () => {
    const unsafeResult = {
      ...getManualD4dCaptureFinalImplementationGate(),
      recommendedNextExactStep: "A4 Acquisition Bottleneck Reassessment" as "A3.12 Manual D4D Capture Minimal Save Prototype Planning",
    };

    expect(() => assertManualD4dCaptureFinalImplementationGateSafe(unsafeResult)).toThrow(/A3.12 Manual D4D Capture/i);
  });
});
