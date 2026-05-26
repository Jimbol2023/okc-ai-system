import { manualFollowUpWorkspaceLanes } from "./manual-follow-up-workspace-usability";
import { z3ManualCadenceBands } from "./z3-follow-up-velocity-policy";
import { phase5FollowUpSignalFamilies } from "./phase-5-follow-up-signal-audit";
import {
  assertPhase5ManualFollowUpPolicySafe,
  getPhase5ManualFollowUpPolicy,
  getPhase5ManualFollowUpPolicySummary,
  phase5ManualFollowUpPolicyFlags,
} from "./phase-5-manual-follow-up-policy";

describe("phase 5C manual follow-up policy", () => {
  it("pins Phase 5C fields and includes all manual lanes and cadence bands", () => {
    const result = getPhase5ManualFollowUpPolicy();

    expect(result.phase).toBe("Phase 5: Follow-Up Organization System");
    expect(result.phaseStep).toBe("Phase 5C — Manual Follow-Up Organization Policy");
    expect(result.previousStep).toBe("Phase 5B — Follow-Up Signal Audit");
    expect(result.phaseDecision).toBe("manual_policy_only");
    expect(result.manualFollowUpLanes).toEqual(manualFollowUpWorkspaceLanes);
    expect(result.advisoryCadenceBands).toEqual(z3ManualCadenceBands);
    expect(result.signalReferences).toEqual(phase5FollowUpSignalFamilies);
  });

  it("blocks scheduling sending and artifact creation", () => {
    const result = getPhase5ManualFollowUpPolicy();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.followUpCreationDecision).toBe("not_authorized");
    expect(result.taskDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.reminderDecision).toBe("not_authorized");
    expect(result.calendarDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 5D — Follow-Up Organization Implementation Scope");
    expect(result.policyRules.join(" ")).toMatch(/visibility labels only/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not create follow-ups/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/final cadence judgment/i);
    expect(result.flags.policyOnly).toBe(true);
    expect(result.flags.scheduleWritingEnabled).toBe(false);
  });

  it("summarizes manual lanes cadence and safe boundaries", () => {
    const summary = getPhase5ManualFollowUpPolicySummary();

    expect(summary).toMatch(/Phase 5C/i);
    expect(summary).toMatch(/manual follow-up organization lanes/i);
    expect(summary).toMatch(/advisory cadence bands/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/no schedule writing/i);
    expect(summary).toMatch(/no message draft persistence/i);
    expect(summary).toMatch(/Phase 5D — Follow-Up Organization Implementation Scope/i);
  });

  it("throws on missing lanes cadence reference drift blocked flag and unsafe wording", () => {
    const result = getPhase5ManualFollowUpPolicy();

    expect(() => assertPhase5ManualFollowUpPolicySafe({ ...result, manualFollowUpLanes: manualFollowUpWorkspaceLanes.slice(0, -1) as never })).toThrow(/manual follow-up lanes/i);
    expect(() => assertPhase5ManualFollowUpPolicySafe({ ...result, advisoryCadenceBands: z3ManualCadenceBands.slice(0, -1) as never })).toThrow(/cadence bands/i);
    expect(() => assertPhase5ManualFollowUpPolicySafe({ ...result, signalReferences: phase5FollowUpSignalFamilies.slice(0, -1) as never })).toThrow(/signal references/i);
    expect(() => assertPhase5ManualFollowUpPolicySafe({ ...result, flags: { ...phase5ManualFollowUpPolicyFlags, scheduleWritingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase5ManualFollowUpPolicySafe({ ...result, policyRules: ["scheduling is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
