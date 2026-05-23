import { createX2LiveManualLeadOperationsReadonlyUiScopeContract, x2ReadonlyUiAuthorizedSurfaces, x2ReadonlyUiWording } from "./x2-live-manual-lead-operations-readonly-ui-scope-contract";

describe("X2D live manual lead operations read-only UI scope contract", () => {
  it("defines authorized read-only surfaces and safe wording", () => {
    const result = createX2LiveManualLeadOperationsReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(x2ReadonlyUiAuthorizedSurfaces).toContain("components/dashboard/live-manual-lead-operations-summary.tsx");
    expect(x2ReadonlyUiWording.noExecution).toMatch(/No execution/);
    expect(result.flags.providerCalled).toBe(false);
  });

  it("blocks UI controls and side-effect requests", () => {
    const result = createX2LiveManualLeadOperationsReadonlyUiScopeContract({ buttonRequested: true, clickHandlerRequested: true, fetchNetworkRequested: true });
    expect(result.status).toBe("x2_ui_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/buttons remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/click handlers remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/fetch\/network remains blocked/);
  });
});
