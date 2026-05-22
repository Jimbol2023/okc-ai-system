import {
  createR73ControlledProviderActivationReadinessScopeContract,
  summarizeR73ControlledProviderActivationReadinessScope,
} from "./r73-controlled-provider-activation-readiness-scope-contract";

const reviewedInput = {
  providerReadinessDoctrineReviewed: true,
  providerIsolationReviewed: true,
  humanInControlReviewed: true,
  readinessDoesNotActivateReviewed: true,
  governancePrerequisiteReviewed: true,
  killSwitchPrerequisiteReviewed: true,
  auditPrerequisiteReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R73A controlled provider activation readiness scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR73ControlledProviderActivationReadinessScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.providerReadinessGrantsActivation).toBe(false);
  });

  it("smoke-tests provider readiness scope readiness", () => {
    const result = createR73ControlledProviderActivationReadinessScopeContract(reviewedInput);
    expect(result.status).toBe("provider_readiness_scope_ready");
    expect(result.allowedConcepts).toContain("controlled provider activation readiness");
    expect(result.governanceBoundary.governanceStopsOutrank).toContain("provider readiness");
    expect(result.nextPhase).toBe("R73B - Provider Activation Readiness Drift / Execution Risk Audit");
  });

  it("pressure-tests provider reachability and execution paths as blocked", () => {
    const result = createR73ControlledProviderActivationReadinessScopeContract({
      ...reviewedInput,
      providerActivationRequested: true,
      providerClientRequested: true,
      envReadRequested: true,
      credentialReadRequested: true,
      fetchNetworkRequested: true,
      outreachRequested: true,
      sendRequested: true,
      callRequested: true,
      textRequested: true,
      emailRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      campaignRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("provider_readiness_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "provider activation remains blocked",
        "provider clients remain blocked",
        "provider env reads remain blocked",
        "credential reads remain blocked",
        "fetch/network remains blocked",
        "sending remains blocked",
        "audit writing remains blocked",
      ]),
    );
  });

  it("preserves inclusive accessibility requirements", () => {
    const result = createR73ControlledProviderActivationReadinessScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noPolling).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes non-activating readiness", () => {
    const result = createR73ControlledProviderActivationReadinessScopeContract(reviewedInput);
    expect(summarizeR73ControlledProviderActivationReadinessScope(result)).toMatch(/readiness never activates providers/i);
  });
});
