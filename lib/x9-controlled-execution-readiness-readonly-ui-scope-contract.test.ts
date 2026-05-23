import { createX9ControlledExecutionReadinessReadonlyUiScopeContract, x9ReadonlyUiAuthorizedSurfaces, x9ReadonlyUiWording } from "./x9-controlled-execution-readiness-readonly-ui-scope-contract";

describe("X9D controlled execution readiness read-only UI scope contract", () => {
  it("defines authorized read-only execution readiness surfaces and wording", () => {
    const result = createX9ControlledExecutionReadinessReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(x9ReadonlyUiAuthorizedSurfaces).toContain("components/dashboard/controlled-execution-readiness-operations-summary.tsx");
    expect(x9ReadonlyUiWording.noActivation).toMatch(/does not authorize activation/);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
  });

  it("blocks controls and side-effect behavior", () => {
    const result = createX9ControlledExecutionReadinessReadonlyUiScopeContract({ activationControlRequested: true, executionControlRequested: true, fetchNetworkRequested: true });
    expect(result.status).toBe("x9_ui_scope_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/activation controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/execution controls remain forbidden/);
    expect(result.blockedReasons.join(" ")).toMatch(/fetch\/network remains blocked/);
  });
});
