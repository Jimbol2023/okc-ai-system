import {
  createR88RevenueThroughputCoordinationFinalLockdownContract,
  summarizeR88RevenueThroughputCoordinationFinalLockdown,
} from "./r88-revenue-throughput-coordination-final-lockdown-contract";

const reviewedInput = {
  r88aReviewed: true,
  r88bReviewed: true,
  r88cReviewed: true,
  r88dReviewed: true,
  r88eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R88F revenue throughput coordination final lockdown contract", () => {
  it("defaults to operator review required with lockdown enforced", () => {
    const result = createR88RevenueThroughputCoordinationFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.manualThroughputCoordinationLockdownEnforced).toBe(true);
    expect(result.rules).toContain("Throughput coordination intelligence never executes.");
  });

  it("smoke-tests a fully reviewed lockdown", () => {
    const result = createR88RevenueThroughputCoordinationFinalLockdownContract(reviewedInput);
    expect(result.status).toBe("revenue_throughput_coordination_lockdown_enforced");
    expect(result.phase).toBe("R88F");
    expect(result.nextPhase).toBe("R89 - Revenue Bottleneck Resolution Readiness");
  });

  it("preserves all non-execution flags", () => {
    const result = createR88RevenueThroughputCoordinationFinalLockdownContract(reviewedInput);
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
    const result = createR88RevenueThroughputCoordinationFinalLockdownContract({
      ...reviewedInput,
      executionRequested: true,
      sequencingAutomationRequested: true,
      outreachRequested: true,
      velocityRuntimeRequested: true,
      providerActivationRequested: true,
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
    expect(result.status).toBe("revenue_throughput_coordination_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "revenue throughput coordination intelligence never executes",
        "sequencing review never activates automation",
        "delayed revenue paths never trigger outreach",
        "velocity signals never activate runtime jobs",
        "bottlenecks never activate providers",
        "assignment delays never contact buyers",
        "closing delays never execute closing actions",
        "high-opportunity visibility never creates leads",
      ]),
    );
  });

  it("summarizes the final lockdown", () => {
    const result = createR88RevenueThroughputCoordinationFinalLockdownContract(reviewedInput);
    expect(summarizeR88RevenueThroughputCoordinationFinalLockdown(result)).toMatch(/throughput coordination intelligence never executes/i);
    expect(summarizeR88RevenueThroughputCoordinationFinalLockdown(result)).toMatch(/velocity signals never activate runtime jobs/i);
    expect(summarizeR88RevenueThroughputCoordinationFinalLockdown(result)).toMatch(/execution remains blocked/i);
  });
});
