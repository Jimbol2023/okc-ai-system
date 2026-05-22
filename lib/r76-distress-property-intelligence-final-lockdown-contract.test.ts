import {
  createR76DistressPropertyIntelligenceFinalLockdownContract,
  summarizeR76DistressPropertyIntelligenceFinalLockdown,
} from "./r76-distress-property-intelligence-final-lockdown-contract";

const lockedInput = {
  r76aReviewed: true,
  r76bReviewed: true,
  r76cReviewed: true,
  r76dReviewed: true,
  r76eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R76F distress property intelligence final lockdown contract", () => {
  it("defaults to operator review required", () => {
    const result = createR76DistressPropertyIntelligenceFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.distressLockdownEnforced).toBe(true);
  });

  it("smoke-tests final lockdown enforcement", () => {
    const result = createR76DistressPropertyIntelligenceFinalLockdownContract(lockedInput);
    expect(result.status).toBe("distress_lockdown_enforced");
    expect(result.lockdownRules).toEqual(
      expect.arrayContaining([
        "Distress signals never create leads.",
        "Distress scores never contact owners.",
        "Vacancy indicators never trigger outreach.",
        "AI recommendations never skip trace.",
        "Execution remains blocked.",
      ]),
    );
    expect(result.nextPhase).toBe("R77A - Acquisition Opportunity Scoring Scope Contract");
  });

  it("pressure-tests every final lockdown path as blocked", () => {
    const result = createR76DistressPropertyIntelligenceFinalLockdownContract({
      ...lockedInput,
      distressLeadCreationRequested: true,
      distressOwnerContactRequested: true,
      vacancyOutreachRequested: true,
      taxRiskScrapingRequested: true,
      codeViolationCrawlingRequested: true,
      neighborhoodCampaignRequested: true,
      aiSkipTracingRequested: true,
      mapAutomationRequested: true,
      streetViewAutomationRequested: true,
      externalApiRequested: true,
      providerActivationRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });

    expect(result.status).toBe("distress_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "distress signals never create leads",
        "distress scores never contact owners",
        "AI recommendations never skip trace",
        "fetch/network remains blocked",
        "execution remains blocked",
      ]),
    );
  });

  it("summarizes the final lockdown", () => {
    const result = createR76DistressPropertyIntelligenceFinalLockdownContract(lockedInput);
    expect(summarizeR76DistressPropertyIntelligenceFinalLockdown(result)).toMatch(/distress signals never create leads/i);
  });
});
