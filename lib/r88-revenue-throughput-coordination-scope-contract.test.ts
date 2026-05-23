import {
  createR88RevenueThroughputCoordinationScopeContract,
  summarizeR88RevenueThroughputCoordinationScope,
} from "./r88-revenue-throughput-coordination-scope-contract";

const reviewedInput = {
  revenueThroughputCoordinationReviewed: true,
  manualSequencingReviewed: true,
  acquisitionVelocityVisibilityReviewed: true,
  bottleneckIntelligenceReviewed: true,
  operatorThroughputPlanningReviewed: true,
  throughputCoordinationDoesNotExecuteReviewed: true,
  throughputCoordinationDoesNotContactReviewed: true,
  throughputCoordinationDoesNotCreateLeadsReviewed: true,
  noProviderReviewed: true,
  noRuntimeReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  accessibilityReviewed: true,
  deterministicInvariantsReviewed: true,
  failClosedReviewed: true,
} as const;

describe("R88A revenue throughput coordination scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR88RevenueThroughputCoordinationScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("revenue throughput coordination doctrine");
  });

  it("smoke-tests advisory-only revenue throughput coordination scope readiness", () => {
    const result = createR88RevenueThroughputCoordinationScopeContract(reviewedInput);
    expect(result.status).toBe("revenue_throughput_coordination_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("defines deterministic advisory revenue throughput coordination categories", () => {
    const result = createR88RevenueThroughputCoordinationScopeContract(reviewedInput);
    expect(result.advisoryThroughputCoordinationCategories).toEqual(
      expect.arrayContaining(["throughput-review-needed", "coordination-review-needed", "revenue-bottleneck", "acquisition-velocity-risk", "assignment-delay-risk", "closing-delay-risk", "advisory-throughput-visibility-only"]),
    );
  });

  it("pressure-tests forbidden revenue throughput coordination, provider, sourcing, runtime, and execution paths", () => {
    const result = createR88RevenueThroughputCoordinationScopeContract({
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
    expect(result.status).toBe("revenue_throughput_coordination_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["revenue throughput coordination cannot execute", "provider calls remain blocked", "fetch/network remains blocked", "process.env remains blocked"]));
  });

  it("preserves accessibility and governance boundaries", () => {
    const result = createR88RevenueThroughputCoordinationScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.governanceBoundary.throughputCoordinationOnlyMeans).toContain("execution remains blocked");
  });

  it("summarizes revenue throughput coordination scope", () => {
    const result = createR88RevenueThroughputCoordinationScopeContract(reviewedInput);
    expect(summarizeR88RevenueThroughputCoordinationScope(result)).toMatch(/manual-review-only/i);
    expect(summarizeR88RevenueThroughputCoordinationScope(result)).toMatch(/execution remain blocked/i);
  });
});
