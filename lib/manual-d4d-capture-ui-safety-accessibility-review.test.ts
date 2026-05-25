import {
  assertManualD4dCaptureUiSafetyAccessibilityReviewSafe,
  getManualD4dCaptureUiSafetyAccessibilityReview,
  manualD4dCaptureUiSafetyAccessibilityReviewFlags,
  summarizeManualD4dCaptureUiSafetyAccessibilityReview,
} from "./manual-d4d-capture-ui-safety-accessibility-review";

describe("manual D4D capture UI safety and accessibility review", () => {
  it("creates a planning-only A3.7 safety/accessibility review", () => {
    const result = getManualD4dCaptureUiSafetyAccessibilityReview();

    expect(result.phase).toBe("A3.7 Manual D4D Capture UI Safety And Accessibility Review");
    expect(result.manualD4dUiSafetyAccessibilityStatus).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("A3.8 Manual D4D Capture Persistence And Lead Creation Gate");
    expect(result.nextStageRecommendation).toBe("A3.8 Manual D4D Capture Persistence And Lead Creation Gate");
  });

  it("keeps the review read-only advisory-only and planning-only", () => {
    const result = getManualD4dCaptureUiSafetyAccessibilityReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps all execution storage provider and automation flags false", () => {
    const flags = getManualD4dCaptureUiSafetyAccessibilityReview().flags;

    expect(flags.uiExecutionAuthorized).toBe(false);
    expect(flags.captureExecutionEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.manualCaptureCreatesRecord).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.routeChanged).toBe(false);
    expect(flags.apiHandlerEnabled).toBe(false);
    expect(flags.schemaCreated).toBe(false);
    expect(flags.zodSchemaCreated).toBe(false);
    expect(flags.runtimeValidatorEnabled).toBe(false);
    expect(flags.safeParseWired).toBe(false);
    expect(flags.formSubmitEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.gpsTrackingEnabled).toBe(false);
    expect(flags.mapEnabled).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.assignmentEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.autonomousAcquisitionEnabled).toBe(false);
    expect(flags.autonomousOutreachEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.propertyFactsInvented).toBe(false);
  });

  it("defines accessibility and safety lanes for the current UI draft", () => {
    const result = getManualD4dCaptureUiSafetyAccessibilityReview();

    expect(result.safetyAccessibilityLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "visible_labels",
        "guidance_text",
        "dynamic_review_messages",
        "keyboard_usability",
        "disabled_action_clarity",
        "safety_copy",
        "blocker_visibility",
        "no_storage_no_runtime_boundary",
        "next_stage_readiness",
      ]),
    );
  });

  it("requires visible labels input guidance live dynamic messages and disabled action clarity", () => {
    const result = getManualD4dCaptureUiSafetyAccessibilityReview();
    const laneText = result.safetyAccessibilityLanes.flatMap((lane) => [...lane.items, lane.governanceRule]).join(" ");

    expect(laneText).toMatch(/visible label/i);
    expect(laneText).toMatch(/required for review/i);
    expect(laneText).toMatch(/polite live region/i);
    expect(laneText).toMatch(/native inputs/i);
    expect(laneText).toMatch(/disabled explanation/i);
    expect(laneText).toMatch(/draft only/i);
  });

  it("keeps blocker visibility separate from review status and draft completion", () => {
    const result = getManualD4dCaptureUiSafetyAccessibilityReview();
    const blockerLane = result.safetyAccessibilityLanes.find((lane) => lane.lane === "blocker_visibility");

    expect(blockerLane?.items).toEqual(
      expect.arrayContaining([
        "property-first blocker",
        "duplicate review blocker",
        "missing owner blocker",
        "distress verification blocker",
      ]),
    );
    expect(blockerLane?.governanceRule).toMatch(/cannot be bypassed/i);
  });

  it("keeps no-storage and no-runtime boundaries explicit", () => {
    const result = getManualD4dCaptureUiSafetyAccessibilityReview();
    const boundaryLane = result.safetyAccessibilityLanes.find((lane) => lane.lane === "no_storage_no_runtime_boundary");

    expect(boundaryLane?.items).toEqual(
      expect.arrayContaining([
        "no localStorage writes",
        "no persistence",
        "no API handler",
        "no schema or runtime validator",
        "no fetch/network behavior",
      ]),
    );
  });

  it("summarizes no storage no lead creation no outreach no maps/GPS and the next stage", () => {
    const result = getManualD4dCaptureUiSafetyAccessibilityReview();
    const summary = summarizeManualD4dCaptureUiSafetyAccessibilityReview(result);

    expect(summary).toMatch(/does not authorize storage/i);
    expect(summary).toMatch(/lead creation/i);
    expect(summary).toMatch(/outreach/i);
    expect(summary).toMatch(/maps\/GPS/i);
    expect(summary).toMatch(/Next stage: A3\.8 Manual D4D Capture Persistence And Lead Creation Gate/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getManualD4dCaptureUiSafetyAccessibilityReview(),
      flags: {
        ...manualD4dCaptureUiSafetyAccessibilityReviewFlags,
        localStorageWriteEnabled: true,
      },
    };

    expect(() => assertManualD4dCaptureUiSafetyAccessibilityReviewSafe(unsafeResult)).toThrow(/cannot authorize/i);
  });

  it("fails invariant checks if status becomes execution-ready", () => {
    const unsafeResult = {
      ...getManualD4dCaptureUiSafetyAccessibilityReview(),
      manualD4dUiSafetyAccessibilityStatus: "needs_ui_hardening_review" as const,
    };

    expect(() => assertManualD4dCaptureUiSafetyAccessibilityReviewSafe(unsafeResult)).toThrow(/execution-ready/i);
  });

  it("fails invariant checks if the roadmap skips A3.8", () => {
    const unsafeResult = {
      ...getManualD4dCaptureUiSafetyAccessibilityReview(),
      recommendedNextExactStep: "A3.9 Manual D4D Capture Save Flow" as "A3.8 Manual D4D Capture Persistence And Lead Creation Gate",
    };

    expect(() => assertManualD4dCaptureUiSafetyAccessibilityReviewSafe(unsafeResult)).toThrow(/A3.8 Manual D4D Capture/i);
  });
});
