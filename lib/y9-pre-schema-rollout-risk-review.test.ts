import { createY9PreSchemaRolloutRiskReview } from "./y9-pre-schema-rollout-risk-review";

describe("Y9D pre-schema rollout risk review", () => {
  it("reviews rollout risk without allowing rollout", () => {
    const result = createY9PreSchemaRolloutRiskReview();
    expect(result.planningOnly).toBe(true);
    expect(result.riskAreas).toContain("privacy exposure");
    expect(result.productionRolloutAllowed).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("blocks risk bypass and rollout/coupling requests", () => {
    const result = createY9PreSchemaRolloutRiskReview({ riskIgnoredRequested: true, productionRolloutRequested: true, runtimeCouplingRequested: true, providerCouplingRequested: true, auditWriteRequested: true, storageActivationRequested: true });
    expect(result.status).toBe("pre_schema_rollout_risk_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/risk bypass remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/production rollout remains blocked/);
  });
});
