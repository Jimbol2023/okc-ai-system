import { createY4FutureAuditSchemaConceptPlan, y4FutureAuditConcepts, y4FutureAuditSchemaFields } from "./y4-future-audit-schema-concept-plan";

describe("Y4A future audit schema concept plan", () => {
  it("preserves lockdown flags and planning-only defaults", () => {
    const result = createY4FutureAuditSchemaConceptPlan();
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.schemaChangesAuthorized).toBe(false);
    expect(result.flags.migrationsAuthorized).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.planningOnly).toBe(true);
    expect(result.persistenceWritten).toBe(false);
  });

  it("plans the required future audit concepts and fields", () => {
    expect(y4FutureAuditConcepts).toContain("governance event");
    expect(y4FutureAuditConcepts).toContain("incident review");
    expect(y4FutureAuditSchemaFields).toContain("eventType");
    expect(y4FutureAuditSchemaFields).toContain("retentionCategory");
    expect(y4FutureAuditSchemaFields).toContain("createdAtPlaceholder");
  });

  it("blocks schema, migration, storage, persistence, audit writing, provider, and runtime requests", () => {
    const result = createY4FutureAuditSchemaConceptPlan({ schemaChangeRequested: true, migrationRequested: true, storageRequested: true, persistenceRequested: true, auditWriteRequested: true, providerRequested: true, runtimeRequested: true });
    expect(result.status).toBe("future_audit_schema_concept_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/schema changes remain unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/storage remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/audit writing remains unauthorized/);
  });
});
