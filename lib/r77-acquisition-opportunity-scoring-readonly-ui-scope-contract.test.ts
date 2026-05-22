import {
  createR77AcquisitionOpportunityScoringReadonlyUiScopeContract,
  summarizeR77AcquisitionOpportunityScoringReadonlyUiScope,
} from "./r77-acquisition-opportunity-scoring-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  safeCopyReviewed: true,
  forbiddenSurfacesReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R77C acquisition opportunity scoring readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR77AcquisitionOpportunityScoringReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.authorizedSurfaces).toContain("components/dashboard/acquisition-opportunity-scoring-summary.tsx");
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR77AcquisitionOpportunityScoringReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("acquisition_scoring_ui_scope_ready");
    expect(result.safeCopy).toContain("No lead creation is authorized.");
  });

  it("pressure-tests forbidden UI surfaces", () => {
    const result = createR77AcquisitionOpportunityScoringReadonlyUiScopeContract({
      ...reviewedInput,
      implementationRequestedNow: true,
      buttonRequested: true,
      formRequested: true,
      inputRequested: true,
      leadCreationControlRequested: true,
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
    expect(result.status).toBe("acquisition_scoring_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["lead creation controls remain forbidden", "owner-contact controls remain forbidden", "fetch/network remains blocked"]));
  });

  it("preserves accessibility requirements", () => {
    const result = createR77AcquisitionOpportunityScoringReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
  });

  it("summarizes read-only scoring visibility boundaries", () => {
    const result = createR77AcquisitionOpportunityScoringReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR77AcquisitionOpportunityScoringReadonlyUiScope(result)).toMatch(/confidence limitations, missing-data warnings/i);
  });
});
