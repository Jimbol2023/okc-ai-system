import {
  createR89RevenueBottleneckResolutionSafetyAccessibilityReview,
  summarizeR89RevenueBottleneckResolutionSafetyReview,
} from "./r89-revenue-bottleneck-resolution-safety-accessibility-review";

const reviewedInput = {
  bottleneckResolutionExecutionReviewed: true,
  remediationAutomationReviewed: true,
  throughputRecoveryRuntimeReviewed: true,
  blockedWorkflowProviderReviewed: true,
  assignmentBlockageBuyerContactReviewed: true,
  closingBlockageExecutionReviewed: true,
  bottleneckScrapingReviewed: true,
  missingDataSkipTracingReviewed: true,
  highImpactLeadCreationReviewed: true,
  providerPersistenceRuntimeReviewed: true,
  auditWritingReviewed: true,
  externalApiFetchEnvReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R89E revenue bottleneck resolution safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR89RevenueBottleneckResolutionSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Bottleneck resolution visibility does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR89RevenueBottleneckResolutionSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("revenue_bottleneck_resolution_safety_clear");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
  });

  it("pressure-tests unsafe provider, runtime, env, and persistence requests as blocked", () => {
    const result = createR89RevenueBottleneckResolutionSafetyAccessibilityReview({
      ...reviewedInput,
      executionRequested: true,
      automationRequested: true,
      runtimeRequested: true,
      providerRequested: true,
      contactRequested: true,
      closingExecutionRequested: true,
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
    expect(result.status).toBe("revenue_bottleneck_resolution_safety_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "bottleneck resolution visibility cannot execute",
        "remediation review cannot trigger automation",
        "throughput recovery visibility cannot activate runtime jobs",
        "blocked workflow visibility cannot activate providers",
        "process.env remains blocked",
      ]),
    );
  });

  it("preserves accessibility, readable labels, and governance warnings", () => {
    const result = createR89RevenueBottleneckResolutionSafetyAccessibilityReview(reviewedInput);
    expect(result.accessibility.readableLabelsPreserved).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.noAutoRefresh).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes safety and accessibility review", () => {
    const result = createR89RevenueBottleneckResolutionSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR89RevenueBottleneckResolutionSafetyReview(result)).toMatch(/bottleneck-resolution-does-not-execute/i);
    expect(summarizeR89RevenueBottleneckResolutionSafetyReview(result)).toMatch(/visible governance warnings/i);
  });
});
