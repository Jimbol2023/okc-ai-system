import {
  createR86ControlledRevenueOperationsReadonlyUiScopeContract,
  summarizeR86ControlledRevenueOperationsReadonlyUiScope,
} from "./r86-controlled-revenue-operations-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  revenueOperationsWordingReviewed: true,
  throughputWordingReviewed: true,
  pipelineOptimizationWordingReviewed: true,
  revenueDelayWordingReviewed: true,
  assignmentReadinessWordingReviewed: true,
  closingReadinessWordingReviewed: true,
  operatorCoordinationWordingReviewed: true,
  manualReviewWordingReviewed: true,
  governanceWordingReviewed: true,
  noExecutionWordingReviewed: true,
  noProviderWordingReviewed: true,
  noContactWordingReviewed: true,
  forbiddenControlsReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R86C controlled revenue operations readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR86ControlledRevenueOperationsReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.authorizedSurfaces).toContain("components/dashboard/controlled-revenue-operations-summary.tsx");
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR86ControlledRevenueOperationsReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("controlled_revenue_operations_ui_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.implementationAllowedNow).toBe(false);
  });

  it("keeps wording advisory and non-executing", () => {
    const result = createR86ControlledRevenueOperationsReadonlyUiScopeContract(reviewedInput);
    expect(result.wording.revenueOperations).toMatch(/advisory visibility only/i);
    expect(result.wording.noExecution).toMatch(/No execution is authorized/i);
    expect(result.wording.noProvider).toMatch(/No provider activation permitted/i);
  });

  it("pressure-tests forbidden UI controls", () => {
    const result = createR86ControlledRevenueOperationsReadonlyUiScopeContract({
      ...reviewedInput,
      buttonRequested: true,
      formRequested: true,
      inputRequested: true,
      linkRequested: true,
      clickHandlerRequested: true,
      executionControlRequested: true,
      providerControlRequested: true,
      outreachControlRequested: true,
      automationControlRequested: true,
      runtimeControlRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("controlled_revenue_operations_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["buttons remain forbidden", "links remain forbidden", "provider controls remain forbidden", "audit writing remains blocked"]));
  });

  it("preserves accessibility requirements", () => {
    const result = createR86ControlledRevenueOperationsReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes read-only scope", () => {
    const result = createR86ControlledRevenueOperationsReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR86ControlledRevenueOperationsReadonlyUiScope(result)).toMatch(/read-only advisory wording/i);
  });
});
