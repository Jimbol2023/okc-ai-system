import {
  createR86ControlledRevenueOperationsScopeContract,
  summarizeR86ControlledRevenueOperationsScope,
} from "./r86-controlled-revenue-operations-scope-contract";

const reviewedInput = {
  controlledRevenueOperationsReviewed: true,
  revenueVisibilityReviewed: true,
  throughputIntelligenceReviewed: true,
  manualPipelineOptimizationReviewed: true,
  operatorCoordinationReviewed: true,
  revenueDoesNotExecuteReviewed: true,
  revenueDoesNotContactReviewed: true,
  revenueDoesNotCreateLeadsReviewed: true,
  revenueDoesNotActivateProvidersReviewed: true,
  noRuntimeReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  accessibilityReviewed: true,
  deterministicInvariantsReviewed: true,
  failClosedReviewed: true,
} as const;

describe("R86A controlled revenue operations scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR86ControlledRevenueOperationsScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("controlled revenue operations doctrine");
  });

  it("smoke-tests advisory-only revenue operations scope readiness", () => {
    const result = createR86ControlledRevenueOperationsScopeContract(reviewedInput);
    expect(result.status).toBe("controlled_revenue_operations_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("defines deterministic advisory revenue operations categories", () => {
    const result = createR86ControlledRevenueOperationsScopeContract(reviewedInput);
    expect(result.advisoryRevenueOperationsCategories).toEqual(
      expect.arrayContaining(["revenue-review-needed", "throughput-bottleneck", "deal-flow-delay-risk", "assignment-readiness-review", "closing-readiness-review", "manual-only-revenue-insight"]),
    );
  });

  it("pressure-tests forbidden revenue operations, provider, sourcing, runtime, and execution paths", () => {
    const result = createR86ControlledRevenueOperationsScopeContract({
      ...reviewedInput,
      executionRequested: true,
      providerRequested: true,
      outreachRequested: true,
      runtimeRequested: true,
      automationRequested: true,
      leadGenerationRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      mlsPublicRecordRequested: true,
      fetchNetworkRequested: true,
      processEnvRequested: true,
      prismaWriteRequested: true,
      dbWriteRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("controlled_revenue_operations_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["revenue operations cannot execute", "provider calls remain blocked", "fetch/network remains blocked", "process.env remains blocked"]));
  });

  it("preserves accessibility and governance boundaries", () => {
    const result = createR86ControlledRevenueOperationsScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.governanceBoundary.revenueOperationsOnlyMeans).toContain("execution remains blocked");
  });

  it("summarizes revenue operations scope", () => {
    const result = createR86ControlledRevenueOperationsScopeContract(reviewedInput);
    expect(summarizeR86ControlledRevenueOperationsScope(result)).toMatch(/manual-review-only/i);
    expect(summarizeR86ControlledRevenueOperationsScope(result)).toMatch(/execution remain blocked/i);
  });
});
