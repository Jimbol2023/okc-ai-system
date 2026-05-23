import {
  createR89RevenueBottleneckResolutionScopeContract,
  summarizeR89RevenueBottleneckResolutionScope,
} from "./r89-revenue-bottleneck-resolution-scope-contract";

const reviewedInput = {
  revenueBottleneckDiagnosisReviewed: true,
  manualRemediationVisibilityReviewed: true,
  operatorRecoveryPlanningReviewed: true,
  throughputRecoveryReviewed: true,
  bottleneckResolutionDoesNotExecuteReviewed: true,
  bottleneckResolutionDoesNotContactReviewed: true,
  bottleneckResolutionDoesNotCreateLeadsReviewed: true,
  noProviderReviewed: true,
  noRuntimeReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  accessibilityReviewed: true,
  deterministicInvariantsReviewed: true,
  failClosedReviewed: true,
} as const;

describe("R89A revenue bottleneck resolution scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR89RevenueBottleneckResolutionScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("revenue bottleneck diagnosis doctrine");
  });

  it("smoke-tests advisory-only revenue bottleneck resolution readiness", () => {
    const result = createR89RevenueBottleneckResolutionScopeContract(reviewedInput);
    expect(result.status).toBe("revenue_bottleneck_resolution_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("defines deterministic advisory bottleneck resolution categories", () => {
    const result = createR89RevenueBottleneckResolutionScopeContract(reviewedInput);
    expect(result.advisoryBottleneckResolutionCategories).toEqual(
      expect.arrayContaining(["bottleneck-review-needed", "throughput-recovery-review", "revenue-delay-classification", "assignment-blockage-review", "closing-blockage-review", "advisory-resolution-visibility-only"]),
    );
  });

  it("pressure-tests forbidden resolution, provider, sourcing, runtime, and execution paths", () => {
    const result = createR89RevenueBottleneckResolutionScopeContract({
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
    expect(result.status).toBe("revenue_bottleneck_resolution_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["revenue bottleneck resolution cannot execute", "provider calls remain blocked", "fetch/network remains blocked", "process.env remains blocked"]));
  });

  it("preserves accessibility and governance boundaries", () => {
    const result = createR89RevenueBottleneckResolutionScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.governanceBoundary.bottleneckResolutionOnlyMeans).toContain("execution remains blocked");
  });

  it("summarizes revenue bottleneck resolution scope", () => {
    const result = createR89RevenueBottleneckResolutionScopeContract(reviewedInput);
    expect(summarizeR89RevenueBottleneckResolutionScope(result)).toMatch(/manual-review-only/i);
    expect(summarizeR89RevenueBottleneckResolutionScope(result)).toMatch(/execution remain blocked/i);
  });
});
