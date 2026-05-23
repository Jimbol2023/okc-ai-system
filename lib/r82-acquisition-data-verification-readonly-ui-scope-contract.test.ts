import {
  createR82AcquisitionDataVerificationReadonlyUiScopeContract,
  summarizeR82AcquisitionDataVerificationReadonlyUiScope,
} from "./r82-acquisition-data-verification-readonly-ui-scope-contract";

const reviewedInput = {
  authorizedSurfacesReviewed: true,
  readinessWordingReviewed: true,
  completenessWordingReviewed: true,
  consistencyWordingReviewed: true,
  missingDataWordingReviewed: true,
  incompleteDataWordingReviewed: true,
  conflictingDataWordingReviewed: true,
  unverifiableDataWordingReviewed: true,
  manualReviewOnlyWordingReviewed: true,
  noLiveVerificationWordingReviewed: true,
  noScrapingWordingReviewed: true,
  noSkipTracingWordingReviewed: true,
  noPublicRecordCrawlingWordingReviewed: true,
  noMlsWordingReviewed: true,
  noExternalApiWordingReviewed: true,
  noOwnerContactWordingReviewed: true,
  noBuyerSellerContactWordingReviewed: true,
  noExecutionWordingReviewed: true,
  providerBlockedWordingReviewed: true,
  accessibilityReviewed: true,
  implementationBoundariesReviewed: true,
  forbiddenControlsReviewed: true,
  forbiddenBehaviorsReviewed: true,
} as const;

describe("R82C acquisition data verification readonly UI scope contract", () => {
  it("defaults to operator review required", () => {
    const result = createR82AcquisitionDataVerificationReadonlyUiScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.authorizedSurfaces).toContain("components/dashboard/acquisition-data-verification-readiness-summary.tsx");
  });

  it("locks all preservation flags and keeps UI scope read-only", () => {
    const result = createR82AcquisitionDataVerificationReadonlyUiScopeContract(reviewedInput);
    expect(result.status).toBe("acquisition_data_verification_ui_scope_ready");
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.simulationOnly).toBe(true);
    expect(result.flags.uiScopeOnly).toBe(true);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.persistenceAllowedNow).toBe(false);
    expect(result.flags.pollingAllowed).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
  });

  it("authorizes future read-only surfaces without allowing implementation now", () => {
    const result = createR82AcquisitionDataVerificationReadonlyUiScopeContract(reviewedInput);
    expect(result.authorizedSurfaces).toEqual(
      expect.arrayContaining([
        "components/dashboard/acquisition-data-verification-readiness-summary.tsx",
        "app/(dashboard)/dashboard/page.tsx",
      ]),
    );
    expect(result.implementationBoundaries.scopeOnlyNow).toBe(true);
    expect(result.implementationBoundaries.implementationAllowedNow).toBe(false);
  });

  it("keeps advisory wording manual-review-only and non-executing", () => {
    const result = createR82AcquisitionDataVerificationReadonlyUiScopeContract(reviewedInput);
    expect(result.wording.readiness).toMatch(/advisory only/i);
    expect(result.wording.manualReviewOnly).toMatch(/Manual review is required/i);
    expect(result.wording.noExecution).toMatch(/does not authorize execution/i);
    expect(result.wording.providerBlocked).toMatch(/Provider activation remains blocked/i);
  });

  it("keeps missing, incomplete, conflicting, and unverifiable wording from implying live verification or sourcing", () => {
    const result = createR82AcquisitionDataVerificationReadonlyUiScopeContract(reviewedInput);
    expect(result.wording.missingData).toMatch(/does not authorize sourcing, scraping, skip tracing, or contact/i);
    expect(result.wording.incompleteData).toMatch(/does not authorize public-record crawling, MLS access, or provider use/i);
    expect(result.wording.conflictingData).toMatch(/does not validate facts externally/i);
    expect(result.wording.unverifiableData).toMatch(/does not trigger live verification/i);
    expect(result.wording.noLiveVerification).toMatch(/No live verification/i);
    expect(result.wording.noExternalApi).toMatch(/No external API usage or fetch\/network behavior/i);
  });

  it("represents all forbidden UI controls", () => {
    const result = createR82AcquisitionDataVerificationReadonlyUiScopeContract(reviewedInput);
    expect(result.forbiddenControls).toEqual(
      expect.arrayContaining([
        "buttons",
        "forms",
        "inputs",
        "data fetch controls",
        "verification controls",
        "live verification controls",
        "skip-tracing controls",
        "public-record links",
        "MLS controls",
        "scraping links",
        "provider controls",
        "polling controls",
        "runtime job controls",
        "outreach controls",
        "owner contact controls",
        "buyer/seller contact controls",
        "lead creation controls",
        "approval-as-execution controls",
        "audit-writing controls",
        "persistence controls",
      ]),
    );
  });

  it("blocks controls, fetch/network behavior, and execution requests", () => {
    const result = createR82AcquisitionDataVerificationReadonlyUiScopeContract({
      ...reviewedInput,
      buttonRequested: true,
      formRequested: true,
      inputRequested: true,
      dataFetchControlRequested: true,
      verificationControlRequested: true,
      liveVerificationControlRequested: true,
      publicRecordLinkRequested: true,
      mlsControlRequested: true,
      providerControlRequested: true,
      fetchNetworkRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("acquisition_data_verification_ui_scope_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "buttons remain forbidden",
        "forms remain forbidden",
        "inputs remain forbidden",
        "data fetch controls remain forbidden",
        "verification controls remain forbidden",
        "live verification controls remain forbidden",
        "public-record links remain forbidden",
        "MLS controls remain forbidden",
        "provider controls remain forbidden",
        "fetch/network behavior remains blocked",
        "execution remains blocked",
      ]),
    );
  });

  it("blocks forbidden behaviors and preserves provider, persistence, polling, runtime, and audit boundaries", () => {
    const result = createR82AcquisitionDataVerificationReadonlyUiScopeContract({
      ...reviewedInput,
      scrapingRequested: true,
      skipTracingRequested: true,
      ownerContactRequested: true,
      buyerSellerContactRequested: true,
      leadCreationRequested: true,
      providerActivationRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      pollingRequested: true,
      runtimeRequested: true,
    });
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "scraping remains blocked",
        "skip tracing remains blocked",
        "owner contact remains blocked",
        "buyer/seller contact remains blocked",
        "lead creation remains blocked",
        "provider activation remains blocked",
        "persistence remains blocked",
        "audit writing remains blocked",
        "polling remains blocked",
        "runtime jobs remain blocked",
      ]),
    );
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.persistenceAllowedNow).toBe(false);
    expect(result.flags.pollingAllowed).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.auditRecordsWritten).toBe(false);
  });

  it("includes accessibility requirements", () => {
    const result = createR82AcquisitionDataVerificationReadonlyUiScopeContract(reviewedInput);
    expect(result.accessibility.semanticHeadings).toBe(true);
    expect(result.accessibility.ariaLabelledby).toBe(true);
    expect(result.accessibility.ariaDescribedby).toBe(true);
    expect(result.accessibility.readableLabels).toBe(true);
    expect(result.accessibility.textBasedStatusMeaning).toBe(true);
    expect(result.accessibility.noColorOnlyMeaning).toBe(true);
    expect(result.accessibility.noMotionDependency).toBe(true);
    expect(result.accessibility.noAutoRefresh).toBe(true);
    expect(result.accessibility.visibleGovernanceWarnings).toBe(true);
  });

  it("summarizes read-only UI boundaries", () => {
    const result = createR82AcquisitionDataVerificationReadonlyUiScopeContract(reviewedInput);
    expect(summarizeR82AcquisitionDataVerificationReadonlyUiScope(result)).toMatch(/read-only advisory wording/i);
    expect(summarizeR82AcquisitionDataVerificationReadonlyUiScope(result)).toMatch(/no buttons, forms, inputs, live verification/i);
  });
});
