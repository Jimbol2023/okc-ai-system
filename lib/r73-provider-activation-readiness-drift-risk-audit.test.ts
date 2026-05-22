import {
  createR73ProviderActivationReadinessDriftRiskAudit,
  summarizeR73ProviderActivationReadinessDriftAudit,
} from "./r73-provider-activation-readiness-drift-risk-audit";

const reviewedInput = {
  readinessToActivationReviewed: true,
  providerReadyToProviderReviewed: true,
  credentialBoundaryReviewed: true,
  fetchNetworkBoundaryReviewed: true,
  runtimeBoundaryReviewed: true,
  campaignBoundaryReviewed: true,
  auditBoundaryReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R73B provider activation readiness drift risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR73ProviderActivationReadinessDriftRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("smoke-tests drift audit clearance", () => {
    const result = createR73ProviderActivationReadinessDriftRiskAudit(reviewedInput);
    expect(result.status).toBe("provider_readiness_drift_clear");
    expect(result.riskCategories).toContain("readiness-to-activation drift");
  });

  it("pressure-tests provider activation drift as blocked", () => {
    const result = createR73ProviderActivationReadinessDriftRiskAudit({
      ...reviewedInput,
      readinessActivationRequested: true,
      readinessSendRequested: true,
      providerReadyProviderRequested: true,
      approvalSendRequested: true,
      aiRecommendationProviderRequested: true,
      queueProviderRequested: true,
      urgencyProviderRequested: true,
      revenuePressureProviderRequested: true,
      simulationProviderRequested: true,
      previewProviderRequested: true,
      providerClientRequested: true,
      credentialEnvReadRequested: true,
      fetchNetworkRequested: true,
      runtimeRequested: true,
      campaignRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      hiddenExecutionAffordanceRequested: true,
    });
    expect(result.status).toBe("provider_readiness_drift_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["readiness cannot activate providers", "provider clients remain blocked", "credential and env reads remain blocked", "fetch/network remains blocked", "audit writing remains blocked"]));
  });

  it("summarizes drift prevention", () => {
    const result = createR73ProviderActivationReadinessDriftRiskAudit(reviewedInput);
    expect(summarizeR73ProviderActivationReadinessDriftAudit(result)).toMatch(/blocks readiness/i);
  });
});
