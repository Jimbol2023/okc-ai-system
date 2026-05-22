import {
  createR78BuyerDemandAlignmentSafetyAccessibilityReview,
  summarizeR78BuyerDemandAlignmentSafetyReview,
} from "./r78-buyer-demand-alignment-safety-accessibility-review";

const reviewedInput = {
  noBuyerContactReviewed: true,
  noSellerContactReviewed: true,
  noMatchCreationReviewed: true,
  noDealBlastReviewed: true,
  noCampaignReviewed: true,
  noScrapingReviewed: true,
  noExternalApiReviewed: true,
  noProviderReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  alignmentExecutionReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R78E buyer demand alignment safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR78BuyerDemandAlignmentSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Alignment does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR78BuyerDemandAlignmentSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("buyer_demand_alignment_safety_clear");
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
  });

  it("pressure-tests unsafe requests as blocked", () => {
    const result = createR78BuyerDemandAlignmentSafetyAccessibilityReview({
      ...reviewedInput,
      buyerContactRequested: true,
      sellerContactRequested: true,
      matchCreationRequested: true,
      dealBlastRequested: true,
      campaignRequested: true,
      scrapingRequested: true,
      externalApiRequested: true,
      providerRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("buyer_demand_alignment_safety_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["buyer contact remains blocked", "match creation remains blocked", "deal blasts remain blocked", "fetch/network remains blocked"]));
  });

  it("summarizes accessibility and governance review", () => {
    const result = createR78BuyerDemandAlignmentSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR78BuyerDemandAlignmentSafetyReview(result)).toMatch(/alignment-does-not-execute doctrine/i);
  });
});
