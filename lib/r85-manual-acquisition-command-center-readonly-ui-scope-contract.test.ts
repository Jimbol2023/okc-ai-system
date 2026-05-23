import {
  createR85ManualAcquisitionCommandCenterReadonlyUiScopeContract,
  summarizeR85ManualAcquisitionCommandCenterReadonlyUiScope,
} from "./r85-manual-acquisition-command-center-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  operatorReviewWordingReviewed: true,
  commandCenterWordingReviewed: true,
  bottleneckWordingReviewed: true,
  escalationWordingReviewed: true,
  acquisitionReviewWordingReviewed: true,
  revenueDelayWordingReviewed: true,
  manualReviewWordingReviewed: true,
  governanceWordingReviewed: true,
  noExecutionWordingReviewed: true,
  noProviderWordingReviewed: true,
  noContactWordingReviewed: true,
  forbiddenControlsReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R85C manual acquisition command center readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR85ManualAcquisitionCommandCenterReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.authorizedSurfaces).toContain("components/dashboard/manual-acquisition-command-center-summary.tsx");
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR85ManualAcquisitionCommandCenterReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("manual_acquisition_command_center_ui_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.implementationAllowedNow).toBe(false);
  });

  it("keeps wording advisory and non-executing", () => {
    const result = createR85ManualAcquisitionCommandCenterReadonlyUiScopeContract(reviewedInput);
    expect(result.wording.commandCenter).toMatch(/advisory only/i);
    expect(result.wording.noExecution).toMatch(/No execution is authorized/i);
    expect(result.wording.noProvider).toMatch(/No provider activation permitted/i);
  });

  it("pressure-tests forbidden UI controls", () => {
    const result = createR85ManualAcquisitionCommandCenterReadonlyUiScopeContract({
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
    expect(result.status).toBe("manual_acquisition_command_center_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["buttons remain forbidden", "links remain forbidden", "provider controls remain forbidden", "audit writing remains blocked"]));
  });

  it("preserves accessibility requirements", () => {
    const result = createR85ManualAcquisitionCommandCenterReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes read-only scope", () => {
    const result = createR85ManualAcquisitionCommandCenterReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR85ManualAcquisitionCommandCenterReadonlyUiScope(result)).toMatch(/read-only advisory wording/i);
  });
});
