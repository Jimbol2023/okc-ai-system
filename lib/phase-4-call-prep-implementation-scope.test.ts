import { phase4CallPrepAdvisoryLanes } from "./phase-4-call-prep-advisory-policy";
import {
  assertPhase4CallPrepImplementationScopeSafe,
  getPhase4CallPrepImplementationScope,
  getPhase4CallPrepImplementationScopeSummary,
  phase4CallPrepImplementationLanes,
  phase4CallPrepImplementationScopeFlags,
} from "./phase-4-call-prep-implementation-scope";

describe("phase 4D call prep implementation scope", () => {
  it("pins Phase 4D fields and preserves Phase 4C advisory references", () => {
    const result = getPhase4CallPrepImplementationScope();

    expect(result.phase).toBe("Phase 4: Seller Review & Call Prep");
    expect(result.phaseStep).toBe("Phase 4D — Call Prep Implementation Scope");
    expect(result.previousStep).toBe("Phase 4C — Call Prep Advisory Policy");
    expect(result.phaseDecision).toBe("implementation_scope_only");
    expect(result.implementationScopeLanes).toEqual([
      "candidate_seller_context_summary",
      "candidate_question_prep_visibility",
      "candidate_safety_and_missing_data_review",
      "blocked_execution_and_mutation_paths",
      "phase_4e_gate_requirements",
    ]);
    expect(result.advisoryLaneReferences).toEqual(phase4CallPrepAdvisoryLanes);
  });

  it("cannot authorize implementation CRM seller-call follow-up queue outreach or providers", () => {
    const result = getPhase4CallPrepImplementationScope();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.sellerCallMutationDecision).toBe("not_authorized");
    expect(result.followUpCreationDecision).toBe("not_authorized");
    expect(result.reminderCreationDecision).toBe("not_authorized");
    expect(result.outreachDecision).toBe("not_authorized");
    expect(result.callingDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 4E — Minimal Call Prep Gate");
    expect(result.scopeRules.join(" ")).toMatch(/No implementation execution/i);
    expect(result.stopRules.join(" ")).toMatch(/not implementation execution/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not implement UI routes APIs schema storage or CRM writes/i);
    expect(result.flags.implementationScopeOnly).toBe(true);
  });

  it("summarizes implementation scope and blocked work", () => {
    const summary = getPhase4CallPrepImplementationScopeSummary();

    expect(summary).toMatch(/Phase 4D/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/No implementation execution/i);
    expect(summary).toMatch(/no calling/i);
    expect(summary).toMatch(/no seller-call mutation/i);
    expect(summary).toMatch(/Phase 4E — Minimal Call Prep Gate/i);
  });

  it("throws on missing lane reference drift blocked flag and unsafe wording", () => {
    const result = getPhase4CallPrepImplementationScope();

    expect(() => assertPhase4CallPrepImplementationScopeSafe({ ...result, implementationScopeLanes: phase4CallPrepImplementationLanes.slice(0, -1) })).toThrow(/scope lanes/i);
    expect(() => assertPhase4CallPrepImplementationScopeSafe({ ...result, advisoryLaneReferences: phase4CallPrepAdvisoryLanes.slice(0, -1) as never })).toThrow(/advisory lanes/i);
    expect(() => assertPhase4CallPrepImplementationScopeSafe({ ...result, flags: { ...phase4CallPrepImplementationScopeFlags, reminderCreationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase4CallPrepImplementationScopeSafe({ ...result, scopeRules: ["seller-call record mutation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
