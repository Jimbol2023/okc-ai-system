import {
  createR79NeighborhoodOpportunityClusteringFinalLockdownContract,
  summarizeR79NeighborhoodOpportunityClusteringFinalLockdown,
} from "./r79-neighborhood-opportunity-clustering-final-lockdown-contract";

const lockedInput = {
  r79aReviewed: true,
  r79bReviewed: true,
  r79cReviewed: true,
  r79dReviewed: true,
  r79eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R79F neighborhood opportunity clustering final lockdown contract", () => {
  it("defaults to operator review required", () => {
    const result = createR79NeighborhoodOpportunityClusteringFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.neighborhoodClusteringLockdownEnforced).toBe(true);
  });

  it("smoke-tests final lockdown enforcement", () => {
    const result = createR79NeighborhoodOpportunityClusteringFinalLockdownContract(lockedInput);
    expect(result.status).toBe("neighborhood_clustering_lockdown_enforced");
    expect(result.lockdownRules).toEqual(expect.arrayContaining(["Clusters never geocode.", "Clusters never map crawl.", "Clusters never create leads.", "Execution remains blocked."]));
    expect(result.nextPhase).toBe("R80A - Acquisition Research Workbench Scope Contract");
  });

  it("pressure-tests every final lockdown path as blocked", () => {
    const result = createR79NeighborhoodOpportunityClusteringFinalLockdownContract({
      ...lockedInput,
      geocodingRequested: true,
      mapCrawlingRequested: true,
      scrapingRequested: true,
      leadCreationRequested: true,
      ownerContactRequested: true,
      buyerSellerContactRequested: true,
      outreachRequested: true,
      campaignRequested: true,
      externalApiFromMissingAreaDataRequested: true,
      dealBlastRequested: true,
      externalApiRequested: true,
      providerActivationRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("neighborhood_clustering_lockdown_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["clusters never geocode", "clusters never map crawl", "clusters never create leads", "fetch/network remains blocked"]));
  });

  it("summarizes the final lockdown", () => {
    const result = createR79NeighborhoodOpportunityClusteringFinalLockdownContract(lockedInput);
    expect(summarizeR79NeighborhoodOpportunityClusteringFinalLockdown(result)).toMatch(/clusters never geocode, map crawl, scrape/i);
  });
});
