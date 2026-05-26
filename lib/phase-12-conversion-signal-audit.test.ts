import {
  assertPhase12ConversionSignalAuditSafe,
  getPhase12ConversionSignalAudit,
  getPhase12ConversionSignalAuditSummary,
  phase12ConversionSignalAuditFlags,
  phase12ConversionSignalFamilies,
} from "./phase-12-conversion-signal-audit";

describe("phase 12B conversion signal audit", () => {
  it("pins Phase 12B fields and includes repo-grounded signal families", () => {
    const result = getPhase12ConversionSignalAudit();

    expect(result.phase).toBe("Phase 12: Conversion Optimization Engine");
    expect(result.phaseStep).toBe("Phase 12B — Conversion Signal Audit");
    expect(result.previousStep).toBe("Phase 12A — Conversion Optimization Engine Scope");
    expect(result.phaseDecision).toBe("signal_audit_only");
    expect(result.signalFamilies).toEqual(phase12ConversionSignalFamilies);
    expect(result.signalFamilies).toContain("lead_intake_schema_source_tracking_validation_submit_success_phone_cta");
    expect(result.signalFamilies).toContain("z4_manual_conversion_stages_readiness_blocked_execution_boundaries");
    expect(result.groundedReferences.publicSurfaces).toContain("/sell-your-house");
    expect(result.groundedReferences.leadCaptureSurface).toBe("components/forms/lead-capture-form.tsx");
    expect(result.groundedReferences.z4ReadinessReview.readinessLevels).toContain("ready_for_manual_conversion_review");
  });

  it("blocks form UI metadata analytics tracking experiments API schema storage campaigns and spend", () => {
    const result = getPhase12ConversionSignalAudit();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.formChangeEnabled).toBe(false);
    expect(result.flags.uiChangeEnabled).toBe(false);
    expect(result.flags.analyticsEnabled).toBe(false);
    expect(result.flags.trackingEnabled).toBe(false);
    expect(result.flags.experimentEnabled).toBe(false);
    expect(result.flags.apiChangeEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 12C — Manual Conversion Optimization Advisory Policy");
  });

  it("summarizes existing signal audit boundaries", () => {
    const summary = getPhase12ConversionSignalAuditSummary();

    expect(summary).toMatch(/LeadCaptureForm/i);
    expect(summary).toMatch(/leadIntakeSchema/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/No form changes/i);
    expect(summary).toMatch(/no analytics\/tracking/i);
    expect(summary).toMatch(/no CRM mutation/i);
  });

  it("throws on missing signal families blocked flags and unsafe wording", () => {
    const result = getPhase12ConversionSignalAudit();

    expect(() => assertPhase12ConversionSignalAuditSafe({ ...result, signalFamilies: phase12ConversionSignalFamilies.slice(0, -1) as never })).toThrow(/signal families/i);
    expect(() => assertPhase12ConversionSignalAuditSafe({ ...result, flags: { ...phase12ConversionSignalAuditFlags, trackingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase12ConversionSignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase12ConversionSignalAuditSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase12ConversionSignalAuditSafe({ ...result, auditPurpose: ["analytics is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
