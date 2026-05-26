import {
  assertPhase14SocialAcquisitionFinalLockdownSafe,
  getPhase14SocialAcquisitionFinalLockdown,
  getPhase14SocialAcquisitionFinalLockdownSummary,
  phase14SocialAcquisitionFinalLockdownFlags,
} from "./phase-14-social-acquisition-final-lockdown";

describe("phase 14F social acquisition final lockdown", () => {
  it("pins Phase 14F fields and recommends Phase 15", () => {
    const result = getPhase14SocialAcquisitionFinalLockdown();

    expect(result.phase).toBe("Phase 14: Facebook & TikTok Acquisition Engine");
    expect(result.phaseStep).toBe("Phase 14F â€” Social Acquisition Final Lockdown");
    expect(result.previousStep).toBe("Phase 14E â€” Minimal Social Acquisition Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.recommendedNextExactStep).toBe("Phase 15 â€” Design & Creative AI Agent");
    expect(result.nextStageRecommendation).toBe("Phase 15 â€” Design & Creative AI Agent");
  });

  it("locks Phase 14 with all execution decisions unauthorized and flags false", () => {
    const result = getPhase14SocialAcquisitionFinalLockdown();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.sdkImportEnabled).toBe(false);
    expect(result.flags.apiCallEnabled).toBe(false);
    expect(result.flags.webhookEnabled).toBe(false);
    expect(result.flags.pixelEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.flags.leadImportEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("preserves final lockdown boundaries and Phase 15 handoff", () => {
    const result = getPhase14SocialAcquisitionFinalLockdown();
    const text = [result.lockdownRules, result.stopRules, result.aiOperatorLeverageBoundary].flat().join(" ");

    expect(text).toMatch(/read-only planning/i);
    expect(text).toMatch(/no-provider-activation/i);
    expect(text).toMatch(/no-pixel/i);
    expect(text).toMatch(/no-campaign/i);
    expect(text).toMatch(/no-lead-import/i);
    expect(text).toMatch(/Phase 15/i);
  });

  it("summarizes Phase 14 final lockdown", () => {
    const summary = getPhase14SocialAcquisitionFinalLockdownSummary();

    expect(summary).toMatch(/locks Phase 14 Facebook & TikTok Acquisition planning/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned channel strategy/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/no pixels\/tracking/i);
    expect(summary).toMatch(/no spend increase/i);
    expect(summary).toMatch(/Phase 15 â€” Design & Creative AI Agent/i);
  });

  it("throws on pinned drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase14SocialAcquisitionFinalLockdown();

    expect(() => assertPhase14SocialAcquisitionFinalLockdownSafe({ ...result, phaseStep: "Phase 14F â€” Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase14SocialAcquisitionFinalLockdownSafe({ ...result, flags: { ...phase14SocialAcquisitionFinalLockdownFlags, adEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase14SocialAcquisitionFinalLockdownSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase14SocialAcquisitionFinalLockdownSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase14SocialAcquisitionFinalLockdownSafe({ ...result, lockdownRules: ["Phase 15 implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
