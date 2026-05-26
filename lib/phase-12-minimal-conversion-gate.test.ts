import {
  assertPhase12MinimalConversionGateSafe,
  getPhase12MinimalConversionGate,
  getPhase12MinimalConversionGateSummary,
  phase12MinimalConversionGateChecks,
  phase12MinimalConversionGateFlags,
} from "./phase-12-minimal-conversion-gate";
import { phase12ConversionImplementationLanes } from "./phase-12-conversion-implementation-scope";
import { phase12ManualConversionOptimizationLanes } from "./phase-12-manual-conversion-optimization-policy";

describe("phase 12E minimal conversion optimization gate", () => {
  it("pins Phase 12E fields and includes gate checks", () => {
    const result = getPhase12MinimalConversionGate();

    expect(result.phase).toBe("Phase 12: Conversion Optimization Engine");
    expect(result.phaseStep).toBe("Phase 12E — Minimal Conversion Optimization Gate");
    expect(result.previousStep).toBe("Phase 12D — Conversion Optimization Implementation Scope");
    expect(result.phaseDecision).toBe("minimal_gate_only");
    expect(result.gateChecks).toEqual(phase12MinimalConversionGateChecks);
    expect(result.implementationLaneReferences).toEqual(phase12ConversionImplementationLanes);
    expect(result.policyLaneReferences).toEqual(phase12ManualConversionOptimizationLanes);
    expect(result.gateChecks).toContain("no_form_ui_content_metadata_boundary_required");
  });

  it("blocks implementation form UI analytics tracking experiments API CRM campaigns and spend", () => {
    const result = getPhase12MinimalConversionGate();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.formChangeEnabled).toBe(false);
    expect(result.flags.uiChangeEnabled).toBe(false);
    expect(result.flags.analyticsEnabled).toBe(false);
    expect(result.flags.trackingEnabled).toBe(false);
    expect(result.flags.experimentEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 12F — Conversion Optimization Final Lockdown");
  });

  it("summarizes minimal gate boundaries", () => {
    const summary = getPhase12MinimalConversionGateSummary();

    expect(summary).toMatch(/minimal read-only conversion optimization package/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/content approval/i);
    expect(summary).toMatch(/No form changes/i);
    expect(summary).toMatch(/no experiments/i);
    expect(summary).toMatch(/Phase 12F — Conversion Optimization Final Lockdown/i);
  });

  it("throws on missing gate checks references blocked flags and unsafe wording", () => {
    const result = getPhase12MinimalConversionGate();

    expect(() => assertPhase12MinimalConversionGateSafe({ ...result, gateChecks: phase12MinimalConversionGateChecks.slice(0, -1) as never })).toThrow(/gate checks/i);
    expect(() => assertPhase12MinimalConversionGateSafe({ ...result, implementationLaneReferences: phase12ConversionImplementationLanes.slice(0, -1) as never })).toThrow(/implementation lane references/i);
    expect(() => assertPhase12MinimalConversionGateSafe({ ...result, flags: { ...phase12MinimalConversionGateFlags, campaignEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase12MinimalConversionGateSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase12MinimalConversionGateSafe({ ...result, gateRules: ["spend increases are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
