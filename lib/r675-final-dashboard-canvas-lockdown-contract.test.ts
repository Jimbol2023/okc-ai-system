import {
  createR675FinalDashboardCanvasLockdownContract,
  summarizeR675FinalDashboardCanvasLockdown,
} from "./r675-final-dashboard-canvas-lockdown-contract";

const lockedInput = {
  r675aReviewed: true,
  r675bReviewed: true,
  r675cReviewed: true,
  r675dReviewed: true,
  r675eReviewed: true,
  standardsReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R67.5F final dashboard canvas lockdown", () => {
  it("defaults to operator review required", () => {
    const result = createR675FinalDashboardCanvasLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.canvasStandardsLocked).toBe(true);
    expect(result.missingReviewAreas).toContain("R67.5A");
  });

  it("smoke-tests final canvas lockdown standards", () => {
    const result = createR675FinalDashboardCanvasLockdownContract(lockedInput);
    expect(result.status).toBe("final_canvas_lockdown_enforced");
    expect(result.standards.join(" ")).toMatch(/large operational displays/i);
    expect(result.standards.join(" ")).toMatch(/Inclusive accessibility standards/i);
    expect(result.nextPhase).toBe("R68A - Execution Simulation Intelligence Scope Contract");
  });

  it("pressure-tests all forbidden drift categories", () => {
    const result = createR675FinalDashboardCanvasLockdownContract({
      ...lockedInput,
      executionRequested: true,
      providerRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      automationRequested: true,
      routeApiRequested: true,
      prismaRequested: true,
      auditWritingRequested: true,
      governanceWeakeningRequested: true,
    });
    expect(result.status).toBe("final_canvas_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "execution remains forbidden",
        "provider activation remains forbidden",
        "runtime activation remains forbidden",
        "audit writing remains forbidden",
        "governance weakening remains forbidden",
      ]),
    );
  });

  it("summarizes the final canvas lockdown", () => {
    const result = createR675FinalDashboardCanvasLockdownContract(lockedInput);
    expect(summarizeR675FinalDashboardCanvasLockdown(result)).toMatch(/audit layer not active yet/i);
  });
});
