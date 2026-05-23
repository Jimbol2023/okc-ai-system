import {
  createR85ManualAcquisitionCommandCenterSafetyAccessibilityReview,
  summarizeR85ManualAcquisitionCommandCenterSafetyReview,
} from "./r85-manual-acquisition-command-center-safety-accessibility-review";

const reviewedInput = {
  commandCenterExecutionReviewed: true,
  reviewQueueAutomationReviewed: true,
  escalationProviderReviewed: true,
  bottleneckScrapingReviewed: true,
  missingDataSkipTracingReviewed: true,
  workflowOutreachReviewed: true,
  revenueProviderReviewed: true,
  acquisitionReadinessExecutionReviewed: true,
  summaryLeadCreationReviewed: true,
  providerPersistenceRuntimeReviewed: true,
  auditWritingReviewed: true,
  externalApiFetchEnvReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R85E manual acquisition command center safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR85ManualAcquisitionCommandCenterSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Command-center visibility does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR85ManualAcquisitionCommandCenterSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("manual_acquisition_command_center_safety_clear");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
  });

  it("pressure-tests unsafe command center, provider, runtime, env, and persistence requests as blocked", () => {
    const result = createR85ManualAcquisitionCommandCenterSafetyAccessibilityReview({
      ...reviewedInput,
      executionRequested: true,
      automationRequested: true,
      providerRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      outreachRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      auditWritingRequested: true,
      leadCreationRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      processEnvRequested: true,
    });
    expect(result.status).toBe("manual_acquisition_command_center_safety_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "command-center visibility cannot execute",
        "review queues cannot trigger automation",
        "escalation visibility cannot activate providers",
        "bottlenecks cannot trigger scraping",
        "missing data cannot trigger skip tracing",
        "process.env remains blocked",
      ]),
    );
  });

  it("preserves accessibility, readable labels, and governance warnings", () => {
    const result = createR85ManualAcquisitionCommandCenterSafetyAccessibilityReview(reviewedInput);
    expect(result.accessibility.readableLabelsPreserved).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.noAutoRefresh).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes safety and accessibility review", () => {
    const result = createR85ManualAcquisitionCommandCenterSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR85ManualAcquisitionCommandCenterSafetyReview(result)).toMatch(/command-center-does-not-execute/i);
    expect(summarizeR85ManualAcquisitionCommandCenterSafetyReview(result)).toMatch(/visible governance warnings/i);
  });
});
