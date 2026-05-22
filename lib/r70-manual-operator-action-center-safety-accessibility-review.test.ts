import {
  createR70ManualOperatorActionCenterSafetyAccessibilityReview,
  summarizeR70ManualOperatorActionCenterSafetyAccessibilityReview,
} from "./r70-manual-operator-action-center-safety-accessibility-review";

const passedInput = {
  r70dUiReviewed: true,
  contractsReviewed: true,
  semanticStructureReviewed: true,
  accessibilityReviewed: true,
  dangerousWordingReviewed: true,
  hiddenControlsReviewed: true,
  providerBoundaryReviewed: true,
  runtimePollingReviewed: true,
  persistenceAuditReviewed: true,
  governanceVisibilityReviewed: true,
} as const;

describe("R70E manual operator action center safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR70ManualOperatorActionCenterSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("R70D UI");
  });

  it("smoke-tests safe UI and accessibility coverage", () => {
    const result = createR70ManualOperatorActionCenterSafetyAccessibilityReview(passedInput);
    expect(result.status).toBe("manual_action_center_safety_passed");
    expect(result.findings.join(" ")).toMatch(/No buttons, click handlers, forms/i);
    expect(result.findings.join(" ")).toMatch(/screen-reader, keyboard-only/i);
  });

  it("pressure-tests all safety blockers", () => {
    const result = createR70ManualOperatorActionCenterSafetyAccessibilityReview({
      ...passedInput,
      executionControlFound: true,
      providerControlFound: true,
      sendControlFound: true,
      hiddenExecutionAffordanceFound: true,
      dangerousWordingFound: true,
      accessibilityRegressionFound: true,
      pollingFound: true,
      runtimeFound: true,
      persistenceFound: true,
      auditWritingFound: true,
      fetchNetworkFound: true,
    });
    expect(result.status).toBe("manual_action_center_safety_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["execution control found", "provider control found", "audit writing found", "fetch/network found"]));
  });

  it("summarizes safety review coverage", () => {
    const result = createR70ManualOperatorActionCenterSafetyAccessibilityReview(passedInput);
    expect(summarizeR70ManualOperatorActionCenterSafetyAccessibilityReview(result)).toMatch(/inclusive accessibility/i);
  });
});
