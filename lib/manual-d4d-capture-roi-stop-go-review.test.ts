import {
  assertManualD4dCaptureRoiStopGoReviewSafe,
  getManualD4dCaptureRoiStopGoReview,
  manualD4dCaptureRoiStopGoReviewFlags,
  summarizeManualD4dCaptureRoiStopGoReview,
} from "./manual-d4d-capture-roi-stop-go-review";

describe("manual D4D capture ROI stop/go review", () => {
  it("creates a planning-only A3.10 ROI stop/go review", () => {
    const result = getManualD4dCaptureRoiStopGoReview();

    expect(result.phase).toBe("A3.10 Manual D4D Capture ROI Stop/Go Review");
    expect(result.manualD4dRoiStopGoStatus).toBe("planning_only");
    expect(result.limitedManualCaptureMvpDecision).toBe("allowed_for_ui_only");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.leadCreationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("A3.11 Manual D4D Capture Final Implementation Gate");
    expect(result.nextStageRecommendation).toBe("A3.11 Manual D4D Capture Final Implementation Gate");
  });

  it("keeps the review read-only advisory-only and planning-only", () => {
    const result = getManualD4dCaptureRoiStopGoReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("allows UI-only limited MVP review while blocking writes", () => {
    const result = getManualD4dCaptureRoiStopGoReview();

    expect(result.flags.limitedUiMvpAllowed).toBe(true);
    expect(result.limitedManualCaptureMvpDecision).toBe("allowed_for_ui_only");
    expect(result.persistenceDecision).toBe("not_authorized");
    expect(result.leadCreationDecision).toBe("not_authorized");
  });

  it("keeps storage API database Prisma schema lead CRM and audit flags false", () => {
    const flags = getManualD4dCaptureRoiStopGoReview().flags;

    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
    expect(flags.apiWriteEnabled).toBe(false);
    expect(flags.apiLeadsPostEnabled).toBe(false);
    expect(flags.databaseWriteEnabled).toBe(false);
    expect(flags.prismaWriteEnabled).toBe(false);
    expect(flags.schemaCreated).toBe(false);
    expect(flags.zodSchemaCreated).toBe(false);
    expect(flags.validationRuntimeEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.manualCaptureCreatesRecord).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
  });

  it("keeps provider outreach maps GPS queue assignment runtime automation and approval execution flags false", () => {
    const flags = getManualD4dCaptureRoiStopGoReview().flags;

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
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.leadVolumeAutomationEnabled).toBe(false);
  });

  it("defines every required ROI stop/go lane", () => {
    const result = getManualD4dCaptureRoiStopGoReview();

    expect(result.roiStopGoLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "governance_sufficiency_review",
        "operator_bottleneck_evidence",
        "cheaper_alternative_comparison",
        "source_import_cleanup_comparison",
        "public_records_referral_comparison",
        "limited_mvp_boundary",
        "no_write_no_lead_boundary",
        "property_first_missing_contact_blocker_preservation",
        "final_implementation_gate_readiness",
      ]),
    );
  });

  it("compares D4D against cheaper acquisition bottleneck fixes", () => {
    const result = getManualD4dCaptureRoiStopGoReview();
    const laneText = result.roiStopGoLanes.flatMap((lane) => [...lane.items, lane.roiRule]).join(" ");

    expect(laneText).toMatch(/manual imports/i);
    expect(laneText).toMatch(/spreadsheet cleanup/i);
    expect(laneText).toMatch(/source quality/i);
    expect(laneText).toMatch(/duplicate cleanup/i);
    expect(laneText).toMatch(/property-first cleanup/i);
    expect(laneText).toMatch(/public-record export review/i);
    expect(laneText).toMatch(/referral intake/i);
    expect(laneText).toMatch(/operator evidence/i);
  });

  it("keeps the limited MVP boundary UI-only", () => {
    const result = getManualD4dCaptureRoiStopGoReview();
    const limitedLane = result.roiStopGoLanes.find((lane) => lane.lane === "limited_mvp_boundary");
    const noWriteLane = result.roiStopGoLanes.find((lane) => lane.lane === "no_write_no_lead_boundary");

    expect(limitedLane?.items).toEqual(
      expect.arrayContaining(["UI-only manual capture", "local screen state", "manual review preview", "no write target"]),
    );
    expect(limitedLane?.roiRule).toMatch(/not saves, records, APIs, or CRM mutation/i);
    expect(noWriteLane?.roiRule).toMatch(/No ROI finding in A3.10 can authorize writes/i);
  });

  it("preserves property-first missing contact and duplicate blockers", () => {
    const blockerLane = getManualD4dCaptureRoiStopGoReview().roiStopGoLanes.find(
      (lane) => lane.lane === "property_first_missing_contact_blocker_preservation",
    );

    expect(blockerLane?.items).toEqual(
      expect.arrayContaining(["property-first blocker", "missing phone/email blocker", "missing owner blocker", "duplicate blocker"]),
    );
    expect(blockerLane?.roiRule).toMatch(/cannot be bypassed/i);
  });

  it("summarizes UI-only MVP safety and no persistence or lead creation", () => {
    const result = getManualD4dCaptureRoiStopGoReview();
    const summary = summarizeManualD4dCaptureRoiStopGoReview(result);

    expect(summary).toMatch(/safe only as UI\/manual review/i);
    expect(summary).toMatch(/no persistence/i);
    expect(summary).toMatch(/no localStorage writes/i);
    expect(summary).toMatch(/no \/api\/leads calls/i);
    expect(summary).toMatch(/no Prisma or database writes/i);
    expect(summary).toMatch(/no lead creation/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/Next stage: A3\.11 Manual D4D Capture Final Implementation Gate/i);
  });

  it("fails invariant checks if write lead provider runtime or approval execution flags drift true", () => {
    const unsafeResult = {
      ...getManualD4dCaptureRoiStopGoReview(),
      flags: {
        ...manualD4dCaptureRoiStopGoReviewFlags,
        leadCreationEnabled: true,
      },
    };

    expect(() => assertManualD4dCaptureRoiStopGoReviewSafe(unsafeResult)).toThrow(/cannot authorize writes/i);
  });

  it("fails invariant checks if limited MVP is not UI-only", () => {
    const unsafeResult = {
      ...getManualD4dCaptureRoiStopGoReview(),
      limitedManualCaptureMvpDecision: "not_authorized_for_writes" as const,
    };

    expect(() => assertManualD4dCaptureRoiStopGoReviewSafe(unsafeResult)).toThrow(/allowed_for_ui_only/i);
  });

  it("fails invariant checks if persistence or lead creation decisions drift authorized", () => {
    const persistenceUnsafe = {
      ...getManualD4dCaptureRoiStopGoReview(),
      persistenceDecision: "authorized" as "not_authorized",
    };
    const leadUnsafe = {
      ...getManualD4dCaptureRoiStopGoReview(),
      leadCreationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertManualD4dCaptureRoiStopGoReviewSafe(persistenceUnsafe)).toThrow(/persistence decision/i);
    expect(() => assertManualD4dCaptureRoiStopGoReviewSafe(leadUnsafe)).toThrow(/lead creation decision/i);
  });

  it("fails invariant checks if the roadmap skips A3.11", () => {
    const unsafeResult = {
      ...getManualD4dCaptureRoiStopGoReview(),
      recommendedNextExactStep: "A3.12 Manual D4D Capture Minimal Save Prototype Planning" as "A3.11 Manual D4D Capture Final Implementation Gate",
    };

    expect(() => assertManualD4dCaptureRoiStopGoReviewSafe(unsafeResult)).toThrow(/A3.11 Manual D4D Capture Final Implementation Gate/i);
  });
});
