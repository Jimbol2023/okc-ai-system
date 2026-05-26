import { phase6CommandCenterImplementationLanes } from "./phase-6-command-center-implementation-scope";
import {
  assertPhase6MinimalCommandCenterGateSafe,
  getPhase6MinimalCommandCenterGate,
  getPhase6MinimalCommandCenterGateSummary,
  phase6MinimalCommandCenterGateFlags,
  phase6MinimalCommandCenterGateLanes,
} from "./phase-6-minimal-command-center-gate";

describe("phase 6E minimal command center gate", () => {
  it("pins Phase 6E fields and preserves Phase 6D references", () => {
    const result = getPhase6MinimalCommandCenterGate();

    expect(result.phase).toBe("Phase 6: Daily Acquisition Command Center");
    expect(result.phaseStep).toBe("Phase 6E — Minimal Command Center Gate");
    expect(result.previousStep).toBe("Phase 6D — Command Center Implementation Scope");
    expect(result.gateLanes).toEqual(phase6MinimalCommandCenterGateLanes);
    expect(result.implementationScopeReferences).toEqual(phase6CommandCenterImplementationLanes);
  });

  it("keeps minimal gate blocked from execution", () => {
    const result = getPhase6MinimalCommandCenterGate();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.taskDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.routingDecision).toBe("not_authorized");
    expect(result.assignmentDecision).toBe("not_authorized");
    expect(result.notificationDecision).toBe("not_authorized");
    expect(result.dailyPlanDecision).toBe("not_authorized");
    expect(result.auditDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 6F — Command Center Final Lockdown");
    expect(result.gateRules.join(" ")).toMatch(/cannot authorize implementation/i);
    expect(result.flags.minimalGateOnly).toBe(true);
  });

  it("summarizes gate and Phase 6F handoff", () => {
    const summary = getPhase6MinimalCommandCenterGateSummary();

    expect(summary).toMatch(/Phase 6E/i);
    expect(summary).toMatch(/minimal internal command-center package/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/No implementation/i);
    expect(summary).toMatch(/revenue execution/i);
    expect(summary).toMatch(/Phase 6F — Command Center Final Lockdown/i);
  });

  it("throws on missing lane reference drift blocked flag and unsafe wording", () => {
    const result = getPhase6MinimalCommandCenterGate();

    expect(() => assertPhase6MinimalCommandCenterGateSafe({ ...result, gateLanes: phase6MinimalCommandCenterGateLanes.slice(0, -1) })).toThrow(/gate lanes/i);
    expect(() => assertPhase6MinimalCommandCenterGateSafe({ ...result, implementationScopeReferences: phase6CommandCenterImplementationLanes.slice(0, -1) as never })).toThrow(/scope references/i);
    expect(() => assertPhase6MinimalCommandCenterGateSafe({ ...result, flags: { ...phase6MinimalCommandCenterGateFlags, dailyPlanPersistenceEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase6MinimalCommandCenterGateSafe({ ...result, gateRules: ["daily plan persistence is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
