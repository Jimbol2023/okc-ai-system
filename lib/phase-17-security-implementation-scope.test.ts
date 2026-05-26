import {
  assertPhase17SecurityImplementationScopeSafe,
  getPhase17SecurityImplementationScope,
  getPhase17SecurityImplementationScopeSummary,
  phase17SecurityImplementationLanes,
  phase17SecurityImplementationScopeFlags,
} from "./phase-17-security-implementation-scope";

describe("phase 17D security implementation scope", () => {
  it("pins Phase 17D fields and references lanes signals and states", () => {
    const result = getPhase17SecurityImplementationScope();

    expect(result.phaseStep).toBe("Phase 17D â€” Security Implementation Scope");
    expect(result.previousStep).toBe("Phase 17C â€” Manual Security Review Advisory Policy");
    expect(result.implementationLanes).toEqual(phase17SecurityImplementationLanes);
    expect(result.policyLaneReferences).toContain("manual_pentest_scope_review");
    expect(result.summaryStateReferences).toContain("manual_pentest_scope_only");
    expect(result.recommendedNextExactStep).toBe("Phase 17E â€” Minimal Security Gate");
  });

  it("scopes future visibility while blocking security execution", () => {
    const result = getPhase17SecurityImplementationScope();
    const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary].flat().join(" ");

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(text).toMatch(/read-only security visibility/i);
    expect(text).toMatch(/pentests/i);
    expect(text).toMatch(/scans/i);
    expect(text).toMatch(/credential reads/i);
    expect(text).toMatch(/remediation/i);
    expect(text).toMatch(/go-live/i);
  });

  it("summarizes implementation scope limits", () => {
    const summary = getPhase17SecurityImplementationScopeSummary();

    expect(summary).toMatch(/future read-only security visibility package/i);
    expect(summary).toMatch(/future implementation approval/i);
    expect(summary).toMatch(/No live pentesting/i);
    expect(summary).toMatch(/no auth\/security mutation/i);
    expect(summary).toMatch(/Phase 17E â€” Minimal Security Gate/i);
  });

  it("throws on implementation lane drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase17SecurityImplementationScope();

    expect(() => assertPhase17SecurityImplementationScopeSafe({ ...result, implementationLanes: [] as never })).toThrow(/implementation lanes/i);
    expect(() => assertPhase17SecurityImplementationScopeSafe({ ...result, flags: { ...phase17SecurityImplementationScopeFlags, networkEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase17SecurityImplementationScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase17SecurityImplementationScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase17SecurityImplementationScopeSafe({ ...result, scopeRules: ["network calls are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
