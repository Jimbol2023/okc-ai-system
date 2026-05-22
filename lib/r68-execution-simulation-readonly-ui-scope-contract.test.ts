import {
  createR68ExecutionSimulationReadonlyUiScopeContract,
  summarizeR68ExecutionSimulationReadonlyUiScope,
} from "./r68-execution-simulation-readonly-ui-scope-contract";

const readyInput = {
  r68aReviewed: true,
  r68bReviewed: true,
  surfacesReviewed: true,
  safeCopyReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R68C execution simulation readonly UI scope", () => {
  it("defaults to operator review required", () => {
    const result = createR68ExecutionSimulationReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.uiImplementationAllowedNow).toBe(false);
  });

  it("smoke-tests authorized read-only surface and safe copy", () => {
    const result = createR68ExecutionSimulationReadonlyUiScopeContract(readyInput);
    expect(result.status).toBe("readonly_ui_scope_ready");
    expect(result.authorizedSurfaces).toContain("components/dashboard/execution-simulation-intelligence-summary.tsx");
    expect(result.safeCopy).toContain("Audit layer not active yet.");
  });

  it("pressure-tests controls activation persistence and audit writing blockers", () => {
    const result = createR68ExecutionSimulationReadonlyUiScopeContract({
      ...readyInput,
      uiImplementationRequestedNow: true,
      buttonsRequested: true,
      controlsRequested: true,
      sendRequested: true,
      providerRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      approvalExecutionRequested: true,
    });
    expect(result.status).toBe("readonly_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["buttons are forbidden", "audit writing is forbidden"]));
  });

  it("summarizes UI scope", () => {
    const result = createR68ExecutionSimulationReadonlyUiScopeContract(readyInput);
    expect(summarizeR68ExecutionSimulationReadonlyUiScope(result)).toMatch(/read-only simulation visibility/i);
  });
});
