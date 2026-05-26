import {
  assertPhase16MinimalBuyerFitGateSafe,
  getPhase16MinimalBuyerFitGate,
  getPhase16MinimalBuyerFitGateSummary,
  phase16MinimalBuyerFitGateChecks,
  phase16MinimalBuyerFitGateFlags,
} from "./phase-16-minimal-buyer-fit-gate";

describe("phase 16E minimal buyer fit gate", () => {
  it("pins Phase 16E fields and includes all gate checks", () => {
    const result = getPhase16MinimalBuyerFitGate();

    expect(result.phaseStep).toBe("Phase 16E â€” Minimal Buyer Fit Gate");
    expect(result.previousStep).toBe("Phase 16D â€” Buyer Fit Implementation Scope");
    expect(result.gateChecks).toEqual(phase16MinimalBuyerFitGateChecks);
    expect(result.implementationLaneReferences).toContain("blocked_outreach_mutation_matching_assignment_contract_execution_paths");
    expect(result.recommendedNextExactStep).toBe("Phase 16F â€” Buyer Fit Final Lockdown");
  });

  it("gates only read-only visibility and blocks execution", () => {
    const result = getPhase16MinimalBuyerFitGate();
    const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary].flat().join(" ");

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(text).toMatch(/minimal read-only buyer-fit/i);
    expect(text).toMatch(/buyer mutation/i);
    expect(text).toMatch(/score persistence/i);
    expect(text).toMatch(/buyer outreach/i);
    expect(text).toMatch(/deal package sending/i);
    expect(text).toMatch(/go-live/i);
  });

  it("summarizes the minimal gate", () => {
    const summary = getPhase16MinimalBuyerFitGateSummary();

    expect(summary).toMatch(/minimal read-only buyer-fit package/i);
    expect(summary).toMatch(/go-live approval/i);
    expect(summary).toMatch(/No buyer outreach/i);
    expect(summary).toMatch(/no deal package sending/i);
    expect(summary).toMatch(/Phase 16F â€” Buyer Fit Final Lockdown/i);
  });

  it("throws on gate drift, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase16MinimalBuyerFitGate();

    expect(() => assertPhase16MinimalBuyerFitGateSafe({ ...result, gateChecks: [] as never })).toThrow(/gate checks/i);
    expect(() => assertPhase16MinimalBuyerFitGateSafe({ ...result, flags: { ...phase16MinimalBuyerFitGateFlags, dealPackageSendingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase16MinimalBuyerFitGateSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase16MinimalBuyerFitGateSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase16MinimalBuyerFitGateSafe({ ...result, gateRules: ["matching execution is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
