import {
  createR76DistressPropertyIntelligenceScopeContract,
  summarizeR76DistressPropertyIntelligenceScope,
} from "./r76-distress-property-intelligence-scope-contract";

const reviewedInput = {
  distressDoctrineReviewed: true,
  advisoryOnlyReviewed: true,
  manualReviewReviewed: true,
  confidenceLimitReviewed: true,
  unverifiedSignalReviewed: true,
  noLeadCreationReviewed: true,
  noOwnerContactReviewed: true,
  noDataSourcingReviewed: true,
  providerIsolationReviewed: true,
  accessibilityReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R76A distress property intelligence scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR76DistressPropertyIntelligenceScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("distress property intelligence doctrine");
  });

  it("smoke-tests advisory-only scope readiness", () => {
    const result = createR76DistressPropertyIntelligenceScopeContract(reviewedInput);
    expect(result.status).toBe("distress_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.leadCreationAllowed).toBe(false);
    expect(result.nextPhase).toBe("R76B - Distress Property Intelligence Drift / Data Risk Audit");
  });

  it("pressure-tests forbidden lead creation, contact, sourcing, and execution paths", () => {
    const result = createR76DistressPropertyIntelligenceScopeContract({
      ...reviewedInput,
      leadCreationRequested: true,
      ownerContactRequested: true,
      skipTracingRequested: true,
      scrapingRequested: true,
      mapCrawlingRequested: true,
      streetViewAutomationRequested: true,
      externalApiRequested: true,
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

    expect(result.status).toBe("distress_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "lead creation remains blocked",
        "owner contact remains blocked",
        "skip tracing remains blocked",
        "scraping remains blocked",
        "fetch/network remains blocked",
        "audit writing remains blocked",
      ]),
    );
  });

  it("preserves accessibility and future-only audit doctrine", () => {
    const result = createR76DistressPropertyIntelligenceScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noPolling).toBe(true);
    expect(result.auditBoundary.auditLayerActive).toBe(false);
    expect(result.auditBoundary.auditRecordsWrittenNow).toBe(false);
  });

  it("summarizes confidence and unverified signal limits", () => {
    const result = createR76DistressPropertyIntelligenceScopeContract(reviewedInput);
    expect(summarizeR76DistressPropertyIntelligenceScope(result)).toMatch(/unverified with limited confidence/i);
  });
});
