import { createY8RiskDisclosurePackageReview } from "./y8-risk-disclosure-package-review";

describe("Y8C risk disclosure package review", () => {
  it("documents risk without authorizing implementation", () => {
    const result = createY8RiskDisclosurePackageReview();
    expect(result.planningOnly).toBe(true);
    expect(result.riskDisclosureAreas).toContain("audit write drift risk");
    expect(result.riskAcceptanceAuthorizesImplementation).toBe(false);
    expect(result.productionRolloutAllowed).toBe(false);
  });

  it("blocks risk acceptance as authorization and activation requests", () => {
    const result = createY8RiskDisclosurePackageReview({ riskAcceptanceAsAuthorizationRequested: true, providerCouplingRequested: true, runtimeCouplingRequested: true, productionRolloutRequested: true, auditWriteRequested: true });
    expect(result.status).toBe("risk_disclosure_package_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/risk acceptance does not authorize implementation/);
    expect(result.blockedReasons.join(" ")).toMatch(/production rollout remains blocked/);
  });
});
