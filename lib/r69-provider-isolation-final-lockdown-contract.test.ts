import {
  createR69ProviderIsolationFinalLockdownContract,
  summarizeR69ProviderIsolationFinalLockdown,
} from "./r69-provider-isolation-final-lockdown-contract";

const lockedInput = {
  r69aReviewed: true,
  r69bReviewed: true,
  r69cReviewed: true,
  r69dReviewed: true,
  r69eReviewed: true,
  lockdownRulesReviewed: true,
  auditBoundaryReviewed: true,
  forbiddenDriftReviewed: true,
  inclusiveAccessibilityReviewed: true,
  operatorReviewCompleted: true,
} as const;

describe("R69F provider isolation final lockdown", () => {
  it("defaults to operator review required", () => {
    const result = createR69ProviderIsolationFinalLockdownContract();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.providerIsolationLocked).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.fetchNetworkAllowed).toBe(false);
  });

  it("smoke-tests final provider isolation lockdown enforcement", () => {
    const result = createR69ProviderIsolationFinalLockdownContract(lockedInput);
    expect(result.status).toBe("provider_isolation_lockdown_enforced");
    expect(result.lockdownRules).toEqual(
      expect.arrayContaining([
        "Provider activation remains blocked.",
        "Provider readiness never grants activation.",
        "Simulation never triggers provider.",
        "Preview never triggers provider.",
        "Approval never triggers provider.",
        "Readiness never triggers provider.",
        "Queue priority never triggers provider.",
        "Urgency never triggers provider.",
        "Revenue opportunity never triggers provider.",
        "Env/credential access remains blocked.",
        "Fetch/network remains blocked.",
        "Audit logging remains inactive.",
      ]),
    );
    expect(result.auditBoundaryRules).toContain("No audit records are written in this phase.");
    expect(result.nextPhase).toBe("R70A - Manual Operator Action Center Scope Contract");
  });

  it("pressure-tests every provider activation signal env fetch runtime persistence and audit path as blocked", () => {
    const result = createR69ProviderIsolationFinalLockdownContract({
      ...lockedInput,
      providerActivationRequested: true,
      providerReadinessActivationRequested: true,
      simulationProviderRequested: true,
      previewProviderRequested: true,
      approvalProviderRequested: true,
      readinessProviderRequested: true,
      queueProviderRequested: true,
      urgencyProviderRequested: true,
      revenueProviderRequested: true,
      credentialEnvRequested: true,
      fetchNetworkRequested: true,
      runtimeActivationRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      auditWritingRequested: true,
      executionRequested: true,
    });
    expect(result.status).toBe("provider_isolation_lockdown_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "provider activation remains blocked",
        "provider readiness never grants activation",
        "simulation never triggers provider",
        "preview never triggers provider",
        "approval never triggers provider",
        "readiness never triggers provider",
        "queue priority never triggers provider",
        "urgency never triggers provider",
        "revenue opportunity never triggers provider",
        "env/credential access remains blocked",
        "fetch/network remains blocked",
        "audit logging remains inactive",
      ]),
    );
  });

  it("summarizes the final lockdown", () => {
    const result = createR69ProviderIsolationFinalLockdownContract(lockedInput);
    expect(summarizeR69ProviderIsolationFinalLockdown(result)).toMatch(/provider isolation is locked/i);
  });
});
