import {
  createR87ManualRevenueCommandCenterSafetyAccessibilityReview,
  summarizeR87ManualRevenueCommandCenterSafetyReview,
} from "./r87-manual-revenue-command-center-safety-accessibility-review";

const reviewedInput = {
  revenueCommandVisibilityExecutionReviewed: true,
  revenueReviewOutreachReviewed: true,
  throughputRuntimeReviewed: true,
  assignmentReviewBuyerOutreachReviewed: true,
  closingReviewExecutionReviewed: true,
  operatorCoordinationProviderReviewed: true,
  bottleneckScrapingReviewed: true,
  missingDataSkipTracingReviewed: true,
  highOpportunityLeadCreationReviewed: true,
  providerPersistenceRuntimeReviewed: true,
  auditWritingReviewed: true,
  externalApiFetchEnvReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R87E manual revenue command center safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR87ManualRevenueCommandCenterSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Revenue command visibility does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR87ManualRevenueCommandCenterSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("manual_revenue_command_center_safety_clear");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
  });

  it("pressure-tests unsafe revenue, provider, runtime, env, and persistence requests as blocked", () => {
    const result = createR87ManualRevenueCommandCenterSafetyAccessibilityReview({
      ...reviewedInput,
      executionRequested: true,
      outreachRequested: true,
      runtimeRequested: true,
      automationRequested: true,
      providerRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      leadCreationRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      auditWritingRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      processEnvRequested: true,
    });
    expect(result.status).toBe("manual_revenue_command_center_safety_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "revenue command visibility cannot execute",
        "revenue review cannot trigger outreach",
        "throughput visibility cannot activate runtime jobs",
        "operator coordination cannot activate automation",
        "process.env remains blocked",
      ]),
    );
  });

  it("preserves accessibility, readable labels, and governance warnings", () => {
    const result = createR87ManualRevenueCommandCenterSafetyAccessibilityReview(reviewedInput);
    expect(result.accessibility.readableLabelsPreserved).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.noAutoRefresh).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes safety and accessibility review", () => {
    const result = createR87ManualRevenueCommandCenterSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR87ManualRevenueCommandCenterSafetyReview(result)).toMatch(/revenue-command-visibility-does-not-execute/i);
    expect(summarizeR87ManualRevenueCommandCenterSafetyReview(result)).toMatch(/visible governance warnings/i);
  });
});


