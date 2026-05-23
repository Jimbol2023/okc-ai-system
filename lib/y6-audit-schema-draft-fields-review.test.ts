import { createY6AuditSchemaDraftFieldsReview, y6AuditSchemaDraftFieldFlags } from "./y6-audit-schema-draft-fields-review";

describe("Y6A audit schema draft fields review", () => {
  it("keeps draft field review planning-only and unauthorized", () => {
    const result = createY6AuditSchemaDraftFieldsReview();
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.schemaChangesAuthorized).toBe(false);
    expect(result.flags.migrationsAuthorized).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.planningOnly).toBe(true);
  });

  it("flags required optional risky and rejected field categories", () => {
    expect(y6AuditSchemaDraftFieldFlags.eventType).toBe("required");
    expect(y6AuditSchemaDraftFieldFlags.actorIdPlaceholder).toBe("optional");
    expect(y6AuditSchemaDraftFieldFlags.boundedNotes).toBe("risky");
    expect(createY6AuditSchemaDraftFieldsReview().rejectedFieldsBlocked).toBe(true);
  });

  it("blocks risky field activation and rejected field requests", () => {
    const result = createY6AuditSchemaDraftFieldsReview({ riskyFieldActivationRequested: true, rejectedFieldRequested: true, schemaChangeRequested: true });
    expect(result.status).toBe("audit_schema_draft_fields_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/risky field activation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/rejected fields remain blocked/);
  });
});
