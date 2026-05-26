import {
  assertPhase9AiAssistedLeadDiscoveryScopeSafe,
  getPhase9AiAssistedLeadDiscoveryScope,
  getPhase9AiAssistedLeadDiscoveryScopeSummary,
  phase9AiAssistedLeadDiscoveryScopeFlags,
} from "./phase-9-ai-assisted-lead-discovery-scope";

describe("phase 9A AI-assisted lead discovery scope", () => {
  it("pins Phase 9A fields and preserves Phase 8F continuity", () => {
    const result = getPhase9AiAssistedLeadDiscoveryScope();

    expect(result.phase).toBe("Phase 9: AI-Assisted Lead Discovery");
    expect(result.phaseStep).toBe("Phase 9A — AI-Assisted Lead Discovery Scope");
    expect(result.previousStep).toBe("Phase 8F — Deal Quality Final Lockdown");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.phase8FinalLockdownReference.rules.join(" ")).toMatch(/locks Phase 8/i);
    expect(result.recommendedNextExactStep).toBe("Phase 9B — Lead Discovery Signal Audit");
  });

  it("keeps all decisions and blocked flags safe", () => {
    const result = getPhase9AiAssistedLeadDiscoveryScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.importMutationEnabled).toBe(false);
    expect(result.flags.scrapingEnabled).toBe(false);
    expect(result.flags.skipTracingEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.flags.phase10ImplementationEnabled).toBe(false);
  });

  it("summarizes highest aROI discovery boundaries", () => {
    const summary = getPhase9AiAssistedLeadDiscoveryScopeSummary();

    expect(summary).toMatch(/Phase 9A/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned source judgment/i);
    expect(summary).toMatch(/legal-source verification/i);
    expect(summary).toMatch(/source provenance/i);
    expect(summary).toMatch(/No scraping/i);
    expect(summary).toMatch(/no skip tracing/i);
    expect(summary).toMatch(/no autonomous lead creation/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no spend increase/i);
  });

  it("throws on pinned drift blocked flags missing rules boundaries and unsafe wording", () => {
    const result = getPhase9AiAssistedLeadDiscoveryScope();

    expect(() => assertPhase9AiAssistedLeadDiscoveryScopeSafe({ ...result, phaseStep: "Phase 9X" as never })).toThrow(/step/i);
    expect(() => assertPhase9AiAssistedLeadDiscoveryScopeSafe({ ...result, flags: { ...phase9AiAssistedLeadDiscoveryScopeFlags, scrapingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase9AiAssistedLeadDiscoveryScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase9AiAssistedLeadDiscoveryScopeSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase9AiAssistedLeadDiscoveryScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase9AiAssistedLeadDiscoveryScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase9AiAssistedLeadDiscoveryScopeSafe({ ...result, stopRules: ["lead creation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
