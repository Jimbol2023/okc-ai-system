import {
  createR82AcquisitionDataVerificationReadinessScopeContract,
  summarizeR82AcquisitionDataVerificationReadinessScope,
} from "./r82-acquisition-data-verification-readiness-scope-contract";

const reviewedInput = {
  acquisitionDataVerificationDoctrineReviewed: true,
  completenessAdvisoryReviewed: true,
  consistencyAdvisoryReviewed: true,
  missingDataWarningReviewed: true,
  unverifiableDataWarningReviewed: true,
  manualReviewOnlyReviewed: true,
  readinessDoesNotExecuteReviewed: true,
  noLiveVerificationReviewed: true,
  noExternalApiReviewed: true,
  noScrapingReviewed: true,
  noMlsReviewed: true,
  noPublicRecordCrawlingReviewed: true,
  noSkipTracingReviewed: true,
  noOwnerContactReviewed: true,
  noBuyerSellerContactReviewed: true,
  noProviderReviewed: true,
  noSendReviewed: true,
  noRuntimeReviewed: true,
  noPollingReviewed: true,
  noPersistenceReviewed: true,
  noAuditWritingReviewed: true,
  futureUiNotesReviewed: true,
  accessibilityReviewed: true,
  deterministicInvariantsReviewed: true,
  failClosedReviewed: true,
} as const;

describe("R82A acquisition data verification readiness scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR82AcquisitionDataVerificationReadinessScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("acquisition data verification readiness doctrine");
    expect(result.missingReviewAreas).toContain("fail-closed behavior");
  });

  it("locks all preservation flags for advisory-only readiness", () => {
    const result = createR82AcquisitionDataVerificationReadinessScopeContract(reviewedInput);
    expect(result.status).toBe("acquisition_data_verification_scope_ready");
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
    expect(result.flags.verificationReadinessGrantsExecution).toBe(false);
  });

  it("blocks forbidden verification, sourcing, provider, and execution capabilities", () => {
    const result = createR82AcquisitionDataVerificationReadinessScopeContract({
      ...reviewedInput,
      liveVerificationRequested: true,
      externalApiRequested: true,
      scrapingRequested: true,
      mlsRequested: true,
      publicRecordCrawlingRequested: true,
      skipTracingRequested: true,
      ownerLookupRequested: true,
      ownerContactRequested: true,
      buyerSellerContactRequested: true,
      leadCreationRequested: true,
      outreachRequested: true,
      providerClientRequested: true,
      providerActivationRequested: true,
      twilioRequested: true,
      sendRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      automationRequested: true,
      autonomousAcquisitionRequested: true,
      executionRequested: true,
    });

    expect(result.status).toBe("acquisition_data_verification_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "live verification remains blocked",
        "external API usage remains blocked",
        "scraping remains blocked",
        "MLS access remains blocked",
        "public-record crawling remains blocked",
        "skip tracing remains blocked",
        "owner contact remains blocked",
        "buyer/seller contact remains blocked",
        "lead creation remains blocked",
        "provider activation remains blocked",
        "fetch/network remains blocked",
        "persistence remains blocked",
        "audit writing remains blocked",
        "execution remains blocked",
      ]),
    );
  });

  it("keeps missing, incomplete, and gap semantics from triggering external work", () => {
    const result = createR82AcquisitionDataVerificationReadinessScopeContract(reviewedInput);
    expect(result.dataCompletenessConsistencyAdvisory.completenessOnlyMeans).toEqual(
      expect.arrayContaining(["no missing field can trigger data sourcing"]),
    );
    expect(result.dataCompletenessConsistencyAdvisory.consistencyOnlyMeans).toEqual(
      expect.arrayContaining(["consistency does not validate facts externally"]),
    );
    expect(result.flags.scrapingAllowed).toBe(false);
    expect(result.flags.skipTracingAllowed).toBe(false);
    expect(result.flags.mlsAccessAllowed).toBe(false);
    expect(result.flags.publicRecordCrawlingAllowed).toBe(false);
    expect(result.flags.ownerContactAllowed).toBe(false);
    expect(result.flags.buyerSellerContactAllowed).toBe(false);
  });

  it("preserves provider, persistence, polling, runtime, and audit boundaries", () => {
    const result = createR82AcquisitionDataVerificationReadinessScopeContract(reviewedInput);
    expect(result.flags.providerClientAllowed).toBe(false);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.persistenceAllowedNow).toBe(false);
    expect(result.flags.pollingAllowed).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.auditRecordsWritten).toBe(false);
    expect(result.auditBoundary.auditLayerActive).toBe(false);
    expect(result.auditBoundary.auditRecordsWrittenNow).toBe(false);
  });

  it("keeps future UI notes advisory-only and includes accessibility requirements", () => {
    const result = createR82AcquisitionDataVerificationReadinessScopeContract(reviewedInput);
    expect(result.futureUiNotes.advisoryOnly).toBe(true);
    expect(result.futureUiNotes.controlsAuthorized).toBe(false);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.readableLabels).toBe(true);
    expect(result.accessibility.textBasedStatusMeaning).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes no-live-verification and no-execution doctrine", () => {
    const result = createR82AcquisitionDataVerificationReadinessScopeContract(reviewedInput);
    expect(summarizeR82AcquisitionDataVerificationReadinessScope(result)).toMatch(/live verification, external APIs, scraping, MLS/i);
    expect(summarizeR82AcquisitionDataVerificationReadinessScope(result)).toMatch(/execution remain blocked/i);
  });
});
