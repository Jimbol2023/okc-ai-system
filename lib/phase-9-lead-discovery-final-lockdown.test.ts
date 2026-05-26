import { phase9MinimalDiscoveryGateLanes } from "./phase-9-minimal-discovery-gate";
import {
  assertPhase9LeadDiscoveryFinalLockdownSafe,
  getPhase9LeadDiscoveryFinalLockdown,
  getPhase9LeadDiscoveryFinalLockdownSummary,
  phase9LeadDiscoveryFinalLockdownFlags,
} from "./phase-9-lead-discovery-final-lockdown";

describe("phase 9F lead discovery final lockdown", () => {
  it("pins Phase 9F fields and recommends Phase 10", () => {
    const result = getPhase9LeadDiscoveryFinalLockdown();

    expect(result.phase).toBe("Phase 9: AI-Assisted Lead Discovery");
    expect(result.phaseStep).toBe("Phase 9F — Lead Discovery Final Lockdown");
    expect(result.previousStep).toBe("Phase 9E — Minimal Lead Discovery Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.phase9eGateReferences).toEqual(phase9MinimalDiscoveryGateLanes);
    expect(result.recommendedNextExactStep).toBe("Phase 10 — Virtual Driving for Dollars Intelligence Engine");
    expect(result.nextStageRecommendation).toBe("Phase 10 — Virtual Driving for Dollars Intelligence Engine");
  });

  it("locks all execution mutation sourcing and Phase 10 implementation flags", () => {
    const result = getPhase9LeadDiscoveryFinalLockdown();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.phase9LockdownEnforced).toBe(true);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.importMutationEnabled).toBe(false);
    expect(result.flags.scrapingEnabled).toBe(false);
    expect(result.flags.skipTracingEnabled).toBe(false);
    expect(result.flags.phase10ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes Phase 9 lockdown and Phase 10 handoff", () => {
    const summary = getPhase9LeadDiscoveryFinalLockdownSummary();

    expect(summary).toMatch(/Phase 9F/i);
    expect(summary).toMatch(/final lockdown/i);
    expect(summary).toMatch(/human-owned source judgment/i);
    expect(summary).toMatch(/legal-source verification/i);
    expect(summary).toMatch(/No scraping/i);
    expect(summary).toMatch(/no skip tracing/i);
    expect(summary).toMatch(/Phase 10 — Virtual Driving for Dollars Intelligence Engine/i);
  });

  it("throws on pinned drift gate references blocked flags missing rules and unsafe wording", () => {
    const result = getPhase9LeadDiscoveryFinalLockdown();

    expect(() => assertPhase9LeadDiscoveryFinalLockdownSafe({ ...result, phaseStep: "Phase 9Z" as never })).toThrow(/step/i);
    expect(() => assertPhase9LeadDiscoveryFinalLockdownSafe({ ...result, phase9eGateReferences: phase9MinimalDiscoveryGateLanes.slice(0, -1) as never })).toThrow(/Phase 9E gate references/i);
    expect(() => assertPhase9LeadDiscoveryFinalLockdownSafe({ ...result, flags: { ...phase9LeadDiscoveryFinalLockdownFlags, goLiveAuthorized: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase9LeadDiscoveryFinalLockdownSafe({ ...result, finalLockdownRules: [] })).toThrow(/final lockdown rules/i);
    expect(() => assertPhase9LeadDiscoveryFinalLockdownSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase9LeadDiscoveryFinalLockdownSafe({ ...result, finalLockdownRules: ["Phase 10 implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
