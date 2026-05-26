import {
  assertPhase15DesignCreativeSignalAuditSafe,
  getPhase15DesignCreativeSignalAudit,
  getPhase15DesignCreativeSignalAuditSummary,
  phase15DesignCreativeSignalAuditFlags,
  phase15DesignCreativeSignalFamilies,
} from "./phase-15-design-creative-signal-audit";

describe("phase 15B design creative signal audit", () => {
  it("pins Phase 15B fields and includes repo-grounded signal families", () => {
    const result = getPhase15DesignCreativeSignalAudit();

    expect(result.phase).toBe("Phase 15: Design & Creative AI Agent");
    expect(result.phaseStep).toBe("Phase 15B â€” Design & Creative Signal Audit");
    expect(result.previousStep).toBe("Phase 15A â€” Design & Creative AI Agent Scope");
    expect(result.signalFamilies).toEqual(phase15DesignCreativeSignalFamilies);
    expect(result.recommendedNextExactStep).toBe("Phase 15C â€” Manual Design & Creative Advisory Policy");
    expect(result.groundedReferences.publicSurfaces).toContain("components/forms/lead-capture-form.tsx");
    expect(result.groundedReferences.designIntelligenceReferenceComponents).toContain("components/design-intelligence");
  });

  it("keeps all decisions unauthorized and blocks design execution", () => {
    const result = getPhase15DesignCreativeSignalAudit();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.uiChangeEnabled).toBe(false);
    expect(result.flags.assetChangeEnabled).toBe(false);
    expect(result.flags.logoChangeEnabled).toBe(false);
    expect(result.flags.themeChangeEnabled).toBe(false);
    expect(result.flags.creativePublishingEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("references design doctrine, public surfaces, conversion, social, activation, and no-runtime-ui signals", () => {
    const result = getPhase15DesignCreativeSignalAudit();
    const text = [result.signalFamilies, result.auditPurpose, result.stopRules].flat().join(" ");

    expect(text).toMatch(/small_high_clarity_design_creative_doctrine/i);
    expect(text).toMatch(/public_homepage_contact_sell_your_house/i);
    expect(text).toMatch(/conversion_local_authority_truthful_claims/i);
    expect(text).toMatch(/social_acquisition_claim_creative/i);
    expect(text).toMatch(/activation_evidence_brand_mobile_claim/i);
    expect(text).toMatch(/highest acquisition ROI per operator hour/i);
  });

  it("summarizes signal audit boundaries", () => {
    const summary = getPhase15DesignCreativeSignalAuditSummary();

    expect(summary).toMatch(/audits existing brand/i);
    expect(summary).toMatch(/design-intelligence reference signals/i);
    expect(summary).toMatch(/No UI changes/i);
    expect(summary).toMatch(/no asset\/logo\/theme edits/i);
    expect(summary).toMatch(/no creative publishing/i);
    expect(summary).toMatch(/Phase 15C â€” Manual Design & Creative Advisory Policy/i);
  });

  it("throws on missing signals, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase15DesignCreativeSignalAudit();

    expect(() => assertPhase15DesignCreativeSignalAuditSafe({ ...result, signalFamilies: [] })).toThrow(/signal families/i);
    expect(() => assertPhase15DesignCreativeSignalAuditSafe({ ...result, flags: { ...phase15DesignCreativeSignalAuditFlags, imageGenerationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase15DesignCreativeSignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase15DesignCreativeSignalAuditSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase15DesignCreativeSignalAuditSafe({ ...result, auditPurpose: ["image generation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
