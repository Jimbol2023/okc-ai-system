import {
  createR73ProviderActivationReadinessSafetyAccessibilityReview,
  summarizeR73ProviderActivationReadinessSafetyReview,
} from "./r73-provider-activation-readiness-safety-accessibility-review";

const reviewedInput = {
  semanticStructureReviewed: true,
  accessibilityReviewed: true,
  readinessDoesNotActivateReviewed: true,
  governanceWarningsReviewed: true,
  forbiddenControlsReviewed: true,
  providerBoundaryReviewed: true,
} as const;

describe("R73E provider activation readiness safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR73ProviderActivationReadinessSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.providerControlsPresent).toBe(false);
  });

  it("smoke-tests safety review clearance", () => {
    const result = createR73ProviderActivationReadinessSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("provider_readiness_safety_clear");
    expect(result.safetyFindings).toContain("Provider readiness does not imply activation.");
  });

  it("pressure-tests unsafe provider readiness drift as blocked", () => {
    const result = createR73ProviderActivationReadinessSafetyAccessibilityReview({
      ...reviewedInput,
      readinessActivationDriftDetected: true,
      providerControlDetected: true,
      activationControlDetected: true,
      sendControlDetected: true,
      providerClientDetected: true,
      credentialEnvReadDetected: true,
      fetchNetworkDetected: true,
      hiddenExecutionAffordanceDetected: true,
      dangerousWordingDetected: true,
      runtimeDetected: true,
      pollingDetected: true,
      persistenceDetected: true,
      auditWritingDetected: true,
    });
    expect(result.status).toBe("provider_readiness_safety_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["readiness-to-activation drift remains forbidden", "provider controls remain forbidden", "provider clients remain blocked", "audit writing remains blocked"]));
  });

  it("summarizes provider readiness safety", () => {
    const result = createR73ProviderActivationReadinessSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR73ProviderActivationReadinessSafetyReview(result)).toMatch(/no readiness-to-activation drift/i);
  });
});
