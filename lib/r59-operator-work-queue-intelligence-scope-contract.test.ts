import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR59OperatorWorkQueueScopeInvariants,
  createR59OperatorWorkQueueIntelligenceScopeContract,
  summarizeR59OperatorWorkQueueScope,
  type R59OperatorWorkQueueInput,
  type R59OperatorWorkQueueScopeResult,
} from "./r59-operator-work-queue-intelligence-scope-contract";

const readyInput: R59OperatorWorkQueueInput = {
  r58fLockdownReviewed: true,
  queueCategoriesReviewed: true,
  dailyRevenuePrioritiesReviewed: true,
  highestValueNextActionsReviewed: true,
  workflowBottlenecksReviewed: true,
  governanceBoundaryReviewed: true,
  accessibilityReviewed: true,
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

function assertSafety(result: R59OperatorWorkQueueScopeResult) {
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
  assert.equal(assertR59OperatorWorkQueueScopeInvariants(result).passed, true);
}

test("R59A defaults to operator review with hard-closed safety flags", () => {
  const result = createR59OperatorWorkQueueIntelligenceScopeContract();

  assert.equal(result.phase, "R59A");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r59a_scope_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r58f_lockdown_review_required"));
  assertSafety(result);
});

test("R59A defines operator work queue categories and daily revenue concepts", () => {
  const result = createR59OperatorWorkQueueIntelligenceScopeContract(readyInput);

  assert.equal(result.scopeStatus, "operator_work_queue_scope_ready");
  assert.ok(result.operatorWorkQueueCategories.includes("highest_value_next_actions"));
  assert.ok(result.operatorWorkQueueCategories.includes("daily_revenue_priorities"));
  assert.ok(result.operatorWorkQueueCategories.includes("recovery_opportunities"));
  assert.ok(result.operatorWorkQueueCategories.includes("acquisition_focus"));
  assert.ok(result.operatorWorkQueueCategories.includes("buyer_disposition_focus"));
  assert.ok(result.operatorWorkQueueCategories.includes("workflow_bottlenecks"));
  assert.ok(result.dailyRevenuePriorityConcepts.includes("manual_review_recommended"));
  assert.ok(result.dailyRevenuePriorityConcepts.includes("operator_attention_recommended"));
  assert.ok(result.dailyRevenuePriorityConcepts.includes("priority_recovery_focus"));
  assert.ok(result.dailyRevenuePriorityConcepts.includes("revenue_leakage_attention"));
  assertSafety(result);
});

test("R59A ranks highest-value next-action concepts", () => {
  const result = createR59OperatorWorkQueueIntelligenceScopeContract(readyInput);

  assert.deepEqual(
    result.highestValueNextActionConcepts.map((item) => item.rank),
    [1, 2, 3, 4, 5, 6, 7],
  );
  assert.equal(result.highestValueNextActionConcepts[0]?.concept, "resolve_governance_stops");
  assert.equal(result.highestValueNextActionConcepts[1]?.concept, "review_near_close_recovery");
  assert.equal(result.highestValueNextActionConcepts[2]?.concept, "review_stuck_deal_recovery");
  assert.match(result.highestValueNextActionConcepts[0]?.safeManualGuidance ?? "", /Manual review recommended/i);
  assert.match(result.highestValueNextActionConcepts[4]?.safeManualGuidance ?? "", /Buyer review recommended/i);
  assertSafety(result);
});

test("R59A defines stuck-deal, near-close, acquisition, buyer disposition, and leakage priorities", () => {
  const result = createR59OperatorWorkQueueIntelligenceScopeContract(readyInput);

  assert.match(result.stuckDealEscalationConcepts.join(" "), /overdue manual follow-up/i);
  assert.match(result.nearCloseEscalationConcepts.join(" "), /title, escrow, checklist, assignment/i);
  assert.match(result.acquisitionFollowUpPriorities.join(" "), /Seller follow-up recommended/i);
  assert.match(result.buyerDispositionPriorities.join(" "), /Buyer review recommended/i);
  assert.match(result.revenueLeakageEscalationPriorities.join(" "), /missing critical data/i);
  assert.match(result.revenueLeakageEscalationPriorities.join(" "), /must not invent property facts/i);
  assertSafety(result);
});

test("R59A defines workflow bottlenecks and manual review priorities", () => {
  const result = createR59OperatorWorkQueueIntelligenceScopeContract(readyInput);

  assert.ok(result.workflowBottleneckConcepts.includes("governance_stop_unresolved"));
  assert.ok(result.workflowBottleneckConcepts.includes("human_review_backlog"));
  assert.ok(result.workflowBottleneckConcepts.includes("near_close_friction_unreviewed"));
  assert.ok(result.workflowBottleneckConcepts.includes("stuck_deal_recovery_unreviewed"));
  assert.ok(result.workflowBottleneckConcepts.includes("seller_follow_up_overdue"));
  assert.ok(result.workflowBottleneckConcepts.includes("buyer_package_review_pending"));
  assert.ok(result.manualReviewPriorities.join(" ").includes("Review governance stop signals before revenue guidance."));
  assertSafety(result);
});

test("R59A keeps safe wording advisory and manual-first", () => {
  const result = createR59OperatorWorkQueueIntelligenceScopeContract(readyInput);
  const wording = result.safeManualGuidanceWording.join(" ");

  assert.match(wording, /manual review recommended/i);
  assert.match(wording, /operator attention recommended/i);
  assert.match(wording, /manual next step guidance/i);
  assert.match(wording, /seller follow-up recommended/i);
  assert.match(wording, /deal review recommended/i);
  assert.match(wording, /does not send, assign, recover, persist, poll, activate providers/i);
  assertSafety(result);
});

test("R59A blocks forbidden execution semantics", () => {
  const result = createR59OperatorWorkQueueIntelligenceScopeContract(readyInput);

  assert.ok(result.forbiddenExecutionSemantics.includes("send now"));
  assert.ok(result.forbiddenExecutionSemantics.includes("auto assign"));
  assert.ok(result.forbiddenExecutionSemantics.includes("auto follow-up"));
  assert.ok(result.forbiddenExecutionSemantics.includes("execute recovery"));
  assert.ok(result.forbiddenExecutionSemantics.includes("approve and send"));
  assert.ok(result.forbiddenExecutionSemantics.includes("provider activation"));
  assert.ok(result.forbiddenExecutionSemantics.includes("queue execution"));
  assert.ok(result.forbiddenExecutionSemantics.includes("autonomous outreach"));
  assert.ok(result.forbiddenExecutionSemantics.includes("auto disposition"));
  assert.ok(result.forbiddenExecutionSemantics.includes("auto close"));
  assertSafety(result);
});

test("R59A preserves governance and accessibility boundaries", () => {
  const result = createR59OperatorWorkQueueIntelligenceScopeContract(readyInput);
  const governance = result.governanceBoundaries.join(" ");
  const accessibility = result.accessibilityRequirements.join(" ");

  assert.match(governance, /planning-only/i);
  assert.match(governance, /cannot grant permission to send, assign, recover/i);
  assert.match(governance, /Approval and human review states cannot become permission/i);
  assert.match(governance, /no property facts may be invented/i);
  assert.match(accessibility, /semantic headings/i);
  assert.match(accessibility, /readable labels/i);
  assert.match(accessibility, /text-based/i);
  assert.match(accessibility, /never depend on color alone/i);
  assert.match(accessibility, /No motion dependency, focus movement/i);
  assert.match(accessibility, /screen-reader-friendly summaries/i);
  assertSafety(result);
});

test("R59A rejects runtime, provider, persistence, execution, and automation requests", () => {
  const result = createR59OperatorWorkQueueIntelligenceScopeContract({
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

  assert.equal(result.scopeStatus, "operator_work_queue_scope_blocked");
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

test("R59A rejects unsafe flag inputs while preserving safe output flags", () => {
  const result = createR59OperatorWorkQueueIntelligenceScopeContract({
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

  assert.equal(result.scopeStatus, "operator_work_queue_scope_blocked");
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

test("R59A summary is bounded and points to the next audit phase", () => {
  const result = createR59OperatorWorkQueueIntelligenceScopeContract({
    ...readyInput,
    extraScopeNotes: ["R59A note".repeat(100)],
  });
  const summary = summarizeR59OperatorWorkQueueScope(result);

  assert.equal(result.nextSuggestedPhase, "R59B - Operator Work Queue Intelligence UI Scope Audit");
  assert.ok(summary.length <= 903);
  assert.match(summary, /planning-only/i);
  assert.match(summary, /cannot authorize UI, routes, providers/i);
  assertSafety(result);
});
