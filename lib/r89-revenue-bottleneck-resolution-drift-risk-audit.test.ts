import {
  classifyR89RevenueBottleneckResolutionDangerousWording,
  createR89RevenueBottleneckResolutionDriftRiskAudit,
  summarizeR89RevenueBottleneckResolutionDriftRiskAudit,
} from "./r89-revenue-bottleneck-resolution-drift-risk-audit";

const reviewedInput = {
  bottleneckResolutionExecutionReviewed: true,
  recoveryGuidanceAutomationReviewed: true,
  remediationReviewProviderReviewed: true,
  throughputRecoveryRuntimeReviewed: true,
  blockedWorkflowOutreachReviewed: true,
  assignmentBlockageBuyerContactReviewed: true,
  closingBlockageExecutionReviewed: true,
  bottleneckScrapingReviewed: true,
  missingDataSkipTracingReviewed: true,
  highImpactLeadCreationReviewed: true,
  operatorGuidanceProviderReviewed: true,
  externalApiReviewed: true,
  fetchNetworkReviewed: true,
  persistenceReviewed: true,
  auditWritingReviewed: true,
  dangerousWordingReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R89B revenue bottleneck resolution drift risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR89RevenueBottleneckResolutionDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("bottleneck-resolution-to-execution drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR89RevenueBottleneckResolutionDriftRiskAudit(reviewedInput);
    expect(result.status).toBe("revenue_bottleneck_resolution_drift_audit_clear");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("detects dangerous wording", () => {
    expect(classifyR89RevenueBottleneckResolutionDangerousWording("execute bottleneck resolution")).toBe("dangerous_wording_detected");
    expect(classifyR89RevenueBottleneckResolutionDangerousWording("manual bottleneck review recommended")).toBe("wording_clear");
  });

  it("pressure-tests all required drift paths as blocked", () => {
    const result = createR89RevenueBottleneckResolutionDriftRiskAudit({
      ...reviewedInput,
      executionRequested: true,
      automationRequested: true,
      providerRequested: true,
      runtimeRequested: true,
      outreachRequested: true,
      contactRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      leadCreationRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      dangerousWordingRequested: true,
    });
    expect(result.status).toBe("revenue_bottleneck_resolution_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["bottleneck resolution visibility cannot execute", "recovery guidance cannot become automation", "throughput recovery cannot trigger runtime jobs", "fetch/network drift remains blocked"]));
  });

  it("preserves accessibility risk checks", () => {
    const result = createR89RevenueBottleneckResolutionDriftRiskAudit(reviewedInput);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes drift boundaries", () => {
    const result = createR89RevenueBottleneckResolutionDriftRiskAudit(reviewedInput);
    expect(summarizeR89RevenueBottleneckResolutionDriftRiskAudit(result)).toMatch(/bottleneck resolution, recovery guidance/i);
  });
});
