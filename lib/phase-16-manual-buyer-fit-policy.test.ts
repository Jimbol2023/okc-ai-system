import {
  assertPhase16ManualBuyerFitPolicySafe,
  getPhase16ManualBuyerFitPolicy,
  getPhase16ManualBuyerFitPolicySummary,
  phase16BuyerFitSummaryStates,
  phase16ManualBuyerFitLanes,
  phase16ManualBuyerFitPolicyFlags,
} from "./phase-16-manual-buyer-fit-policy";

describe("phase 16C manual buyer fit policy", () => {
  it("pins Phase 16C fields and includes all lanes and summary states", () => {
    const result = getPhase16ManualBuyerFitPolicy();

    expect(result.phaseStep).toBe("Phase 16C â€” Manual Buyer Fit Advisory Policy");
    expect(result.previousStep).toBe("Phase 16B â€” Buyer Fit Signal Audit");
    expect(result.buyerFitLanes).toEqual(phase16ManualBuyerFitLanes);
    expect(result.summaryStates).toEqual(phase16BuyerFitSummaryStates);
    expect(result.recommendedNextExactStep).toBe("Phase 16D â€” Buyer Fit Implementation Scope");
  });

  it("blocks buyer outreach deal blasting mutation score persistence assignments contracts routing and go-live", () => {
    const result = getPhase16ManualBuyerFitPolicy();
    const text = [result.policyRules, result.stopRules].flat().join(" ");

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(text).toMatch(/buyer outreach/i);
    expect(text).toMatch(/deal blasting/i);
    expect(text).toMatch(/score persistence/i);
    expect(text).toMatch(/assignment/i);
    expect(text).toMatch(/contract/i);
    expect(text).toMatch(/routing/i);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes the manual policy", () => {
    const summary = getPhase16ManualBuyerFitPolicySummary();

    expect(summary).toMatch(/manual buyer-fit lanes/i);
    expect(summary).toMatch(/human-owned buyer-fit judgment/i);
    expect(summary).toMatch(/buyer relationship ownership/i);
    expect(summary).toMatch(/deal-package approval/i);
    expect(summary).toMatch(/Phase 16D â€” Buyer Fit Implementation Scope/i);
  });

  it("throws on lane drift, state drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase16ManualBuyerFitPolicy();

    expect(() => assertPhase16ManualBuyerFitPolicySafe({ ...result, buyerFitLanes: [] as never })).toThrow(/lanes/i);
    expect(() => assertPhase16ManualBuyerFitPolicySafe({ ...result, summaryStates: [] as never })).toThrow(/summary states/i);
    expect(() => assertPhase16ManualBuyerFitPolicySafe({ ...result, flags: { ...phase16ManualBuyerFitPolicyFlags, scorePersistenceEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase16ManualBuyerFitPolicySafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase16ManualBuyerFitPolicySafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase16ManualBuyerFitPolicySafe({ ...result, policyRules: ["buyer outreach is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
