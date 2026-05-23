import { createY7FinalAuditSchemaImplementationGateSummary } from "./y7-final-audit-schema-implementation-gate-summary";

describe("Y7F final audit schema implementation gate summary", () => {
  it("summarizes Y7A-E and keeps every gate closed", () => {
    const result = createY7FinalAuditSchemaImplementationGateSummary();
    expect(result.schemaGate.phase).toBe("Y7A");
    expect(result.migrationGate.phase).toBe("Y7B");
    expect(result.auditWriteGate.phase).toBe("Y7C");
    expect(result.securityPrivacyGate.phase).toBe("Y7D");
    expect(result.operationalGate.phase).toBe("Y7E");
    expect(result.schemaImplementationAuthorized).toBe(false);
    expect(result.storageAuthorized).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("preserves lockdown flags and blocks activation", () => {
    const result = createY7FinalAuditSchemaImplementationGateSummary();
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.persistenceWritten).toBe(false);
    expect(result.providerActivationAllowed).toBe(false);
    expect(result.runtimeActivationAllowed).toBe(false);
    expect(result.executionAllowed).toBe(false);
  });

  it("blocks schema implementation, migrations, storage, audit writing, provider, runtime, execution, and production", () => {
    const result = createY7FinalAuditSchemaImplementationGateSummary({ schemaImplementationRequested: true, migrationRequested: true, storageRequested: true, auditWritingRequested: true, providerRequested: true, runtimeRequested: true, executionRequested: true, productionRequested: true });
    expect(result.status).toBe("final_audit_schema_implementation_gate_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/schema implementation remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/audit writing remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/production rollout remains blocked/);
  });
});
