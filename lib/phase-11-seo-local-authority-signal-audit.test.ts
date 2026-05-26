import {
  assertPhase11SeoLocalAuthoritySignalAuditSafe,
  getPhase11SeoLocalAuthoritySignalAudit,
  getPhase11SeoLocalAuthoritySignalAuditSummary,
  phase11SeoLocalAuthoritySignalAuditFlags,
  phase11SeoLocalAuthoritySignalFamilies,
} from "./phase-11-seo-local-authority-signal-audit";

describe("phase 11B SEO local authority signal audit", () => {
  it("pins Phase 11B fields and includes repo-grounded signal families", () => {
    const result = getPhase11SeoLocalAuthoritySignalAudit();

    expect(result.phase).toBe("Phase 11: SEO & Local Authority Engine");
    expect(result.phaseStep).toBe("Phase 11B — SEO & Local Authority Signal Audit");
    expect(result.previousStep).toBe("Phase 11A — SEO & Local Authority Engine Scope");
    expect(result.phaseDecision).toBe("signal_audit_only");
    expect(result.signalFamilies).toEqual(phase11SeoLocalAuthoritySignalFamilies);
    expect(result.signalFamilies).toContain("public_homepage_contact_sell_your_house_public_layout_and_homepage_content");
    expect(result.signalFamilies).toContain("r80_research_boundary_no_scraping_geocoding_external_api_provider_lead_creation_contact_automation");
    expect(result.groundedReferences.publicRoutes).toContain("/sell-your-house");
    expect(result.groundedReferences.homepageContent.trustPoints.join(" ")).toMatch(/Oklahoma City/i);
  });

  it("blocks publishing route UI metadata analytics scraping network campaigns and spend", () => {
    const result = getPhase11SeoLocalAuthoritySignalAudit();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.contentPublishingEnabled).toBe(false);
    expect(result.flags.routeChangeEnabled).toBe(false);
    expect(result.flags.metadataChangeEnabled).toBe(false);
    expect(result.flags.analyticsEnabled).toBe(false);
    expect(result.flags.rankTrackingEnabled).toBe(false);
    expect(result.flags.scrapingEnabled).toBe(false);
    expect(result.flags.externalApiEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 11C — Manual Local Authority Advisory Policy");
  });

  it("summarizes existing signal audit boundaries", () => {
    const summary = getPhase11SeoLocalAuthoritySignalAuditSummary();

    expect(summary).toMatch(/audits existing public website/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/content approval/i);
    expect(summary).toMatch(/No publishing/i);
    expect(summary).toMatch(/no route\/UI\/metadata changes/i);
    expect(summary).toMatch(/no CRM mutation/i);
  });

  it("throws on missing signal families blocked flags and unsafe wording", () => {
    const result = getPhase11SeoLocalAuthoritySignalAudit();

    expect(() => assertPhase11SeoLocalAuthoritySignalAuditSafe({ ...result, signalFamilies: phase11SeoLocalAuthoritySignalFamilies.slice(0, -1) as never })).toThrow(/signal families/i);
    expect(() => assertPhase11SeoLocalAuthoritySignalAuditSafe({ ...result, flags: { ...phase11SeoLocalAuthoritySignalAuditFlags, analyticsEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase11SeoLocalAuthoritySignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase11SeoLocalAuthoritySignalAuditSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase11SeoLocalAuthoritySignalAuditSafe({ ...result, auditPurpose: ["rank tracking is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
