import { phase7KpiRevenueImplementationLanes } from "./phase-7-kpi-revenue-implementation-scope";
import {
  assertPhase7MinimalKpiRevenueGateSafe,
  getPhase7MinimalKpiRevenueGate,
  getPhase7MinimalKpiRevenueGateSummary,
  phase7MinimalKpiRevenueGateFlags,
  phase7MinimalKpiRevenueGateLanes,
} from "./phase-7-minimal-kpi-revenue-gate";

describe("phase 7E minimal KPI revenue gate", () => {
  it("pins Phase 7E fields and preserves implementation references", () => {
    const result = getPhase7MinimalKpiRevenueGate();

    expect(result.phase).toBe("Phase 7: KPI & Revenue Intelligence");
    expect(result.phaseStep).toBe("Phase 7E — Minimal KPI & Revenue Intelligence Gate");
    expect(result.previousStep).toBe("Phase 7D — KPI & Revenue Intelligence Implementation Scope");
    expect(result.gateLanes).toEqual(phase7MinimalKpiRevenueGateLanes);
    expect(result.implementationScopeReferences).toEqual(phase7KpiRevenueImplementationLanes);
    expect(result.gateLanes).toContain("minimal_readonly_kpi_package");
    expect(result.gateLanes).toContain("blocked_persistence_execution_spend_paths");
  });

  it("cannot authorize implementation persistence execution or spend paths", () => {
    const result = getPhase7MinimalKpiRevenueGate();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.kpiPersistenceEnabled).toBe(false);
    expect(result.flags.metricPersistenceEnabled).toBe(false);
    expect(result.flags.sourceMutationEnabled).toBe(false);
    expect(result.flags.spendChangeEnabled).toBe(false);
    expect(result.flags.marketingChangeEnabled).toBe(false);
    expect(result.flags.phase8ImplementationEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 7F — KPI & Revenue Final Lockdown");
  });

  it("summarizes minimal gate boundaries", () => {
    const summary = getPhase7MinimalKpiRevenueGateSummary();

    expect(summary).toMatch(/minimal KPI & Revenue Intelligence gate/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned revenue claim review/i);
    expect(summary).toMatch(/source quality judgment/i);
    expect(summary).toMatch(/No KPI persistence/i);
    expect(summary).toMatch(/no revenue execution/i);
  });

  it("throws on gate lane drift blocked flag missing boundaries and unsafe wording", () => {
    const result = getPhase7MinimalKpiRevenueGate();

    expect(() => assertPhase7MinimalKpiRevenueGateSafe({ ...result, gateLanes: phase7MinimalKpiRevenueGateLanes.slice(0, -1) as never })).toThrow(/gate lanes/i);
    expect(() => assertPhase7MinimalKpiRevenueGateSafe({ ...result, implementationScopeReferences: phase7KpiRevenueImplementationLanes.slice(0, -1) as never })).toThrow(/implementation scope references/i);
    expect(() => assertPhase7MinimalKpiRevenueGateSafe({ ...result, flags: { ...phase7MinimalKpiRevenueGateFlags, phase8ImplementationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase7MinimalKpiRevenueGateSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase7MinimalKpiRevenueGateSafe({ ...result, gateRules: ["implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
