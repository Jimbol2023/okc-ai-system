import {
  createR75VirtualD4dSafetyAccessibilityReview,
  summarizeR75VirtualD4dSafetyReview,
} from "./r75-virtual-d4d-safety-accessibility-review";

const reviewedInput = {
  noScrapingReviewed: true,
  noMapCrawlingReviewed: true,
  noExternalApiReviewed: true,
  noOwnerContactReviewed: true,
  noOutreachReviewed: true,
  noProviderReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  accessibilityReviewed: true,
  governanceWarningsReviewed: true,
} as const;

describe("R75E virtual D4D safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR75VirtualD4dSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.findings).toContain("No scraping behavior is authorized.");
  });

  it("smoke-tests a clear safety review", () => {
    const result = createR75VirtualD4dSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("virtual_d4d_safety_clear");
    expect(result.accessibility.semanticStructurePreserved).toBe(true);
    expect(result.nextPhase).toBe("R75F - Virtual D4D Final Lockdown Contract");
  });

  it("pressure-tests unsafe requests as blocked", () => {
    const result = createR75VirtualD4dSafetyAccessibilityReview({
      ...reviewedInput,
      scrapingRequested: true,
      mapCrawlingRequested: true,
      externalApiRequested: true,
      ownerContactRequested: true,
      outreachRequested: true,
      skipTracingRequested: true,
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

    expect(result.status).toBe("virtual_d4d_safety_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "scraping remains blocked",
        "owner contact remains blocked",
        "fetch/network remains blocked",
        "execution remains blocked",
      ]),
    );
  });

  it("summarizes the accessibility and governance review", () => {
    const result = createR75VirtualD4dSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR75VirtualD4dSafetyReview(result)).toMatch(/semantic accessibility, and visible governance warnings/i);
  });
});
