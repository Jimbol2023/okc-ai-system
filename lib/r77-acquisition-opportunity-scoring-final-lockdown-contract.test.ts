import {
  createR77AcquisitionOpportunityScoringFinalLockdownContract,
  summarizeR77AcquisitionOpportunityScoringFinalLockdown,
} from "./r77-acquisition-opportunity-scoring-final-lockdown-contract";

const lockedInput = {
  r77aReviewed: true,
  r77bReviewed: true,
  r77cReviewed: true,
  r77dReviewed: true,
  r77eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R77F acquisition opportunity scoring final lockdown contract", () => {
  it("defaults to operator review required", () => {
    const result = createR77AcquisitionOpportunityScoringFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.acquisitionScoringLockdownEnforced).toBe(true);
  });

  it("smoke-tests final lockdown enforcement", () => {
    const result = createR77AcquisitionOpportunityScoringFinalLockdownContract(lockedInput);
    expect(result.status).toBe("acquisition_scoring_lockdown_enforced");
    expect(result.lockdownRules).toEqual(expect.arrayContaining(["Acquisition scores never create leads.", "High scores never trigger outreach.", "Missing data never triggers scraping.", "Execution remains blocked."]));
    expect(result.nextPhase).toBe("R78A - Buyer Demand Alignment Intelligence Scope Contract");
  });

  it("pressure-tests every final lockdown path as blocked", () => {
    const result = createR77AcquisitionOpportunityScoringFinalLockdownContract({
      ...lockedInput,
      scoreLeadCreationRequested: true,
      scoreOwnerContactRequested: true,
      highScoreOutreachRequested: true,
      highScoreCampaignRequested: true,
      buyerDemandCampaignRequested: true,
      distressOwnerContactRequested: true,
      missingDataScrapingRequested: true,
      aiSkipTracingRequested: true,
      externalApiRequested: true,
      providerActivationRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("acquisition_scoring_lockdown_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["acquisition scores never create leads", "high scores never trigger outreach", "missing data never triggers scraping", "execution remains blocked"]));
  });

  it("summarizes the final lockdown", () => {
    const result = createR77AcquisitionOpportunityScoringFinalLockdownContract(lockedInput);
    expect(summarizeR77AcquisitionOpportunityScoringFinalLockdown(result)).toMatch(/scores never create leads/i);
  });
});
