import {
  assertPhase14SocialAcquisitionImplementationScopeSafe,
  getPhase14SocialAcquisitionImplementationScope,
  getPhase14SocialAcquisitionImplementationScopeSummary,
  phase14SocialAcquisitionImplementationLanes,
  phase14SocialAcquisitionImplementationScopeFlags,
} from "./phase-14-social-acquisition-implementation-scope";

describe("phase 14D social acquisition implementation scope", () => {
  it("pins Phase 14D fields and references lanes, signals, and states", () => {
    const result = getPhase14SocialAcquisitionImplementationScope();

    expect(result.phaseStep).toBe("Phase 14D â€” Social Acquisition Implementation Scope");
    expect(result.previousStep).toBe("Phase 14C â€” Manual Social Acquisition Advisory Policy");
    expect(result.implementationLanes).toEqual(phase14SocialAcquisitionImplementationLanes);
    expect(result.policyLaneReferences).toContain("pixel_tracking_boundary_review");
    expect(result.summaryStateReferences).toContain("tracking_boundary_review_only");
    expect(result.recommendedNextExactStep).toBe("Phase 14E â€” Minimal Social Acquisition Gate");
  });

  it("scopes future visibility while blocking platform execution", () => {
    const result = getPhase14SocialAcquisitionImplementationScope();
    const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary].flat().join(" ");

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(text).toMatch(/read-only social acquisition visibility/i);
    expect(text).toMatch(/provider activation/i);
    expect(text).toMatch(/SDK imports/i);
    expect(text).toMatch(/webhooks/i);
    expect(text).toMatch(/ad account mutation/i);
    expect(text).toMatch(/lead import/i);
    expect(text).toMatch(/spend increases/i);
  });

  it("summarizes implementation scope limits", () => {
    const summary = getPhase14SocialAcquisitionImplementationScopeSummary();

    expect(summary).toMatch(/future read-only social acquisition visibility package/i);
    expect(summary).toMatch(/future implementation approval/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/no pixels\/tracking/i);
    expect(summary).toMatch(/Phase 14E â€” Minimal Social Acquisition Gate/i);
  });

  it("throws on implementation lane drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase14SocialAcquisitionImplementationScope();

    expect(() => assertPhase14SocialAcquisitionImplementationScopeSafe({ ...result, implementationLanes: [] as never })).toThrow(/implementation lanes/i);
    expect(() => assertPhase14SocialAcquisitionImplementationScopeSafe({ ...result, flags: { ...phase14SocialAcquisitionImplementationScopeFlags, webhookEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase14SocialAcquisitionImplementationScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase14SocialAcquisitionImplementationScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase14SocialAcquisitionImplementationScopeSafe({ ...result, scopeRules: ["API calls are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
