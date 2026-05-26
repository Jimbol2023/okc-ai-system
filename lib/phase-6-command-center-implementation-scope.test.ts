import { z6WorkdayFocusLanes } from "./z6-manual-revenue-workday-policy";
import { phase6WorkdayFocusSummaryStates } from "./phase-6-manual-workday-focus-policy";
import {
  assertPhase6CommandCenterImplementationScopeSafe,
  getPhase6CommandCenterImplementationScope,
  getPhase6CommandCenterImplementationScopeSummary,
  phase6CommandCenterImplementationLanes,
  phase6CommandCenterImplementationScopeFlags,
} from "./phase-6-command-center-implementation-scope";

describe("phase 6D command center implementation scope", () => {
  it("pins Phase 6D fields and preserves Phase 6C references", () => {
    const result = getPhase6CommandCenterImplementationScope();

    expect(result.phase).toBe("Phase 6: Daily Acquisition Command Center");
    expect(result.phaseStep).toBe("Phase 6D — Command Center Implementation Scope");
    expect(result.previousStep).toBe("Phase 6C — Manual Workday Focus Policy");
    expect(result.implementationScopeLanes).toEqual(phase6CommandCenterImplementationLanes);
    expect(result.workdayFocusLaneReferences).toEqual(z6WorkdayFocusLanes);
    expect(result.summaryStateReferences).toEqual(phase6WorkdayFocusSummaryStates);
  });

  it("cannot authorize command-center execution paths", () => {
    const result = getPhase6CommandCenterImplementationScope();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.taskDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.routingDecision).toBe("not_authorized");
    expect(result.assignmentDecision).toBe("not_authorized");
    expect(result.notificationDecision).toBe("not_authorized");
    expect(result.dailyPlanDecision).toBe("not_authorized");
    expect(result.auditDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 6E — Minimal Command Center Gate");
    expect(result.scopeRules.join(" ")).toMatch(/No implementation execution/i);
    expect(result.stopRules.join(" ")).toMatch(/not implementation execution/i);
    expect(result.flags.implementationScopeOnly).toBe(true);
  });

  it("summarizes implementation scope and blocked work", () => {
    const summary = getPhase6CommandCenterImplementationScopeSummary();

    expect(summary).toMatch(/Phase 6D/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/No implementation execution/i);
    expect(summary).toMatch(/no task, queue, routing, assignment/i);
    expect(summary).toMatch(/Phase 6E — Minimal Command Center Gate/i);
  });

  it("throws on missing lanes references blocked flag and unsafe wording", () => {
    const result = getPhase6CommandCenterImplementationScope();

    expect(() => assertPhase6CommandCenterImplementationScopeSafe({ ...result, implementationScopeLanes: phase6CommandCenterImplementationLanes.slice(0, -1) })).toThrow(/scope lanes/i);
    expect(() => assertPhase6CommandCenterImplementationScopeSafe({ ...result, workdayFocusLaneReferences: z6WorkdayFocusLanes.slice(0, -1) as never })).toThrow(/workday focus lane references/i);
    expect(() => assertPhase6CommandCenterImplementationScopeSafe({ ...result, summaryStateReferences: phase6WorkdayFocusSummaryStates.slice(0, -1) as never })).toThrow(/summary state references/i);
    expect(() => assertPhase6CommandCenterImplementationScopeSafe({ ...result, flags: { ...phase6CommandCenterImplementationScopeFlags, notificationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase6CommandCenterImplementationScopeSafe({ ...result, scopeRules: ["notification is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
