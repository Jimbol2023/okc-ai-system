import {
  assertManualD4dCaptureValidationPlanningSafe,
  getManualD4dCaptureValidationPlanning,
  manualD4dCaptureValidationPlanningFlags,
  summarizeManualD4dCaptureValidationPlanning,
} from "./manual-d4d-capture-validation-planning";

describe("manual D4D capture validation planning", () => {
  it("creates a planning-only A3.3 manual D4D capture validation planning contract", () => {
    const result = getManualD4dCaptureValidationPlanning();

    expect(result.phase).toBe("A3.3 Manual D4D Capture Validation Planning");
    expect(result.manualD4dCaptureValidationReadiness).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("A3.4 Manual D4D Capture Readiness Review");
    expect(result.nextStageRecommendation).toBe("A3.4 Manual D4D Capture Readiness Review");
  });

  it("keeps A3.3 read-only advisory-only and planning-only", () => {
    const result = getManualD4dCaptureValidationPlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps schema runtime validation form UI route API capture and storage flags false", () => {
    const flags = getManualD4dCaptureValidationPlanning().flags;

    expect(flags.zodSchemaCreated).toBe(false);
    expect(flags.runtimeValidatorEnabled).toBe(false);
    expect(flags.safeParseWired).toBe(false);
    expect(flags.formValidationEnabled).toBe(false);
    expect(flags.uiComponentCreated).toBe(false);
    expect(flags.formCreated).toBe(false);
    expect(flags.routeChanged).toBe(false);
    expect(flags.apiHandlerEnabled).toBe(false);
    expect(flags.captureExecutionEnabled).toBe(false);
    expect(flags.manualCaptureCreatesRecord).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
  });

  it("keeps maps GPS provider outreach CRM runtime automation and property invention flags false", () => {
    const flags = getManualD4dCaptureValidationPlanning().flags;

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

  it("defines future validation field rules for all A3.2 fields", () => {
    const result = getManualD4dCaptureValidationPlanning();

    expect(result.futureValidationFieldRules).toEqual(
      expect.arrayContaining([
        "property address required",
        "city required",
        "state required as two-letter abbreviation",
        "zip required as 5-digit ZIP",
        "source required",
        "observation date required",
        "field note required",
        "optional distress tags human-verified",
        "operator note bounded",
        "review status required",
        "provenance note required",
      ]),
    );
  });

  it("defines all required validation planning lanes", () => {
    const result = getManualD4dCaptureValidationPlanning();

    expect(result.validationPlanningLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "required_field_rules",
        "source_provenance_validation",
        "address_location_minimization",
        "distress_tag_verification",
        "bounded_note_guidance",
        "review_status_validation",
        "property_first_blockers",
        "duplicate_review_blockers",
        "no_runtime_no_schema_boundary",
        "a3_4_readiness",
      ]),
    );
  });

  it("keeps required-field rules from creating Zod schema runtime validator or safeParse wiring", () => {
    const result = getManualD4dCaptureValidationPlanning();
    const lane = result.validationPlanningLanes.find((item) => item.lane === "required_field_rules");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "property address required",
        "city required",
        "state required as two-letter abbreviation",
        "zip required as 5-digit ZIP",
        "source required",
        "observation date required",
        "field note required",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot create a Zod schema, runtime validator, safeParse wiring, form validation, or capture execution/i);
  });

  it("requires source provenance visibility without source inference or autofill", () => {
    const result = getManualD4dCaptureValidationPlanning();
    const lane = result.validationPlanningLanes.find((item) => item.lane === "source_provenance_validation");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "source required",
        "manual D4D source visible",
        "observation date required",
        "provenance note required",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot infer, hide, overwrite, or auto-fill source data/i);
  });

  it("keeps address validation minimized without GPS coordinates location trails maps or routes", () => {
    const result = getManualD4dCaptureValidationPlanning();
    const lane = result.validationPlanningLanes.find((item) => item.lane === "address_location_minimization");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "property address required",
        "city/state/zip required",
        "no GPS coordinate requirement",
        "no location trail",
        "no map capture",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot collect GPS coordinates, location trails, maps, route data, or Street View data/i);
  });

  it("requires human verification for distress tags without outreach valuation or autonomous acquisition", () => {
    const result = getManualD4dCaptureValidationPlanning();
    const lane = result.validationPlanningLanes.find((item) => item.lane === "distress_tag_verification");

    expect(lane?.governanceRule).toMatch(/requires human verification/i);
    expect(lane?.governanceRule).toMatch(/cannot imply valuation, offer generation, owner contact, outreach, or autonomous acquisition/i);
  });

  it("keeps note guidance bounded without storage persistence audit writing or sanitizer runtime", () => {
    const result = getManualD4dCaptureValidationPlanning();
    const lane = result.validationPlanningLanes.find((item) => item.lane === "bounded_note_guidance");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "field note required",
        "operator note bounded",
        "plain text only planning",
        "no unrestricted free-form capture",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot create storage, persistence, audit writing, or sanitizer\/runtime behavior/i);
  });

  it("keeps review status from save contact execute and approval semantics", () => {
    const result = getManualD4dCaptureValidationPlanning();
    const lane = result.validationPlanningLanes.find((item) => item.lane === "review_status_validation");

    expect(lane?.governanceRule).toMatch(/cannot mark a record ready to save, ready to contact, ready to execute, or approved for capture execution/i);
  });

  it("keeps property-first and duplicate blockers visible without enrichment outreach mutation or records", () => {
    const result = getManualD4dCaptureValidationPlanning();
    const propertyFirstLane = result.validationPlanningLanes.find((item) => item.lane === "property_first_blockers");
    const duplicateLane = result.validationPlanningLanes.find((item) => item.lane === "duplicate_review_blockers");

    expect(propertyFirstLane?.governanceRule).toMatch(/cannot trigger skip tracing, enrichment, provider activation, outreach, messaging, or calling/i);
    expect(duplicateLane?.governanceRule).toMatch(/cannot merge, delete, create, persist, route, assign, import, or mutate lead records/i);
  });

  it("keeps no-runtime no-schema boundary explicit", () => {
    const result = getManualD4dCaptureValidationPlanning();
    const lane = result.validationPlanningLanes.find((item) => item.lane === "no_runtime_no_schema_boundary");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "no Zod schema creation",
        "no runtime validator",
        "no safeParse wiring",
        "no form validation",
        "no route or API handler",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot add validation code, import zod, wire safeParse, create forms, or change routes/i);
  });

  it("keeps A3.4 readiness separate from runtime validation UI storage and lead creation", () => {
    const result = getManualD4dCaptureValidationPlanning();
    const lane = result.validationPlanningLanes.find((item) => item.lane === "a3_4_readiness");

    expect(lane?.governanceRule).toMatch(/runtime validation, UI implementation, storage writes, lead creation, and capture execution remain blocked/i);
    expect(result.recommendedNextExactStep).toBe("A3.4 Manual D4D Capture Readiness Review");
  });

  it("defines validation copy doctrine that avoids save contact and execution semantics", () => {
    const result = getManualD4dCaptureValidationPlanning();
    const doctrine = result.validationCopyDoctrine.join(" ");

    expect(doctrine).toMatch(/Use required for review wording/i);
    expect(doctrine).toMatch(/Use needs human verification wording/i);
    expect(doctrine).toMatch(/review readiness only/i);
    expect(doctrine).toMatch(/Do not describe any field as a valid lead/i);
    expect(doctrine).toMatch(/Do not imply a record is ready to save/i);
    expect(doctrine).toMatch(/Do not imply a record is ready to contact/i);
    expect(doctrine).toMatch(/Do not imply a record is ready to execute/i);
  });

  it("lists forbidden validation wording for saving contact sending routing and execution", () => {
    const result = getManualD4dCaptureValidationPlanning();

    expect(result.forbiddenValidationWording).toEqual(
      expect.arrayContaining([
        "valid lead",
        "ready to save",
        "ready to contact",
        "ready to execute",
        "ready to send",
        "ready to route",
        "approved for capture",
        "save lead",
        "contact owner",
        "execute capture",
      ]),
    );
  });

  it("forbids validation drift into schemas runtime validation forms routes storage maps outreach and automation", () => {
    const result = getManualD4dCaptureValidationPlanning();

    expect(result.forbiddenValidationDrift).toEqual(
      expect.arrayContaining([
        "Zod schema creation",
        "runtime validator",
        "safeParse wiring",
        "form validation",
        "UI component creation",
        "form creation",
        "route changes",
        "API handlers",
        "storage",
        "lead creation",
        "localStorage writes",
        "persistence",
        "CRM mutation",
        "maps/GPS",
        "outreach",
        "providers",
        "automation",
        "runtime jobs",
        "invented property facts",
      ]),
    );
  });

  it("classifies A3.3 findings by implementation priority and scope", () => {
    const result = getManualD4dCaptureValidationPlanning();
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
    expect(result.findings.some((finding) => finding.finding.includes("must not import zod"))).toBe(true);
  });

  it("asserts invariants and summarizes the next stage", () => {
    const result = getManualD4dCaptureValidationPlanning();

    expect(() => assertManualD4dCaptureValidationPlanningSafe(result)).not.toThrow();
    expect(summarizeManualD4dCaptureValidationPlanning(result)).toMatch(/future manual D4D capture validation rules/i);
    expect(summarizeManualD4dCaptureValidationPlanning(result)).toMatch(/does not create Zod schemas/i);
    expect(summarizeManualD4dCaptureValidationPlanning(result)).toMatch(/runtime validators/i);
    expect(summarizeManualD4dCaptureValidationPlanning(result)).toMatch(/safeParse wiring/i);
    expect(summarizeManualD4dCaptureValidationPlanning(result)).toMatch(/Next stage: A3\.4 Manual D4D Capture Readiness Review/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getManualD4dCaptureValidationPlanning(),
      flags: {
        ...manualD4dCaptureValidationPlanningFlags,
        zodSchemaCreated: true,
      },
    };

    expect(() => assertManualD4dCaptureValidationPlanningSafe(unsafeResult)).toThrow(/cannot authorize Zod schemas/i);
  });

  it("fails invariant checks if validation readiness drifts beyond planning", () => {
    const unsafeResult = {
      ...getManualD4dCaptureValidationPlanning(),
      manualD4dCaptureValidationReadiness: "future_validation_shape_defined" as const,
    };

    expect(() => assertManualD4dCaptureValidationPlanningSafe(unsafeResult)).toThrow(/cannot become runtime-ready/i);
  });

  it("fails invariant checks if validation copy implies saving contact or execution readiness", () => {
    const unsafeResult = {
      ...getManualD4dCaptureValidationPlanning(),
      validationCopyDoctrine: [
        "Mark this record ready to save.",
      ],
    };

    expect(() => assertManualD4dCaptureValidationPlanningSafe(unsafeResult)).toThrow(/copy cannot imply saving/i);
  });

  it("fails invariant checks if the roadmap skips A3.4", () => {
    const unsafeResult = {
      ...getManualD4dCaptureValidationPlanning(),
      recommendedNextExactStep: "A3.5 Manual D4D Capture Implementation" as "A3.4 Manual D4D Capture Readiness Review",
    };

    expect(() => assertManualD4dCaptureValidationPlanningSafe(unsafeResult)).toThrow(/A3.4 Manual D4D Capture Readiness Review/i);
  });

  it("fails invariant checks if the next stage recommendation is missing", () => {
    const unsafeResult = {
      ...getManualD4dCaptureValidationPlanning(),
      nextStageRecommendation: "Stop And Reassess ROI" as "A3.4 Manual D4D Capture Readiness Review",
    };

    expect(() => assertManualD4dCaptureValidationPlanningSafe(unsafeResult)).toThrow(/next stage recommendation/i);
  });
});
