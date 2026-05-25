import {
  assertSourceQualityIntelligenceSafe,
  getSourceQualityIntelligence,
  sourceQualityIntelligenceFlags,
  summarizeSourceQualityIntelligence,
} from "./source-quality-intelligence";

describe("source quality intelligence", () => {
  it("creates a planning-only A1.4 source quality contract", () => {
    const result = getSourceQualityIntelligence();

    expect(result.phase).toBe("A1.4 Source Quality Intelligence");
    expect(result.sourceQualityReadiness).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("A1.5 Duplicate And Cleanup Review Practicalization");
    expect(result.nextStageRecommendation).toBe("A1.5 Duplicate And Cleanup Review Practicalization");
  });

  it("keeps source quality read-only advisory-only and planning-only", () => {
    const result = getSourceQualityIntelligence();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("defines all required source quality signals", () => {
    const result = getSourceQualityIntelligence();

    expect(result.sourceQualitySignals).toEqual(
      expect.arrayContaining([
        "cleanup_burden",
        "property_first_rate",
        "duplicate_rate",
        "source_confidence",
        "review_ready_rate",
        "missing_data_rate",
        "operator_friction",
        "review_completion_rate",
        "source_level_readiness_quality",
        "acquisition_usability",
      ]),
    );
  });

  it("defines source quality lanes for attribution readiness cleanup and usability", () => {
    const result = getSourceQualityIntelligence();

    expect(result.sourceQualityLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "source_attribution_quality",
        "review_ready_density",
        "cleanup_burden",
        "property_first_burden",
        "duplicate_burden",
        "missing_data_burden",
        "operator_friction",
        "acquisition_usability",
      ]),
    );
  });

  it("uses existing import and review concepts only", () => {
    const result = getSourceQualityIntelligence();

    expect(result.existingReviewInputs).toEqual(
      expect.arrayContaining([
        "ready rows",
        "property-first rows",
        "duplicate rows",
        "missing source rows",
        "missing contact rows",
        "missing address rows",
        "source mix",
        "source clarity",
        "cleanup needs",
        "import confidence",
      ]),
    );
    expect(result.sourceQualityLanes.every((lane) => lane.existingInputs.length > 0)).toBe(true);
  });

  it("represents cleanup burden property-first rate duplicate rate missing-data rate review-ready rate and source confidence", () => {
    const result = getSourceQualityIntelligence();
    const allLaneSignals = result.sourceQualityLanes.flatMap((lane) => lane.signals);

    expect(allLaneSignals).toEqual(
      expect.arrayContaining([
        "cleanup_burden",
        "property_first_rate",
        "duplicate_rate",
        "missing_data_rate",
        "review_ready_rate",
        "source_confidence",
      ]),
    );
  });

  it("keeps provider outbound autonomous outreach scraping CRM and runtime execution flags false", () => {
    const flags = getSourceQualityIntelligence().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.autonomousOutreachEnabled).toBe(false);
    expect(flags.autonomousAcquisitionEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.scrapingExpansionEnabled).toBe(false);
    expect(flags.publicRecordConnectorsEnabled).toBe(false);
    expect(flags.crmAutomationEnabled).toBe(false);
    expect(flags.runtimeAcquisitionJobsEnabled).toBe(false);
    expect(flags.acquisitionExecutionAuthorized).toBe(false);
  });

  it("keeps scoring persistence queues routing assignments reminders vectors embeddings and external lookup false", () => {
    const flags = getSourceQualityIntelligence().flags;

    expect(flags.sourceScoringPersisted).toBe(false);
    expect(flags.acquisitionQueueCreated).toBe(false);
    expect(flags.acquisitionAssignmentCreated).toBe(false);
    expect(flags.acquisitionRoutingCreated).toBe(false);
    expect(flags.acquisitionReminderCreated).toBe(false);
    expect(flags.vectorDatabaseEnabled).toBe(false);
    expect(flags.embeddingsEnabled).toBe(false);
    expect(flags.externalLookupEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
  });

  it("keeps source quality from mutating records creating leads or increasing spend", () => {
    const flags = getSourceQualityIntelligence().flags;

    expect(flags.sourceQualityCreatesLeads).toBe(false);
    expect(flags.sourceQualityMutatesRecords).toBe(false);
    expect(flags.sourceQualityIncreasesSpend).toBe(false);
  });

  it("keeps ROI doctrine focused on quality before volume and no increased spend", () => {
    const result = getSourceQualityIntelligence();

    expect(result.roiDoctrine.join(" ")).toMatch(/Improve quality before volume/i);
    expect(result.roiDoctrine.join(" ")).toMatch(/Reduce manual waste/i);
    expect(result.roiDoctrine.join(" ")).toMatch(/Use existing data only/i);
    expect(result.roiDoctrine.join(" ")).toMatch(/Do not increase spend/i);
  });

  it("forbids source quality drift into execution and automation", () => {
    const result = getSourceQualityIntelligence();

    expect(result.forbiddenSourceQualityDrift).toEqual(
      expect.arrayContaining([
        "autonomous acquisition",
        "autonomous outreach",
        "scraping expansion",
        "provider activation",
        "outbound messaging",
        "CRM automation",
        "persistence",
        "source scoring activation",
        "routing",
        "assignments",
        "queues",
        "reminders",
        "runtime acquisition execution",
        "external lookup",
        "public-record connector activation",
        "lead spend increase",
      ]),
    );
  });

  it("classifies source quality findings by implementation priority and scope", () => {
    const result = getSourceQualityIntelligence();
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
    expect(result.findings.some((finding) => finding.question.includes("A1.4"))).toBe(true);
  });

  it("asserts invariants and summarizes the next stage", () => {
    const result = getSourceQualityIntelligence();

    expect(() => assertSourceQualityIntelligenceSafe(result)).not.toThrow();
    expect(summarizeSourceQualityIntelligence(result)).toMatch(/Source quality improves acquisition quality before volume/i);
    expect(summarizeSourceQualityIntelligence(result)).toMatch(/No providers/i);
    expect(summarizeSourceQualityIntelligence(result)).toMatch(/source scoring persistence/i);
    expect(summarizeSourceQualityIntelligence(result)).toMatch(/Next stage: A1\.5 Duplicate And Cleanup Review Practicalization/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getSourceQualityIntelligence(),
      flags: {
        ...sourceQualityIntelligenceFlags,
        providerActivated: true,
      },
    };

    expect(() => assertSourceQualityIntelligenceSafe(unsafeResult)).toThrow(/cannot authorize providers/i);
  });

  it("fails invariant checks if source quality readiness drifts beyond planning", () => {
    const unsafeResult = {
      ...getSourceQualityIntelligence(),
      sourceQualityReadiness: "needs_operator_review" as const,
    };

    expect(() => assertSourceQualityIntelligenceSafe(unsafeResult)).toThrow(/cannot become execution-ready/i);
  });

  it("fails invariant checks if the roadmap skips A1.5", () => {
    const unsafeResult = {
      ...getSourceQualityIntelligence(),
      recommendedNextExactStep: "Provider Activation Pilot" as "A1.5 Duplicate And Cleanup Review Practicalization",
    };

    expect(() => assertSourceQualityIntelligenceSafe(unsafeResult)).toThrow(/A1.5 Duplicate And Cleanup Review Practicalization/i);
  });

  it("fails invariant checks if the next stage recommendation is missing", () => {
    const unsafeResult = {
      ...getSourceQualityIntelligence(),
      nextStageRecommendation: "Stop And Measure Acquisition ROI" as "A1.5 Duplicate And Cleanup Review Practicalization",
    };

    expect(() => assertSourceQualityIntelligenceSafe(unsafeResult)).toThrow(/next stage recommendation/i);
  });
});
