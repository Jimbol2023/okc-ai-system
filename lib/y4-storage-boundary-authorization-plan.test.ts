import { createY4StorageBoundaryAuthorizationPlan } from "./y4-storage-boundary-authorization-plan";

describe("Y4B storage boundary authorization plan", () => {
  it("requires storage gates while keeping storage unauthorized", () => {
    const result = createY4StorageBoundaryAuthorizationPlan();
    expect(result.planningOnly).toBe(true);
    expect(result.gatesRequired).toContain("governance review");
    expect(result.gatesRequired).toContain("failure handling");
    expect(result.storageAuthorized).toBe(false);
    expect(result.persistenceAllowedNow).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("blocks unsafe storage write modes", () => {
    const result = createY4StorageBoundaryAuthorizationPlan({ implicitWriteRequested: true, approvalAsWriteRequested: true, providerCoupledWriteRequested: true, runtimeTriggeredWriteRequested: true });
    expect(result.status).toBe("storage_boundary_authorization_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/implicit writes remain blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider-coupled writes remain blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime-triggered writes remain blocked/);
  });
});
