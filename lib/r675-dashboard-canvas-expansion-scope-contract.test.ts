import {
  createR675DashboardCanvasExpansionScopeContract,
  summarizeR675DashboardCanvasExpansionScope,
} from "./r675-dashboard-canvas-expansion-scope-contract";

const readyInput = {
  conceptsReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
  governanceReviewed: true,
  canvasDoctrineReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R67.5A dashboard canvas expansion scope", () => {
  it("defaults to operator review required without authorizing execution", () => {
    const result = createR675DashboardCanvasExpansionScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.auditPersistenceAllowedNow).toBe(false);
    expect(result.missingReviewAreas).toContain("allowed canvas concepts");
  });

  it("smoke-tests ready canvas expansion doctrine", () => {
    const result = createR675DashboardCanvasExpansionScopeContract(readyInput);
    expect(result.status).toBe("canvas_expansion_scope_ready");
    expect(result.allowedConcepts).toContain("dashboard canvas expansion");
    expect(result.canvasDoctrine.join(" ")).toMatch(/without redesigning/i);
    expect(result.nextPhase).toBe("R67.5B - Dashboard Canvas / Layout Constraint Audit");
  });

  it("preserves inclusive accessibility requirements", () => {
    const result = createR675DashboardCanvasExpansionScopeContract(readyInput);
    expect(result.inclusiveAccessibility.supportedUsers).toEqual(
      expect.arrayContaining(["elderly users", "blind users", "low-vision users", "keyboard-only users"]),
    );
    expect(result.inclusiveAccessibility.requiredProtections).toEqual(
      expect.arrayContaining(["aria-labelledby", "aria-describedby", "no color-only meaning", "no polling"]),
    );
  });

  it("preserves audit-log-not-active boundary", () => {
    const result = createR675DashboardCanvasExpansionScopeContract(readyInput);
    expect(result.auditLogBoundary.auditLayerActive).toBe(false);
    expect(result.auditLogBoundary.auditPersistenceAuthorizedNow).toBe(false);
    expect(result.auditLogBoundary.allowedWording).toContain("audit layer not active yet");
  });

  it("pressure-tests forbidden redesign execution provider runtime polling persistence and audit writing", () => {
    const result = createR675DashboardCanvasExpansionScopeContract({
      ...readyInput,
      redesignRequested: true,
      logicChangeRequested: true,
      executionRequested: true,
      providerRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      automationRequested: true,
      auditPersistenceRequested: true,
      auditRecordWritingRequested: true,
    });
    expect(result.status).toBe("canvas_expansion_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "redesign is forbidden",
        "execution is forbidden",
        "provider activation is forbidden",
        "audit persistence is forbidden",
        "audit record writing is forbidden",
      ]),
    );
  });

  it("summarizes the scope safely", () => {
    const result = createR675DashboardCanvasExpansionScopeContract(readyInput);
    expect(summarizeR675DashboardCanvasExpansionScope(result)).toMatch(/audit layer not active yet/i);
  });
});
