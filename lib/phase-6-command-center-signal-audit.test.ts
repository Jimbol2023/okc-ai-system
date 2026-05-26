import {
  assertPhase6CommandCenterSignalAuditSafe,
  getPhase6CommandCenterSignalAudit,
  getPhase6CommandCenterSignalAuditSummary,
  phase6CommandCenterSignalAuditFlags,
  phase6CommandCenterSignalFamilies,
} from "./phase-6-command-center-signal-audit";

describe("phase 6B command center signal audit", () => {
  it("pins Phase 6B fields and includes all command-center signal families", () => {
    const result = getPhase6CommandCenterSignalAudit();

    expect(result.phase).toBe("Phase 6: Daily Acquisition Command Center");
    expect(result.phaseStep).toBe("Phase 6B — Command Center Signal Audit");
    expect(result.previousStep).toBe("Phase 6A — Daily Acquisition Command Center Scope");
    expect(result.phaseDecision).toBe("signal_audit_only");
    expect(result.signalFamilies).toEqual(phase6CommandCenterSignalFamilies);
  });

  it("blocks execution and hands off to Phase 6C", () => {
    const result = getPhase6CommandCenterSignalAudit();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.routingDecision).toBe("not_authorized");
    expect(result.assignmentDecision).toBe("not_authorized");
    expect(result.dailyPlanDecision).toBe("not_authorized");
    expect(result.auditDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 6C — Manual Workday Focus Policy");
    expect(result.auditPurpose.join(" ")).toMatch(/review-now, work-today, follow-up-today/i);
    expect(result.flags.signalAuditOnly).toBe(true);
    expect(result.flags.revenueExecutionEnabled).toBe(false);
  });

  it("summarizes signal audit and blocked command behavior", () => {
    const summary = getPhase6CommandCenterSignalAuditSummary();

    expect(summary).toMatch(/Phase 6B/i);
    expect(summary).toMatch(/Z6 workday focus/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/Human-owned daily work selection/i);
    expect(summary).toMatch(/No task, queue, routing, assignment/i);
    expect(summary).toMatch(/revenue execution/i);
  });

  it("throws on missing signals blocked flag missing boundaries and unsafe wording", () => {
    const result = getPhase6CommandCenterSignalAudit();

    expect(() => assertPhase6CommandCenterSignalAuditSafe({ ...result, signalFamilies: phase6CommandCenterSignalFamilies.slice(0, -1) })).toThrow(/signal families/i);
    expect(() => assertPhase6CommandCenterSignalAuditSafe({ ...result, flags: { ...phase6CommandCenterSignalAuditFlags, routingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase6CommandCenterSignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase6CommandCenterSignalAuditSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase6CommandCenterSignalAuditSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase6CommandCenterSignalAuditSafe({ ...result, auditPurpose: ["revenue execution is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
