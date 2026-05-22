import {
  createR75VirtualD4dFinalLockdownContract,
  summarizeR75VirtualD4dFinalLockdown,
} from "./r75-virtual-d4d-final-lockdown-contract";

const lockedInput = {
  r75aReviewed: true,
  r75bReviewed: true,
  r75cReviewed: true,
  r75dReviewed: true,
  r75eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R75F virtual D4D final lockdown contract", () => {
  it("defaults to operator review required", () => {
    const result = createR75VirtualD4dFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.virtualD4dLockdownEnforced).toBe(true);
  });

  it("smoke-tests final lockdown enforcement", () => {
    const result = createR75VirtualD4dFinalLockdownContract(lockedInput);
    expect(result.status).toBe("virtual_d4d_lockdown_enforced");
    expect(result.lockdownRules).toEqual(
      expect.arrayContaining([
        "Virtual D4D never scrapes.",
        "Distress signals never trigger contact.",
        "Property opportunity never triggers outreach.",
        "AI recommendation never contacts owner.",
        "Execution remains blocked.",
      ]),
    );
    expect(result.nextPhase).toBe("R76A - Distress Property Intelligence Scope Contract");
  });

  it("pressure-tests every final lockdown path as blocked", () => {
    const result = createR75VirtualD4dFinalLockdownContract({
      ...lockedInput,
      virtualD4dScrapingRequested: true,
      distressContactRequested: true,
      propertyOpportunityOutreachRequested: true,
      leadPriorityCampaignRequested: true,
      aiOwnerContactRequested: true,
      mapAutomationRequested: true,
      externalApiRequested: true,
      providerActivationRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });

    expect(result.status).toBe("virtual_d4d_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "Virtual D4D never scrapes",
        "distress signals never trigger contact",
        "lead priority never starts campaign",
        "fetch/network remains blocked",
        "execution remains blocked",
      ]),
    );
  });

  it("summarizes the final lockdown", () => {
    const result = createR75VirtualD4dFinalLockdownContract(lockedInput);
    expect(summarizeR75VirtualD4dFinalLockdown(result)).toMatch(/never scrapes, crawls maps, calls external APIs/i);
  });
});
