import { phase8DealQualityImplementationLanes } from "./phase-8-deal-quality-implementation-scope";
import {
  assertPhase8MinimalDealQualityGateSafe,
  getPhase8MinimalDealQualityGate,
  getPhase8MinimalDealQualityGateSummary,
  phase8MinimalDealQualityGateFlags,
  phase8MinimalDealQualityGateLanes,
} from "./phase-8-minimal-deal-quality-gate";

describe("phase 8E minimal deal quality gate", () => {
  it("pins Phase 8E fields and preserves implementation references", () => {
    const result = getPhase8MinimalDealQualityGate();

    expect(result.phase).toBe("Phase 8: Deal Quality Intelligence");
    expect(result.phaseStep).toBe("Phase 8E — Minimal Deal Quality Intelligence Gate");
    expect(result.previousStep).toBe("Phase 8D — Deal Quality Intelligence Implementation Scope");
    expect(result.gateLanes).toEqual(phase8MinimalDealQualityGateLanes);
    expect(result.implementationScopeReferences).toEqual(phase8DealQualityImplementationLanes);
    expect(result.gateLanes).toContain("minimal_readonly_deal_quality_package");
    expect(result.gateLanes).toContain("blocked_mutation_offer_contract_execution_paths");
  });

  it("cannot authorize implementation mutation offers contracts closing or Phase 9", () => {
    const result = getPhase8MinimalDealQualityGate();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.propertyFactInventionEnabled).toBe(false);
    expect(result.flags.analyzerMutationEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.offerGenerationEnabled).toBe(false);
    expect(result.flags.closingExecutionEnabled).toBe(false);
    expect(result.flags.phase9ImplementationEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 8F — Deal Quality Final Lockdown");
  });

  it("summarizes minimal gate boundaries", () => {
    const summary = getPhase8MinimalDealQualityGateSummary();

    expect(summary).toMatch(/minimal Deal Quality Intelligence gate/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/property fact verification/i);
    expect(summary).toMatch(/valuation and repair confidence judgment/i);
    expect(summary).toMatch(/No invented property facts/i);
    expect(summary).toMatch(/no closing execution/i);
  });

  it("throws on gate lane drift blocked flag missing boundaries and unsafe wording", () => {
    const result = getPhase8MinimalDealQualityGate();

    expect(() => assertPhase8MinimalDealQualityGateSafe({ ...result, gateLanes: phase8MinimalDealQualityGateLanes.slice(0, -1) as never })).toThrow(/gate lanes/i);
    expect(() => assertPhase8MinimalDealQualityGateSafe({ ...result, implementationScopeReferences: phase8DealQualityImplementationLanes.slice(0, -1) as never })).toThrow(/implementation scope references/i);
    expect(() => assertPhase8MinimalDealQualityGateSafe({ ...result, flags: { ...phase8MinimalDealQualityGateFlags, phase9ImplementationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase8MinimalDealQualityGateSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase8MinimalDealQualityGateSafe({ ...result, gateRules: ["implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
