import {
  createR86ControlledRevenueOperationsSafetyAccessibilityReview,
  summarizeR86ControlledRevenueOperationsSafetyReview,
} from "./r86-controlled-revenue-operations-safety-accessibility-review";

const reviewedInput = {
  revenueVisibilityExecutionReviewed: true,
  revenueReviewOutreachReviewed: true,
  throughputRuntimeReviewed: true,
  pipelineAutomationReviewed: true,
  assignmentBuyerOutreachReviewed: true,
  closingExecutionReviewed: true,
  bottleneckScrapingReviewed: true,
  missingDataSkipTracingReviewed: true,
  highRevenueLeadCreationReviewed: true,
  providerPersistenceRuntimeReviewed: true,
  auditWritingReviewed: true,
  externalApiFetchEnvReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R86E controlled revenue operations safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR86ControlledRevenueOperationsSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Revenue visibility does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR86ControlledRevenueOperationsSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("controlled_revenue_operations_safety_clear");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
  });

  it("pressure-tests unsafe revenue, provider, runtime, env, and persistence requests as blocked", () => {
    const result = createR86ControlledRevenueOperationsSafetyAccessibilityReview({
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
    expect(result.status).toBe("controlled_revenue_operations_safety_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "revenue visibility cannot execute",
        "revenue review cannot trigger outreach",
        "throughput signals cannot trigger runtime jobs",
        "pipeline review cannot trigger automation",
        "process.env remains blocked",
      ]),
    );
  });

  it("preserves accessibility, readable labels, and governance warnings", () => {
    const result = createR86ControlledRevenueOperationsSafetyAccessibilityReview(reviewedInput);
    expect(result.accessibility.readableLabelsPreserved).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.noAutoRefresh).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes safety and accessibility review", () => {
    const result = createR86ControlledRevenueOperationsSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR86ControlledRevenueOperationsSafetyReview(result)).toMatch(/revenue-visibility-does-not-execute/i);
    expect(summarizeR86ControlledRevenueOperationsSafetyReview(result)).toMatch(/visible governance warnings/i);
  });
});
