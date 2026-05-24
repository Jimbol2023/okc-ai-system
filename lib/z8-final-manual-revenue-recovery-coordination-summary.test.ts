import { createZ8FinalManualRevenueRecoveryCoordinationSummary } from "./z8-final-manual-revenue-recovery-coordination-summary";

describe("Z8F final manual revenue recovery coordination summary", () => {
  it("summarizes Z8 readiness and recommends Z9 next", () => {
    const result = createZ8FinalManualRevenueRecoveryCoordinationSummary();
    expect(result.phase).toBe("Z8F");
    expect(result.policyReadiness.phase).toBe("Z8A");
    expect(result.signalReviewReadiness.phase).toBe("Z8B");
    expect(result.classifierReadiness.phase).toBe("Z8C");
    expect(result.recoverySummaryReadiness.phase).toBe("Z8D");
    expect(result.recommendedNextExactPhase).toBe("Z9 - Manual Revenue Risk Review");
    expect(result.z8Complete).toBe(true);
  });

  it("keeps recovery persistence, contact, and execution blocked", () => {
    const result = createZ8FinalManualRevenueRecoveryCoordinationSummary();
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.workAssigned).toBe(false);
    expect(result.flags.queueItemCreated).toBe(false);
    expect(result.flags.calendarItemCreated).toBe(false);
    expect(result.flags.cleanupPersisted).toBe(false);
    expect(result.flags.recoveryPlanCreated).toBe(false);
    expect(result.flags.recoveryStepAssigned).toBe(false);
    expect(result.flags.recoverySequencePersisted).toBe(false);
    expect(result.flags.dependencyUpdated).toBe(false);
    expect(result.flags.handoffCreated).toBe(false);
    expect(result.flags.sellerRecoveryContacted).toBe(false);
    expect(result.flags.buyerRecoveryContacted).toBe(false);
    expect(result.flags.closingRecoveryContacted).toBe(false);
    expect(result.flags.recoveryCoordinationExecuted).toBe(false);
    expect(result.unresolvedBlockers.join(" ")).toMatch(/no recovery plan persistence/);
    expect(result.unresolvedBlockers.join(" ")).toMatch(/no seller\/buyer\/closing contact/);
  });
});
