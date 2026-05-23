import {
  classifyR87ManualRevenueCommandCenterDangerousWording,
  createR87ManualRevenueCommandCenterDriftRiskAudit,
  summarizeR87ManualRevenueCommandCenterDriftRiskAudit,
} from "./r87-manual-revenue-command-center-drift-risk-audit";

const reviewedInput = {
  revenueCommandExecutionReviewed: true,
  executiveReviewProviderReviewed: true,
  revenuePriorityContactReviewed: true,
  throughputReviewRuntimeReviewed: true,
  bottleneckScrapingReviewed: true,
  missingDataSkipTracingReviewed: true,
  revenueVisibilityOutreachReviewed: true,
  operatorGuidanceAutomationReviewed: true,
  assignmentReviewBuyerContactReviewed: true,
  closingReviewExecutionReviewed: true,
  confidenceLeadCreationReviewed: true,
  externalApiReviewed: true,
  fetchNetworkReviewed: true,
  persistenceReviewed: true,
  auditWritingReviewed: true,
  dangerousWordingReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R87B manual revenue command center drift risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR87ManualRevenueCommandCenterDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("revenue-command-to-execution drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR87ManualRevenueCommandCenterDriftRiskAudit(reviewedInput);
    expect(result.status).toBe("manual_revenue_command_center_drift_audit_clear");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("detects dangerous wording", () => {
    expect(classifyR87ManualRevenueCommandCenterDangerousWording("execute revenue command")).toBe("dangerous_wording_detected");
    expect(classifyR87ManualRevenueCommandCenterDangerousWording("manual revenue review recommended")).toBe("wording_clear");
  });

  it("pressure-tests all required drift paths as blocked", () => {
    const result = createR87ManualRevenueCommandCenterDriftRiskAudit({
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
    expect(result.status).toBe("manual_revenue_command_center_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["revenue command visibility cannot execute", "revenue priority cannot trigger contact", "throughput review cannot trigger runtime jobs", "fetch/network drift remains blocked"]));
  });

  it("preserves accessibility risk checks", () => {
    const result = createR87ManualRevenueCommandCenterDriftRiskAudit(reviewedInput);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes drift boundaries", () => {
    const result = createR87ManualRevenueCommandCenterDriftRiskAudit(reviewedInput);
    expect(summarizeR87ManualRevenueCommandCenterDriftRiskAudit(result)).toMatch(/revenue command visibility, executive review/i);
  });
});


