import {
  createR67AutomationLastSafetyAccessibilityReview,
  summarizeR67AutomationLastSafetyAccessibilityReview,
} from "./r67-automation-last-safety-accessibility-review";

const passedInput = {
  r67dUiReviewed: true,
  contractsReviewed: true,
  dangerousWordingReviewed: true,
  hiddenControlsReviewed: true,
  accessibilityReviewed: true,
  providerRuntimePollingReviewed: true,
  governanceVisibilityReviewed: true,
} as const;

describe("R67E automation-last safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR67AutomationLastSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.noAutomationDrift).toBe(true);
    expect(result.missingReviewAreas).toContain("R67D UI");
  });

  it("passes smoke review for safe R67 UI and contracts", () => {
    const result = createR67AutomationLastSafetyAccessibilityReview(passedInput);
    expect(result.status).toBe("safety_accessibility_review_passed");
    expect(result.findings.join(" ")).toMatch(/No buttons, execution controls/i);
    expect(result.findings.join(" ")).toMatch(/aria-labelledby, aria-describedby/i);
  });

  it("pressure-tests all safety blockers", () => {
    const result = createR67AutomationLastSafetyAccessibilityReview({
      ...passedInput,
      automationDriftFound: true,
      permissionDriftFound: true,
      providerDriftFound: true,
      runtimeDriftFound: true,
      pollingDriftFound: true,
      hiddenExecutionAffordanceFound: true,
      dangerousWordingFound: true,
      accessibilityRegressionFound: true,
      executionControlFound: true,
    });
    expect(result.status).toBe("safety_accessibility_review_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "automation drift found",
        "permission drift found",
        "provider drift found",
        "runtime drift found",
        "polling drift found",
        "hidden execution affordance found",
        "execution control found",
      ]),
    );
  });

  it("summarizes review coverage", () => {
    const result = createR67AutomationLastSafetyAccessibilityReview(passedInput);
    expect(summarizeR67AutomationLastSafetyAccessibilityReview(result)).toMatch(/accessibility regression/i);
  });
});
