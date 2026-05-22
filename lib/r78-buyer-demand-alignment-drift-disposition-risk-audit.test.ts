import {
  createR78BuyerDemandAlignmentDriftDispositionRiskAudit,
  summarizeR78BuyerDemandAlignmentDriftAudit,
} from "./r78-buyer-demand-alignment-drift-disposition-risk-audit";

const reviewedInput = {
  alignmentBuyerContactReviewed: true,
  alignmentSellerContactReviewed: true,
  matchCreationReviewed: true,
  dealBlastReviewed: true,
  campaignReviewed: true,
  outreachReviewed: true,
  providerReviewed: true,
  buyerReadySendReviewed: true,
  assignmentExecutionReviewed: true,
  missingDemandScrapingReviewed: true,
  externalDataReviewed: true,
  persistenceReviewed: true,
  auditBoundaryReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R78B buyer demand alignment drift disposition risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR78BuyerDemandAlignmentDriftDispositionRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("alignment-to-buyer-contact drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR78BuyerDemandAlignmentDriftDispositionRiskAudit(reviewedInput);
    expect(result.status).toBe("buyer_demand_alignment_drift_audit_clear");
    expect(result.flags.matchCreationAllowed).toBe(false);
  });

  it("pressure-tests all disposition drift paths as blocked", () => {
    const result = createR78BuyerDemandAlignmentDriftDispositionRiskAudit({
      ...reviewedInput,
      buyerContactRequested: true,
      sellerContactRequested: true,
      matchCreationRequested: true,
      dealBlastRequested: true,
      campaignRequested: true,
      outreachRequested: true,
      providerRequested: true,
      sendRequested: true,
      executionRequested: true,
      scrapingRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      dangerousWordingRequested: true,
    });
    expect(result.status).toBe("buyer_demand_alignment_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["alignment cannot contact buyers", "alignment cannot create matches", "alignment cannot blast deals", "fetch/network remains blocked"]));
  });

  it("summarizes disposition drift boundaries", () => {
    const result = createR78BuyerDemandAlignmentDriftDispositionRiskAudit(reviewedInput);
    expect(summarizeR78BuyerDemandAlignmentDriftAudit(result)).toMatch(/buyer contact, seller contact, match creation/i);
  });
});
