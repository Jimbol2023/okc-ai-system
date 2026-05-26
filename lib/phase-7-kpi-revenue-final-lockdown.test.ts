import { phase7MinimalKpiRevenueGateLanes } from "./phase-7-minimal-kpi-revenue-gate";
import {
  assertPhase7KpiRevenueFinalLockdownSafe,
  getPhase7KpiRevenueFinalLockdown,
  getPhase7KpiRevenueFinalLockdownSummary,
  phase7KpiRevenueFinalLockdownFlags,
} from "./phase-7-kpi-revenue-final-lockdown";

describe("phase 7F KPI revenue final lockdown", () => {
  it("pins Phase 7F fields and recommends Phase 8", () => {
    const result = getPhase7KpiRevenueFinalLockdown();

    expect(result.phase).toBe("Phase 7: KPI & Revenue Intelligence");
    expect(result.phaseStep).toBe("Phase 7F — KPI & Revenue Final Lockdown");
    expect(result.previousStep).toBe("Phase 7E — Minimal KPI & Revenue Intelligence Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.phase7eGateReferences).toEqual(phase7MinimalKpiRevenueGateLanes);
    expect(result.recommendedNextExactStep).toBe("Phase 8 — Deal Quality Intelligence");
    expect(result.nextStageRecommendation).toBe("Phase 8 — Deal Quality Intelligence");
  });

  it("locks all execution mutation persistence and Phase 8 implementation flags", () => {
    const result = getPhase7KpiRevenueFinalLockdown();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.phase7LockdownEnforced).toBe(true);
    expect(result.flags.kpiPersistenceEnabled).toBe(false);
    expect(result.flags.reportPersistenceEnabled).toBe(false);
    expect(result.flags.scorePersistenceEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.revenueExecutionEnabled).toBe(false);
    expect(result.flags.phase8ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes Phase 7 lockdown and Phase 8 handoff", () => {
    const summary = getPhase7KpiRevenueFinalLockdownSummary();

    expect(summary).toMatch(/Phase 7F/i);
    expect(summary).toMatch(/final lockdown/i);
    expect(summary).toMatch(/human-owned KPI interpretation/i);
    expect(summary).toMatch(/source judgment/i);
    expect(summary).toMatch(/No KPI persistence/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no revenue execution/i);
    expect(summary).toMatch(/Phase 8 — Deal Quality Intelligence/i);
  });

  it("throws on pinned drift gate references blocked flags missing rules and unsafe wording", () => {
    const result = getPhase7KpiRevenueFinalLockdown();

    expect(() => assertPhase7KpiRevenueFinalLockdownSafe({ ...result, phaseStep: "Phase 7Z" as never })).toThrow(/step/i);
    expect(() => assertPhase7KpiRevenueFinalLockdownSafe({ ...result, phase7eGateReferences: phase7MinimalKpiRevenueGateLanes.slice(0, -1) as never })).toThrow(/Phase 7E gate references/i);
    expect(() => assertPhase7KpiRevenueFinalLockdownSafe({ ...result, flags: { ...phase7KpiRevenueFinalLockdownFlags, goLiveAuthorized: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase7KpiRevenueFinalLockdownSafe({ ...result, finalLockdownRules: [] })).toThrow(/final lockdown rules/i);
    expect(() => assertPhase7KpiRevenueFinalLockdownSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase7KpiRevenueFinalLockdownSafe({ ...result, finalLockdownRules: ["Phase 8 implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
