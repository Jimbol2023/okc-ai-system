import { phase7KpiRevenueSignalFamilies } from "./phase-7-kpi-revenue-signal-audit";
import {
  assertPhase7ManualKpiRevenuePolicySafe,
  getPhase7ManualKpiRevenuePolicy,
  getPhase7ManualKpiRevenuePolicySummary,
  phase7KpiIntelligenceLanes,
  phase7KpiRevenueSummaryStates,
  phase7ManualKpiRevenuePolicyFlags,
} from "./phase-7-manual-kpi-revenue-policy";

describe("phase 7C manual KPI revenue policy", () => {
  it("pins Phase 7C fields and includes KPI lanes and summary states", () => {
    const result = getPhase7ManualKpiRevenuePolicy();

    expect(result.phase).toBe("Phase 7: KPI & Revenue Intelligence");
    expect(result.phaseStep).toBe("Phase 7C — Manual KPI & Revenue Intelligence Policy");
    expect(result.previousStep).toBe("Phase 7B — KPI & Revenue Signal Audit");
    expect(result.kpiIntelligenceLanes).toEqual(phase7KpiIntelligenceLanes);
    expect(result.summaryStates).toEqual(phase7KpiRevenueSummaryStates);
    expect(result.signalReferences).toEqual(phase7KpiRevenueSignalFamilies);
    expect(result.kpiIntelligenceLanes).toContain("source_quality_review");
    expect(result.kpiIntelligenceLanes).toContain("operator_focus_roi_review");
    expect(result.summaryStates).toContain("pipeline_assumption_only");
  });

  it("blocks persistence mutation execution spend and marketing changes", () => {
    const result = getPhase7ManualKpiRevenuePolicy();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.kpiPersistenceEnabled).toBe(false);
    expect(result.flags.reportPersistenceEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.spendChangeEnabled).toBe(false);
    expect(result.flags.marketingChangeEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 7D — KPI & Revenue Intelligence Implementation Scope");
  });

  it("summarizes manual KPI policy boundaries", () => {
    const summary = getPhase7ManualKpiRevenuePolicySummary();

    expect(summary).toMatch(/manual KPI intelligence lanes/i);
    expect(summary).toMatch(/summary states/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned KPI interpretation/i);
    expect(summary).toMatch(/No KPI persistence/i);
    expect(summary).toMatch(/no spend change/i);
    expect(summary).toMatch(/no marketing change/i);
  });

  it("throws on lane state reference drift blocked flag and unsafe wording", () => {
    const result = getPhase7ManualKpiRevenuePolicy();

    expect(() => assertPhase7ManualKpiRevenuePolicySafe({ ...result, kpiIntelligenceLanes: phase7KpiIntelligenceLanes.slice(0, -1) as never })).toThrow(/KPI intelligence lanes/i);
    expect(() => assertPhase7ManualKpiRevenuePolicySafe({ ...result, summaryStates: phase7KpiRevenueSummaryStates.slice(0, -1) as never })).toThrow(/summary states/i);
    expect(() => assertPhase7ManualKpiRevenuePolicySafe({ ...result, signalReferences: phase7KpiRevenueSignalFamilies.slice(0, -1) as never })).toThrow(/signal references/i);
    expect(() => assertPhase7ManualKpiRevenuePolicySafe({ ...result, flags: { ...phase7ManualKpiRevenuePolicyFlags, kpiPersistenceEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase7ManualKpiRevenuePolicySafe({ ...result, policyRules: ["CRM mutation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
