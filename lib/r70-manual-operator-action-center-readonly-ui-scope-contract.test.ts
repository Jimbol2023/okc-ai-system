import {
  createR70ManualOperatorActionCenterReadonlyUiScopeContract,
  summarizeR70ManualOperatorActionCenterReadonlyUiScope,
} from "./r70-manual-operator-action-center-readonly-ui-scope-contract";

const readyInput = {
  r70aReviewed: true,
  r70bReviewed: true,
  surfacesReviewed: true,
  sectionsReviewed: true,
  safeCopyReviewed: true,
  accessibilityReviewed: true,
  governanceReviewed: true,
} as const;

describe("R70C manual operator action center readonly UI scope", () => {
  it("defaults to operator review required", () => {
    const result = createR70ManualOperatorActionCenterReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.uiImplementationAllowedNow).toBe(false);
  });

  it("smoke-tests future read-only surface and copy", () => {
    const result = createR70ManualOperatorActionCenterReadonlyUiScopeContract(readyInput);
    expect(result.status).toBe("manual_action_center_ui_scope_ready");
    expect(result.authorizedSurfaces).toContain("components/dashboard/manual-operator-action-center-summary.tsx");
    expect(result.safeCopy).toContain("Recommendations do not execute.");
  });

  it("pressure-tests UI execution and provider blockers", () => {
    const result = createR70ManualOperatorActionCenterReadonlyUiScopeContract({
      ...readyInput,
      uiImplementationRequestedNow: true,
      buttonsRequested: true,
      controlsRequested: true,
      formsRequested: true,
      sendRequested: true,
      providerRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("manual_action_center_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["buttons are forbidden", "forms are forbidden", "provider controls are forbidden", "audit writing is forbidden"]));
  });

  it("summarizes scope boundaries", () => {
    const result = createR70ManualOperatorActionCenterReadonlyUiScopeContract(readyInput);
    expect(summarizeR70ManualOperatorActionCenterReadonlyUiScope(result)).toMatch(/read-only advisory visibility/i);
  });
});
