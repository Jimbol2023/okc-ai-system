import {
  createR76DistressPropertyIntelligenceReadonlyUiScopeContract,
  summarizeR76DistressPropertyIntelligenceReadonlyUiScope,
} from "./r76-distress-property-intelligence-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  safeCopyReviewed: true,
  forbiddenSurfacesReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R76C distress property intelligence readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR76DistressPropertyIntelligenceReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.authorizedSurfaces).toContain("components/dashboard/distress-property-intelligence-summary.tsx");
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR76DistressPropertyIntelligenceReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("distress_ui_scope_ready");
    expect(result.safeCopy).toContain("No lead creation is authorized.");
    expect(result.nextPhase).toBe("R76D - Distress Property Intelligence Read-Only UI Implementation");
  });

  it("pressure-tests forbidden UI surfaces", () => {
    const result = createR76DistressPropertyIntelligenceReadonlyUiScopeContract({
      ...reviewedInput,
      implementationRequestedNow: true,
      buttonRequested: true,
      formRequested: true,
      inputRequested: true,
      mapAutomationRequested: true,
      scrapingLinkRequested: true,
      skipTracingLinkRequested: true,
      ownerContactControlRequested: true,
      sendControlRequested: true,
      providerControlRequested: true,
      fetchNetworkRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      persistenceRequested: true,
    });

    expect(result.status).toBe("distress_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "buttons remain forbidden",
        "owner-contact controls remain forbidden",
        "skip-tracing links remain forbidden",
        "fetch/network remains blocked",
      ]),
    );
  });

  it("preserves accessibility requirements", () => {
    const result = createR76DistressPropertyIntelligenceReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.ariaDescribedby).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noPolling).toBe(true);
  });

  it("summarizes read-only distress visibility boundaries", () => {
    const result = createR76DistressPropertyIntelligenceReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR76DistressPropertyIntelligenceReadonlyUiScope(result)).toMatch(/no-lead-creation, no-skip-tracing/i);
  });
});
