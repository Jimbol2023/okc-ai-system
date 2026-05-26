import { phase11ManualLocalAuthorityLanes, phase11SeoLocalAuthoritySummaryStates } from "./phase-11-manual-local-authority-policy";
import {
  assertPhase11SeoLocalAuthorityImplementationScopeSafe,
  getPhase11SeoLocalAuthorityImplementationScope,
  getPhase11SeoLocalAuthorityImplementationScopeSummary,
  phase11SeoLocalAuthorityImplementationLanes,
  phase11SeoLocalAuthorityImplementationScopeFlags,
} from "./phase-11-seo-local-authority-implementation-scope";
import { phase11SeoLocalAuthoritySignalFamilies } from "./phase-11-seo-local-authority-signal-audit";

describe("phase 11D SEO local authority implementation scope", () => {
  it("pins Phase 11D fields and references prior policy unchanged", () => {
    const result = getPhase11SeoLocalAuthorityImplementationScope();

    expect(result.phase).toBe("Phase 11: SEO & Local Authority Engine");
    expect(result.phaseStep).toBe("Phase 11D — SEO & Local Authority Implementation Scope");
    expect(result.previousStep).toBe("Phase 11C — Manual Local Authority Advisory Policy");
    expect(result.phaseDecision).toBe("implementation_scope_only");
    expect(result.implementationLanes).toEqual(phase11SeoLocalAuthorityImplementationLanes);
    expect(result.signalReferences).toEqual(phase11SeoLocalAuthoritySignalFamilies);
    expect(result.policyLaneReferences).toEqual(phase11ManualLocalAuthorityLanes);
    expect(result.summaryStateReferences).toEqual(phase11SeoLocalAuthoritySummaryStates);
  });

  it("cannot authorize implementation publishing sitemap robots analytics campaigns or go-live", () => {
    const result = getPhase11SeoLocalAuthorityImplementationScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.contentPublishingEnabled).toBe(false);
    expect(result.flags.sitemapChangeEnabled).toBe(false);
    expect(result.flags.robotsChangeEnabled).toBe(false);
    expect(result.flags.analyticsEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.flags.auditWritingEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 11E — Minimal SEO & Local Authority Gate");
  });

  it("summarizes future scope without execution", () => {
    const summary = getPhase11SeoLocalAuthorityImplementationScopeSummary();

    expect(summary).toMatch(/possible future read-only SEO\/local authority package/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/future implementation approval/i);
    expect(summary).toMatch(/No publishing/i);
    expect(summary).toMatch(/no route\/UI\/metadata changes/i);
    expect(summary).toMatch(/no spend increase/i);
  });

  it("throws on missing lanes references blocked flags and unsafe wording", () => {
    const result = getPhase11SeoLocalAuthorityImplementationScope();

    expect(() => assertPhase11SeoLocalAuthorityImplementationScopeSafe({ ...result, implementationLanes: phase11SeoLocalAuthorityImplementationLanes.slice(0, -1) as never })).toThrow(/implementation lanes/i);
    expect(() => assertPhase11SeoLocalAuthorityImplementationScopeSafe({ ...result, policyLaneReferences: phase11ManualLocalAuthorityLanes.slice(0, -1) as never })).toThrow(/policy lane references/i);
    expect(() => assertPhase11SeoLocalAuthorityImplementationScopeSafe({ ...result, flags: { ...phase11SeoLocalAuthorityImplementationScopeFlags, seoCrawlerEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase11SeoLocalAuthorityImplementationScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase11SeoLocalAuthorityImplementationScopeSafe({ ...result, scopeRules: ["implementation execution is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
