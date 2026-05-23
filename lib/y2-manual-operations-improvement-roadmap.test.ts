import { createY2ManualOperationsImprovementRoadmap } from "./y2-manual-operations-improvement-roadmap";

describe("Y2E manual operations improvement roadmap", () => {
  it("creates a roadmap without activation permissions", () => {
    const result = createY2ManualOperationsImprovementRoadmap();
    expect(result.optimizationRoadmapOnly).toBe(true);
    expect(result.providerActivationAllowed).toBe(false);
    expect(result.executionAllowed).toBe(false);
    expect(result.persistenceAllowed).toBe(false);
  });

  it("blocks provider, execution, runtime, persistence, and automation requests", () => {
    const result = createY2ManualOperationsImprovementRoadmap({ providerActivationRequested: true, executionRequested: true, runtimeRequested: true, persistenceRequested: true, automationRequested: true });
    expect(result.status).toBe("roadmap_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/provider activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/automation remains blocked/);
  });
});
