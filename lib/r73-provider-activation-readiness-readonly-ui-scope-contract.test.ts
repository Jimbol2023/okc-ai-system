import {
  createR73ProviderActivationReadinessReadonlyUiScopeContract,
  summarizeR73ProviderActivationReadinessReadonlyUiScope,
} from "./r73-provider-activation-readiness-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  safeCopyReviewed: true,
  forbiddenSurfacesReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R73C provider activation readiness readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR73ProviderActivationReadinessReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.implementationAllowedNow).toBe(false);
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR73ProviderActivationReadinessReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("provider_readiness_ui_scope_ready");
    expect(result.authorizedSurfaces).toContain("components/dashboard/provider-activation-readiness-summary.tsx");
    expect(result.safeCopy).toContain("Provider activation remains blocked.");
  });

  it("pressure-tests provider UI controls as blocked", () => {
    const result = createR73ProviderActivationReadinessReadonlyUiScopeContract({
      ...reviewedInput,
      implementationRequestedNow: true,
      buttonRequested: true,
      providerControlRequested: true,
      activationControlRequested: true,
      sendControlRequested: true,
      formRequested: true,
      inputRequested: true,
      activationLinkRequested: true,
      providerClientRequested: true,
      envReadRequested: true,
      fetchNetworkRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      persistenceRequested: true,
    });
    expect(result.status).toBe("provider_readiness_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["provider controls remain forbidden", "activation controls remain forbidden", "provider clients remain blocked", "fetch/network remains blocked"]));
  });

  it("summarizes read-only provider readiness UI boundaries", () => {
    const result = createR73ProviderActivationReadinessReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR73ProviderActivationReadinessReadonlyUiScope(result)).toMatch(/provider-still-blocked/i);
  });
});
