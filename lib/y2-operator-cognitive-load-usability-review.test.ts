import { createY2OperatorCognitiveLoadUsabilityReview } from "./y2-operator-cognitive-load-usability-review";

describe("Y2C operator cognitive load usability review", () => {
  it("preserves review-only usability boundaries", () => {
    const result = createY2OperatorCognitiveLoadUsabilityReview();
    expect(result.redesignAllowed).toBe(false);
    expect(result.animationSystemsAllowed).toBe(false);
    expect(result.themeSystemsAllowed).toBe(false);
    expect(result.runtimeUiBehaviorAllowed).toBe(false);
  });

  it("blocks redesign and runtime UI behavior", () => {
    const result = createY2OperatorCognitiveLoadUsabilityReview({ redesignRequested: true, runtimeUiRequested: true });
    expect(result.status).toBe("cognitive_load_blocked");
    expect(result.blockedReasons.join(" ")).toMatch(/redesign remains outside/);
    expect(result.blockedReasons.join(" ")).toMatch(/runtime UI behavior remains blocked/);
  });
});
