import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR62BuyerDispositionOperationalSafetyReviewInvariants,
  createR62BuyerDispositionOperationalSafetyAccessibilityReview,
  summarizeR62BuyerDispositionOperationalSafetyReview,
  type R62BuyerDispositionOperationalSafetyReviewInput,
  type R62BuyerDispositionOperationalSafetyReviewResult,
} from "./r62-buyer-disposition-operational-intelligence-safety-accessibility-review";

const readyInput: R62BuyerDispositionOperationalSafetyReviewInput = {
  r62dUiReviewed: true,
  forbiddenControlsReviewed: true,
  dangerousWordingReviewed: true,
  executionDriftReviewed: true,
  providerDriftReviewed: true,
  automationDriftReviewed: true,
  accessibilityReviewed: true,
  governanceStopDominanceReviewed: true,
  operatorReviewCompleted: true,
  governanceStopFirst: true,
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
  uiImplementationAllowedNow: true,
};

function assertSafety(result: R62BuyerDispositionOperationalSafetyReviewResult) {
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
  assert.equal(result.uiImplementationAllowedNow, true);
  assert.equal(assertR62BuyerDispositionOperationalSafetyReviewInvariants(result).passed, true);
}

test("R62E defaults to operator review with hard-closed safety flags", () => {
  const result = createR62BuyerDispositionOperationalSafetyAccessibilityReview();

  assert.equal(result.phase, "R62E");
  assert.equal(result.reviewStatus, "operator_review_required");
  assert.equal(result.fixesRequired, false);
  assert.ok(result.warningCodes.includes("r62e_safety_accessibility_review_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r62d_ui_review_required"));
  assertSafety(result);
});

test("R62E completes when R62D safety and accessibility reviews are clean", () => {
  const result = createR62BuyerDispositionOperationalSafetyAccessibilityReview(readyInput);

  assert.equal(result.reviewStatus, "safety_accessibility_review_complete");
  assert.equal(result.fixesRequired, false);
  assert.deepEqual(result.fixesApplied, []);
  assert.ok(result.filesReviewed.includes("components/dashboard/buyer-disposition-operational-intelligence-summary.tsx"));
  assert.ok(result.filesReviewed.includes("app/(dashboard)/dashboard/page.tsx"));
  assertSafety(result);
});

test("R62E records safety, governance, and accessibility findings", () => {
  const result = createR62BuyerDispositionOperationalSafetyAccessibilityReview(readyInput);

  assert.match(result.safetyFindings.join(" "), /read-only and advisory-only/i);
  assert.match(result.safetyFindings.join(" "), /No R62D buyer outreach execution control/i);
  assert.match(result.accessibilityFindings.join(" "), /aria-labelledby and aria-describedby/i);
  assert.match(result.accessibilityFindings.join(" "), /Status meaning is text-based/i);
  assert.match(result.governanceFindings.join(" "), /Governance stop signals render first/i);
  assert.match(result.governanceFindings.join(" "), /does not mean send/i);
  assertSafety(result);
});

test("R62E records forbidden-control and dangerous-wording findings", () => {
  const result = createR62BuyerDispositionOperationalSafetyAccessibilityReview(readyInput);

  assert.match(result.forbiddenControlFindings.join(" "), /No R62D buttons, links, forms/i);
  assert.match(result.forbiddenControlFindings.join(" "), /no send, blast, campaign, provider activation/i);
  assert.match(result.dangerousWordingFindings.join(" "), /Manual disposition review recommended/i);
  assert.match(result.dangerousWordingFindings.join(" "), /Disposition priority label is advisory only/i);
  assert.match(result.dangerousWordingFindings.join(" "), /negative boundary copy/i);
  assertSafety(result);
});

test("R62E blocks unsafe UI and execution drift findings", () => {
  const result = createR62BuyerDispositionOperationalSafetyAccessibilityReview({
    ...readyInput,
    buttonOrLinkFound: true,
    eventHandlerFound: true,
    fetchOrStorageFound: true,
    timerOrPollingFound: true,
    providerOrTwilioImportFound: true,
    automationAgentImportFound: true,
    forbiddenSendSemanticsFound: true,
    approvalExecutionSemanticsFound: true,
    autonomousBehaviorSemanticsFound: true,
    accessibilityGapFound: true,
    governanceStopFirst: false,
  });

  assert.equal(result.reviewStatus, "review_blocked");
  assert.equal(result.fixesRequired, true);
  assert.ok(result.warningCodes.includes("button_or_link_found"));
  assert.ok(result.warningCodes.includes("provider_or_twilio_import_found"));
  assert.ok(result.warningCodes.includes("automation_agent_import_found"));
  assert.ok(result.warningCodes.includes("forbidden_send_semantics_found"));
  assert.ok(result.warningCodes.includes("governance_stop_not_first"));
  assertSafety(result);
});

test("R62E rejects unsafe invariant inputs while preserving safe output flags", () => {
  const result = createR62BuyerDispositionOperationalSafetyAccessibilityReview({
    ...readyInput,
    readOnly: false,
    advisoryOnly: false,
    simulationOnly: false,
    providerCalled: true,
    sent: true,
    persistenceAllowedNow: true,
    pollingAllowed: true,
    runtimeActivationAllowed: true,
    providerActivationAllowed: true,
    approvalGrantsExecution: true,
    uiImplementationAllowedNow: false,
  });

  assert.equal(result.reviewStatus, "review_blocked");
  assert.equal(result.fixesRequired, true);
  assert.ok(result.warningCodes.includes("read_only_required"));
  assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
  assert.ok(result.warningCodes.includes("sent_must_be_false"));
  assert.ok(result.warningCodes.includes("polling_not_allowed"));
  assert.ok(result.warningCodes.includes("ui_implementation_allowed_only_for_r62d"));
  assertSafety(result);
});

test("R62E summary is bounded and points to final dashboard lockdown", () => {
  const result = createR62BuyerDispositionOperationalSafetyAccessibilityReview({
    ...readyInput,
    extraReviewNotes: ["R62E note".repeat(100)],
  });
  const summary = summarizeR62BuyerDispositionOperationalSafetyReview(result);

  assert.equal(
    result.nextSuggestedPhase,
    "R62F - Buyer Disposition Operational Intelligence Final Dashboard Lockdown",
  );
  assert.ok(summary.length <= 853);
  assert.match(summary, /no R62D buyer outreach execution/i);
  assertSafety(result);
});
