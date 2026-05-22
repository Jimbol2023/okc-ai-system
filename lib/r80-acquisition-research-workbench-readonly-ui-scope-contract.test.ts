import {
  createR80AcquisitionResearchWorkbenchReadonlyUiScopeContract,
  summarizeR80AcquisitionResearchWorkbenchReadonlyUiScope,
} from "./r80-acquisition-research-workbench-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  safeCopyReviewed: true,
  forbiddenSurfacesReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R80C acquisition research workbench readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR80AcquisitionResearchWorkbenchReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.authorizedSurfaces).toContain("components/dashboard/acquisition-research-workbench-summary.tsx");
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR80AcquisitionResearchWorkbenchReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("acquisition_research_ui_scope_ready");
    expect(result.safeCopy).toContain("No scraping, geocoding, map crawling, Street View automation, or external APIs are authorized.");
  });

  it("pressure-tests forbidden research controls and sourcing surfaces", () => {
    const result = createR80AcquisitionResearchWorkbenchReadonlyUiScopeContract({
      ...reviewedInput,
      buttonRequested: true,
      researchExecutionControlRequested: true,
      scrapingLinkRequested: true,
      geocodingControlRequested: true,
      leadCreationControlRequested: true,
      ownerContactControlRequested: true,
      buyerSellerContactControlRequested: true,
      skipTracingControlRequested: true,
      campaignControlRequested: true,
      providerControlRequested: true,
      fetchNetworkRequested: true,
    });
    expect(result.status).toBe("acquisition_research_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining(["research execution controls remain forbidden", "scraping links remain forbidden", "lead creation controls remain forbidden", "buyer/seller contact controls remain forbidden", "fetch/network remains blocked"]),
    );
  });

  it("preserves accessibility requirements", () => {
    const result = createR80AcquisitionResearchWorkbenchReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noAutoRefresh).toBe(true);
  });

  it("summarizes read-only research visibility boundaries", () => {
    const result = createR80AcquisitionResearchWorkbenchReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR80AcquisitionResearchWorkbenchReadonlyUiScope(result)).toMatch(/no-scraping, no-contact, no-lead/i);
  });
});
