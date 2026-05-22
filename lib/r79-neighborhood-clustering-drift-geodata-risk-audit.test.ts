import {
  createR79NeighborhoodClusteringDriftGeodataRiskAudit,
  summarizeR79NeighborhoodClusteringDriftAudit,
} from "./r79-neighborhood-clustering-drift-geodata-risk-audit";

const reviewedInput = {
  geocodingReviewed: true,
  mapCrawlingReviewed: true,
  scrapingReviewed: true,
  leadCreationReviewed: true,
  ownerContactReviewed: true,
  campaignReviewed: true,
  outreachReviewed: true,
  publicRecordCrawlingReviewed: true,
  externalApiReviewed: true,
  dealBlastReviewed: true,
  providerReviewed: true,
  persistenceReviewed: true,
  auditBoundaryReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R79B neighborhood clustering drift geodata risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR79NeighborhoodClusteringDriftGeodataRiskAudit();
    expect(result.status).toBe("operator_review_required");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR79NeighborhoodClusteringDriftGeodataRiskAudit(reviewedInput);
    expect(result.status).toBe("neighborhood_clustering_drift_audit_clear");
    expect(result.flags.geocodingAllowed).toBe(false);
  });

  it("pressure-tests geodata and execution drift as blocked", () => {
    const result = createR79NeighborhoodClusteringDriftGeodataRiskAudit({
      ...reviewedInput,
      geocodingRequested: true,
      mapCrawlingRequested: true,
      scrapingRequested: true,
      leadCreationRequested: true,
      ownerContactRequested: true,
      campaignRequested: true,
      externalApiRequested: true,
      dealBlastRequested: true,
      fetchNetworkRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("neighborhood_clustering_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["clusters cannot geocode", "clusters cannot map crawl", "clusters cannot create leads", "execution remains blocked"]));
  });

  it("summarizes geodata drift boundaries", () => {
    const result = createR79NeighborhoodClusteringDriftGeodataRiskAudit(reviewedInput);
    expect(summarizeR79NeighborhoodClusteringDriftAudit(result)).toMatch(/geocoding, map crawling, scraping/i);
  });
});
