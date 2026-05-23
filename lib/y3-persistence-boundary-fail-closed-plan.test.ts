import { createY3PersistenceBoundaryFailClosedPlan } from "./y3-persistence-boundary-fail-closed-plan";

describe("Y3C persistence boundary fail-closed plan", () => {
  it("keeps persistence fail-closed by default", () => {
    const result = createY3PersistenceBoundaryFailClosedPlan();
    expect(result.writeDisabledByDefault).toBe(true);
    expect(result.explicitFutureEnablementRequired).toBe(true);
    expect(result.persistenceAllowedNow).toBe(false);
    expect(result.persistenceWritten).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("preserves provider isolation and approval/execution separation", () => {
    const result = createY3PersistenceBoundaryFailClosedPlan();
    expect(result.providerCalled).toBe(false);
    expect(result.runtimeActivationAllowed).toBe(false);
    expect(result.approvalGrantsExecution).toBe(false);
    expect(result.providerCouplingAllowed).toBe(false);
    expect(result.executionCouplingAllowed).toBe(false);
    expect(result.approvalAsExecutionAllowed).toBe(false);
  });

  it("blocks persistence enablement, coupling, runtime, and provider requests", () => {
    const result = createY3PersistenceBoundaryFailClosedPlan({ persistenceEnablementRequested: true, dbWriteRequested: true, auditWriteRequested: true, providerCouplingRequested: true, executionCouplingRequested: true, approvalAsExecutionRequested: true, runtimeRequested: true, providerRequested: true });
    expect(result.status).toBe("persistence_boundary_fail_closed_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/persistence enablement remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider coupling remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/approval-as-execution remains blocked/);
  });
});
