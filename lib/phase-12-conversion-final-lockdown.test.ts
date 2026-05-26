import {
  assertPhase12ConversionFinalLockdownSafe,
  getPhase12ConversionFinalLockdown,
  getPhase12ConversionFinalLockdownSummary,
  phase12ConversionFinalLockdownFlags,
} from "./phase-12-conversion-final-lockdown";
import { phase12MinimalConversionGateChecks } from "./phase-12-minimal-conversion-gate";

describe("phase 12F conversion final lockdown", () => {
  it("pins Phase 12F fields and recommends Phase 13", () => {
    const result = getPhase12ConversionFinalLockdown();

    expect(result.phase).toBe("Phase 12: Conversion Optimization Engine");
    expect(result.phaseStep).toBe("Phase 12F — Conversion Optimization Final Lockdown");
    expect(result.previousStep).toBe("Phase 12E — Minimal Conversion Optimization Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.gateReferences).toEqual(phase12MinimalConversionGateChecks);
    expect(result.recommendedNextExactStep).toBe("Phase 13 — Safety & Compliance Engine");
    expect(result.nextStageRecommendation).toBe("Phase 13 — Safety & Compliance Engine");
  });

  it("keeps all unsafe decisions and flags blocked", () => {
    const result = getPhase12ConversionFinalLockdown();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.formChangeEnabled).toBe(false);
    expect(result.flags.uiChangeEnabled).toBe(false);
    expect(result.flags.analyticsEnabled).toBe(false);
    expect(result.flags.trackingEnabled).toBe(false);
    expect(result.flags.experimentEnabled).toBe(false);
    expect(result.flags.offerGenerationEnabled).toBe(false);
    expect(result.flags.contractGenerationEnabled).toBe(false);
    expect(result.flags.phase13ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes final lockdown boundaries", () => {
    const summary = getPhase12ConversionFinalLockdownSummary();

    expect(summary).toMatch(/locks Phase 12 Conversion Optimization planning/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned conversion judgment/i);
    expect(summary).toMatch(/No form changes/i);
    expect(summary).toMatch(/no analytics\/tracking/i);
    expect(summary).toMatch(/no experiments/i);
    expect(summary).toMatch(/Phase 13 — Safety & Compliance Engine/i);
  });

  it("throws on final-lockdown drift blocked flags and unsafe wording", () => {
    const result = getPhase12ConversionFinalLockdown();

    expect(() => assertPhase12ConversionFinalLockdownSafe({ ...result, phaseStep: "Phase 12F — Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase12ConversionFinalLockdownSafe({ ...result, gateReferences: phase12MinimalConversionGateChecks.slice(0, -1) as never })).toThrow(/gate references/i);
    expect(() => assertPhase12ConversionFinalLockdownSafe({ ...result, flags: { ...phase12ConversionFinalLockdownFlags, phase13ImplementationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase12ConversionFinalLockdownSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase12ConversionFinalLockdownSafe({ ...result, lockdownRules: ["Phase 13 implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
