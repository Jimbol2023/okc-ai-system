import { createY1FinalControlledActivationPlanningSummary } from "./y1-final-controlled-activation-planning-summary";

describe("Y1F final controlled activation planning summary", () => {
  it("defaults to no activation authorized and future planning only", () => {
    const result = createY1FinalControlledActivationPlanningSummary();
    expect(result.noActivationAuthorized).toBe(true);
    expect(result.futurePlanningOnly).toBe(true);
    expect(result.humanReviewRequired).toBe(true);
    expect(result.manualRevenueOperationsRemainPrimary).toBe(true);
  });

  it("blocks activation, provider, and sending requests", () => {
    const result = createY1FinalControlledActivationPlanningSummary({ activationRequested: true, providerRequested: true, sendingRequested: true });
    expect(result.status).toBe("final_planning_blocked");
    expect(result.activationDecision).toBe("no_activation_authorized");
    expect(result.blockedReasons.join(" ")).toMatch(/activation remains unauthorized/);
  });
});
