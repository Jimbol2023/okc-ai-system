import { z7BottleneckCleanupLanes } from "./z7-manual-revenue-bottleneck-policy";
import { z8RecoveryCoordinationLanes } from "./z8-manual-revenue-recovery-policy";
import { z9RevenueRiskReviewLanes } from "./z9-manual-revenue-risk-policy";
import {
  assertPhase7KpiRevenueSignalAuditSafe,
  getPhase7KpiRevenueSignalAudit,
  getPhase7KpiRevenueSignalAuditSummary,
  phase7KpiRevenueSignalAuditFlags,
  phase7KpiRevenueSignalFamilies,
} from "./phase-7-kpi-revenue-signal-audit";

describe("phase 7B KPI revenue signal audit", () => {
  it("pins Phase 7B fields and includes repo-grounded signal families", () => {
    const result = getPhase7KpiRevenueSignalAudit();

    expect(result.phase).toBe("Phase 7: KPI & Revenue Intelligence");
    expect(result.phaseStep).toBe("Phase 7B — KPI & Revenue Signal Audit");
    expect(result.previousStep).toBe("Phase 7A — KPI & Revenue Intelligence Scope");
    expect(result.signalFamilies).toEqual(phase7KpiRevenueSignalFamilies);
    expect(result.signalFamilies).toContain("r53_manual_revenue_metrics_safe_metric_families");
    expect(result.signalFamilies).toContain("r53_manual_revenue_metrics_excluded_unsafe_metrics");
    expect(result.signalFamilies).toContain("dashboard_signal_consolidation_priorities_and_cards");
    expect(result.signalFamilies).toContain("revenue_pipeline_buckets_actions_urgency_bottlenecks_missing_value_assumptions");
    expect(result.z7LaneReferences).toEqual(z7BottleneckCleanupLanes);
    expect(result.z8LaneReferences).toEqual(z8RecoveryCoordinationLanes);
    expect(result.z9LaneReferences).toEqual(z9RevenueRiskReviewLanes);
  });

  it("blocks persistence mutation execution spend and marketing changes", () => {
    const result = getPhase7KpiRevenueSignalAudit();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.reportPersistenceEnabled).toBe(false);
    expect(result.flags.sourceMutationEnabled).toBe(false);
    expect(result.flags.spendChangeEnabled).toBe(false);
    expect(result.flags.marketingChangeEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 7C — Manual KPI & Revenue Intelligence Policy");
  });

  it("summarizes KPI revenue audit boundaries", () => {
    const summary = getPhase7KpiRevenueSignalAuditSummary();

    expect(summary).toMatch(/R53 safe metrics/i);
    expect(summary).toMatch(/dashboard signal consolidation/i);
    expect(summary).toMatch(/revenue pipeline/i);
    expect(summary).toMatch(/human-owned KPI interpretation/i);
    expect(summary).toMatch(/No KPI persistence/i);
    expect(summary).toMatch(/no revenue execution/i);
  });

  it("throws on signal reference drift blocked flag and unsafe wording", () => {
    const result = getPhase7KpiRevenueSignalAudit();

    expect(() => assertPhase7KpiRevenueSignalAuditSafe({ ...result, signalFamilies: phase7KpiRevenueSignalFamilies.slice(0, -1) as never })).toThrow(/signal families/i);
    expect(() => assertPhase7KpiRevenueSignalAuditSafe({ ...result, z8LaneReferences: z8RecoveryCoordinationLanes.slice(0, -1) as never })).toThrow(/Z7 Z8 Z9/i);
    expect(() => assertPhase7KpiRevenueSignalAuditSafe({ ...result, flags: { ...phase7KpiRevenueSignalAuditFlags, sourceMutationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase7KpiRevenueSignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase7KpiRevenueSignalAuditSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase7KpiRevenueSignalAuditSafe({ ...result, stopRules: ["score persistence is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
