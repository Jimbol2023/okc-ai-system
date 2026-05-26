import {
  assertPhase12ConversionImplementationScopeSafe,
  getPhase12ConversionImplementationScope,
  getPhase12ConversionImplementationScopeSummary,
  phase12ConversionImplementationLanes,
  phase12ConversionImplementationScopeFlags,
} from "./phase-12-conversion-implementation-scope";
import { phase12ConversionSignalFamilies } from "./phase-12-conversion-signal-audit";
import { phase12ConversionSummaryStates, phase12ManualConversionOptimizationLanes } from "./phase-12-manual-conversion-optimization-policy";

describe("phase 12D conversion implementation scope", () => {
  it("pins Phase 12D fields and references prior policy unchanged", () => {
    const result = getPhase12ConversionImplementationScope();

    expect(result.phase).toBe("Phase 12: Conversion Optimization Engine");
    expect(result.phaseStep).toBe("Phase 12D — Conversion Optimization Implementation Scope");
    expect(result.previousStep).toBe("Phase 12C — Manual Conversion Optimization Advisory Policy");
    expect(result.phaseDecision).toBe("implementation_scope_only");
    expect(result.implementationLanes).toEqual(phase12ConversionImplementationLanes);
    expect(result.signalReferences).toEqual(phase12ConversionSignalFamilies);
    expect(result.policyLaneReferences).toEqual(phase12ManualConversionOptimizationLanes);
    expect(result.summaryStateReferences).toEqual(phase12ConversionSummaryStates);
  });

  it("cannot authorize implementation publishing form API schema storage CRM provider campaigns or go-live", () => {
    const result = getPhase12ConversionImplementationScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.formChangeEnabled).toBe(false);
    expect(result.flags.apiChangeEnabled).toBe(false);
    expect(result.flags.schemaChangeEnabled).toBe(false);
    expect(result.flags.storageMutationEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 12E — Minimal Conversion Optimization Gate");
  });

  it("summarizes future scope without execution", () => {
    const summary = getPhase12ConversionImplementationScopeSummary();

    expect(summary).toMatch(/possible future read-only conversion optimization package/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/future implementation approval/i);
    expect(summary).toMatch(/No form changes/i);
    expect(summary).toMatch(/no analytics\/tracking/i);
    expect(summary).toMatch(/no spend increase/i);
  });

  it("throws on missing lanes references blocked flags and unsafe wording", () => {
    const result = getPhase12ConversionImplementationScope();

    expect(() => assertPhase12ConversionImplementationScopeSafe({ ...result, implementationLanes: phase12ConversionImplementationLanes.slice(0, -1) as never })).toThrow(/implementation lanes/i);
    expect(() => assertPhase12ConversionImplementationScopeSafe({ ...result, policyLaneReferences: phase12ManualConversionOptimizationLanes.slice(0, -1) as never })).toThrow(/policy lane references/i);
    expect(() => assertPhase12ConversionImplementationScopeSafe({ ...result, flags: { ...phase12ConversionImplementationScopeFlags, apiChangeEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase12ConversionImplementationScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase12ConversionImplementationScopeSafe({ ...result, scopeRules: ["implementation execution is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
