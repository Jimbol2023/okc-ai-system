import { phase6MinimalCommandCenterGateLanes } from "./phase-6-minimal-command-center-gate";
import {
  assertPhase6CommandCenterFinalLockdownSafe,
  getPhase6CommandCenterFinalLockdown,
  getPhase6CommandCenterFinalLockdownSummary,
  phase6CommandCenterFinalLockdownFlags,
} from "./phase-6-command-center-final-lockdown";

describe("phase 6F command center final lockdown", () => {
  it("pins Phase 6F fields and recommends Phase 7 only", () => {
    const result = getPhase6CommandCenterFinalLockdown();

    expect(result.phase).toBe("Phase 6: Daily Acquisition Command Center");
    expect(result.phaseStep).toBe("Phase 6F — Command Center Final Lockdown");
    expect(result.previousStep).toBe("Phase 6E — Minimal Command Center Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.phase6eGateReferences).toEqual(phase6MinimalCommandCenterGateLanes);
    expect(result.recommendedNextExactStep).toBe("Phase 7 — KPI & Revenue Intelligence");
    expect(result.nextStageRecommendation).toBe("Phase 7 — KPI & Revenue Intelligence");
  });

  it("enforces final lockdown decisions boundaries drift blocks and flags", () => {
    const result = getPhase6CommandCenterFinalLockdown();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.taskDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.routingDecision).toBe("not_authorized");
    expect(result.assignmentDecision).toBe("not_authorized");
    expect(result.notificationDecision).toBe("not_authorized");
    expect(result.dailyPlanDecision).toBe("not_authorized");
    expect(result.auditDecision).toBe("not_authorized");
    expect(result.finalLockdownRules.join(" ")).toMatch(/locks Phase 6/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not approve Phase 7 implementation/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/Phase 7 transition approval/i);
    expect(result.forbiddenDrift.join(" ")).toMatch(/queue creation/i);
    expect(result.flags.finalLockdownOnly).toBe(true);
    expect(result.flags.phase6LockdownEnforced).toBe(true);
    expect(result.flags.phase7ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes final lockdown and Phase 7 recommendation", () => {
    const summary = getPhase6CommandCenterFinalLockdownSummary();

    expect(summary).toMatch(/Phase 6F/i);
    expect(summary).toMatch(/final lockdown/i);
    expect(summary).toMatch(/human-owned daily work selection/i);
    expect(summary).toMatch(/No implementation/i);
    expect(summary).toMatch(/no task, queue, routing, assignment/i);
    expect(summary).toMatch(/revenue execution/i);
    expect(summary).toMatch(/Phase 7 — KPI & Revenue Intelligence/i);
  });

  it("throws on pinned drift reference drift blocked flag missing boundaries and unsafe wording", () => {
    const result = getPhase6CommandCenterFinalLockdown();

    expect(() => assertPhase6CommandCenterFinalLockdownSafe({ ...result, phaseStep: "Phase 7 — KPI & Revenue Intelligence" as never })).toThrow(/step must remain pinned/i);
    expect(() => assertPhase6CommandCenterFinalLockdownSafe({ ...result, phase6eGateReferences: phase6MinimalCommandCenterGateLanes.slice(0, -1) as never })).toThrow(/Phase 6E gate references/i);
    expect(() => assertPhase6CommandCenterFinalLockdownSafe({ ...result, flags: { ...phase6CommandCenterFinalLockdownFlags, goLiveAuthorized: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase6CommandCenterFinalLockdownSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase6CommandCenterFinalLockdownSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase6CommandCenterFinalLockdownSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase6CommandCenterFinalLockdownSafe({ ...result, finalLockdownRules: ["go-live is authorized"] })).toThrow(/rules|unsafe authorization/i);
  });
});
