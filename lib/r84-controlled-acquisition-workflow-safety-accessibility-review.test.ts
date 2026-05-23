import {
  createR84ControlledAcquisitionWorkflowSafetyAccessibilityReview,
  summarizeR84ControlledAcquisitionWorkflowSafetyReview,
} from "./r84-controlled-acquisition-workflow-safety-accessibility-review";

const reviewedInput = {
  workflowExecutionReviewed: true,
  manualSequenceAutomationReviewed: true,
  bottleneckProviderReviewed: true,
  stalledScrapingReviewed: true,
  missingDataSkipTracingReviewed: true,
  buyerReadinessOutreachReviewed: true,
  sellerReviewContactReviewed: true,
  closingReadinessExecutionReviewed: true,
  throughputRuntimeReviewed: true,
  priorityLeadRecordReviewed: true,
  providerPersistenceRuntimeReviewed: true,
  auditWritingReviewed: true,
  externalApiFetchEnvReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R84E controlled acquisition workflow safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR84ControlledAcquisitionWorkflowSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Workflow intelligence does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR84ControlledAcquisitionWorkflowSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("controlled_acquisition_workflow_safety_clear");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
  });

  it("pressure-tests unsafe workflow, provider, runtime, env, and persistence requests as blocked", () => {
    const result = createR84ControlledAcquisitionWorkflowSafetyAccessibilityReview({
      ...reviewedInput,
      executionRequested: true,
      automationRequested: true,
      providerRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      outreachRequested: true,
      contactRequested: true,
      runtimeRequested: true,
      leadCreationRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      auditWritingRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      processEnvRequested: true,
    });
    expect(result.status).toBe("controlled_acquisition_workflow_safety_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "workflow intelligence cannot execute",
        "manual sequence cannot trigger automation",
        "bottlenecks cannot trigger provider calls",
        "stalled leads cannot trigger scraping",
        "missing data cannot trigger skip tracing",
        "process.env remains blocked",
      ]),
    );
  });

  it("preserves accessibility, readable labels, and governance warnings", () => {
    const result = createR84ControlledAcquisitionWorkflowSafetyAccessibilityReview(reviewedInput);
    expect(result.accessibility.readableLabelsPreserved).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.noAutoRefresh).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes safety and accessibility review", () => {
    const result = createR84ControlledAcquisitionWorkflowSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR84ControlledAcquisitionWorkflowSafetyReview(result)).toMatch(/workflow-does-not-execute/i);
    expect(summarizeR84ControlledAcquisitionWorkflowSafetyReview(result)).toMatch(/visible governance warnings/i);
  });
});
