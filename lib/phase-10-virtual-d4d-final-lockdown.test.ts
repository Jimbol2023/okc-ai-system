import { phase10MinimalVirtualD4dGateChecks } from "./phase-10-minimal-virtual-d4d-gate";
import {
  assertPhase10VirtualD4dFinalLockdownSafe,
  getPhase10VirtualD4dFinalLockdown,
  getPhase10VirtualD4dFinalLockdownSummary,
  phase10VirtualD4dFinalLockdownFlags,
} from "./phase-10-virtual-d4d-final-lockdown";

describe("phase 10F virtual D4D final lockdown", () => {
  it("pins Phase 10F fields and recommends Phase 11", () => {
    const result = getPhase10VirtualD4dFinalLockdown();

    expect(result.phase).toBe("Phase 10: Virtual Driving for Dollars Intelligence Engine");
    expect(result.phaseStep).toBe("Phase 10F — Virtual D4D Final Lockdown");
    expect(result.previousStep).toBe("Phase 10E — Minimal Virtual D4D Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.gateReferences).toEqual(phase10MinimalVirtualD4dGateChecks);
    expect(result.recommendedNextExactStep).toBe("Phase 11 — SEO & Local Authority Engine");
    expect(result.nextStageRecommendation).toBe("Phase 11 — SEO & Local Authority Engine");
  });

  it("keeps all unsafe decisions and flags blocked", () => {
    const result = getPhase10VirtualD4dFinalLockdown();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.scrapingEnabled).toBe(false);
    expect(result.flags.mapCrawlingEnabled).toBe(false);
    expect(result.flags.streetViewAutomationEnabled).toBe(false);
    expect(result.flags.gpsSurveillanceEnabled).toBe(false);
    expect(result.flags.ownerLookupEnabled).toBe(false);
    expect(result.flags.ownerContactEnabled).toBe(false);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.flags.phase11ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes final lockdown boundaries", () => {
    const summary = getPhase10VirtualD4dFinalLockdownSummary();

    expect(summary).toMatch(/locks Phase 10 Virtual D4D planning/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned neighborhood judgment/i);
    expect(summary).toMatch(/No scraping/i);
    expect(summary).toMatch(/no map crawling/i);
    expect(summary).toMatch(/no Street View automation/i);
    expect(summary).toMatch(/no GPS surveillance/i);
    expect(summary).toMatch(/no owner contact/i);
    expect(summary).toMatch(/Phase 11 — SEO & Local Authority Engine/i);
  });

  it("throws on final-lockdown drift blocked flags and unsafe wording", () => {
    const result = getPhase10VirtualD4dFinalLockdown();

    expect(() => assertPhase10VirtualD4dFinalLockdownSafe({ ...result, phaseStep: "Phase 10F — Drift" as never })).toThrow(/step/i);
    expect(() => assertPhase10VirtualD4dFinalLockdownSafe({ ...result, gateReferences: phase10MinimalVirtualD4dGateChecks.slice(0, -1) as never })).toThrow(/gate references/i);
    expect(() => assertPhase10VirtualD4dFinalLockdownSafe({ ...result, flags: { ...phase10VirtualD4dFinalLockdownFlags, phase11ImplementationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase10VirtualD4dFinalLockdownSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase10VirtualD4dFinalLockdownSafe({ ...result, lockdownRules: ["Phase 11 implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
