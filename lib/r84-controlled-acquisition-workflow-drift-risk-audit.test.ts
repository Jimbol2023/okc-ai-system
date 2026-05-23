import {
  classifyR84ControlledAcquisitionWorkflowDangerousWording,
  createR84ControlledAcquisitionWorkflowDriftRiskAudit,
  summarizeR84ControlledAcquisitionWorkflowDriftRiskAudit,
} from "./r84-controlled-acquisition-workflow-drift-risk-audit";

const reviewedInput = {
  workflowGuidanceExecutionReviewed: true,
  manualNextStepAutomationReviewed: true,
  callPriorityDialingReviewed: true,
  reviewNeededContactReviewed: true,
  bottleneckProviderReviewed: true,
  stalledLeadScrapingReviewed: true,
  missingDataSkipTracingReviewed: true,
  buyerReadinessOutreachReviewed: true,
  closingReadinessExecutionReviewed: true,
  throughputRuntimeReviewed: true,
  operatorSequenceJobQueueReviewed: true,
  confidenceLeadCreationReviewed: true,
  externalApiReviewed: true,
  fetchNetworkReviewed: true,
  persistenceReviewed: true,
  auditWritingReviewed: true,
  dangerousWordingReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R84B controlled acquisition workflow drift risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR84ControlledAcquisitionWorkflowDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("workflow-guidance-to-execution drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR84ControlledAcquisitionWorkflowDriftRiskAudit(reviewedInput);
    expect(result.status).toBe("controlled_acquisition_workflow_drift_audit_clear");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("detects dangerous wording", () => {
    expect(classifyR84ControlledAcquisitionWorkflowDangerousWording("execute workflow guidance")).toBe("dangerous_wording_detected");
    expect(classifyR84ControlledAcquisitionWorkflowDangerousWording("manual review recommended")).toBe("wording_clear");
  });

  it("pressure-tests all required drift paths as blocked", () => {
    const result = createR84ControlledAcquisitionWorkflowDriftRiskAudit({
      ...reviewedInput,
      executionRequested: true,
      automationRequested: true,
      dialingRequested: true,
      contactRequested: true,
      providerRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      outreachRequested: true,
      runtimeRequested: true,
      jobQueueRequested: true,
      leadCreationRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      dangerousWordingRequested: true,
    });
    expect(result.status).toBe("controlled_acquisition_workflow_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["workflow guidance cannot execute", "call priority cannot dial", "bottlenecks cannot activate providers", "fetch/network drift remains blocked"]));
  });

  it("preserves accessibility risk checks", () => {
    const result = createR84ControlledAcquisitionWorkflowDriftRiskAudit(reviewedInput);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes drift boundaries", () => {
    const result = createR84ControlledAcquisitionWorkflowDriftRiskAudit(reviewedInput);
    expect(summarizeR84ControlledAcquisitionWorkflowDriftRiskAudit(result)).toMatch(/workflow guidance, manual next steps/i);
  });
});
