import {
  createR86ControlledRevenueOperationsFinalLockdownContract,
  summarizeR86ControlledRevenueOperationsFinalLockdown,
} from "./r86-controlled-revenue-operations-final-lockdown-contract";

const reviewedInput = {
  r86aReviewed: true,
  r86bReviewed: true,
  r86cReviewed: true,
  r86dReviewed: true,
  r86eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R86F controlled revenue operations final lockdown contract", () => {
  it("defaults to operator review required with lockdown enforced", () => {
    const result = createR86ControlledRevenueOperationsFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.controlledRevenueOperationsLockdownEnforced).toBe(true);
    expect(result.rules).toContain("Revenue operations intelligence never executes.");
  });

  it("smoke-tests a fully reviewed lockdown", () => {
    const result = createR86ControlledRevenueOperationsFinalLockdownContract(reviewedInput);
    expect(result.status).toBe("controlled_revenue_operations_lockdown_enforced");
    expect(result.phase).toBe("R86F");
    expect(result.nextPhase).toBe("R87 - Manual Revenue Command Center Readiness");
  });

  it("preserves all non-execution flags", () => {
    const result = createR86ControlledRevenueOperationsFinalLockdownContract(reviewedInput);
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
    const result = createR86ControlledRevenueOperationsFinalLockdownContract({
      ...reviewedInput,
      executionRequested: true,
      outreachRequested: true,
      runtimeRequested: true,
      automationRequested: true,
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
    expect(result.status).toBe("controlled_revenue_operations_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "revenue operations intelligence never executes",
        "revenue scores never trigger outreach",
        "throughput signals never trigger runtime jobs",
        "pipeline review never activates automation",
        "assignment readiness never contacts buyers",
        "closing readiness never executes closing actions",
        "high-revenue opportunity never creates leads",
      ]),
    );
  });

  it("summarizes the final lockdown", () => {
    const result = createR86ControlledRevenueOperationsFinalLockdownContract(reviewedInput);
    expect(summarizeR86ControlledRevenueOperationsFinalLockdown(result)).toMatch(/revenue operations intelligence never executes/i);
    expect(summarizeR86ControlledRevenueOperationsFinalLockdown(result)).toMatch(/throughput signals never trigger runtime jobs/i);
    expect(summarizeR86ControlledRevenueOperationsFinalLockdown(result)).toMatch(/execution remains blocked/i);
  });
});
