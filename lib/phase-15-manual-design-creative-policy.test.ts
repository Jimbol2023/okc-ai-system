import {
  assertPhase15ManualDesignCreativePolicySafe,
  getPhase15ManualDesignCreativePolicy,
  getPhase15ManualDesignCreativePolicySummary,
  phase15ManualDesignCreativeLanes,
  phase15ManualDesignCreativePolicyFlags,
  phase15DesignCreativeSummaryStates,
} from "./phase-15-manual-design-creative-policy";

describe("phase 15C manual design creative policy", () => {
  it("pins Phase 15C fields and includes all lanes and summary states", () => {
    const result = getPhase15ManualDesignCreativePolicy();

    expect(result.phaseStep).toBe("Phase 15C â€” Manual Design & Creative Advisory Policy");
    expect(result.previousStep).toBe("Phase 15B â€” Design & Creative Signal Audit");
    expect(result.designCreativeLanes).toEqual(phase15ManualDesignCreativeLanes);
    expect(result.summaryStates).toEqual(phase15DesignCreativeSummaryStates);
    expect(result.recommendedNextExactStep).toBe("Phase 15D â€” Design & Creative Implementation Scope");
  });

  it("blocks UI content asset logo theme publishing campaigns tracking outreach spend and go-live", () => {
    const result = getPhase15ManualDesignCreativePolicy();
    const text = [result.policyRules, result.stopRules].flat().join(" ");

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(text).toMatch(/UI edits/i);
    expect(text).toMatch(/asset edits/i);
    expect(text).toMatch(/creative publishing/i);
    expect(text).toMatch(/campaign\/ad creation/i);
    expect(text).toMatch(/CRM mutation/i);
    expect(text).toMatch(/spend/i);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes the manual policy", () => {
    const summary = getPhase15ManualDesignCreativePolicySummary();

    expect(summary).toMatch(/manual design\/creative lanes/i);
    expect(summary).toMatch(/human-owned brand judgment/i);
    expect(summary).toMatch(/claim verification/i);
    expect(summary).toMatch(/creative approval/i);
    expect(summary).toMatch(/Phase 15D â€” Design & Creative Implementation Scope/i);
  });

  it("throws on lane drift, state drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase15ManualDesignCreativePolicy();

    expect(() => assertPhase15ManualDesignCreativePolicySafe({ ...result, designCreativeLanes: [] as never })).toThrow(/lanes/i);
    expect(() => assertPhase15ManualDesignCreativePolicySafe({ ...result, summaryStates: [] as never })).toThrow(/summary states/i);
    expect(() => assertPhase15ManualDesignCreativePolicySafe({ ...result, flags: { ...phase15ManualDesignCreativePolicyFlags, themeChangeEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase15ManualDesignCreativePolicySafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase15ManualDesignCreativePolicySafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase15ManualDesignCreativePolicySafe({ ...result, policyRules: ["UI edits are authorized"] })).toThrow(/unsafe authorization/i);
  });
});
