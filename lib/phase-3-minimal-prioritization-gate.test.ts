import { phase3ImplementationScopeLanes } from "./phase-3-prioritization-engine-implementation-scope";
import {
  assertPhase3MinimalPrioritizationGateSafe,
  getPhase3MinimalPrioritizationGate,
  getPhase3MinimalPrioritizationGateSummary,
  phase3MinimalGateLanes,
  phase3MinimalPrioritizationGateFlags,
} from "./phase-3-minimal-prioritization-gate";

describe("phase 3E minimal prioritization gate", () => {
  it("pins Phase 3E fields and preserves Phase 3D implementation scope references", () => {
    const result = getPhase3MinimalPrioritizationGate();

    expect(result.phase).toBe("Phase 3: Lead Prioritization Engine");
    expect(result.phaseStep).toBe("Phase 3E — Minimal Prioritization Gate");
    expect(result.previousStep).toBe("Phase 3D — Prioritization Engine Implementation Scope");
    expect(result.phaseDecision).toBe("minimal_gate_only");
    expect(result.gateLanes).toEqual([
      "minimal_advisory_package",
      "operator_roi_review",
      "blocked_execution_paths",
      "phase_3f_lockdown_requirements",
    ]);
    expect(result.implementationScopeReferences).toEqual(phase3ImplementationScopeLanes);
  });

  it("cannot authorize implementation persistence routing queues outreach or go-live", () => {
    const result = getPhase3MinimalPrioritizationGate();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.scorePersistenceDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.routingDecision).toBe("not_authorized");
    expect(result.queueAssignmentDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 3F — Lead Prioritization Final Lockdown");
    expect(result.gateRules.join(" ")).toMatch(/cannot authorize implementation/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not authorize go-live/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/final minimal package decision/i);
    expect(result.flags.minimalGateOnly).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
  });

  it("summarizes the minimal gate and Phase 3F handoff", () => {
    const summary = getPhase3MinimalPrioritizationGateSummary();

    expect(summary).toMatch(/Phase 3E/i);
    expect(summary).toMatch(/minimal advisory prioritization package/i);
    expect(summary).toMatch(/No implementation/i);
    expect(summary).toMatch(/score persistence/i);
    expect(summary).toMatch(/Phase 3F — Lead Prioritization Final Lockdown/i);
  });

  it("throws on missing lane reference drift blocked flag and unsafe wording", () => {
    const result = getPhase3MinimalPrioritizationGate();

    expect(() => assertPhase3MinimalPrioritizationGateSafe({ ...result, gateLanes: phase3MinimalGateLanes.slice(0, -1) })).toThrow(/minimal gate lanes/i);
    expect(() => assertPhase3MinimalPrioritizationGateSafe({ ...result, implementationScopeReferences: phase3ImplementationScopeLanes.slice(0, -1) as never })).toThrow(/scope references/i);
    expect(() => assertPhase3MinimalPrioritizationGateSafe({ ...result, flags: { ...phase3MinimalPrioritizationGateFlags, implementationAuthorized: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase3MinimalPrioritizationGateSafe({ ...result, gateRules: ["implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
