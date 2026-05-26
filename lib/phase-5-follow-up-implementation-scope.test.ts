import { manualFollowUpWorkspaceLanes } from "./manual-follow-up-workspace-usability";
import { z3ManualCadenceBands } from "./z3-follow-up-velocity-policy";
import {
  assertPhase5FollowUpImplementationScopeSafe,
  getPhase5FollowUpImplementationScope,
  getPhase5FollowUpImplementationScopeSummary,
  phase5FollowUpImplementationLanes,
  phase5FollowUpImplementationScopeFlags,
} from "./phase-5-follow-up-implementation-scope";

describe("phase 5D follow-up implementation scope", () => {
  it("pins Phase 5D fields and preserves Phase 5C references", () => {
    const result = getPhase5FollowUpImplementationScope();

    expect(result.phase).toBe("Phase 5: Follow-Up Organization System");
    expect(result.phaseStep).toBe("Phase 5D — Follow-Up Organization Implementation Scope");
    expect(result.previousStep).toBe("Phase 5C — Manual Follow-Up Organization Policy");
    expect(result.phaseDecision).toBe("implementation_scope_only");
    expect(result.implementationScopeLanes).toEqual(phase5FollowUpImplementationLanes);
    expect(result.manualFollowUpLaneReferences).toEqual(manualFollowUpWorkspaceLanes);
    expect(result.cadenceBandReferences).toEqual(z3ManualCadenceBands);
  });

  it("cannot authorize implementation CRM follow-up tasks queues reminders calendars or messages", () => {
    const result = getPhase5FollowUpImplementationScope();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.followUpCreationDecision).toBe("not_authorized");
    expect(result.taskDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.reminderDecision).toBe("not_authorized");
    expect(result.calendarDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 5E — Minimal Follow-Up Organization Gate");
    expect(result.scopeRules.join(" ")).toMatch(/No implementation execution/i);
    expect(result.stopRules.join(" ")).toMatch(/not implementation execution/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not implement UI routes APIs schema storage or CRM writes/i);
    expect(result.flags.implementationScopeOnly).toBe(true);
  });

  it("summarizes implementation scope and blocked work", () => {
    const summary = getPhase5FollowUpImplementationScopeSummary();

    expect(summary).toMatch(/Phase 5D/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/No implementation execution/i);
    expect(summary).toMatch(/no message sending/i);
    expect(summary).toMatch(/no schedule writing/i);
    expect(summary).toMatch(/Phase 5E — Minimal Follow-Up Organization Gate/i);
  });

  it("throws on missing lanes references blocked flag and unsafe wording", () => {
    const result = getPhase5FollowUpImplementationScope();

    expect(() => assertPhase5FollowUpImplementationScopeSafe({ ...result, implementationScopeLanes: phase5FollowUpImplementationLanes.slice(0, -1) })).toThrow(/scope lanes/i);
    expect(() => assertPhase5FollowUpImplementationScopeSafe({ ...result, manualFollowUpLaneReferences: manualFollowUpWorkspaceLanes.slice(0, -1) as never })).toThrow(/manual follow-up lane references/i);
    expect(() => assertPhase5FollowUpImplementationScopeSafe({ ...result, cadenceBandReferences: z3ManualCadenceBands.slice(0, -1) as never })).toThrow(/cadence band references/i);
    expect(() => assertPhase5FollowUpImplementationScopeSafe({ ...result, flags: { ...phase5FollowUpImplementationScopeFlags, calendarCreationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase5FollowUpImplementationScopeSafe({ ...result, scopeRules: ["calendar creation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
