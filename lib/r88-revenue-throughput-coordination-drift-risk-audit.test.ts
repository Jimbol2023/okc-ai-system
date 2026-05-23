import {
  classifyR88RevenueThroughputCoordinationDangerousWording,
  createR88RevenueThroughputCoordinationDriftRiskAudit,
  summarizeR88RevenueThroughputCoordinationDriftRiskAudit,
} from "./r88-revenue-throughput-coordination-drift-risk-audit";

const reviewedInput = {
  throughputCoordinationExecutionReviewed: true,
  sequencingReviewAutomationReviewed: true,
  velocitySignalRuntimeReviewed: true,
  bottleneckProviderReviewed: true,
  delayedRevenuePathOutreachReviewed: true,
  assignmentDelayBuyerContactReviewed: true,
  closingDelayExecutionReviewed: true,
  missingDataSkipTracingReviewed: true,
  bottleneckScrapingReviewed: true,
  highOpportunityLeadCreationReviewed: true,
  operatorGuidanceProviderReviewed: true,
  externalApiReviewed: true,
  fetchNetworkReviewed: true,
  persistenceReviewed: true,
  auditWritingReviewed: true,
  dangerousWordingReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R88B revenue throughput coordination drift risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR88RevenueThroughputCoordinationDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("throughput-coordination-to-execution drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR88RevenueThroughputCoordinationDriftRiskAudit(reviewedInput);
    expect(result.status).toBe("revenue_throughput_coordination_drift_audit_clear");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("detects dangerous wording", () => {
    expect(classifyR88RevenueThroughputCoordinationDangerousWording("execute throughput coordination")).toBe("dangerous_wording_detected");
    expect(classifyR88RevenueThroughputCoordinationDangerousWording("manual revenue review recommended")).toBe("wording_clear");
  });

  it("pressure-tests all required drift paths as blocked", () => {
    const result = createR88RevenueThroughputCoordinationDriftRiskAudit({
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
    expect(result.status).toBe("revenue_throughput_coordination_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["throughput coordination visibility cannot execute", "assignment delays cannot contact buyers", "velocity signals cannot trigger runtime jobs", "fetch/network drift remains blocked"]));
  });

  it("preserves accessibility risk checks", () => {
    const result = createR88RevenueThroughputCoordinationDriftRiskAudit(reviewedInput);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes drift boundaries", () => {
    const result = createR88RevenueThroughputCoordinationDriftRiskAudit(reviewedInput);
    expect(summarizeR88RevenueThroughputCoordinationDriftRiskAudit(result)).toMatch(/throughput coordination, sequencing review/i);
  });
});
