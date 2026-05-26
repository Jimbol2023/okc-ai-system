import {
  assertPhase14SocialAcquisitionSignalAuditSafe,
  getPhase14SocialAcquisitionSignalAudit,
  getPhase14SocialAcquisitionSignalAuditSummary,
  phase14SocialAcquisitionSignalAuditFlags,
  phase14SocialAcquisitionSignalFamilies,
} from "./phase-14-social-acquisition-signal-audit";

describe("phase 14B social acquisition signal audit", () => {
  it("pins Phase 14B fields and includes repo-grounded signal families", () => {
    const result = getPhase14SocialAcquisitionSignalAudit();

    expect(result.phase).toBe("Phase 14: Facebook & TikTok Acquisition Engine");
    expect(result.phaseStep).toBe("Phase 14B â€” Social Acquisition Signal Audit");
    expect(result.previousStep).toBe("Phase 14A â€” Facebook & TikTok Acquisition Engine Scope");
    expect(result.signalFamilies).toEqual(phase14SocialAcquisitionSignalFamilies);
    expect(result.recommendedNextExactStep).toBe("Phase 14C â€” Manual Social Acquisition Advisory Policy");
    expect(result.groundedReferences.publicSurfaces).toContain("components/forms/lead-capture-form.tsx");
  });

  it("keeps all decisions unauthorized and blocks social acquisition execution", () => {
    const result = getPhase14SocialAcquisitionSignalAudit();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.pixelEnabled).toBe(false);
    expect(result.flags.audienceUploadEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.flags.leadImportEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("references source tracking, safety, conversion, and no-platform-execution doctrine", () => {
    const result = getPhase14SocialAcquisitionSignalAudit();
    const text = [result.signalFamilies, result.auditPurpose, result.stopRules].flat().join(" ");

    expect(text).toMatch(/lead_intake_source_tracking/i);
    expect(text).toMatch(/safety_compliance_consent_dnc/i);
    expect(text).toMatch(/conversion_local_authority_truthful_claims/i);
    expect(text).toMatch(/no_facebook_tiktok_sdk/i);
    expect(text).toMatch(/highest acquisition ROI per operator hour/i);
  });

  it("summarizes signal audit boundaries", () => {
    const summary = getPhase14SocialAcquisitionSignalAuditSummary();

    expect(summary).toMatch(/audits existing public acquisition/i);
    expect(summary).toMatch(/source tracking/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/no pixels\/tracking/i);
    expect(summary).toMatch(/no campaigns\/ads/i);
    expect(summary).toMatch(/Phase 14C â€” Manual Social Acquisition Advisory Policy/i);
  });

  it("throws on missing signals, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase14SocialAcquisitionSignalAudit();

    expect(() => assertPhase14SocialAcquisitionSignalAuditSafe({ ...result, signalFamilies: [] })).toThrow(/signal families/i);
    expect(() => assertPhase14SocialAcquisitionSignalAuditSafe({ ...result, flags: { ...phase14SocialAcquisitionSignalAuditFlags, campaignEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase14SocialAcquisitionSignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase14SocialAcquisitionSignalAuditSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase14SocialAcquisitionSignalAuditSafe({ ...result, auditPurpose: ["lead import is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
