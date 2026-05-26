import { phase13SafetyComplianceFinalLockdownRules } from "./phase-13-safety-compliance-final-lockdown";
import {
  assertPhase14FacebookTiktokAcquisitionScopeSafe,
  getPhase14FacebookTiktokAcquisitionScope,
  getPhase14FacebookTiktokAcquisitionScopeSummary,
  phase14FacebookTiktokAcquisitionScopeFlags,
  phase14SocialAcquisitionForbiddenDrift,
} from "./phase-14-facebook-tiktok-acquisition-scope";

describe("phase 14A facebook tiktok acquisition scope", () => {
  it("pins Phase 14A fields and Phase 13F continuity", () => {
    const result = getPhase14FacebookTiktokAcquisitionScope();

    expect(result.phase).toBe("Phase 14: Facebook & TikTok Acquisition Engine");
    expect(result.phaseStep).toBe("Phase 14A â€” Facebook & TikTok Acquisition Engine Scope");
    expect(result.previousStep).toBe("Phase 13F â€” Safety & Compliance Final Lockdown");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.phase13FinalLockdownReference.rules).toEqual(phase13SafetyComplianceFinalLockdownRules);
    expect(result.recommendedNextExactStep).toBe("Phase 14B â€” Social Acquisition Signal Audit");
  });

  it("keeps social acquisition execution decisions unauthorized and blocked flags false", () => {
    const result = getPhase14FacebookTiktokAcquisitionScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.pixelEnabled).toBe(false);
    expect(result.flags.trackingEnabled).toBe(false);
    expect(result.flags.adAccountMutationEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.flags.leadImportEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("includes highest-aROI purpose, human ownership, and forbidden drift", () => {
    const result = getPhase14FacebookTiktokAcquisitionScope();
    const text = [result.scopePurpose, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");

    expect(text).toMatch(/highest acquisition ROI per operator hour/i);
    expect(text).toMatch(/channel fit/i);
    expect(text).toMatch(/ad claim approval/i);
    expect(text).toMatch(/creative approval/i);
    expect(text).toMatch(/audience approval/i);
    expect(text).toMatch(/spend approval/i);
    expect(phase14SocialAcquisitionForbiddenDrift).toContain("provider activation");
    expect(phase14SocialAcquisitionForbiddenDrift).toContain("lead import");
    expect(phase14SocialAcquisitionForbiddenDrift).toContain("Phase 15 implementation");
  });

  it("summarizes read-only social acquisition limits", () => {
    const summary = getPhase14FacebookTiktokAcquisitionScopeSummary();

    expect(summary).toMatch(/Facebook & TikTok Acquisition scope/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned channel strategy/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/no pixels\/tracking/i);
    expect(summary).toMatch(/no campaigns\/ads/i);
    expect(summary).toMatch(/no lead import/i);
    expect(summary).toMatch(/Phase 14B â€” Social Acquisition Signal Audit/i);
  });

  it("throws on pinned drift, blocked flag drift, missing boundaries, and unsafe wording", () => {
    const result = getPhase14FacebookTiktokAcquisitionScope();

    expect(() => assertPhase14FacebookTiktokAcquisitionScopeSafe({ ...result, phaseStep: "Phase 14A â€” Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase14FacebookTiktokAcquisitionScopeSafe({ ...result, flags: { ...phase14FacebookTiktokAcquisitionScopeFlags, pixelEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase14FacebookTiktokAcquisitionScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase14FacebookTiktokAcquisitionScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase14FacebookTiktokAcquisitionScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase14FacebookTiktokAcquisitionScopeSafe({ ...result, scopePurpose: ["provider activation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
