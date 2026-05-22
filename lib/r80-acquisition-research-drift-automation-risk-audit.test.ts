import {
  createR80AcquisitionResearchDriftAutomationRiskAudit,
  summarizeR80AcquisitionResearchDriftAudit,
} from "./r80-acquisition-research-drift-automation-risk-audit";

const reviewedInput = {
  scrapingReviewed: true,
  geocodingReviewed: true,
  mapCrawlingReviewed: true,
  leadCreationReviewed: true,
  ownerContactReviewed: true,
  buyerSellerContactReviewed: true,
  campaignReviewed: true,
  providerReviewed: true,
  outreachReviewed: true,
  missingDataExternalApiReviewed: true,
  aiSkipTracingReviewed: true,
  persistenceReviewed: true,
  auditBoundaryReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R80B acquisition research drift automation risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR80AcquisitionResearchDriftAutomationRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("research-to-scraping drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR80AcquisitionResearchDriftAutomationRiskAudit(reviewedInput);
    expect(result.status).toBe("acquisition_research_drift_audit_clear");
    expect(result.flags.scrapingAllowed).toBe(false);
  });

  it("pressure-tests research automation and execution drift as blocked", () => {
    const result = createR80AcquisitionResearchDriftAutomationRiskAudit({
      ...reviewedInput,
      scrapingRequested: true,
      geocodingRequested: true,
      mapCrawlingRequested: true,
      leadCreationRequested: true,
      ownerContactRequested: true,
      buyerSellerContactRequested: true,
      campaignRequested: true,
      providerRequested: true,
      outreachRequested: true,
      externalApiRequested: true,
      skipTracingRequested: true,
      fetchNetworkRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("acquisition_research_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["research cannot trigger scraping", "research cannot create leads", "research cannot contact owners", "fetch/network remains blocked"]));
  });

  it("summarizes research drift boundaries", () => {
    const result = createR80AcquisitionResearchDriftAutomationRiskAudit(reviewedInput);
    expect(summarizeR80AcquisitionResearchDriftAudit(result)).toMatch(/scraping, geocoding, map crawling/i);
  });
});
