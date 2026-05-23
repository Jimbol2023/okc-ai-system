import { createY2FinalManualRevenueOperationsSummary } from "./y2-final-manual-revenue-operations-summary";

describe("Y2F final manual revenue operations summary", () => {
  it("defaults to manual operations primary with no activation authorized", () => {
    const result = createY2FinalManualRevenueOperationsSummary();
    expect(result.noActivationAuthorized).toBe(true);
    expect(result.manualOperationsRemainPrimary).toBe(true);
    expect(result.optimizationRecommendedBeforeExecution).toBe(true);
    expect(result.providerActivationStillGated).toBe(true);
    expect(result.persistenceStillGated).toBe(true);
  });

  it("blocks activation, provider, and persistence requests", () => {
    const result = createY2FinalManualRevenueOperationsSummary({ activationRequested: true, providerRequested: true, persistenceRequested: true });
    expect(result.status).toBe("manual_ops_summary_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/activation remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/persistence remains gated/);
  });
});
