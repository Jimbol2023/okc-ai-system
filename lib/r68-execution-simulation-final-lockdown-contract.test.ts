import {
  createR68ExecutionSimulationFinalLockdownContract,
  summarizeR68ExecutionSimulationFinalLockdown,
} from "./r68-execution-simulation-final-lockdown-contract";

const lockedInput = {
  r68aReviewed: true,
  r68bReviewed: true,
  r68cReviewed: true,
  r68dReviewed: true,
  r68eReviewed: true,
  lockdownRulesReviewed: true,
  auditBoundaryReviewed: true,
  forbiddenDriftReviewed: true,
  inclusiveAccessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R68F execution simulation final lockdown", () => {
  it("defaults to operator review required", () => {
    const result = createR68ExecutionSimulationFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.simulationOnlyLocked).toBe(true);
    expect(result.flags.auditLoggingActive).toBe(false);
    expect(result.flags.executionBlocked).toBe(true);
  });

  it("smoke-tests final simulation-only lockdown enforcement", () => {
    const result = createR68ExecutionSimulationFinalLockdownContract(lockedInput);
    expect(result.status).toBe("execution_simulation_lockdown_enforced");
    expect(result.lockdownRules).toEqual(
      expect.arrayContaining([
        "Simulation remains simulation only.",
        "Preview never grants execution.",
        "Approval never grants execution.",
        "Readiness never grants execution.",
        "Queue priority never grants execution.",
        "Urgency never grants execution.",
        "Revenue opportunity never grants execution.",
        "Audit logging remains inactive.",
      ]),
    );
    expect(result.auditBoundaryRules).toContain("No audit records are written in this phase.");
    expect(result.nextPhase).toBe("R69A - Provider Isolation & Safety Boundary Scope Contract");
  });

  it("pressure-tests every signal activation persistence and audit path as blocked", () => {
    const result = createR68ExecutionSimulationFinalLockdownContract({
      ...lockedInput,
      simulationExecutionRequested: true,
      previewProviderRequested: true,
      approvalExecutionRequested: true,
      readinessExecutionRequested: true,
      queueExecutionRequested: true,
      urgencyExecutionRequested: true,
      revenueExecutionRequested: true,
      providerActivationRequested: true,
      runtimeActivationRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      campaignRequested: true,
      hiddenExecutionRequested: true,
    });
    expect(result.status).toBe("execution_simulation_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "simulation remains simulation only and cannot execute",
        "preview cannot trigger providers",
        "approval never grants execution",
        "readiness never grants execution",
        "queue priority never grants execution",
        "urgency never grants execution",
        "revenue opportunity never grants execution",
        "provider activation remains blocked",
        "runtime activation remains blocked",
        "polling remains blocked",
        "persistence remains blocked",
        "audit logging remains inactive",
      ]),
    );
  });

  it("summarizes the final lockdown", () => {
    const result = createR68ExecutionSimulationFinalLockdownContract(lockedInput);
    expect(summarizeR68ExecutionSimulationFinalLockdown(result)).toMatch(/digital rehearsal only/i);
  });
});
