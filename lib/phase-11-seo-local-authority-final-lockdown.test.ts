import { phase11MinimalSeoLocalAuthorityGateChecks } from "./phase-11-minimal-seo-local-authority-gate";
import {
  assertPhase11SeoLocalAuthorityFinalLockdownSafe,
  getPhase11SeoLocalAuthorityFinalLockdown,
  getPhase11SeoLocalAuthorityFinalLockdownSummary,
  phase11SeoLocalAuthorityFinalLockdownFlags,
} from "./phase-11-seo-local-authority-final-lockdown";

describe("phase 11F SEO local authority final lockdown", () => {
  it("pins Phase 11F fields and recommends Phase 12", () => {
    const result = getPhase11SeoLocalAuthorityFinalLockdown();

    expect(result.phase).toBe("Phase 11: SEO & Local Authority Engine");
    expect(result.phaseStep).toBe("Phase 11F — SEO & Local Authority Final Lockdown");
    expect(result.previousStep).toBe("Phase 11E — Minimal SEO & Local Authority Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.gateReferences).toEqual(phase11MinimalSeoLocalAuthorityGateChecks);
    expect(result.recommendedNextExactStep).toBe("Phase 12 — Conversion Optimization Engine");
    expect(result.nextStageRecommendation).toBe("Phase 12 — Conversion Optimization Engine");
  });

  it("keeps all unsafe decisions and flags blocked", () => {
    const result = getPhase11SeoLocalAuthorityFinalLockdown();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.routeChangeEnabled).toBe(false);
    expect(result.flags.uiChangeEnabled).toBe(false);
    expect(result.flags.metadataChangeEnabled).toBe(false);
    expect(result.flags.contentPublishingEnabled).toBe(false);
    expect(result.flags.analyticsEnabled).toBe(false);
    expect(result.flags.scrapingEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.flags.phase12ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes final lockdown boundaries", () => {
    const summary = getPhase11SeoLocalAuthorityFinalLockdownSummary();

    expect(summary).toMatch(/locks Phase 11 SEO & Local Authority planning/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned content approval/i);
    expect(summary).toMatch(/No publishing/i);
    expect(summary).toMatch(/no route\/UI\/metadata changes/i);
    expect(summary).toMatch(/no external API\/fetch\/network behavior/i);
    expect(summary).toMatch(/Phase 12 — Conversion Optimization Engine/i);
  });

  it("throws on final-lockdown drift blocked flags and unsafe wording", () => {
    const result = getPhase11SeoLocalAuthorityFinalLockdown();

    expect(() => assertPhase11SeoLocalAuthorityFinalLockdownSafe({ ...result, phaseStep: "Phase 11F — Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase11SeoLocalAuthorityFinalLockdownSafe({ ...result, gateReferences: phase11MinimalSeoLocalAuthorityGateChecks.slice(0, -1) as never })).toThrow(/gate references/i);
    expect(() => assertPhase11SeoLocalAuthorityFinalLockdownSafe({ ...result, flags: { ...phase11SeoLocalAuthorityFinalLockdownFlags, phase12ImplementationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase11SeoLocalAuthorityFinalLockdownSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase11SeoLocalAuthorityFinalLockdownSafe({ ...result, lockdownRules: ["Phase 12 implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
