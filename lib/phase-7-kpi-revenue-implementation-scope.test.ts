import { phase7KpiIntelligenceLanes, phase7KpiRevenueSummaryStates } from "./phase-7-manual-kpi-revenue-policy";
import {
  assertPhase7KpiRevenueImplementationScopeSafe,
  getPhase7KpiRevenueImplementationScope,
  getPhase7KpiRevenueImplementationScopeSummary,
  phase7KpiRevenueImplementationLanes,
  phase7KpiRevenueImplementationScopeFlags,
} from "./phase-7-kpi-revenue-implementation-scope";

describe("phase 7D KPI revenue implementation scope", () => {
  it("pins Phase 7D fields and preserves Phase 7C references", () => {
    const result = getPhase7KpiRevenueImplementationScope();

    expect(result.phase).toBe("Phase 7: KPI & Revenue Intelligence");
    expect(result.phaseStep).toBe("Phase 7D — KPI & Revenue Intelligence Implementation Scope");
    expect(result.previousStep).toBe("Phase 7C — Manual KPI & Revenue Intelligence Policy");
    expect(result.implementationScopeLanes).toEqual(phase7KpiRevenueImplementationLanes);
    expect(result.kpiLaneReferences).toEqual(phase7KpiIntelligenceLanes);
    expect(result.summaryStateReferences).toEqual(phase7KpiRevenueSummaryStates);
    expect(result.implementationScopeLanes).toContain("blocked_execution_persistence_and_spend_paths");
  });

  it("cannot authorize implementation or persistence paths", () => {
    const result = getPhase7KpiRevenueImplementationScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.reportPersistenceEnabled).toBe(false);
    expect(result.flags.scorePersistenceEnabled).toBe(false);
    expect(result.flags.auditWritingEnabled).toBe(false);
    expect(result.flags.storageWritingEnabled).toBe(false);
    expect(result.flags.phase8ImplementationEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 7E — Minimal KPI & Revenue Intelligence Gate");
  });

  it("summarizes future read-only visibility without execution", () => {
    const summary = getPhase7KpiRevenueImplementationScopeSummary();

    expect(summary).toMatch(/read-only KPI and revenue visibility/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned KPI interpretation/i);
    expect(summary).toMatch(/No implementation execution/i);
    expect(summary).toMatch(/no score persistence/i);
    expect(summary).toMatch(/no revenue execution/i);
  });

  it("throws on implementation lane drift references blocked flags and unsafe wording", () => {
    const result = getPhase7KpiRevenueImplementationScope();

    expect(() => assertPhase7KpiRevenueImplementationScopeSafe({ ...result, implementationScopeLanes: phase7KpiRevenueImplementationLanes.slice(0, -1) as never })).toThrow(/implementation scope lanes/i);
    expect(() => assertPhase7KpiRevenueImplementationScopeSafe({ ...result, kpiLaneReferences: phase7KpiIntelligenceLanes.slice(0, -1) as never })).toThrow(/KPI lane references/i);
    expect(() => assertPhase7KpiRevenueImplementationScopeSafe({ ...result, summaryStateReferences: phase7KpiRevenueSummaryStates.slice(0, -1) as never })).toThrow(/summary state references/i);
    expect(() => assertPhase7KpiRevenueImplementationScopeSafe({ ...result, flags: { ...phase7KpiRevenueImplementationScopeFlags, storageWritingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase7KpiRevenueImplementationScopeSafe({ ...result, scopeRules: ["spend change is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
