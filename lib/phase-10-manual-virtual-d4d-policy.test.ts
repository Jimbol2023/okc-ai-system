import { phase10VirtualD4dSignalFamilies } from "./phase-10-virtual-d4d-signal-audit";
import {
  assertPhase10ManualVirtualD4dPolicySafe,
  getPhase10ManualVirtualD4dPolicy,
  getPhase10ManualVirtualD4dPolicySummary,
  phase10ManualVirtualD4dLanes,
  phase10ManualVirtualD4dPolicyFlags,
  phase10VirtualD4dSummaryStates,
} from "./phase-10-manual-virtual-d4d-policy";

describe("phase 10C manual virtual D4D policy", () => {
  it("pins Phase 10C fields and includes manual lanes and summary states", () => {
    const result = getPhase10ManualVirtualD4dPolicy();

    expect(result.phase).toBe("Phase 10: Virtual Driving for Dollars Intelligence Engine");
    expect(result.phaseStep).toBe("Phase 10C — Manual Virtual D4D Advisory Policy");
    expect(result.previousStep).toBe("Phase 10B — Virtual D4D Signal Audit");
    expect(result.manualVirtualD4dLanes).toEqual(phase10ManualVirtualD4dLanes);
    expect(result.summaryStates).toEqual(phase10VirtualD4dSummaryStates);
    expect(result.signalReferences).toEqual(phase10VirtualD4dSignalFamilies);
    expect(result.manualVirtualD4dLanes).toContain("stop_no_map_or_scraping_first");
    expect(result.manualVirtualD4dLanes).toContain("operator_route_focus_review");
    expect(result.summaryStates).toContain("no_map_boundary_required");
  });

  it("blocks maps GPS owner contact lead creation source import CRM mutation campaigns and spend", () => {
    const result = getPhase10ManualVirtualD4dPolicy();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.scrapingEnabled).toBe(false);
    expect(result.flags.mapAutomationEnabled).toBe(false);
    expect(result.flags.streetViewAutomationEnabled).toBe(false);
    expect(result.flags.gpsSurveillanceEnabled).toBe(false);
    expect(result.flags.ownerContactEnabled).toBe(false);
    expect(result.flags.leadCreationEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.campaignEnabled).toBe(false);
    expect(result.recommendedNextExactStep).toBe("Phase 10D — Virtual D4D Implementation Scope");
  });

  it("summarizes manual policy boundaries", () => {
    const summary = getPhase10ManualVirtualD4dPolicySummary();

    expect(summary).toMatch(/manual Virtual D4D lanes/i);
    expect(summary).toMatch(/summary states/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/distress-signal verification/i);
    expect(summary).toMatch(/No scraping/i);
    expect(summary).toMatch(/no CRM mutation/i);
  });

  it("throws on lane state reference drift blocked flag and unsafe wording", () => {
    const result = getPhase10ManualVirtualD4dPolicy();

    expect(() => assertPhase10ManualVirtualD4dPolicySafe({ ...result, manualVirtualD4dLanes: phase10ManualVirtualD4dLanes.slice(0, -1) as never })).toThrow(/lanes/i);
    expect(() => assertPhase10ManualVirtualD4dPolicySafe({ ...result, summaryStates: phase10VirtualD4dSummaryStates.slice(0, -1) as never })).toThrow(/summary states/i);
    expect(() => assertPhase10ManualVirtualD4dPolicySafe({ ...result, signalReferences: phase10VirtualD4dSignalFamilies.slice(0, -1) as never })).toThrow(/signal references/i);
    expect(() => assertPhase10ManualVirtualD4dPolicySafe({ ...result, flags: { ...phase10ManualVirtualD4dPolicyFlags, mapAutomationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase10ManualVirtualD4dPolicySafe({ ...result, policyRules: ["scraping is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
