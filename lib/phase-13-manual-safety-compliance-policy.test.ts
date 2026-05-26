import {
  assertPhase13ManualSafetyCompliancePolicySafe,
  getPhase13ManualSafetyCompliancePolicy,
  getPhase13ManualSafetyCompliancePolicySummary,
  phase13ManualSafetyComplianceLanes,
  phase13ManualSafetyCompliancePolicyFlags,
  phase13SafetyComplianceSummaryStates,
} from "./phase-13-manual-safety-compliance-policy";
import { phase13SafetyComplianceSignalFamilies } from "./phase-13-safety-compliance-signal-audit";

describe("phase 13C manual safety compliance policy", () => {
  it("pins Phase 13C fields and includes lanes and summary states", () => {
    const result = getPhase13ManualSafetyCompliancePolicy();

    expect(result.phaseStep).toBe("Phase 13C — Manual Safety & Compliance Advisory Policy");
    expect(result.previousStep).toBe("Phase 13B — Safety & Compliance Signal Audit");
    expect(result.safetyComplianceLanes).toEqual(phase13ManualSafetyComplianceLanes);
    expect(result.summaryStates).toEqual(phase13SafetyComplianceSummaryStates);
    expect(result.signalReferences).toEqual(phase13SafetyComplianceSignalFamilies);
    expect(result.safetyComplianceLanes).toContain("dnc_opt_out_hard_blocker_review");
    expect(result.summaryStates).toContain("privacy_security_review_required");
  });

  it("blocks consent collection DNC bypass sending calling provider activation audit writing and go-live", () => {
    const result = getPhase13ManualSafetyCompliancePolicy();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.consentCollectionEnabled).toBe(false);
    expect(result.flags.dncBypassEnabled).toBe(false);
    expect(result.flags.outboundSmsEnabled).toBe(false);
    expect(result.flags.callingEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.auditWritingEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 13D — Safety & Compliance Implementation Scope");
  });

  it("summarizes manual policy boundaries", () => {
    const summary = getPhase13ManualSafetyCompliancePolicySummary();

    expect(summary).toMatch(/manual safety\/compliance lanes/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/consent\/DNC\/opt-out judgment/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/no audit writing/i);
  });

  it("throws on lane state reference drift blocked flag and unsafe wording", () => {
    const result = getPhase13ManualSafetyCompliancePolicy();

    expect(() => assertPhase13ManualSafetyCompliancePolicySafe({ ...result, safetyComplianceLanes: phase13ManualSafetyComplianceLanes.slice(0, -1) as never })).toThrow(/lanes/i);
    expect(() => assertPhase13ManualSafetyCompliancePolicySafe({ ...result, summaryStates: phase13SafetyComplianceSummaryStates.slice(0, -1) as never })).toThrow(/summary states/i);
    expect(() => assertPhase13ManualSafetyCompliancePolicySafe({ ...result, signalReferences: phase13SafetyComplianceSignalFamilies.slice(0, -1) as never })).toThrow(/signal references/i);
    expect(() => assertPhase13ManualSafetyCompliancePolicySafe({ ...result, flags: { ...phase13ManualSafetyCompliancePolicyFlags, auditWritingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase13ManualSafetyCompliancePolicySafe({ ...result, policyRules: ["provider activation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
