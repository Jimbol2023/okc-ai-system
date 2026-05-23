import { createY9NextPhaseReadinessReview } from "./y9-next-phase-readiness-review";

describe("Y9E next phase readiness review", () => {
  it("recommends Y10 as planning-only while keeping manual operations primary", () => {
    const result = createY9NextPhaseReadinessReview();
    expect(result.planningOnly).toBe(true);
    expect(result.nextPhaseRecommended).toBe("Y10 - Schema Implementation Authorization Decision Plan");
    expect(result.nextPhasePlanningOnly).toBe(true);
    expect(result.manualOperationsRemainPrimary).toBe(true);
  });

  it("blocks implementation and activation requests", () => {
    const result = createY9NextPhaseReadinessReview({ implementationRequested: true, schemaEditRequested: true, migrationRequested: true, storageRequested: true, runtimeRequested: true, providerRequested: true });
    expect(result.status).toBe("next_phase_readiness_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/implementation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
  });
});
