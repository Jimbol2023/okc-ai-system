import {
  assertPhase10VirtualD4dSignalAuditSafe,
  getPhase10VirtualD4dSignalAudit,
  getPhase10VirtualD4dSignalAuditSummary,
  phase10VirtualD4dSignalAuditFlags,
  phase10VirtualD4dSignalFamilies,
} from "./phase-10-virtual-d4d-signal-audit";

describe("phase 10B virtual D4D signal audit", () => {
  it("pins Phase 10B fields and includes repo-grounded signal families", () => {
    const result = getPhase10VirtualD4dSignalAudit();

    expect(result.phase).toBe("Phase 10: Virtual Driving for Dollars Intelligence Engine");
    expect(result.phaseStep).toBe("Phase 10B — Virtual D4D Signal Audit");
    expect(result.previousStep).toBe("Phase 10A — Virtual Driving for Dollars Intelligence Scope");
    expect(result.phaseDecision).toBe("signal_audit_only");
    expect(result.signalFamilies).toEqual(phase10VirtualD4dSignalFamilies);
    expect(result.signalFamilies).toContain("r75_drift_data_sourcing_risk_categories");
    expect(result.signalFamilies).toContain("manual_d4d_property_capture_fields_lanes_provenance_distress_duplicates_cleanup");
    expect(result.groundedReferences.r75DriftRiskCategories).toContain("map-readiness-to-map-crawling drift");
    expect(result.groundedReferences.manualD4dCaptureFields).toContain("provenance note");
  });

  it("blocks maps GPS Street View external APIs owner contact lead creation campaigns and spend", () => {
    const result = getPhase10VirtualD4dSignalAudit();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.mapCrawlingEnabled).toBe(false);
    expect(result.flags.mapAutomationEnabled).toBe(false);
    expect(result.flags.streetViewAutomationEnabled).toBe(false);
    expect(result.flags.gpsSurveillanceEnabled).toBe(false);
    expect(result.flags.externalApiEnabled).toBe(false);
    expect(result.flags.ownerContactEnabled).toBe(false);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 10C — Manual Virtual D4D Advisory Policy");
  });

  it("summarizes existing signal audit boundaries", () => {
    const summary = getPhase10VirtualD4dSignalAuditSummary();

    expect(summary).toMatch(/audits existing R75/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/No scraping/i);
    expect(summary).toMatch(/no map crawling/i);
    expect(summary).toMatch(/no owner contact/i);
    expect(summary).toMatch(/no autonomous lead creation/i);
  });

  it("throws on missing signal families blocked flags and unsafe wording", () => {
    const result = getPhase10VirtualD4dSignalAudit();

    expect(() => assertPhase10VirtualD4dSignalAuditSafe({ ...result, signalFamilies: phase10VirtualD4dSignalFamilies.slice(0, -1) as never })).toThrow(/signal families/i);
    expect(() => assertPhase10VirtualD4dSignalAuditSafe({ ...result, flags: { ...phase10VirtualD4dSignalAuditFlags, ownerContactEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase10VirtualD4dSignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase10VirtualD4dSignalAuditSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase10VirtualD4dSignalAuditSafe({ ...result, auditPurpose: ["map crawling is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
