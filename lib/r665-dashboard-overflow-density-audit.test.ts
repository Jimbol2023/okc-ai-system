import {
  createR665DashboardOverflowDensityAudit,
  r665AccessibilityAuditRules,
  r665DashboardAuditTargetFiles,
  r665DensityRiskCategories,
  r665ForbiddenCleanupActions,
  r665ForbiddenSemantics,
  r665OverflowRiskCategories,
  r665SafeFutureCleanupActions,
  summarizeR665DashboardOverflowDensityAudit,
} from "./r665-dashboard-overflow-density-audit";

const completeAuditInput = {
  dashboardComponentsReviewed: true,
  dashboardPageReviewed: true,
  overflowRisksReviewed: true,
  densityRisksReviewed: true,
  accessibilityRisksReviewed: true,
  governanceRisksReviewed: true,
} as const;

describe("R66.5B dashboard overflow density audit", () => {
  it("defaults to operator review required while preserving safety flags", () => {
    const audit = createR665DashboardOverflowDensityAudit();

    expect(audit.status).toBe("operator_review_required");
    expect(audit.flags).toMatchObject({
      readOnly: true,
      advisoryOnly: true,
      simulationOnly: true,
      providerCalled: false,
      sent: false,
      persistenceAllowedNow: false,
      pollingAllowed: false,
      runtimeActivationAllowed: false,
      providerActivationAllowed: false,
      approvalGrantsExecution: false,
      uiImplementationAllowedNow: false,
    });
    expect(audit.missingReviewAreas).toContain("dashboard intelligence components");
  });

  it("documents the complete audit surface without authorizing UI implementation", () => {
    const audit = createR665DashboardOverflowDensityAudit(completeAuditInput);

    expect(audit.status).toBe("dashboard_overflow_density_audit_complete");
    expect(audit.targetFiles).toEqual(r665DashboardAuditTargetFiles);
    expect(audit.targetFiles).toContain("app/(dashboard)/dashboard/page.tsx");
    expect(audit.overflowRiskCategories).toEqual(r665OverflowRiskCategories);
    expect(audit.overflowRiskCategories).toContain("long advisory text");
    expect(audit.densityRiskCategories).toEqual(r665DensityRiskCategories);
    expect(audit.densityRiskCategories).toContain("narrow card columns");
    expect(audit.safeFutureCleanupActions).toEqual(r665SafeFutureCleanupActions);
    expect(audit.safeFutureCleanupActions).toContain("min-w-0");
    expect(audit.flags.uiImplementationAllowedNow).toBe(false);
    expect(audit.nextPhase).toBe(
      "R66.5C - Readability Implementation Scope Contract",
    );
  });

  it("blocks forbidden cleanup actions and execution semantics", () => {
    const audit = createR665DashboardOverflowDensityAudit({
      ...completeAuditInput,
      uiImplementationRequested: true,
      redesignRequested: true,
      logicChangeRequested: true,
      providerActivationRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      runtimeActivationRequested: true,
      executionControlRequested: true,
      campaignRequested: true,
      automationRequested: true,
      hiddenButtonRequested: true,
    });

    expect(audit.status).toBe("dashboard_audit_blocked");
    expect(audit.forbiddenCleanupActions).toEqual(r665ForbiddenCleanupActions);
    expect(audit.forbiddenCleanupActions).toContain("redesign");
    expect(audit.forbiddenCleanupActions).toContain("adding buttons");
    expect(audit.forbiddenSemantics).toEqual(r665ForbiddenSemantics);
    expect(audit.forbiddenSemantics).toEqual(
      expect.arrayContaining([
        "execute",
        "send",
        "activate provider",
        "poll",
        "runtime activation",
        "background job",
      ]),
    );
    expect(audit.blockedReasons.length).toBeGreaterThanOrEqual(10);
  });

  it("blocks governance and accessibility regressions", () => {
    const audit = createR665DashboardOverflowDensityAudit({
      ...completeAuditInput,
      governanceMeaningChangeRequested: true,
      safetyCopyRemovalRequested: true,
      colorOnlyMeaningRequested: true,
      motionDependencyRequested: true,
      focusMovementRequested: true,
      autoRefreshRequested: true,
    });

    expect(audit.status).toBe("dashboard_audit_blocked");
    expect(audit.blockedReasons).toEqual(
      expect.arrayContaining([
        "governance meaning changes are forbidden",
        "safety copy removal is forbidden",
        "color-only status meaning is forbidden",
        "motion-dependent meaning is forbidden",
        "automatic focus movement is forbidden",
        "auto-refresh is forbidden",
      ]),
    );
    expect(audit.accessibilityAuditRules).toEqual(r665AccessibilityAuditRules);
    expect(audit.accessibilityAuditRules).toContain("semantic sections preserved");
    expect(audit.accessibilityAuditRules).toContain("no color-only meaning");
    expect(audit.accessibilityAuditRules).toContain("no polling");
  });

  it("summarizes the complete audit as planning-only for R66.5C", () => {
    const audit = createR665DashboardOverflowDensityAudit(completeAuditInput);

    expect(summarizeR665DashboardOverflowDensityAudit(audit)).toBe(
      "R66.5B audit complete: dashboard overflow, density, governance, and accessibility risks are documented for R66.5C scope planning only.",
    );
  });
});
