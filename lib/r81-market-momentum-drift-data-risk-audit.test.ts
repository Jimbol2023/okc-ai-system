import {
  createR81MarketMomentumDriftDataRiskAudit,
  summarizeR81MarketMomentumDriftAudit,
} from "./r81-market-momentum-drift-data-risk-audit";

const reviewedInput = {
  timingExecutionReviewed: true,
  momentumCampaignReviewed: true,
  opportunityLeadCreationReviewed: true,
  missingMarketScrapingReviewed: true,
  demandShiftContactReviewed: true,
  urgencyProviderReviewed: true,
  externalDataReviewed: true,
  mlsReviewed: true,
  publicRecordCrawlingReviewed: true,
  persistenceReviewed: true,
  auditBoundaryReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R81B market momentum drift data risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR81MarketMomentumDriftDataRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("timing-signal-to-execution drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR81MarketMomentumDriftDataRiskAudit(reviewedInput);
    expect(result.status).toBe("market_momentum_drift_audit_clear");
    expect(result.flags.mlsAccessAllowed).toBe(false);
  });

  it("pressure-tests data and execution drift as blocked", () => {
    const result = createR81MarketMomentumDriftDataRiskAudit({
      ...reviewedInput,
      executionRequested: true,
      campaignRequested: true,
      leadCreationRequested: true,
      scrapingRequested: true,
      buyerSellerOwnerContactRequested: true,
      providerRequested: true,
      externalApiRequested: true,
      mlsRequested: true,
      publicRecordCrawlingRequested: true,
      fetchNetworkRequested: true,
    });
    expect(result.status).toBe("market_momentum_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["timing signals cannot execute", "MLS access remains blocked", "fetch/network remains blocked"]));
  });

  it("summarizes market drift boundaries", () => {
    const result = createR81MarketMomentumDriftDataRiskAudit(reviewedInput);
    expect(summarizeR81MarketMomentumDriftAudit(result)).toMatch(/execution, campaigns, leads, scraping/i);
  });
});
