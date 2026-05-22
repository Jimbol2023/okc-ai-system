import {
  createR67AutomationLastGovernanceScopeContract,
  summarizeR67AutomationLastGovernanceScope,
} from "./r67-automation-last-governance-scope-contract";

const readyInput = {
  doctrineReviewed: true,
  permissionBoundariesReviewed: true,
  governanceStopDominanceReviewed: true,
  forbiddenSemanticsReviewed: true,
  failClosedRulesReviewed: true,
  futureUiBoundariesReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R67A automation-last governance scope", () => {
  it("defaults to operator review required with automation blocked", () => {
    const result = createR67AutomationLastGovernanceScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.safetyFlags.automationAllowedNow).toBe(false);
    expect(result.safetyFlags.executionAllowedNow).toBe(false);
    expect(result.missingReviewAreas).toContain("automation-last doctrine");
  });

  it("passes smoke validation for ready automation-last doctrine", () => {
    const result = createR67AutomationLastGovernanceScopeContract(readyInput);
    expect(result.status).toBe("automation_last_scope_ready");
    expect(result.permissionBoundaryRules).toEqual(
      expect.arrayContaining([
        "Intelligence signals never grant permission.",
        "Approval signals never grant execution.",
        "Readiness signals never grant execution.",
        "Queue priority signals never grant execution.",
        "Urgency signals never grant execution.",
        "Revenue opportunity signals never grant execution.",
      ]),
    );
    expect(result.nextPhase).toBe("R67B - Automation Drift / Permission Risk Audit");
  });

  it("blocks provider runtime polling campaign automation and execution requests", () => {
    const result = createR67AutomationLastGovernanceScopeContract({
      ...readyInput,
      automationRequested: true,
      executionRequested: true,
      providerActivationRequested: true,
      runtimeActivationRequested: true,
      pollingRequested: true,
      campaignRequested: true,
      hiddenExecutionAffordanceRequested: true,
    });
    expect(result.status).toBe("automation_last_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "automation remains forbidden",
        "execution remains forbidden",
        "provider activation remains forbidden",
        "runtime activation remains forbidden",
        "polling remains forbidden",
        "campaign activation remains forbidden",
      ]),
    );
  });

  it("pressure-tests all signal-to-execution drift paths as blocked", () => {
    const result = createR67AutomationLastGovernanceScopeContract({
      ...readyInput,
      approvalGrantsExecutionRequested: true,
      intelligenceGrantsPermissionRequested: true,
      readinessGrantsExecutionRequested: true,
      queueGrantsExecutionRequested: true,
      urgencyGrantsExecutionRequested: true,
      revenueGrantsExecutionRequested: true,
    });
    expect(result.status).toBe("automation_last_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "approval cannot grant execution",
        "intelligence cannot grant permission",
        "readiness cannot grant execution",
        "queue priority cannot grant execution",
        "urgency cannot grant execution",
        "revenue opportunity cannot grant execution",
      ]),
    );
  });

  it("summarizes the automation-last boundary", () => {
    const result = createR67AutomationLastGovernanceScopeContract(readyInput);
    expect(summarizeR67AutomationLastGovernanceScope(result)).toMatch(/automation remains last/i);
  });
});
