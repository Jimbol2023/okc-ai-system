import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR60AcquisitionDailyCallPriorityUiImplementationScopeInvariants,
  createR60AcquisitionDailyCallPriorityReadonlyUiImplementationScopeContract,
  summarizeR60AcquisitionDailyCallPriorityUiImplementationScope,
  type R60UiImplementationScopeInput,
  type R60UiImplementationScopeResult,
} from "./r60-acquisition-daily-call-priority-readonly-ui-implementation-scope-contract";

const readyInput: R60UiImplementationScopeInput = {
  r60bUiScopeReviewed: true,
  futureSurfacesReviewed: true,
  readOnlyDataReviewed: true,
  displaySectionsReviewed: true,
  priorityOrderingReviewed: true,
  safeCopyReviewed: true,
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

function assertSafety(result: R60UiImplementationScopeResult) {
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
  assert.equal(assertR60AcquisitionDailyCallPriorityUiImplementationScopeInvariants(result).passed, true);
}

test("R60C defaults to operator review with hard-closed safety flags", () => {
  const result = createR60AcquisitionDailyCallPriorityReadonlyUiImplementationScopeContract();

  assert.equal(result.phase, "R60C");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r60c_readonly_ui_implementation_scope_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r60b_ui_scope_review_required"));
  assertSafety(result);
});

test("R60C defines allowed future surface without allowing implementation now", () => {
  const result = createR60AcquisitionDailyCallPriorityReadonlyUiImplementationScopeContract(readyInput);

  assert.equal(result.scopeStatus, "read_only_ui_implementation_scope_ready");
  assert.equal(result.allowedFutureUiSurface.surface, "existing_dashboard");
  assert.equal(result.allowedFutureUiSurface.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
  assert.equal(
    result.allowedFutureUiSurface.futureComponentAllowed,
    "components/dashboard/acquisition-daily-call-priority-summary.tsx",
  );
  assert.equal(result.allowedFutureUiSurface.routeChangesAllowed, false);
  assert.equal(result.allowedFutureUiSurface.redesignAllowed, false);
  assert.equal(result.allowedFutureUiSurface.implementationAllowedNow, false);
  assertSafety(result);
});

test("R60C defines forbidden UI surfaces and controls", () => {
  const result = createR60AcquisitionDailyCallPriorityReadonlyUiImplementationScopeContract(readyInput);

  assert.ok(result.forbiddenUiSurfaces.includes("new_route"));
  assert.ok(result.forbiddenUiSurfaces.includes("twilio_console"));
  assert.ok(result.forbiddenUiSurfaces.includes("dialer_panel"));
  assert.ok(result.forbiddenUiSurfaces.includes("campaign_builder"));
  assert.ok(result.forbiddenUiSurfaces.includes("automation_agent_console"));
  assert.ok(result.forbiddenExecutionControls.includes("call now"));
  assert.ok(result.forbiddenExecutionControls.includes("auto dial"));
  assert.ok(result.forbiddenExecutionControls.includes("send SMS"));
  assert.ok(result.forbiddenExecutionControls.includes("activate campaign"));
  assert.ok(result.forbiddenExecutionControls.includes("provider activation"));
  assert.ok(result.forbiddenExecutionControls.includes("hidden execution affordances"));
  assertSafety(result);
});

test("R60C defines allowed read-only data concepts", () => {
  const result = createR60AcquisitionDailyCallPriorityReadonlyUiImplementationScopeContract(readyInput);
  const concepts = result.allowedReadOnlyDataConcepts.map((item) => item.concept);
  const boundaries = result.allowedReadOnlyDataConcepts.map((item) => item.displayBoundary).join(" ");

  assert.ok(concepts.includes("lead_id"));
  assert.ok(concepts.includes("lead_source"));
  assert.ok(concepts.includes("approval_status"));
  assert.ok(concepts.includes("do_not_contact_or_opt_out_state"));
  assert.ok(concepts.includes("seller_response_context"));
  assert.ok(concepts.includes("manual_follow_up_due_state"));
  assert.ok(concepts.includes("missing_acquisition_data_signal"));
  assert.ok(concepts.includes("existing_manual_revenue_metric"));
  assert.match(boundaries, /approval never grants contact permission/i);
  assert.match(boundaries, /no scheduling, sending, dialing, or persistence/i);
  assertSafety(result);
});

test("R60C defines priority ordering and governance-stop-first rules", () => {
  const result = createR60AcquisitionDailyCallPriorityReadonlyUiImplementationScopeContract(readyInput);

  assert.deepEqual(
    result.priorityOrderingDisplayRules.map((rule) => rule.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  );
  assert.equal(result.priorityOrderingDisplayRules[0]?.section, "governance_stop_signals");
  assert.equal(result.priorityOrderingDisplayRules[1]?.section, "highest_priority_seller_review");
  assert.equal(result.priorityOrderingDisplayRules[2]?.section, "daily_seller_call_priorities");
  assert.match(result.governanceStopFirstRules.join(" "), /must render before all seller call priority labels/i);
  assert.match(result.governanceStopFirstRules.join(" "), /may override a governance stop/i);
  assertSafety(result);
});

test("R60C defines safe copy and no-execution boundaries", () => {
  const result = createR60AcquisitionDailyCallPriorityReadonlyUiImplementationScopeContract(readyInput);
  const safeCopy = result.safeCopyRules.join(" ");
  const boundaries = result.noExecutionBoundaries.join(" ");

  assert.match(safeCopy, /Manual call review recommended/i);
  assert.match(safeCopy, /Call priority label is advisory only/i);
  assert.match(safeCopy, /must not call, dial, send, persist, poll/i);
  assert.match(boundaries, /No calls, dialing, SMS, email, campaigns/i);
  assert.match(boundaries, /No buttons, links, toggles, menus, forms/i);
  assert.match(boundaries, /No routes, new fetches, persistence, polling/i);
  assertSafety(result);
});

test("R60C defines accessibility rules", () => {
  const result = createR60AcquisitionDailyCallPriorityReadonlyUiImplementationScopeContract(readyInput);
  const accessibility = result.accessibilityRules.join(" ");

  assert.match(accessibility, /semantic section and stable heading/i);
  assert.match(accessibility, /semantic headings for each seller priority section/i);
  assert.match(accessibility, /readable labels/i);
  assert.match(accessibility, /text-based and never depend on color alone/i);
  assert.match(accessibility, /Do not move focus, require motion, auto-refresh, poll/i);
  assert.match(accessibility, /screen-reader-friendly summaries/i);
  assertSafety(result);
});

test("R60C rejects UI, route, provider, call, dialer, campaign, persistence, and automation requests", () => {
  const result = createR60AcquisitionDailyCallPriorityReadonlyUiImplementationScopeContract({
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

  assert.equal(result.scopeStatus, "implementation_scope_blocked");
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
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R60C rejects unsafe flags while preserving safe output flags", () => {
  const result = createR60AcquisitionDailyCallPriorityReadonlyUiImplementationScopeContract({
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

test("R60C summary is bounded and points to the future implementation phase", () => {
  const result = createR60AcquisitionDailyCallPriorityReadonlyUiImplementationScopeContract({
    ...readyInput,
    extraScopeNotes: ["R60C note".repeat(100)],
  });
  const summary = summarizeR60AcquisitionDailyCallPriorityUiImplementationScope(result);

  assert.equal(result.nextSuggestedPhase, "R60D - Acquisition Daily Call Priority Intelligence Read-Only UI Implementation");
  assert.ok(summary.length <= 903);
  assert.match(summary, /cannot authorize UI implementation/i);
  assert.match(summary, /calls, dialing, SMS, email, campaigns/i);
  assertSafety(result);
});
