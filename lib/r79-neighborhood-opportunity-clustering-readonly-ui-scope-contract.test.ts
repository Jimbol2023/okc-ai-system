import {
  createR79NeighborhoodOpportunityClusteringReadonlyUiScopeContract,
  summarizeR79NeighborhoodOpportunityClusteringReadonlyUiScope,
} from "./r79-neighborhood-opportunity-clustering-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  safeCopyReviewed: true,
  forbiddenSurfacesReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R79C neighborhood opportunity clustering readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR79NeighborhoodOpportunityClusteringReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.authorizedSurfaces).toContain("components/dashboard/neighborhood-opportunity-clustering-summary.tsx");
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR79NeighborhoodOpportunityClusteringReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("neighborhood_clustering_ui_scope_ready");
    expect(result.safeCopy).toContain("No geocoding, map crawling, Street View automation, or scraping is authorized.");
  });

  it("pressure-tests forbidden geodata, contact, and lead UI surfaces", () => {
    const result = createR79NeighborhoodOpportunityClusteringReadonlyUiScopeContract({
      ...reviewedInput,
      buttonRequested: true,
      mapControlRequested: true,
      geocodingControlRequested: true,
      leadCreationControlRequested: true,
      scrapingLinkRequested: true,
      ownerContactControlRequested: true,
      buyerSellerContactControlRequested: true,
      campaignControlRequested: true,
      providerControlRequested: true,
      fetchNetworkRequested: true,
    });
    expect(result.status).toBe("neighborhood_clustering_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining(["map controls remain forbidden", "geocoding controls remain forbidden", "lead creation controls remain forbidden", "buyer/seller contact controls remain forbidden", "fetch/network remains blocked"]),
    );
  });

  it("preserves accessibility requirements", () => {
    const result = createR79NeighborhoodOpportunityClusteringReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noAutoRefresh).toBe(true);
  });

  it("summarizes read-only cluster visibility boundaries", () => {
    const result = createR79NeighborhoodOpportunityClusteringReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR79NeighborhoodOpportunityClusteringReadonlyUiScope(result)).toMatch(/no-geocoding, no-map-crawling, no-scraping/i);
  });
});
