import {
  createR675DashboardCanvasLayoutConstraintAudit,
  summarizeR675DashboardCanvasLayoutConstraintAudit,
} from "./r675-dashboard-canvas-layout-constraint-audit";

const completeInput = {
  globalContainerReviewed: true,
  dashboardLayoutReviewed: true,
  dashboardPageReviewed: true,
  gridCompressionReviewed: true,
  inclusiveAccessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R67.5B dashboard canvas layout constraint audit", () => {
  it("defaults to operator review required without UI authorization", () => {
    const result = createR675DashboardCanvasLayoutConstraintAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.uiImplementationAllowedNow).toBe(false);
    expect(result.missingReviewAreas).toContain("global container-shell");
  });

  it("documents actual canvas bottlenecks", () => {
    const result = createR675DashboardCanvasLayoutConstraintAudit(completeInput);
    expect(result.status).toBe("layout_constraint_audit_complete");
    expect(result.observedConstraints).toContain("global container-shell max-width is 1200px");
    expect(result.observedConstraints).toContain("dashboard grid reserves 260px for sidebar before main content");
    expect(result.densityRisks).toContain("unused horizontal space outside main dashboard canvas");
  });

  it("preserves inclusive accessibility and audit boundary recommendations", () => {
    const result = createR675DashboardCanvasLayoutConstraintAudit(completeInput);
    expect(result.recommendations.join(" ")).toMatch(/governance warnings visible/i);
    expect(result.recommendations.join(" ")).toMatch(/audit layer is not active yet/i);
  });

  it("pressure-tests forbidden implementation and activation requests", () => {
    const result = createR675DashboardCanvasLayoutConstraintAudit({
      ...completeInput,
      uiChangeRequestedNow: true,
      redesignRequested: true,
      logicChangeRequested: true,
      routeChangeRequested: true,
      providerRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("layout_constraint_audit_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining(["R67.5B is audit-only and cannot implement UI changes", "audit writing is forbidden"]),
    );
  });

  it("summarizes audit-only findings", () => {
    const result = createR675DashboardCanvasLayoutConstraintAudit(completeInput);
    expect(summarizeR675DashboardCanvasLayoutConstraintAudit(result)).toMatch(/without authorizing UI changes/i);
  });
});
