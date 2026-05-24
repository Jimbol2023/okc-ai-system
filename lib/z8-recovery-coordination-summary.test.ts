import { createZ8RecoveryCoordinationList, createZ8RecoveryCoordinationSummary } from "./z8-recovery-coordination-summary";

describe("Z8D recovery coordination summary", () => {
  it("maps summary states from recovery lanes", () => {
    expect(createZ8RecoveryCoordinationSummary({ governanceStop: true }).summaryState).toBe("stop_before_recovery");
    expect(createZ8RecoveryCoordinationSummary({ missingData: ["source"] }).summaryState).toBe("recovery_dependency_cleanup");
    expect(createZ8RecoveryCoordinationSummary({ closingRecoverySignal: true }).summaryState).toBe("recover_now");
    expect(createZ8RecoveryCoordinationSummary({ conversionRecoverySignal: true }).summaryState).toBe("recover_today");
    expect(createZ8RecoveryCoordinationSummary({ detectedBottlenecks: ["valuation bottleneck", "workflow stall"] }).summaryState).toBe("recover_this_week");
    expect(createZ8RecoveryCoordinationSummary({ cleanupLane: "monitor_only" }).summaryState).toBe("monitor_recovery");
    expect(createZ8RecoveryCoordinationSummary({ terminal: true }).summaryState).toBe("no_recovery_terminal");
    expect(createZ8RecoveryCoordinationSummary({}).summaryState).toBe("not_ready");
  });

  it("sorts list output deterministically without mutating input", () => {
    const inputs = [
      { id: "c", label: "Monitor", cleanupLane: "monitor_only" },
      { id: "a", label: "Closing", closingRecoverySignal: true, advisoryCleanupScore: 80 },
      { id: "b", label: "Stop", governanceStop: true },
    ];
    const before = JSON.stringify(inputs);
    const result = createZ8RecoveryCoordinationList(inputs);
    expect(JSON.stringify(inputs)).toBe(before);
    expect(result.ranked[0]?.inputId).toBe("b");
    expect(result.ranked[1]?.inputId).toBe("a");
    expect(result.countsBySummaryState.stop_before_recovery).toBe(1);
    expect(result.flags.recoveryPlanCreated).toBe(false);
    expect(result.flags.handoffCreated).toBe(false);
  });
});
