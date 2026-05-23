import {
  createR83AcquisitionPriorityRevenueScoringScopeContract,
  summarizeR83AcquisitionPriorityRevenueScope,
} from "./r83-acquisition-priority-revenue-scoring-scope-contract";

const reviewedInput = {
  acquisitionPriorityReviewed: true,
  revenueScoringReviewed: true,
  operatorPriorityReviewed: true,
  manualReviewOnlyReviewed: true,
  scoreDoesNotExecuteReviewed: true,
  urgencyAdvisoryReviewed: true,
  decayAdvisoryReviewed: true,
  readinessAdvisoryReviewed: true,
  noProviderReviewed: true,
  noExecutionReviewed: true,
  noContactReviewed: true,
  noLeadCreationReviewed: true,
  noRuntimeReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  accessibilityReviewed: true,
  deterministicInvariantsReviewed: true,
  failClosedReviewed: true,
} as const;

describe("R83A acquisition priority revenue scoring scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR83AcquisitionPriorityRevenueScoringScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("acquisition priority doctrine");
  });

  it("smoke-tests advisory-only scoring scope readiness", () => {
    const result = createR83AcquisitionPriorityRevenueScoringScopeContract(reviewedInput);
    expect(result.status).toBe("acquisition_priority_revenue_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("defines deterministic advisory categories", () => {
    const result = createR83AcquisitionPriorityRevenueScoringScopeContract(reviewedInput);
    expect(result.advisoryPriorityCategories).toEqual(
      expect.arrayContaining(["hot", "warm", "cooling", "stale", "blocked", "review-needed", "incomplete", "high-opportunity", "high-risk", "near-close", "low-confidence"]),
    );
  });

  it("pressure-tests forbidden priority, revenue, provider, contact, sourcing, and execution paths", () => {
    const result = createR83AcquisitionPriorityRevenueScoringScopeContract({
      ...reviewedInput,
      executionRequested: true,
      outreachRequested: true,
      providerRequested: true,
      contactRequested: true,
      leadCreationRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      mlsRequested: true,
      publicRecordCrawlingRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("acquisition_priority_revenue_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["priority and revenue scores cannot execute", "revenue scores cannot trigger outreach", "provider activation remains blocked", "urgency cannot trigger contact", "fetch/network remains blocked"]));
  });

  it("preserves accessibility and governance boundaries", () => {
    const result = createR83AcquisitionPriorityRevenueScoringScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.governanceBoundary.scoringOnlyMeans).toContain("execution remains blocked");
  });

  it("summarizes scoring scope", () => {
    const result = createR83AcquisitionPriorityRevenueScoringScopeContract(reviewedInput);
    expect(summarizeR83AcquisitionPriorityRevenueScope(result)).toMatch(/hot, warm, cooling, stale/i);
    expect(summarizeR83AcquisitionPriorityRevenueScope(result)).toMatch(/execution remain blocked/i);
  });
});
