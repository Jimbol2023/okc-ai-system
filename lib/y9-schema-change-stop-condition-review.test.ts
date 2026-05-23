import { createY9SchemaChangeStopConditionReview } from "./y9-schema-change-stop-condition-review";

describe("Y9B schema change stop condition review", () => {
  it("lists schema stop conditions and keeps bypass blocked", () => {
    const result = createY9SchemaChangeStopConditionReview();
    expect(result.planningOnly).toBe(true);
    expect(result.stopConditions).toContain("missing privacy approval");
    expect(result.stopConditionBypassAllowed).toBe(false);
    expect(result.schemaChangesAuthorized).toBe(false);
  });

  it("blocks stop condition bypass and schema/migration requests", () => {
    const result = createY9SchemaChangeStopConditionReview({ ignoreStopConditionRequested: true, schemaEditRequested: true, prismaModelRequested: true, migrationRequested: true, forceProceedRequested: true });
    expect(result.status).toBe("schema_change_stop_condition_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/stop condition bypass remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/force proceed remains blocked/);
  });
});
