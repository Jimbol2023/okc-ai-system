import { phase13ManualSafetyComplianceLanes, phase13SafetyComplianceSummaryStates } from "./phase-13-manual-safety-compliance-policy";
import {
  assertPhase13SafetyComplianceImplementationScopeSafe,
  getPhase13SafetyComplianceImplementationScope,
  getPhase13SafetyComplianceImplementationScopeSummary,
  phase13SafetyComplianceImplementationLanes,
  phase13SafetyComplianceImplementationScopeFlags,
} from "./phase-13-safety-compliance-implementation-scope";
import { phase13SafetyComplianceSignalFamilies } from "./phase-13-safety-compliance-signal-audit";

describe("phase 13D safety compliance implementation scope", () => {
  it("pins Phase 13D fields and references prior policy unchanged", () => {
    const result = getPhase13SafetyComplianceImplementationScope();

    expect(result.phaseStep).toBe("Phase 13D — Safety & Compliance Implementation Scope");
    expect(result.previousStep).toBe("Phase 13C — Manual Safety & Compliance Advisory Policy");
    expect(result.implementationLanes).toEqual(phase13SafetyComplianceImplementationLanes);
    expect(result.signalReferences).toEqual(phase13SafetyComplianceSignalFamilies);
    expect(result.policyLaneReferences).toEqual(phase13ManualSafetyComplianceLanes);
    expect(result.summaryStateReferences).toEqual(phase13SafetyComplianceSummaryStates);
  });

  it("cannot authorize implementation route API auth security storage provider outreach audit CRM campaigns or go-live", () => {
    const result = getPhase13SafetyComplianceImplementationScope();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.routeChangeEnabled).toBe(false);
    expect(result.flags.apiChangeEnabled).toBe(false);
    expect(result.flags.authChangeEnabled).toBe(false);
    expect(result.flags.securityChangeEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.auditWritingEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes future scope without execution", () => {
    const summary = getPhase13SafetyComplianceImplementationScopeSummary();

    expect(summary).toMatch(/possible future read-only safety\/compliance visibility package/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/future implementation approval/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/no CRM mutation/i);
  });

  it("throws on missing lanes references blocked flags and unsafe wording", () => {
    const result = getPhase13SafetyComplianceImplementationScope();

    expect(() => assertPhase13SafetyComplianceImplementationScopeSafe({ ...result, implementationLanes: phase13SafetyComplianceImplementationLanes.slice(0, -1) as never })).toThrow(/implementation lanes/i);
    expect(() => assertPhase13SafetyComplianceImplementationScopeSafe({ ...result, policyLaneReferences: phase13ManualSafetyComplianceLanes.slice(0, -1) as never })).toThrow(/policy lane references/i);
    expect(() => assertPhase13SafetyComplianceImplementationScopeSafe({ ...result, flags: { ...phase13SafetyComplianceImplementationScopeFlags, routeChangeEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase13SafetyComplianceImplementationScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase13SafetyComplianceImplementationScopeSafe({ ...result, scopeRules: ["implementation execution is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
