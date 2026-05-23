import { createY8OperatorRunbookReadinessPackage } from "./y8-operator-runbook-readiness-package";

describe("Y8D operator runbook readiness package", () => {
  it("keeps runbook readiness manual and planning-only", () => {
    const result = createY8OperatorRunbookReadinessPackage();
    expect(result.planningOnly).toBe(true);
    expect(result.runbookAreas).toContain("rollback checklist");
    expect(result.manualOperationsRemainPrimary).toBe(true);
    expect(result.runbookAutomationAllowed).toBe(false);
  });

  it("blocks automation runtime storage and migration execution requests", () => {
    const result = createY8OperatorRunbookReadinessPackage({ runbookAsAutomationRequested: true, runtimeProcedureRequested: true, operatorBypassRequested: true, storageActivationRequested: true, migrationExecutionRequested: true });
    expect(result.status).toBe("operator_runbook_readiness_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/runbook automation remains blocked/);
    expect(result.blockedReasons.join(" ")).toMatch(/migration execution remains blocked/);
  });
});
