import {
  createR84ControlledAcquisitionWorkflowFinalLockdownContract,
  summarizeR84ControlledAcquisitionWorkflowFinalLockdown,
} from "./r84-controlled-acquisition-workflow-final-lockdown-contract";

const reviewedInput = {
  r84aReviewed: true,
  r84bReviewed: true,
  r84cReviewed: true,
  r84dReviewed: true,
  r84eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R84F controlled acquisition workflow final lockdown contract", () => {
  it("defaults to operator review required with lockdown enforced", () => {
    const result = createR84ControlledAcquisitionWorkflowFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.controlledAcquisitionWorkflowLockdownEnforced).toBe(true);
    expect(result.rules).toContain("Workflow intelligence never executes.");
  });

  it("smoke-tests a fully reviewed lockdown", () => {
    const result = createR84ControlledAcquisitionWorkflowFinalLockdownContract(reviewedInput);
    expect(result.status).toBe("controlled_acquisition_workflow_lockdown_enforced");
    expect(result.phase).toBe("R84F");
    expect(result.nextPhase).toBe("R85 - Manual Acquisition Command Center Readiness");
  });

  it("preserves all non-execution flags", () => {
    const result = createR84ControlledAcquisitionWorkflowFinalLockdownContract(reviewedInput);
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
    const result = createR84ControlledAcquisitionWorkflowFinalLockdownContract({
      ...reviewedInput,
      executionRequested: true,
      automationRequested: true,
      providerActivationRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      contactRequested: true,
      outreachRequested: true,
      runtimeRequested: true,
      leadCreationRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("controlled_acquisition_workflow_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "workflow intelligence never executes",
        "manual sequence never becomes automation",
        "bottlenecks never activate providers",
        "stalled leads never trigger scraping",
        "missing data never triggers skip tracing",
        "seller review never triggers contact",
        "buyer readiness never triggers outreach",
        "throughput scores never trigger runtime jobs",
        "confidence scores never create leads",
      ]),
    );
  });

  it("summarizes the final lockdown", () => {
    const result = createR84ControlledAcquisitionWorkflowFinalLockdownContract(reviewedInput);
    expect(summarizeR84ControlledAcquisitionWorkflowFinalLockdown(result)).toMatch(/workflow intelligence never executes/i);
    expect(summarizeR84ControlledAcquisitionWorkflowFinalLockdown(result)).toMatch(/manual sequence never becomes automation/i);
    expect(summarizeR84ControlledAcquisitionWorkflowFinalLockdown(result)).toMatch(/execution remains blocked/i);
  });
});
