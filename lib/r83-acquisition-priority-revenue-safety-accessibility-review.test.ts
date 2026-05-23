import {
  createR83AcquisitionPriorityRevenueSafetyAccessibilityReview,
  summarizeR83AcquisitionPriorityRevenueSafetyReview,
} from "./r83-acquisition-priority-revenue-safety-accessibility-review";

const reviewedInput = {
  scoringExecutionReviewed: true,
  urgencyOutreachReviewed: true,
  decayScrapingReviewed: true,
  blockedSkipTracingReviewed: true,
  providerReviewed: true,
  persistenceReviewed: true,
  pollingRuntimeReviewed: true,
  auditWritingReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R83E acquisition priority revenue safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR83AcquisitionPriorityRevenueSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("Priority and revenue scoring does not imply execution.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR83AcquisitionPriorityRevenueSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("acquisition_priority_revenue_safety_clear");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
  });

  it("pressure-tests unsafe priority, revenue, provider, runtime, and persistence requests as blocked", () => {
    const result = createR83AcquisitionPriorityRevenueSafetyAccessibilityReview({
      ...reviewedInput,
      executionRequested: true,
      outreachRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      providerRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      auditWritingRequested: true,
      fetchNetworkRequested: true,
    });
    expect(result.status).toBe("acquisition_priority_revenue_safety_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "priority/revenue scoring cannot execute",
        "urgency cannot trigger outreach",
        "lead decay cannot trigger scraping",
        "blocked leads cannot trigger skip tracing",
        "provider activation remains blocked",
        "persistence remains blocked",
        "polling remains blocked",
        "runtime remains blocked",
        "audit writing remains blocked",
        "fetch/network remains blocked",
      ]),
    );
  });

  it("preserves accessibility, readable labels, and governance warnings", () => {
    const result = createR83AcquisitionPriorityRevenueSafetyAccessibilityReview(reviewedInput);
    expect(result.accessibility.readableLabelsPreserved).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
    expect(result.accessibility.noAutoRefresh).toBe(true);
  });

  it("summarizes safety and accessibility review", () => {
    const result = createR83AcquisitionPriorityRevenueSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR83AcquisitionPriorityRevenueSafetyReview(result)).toMatch(/scoring-does-not-execute/i);
    expect(summarizeR83AcquisitionPriorityRevenueSafetyReview(result)).toMatch(/visible governance warnings/i);
  });
});
