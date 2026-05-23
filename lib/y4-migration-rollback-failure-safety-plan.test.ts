import { createY4MigrationRollbackFailureSafetyPlan } from "./y4-migration-rollback-failure-safety-plan";

describe("Y4E migration rollback failure safety plan", () => {
  it("plans migration rollback safety without authorizing migrations or storage", () => {
    const result = createY4MigrationRollbackFailureSafetyPlan();
    expect(result.planningOnly).toBe(true);
    expect(result.migrationApprovalRequired).toBe(true);
    expect(result.emergencyStorageDisableRequired).toBe(true);
    expect(result.silentFailuresAllowed).toBe(false);
    expect(result.migrationsAuthorized).toBe(false);
    expect(result.storageAuthorized).toBe(false);
    expect(result.persistenceWritten).toBe(false);
  });

  it("blocks migrations, rollback implementation, storage, triggered persistence, silent failures, and DB writes", () => {
    const result = createY4MigrationRollbackFailureSafetyPlan({ migrationRequested: true, rollbackImplementationRequested: true, storageRequested: true, providerTriggeredPersistenceRequested: true, runtimeTriggeredPersistenceRequested: true, silentFailureRequested: true, dbWriteRequested: true });
    expect(result.status).toBe("migration_rollback_failure_safety_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/migrations remain unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/provider-triggered persistence remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/silent failures remain blocked/);
  });
});
