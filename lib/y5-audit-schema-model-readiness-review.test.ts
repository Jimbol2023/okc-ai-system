import { createY5AuditSchemaModelReadinessReview, y5AuditSchemaCandidateFields } from "./y5-audit-schema-model-readiness-review";

describe("Y5A audit schema model readiness review", () => {
  it("keeps schema readiness planning-only and unauthorized", () => {
    const result = createY5AuditSchemaModelReadinessReview();
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.schemaChangesAuthorized).toBe(false);
    expect(result.flags.migrationsAuthorized).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.planningOnly).toBe(true);
    expect(result.schemaChangesAuthorized).toBe(false);
  });

  it("keeps candidate fields bounded and conceptual", () => {
    expect(y5AuditSchemaCandidateFields).toContain("eventType");
    expect(y5AuditSchemaCandidateFields).toContain("redactedSummary");
    expect(y5AuditSchemaCandidateFields).toContain("retentionCategory");
  });

  it("blocks schema, Prisma model, migration, storage, audit write, provider, and runtime requests", () => {
    const result = createY5AuditSchemaModelReadinessReview({ schemaChangeRequested: true, prismaModelRequested: true, migrationRequested: true, storageRequested: true, auditWriteRequested: true, providerRequested: true, runtimeRequested: true });
    expect(result.status).toBe("audit_schema_model_readiness_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/Prisma model creation remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/storage remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime activation remains blocked/);
  });
});
