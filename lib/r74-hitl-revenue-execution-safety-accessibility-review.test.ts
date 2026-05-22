import {
  createR74HitlRevenueExecutionSafetyAccessibilityReview,
  summarizeR74HitlRevenueExecutionSafetyReview,
} from "./r74-hitl-revenue-execution-safety-accessibility-review";

const reviewedInput = {
  semanticStructureReviewed: true,
  accessibilityReviewed: true,
  autonomyDriftReviewed: true,
  governanceWarningsReviewed: true,
  forbiddenControlsReviewed: true,
  providerBoundaryReviewed: true,
} as const;

describe("R74E HITL revenue execution safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR74HitlRevenueExecutionSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.autonomousExecutionPresent).toBe(false);
  });

  it("smoke-tests safety review clearance", () => {
    const result = createR74HitlRevenueExecutionSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("hitl_safety_clear");
    expect(result.safetyFindings).toContain("HITL does not imply autonomous execution.");
  });

  it("pressure-tests unsafe HITL drift as blocked", () => {
    const result = createR74HitlRevenueExecutionSafetyAccessibilityReview({
      ...reviewedInput,
      hitlAutonomyDriftDetected: true,
      executionControlDetected: true,
      providerControlDetected: true,
      activationControlDetected: true,
      sendControlDetected: true,
      workflowControlDetected: true,
      providerClientDetected: true,
      credentialEnvReadDetected: true,
      fetchNetworkDetected: true,
      hiddenExecutionAffordanceDetected: true,
      dangerousWordingDetected: true,
      runtimeDetected: true,
      pollingDetected: true,
      persistenceDetected: true,
      auditWritingDetected: true,
    });
    expect(result.status).toBe("hitl_safety_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["HITL must not imply autonomous execution", "execution controls remain forbidden", "provider clients remain blocked", "audit writing remains blocked"]));
  });

  it("summarizes HITL safety", () => {
    const result = createR74HitlRevenueExecutionSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR74HitlRevenueExecutionSafetyReview(result)).toMatch(/human accountability/i);
  });
});
