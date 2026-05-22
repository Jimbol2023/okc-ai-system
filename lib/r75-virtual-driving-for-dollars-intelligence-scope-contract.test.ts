import {
  createR75VirtualDrivingForDollarsIntelligenceScopeContract,
  summarizeR75VirtualDrivingForDollarsIntelligenceScope,
} from "./r75-virtual-driving-for-dollars-intelligence-scope-contract";

const reviewedInput = {
  virtualD4dDoctrineReviewed: true,
  acquisitionIntelligenceReviewed: true,
  opportunityVisibilityReviewed: true,
  distressSignalReviewed: true,
  noScrapingReviewed: true,
  noMapCrawlingReviewed: true,
  noExternalApiReviewed: true,
  providerIsolationReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R75A virtual driving for dollars intelligence scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR75VirtualDrivingForDollarsIntelligenceScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("Virtual D4D doctrine");
  });

  it("smoke-tests advisory-only scope readiness", () => {
    const result = createR75VirtualDrivingForDollarsIntelligenceScopeContract(reviewedInput);
    expect(result.status).toBe("virtual_d4d_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.nextPhase).toBe("R75B - Virtual D4D Drift / Data-Sourcing Risk Audit");
  });

  it("pressure-tests forbidden data sourcing and execution paths", () => {
    const result = createR75VirtualDrivingForDollarsIntelligenceScopeContract({
      ...reviewedInput,
      scrapingRequested: true,
      mapCrawlingRequested: true,
      streetViewAutomationRequested: true,
      externalApiRequested: true,
      ownerContactRequested: true,
      skipTracingRequested: true,
      outreachRequested: true,
      providerRequested: true,
      providerClientRequested: true,
      envReadRequested: true,
      credentialReadRequested: true,
      fetchNetworkRequested: true,
      sendRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      campaignRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });

    expect(result.status).toBe("virtual_d4d_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "scraping remains blocked",
        "map crawling remains blocked",
        "external API calls remain blocked",
        "owner contact remains blocked",
        "skip tracing remains blocked",
        "fetch/network remains blocked",
        "audit writing remains blocked",
      ]),
    );
  });

  it("preserves inclusive accessibility and audit boundary requirements", () => {
    const result = createR75VirtualDrivingForDollarsIntelligenceScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noPolling).toBe(true);
    expect(result.auditBoundary.auditLayerActive).toBe(false);
    expect(result.auditBoundary.auditRecordsWrittenNow).toBe(false);
  });

  it("summarizes the no-scraping doctrine", () => {
    const result = createR75VirtualDrivingForDollarsIntelligenceScopeContract(reviewedInput);
    expect(summarizeR75VirtualDrivingForDollarsIntelligenceScope(result)).toMatch(/scraping, map crawling, external APIs/i);
  });
});
