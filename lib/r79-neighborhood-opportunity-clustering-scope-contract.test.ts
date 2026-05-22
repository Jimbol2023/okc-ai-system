import {
  createR79NeighborhoodOpportunityClusteringScopeContract,
  summarizeR79NeighborhoodOpportunityClusteringScope,
} from "./r79-neighborhood-opportunity-clustering-scope-contract";

const reviewedInput = {
  clusteringDoctrineReviewed: true,
  advisoryOnlyReviewed: true,
  manualReviewReviewed: true,
  explainabilityReviewed: true,
  confidenceLimitReviewed: true,
  unverifiedPatternReviewed: true,
  missingAreaDataReviewed: true,
  geodataBoundaryReviewed: true,
  contactBoundaryReviewed: true,
  providerIsolationReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R79A neighborhood opportunity clustering scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR79NeighborhoodOpportunityClusteringScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("neighborhood opportunity clustering doctrine");
  });

  it("smoke-tests advisory-only clustering scope readiness", () => {
    const result = createR79NeighborhoodOpportunityClusteringScopeContract(reviewedInput);
    expect(result.status).toBe("neighborhood_clustering_scope_ready");
    expect(result.flags.geocodingAllowed).toBe(false);
    expect(result.flags.leadCreationAllowed).toBe(false);
  });

  it("pressure-tests forbidden geodata, contact, sourcing, and execution paths", () => {
    const result = createR79NeighborhoodOpportunityClusteringScopeContract({
      ...reviewedInput,
      geocodingRequested: true,
      mapCrawlingRequested: true,
      scrapingRequested: true,
      leadCreationRequested: true,
      ownerContactRequested: true,
      buyerSellerContactRequested: true,
      skipTracingRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("neighborhood_clustering_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["geocoding remains blocked", "map crawling remains blocked", "lead creation remains blocked", "buyer/seller contact remains blocked", "execution remains blocked"]));
  });

  it("preserves accessibility and future-only audit doctrine", () => {
    const result = createR79NeighborhoodOpportunityClusteringScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.auditBoundary.auditLayerActive).toBe(false);
  });

  it("summarizes the no-geodata automation doctrine", () => {
    const result = createR79NeighborhoodOpportunityClusteringScopeContract(reviewedInput);
    expect(summarizeR79NeighborhoodOpportunityClusteringScope(result)).toMatch(/geocoding, map crawling, scraping/i);
  });
});
