import { createY4FinalAuditStorageBoundarySummary } from "./y4-final-audit-storage-boundary-summary";

describe("Y4F final audit storage boundary summary", () => {
  it("summarizes Y4A-E while keeping all authorization blocked", () => {
    const result = createY4FinalAuditStorageBoundarySummary();
    expect(result.schemaReadiness.phase).toBe("Y4A");
    expect(result.storageReadiness.phase).toBe("Y4B");
    expect(result.redactionReadiness.phase).toBe("Y4C");
    expect(result.retentionPrivacyReadiness.phase).toBe("Y4D");
    expect(result.rollbackReadiness.phase).toBe("Y4E");
    expect(result.schemaChangesAuthorized).toBe(false);
    expect(result.migrationsAuthorized).toBe(false);
    expect(result.storageAuthorized).toBe(false);
    expect(result.persistenceAuthorized).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("preserves lockdown flags and activation blocks", () => {
    const result = createY4FinalAuditStorageBoundarySummary();
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
    expect(result.providerActivationAllowed).toBe(false);
    expect(result.runtimeActivationAllowed).toBe(false);
  });

  it("blocks final schema, migration, storage, persistence, provider, runtime, and audit write requests", () => {
    const result = createY4FinalAuditStorageBoundarySummary({ schemaRequested: true, migrationRequested: true, storageRequested: true, persistenceRequested: true, providerRequested: true, runtimeRequested: true, auditWriteRequested: true });
    expect(result.status).toBe("final_audit_storage_boundary_summary_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/schema remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/storage remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/audit writing remains unauthorized/);
  });

  it("recommends Y5 only as planning-only readiness review", () => {
    const result = createY4FinalAuditStorageBoundarySummary();
    expect(result.recommendedNextStep).toBe("Y5 - Audit Schema Implementation Readiness Review");
    expect(result.recommendedNextStepPlanningOnly).toBe(true);
    expect(result.y5Justified).toBe(true);
  });
});
