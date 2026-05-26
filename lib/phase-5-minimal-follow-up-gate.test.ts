import { phase5FollowUpImplementationLanes } from "./phase-5-follow-up-implementation-scope";
import {
  assertPhase5MinimalFollowUpGateSafe,
  getPhase5MinimalFollowUpGate,
  getPhase5MinimalFollowUpGateSummary,
  phase5MinimalFollowUpGateFlags,
  phase5MinimalFollowUpGateLanes,
} from "./phase-5-minimal-follow-up-gate";

describe("phase 5E minimal follow-up gate", () => {
  it("pins Phase 5E fields and preserves Phase 5D references", () => {
    const result = getPhase5MinimalFollowUpGate();

    expect(result.phase).toBe("Phase 5: Follow-Up Organization System");
    expect(result.phaseStep).toBe("Phase 5E — Minimal Follow-Up Organization Gate");
    expect(result.previousStep).toBe("Phase 5D — Follow-Up Organization Implementation Scope");
    expect(result.phaseDecision).toBe("minimal_gate_only");
    expect(result.gateLanes).toEqual(phase5MinimalFollowUpGateLanes);
    expect(result.implementationScopeReferences).toEqual(phase5FollowUpImplementationLanes);
  });

  it("keeps minimal gate blocked from execution", () => {
    const result = getPhase5MinimalFollowUpGate();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.followUpCreationDecision).toBe("not_authorized");
    expect(result.taskDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.reminderDecision).toBe("not_authorized");
    expect(result.calendarDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 5F — Follow-Up Organization Final Lockdown");
    expect(result.gateRules.join(" ")).toMatch(/cannot authorize implementation/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not implement follow-up organization/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/final minimal package decision/i);
    expect(result.flags.minimalGateOnly).toBe(true);
  });

  it("summarizes gate and Phase 5F handoff", () => {
    const summary = getPhase5MinimalFollowUpGateSummary();

    expect(summary).toMatch(/Phase 5E/i);
    expect(summary).toMatch(/minimal internal follow-up organization package/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/No implementation/i);
    expect(summary).toMatch(/no message sending/i);
    expect(summary).toMatch(/Phase 5F — Follow-Up Organization Final Lockdown/i);
  });

  it("throws on missing lane reference drift blocked flag and unsafe wording", () => {
    const result = getPhase5MinimalFollowUpGate();

    expect(() => assertPhase5MinimalFollowUpGateSafe({ ...result, gateLanes: phase5MinimalFollowUpGateLanes.slice(0, -1) })).toThrow(/gate lanes/i);
    expect(() => assertPhase5MinimalFollowUpGateSafe({ ...result, implementationScopeReferences: phase5FollowUpImplementationLanes.slice(0, -1) as never })).toThrow(/scope references/i);
    expect(() => assertPhase5MinimalFollowUpGateSafe({ ...result, flags: { ...phase5MinimalFollowUpGateFlags, messageSendingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase5MinimalFollowUpGateSafe({ ...result, gateRules: ["message sending is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
