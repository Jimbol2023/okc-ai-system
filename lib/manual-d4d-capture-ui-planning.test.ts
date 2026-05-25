import {
  assertManualD4dCaptureUiPlanningSafe,
  getManualD4dCaptureUiPlanning,
  manualD4dCaptureUiPlanningFlags,
  summarizeManualD4dCaptureUiPlanning,
} from "./manual-d4d-capture-ui-planning";

describe("manual D4D capture UI planning", () => {
  it("creates a planning-only A3.2 manual D4D capture UI planning contract", () => {
    const result = getManualD4dCaptureUiPlanning();

    expect(result.phase).toBe("A3.2 Manual D4D Capture UI Planning");
    expect(result.manualD4dCaptureUiReadiness).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("A3.3 Manual D4D Capture Validation Planning");
    expect(result.nextStageRecommendation).toBe("A3.3 Manual D4D Capture Validation Planning");
  });

  it("keeps A3.2 read-only advisory-only and planning-only", () => {
    const result = getManualD4dCaptureUiPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps UI component form route API validation capture and storage flags false", () => {
    const flags = getManualD4dCaptureUiPlanning().flags;

    expect(flags.uiComponentCreated).toBe(false);
    expect(flags.formCreated).toBe(false);
    expect(flags.routeChanged).toBe(false);
    expect(flags.apiHandlerEnabled).toBe(false);
    expect(flags.validationRuntimeEnabled).toBe(false);
    expect(flags.captureExecutionEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.manualCaptureCreatesRecord).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
  });

  it("keeps maps GPS route planning external lookup and scraping flags false", () => {
    const flags = getManualD4dCaptureUiPlanning().flags;

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
  });

  it("keeps provider outreach enrichment CRM work management runtime autonomy and volume flags false", () => {
    const flags = getManualD4dCaptureUiPlanning().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.enrichmentEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.crmAutomationEnabled).toBe(false);
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

  it("defines the future UI field plan from A3.1 fields", () => {
    const result = getManualD4dCaptureUiPlanning();

    expect(result.futureUiFieldPlan).toEqual(
      expect.arrayContaining([
        "property address",
        "city",
        "state",
        "zip",
        "source",
        "observation date",
        "field note",
        "optional distress tags",
        "operator note",
        "review status",
        "provenance note",
      ]),
    );
  });

  it("defines all required UI planning lanes", () => {
    const result = getManualD4dCaptureUiPlanning();

    expect(result.uiPlanningLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "mobile_first_field_layout",
        "source_provenance_visibility",
        "required_field_clarity",
        "distress_tag_verification",
        "property_first_warning",
        "duplicate_review_warning",
        "missing_owner_contact_warning",
        "no_map_no_gps_boundary",
        "future_validation_readiness",
      ]),
    );
  });

  it("plans mobile-first layout without creating components forms routes or click handlers", () => {
    const result = getManualD4dCaptureUiPlanning();
    const lane = result.uiPlanningLanes.find((item) => item.lane === "mobile_first_field_layout");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "single-column mobile field order",
        "address fields grouped first",
        "source and provenance visible near the top",
        "review status visible before any future action area",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot create UI components, forms, routes, or click handlers/i);
  });

  it("keeps source and provenance visible in future UI planning", () => {
    const result = getManualD4dCaptureUiPlanning();
    const lane = result.uiPlanningLanes.find((item) => item.lane === "source_provenance_visibility");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "source required",
        "manual D4D source label",
        "observation date",
        "provenance note",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot hide, infer, or overwrite source context/i);
  });

  it("keeps required-field clarity from activating validation runtime save behavior or capture execution", () => {
    const result = getManualD4dCaptureUiPlanning();
    const lane = result.uiPlanningLanes.find((item) => item.lane === "required_field_clarity");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "property address required",
        "city required",
        "state required",
        "zip required",
        "source required",
        "observation note needed",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot activate validation runtime, save behavior, capture execution, or record creation/i);
  });

  it("requires distress tag verification without valuation contact or autonomous acquisition", () => {
    const result = getManualD4dCaptureUiPlanning();
    const lane = result.uiPlanningLanes.find((item) => item.lane === "distress_tag_verification");

    expect(lane?.governanceRule).toMatch(/human-verified review prompts/i);
    expect(lane?.governanceRule).toMatch(/cannot imply valuation, offer generation, owner contact, or autonomous acquisition/i);
  });

  it("requires property-first duplicate and missing-contact warnings to stay review-only", () => {
    const result = getManualD4dCaptureUiPlanning();
    const propertyFirstLane = result.uiPlanningLanes.find((item) => item.lane === "property_first_warning");
    const duplicateLane = result.uiPlanningLanes.find((item) => item.lane === "duplicate_review_warning");
    const missingContactLane = result.uiPlanningLanes.find((item) => item.lane === "missing_owner_contact_warning");

    expect(propertyFirstLane?.governanceRule).toMatch(/blocks outreach, skip tracing, enrichment, messaging, and calling/i);
    expect(duplicateLane?.governanceRule).toMatch(/cannot imply merge, delete, create, persist, route, assign, import, or CRM mutation/i);
    expect(missingContactLane?.governanceRule).toMatch(/cannot trigger external lookup, skip tracing, enrichment, provider activation, outreach, or contact attempts/i);
  });

  it("keeps no-map no-GPS boundary explicit", () => {
    const result = getManualD4dCaptureUiPlanning();
    const lane = result.uiPlanningLanes.find((item) => item.lane === "no_map_no_gps_boundary");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "no map UI",
        "no GPS tracking",
        "no route planning",
        "no Street View automation",
        "no location capture",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot plan map, GPS, location, route planning, map crawling, Street View, scraping, external API, or fetch\/network behavior/i);
  });

  it("keeps future validation readiness separate from runtime validation forms handlers and storage", () => {
    const result = getManualD4dCaptureUiPlanning();
    const lane = result.uiPlanningLanes.find((item) => item.lane === "future_validation_readiness");

    expect(lane?.governanceRule).toMatch(/cannot create validation runtime, forms, submit handlers, storage writes, or capture controls/i);
    expect(result.flags.validationRuntimeEnabled).toBe(false);
    expect(result.flags.formCreated).toBe(false);
    expect(result.flags.localStorageWriteEnabled).toBe(false);
  });

  it("defines copy doctrine that blocks execution-like wording", () => {
    const result = getManualD4dCaptureUiPlanning();
    const doctrine = result.futureUiCopyDoctrine.join(" ");

    expect(doctrine).toMatch(/plain manual-review wording only/i);
    expect(doctrine).toMatch(/review fields, not action controls/i);
    expect(doctrine).toMatch(/Do not use execution-like labels/i);
    expect(doctrine).toMatch(/Do not imply save, send, contact, route, workflow start, or provider activation/i);
  });

  it("lists forbidden UI wording for route planning direct mail send contact save execute and workflow labels", () => {
    const result = getManualD4dCaptureUiPlanning();

    expect(result.forbiddenUiPlanningWording).toEqual(
      expect.arrayContaining([
        "route planning",
        "direct mail follow-up",
        "send",
        "contact",
        "capture now",
        "save lead",
        "start workflow",
        "execute",
        "activate",
        "launch",
        "call owner",
        "text owner",
        "skip trace",
      ]),
    );
  });

  it("forbids UI planning drift into components forms routes storage maps outreach and automation", () => {
    const result = getManualD4dCaptureUiPlanning();

    expect(result.forbiddenUiPlanningDrift).toEqual(
      expect.arrayContaining([
        "UI component creation",
        "form creation",
        "route changes",
        "API handlers",
        "validation runtime",
        "lead creation",
        "manual capture record creation",
        "localStorage writes",
        "persistence",
        "maps/GPS",
        "routing",
        "outreach",
        "providers",
        "skip tracing",
        "enrichment",
        "CRM mutation",
        "queues",
        "assignments",
        "reminders",
        "runtime jobs",
        "invented property facts",
      ]),
    );
  });

  it("classifies A3.2 findings by implementation priority and scope", () => {
    const result = getManualD4dCaptureUiPlanning();
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
    expect(result.findings.some((finding) => finding.finding.includes("current dashboard page remains untouched"))).toBe(true);
  });

  it("asserts invariants and summarizes the next stage", () => {
    const result = getManualD4dCaptureUiPlanning();

    expect(() => assertManualD4dCaptureUiPlanningSafe(result)).not.toThrow();
    expect(summarizeManualD4dCaptureUiPlanning(result)).toMatch(/future manual D4D capture UI shape only/i);
    expect(summarizeManualD4dCaptureUiPlanning(result)).toMatch(/does not alter the current D4D dashboard page/i);
    expect(summarizeManualD4dCaptureUiPlanning(result)).toMatch(/create UI components, forms, routes, API handlers, validation runtime/i);
    expect(summarizeManualD4dCaptureUiPlanning(result)).toMatch(/Next stage: A3\.3 Manual D4D Capture Validation Planning/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getManualD4dCaptureUiPlanning(),
      flags: {
        ...manualD4dCaptureUiPlanningFlags,
        uiComponentCreated: true,
      },
    };

    expect(() => assertManualD4dCaptureUiPlanningSafe(unsafeResult)).toThrow(/cannot authorize UI components/i);
  });

  it("fails invariant checks if UI readiness drifts beyond planning", () => {
    const unsafeResult = {
      ...getManualD4dCaptureUiPlanning(),
      manualD4dCaptureUiReadiness: "future_ui_shape_defined" as const,
    };

    expect(() => assertManualD4dCaptureUiPlanningSafe(unsafeResult)).toThrow(/cannot become implementation-ready/i);
  });

  it("fails invariant checks if copy doctrine implies execution contact routing saving or workflow start", () => {
    const unsafeResult = {
      ...getManualD4dCaptureUiPlanning(),
      futureUiCopyDoctrine: [
        "Use a save lead button.",
      ],
    };

    expect(() => assertManualD4dCaptureUiPlanningSafe(unsafeResult)).toThrow(/copy doctrine cannot imply execution/i);
  });

  it("fails invariant checks if the roadmap skips A3.3", () => {
    const unsafeResult = {
      ...getManualD4dCaptureUiPlanning(),
      recommendedNextExactStep: "A3.4 Manual D4D Capture Implementation" as "A3.3 Manual D4D Capture Validation Planning",
    };

    expect(() => assertManualD4dCaptureUiPlanningSafe(unsafeResult)).toThrow(/A3.3 Manual D4D Capture Validation Planning/i);
  });

  it("fails invariant checks if the next stage recommendation is missing", () => {
    const unsafeResult = {
      ...getManualD4dCaptureUiPlanning(),
      nextStageRecommendation: "Stop And Reassess ROI" as "A3.3 Manual D4D Capture Validation Planning",
    };

    expect(() => assertManualD4dCaptureUiPlanningSafe(unsafeResult)).toThrow(/next stage recommendation/i);
  });
});
