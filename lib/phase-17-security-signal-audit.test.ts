import {
  assertPhase17SecuritySignalAuditSafe,
  getPhase17SecuritySignalAudit,
  getPhase17SecuritySignalAuditSummary,
  phase17SecuritySignalAuditFlags,
  phase17SecuritySignalFamilies,
} from "./phase-17-security-signal-audit";

describe("phase 17B security signal audit", () => {
  it("pins Phase 17B fields and includes repo-grounded signal families", () => {
    const result = getPhase17SecuritySignalAudit();

    expect(result.phase).toBe("Phase 17: Pentest & Security Engine");
    expect(result.phaseStep).toBe("Phase 17B â€” Security Signal Audit");
    expect(result.previousStep).toBe("Phase 17A â€” Pentest & Security Engine Scope");
    expect(result.signalFamilies).toEqual(phase17SecuritySignalFamilies);
    expect(result.recommendedNextExactStep).toBe("Phase 17C â€” Manual Security Review Advisory Policy");
    expect(result.groundedReferences.authSecuritySurfaces).toContain("lib/auth.ts");
    expect(result.groundedReferences.securityReviewSurfaces).toContain("security-review-agent");
  });

  it("keeps decisions unauthorized and blocks security execution", () => {
    const result = getPhase17SecuritySignalAudit();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.pentestExecutionEnabled).toBe(false);
    expect(result.flags.networkEnabled).toBe(false);
    expect(result.flags.credentialReadEnabled).toBe(false);
    expect(result.flags.authMutationEnabled).toBe(false);
    expect(result.flags.remediationExecutionEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("references auth security privacy provider audit and final governance signals", () => {
    const result = getPhase17SecuritySignalAudit();
    const text = [result.signalFamilies, result.auditPurpose, result.stopRules].flat().join(" ");

    expect(text).toMatch(/auth_security_surfaces/i);
    expect(text).toMatch(/security_review_agent/i);
    expect(text).toMatch(/privacy_retention_redaction/i);
    expect(text).toMatch(/communication_provider_consent/i);
    expect(text).toMatch(/final_roadmap_governance/i);
    expect(text).toMatch(/highest acquisition ROI per operator hour/i);
  });

  it("summarizes signal audit boundaries", () => {
    const summary = getPhase17SecuritySignalAuditSummary();

    expect(summary).toMatch(/audits existing auth/i);
    expect(summary).toMatch(/route\/API exposure signals/i);
    expect(summary).toMatch(/No live pentesting/i);
    expect(summary).toMatch(/no scans/i);
    expect(summary).toMatch(/no credential reads/i);
    expect(summary).toMatch(/Phase 17C â€” Manual Security Review Advisory Policy/i);
  });

  it("throws on missing signals, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase17SecuritySignalAudit();

    expect(() => assertPhase17SecuritySignalAuditSafe({ ...result, signalFamilies: [] })).toThrow(/signal families/i);
    expect(() => assertPhase17SecuritySignalAuditSafe({ ...result, flags: { ...phase17SecuritySignalAuditFlags, credentialReadEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase17SecuritySignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase17SecuritySignalAuditSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase17SecuritySignalAuditSafe({ ...result, auditPurpose: ["credential reads are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
