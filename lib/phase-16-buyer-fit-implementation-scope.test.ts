import {
  assertPhase16BuyerFitImplementationScopeSafe,
  getPhase16BuyerFitImplementationScope,
  getPhase16BuyerFitImplementationScopeSummary,
  phase16BuyerFitImplementationLanes,
  phase16BuyerFitImplementationScopeFlags,
} from "./phase-16-buyer-fit-implementation-scope";

describe("phase 16D buyer fit implementation scope", () => {
  it("pins Phase 16D fields and references lanes signals and states", () => {
    const result = getPhase16BuyerFitImplementationScope();

    expect(result.phaseStep).toBe("Phase 16D â€” Buyer Fit Implementation Scope");
    expect(result.previousStep).toBe("Phase 16C â€” Manual Buyer Fit Advisory Policy");
    expect(result.implementationLanes).toEqual(phase16BuyerFitImplementationLanes);
    expect(result.policyLaneReferences).toContain("deal_package_readiness_review");
    expect(result.summaryStateReferences).toContain("deal_package_not_ready");
    expect(result.recommendedNextExactStep).toBe("Phase 16E â€” Minimal Buyer Fit Gate");
  });

  it("scopes future visibility while blocking buyer-fit execution", () => {
    const result = getPhase16BuyerFitImplementationScope();
    const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary].flat().join(" ");

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(text).toMatch(/read-only buyer-fit visibility/i);
    expect(text).toMatch(/buyer mutation/i);
    expect(text).toMatch(/score persistence/i);
    expect(text).toMatch(/matching/i);
    expect(text).toMatch(/deal package sending/i);
    expect(text).toMatch(/go-live/i);
  });

  it("summarizes implementation scope limits", () => {
    const summary = getPhase16BuyerFitImplementationScopeSummary();

    expect(summary).toMatch(/future read-only buyer-fit visibility package/i);
    expect(summary).toMatch(/future implementation approval/i);
    expect(summary).toMatch(/No buyer outreach/i);
    expect(summary).toMatch(/no assignment\/contract generation/i);
    expect(summary).toMatch(/Phase 16E â€” Minimal Buyer Fit Gate/i);
  });

  it("throws on implementation lane drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase16BuyerFitImplementationScope();

    expect(() => assertPhase16BuyerFitImplementationScopeSafe({ ...result, implementationLanes: [] as never })).toThrow(/implementation lanes/i);
    expect(() => assertPhase16BuyerFitImplementationScopeSafe({ ...result, flags: { ...phase16BuyerFitImplementationScopeFlags, buyerRecordMutationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase16BuyerFitImplementationScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase16BuyerFitImplementationScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase16BuyerFitImplementationScopeSafe({ ...result, scopeRules: ["buyer mutation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
