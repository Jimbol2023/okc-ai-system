import {
  createR81MarketTimingMomentumSafetyAccessibilityReview,
  summarizeR81MarketTimingMomentumSafetyReview,
} from "./r81-market-timing-momentum-safety-accessibility-review";

const reviewedInput = {
  noLiveDataReviewed: true,
  noScrapingReviewed: true,
  noExternalApiReviewed: true,
  noMlsReviewed: true,
  noPublicRecordCrawlingReviewed: true,
  noLeadCreationReviewed: true,
  noContactReviewed: true,
  noOutreachReviewed: true,
  noProviderReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  timingExecutionReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R81E market timing momentum safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR81MarketTimingMomentumSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Timing does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR81MarketTimingMomentumSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("market_timing_safety_clear");
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
  });

  it("pressure-tests unsafe market data, sourcing, contact, and execution requests as blocked", () => {
    const result = createR81MarketTimingMomentumSafetyAccessibilityReview({
      ...reviewedInput,
      liveDataRequested: true,
      scrapingRequested: true,
      externalApiRequested: true,
      mlsRequested: true,
      publicRecordCrawlingRequested: true,
      fetchNetworkRequested: true,
      leadCreationRequested: true,
      contactRequested: true,
      outreachRequested: true,
      providerRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("market_timing_safety_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["live data ingestion remains blocked", "MLS access remains blocked", "fetch/network remains blocked", "execution remains blocked"]));
  });

  it("summarizes accessibility and governance review", () => {
    const result = createR81MarketTimingMomentumSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR81MarketTimingMomentumSafetyReview(result)).toMatch(/timing-does-not-execute doctrine/i);
  });
});
