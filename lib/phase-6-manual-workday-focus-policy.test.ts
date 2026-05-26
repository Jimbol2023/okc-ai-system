import { z6WorkdayFocusLanes } from "./z6-manual-revenue-workday-policy";
import { phase6CommandCenterSignalFamilies } from "./phase-6-command-center-signal-audit";
import {
  assertPhase6ManualWorkdayFocusPolicySafe,
  getPhase6ManualWorkdayFocusPolicy,
  getPhase6ManualWorkdayFocusPolicySummary,
  phase6ManualWorkdayFocusPolicyFlags,
  phase6WorkdayFocusSummaryStates,
} from "./phase-6-manual-workday-focus-policy";

describe("phase 6C manual workday focus policy", () => {
  it("pins Phase 6C fields and includes all Z6 lanes and summary states", () => {
    const result = getPhase6ManualWorkdayFocusPolicy();

    expect(result.phase).toBe("Phase 6: Daily Acquisition Command Center");
    expect(result.phaseStep).toBe("Phase 6C — Manual Workday Focus Policy");
    expect(result.previousStep).toBe("Phase 6B — Command Center Signal Audit");
    expect(result.workdayFocusLanes).toEqual(z6WorkdayFocusLanes);
    expect(result.summaryStates).toEqual(phase6WorkdayFocusSummaryStates);
    expect(result.signalReferences).toEqual(phase6CommandCenterSignalFamilies);
  });

  it("blocks workday execution artifacts", () => {
    const result = getPhase6ManualWorkdayFocusPolicy();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.taskDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.routingDecision).toBe("not_authorized");
    expect(result.assignmentDecision).toBe("not_authorized");
    expect(result.notificationDecision).toBe("not_authorized");
    expect(result.dailyPlanDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 6D — Command Center Implementation Scope");
    expect(result.policyRules.join(" ")).toMatch(/visibility labels only/i);
    expect(result.flags.policyOnly).toBe(true);
    expect(result.flags.dailyPlanPersistenceEnabled).toBe(false);
  });

  it("summarizes lanes states and safe boundaries", () => {
    const summary = getPhase6ManualWorkdayFocusPolicySummary();

    expect(summary).toMatch(/Phase 6C/i);
    expect(summary).toMatch(/manual workday focus lanes/i);
    expect(summary).toMatch(/summary states/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/revenue execution/i);
    expect(summary).toMatch(/Phase 6D — Command Center Implementation Scope/i);
  });

  it("throws on missing lanes states reference drift blocked flag and unsafe wording", () => {
    const result = getPhase6ManualWorkdayFocusPolicy();

    expect(() => assertPhase6ManualWorkdayFocusPolicySafe({ ...result, workdayFocusLanes: z6WorkdayFocusLanes.slice(0, -1) as never })).toThrow(/workday focus lanes/i);
    expect(() => assertPhase6ManualWorkdayFocusPolicySafe({ ...result, summaryStates: phase6WorkdayFocusSummaryStates.slice(0, -1) as never })).toThrow(/summary states/i);
    expect(() => assertPhase6ManualWorkdayFocusPolicySafe({ ...result, signalReferences: phase6CommandCenterSignalFamilies.slice(0, -1) as never })).toThrow(/signal references/i);
    expect(() => assertPhase6ManualWorkdayFocusPolicySafe({ ...result, flags: { ...phase6ManualWorkdayFocusPolicyFlags, taskCreationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase6ManualWorkdayFocusPolicySafe({ ...result, policyRules: ["task creation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
