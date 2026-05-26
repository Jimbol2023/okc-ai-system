import {
  assertPhase11ManualLocalAuthorityPolicySafe,
  getPhase11ManualLocalAuthorityPolicy,
  getPhase11ManualLocalAuthorityPolicySummary,
  phase11ManualLocalAuthorityLanes,
  phase11ManualLocalAuthorityPolicyFlags,
  phase11SeoLocalAuthoritySummaryStates,
} from "./phase-11-manual-local-authority-policy";
import { phase11SeoLocalAuthoritySignalFamilies } from "./phase-11-seo-local-authority-signal-audit";

describe("phase 11C manual local authority policy", () => {
  it("pins Phase 11C fields and includes local authority lanes and summary states", () => {
    const result = getPhase11ManualLocalAuthorityPolicy();

    expect(result.phase).toBe("Phase 11: SEO & Local Authority Engine");
    expect(result.phaseStep).toBe("Phase 11C — Manual Local Authority Advisory Policy");
    expect(result.previousStep).toBe("Phase 11B — SEO & Local Authority Signal Audit");
    expect(result.localAuthorityLanes).toEqual(phase11ManualLocalAuthorityLanes);
    expect(result.summaryStates).toEqual(phase11SeoLocalAuthoritySummaryStates);
    expect(result.signalReferences).toEqual(phase11SeoLocalAuthoritySignalFamilies);
    expect(result.localAuthorityLanes).toContain("stop_compliance_and_truthfulness_first");
    expect(result.localAuthorityLanes).toContain("operator_content_focus_review");
    expect(result.summaryStates).toContain("truthfulness_review_required");
  });

  it("blocks publishing route UI metadata analytics rank tracking scraping campaigns and spend", () => {
    const result = getPhase11ManualLocalAuthorityPolicy();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.contentPublishingEnabled).toBe(false);
    expect(result.flags.routeChangeEnabled).toBe(false);
    expect(result.flags.uiChangeEnabled).toBe(false);
    expect(result.flags.metadataChangeEnabled).toBe(false);
    expect(result.flags.analyticsEnabled).toBe(false);
    expect(result.flags.rankTrackingEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 11D — SEO & Local Authority Implementation Scope");
  });

  it("summarizes manual policy boundaries", () => {
    const summary = getPhase11ManualLocalAuthorityPolicySummary();

    expect(summary).toMatch(/manual local authority lanes/i);
    expect(summary).toMatch(/summary states/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/local-market claim verification/i);
    expect(summary).toMatch(/No publishing/i);
    expect(summary).toMatch(/no CRM mutation/i);
  });

  it("throws on lane state reference drift blocked flag and unsafe wording", () => {
    const result = getPhase11ManualLocalAuthorityPolicy();

    expect(() => assertPhase11ManualLocalAuthorityPolicySafe({ ...result, localAuthorityLanes: phase11ManualLocalAuthorityLanes.slice(0, -1) as never })).toThrow(/lanes/i);
    expect(() => assertPhase11ManualLocalAuthorityPolicySafe({ ...result, summaryStates: phase11SeoLocalAuthoritySummaryStates.slice(0, -1) as never })).toThrow(/summary states/i);
    expect(() => assertPhase11ManualLocalAuthorityPolicySafe({ ...result, signalReferences: phase11SeoLocalAuthoritySignalFamilies.slice(0, -1) as never })).toThrow(/signal references/i);
    expect(() => assertPhase11ManualLocalAuthorityPolicySafe({ ...result, flags: { ...phase11ManualLocalAuthorityPolicyFlags, metadataChangeEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase11ManualLocalAuthorityPolicySafe({ ...result, policyRules: ["page/content publishing is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
