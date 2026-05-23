import {
  createR89RevenueBottleneckResolutionFinalLockdownContract,
  summarizeR89RevenueBottleneckResolutionFinalLockdown,
} from "./r89-revenue-bottleneck-resolution-final-lockdown-contract";

const reviewedInput = {
  r89aReviewed: true,
  r89bReviewed: true,
  r89cReviewed: true,
  r89dReviewed: true,
  r89eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R89F revenue bottleneck resolution final lockdown contract", () => {
  it("defaults to operator review required with lockdown enforced", () => {
    const result = createR89RevenueBottleneckResolutionFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.revenueBottleneckResolutionLockdownEnforced).toBe(true);
    expect(result.rules).toContain("Bottleneck resolution intelligence never executes.");
  });

  it("smoke-tests a fully reviewed lockdown", () => {
    const result = createR89RevenueBottleneckResolutionFinalLockdownContract(reviewedInput);
    expect(result.status).toBe("revenue_bottleneck_resolution_lockdown_enforced");
    expect(result.phase).toBe("R89F");
    expect(result.nextPhase).toBe("R90 - Controlled Revenue Recovery Intelligence");
  });

  it("preserves all non-execution flags", () => {
    const result = createR89RevenueBottleneckResolutionFinalLockdownContract(reviewedInput);
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
    const result = createR89RevenueBottleneckResolutionFinalLockdownContract({
      ...reviewedInput,
      executionRequested: true,
      remediationAutomationRequested: true,
      throughputRuntimeRequested: true,
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
    expect(result.status).toBe("revenue_bottleneck_resolution_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "bottleneck resolution intelligence never executes",
        "remediation review never activates automation",
        "throughput recovery visibility never activates runtime jobs",
        "blocked workflow visibility never activates providers",
        "assignment blockage never contacts buyers",
        "closing blockage never executes closing actions",
        "high-impact bottleneck visibility never creates leads",
      ]),
    );
  });

  it("summarizes the final lockdown", () => {
    const result = createR89RevenueBottleneckResolutionFinalLockdownContract(reviewedInput);
    expect(summarizeR89RevenueBottleneckResolutionFinalLockdown(result)).toMatch(/bottleneck resolution intelligence never executes/i);
    expect(summarizeR89RevenueBottleneckResolutionFinalLockdown(result)).toMatch(/throughput recovery visibility never activates runtime jobs/i);
    expect(summarizeR89RevenueBottleneckResolutionFinalLockdown(result)).toMatch(/execution remains blocked/i);
  });
});
