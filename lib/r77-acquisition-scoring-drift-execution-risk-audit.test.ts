import {
  createR77AcquisitionScoringDriftExecutionRiskAudit,
  summarizeR77AcquisitionScoringDriftAudit,
} from "./r77-acquisition-scoring-drift-execution-risk-audit";

const reviewedInput = {
  scoreLeadCreationReviewed: true,
  scoreOwnerContactReviewed: true,
  scoreSkipTracingReviewed: true,
  scoreCampaignReviewed: true,
  scoreProviderReviewed: true,
  highScoreOutreachReviewed: true,
  confidenceExecutionReviewed: true,
  buyerDemandCampaignReviewed: true,
  distressOwnerContactReviewed: true,
  missingDataScrapingReviewed: true,
  externalDataReviewed: true,
  providerBoundaryReviewed: true,
  persistenceBoundaryReviewed: true,
  auditBoundaryReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R77B acquisition scoring drift execution risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR77AcquisitionScoringDriftExecutionRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("score-to-lead-creation drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR77AcquisitionScoringDriftExecutionRiskAudit(reviewedInput);
    expect(result.status).toBe("acquisition_scoring_drift_audit_clear");
    expect(result.flags.leadCreationAllowed).toBe(false);
    expect(result.nextPhase).toBe("R77C - Acquisition Opportunity Scoring Read-Only UI Scope Contract");
  });

  it("pressure-tests all drift paths as blocked", () => {
    const result = createR77AcquisitionScoringDriftExecutionRiskAudit({
      ...reviewedInput,
      scoreLeadCreationRequested: true,
      scoreOwnerContactRequested: true,
      scoreSkipTracingRequested: true,
      scoreCampaignRequested: true,
      scoreProviderRequested: true,
      highScoreOutreachRequested: true,
      confidenceExecutionRequested: true,
      buyerDemandCampaignRequested: true,
      distressOwnerContactRequested: true,
      missingDataScrapingRequested: true,
      externalDataApiRequested: true,
      providerRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      dangerousWordingRequested: true,
    });
    expect(result.status).toBe("acquisition_scoring_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["scores cannot create leads", "high scores cannot trigger outreach", "missing data cannot trigger scraping", "fetch/network remains blocked"]));
  });

  it("summarizes scoring drift boundaries", () => {
    const result = createR77AcquisitionScoringDriftExecutionRiskAudit(reviewedInput);
    expect(summarizeR77AcquisitionScoringDriftAudit(result)).toMatch(/lead creation, owner contact, skip tracing/i);
  });
});
