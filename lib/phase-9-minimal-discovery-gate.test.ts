import { phase9LeadDiscoveryImplementationLanes } from "./phase-9-lead-discovery-implementation-scope";
import {
  assertPhase9MinimalDiscoveryGateSafe,
  getPhase9MinimalDiscoveryGate,
  getPhase9MinimalDiscoveryGateSummary,
  phase9MinimalDiscoveryGateFlags,
  phase9MinimalDiscoveryGateLanes,
} from "./phase-9-minimal-discovery-gate";

describe("phase 9E minimal discovery gate", () => {
  it("pins Phase 9E fields and preserves implementation references", () => {
    const result = getPhase9MinimalDiscoveryGate();

    expect(result.phase).toBe("Phase 9: AI-Assisted Lead Discovery");
    expect(result.phaseStep).toBe("Phase 9E — Minimal Lead Discovery Gate");
    expect(result.previousStep).toBe("Phase 9D — Lead Discovery Implementation Scope");
    expect(result.gateLanes).toEqual(phase9MinimalDiscoveryGateLanes);
    expect(result.implementationScopeReferences).toEqual(phase9LeadDiscoveryImplementationLanes);
    expect(result.gateLanes).toContain("minimal_readonly_discovery_package");
    expect(result.gateLanes).toContain("blocked_sourcing_execution_map_spend_paths");
  });

  it("cannot authorize lead creation sourcing maps spend or Phase 10", () => {
    const result = getPhase9MinimalDiscoveryGate();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.importMutationEnabled).toBe(false);
    expect(result.flags.mapAutomationEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.flags.phase10ImplementationEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 9F — Lead Discovery Final Lockdown");
  });

  it("summarizes minimal gate boundaries", () => {
    const summary = getPhase9MinimalDiscoveryGateSummary();

    expect(summary).toMatch(/minimal Lead Discovery gate/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/source legality review/i);
    expect(summary).toMatch(/No scraping/i);
    expect(summary).toMatch(/no spend increase/i);
  });

  it("throws on gate lane drift blocked flag missing boundaries and unsafe wording", () => {
    const result = getPhase9MinimalDiscoveryGate();

    expect(() => assertPhase9MinimalDiscoveryGateSafe({ ...result, gateLanes: phase9MinimalDiscoveryGateLanes.slice(0, -1) as never })).toThrow(/gate lanes/i);
    expect(() => assertPhase9MinimalDiscoveryGateSafe({ ...result, implementationScopeReferences: phase9LeadDiscoveryImplementationLanes.slice(0, -1) as never })).toThrow(/implementation scope references/i);
    expect(() => assertPhase9MinimalDiscoveryGateSafe({ ...result, flags: { ...phase9MinimalDiscoveryGateFlags, phase10ImplementationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase9MinimalDiscoveryGateSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase9MinimalDiscoveryGateSafe({ ...result, gateRules: ["implementation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
