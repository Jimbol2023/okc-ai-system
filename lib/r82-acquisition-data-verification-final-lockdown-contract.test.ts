import {
  createR82AcquisitionDataVerificationFinalLockdownContract,
  summarizeR82AcquisitionDataVerificationFinalLockdown,
} from "./r82-acquisition-data-verification-final-lockdown-contract";

const lockedInput = {
  r82aReviewed: true,
  r82bReviewed: true,
  r82cReviewed: true,
  r82dReviewed: true,
  r82eReviewed: true,
  lockdownRulesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R82F acquisition data verification final lockdown contract", () => {
  it("defaults to operator review required", () => {
    const result = createR82AcquisitionDataVerificationFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.acquisitionDataVerificationLockdownEnforced).toBe(true);
  });

  it("smoke-tests final lockdown enforcement", () => {
    const result = createR82AcquisitionDataVerificationFinalLockdownContract(lockedInput);
    expect(result.status).toBe("acquisition_data_verification_lockdown_enforced");
    expect(result.lockdownRules).toEqual(
      expect.arrayContaining([
        "Verification readiness never executes.",
        "Missing data never triggers scraping.",
        "Property gaps never trigger MLS or public-record crawling.",
        "Execution remains blocked.",
      ]),
    );
    expect(result.nextPhase).toBe("R83 - Acquisition Priority & Revenue Scoring");
  });

  it("pressure-tests every final lockdown path as blocked", () => {
    const result = createR82AcquisitionDataVerificationFinalLockdownContract({
      ...lockedInput,
      executionRequested: true,
      scrapingRequested: true,
      skipTracingRequested: true,
      mlsRequested: true,
      publicRecordCrawlingRequested: true,
      ownerContactRequested: true,
      outreachRequested: true,
      leadCreationRequested: true,
      providerActivationRequested: true,
      externalApiRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
    });
    expect(result.status).toBe("acquisition_data_verification_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "verification readiness never executes",
        "missing data never triggers scraping",
        "incomplete data never triggers skip tracing",
        "property gaps never trigger MLS access",
        "property gaps never trigger public-record crawling",
        "seller gaps never trigger owner contact",
        "buyer/seller gaps never trigger outreach",
        "verification scores never create leads",
        "AI recommendations never activate providers",
        "external API calls remain blocked",
        "fetch/network remains blocked",
        "runtime activation remains blocked",
        "polling remains blocked",
        "persistence remains blocked",
        "audit writing remains blocked",
      ]),
    );
  });

  it("locks preservation flags and execution boundaries", () => {
    const result = createR82AcquisitionDataVerificationFinalLockdownContract(lockedInput);
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
    expect(result.flags.executionAllowed).toBe(false);
    expect(result.flags.auditRecordsWritten).toBe(false);
  });

  it("summarizes the final lockdown", () => {
    const result = createR82AcquisitionDataVerificationFinalLockdownContract(lockedInput);
    expect(summarizeR82AcquisitionDataVerificationFinalLockdown(result)).toMatch(/verification readiness never executes/i);
    expect(summarizeR82AcquisitionDataVerificationFinalLockdown(result)).toMatch(/AI recommendations never activate providers/i);
  });
});
