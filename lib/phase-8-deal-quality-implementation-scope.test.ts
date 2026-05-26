import { phase8DealQualityReviewLanes, phase8DealQualitySummaryStates } from "./phase-8-manual-deal-quality-policy";
import {
  assertPhase8DealQualityImplementationScopeSafe,
  getPhase8DealQualityImplementationScope,
  getPhase8DealQualityImplementationScopeSummary,
  phase8DealQualityImplementationLanes,
  phase8DealQualityImplementationScopeFlags,
} from "./phase-8-deal-quality-implementation-scope";

describe("phase 8D deal quality implementation scope", () => {
  it("pins Phase 8D fields and preserves Phase 8C references", () => {
    const result = getPhase8DealQualityImplementationScope();

    expect(result.phase).toBe("Phase 8: Deal Quality Intelligence");
    expect(result.phaseStep).toBe("Phase 8D — Deal Quality Intelligence Implementation Scope");
    expect(result.previousStep).toBe("Phase 8C — Manual Deal Quality Review Policy");
    expect(result.implementationScopeLanes).toEqual(phase8DealQualityImplementationLanes);
    expect(result.dealQualityLaneReferences).toEqual(phase8DealQualityReviewLanes);
    expect(result.summaryStateReferences).toEqual(phase8DealQualitySummaryStates);
    expect(result.implementationScopeLanes).toContain("blocked_execution_mutation_offer_contract_paths");
  });

  it("cannot authorize implementation mutation offers contracts outreach closing or Phase 9", () => {
    const result = getPhase8DealQualityImplementationScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.analyzerMutationEnabled).toBe(false);
    expect(result.flags.dealScorePersistenceEnabled).toBe(false);
    expect(result.flags.offerGenerationEnabled).toBe(false);
    expect(result.flags.contractGenerationEnabled).toBe(false);
    expect(result.flags.phase9ImplementationEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 8E — Minimal Deal Quality Intelligence Gate");
  });

  it("summarizes future read-only visibility without execution", () => {
    const summary = getPhase8DealQualityImplementationScopeSummary();

    expect(summary).toMatch(/read-only deal-quality visibility/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/property fact verification/i);
    expect(summary).toMatch(/No implementation execution/i);
    expect(summary).toMatch(/no analyzer mutation/i);
    expect(summary).toMatch(/no closing execution/i);
  });

  it("throws on implementation lane drift references blocked flags and unsafe wording", () => {
    const result = getPhase8DealQualityImplementationScope();

    expect(() => assertPhase8DealQualityImplementationScopeSafe({ ...result, implementationScopeLanes: phase8DealQualityImplementationLanes.slice(0, -1) as never })).toThrow(/implementation scope lanes/i);
    expect(() => assertPhase8DealQualityImplementationScopeSafe({ ...result, dealQualityLaneReferences: phase8DealQualityReviewLanes.slice(0, -1) as never })).toThrow(/deal-quality lane references/i);
    expect(() => assertPhase8DealQualityImplementationScopeSafe({ ...result, summaryStateReferences: phase8DealQualitySummaryStates.slice(0, -1) as never })).toThrow(/summary state references/i);
    expect(() => assertPhase8DealQualityImplementationScopeSafe({ ...result, flags: { ...phase8DealQualityImplementationScopeFlags, analyzerMutationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase8DealQualityImplementationScopeSafe({ ...result, scopeRules: ["closing execution is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
