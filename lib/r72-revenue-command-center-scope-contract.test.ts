import {
  createR72RevenueCommandCenterScopeContract,
  summarizeR72RevenueCommandCenterScope,
} from "./r72-revenue-command-center-scope-contract";

const reviewedInput = {
  revenueCommandDoctrineReviewed: true,
  manualRevenueVisibilityReviewed: true,
  humanInControlReviewed: true,
  advisoryOnlyReviewed: true,
  providerIsolationReviewed: true,
  noContactBoundaryReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R72A revenue command center scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR72RevenueCommandCenterScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.revenueSignalGrantsExecution).toBe(false);
  });

  it("smoke-tests advisory revenue command readiness", () => {
    const result = createR72RevenueCommandCenterScopeContract(reviewedInput);
    expect(result.status).toBe("revenue_command_scope_ready");
    expect(result.allowedConcepts).toContain("revenue command center");
    expect(result.governanceBoundary.governanceStopsOutrank).toContain("revenue priority");
    expect(result.nextPhase).toBe("R72B - Revenue Command Center Drift / Execution Risk Audit");
  });

  it("pressure-tests revenue signals and execution pathways as blocked", () => {
    const result = createR72RevenueCommandCenterScopeContract({
      ...reviewedInput,
      revenueExecutionRequested: true,
      revenueScoreExecutionRequested: true,
      outreachRequested: true,
      sendRequested: true,
      callRequested: true,
      textRequested: true,
      emailRequested: true,
      providerRequested: true,
      providerClientRequested: true,
      envReadRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      campaignRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("revenue_command_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "revenue priority never grants execution",
        "revenue score never grants execution",
        "outreach activation remains blocked",
        "sending remains blocked",
        "provider activation remains blocked",
        "audit writing remains blocked",
      ]),
    );
  });

  it("preserves inclusive accessibility requirements", () => {
    const result = createR72RevenueCommandCenterScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noPolling).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes non-executing revenue visibility", () => {
    const result = createR72RevenueCommandCenterScopeContract(reviewedInput);
    expect(summarizeR72RevenueCommandCenterScope(result)).toMatch(/never execute/i);
  });
});
