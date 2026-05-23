import { createY7MigrationExecutionGateReview } from "./y7-migration-execution-gate-review";

describe("Y7B migration execution gate review", () => {
  it("keeps migrations and DB commands blocked", () => {
    const result = createY7MigrationExecutionGateReview();
    expect(result.planningOnly).toBe(true);
    expect(result.migrationGenerationAuthorized).toBe(false);
    expect(result.migrationExecutionAuthorized).toBe(false);
    expect(result.hostedDbCommandsAuthorized).toBe(false);
    expect(result.persistenceWritten).toBe(false);
  });

  it("blocks migration and hosted DB requests", () => {
    const result = createY7MigrationExecutionGateReview({ migrationGenerateRequested: true, migrationRunRequested: true, hostedDbCommandRequested: true, rollbackExecutionRequested: true });
    expect(result.status).toBe("migration_execution_gate_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/migration generation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/hosted DB commands remain blocked/);
  });
});
