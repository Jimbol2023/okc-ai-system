import {
  createR72RevenueCommandCenterSafetyAccessibilityReview,
  summarizeR72RevenueCommandCenterSafetyReview,
} from "./r72-revenue-command-center-safety-accessibility-review";

const reviewedInput = {
  semanticStructureReviewed: true,
  accessibilityReviewed: true,
  revenuePressureReviewed: true,
  governanceWarningsReviewed: true,
  forbiddenControlsReviewed: true,
  providerBoundaryReviewed: true,
} as const;

describe("R72E revenue command center safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR72RevenueCommandCenterSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.executionControlsPresent).toBe(false);
  });

  it("smoke-tests safety review clearance", () => {
    const result = createR72RevenueCommandCenterSafetyAccessibilityReview(reviewedInput);
    expect(result.status).toBe("revenue_command_safety_clear");
    expect(result.safetyFindings).toContain("Revenue pressure does not override governance.");
    expect(result.nextPhase).toBe("R72F - Revenue Command Center Final Lockdown Contract");
  });

  it("pressure-tests unsafe UI and revenue pressure drift as blocked", () => {
    const result = createR72RevenueCommandCenterSafetyAccessibilityReview({
      ...reviewedInput,
      revenuePressureOverrideRequested: true,
      executionControlDetected: true,
      providerControlDetected: true,
      sendControlDetected: true,
      callControlDetected: true,
      smsControlDetected: true,
      emailControlDetected: true,
      campaignControlDetected: true,
      hiddenExecutionAffordanceDetected: true,
      dangerousWordingDetected: true,
      fetchNetworkDetected: true,
      runtimeDetected: true,
      pollingDetected: true,
      persistenceDetected: true,
      auditWritingDetected: true,
    });
    expect(result.status).toBe("revenue_command_safety_blocked");
    expect(result.blockedReasons).toEqual(expect.arrayContaining(["revenue pressure cannot override governance", "execution controls remain forbidden", "provider controls remain forbidden", "audit writing remains blocked"]));
  });

  it("preserves accessibility findings", () => {
    const result = createR72RevenueCommandCenterSafetyAccessibilityReview(reviewedInput);
    expect(result.accessibilityFindings).toContain("aria-labelledby is required.");
    expect(result.accessibilityFindings).toContain("No polling is allowed.");
  });

  it("summarizes safe revenue command review", () => {
    const result = createR72RevenueCommandCenterSafetyAccessibilityReview(reviewedInput);
    expect(summarizeR72RevenueCommandCenterSafetyReview(result)).toMatch(/no revenue-pressure override/i);
  });
});
