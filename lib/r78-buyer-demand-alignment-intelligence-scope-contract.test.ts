import {
  createR78BuyerDemandAlignmentIntelligenceScopeContract,
  summarizeR78BuyerDemandAlignmentScope,
} from "./r78-buyer-demand-alignment-intelligence-scope-contract";

const reviewedInput = {
  alignmentDoctrineReviewed: true,
  advisoryOnlyReviewed: true,
  manualReviewReviewed: true,
  explainabilityReviewed: true,
  confidenceLimitReviewed: true,
  demandMismatchReviewed: true,
  missingDemandDataReviewed: true,
  noBuyerContactReviewed: true,
  noSellerContactReviewed: true,
  noMatchCreationReviewed: true,
  noDealBlastReviewed: true,
  noDataSourcingReviewed: true,
  providerIsolationReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R78A buyer demand alignment intelligence scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR78BuyerDemandAlignmentIntelligenceScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("buyer demand alignment doctrine");
  });

  it("smoke-tests advisory-only alignment scope readiness", () => {
    const result = createR78BuyerDemandAlignmentIntelligenceScopeContract(reviewedInput);
    expect(result.status).toBe("buyer_demand_alignment_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.alignmentGrantsExecution).toBe(false);
    expect(result.flags.matchCreationAllowed).toBe(false);
  });

  it("pressure-tests forbidden contact, match, sourcing, and execution paths", () => {
    const result = createR78BuyerDemandAlignmentIntelligenceScopeContract({
      ...reviewedInput,
      buyerContactRequested: true,
      sellerContactRequested: true,
      matchCreationRequested: true,
      dealBlastRequested: true,
      campaignRequested: true,
      leadCreationRequested: true,
      scrapingRequested: true,
      externalApiRequested: true,
      providerRequested: true,
      providerClientRequested: true,
      envReadRequested: true,
      credentialReadRequested: true,
      fetchNetworkRequested: true,
      sendRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });

    expect(result.status).toBe("buyer_demand_alignment_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "buyer contact remains blocked",
        "seller contact remains blocked",
        "match creation remains blocked",
        "deal blasts remain blocked",
        "fetch/network remains blocked",
        "execution remains blocked",
      ]),
    );
  });

  it("preserves accessibility and future-only audit doctrine", () => {
    const result = createR78BuyerDemandAlignmentIntelligenceScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.auditBoundary.auditLayerActive).toBe(false);
    expect(result.auditBoundary.auditRecordsWrittenNow).toBe(false);
  });

  it("summarizes confidence and missing-demand-data limits", () => {
    const result = createR78BuyerDemandAlignmentIntelligenceScopeContract(reviewedInput);
    expect(summarizeR78BuyerDemandAlignmentScope(result)).toMatch(/alignment may be uncertain and demand data may be missing/i);
  });
});
