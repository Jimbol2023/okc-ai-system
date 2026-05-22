import {
  createR67AutomationLastReadonlyUiScopeContract,
  summarizeR67AutomationLastReadonlyUiScope,
} from "./r67-automation-last-readonly-ui-scope-contract";

const readyInput = {
  r67aScopeReviewed: true,
  r67bAuditReviewed: true,
  authorizedSurfacesReviewed: true,
  forbiddenSurfacesReviewed: true,
  safeCopyReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R67C automation-last read-only UI scope", () => {
  it("defaults to operator review required and no implementation now", () => {
    const result = createR67AutomationLastReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.uiImplementationAllowedNow).toBe(false);
    expect(result.missingReviewAreas).toContain("R67A scope");
  });

  it("smoke-tests authorized read-only dashboard scope", () => {
    const result = createR67AutomationLastReadonlyUiScopeContract(readyInput);
    expect(result.status).toBe("readonly_ui_scope_ready");
    expect(result.authorizedSurfaces).toContain("components/dashboard/automation-last-governance-summary.tsx");
    expect(result.safeReadonlyCopy).toContain("Approval does not grant execution.");
    expect(result.accessibilityRequirements).toContain("aria-describedby");
  });

  it("pressure-tests all forbidden UI controls and activation paths", () => {
    const result = createR67AutomationLastReadonlyUiScopeContract({
      ...readyInput,
      uiImplementationRequestedNow: true,
      buttonsRequested: true,
      controlsRequested: true,
      sendActionRequested: true,
      approvalToExecutionRequested: true,
      providerActivationRequested: true,
      runtimeActivationRequested: true,
      pollingRequested: true,
      campaignRequested: true,
      automationAgentActivationRequested: true,
      newRouteRequested: true,
    });
    expect(result.status).toBe("readonly_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "buttons are forbidden for R67D",
        "controls are forbidden for R67D",
        "send actions are forbidden",
        "approval-to-execution actions are forbidden",
        "provider activation is forbidden",
        "runtime activation is forbidden",
        "polling is forbidden",
      ]),
    );
  });

  it("summarizes the read-only UI boundary", () => {
    const result = createR67AutomationLastReadonlyUiScopeContract(readyInput);
    expect(summarizeR67AutomationLastReadonlyUiScope(result)).toMatch(/no buttons, controls, send actions/i);
  });
});
