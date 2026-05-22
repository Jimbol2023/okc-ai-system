import {
  createR675InclusiveAccessibilityResponsiveSafetyReview,
  summarizeR675InclusiveAccessibilityResponsiveSafetyReview,
} from "./r675-inclusive-accessibility-responsive-safety-review";

const passedInput = {
  r675dReviewed: true,
  canvasExpansionReviewed: true,
  lineLengthReviewed: true,
  elderlyLowVisionReviewed: true,
  screenReaderReviewed: true,
  keyboardReviewed: true,
  governanceReviewed: true,
  auditBoundaryReviewed: true,
} as const;

describe("R67.5E inclusive accessibility responsive safety review", () => {
  it("defaults to operator review required", () => {
    const result = createR675InclusiveAccessibilityResponsiveSafetyReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.noExecutionControlsAdded).toBe(true);
    expect(result.missingReviewAreas).toContain("R67.5D implementation");
  });

  it("passes smoke review for inclusive canvas expansion", () => {
    const result = createR675InclusiveAccessibilityResponsiveSafetyReview(passedInput);
    expect(result.status).toBe("inclusive_responsive_review_passed");
    expect(result.findings.join(" ")).toMatch(/elderly and low-vision/i);
    expect(result.findings.join(" ")).toMatch(/screen-reader structure/i);
    expect(result.findings.join(" ")).toMatch(/no audit records are written/i);
  });

  it("pressure-tests accessibility regressions and drift blockers", () => {
    const result = createR675InclusiveAccessibilityResponsiveSafetyReview({
      ...passedInput,
      crampedLayoutRemainsCritical: true,
      unreadableLongLinesIntroduced: true,
      colorOnlyMeaningIntroduced: true,
      motionDependencyIntroduced: true,
      focusMovementIntroduced: true,
      autoRefreshIntroduced: true,
      pollingIntroduced: true,
      executionControlIntroduced: true,
      providerPathIntroduced: true,
      runtimeIntroduced: true,
      persistenceIntroduced: true,
      auditWritingIntroduced: true,
      routeApiChangeIntroduced: true,
    });
    expect(result.status).toBe("inclusive_responsive_review_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "unreadable long lines introduced",
        "polling introduced",
        "execution control introduced",
        "audit writing introduced",
        "route/API change introduced",
      ]),
    );
  });

  it("summarizes review boundaries", () => {
    const result = createR675InclusiveAccessibilityResponsiveSafetyReview(passedInput);
    expect(summarizeR675InclusiveAccessibilityResponsiveSafetyReview(result)).toMatch(/audit-log-not-active/i);
  });
});
