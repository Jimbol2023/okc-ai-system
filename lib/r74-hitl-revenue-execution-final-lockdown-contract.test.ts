import {
  createR74HitlRevenueExecutionFinalLockdownContract,
  summarizeR74HitlRevenueExecutionFinalLockdown,
} from "./r74-hitl-revenue-execution-final-lockdown-contract";

const lockedInput = {
  r74aReviewed: true,
  r74bReviewed: true,
  r74cReviewed: true,
  r74dReviewed: true,
  r74eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R74F HITL revenue execution final lockdown", () => {
  it("defaults to operator review required", () => {
    const result = createR74HitlRevenueExecutionFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.hitlExecutionPreparationLocked).toBe(true);
  });

  it("smoke-tests final HITL lockdown enforcement", () => {
    const result = createR74HitlRevenueExecutionFinalLockdownContract(lockedInput);
    expect(result.status).toBe("hitl_lockdown_enforced");
    expect(result.lockdownRules).toEqual(
      expect.arrayContaining([
        "Human approval never grants autonomous execution.",
        "Readiness never grants autonomous execution.",
        "Provider readiness never grants provider activation.",
        "AI recommendation never grants execution.",
        "Execution remains blocked unless future governance explicitly authorizes it.",
      ]),
    );
    expect(result.nextPhase).toBe("R75A - Virtual Driving For Dollars Intelligence Scope Contract");
  });

  it("pressure-tests every HITL execution path as blocked", () => {
    const result = createR74HitlRevenueExecutionFinalLockdownContract({
      ...lockedInput,
      humanApprovalAutonomousExecutionRequested: true,
      readinessAutonomousExecutionRequested: true,
      providerReadinessActivationRequested: true,
      aiRecommendationExecutionRequested: true,
      urgencyExecutionRequested: true,
      revenuePressureExecutionRequested: true,
      queueExecutionRequested: true,
      simulationExecutionRequested: true,
      previewExecutionRequested: true,
      providerClientRequested: true,
      credentialEnvReadRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("hitl_lockdown_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["human approval never grants autonomous execution", "revenue pressure never grants execution", "provider clients remain blocked", "audit logging remains inactive"]));
  });

  it("summarizes final HITL lockdown", () => {
    const result = createR74HitlRevenueExecutionFinalLockdownContract(lockedInput);
    expect(summarizeR74HitlRevenueExecutionFinalLockdown(result)).toMatch(/unless future governance explicitly authorizes it/i);
  });
});
