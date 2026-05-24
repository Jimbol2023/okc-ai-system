import { createZ2FinalCrmWorkflowClaritySummary } from "./z2-final-crm-workflow-clarity-summary";

describe("Z2F final CRM workflow clarity summary", () => {
  it("summarizes Z2A-D readiness and recommends Z3 next", () => {
    const result = createZ2FinalCrmWorkflowClaritySummary();
    expect(result.phase).toBe("Z2F");
    expect(result.taxonomyReadiness.phase).toBe("Z2A");
    expect(result.lifecycleHygieneReadiness.phase).toBe("Z2B");
    expect(result.manualNextActionReadiness.phase).toBe("Z2C");
    expect(result.workflowReadiness.phase).toBe("Z2D");
    expect(result.recommendedNextExactPhase).toBe("Z3 - Follow-Up Velocity");
    expect(result.z2Complete).toBe(true);
  });

  it("keeps all lockdown flags false and exposes unresolved blockers", () => {
    const result = createZ2FinalCrmWorkflowClaritySummary();
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.flags.schemaChangesAuthorized).toBe(false);
    expect(result.flags.migrationsAuthorized).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.autonomousStatusChangeAllowed).toBe(false);
    expect(result.flags.outboundCommunicationAllowed).toBe(false);
    expect(result.unresolvedBlockers.join(" ")).toMatch(/no CRM mutation authorization/);
  });
});
