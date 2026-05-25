import {
  assertPublicRecordsIntakePlanningGateSafe,
  getPublicRecordsIntakePlanningGate,
  publicRecordsIntakePlanningGateFlags,
  summarizePublicRecordsIntakePlanningGate,
} from "./public-records-intake-planning-gate";

describe("public records intake planning gate", () => {
  it("creates a planning-only A2 public records intake gate", () => {
    const result = getPublicRecordsIntakePlanningGate();

    expect(result.phase).toBe("A2 Read-Only Public Records Intake Planning Gate");
    expect(result.publicRecordsIntakeReadiness).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("A2.1 Public Records Export Review Helper");
    expect(result.nextStageRecommendation).toBe("A2.1 Public Records Export Review Helper");
  });

  it("keeps public records intake read-only advisory-only and planning-only", () => {
    const result = getPublicRecordsIntakePlanningGate();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("allows only legal export and manual public-record sources", () => {
    const result = getPublicRecordsIntakePlanningGate();

    expect(result.allowedExportSources).toEqual(
      expect.arrayContaining([
        "county assessor exports",
        "county treasurer/tax exports",
        "county clerk/legal exports",
        "downloaded public-list spreadsheets",
        "operator-provided manual exports",
      ]),
    );
  });

  it("requires source county state date legal basis layout disclaimer and provenance evidence", () => {
    const result = getPublicRecordsIntakePlanningGate();

    expect(result.requiredExportEvidence).toEqual(
      expect.arrayContaining([
        "source name",
        "county",
        "state",
        "download/export date",
        "source URL or office",
        "legal/public-record basis",
        "field layout notes",
        "disclaimer visibility",
        "operator provenance note",
      ]),
    );
  });

  it("defines all required public-record intake lanes", () => {
    const result = getPublicRecordsIntakePlanningGate();

    expect(result.publicRecordIntakeLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "legal_export_provenance",
        "county_assessor_tax_field_readiness",
        "property_first_intake_handling",
        "source_confidence_and_disclaimer_visibility",
        "missing_field_manual_cleanup_planning",
        "duplicate_export_overlap_review",
        "no_connector_no_scraping_boundary",
        "a2_1_export_review_readiness",
      ]),
    );
  });

  it("keeps connectors scraping crawling live lookup fetch MLS and enrichment false", () => {
    const flags = getPublicRecordsIntakePlanningGate().flags;

    expect(flags.publicRecordConnectorActivated).toBe(false);
    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.crawlingEnabled).toBe(false);
    expect(flags.liveCountyLookupEnabled).toBe(false);
    expect(flags.fetchNetworkEnabled).toBe(false);
    expect(flags.mlsAccessEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.enrichmentEnabled).toBe(false);
  });

  it("keeps providers messaging CRM persistence audit runtime queues and routing false", () => {
    const flags = getPublicRecordsIntakePlanningGate().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.crmAutomationEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.routingEnabled).toBe(false);
    expect(flags.assignmentEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
  });

  it("keeps autonomous behavior approval execution lead creation import execution and property invention false", () => {
    const flags = getPublicRecordsIntakePlanningGate().flags;

    expect(flags.autonomousAcquisitionEnabled).toBe(false);
    expect(flags.autonomousOutreachEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.importExecutionEnabled).toBe(false);
    expect(flags.propertyFactsInvented).toBe(false);
    expect(flags.leadVolumeAutomationEnabled).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
  });

  it("requires property facts to remain non-invented and disclaimer visible", () => {
    const result = getPublicRecordsIntakePlanningGate();
    const lane = result.publicRecordIntakeLanes.find((item) => item.lane === "source_confidence_and_disclaimer_visibility");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "source confidence label",
        "disclaimer visibility",
        "legal/public-record basis",
        "no invented property facts",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot invent, infer, or overwrite property facts/i);
  });

  it("keeps property-first public-record rows blocked from seller contact", () => {
    const result = getPublicRecordsIntakePlanningGate();
    const lane = result.publicRecordIntakeLanes.find((item) => item.lane === "property_first_intake_handling");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "property-first classification",
        "missing contact visibility",
        "manual contact cleanup requirement",
        "outreach blocked status",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot authorize seller contact/i);
  });

  it("blocks missing field cleanup from scraping skip tracing or enrichment", () => {
    const result = getPublicRecordsIntakePlanningGate();
    const lane = result.publicRecordIntakeLanes.find((item) => item.lane === "missing_field_manual_cleanup_planning");

    expect(lane?.governanceRule).toMatch(/cannot trigger scraping, skip tracing, or enrichment/i);
    expect(result.flags.scrapingEnabled).toBe(false);
    expect(result.flags.skipTracingEnabled).toBe(false);
    expect(result.flags.enrichmentEnabled).toBe(false);
  });

  it("keeps duplicate export overlap review from mutating records", () => {
    const result = getPublicRecordsIntakePlanningGate();
    const lane = result.publicRecordIntakeLanes.find((item) => item.lane === "duplicate_export_overlap_review");

    expect(lane?.governanceRule).toMatch(/cannot merge, delete, import, route, assign, or mutate records/i);
    expect(result.flags.importExecutionEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
  });

  it("keeps no-connector no-scraping boundary explicit", () => {
    const result = getPublicRecordsIntakePlanningGate();
    const lane = result.publicRecordIntakeLanes.find((item) => item.lane === "no_connector_no_scraping_boundary");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "no public-record connectors",
        "no scraping",
        "no crawling",
        "no live county lookup",
        "no fetch/network behavior",
      ]),
    );
  });

  it("keeps ROI doctrine blocked unless exports are a real bottleneck", () => {
    const result = getPublicRecordsIntakePlanningGate();

    expect(result.roiDoctrine.join(" ")).toMatch(/proven acquisition bottleneck/i);
    expect(result.roiDoctrine.join(" ")).toMatch(/already-downloaded or manually provided legal exports only/i);
    expect(result.roiDoctrine.join(" ")).toMatch(/Do not increase spend/i);
    expect(result.roiDoctrine.join(" ")).toMatch(/Never invent property facts/i);
  });

  it("forbids public-record drift into execution and automation", () => {
    const result = getPublicRecordsIntakePlanningGate();

    expect(result.forbiddenPublicRecordDrift).toEqual(
      expect.arrayContaining([
        "scraping",
        "crawling",
        "live county access",
        "public-record connectors",
        "MLS access",
        "skip tracing",
        "enrichment",
        "provider activation",
        "outbound messaging",
        "CRM automation",
        "persistence",
        "queues",
        "assignments",
        "routing",
        "reminders",
        "runtime jobs",
        "AI-only acquisition",
        "invented property facts",
        "lead creation",
        "import execution",
      ]),
    );
  });

  it("classifies public-record intake findings by implementation priority and scope", () => {
    const result = getPublicRecordsIntakePlanningGate();
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
    expect(result.findings.some((finding) => finding.question.includes("public-record intake planning"))).toBe(true);
  });

  it("asserts invariants and summarizes the next stage", () => {
    const result = getPublicRecordsIntakePlanningGate();

    expect(() => assertPublicRecordsIntakePlanningGateSafe(result)).not.toThrow();
    expect(summarizePublicRecordsIntakePlanningGate(result)).toMatch(/already-downloaded or operator-provided legal public-record exports/i);
    expect(summarizePublicRecordsIntakePlanningGate(result)).toMatch(/No connectors/i);
    expect(summarizePublicRecordsIntakePlanningGate(result)).toMatch(/property fact invention/i);
    expect(summarizePublicRecordsIntakePlanningGate(result)).toMatch(/Next stage: A2\.1 Public Records Export Review Helper/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getPublicRecordsIntakePlanningGate(),
      flags: {
        ...publicRecordsIntakePlanningGateFlags,
        scrapingEnabled: true,
      },
    };

    expect(() => assertPublicRecordsIntakePlanningGateSafe(unsafeResult)).toThrow(/cannot authorize connectors/i);
  });

  it("fails invariant checks if public-record readiness drifts beyond planning", () => {
    const unsafeResult = {
      ...getPublicRecordsIntakePlanningGate(),
      publicRecordsIntakeReadiness: "needs_legal_export_review" as const,
    };

    expect(() => assertPublicRecordsIntakePlanningGateSafe(unsafeResult)).toThrow(/cannot become live public-record intake readiness/i);
  });

  it("fails invariant checks if the roadmap skips A2.1", () => {
    const unsafeResult = {
      ...getPublicRecordsIntakePlanningGate(),
      recommendedNextExactStep: "Provider Activation Pilot" as "A2.1 Public Records Export Review Helper",
    };

    expect(() => assertPublicRecordsIntakePlanningGateSafe(unsafeResult)).toThrow(/A2.1 Public Records Export Review Helper/i);
  });

  it("fails invariant checks if the next stage recommendation is missing", () => {
    const unsafeResult = {
      ...getPublicRecordsIntakePlanningGate(),
      nextStageRecommendation: "Stop And Measure Acquisition ROI" as "A2.1 Public Records Export Review Helper",
    };

    expect(() => assertPublicRecordsIntakePlanningGateSafe(unsafeResult)).toThrow(/next stage recommendation/i);
  });
});
