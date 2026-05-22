import {
  createR69ProviderIsolationReadonlyUiScopeContract,
  summarizeR69ProviderIsolationReadonlyUiScope,
} from "./r69-provider-isolation-readonly-ui-scope-contract";

const readyInput = {
  r69aReviewed: true,
  r69bReviewed: true,
  surfacesReviewed: true,
  safeCopyReviewed: true,
  forbiddenSurfacesReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R69C provider isolation readonly UI scope", () => {
  it("defaults to operator review required", () => {
    const result = createR69ProviderIsolationReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.uiImplementationAllowedNow).toBe(false);
  });

  it("smoke-tests authorized read-only surface and safe copy", () => {
    const result = createR69ProviderIsolationReadonlyUiScopeContract(readyInput);
    expect(result.status).toBe("provider_readonly_ui_scope_ready");
    expect(result.authorizedSurfaces).toContain("components/dashboard/provider-isolation-safety-summary.tsx");
    expect(result.safeCopy).toContain("No fetch/network call is created.");
  });

  it("pressure-tests controls provider credential env fetch and audit blockers", () => {
    const result = createR69ProviderIsolationReadonlyUiScopeContract({
      ...readyInput,
      uiImplementationRequestedNow: true,
      buttonsRequested: true,
      executionControlsRequested: true,
      providerControlsRequested: true,
      sendActionsRequested: true,
      approvalProviderRequested: true,
      credentialEnvRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("provider_readonly_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "buttons are forbidden",
        "provider controls are forbidden",
        "credential/env reads are forbidden",
        "fetch/network calls are forbidden",
        "audit writing is forbidden",
      ]),
    );
  });

  it("summarizes UI scope", () => {
    const result = createR69ProviderIsolationReadonlyUiScopeContract(readyInput);
    expect(summarizeR69ProviderIsolationReadonlyUiScope(result)).toMatch(/read-only visibility/i);
  });
});
