import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR60AcquisitionDailyCallPriorityUiScopeInvariants,
  createR60AcquisitionDailyCallPriorityUiScopeAudit,
  summarizeR60AcquisitionDailyCallPriorityUiScopeAudit,
  type R60AcquisitionDailyCallPriorityUiScopeAuditInput,
  type R60AcquisitionDailyCallPriorityUiScopeAuditResult,
} from "./r60-acquisition-daily-call-priority-ui-scope-audit";

const readyInput: R60AcquisitionDailyCallPriorityUiScopeAuditInput = {
  r60aScopeReviewed: true,
  uiSurfaceReviewed: true,
  visibilityConceptsReviewed: true,
  urgencyVisibilityReviewed: true,
  leadDecayVisibilityReviewed: true,
  sellerMomentumVisibilityReviewed: true,
  wordingReviewed: true,
  governanceBoundaryReviewed: true,
  accessibilityReviewed: true,
  dangerousPatternsReviewed: true,
  operatorReviewCompleted: true,
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  uiImplementationAllowedNow: false,
};

function assertSafety(result: R60AcquisitionDailyCallPriorityUiScopeAuditResult) {
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
  assert.equal(result.uiImplementationAllowedNow, false);
  assert.deepEqual(result.safetyFlags, {
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
    uiImplementationAllowedNow: false,
  });
  assert.equal(assertR60AcquisitionDailyCallPriorityUiScopeInvariants(result).passed, true);
}

test("R60B defaults to operator review with hard-closed safety flags", () => {
  const result = createR60AcquisitionDailyCallPriorityUiScopeAudit();

  assert.equal(result.phase, "R60B");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r60b_acquisition_daily_call_priority_ui_scope_audit_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r60a_scope_review_required"));
  assertSafety(result);
});

test("R60B defines allowed future UI sections", () => {
  const result = createR60AcquisitionDailyCallPriorityUiScopeAudit(readyInput);

  assert.equal(result.scopeStatus, "ui_scope_ready_for_later_implementation");
  assert.ok(result.allowedFutureUiSections.includes("daily_seller_call_priorities"));
  assert.ok(result.allowedFutureUiSections.includes("highest_priority_seller_review"));
  assert.ok(result.allowedFutureUiSections.includes("seller_momentum_risk"));
  assert.ok(result.allowedFutureUiSections.includes("overdue_seller_follow_up"));
  assert.ok(result.allowedFutureUiSections.includes("lead_decay_risk"));
  assert.ok(result.allowedFutureUiSections.includes("seller_urgency_review"));
  assert.ok(result.allowedFutureUiSections.includes("missing_acquisition_data"));
  assert.ok(result.allowedFutureUiSections.includes("safe_operator_review_guidance"));
  assertSafety(result);
});

test("R60B defines seller call priority visibility ordering", () => {
  const result = createR60AcquisitionDailyCallPriorityUiScopeAudit(readyInput);

  assert.deepEqual(
    result.sellerCallPriorityVisibilityConcepts.map((concept) => concept.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  );
  assert.equal(result.sellerCallPriorityVisibilityConcepts[0]?.section, "governance_stop_signals");
  assert.equal(result.sellerCallPriorityVisibilityConcepts[1]?.section, "highest_priority_seller_review");
  assert.equal(result.sellerCallPriorityVisibilityConcepts[2]?.section, "daily_seller_call_priorities");
  assert.match(result.sellerCallPriorityVisibilityConcepts[0]?.safeCopyRequired ?? "", /do not grant call/i);
  assert.match(result.sellerCallPriorityVisibilityConcepts[10]?.safeCopyRequired ?? "", /cannot call, dial, send/i);
  assertSafety(result);
});

test("R60B defines seller urgency, momentum, lead decay, and overdue wording", () => {
  const result = createR60AcquisitionDailyCallPriorityUiScopeAudit(readyInput);

  assert.match(result.urgencyVisibilityWording.join(" "), /Seller urgency review/i);
  assert.match(result.urgencyVisibilityWording.join(" "), /manually verified/i);
  assert.match(result.sellerMomentumWording.join(" "), /Seller momentum risk/i);
  assert.match(result.sellerMomentumWording.join(" "), /does not send, dial, or schedule/i);
  assert.match(result.leadDecayWording.join(" "), /Lead decay risk/i);
  assert.match(result.leadDecayWording.join(" "), /cannot launch campaigns/i);
  assert.match(result.overdueFollowUpWording.join(" "), /Overdue seller follow-up/i);
  assert.match(result.overdueFollowUpWording.join(" "), /cannot dial, text, email/i);
  assertSafety(result);
});

test("R60B defines acquisition bottleneck and manual review wording", () => {
  const result = createR60AcquisitionDailyCallPriorityUiScopeAudit(readyInput);

  assert.match(result.acquisitionBottleneckWording.join(" "), /Acquisition bottleneck/i);
  assert.match(result.acquisitionBottleneckWording.join(" "), /Missing manual next step/i);
  assert.match(result.acquisitionBottleneckWording.join(" "), /cannot assign work, activate campaigns/i);
  assert.match(result.manualReviewWording.join(" "), /Manual call review recommended/i);
  assert.match(result.manualReviewWording.join(" "), /Call priority label is advisory only/i);
  assert.match(result.safeOperatorGuidanceWording.join(" "), /Review governance stop signals/i);
  assert.match(result.safeOperatorGuidanceWording.join(" "), /must not call, dial, send, persist, poll/i);
  assertSafety(result);
});

test("R60B blocks forbidden controls, buttons, actions, and dangerous language", () => {
  const result = createR60AcquisitionDailyCallPriorityUiScopeAudit(readyInput);

  assert.ok(result.forbiddenControlsButtonsActions.includes("call now"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("auto call"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("auto dial"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("launch dialer"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("send SMS"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("send email"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("activate campaign"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("provider activation"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("execute workflow"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("release automation"));
  assert.ok(result.dangerousLanguagePatterns.includes("ready to call"));
  assert.ok(result.dangerousLanguagePatterns.includes("contact seller now"));
  assertSafety(result);
});

test("R60B preserves accessibility expectations", () => {
  const result = createR60AcquisitionDailyCallPriorityUiScopeAudit(readyInput);
  const accessibility = result.accessibilityExpectations.join(" ");

  assert.match(accessibility, /semantic headings/i);
  assert.match(accessibility, /readable labels/i);
  assert.match(accessibility, /Status meaning must be text-based/i);
  assert.match(accessibility, /never depend on color alone/i);
  assert.match(accessibility, /Do not rely on motion, focus movement/i);
  assert.match(accessibility, /screen-reader-friendly summaries/i);
  assertSafety(result);
});

test("R60B keeps no-action and implementation boundaries hard-closed", () => {
  const result = createR60AcquisitionDailyCallPriorityUiScopeAudit(readyInput);
  const boundaries = result.noActionExecutionBoundaries.join(" ");

  assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
  assert.equal(result.implementationBoundaries.noNewRoutes, true);
  assert.equal(result.implementationBoundaries.noCallControls, true);
  assert.equal(result.implementationBoundaries.noDialerControls, true);
  assert.equal(result.implementationBoundaries.noCampaignControls, true);
  assert.equal(result.implementationBoundaries.noHiddenExecutionAffordances, true);
  assert.match(boundaries, /No buttons, links, toggles, menus, forms, or controls/i);
  assert.match(boundaries, /trigger calls, dialing, SMS, email, campaigns/i);
  assert.match(boundaries, /must never imply permission to call, text, email/i);
  assert.match(boundaries, /No hidden execution affordances/i);
  assertSafety(result);
});

test("R60B rejects UI, route, provider, call, dialer, campaign, persistence, and automation requests", () => {
  const result = createR60AcquisitionDailyCallPriorityUiScopeAudit({
    ...readyInput,
    uiImplementationRequested: true,
    routeChangeRequested: true,
    runtimeActivationRequested: true,
    providerActivationRequested: true,
    liveSendingRequested: true,
    callExecutionRequested: true,
    dialerActivationRequested: true,
    campaignActivationRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    executionControlRequested: true,
    redesignRequested: true,
    autonomousWorkflowRequested: true,
    approvalGrantsExecution: true,
  });

  assert.equal(result.scopeStatus, "ui_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("route_change_rejected"));
  assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("live_sending_rejected"));
  assert.ok(result.warningCodes.includes("call_execution_rejected"));
  assert.ok(result.warningCodes.includes("dialer_activation_rejected"));
  assert.ok(result.warningCodes.includes("campaign_activation_rejected"));
  assert.ok(result.warningCodes.includes("automation_agent_rejected"));
  assert.ok(result.warningCodes.includes("polling_rejected"));
  assert.ok(result.warningCodes.includes("persistence_rejected"));
  assert.ok(result.warningCodes.includes("execution_control_rejected"));
  assert.ok(result.warningCodes.includes("redesign_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_workflow_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R60B rejects unsafe invariant inputs while preserving safe output flags", () => {
  const result = createR60AcquisitionDailyCallPriorityUiScopeAudit({
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
    uiImplementationAllowedNow: true,
  });

  assert.equal(result.scopeStatus, "ui_scope_blocked");
  assert.ok(result.warningCodes.includes("read_only_required"));
  assert.ok(result.warningCodes.includes("advisory_only_required"));
  assert.ok(result.warningCodes.includes("simulation_only_required"));
  assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
  assert.ok(result.warningCodes.includes("sent_must_be_false"));
  assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
  assert.ok(result.warningCodes.includes("polling_not_allowed"));
  assert.ok(result.warningCodes.includes("runtime_activation_not_allowed"));
  assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
  assert.ok(result.warningCodes.includes("ui_implementation_not_allowed_now"));
  assertSafety(result);
});

test("R60B summary is bounded and points to the next scope contract", () => {
  const result = createR60AcquisitionDailyCallPriorityUiScopeAudit({
    ...readyInput,
    extraAuditNotes: ["R60B note".repeat(100)],
  });
  const summary = summarizeR60AcquisitionDailyCallPriorityUiScopeAudit(result);

  assert.equal(
    result.nextSuggestedPhase,
    "R60C - Acquisition Daily Call Priority Intelligence Read-Only UI Implementation Scope Contract",
  );
  assert.ok(summary.length <= 903);
  assert.match(summary, /cannot authorize UI implementation/i);
  assert.match(summary, /calls, dialing, SMS, email, campaigns/i);
  assertSafety(result);
});
