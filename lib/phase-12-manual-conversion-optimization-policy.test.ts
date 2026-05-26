import { phase12ConversionSignalFamilies } from "./phase-12-conversion-signal-audit";
import {
  assertPhase12ManualConversionOptimizationPolicySafe,
  getPhase12ManualConversionOptimizationPolicy,
  getPhase12ManualConversionOptimizationPolicySummary,
  phase12ConversionSummaryStates,
  phase12ManualConversionOptimizationLanes,
  phase12ManualConversionOptimizationPolicyFlags,
} from "./phase-12-manual-conversion-optimization-policy";

describe("phase 12C manual conversion optimization policy", () => {
  it("pins Phase 12C fields and includes conversion lanes and summary states", () => {
    const result = getPhase12ManualConversionOptimizationPolicy();

    expect(result.phase).toBe("Phase 12: Conversion Optimization Engine");
    expect(result.phaseStep).toBe("Phase 12C — Manual Conversion Optimization Advisory Policy");
    expect(result.previousStep).toBe("Phase 12B — Conversion Signal Audit");
    expect(result.conversionOptimizationLanes).toEqual(phase12ManualConversionOptimizationLanes);
    expect(result.summaryStates).toEqual(phase12ConversionSummaryStates);
    expect(result.signalReferences).toEqual(phase12ConversionSignalFamilies);
    expect(result.conversionOptimizationLanes).toContain("lead_form_friction_review");
    expect(result.conversionOptimizationLanes).toContain("conversion_path_continuity_review");
    expect(result.summaryStates).toContain("validation_clarity_review_only");
  });

  it("blocks form UI content metadata analytics tracking experiments outreach campaigns and spend", () => {
    const result = getPhase12ManualConversionOptimizationPolicy();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.formChangeEnabled).toBe(false);
    expect(result.flags.uiChangeEnabled).toBe(false);
    expect(result.flags.contentChangeEnabled).toBe(false);
    expect(result.flags.metadataChangeEnabled).toBe(false);
    expect(result.flags.analyticsEnabled).toBe(false);
    expect(result.flags.experimentEnabled).toBe(false);
    expect(result.flags.outreachEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 12D — Conversion Optimization Implementation Scope");
  });

  it("summarizes manual policy boundaries", () => {
    const summary = getPhase12ManualConversionOptimizationPolicySummary();

    expect(summary).toMatch(/manual conversion optimization lanes/i);
    expect(summary).toMatch(/summary states/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/experiment approval/i);
    expect(summary).toMatch(/No form changes/i);
    expect(summary).toMatch(/no CRM mutation/i);
  });

  it("throws on lane state reference drift blocked flag and unsafe wording", () => {
    const result = getPhase12ManualConversionOptimizationPolicy();

    expect(() => assertPhase12ManualConversionOptimizationPolicySafe({ ...result, conversionOptimizationLanes: phase12ManualConversionOptimizationLanes.slice(0, -1) as never })).toThrow(/lanes/i);
    expect(() => assertPhase12ManualConversionOptimizationPolicySafe({ ...result, summaryStates: phase12ConversionSummaryStates.slice(0, -1) as never })).toThrow(/summary states/i);
    expect(() => assertPhase12ManualConversionOptimizationPolicySafe({ ...result, signalReferences: phase12ConversionSignalFamilies.slice(0, -1) as never })).toThrow(/signal references/i);
    expect(() => assertPhase12ManualConversionOptimizationPolicySafe({ ...result, flags: { ...phase12ManualConversionOptimizationPolicyFlags, experimentEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase12ManualConversionOptimizationPolicySafe({ ...result, policyRules: ["tracking pixels are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
