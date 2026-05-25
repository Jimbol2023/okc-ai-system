import {
  assertDuplicateCleanupReviewPracticalizationSafe,
  duplicateCleanupReviewPracticalizationFlags,
  getDuplicateCleanupReviewPracticalization,
  summarizeDuplicateCleanupReviewPracticalization,
} from "./duplicate-cleanup-review-practicalization";

describe("duplicate cleanup review practicalization", () => {
  it("creates a planning-only A1.5 duplicate cleanup contract", () => {
    const result = getDuplicateCleanupReviewPracticalization();

    expect(result.phase).toBe("A1.5 Duplicate And Cleanup Review Practicalization");
    expect(result.duplicateCleanupReadiness).toBe("planning_only");
    expect(result.recommendedNextExactStep).toBe("A2 Read-Only Public Records Intake Planning Gate");
    expect(result.nextStageRecommendation).toBe("A2 Read-Only Public Records Intake Planning Gate");
  });

  it("keeps duplicate cleanup read-only advisory-only and planning-only", () => {
    const result = getDuplicateCleanupReviewPracticalization();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("keeps every blocked duplicate cleanup execution flag false", () => {
    const flags = getDuplicateCleanupReviewPracticalization().flags;

    expect(flags.duplicateAutoMergeEnabled).toBe(false);
    expect(flags.duplicateAutoDeleteEnabled).toBe(false);
    expect(flags.importAutoApprovalEnabled).toBe(false);
    expect(flags.cleanupAutoFixEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.providerActivated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.scrapingEnabled).toBe(false);
    expect(flags.skipTracingEnabled).toBe(false);
    expect(flags.publicRecordConnectorsEnabled).toBe(false);
    expect(flags.persistenceEnabled).toBe(false);
    expect(flags.auditWritingEnabled).toBe(false);
    expect(flags.vectorDatabaseEnabled).toBe(false);
    expect(flags.embeddingsEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.queueSystemEnabled).toBe(false);
    expect(flags.routingEnabled).toBe(false);
    expect(flags.assignmentEnabled).toBe(false);
    expect(flags.reminderSystemEnabled).toBe(false);
    expect(flags.autonomousAcquisitionEnabled).toBe(false);
    expect(flags.autonomousOutreachEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
  });

  it("defines all required duplicate cleanup lanes", () => {
    const result = getDuplicateCleanupReviewPracticalization();

    expect(result.duplicateCleanupLanes.map((lane) => lane.lane)).toEqual(
      expect.arrayContaining([
        "duplicate_review_clarity",
        "invalid_row_cleanup",
        "source_cleanup",
        "property_address_cleanup",
        "missing_contact_cleanup",
        "unmapped_header_review",
        "property_first_cleanup",
        "operator_scanability",
      ]),
    );
  });

  it("defines manual labels including duplicate review and cleanup before import", () => {
    const result = getDuplicateCleanupReviewPracticalization();

    expect(result.manualReviewLabels).toEqual(
      expect.arrayContaining([
        "duplicate review",
        "cleanup before import",
        "source review",
        "property-first contact cleanup",
        "missing property address",
        "unmapped headers",
        "invalid row review",
      ]),
    );
  });

  it("references existing importer and intake concepts without adding runtime behavior", () => {
    const result = getDuplicateCleanupReviewPracticalization();

    expect(result.existingReviewInputs).toEqual(
      expect.arrayContaining([
        "duplicate",
        "validationErrors",
        "blocked_cleanup",
        "cleanup_needed",
        "importBlockers",
        "sourceReviewReasons",
        "unmappedHeaders",
        "cleanupNeeds",
        "missingSourceRows",
        "missingAddressRows",
        "duplicateRows",
      ]),
    );
    expect(result.flags.runtimeJobsEnabled).toBe(false);
  });

  it("keeps duplicate review from merging deleting or importing automatically", () => {
    const result = getDuplicateCleanupReviewPracticalization();
    const lane = result.duplicateCleanupLanes.find((item) => item.lane === "duplicate_review_clarity");

    expect(lane?.governanceRule).toMatch(/cannot merge, delete, import/i);
    expect(result.flags.duplicateAutoMergeEnabled).toBe(false);
    expect(result.flags.duplicateAutoDeleteEnabled).toBe(false);
    expect(result.flags.importAutoApprovalEnabled).toBe(false);
  });

  it("keeps cleanup review from mutating records or auto-fixing data", () => {
    const result = getDuplicateCleanupReviewPracticalization();

    expect(result.practicalizationDoctrine.join(" ")).toMatch(/Never auto-fix records/i);
    expect(result.flags.cleanupAutoFixEnabled).toBe(false);
    expect(result.flags.cleanupMutatesRecords).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
  });

  it("keeps missing contact cleanup from skip tracing enrichment or outreach", () => {
    const result = getDuplicateCleanupReviewPracticalization();
    const lane = result.duplicateCleanupLanes.find((item) => item.lane === "missing_contact_cleanup");

    expect(lane?.governanceRule).toMatch(/cannot trigger skip tracing, enrichment, seller contact, or provider activation/i);
    expect(result.flags.skipTracingEnabled).toBe(false);
    expect(result.flags.missingContactTriggersEnrichment).toBe(false);
    expect(result.flags.outboundSmsEnabled).toBe(false);
  });

  it("keeps property-first cleanup from authorizing outreach", () => {
    const result = getDuplicateCleanupReviewPracticalization();
    const lane = result.duplicateCleanupLanes.find((item) => item.lane === "property_first_cleanup");

    expect(lane?.manualMeaning).toMatch(/blocked from outreach/i);
    expect(lane?.governanceRule).toMatch(/cannot authorize outreach/i);
    expect(result.flags.propertyFirstAuthorizesOutreach).toBe(false);
  });

  it("forbids duplicate cleanup drift into execution and automation", () => {
    const result = getDuplicateCleanupReviewPracticalization();

    expect(result.forbiddenDuplicateCleanupDrift).toEqual(
      expect.arrayContaining([
        "auto-merge duplicates",
        "auto-delete duplicates",
        "auto-import duplicate rows",
        "auto-fix cleanup rows",
        "CRM mutation",
        "persistence",
        "queue creation",
        "routing creation",
        "assignment creation",
        "reminder creation",
        "scraping",
        "skip tracing",
        "provider activation",
        "outbound messaging",
        "runtime execution",
        "public-record connector activation",
        "audit writing",
        "approval-as-execution",
      ]),
    );
  });

  it("keeps practicalization doctrine focused on scanability manual waste and existing data", () => {
    const result = getDuplicateCleanupReviewPracticalization();

    expect(result.practicalizationDoctrine.join(" ")).toMatch(/Improve scanability/i);
    expect(result.practicalizationDoctrine.join(" ")).toMatch(/Reduce manual waste/i);
    expect(result.practicalizationDoctrine.join(" ")).toMatch(/Preserve source attribution/i);
    expect(result.practicalizationDoctrine.join(" ")).toMatch(/Use existing preview data only/i);
  });

  it("classifies duplicate cleanup findings by implementation priority and scope", () => {
    const result = getDuplicateCleanupReviewPracticalization();
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
    expect(result.findings.some((finding) => finding.question.includes("duplicate and cleanup"))).toBe(true);
  });

  it("asserts invariants and summarizes the next stage", () => {
    const result = getDuplicateCleanupReviewPracticalization();

    expect(() => assertDuplicateCleanupReviewPracticalizationSafe(result)).not.toThrow();
    expect(summarizeDuplicateCleanupReviewPracticalization(result)).toMatch(/Duplicate and cleanup review practicalization improves scanability/i);
    expect(summarizeDuplicateCleanupReviewPracticalization(result)).toMatch(/No auto-merge/i);
    expect(summarizeDuplicateCleanupReviewPracticalization(result)).toMatch(/property-first outreach/i);
    expect(summarizeDuplicateCleanupReviewPracticalization(result)).toMatch(/Next stage: A2 Read-Only Public Records Intake Planning Gate/i);
  });

  it("fails invariant checks if any blocked flag drifts true", () => {
    const unsafeResult = {
      ...getDuplicateCleanupReviewPracticalization(),
      flags: {
        ...duplicateCleanupReviewPracticalizationFlags,
        duplicateAutoMergeEnabled: true,
      },
    };

    expect(() => assertDuplicateCleanupReviewPracticalizationSafe(unsafeResult)).toThrow(/cannot authorize auto-merge/i);
  });

  it("fails invariant checks if cleanup readiness drifts beyond planning", () => {
    const unsafeResult = {
      ...getDuplicateCleanupReviewPracticalization(),
      duplicateCleanupReadiness: "needs_operator_review" as const,
    };

    expect(() => assertDuplicateCleanupReviewPracticalizationSafe(unsafeResult)).toThrow(/cannot become execution-ready/i);
  });

  it("fails invariant checks if the roadmap skips A2", () => {
    const unsafeResult = {
      ...getDuplicateCleanupReviewPracticalization(),
      recommendedNextExactStep: "Provider Activation Pilot" as "A2 Read-Only Public Records Intake Planning Gate",
    };

    expect(() => assertDuplicateCleanupReviewPracticalizationSafe(unsafeResult)).toThrow(/A2 Read-Only Public Records Intake Planning Gate/i);
  });

  it("fails invariant checks if the next stage recommendation is missing", () => {
    const unsafeResult = {
      ...getDuplicateCleanupReviewPracticalization(),
      nextStageRecommendation: "Stop And Measure Acquisition ROI" as "A2 Read-Only Public Records Intake Planning Gate",
    };

    expect(() => assertDuplicateCleanupReviewPracticalizationSafe(unsafeResult)).toThrow(/next stage recommendation/i);
  });
});
