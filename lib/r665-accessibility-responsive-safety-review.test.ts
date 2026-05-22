import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR665AccessibilityResponsiveReviewInvariants,
  createR665AccessibilityResponsiveSafetyReview,
  summarizeR665AccessibilityResponsiveSafetyReview,
  type R665AccessibilityResponsiveReviewInput,
  type R665AccessibilityResponsiveReviewResult,
} from "./r665-accessibility-responsive-safety-review";

const passedInput: R665AccessibilityResponsiveReviewInput = {
  r665dCleanupReviewed: true,
  overflowContainmentReviewed: true,
  badgeWrappingReviewed: true,
  responsiveGridReviewed: true,
  governanceVisibilityReviewed: true,
  semanticStructureReviewed: true,
  screenReaderSummaryReviewed: true,
  forbiddenControlSearchReviewed: true,
  executionDriftSearchReviewed: true,
  providerRuntimePollingSearchReviewed: true,
};

function assertSafety(result: R665AccessibilityResponsiveReviewResult) {
  assert.equal(result.readOnly, true);
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.providerCalled, false);
  assert.equal(result.sent, false);
  assert.equal(result.persistenceAllowedNow, false);
  assert.equal(result.pollingAllowed, false);
  assert.equal(result.runtimeActivationAllowed, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.approvalGrantsExecution, false);
  assert.equal(result.noExecutionControlsAdded, true);
  assert.equal(result.noUiLogicChanged, true);
  assert.equal(assertR665AccessibilityResponsiveReviewInvariants(result).passed, true);
}

test("R66.5E defaults to operator review required", () => {
  const result = createR665AccessibilityResponsiveSafetyReview();

  assert.equal(result.phase, "R66.5E");
  assert.equal(result.reviewStatus, "operator_review_required");
  assert.ok(result.missingReviewAreas.includes("R66.5D cleanup diff"));
  assert.ok(result.missingReviewAreas.includes("provider/runtime/polling search"));
  assertSafety(result);
});

test("R66.5E passes when all safety and responsive reviews are complete", () => {
  const result = createR665AccessibilityResponsiveSafetyReview(passedInput);

  assert.equal(result.reviewStatus, "accessibility_responsive_review_passed");
  assert.ok(result.reviewedFiles.includes("app/(dashboard)/dashboard/page.tsx"));
  assert.match(result.overflowFindings.join(" "), /break-word protection/i);
  assert.match(result.densityFindings.join(" "), /Seven-column areas/i);
  assert.match(result.accessibilityFindings.join(" "), /Semantic headings/i);
  assert.match(result.governanceFindings.join(" "), /Read-only, advisory-only, simulation-only/i);
  assertSafety(result);
});

test("R66.5E blocks hidden controls, governance hiding, polling, runtime, providers, and execution drift", () => {
  const result = createR665AccessibilityResponsiveSafetyReview({
    ...passedInput,
    hiddenControlIntroduced: true,
    governanceWarningHidden: true,
    safetyCopyWeakened: true,
    pollingIntroduced: true,
    providerPathIntroduced: true,
    runtimeActivationIntroduced: true,
    persistenceIntroduced: true,
    executionControlIntroduced: true,
    routeChangeIntroduced: true,
    logicChangeIntroduced: true,
    dataMutationIntroduced: true,
  });

  assert.equal(result.reviewStatus, "accessibility_responsive_review_blocked");
  assert.ok(result.blockedReasons.includes("hidden controls are forbidden"));
  assert.ok(result.blockedReasons.includes("governance warnings cannot be hidden"));
  assert.ok(result.blockedReasons.includes("execution controls are forbidden"));
  assert.ok(result.blockedReasons.includes("logic changes are forbidden"));
  assertSafety(result);
});

test("R66.5E blocks accessibility regressions", () => {
  const result = createR665AccessibilityResponsiveSafetyReview({
    ...passedInput,
    colorOnlyMeaningIntroduced: true,
    motionDependencyIntroduced: true,
    focusMovementIntroduced: true,
    autoRefreshIntroduced: true,
  });

  assert.equal(result.reviewStatus, "accessibility_responsive_review_blocked");
  assert.ok(result.blockedReasons.includes("color-only meaning is forbidden"));
  assert.ok(result.blockedReasons.includes("motion dependency is forbidden"));
  assert.ok(result.blockedReasons.includes("focus movement is forbidden"));
  assert.ok(result.blockedReasons.includes("auto-refresh is forbidden"));
  assertSafety(result);
});

test("R66.5E summary points to final UX lockdown", () => {
  const result = createR665AccessibilityResponsiveSafetyReview(passedInput);
  const summary = summarizeR665AccessibilityResponsiveSafetyReview(result);

  assert.equal(result.nextSuggestedPhase, "R66.5F - Final UX Lockdown Contract");
  assert.match(summary, /cannot authorize execution/i);
  assert.match(summary, /safety-copy weakening/i);
  assertSafety(result);
});
