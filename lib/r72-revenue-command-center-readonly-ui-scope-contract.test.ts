import {
  createR72RevenueCommandCenterReadonlyUiScopeContract,
  summarizeR72RevenueCommandCenterReadonlyUiScope,
} from "./r72-revenue-command-center-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  safeCopyReviewed: true,
  forbiddenSurfacesReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R72C revenue command center readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR72RevenueCommandCenterReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.implementationAllowedNow).toBe(false);
  });

  it("smoke-tests future read-only UI scope readiness", () => {
    const result = createR72RevenueCommandCenterReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("revenue_command_ui_scope_ready");
    expect(result.authorizedSurfaces).toContain("components/dashboard/revenue-command-center-summary.tsx");
    expect(result.safeCopy).toContain("Revenue priority is advisory only.");
    expect(result.nextPhase).toBe("R72D - Revenue Command Center Read-Only UI Implementation");
  });

  it("pressure-tests UI controls and execution affordances as blocked", () => {
    const result = createR72RevenueCommandCenterReadonlyUiScopeContract({
      ...reviewedInput,
      implementationRequestedNow: true,
      buttonRequested: true,
      sendControlRequested: true,
      callControlRequested: true,
      smsControlRequested: true,
      emailControlRequested: true,
      providerControlRequested: true,
      approvalToSendRequested: true,
      workflowControlRequested: true,
      campaignControlRequested: true,
      formRequested: true,
      inputRequested: true,
      executionLinkRequested: true,
      fetchNetworkRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      persistenceRequested: true,
    });
    expect(result.status).toBe("revenue_command_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["buttons remain forbidden", "send controls remain forbidden", "provider controls remain forbidden", "polling remains blocked"]));
  });

  it("preserves accessibility scope", () => {
    const result = createR72RevenueCommandCenterReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.ariaDescribedby).toBe(true);
    expect(result.accessibility.noAutoRefresh).toBe(true);
  });

  it("summarizes safe read-only UI boundaries", () => {
    const result = createR72RevenueCommandCenterReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR72RevenueCommandCenterReadonlyUiScope(result)).toMatch(/read-only revenue visibility/i);
  });
});
