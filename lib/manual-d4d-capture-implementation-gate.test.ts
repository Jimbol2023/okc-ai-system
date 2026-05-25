import {
  assertManualD4dCaptureImplementationGateSafe,
  getManualD4dCaptureImplementationGate,
  manualD4dCaptureImplementationGateFlags,
  summarizeManualD4dCaptureImplementationGate,
} from "./manual-d4d-capture-implementation-gate";

describe("manual D4D capture implementation gate", () => {
  it("creates a planning-only A3.5 manual D4D capture implementation gate", () => {
    const result = getManualD4dCaptureImplementationGate();

    expect(result.phase).toBe("A3.5 Manual D4D Capture Implementation Gate");
    expect(result.manualD4dImplementationGateStatus).toBe("planning_only");
    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("A3.6 Manual D4D Capture UI Draft");
    expect(result.nextStageRecommendation).toBe("A3.6 Manual D4D Capture UI Draft");
  });

  it("keeps A3.5 read-only advisory-only and planning-only", () => {
    const result = getManualD4dCaptureImplementationGate();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps implementation UI route schema validation capture and storage flags false", () => {
    const flags = getManualD4dCaptureImplementationGate().flags;

    expect(flags.implementationAuthorized).toBe(false);
    expect(flags.implementationDecisionGrantsWork).toBe(false);
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
    const flags = getManualD4dCaptureImplementationGate().flags;

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

  it("defines the future-only minimum implementation package", () => {
    const result = getManualD4dCaptureImplementationGate();

    expect(result.minimumFutureImplementationPackage).toEqual(
      expect.arrayContaining([
        "future UI component",
        "future client-side validation",
        "future local draft state",
        "future manual review preview",
        "future no-save disabled state",
        "future source/provenance display",
        "future property-first/duplicate/missing-contact warnings",
      ]),
    );
  });

  it("defines all required implementation gate lanes", () => {
    const result = getManualD4dCaptureImplementationGate();

    expect(result.implementationGateLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "operator_roi_evidence",
        "field_shape_approval",
        "ui_scope_approval",
        "validation_scope_approval",
        "storage_boundary_approval",
        "lead_creation_boundary",
        "d4d_page_wording_cleanup",
        "blocker_visibility",
        "no_map_no_gps_boundary",
        "final_implementation_approval_boundary",
      ]),
    );
  });

  it("requires operator ROI evidence before future UI draft consideration", () => {
    const result = getManualD4dCaptureImplementationGate();
    const lane = result.implementationGateLanes.find((item) => item.lane === "operator_roi_evidence");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "operator evidence that manual D4D capture is still the bottleneck",
        "manual friction evidence",
        "no cheaper importer or public-record fix available",
        "no spend increase required",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot authorize implementation by itself/i);
  });

  it("keeps field shape approval from records storage schemas or lead objects", () => {
    const result = getManualD4dCaptureImplementationGate();
    const lane = result.implementationGateLanes.find((item) => item.lane === "field_shape_approval");

    expect(lane?.governanceRule).toMatch(/cannot create records, storage, schemas, or lead objects/i);
  });

  it("keeps UI scope approval from components forms routes buttons and handlers", () => {
    const result = getManualD4dCaptureImplementationGate();
    const lane = result.implementationGateLanes.find((item) => item.lane === "ui_scope_approval");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "A3.2 UI scope reviewed",
        "future UI component is draft-only",
        "future no-save disabled state required",
        "execution-like labels remain blocked",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot create components, forms, routes, buttons, or click handlers/i);
  });

  it("keeps validation scope approval from Zod safeParse runtime validation and API handlers", () => {
    const result = getManualD4dCaptureImplementationGate();
    const lane = result.implementationGateLanes.find((item) => item.lane === "validation_scope_approval");

    expect(lane?.governanceRule).toMatch(/cannot create Zod schemas, runtime validators, safeParse wiring, form validation, or API handlers/i);
  });

  it("keeps storage boundary approval to future local draft state only", () => {
    const result = getManualD4dCaptureImplementationGate();
    const lane = result.implementationGateLanes.find((item) => item.lane === "storage_boundary_approval");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "future local draft state only",
        "no localStorage writes",
        "no persistence",
        "no audit writing",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot authorize writes, persistence, audit logging, or record creation/i);
  });

  it("keeps lead creation boundary closed", () => {
    const result = getManualD4dCaptureImplementationGate();
    const lane = result.implementationGateLanes.find((item) => item.lane === "lead_creation_boundary");

    expect(lane?.governanceRule).toMatch(/no future package item may imply save, create, import, mutate, or promote to CRM/i);
  });

  it("flags D4D page wording cleanup as future-only without changing the page", () => {
    const result = getManualD4dCaptureImplementationGate();
    const lane = result.implementationGateLanes.find((item) => item.lane === "d4d_page_wording_cleanup");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "future D4D page wording cleanup noted",
        "route planning wording must not imply activation",
        "direct mail follow-up wording must not imply outreach",
        "cleanup is future-only",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot alter the page/i);
  });

  it("keeps blocker visibility non-bypassable and separate from approval or execution authority", () => {
    const result = getManualD4dCaptureImplementationGate();
    const lane = result.implementationGateLanes.find((item) => item.lane === "blocker_visibility");

    expect(lane?.governanceRule).toMatch(/cannot become approval or execution authority/i);
  });

  it("keeps no-map no-GPS boundary closed", () => {
    const result = getManualD4dCaptureImplementationGate();
    const lane = result.implementationGateLanes.find((item) => item.lane === "no_map_no_gps_boundary");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "no map UI",
        "no GPS tracking",
        "no route planning",
        "no location trails",
        "no Street View automation",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot authorize maps, GPS, location tracking, route planning, map crawling, Street View automation, scraping, external APIs, or fetch\/network behavior/i);
  });

  it("keeps final implementation approval boundary unauthorized", () => {
    const result = getManualD4dCaptureImplementationGate();
    const lane = result.implementationGateLanes.find((item) => item.lane === "final_implementation_approval_boundary");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "implementation decision remains not_authorized",
        "A3.6 may draft UI only",
        "capture execution remains blocked",
        "final approval remains separate",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/implementation, capture execution, storage, lead creation, contact, and providers remain unauthorized/i);
  });

  it("defines implementation approval doctrine as planning only with no work authorization", () => {
    const result = getManualD4dCaptureImplementationGate();
    const doctrine = result.implementationApprovalDoctrine.join(" ");

    expect(doctrine).toMatch(/Implementation gate is planning-only/i);
    expect(doctrine).toMatch(/Implementation decision remains not_authorized/i);
    expect(doctrine).toMatch(/may recommend a later implementation phase only/i);
    expect(doctrine).toMatch(/does not create UI/i);
    expect(doctrine).toMatch(/does not create validation/i);
    expect(doctrine).toMatch(/does not create storage/i);
    expect(doctrine).toMatch(/does not create leads/i);
    expect(doctrine).toMatch(/does not create routes/i);
    expect(doctrine).toMatch(/does not create API handlers/i);
    expect(doctrine).toMatch(/does not authorize contacts/i);
    expect(doctrine).toMatch(/does not authorize maps or GPS/i);
    expect(doctrine).toMatch(/does not authorize runtime behavior/i);
  });

  it("forbids implementation drift into UI validation storage outreach and automation", () => {
    const result = getManualD4dCaptureImplementationGate();

    expect(result.forbiddenImplementationDrift).toEqual(
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
        "localStorage writes",
        "lead creation",
        "manual capture record creation",
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

  it("classifies A3.5 findings by implementation priority and scope", () => {
    const result = getManualD4dCaptureImplementationGate();
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
    expect(result.findings.some((finding) => finding.finding.includes("implementation decision remains not_authorized"))).toBe(true);
  });

  it("asserts invariants and summarizes the next stage", () => {
    const result = getManualD4dCaptureImplementationGate();

    expect(() => assertManualD4dCaptureImplementationGateSafe(result)).not.toThrow();
    expect(summarizeManualD4dCaptureImplementationGate(result)).toMatch(/Implementation decision is not_authorized/i);
    expect(summarizeManualD4dCaptureImplementationGate(result)).toMatch(/future-only minimum implementation package/i);
    expect(summarizeManualD4dCaptureImplementationGate(result)).toMatch(/does not authorize implementation/i);
    expect(summarizeManualD4dCaptureImplementationGate(result)).toMatch(/Next stage: A3\.6 Manual D4D Capture UI Draft/i);
  });

  it("fails invariant checks if implementation is authorized", () => {
    const unsafeResult = {
      ...getManualD4dCaptureImplementationGate(),
      implementationDecision: "authorized" as "not_authorized",
    };

    expect(() => assertManualD4dCaptureImplementationGateSafe(unsafeResult)).toThrow(/implementation decision must remain not_authorized/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getManualD4dCaptureImplementationGate(),
      flags: {
        ...manualD4dCaptureImplementationGateFlags,
        implementationAuthorized: true,
      },
    };

    expect(() => assertManualD4dCaptureImplementationGateSafe(unsafeResult)).toThrow(/cannot authorize implementation/i);
  });

  it("fails invariant checks if readiness status drifts beyond planning", () => {
    const unsafeResult = {
      ...getManualD4dCaptureImplementationGate(),
      manualD4dImplementationGateStatus: "implementation_review_required" as const,
    };

    expect(() => assertManualD4dCaptureImplementationGateSafe(unsafeResult)).toThrow(/cannot become implementation-ready/i);
  });

  it("fails invariant checks if the future package implies save contact storage runtime execution or providers", () => {
    const unsafeResult = {
      ...getManualD4dCaptureImplementationGate(),
      minimumFutureImplementationPackage: [
        "save lead" as "future UI component",
      ],
    };

    expect(() => assertManualD4dCaptureImplementationGateSafe(unsafeResult)).toThrow(/minimum future package cannot imply save/i);
  });

  it("fails invariant checks if the roadmap skips A3.6", () => {
    const unsafeResult = {
      ...getManualD4dCaptureImplementationGate(),
      recommendedNextExactStep: "A3.7 Manual D4D Capture Save Flow" as "A3.6 Manual D4D Capture UI Draft",
    };

    expect(() => assertManualD4dCaptureImplementationGateSafe(unsafeResult)).toThrow(/A3.6 Manual D4D Capture UI Draft/i);
  });

  it("fails invariant checks if the next stage recommendation is missing", () => {
    const unsafeResult = {
      ...getManualD4dCaptureImplementationGate(),
      nextStageRecommendation: "Stop And Reassess ROI" as "A3.6 Manual D4D Capture UI Draft",
    };

    expect(() => assertManualD4dCaptureImplementationGateSafe(unsafeResult)).toThrow(/next stage recommendation/i);
  });
});
