import {
  createR71ControlledHumanOutreachSafetyAccessibilityReview,
  summarizeR71ControlledHumanOutreachSafetyAccessibilityReview,
} from "./r71-controlled-human-outreach-safety-accessibility-review";

const passedInput = {
  r71dUiReviewed: true,
  contractsReviewed: true,
  semanticStructureReviewed: true,
  accessibilityReviewed: true,
  dangerousWordingReviewed: true,
  hiddenControlsReviewed: true,
  providerBoundaryReviewed: true,
  sendCallTextEmailReviewed: true,
  runtimePollingReviewed: true,
  persistenceAuditReviewed: true,
  governanceVisibilityReviewed: true,
} as const;

describe("R71E controlled human outreach safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR71ControlledHumanOutreachSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.missingReviewAreas).toContain("R71D UI");
  });

  it("smoke-tests safe outreach UI and accessibility coverage", () => {
    const result = createR71ControlledHumanOutreachSafetyAccessibilityReview(passedInput);
    expect(result.status).toBe("controlled_outreach_safety_passed");
    expect(result.findings.join(" ")).toMatch(/No buttons, click handlers, forms/i);
    expect(result.findings.join(" ")).toMatch(/screen-reader, keyboard-only/i);
  });

  it("pressure-tests all safety blockers", () => {
    const result = createR71ControlledHumanOutreachSafetyAccessibilityReview({
      ...passedInput,
      sendControlFound: true,
      callControlFound: true,
      smsControlFound: true,
      emailControlFound: true,
      providerControlFound: true,
      executionControlFound: true,
      hiddenExecutionAffordanceFound: true,
      dangerousWordingFound: true,
      accessibilityRegressionFound: true,
      pollingFound: true,
      runtimeFound: true,
      persistenceFound: true,
      auditWritingFound: true,
      fetchNetworkFound: true,
      campaignFound: true,
    });
    expect(result.status).toBe("controlled_outreach_safety_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["send control found", "call control found", "provider control found", "campaign found"]));
  });

  it("summarizes safety review coverage", () => {
    const result = createR71ControlledHumanOutreachSafetyAccessibilityReview(passedInput);
    expect(summarizeR71ControlledHumanOutreachSafetyAccessibilityReview(result)).toMatch(/send\/call\/text\/email/i);
  });
});
