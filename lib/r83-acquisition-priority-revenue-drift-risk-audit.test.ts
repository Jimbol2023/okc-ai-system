import {
  classifyR83PriorityRevenueDangerousWording,
  createR83AcquisitionPriorityRevenueDriftRiskAudit,
  summarizeR83AcquisitionPriorityRevenueDriftRiskAudit,
} from "./r83-acquisition-priority-revenue-drift-risk-audit";

const reviewedInput = {
  priorityExecutionReviewed: true,
  urgencyContactReviewed: true,
  revenueProviderReviewed: true,
  closeProbabilityOutreachReviewed: true,
  operatorAutomationReviewed: true,
  leadDecayScrapingReviewed: true,
  blockedLeadSkipTracingReviewed: true,
  confidenceLeadCreationReviewed: true,
  externalApiReviewed: true,
  fetchNetworkReviewed: true,
  persistenceReviewed: true,
  auditWritingReviewed: true,
  dangerousWordingReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R83B acquisition priority revenue drift risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR83AcquisitionPriorityRevenueDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("priority-to-execution drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR83AcquisitionPriorityRevenueDriftRiskAudit(reviewedInput);
    expect(result.status).toBe("acquisition_priority_revenue_drift_audit_clear");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("detects dangerous wording", () => {
    expect(classifyR83PriorityRevenueDangerousWording("execute priority score")).toBe("dangerous_wording_detected");
    expect(classifyR83PriorityRevenueDangerousWording("advisory priority label")).toBe("wording_clear");
  });

  it("pressure-tests all required drift paths as blocked", () => {
    const result = createR83AcquisitionPriorityRevenueDriftRiskAudit({
      ...reviewedInput,
      executionRequested: true,
      contactRequested: true,
      providerRequested: true,
      outreachRequested: true,
      automationRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      leadCreationRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      dangerousWordingRequested: true,
    });
    expect(result.status).toBe("acquisition_priority_revenue_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["priority scores cannot execute", "urgency cannot trigger contact", "revenue scores cannot activate providers", "close probability cannot trigger outreach", "fetch/network drift remains blocked"]));
  });

  it("preserves accessibility risk checks", () => {
    const result = createR83AcquisitionPriorityRevenueDriftRiskAudit(reviewedInput);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes drift boundaries", () => {
    const result = createR83AcquisitionPriorityRevenueDriftRiskAudit(reviewedInput);
    expect(summarizeR83AcquisitionPriorityRevenueDriftRiskAudit(result)).toMatch(/priority, urgency, revenue scores/i);
  });
});
