import {
  createR70ManualOperatorActionCenterFinalLockdownContract,
  summarizeR70ManualOperatorActionCenterFinalLockdown,
} from "./r70-manual-operator-action-center-final-lockdown-contract";

const lockedInput = {
  r70aReviewed: true,
  r70bReviewed: true,
  r70cReviewed: true,
  r70dReviewed: true,
  r70eReviewed: true,
  lockdownRulesReviewed: true,
  forbiddenDriftReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R70F manual operator action center final lockdown", () => {
  it("defaults to operator review required", () => {
    const result = createR70ManualOperatorActionCenterFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.manualActionCenterLocked).toBe(true);
  });

  it("smoke-tests final lockdown enforcement", () => {
    const result = createR70ManualOperatorActionCenterFinalLockdownContract(lockedInput);
    expect(result.status).toBe("manual_action_center_lockdown_enforced");
    expect(result.lockdownRules).toEqual(
      expect.arrayContaining([
        "Recommendations never grant execution.",
        "Priority never grants execution.",
        "Urgency never grants execution.",
        "Queue never grants execution.",
        "Readiness never grants execution.",
        "Provider readiness never grants execution.",
        "Approval never grants execution.",
        "Simulation never grants execution.",
        "Execution remains blocked.",
      ]),
    );
    expect(result.nextPhase).toBe("R71A - Controlled Human Outreach Workflow Scope Contract");
  });

  it("pressure-tests all execution activation pathways as blocked", () => {
    const result = createR70ManualOperatorActionCenterFinalLockdownContract({
      ...lockedInput,
      recommendationExecutionRequested: true,
      priorityExecutionRequested: true,
      urgencyExecutionRequested: true,
      queueExecutionRequested: true,
      readinessExecutionRequested: true,
      providerReadinessExecutionRequested: true,
      approvalExecutionRequested: true,
      simulationExecutionRequested: true,
      providerActivationRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("manual_action_center_lockdown_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["recommendations never grant execution", "provider activation remains blocked", "fetch/network remains blocked", "audit logging remains inactive"]));
  });

  it("summarizes the final lockdown", () => {
    const result = createR70ManualOperatorActionCenterFinalLockdownContract(lockedInput);
    expect(summarizeR70ManualOperatorActionCenterFinalLockdown(result)).toMatch(/advisory-only/i);
  });
});
