import { createY1ProviderCommunicationActivationRiskMap } from "./y1-provider-communication-activation-risk-map";

describe("Y1B provider communication activation risk map", () => {
  it("maps risks without allowing providers or sending", () => {
    const result = createY1ProviderCommunicationActivationRiskMap();
    expect(result.providerActivationAllowed).toBe(false);
    expect(result.communicationActivationAllowed).toBe(false);
    expect(result.providerCalled).toBe(false);
    expect(result.sent).toBe(false);
    expect(result.riskMapOnly).toBe(true);
  });

  it("blocks provider, env, SDK, send, and activation requests", () => {
    const result = createY1ProviderCommunicationActivationRiskMap({ providerCallRequested: true, envReadRequested: true, sendRequested: true, providerSdkRequested: true, activationRequested: true });
    expect(result.status).toBe("risk_map_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/provider calls remain blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/sending remains blocked/);
  });
});
