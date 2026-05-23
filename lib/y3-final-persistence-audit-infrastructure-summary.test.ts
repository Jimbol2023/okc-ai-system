import { createY3FinalPersistenceAuditInfrastructureSummary } from "./y3-final-persistence-audit-infrastructure-summary";

describe("Y3F final persistence audit infrastructure summary", () => {
  it("defaults to no persistence, no audit writing, no schema, no migrations, and no activation", () => {
    const result = createY3FinalPersistenceAuditInfrastructureSummary();
    expect(result.planningOnly).toBe(true);
    expect(result.auditWritingAllowed).toBe(false);
    expect(result.persistenceAllowedNow).toBe(false);
    expect(result.persistenceWritten).toBe(false);
    expect(result.persistenceAuthorized).toBe(false);
    expect(result.schemaAuthorized).toBe(false);
    expect(result.migrationsAuthorized).toBe(false);
    expect(result.providerActivationAllowed).toBe(false);
    expect(result.communicationActivationAllowed).toBe(false);
    expect(result.runtimeActivationAllowed).toBe(false);
  });

  it("summarizes all Y3 planning areas without activating storage", () => {
    const result = createY3FinalPersistenceAuditInfrastructureSummary();
    expect(result.minimumViableAuditMemory.phase).toBe("Y3A");
    expect(result.recordShapeReadiness.phase).toBe("Y3B");
    expect(result.persistenceBoundaryReadiness.phase).toBe("Y3C");
    expect(result.retentionPrivacyReadiness.phase).toBe("Y3D");
    expect(result.incidentReviewReadiness.phase).toBe("Y3E");
    expect(result.minimumViableAuditMemory.persistenceAllowedNow).toBe(false);
    expect(result.recordShapeReadiness.auditWritingAllowed).toBe(false);
  });

  it("blocks final persistence, audit writing, schema, migration, provider, communication, and runtime requests", () => {
    const result = createY3FinalPersistenceAuditInfrastructureSummary({ persistenceRequested: true, auditWritingRequested: true, schemaRequested: true, migrationRequested: true, providerRequested: true, communicationRequested: true, runtimeRequested: true });
    expect(result.status).toBe("final_persistence_audit_summary_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/persistence remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/audit writing remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime activation remains blocked/);
  });

  it("recommends Y4 as planning-only and keeps activation blocked after Y3", () => {
    const result = createY3FinalPersistenceAuditInfrastructureSummary();
    expect(result.recommendedNextStep).toBe("Y4 - Audit Schema / Storage Boundary Planning");
    expect(result.recommendedNextStepPlanningOnly).toBe(true);
    expect(result.activationStillBlockedAfterY3).toBe(true);
  });
});
