import {
  createR74HitlRevenueExecutionScopeContract,
  summarizeR74HitlRevenueExecutionScope,
} from "./r74-hitl-revenue-execution-scope-contract";

const reviewedInput = {
  hitlDoctrineReviewed: true,
  humanAccountabilityReviewed: true,
  humanApprovalReviewed: true,
  reviewCheckpointReviewed: true,
  governanceOverrideReviewed: true,
  humanFinalAuthorityReviewed: true,
  noAutonomousExecutionReviewed: true,
  providerIsolationReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R74A HITL revenue execution scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR74HitlRevenueExecutionScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.hitlPreparationGrantsExecution).toBe(false);
  });

  it("smoke-tests HITL scope readiness", () => {
    const result = createR74HitlRevenueExecutionScopeContract(reviewedInput);
    expect(result.status).toBe("hitl_scope_ready");
    expect(result.allowedConcepts).toContain("human-in-the-loop revenue execution preparation");
    expect(result.governanceBoundary.governanceStopsOutrank).toContain("revenue pressure");
  });

  it("pressure-tests autonomous execution and provider paths as blocked", () => {
    const result = createR74HitlRevenueExecutionScopeContract({
      ...reviewedInput,
      autonomousExecutionRequested: true,
      autonomousOutreachRequested: true,
      providerActivationRequested: true,
      providerClientRequested: true,
      envReadRequested: true,
      credentialReadRequested: true,
      fetchNetworkRequested: true,
      sendRequested: true,
      callRequested: true,
      textRequested: true,
      emailRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      campaignRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("hitl_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["autonomous execution remains blocked", "provider activation remains blocked", "fetch/network remains blocked", "sending remains blocked", "audit writing remains blocked"]));
  });

  it("preserves inclusive accessibility requirements", () => {
    const result = createR74HitlRevenueExecutionScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noPolling).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes preparation-only HITL scope", () => {
    const result = createR74HitlRevenueExecutionScopeContract(reviewedInput);
    expect(summarizeR74HitlRevenueExecutionScope(result)).toMatch(/preparation-only/i);
  });
});
