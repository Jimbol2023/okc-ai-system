import {
  createR83AcquisitionPriorityRevenueReadonlyUiScopeContract,
  summarizeR83AcquisitionPriorityRevenueReadonlyUiScope,
} from "./r83-acquisition-priority-revenue-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  revenueScoringWordingReviewed: true,
  acquisitionPriorityWordingReviewed: true,
  urgencyWordingReviewed: true,
  decayWordingReviewed: true,
  highOpportunityWordingReviewed: true,
  blockedReviewNeededWordingReviewed: true,
  noExecutionWordingReviewed: true,
  noProviderWordingReviewed: true,
  noContactWordingReviewed: true,
  forbiddenControlsReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R83C acquisition priority revenue readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR83AcquisitionPriorityRevenueReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.authorizedSurfaces).toContain("components/dashboard/acquisition-priority-revenue-summary.tsx");
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR83AcquisitionPriorityRevenueReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("acquisition_priority_revenue_ui_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.implementationAllowedNow).toBe(false);
  });

  it("keeps wording advisory and non-executing", () => {
    const result = createR83AcquisitionPriorityRevenueReadonlyUiScopeContract(reviewedInput);
    expect(result.wording.urgency).toMatch(/does not authorize outreach or contact/i);
    expect(result.wording.decay).toMatch(/does not authorize scraping or sourcing/i);
    expect(result.wording.noExecution).toMatch(/do not authorize execution/i);
    expect(result.wording.noProvider).toMatch(/Provider activation remains blocked/i);
  });

  it("pressure-tests forbidden UI controls", () => {
    const result = createR83AcquisitionPriorityRevenueReadonlyUiScopeContract({
      ...reviewedInput,
      buttonRequested: true,
      formRequested: true,
      inputRequested: true,
      executionControlRequested: true,
      outreachControlRequested: true,
      providerControlRequested: true,
      automationControlRequested: true,
      runtimeControlRequested: true,
      fetchNetworkRequested: true,
    });
    expect(result.status).toBe("acquisition_priority_revenue_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["buttons remain forbidden", "execution controls remain forbidden", "provider controls remain forbidden", "fetch/network remains blocked"]));
  });

  it("preserves accessibility requirements", () => {
    const result = createR83AcquisitionPriorityRevenueReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes read-only scope", () => {
    const result = createR83AcquisitionPriorityRevenueReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR83AcquisitionPriorityRevenueReadonlyUiScope(result)).toMatch(/read-only advisory wording/i);
  });
});
