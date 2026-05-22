import {
  createR69ProviderIsolationSafetyBoundaryScopeContract,
  summarizeR69ProviderIsolationSafetyBoundaryScope,
} from "./r69-provider-isolation-safety-boundary-scope-contract";

const readyInput = {
  providerIsolationDoctrineReviewed: true,
  governanceBoundaryReviewed: true,
  credentialBoundaryReviewed: true,
  networkBoundaryReviewed: true,
  auditBoundaryReviewed: true,
  accessibilityReviewed: true,
} as const;

describe("R69A provider isolation safety boundary scope", () => {
  it("defaults to operator review required", () => {
    const result = createR69ProviderIsolationSafetyBoundaryScopeContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.providerEnvReadAllowed).toBe(false);
  });

  it("smoke-tests provider isolation scope readiness", () => {
    const result = createR69ProviderIsolationSafetyBoundaryScopeContract(readyInput);
    expect(result.status).toBe("provider_isolation_scope_ready");
    expect(result.allowedConcepts).toContain("future provider readiness checklist only");
    expect(result.auditBoundary.wording).toContain("audit layer not active yet");
    expect(result.accessibility.ariaLabelledby).toBe(true);
  });

  it("pressure-tests provider credential env and network blockers", () => {
    const result = createR69ProviderIsolationSafetyBoundaryScopeContract({
      ...readyInput,
      providerActivationRequested: true,
      providerClientRequested: true,
      credentialReadRequested: true,
      envReadRequested: true,
      fetchNetworkRequested: true,
      sendRequested: true,
      runtimeRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      campaignRequested: true,
    });
    expect(result.status).toBe("provider_isolation_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "provider activation remains blocked",
        "provider clients remain blocked",
        "provider credential access remains blocked",
        "provider env reads remain blocked",
        "fetch/network remains blocked",
        "audit writing remains blocked",
      ]),
    );
  });

  it("pressure-tests approval simulation readiness queue urgency and revenue provider drift", () => {
    const result = createR69ProviderIsolationSafetyBoundaryScopeContract({
      ...readyInput,
      approvalProviderRequested: true,
      simulationProviderRequested: true,
      readinessProviderRequested: true,
      queueProviderRequested: true,
      urgencyProviderRequested: true,
      revenueProviderRequested: true,
    });
    expect(result.status).toBe("provider_isolation_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "approval never triggers providers",
        "simulation never triggers providers",
        "readiness never triggers providers",
        "queue priority never triggers providers",
        "urgency never triggers providers",
        "revenue opportunity never triggers providers",
      ]),
    );
  });

  it("summarizes scope boundaries", () => {
    const result = createR69ProviderIsolationSafetyBoundaryScopeContract(readyInput);
    expect(summarizeR69ProviderIsolationSafetyBoundaryScope(result)).toMatch(/fetch\/network/i);
  });
});
