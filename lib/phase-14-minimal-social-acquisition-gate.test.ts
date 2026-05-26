import {
  assertPhase14MinimalSocialAcquisitionGateSafe,
  getPhase14MinimalSocialAcquisitionGate,
  getPhase14MinimalSocialAcquisitionGateSummary,
  phase14MinimalSocialAcquisitionGateChecks,
  phase14MinimalSocialAcquisitionGateFlags,
} from "./phase-14-minimal-social-acquisition-gate";

describe("phase 14E minimal social acquisition gate", () => {
  it("pins Phase 14E fields and includes all gate checks", () => {
    const result = getPhase14MinimalSocialAcquisitionGate();

    expect(result.phaseStep).toBe("Phase 14E â€” Minimal Social Acquisition Gate");
    expect(result.previousStep).toBe("Phase 14D â€” Social Acquisition Implementation Scope");
    expect(result.gateChecks).toEqual(phase14MinimalSocialAcquisitionGateChecks);
    expect(result.implementationLaneReferences).toContain("blocked_provider_pixel_campaign_ad_account_execution_paths");
    expect(result.recommendedNextExactStep).toBe("Phase 14F â€” Social Acquisition Final Lockdown");
  });

  it("gates only read-only visibility and blocks execution", () => {
    const result = getPhase14MinimalSocialAcquisitionGate();
    const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary].flat().join(" ");

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(text).toMatch(/minimal read-only social acquisition/i);
    expect(text).toMatch(/provider activation/i);
    expect(text).toMatch(/pixels/i);
    expect(text).toMatch(/campaigns/i);
    expect(text).toMatch(/lead import/i);
    expect(text).toMatch(/go-live/i);
  });

  it("summarizes the minimal gate", () => {
    const summary = getPhase14MinimalSocialAcquisitionGateSummary();

    expect(summary).toMatch(/minimal read-only social acquisition package/i);
    expect(summary).toMatch(/go-live approval/i);
    expect(summary).toMatch(/No provider activation/i);
    expect(summary).toMatch(/no campaigns\/ads/i);
    expect(summary).toMatch(/Phase 14F â€” Social Acquisition Final Lockdown/i);
  });

  it("throws on gate drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase14MinimalSocialAcquisitionGate();

    expect(() => assertPhase14MinimalSocialAcquisitionGateSafe({ ...result, gateChecks: [] as never })).toThrow(/gate checks/i);
    expect(() => assertPhase14MinimalSocialAcquisitionGateSafe({ ...result, flags: { ...phase14MinimalSocialAcquisitionGateFlags, campaignEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase14MinimalSocialAcquisitionGateSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase14MinimalSocialAcquisitionGateSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase14MinimalSocialAcquisitionGateSafe({ ...result, gateRules: ["spend increases are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
