import {
  assertPhase13SafetyComplianceSignalAuditSafe,
  getPhase13SafetyComplianceSignalAudit,
  getPhase13SafetyComplianceSignalAuditSummary,
  phase13SafetyComplianceSignalAuditFlags,
  phase13SafetyComplianceSignalFamilies,
} from "./phase-13-safety-compliance-signal-audit";

describe("phase 13B safety compliance signal audit", () => {
  it("pins Phase 13B fields and includes repo-grounded signal families", () => {
    const result = getPhase13SafetyComplianceSignalAudit();

    expect(result.phase).toBe("Phase 13: Safety & Compliance Engine");
    expect(result.phaseStep).toBe("Phase 13B — Safety & Compliance Signal Audit");
    expect(result.previousStep).toBe("Phase 13A — Safety & Compliance Engine Scope");
    expect(result.signalFamilies).toEqual(phase13SafetyComplianceSignalFamilies);
    expect(result.signalFamilies).toContain("consent_dnc_opt_out_sender_policy_review");
    expect(result.signalFamilies).toContain("security_privacy_y7_retention_deletion_migration_governance_traceability");
    expect(result.groundedReferences.consentForbiddenDrift).toContain("DNC bypass");
    expect(result.groundedReferences.y7SecurityPrivacyAreas).toContain("privacy signoff");
  });

  it("blocks consent bypass sending calling provider activation audit CRM campaigns and go-live", () => {
    const result = getPhase13SafetyComplianceSignalAudit();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.consentCollectionEnabled).toBe(false);
    expect(result.flags.dncBypassEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.outboundSmsEnabled).toBe(false);
    expect(result.flags.callingEnabled).toBe(false);
    expect(result.flags.auditWritingEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes existing signal audit boundaries", () => {
    const summary = getPhase13SafetyComplianceSignalAuditSummary();

    expect(summary).toMatch(/consent\/DNC\/opt-out/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/legal review/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/no sending\/calling/i);
    expect(summary).toMatch(/no go-live/i);
  });

  it("throws on missing signal families blocked flags and unsafe wording", () => {
    const result = getPhase13SafetyComplianceSignalAudit();

    expect(() => assertPhase13SafetyComplianceSignalAuditSafe({ ...result, signalFamilies: phase13SafetyComplianceSignalFamilies.slice(0, -1) as never })).toThrow(/signal families/i);
    expect(() => assertPhase13SafetyComplianceSignalAuditSafe({ ...result, flags: { ...phase13SafetyComplianceSignalAuditFlags, providerActivated: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase13SafetyComplianceSignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase13SafetyComplianceSignalAuditSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase13SafetyComplianceSignalAuditSafe({ ...result, auditPurpose: ["consent collection is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
