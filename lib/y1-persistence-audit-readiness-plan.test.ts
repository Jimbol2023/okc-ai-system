import { createY1PersistenceAuditReadinessPlan } from "./y1-persistence-audit-readiness-plan";

describe("Y1D persistence audit readiness plan", () => {
  it("plans persistence without allowing writes", () => {
    const result = createY1PersistenceAuditReadinessPlan();
    expect(result.persistenceWritten).toBe(false);
    expect(result.persistenceAllowedNow).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
    expect(result.planningOnly).toBe(true);
  });

  it("blocks schema, migration, DB, persistence route, and audit route requests", () => {
    const result = createY1PersistenceAuditReadinessPlan({ schemaChangeRequested: true, migrationRequested: true, dbWriteRequested: true, persistenceRouteRequested: true, auditRouteRequested: true });
    expect(result.status).toBe("persistence_audit_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/migrations remain blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/DB writes remain blocked/);
  });
});
