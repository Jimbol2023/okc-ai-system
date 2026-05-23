import { createY6AuditSchemaQueryabilityReview } from "./y6-audit-schema-queryability-review";

describe("Y6D audit schema queryability review", () => {
  it("plans safe query needs without authorizing storage", () => {
    const result = createY6AuditSchemaQueryabilityReview();
    expect(result.planningOnly).toBe(true);
    expect(result.queryNeeds).toContain("governance review history");
    expect(result.queryNeeds).toContain("risk-level filtering");
    expect(result.storageAuthorized).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("blocks surveillance and sensitive query patterns", () => {
    const result = createY6AuditSchemaQueryabilityReview({ surveillanceTrackingRequested: true, unboundedSearchLogRequested: true, rawCommunicationSearchRequested: true, providerPayloadSearchRequested: true, sensitiveDataSearchRequested: true });
    expect(result.status).toBe("audit_schema_queryability_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/surveillance-style tracking remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/raw communication search remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/sensitive-data search remains blocked/);
  });
});
