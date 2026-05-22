import {
  createR67AutomationLastFinalLockdownContract,
  summarizeR67AutomationLastFinalLockdown,
} from "./r67-automation-last-final-lockdown-contract";

const lockedInput = {
  r67aReviewed: true,
  r67bReviewed: true,
  r67cReviewed: true,
  r67dReviewed: true,
  r67eReviewed: true,
  lockdownRulesReviewed: true,
  forbiddenDriftReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R67F automation-last final lockdown", () => {
  it("defaults to operator review required", () => {
    const result = createR67AutomationLastFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.automationLastLocked).toBe(true);
    expect(result.flags.executionBlocked).toBe(true);
  });

  it("smoke-tests final automation-last lockdown enforcement", () => {
    const result = createR67AutomationLastFinalLockdownContract(lockedInput);
    expect(result.status).toBe("automation_last_lockdown_enforced");
    expect(result.lockdownRules).toEqual(
      expect.arrayContaining([
        "Automation remains last.",
        "Intelligence never grants permission.",
        "Approval never grants execution.",
        "Readiness never grants execution.",
        "Queue priority never grants execution.",
        "Urgency never grants execution.",
        "Revenue opportunity never grants execution.",
      ]),
    );
    expect(result.nextPhase).toBe("R68A - Execution Simulation Intelligence Scope Contract");
  });

  it("pressure-tests every signal and activation path as blocked", () => {
    const result = createR67AutomationLastFinalLockdownContract({
      ...lockedInput,
      automationRequested: true,
      executionRequested: true,
      intelligencePermissionRequested: true,
      approvalExecutionRequested: true,
      readinessExecutionRequested: true,
      queueExecutionRequested: true,
      urgencyExecutionRequested: true,
      revenueExecutionRequested: true,
      providerActivationRequested: true,
      runtimeActivationRequested: true,
      pollingRequested: true,
      campaignRequested: true,
      hiddenExecutionRequested: true,
    });
    expect(result.status).toBe("automation_last_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "automation remains last and blocked",
        "execution remains blocked",
        "intelligence never grants permission",
        "approval never grants execution",
        "readiness never grants execution",
        "queue priority never grants execution",
        "urgency never grants execution",
        "revenue opportunity never grants execution",
        "provider activation remains blocked",
        "runtime activation remains blocked",
        "polling remains blocked",
      ]),
    );
  });

  it("summarizes the final lockdown", () => {
    const result = createR67AutomationLastFinalLockdownContract(lockedInput);
    expect(summarizeR67AutomationLastFinalLockdown(result)).toMatch(/automation-last governance is locked/i);
  });
});
