import {
  createR67AutomationDriftPermissionRiskAudit,
  summarizeR67AutomationDriftPermissionRiskAudit,
} from "./r67-automation-drift-permission-risk-audit";

const completeInput = {
  intelligenceSurfacesReviewed: true,
  approvalSurfacesReviewed: true,
  readinessSurfacesReviewed: true,
  queueSurfacesReviewed: true,
  urgencyRevenueSurfacesReviewed: true,
  providerRuntimePollingRisksReviewed: true,
  dangerousWordingReviewed: true,
  failClosedReviewed: true,
} as const;

describe("R67B automation drift permission risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR67AutomationDriftPermissionRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.automationAllowedNow).toBe(false);
    expect(result.missingReviewAreas).toContain("intelligence surfaces");
  });

  it("passes smoke audit when all review areas are complete", () => {
    const result = createR67AutomationDriftPermissionRiskAudit(completeInput);
    expect(result.status).toBe("automation_drift_audit_complete");
    expect(result.riskCategories).toContain("approval-to-execution drift");
    expect(result.dangerousWordingPatterns).toContain("queue triggers workflow");
    expect(result.nextPhase).toBe("R67C - Automation-Last Read-Only UI Scope Contract");
  });

  it("pressure-tests all permission drift paths as blocked", () => {
    const result = createR67AutomationDriftPermissionRiskAudit({
      ...completeInput,
      approvalToExecutionRequested: true,
      readinessToExecutionRequested: true,
      queueToExecutionRequested: true,
      urgencyToExecutionRequested: true,
      scoreToExecutionRequested: true,
      revenueToExecutionRequested: true,
    });
    expect(result.status).toBe("automation_drift_audit_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "approval-to-execution drift is forbidden",
        "readiness-to-execution drift is forbidden",
        "queue-to-execution drift is forbidden",
        "urgency-to-execution drift is forbidden",
        "score-to-execution drift is forbidden",
        "revenue-to-execution drift is forbidden",
      ]),
    );
  });

  it("blocks provider runtime polling campaign automation and hidden control drift", () => {
    const result = createR67AutomationDriftPermissionRiskAudit({
      ...completeInput,
      automationPathRequested: true,
      providerActivationRequested: true,
      runtimeActivationRequested: true,
      pollingRequested: true,
      campaignRequested: true,
      hiddenExecutionAffordanceRequested: true,
    });
    expect(result.status).toBe("automation_drift_audit_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "automation path creation is forbidden",
        "provider activation drift is forbidden",
        "runtime activation drift is forbidden",
        "polling drift is forbidden",
        "campaign drift is forbidden",
        "hidden execution affordance drift is forbidden",
      ]),
    );
  });

  it("summarizes drift audit boundaries", () => {
    const result = createR67AutomationDriftPermissionRiskAudit(completeInput);
    expect(summarizeR67AutomationDriftPermissionRiskAudit(result)).toMatch(/signal-to-execution drift remain blocked/i);
  });
});
