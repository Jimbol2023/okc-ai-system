import {
  createR76DistressPropertyIntelligenceDriftDataRiskAudit,
  summarizeR76DistressPropertyIntelligenceDriftAudit,
} from "./r76-distress-property-intelligence-drift-data-risk-audit";

const reviewedInput = {
  signalLeadCreationReviewed: true,
  scoreOwnerContactReviewed: true,
  vacancyOutreachReviewed: true,
  taxRiskScrapingReviewed: true,
  codeViolationCrawlingReviewed: true,
  neighborhoodCampaignReviewed: true,
  aiSkipTracingReviewed: true,
  externalDataReviewed: true,
  mapAutomationReviewed: true,
  providerBoundaryReviewed: true,
  persistenceBoundaryReviewed: true,
  auditBoundaryReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R76B distress property intelligence drift data risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR76DistressPropertyIntelligenceDriftDataRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("distress-signal-to-lead-creation drift");
  });

  it("smoke-tests a clear drift audit", () => {
    const result = createR76DistressPropertyIntelligenceDriftDataRiskAudit(reviewedInput);
    expect(result.status).toBe("distress_drift_audit_clear");
    expect(result.flags.leadCreationAllowed).toBe(false);
    expect(result.flags.skipTracingAllowed).toBe(false);
    expect(result.nextPhase).toBe("R76C - Distress Property Intelligence Read-Only UI Scope Contract");
  });

  it("pressure-tests all drift paths as blocked", () => {
    const result = createR76DistressPropertyIntelligenceDriftDataRiskAudit({
      ...reviewedInput,
      signalLeadCreationRequested: true,
      scoreOwnerContactRequested: true,
      vacancyOutreachRequested: true,
      taxRiskScrapingRequested: true,
      codeViolationCrawlingRequested: true,
      neighborhoodCampaignRequested: true,
      aiSkipTracingRequested: true,
      externalDataApiRequested: true,
      mapAutomationRequested: true,
      providerRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      dangerousWordingRequested: true,
    });

    expect(result.status).toBe("distress_drift_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "distress signals cannot create leads",
        "distress scores cannot contact owners",
        "AI recommendations cannot skip trace",
        "fetch/network remains blocked",
      ]),
    );
  });

  it("summarizes lead creation and owner-contact drift boundaries", () => {
    const result = createR76DistressPropertyIntelligenceDriftDataRiskAudit(reviewedInput);
    expect(summarizeR76DistressPropertyIntelligenceDriftAudit(result)).toMatch(/lead creation, owner contact/i);
  });
});
