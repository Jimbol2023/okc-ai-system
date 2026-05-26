import { phase10ManualVirtualD4dLanes, phase10VirtualD4dSummaryStates } from "./phase-10-manual-virtual-d4d-policy";
import { phase10VirtualD4dSignalFamilies } from "./phase-10-virtual-d4d-signal-audit";
import {
  assertPhase10VirtualD4dImplementationScopeSafe,
  getPhase10VirtualD4dImplementationScope,
  getPhase10VirtualD4dImplementationScopeSummary,
  phase10VirtualD4dImplementationLanes,
  phase10VirtualD4dImplementationScopeFlags,
} from "./phase-10-virtual-d4d-implementation-scope";

describe("phase 10D virtual D4D implementation scope", () => {
  it("pins Phase 10D fields and references prior policy unchanged", () => {
    const result = getPhase10VirtualD4dImplementationScope();

    expect(result.phase).toBe("Phase 10: Virtual Driving for Dollars Intelligence Engine");
    expect(result.phaseStep).toBe("Phase 10D — Virtual D4D Implementation Scope");
    expect(result.previousStep).toBe("Phase 10C — Manual Virtual D4D Advisory Policy");
    expect(result.phaseDecision).toBe("implementation_scope_only");
    expect(result.implementationLanes).toEqual(phase10VirtualD4dImplementationLanes);
    expect(result.signalReferences).toEqual(phase10VirtualD4dSignalFamilies);
    expect(result.policyLaneReferences).toEqual(phase10ManualVirtualD4dLanes);
    expect(result.summaryStateReferences).toEqual(phase10VirtualD4dSummaryStates);
  });

  it("cannot authorize implementation execution maps owner contact persistence campaigns or go-live", () => {
    const result = getPhase10VirtualD4dImplementationScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.mapCrawlingEnabled).toBe(false);
    expect(result.flags.externalApiEnabled).toBe(false);
    expect(result.flags.fetchNetworkEnabled).toBe(false);
    expect(result.flags.ownerLookupEnabled).toBe(false);
    expect(result.flags.ownerContactEnabled).toBe(false);
    expect(result.flags.persistenceEnabled).toBe(false);
    expect(result.flags.auditWritingEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 10E — Minimal Virtual D4D Gate");
  });

  it("summarizes future scope without execution", () => {
    const summary = getPhase10VirtualD4dImplementationScopeSummary();

    expect(summary).toMatch(/possible future read-only Virtual D4D package/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned implementation approval/i);
    expect(summary).toMatch(/No scraping/i);
    expect(summary).toMatch(/no map crawling/i);
    expect(summary).toMatch(/no owner contact/i);
  });

  it("throws on missing lanes references blocked flags and unsafe wording", () => {
    const result = getPhase10VirtualD4dImplementationScope();

    expect(() => assertPhase10VirtualD4dImplementationScopeSafe({ ...result, implementationLanes: phase10VirtualD4dImplementationLanes.slice(0, -1) as never })).toThrow(/implementation lanes/i);
    expect(() => assertPhase10VirtualD4dImplementationScopeSafe({ ...result, policyLaneReferences: phase10ManualVirtualD4dLanes.slice(0, -1) as never })).toThrow(/policy lane references/i);
    expect(() => assertPhase10VirtualD4dImplementationScopeSafe({ ...result, flags: { ...phase10VirtualD4dImplementationScopeFlags, externalApiEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase10VirtualD4dImplementationScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase10VirtualD4dImplementationScopeSafe({ ...result, scopeRules: ["owner contact is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
