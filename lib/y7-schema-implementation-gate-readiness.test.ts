import { createY7SchemaImplementationGateReadiness } from "./y7-schema-implementation-gate-readiness";

describe("Y7A schema implementation gate readiness", () => {
  it("keeps implementation gate closed and planning-only", () => {
    const result = createY7SchemaImplementationGateReadiness();
    expect(result.planningOnly).toBe(true);
    expect(result.implementationGateOpen).toBe(false);
    expect(result.schemaChangesAuthorized).toBe(false);
    expect(result.migrationsAuthorized).toBe(false);
    expect(result.storageAuthorized).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("blocks implementation, schema, Prisma, migration, storage, and audit write requests", () => {
    const result = createY7SchemaImplementationGateReadiness({ schemaEditRequested: true, prismaModelRequested: true, migrationRequested: true, storageRequested: true, auditWriteRequested: true, implementationRequested: true });
    expect(result.status).toBe("schema_implementation_gate_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/schema edits remain unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/schema implementation remains blocked/);
  });
});
