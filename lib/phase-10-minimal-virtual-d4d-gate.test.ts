import { phase10ManualVirtualD4dLanes } from "./phase-10-manual-virtual-d4d-policy";
import { phase10VirtualD4dImplementationLanes } from "./phase-10-virtual-d4d-implementation-scope";
import {
  assertPhase10MinimalVirtualD4dGateSafe,
  getPhase10MinimalVirtualD4dGate,
  getPhase10MinimalVirtualD4dGateSummary,
  phase10MinimalVirtualD4dGateChecks,
  phase10MinimalVirtualD4dGateFlags,
} from "./phase-10-minimal-virtual-d4d-gate";

describe("phase 10E minimal virtual D4D gate", () => {
  it("pins Phase 10E fields and includes gate checks", () => {
    const result = getPhase10MinimalVirtualD4dGate();

    expect(result.phase).toBe("Phase 10: Virtual Driving for Dollars Intelligence Engine");
    expect(result.phaseStep).toBe("Phase 10E — Minimal Virtual D4D Gate");
    expect(result.previousStep).toBe("Phase 10D — Virtual D4D Implementation Scope");
    expect(result.phaseDecision).toBe("minimal_gate_only");
    expect(result.gateChecks).toEqual(phase10MinimalVirtualD4dGateChecks);
    expect(result.implementationLaneReferences).toEqual(phase10VirtualD4dImplementationLanes);
    expect(result.policyLaneReferences).toEqual(phase10ManualVirtualD4dLanes);
    expect(result.gateChecks).toContain("no_map_no_scraping_no_owner_contact_boundary_required");
  });

  it("blocks implementation maps GPS external APIs owner contact lead creation persistence campaigns and spend", () => {
    const result = getPhase10MinimalVirtualD4dGate();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.implementationAuthorized).toBe(false);
    expect(result.flags.mapAutomationEnabled).toBe(false);
    expect(result.flags.streetViewAutomationEnabled).toBe(false);
    expect(result.flags.gpsSurveillanceEnabled).toBe(false);
    expect(result.flags.fetchNetworkEnabled).toBe(false);
    expect(result.flags.ownerContactEnabled).toBe(false);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.spendIncreaseEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 10F — Virtual D4D Final Lockdown");
  });

  it("summarizes minimal gate boundaries", () => {
    const summary = getPhase10MinimalVirtualD4dGateSummary();

    expect(summary).toMatch(/minimal read-only Virtual D4D package/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/property fact verification/i);
    expect(summary).toMatch(/No scraping/i);
    expect(summary).toMatch(/no owner contact/i);
    expect(summary).toMatch(/Phase 10F — Virtual D4D Final Lockdown/i);
  });

  it("throws on missing gate checks references blocked flags and unsafe wording", () => {
    const result = getPhase10MinimalVirtualD4dGate();

    expect(() => assertPhase10MinimalVirtualD4dGateSafe({ ...result, gateChecks: phase10MinimalVirtualD4dGateChecks.slice(0, -1) as never })).toThrow(/gate checks/i);
    expect(() => assertPhase10MinimalVirtualD4dGateSafe({ ...result, implementationLaneReferences: phase10VirtualD4dImplementationLanes.slice(0, -1) as never })).toThrow(/implementation lane references/i);
    expect(() => assertPhase10MinimalVirtualD4dGateSafe({ ...result, flags: { ...phase10MinimalVirtualD4dGateFlags, campaignEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase10MinimalVirtualD4dGateSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase10MinimalVirtualD4dGateSafe({ ...result, gateRules: ["spend increase is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
