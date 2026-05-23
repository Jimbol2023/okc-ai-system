import { createY5PrismaMigrationReadinessReview } from "./y5-prisma-migration-readiness-review";

describe("Y5B Prisma migration readiness review", () => {
  it("plans migration readiness without authorizing Prisma or migration work", () => {
    const result = createY5PrismaMigrationReadinessReview();
    expect(result.planningOnly).toBe(true);
    expect(result.prismaSchemaEditsAuthorized).toBe(false);
    expect(result.migrationCreationAuthorized).toBe(false);
    expect(result.migrationExecutionAuthorized).toBe(false);
    expect(result.databaseCommandsAuthorized).toBe(false);
  });

  it("blocks Prisma schema edits, migrations, seed data, DB commands, and storage", () => {
    const result = createY5PrismaMigrationReadinessReview({ prismaSchemaEditRequested: true, migrationCreateRequested: true, migrationRunRequested: true, seedDataRequested: true, dbCommandRequested: true, storageRequested: true });
    expect(result.status).toBe("prisma_migration_readiness_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/Prisma schema edits remain unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/migration execution remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/database commands remain blocked/);
  });
});
