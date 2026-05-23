import {
  createR87ManualRevenueCommandCenterFinalLockdownContract,
  summarizeR87ManualRevenueCommandCenterFinalLockdown,
} from "./r87-manual-revenue-command-center-final-lockdown-contract";

const reviewedInput = {
  r87aReviewed: true,
  r87bReviewed: true,
  r87cReviewed: true,
  r87dReviewed: true,
  r87eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R87F manual revenue command center final lockdown contract", () => {
  it("defaults to operator review required with lockdown enforced", () => {
    const result = createR87ManualRevenueCommandCenterFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.manualRevenueCommandCenterLockdownEnforced).toBe(true);
    expect(result.rules).toContain("Revenue command intelligence never executes.");
  });

  it("smoke-tests a fully reviewed lockdown", () => {
    const result = createR87ManualRevenueCommandCenterFinalLockdownContract(reviewedInput);
    expect(result.status).toBe("manual_revenue_command_center_lockdown_enforced");
    expect(result.phase).toBe("R87F");
    expect(result.nextPhase).toBe("R88 - Revenue Throughput Coordination Intelligence");
  });

  it("preserves all non-execution flags", () => {
    const result = createR87ManualRevenueCommandCenterFinalLockdownContract(reviewedInput);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.persistenceAllowedNow).toBe(false);
    expect(result.flags.pollingAllowed).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
    expect(result.flags.executionAllowed).toBe(false);
  });

  it("pressure-tests every forbidden request as blocked", () => {
    const result = createR87ManualRevenueCommandCenterFinalLockdownContract({
      ...reviewedInput,
      executionRequested: true,
      workflowActivationRequested: true,
      outreachRequested: true,
      throughputRuntimeRequested: true,
      buyerContactRequested: true,
      closingExecutionRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      leadCreationRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("manual_revenue_command_center_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "revenue command center intelligence never executes",
        "executive review never activates workflows",
        "revenue visibility never triggers outreach",
        "throughput visibility never activates runtime jobs",
        "assignment review never contacts buyers",
        "closing review never executes closing actions",
        "high-opportunity visibility never creates leads",
      ]),
    );
  });

  it("summarizes the final lockdown", () => {
    const result = createR87ManualRevenueCommandCenterFinalLockdownContract(reviewedInput);
    expect(summarizeR87ManualRevenueCommandCenterFinalLockdown(result)).toMatch(/revenue command intelligence never executes/i);
    expect(summarizeR87ManualRevenueCommandCenterFinalLockdown(result)).toMatch(/throughput visibility never activates runtime jobs/i);
    expect(summarizeR87ManualRevenueCommandCenterFinalLockdown(result)).toMatch(/execution remains blocked/i);
  });
});


