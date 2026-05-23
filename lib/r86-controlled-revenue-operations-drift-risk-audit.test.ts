import {
  classifyR86ControlledRevenueOperationsDangerousWording,
  createR86ControlledRevenueOperationsDriftRiskAudit,
  summarizeR86ControlledRevenueOperationsDriftRiskAudit,
} from "./r86-controlled-revenue-operations-drift-risk-audit";

const reviewedInput = {
  revenueSignalExecutionReviewed: true,
  revenuePriorityContactReviewed: true,
  throughputRuntimeReviewed: true,
  pipelineReviewAutomationReviewed: true,
  closingReadinessExecutionReviewed: true,
  assignmentReadinessOutreachReviewed: true,
  revenueDelayProviderReviewed: true,
  bottleneckScrapingReviewed: true,
  missingDataSkipTracingReviewed: true,
  highOpportunityLeadCreationReviewed: true,
  operatorGuidanceProviderReviewed: true,
  externalApiReviewed: true,
  fetchNetworkReviewed: true,
  persistenceReviewed: true,
  auditWritingReviewed: true,
  dangerousWordingReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R86B controlled revenue operations drift risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR86ControlledRevenueOperationsDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("revenue-signal-to-execution drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR86ControlledRevenueOperationsDriftRiskAudit(reviewedInput);
    expect(result.status).toBe("controlled_revenue_operations_drift_audit_clear");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("detects dangerous wording", () => {
    expect(classifyR86ControlledRevenueOperationsDangerousWording("execute revenue signal")).toBe("dangerous_wording_detected");
    expect(classifyR86ControlledRevenueOperationsDangerousWording("manual revenue review recommended")).toBe("wording_clear");
  });

  it("pressure-tests all required drift paths as blocked", () => {
    const result = createR86ControlledRevenueOperationsDriftRiskAudit({
      ...reviewedInput,
      executionRequested: true,
      contactRequested: true,
      runtimeRequested: true,
      automationRequested: true,
      outreachRequested: true,
      providerRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      leadCreationRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      dangerousWordingRequested: true,
    });
    expect(result.status).toBe("controlled_revenue_operations_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["revenue signals cannot execute", "revenue priority cannot trigger contact", "throughput scores cannot trigger runtime jobs", "fetch/network drift remains blocked"]));
  });

  it("preserves accessibility risk checks", () => {
    const result = createR86ControlledRevenueOperationsDriftRiskAudit(reviewedInput);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes drift boundaries", () => {
    const result = createR86ControlledRevenueOperationsDriftRiskAudit(reviewedInput);
    expect(summarizeR86ControlledRevenueOperationsDriftRiskAudit(result)).toMatch(/revenue signals, revenue priority/i);
  });
});
