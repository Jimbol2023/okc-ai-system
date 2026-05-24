import { reviewZ8RecoveryCoordinationSignals } from "./z8-recovery-coordination-signal-review";

describe("Z8B recovery coordination signal review", () => {
  it("detects stop, blocked, terminal, and data dependency signals", () => {
    expect(reviewZ8RecoveryCoordinationSignals({ governanceStop: true }).recoverySignalLevel).toBe("governance_stop");
    expect(reviewZ8RecoveryCoordinationSignals({ doNotContact: true }).recoverySignalLevel).toBe("blocked_recovery");
    expect(reviewZ8RecoveryCoordinationSignals({ terminal: true }).recoverySignalLevel).toBe("terminal");
    expect(reviewZ8RecoveryCoordinationSignals({ missingData: ["closing date"] }).recoverySignalLevel).toBe("data_recovery_needed");
  });

  it("detects recovery opportunity signals", () => {
    expect(reviewZ8RecoveryCoordinationSignals({ followUpRecoverySignal: true }).recoverySignalLevel).toBe("follow_up_recovery");
    expect(reviewZ8RecoveryCoordinationSignals({ conversionRecoverySignal: true }).recoverySignalLevel).toBe("conversion_recovery");
    expect(reviewZ8RecoveryCoordinationSignals({ buyerDispositionRecoverySignal: true }).recoverySignalLevel).toBe("buyer_disposition_recovery");
    expect(reviewZ8RecoveryCoordinationSignals({ closingRecoverySignal: true }).recoverySignalLevel).toBe("closing_recovery");
    expect(reviewZ8RecoveryCoordinationSignals({ detectedBottlenecks: ["follow-up bottleneck", "conversion bottleneck"] }).recoverySignalLevel).toBe("conversion_recovery");
    expect(reviewZ8RecoveryCoordinationSignals({ daysStalled: 12 }).recoverySignalLevel).toBe("stalled_monitor_recovery");
    expect(reviewZ8RecoveryCoordinationSignals({ cleanupLane: "monitor_only" }).recoverySignalLevel).toBe("monitor_recovery");
  });

  it("does not authorize recovery coordination behavior", () => {
    const result = reviewZ8RecoveryCoordinationSignals({ closingRecoverySignal: true });
    expect(result.flags.recoveryPlanCreated).toBe(false);
    expect(result.flags.recoveryStepAssigned).toBe(false);
    expect(result.flags.recoverySequencePersisted).toBe(false);
    expect(result.flags.dependencyUpdated).toBe(false);
    expect(result.flags.sellerRecoveryContacted).toBe(false);
    expect(result.flags.buyerRecoveryContacted).toBe(false);
    expect(result.flags.closingRecoveryContacted).toBe(false);
    expect(result.flags.recoveryCoordinationExecuted).toBe(false);
  });
});
