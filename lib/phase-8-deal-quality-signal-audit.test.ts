import {
  assertPhase8DealQualitySignalAuditSafe,
  getPhase8DealQualitySignalAudit,
  getPhase8DealQualitySignalAuditSummary,
  phase8DealQualitySignalAuditFlags,
  phase8DealQualitySignalFamilies,
} from "./phase-8-deal-quality-signal-audit";

describe("phase 8B deal quality signal audit", () => {
  it("pins Phase 8B fields and includes repo-grounded signal families", () => {
    const result = getPhase8DealQualitySignalAudit();

    expect(result.phase).toBe("Phase 8: Deal Quality Intelligence");
    expect(result.phaseStep).toBe("Phase 8B — Deal Quality Signal Audit");
    expect(result.previousStep).toBe("Phase 8A — Deal Quality Intelligence Scope");
    expect(result.signalFamilies).toEqual(phase8DealQualitySignalFamilies);
    expect(result.signalFamilies).toContain("closing_readiness_contract_title_earnest_money_closing_risk");
    expect(result.signalFamilies).toContain("disposition_readiness_buyer_assignment_arv_repairs_spread_photos_access");
    expect(result.signalFamilies).toContain("revenue_pipeline_buckets_bottlenecks_missing_value_assumptions");
    expect(result.signalFamilies).toContain("r65_lead_quality_missing_arv_repairs_property_condition_duplicate_readiness_revenue_risk");
    expect(result.signalFamilies).toContain("existing_analyzer_fields_only");
  });

  it("blocks fact invention mutation offers contracts outreach and closing", () => {
    const result = getPhase8DealQualitySignalAudit();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.analyzerMutationEnabled).toBe(false);
    expect(result.flags.dealScorePersistenceEnabled).toBe(false);
    expect(result.flags.offerGenerationEnabled).toBe(false);
    expect(result.flags.contractGenerationEnabled).toBe(false);
    expect(result.flags.closingExecutionEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 8C — Manual Deal Quality Review Policy");
  });

  it("summarizes deal-quality signal boundaries", () => {
    const summary = getPhase8DealQualitySignalAuditSummary();

    expect(summary).toMatch(/closing readiness/i);
    expect(summary).toMatch(/disposition readiness/i);
    expect(summary).toMatch(/revenue pipeline/i);
    expect(summary).toMatch(/R65 lead quality/i);
    expect(summary).toMatch(/No invented property facts/i);
    expect(summary).toMatch(/no closing execution/i);
  });

  it("throws on signal drift blocked flag and unsafe wording", () => {
    const result = getPhase8DealQualitySignalAudit();

    expect(() => assertPhase8DealQualitySignalAuditSafe({ ...result, signalFamilies: phase8DealQualitySignalFamilies.slice(0, -1) as never })).toThrow(/signal families/i);
    expect(() => assertPhase8DealQualitySignalAuditSafe({ ...result, flags: { ...phase8DealQualitySignalAuditFlags, closingExecutionEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase8DealQualitySignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase8DealQualitySignalAuditSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase8DealQualitySignalAuditSafe({ ...result, stopRules: ["offer generation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
