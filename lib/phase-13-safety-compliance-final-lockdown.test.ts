import {
  assertPhase13SafetyComplianceFinalLockdownSafe,
  getPhase13SafetyComplianceFinalLockdown,
  getPhase13SafetyComplianceFinalLockdownSummary,
  phase13SafetyComplianceFinalLockdownFlags,
} from "./phase-13-safety-compliance-final-lockdown";
import { phase13MinimalSafetyComplianceGateChecks } from "./phase-13-minimal-safety-compliance-gate";

describe("phase 13F safety compliance final lockdown", () => {
  it("pins Phase 13F fields and recommends Phase 14", () => {
    const result = getPhase13SafetyComplianceFinalLockdown();

    expect(result.phase).toBe("Phase 13: Safety & Compliance Engine");
    expect(result.phaseStep).toBe("Phase 13F — Safety & Compliance Final Lockdown");
    expect(result.previousStep).toBe("Phase 13E — Minimal Safety & Compliance Gate");
    expect(result.gateReferences).toEqual(phase13MinimalSafetyComplianceGateChecks);
    expect(result.recommendedNextExactStep).toBe("Phase 14 — Facebook & TikTok Acquisition Engine");
    expect(result.nextStageRecommendation).toBe("Phase 14 — Facebook & TikTok Acquisition Engine");
  });

  it("keeps all unsafe decisions and flags blocked", () => {
    const result = getPhase13SafetyComplianceFinalLockdown();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.consentCollectionEnabled).toBe(false);
    expect(result.flags.dncBypassEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.outboundSmsEnabled).toBe(false);
    expect(result.flags.callingEnabled).toBe(false);
    expect(result.flags.auditWritingEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.flags.phase14ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes final lockdown boundaries", () => {
    const summary = getPhase13SafetyComplianceFinalLockdownSummary();

    expect(summary).toMatch(/locks Phase 13 Safety & Compliance planning/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned compliance judgment/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/no sending\/calling/i);
    expect(summary).toMatch(/Phase 14 — Facebook & TikTok Acquisition Engine/i);
  });

  it("throws on final-lockdown drift blocked flags and unsafe wording", () => {
    const result = getPhase13SafetyComplianceFinalLockdown();

    expect(() => assertPhase13SafetyComplianceFinalLockdownSafe({ ...result, phaseStep: "Phase 13F — Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase13SafetyComplianceFinalLockdownSafe({ ...result, gateReferences: phase13MinimalSafetyComplianceGateChecks.slice(0, -1) as never })).toThrow(/gate references/i);
    expect(() => assertPhase13SafetyComplianceFinalLockdownSafe({ ...result, flags: { ...phase13SafetyComplianceFinalLockdownFlags, phase14ImplementationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase13SafetyComplianceFinalLockdownSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase13SafetyComplianceFinalLockdownSafe({ ...result, lockdownRules: ["Phase 14 implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
