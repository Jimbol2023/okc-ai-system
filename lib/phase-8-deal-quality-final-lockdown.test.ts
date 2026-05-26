import { phase8MinimalDealQualityGateLanes } from "./phase-8-minimal-deal-quality-gate";
import {
  assertPhase8DealQualityFinalLockdownSafe,
  getPhase8DealQualityFinalLockdown,
  getPhase8DealQualityFinalLockdownSummary,
  phase8DealQualityFinalLockdownFlags,
} from "./phase-8-deal-quality-final-lockdown";

describe("phase 8F deal quality final lockdown", () => {
  it("pins Phase 8F fields and recommends Phase 9", () => {
    const result = getPhase8DealQualityFinalLockdown();

    expect(result.phase).toBe("Phase 8: Deal Quality Intelligence");
    expect(result.phaseStep).toBe("Phase 8F — Deal Quality Final Lockdown");
    expect(result.previousStep).toBe("Phase 8E — Minimal Deal Quality Intelligence Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.phase8eGateReferences).toEqual(phase8MinimalDealQualityGateLanes);
    expect(result.recommendedNextExactStep).toBe("Phase 9 — AI-Assisted Lead Discovery");
    expect(result.nextStageRecommendation).toBe("Phase 9 — AI-Assisted Lead Discovery");
  });

  it("locks all execution mutation persistence and Phase 9 implementation flags", () => {
    const result = getPhase8DealQualityFinalLockdown();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.phase8LockdownEnforced).toBe(true);
    expect(result.flags.propertyFactInventionEnabled).toBe(false);
    expect(result.flags.analyzerMutationEnabled).toBe(false);
    expect(result.flags.dealScorePersistenceEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.offerGenerationEnabled).toBe(false);
    expect(result.flags.phase9ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes Phase 8 lockdown and Phase 9 handoff", () => {
    const summary = getPhase8DealQualityFinalLockdownSummary();

    expect(summary).toMatch(/Phase 8F/i);
    expect(summary).toMatch(/final lockdown/i);
    expect(summary).toMatch(/human-owned deal quality judgment/i);
    expect(summary).toMatch(/property fact verification/i);
    expect(summary).toMatch(/No invented property facts/i);
    expect(summary).toMatch(/no analyzer mutation/i);
    expect(summary).toMatch(/no closing execution/i);
    expect(summary).toMatch(/Phase 9 — AI-Assisted Lead Discovery/i);
  });

  it("throws on pinned drift gate references blocked flags missing rules and unsafe wording", () => {
    const result = getPhase8DealQualityFinalLockdown();

    expect(() => assertPhase8DealQualityFinalLockdownSafe({ ...result, phaseStep: "Phase 8Z" as never })).toThrow(/step/i);
    expect(() => assertPhase8DealQualityFinalLockdownSafe({ ...result, phase8eGateReferences: phase8MinimalDealQualityGateLanes.slice(0, -1) as never })).toThrow(/Phase 8E gate references/i);
    expect(() => assertPhase8DealQualityFinalLockdownSafe({ ...result, flags: { ...phase8DealQualityFinalLockdownFlags, goLiveAuthorized: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase8DealQualityFinalLockdownSafe({ ...result, finalLockdownRules: [] })).toThrow(/final lockdown rules/i);
    expect(() => assertPhase8DealQualityFinalLockdownSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase8DealQualityFinalLockdownSafe({ ...result, finalLockdownRules: ["Phase 9 implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
