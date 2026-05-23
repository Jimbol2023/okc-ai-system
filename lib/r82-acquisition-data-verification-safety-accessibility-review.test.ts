import {
  createR82AcquisitionDataVerificationSafetyAccessibilityReview,
  summarizeR82AcquisitionDataVerificationSafetyReview,
} from "./r82-acquisition-data-verification-safety-accessibility-review";

const reviewedInput = {
  noLiveVerificationReviewed: true,
  noScrapingReviewed: true,
  noSkipTracingReviewed: true,
  noExternalApiReviewed: true,
  noMlsReviewed: true,
  noPublicRecordCrawlingReviewed: true,
  noLeadCreationReviewed: true,
  noContactReviewed: true,
  noOutreachReviewed: true,
  noProviderReviewed: true,
  noPersistenceReviewed: true,
  noPollingReviewed: true,
  noAuditWritingReviewed: true,
  verificationExecutionReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R82E acquisition data verification safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR82AcquisitionDataVerificationSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Verification readiness does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR82AcquisitionDataVerificationSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("acquisition_data_verification_safety_clear");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
  });

  it("pressure-tests unsafe verification, sourcing, contact, provider, and execution requests as blocked", () => {
    const result = createR82AcquisitionDataVerificationSafetyAccessibilityReview({
      ...reviewedInput,
      liveVerificationRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      externalApiRequested: true,
      mlsRequested: true,
      publicRecordCrawlingRequested: true,
      fetchNetworkRequested: true,
      leadCreationRequested: true,
      contactRequested: true,
      outreachRequested: true,
      ownerLookupRequested: true,
      providerRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      auditWritingRequested: true,
      automationRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("acquisition_data_verification_safety_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "live verification remains blocked",
        "scraping remains blocked",
        "skip tracing remains blocked",
        "MLS access remains blocked",
        "public-record crawling remains blocked",
        "fetch/network remains blocked",
        "lead creation remains blocked",
        "buyer/seller/owner contact remains blocked",
        "provider activation remains blocked",
        "persistence remains blocked",
        "polling remains blocked",
        "audit writing remains blocked",
        "execution remains blocked",
      ]),
    );
  });

  it("preserves accessibility, readable labels, and governance warnings", () => {
    const result = createR82AcquisitionDataVerificationSafetyAccessibilityReview(reviewedInput);
    expect(result.accessibility.readableLabelsPreserved).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
    expect(result.accessibility.visibleNoLiveVerificationWarnings).toBe(true);
    expect(result.accessibility.visibleManualReviewWarnings).toBe(true);
  });

  it("summarizes safety and accessibility review", () => {
    const result = createR82AcquisitionDataVerificationSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR82AcquisitionDataVerificationSafetyReview(result)).toMatch(/verification-readiness-does-not-execute doctrine/i);
    expect(summarizeR82AcquisitionDataVerificationSafetyReview(result)).toMatch(/visible governance warnings/i);
  });
});
