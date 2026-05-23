import {
  createR85ManualAcquisitionCommandCenterFinalLockdownContract,
  summarizeR85ManualAcquisitionCommandCenterFinalLockdown,
} from "./r85-manual-acquisition-command-center-final-lockdown-contract";

const reviewedInput = {
  r85aReviewed: true,
  r85bReviewed: true,
  r85cReviewed: true,
  r85dReviewed: true,
  r85eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R85F manual acquisition command center final lockdown contract", () => {
  it("defaults to operator review required with lockdown enforced", () => {
    const result = createR85ManualAcquisitionCommandCenterFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.manualAcquisitionCommandCenterLockdownEnforced).toBe(true);
    expect(result.rules).toContain("Command-center intelligence never executes.");
  });

  it("smoke-tests a fully reviewed lockdown", () => {
    const result = createR85ManualAcquisitionCommandCenterFinalLockdownContract(reviewedInput);
    expect(result.status).toBe("manual_acquisition_command_center_lockdown_enforced");
    expect(result.phase).toBe("R85F");
    expect(result.nextPhase).toBe("R86 - Controlled Revenue Operations Intelligence");
  });

  it("preserves all non-execution flags", () => {
    const result = createR85ManualAcquisitionCommandCenterFinalLockdownContract(reviewedInput);
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
    const result = createR85ManualAcquisitionCommandCenterFinalLockdownContract({
      ...reviewedInput,
      executionRequested: true,
      workflowActivationRequested: true,
      providerActivationRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      outreachRequested: true,
      readinessExecutionRequested: true,
      leadCreationRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("manual_acquisition_command_center_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "command-center intelligence never executes",
        "review queues never activate workflows",
        "escalation visibility never activates providers",
        "bottlenecks never trigger scraping",
        "missing data never triggers skip tracing",
        "revenue visibility never triggers outreach",
        "readiness visibility never triggers execution",
        "confidence scores never create leads",
      ]),
    );
  });

  it("summarizes the final lockdown", () => {
    const result = createR85ManualAcquisitionCommandCenterFinalLockdownContract(reviewedInput);
    expect(summarizeR85ManualAcquisitionCommandCenterFinalLockdown(result)).toMatch(/command-center intelligence never executes/i);
    expect(summarizeR85ManualAcquisitionCommandCenterFinalLockdown(result)).toMatch(/review queues never activate workflows/i);
    expect(summarizeR85ManualAcquisitionCommandCenterFinalLockdown(result)).toMatch(/execution remains blocked/i);
  });
});
