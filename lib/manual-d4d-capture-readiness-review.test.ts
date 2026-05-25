import {
  assertManualD4dCaptureReadinessReviewSafe,
  getManualD4dCaptureReadinessReview,
  manualD4dCaptureReadinessReviewFlags,
  summarizeManualD4dCaptureReadinessReview,
} from "./manual-d4d-capture-readiness-review";

describe("manual D4D capture readiness review", () => {
  it("creates a planning-only A3.4 manual D4D capture readiness review", () => {
    const result = getManualD4dCaptureReadinessReview();

    expect(result.phase).toBe("A3.4 Manual D4D Capture Readiness Review");
    expect(result.manualD4dCaptureReadinessReviewStatus).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("A3.5 Manual D4D Capture Implementation Gate");
    expect(result.nextStageRecommendation).toBe("A3.5 Manual D4D Capture Implementation Gate");
  });

  it("keeps A3.4 read-only advisory-only and planning-only", () => {
    const result = getManualD4dCaptureReadinessReview();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps implementation UI route schema validation capture and storage flags false", () => {
    const flags = getManualD4dCaptureReadinessReview().flags;

    expect(flags.implementationAuthorized).toBe(false);
    expect(flags.readinessGrantsImplementation).toBe(false);
    expect(flags.uiComponentCreated).toBe(false);
    expect(flags.formCreated).toBe(false);
    expect(flags.routeChanged).toBe(false);
    expect(flags.apiHandlerEnabled).toBe(false);
    expect(flags.schemaCreated).toBe(false);
    expect(flags.zodSchemaCreated).toBe(false);
    expect(flags.runtimeValidatorEnabled).toBe(false);
    expect(flags.safeParseWired).toBe(false);
    expect(flags.formValidationEnabled).toBe(false);
    expect(flags.captureExecutionEnabled).toBe(false);
    expect(flags.manualCaptureCreatesRecord).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
  });

  it("keeps maps GPS provider outreach CRM runtime automation and property invention flags false", () => {
    const flags = getManualD4dCaptureReadinessReview().flags;

    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.crmAutomationEnabled).toBe(false);
    expect(flags.gpsTrackingEnabled).toBe(false);
    expect(flags.locationTrackingEnabled).toBe(false);
    expect(flags.mapEnabled).toBe(false);
    expect(flags.routePlanningEnabled).toBe(false);
    expect(flags.mapCrawlingEnabled).toBe(false);
    expect(flags.streetViewAutomationEnabled).toBe(false);
    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.externalLookupEnabled).toBe(false);
    expect(flags.externalApiEnabled).toBe(false);
    expect(flags.fetchNetworkEnabled).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.enrichmentEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.routingEnabled).toBe(false);
    expect(flags.assignmentEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.vectorDatabaseEnabled).toBe(false);
    expect(flags.embeddingsEnabled).toBe(false);
    expect(flags.autonomousAcquisitionEnabled).toBe(false);
    expect(flags.autonomousOutreachEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.propertyFactsInvented).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.leadVolumeIncreaseAuthorized).toBe(false);
  });

  it("defines all required readiness review lanes", () => {
    const result = getManualD4dCaptureReadinessReview();

    expect(result.readinessReviewLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "field_shape_readiness",
        "ui_planning_readiness",
        "validation_planning_readiness",
        "source_provenance_readiness",
        "blocker_visibility",
        "property_first_safety",
        "duplicate_review_safety",
        "no_map_no_gps_safety",
        "no_storage_no_runtime_safety",
        "implementation_gate_readiness",
      ]),
    );
  });

  it("defines readiness blockers for source fields distress property-first duplicate storage validation and GPS drift", () => {
    const result = getManualD4dCaptureReadinessReview();

    expect(result.readinessBlockers).toEqual(
      expect.arrayContaining([
        "missing source/provenance",
        "unclear required fields",
        "unreviewed distress tags",
        "property-first contact gaps",
        "duplicate uncertainty",
        "missing owner/contact",
        "execution-like UI wording",
        "validation-runtime drift",
        "storage drift",
        "GPS/map drift",
      ]),
    );
  });

  it("keeps field-shape readiness from creating records storage or capture execution", () => {
    const result = getManualD4dCaptureReadinessReview();
    const lane = result.readinessReviewLanes.find((item) => item.lane === "field_shape_readiness");

    expect(lane?.governanceRule).toMatch(/cannot create records, save data, or execute capture/i);
  });

  it("keeps UI planning readiness from creating components forms routes handlers or controls", () => {
    const result = getManualD4dCaptureReadinessReview();
    const lane = result.readinessReviewLanes.find((item) => item.lane === "ui_planning_readiness");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "mobile-first UI plan reviewed",
        "plain manual-review copy reviewed",
        "execution-like wording blocked",
        "future UI remains unimplemented",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot create components, forms, routes, click handlers, or action controls/i);
  });

  it("keeps validation planning readiness from Zod safeParse forms routes and API handlers", () => {
    const result = getManualD4dCaptureReadinessReview();
    const lane = result.readinessReviewLanes.find((item) => item.lane === "validation_planning_readiness");

    expect(lane?.governanceRule).toMatch(/cannot create Zod schemas, runtime validators, safeParse wiring, form validation, routes, or API handlers/i);
  });

  it("keeps source provenance readiness from source inference overwrite autofill or hidden context", () => {
    const result = getManualD4dCaptureReadinessReview();
    const lane = result.readinessReviewLanes.find((item) => item.lane === "source_provenance_readiness");

    expect(lane?.governanceRule).toMatch(/cannot infer, overwrite, auto-fill, or hide source context/i);
  });

  it("keeps blocker visibility non-bypassable and separate from approval save contact or execution authority", () => {
    const result = getManualD4dCaptureReadinessReview();
    const lane = result.readinessReviewLanes.find((item) => item.lane === "blocker_visibility");

    expect(lane?.governanceRule).toMatch(/cannot become approval, save, contact, or execution authority/i);
  });

  it("keeps property-first safety from seller contact tracing enrichment providers messaging and calling", () => {
    const result = getManualD4dCaptureReadinessReview();
    const lane = result.readinessReviewLanes.find((item) => item.lane === "property_first_safety");

    expect(lane?.governanceRule).toMatch(/cannot trigger seller contact, skip tracing, enrichment, provider activation, messaging, or calling/i);
  });

  it("keeps duplicate review safety from merge delete create persist route assign import or mutation", () => {
    const result = getManualD4dCaptureReadinessReview();
    const lane = result.readinessReviewLanes.find((item) => item.lane === "duplicate_review_safety");

    expect(lane?.governanceRule).toMatch(/cannot merge, delete, create, persist, route, assign, import, or mutate lead records/i);
  });

  it("keeps no-map no-GPS safety from maps location routes scraping APIs and fetch", () => {
    const result = getManualD4dCaptureReadinessReview();
    const lane = result.readinessReviewLanes.find((item) => item.lane === "no_map_no_gps_safety");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "GPS/map drift blocked",
        "no GPS tracking",
        "no map UI",
        "no route planning",
        "no location trail",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot authorize maps, GPS, location tracking, route planning, map crawling, Street View automation, scraping, external APIs, or fetch\/network behavior/i);
  });

  it("keeps no-storage no-runtime safety from storage validation runtime jobs CRM queues and reminders", () => {
    const result = getManualD4dCaptureReadinessReview();
    const lane = result.readinessReviewLanes.find((item) => item.lane === "no_storage_no_runtime_safety");

    expect(lane?.governanceRule).toMatch(/cannot authorize storage, localStorage, persistence, audit writing, runtime validation, runtime jobs, CRM mutation, queues, assignments, or reminders/i);
  });

  it("keeps implementation gate readiness separate from actual implementation and execution", () => {
    const result = getManualD4dCaptureReadinessReview();
    const lane = result.readinessReviewLanes.find((item) => item.lane === "implementation_gate_readiness");

    expect(lane?.governanceRule).toMatch(/may recommend an implementation gate only/i);
    expect(lane?.governanceRule).toMatch(/cannot authorize implementation, UI, validation, capture, storage, lead creation, contact, routing, or providers/i);
  });

  it("defines readiness doctrine as review-only with no implementation capture storage contact or provider authority", () => {
    const result = getManualD4dCaptureReadinessReview();
    const doctrine = result.readinessDoctrine.join(" ");

    expect(doctrine).toMatch(/Readiness is review-only/i);
    expect(doctrine).toMatch(/does not authorize implementation/i);
    expect(doctrine).toMatch(/does not authorize capture/i);
    expect(doctrine).toMatch(/does not authorize save behavior/i);
    expect(doctrine).toMatch(/does not authorize lead creation/i);
    expect(doctrine).toMatch(/does not authorize contact/i);
    expect(doctrine).toMatch(/does not authorize routing/i);
    expect(doctrine).toMatch(/does not authorize storage/i);
    expect(doctrine).toMatch(/does not authorize validation runtime/i);
    expect(doctrine).toMatch(/does not authorize provider activation/i);
  });

  it("forbids readiness drift into implementation UI validation storage outreach and automation", () => {
    const result = getManualD4dCaptureReadinessReview();

    expect(result.forbiddenReadinessDrift).toEqual(
      expect.arrayContaining([
        "UI component creation",
        "form creation",
        "route changes",
        "API handlers",
        "schema creation",
        "Zod schema creation",
        "runtime validation",
        "safeParse wiring",
        "storage",
        "lead creation",
        "manual capture record creation",
        "localStorage writes",
        "CRM mutation",
        "maps/GPS",
        "outreach",
        "providers",
        "queues",
        "assignments",
        "reminders",
        "runtime jobs",
        "automation",
        "property fact invention",
      ]),
    );
  });

  it("classifies A3.4 findings by implementation priority and scope", () => {
    const result = getManualD4dCaptureReadinessReview();
    const categories = result.findings.map((finding) => finding.category);

    expect(categories).toEqual(
      expect.arrayContaining([
        "required_before_implementation",
        "safe_to_include_now",
        "future_upgrade",
        "optional_optimization",
        "out_of_scope",
      ]),
    );
    expect(result.findings.some((finding) => finding.finding.includes("implementation remains separately gated"))).toBe(true);
  });

  it("asserts invariants and summarizes the next stage", () => {
    const result = getManualD4dCaptureReadinessReview();

    expect(() => assertManualD4dCaptureReadinessReviewSafe(result)).not.toThrow();
    expect(summarizeManualD4dCaptureReadinessReview(result)).toMatch(/Readiness is review-only/i);
    expect(summarizeManualD4dCaptureReadinessReview(result)).toMatch(/does not authorize implementation/i);
    expect(summarizeManualD4dCaptureReadinessReview(result)).toMatch(/capture/i);
    expect(summarizeManualD4dCaptureReadinessReview(result)).toMatch(/storage/i);
    expect(summarizeManualD4dCaptureReadinessReview(result)).toMatch(/contact/i);
    expect(summarizeManualD4dCaptureReadinessReview(result)).toMatch(/Next stage: A3\.5 Manual D4D Capture Implementation Gate/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getManualD4dCaptureReadinessReview(),
      flags: {
        ...manualD4dCaptureReadinessReviewFlags,
        implementationAuthorized: true,
      },
    };

    expect(() => assertManualD4dCaptureReadinessReviewSafe(unsafeResult)).toThrow(/cannot authorize implementation/i);
  });

  it("fails invariant checks if readiness status drifts beyond planning", () => {
    const unsafeResult = {
      ...getManualD4dCaptureReadinessReview(),
      manualD4dCaptureReadinessReviewStatus: "needs_operator_readiness_review" as const,
    };

    expect(() => assertManualD4dCaptureReadinessReviewSafe(unsafeResult)).toThrow(/cannot become execution-ready readiness/i);
  });

  it("fails invariant checks if readiness grants capture authority", () => {
    const unsafeResult = {
      ...getManualD4dCaptureReadinessReview(),
      flags: {
        ...manualD4dCaptureReadinessReviewFlags,
        readinessGrantsCapture: true,
      },
    };

    expect(() => assertManualD4dCaptureReadinessReviewSafe(unsafeResult)).toThrow(/capture execution/i);
  });

  it("fails invariant checks if the roadmap skips A3.5", () => {
    const unsafeResult = {
      ...getManualD4dCaptureReadinessReview(),
      recommendedNextExactStep: "A3.6 Manual D4D Capture Implementation" as "A3.5 Manual D4D Capture Implementation Gate",
    };

    expect(() => assertManualD4dCaptureReadinessReviewSafe(unsafeResult)).toThrow(/A3.5 Manual D4D Capture Implementation Gate/i);
  });

  it("fails invariant checks if the next stage recommendation is missing", () => {
    const unsafeResult = {
      ...getManualD4dCaptureReadinessReview(),
      nextStageRecommendation: "Stop And Reassess ROI" as "A3.5 Manual D4D Capture Implementation Gate",
    };

    expect(() => assertManualD4dCaptureReadinessReviewSafe(unsafeResult)).toThrow(/next stage recommendation/i);
  });
});
