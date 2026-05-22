import {
  createR75VirtualD4dDriftDataSourcingRiskAudit,
  summarizeR75VirtualD4dDriftAudit,
} from "./r75-virtual-d4d-drift-data-sourcing-risk-audit";

const reviewedInput = {
  intelligenceScrapingReviewed: true,
  distressContactReviewed: true,
  propertyScoreOutreachReviewed: true,
  mapReadinessReviewed: true,
  leadPriorityCampaignReviewed: true,
  aiOwnerContactReviewed: true,
  externalDataReviewed: true,
  providerBoundaryReviewed: true,
  persistenceBoundaryReviewed: true,
  auditBoundaryReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R75B virtual D4D drift data-sourcing risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR75VirtualD4dDriftDataSourcingRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("intelligence-to-scraping drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR75VirtualD4dDriftDataSourcingRiskAudit(reviewedInput);
    expect(result.status).toBe("virtual_d4d_drift_audit_clear");
    expect(result.flags.scrapingAllowed).toBe(false);
    expect(result.flags.ownerContactAllowed).toBe(false);
    expect(result.nextPhase).toBe("R75C - Virtual D4D Read-Only UI Scope Contract");
  });

  it("pressure-tests all drift paths as blocked", () => {
    const result = createR75VirtualD4dDriftDataSourcingRiskAudit({
      ...reviewedInput,
      intelligenceScrapingRequested: true,
      distressContactRequested: true,
      propertyScoreOutreachRequested: true,
      mapReadinessCrawlingRequested: true,
      leadPriorityCampaignRequested: true,
      aiOwnerContactRequested: true,
      externalDataApiRequested: true,
      providerRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      dangerousWordingRequested: true,
    });

    expect(result.status).toBe("virtual_d4d_drift_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "intelligence cannot become scraping",
        "distress signals cannot contact owners",
        "map readiness cannot crawl maps",
        "AI recommendations cannot contact owners",
        "fetch/network remains blocked",
      ]),
    );
  });

  it("summarizes the data-sourcing boundary", () => {
    const result = createR75VirtualD4dDriftDataSourcingRiskAudit(reviewedInput);
    expect(summarizeR75VirtualD4dDriftAudit(result)).toMatch(/scraping, map crawling, owner contact/i);
  });
});
