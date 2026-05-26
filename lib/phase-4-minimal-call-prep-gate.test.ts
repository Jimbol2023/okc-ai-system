import { phase4CallPrepImplementationLanes } from "./phase-4-call-prep-implementation-scope";
import {
  assertPhase4MinimalCallPrepGateSafe,
  getPhase4MinimalCallPrepGate,
  getPhase4MinimalCallPrepGateSummary,
  phase4MinimalCallPrepGateFlags,
  phase4MinimalCallPrepGateLanes,
} from "./phase-4-minimal-call-prep-gate";

describe("phase 4E minimal call prep gate", () => {
  it("pins Phase 4E fields and preserves Phase 4D references", () => {
    const result = getPhase4MinimalCallPrepGate();

    expect(result.phase).toBe("Phase 4: Seller Review & Call Prep");
    expect(result.phaseStep).toBe("Phase 4E — Minimal Call Prep Gate");
    expect(result.previousStep).toBe("Phase 4D — Call Prep Implementation Scope");
    expect(result.phaseDecision).toBe("minimal_gate_only");
    expect(result.gateLanes).toEqual([
      "minimal_internal_call_prep_package",
      "operator_roi_review",
      "contact_safety_review",
      "blocked_execution_paths",
      "phase_4f_lockdown_requirements",
    ]);
    expect(result.implementationScopeReferences).toEqual(phase4CallPrepImplementationLanes);
  });

  it("keeps minimal gate blocked from execution", () => {
    const result = getPhase4MinimalCallPrepGate();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.sellerCallMutationDecision).toBe("not_authorized");
    expect(result.followUpCreationDecision).toBe("not_authorized");
    expect(result.reminderCreationDecision).toBe("not_authorized");
    expect(result.outreachDecision).toBe("not_authorized");
    expect(result.callingDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 4F — Seller Review Final Lockdown");
    expect(result.gateRules.join(" ")).toMatch(/cannot authorize implementation/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not contact or call sellers/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/final minimal package decision/i);
    expect(result.flags.minimalGateOnly).toBe(true);
  });

  it("summarizes gate and Phase 4F handoff", () => {
    const summary = getPhase4MinimalCallPrepGateSummary();

    expect(summary).toMatch(/Phase 4E/i);
    expect(summary).toMatch(/minimal internal call-prep package/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/No implementation/i);
    expect(summary).toMatch(/no calling/i);
    expect(summary).toMatch(/Phase 4F — Seller Review Final Lockdown/i);
  });

  it("throws on missing lane reference drift blocked flag and unsafe wording", () => {
    const result = getPhase4MinimalCallPrepGate();

    expect(() => assertPhase4MinimalCallPrepGateSafe({ ...result, gateLanes: phase4MinimalCallPrepGateLanes.slice(0, -1) })).toThrow(/gate lanes/i);
    expect(() => assertPhase4MinimalCallPrepGateSafe({ ...result, implementationScopeReferences: phase4CallPrepImplementationLanes.slice(0, -1) as never })).toThrow(/scope references/i);
    expect(() => assertPhase4MinimalCallPrepGateSafe({ ...result, flags: { ...phase4MinimalCallPrepGateFlags, followUpCreationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase4MinimalCallPrepGateSafe({ ...result, gateRules: ["follow-up creation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
