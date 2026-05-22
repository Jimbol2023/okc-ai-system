import {
  createR80AcquisitionResearchWorkbenchSafetyAccessibilityReview,
  summarizeR80AcquisitionResearchWorkbenchSafetyReview,
} from "./r80-acquisition-research-workbench-safety-accessibility-review";

const reviewedInput = {
  noScrapingReviewed: true,
  noGeocodingReviewed: true,
  noMapCrawlingReviewed: true,
  noExternalApiReviewed: true,
  noLeadCreationReviewed: true,
  noSkipTracingReviewed: true,
  noOwnerContactReviewed: true,
  noBuyerSellerContactReviewed: true,
  noOutreachReviewed: true,
  noProviderReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  researchExecutionReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R80E acquisition research workbench safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR80AcquisitionResearchWorkbenchSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Research does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR80AcquisitionResearchWorkbenchSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("acquisition_research_safety_clear");
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
  });

  it("pressure-tests unsafe research, sourcing, contact, and execution requests as blocked", () => {
    const result = createR80AcquisitionResearchWorkbenchSafetyAccessibilityReview({
      ...reviewedInput,
      scrapingRequested: true,
      geocodingRequested: true,
      mapCrawlingRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      leadCreationRequested: true,
      skipTracingRequested: true,
      ownerContactRequested: true,
      buyerSellerContactRequested: true,
      outreachRequested: true,
      campaignRequested: true,
      providerRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("acquisition_research_safety_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["scraping remains blocked", "geocoding remains blocked", "lead creation remains blocked", "fetch/network remains blocked"]));
  });

  it("summarizes accessibility and governance review", () => {
    const result = createR80AcquisitionResearchWorkbenchSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR80AcquisitionResearchWorkbenchSafetyReview(result)).toMatch(/research-does-not-execute doctrine/i);
  });
});
