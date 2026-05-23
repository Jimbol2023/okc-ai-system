import { createY6AuditSchemaMinimizationReview } from "./y6-audit-schema-minimization-review";

describe("Y6B audit schema minimization review", () => {
  it("requires minimization while keeping schema and storage unauthorized", () => {
    const result = createY6AuditSchemaMinimizationReview();
    expect(result.planningOnly).toBe(true);
    expect(result.schemaChangesAuthorized).toBe(false);
    expect(result.storageAuthorized).toBe(false);
    expect(result.rawSensitiveDataAllowed).toBe(false);
    expect(result.boundedShapesRequired).toBe(true);
  });

  it("blocks raw payloads, secrets, logs, unbounded shapes, unsafe enums, and schema changes", () => {
    const result = createY6AuditSchemaMinimizationReview({ rawMessageBodyRequested: true, rawProviderPayloadRequested: true, credentialSecretRequested: true, unrestrictedLogRequested: true, unboundedTextRequested: true, unboundedArrayRequested: true, unsafeEnumRequested: true, schemaChangeRequested: true });
    expect(result.status).toBe("audit_schema_minimization_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/raw message bodies remain blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/credentials\/secrets remain blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/unsafe enums remain blocked/);
  });
});
