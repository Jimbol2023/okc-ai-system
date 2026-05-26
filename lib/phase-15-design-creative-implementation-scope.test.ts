import {
  assertPhase15DesignCreativeImplementationScopeSafe,
  getPhase15DesignCreativeImplementationScope,
  getPhase15DesignCreativeImplementationScopeSummary,
  phase15DesignCreativeImplementationLanes,
  phase15DesignCreativeImplementationScopeFlags,
} from "./phase-15-design-creative-implementation-scope";

describe("phase 15D design creative implementation scope", () => {
  it("pins Phase 15D fields and references lanes signals and states", () => {
    const result = getPhase15DesignCreativeImplementationScope();

    expect(result.phaseStep).toBe("Phase 15D â€” Design & Creative Implementation Scope");
    expect(result.previousStep).toBe("Phase 15C â€” Manual Design & Creative Advisory Policy");
    expect(result.implementationLanes).toEqual(phase15DesignCreativeImplementationLanes);
    expect(result.policyLaneReferences).toContain("asset_and_image_usage_risk_review");
    expect(result.summaryStateReferences).toContain("asset_usage_risk_visible");
    expect(result.recommendedNextExactStep).toBe("Phase 15E â€” Minimal Design & Creative Gate");
  });

  it("scopes future visibility while blocking design execution", () => {
    const result = getPhase15DesignCreativeImplementationScope();
    const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary].flat().join(" ");

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(text).toMatch(/read-only design\/creative visibility/i);
    expect(text).toMatch(/route\/UI\/form\/content\/metadata/i);
    expect(text).toMatch(/asset\/logo\/image changes/i);
    expect(text).toMatch(/campaigns/i);
    expect(text).toMatch(/audit writing/i);
    expect(text).toMatch(/go-live/i);
  });

  it("summarizes implementation scope limits", () => {
    const summary = getPhase15DesignCreativeImplementationScopeSummary();

    expect(summary).toMatch(/future read-only design\/creative visibility package/i);
    expect(summary).toMatch(/future implementation approval/i);
    expect(summary).toMatch(/No UI changes/i);
    expect(summary).toMatch(/no asset\/logo\/theme edits/i);
    expect(summary).toMatch(/Phase 15E â€” Minimal Design & Creative Gate/i);
  });

  it("throws on implementation lane drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase15DesignCreativeImplementationScope();

    expect(() => assertPhase15DesignCreativeImplementationScopeSafe({ ...result, implementationLanes: [] as never })).toThrow(/implementation lanes/i);
    expect(() => assertPhase15DesignCreativeImplementationScopeSafe({ ...result, flags: { ...phase15DesignCreativeImplementationScopeFlags, assetChangeEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase15DesignCreativeImplementationScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase15DesignCreativeImplementationScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase15DesignCreativeImplementationScopeSafe({ ...result, scopeRules: ["asset edits are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
