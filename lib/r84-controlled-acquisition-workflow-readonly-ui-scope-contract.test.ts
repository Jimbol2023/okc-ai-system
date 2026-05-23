import {
  createR84ControlledAcquisitionWorkflowReadonlyUiScopeContract,
  summarizeR84ControlledAcquisitionWorkflowReadonlyUiScope,
} from "./r84-controlled-acquisition-workflow-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  workflowIntelligenceWordingReviewed: true,
  manualSequenceWordingReviewed: true,
  bottleneckWordingReviewed: true,
  stalledWorkflowWordingReviewed: true,
  throughputVisibilityWordingReviewed: true,
  manualReviewOnlyWordingReviewed: true,
  noExecutionWordingReviewed: true,
  noContactWordingReviewed: true,
  noProviderWordingReviewed: true,
  forbiddenControlsReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R84C controlled acquisition workflow readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR84ControlledAcquisitionWorkflowReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.authorizedSurfaces).toContain("components/dashboard/controlled-acquisition-workflow-intelligence-summary.tsx");
  });

  it("smoke-tests read-only UI scope readiness", () => {
    const result = createR84ControlledAcquisitionWorkflowReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("controlled_acquisition_workflow_ui_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.implementationAllowedNow).toBe(false);
  });

  it("keeps wording advisory and non-executing", () => {
    const result = createR84ControlledAcquisitionWorkflowReadonlyUiScopeContract(reviewedInput);
    expect(result.wording.manualSequence).toMatch(/do not automate work/i);
    expect(result.wording.bottleneck).toMatch(/does not activate providers/i);
    expect(result.wording.noExecution).toMatch(/No provider, contact, outreach, automation, or execution is authorized/i);
  });

  it("pressure-tests forbidden UI controls", () => {
    const result = createR84ControlledAcquisitionWorkflowReadonlyUiScopeContract({
      ...reviewedInput,
      buttonRequested: true,
      formRequested: true,
      inputRequested: true,
      clickHandlerRequested: true,
      executionControlRequested: true,
      outreachControlRequested: true,
      providerControlRequested: true,
      automationControlRequested: true,
      runtimeControlRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("controlled_acquisition_workflow_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["buttons remain forbidden", "click handlers remain forbidden", "provider controls remain forbidden", "audit writing remains blocked"]));
  });

  it("preserves accessibility requirements", () => {
    const result = createR84ControlledAcquisitionWorkflowReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes read-only scope", () => {
    const result = createR84ControlledAcquisitionWorkflowReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR84ControlledAcquisitionWorkflowReadonlyUiScope(result)).toMatch(/read-only advisory wording/i);
  });
});
