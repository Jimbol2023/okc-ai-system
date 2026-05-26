import {
  assertPhase16BuyerFitFinalLockdownSafe,
  getPhase16BuyerFitFinalLockdown,
  getPhase16BuyerFitFinalLockdownSummary,
  phase16BuyerFitFinalLockdownFlags,
} from "./phase-16-buyer-fit-final-lockdown";

describe("phase 16F buyer fit final lockdown", () => {
  it("pins Phase 16F fields and recommends Phase 17", () => {
    const result = getPhase16BuyerFitFinalLockdown();

    expect(result.phase).toBe("Phase 16: Buyer Fit Intelligence");
    expect(result.phaseStep).toBe("Phase 16F â€” Buyer Fit Final Lockdown");
    expect(result.previousStep).toBe("Phase 16E â€” Minimal Buyer Fit Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.recommendedNextExactStep).toBe("Phase 17 â€” Pentest & Security Engine");
    expect(result.nextStageRecommendation).toBe("Phase 17 â€” Pentest & Security Engine");
  });

  it("locks Phase 16 with all execution decisions unauthorized and flags false", () => {
    const result = getPhase16BuyerFitFinalLockdown();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.buyerRecordMutationEnabled).toBe(false);
    expect(result.flags.buyerActivityMutationEnabled).toBe(false);
    expect(result.flags.scorePersistenceEnabled).toBe(false);
    expect(result.flags.matchingExecutionEnabled).toBe(false);
    expect(result.flags.assignmentGenerationEnabled).toBe(false);
    expect(result.flags.contractGenerationEnabled).toBe(false);
    expect(result.flags.buyerOutreachEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("preserves final lockdown boundaries and Phase 17 handoff", () => {
    const result = getPhase16BuyerFitFinalLockdown();
    const text = [result.lockdownRules, result.stopRules, result.aiOperatorLeverageBoundary].flat().join(" ");

    expect(text).toMatch(/read-only planning/i);
    expect(text).toMatch(/no-buyer-outreach/i);
    expect(text).toMatch(/no-deal-blasting/i);
    expect(text).toMatch(/no-buyer-record-mutation/i);
    expect(text).toMatch(/no-score-persistence/i);
    expect(text).toMatch(/Phase 17/i);
  });

  it("summarizes Phase 16 final lockdown", () => {
    const summary = getPhase16BuyerFitFinalLockdownSummary();

    expect(summary).toMatch(/locks Phase 16 Buyer Fit Intelligence planning/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned buyer-fit judgment/i);
    expect(summary).toMatch(/No buyer outreach/i);
    expect(summary).toMatch(/no deal blasting/i);
    expect(summary).toMatch(/no assignment\/contract generation/i);
    expect(summary).toMatch(/Phase 17 â€” Pentest & Security Engine/i);
  });

  it("throws on pinned drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase16BuyerFitFinalLockdown();

    expect(() => assertPhase16BuyerFitFinalLockdownSafe({ ...result, phaseStep: "Phase 16F â€” Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase16BuyerFitFinalLockdownSafe({ ...result, flags: { ...phase16BuyerFitFinalLockdownFlags, buyerOutreachEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase16BuyerFitFinalLockdownSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase16BuyerFitFinalLockdownSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase16BuyerFitFinalLockdownSafe({ ...result, lockdownRules: ["buyer outreach is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
