import {
  createR71ControlledHumanOutreachReadonlyUiScopeContract,
  summarizeR71ControlledHumanOutreachReadonlyUiScope,
} from "./r71-controlled-human-outreach-readonly-ui-scope-contract";

const readyInput = {
  r71aReviewed: true,
  r71bReviewed: true,
  surfacesReviewed: true,
  safeCopyReviewed: true,
  accessibilityReviewed: true,
  governanceReviewed: true,
} as const;

describe("R71C controlled human outreach readonly UI scope", () => {
  it("defaults to operator review required", () => {
    const result = createR71ControlledHumanOutreachReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.uiImplementationAllowedNow).toBe(false);
  });

  it("smoke-tests future read-only outreach surface and copy", () => {
    const result = createR71ControlledHumanOutreachReadonlyUiScopeContract(readyInput);
    expect(result.status).toBe("controlled_outreach_ui_scope_ready");
    expect(result.authorizedSurfaces).toContain("components/dashboard/controlled-human-outreach-summary.tsx");
    expect(result.safeCopy).toContain("Contact is not authorized in this phase.");
  });

  it("pressure-tests forbidden UI controls and execution-like affordances", () => {
    const result = createR71ControlledHumanOutreachReadonlyUiScopeContract({
      ...readyInput,
      uiImplementationRequestedNow: true,
      buttonsRequested: true,
      formsInputsRequested: true,
      executionLinksRequested: true,
      sendControlsRequested: true,
      callControlsRequested: true,
      smsControlsRequested: true,
      emailControlsRequested: true,
      providerControlsRequested: true,
      approvalSendRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
    });
    expect(result.status).toBe("controlled_outreach_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["buttons are forbidden", "send controls are forbidden", "provider controls are forbidden", "approval-to-send controls are forbidden"]));
  });

  it("summarizes UI scope", () => {
    const result = createR71ControlledHumanOutreachReadonlyUiScopeContract(readyInput);
    expect(summarizeR71ControlledHumanOutreachReadonlyUiScope(result)).toMatch(/read-only preparation visibility/i);
  });
});
