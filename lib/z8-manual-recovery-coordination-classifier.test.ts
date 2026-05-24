import { classifyZ8ManualRecoveryCoordination } from "./z8-manual-recovery-coordination-classifier";

describe("Z8C manual recovery coordination classifier", () => {
  it("follows precedence for stop, blocked, terminal, and data recovery", () => {
    expect(classifyZ8ManualRecoveryCoordination({ governanceStop: true }).recoveryLane).toBe("governance_stop");
    expect(classifyZ8ManualRecoveryCoordination({ blocked: true }).recoveryLane).toBe("blocked_recovery");
    expect(classifyZ8ManualRecoveryCoordination({ terminal: true }).recoveryLane).toBe("no_recovery_terminal");
    expect(classifyZ8ManualRecoveryCoordination({ missingData: ["seller timeline"] }).recoveryLane).toBe("data_recovery_needed");
  });

  it("classifies closing, buyer, conversion, follow-up, multi-bottleneck, stalled monitor, and monitor lanes", () => {
    expect(classifyZ8ManualRecoveryCoordination({ closingRecoverySignal: true }).recoveryLane).toBe("closing_recovery");
    expect(classifyZ8ManualRecoveryCoordination({ buyerDispositionRecoverySignal: true }).recoveryLane).toBe("buyer_disposition_recovery");
    expect(classifyZ8ManualRecoveryCoordination({ conversionRecoverySignal: true }).recoveryLane).toBe("conversion_recovery");
    expect(classifyZ8ManualRecoveryCoordination({ followUpRecoverySignal: true }).recoveryLane).toBe("follow_up_recovery");
    expect(classifyZ8ManualRecoveryCoordination({ detectedBottlenecks: ["valuation bottleneck", "workflow stall"] }).recoveryLane).toBe("multi_bottleneck_recovery");
    expect(classifyZ8ManualRecoveryCoordination({ daysStalled: 14 }).recoveryLane).toBe("monitor_recovery");
    expect(classifyZ8ManualRecoveryCoordination({ cleanupLane: "monitor_only" }).recoveryLane).toBe("monitor_recovery");
  });

  it("keeps recovery score advisory and in-memory only", () => {
    const result = classifyZ8ManualRecoveryCoordination({ closingRecoverySignal: true, advisoryCleanupScore: 80 });
    expect(result.advisoryRecoveryScore).toBeGreaterThan(0);
    expect(result.flags.recoverySequencePersisted).toBe(false);
    expect(result.flags.dependencyUpdated).toBe(false);
    expect(result.flags.recoveryCoordinationExecuted).toBe(false);
  });
});
