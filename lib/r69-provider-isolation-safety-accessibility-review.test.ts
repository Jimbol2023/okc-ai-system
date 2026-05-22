import {
  createR69ProviderIsolationSafetyAccessibilityReview,
  summarizeR69ProviderIsolationSafetyAccessibilityReview,
} from "./r69-provider-isolation-safety-accessibility-review";

const passedInput = {
  r69dUiReviewed: true,
  contractsReviewed: true,
  dangerousWordingReviewed: true,
  hiddenControlsReviewed: true,
  inclusiveAccessibilityReviewed: true,
  providerControlsReviewed: true,
  credentialEnvReviewed: true,
  fetchNetworkReviewed: true,
  providerRuntimePollingReviewed: true,
  persistenceAuditBoundaryReviewed: true,
  governanceVisibilityReviewed: true,
} as const;

describe("R69E provider isolation safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR69ProviderIsolationSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.noProviderActivationDrift).toBe(true);
    expect(result.missingReviewAreas).toContain("R69D UI");
  });

  it("smoke-tests safe R69 UI and contract review coverage", () => {
    const result = createR69ProviderIsolationSafetyAccessibilityReview(passedInput);
    expect(result.status).toBe("provider_safety_accessibility_review_passed");
    expect(result.findings.join(" ")).toMatch(/No buttons, execution controls, provider controls/i);
    expect(result.findings.join(" ")).toMatch(/fetch\/network calls/i);
    expect(result.findings.join(" ")).toMatch(/screen-reader, keyboard-only/i);
  });

  it("pressure-tests provider credential env fetch runtime polling persistence and audit blockers", () => {
    const result = createR69ProviderIsolationSafetyAccessibilityReview({
      ...passedInput,
      providerActivationDriftFound: true,
      providerReadinessActivationDriftFound: true,
      credentialEnvDriftFound: true,
      fetchNetworkDriftFound: true,
      runtimeDriftFound: true,
      pollingDriftFound: true,
      persistenceDriftFound: true,
      auditWritingDriftFound: true,
      hiddenExecutionAffordanceFound: true,
      dangerousWordingFound: true,
      accessibilityRegressionFound: true,
      providerControlFound: true,
      executionControlFound: true,
    });
    expect(result.status).toBe("provider_safety_accessibility_review_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "provider activation drift found",
        "provider readiness-to-activation drift found",
        "credential/env-read drift found",
        "fetch/network drift found",
        "audit-writing drift found",
        "provider control found",
        "execution control found",
      ]),
    );
  });

  it("summarizes review coverage", () => {
    const result = createR69ProviderIsolationSafetyAccessibilityReview(passedInput);
    expect(summarizeR69ProviderIsolationSafetyAccessibilityReview(result)).toMatch(/inclusive accessibility regression/i);
  });
});
