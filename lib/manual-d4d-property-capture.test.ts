import {
  assertManualD4dPropertyCaptureSafe,
  getManualD4dPropertyCapturePlanning,
  manualD4dPropertyCaptureFlags,
  summarizeManualD4dPropertyCapture,
} from "./manual-d4d-property-capture";

describe("manual D4D property capture planning", () => {
  it("creates a planning-only A3.1 manual D4D property capture contract", () => {
    const result = getManualD4dPropertyCapturePlanning();

    expect(result.phase).toBe("A3.1 Manual D4D Property Capture");
    expect(result.manualD4dPropertyCaptureReadiness).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("A3.2 Manual D4D Capture UI Planning");
    expect(result.nextStageRecommendation).toBe("A3.2 Manual D4D Capture UI Planning");
  });

  it("keeps A3.1 read-only advisory-only and planning-only", () => {
    const result = getManualD4dPropertyCapturePlanning();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps capture record creation storage routes forms and schema flags false", () => {
    const flags = getManualD4dPropertyCapturePlanning().flags;

    expect(flags.captureExecutionEnabled).toBe(false);
    expect(flags.manualCaptureCreatesRecord).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.importExecutionEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.localStorageWriteEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.routeCreationEnabled).toBe(false);
    expect(flags.apiHandlerEnabled).toBe(false);
    expect(flags.uiFormEnabled).toBe(false);
    expect(flags.schemaMigrationEnabled).toBe(false);
  });

  it("keeps GPS map scraping external lookup and enrichment flags false", () => {
    const flags = getManualD4dPropertyCapturePlanning().flags;

    expect(flags.gpsTrackingEnabled).toBe(false);
    expect(flags.locationTrackingEnabled).toBe(false);
    expect(flags.routePlanningEnabled).toBe(false);
    expect(flags.mapCrawlingEnabled).toBe(false);
    expect(flags.streetViewAutomationEnabled).toBe(false);
    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.externalLookupEnabled).toBe(false);
    expect(flags.externalApiEnabled).toBe(false);
    expect(flags.fetchNetworkEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.enrichmentEnabled).toBe(false);
  });

  it("keeps provider outreach CRM work management runtime autonomy and volume flags false", () => {
    const flags = getManualD4dPropertyCapturePlanning().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
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

  it("defines the minimum future manual capture fields with source and provenance", () => {
    const result = getManualD4dPropertyCapturePlanning();

    expect(result.manualCaptureFields).toEqual(
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

  it("defines all required capture review lanes", () => {
    const result = getManualD4dPropertyCapturePlanning();

    expect(result.captureReviewLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "address_completeness",
        "source_provenance",
        "observation_note_review",
        "distress_tag_review",
        "property_first_cleanup",
        "duplicate_overlap",
        "missing_owner_contact_visibility",
        "operator_review_status",
        "future_execution_gate_readiness",
      ]),
    );
  });

  it("defines manual review labels for future capture scanability", () => {
    const result = getManualD4dPropertyCapturePlanning();

    expect(result.manualReviewLabels).toEqual(
      expect.arrayContaining([
        "manual D4D property review",
        "address required",
        "source required",
        "observation note needed",
        "distress tags need verification",
        "property-first cleanup",
        "duplicate review",
        "owner/contact missing",
        "review before capture",
      ]),
    );
  });

  it("keeps address completeness from lead creation storage or capture execution", () => {
    const result = getManualD4dPropertyCapturePlanning();
    const lane = result.captureReviewLanes.find((item) => item.lane === "address_completeness");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "property address required",
        "city required",
        "state required",
        "zip required",
        "address required label",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot create a lead, write storage, or execute capture/i);
  });

  it("keeps source and provenance required before later execution gates", () => {
    const result = getManualD4dPropertyCapturePlanning();
    const lane = result.captureReviewLanes.find((item) => item.lane === "source_provenance");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "source required",
        "manual D4D source label",
        "observation date",
        "provenance note",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/source-labeled and provenance-visible/i);
  });

  it("keeps observation notes from inferred invented scraped enriched or persisted facts", () => {
    const result = getManualD4dPropertyCapturePlanning();
    const lane = result.captureReviewLanes.find((item) => item.lane === "observation_note_review");

    expect(lane?.governanceRule).toMatch(/cannot infer, invent, scrape, enrich, or persist property facts/i);
    expect(result.flags.propertyFactsInvented).toBe(false);
    expect(result.flags.persistenceEnabled).toBe(false);
  });

  it("requires distress tags to stay human-verified review prompts", () => {
    const result = getManualD4dPropertyCapturePlanning();
    const lane = result.captureReviewLanes.find((item) => item.lane === "distress_tag_review");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "optional distress tags",
        "distress tags need verification",
        "vacancy review",
        "deferred maintenance review",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/require human verification/i);
    expect(lane?.governanceRule).toMatch(/cannot trigger owner contact, valuation, offer generation, outreach, or autonomous acquisition/i);
  });

  it("keeps property-first cleanup blocked from contact tracing enrichment messaging and calling", () => {
    const result = getManualD4dPropertyCapturePlanning();
    const lane = result.captureReviewLanes.find((item) => item.lane === "property_first_cleanup");

    expect(lane?.governanceRule).toMatch(/blocked from seller contact, skip tracing, enrichment, messaging, and calling/i);
    expect(result.flags.skipTracingEnabled).toBe(false);
    expect(result.flags.enrichmentEnabled).toBe(false);
    expect(result.flags.outboundSmsEnabled).toBe(false);
    expect(result.flags.callingEnabled).toBe(false);
  });

  it("keeps duplicate overlap from merge delete create persist route assign import or mutation", () => {
    const result = getManualD4dPropertyCapturePlanning();
    const lane = result.captureReviewLanes.find((item) => item.lane === "duplicate_overlap");

    expect(lane?.governanceRule).toMatch(/cannot merge, delete, create, persist, route, assign, import, or mutate lead records/i);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.persistenceEnabled).toBe(false);
    expect(result.flags.routingEnabled).toBe(false);
    expect(result.flags.assignmentEnabled).toBe(false);
    expect(result.flags.importExecutionEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
  });

  it("keeps missing owner contact visibility from external lookup provider activation or outreach", () => {
    const result = getManualD4dPropertyCapturePlanning();
    const lane = result.captureReviewLanes.find((item) => item.lane === "missing_owner_contact_visibility");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "owner/contact missing",
        "missing owner",
        "missing phone/email",
        "manual research needed",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot trigger external lookup, skip tracing, enrichment, provider activation, outreach, or contact attempts/i);
  });

  it("keeps operator review status from approval execution and work management", () => {
    const result = getManualD4dPropertyCapturePlanning();
    const lane = result.captureReviewLanes.find((item) => item.lane === "operator_review_status");

    expect(lane?.governanceRule).toMatch(/cannot approve capture execution, CRM mutation, reminders, queues, or assignments/i);
    expect(result.flags.approvalGrantsExecution).toBe(false);
    expect(result.flags.queueSystemEnabled).toBe(false);
    expect(result.flags.assignmentEnabled).toBe(false);
  });

  it("keeps future execution gate readiness separate from UI route API storage and lead creation", () => {
    const result = getManualD4dPropertyCapturePlanning();
    const lane = result.captureReviewLanes.find((item) => item.lane === "future_execution_gate_readiness");

    expect(lane?.governanceRule).toMatch(/actual capture execution, lead creation, storage, routes, and API handlers require a separate future gate/i);
    expect(result.recommendedNextExactStep).toBe("A3.2 Manual D4D Capture UI Planning");
  });

  it("keeps manual capture shape from writing to leads-storage localStorage CRM routes API handlers or persistence", () => {
    const result = getManualD4dPropertyCapturePlanning();
    const doctrine = result.roiDoctrine.join(" ");
    const summary = summarizeManualD4dPropertyCapture(result);

    expect(doctrine).toMatch(/Do not write to leads-storage, localStorage, CRM, persistence, or audit systems/i);
    expect(summary).toMatch(/does not write to leads-storage, localStorage, CRM, routes, API handlers, forms, persistence, or audit systems/i);
    expect(result.flags.localStorageWriteEnabled).toBe(false);
    expect(result.flags.routeCreationEnabled).toBe(false);
    expect(result.flags.apiHandlerEnabled).toBe(false);
    expect(result.flags.uiFormEnabled).toBe(false);
  });

  it("keeps ROI doctrine focused on manual friction source provenance and no spend volume or automation growth", () => {
    const result = getManualD4dPropertyCapturePlanning();
    const doctrine = result.roiDoctrine.join(" ");

    expect(doctrine).toMatch(/smallest future manual D4D property capture shape/i);
    expect(doctrine).toMatch(/Reduce manual operator friction/i);
    expect(doctrine).toMatch(/Use human-entered observations only/i);
    expect(doctrine).toMatch(/Preserve source, observation date, review status, and provenance visibility/i);
    expect(doctrine).toMatch(/Do not increase spend or lead volume through automation/i);
    expect(doctrine).toMatch(/Never invent property facts/i);
  });

  it("forbids manual capture drift into execution storage UI maps outreach and automation", () => {
    const result = getManualD4dPropertyCapturePlanning();

    expect(result.forbiddenManualCaptureDrift).toEqual(
      expect.arrayContaining([
        "lead creation",
        "manual capture record creation",
        "persistence",
        "localStorage writes",
        "routes",
        "API handlers",
        "UI/forms",
        "GPS tracking",
        "location tracking",
        "map crawling",
        "route planning",
        "scraping",
        "external lookup",
        "skip tracing",
        "enrichment",
        "provider activation",
        "messaging",
        "outreach",
        "CRM mutation",
        "queues",
        "assignments",
        "routing",
        "reminders",
        "runtime jobs",
        "invented property facts",
      ]),
    );
  });

  it("classifies A3.1 findings by implementation priority and scope", () => {
    const result = getManualD4dPropertyCapturePlanning();
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
    expect(result.findings.some((finding) => finding.finding.includes("UI, routes, storage, and lead creation blocked"))).toBe(true);
  });

  it("asserts invariants and summarizes the next stage", () => {
    const result = getManualD4dPropertyCapturePlanning();

    expect(() => assertManualD4dPropertyCaptureSafe(result)).not.toThrow();
    expect(summarizeManualD4dPropertyCapture(result)).toMatch(/smallest future manual Driving-for-Dollars property capture shape/i);
    expect(summarizeManualD4dPropertyCapture(result)).toMatch(/No capture execution/i);
    expect(summarizeManualD4dPropertyCapture(result)).toMatch(/manual capture record creation/i);
    expect(summarizeManualD4dPropertyCapture(result)).toMatch(/lead creation/i);
    expect(summarizeManualD4dPropertyCapture(result)).toMatch(/property fact invention/i);
    expect(summarizeManualD4dPropertyCapture(result)).toMatch(/Next stage: A3\.2 Manual D4D Capture UI Planning/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getManualD4dPropertyCapturePlanning(),
      flags: {
        ...manualD4dPropertyCaptureFlags,
        localStorageWriteEnabled: true,
      },
    };

    expect(() => assertManualD4dPropertyCaptureSafe(unsafeResult)).toThrow(/cannot authorize capture execution/i);
  });

  it("fails invariant checks if manual D4D property capture readiness drifts beyond planning", () => {
    const unsafeResult = {
      ...getManualD4dPropertyCapturePlanning(),
      manualD4dPropertyCaptureReadiness: "manual_review_shape_defined" as const,
    };

    expect(() => assertManualD4dPropertyCaptureSafe(unsafeResult)).toThrow(/cannot become execution-ready/i);
  });

  it("fails invariant checks if manual capture implies record creation", () => {
    const unsafeResult = {
      ...getManualD4dPropertyCapturePlanning(),
      flags: {
        ...manualD4dPropertyCaptureFlags,
        manualCaptureCreatesRecord: true,
      },
    };

    expect(() => assertManualD4dPropertyCaptureSafe(unsafeResult)).toThrow(/manual capture record creation/i);
  });

  it("fails invariant checks if the roadmap skips A3.2", () => {
    const unsafeResult = {
      ...getManualD4dPropertyCapturePlanning(),
      recommendedNextExactStep: "A4 Route Planning" as "A3.2 Manual D4D Capture UI Planning",
    };

    expect(() => assertManualD4dPropertyCaptureSafe(unsafeResult)).toThrow(/A3.2 Manual D4D Capture UI Planning/i);
  });

  it("fails invariant checks if the next stage recommendation is missing", () => {
    const unsafeResult = {
      ...getManualD4dPropertyCapturePlanning(),
      nextStageRecommendation: "Stop And Reassess ROI" as "A3.2 Manual D4D Capture UI Planning",
    };

    expect(() => assertManualD4dPropertyCaptureSafe(unsafeResult)).toThrow(/next stage recommendation/i);
  });
});
