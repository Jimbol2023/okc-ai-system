import { createY5FinalAuditSchemaImplementationReadinessSummary } from "./y5-final-audit-schema-implementation-readiness-summary";

describe("Y5F final audit schema implementation readiness summary", () => {
  it("summarizes Y5A-E while keeping implementation unauthorized", () => {
    const result = createY5FinalAuditSchemaImplementationReadinessSummary();
    expect(result.schemaModelReadiness.phase).toBe("Y5A");
    expect(result.migrationReadiness.phase).toBe("Y5B");
    expect(result.writePathReadiness.phase).toBe("Y5C");
    expect(result.redactionValidationReadiness.phase).toBe("Y5D");
    expect(result.rolloutBlockers.phase).toBe("Y5E");
    expect(result.schemaImplementationAuthorized).toBe(false);
    expect(result.schemaChangesAuthorized).toBe(false);
    expect(result.migrationsAuthorized).toBe(false);
    expect(result.storageAuthorized).toBe(false);
  });

  it("preserves strict lockdown flags and planning-only posture", () => {
    const result = createY5FinalAuditSchemaImplementationReadinessSummary();
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.persistenceWritten).toBe(false);
    expect(result.planningOnly).toBe(true);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("blocks schema implementation, migrations, storage, audit writing, provider, runtime, and production", () => {
    const result = createY5FinalAuditSchemaImplementationReadinessSummary({ schemaImplementationRequested: true, migrationRequested: true, storageRequested: true, auditWritingRequested: true, providerRequested: true, runtimeRequested: true, productionRequested: true });
    expect(result.status).toBe("final_audit_schema_implementation_readiness_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/schema implementation remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/storage remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/production rollout remains blocked/);
  });
});
