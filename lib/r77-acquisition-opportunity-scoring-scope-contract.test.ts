import {
  createR77AcquisitionOpportunityScoringScopeContract,
  summarizeR77AcquisitionOpportunityScoringScope,
} from "./r77-acquisition-opportunity-scoring-scope-contract";

const reviewedInput = {
  scoringDoctrineReviewed: true,
  advisoryOnlyReviewed: true,
  manualReviewReviewed: true,
  explainabilityReviewed: true,
  confidenceLimitReviewed: true,
  missingDataWarningReviewed: true,
  noLeadCreationReviewed: true,
  noOwnerContactReviewed: true,
  noDataSourcingReviewed: true,
  providerIsolationReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R77A acquisition opportunity scoring scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR77AcquisitionOpportunityScoringScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("acquisition opportunity scoring doctrine");
  });

  it("smoke-tests advisory-only scoring scope readiness", () => {
    const result = createR77AcquisitionOpportunityScoringScopeContract(reviewedInput);
    expect(result.status).toBe("acquisition_scoring_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.scoringGrantsExecution).toBe(false);
    expect(result.flags.leadCreationAllowed).toBe(false);
    expect(result.nextPhase).toBe("R77B - Acquisition Scoring Drift / Execution Risk Audit");
  });

  it("pressure-tests forbidden lead creation, contact, sourcing, and execution paths", () => {
    const result = createR77AcquisitionOpportunityScoringScopeContract({
      ...reviewedInput,
      leadCreationRequested: true,
      ownerContactRequested: true,
      skipTracingRequested: true,
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
      campaignRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });

    expect(result.status).toBe("acquisition_scoring_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "scores cannot create leads",
        "scores cannot contact owners",
        "skip tracing remains blocked",
        "scraping remains blocked",
        "fetch/network remains blocked",
        "execution remains blocked",
      ]),
    );
  });

  it("preserves accessibility and future-only audit doctrine", () => {
    const result = createR77AcquisitionOpportunityScoringScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.auditBoundary.auditLayerActive).toBe(false);
    expect(result.auditBoundary.auditRecordsWrittenNow).toBe(false);
  });

  it("summarizes confidence and missing-data limits", () => {
    const result = createR77AcquisitionOpportunityScoringScopeContract(reviewedInput);
    expect(summarizeR77AcquisitionOpportunityScoringScope(result)).toMatch(/scores may be uncertain and missing data may exist/i);
  });
});
