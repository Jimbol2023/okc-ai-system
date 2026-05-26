import { phase11SeoLocalAuthorityFinalLockdownRules } from "./phase-11-seo-local-authority-final-lockdown";
import {
  assertPhase12ConversionOptimizationScopeSafe,
  getPhase12ConversionOptimizationScope,
  getPhase12ConversionOptimizationScopeSummary,
  phase12ConversionOptimizationForbiddenDrift,
  phase12ConversionOptimizationScopeFlags,
} from "./phase-12-conversion-optimization-scope";

describe("phase 12A conversion optimization scope", () => {
  it("pins Phase 12A fields and Phase 11F continuity", () => {
    const result = getPhase12ConversionOptimizationScope();

    expect(result.phase).toBe("Phase 12: Conversion Optimization Engine");
    expect(result.phaseStep).toBe("Phase 12A — Conversion Optimization Engine Scope");
    expect(result.previousStep).toBe("Phase 11F — SEO & Local Authority Final Lockdown");
    expect(result.phaseDecision).toBe("scope_only");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.phase11FinalLockdownReference.rules).toEqual(phase11SeoLocalAuthorityFinalLockdownRules);
    expect(result.recommendedNextExactStep).toBe("Phase 12B — Conversion Signal Audit");
  });

  it("keeps all execution decisions unauthorized and blocked flags false", () => {
    const result = getPhase12ConversionOptimizationScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.formChangeEnabled).toBe(false);
    expect(result.flags.uiChangeEnabled).toBe(false);
    expect(result.flags.analyticsEnabled).toBe(false);
    expect(result.flags.trackingEnabled).toBe(false);
    expect(result.flags.experimentEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
  });

  it("includes highest-aROI purpose boundaries and forbidden drift", () => {
    const result = getPhase12ConversionOptimizationScope();
    const text = [result.scopePurpose, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");

    expect(text).toMatch(/highest acquisition ROI per operator hour/i);
    expect(text).toMatch(/form friction/i);
    expect(text).toMatch(/content approval/i);
    expect(text).toMatch(/experiment approval/i);
    expect(phase12ConversionOptimizationForbiddenDrift).toContain("form changes");
    expect(phase12ConversionOptimizationForbiddenDrift).toContain("tracking pixels");
    expect(phase12ConversionOptimizationForbiddenDrift).toContain("Phase 13 implementation");
  });

  it("summarizes read-only conversion limits", () => {
    const summary = getPhase12ConversionOptimizationScopeSummary();

    expect(summary).toMatch(/Conversion Optimization scope/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned conversion judgment/i);
    expect(summary).toMatch(/No form changes/i);
    expect(summary).toMatch(/no UI changes/i);
    expect(summary).toMatch(/no analytics\/tracking/i);
    expect(summary).toMatch(/Phase 12B — Conversion Signal Audit/i);
  });

  it("throws on pinned drift blocked flag drift missing boundaries and unsafe wording", () => {
    const result = getPhase12ConversionOptimizationScope();

    expect(() => assertPhase12ConversionOptimizationScopeSafe({ ...result, phaseStep: "Phase 12A — Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase12ConversionOptimizationScopeSafe({ ...result, flags: { ...phase12ConversionOptimizationScopeFlags, experimentEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase12ConversionOptimizationScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase12ConversionOptimizationScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase12ConversionOptimizationScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase12ConversionOptimizationScopeSafe({ ...result, scopePurpose: ["form changes are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
