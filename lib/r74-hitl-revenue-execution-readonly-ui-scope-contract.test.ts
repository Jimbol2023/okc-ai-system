import {
  createR74HitlRevenueExecutionReadonlyUiScopeContract,
  summarizeR74HitlRevenueExecutionReadonlyUiScope,
} from "./r74-hitl-revenue-execution-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  safeCopyReviewed: true,
  forbiddenSurfacesReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R74C HITL revenue execution readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR74HitlRevenueExecutionReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.implementationAllowedNow).toBe(false);
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR74HitlRevenueExecutionReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("hitl_ui_scope_ready");
    expect(result.authorizedSurfaces).toContain("components/dashboard/hitl-revenue-execution-summary.tsx");
    expect(result.safeCopy).toContain("Human accountability remains required.");
  });

  it("pressure-tests forbidden UI affordances as blocked", () => {
    const result = createR74HitlRevenueExecutionReadonlyUiScopeContract({
      ...reviewedInput,
      implementationRequestedNow: true,
      buttonRequested: true,
      providerControlRequested: true,
      activationControlRequested: true,
      sendControlRequested: true,
      approvalExecutionControlRequested: true,
      workflowControlRequested: true,
      formRequested: true,
      inputRequested: true,
      executionLinkRequested: true,
      fetchNetworkRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      persistenceRequested: true,
    });
    expect(result.status).toBe("hitl_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["approval execution controls remain forbidden", "workflow controls remain forbidden", "links implying execution remain forbidden", "fetch/network remains blocked"]));
  });

  it("summarizes HITL UI scope", () => {
    const result = createR74HitlRevenueExecutionReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR74HitlRevenueExecutionReadonlyUiScope(result)).toMatch(/read-only accountability/i);
  });
});
