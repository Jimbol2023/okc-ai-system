import { createY5OperationalRolloutBlockerReview } from "./y5-operational-rollout-blocker-review";

describe("Y5E operational rollout blocker review", () => {
  it("keeps rollout and activation blocked while preserving manual operations", () => {
    const result = createY5OperationalRolloutBlockerReview();
    expect(result.planningOnly).toBe(true);
    expect(result.productionRolloutAllowed).toBe(false);
    expect(result.runtimeActivationAllowed).toBe(false);
    expect(result.providerActivationAllowed).toBe(false);
    expect(result.storageAuthorized).toBe(false);
    expect(result.manualOperationsRemainPrimary).toBe(true);
  });

  it("blocks production rollout, runtime, provider, storage, audit writing, automation, and communication", () => {
    const result = createY5OperationalRolloutBlockerReview({ productionRolloutRequested: true, runtimeRequested: true, providerRequested: true, storageActivationRequested: true, auditWritingRequested: true, automationRequested: true, communicationRequested: true });
    expect(result.status).toBe("operational_rollout_blocker_review_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/production rollout remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/storage activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/communication activation remains blocked/);
  });
});
