import {
  createR75VirtualD4dReadonlyUiScopeContract,
  summarizeR75VirtualD4dReadonlyUiScope,
} from "./r75-virtual-d4d-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  safeCopyReviewed: true,
  forbiddenSurfacesReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R75C virtual D4D readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR75VirtualD4dReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.authorizedSurfaces).toContain("components/dashboard/virtual-driving-for-dollars-summary.tsx");
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR75VirtualD4dReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("virtual_d4d_ui_scope_ready");
    expect(result.safeCopy).toContain("No scraping, map crawling, or Street View automation is authorized.");
    expect(result.nextPhase).toBe("R75D - Virtual D4D Read-Only UI Implementation");
  });

  it("pressure-tests forbidden UI surfaces", () => {
    const result = createR75VirtualD4dReadonlyUiScopeContract({
      ...reviewedInput,
      implementationRequestedNow: true,
      buttonRequested: true,
      formRequested: true,
      inputRequested: true,
      mapAutomationRequested: true,
      scrapingLinkRequested: true,
      sendControlRequested: true,
      contactControlRequested: true,
      providerControlRequested: true,
      fetchNetworkRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      persistenceRequested: true,
    });

    expect(result.status).toBe("virtual_d4d_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "buttons remain forbidden",
        "map automation remains forbidden",
        "contact controls remain forbidden",
        "fetch/network remains blocked",
      ]),
    );
  });

  it("preserves accessibility requirements", () => {
    const result = createR75VirtualD4dReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.ariaDescribedby).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noPolling).toBe(true);
  });

  it("summarizes the read-only wording boundary", () => {
    const result = createR75VirtualD4dReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR75VirtualD4dReadonlyUiScope(result)).toMatch(/no-scraping, no-owner-contact, no-outreach/i);
  });
});
