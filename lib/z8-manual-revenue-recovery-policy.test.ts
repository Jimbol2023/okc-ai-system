import { createZ8ManualRevenueRecoveryPolicyReview, z8ManualRevenueRecoveryFlags, z8RecoveryCoordinationLaneMetadata, z8RecoveryCoordinationLanes } from "./z8-manual-revenue-recovery-policy";

describe("Z8A manual revenue recovery policy", () => {
  it("defines deterministic advisory recovery coordination lanes", () => {
    expect(z8RecoveryCoordinationLanes).toEqual([
      "governance_stop",
      "blocked_recovery",
      "data_recovery_needed",
      "follow_up_recovery",
      "conversion_recovery",
      "buyer_disposition_recovery",
      "closing_recovery",
      "multi_bottleneck_recovery",
      "monitor_recovery",
      "no_recovery_terminal",
    ]);

    for (const lane of z8RecoveryCoordinationLanes) {
      const metadata = z8RecoveryCoordinationLaneMetadata[lane];
      expect(metadata.label).toBeTruthy();
      expect(metadata.manualMeaning).toBeTruthy();
      expect(metadata.revenuePurpose).toBeTruthy();
      expect(metadata.requiresHumanReview).toBe(true);
      expect(metadata.blockedExecutionBoundary).toMatch(/no recovery plan/i);
    }
  });

  it("preserves all Z8 lockdown flags", () => {
    const result = createZ8ManualRevenueRecoveryPolicyReview();
    expect(result.flags).toBe(z8ManualRevenueRecoveryFlags);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.queueCreated).toBe(false);
    expect(result.flags.workAssigned).toBe(false);
    expect(result.flags.calendarItemCreated).toBe(false);
    expect(result.flags.cleanupPersisted).toBe(false);
    expect(result.flags.enrichmentTriggered).toBe(false);
    expect(result.flags.scrapingTriggered).toBe(false);
    expect(result.flags.skipTraceTriggered).toBe(false);
    expect(result.flags.recoveryActionExecuted).toBe(false);
    expect(result.flags.recoveryPlanCreated).toBe(false);
    expect(result.flags.recoveryStepAssigned).toBe(false);
    expect(result.flags.recoverySequencePersisted).toBe(false);
    expect(result.flags.dependencyUpdated).toBe(false);
    expect(result.flags.handoffCreated).toBe(false);
    expect(result.flags.sellerRecoveryContacted).toBe(false);
    expect(result.flags.buyerRecoveryContacted).toBe(false);
    expect(result.flags.closingRecoveryContacted).toBe(false);
    expect(result.flags.recoveryCoordinationExecuted).toBe(false);
  });
});
