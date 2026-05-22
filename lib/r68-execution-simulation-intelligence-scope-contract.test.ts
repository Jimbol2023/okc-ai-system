import {
  createR68ExecutionSimulationIntelligenceScopeContract,
  summarizeR68ExecutionSimulationIntelligenceScope,
} from "./r68-execution-simulation-intelligence-scope-contract";

const readyInput = {
  doctrineReviewed: true,
  allowedConceptsReviewed: true,
  forbiddenSemanticsReviewed: true,
  auditBoundaryReviewed: true,
  accessibilityReviewed: true,
  failClosedReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R68A execution simulation intelligence scope", () => {
  it("defaults to operator review required and keeps execution blocked", () => {
    const result = createR68ExecutionSimulationIntelligenceScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.executionAllowedNow).toBe(false);
    expect(result.flags.auditRecordsWritten).toBe(false);
  });

  it("smoke-tests simulation-only scope", () => {
    const result = createR68ExecutionSimulationIntelligenceScopeContract(readyInput);
    expect(result.status).toBe("execution_simulation_scope_ready");
    expect(result.allowedConcepts).toContain("simulation-only action preview");
    expect(result.auditBoundary.wording).toContain("audit layer not active yet");
    expect(result.nextPhase).toBe("R68B - Simulation Drift / Execution Risk Audit");
  });

  it("preserves inclusive accessibility requirements", () => {
    const result = createR68ExecutionSimulationIntelligenceScopeContract(readyInput);
    expect(result.inclusiveAccessibility).toEqual(
      expect.arrayContaining(["elderly users", "blind users", "low-vision users", "keyboard-only users", "aria-describedby"]),
    );
  });

  it("pressure-tests provider runtime polling campaign persistence audit writing and sending blockers", () => {
    const result = createR68ExecutionSimulationIntelligenceScopeContract({
      ...readyInput,
      executionRequested: true,
      providerRequested: true,
      sendRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      campaignRequested: true,
      automationRequested: true,
    });
    expect(result.status).toBe("execution_simulation_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining(["execution remains forbidden", "provider activation remains forbidden", "audit writing remains forbidden"]),
    );
  });

  it("pressure-tests approval simulation readiness queue urgency revenue execution drift", () => {
    const result = createR68ExecutionSimulationIntelligenceScopeContract({
      ...readyInput,
      approvalExecutionRequested: true,
      simulationExecutionRequested: true,
      readinessExecutionRequested: true,
      queueExecutionRequested: true,
      urgencyExecutionRequested: true,
      revenueExecutionRequested: true,
    });
    expect(result.status).toBe("execution_simulation_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "approval does not execute",
        "simulation does not execute",
        "readiness does not execute",
        "queue does not execute",
        "urgency does not execute",
        "revenue opportunity does not execute",
      ]),
    );
  });

  it("summarizes the simulation-only boundary", () => {
    const result = createR68ExecutionSimulationIntelligenceScopeContract(readyInput);
    expect(summarizeR68ExecutionSimulationIntelligenceScope(result)).toMatch(/digital rehearsal only/i);
  });
});
