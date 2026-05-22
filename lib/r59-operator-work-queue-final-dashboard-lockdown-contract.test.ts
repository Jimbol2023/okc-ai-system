import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR59OperatorWorkQueueFinalLockdownInvariants,
  createR59OperatorWorkQueueFinalDashboardLockdownContract,
  summarizeR59OperatorWorkQueueFinalLockdown,
  type R59FinalLockdownInput,
  type R59FinalLockdownResult,
} from "./r59-operator-work-queue-final-dashboard-lockdown-contract";

const readyInput: R59FinalLockdownInput = {
  r59aScopeReviewed: true,
  r59bUiScopeReviewed: true,
  r59cImplementationScopeReviewed: true,
  r59dUiImplementationReviewed: true,
  r59eSafetyAccessibilityReviewed: true,
  dashboardSafetyReviewed: true,
  revenuePriorityReviewed: true,
  highestValueNextActionsReviewed: true,
  nextRevenueIntelligenceReviewed: true,
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

function assertSafety(result: R59FinalLockdownResult) {
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
  assert.equal(assertR59OperatorWorkQueueFinalLockdownInvariants(result).passed, true);
}

test("R59F defaults to operator review with hard-closed safety flags", () => {
  const result = createR59OperatorWorkQueueFinalDashboardLockdownContract();

  assert.equal(result.phase, "R59F");
  assert.equal(result.lockdownStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r59f_final_dashboard_lockdown_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r59a_scope_review_required"));
  assert.ok(result.warningCodes.includes("r59e_safety_accessibility_review_required"));
  assertSafety(result);
});

test("R59F locks the full R59 stack as complete when reviews are present", () => {
  const result = createR59OperatorWorkQueueFinalDashboardLockdownContract(readyInput);

  assert.equal(result.lockdownStatus, "operator_work_queue_dashboard_locked");
  assert.equal(result.operatorReviewRequired, false);
  assert.equal(result.r59StackReviewFindings.length, 5);
  assert.match(result.r59StackReviewFindings.join(" "), /R59A scoped/i);
  assert.match(result.r59StackReviewFindings.join(" "), /R59D implemented/i);
  assert.match(result.r59StackReviewFindings.join(" "), /R59E reviewed/i);
  assertSafety(result);
});

test("R59F confirms dashboard safety and exact safety copy", () => {
  const result = createR59OperatorWorkQueueFinalDashboardLockdownContract(readyInput);

  assert.equal(
    result.requiredSafetyCopy,
    "Read-only operator work queue guidance. No provider called, no message sent, no runtime execution.",
  );
  assert.match(result.dashboardSafetyFindings.join(" "), /read-only, advisory-only, and manual-first/i);
  assert.match(result.dashboardSafetyFindings.join(" "), /existing dashboard-loaded StoredLead/i);
  assert.match(result.dashboardSafetyFindings.join(" "), /no fetch, localStorage, sessionStorage, polling/i);
  assert.match(result.dashboardSafetyFindings.join(" "), /no buttons, click handlers, forms, links/i);
  assertSafety(result);
});

test("R59F preserves daily revenue-priority ordering", () => {
  const result = createR59OperatorWorkQueueFinalDashboardLockdownContract(readyInput);
  const findings = result.revenuePriorityFindings.join(" ");

  assert.match(findings, /governance stop signals, highest-value next actions, daily revenue priorities/i);
  assert.match(findings, /near-close recovery items, stuck-deal recovery items/i);
  assert.match(findings, /seller follow-up priorities, buyer disposition priorities/i);
  assert.match(findings, /missing revenue data items, workflow bottlenecks, manual review queue/i);
  assert.match(findings, /summary, and safe guidance/i);
  assertSafety(result);
});

test("R59F preserves highest-value-next-action ordering", () => {
  const result = createR59OperatorWorkQueueFinalDashboardLockdownContract(readyInput);
  const findings = result.highestValueNextActionFindings.join(" ");

  assert.match(findings, /governance stop review, near-close recovery review, stuck-deal recovery review/i);
  assert.match(findings, /seller follow-up review, buyer disposition review/i);
  assert.match(findings, /missing revenue data review, and workflow bottleneck review/i);
  assert.match(findings, /text label for manual operator attention only/i);
  assertSafety(result);
});

test("R59F preserves accessibility expectations", () => {
  const result = createR59OperatorWorkQueueFinalDashboardLockdownContract(readyInput);
  const findings = result.accessibilityFindings.join(" ");

  assert.match(findings, /semantic section with aria-labelledby/i);
  assert.match(findings, /heading id matches/i);
  assert.match(findings, /readable text labels/i);
  assert.match(findings, /does not depend on color alone/i);
  assert.match(findings, /No focus movement, motion dependency, auto-refresh, polling/i);
  assertSafety(result);
});

test("R59F keeps governance boundaries hard-closed", () => {
  const result = createR59OperatorWorkQueueFinalDashboardLockdownContract(readyInput);
  const findings = result.governanceBoundaryFindings.join(" ");
  const forbidden = result.forbiddenBoundaries.join(" ");

  assert.match(findings, /No routes, providers, Twilio, automation-agent, Prisma/i);
  assert.match(findings, /No approval wording grants permission/i);
  assert.match(findings, /No autonomous negotiation, autonomous outreach/i);
  assert.match(forbidden, /No UI implementation in R59F/i);
  assert.match(forbidden, /No hidden execution affordances/i);
  assert.match(forbidden, /No property facts may be invented/i);
  assertSafety(result);
});

test("R59F ranks next candidates and selects acquisition daily call priority", () => {
  const result = createR59OperatorWorkQueueFinalDashboardLockdownContract(readyInput);

  assert.equal(result.selectedNextPhase, "acquisition_daily_call_priority_intelligence");
  assert.equal(result.nextSuggestedPhase, "R60A - Acquisition Daily Call Priority Intelligence Scope Contract");
  assert.equal(result.candidateRankings.length, 6);
  assert.deepEqual(
    result.candidateRankings.map((candidate) => candidate.rank),
    [1, 2, 3, 4, 5, 6],
  );
  assert.equal(result.candidateRankings[0]?.phase, "acquisition_daily_call_priority_intelligence");
  assert.match(result.selectedNextPhaseReason, /ranking manual seller call attention/i);
  assert.match(result.nextRevenueIntelligenceFindings.join(" "), /highest-ROI next candidate/i);
  assertSafety(result);
});

test("R59F blocks dangerous UI, provider, persistence, runtime, and autonomous requests", () => {
  const result = createR59OperatorWorkQueueFinalDashboardLockdownContract({
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

  assert.equal(result.lockdownStatus, "final_lockdown_blocked");
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
  assert.ok(result.rejectionReasons.includes("runtime_activation_rejected"));
  assertSafety(result);
});

test("R59F blocks unsafe invariant inputs while returning safe output flags", () => {
  const result = createR59OperatorWorkQueueFinalDashboardLockdownContract({
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
  assert.ok(result.warningCodes.includes("ui_implementation_not_allowed_now"));
  assertSafety(result);
});

test("R59F exposes blocked patterns and invariant assertions", () => {
  const result = createR59OperatorWorkQueueFinalDashboardLockdownContract(readyInput);

  assert.ok(result.blockedPatterns.includes("send now"));
  assert.ok(result.blockedPatterns.includes("auto assign"));
  assert.ok(result.blockedPatterns.includes("provider activation"));
  assert.ok(result.blockedPatterns.includes("queue execution"));
  assert.ok(result.blockedPatterns.includes("autonomous outreach"));
  assert.ok(result.blockedPatterns.includes("hidden execution affordances"));
  assert.match(result.invariantAssertions.join(" "), /Required safety copy must remain exact/i);
  assert.match(result.invariantAssertions.join(" "), /Highest-value next-action ordering must remain manual-first/i);
  assertSafety(result);
});

test("R59F summary remains bounded and planning-only", () => {
  const result = createR59OperatorWorkQueueFinalDashboardLockdownContract({
    ...readyInput,
    extraLockdownNotes: ["R59F note".repeat(100)],
  });
  const summary = summarizeR59OperatorWorkQueueFinalLockdown(result);

  assert.ok(summary.length <= 903);
  assert.match(summary, /planning-only/i);
  assert.match(summary, /cannot authorize UI, redesign, routes, providers/i);
  assertSafety(result);
});
