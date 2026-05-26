import {
  assertPhase7KpiRevenueIntelligenceScopeSafe,
  getPhase7KpiRevenueIntelligenceScope,
  getPhase7KpiRevenueIntelligenceScopeSummary,
  phase7KpiRevenueIntelligenceScopeFlags,
} from "./phase-7-kpi-revenue-intelligence-scope";

describe("phase 7A KPI revenue intelligence scope", () => {
  it("pins Phase 7A fields and preserves Phase 6F continuity", () => {
    const result = getPhase7KpiRevenueIntelligenceScope();

    expect(result.phase).toBe("Phase 7: KPI & Revenue Intelligence");
    expect(result.phaseStep).toBe("Phase 7A — KPI & Revenue Intelligence Scope");
    expect(result.previousStep).toBe("Phase 6F — Command Center Final Lockdown");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.phase6FinalLockdownReference.rules.join(" ")).toMatch(/locks Phase 6/i);
    expect(result.recommendedNextExactStep).toBe("Phase 7B — KPI & Revenue Signal Audit");
  });

  it("keeps all execution and persistence decisions not authorized", () => {
    const result = getPhase7KpiRevenueIntelligenceScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.reportPersistenceEnabled).toBe(false);
    expect(result.flags.metricPersistenceEnabled).toBe(false);
    expect(result.flags.scorePersistenceEnabled).toBe(false);
    expect(result.flags.spendChangeEnabled).toBe(false);
    expect(result.flags.marketingChangeEnabled).toBe(false);
    expect(result.flags.revenueExecutionEnabled).toBe(false);
  });

  it("summarizes highest aROI boundaries", () => {
    const summary = getPhase7KpiRevenueIntelligenceScopeSummary();

    expect(summary).toMatch(/Phase 7A/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned KPI interpretation/i);
    expect(summary).toMatch(/source judgment/i);
    expect(summary).toMatch(/revenue judgment/i);
    expect(summary).toMatch(/No KPI persistence/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no outreach/i);
    expect(summary).toMatch(/no automation/i);
    expect(summary).toMatch(/no revenue execution/i);
  });

  it("throws on pinned drift blocked flags missing rules boundaries and unsafe wording", () => {
    const result = getPhase7KpiRevenueIntelligenceScope();

    expect(() => assertPhase7KpiRevenueIntelligenceScopeSafe({ ...result, phaseStep: "Phase 7X" as never })).toThrow(/step/i);
    expect(() => assertPhase7KpiRevenueIntelligenceScopeSafe({ ...result, flags: { ...phase7KpiRevenueIntelligenceScopeFlags, reportPersistenceEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase7KpiRevenueIntelligenceScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase7KpiRevenueIntelligenceScopeSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase7KpiRevenueIntelligenceScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase7KpiRevenueIntelligenceScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase7KpiRevenueIntelligenceScopeSafe({ ...result, stopRules: ["KPI persistence is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
