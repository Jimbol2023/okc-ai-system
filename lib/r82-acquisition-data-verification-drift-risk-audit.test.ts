import {
  classifyR82AcquisitionDataVerificationDangerousWording,
  createR82AcquisitionDataVerificationDriftRiskAudit,
  summarizeR82AcquisitionDataVerificationDriftRiskAudit,
} from "./r82-acquisition-data-verification-drift-risk-audit";

const reviewedInput = {
  verificationReadinessExecutionReviewed: true,
  missingDataScrapingReviewed: true,
  incompleteRecordPublicRecordReviewed: true,
  propertyGapMlsReviewed: true,
  sellerGapSkipTracingReviewed: true,
  ownerGapOwnerContactReviewed: true,
  buyerSellerGapContactReviewed: true,
  dataConfidenceLeadCreationReviewed: true,
  verificationScoreProviderReviewed: true,
  externalApiReviewed: true,
  fetchNetworkReviewed: true,
  persistenceReviewed: true,
  auditWritingReviewed: true,
  runtimePollingReviewed: true,
  dangerousWordingReviewed: true,
  governanceSupremacyReviewed: true,
  failClosedReviewed: true,
  manualReviewOnlyReviewed: true,
  noLiveVerificationReviewed: true,
  noSourceExpansionReviewed: true,
  noContactExpansionReviewed: true,
  noExecutionExpansionReviewed: true,
  noRuntimeExpansionReviewed: true,
  noPersistenceExpansionReviewed: true,
  noAuditWritingExpansionReviewed: true,
  futureUiWordingRiskReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R82B acquisition data verification drift risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR82AcquisitionDataVerificationDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("verification-readiness-to-execution drift");
  });

  it("locks all preservation flags for advisory-only drift audit", () => {
    const result = createR82AcquisitionDataVerificationDriftRiskAudit(reviewedInput);
    expect(result.status).toBe("acquisition_data_verification_drift_audit_clear");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.persistenceAllowedNow).toBe(false);
    expect(result.flags.pollingAllowed).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("represents every required drift type", () => {
    const result = createR82AcquisitionDataVerificationDriftRiskAudit(reviewedInput);
    expect(result.riskCategories).toEqual(
      expect.arrayContaining([
        "verification-readiness-to-execution drift",
        "missing-data-to-scraping drift",
        "incomplete-record-to-public-record-crawling drift",
        "property-data-gap-to-MLS drift",
        "seller-data-gap-to-skip-tracing drift",
        "owner-data-gap-to-owner-contact drift",
        "buyer/seller-data-gap-to-contact drift",
        "data-confidence-to-lead-creation drift",
        "verification-score-to-provider drift",
        "external API drift",
        "fetch/network drift",
        "persistence drift",
        "audit-writing drift",
        "dangerous wording drift",
      ]),
    );
  });

  it("detects dangerous wording deterministically", () => {
    expect(classifyR82AcquisitionDataVerificationDangerousWording("High confidence, create lead")).toBe("dangerous_wording_detected");
    expect(classifyR82AcquisitionDataVerificationDangerousWording("Future UI may show advisory-only warnings")).toBe("wording_clear");
  });

  it("blocks verification and data gap drift into sourcing, contact, provider, and execution", () => {
    const result = createR82AcquisitionDataVerificationDriftRiskAudit({
      ...reviewedInput,
      executionRequested: true,
      scrapingRequested: true,
      publicRecordCrawlingRequested: true,
      mlsRequested: true,
      skipTracingRequested: true,
      ownerContactRequested: true,
      buyerSellerContactRequested: true,
      outreachRequested: true,
      leadCreationRequested: true,
      providerActivationRequested: true,
    });

    expect(result.status).toBe("acquisition_data_verification_drift_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "verification readiness cannot become execution",
        "missing data cannot become scraping",
        "incomplete records cannot become public-record crawling",
        "property gaps cannot become MLS access",
        "seller gaps cannot become skip tracing",
        "owner gaps cannot become owner contact",
        "buyer/seller gaps cannot become contact",
        "buyer/seller gaps cannot become outreach",
        "data confidence cannot create leads",
        "verification scores cannot activate providers",
      ]),
    );
  });

  it("blocks external API, fetch/network, persistence, audit-writing, runtime, and polling drift", () => {
    const result = createR82AcquisitionDataVerificationDriftRiskAudit({
      ...reviewedInput,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      dangerousWordingRequested: true,
    });

    expect(result.status).toBe("acquisition_data_verification_drift_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "external API drift remains blocked",
        "fetch/network drift remains blocked",
        "persistence drift remains blocked",
        "audit-writing drift remains blocked",
        "runtime drift remains blocked",
        "polling drift remains blocked",
        "dangerous wording remains forbidden",
      ]),
    );
    expect(result.flags.fetchNetworkAllowed).toBe(false);
    expect(result.flags.auditRecordsWritten).toBe(false);
  });

  it("keeps future UI wording advisory-only and includes accessibility risk checks", () => {
    const result = createR82AcquisitionDataVerificationDriftRiskAudit(reviewedInput);
    expect(result.futureUiNotes.advisoryOnly).toBe(true);
    expect(result.futureUiNotes.controlsAuthorized).toBe(false);
    expect(result.governanceChecks.futureUiWordingRiskNotes).toEqual(expect.arrayContaining(["Future UI copy must say readiness is advisory only."]));
    expect(result.governanceChecks.accessibilityRiskChecks.semanticHeadings).toBe(true);
    expect(result.governanceChecks.accessibilityRiskChecks.readableLabels).toBe(true);
    expect(result.governanceChecks.accessibilityRiskChecks.noColorOnlyMeaning).toBe(true);
    expect(result.governanceChecks.accessibilityRiskChecks.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes drift boundaries", () => {
    const result = createR82AcquisitionDataVerificationDriftRiskAudit(reviewedInput);
    expect(summarizeR82AcquisitionDataVerificationDriftRiskAudit(result)).toMatch(/execution, scraping, public-record crawling, MLS access/i);
    expect(summarizeR82AcquisitionDataVerificationDriftRiskAudit(result)).toMatch(/runtime jobs, polling, or autonomous acquisition/i);
  });
});
