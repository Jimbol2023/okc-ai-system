import {
  createR77AcquisitionOpportunityScoringSafetyAccessibilityReview,
  summarizeR77AcquisitionOpportunityScoringSafetyReview,
} from "./r77-acquisition-opportunity-scoring-safety-accessibility-review";

const reviewedInput = {
  noLeadCreationReviewed: true,
  noScrapingReviewed: true,
  noMapCrawlingReviewed: true,
  noExternalApiReviewed: true,
  noSkipTracingReviewed: true,
  noOwnerContactReviewed: true,
  noOutreachReviewed: true,
  noProviderReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  scoringExecutionReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R77E acquisition scoring safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR77AcquisitionOpportunityScoringSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Scoring does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR77AcquisitionOpportunityScoringSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("acquisition_scoring_safety_clear");
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
    expect(result.nextPhase).toBe("R77F - Acquisition Opportunity Scoring Final Lockdown Contract");
  });

  it("pressure-tests unsafe requests as blocked", () => {
    const result = createR77AcquisitionOpportunityScoringSafetyAccessibilityReview({
      ...reviewedInput,
      leadCreationRequested: true,
      scrapingRequested: true,
      externalApiRequested: true,
      skipTracingRequested: true,
      ownerContactRequested: true,
      outreachRequested: true,
      providerRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("acquisition_scoring_safety_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["lead creation remains blocked", "owner contact remains blocked", "fetch/network remains blocked", "execution remains blocked"]));
  });

  it("summarizes accessibility and governance review", () => {
    const result = createR77AcquisitionOpportunityScoringSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR77AcquisitionOpportunityScoringSafetyReview(result)).toMatch(/scoring-does-not-execute doctrine/i);
  });
});
