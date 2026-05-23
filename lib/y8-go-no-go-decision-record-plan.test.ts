import { createY8GoNoGoDecisionRecordPlan } from "./y8-go-no-go-decision-record-plan";

describe("Y8E go no-go decision record plan", () => {
  it("keeps decision records non-executing", () => {
    const result = createY8GoNoGoDecisionRecordPlan();
    expect(result.planningOnly).toBe(true);
    expect(result.decisionRecordAreas).toContain("explicit non-execution statement");
    expect(result.goDecisionGrantsExecution).toBe(false);
    expect(result.schemaChangesAuthorized).toBe(false);
  });

  it("blocks go decision as execution and activation requests", () => {
    const result = createY8GoNoGoDecisionRecordPlan({ goDecisionAsExecutionRequested: true, schemaImplementationRequested: true, migrationRequested: true, storageRequested: true, auditWriteRequested: true, providerRequested: true, runtimeRequested: true });
    expect(result.status).toBe("go_no_go_decision_record_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/go decision does not grant execution/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime activation remains blocked/);
  });
});
