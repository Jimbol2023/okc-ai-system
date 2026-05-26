import {
  assertPhase9LeadDiscoverySignalAuditSafe,
  getPhase9LeadDiscoverySignalAudit,
  getPhase9LeadDiscoverySignalAuditSummary,
  phase9LeadDiscoverySignalAuditFlags,
  phase9LeadDiscoverySignalFamilies,
} from "./phase-9-lead-discovery-signal-audit";

describe("phase 9B lead discovery signal audit", () => {
  it("pins Phase 9B fields and includes repo-grounded signal families", () => {
    const result = getPhase9LeadDiscoverySignalAudit();

    expect(result.phase).toBe("Phase 9: AI-Assisted Lead Discovery");
    expect(result.phaseStep).toBe("Phase 9B — Lead Discovery Signal Audit");
    expect(result.previousStep).toBe("Phase 9A — AI-Assisted Lead Discovery Scope");
    expect(result.signalFamilies).toEqual(phase9LeadDiscoverySignalFamilies);
    expect(result.signalFamilies).toContain("lead_source_taxonomy_and_aliases");
    expect(result.signalFamilies).toContain("list_importer_preview_resolution_readiness_duplicates_headers_blockers_cleanup");
    expect(result.signalFamilies).toContain("source_quality_intelligence_lanes_and_forbidden_drift");
    expect(result.signalFamilies).toContain("activation_evidence_source_provenance_legal_manual_no_scraping_no_skip_tracing");
  });

  it("blocks discovery execution and sourcing mutation", () => {
    const result = getPhase9LeadDiscoverySignalAudit();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.publicRecordConnectorEnabled).toBe(false);
    expect(result.flags.mapAutomationEnabled).toBe(false);
    expect(result.flags.gpsSurveillanceEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 9C — Manual Lead Discovery Advisory Policy");
  });

  it("summarizes signal audit boundaries", () => {
    const summary = getPhase9LeadDiscoverySignalAuditSummary();

    expect(summary).toMatch(/lead-source/i);
    expect(summary).toMatch(/list-importer/i);
    expect(summary).toMatch(/source-quality/i);
    expect(summary).toMatch(/human-owned source judgment/i);
    expect(summary).toMatch(/No scraping/i);
    expect(summary).toMatch(/no spend increase/i);
  });

  it("throws on signal drift blocked flag and unsafe wording", () => {
    const result = getPhase9LeadDiscoverySignalAudit();

    expect(() => assertPhase9LeadDiscoverySignalAuditSafe({ ...result, signalFamilies: phase9LeadDiscoverySignalFamilies.slice(0, -1) as never })).toThrow(/signal families/i);
    expect(() => assertPhase9LeadDiscoverySignalAuditSafe({ ...result, flags: { ...phase9LeadDiscoverySignalAuditFlags, mapAutomationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase9LeadDiscoverySignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase9LeadDiscoverySignalAuditSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase9LeadDiscoverySignalAuditSafe({ ...result, stopRules: ["skip tracing is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
