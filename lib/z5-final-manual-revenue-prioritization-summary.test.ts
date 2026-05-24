import { createZ5FinalManualRevenuePrioritizationSummary } from "./z5-final-manual-revenue-prioritization-summary";

describe("Z5F final manual revenue prioritization summary", () => {
  it("summarizes Z5 readiness and recommends Z6 next", () => {
    const result = createZ5FinalManualRevenuePrioritizationSummary();
    expect(result.phase).toBe("Z5F");
    expect(result.policyReadiness.phase).toBe("Z5A");
    expect(result.signalReadiness.phase).toBe("Z5B");
    expect(result.rankClassifierReadiness.phase).toBe("Z5C");
    expect(result.prioritizationSummaryReadiness.phase).toBe("Z5D");
    expect(result.recommendedNextExactPhase).toBe("Z6 - Manual Revenue Workday Focus");
    expect(result.z5Complete).toBe(true);
  });

  it("keeps execution, routing, assignment, persistence, and notifications blocked", () => {
    const result = createZ5FinalManualRevenuePrioritizationSummary();
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.queueCreated).toBe(false);
    expect(result.flags.conversionActionExecuted).toBe(false);
    expect(result.flags.workAssigned).toBe(false);
    expect(result.flags.queueItemCreated).toBe(false);
    expect(result.flags.priorityPersisted).toBe(false);
    expect(result.flags.rankPersisted).toBe(false);
    expect(result.flags.operatorTaskCreated).toBe(false);
    expect(result.flags.leadRouted).toBe(false);
    expect(result.flags.revenueActionExecuted).toBe(false);
    expect(result.flags.notificationCreated).toBe(false);
    expect(result.unresolvedBlockers.join(" ")).toMatch(/no priority persistence/);
  });
});
