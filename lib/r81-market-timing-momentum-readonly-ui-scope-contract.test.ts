import {
  createR81MarketTimingMomentumReadonlyUiScopeContract,
  summarizeR81MarketTimingMomentumReadonlyUiScope,
} from "./r81-market-timing-momentum-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  safeCopyReviewed: true,
  forbiddenSurfacesReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R81C market timing momentum readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR81MarketTimingMomentumReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.authorizedSurfaces).toContain("components/dashboard/market-timing-momentum-summary.tsx");
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR81MarketTimingMomentumReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("market_timing_ui_scope_ready");
    expect(result.safeCopy).toContain("No live data ingestion, scraping, MLS access, public-record crawling, or external APIs are authorized.");
  });

  it("pressure-tests forbidden market UI surfaces", () => {
    const result = createR81MarketTimingMomentumReadonlyUiScopeContract({
      ...reviewedInput,
      buttonRequested: true,
      dataFetchControlRequested: true,
      liveMarketControlRequested: true,
      mlsControlRequested: true,
      scrapingLinkRequested: true,
      providerControlRequested: true,
      executionControlRequested: true,
      fetchNetworkRequested: true,
    });
    expect(result.status).toBe("market_timing_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["live market controls remain forbidden", "MLS controls remain forbidden", "execution controls remain forbidden", "fetch/network remains blocked"]));
  });

  it("preserves accessibility requirements", () => {
    const result = createR81MarketTimingMomentumReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.noAutoRefresh).toBe(true);
  });

  it("summarizes read-only market visibility boundaries", () => {
    const result = createR81MarketTimingMomentumReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR81MarketTimingMomentumReadonlyUiScope(result)).toMatch(/no-live-data, no-scraping/i);
  });
});
