import { createY7OperationalReadinessGateReview } from "./y7-operational-readiness-gate-review";

describe("Y7E operational readiness gate review", () => {
  it("keeps operational gate closed and manual operations primary", () => {
    const result = createY7OperationalReadinessGateReview();
    expect(result.planningOnly).toBe(true);
    expect(result.operationalGatePassed).toBe(false);
    expect(result.manualOperationsRemainPrimary).toBe(true);
    expect(result.productionRolloutAllowed).toBe(false);
    expect(result.runtimeActivationAllowed).toBe(false);
  });

  it("blocks rollout, workers, operator bypass, storage, automation, and communication", () => {
    const result = createY7OperationalReadinessGateReview({ productionRolloutRequested: true, runtimeWorkerRequested: true, operatorBypassRequested: true, storageActivationRequested: true, automationRequested: true, communicationRequested: true });
    expect(result.status).toBe("operational_readiness_gate_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/production rollout remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime workers remain blocked/);
  });
});
