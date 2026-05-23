import {
  createR90ControlledRevenueRecoveryScopeContract,
  summarizeR90ControlledRevenueRecoveryScope,
} from "./r90-controlled-revenue-recovery-scope-contract";

const reviewedInput = {
  controlledRevenueRecoveryReviewed: true,
  delayedOpportunityRecoveryReviewed: true,
  throughputStabilizationReviewed: true,
  manualRecoveryCoordinationReviewed: true,
  operationalResilienceReviewed: true,
  revenueRecoveryDoesNotExecuteReviewed: true,
  revenueRecoveryDoesNotContactReviewed: true,
  revenueRecoveryDoesNotCreateLeadsReviewed: true,
  noProviderReviewed: true,
  noRuntimeReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  accessibilityReviewed: true,
  deterministicInvariantsReviewed: true,
  failClosedReviewed: true,
} as const;

describe("R90A controlled revenue recovery scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR90ControlledRevenueRecoveryScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("controlled revenue recovery doctrine");
  });

  it("smoke-tests advisory-only controlled recovery readiness", () => {
    const result = createR90ControlledRevenueRecoveryScopeContract(reviewedInput);
    expect(result.status).toBe("controlled_revenue_recovery_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("defines deterministic advisory recovery categories", () => {
    const result = createR90ControlledRevenueRecoveryScopeContract(reviewedInput);
    expect(result.advisoryRecoveryCategories).toEqual(expect.arrayContaining(["recovery-review-needed", "delayed-opportunity-review", "stalled-but-recoverable", "throughput-stabilization-review", "manual-only-recovery-insight", "advisory-recovery-visibility-only"]));
  });

  it("pressure-tests forbidden recovery, provider, sourcing, runtime, and execution paths", () => {
    const result = createR90ControlledRevenueRecoveryScopeContract({ ...reviewedInput, executionRequested: true, providerRequested: true, outreachRequested: true, runtimeRequested: true, automationRequested: true, leadGenerationRequested: true, scrapingRequested: true, skipTracingRequested: true, mlsPublicRecordRequested: true, fetchNetworkRequested: true, processEnvRequested: true, prismaWriteRequested: true, dbWriteRequested: true, persistenceRequested: true, auditWritingRequested: true });
    expect(result.status).toBe("controlled_revenue_recovery_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["controlled revenue recovery cannot execute", "provider calls remain blocked", "fetch/network remains blocked", "process.env remains blocked"]));
  });

  it("preserves accessibility and governance boundaries", () => {
    const result = createR90ControlledRevenueRecoveryScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.governanceBoundary.recoveryVisibilityOnlyMeans).toContain("execution remains blocked");
  });

  it("summarizes controlled revenue recovery scope", () => {
    const result = createR90ControlledRevenueRecoveryScopeContract(reviewedInput);
    expect(summarizeR90ControlledRevenueRecoveryScope(result)).toMatch(/manual-review-only/i);
    expect(summarizeR90ControlledRevenueRecoveryScope(result)).toMatch(/execution remain blocked/i);
  });
});
