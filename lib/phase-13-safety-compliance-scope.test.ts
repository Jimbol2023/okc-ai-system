import { phase12ConversionFinalLockdownRules } from "./phase-12-conversion-final-lockdown";
import {
  assertPhase13SafetyComplianceScopeSafe,
  getPhase13SafetyComplianceScope,
  getPhase13SafetyComplianceScopeSummary,
  phase13SafetyComplianceForbiddenDrift,
  phase13SafetyComplianceScopeFlags,
} from "./phase-13-safety-compliance-scope";

describe("phase 13A safety compliance scope", () => {
  it("pins Phase 13A fields and Phase 12F continuity", () => {
    const result = getPhase13SafetyComplianceScope();

    expect(result.phase).toBe("Phase 13: Safety & Compliance Engine");
    expect(result.phaseStep).toBe("Phase 13A — Safety & Compliance Engine Scope");
    expect(result.previousStep).toBe("Phase 12F — Conversion Optimization Final Lockdown");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.phase12FinalLockdownReference.rules).toEqual(phase12ConversionFinalLockdownRules);
    expect(result.recommendedNextExactStep).toBe("Phase 13B — Safety & Compliance Signal Audit");
  });

  it("keeps all execution decisions unauthorized and blocked flags false", () => {
    const result = getPhase13SafetyComplianceScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.consentCollectionEnabled).toBe(false);
    expect(result.flags.dncBypassEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.smsSendingEnabled).toBe(false);
    expect(result.flags.callingEnabled).toBe(false);
    expect(result.flags.auditWritingEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("includes highest-aROI purpose boundaries and forbidden drift", () => {
    const result = getPhase13SafetyComplianceScope();
    const text = [result.scopePurpose, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");

    expect(text).toMatch(/highest acquisition ROI per operator hour/i);
    expect(text).toMatch(/consent evidence/i);
    expect(text).toMatch(/privacy\/security judgment/i);
    expect(text).toMatch(/go-live approval/i);
    expect(phase13SafetyComplianceForbiddenDrift).toContain("consent collection");
    expect(phase13SafetyComplianceForbiddenDrift).toContain("DNC bypass");
    expect(phase13SafetyComplianceForbiddenDrift).toContain("Phase 14 implementation");
  });

  it("summarizes read-only safety compliance limits", () => {
    const summary = getPhase13SafetyComplianceScopeSummary();

    expect(summary).toMatch(/Safety & Compliance scope/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned compliance judgment/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/no sending\/calling/i);
    expect(summary).toMatch(/no audit writing/i);
    expect(summary).toMatch(/Phase 13B — Safety & Compliance Signal Audit/i);
  });

  it("throws on pinned drift blocked flag drift missing boundaries and unsafe wording", () => {
    const result = getPhase13SafetyComplianceScope();

    expect(() => assertPhase13SafetyComplianceScopeSafe({ ...result, phaseStep: "Phase 13A — Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase13SafetyComplianceScopeSafe({ ...result, flags: { ...phase13SafetyComplianceScopeFlags, consentCollectionEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase13SafetyComplianceScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase13SafetyComplianceScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase13SafetyComplianceScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase13SafetyComplianceScopeSafe({ ...result, scopePurpose: ["DNC bypass is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
