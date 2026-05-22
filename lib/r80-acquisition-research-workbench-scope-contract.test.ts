import {
  createR80AcquisitionResearchWorkbenchScopeContract,
  summarizeR80AcquisitionResearchWorkbenchScope,
} from "./r80-acquisition-research-workbench-scope-contract";

const reviewedInput = {
  researchDoctrineReviewed: true,
  advisoryOnlyReviewed: true,
  manualReviewReviewed: true,
  explainabilityReviewed: true,
  confidenceLimitReviewed: true,
  missingDataReviewed: true,
  governanceBlockedResearchReviewed: true,
  noLeadCreationReviewed: true,
  contactBoundaryReviewed: true,
  dataSourcingBoundaryReviewed: true,
  providerIsolationReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R80A acquisition research workbench scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR80AcquisitionResearchWorkbenchScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("acquisition research doctrine");
  });

  it("smoke-tests advisory-only research scope readiness", () => {
    const result = createR80AcquisitionResearchWorkbenchScopeContract(reviewedInput);
    expect(result.status).toBe("acquisition_research_scope_ready");
    expect(result.flags.researchCreatesLeads).toBe(false);
    expect(result.flags.externalApiAllowed).toBe(false);
  });

  it("pressure-tests forbidden sourcing, contact, lead, and execution paths", () => {
    const result = createR80AcquisitionResearchWorkbenchScopeContract({
      ...reviewedInput,
      scrapingRequested: true,
      geocodingRequested: true,
      mapCrawlingRequested: true,
      leadCreationRequested: true,
      ownerContactRequested: true,
      buyerSellerContactRequested: true,
      skipTracingRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      campaignRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("acquisition_research_scope_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["scraping remains blocked", "geocoding remains blocked", "lead creation remains blocked", "buyer/seller contact remains blocked", "execution remains blocked"]));
  });

  it("preserves provider isolation, accessibility, and future-only audit doctrine", () => {
    const result = createR80AcquisitionResearchWorkbenchScopeContract(reviewedInput);
    expect(result.flags.providerClientAllowed).toBe(false);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.auditBoundary.auditLayerActive).toBe(false);
  });

  it("summarizes the no-research-automation doctrine", () => {
    const result = createR80AcquisitionResearchWorkbenchScopeContract(reviewedInput);
    expect(summarizeR80AcquisitionResearchWorkbenchScope(result)).toMatch(/scraping, geocoding, map crawling/i);
  });
});
