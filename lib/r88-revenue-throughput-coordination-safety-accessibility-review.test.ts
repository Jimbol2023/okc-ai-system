import {
  createR88RevenueThroughputCoordinationSafetyAccessibilityReview,
  summarizeR88RevenueThroughputCoordinationSafetyReview,
} from "./r88-revenue-throughput-coordination-safety-accessibility-review";

const reviewedInput = {
  throughputCoordinationExecutionReviewed: true,
  sequencingReviewAutomationReviewed: true,
  velocityRuntimeReviewed: true,
  bottleneckProviderReviewed: true,
  delayedRevenuePathOutreachReviewed: true,
  assignmentDelayBuyerContactReviewed: true,
  closingDelayExecutionReviewed: true,
  missingDataSkipTracingReviewed: true,
  bottleneckScrapingReviewed: true,
  highOpportunityLeadCreationReviewed: true,
  providerPersistenceRuntimeReviewed: true,
  auditWritingReviewed: true,
  externalApiFetchEnvReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R88E revenue throughput coordination safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR88RevenueThroughputCoordinationSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Throughput coordination does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR88RevenueThroughputCoordinationSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("revenue_throughput_coordination_safety_clear");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
  });

  it("pressure-tests unsafe revenue, provider, runtime, env, and persistence requests as blocked", () => {
    const result = createR88RevenueThroughputCoordinationSafetyAccessibilityReview({
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
    expect(result.status).toBe("revenue_throughput_coordination_safety_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "throughput coordination visibility cannot execute",
        "delayed revenue paths cannot trigger outreach",
        "velocity signals cannot activate runtime jobs",
        "sequencing review cannot trigger automation",
        "process.env remains blocked",
      ]),
    );
  });

  it("preserves accessibility, readable labels, and governance warnings", () => {
    const result = createR88RevenueThroughputCoordinationSafetyAccessibilityReview(reviewedInput);
    expect(result.accessibility.readableLabelsPreserved).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.noAutoRefresh).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes safety and accessibility review", () => {
    const result = createR88RevenueThroughputCoordinationSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR88RevenueThroughputCoordinationSafetyReview(result)).toMatch(/throughput-coordination-does-not-execute/i);
    expect(summarizeR88RevenueThroughputCoordinationSafetyReview(result)).toMatch(/visible governance warnings/i);
  });
});
