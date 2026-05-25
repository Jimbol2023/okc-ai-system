import {
  assertPublicRecordsExportReviewHelperSafe,
  getPublicRecordsExportReviewHelper,
  publicRecordsExportReviewHelperFlags,
  summarizePublicRecordsExportReviewHelper,
} from "./public-records-export-review-helper";

describe("public records export review helper", () => {
  it("creates a planning-only A2.1 public records export review helper", () => {
    const result = getPublicRecordsExportReviewHelper();

    expect(result.phase).toBe("A2.1 Public Records Export Review Helper");
    expect(result.exportReviewReadiness).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("A3 Manual D4D Capture Usability Gate");
    expect(result.nextStageRecommendation).toBe("A3 Manual D4D Capture Usability Gate");
  });

  it("keeps export review read-only advisory-only and planning-only", () => {
    const result = getPublicRecordsExportReviewHelper();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps connector scraping crawling live lookup fetch and parser behavior false", () => {
    const flags = getPublicRecordsExportReviewHelper().flags;

    expect(flags.connectorActivated).toBe(false);
    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.crawlingEnabled).toBe(false);
    expect(flags.liveLookupEnabled).toBe(false);
    expect(flags.fetchNetworkEnabled).toBe(false);
    expect(flags.parserCodegenEnabled).toBe(false);
    expect(flags.schemaMigrationEnabled).toBe(false);
  });

  it("keeps import lead CRM persistence provider messaging and runtime flags false", () => {
    const flags = getPublicRecordsExportReviewHelper().flags;

    expect(flags.importExecutionEnabled).toBe(false);
    expect(flags.leadCreationEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.crmAutomationEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
  });

  it("keeps enrichment automation routing queue reminder and approval execution false", () => {
    const flags = getPublicRecordsExportReviewHelper().flags;

    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.enrichmentEnabled).toBe(false);
    expect(flags.vectorDatabaseEnabled).toBe(false);
    expect(flags.embeddingsEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.routingEnabled).toBe(false);
    expect(flags.assignmentEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.autonomousAcquisitionEnabled).toBe(false);
    expect(flags.autonomousOutreachEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
    expect(flags.propertyFactsInvented).toBe(false);
    expect(flags.spendIncreaseAuthorized).toBe(false);
    expect(flags.leadVolumeIncreaseAuthorized).toBe(false);
  });

  it("defines all required export review lanes", () => {
    const result = getPublicRecordsExportReviewHelper();

    expect(result.exportReviewLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "provenance_review",
        "field_layout_review",
        "parcel_account_identifier_review",
        "owner_mailing_property_address_review",
        "tax_assessor_signal_review",
        "property_first_review",
        "missing_field_cleanup_review",
        "duplicate_overlap_review",
        "disclaimer_source_confidence_review",
      ]),
    );
  });

  it("defines expected public-record export field groups", () => {
    const result = getPublicRecordsExportReviewHelper();

    expect(result.expectedFieldGroups).toEqual(
      expect.arrayContaining([
        "source/provenance",
        "jurisdiction",
        "parcel/account identifiers",
        "owner fields",
        "property address",
        "mailing address",
        "tax/assessment fields",
        "dates/status fields",
        "notes/disclaimers",
      ]),
    );
  });

  it("defines manual review labels for export review friction", () => {
    const result = getPublicRecordsExportReviewHelper();

    expect(result.manualReviewLabels).toEqual(
      expect.arrayContaining([
        "legal export review",
        "provenance needed",
        "field layout review",
        "parcel/account review",
        "property-first cleanup",
        "missing field cleanup",
        "duplicate overlap review",
        "disclaimer review",
      ]),
    );
  });

  it("uses downloaded or operator-provided legal exports only", () => {
    const result = getPublicRecordsExportReviewHelper();
    const provenanceLane = result.exportReviewLanes.find((lane) => lane.lane === "provenance_review");

    expect(result.roiDoctrine.join(" ")).toMatch(/downloaded or operator-provided legal exports only/i);
    expect(provenanceLane?.governanceRule).toMatch(/already-downloaded or operator-provided legal exports only/i);
    expect(provenanceLane?.governanceRule).toMatch(/cannot fetch, connect to, or scrape/i);
  });

  it("keeps field layout review from becoming parser codegen or import execution", () => {
    const result = getPublicRecordsExportReviewHelper();
    const lane = result.exportReviewLanes.find((item) => item.lane === "field_layout_review");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "visible column layout",
        "mapped import-ready fields",
        "unmapped public-record headers",
        "operator field notes",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot generate parser code, migrate schemas, or execute imports/i);
    expect(result.flags.parserCodegenEnabled).toBe(false);
    expect(result.flags.importExecutionEnabled).toBe(false);
  });

  it("references practical parcel and account aliases without creating leads", () => {
    const result = getPublicRecordsExportReviewHelper();
    const lane = result.exportReviewLanes.find((item) => item.lane === "parcel_account_identifier_review");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "parcelId",
        "parcel",
        "APN",
        "account number",
        "tax account number",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot create, enrich, or mutate lead records/i);
    expect(result.flags.leadCreationEnabled).toBe(false);
  });

  it("keeps owner address and source review from inventing facts or authorizing outreach", () => {
    const result = getPublicRecordsExportReviewHelper();
    const lane = result.exportReviewLanes.find((item) => item.lane === "owner_mailing_property_address_review");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "ownerName",
        "propertyAddress",
        "mailingAddress",
        "county",
        "property-first classification",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot invent property facts or authorize outreach/i);
    expect(result.flags.propertyFactsInvented).toBe(false);
    expect(result.flags.autonomousOutreachEnabled).toBe(false);
  });

  it("keeps tax and assessor signals as operator review only", () => {
    const result = getPublicRecordsExportReviewHelper();
    const lane = result.exportReviewLanes.find((item) => item.lane === "tax_assessor_signal_review");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "assessor field labels",
        "tax field labels",
        "assessment value columns",
        "tax status columns",
        "source disclaimer context",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/not automated valuation, enrichment, or acquisition execution/i);
  });

  it("keeps property-first rows from skip tracing enrichment messaging or seller handling", () => {
    const result = getPublicRecordsExportReviewHelper();
    const lane = result.exportReviewLanes.find((item) => item.lane === "property_first_review");

    expect(lane?.governanceRule).toMatch(/cannot trigger skip tracing, enrichment, messaging, calling, or seller handling/i);
    expect(result.flags.skipTracingEnabled).toBe(false);
    expect(result.flags.enrichmentEnabled).toBe(false);
    expect(result.flags.outboundSmsEnabled).toBe(false);
    expect(result.flags.callingEnabled).toBe(false);
    expect(result.flags.autonomousSellerHandlingEnabled).toBe(false);
  });

  it("keeps missing field cleanup manual without auto-fix or lookup behavior", () => {
    const result = getPublicRecordsExportReviewHelper();
    const lane = result.exportReviewLanes.find((item) => item.lane === "missing_field_cleanup_review");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "missing source",
        "missing county",
        "missing parcel/account identifier",
        "missing owner",
        "missing property or mailing address",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot auto-fix, persist, import, enrich, or lookup missing data/i);
  });

  it("keeps duplicate overlap review from merge delete route assign import or mutation behavior", () => {
    const result = getPublicRecordsExportReviewHelper();
    const lane = result.exportReviewLanes.find((item) => item.lane === "duplicate_overlap_review");

    expect(lane?.governanceRule).toMatch(/cannot auto-merge, delete, route, assign, import, or mutate records/i);
    expect(result.flags.routingEnabled).toBe(false);
    expect(result.flags.assignmentEnabled).toBe(false);
    expect(result.flags.importExecutionEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
  });

  it("requires disclaimer source confidence and non-invention visibility", () => {
    const result = getPublicRecordsExportReviewHelper();
    const lane = result.exportReviewLanes.find((item) => item.lane === "disclaimer_source_confidence_review");

    expect(lane?.items).toEqual(
      expect.arrayContaining([
        "source confidence label",
        "disclaimer visibility",
        "operator confidence note",
        "no invented property facts",
      ]),
    );
    expect(lane?.governanceRule).toMatch(/cannot overwrite official-source uncertainty/i);
  });

  it("keeps ROI doctrine focused on scanability waste reduction provenance and no volume increase", () => {
    const result = getPublicRecordsExportReviewHelper();
    const doctrine = result.roiDoctrine.join(" ");

    expect(doctrine).toMatch(/Improve operator scanability/i);
    expect(doctrine).toMatch(/Reduce manual research waste/i);
    expect(doctrine).toMatch(/Preserve source, jurisdiction, date, disclaimer, and provenance visibility/i);
    expect(doctrine).toMatch(/Do not increase lead volume/i);
    expect(doctrine).toMatch(/Never invent property facts/i);
  });

  it("forbids export review drift into runtime execution and automation", () => {
    const result = getPublicRecordsExportReviewHelper();

    expect(result.forbiddenExportReviewDrift).toEqual(
      expect.arrayContaining([
        "connector",
        "scraping",
        "crawling",
        "live lookup",
        "fetch/network",
        "parser codegen",
        "import execution",
        "lead creation",
        "CRM mutation",
        "persistence",
        "audit writing",
        "outreach",
        "provider activation",
        "skip tracing",
        "enrichment",
        "routing",
        "assignment",
        "queue",
        "reminder",
        "runtime job",
        "property fact invention",
      ]),
    );
  });

  it("classifies A2.1 findings by implementation priority and scope", () => {
    const result = getPublicRecordsExportReviewHelper();
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
    expect(result.findings.some((finding) => finding.finding.includes("stays narrower"))).toBe(true);
  });

  it("asserts invariants and summarizes the next stage", () => {
    const result = getPublicRecordsExportReviewHelper();

    expect(() => assertPublicRecordsExportReviewHelperSafe(result)).not.toThrow();
    expect(summarizePublicRecordsExportReviewHelper(result)).toMatch(/already-downloaded or operator-provided legal public-record exports only/i);
    expect(summarizePublicRecordsExportReviewHelper(result)).toMatch(/No connector/i);
    expect(summarizePublicRecordsExportReviewHelper(result)).toMatch(/property fact invention/i);
    expect(summarizePublicRecordsExportReviewHelper(result)).toMatch(/Next stage: A3 Manual D4D Capture Usability Gate/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getPublicRecordsExportReviewHelper(),
      flags: {
        ...publicRecordsExportReviewHelperFlags,
        connectorActivated: true,
      },
    };

    expect(() => assertPublicRecordsExportReviewHelperSafe(unsafeResult)).toThrow(/cannot authorize connectors/i);
  });

  it("fails invariant checks if export review readiness drifts beyond planning", () => {
    const unsafeResult = {
      ...getPublicRecordsExportReviewHelper(),
      exportReviewReadiness: "needs_operator_review" as const,
    };

    expect(() => assertPublicRecordsExportReviewHelperSafe(unsafeResult)).toThrow(/cannot become execution-ready/i);
  });

  it("fails invariant checks if the roadmap skips A3", () => {
    const unsafeResult = {
      ...getPublicRecordsExportReviewHelper(),
      recommendedNextExactStep: "Provider Activation Pilot" as "A3 Manual D4D Capture Usability Gate",
    };

    expect(() => assertPublicRecordsExportReviewHelperSafe(unsafeResult)).toThrow(/A3 Manual D4D Capture Usability Gate/i);
  });

  it("fails invariant checks if the next stage recommendation is missing", () => {
    const unsafeResult = {
      ...getPublicRecordsExportReviewHelper(),
      nextStageRecommendation: "Stop And Reassess ROI" as "A3 Manual D4D Capture Usability Gate",
    };

    expect(() => assertPublicRecordsExportReviewHelperSafe(unsafeResult)).toThrow(/next stage recommendation/i);
  });
});
