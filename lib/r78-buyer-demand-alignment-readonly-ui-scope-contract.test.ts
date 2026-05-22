import {
  createR78BuyerDemandAlignmentReadonlyUiScopeContract,
  summarizeR78BuyerDemandAlignmentReadonlyUiScope,
} from "./r78-buyer-demand-alignment-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  safeCopyReviewed: true,
  forbiddenSurfacesReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R78C buyer demand alignment readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR78BuyerDemandAlignmentReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.authorizedSurfaces).toContain("components/dashboard/buyer-demand-alignment-summary.tsx");
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR78BuyerDemandAlignmentReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("buyer_demand_alignment_ui_scope_ready");
    expect(result.safeCopy).toContain("No match creation, deal blast, or campaign is authorized.");
  });

  it("pressure-tests forbidden UI surfaces", () => {
    const result = createR78BuyerDemandAlignmentReadonlyUiScopeContract({
      ...reviewedInput,
      buttonRequested: true,
      matchCreationControlRequested: true,
      buyerContactControlRequested: true,
      sellerContactControlRequested: true,
      dealBlastControlRequested: true,
      campaignControlRequested: true,
      fetchNetworkRequested: true,
    });
    expect(result.status).toBe("buyer_demand_alignment_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["match creation controls remain forbidden", "buyer contact controls remain forbidden", "deal blast controls remain forbidden", "fetch/network remains blocked"]));
  });

  it("preserves accessibility requirements", () => {
    const result = createR78BuyerDemandAlignmentReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
  });

  it("summarizes read-only alignment visibility boundaries", () => {
    const result = createR78BuyerDemandAlignmentReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR78BuyerDemandAlignmentReadonlyUiScope(result)).toMatch(/no-contact, no-match, no-deal-blast/i);
  });
});
