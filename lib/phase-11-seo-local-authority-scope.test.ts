import { phase10VirtualD4dFinalLockdownRules } from "./phase-10-virtual-d4d-final-lockdown";
import {
  assertPhase11SeoLocalAuthorityScopeSafe,
  getPhase11SeoLocalAuthorityScope,
  getPhase11SeoLocalAuthorityScopeSummary,
  phase11SeoLocalAuthorityForbiddenDrift,
  phase11SeoLocalAuthorityScopeFlags,
} from "./phase-11-seo-local-authority-scope";

describe("phase 11A SEO local authority scope", () => {
  it("pins Phase 11A fields and Phase 10F continuity", () => {
    const result = getPhase11SeoLocalAuthorityScope();

    expect(result.phase).toBe("Phase 11: SEO & Local Authority Engine");
    expect(result.phaseStep).toBe("Phase 11A — SEO & Local Authority Engine Scope");
    expect(result.previousStep).toBe("Phase 10F — Virtual D4D Final Lockdown");
    expect(result.phaseDecision).toBe("scope_only");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.phase10FinalLockdownReference.rules).toEqual(phase10VirtualD4dFinalLockdownRules);
    expect(result.recommendedNextExactStep).toBe("Phase 11B — SEO & Local Authority Signal Audit");
  });

  it("keeps all execution decisions unauthorized and blocked flags false", () => {
    const result = getPhase11SeoLocalAuthorityScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.routeChangeEnabled).toBe(false);
    expect(result.flags.uiChangeEnabled).toBe(false);
    expect(result.flags.metadataChangeEnabled).toBe(false);
    expect(result.flags.contentPublishingEnabled).toBe(false);
    expect(result.flags.analyticsEnabled).toBe(false);
    expect(result.flags.scrapingEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
  });

  it("includes highest-aROI purpose boundaries and forbidden drift", () => {
    const result = getPhase11SeoLocalAuthorityScope();
    const text = [result.scopePurpose, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");

    expect(text).toMatch(/highest acquisition ROI per operator hour/i);
    expect(text).toMatch(/local-market claim/i);
    expect(text).toMatch(/content approval/i);
    expect(text).toMatch(/publishing approval/i);
    expect(phase11SeoLocalAuthorityForbiddenDrift).toContain("metadata changes");
    expect(phase11SeoLocalAuthorityForbiddenDrift).toContain("page/content publishing");
    expect(phase11SeoLocalAuthorityForbiddenDrift).toContain("Phase 12 implementation");
  });

  it("summarizes read-only SEO authority limits", () => {
    const summary = getPhase11SeoLocalAuthorityScopeSummary();

    expect(summary).toMatch(/SEO & Local Authority scope/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned content approval/i);
    expect(summary).toMatch(/No publishing/i);
    expect(summary).toMatch(/no route changes/i);
    expect(summary).toMatch(/no metadata changes/i);
    expect(summary).toMatch(/no external API\/fetch\/network behavior/i);
    expect(summary).toMatch(/Phase 11B — SEO & Local Authority Signal Audit/i);
  });

  it("throws on pinned drift blocked flag drift missing boundaries and unsafe wording", () => {
    const result = getPhase11SeoLocalAuthorityScope();

    expect(() => assertPhase11SeoLocalAuthorityScopeSafe({ ...result, phaseStep: "Phase 11A — Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase11SeoLocalAuthorityScopeSafe({ ...result, flags: { ...phase11SeoLocalAuthorityScopeFlags, contentPublishingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase11SeoLocalAuthorityScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase11SeoLocalAuthorityScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase11SeoLocalAuthorityScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase11SeoLocalAuthorityScopeSafe({ ...result, scopePurpose: ["metadata changes are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
