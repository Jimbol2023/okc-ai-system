import {
  classifyR85ManualAcquisitionCommandCenterDangerousWording,
  createR85ManualAcquisitionCommandCenterDriftRiskAudit,
  summarizeR85ManualAcquisitionCommandCenterDriftRiskAudit,
} from "./r85-manual-acquisition-command-center-drift-risk-audit";

const reviewedInput = {
  commandCenterExecutionReviewed: true,
  reviewPriorityContactReviewed: true,
  escalationProviderReviewed: true,
  workflowQueueRuntimeReviewed: true,
  bottleneckScrapingReviewed: true,
  missingDataSkipTracingReviewed: true,
  revenueVisibilityOutreachReviewed: true,
  acquisitionReviewAutomationReviewed: true,
  operatorCoordinationProviderReviewed: true,
  confidenceLeadCreationReviewed: true,
  externalApiReviewed: true,
  fetchNetworkReviewed: true,
  persistenceReviewed: true,
  auditWritingReviewed: true,
  dangerousWordingReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R85B manual acquisition command center drift risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR85ManualAcquisitionCommandCenterDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("command-center-to-execution drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR85ManualAcquisitionCommandCenterDriftRiskAudit(reviewedInput);
    expect(result.status).toBe("manual_acquisition_command_center_drift_audit_clear");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("detects dangerous wording", () => {
    expect(classifyR85ManualAcquisitionCommandCenterDangerousWording("execute command center")).toBe("dangerous_wording_detected");
    expect(classifyR85ManualAcquisitionCommandCenterDangerousWording("manual review recommended")).toBe("wording_clear");
  });

  it("pressure-tests all required drift paths as blocked", () => {
    const result = createR85ManualAcquisitionCommandCenterDriftRiskAudit({
      ...reviewedInput,
      executionRequested: true,
      contactRequested: true,
      providerRequested: true,
      runtimeRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      outreachRequested: true,
      automationRequested: true,
      leadCreationRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      dangerousWordingRequested: true,
    });
    expect(result.status).toBe("manual_acquisition_command_center_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["command center visibility cannot execute", "review priority cannot trigger contact", "escalation visibility cannot activate providers", "fetch/network drift remains blocked"]));
  });

  it("preserves accessibility risk checks", () => {
    const result = createR85ManualAcquisitionCommandCenterDriftRiskAudit(reviewedInput);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes drift boundaries", () => {
    const result = createR85ManualAcquisitionCommandCenterDriftRiskAudit(reviewedInput);
    expect(summarizeR85ManualAcquisitionCommandCenterDriftRiskAudit(result)).toMatch(/command center visibility, review priority/i);
  });
});
