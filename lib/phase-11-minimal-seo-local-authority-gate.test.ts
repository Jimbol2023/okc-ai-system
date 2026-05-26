import { phase11ManualLocalAuthorityLanes } from "./phase-11-manual-local-authority-policy";
import {
  assertPhase11MinimalSeoLocalAuthorityGateSafe,
  getPhase11MinimalSeoLocalAuthorityGate,
  getPhase11MinimalSeoLocalAuthorityGateSummary,
  phase11MinimalSeoLocalAuthorityGateChecks,
  phase11MinimalSeoLocalAuthorityGateFlags,
} from "./phase-11-minimal-seo-local-authority-gate";
import { phase11SeoLocalAuthorityImplementationLanes } from "./phase-11-seo-local-authority-implementation-scope";

describe("phase 11E minimal SEO local authority gate", () => {
  it("pins Phase 11E fields and includes gate checks", () => {
    const result = getPhase11MinimalSeoLocalAuthorityGate();

    expect(result.phase).toBe("Phase 11: SEO & Local Authority Engine");
    expect(result.phaseStep).toBe("Phase 11E — Minimal SEO & Local Authority Gate");
    expect(result.previousStep).toBe("Phase 11D — SEO & Local Authority Implementation Scope");
    expect(result.phaseDecision).toBe("minimal_gate_only");
    expect(result.gateChecks).toEqual(phase11MinimalSeoLocalAuthorityGateChecks);
    expect(result.implementationLaneReferences).toEqual(phase11SeoLocalAuthorityImplementationLanes);
    expect(result.policyLaneReferences).toEqual(phase11ManualLocalAuthorityLanes);
    expect(result.gateChecks).toContain("no_route_ui_metadata_publishing_boundary_required");
  });

  it("blocks implementation publishing metadata analytics scraping external APIs campaigns and spend", () => {
    const result = getPhase11MinimalSeoLocalAuthorityGate();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.contentPublishingEnabled).toBe(false);
    expect(result.flags.metadataChangeEnabled).toBe(false);
    expect(result.flags.analyticsEnabled).toBe(false);
    expect(result.flags.scrapingEnabled).toBe(false);
    expect(result.flags.externalApiEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 11F — SEO & Local Authority Final Lockdown");
  });

  it("summarizes minimal gate boundaries", () => {
    const summary = getPhase11MinimalSeoLocalAuthorityGateSummary();

    expect(summary).toMatch(/minimal read-only SEO\/local authority package/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/content approval/i);
    expect(summary).toMatch(/No publishing/i);
    expect(summary).toMatch(/no external API\/fetch\/network behavior/i);
    expect(summary).toMatch(/Phase 11F — SEO & Local Authority Final Lockdown/i);
  });

  it("throws on missing gate checks references blocked flags and unsafe wording", () => {
    const result = getPhase11MinimalSeoLocalAuthorityGate();

    expect(() => assertPhase11MinimalSeoLocalAuthorityGateSafe({ ...result, gateChecks: phase11MinimalSeoLocalAuthorityGateChecks.slice(0, -1) as never })).toThrow(/gate checks/i);
    expect(() => assertPhase11MinimalSeoLocalAuthorityGateSafe({ ...result, implementationLaneReferences: phase11SeoLocalAuthorityImplementationLanes.slice(0, -1) as never })).toThrow(/implementation lane references/i);
    expect(() => assertPhase11MinimalSeoLocalAuthorityGateSafe({ ...result, flags: { ...phase11MinimalSeoLocalAuthorityGateFlags, campaignEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase11MinimalSeoLocalAuthorityGateSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase11MinimalSeoLocalAuthorityGateSafe({ ...result, gateRules: ["spend increases are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
