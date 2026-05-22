import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR59OperatorWorkQueueUiScopeInvariants,
  createR59OperatorWorkQueueUiScopeAudit,
  summarizeR59OperatorWorkQueueUiScopeAudit,
  type R59OperatorWorkQueueUiScopeAuditInput,
  type R59OperatorWorkQueueUiScopeAuditResult,
} from "./r59-operator-work-queue-ui-scope-audit";

const readyInput: R59OperatorWorkQueueUiScopeAuditInput = {
  r59aScopeReviewed: true,
  uiSurfaceReviewed: true,
  visibilityConceptsReviewed: true,
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

function assertSafety(result: R59OperatorWorkQueueUiScopeAuditResult) {
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
  assert.equal(assertR59OperatorWorkQueueUiScopeInvariants(result).passed, true);
}

test("R59B defaults to operator review with hard-closed flags", () => {
  const result = createR59OperatorWorkQueueUiScopeAudit();

  assert.equal(result.phase, "R59B");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r59b_operator_work_queue_ui_scope_audit_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r59a_scope_review_required"));
  assertSafety(result);
});

test("R59B defines allowed future UI sections", () => {
  const result = createR59OperatorWorkQueueUiScopeAudit(readyInput);

  assert.equal(result.scopeStatus, "ui_scope_ready_for_later_implementation");
  assert.ok(result.allowedFutureUiSections.includes("daily_revenue_priorities"));
  assert.ok(result.allowedFutureUiSections.includes("highest_value_next_actions"));
  assert.ok(result.allowedFutureUiSections.includes("governance_stop_signals"));
  assert.ok(result.allowedFutureUiSections.includes("near_close_recovery_items"));
  assert.ok(result.allowedFutureUiSections.includes("stuck_deal_recovery_items"));
  assert.ok(result.allowedFutureUiSections.includes("seller_follow_up_priorities"));
  assert.ok(result.allowedFutureUiSections.includes("buyer_disposition_priorities"));
  assert.ok(result.allowedFutureUiSections.includes("workflow_bottlenecks"));
  assert.ok(result.allowedFutureUiSections.includes("safe_operator_guidance"));
  assertSafety(result);
});

test("R59B orders operator queue visibility concepts for safe daily priority display", () => {
  const result = createR59OperatorWorkQueueUiScopeAudit(readyInput);

  assert.deepEqual(
    result.operatorQueueVisibilityConcepts.map((item) => item.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  );
  assert.equal(result.operatorQueueVisibilityConcepts[0]?.section, "governance_stop_signals");
  assert.equal(result.operatorQueueVisibilityConcepts[1]?.section, "highest_value_next_actions");
  assert.equal(result.operatorQueueVisibilityConcepts[2]?.section, "daily_revenue_priorities");
  assert.match(result.operatorQueueVisibilityConcepts[0]?.safeCopyRequired ?? "", /does not grant contact/i);
  assert.match(result.operatorQueueVisibilityConcepts[10]?.safeCopyRequired ?? "", /Guidance is advisory only/i);
  assertSafety(result);
});

test("R59B defines safe wording for daily priorities and recovery opportunities", () => {
  const result = createR59OperatorWorkQueueUiScopeAudit(readyInput);

  assert.match(result.safeManualGuidanceWording.join(" "), /Manual review recommended/i);
  assert.match(result.safeManualGuidanceWording.join(" "), /Operator attention recommended/i);
  assert.match(result.safeManualGuidanceWording.join(" "), /must not send, assign, recover/i);
  assert.match(result.dailyPriorityWording.join(" "), /Daily revenue priorities/i);
  assert.match(result.dailyPriorityWording.join(" "), /Daily priority labels are advisory only/i);
  assert.match(result.recoveryOpportunityWording.join(" "), /Recovery opportunity means manual review only/i);
  assertSafety(result);
});

test("R59B defines friction escalation and human-review wording", () => {
  const result = createR59OperatorWorkQueueUiScopeAudit(readyInput);

  assert.match(result.frictionEscalationWording.join(" "), /Friction escalation/i);
  assert.match(result.frictionEscalationWording.join(" "), /does not assign work or activate workflow state/i);
  assert.match(result.humanReviewRequiredWording.join(" "), /Human review required/i);
  assert.match(result.humanReviewRequiredWording.join(" "), /Do-not-proceed until reviewed/i);
  assert.match(result.humanReviewRequiredWording.join(" "), /does not grant contact, assignment, recovery/i);
  assertSafety(result);
});

test("R59B blocks controls, buttons, actions, and dangerous language", () => {
  const result = createR59OperatorWorkQueueUiScopeAudit(readyInput);

  assert.ok(result.forbiddenControlsButtonsActions.includes("send now"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("auto assign"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("auto follow-up"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("execute recovery"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("provider activation"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("queue execution"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("autonomous outreach"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("auto disposition"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("auto close"));
  assert.ok(result.dangerousLanguagePatterns.includes("run queue"));
  assert.ok(result.dangerousLanguagePatterns.includes("dispatch work"));
  assertSafety(result);
});

test("R59B preserves accessibility and no-action boundaries", () => {
  const result = createR59OperatorWorkQueueUiScopeAudit(readyInput);
  const accessibility = result.accessibilityExpectations.join(" ");
  const boundaries = result.noActionExecutionBoundaries.join(" ");

  assert.match(accessibility, /semantic headings/i);
  assert.match(accessibility, /readable labels/i);
  assert.match(accessibility, /text-based/i);
  assert.match(accessibility, /never depend on color alone/i);
  assert.match(accessibility, /Do not rely on motion, focus movement, auto-refresh/i);
  assert.match(accessibility, /screen-reader-friendly summaries/i);
  assert.match(boundaries, /No buttons, links, toggles, menus, forms, or controls/i);
  assert.match(boundaries, /daily priority, recovery, escalation, and human-review wording/i);
  assert.match(boundaries, /No hidden execution affordances/i);
  assertSafety(result);
});

test("R59B locks future implementation boundaries", () => {
  const result = createR59OperatorWorkQueueUiScopeAudit(readyInput);

  assert.equal(result.implementationBoundaries.candidateSurface, "dashboard_operator_work_queue_intelligence");
  assert.equal(result.implementationBoundaries.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
  assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
  assert.equal(result.implementationBoundaries.noNewRoutes, true);
  assert.equal(result.implementationBoundaries.noProviderControls, true);
  assert.equal(result.implementationBoundaries.noExecutionControls, true);
  assert.equal(result.implementationBoundaries.noHiddenExecutionAffordances, true);
  assert.equal(result.implementationBoundaries.useExistingReadOnlyDashboardSignalsOnlyLater, true);
  assertSafety(result);
});

test("R59B rejects runtime, provider, persistence, execution, and automation requests", () => {
  const result = createR59OperatorWorkQueueUiScopeAudit({
    ...readyInput,
    uiImplementationRequested: true,
    routeChangeRequested: true,
    runtimeActivationRequested: true,
    providerActivationRequested: true,
    liveSendingRequested: true,
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
  assert.ok(result.warningCodes.includes("automation_agent_rejected"));
  assert.ok(result.warningCodes.includes("polling_rejected"));
  assert.ok(result.warningCodes.includes("persistence_rejected"));
  assert.ok(result.warningCodes.includes("execution_control_rejected"));
  assert.ok(result.warningCodes.includes("redesign_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_workflow_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R59B rejects unsafe flag inputs while preserving safe outputs", () => {
  const result = createR59OperatorWorkQueueUiScopeAudit({
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

test("R59B summary is bounded and points to the implementation scope contract", () => {
  const result = createR59OperatorWorkQueueUiScopeAudit({
    ...readyInput,
    extraAuditNotes: ["R59B note".repeat(100)],
  });
  const summary = summarizeR59OperatorWorkQueueUiScopeAudit(result);

  assert.equal(result.nextSuggestedPhase, "R59C - Operator Work Queue Intelligence Read-Only UI Implementation Scope Contract");
  assert.ok(summary.length <= 903);
  assert.match(summary, /cannot authorize UI implementation/i);
  assertSafety(result);
});
