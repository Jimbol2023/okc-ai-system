import {
  createR81MarketTimingMomentumFinalLockdownContract,
  summarizeR81MarketTimingMomentumFinalLockdown,
} from "./r81-market-timing-momentum-final-lockdown-contract";

const lockedInput = {
  r81aReviewed: true,
  r81bReviewed: true,
  r81cReviewed: true,
  r81dReviewed: true,
  r81eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R81F market timing momentum final lockdown contract", () => {
  it("defaults to operator review required", () => {
    const result = createR81MarketTimingMomentumFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.marketTimingLockdownEnforced).toBe(true);
  });

  it("smoke-tests final lockdown enforcement", () => {
    const result = createR81MarketTimingMomentumFinalLockdownContract(lockedInput);
    expect(result.status).toBe("market_timing_lockdown_enforced");
    expect(result.lockdownRules).toEqual(expect.arrayContaining(["Market timing signals never execute.", "Momentum scores never trigger campaigns.", "No MLS access is authorized.", "Execution remains blocked."]));
    expect(result.nextPhase).toBe("R82A - Acquisition Data Verification Readiness Scope Contract");
  });

  it("pressure-tests every final lockdown path as blocked", () => {
    const result = createR81MarketTimingMomentumFinalLockdownContract({
      ...lockedInput,
      executionRequested: true,
      campaignRequested: true,
      leadCreationRequested: true,
      buyerSellerContactRequested: true,
      scrapingRequested: true,
      providerActivationRequested: true,
      externalApiRequested: true,
      mlsRequested: true,
      publicRecordCrawlingRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("market_timing_lockdown_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["market timing signals never execute", "momentum scores never trigger campaigns", "MLS access remains blocked", "fetch/network remains blocked"]));
  });

  it("summarizes the final lockdown", () => {
    const result = createR81MarketTimingMomentumFinalLockdownContract(lockedInput);
    expect(summarizeR81MarketTimingMomentumFinalLockdown(result)).toMatch(/market timing signals never execute/i);
  });
});
