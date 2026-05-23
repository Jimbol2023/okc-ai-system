import {
  createR87ManualRevenueCommandCenterScopeContract,
  summarizeR87ManualRevenueCommandCenterScope,
} from "./r87-manual-revenue-command-center-scope-contract";

const reviewedInput = {
  manualRevenueCommandCenterReviewed: true,
  executiveRevenueVisibilityReviewed: true,
  revenueOversightReviewed: true,
  throughputOversightReviewed: true,
  operatorCoordinationReviewed: true,
  revenueCommandCenterDoesNotExecuteReviewed: true,
  revenueCommandCenterDoesNotContactReviewed: true,
  revenueCommandCenterDoesNotCreateLeadsReviewed: true,
  noProviderReviewed: true,
  noRuntimeReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  accessibilityReviewed: true,
  deterministicInvariantsReviewed: true,
  failClosedReviewed: true,
} as const;

describe("R87A manual revenue command center scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR87ManualRevenueCommandCenterScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("manual revenue command-center doctrine");
  });

  it("smoke-tests advisory-only revenue command center scope readiness", () => {
    const result = createR87ManualRevenueCommandCenterScopeContract(reviewedInput);
    expect(result.status).toBe("manual_revenue_command_center_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("defines deterministic advisory revenue command center categories", () => {
    const result = createR87ManualRevenueCommandCenterScopeContract(reviewedInput);
    expect(result.advisoryRevenueCommandCenterCategories).toEqual(
      expect.arrayContaining(["executive-review-needed", "revenue-oversight-priority", "throughput-review-needed", "assignment-review-needed", "closing-review-needed", "advisory-revenue-visibility-only"]),
    );
  });

  it("pressure-tests forbidden revenue command center, provider, sourcing, runtime, and execution paths", () => {
    const result = createR87ManualRevenueCommandCenterScopeContract({
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
    expect(result.status).toBe("manual_revenue_command_center_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["revenue command center cannot execute", "provider calls remain blocked", "fetch/network remains blocked", "process.env remains blocked"]));
  });

  it("preserves accessibility and governance boundaries", () => {
    const result = createR87ManualRevenueCommandCenterScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.governanceBoundary.revenueCommandCenterOnlyMeans).toContain("execution remains blocked");
  });

  it("summarizes revenue command center scope", () => {
    const result = createR87ManualRevenueCommandCenterScopeContract(reviewedInput);
    expect(summarizeR87ManualRevenueCommandCenterScope(result)).toMatch(/manual-review-only/i);
    expect(summarizeR87ManualRevenueCommandCenterScope(result)).toMatch(/execution remain blocked/i);
  });
});


