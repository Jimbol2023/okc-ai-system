import { createY3RetentionImmutabilityPrivacyPlan } from "./y3-retention-immutability-privacy-plan";

describe("Y3D retention immutability privacy plan", () => {
  it("plans retention and privacy without implementing storage features", () => {
    const result = createY3RetentionImmutabilityPrivacyPlan();
    expect(result.planningOnly).toBe(true);
    expect(result.persistenceAllowedNow).toBe(false);
    expect(result.persistenceWritten).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
    expect(result.deletionImplemented).toBe(false);
    expect(result.exportsImplemented).toBe(false);
    expect(result.storageImplemented).toBe(false);
    expect(result.auditTablesImplemented).toBe(false);
    expect(result.privacyRoutesImplemented).toBe(false);
  });

  it("separates editable notes from immutable future audit records", () => {
    const result = createY3RetentionImmutabilityPrivacyPlan();
    expect(result.editableNotesSeparateFromImmutableAudit).toBe(true);
    expect(result.immutableGovernanceTraceRequired).toBe(true);
    expect(result.privacyMinimizationRequired).toBe(true);
  });

  it("blocks deletion, export, storage, audit table, and privacy route implementation", () => {
    const result = createY3RetentionImmutabilityPrivacyPlan({ deletionImplementationRequested: true, exportImplementationRequested: true, storageRequested: true, auditTableRequested: true, privacyRouteRequested: true, dbWriteRequested: true, auditWriteRequested: true });
    expect(result.status).toBe("retention_immutability_privacy_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/deletion implementation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/audit tables remain blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/privacy routes remain blocked/);
  });
});
