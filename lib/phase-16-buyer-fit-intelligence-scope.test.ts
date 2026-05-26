import { phase15DesignCreativeFinalLockdownRules } from "./phase-15-design-creative-final-lockdown";
import {
  assertPhase16BuyerFitIntelligenceScopeSafe,
  getPhase16BuyerFitIntelligenceScope,
  getPhase16BuyerFitIntelligenceScopeSummary,
  phase16BuyerFitForbiddenDrift,
  phase16BuyerFitIntelligenceScopeFlags,
} from "./phase-16-buyer-fit-intelligence-scope";

describe("phase 16A buyer fit intelligence scope", () => {
  it("pins Phase 16A fields and Phase 15F continuity", () => {
    const result = getPhase16BuyerFitIntelligenceScope();

    expect(result.phase).toBe("Phase 16: Buyer Fit Intelligence");
    expect(result.phaseStep).toBe("Phase 16A â€” Buyer Fit Intelligence Scope");
    expect(result.previousStep).toBe("Phase 15F â€” Design & Creative Final Lockdown");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.phase15FinalLockdownReference.rules).toEqual(phase15DesignCreativeFinalLockdownRules);
    expect(result.recommendedNextExactStep).toBe("Phase 16B â€” Buyer Fit Signal Audit");
  });

  it("keeps buyer execution decisions unauthorized and blocked flags false", () => {
    const result = getPhase16BuyerFitIntelligenceScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.buyerRecordMutationEnabled).toBe(false);
    expect(result.flags.buyerActivityMutationEnabled).toBe(false);
    expect(result.flags.matchingExecutionEnabled).toBe(false);
    expect(result.flags.scorePersistenceEnabled).toBe(false);
    expect(result.flags.assignmentGenerationEnabled).toBe(false);
    expect(result.flags.buyerOutreachEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("includes highest-aROI purpose, human ownership, and forbidden drift", () => {
    const result = getPhase16BuyerFitIntelligenceScope();
    const text = [result.scopePurpose, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");

    expect(text).toMatch(/highest acquisition ROI per operator hour/i);
    expect(text).toMatch(/buyer profile fit/i);
    expect(text).toMatch(/buyer relationship ownership/i);
    expect(text).toMatch(/deal-package approval/i);
    expect(text).toMatch(/assignment judgment/i);
    expect(phase16BuyerFitForbiddenDrift).toContain("deal package sending");
    expect(phase16BuyerFitForbiddenDrift).toContain("buyer score persistence");
    expect(phase16BuyerFitForbiddenDrift).toContain("Phase 17 implementation");
  });

  it("summarizes read-only buyer-fit limits", () => {
    const summary = getPhase16BuyerFitIntelligenceScopeSummary();

    expect(summary).toMatch(/Buyer Fit Intelligence scope/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned buyer-fit judgment/i);
    expect(summary).toMatch(/No buyer outreach/i);
    expect(summary).toMatch(/no deal blasting/i);
    expect(summary).toMatch(/no assignment\/contract generation/i);
    expect(summary).toMatch(/Phase 16B â€” Buyer Fit Signal Audit/i);
  });

  it("throws on pinned drift, blocked flag drift, missing boundaries, and unsafe wording", () => {
    const result = getPhase16BuyerFitIntelligenceScope();

    expect(() => assertPhase16BuyerFitIntelligenceScopeSafe({ ...result, phaseStep: "Phase 16A â€” Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase16BuyerFitIntelligenceScopeSafe({ ...result, flags: { ...phase16BuyerFitIntelligenceScopeFlags, buyerOutreachEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase16BuyerFitIntelligenceScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase16BuyerFitIntelligenceScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase16BuyerFitIntelligenceScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase16BuyerFitIntelligenceScopeSafe({ ...result, scopePurpose: ["buyer outreach is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
