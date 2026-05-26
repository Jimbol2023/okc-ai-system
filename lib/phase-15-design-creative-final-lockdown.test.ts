import {
  assertPhase15DesignCreativeFinalLockdownSafe,
  getPhase15DesignCreativeFinalLockdown,
  getPhase15DesignCreativeFinalLockdownSummary,
  phase15DesignCreativeFinalLockdownFlags,
} from "./phase-15-design-creative-final-lockdown";

describe("phase 15F design creative final lockdown", () => {
  it("pins Phase 15F fields and recommends Phase 16", () => {
    const result = getPhase15DesignCreativeFinalLockdown();

    expect(result.phase).toBe("Phase 15: Design & Creative AI Agent");
    expect(result.phaseStep).toBe("Phase 15F â€” Design & Creative Final Lockdown");
    expect(result.previousStep).toBe("Phase 15E â€” Minimal Design & Creative Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.recommendedNextExactStep).toBe("Phase 16 â€” Buyer Fit Intelligence");
    expect(result.nextStageRecommendation).toBe("Phase 16 â€” Buyer Fit Intelligence");
  });

  it("locks Phase 15 with all execution decisions unauthorized and flags false", () => {
    const result = getPhase15DesignCreativeFinalLockdown();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.uiChangeEnabled).toBe(false);
    expect(result.flags.contentChangeEnabled).toBe(false);
    expect(result.flags.assetChangeEnabled).toBe(false);
    expect(result.flags.imageGenerationEnabled).toBe(false);
    expect(result.flags.creativePublishingEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.flags.outreachEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("preserves final lockdown boundaries and Phase 16 handoff", () => {
    const result = getPhase15DesignCreativeFinalLockdown();
    const text = [result.lockdownRules, result.stopRules, result.aiOperatorLeverageBoundary].flat().join(" ");

    expect(text).toMatch(/read-only planning/i);
    expect(text).toMatch(/no-UI-change/i);
    expect(text).toMatch(/no-asset-edit/i);
    expect(text).toMatch(/no-image-generation/i);
    expect(text).toMatch(/no-creative-publishing/i);
    expect(text).toMatch(/Phase 16/i);
  });

  it("summarizes Phase 15 final lockdown", () => {
    const summary = getPhase15DesignCreativeFinalLockdownSummary();

    expect(summary).toMatch(/locks Phase 15 Design & Creative AI Agent planning/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned brand judgment/i);
    expect(summary).toMatch(/No UI changes/i);
    expect(summary).toMatch(/no asset\/logo\/theme edits/i);
    expect(summary).toMatch(/no spend increase/i);
    expect(summary).toMatch(/Phase 16 â€” Buyer Fit Intelligence/i);
  });

  it("throws on pinned drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase15DesignCreativeFinalLockdown();

    expect(() => assertPhase15DesignCreativeFinalLockdownSafe({ ...result, phaseStep: "Phase 15F â€” Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase15DesignCreativeFinalLockdownSafe({ ...result, flags: { ...phase15DesignCreativeFinalLockdownFlags, adEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase15DesignCreativeFinalLockdownSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase15DesignCreativeFinalLockdownSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase15DesignCreativeFinalLockdownSafe({ ...result, lockdownRules: ["Phase 16 implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
