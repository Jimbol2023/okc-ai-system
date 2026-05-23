import { createY1ActivationEligibilityRoiGate } from "./y1-activation-eligibility-roi-gate";

describe("Y1A activation eligibility ROI gate", () => {
  it("defaults to planning only with activation ineligible", () => {
    const result = createY1ActivationEligibilityRoiGate();
    expect(result.activationEligible).toBe(false);
    expect(result.activationPlanningOnly).toBe(true);
    expect(result.activationRequiresFutureApproval).toBe(true);
    expect(result.flags.providerActivationAllowed).toBe(false);
  });

  it("blocks activation planning by governance or readiness gaps", () => {
    const result = createY1ActivationEligibilityRoiGate({ governanceBlocked: true, unresolvedBlockers: ["provider readiness not reviewed"] });
    expect(result.recommendedDecision).toBe("blocked_by_governance");
    expect(result.unresolvedBlockers).toContain("provider readiness not reviewed");
  });
});
