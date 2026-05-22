import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR59OperatorWorkQueueUiImplementationScopeInvariants,
  createR59OperatorWorkQueueUiImplementationScopeContract,
  summarizeR59OperatorWorkQueueUiImplementationScopeContract,
  type R59OperatorWorkQueueUiImplementationScopeInput,
  type R59OperatorWorkQueueUiImplementationScopeResult,
} from "./r59-operator-work-queue-ui-implementation-scope-contract";

const readyInput: R59OperatorWorkQueueUiImplementationScopeInput = {
  r59bUiScopeReviewed: true,
  placementReviewed: true,
  readOnlyDataReviewed: true,
  displaySectionsReviewed: true,
  dailyPriorityReviewed: true,
  highestValueNextActionsReviewed: true,
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

function assertSafety(result: R59OperatorWorkQueueUiImplementationScopeResult) {
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
  assert.equal(assertR59OperatorWorkQueueUiImplementationScopeInvariants(result).passed, true);
}

test("R59C defaults to operator review with hard-closed output flags", () => {
  const result = createR59OperatorWorkQueueUiImplementationScopeContract();

  assert.equal(result.phase, "R59C");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r59c_operator_work_queue_ui_implementation_scope_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r59b_ui_scope_review_required"));
  assertSafety(result);
});

test("R59C locks allowed placement and existing read-only data", () => {
  const result = createR59OperatorWorkQueueUiImplementationScopeContract(readyInput);

  assert.equal(result.scopeStatus, "read_only_ui_implementation_scope_ready");
  assert.equal(result.allowedUiPlacement.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
  assert.equal(result.allowedUiPlacement.futureComponentAllowed, "components/dashboard/operator-work-queue-summary.tsx");
  assert.equal(result.allowedUiPlacement.routeChangesAllowed, false);
  assert.equal(result.allowedReadOnlyDataSource.newFetchAllowed, false);
  assert.equal(result.allowedReadOnlyDataSource.persistenceAllowed, false);
  assert.ok(result.allowedReadOnlyDataSource.allowedDataOnly.includes("lead source"));
  assert.ok(result.allowedReadOnlyDataSource.allowedDerivedSignalsOnlyIfAlreadyInDashboardScope.includes("existing manual revenue metric values"));
  assert.ok(result.allowedReadOnlyDataSource.allowedDerivedSignalsOnlyIfAlreadyInDashboardScope.includes("existing stuck-deal read-only derived labels"));
  assert.ok(result.allowedReadOnlyDataSource.allowedDerivedSignalsOnlyIfAlreadyInDashboardScope.includes("existing near-close read-only derived labels"));
  assert.ok(result.allowedReadOnlyDataSource.forbiddenDataSources.includes("new fetch requests"));
  assert.ok(result.allowedReadOnlyDataSource.forbiddenDataSources.includes("runtime execution queues"));
  assertSafety(result);
});

test("R59C defines allowed display sections and required safety copy", () => {
  const result = createR59OperatorWorkQueueUiImplementationScopeContract(readyInput);

  assert.equal(
    result.requiredSafetyCopy,
    "Read-only operator work queue guidance. No provider called, no message sent, no runtime execution.",
  );
  assert.ok(result.allowedDisplaySections.includes("operator_work_queue_summary"));
  assert.ok(result.allowedDisplaySections.includes("governance_stop_signals"));
  assert.ok(result.allowedDisplaySections.includes("highest_value_next_actions"));
  assert.ok(result.allowedDisplaySections.includes("daily_revenue_priorities"));
  assert.ok(result.allowedDisplaySections.includes("near_close_recovery_items"));
  assert.ok(result.allowedDisplaySections.includes("stuck_deal_recovery_items"));
  assert.ok(result.allowedDisplaySections.includes("safe_operator_guidance"));
  assertSafety(result);
});

test("R59C preserves daily revenue-priority ordering", () => {
  const result = createR59OperatorWorkQueueUiImplementationScopeContract(readyInput);

  assert.deepEqual(
    result.dailyRevenuePriorityOrdering.map((item) => item.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  );
  assert.equal(result.dailyRevenuePriorityOrdering[0]?.section, "governance_stop_signals");
  assert.equal(result.dailyRevenuePriorityOrdering[1]?.section, "highest_value_next_actions");
  assert.equal(result.dailyRevenuePriorityOrdering[2]?.section, "daily_revenue_priorities");
  assert.equal(result.dailyRevenuePriorityOrdering[11]?.section, "safe_operator_guidance");
  assert.ok(result.dailyRevenuePriorityOrdering.every((item) => item.requiredSafetyCopy === result.requiredSafetyCopy));
  assertSafety(result);
});

test("R59C preserves highest-value-next-action ordering", () => {
  const result = createR59OperatorWorkQueueUiImplementationScopeContract(readyInput);

  assert.deepEqual(
    result.highestValueNextActionOrdering.map((item) => item.rank),
    [1, 2, 3, 4, 5, 6, 7],
  );
  assert.equal(result.highestValueNextActionOrdering[0]?.concept, "resolve_governance_stops");
  assert.equal(result.highestValueNextActionOrdering[1]?.concept, "review_near_close_recovery");
  assert.equal(result.highestValueNextActionOrdering[2]?.concept, "review_stuck_deal_recovery");
  assert.match(result.highestValueNextActionOrdering[4]?.label ?? "", /Buyer review recommended/i);
  assert.match(result.highestValueNextActionOrdering[6]?.blockedExecutionBoundary ?? "", /No task assignment/i);
  assertSafety(result);
});

test("R59C defines safe wording, accessibility, and no-action boundaries", () => {
  const result = createR59OperatorWorkQueueUiImplementationScopeContract(readyInput);
  const wording = result.safeManualGuidanceWording.join(" ");
  const accessibility = result.accessibilityRequirements.join(" ");
  const boundaries = result.noActionExecutionBoundaries.join(" ");

  assert.match(wording, /Manual review recommended/i);
  assert.match(wording, /Daily priority labels are advisory only/i);
  assert.match(wording, /must not send, assign, recover, persist, poll/i);
  assert.match(accessibility, /semantic heading/i);
  assert.match(accessibility, /readable text label/i);
  assert.match(accessibility, /color alone/i);
  assert.match(accessibility, /screen-reader-friendly summaries/i);
  assert.match(boundaries, /No buttons, links, toggles, menus, forms, or controls/i);
  assert.match(boundaries, /No routes, new fetches, server actions/i);
  assert.match(boundaries, /No hidden execution affordances/i);
  assertSafety(result);
});

test("R59C blocks forbidden controls and dangerous language", () => {
  const result = createR59OperatorWorkQueueUiImplementationScopeContract(readyInput);

  assert.ok(result.blockedForbiddenUiControls.includes("send now"));
  assert.ok(result.blockedForbiddenUiControls.includes("auto assign"));
  assert.ok(result.blockedForbiddenUiControls.includes("auto follow-up"));
  assert.ok(result.blockedForbiddenUiControls.includes("execute recovery"));
  assert.ok(result.blockedForbiddenUiControls.includes("provider activation"));
  assert.ok(result.blockedForbiddenUiControls.includes("queue execution"));
  assert.ok(result.blockedForbiddenUiControls.includes("autonomous outreach"));
  assert.ok(result.blockedForbiddenUiControls.includes("auto disposition"));
  assert.ok(result.blockedForbiddenUiControls.includes("auto close"));
  assert.ok(result.dangerousLanguagePatterns.includes("run queue"));
  assert.ok(result.dangerousLanguagePatterns.includes("dispatch work"));
  assertSafety(result);
});

test("R59C rejects implementation, runtime, provider, persistence, and automation requests", () => {
  const result = createR59OperatorWorkQueueUiImplementationScopeContract({
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

  assert.equal(result.scopeStatus, "implementation_scope_blocked");
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
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R59C rejects unsafe flags while preserving safe output flags", () => {
  const result = createR59OperatorWorkQueueUiImplementationScopeContract({
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

  assert.equal(result.scopeStatus, "implementation_scope_blocked");
  assert.ok(result.warningCodes.includes("read_only_required"));
  assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
  assert.ok(result.warningCodes.includes("sent_must_be_false"));
  assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
  assert.ok(result.warningCodes.includes("polling_not_allowed"));
  assert.ok(result.warningCodes.includes("runtime_activation_not_allowed"));
  assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
  assert.ok(result.warningCodes.includes("ui_implementation_not_allowed_now"));
  assertSafety(result);
});

test("R59C summary is bounded and points to R59D", () => {
  const result = createR59OperatorWorkQueueUiImplementationScopeContract({
    ...readyInput,
    extraScopeNotes: ["R59C note".repeat(100)],
  });
  const summary = summarizeR59OperatorWorkQueueUiImplementationScopeContract(result);

  assert.equal(result.nextSuggestedPhase, "R59D - Operator Work Queue Intelligence Read-Only UI Implementation");
  assert.ok(summary.length <= 903);
  assert.match(summary, /Required safety copy/i);
  assert.match(summary, /does not authorize UI implementation/i);
  assertSafety(result);
});
