import { phase9LeadDiscoverySummaryStates, phase9ManualDiscoveryLanes } from "./phase-9-manual-discovery-policy";
import {
  assertPhase9LeadDiscoveryImplementationScopeSafe,
  getPhase9LeadDiscoveryImplementationScope,
  getPhase9LeadDiscoveryImplementationScopeSummary,
  phase9LeadDiscoveryImplementationLanes,
  phase9LeadDiscoveryImplementationScopeFlags,
} from "./phase-9-lead-discovery-implementation-scope";

describe("phase 9D lead discovery implementation scope", () => {
  it("pins Phase 9D fields and preserves Phase 9C references", () => {
    const result = getPhase9LeadDiscoveryImplementationScope();

    expect(result.phase).toBe("Phase 9: AI-Assisted Lead Discovery");
    expect(result.phaseStep).toBe("Phase 9D — Lead Discovery Implementation Scope");
    expect(result.previousStep).toBe("Phase 9C — Manual Lead Discovery Advisory Policy");
    expect(result.implementationScopeLanes).toEqual(phase9LeadDiscoveryImplementationLanes);
    expect(result.discoveryLaneReferences).toEqual(phase9ManualDiscoveryLanes);
    expect(result.summaryStateReferences).toEqual(phase9LeadDiscoverySummaryStates);
    expect(result.implementationScopeLanes).toContain("blocked_execution_sourcing_map_spend_paths");
  });

  it("cannot authorize implementation sourcing maps campaigns or Phase 10", () => {
    const result = getPhase9LeadDiscoveryImplementationScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.sourceMutationEnabled).toBe(false);
    expect(result.flags.publicRecordConnectorEnabled).toBe(false);
    expect(result.flags.gpsSurveillanceEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.flags.phase10ImplementationEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 9E — Minimal Lead Discovery Gate");
  });

  it("summarizes future read-only visibility without execution", () => {
    const summary = getPhase9LeadDiscoveryImplementationScopeSummary();

    expect(summary).toMatch(/read-only lead-discovery visibility/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/legal-source verification/i);
    expect(summary).toMatch(/No implementation execution/i);
    expect(summary).toMatch(/no map automation/i);
  });

  it("throws on implementation lane drift references blocked flags and unsafe wording", () => {
    const result = getPhase9LeadDiscoveryImplementationScope();

    expect(() => assertPhase9LeadDiscoveryImplementationScopeSafe({ ...result, implementationScopeLanes: phase9LeadDiscoveryImplementationLanes.slice(0, -1) as never })).toThrow(/implementation scope lanes/i);
    expect(() => assertPhase9LeadDiscoveryImplementationScopeSafe({ ...result, discoveryLaneReferences: phase9ManualDiscoveryLanes.slice(0, -1) as never })).toThrow(/discovery lane references/i);
    expect(() => assertPhase9LeadDiscoveryImplementationScopeSafe({ ...result, summaryStateReferences: phase9LeadDiscoverySummaryStates.slice(0, -1) as never })).toThrow(/summary state references/i);
    expect(() => assertPhase9LeadDiscoveryImplementationScopeSafe({ ...result, flags: { ...phase9LeadDiscoveryImplementationScopeFlags, publicRecordConnectorEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase9LeadDiscoveryImplementationScopeSafe({ ...result, scopeRules: ["map automation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
