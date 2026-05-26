import {
  assertPhase8DealQualityIntelligenceScopeSafe,
  getPhase8DealQualityIntelligenceScope,
  getPhase8DealQualityIntelligenceScopeSummary,
  phase8DealQualityIntelligenceScopeFlags,
} from "./phase-8-deal-quality-intelligence-scope";

describe("phase 8A deal quality intelligence scope", () => {
  it("pins Phase 8A fields and preserves Phase 7F continuity", () => {
    const result = getPhase8DealQualityIntelligenceScope();

    expect(result.phase).toBe("Phase 8: Deal Quality Intelligence");
    expect(result.phaseStep).toBe("Phase 8A — Deal Quality Intelligence Scope");
    expect(result.previousStep).toBe("Phase 7F — KPI & Revenue Final Lockdown");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.phase7FinalLockdownReference.rules.join(" ")).toMatch(/locks Phase 7/i);
    expect(result.recommendedNextExactStep).toBe("Phase 8B — Deal Quality Signal Audit");
  });

  it("keeps all decisions and blocked flags safe", () => {
    const result = getPhase8DealQualityIntelligenceScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.propertyFactInventionEnabled).toBe(false);
    expect(result.flags.analyzerMutationEnabled).toBe(false);
    expect(result.flags.dealScorePersistenceEnabled).toBe(false);
    expect(result.flags.offerGenerationEnabled).toBe(false);
    expect(result.flags.closingMutationEnabled).toBe(false);
    expect(result.flags.phase9ImplementationEnabled).toBe(false);
  });

  it("summarizes highest aROI deal quality boundaries", () => {
    const summary = getPhase8DealQualityIntelligenceScopeSummary();

    expect(summary).toMatch(/Phase 8A/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned deal quality judgment/i);
    expect(summary).toMatch(/property fact verification/i);
    expect(summary).toMatch(/valuation judgment/i);
    expect(summary).toMatch(/repair judgment/i);
    expect(summary).toMatch(/No invented property facts/i);
    expect(summary).toMatch(/no analyzer mutation/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no offer or contract generation/i);
    expect(summary).toMatch(/no closing execution/i);
  });

  it("throws on pinned drift blocked flags missing rules boundaries and unsafe wording", () => {
    const result = getPhase8DealQualityIntelligenceScope();

    expect(() => assertPhase8DealQualityIntelligenceScopeSafe({ ...result, phaseStep: "Phase 8X" as never })).toThrow(/step/i);
    expect(() => assertPhase8DealQualityIntelligenceScopeSafe({ ...result, flags: { ...phase8DealQualityIntelligenceScopeFlags, analyzerMutationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase8DealQualityIntelligenceScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase8DealQualityIntelligenceScopeSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase8DealQualityIntelligenceScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase8DealQualityIntelligenceScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase8DealQualityIntelligenceScopeSafe({ ...result, stopRules: ["property fact invention is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
