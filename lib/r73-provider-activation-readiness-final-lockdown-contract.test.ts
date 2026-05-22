import {
  createR73ProviderActivationReadinessFinalLockdownContract,
  summarizeR73ProviderActivationReadinessFinalLockdown,
} from "./r73-provider-activation-readiness-final-lockdown-contract";

const lockedInput = {
  r73aReviewed: true,
  r73bReviewed: true,
  r73cReviewed: true,
  r73dReviewed: true,
  r73eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R73F provider activation readiness final lockdown", () => {
  it("defaults to operator review required", () => {
    const result = createR73ProviderActivationReadinessFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.providerReadinessLocked).toBe(true);
  });

  it("smoke-tests final provider readiness lockdown enforcement", () => {
    const result = createR73ProviderActivationReadinessFinalLockdownContract(lockedInput);
    expect(result.status).toBe("provider_readiness_lockdown_enforced");
    expect(result.lockdownRules).toEqual(
      expect.arrayContaining([
        "Provider readiness never grants activation.",
        "Readiness never grants sending.",
        "Approval never grants provider activation.",
        "Provider clients remain blocked.",
        "Fetch/network remains blocked.",
        "Execution remains blocked.",
      ]),
    );
    expect(result.nextPhase).toBe("R74A - Human-In-The-Loop Revenue Execution Scope Contract");
  });

  it("pressure-tests every provider activation path as blocked", () => {
    const result = createR73ProviderActivationReadinessFinalLockdownContract({
      ...lockedInput,
      providerReadinessActivationRequested: true,
      readinessSendRequested: true,
      approvalProviderActivationRequested: true,
      aiRecommendationProviderActivationRequested: true,
      urgencyProviderActivationRequested: true,
      revenuePressureProviderActivationRequested: true,
      queueProviderActivationRequested: true,
      simulationProviderActivationRequested: true,
      previewProviderActivationRequested: true,
      providerClientRequested: true,
      credentialEnvReadRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("provider_readiness_lockdown_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["provider readiness never grants activation", "AI recommendation never grants provider activation", "env/credential access remains blocked", "audit logging remains inactive", "execution remains blocked"]));
  });

  it("summarizes final provider readiness lockdown", () => {
    const result = createR73ProviderActivationReadinessFinalLockdownContract(lockedInput);
    expect(summarizeR73ProviderActivationReadinessFinalLockdown(result)).toMatch(/read-only and advisory/i);
  });
});
