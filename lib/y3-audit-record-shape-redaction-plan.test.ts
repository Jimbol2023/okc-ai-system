import { createY3AuditRecordShapeRedactionPlan, y3PlannedAuditRecordFields, y3RedactionCategories } from "./y3-audit-record-shape-redaction-plan";

describe("Y3B audit record shape and redaction plan", () => {
  it("plans audit record shape without allowing schema or persistence", () => {
    const result = createY3AuditRecordShapeRedactionPlan();
    expect(result.planningOnly).toBe(true);
    expect(result.auditWritingAllowed).toBe(false);
    expect(result.persistenceAllowedNow).toBe(false);
    expect(result.persistenceWritten).toBe(false);
    expect(result.schemaAuthorized).toBe(false);
    expect(result.migrationsAuthorized).toBe(false);
    expect(result.prismaModelAuthorized).toBe(false);
  });

  it("includes required planned fields and redaction categories", () => {
    expect(y3PlannedAuditRecordFields).toContain("eventType");
    expect(y3PlannedAuditRecordFields).toContain("providerState");
    expect(y3PlannedAuditRecordFields).toContain("createdAtPlaceholder");
    expect(y3RedactionCategories).toContain("phone numbers");
    expect(y3RedactionCategories).toContain("tokens/secrets");
    expect(y3RedactionCategories).toContain("personal/private context");
  });

  it("blocks schema, migrations, Prisma models, DB writes, and routes", () => {
    const result = createY3AuditRecordShapeRedactionPlan({ schemaChangeRequested: true, migrationRequested: true, prismaModelRequested: true, dbWriteRequested: true, persistenceRouteRequested: true, auditRouteRequested: true, auditWriteRequested: true });
    expect(result.status).toBe("audit_record_shape_redaction_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/Prisma models remain blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/persistence routes remain blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/audit writing remains blocked/);
  });
});
