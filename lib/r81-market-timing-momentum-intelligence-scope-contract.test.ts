import {
  createR81MarketTimingMomentumIntelligenceScopeContract,
  summarizeR81MarketTimingMomentumScope,
} from "./r81-market-timing-momentum-intelligence-scope-contract";

const reviewedInput = {
  timingDoctrineReviewed: true,
  momentumAdvisoryReviewed: true,
  timingDoesNotExecuteReviewed: true,
  uncertaintyReviewed: true,
  missingMarketDataReviewed: true,
  manualReviewReviewed: true,
  dataBoundaryReviewed: true,
  contactBoundaryReviewed: true,
  providerIsolationReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R81A market timing momentum intelligence scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR81MarketTimingMomentumIntelligenceScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("market timing intelligence doctrine");
  });

  it("smoke-tests advisory-only market timing scope readiness", () => {
    const result = createR81MarketTimingMomentumIntelligenceScopeContract(reviewedInput);
    expect(result.status).toBe("market_timing_scope_ready");
    expect(result.flags.liveDataIngestionAllowed).toBe(false);
    expect(result.flags.mlsAccessAllowed).toBe(false);
  });

  it("pressure-tests forbidden market data, contact, provider, and execution paths", () => {
    const result = createR81MarketTimingMomentumIntelligenceScopeContract({
      ...reviewedInput,
      liveDataIngestionRequested: true,
      externalApiRequested: true,
      scrapingRequested: true,
      mlsRequested: true,
      publicRecordCrawlingRequested: true,
      leadCreationRequested: true,
      ownerBuyerSellerContactRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      campaignRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("market_timing_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["live data ingestion remains blocked", "MLS access remains blocked", "owner/buyer/seller contact remains blocked", "execution remains blocked"]));
  });

  it("preserves provider isolation, accessibility, and future-only audit doctrine", () => {
    const result = createR81MarketTimingMomentumIntelligenceScopeContract(reviewedInput);
    expect(result.flags.providerClientAllowed).toBe(false);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.auditBoundary.auditLayerActive).toBe(false);
  });

  it("summarizes the no-live-market-data doctrine", () => {
    const result = createR81MarketTimingMomentumIntelligenceScopeContract(reviewedInput);
    expect(summarizeR81MarketTimingMomentumScope(result)).toMatch(/live data ingestion, external APIs, scraping/i);
  });
});
