import {
  createR84ControlledAcquisitionWorkflowIntelligenceScopeContract,
  summarizeR84ControlledAcquisitionWorkflowScope,
} from "./r84-controlled-acquisition-workflow-intelligence-scope-contract";

const reviewedInput = {
  controlledWorkflowReviewed: true,
  manualSequencingReviewed: true,
  workflowBottleneckReviewed: true,
  operatorReviewReviewed: true,
  throughputVisibilityReviewed: true,
  safeWorkflowIntelligenceReviewed: true,
  workflowDoesNotExecuteReviewed: true,
  workflowDoesNotContactReviewed: true,
  workflowDoesNotCreateLeadsReviewed: true,
  workflowDoesNotActivateProvidersReviewed: true,
  noRuntimeReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  deterministicInvariantsReviewed: true,
  accessibilityReviewed: true,
  failClosedReviewed: true,
} as const;

describe("R84A controlled acquisition workflow intelligence scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR84ControlledAcquisitionWorkflowIntelligenceScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("controlled acquisition workflow doctrine");
  });

  it("smoke-tests advisory-only workflow scope readiness", () => {
    const result = createR84ControlledAcquisitionWorkflowIntelligenceScopeContract(reviewedInput);
    expect(result.status).toBe("controlled_acquisition_workflow_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("defines deterministic advisory workflow categories", () => {
    const result = createR84ControlledAcquisitionWorkflowIntelligenceScopeContract(reviewedInput);
    expect(result.advisoryWorkflowCategories).toEqual(
      expect.arrayContaining(["ready-for-manual-review", "needs-human-decision", "missing-critical-data", "bottlenecked", "stalled", "high-throughput-opportunity", "manual-only-next-step"]),
    );
  });

  it("pressure-tests forbidden workflow, provider, sourcing, runtime, and execution paths", () => {
    const result = createR84ControlledAcquisitionWorkflowIntelligenceScopeContract({
      ...reviewedInput,
      executionRequested: true,
      outreachRequested: true,
      providerRequested: true,
      fetchNetworkRequested: true,
      processEnvRequested: true,
      prismaDbWriteRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      leadCreationRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      mlsPublicRecordRequested: true,
    });
    expect(result.status).toBe("controlled_acquisition_workflow_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["workflow intelligence cannot execute", "provider calls remain blocked", "fetch/network remains blocked", "process.env remains blocked"]));
  });

  it("preserves accessibility and governance boundaries", () => {
    const result = createR84ControlledAcquisitionWorkflowIntelligenceScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.governanceBoundary.workflowIntelligenceOnlyMeans).toContain("execution remains blocked");
  });

  it("summarizes controlled workflow scope", () => {
    const result = createR84ControlledAcquisitionWorkflowIntelligenceScopeContract(reviewedInput);
    expect(summarizeR84ControlledAcquisitionWorkflowScope(result)).toMatch(/manual-review-only/i);
    expect(summarizeR84ControlledAcquisitionWorkflowScope(result)).toMatch(/execution remain blocked/i);
  });
});
