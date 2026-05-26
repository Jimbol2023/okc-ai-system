import { phase5MinimalFollowUpGateLanes } from "./phase-5-minimal-follow-up-gate";
import {
  assertPhase5FollowUpFinalLockdownSafe,
  getPhase5FollowUpFinalLockdown,
  getPhase5FollowUpFinalLockdownSummary,
  phase5FollowUpFinalLockdownFlags,
} from "./phase-5-follow-up-final-lockdown";

describe("phase 5F follow-up final lockdown", () => {
  it("pins Phase 5F fields and recommends Phase 6 only", () => {
    const result = getPhase5FollowUpFinalLockdown();

    expect(result.phase).toBe("Phase 5: Follow-Up Organization System");
    expect(result.phaseStep).toBe("Phase 5F — Follow-Up Organization Final Lockdown");
    expect(result.previousStep).toBe("Phase 5E — Minimal Follow-Up Organization Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.phase5eGateReferences).toEqual(phase5MinimalFollowUpGateLanes);
    expect(result.recommendedNextExactStep).toBe("Phase 6 — Daily Acquisition Command Center");
    expect(result.nextStageRecommendation).toBe("Phase 6 — Daily Acquisition Command Center");
  });

  it("enforces final lockdown decisions boundaries drift blocks and flags", () => {
    const result = getPhase5FollowUpFinalLockdown();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.followUpCreationDecision).toBe("not_authorized");
    expect(result.taskDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.reminderDecision).toBe("not_authorized");
    expect(result.calendarDecision).toBe("not_authorized");
    expect(result.finalLockdownRules.join(" ")).toMatch(/locks Phase 5/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not approve Phase 6 implementation/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/Phase 6 transition approval/i);
    expect(result.forbiddenDrift.join(" ")).toMatch(/queue creation/i);
    expect(result.flags.finalLockdownOnly).toBe(true);
    expect(result.flags.phase5LockdownEnforced).toBe(true);
    expect(result.flags.phase6ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes final lockdown and Phase 6 recommendation", () => {
    const summary = getPhase5FollowUpFinalLockdownSummary();

    expect(summary).toMatch(/Phase 5F/i);
    expect(summary).toMatch(/final lockdown/i);
    expect(summary).toMatch(/human-owned follow-up judgment/i);
    expect(summary).toMatch(/No implementation/i);
    expect(summary).toMatch(/no message sending/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/Phase 6 — Daily Acquisition Command Center/i);
  });

  it("throws on pinned drift reference drift blocked flag missing boundaries and unsafe wording", () => {
    const result = getPhase5FollowUpFinalLockdown();

    expect(() => assertPhase5FollowUpFinalLockdownSafe({ ...result, phaseStep: "Phase 6 — Daily Acquisition Command Center" as never })).toThrow(/step must remain pinned/i);
    expect(() => assertPhase5FollowUpFinalLockdownSafe({ ...result, phase5eGateReferences: phase5MinimalFollowUpGateLanes.slice(0, -1) as never })).toThrow(/Phase 5E gate references/i);
    expect(() => assertPhase5FollowUpFinalLockdownSafe({ ...result, flags: { ...phase5FollowUpFinalLockdownFlags, goLiveAuthorized: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase5FollowUpFinalLockdownSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase5FollowUpFinalLockdownSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase5FollowUpFinalLockdownSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase5FollowUpFinalLockdownSafe({ ...result, finalLockdownRules: ["go-live is authorized"] })).toThrow(/rules|unsafe authorization/i);
  });
});
