import { phase3MinimalGateLanes } from "./phase-3-minimal-prioritization-gate";
import {
  assertPhase3LeadPrioritizationFinalLockdownSafe,
  getPhase3LeadPrioritizationFinalLockdown,
  getPhase3LeadPrioritizationFinalLockdownSummary,
  phase3LeadPrioritizationFinalLockdownFlags,
} from "./phase-3-lead-prioritization-final-lockdown";

describe("phase 3F lead prioritization final lockdown", () => {
  it("pins Phase 3F fields and recommends Phase 4 only", () => {
    const result = getPhase3LeadPrioritizationFinalLockdown();

    expect(result.phase).toBe("Phase 3: Lead Prioritization Engine");
    expect(result.phaseStep).toBe("Phase 3F — Lead Prioritization Final Lockdown");
    expect(result.previousStep).toBe("Phase 3E — Minimal Prioritization Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.phase3eGateReferences).toEqual(phase3MinimalGateLanes);
    expect(result.recommendedNextExactStep).toBe("Phase 4 — Seller Review & Call Prep");
    expect(result.nextStageRecommendation).toBe("Phase 4 — Seller Review & Call Prep");
  });

  it("enforces final lockdown decisions boundaries drift blocks and flags", () => {
    const result = getPhase3LeadPrioritizationFinalLockdown();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.scorePersistenceDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.routingDecision).toBe("not_authorized");
    expect(result.queueAssignmentDecision).toBe("not_authorized");
    expect(result.finalLockdownRules.join(" ")).toMatch(/locks Phase 3/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not approve Phase 4 implementation/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/Phase 4 transition approval/i);
    expect(result.forbiddenDrift.join(" ")).toMatch(/score persistence/i);
    expect(result.flags.finalLockdownOnly).toBe(true);
    expect(result.flags.phase3LockdownEnforced).toBe(true);
    expect(result.flags.phase4ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes final lockdown and Phase 4 recommendation", () => {
    const summary = getPhase3LeadPrioritizationFinalLockdownSummary();

    expect(summary).toMatch(/Phase 3F/i);
    expect(summary).toMatch(/final lockdown/i);
    expect(summary).toMatch(/No implementation/i);
    expect(summary).toMatch(/score persistence/i);
    expect(summary).toMatch(/Phase 4 — Seller Review & Call Prep/i);
  });

  it("throws on pinned drift reference drift blocked flag missing boundaries and unsafe wording", () => {
    const result = getPhase3LeadPrioritizationFinalLockdown();

    expect(() => assertPhase3LeadPrioritizationFinalLockdownSafe({ ...result, phaseStep: "Phase 4 — Seller Review & Call Prep" as never })).toThrow(/step must remain pinned/i);
    expect(() => assertPhase3LeadPrioritizationFinalLockdownSafe({ ...result, phase3eGateReferences: phase3MinimalGateLanes.slice(0, -1) as never })).toThrow(/Phase 3E gate references/i);
    expect(() => assertPhase3LeadPrioritizationFinalLockdownSafe({ ...result, flags: { ...phase3LeadPrioritizationFinalLockdownFlags, goLiveAuthorized: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase3LeadPrioritizationFinalLockdownSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase3LeadPrioritizationFinalLockdownSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase3LeadPrioritizationFinalLockdownSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase3LeadPrioritizationFinalLockdownSafe({ ...result, finalLockdownRules: ["go-live is authorized"] })).toThrow(/rules|unsafe authorization/i);
  });
});
