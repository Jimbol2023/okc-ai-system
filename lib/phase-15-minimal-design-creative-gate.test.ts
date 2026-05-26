import {
  assertPhase15MinimalDesignCreativeGateSafe,
  getPhase15MinimalDesignCreativeGate,
  getPhase15MinimalDesignCreativeGateSummary,
  phase15MinimalDesignCreativeGateChecks,
  phase15MinimalDesignCreativeGateFlags,
} from "./phase-15-minimal-design-creative-gate";

describe("phase 15E minimal design creative gate", () => {
  it("pins Phase 15E fields and includes all gate checks", () => {
    const result = getPhase15MinimalDesignCreativeGate();

    expect(result.phaseStep).toBe("Phase 15E â€” Minimal Design & Creative Gate");
    expect(result.previousStep).toBe("Phase 15D â€” Design & Creative Implementation Scope");
    expect(result.gateChecks).toEqual(phase15MinimalDesignCreativeGateChecks);
    expect(result.implementationLaneReferences).toContain("blocked_ui_asset_publishing_campaign_execution_paths");
    expect(result.recommendedNextExactStep).toBe("Phase 15F â€” Design & Creative Final Lockdown");
  });

  it("gates only read-only visibility and blocks execution", () => {
    const result = getPhase15MinimalDesignCreativeGate();
    const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary].flat().join(" ");

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(text).toMatch(/minimal read-only design\/creative/i);
    expect(text).toMatch(/UI edits/i);
    expect(text).toMatch(/asset\/logo\/theme edits/i);
    expect(text).toMatch(/creative publishing/i);
    expect(text).toMatch(/spend increases/i);
    expect(text).toMatch(/go-live/i);
  });

  it("summarizes the minimal gate", () => {
    const summary = getPhase15MinimalDesignCreativeGateSummary();

    expect(summary).toMatch(/minimal read-only design\/creative package/i);
    expect(summary).toMatch(/go-live approval/i);
    expect(summary).toMatch(/No UI changes/i);
    expect(summary).toMatch(/no creative publishing/i);
    expect(summary).toMatch(/Phase 15F â€” Design & Creative Final Lockdown/i);
  });

  it("throws on gate drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase15MinimalDesignCreativeGate();

    expect(() => assertPhase15MinimalDesignCreativeGateSafe({ ...result, gateChecks: [] as never })).toThrow(/gate checks/i);
    expect(() => assertPhase15MinimalDesignCreativeGateSafe({ ...result, flags: { ...phase15MinimalDesignCreativeGateFlags, creativePublishingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase15MinimalDesignCreativeGateSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase15MinimalDesignCreativeGateSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase15MinimalDesignCreativeGateSafe({ ...result, gateRules: ["spend increases are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
