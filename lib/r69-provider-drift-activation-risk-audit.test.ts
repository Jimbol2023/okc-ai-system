import {
  createR69ProviderDriftActivationRiskAudit,
  summarizeR69ProviderDriftActivationRiskAudit,
} from "./r69-provider-drift-activation-risk-audit";

const passedInput = {
  r69aReviewed: true,
  readinessActivationReviewed: true,
  previewSimulationReviewed: true,
  approvalQueueUrgencyRevenueReviewed: true,
  credentialEnvReviewed: true,
  fetchNetworkReviewed: true,
  runtimePollingReviewed: true,
  auditWritingReviewed: true,
  dangerousWordingReviewed: true,
} as const;

describe("R69B provider drift activation risk audit", () => {
  it("defaults to operator review required", () => {
    const result = createR69ProviderDriftActivationRiskAudit();
    expect(result.status).toBe("operator_review_required");
    expect(result.riskCategories).toContain("credential/env-read drift");
  });

  it("smoke-tests provider drift audit coverage", () => {
    const result = createR69ProviderDriftActivationRiskAudit(passedInput);
    expect(result.status).toBe("provider_drift_audit_passed");
    expect(result.dangerousWordingPatterns).toContain("create fetch call");
    expect(result.flags.fetchNetworkAllowed).toBe(false);
  });

  it("pressure-tests provider activation credential env fetch runtime polling and audit blockers", () => {
    const result = createR69ProviderDriftActivationRiskAudit({
      ...passedInput,
      providerActivationDriftFound: true,
      credentialEnvDriftFound: true,
      fetchNetworkDriftFound: true,
      runtimeDriftFound: true,
      pollingDriftFound: true,
      auditWritingDriftFound: true,
      dangerousWordingFound: true,
    });
    expect(result.status).toBe("provider_drift_audit_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "provider activation drift found",
        "credential/env-read drift found",
        "fetch/network drift found",
        "runtime drift found",
        "polling drift found",
        "audit-writing drift found",
      ]),
    );
  });

  it("pressure-tests signal-to-provider drift blockers", () => {
    const result = createR69ProviderDriftActivationRiskAudit({
      ...passedInput,
      previewProviderDriftFound: true,
      simulationProviderDriftFound: true,
      approvalProviderDriftFound: true,
      queueProviderDriftFound: true,
      urgencyProviderDriftFound: true,
      revenueProviderDriftFound: true,
    });
    expect(result.status).toBe("provider_drift_audit_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "preview-to-provider drift found",
        "simulation-to-provider drift found",
        "approval-to-provider drift found",
        "queue-to-provider drift found",
        "urgency-to-provider drift found",
        "revenue-to-provider drift found",
      ]),
    );
  });

  it("summarizes audit coverage", () => {
    const result = createR69ProviderDriftActivationRiskAudit(passedInput);
    expect(summarizeR69ProviderDriftActivationRiskAudit(result)).toMatch(/credential\/env/i);
  });
});
