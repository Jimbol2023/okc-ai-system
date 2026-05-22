import {
  createR78BuyerDemandAlignmentFinalLockdownContract,
  summarizeR78BuyerDemandAlignmentFinalLockdown,
} from "./r78-buyer-demand-alignment-final-lockdown-contract";

const lockedInput = {
  r78aReviewed: true,
  r78bReviewed: true,
  r78cReviewed: true,
  r78dReviewed: true,
  r78eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R78F buyer demand alignment final lockdown contract", () => {
  it("defaults to operator review required", () => {
    const result = createR78BuyerDemandAlignmentFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.buyerDemandAlignmentLockdownEnforced).toBe(true);
  });

  it("smoke-tests final lockdown enforcement", () => {
    const result = createR78BuyerDemandAlignmentFinalLockdownContract(lockedInput);
    expect(result.status).toBe("buyer_demand_alignment_lockdown_enforced");
    expect(result.lockdownRules).toEqual(expect.arrayContaining(["Buyer-demand alignment never contacts buyers.", "Alignment never creates matches.", "Demand fit never triggers deal blasts.", "Execution remains blocked."]));
    expect(result.nextPhase).toBe("R79A - Neighborhood Opportunity Clustering Scope Contract");
  });

  it("pressure-tests every final lockdown path as blocked", () => {
    const result = createR78BuyerDemandAlignmentFinalLockdownContract({
      ...lockedInput,
      buyerContactRequested: true,
      sellerContactRequested: true,
      matchCreationRequested: true,
      leadCreationRequested: true,
      outreachRequested: true,
      dealBlastRequested: true,
      campaignRequested: true,
      executionRequested: true,
      scrapingRequested: true,
      aiBuyerContactRequested: true,
      externalApiRequested: true,
      providerActivationRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("buyer_demand_alignment_lockdown_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["buyer-demand alignment never contacts buyers", "alignment never creates matches", "demand fit never triggers deal blasts", "fetch/network remains blocked"]));
  });

  it("summarizes the final lockdown", () => {
    const result = createR78BuyerDemandAlignmentFinalLockdownContract(lockedInput);
    expect(summarizeR78BuyerDemandAlignmentFinalLockdown(result)).toMatch(/never contacts buyers or sellers/i);
  });
});
