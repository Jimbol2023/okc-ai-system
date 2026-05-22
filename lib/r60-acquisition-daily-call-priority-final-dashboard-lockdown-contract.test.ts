import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR60AcquisitionDailyCallPriorityFinalLockdownInvariants,
  createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract,
  summarizeR60AcquisitionDailyCallPriorityFinalDashboardLockdown,
  type R60FinalLockdownInput,
  type R60FinalLockdownResult,
} from "./r60-acquisition-daily-call-priority-final-dashboard-lockdown-contract";

const readyInput: R60FinalLockdownInput = {
  r60aScopeReviewed: true,
  r60bUiScopeReviewed: true,
  r60cImplementationScopeReviewed: true,
  r60dUiImplementationReviewed: true,
  r60eSafetyAccessibilityReviewed: true,
  dashboardSafetyReviewed: true,
  readOnlyReviewed: true,
  governanceStopDominanceReviewed: true,
  forbiddenControlsReviewed: true,
  executionBoundariesReviewed: true,
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
  uiImplementationAllowedNow: true,
};

function assertSafety(result: R60FinalLockdownResult) {
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
    uiImplementationAllowedNow: true,
  });
  assert.equal(assertR60AcquisitionDailyCallPriorityFinalLockdownInvariants(result).passed, true);
}

test("R60F defaults to operator review with UI allowed now and execution closed", () => {
  const result = createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract();

  assert.equal(result.phase, "R60F");
  assert.equal(result.lockdownStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r60f_final_dashboard_lockdown_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r60a_scope_review_required"));
  assertSafety(result);
});

test("R60F locks the full R60 stack when reviews are present", () => {
  const result = createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract(readyInput);

  assert.equal(result.lockdownStatus, "acquisition_daily_call_priority_dashboard_locked");
  assert.equal(result.operatorReviewRequired, false);
  assert.equal(result.r60StackReviewFindings.length, 5);
  assert.match(result.r60StackReviewFindings.join(" "), /R60A scoped/i);
  assert.match(result.r60StackReviewFindings.join(" "), /R60D implemented/i);
  assert.match(result.r60StackReviewFindings.join(" "), /R60E reviewed/i);
  assertSafety(result);
});

test("R60F enforces read-only dashboard behavior", () => {
  const result = createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract(readyInput);
  const findings = result.readOnlyEnforcementFindings.join(" ");

  assert.match(findings, /advisory labels, counts, and explanatory text only/i);
  assert.match(findings, /already-loaded dashboard leads/i);
  assert.match(findings, /adds no fetch, localStorage, sessionStorage, polling/i);
  assert.match(findings, /no buttons, links, forms, toggles, menus, handlers/i);
  assert.match(findings, /uiImplementationAllowedNow is true only because/i);
  assertSafety(result);
});

test("R60F preserves governance-stop dominance", () => {
  const result = createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract(readyInput);
  const findings = result.governanceStopDominanceFindings.join(" ");

  assert.match(findings, /Governance stop signals render first/i);
  assert.match(findings, /Do-not-contact, rejected approval, and human-review states/i);
  assert.match(findings, /No seller urgency, lead decay, momentum/i);
  assert.match(findings, /does not grant permission to call, text, email/i);
  assertSafety(result);
});

test("R60F forbids controls and hidden execution affordances", () => {
  const result = createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract(readyInput);
  const findings = result.forbiddenControlFindings.join(" ");

  assert.match(findings, /No call now, auto call, auto dial/i);
  assert.match(findings, /send SMS, send email, activate campaign/i);
  assert.match(findings, /provider activation, queue execution/i);
  assert.match(findings, /hidden execution affordance/i);
  assert.ok(result.blockedPatterns.includes("call now"));
  assert.ok(result.blockedPatterns.includes("provider activation"));
  assert.ok(result.blockedPatterns.includes("execute workflow"));
  assertSafety(result);
});

test("R60F preserves accessibility guarantees", () => {
  const result = createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract(readyInput);
  const findings = result.accessibilityPreservationFindings.join(" ");

  assert.match(findings, /semantic section with aria-labelledby/i);
  assert.match(findings, /heading id matches/i);
  assert.match(findings, /readable headings, counts, status text/i);
  assert.match(findings, /do not depend on color alone/i);
  assert.match(findings, /No motion dependency, focus movement, auto-refresh, polling/i);
  assertSafety(result);
});

test("R60F keeps execution boundaries hard-closed", () => {
  const result = createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract(readyInput);
  const findings = result.executionBoundaryFindings.join(" ");
  const forbidden = result.forbiddenBoundaries.join(" ");

  assert.match(findings, /No calls, dialing, SMS, email, campaigns/i);
  assert.match(findings, /No persistence, polling, runtime activation/i);
  assert.match(findings, /manual-first and advisory-only/i);
  assert.match(forbidden, /No UI redesign or new UI features in R60F/i);
  assert.match(forbidden, /No autonomous outreach, autonomous negotiation/i);
  assertSafety(result);
});

test("R60F defines future-safe UI limitations and next phase", () => {
  const result = createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract(readyInput);

  assert.match(result.futureSafeUiLimitations.join(" "), /existing dashboard placement/i);
  assert.match(result.futureSafeUiLimitations.join(" "), /communication systems may be professional/i);
  assert.equal(result.nextSuggestedPhase, "R61A - Buyer-Ready Disposition Priority Intelligence Scope Contract");
  assertSafety(result);
});

test("R60F rejects new UI, provider, call, dialer, campaign, persistence, and automation requests", () => {
  const result = createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract({
    ...readyInput,
    newUiFeatureRequested: true,
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

  assert.equal(result.lockdownStatus, "final_lockdown_blocked");
  assert.ok(result.warningCodes.includes("new_ui_feature_rejected"));
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

test("R60F rejects unsafe invariant inputs while returning safe output flags", () => {
  const result = createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract({
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
    uiImplementationAllowedNow: false,
  });

  assert.equal(result.lockdownStatus, "final_lockdown_blocked");
  assert.ok(result.warningCodes.includes("read_only_required"));
  assert.ok(result.warningCodes.includes("advisory_only_required"));
  assert.ok(result.warningCodes.includes("simulation_only_required"));
  assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
  assert.ok(result.warningCodes.includes("sent_must_be_false"));
  assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
  assert.ok(result.warningCodes.includes("polling_not_allowed"));
  assert.ok(result.warningCodes.includes("runtime_activation_not_allowed"));
  assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
  assert.ok(result.warningCodes.includes("ui_implementation_allowed_now_required"));
  assertSafety(result);
});

test("R60F summary remains bounded and lockdown-only", () => {
  const result = createR60AcquisitionDailyCallPriorityFinalDashboardLockdownContract({
    ...readyInput,
    extraLockdownNotes: ["R60F note".repeat(100)],
  });
  const summary = summarizeR60AcquisitionDailyCallPriorityFinalDashboardLockdown(result);

  assert.ok(summary.length <= 903);
  assert.match(summary, /completed read-only dashboard UI/i);
  assert.match(summary, /cannot authorize redesign, new UI features, routes/i);
  assertSafety(result);
});
