import {
  createR76DistressPropertyIntelligenceSafetyAccessibilityReview,
  summarizeR76DistressPropertyIntelligenceSafetyReview,
} from "./r76-distress-property-intelligence-safety-accessibility-review";

const reviewedInput = {
  noScrapingReviewed: true,
  noMapCrawlingReviewed: true,
  noStreetViewReviewed: true,
  noExternalApiReviewed: true,
  noLeadCreationReviewed: true,
  noSkipTracingReviewed: true,
  noOwnerContactReviewed: true,
  noOutreachReviewed: true,
  noProviderReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R76E distress property intelligence safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR76DistressPropertyIntelligenceSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("No lead creation is authorized.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR76DistressPropertyIntelligenceSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("distress_safety_clear");
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
    expect(result.nextPhase).toBe("R76F - Distress Property Intelligence Final Lockdown Contract");
  });

  it("pressure-tests unsafe requests as blocked", () => {
    const result = createR76DistressPropertyIntelligenceSafetyAccessibilityReview({
      ...reviewedInput,
      scrapingRequested: true,
      mapCrawlingRequested: true,
      streetViewAutomationRequested: true,
      externalApiRequested: true,
      leadCreationRequested: true,
      skipTracingRequested: true,
      ownerContactRequested: true,
      outreachRequested: true,
      providerRequested: true,
      providerClientRequested: true,
      credentialEnvReadRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });

    expect(result.status).toBe("distress_safety_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "lead creation remains blocked",
        "owner contact remains blocked",
        "fetch/network remains blocked",
        "execution remains blocked",
      ]),
    );
  });

  it("summarizes accessibility and governance review", () => {
    const result = createR76DistressPropertyIntelligenceSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR76DistressPropertyIntelligenceSafetyReview(result)).toMatch(/semantic accessibility, and visible governance warnings/i);
  });
});
