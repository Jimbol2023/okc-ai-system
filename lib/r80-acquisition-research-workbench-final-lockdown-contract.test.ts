import {
  createR80AcquisitionResearchWorkbenchFinalLockdownContract,
  summarizeR80AcquisitionResearchWorkbenchFinalLockdown,
} from "./r80-acquisition-research-workbench-final-lockdown-contract";

const lockedInput = {
  r80aReviewed: true,
  r80bReviewed: true,
  r80cReviewed: true,
  r80dReviewed: true,
  r80eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R80F acquisition research workbench final lockdown contract", () => {
  it("defaults to operator review required", () => {
    const result = createR80AcquisitionResearchWorkbenchFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.acquisitionResearchLockdownEnforced).toBe(true);
  });

  it("smoke-tests final lockdown enforcement", () => {
    const result = createR80AcquisitionResearchWorkbenchFinalLockdownContract(lockedInput);
    expect(result.status).toBe("acquisition_research_lockdown_enforced");
    expect(result.lockdownRules).toEqual(expect.arrayContaining(["Research never scrapes.", "Research never geocodes.", "Research never creates leads.", "Execution remains blocked."]));
    expect(result.nextPhase).toBe("R81A - Market Timing & Momentum Intelligence Scope Contract");
  });

  it("pressure-tests every final lockdown path as blocked", () => {
    const result = createR80AcquisitionResearchWorkbenchFinalLockdownContract({
      ...lockedInput,
      scrapingRequested: true,
      geocodingRequested: true,
      mapCrawlingRequested: true,
      leadCreationRequested: true,
      ownerContactRequested: true,
      buyerSellerContactRequested: true,
      campaignRequested: true,
      providerActivationRequested: true,
      externalApiFromMissingDataRequested: true,
      skipTracingRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("acquisition_research_lockdown_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["research never scrapes", "research never creates leads", "research never contacts owners", "fetch/network remains blocked"]));
  });

  it("summarizes the final lockdown", () => {
    const result = createR80AcquisitionResearchWorkbenchFinalLockdownContract(lockedInput);
    expect(summarizeR80AcquisitionResearchWorkbenchFinalLockdown(result)).toMatch(/research never scrapes, geocodes, map crawls/i);
  });
});
