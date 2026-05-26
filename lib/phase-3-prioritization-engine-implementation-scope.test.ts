import { phase3AdvisoryPriorityLanes } from "./phase-3-advisory-prioritization-policy";
import {
  assertPhase3PrioritizationImplementationScopeSafe,
  getPhase3PrioritizationImplementationScope,
  getPhase3PrioritizationImplementationScopeSummary,
  phase3ImplementationScopeLanes,
  phase3PrioritizationImplementationScopeFlags,
} from "./phase-3-prioritization-engine-implementation-scope";

describe("phase 3D prioritization engine implementation scope", () => {
  it("pins Phase 3D fields and preserves Phase 3C advisory references", () => {
    const result = getPhase3PrioritizationImplementationScope();

    expect(result.phase).toBe("Phase 3: Lead Prioritization Engine");
    expect(result.phaseStep).toBe("Phase 3D — Prioritization Engine Implementation Scope");
    expect(result.previousStep).toBe("Phase 3C — Advisory Prioritization Policy");
    expect(result.phaseDecision).toBe("implementation_scope_only");
    expect(result.implementationScopeLanes).toEqual([
      "candidate_advisory_priority_surface",
      "candidate_operator_review_explanation",
      "blocked_mutation_and_routing_paths",
      "phase_3e_gate_requirements",
    ]);
    expect(result.advisoryLaneReferences).toEqual(phase3AdvisoryPriorityLanes);
  });

  it("keeps future implementation scope read-only and blocked", () => {
    const result = getPhase3PrioritizationImplementationScope();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.scorePersistenceDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.routingDecision).toBe("not_authorized");
    expect(result.queueAssignmentDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 3E — Minimal Prioritization Gate");
    expect(result.scopeRules.join(" ")).toMatch(/No persisted scoring/i);
    expect(result.scopeRules.join(" ")).toMatch(/automated routing/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not implement scoring/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/final implementation approval/i);
    expect(result.flags.implementationScopeOnly).toBe(true);
    expect(result.flags.automatedRoutingEnabled).toBe(false);
  });

  it("summarizes blocked implementation scope", () => {
    const summary = getPhase3PrioritizationImplementationScopeSummary();

    expect(summary).toMatch(/Phase 3D/i);
    expect(summary).toMatch(/future advisory prioritization only/i);
    expect(summary).toMatch(/No persisted scoring/i);
    expect(summary).toMatch(/automated routing/i);
    expect(summary).toMatch(/Phase 3E — Minimal Prioritization Gate/i);
  });

  it("throws on missing lane reference drift blocked flag and unsafe wording", () => {
    const result = getPhase3PrioritizationImplementationScope();

    expect(() => assertPhase3PrioritizationImplementationScopeSafe({ ...result, implementationScopeLanes: phase3ImplementationScopeLanes.slice(0, -1) })).toThrow(/scope lanes/i);
    expect(() => assertPhase3PrioritizationImplementationScopeSafe({ ...result, advisoryLaneReferences: phase3AdvisoryPriorityLanes.slice(0, -1) as never })).toThrow(/advisory lanes/i);
    expect(() => assertPhase3PrioritizationImplementationScopeSafe({ ...result, flags: { ...phase3PrioritizationImplementationScopeFlags, automatedRoutingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase3PrioritizationImplementationScopeSafe({ ...result, scopeRules: ["automated routing is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
