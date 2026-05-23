import { createY9FinalPreSchemaAuthorizationSummary } from "./y9-final-pre-schema-authorization-summary";

describe("Y9F final pre-schema authorization summary", () => {
  it("summarizes Y9A-E and keeps authorization false", () => {
    const result = createY9FinalPreSchemaAuthorizationSummary();
    expect(result.authorizationEvidence.phase).toBe("Y9A");
    expect(result.stopConditions.phase).toBe("Y9B");
    expect(result.humanAuthorizationBoundary.phase).toBe("Y9C");
    expect(result.rolloutRisk.phase).toBe("Y9D");
    expect(result.nextPhaseReadiness.phase).toBe("Y9E");
    expect(result.schemaChangesAuthorized).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("preserves lockdown flags", () => {
    const result = createY9FinalPreSchemaAuthorizationSummary();
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.persistenceWritten).toBe(false);
    expect(result.runtimeActivationAllowed).toBe(false);
    expect(result.executionAllowed).toBe(false);
  });

  it("blocks schema, migration, storage, audit writing, provider, runtime, execution, and production requests", () => {
    const result = createY9FinalPreSchemaAuthorizationSummary({ schemaRequested: true, migrationRequested: true, storageRequested: true, auditWritingRequested: true, providerRequested: true, runtimeRequested: true, executionRequested: true, productionRequested: true });
    expect(result.status).toBe("final_pre_schema_authorization_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/schema changes remain unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/production rollout remains blocked/);
  });
});
