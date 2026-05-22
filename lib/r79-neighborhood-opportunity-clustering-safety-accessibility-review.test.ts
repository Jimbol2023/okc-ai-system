import {
  createR79NeighborhoodOpportunityClusteringSafetyAccessibilityReview,
  summarizeR79NeighborhoodOpportunityClusteringSafetyReview,
} from "./r79-neighborhood-opportunity-clustering-safety-accessibility-review";

const reviewedInput = {
  noGeocodingReviewed: true,
  noMapCrawlingReviewed: true,
  noStreetViewAutomationReviewed: true,
  noScrapingReviewed: true,
  noExternalApiReviewed: true,
  noLeadCreationReviewed: true,
  noSkipTracingReviewed: true,
  noOwnerContactReviewed: true,
  noBuyerSellerContactReviewed: true,
  noCampaignReviewed: true,
  noProviderReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  clusteringExecutionReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R79E neighborhood opportunity clustering safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR79NeighborhoodOpportunityClusteringSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Clustering does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR79NeighborhoodOpportunityClusteringSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("neighborhood_clustering_safety_clear");
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
  });

  it("pressure-tests unsafe geodata, sourcing, contact, and execution requests as blocked", () => {
    const result = createR79NeighborhoodOpportunityClusteringSafetyAccessibilityReview({
      ...reviewedInput,
      geocodingRequested: true,
      mapCrawlingRequested: true,
      streetViewAutomationRequested: true,
      scrapingRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      leadCreationRequested: true,
      ownerContactRequested: true,
      buyerSellerContactRequested: true,
      campaignRequested: true,
      providerRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("neighborhood_clustering_safety_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["geocoding remains blocked", "map crawling remains blocked", "lead creation remains blocked", "fetch/network remains blocked"]));
  });

  it("summarizes accessibility and governance review", () => {
    const result = createR79NeighborhoodOpportunityClusteringSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR79NeighborhoodOpportunityClusteringSafetyReview(result)).toMatch(/clustering-does-not-execute doctrine/i);
  });
});
