import {
  assertManualD4dCaptureUsabilityGateSafe,
  getManualD4dCaptureUsabilityGate,
  manualD4dCaptureUsabilityGateFlags,
  summarizeManualD4dCaptureUsabilityGate,
} from "./manual-d4d-capture-usability-gate";

describe("manual D4D capture usability gate", () => {
  it("creates a planning-only A3 manual D4D capture usability gate", () => {
    const result = getManualD4dCaptureUsabilityGate();

    expect(result.phase).toBe("A3 Manual D4D Capture Usability Gate");
    expect(result.manualD4dCaptureReadiness).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("A3.1 Manual D4D Property Capture");
    expect(result.nextStageRecommendation).toBe("A3.1 Manual D4D Property Capture");
  });

  it("keeps A3 read-only advisory-only and planning-only", () => {
    const result = getManualD4dCaptureUsabilityGate();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps capture lead creation import GPS map route and scraping flags false", () => {
    const flags = getManualD4dCaptureUsabilityGate().flags;

    expect(flags.captureExecutionEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.importExecutionEnabled).toBe(false);
    expect(flags.gpsTrackingEnabled).toBe(false);
    expect(flags.locationTrackingEnabled).toBe(false);
    expect(flags.routePlanningEnabled).toBe(false);
    expect(flags.mapCrawlingEnabled).toBe(false);
    expect(flags.streetViewAutomationEnabled).toBe(false);
    expect(flags.scrapingEnabled).toBe(false);
  });

  it("keeps external lookup fetch persistence CRM runtime and work management flags false", () => {
    const flags = getManualD4dCaptureUsabilityGate().flags;

    expect(flags.externalLookupEnabled).toBe(false);
    expect(flags.externalApiEnabled).toBe(false);
    expect(flags.fetchNetworkEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.crmAutomationEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.routingEnabled).toBe(false);
    expect(flags.assignmentEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
  });

  it("keeps providers outreach enrichment autonomy approval and volume flags false", () => {
    const flags = getManualD4dCaptureUsabilityGate().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.outreachEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.enrichmentEnabled).toBe(false);
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

  it("defines all required manual D4D usability lanes", () => {
    const result = getManualD4dCaptureUsabilityGate();

    expect(result.manualD4dUsabilityLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "address_capture_clarity",
        "source_labeling",
        "field_observation_notes",
        "distress_tag_review",
        "property_first_handling",
        "duplicate_property_overlap_review",
        "missing_owner_contact_visibility",
        "operator_scanability",
        "a3_1_readiness",
      ]),
    );
  });

  it("defines minimum future manual capture fields without authorizing capture", () => {
    const result = getManualD4dCaptureUsabilityGate();

    expect(result.minimumFutureManualCaptureFields).toEqual(
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
    expect(result.flags.captureExecutionEnabled).toBe(false);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.persistenceEnabled).toBe(false);
  });

  it("defines manual review labels for scanability", () => {
    const result = getManualD4dCaptureUsabilityGate();

    expect(result.manualReviewLabels).toEqual(
      expect.arrayContaining([
        "manual D4D review",
        "address needed",
        "source required",
        "field note review",
        "distress tag review",
        "property-first cleanup",
        "duplicate property review",
        "missing owner/contact review",
      ]),
    );
  });

  it("keeps address capture clarity from creating leads or executing capture", () => {
    const result = getManualD4dCaptureUsabilityGate();
    const lane = result.manualD4dUsabilityLanes.find((item) => item.lane === "address_capture_clarity");

    expect(lane?.items).toEqual(expect.arrayContaining(["property address", "city", "state", "zip", "address needed label"]));
    expect(lane?.governanceRule).toMatch(/cannot create leads or execute capture/i);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.captureExecutionEnabled).toBe(false);
  });

  it("requires source labeling provenance and observation date visibility", () => {
    const result = getManualD4dCaptureUsabilityGate();
    const lane = result.manualD4dUsabilityLanes.find((item) => item.lane === "source_labeling");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "source required label",
        "manual D4D source",
        "operator provenance note",
        "observation date",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/source-labeled and provenance-visible/i);
  });

  it("keeps field observation notes from inferring or inventing property facts", () => {
    const result = getManualD4dCaptureUsabilityGate();
    const lane = result.manualD4dUsabilityLanes.find((item) => item.lane === "field_observation_notes");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "field note",
        "operator note",
        "human-entered observation",
        "no automated property inference",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot infer, invent, scrape, enrich, or overwrite property facts/i);
    expect(result.flags.propertyFactsInvented).toBe(false);
  });

  it("keeps distress tags as review prompts only", () => {
    const result = getManualD4dCaptureUsabilityGate();
    const lane = result.manualD4dUsabilityLanes.find((item) => item.lane === "distress_tag_review");

    expect(lane?.governanceRule).toMatch(/cannot trigger outreach, valuation, offer generation, owner contact, or autonomous acquisition/i);
    expect(result.flags.outreachEnabled).toBe(false);
    expect(result.flags.autonomousAcquisitionEnabled).toBe(false);
  });

  it("keeps property-first observations blocked from contact tracing enrichment messaging and calling", () => {
    const result = getManualD4dCaptureUsabilityGate();
    const lane = result.manualD4dUsabilityLanes.find((item) => item.lane === "property_first_handling");

    expect(lane?.governanceRule).toMatch(/cannot authorize seller contact, skip tracing, enrichment, messaging, or calling/i);
    expect(result.flags.skipTracingEnabled).toBe(false);
    expect(result.flags.enrichmentEnabled).toBe(false);
    expect(result.flags.outboundSmsEnabled).toBe(false);
    expect(result.flags.callingEnabled).toBe(false);
  });

  it("keeps duplicate property overlap review from mutation routing assignment persistence and lead creation", () => {
    const result = getManualD4dCaptureUsabilityGate();
    const lane = result.manualD4dUsabilityLanes.find((item) => item.lane === "duplicate_property_overlap_review");

    expect(lane?.governanceRule).toMatch(/cannot auto-merge, delete, route, assign, persist, import, create leads, or mutate CRM records/i);
    expect(result.flags.routingEnabled).toBe(false);
    expect(result.flags.assignmentEnabled).toBe(false);
    expect(result.flags.persistenceEnabled).toBe(false);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
  });

  it("keeps missing owner and contact visibility from external lookup and outreach", () => {
    const result = getManualD4dCaptureUsabilityGate();
    const lane = result.manualD4dUsabilityLanes.find((item) => item.lane === "missing_owner_contact_visibility");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "missing owner label",
        "missing phone/email label",
        "manual research needed",
        "contact blocked status",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot trigger external lookup, skip tracing, enrichment, outreach, provider activation, or contact attempts/i);
  });

  it("keeps operator scanability tied to bottleneck evidence", () => {
    const result = getManualD4dCaptureUsabilityGate();
    const lane = result.manualD4dUsabilityLanes.find((item) => item.lane === "operator_scanability");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "review status",
        "manual review labels",
        "smallest useful capture surface",
        "operator friction evidence",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/manual D4D capture is the bottleneck/i);
  });

  it("keeps A3.1 readiness from becoming lead creation persistence routing or outreach", () => {
    const result = getManualD4dCaptureUsabilityGate();
    const lane = result.manualD4dUsabilityLanes.find((item) => item.lane === "a3_1_readiness");

    expect(lane?.governanceRule).toMatch(/not as lead creation, persistence, routing, or outreach/i);
    expect(result.recommendedNextExactStep).toBe("A3.1 Manual D4D Property Capture");
  });

  it("keeps ROI doctrine focused on proven bottleneck human observations and no spend or volume increase", () => {
    const result = getManualD4dCaptureUsabilityGate();
    const doctrine = result.roiDoctrine.join(" ");

    expect(doctrine).toMatch(/proven acquisition bottleneck/i);
    expect(doctrine).toMatch(/human-entered field observations only/i);
    expect(doctrine).toMatch(/manual review throughput/i);
    expect(doctrine).toMatch(/Do not increase acquisition spend/i);
    expect(doctrine).toMatch(/Do not increase lead volume through automation/i);
    expect(doctrine).toMatch(/Never invent property facts/i);
  });

  it("forbids manual D4D drift into maps location automation outreach and execution", () => {
    const result = getManualD4dCaptureUsabilityGate();

    expect(result.forbiddenManualD4dDrift).toEqual(
      expect.arrayContaining([
        "GPS tracking",
        "location tracking",
        "route planning",
        "map crawling",
        "Street View automation",
        "scraping",
        "external lookup",
        "external API",
        "fetch/network",
        "lead creation",
        "persistence",
        "CRM mutation",
        "assignments",
        "queues",
        "routing",
        "reminders",
        "runtime jobs",
        "providers",
        "outbound messaging",
        "outreach",
        "skip tracing",
        "enrichment",
        "autonomous acquisition",
        "invented property facts",
      ]),
    );
  });

  it("classifies A3 findings by implementation priority and scope", () => {
    const result = getManualD4dCaptureUsabilityGate();
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
    expect(result.findings.some((finding) => finding.finding.includes("without UI, routes, persistence, maps, GPS, or lead creation"))).toBe(true);
  });

  it("asserts invariants and summarizes the next stage", () => {
    const result = getManualD4dCaptureUsabilityGate();

    expect(() => assertManualD4dCaptureUsabilityGateSafe(result)).not.toThrow();
    expect(summarizeManualD4dCaptureUsabilityGate(result)).toMatch(/planning-only usability gate/i);
    expect(summarizeManualD4dCaptureUsabilityGate(result)).toMatch(/No capture execution/i);
    expect(summarizeManualD4dCaptureUsabilityGate(result)).toMatch(/lead creation/i);
    expect(summarizeManualD4dCaptureUsabilityGate(result)).toMatch(/automation/i);
    expect(summarizeManualD4dCaptureUsabilityGate(result)).toMatch(/outreach/i);
    expect(summarizeManualD4dCaptureUsabilityGate(result)).toMatch(/property fact invention/i);
    expect(summarizeManualD4dCaptureUsabilityGate(result)).toMatch(/Next stage: A3\.1 Manual D4D Property Capture/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getManualD4dCaptureUsabilityGate(),
      flags: {
        ...manualD4dCaptureUsabilityGateFlags,
        gpsTrackingEnabled: true,
      },
    };

    expect(() => assertManualD4dCaptureUsabilityGateSafe(unsafeResult)).toThrow(/cannot authorize capture execution/i);
  });

  it("fails invariant checks if manual D4D readiness drifts beyond planning", () => {
    const unsafeResult = {
      ...getManualD4dCaptureUsabilityGate(),
      manualD4dCaptureReadiness: "needs_operator_evidence" as const,
    };

    expect(() => assertManualD4dCaptureUsabilityGateSafe(unsafeResult)).toThrow(/cannot become execution-ready/i);
  });

  it("fails invariant checks if the roadmap skips A3.1", () => {
    const unsafeResult = {
      ...getManualD4dCaptureUsabilityGate(),
      recommendedNextExactStep: "Virtual D4D Activation" as "A3.1 Manual D4D Property Capture",
    };

    expect(() => assertManualD4dCaptureUsabilityGateSafe(unsafeResult)).toThrow(/A3.1 Manual D4D Property Capture/i);
  });

  it("fails invariant checks if the next stage recommendation is missing", () => {
    const unsafeResult = {
      ...getManualD4dCaptureUsabilityGate(),
      nextStageRecommendation: "Stop And Reassess ROI" as "A3.1 Manual D4D Property Capture",
    };

    expect(() => assertManualD4dCaptureUsabilityGateSafe(unsafeResult)).toThrow(/next stage recommendation/i);
  });
});
