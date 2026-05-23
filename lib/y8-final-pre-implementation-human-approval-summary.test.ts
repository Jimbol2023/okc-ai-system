import { createY8FinalPreImplementationHumanApprovalSummary } from "./y8-final-pre-implementation-human-approval-summary";

describe("Y8F final pre-implementation human approval summary", () => {
  it("summarizes Y8A-E while keeping all authorization false", () => {
    const result = createY8FinalPreImplementationHumanApprovalSummary();
    expect(result.packageContents.phase).toBe("Y8A");
    expect(result.approvalRoles.phase).toBe("Y8B");
    expect(result.riskDisclosure.phase).toBe("Y8C");
    expect(result.operatorRunbook.phase).toBe("Y8D");
    expect(result.goNoGoDecisionRecord.phase).toBe("Y8E");
    expect(result.schemaChangesAuthorized).toBe(false);
    expect(result.storageAuthorized).toBe(false);
    expect(result.auditWritingAllowed).toBe(false);
  });

  it("preserves lockdown flags and blocks activation", () => {
    const result = createY8FinalPreImplementationHumanApprovalSummary();
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.persistenceWritten).toBe(false);
    expect(result.providerActivationAllowed).toBe(false);
    expect(result.runtimeActivationAllowed).toBe(false);
    expect(result.executionAllowed).toBe(false);
  });

  it("blocks schema implementation, migrations, storage, audit writing, provider, runtime, execution, and production", () => {
    const result = createY8FinalPreImplementationHumanApprovalSummary({ schemaImplementationRequested: true, migrationRequested: true, storageRequested: true, auditWritingRequested: true, providerRequested: true, runtimeRequested: true, executionRequested: true, productionRequested: true });
    expect(result.status).toBe("final_pre_implementation_human_approval_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/schema implementation remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/audit writing remains unauthorized/);
    expect(result.blockedReasons.join(" ")).toMatch(/production rollout remains blocked/);
  });
});
