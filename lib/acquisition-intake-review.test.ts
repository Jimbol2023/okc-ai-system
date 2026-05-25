import {
  acquisitionIntakeReviewFlags,
  createAcquisitionIntakeReviewSummary,
  reviewAcquisitionIntake,
} from "./acquisition-intake-review";
import type { ImportedLeadPreview } from "./list-importer";

function makePreview(overrides: Partial<ImportedLeadPreview> = {}): ImportedLeadPreview {
  return {
    firstName: "Ada",
    lastName: "Seller",
    ownerName: "",
    phone: "4055551212",
    email: "",
    propertyAddress: "123 Main St",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    mailingAddress: "",
    county: "Oklahoma",
    parcelId: "parcel-1",
    situationDetails: "Imported public-list review.",
    source: "tax_delinquent",
    duplicate: false,
    validationErrors: [],
    importReadiness: "contact_ready",
    sourceResolution: "high_confidence_source",
    rawSourceLabel: "tax_delinquent",
    matchedHeaders: [],
    unmappedHeaders: [],
    sourceReviewReasons: [],
    ...overrides,
  };
}

describe("acquisition intake review", () => {
  it("returns not-ready manual guidance for empty previews", () => {
    const result = reviewAcquisitionIntake([]);

    expect(result.totalRows).toBe(0);
    expect(result.acquisitionReadiness).toBe("not_ready");
    expect(result.readinessLabel).toBe("Not ready");
    expect(result.readinessDetail).toMatch(/Load a CSV preview/i);
    expect(result.importConfidence).toBe("none");
    expect(result.safeNextManualReview).toContain("Resolve source");
  });

  it("marks valid import rows as ready for manual acquisition intake review", () => {
    const result = reviewAcquisitionIntake([
      makePreview(),
      makePreview({ source: "d4d", propertyAddress: "456 Main St" }),
    ]);

    expect(result.readyRows).toBe(2);
    expect(result.acquisitionReadiness).toBe("ready_for_manual_import_review");
    expect(result.readinessLabel).toBe("Ready for manual import review");
    expect(result.readinessDetail).toMatch(/does not authorize outreach/i);
    expect(result.importConfidence).toBe("high");
    expect(result.sourceMix).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: "tax_delinquent", count: 1 }),
        expect.objectContaining({ source: "driving_for_dollars", count: 1 }),
      ]),
    );
  });

  it("surfaces duplicate and invalid rows for cleanup review", () => {
    const result = reviewAcquisitionIntake([
      makePreview({ duplicate: true }),
      makePreview({ propertyAddress: "", validationErrors: ["Property address is required."], importReadiness: "blocked_cleanup" }),
    ]);

    expect(result.duplicateRows).toBe(1);
    expect(result.invalidRows).toBe(1);
    expect(result.cleanupNeeds).toEqual(expect.arrayContaining(["1 invalid row need cleanup", "1 duplicate row need review"]));
    expect(result.acquisitionReadiness).toBe("needs_cleanup");
  });

  it("surfaces duplicate-only previews as duplicate review rather than cleanup", () => {
    const result = reviewAcquisitionIntake([makePreview({ duplicate: true })]);

    expect(result.duplicateRows).toBe(1);
    expect(result.invalidRows).toBe(0);
    expect(result.acquisitionReadiness).toBe("needs_duplicate_review");
    expect(result.readinessLabel).toBe("Duplicate review needed");
    expect(result.readinessDetail).toMatch(/already exist/i);
  });

  it("surfaces missing source contact and address clearly", () => {
    const result = reviewAcquisitionIntake([
      makePreview({
        source: "",
        phone: "",
        email: "",
        propertyAddress: "",
        validationErrors: ["Property address is required."],
        importReadiness: "blocked_cleanup",
        sourceResolution: "cleanup_needed",
      }),
    ]);

    expect(result.missingSourceRows).toBe(1);
    expect(result.sourceReviewRows).toBe(1);
    expect(result.missingContactRows).toBe(1);
    expect(result.missingAddressRows).toBe(1);
    expect(result.acquisitionReadiness).toBe("needs_cleanup");
    expect(result.readinessLabel).toBe("Cleanup before import");
    expect(result.sourceClarity).toMatch(/source review/i);
    expect(result.cleanupNeeds.join(" ")).toMatch(/source review|property address/i);
  });

  it("treats property-first rows as importable manual review instead of invalid cleanup", () => {
    const result = reviewAcquisitionIntake([
      makePreview({
        phone: "",
        email: "",
        importReadiness: "property_first_review",
      }),
    ]);

    expect(result.readyRows).toBe(1);
    expect(result.contactReadyRows).toBe(0);
    expect(result.propertyFirstRows).toBe(1);
    expect(result.missingContactRows).toBe(1);
    expect(result.invalidRows).toBe(0);
    expect(result.acquisitionReadiness).toBe("ready_for_manual_import_review");
    expect(result.cleanupNeeds).toEqual(
      expect.arrayContaining(["1 property-first row will import blocked for contact cleanup"]),
    );
  });

  it("keeps manual-import fallback rows visible for source review", () => {
    const result = reviewAcquisitionIntake([
      makePreview({
        source: "tax_delinquent",
        sourceResolution: "fallback_manual_source",
        importReadiness: "property_first_review",
        rawSourceLabel: "",
        sourceReviewReasons: ["No source column value was found; review the selected default source before import."],
      }),
    ]);

    expect(result.sourceMix).toEqual([expect.objectContaining({ source: "tax_delinquent", count: 1 })]);
    expect(result.missingSourceRows).toBe(0);
    expect(result.sourceReviewRows).toBe(0);
    expect(result.fallbackSourceRows).toBe(1);
    expect(result.acquisitionReadiness).toBe("ready_for_manual_import_review");
    expect(result.cleanupNeeds).toEqual(expect.arrayContaining(["1 row use default-source fallback"]));
  });

  it("normalizes aliased and unknown sources while preserving operator review visibility", () => {
    const result = reviewAcquisitionIntake([
      makePreview({ source: "county" }),
      makePreview({
        source: "manual_import",
        rawSourceLabel: "mystery-list",
        sourceResolution: "unknown_source",
        importReadiness: "blocked_cleanup",
        propertyAddress: "456 Main St",
      }),
    ]);

    expect(result.sourceMix).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: "tax_delinquent", count: 1 }),
        expect.objectContaining({ source: "manual_import", count: 1 }),
      ]),
    );
    expect(result.missingSourceRows).toBe(1);
    expect(result.unknownSourceRows).toBe(1);
  });

  it("summarizes high-confidence source rows and unmapped headers without authorizing execution", () => {
    const result = reviewAcquisitionIntake([
      makePreview({ sourceResolution: "high_confidence_source", unmappedHeaders: ["Extra Field"] }),
      makePreview({ source: "d4d", sourceResolution: "high_confidence_source", propertyAddress: "456 Main St" }),
    ]);

    expect(result.highConfidenceSourceRows).toBe(2);
    expect(result.fallbackSourceRows).toBe(0);
    expect(result.unknownSourceRows).toBe(0);
    expect(result.unmappedHeaders).toEqual(["Extra Field"]);
    expect(result.cleanupNeeds).toEqual(expect.arrayContaining(["1 unmapped CSV header need review"]));
  });

  it("keeps compliance labels advisory and execution storage provider outreach and CRM mutation flags blocked", () => {
    const summary = createAcquisitionIntakeReviewSummary();
    const result = reviewAcquisitionIntake([makePreview()]);

    expect(result.complianceLabels.join(" ")).toMatch(/No scraping|outreach|CRM mutation/i);
    expect(result.complianceLabels.join(" ")).toMatch(/source-labeled and manually reviewed before any outreach/i);
    expect(summary.deferred).toEqual(expect.arrayContaining(["public-record connectors", "virtual D4D", "territory scoring"]));
    expect(acquisitionIntakeReviewFlags.providerCalled).toBe(false);
    expect(acquisitionIntakeReviewFlags.sent).toBe(false);
    expect(acquisitionIntakeReviewFlags.scrapingTriggered).toBe(false);
    expect(acquisitionIntakeReviewFlags.hiddenScrapingInfrastructureCreated).toBe(false);
    expect(acquisitionIntakeReviewFlags.mlsScrapingAllowed).toBe(false);
    expect(acquisitionIntakeReviewFlags.outreachCreated).toBe(false);
    expect(acquisitionIntakeReviewFlags.autonomousApprovalAllowed).toBe(false);
    expect(acquisitionIntakeReviewFlags.autonomousCrmMutationAllowed).toBe(false);
    expect(acquisitionIntakeReviewFlags.queueCreated).toBe(false);
    expect(acquisitionIntakeReviewFlags.reminderCreated).toBe(false);
    expect(acquisitionIntakeReviewFlags.calendarItemCreated).toBe(false);
    expect(acquisitionIntakeReviewFlags.routingCreated).toBe(false);
    expect(acquisitionIntakeReviewFlags.assignmentCreated).toBe(false);
    expect(acquisitionIntakeReviewFlags.auditWritingAllowed).toBe(false);
    expect(acquisitionIntakeReviewFlags.storageAuthorizedByReview).toBe(false);
    expect(acquisitionIntakeReviewFlags.routeExecutionAllowed).toBe(false);
  });
});
