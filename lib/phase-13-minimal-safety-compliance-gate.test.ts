import { phase13ManualSafetyComplianceLanes } from "./phase-13-manual-safety-compliance-policy";
import {
  assertPhase13MinimalSafetyComplianceGateSafe,
  getPhase13MinimalSafetyComplianceGate,
  getPhase13MinimalSafetyComplianceGateSummary,
  phase13MinimalSafetyComplianceGateChecks,
  phase13MinimalSafetyComplianceGateFlags,
} from "./phase-13-minimal-safety-compliance-gate";
import { phase13SafetyComplianceImplementationLanes } from "./phase-13-safety-compliance-implementation-scope";

describe("phase 13E minimal safety compliance gate", () => {
  it("pins Phase 13E fields and includes gate checks", () => {
    const result = getPhase13MinimalSafetyComplianceGate();

    expect(result.phaseStep).toBe("Phase 13E — Minimal Safety & Compliance Gate");
    expect(result.previousStep).toBe("Phase 13D — Safety & Compliance Implementation Scope");
    expect(result.gateChecks).toEqual(phase13MinimalSafetyComplianceGateChecks);
    expect(result.implementationLaneReferences).toEqual(phase13SafetyComplianceImplementationLanes);
    expect(result.policyLaneReferences).toEqual(phase13ManualSafetyComplianceLanes);
    expect(result.gateChecks).toContain("no_campaign_ad_spend_go_live_boundary_required");
  });

  it("blocks implementation consent provider outreach audit CRM campaigns ads spend and go-live", () => {
    const result = getPhase13MinimalSafetyComplianceGate();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.consentCollectionEnabled).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.outreachEnabled).toBe(false);
    expect(result.flags.auditWritingEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.flags.adEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 13F — Safety & Compliance Final Lockdown");
  });

  it("summarizes minimal gate boundaries", () => {
    const summary = getPhase13MinimalSafetyComplianceGateSummary();

    expect(summary).toMatch(/minimal read-only safety\/compliance package/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/go-live approval/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/Phase 13F — Safety & Compliance Final Lockdown/i);
  });

  it("throws on missing gate checks references blocked flags and unsafe wording", () => {
    const result = getPhase13MinimalSafetyComplianceGate();

    expect(() => assertPhase13MinimalSafetyComplianceGateSafe({ ...result, gateChecks: phase13MinimalSafetyComplianceGateChecks.slice(0, -1) as never })).toThrow(/gate checks/i);
    expect(() => assertPhase13MinimalSafetyComplianceGateSafe({ ...result, implementationLaneReferences: phase13SafetyComplianceImplementationLanes.slice(0, -1) as never })).toThrow(/implementation lane references/i);
    expect(() => assertPhase13MinimalSafetyComplianceGateSafe({ ...result, flags: { ...phase13MinimalSafetyComplianceGateFlags, adEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase13MinimalSafetyComplianceGateSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase13MinimalSafetyComplianceGateSafe({ ...result, gateRules: ["go-live is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
