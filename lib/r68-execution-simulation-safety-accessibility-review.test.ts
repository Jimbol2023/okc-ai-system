import {
  createR68ExecutionSimulationSafetyAccessibilityReview,
  summarizeR68ExecutionSimulationSafetyAccessibilityReview,
} from "./r68-execution-simulation-safety-accessibility-review";

const passedInput = {
  r68dUiReviewed: true,
  contractsReviewed: true,
  dangerousWordingReviewed: true,
  hiddenControlsReviewed: true,
  inclusiveAccessibilityReviewed: true,
  providerRuntimePollingReviewed: true,
  persistenceAuditBoundaryReviewed: true,
  governanceVisibilityReviewed: true,
} as const;

describe("R68E execution simulation safety accessibility review", () => {
  it("defaults to operator review required", () => {
    const result = createR68ExecutionSimulationSafetyAccessibilityReview();
    expect(result.status).toBe("operator_review_required");
    expect(result.flags.noSimulationToExecutionDrift).toBe(true);
    expect(result.missingReviewAreas).toContain("R68D UI");
  });

  it("smoke-tests safe R68 UI and contract review coverage", () => {
    const result = createR68ExecutionSimulationSafetyAccessibilityReview(passedInput);
    expect(result.status).toBe("safety_accessibility_review_passed");
    expect(result.findings.join(" ")).toMatch(/No buttons, execution controls/i);
    expect(result.findings.join(" ")).toMatch(/audit records are written/i);
    expect(result.findings.join(" ")).toMatch(/screen-reader, keyboard-only/i);
  });

  it("pressure-tests simulation provider runtime polling persistence and audit blockers", () => {
    const result = createR68ExecutionSimulationSafetyAccessibilityReview({
      ...passedInput,
      simulationToExecutionDriftFound: true,
      previewToProviderDriftFound: true,
      providerDriftFound: true,
      runtimeDriftFound: true,
      pollingDriftFound: true,
      persistenceDriftFound: true,
      auditWritingDriftFound: true,
      hiddenExecutionAffordanceFound: true,
      dangerousWordingFound: true,
      accessibilityRegressionFound: true,
      executionControlFound: true,
    });
    expect(result.status).toBe("safety_accessibility_review_blocked");
    expect(result.blockedReasons).toEqual(
      expect.arrayContaining([
        "simulation-to-execution drift found",
        "preview-to-provider drift found",
        "runtime drift found",
        "polling drift found",
        "persistence drift found",
        "audit-writing drift found",
        "execution control found",
      ]),
    );
  });

  it("summarizes review coverage", () => {
    const result = createR68ExecutionSimulationSafetyAccessibilityReview(passedInput);
    expect(summarizeR68ExecutionSimulationSafetyAccessibilityReview(result)).toMatch(/inclusive accessibility regression/i);
  });
});
