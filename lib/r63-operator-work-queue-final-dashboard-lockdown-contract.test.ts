import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR63OperatorWorkQueueFinalLockdownInvariants,
  createR63OperatorWorkQueueFinalDashboardLockdownContract,
  type R63FinalLockdownInput,
  type R63FinalLockdownResult,
} from "./r63-operator-work-queue-final-dashboard-lockdown-contract";

const readyInput: R63FinalLockdownInput = {
  r63aScopeReviewed: true,
  r63bUiScopeReviewed: true,
  r63cImplementationScopeReviewed: true,
  r63dUiImplementationReviewed: true,
  r63eSafetyAccessibilityReviewed: true,
  dashboardSafetyReviewed: true,
  readOnlyReviewed: true,
  governanceStopDominanceReviewed: true,
  workloadPriorityReviewed: true,
  staleWorkflowReviewed: true,
  bottleneckReviewed: true,
  queuePressureReviewed: true,
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

function assertSafety(result: R63FinalLockdownResult) {
  assert.equal(result.readOnly, true);
  assert.equal(result.providerCalled, false);
  assert.equal(result.sent, false);
  assert.equal(result.pollingAllowed, false);
  assert.equal(result.uiImplementationAllowedNow, true);
  assert.equal(assertR63OperatorWorkQueueFinalLockdownInvariants(result).passed, true);
}

test("R63F defaults to operator review", () => {
  const result = createR63OperatorWorkQueueFinalDashboardLockdownContract();
  assert.equal(result.phase, "R63F");
  assert.equal(result.lockdownStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r63a_scope_review_required"));
  assertSafety(result);
});

test("R63F locks the full R63 stack", () => {
  const result = createR63OperatorWorkQueueFinalDashboardLockdownContract(readyInput);
  assert.equal(result.lockdownStatus, "operator_work_queue_dashboard_locked");
  assert.match(result.r63StackReviewFindings.join(" "), /R63D implemented/i);
  assert.match(result.readOnlyEnforcementFindings.join(" "), /adds no fetch/i);
  assert.match(result.governanceStopDominanceFindings.join(" "), /must be resolved first/i);
  assert.match(result.workloadPriorityFindings.join(" "), /not an execution queue/i);
  assert.match(result.staleWorkflowFindings.join(" "), /does not launch campaigns/i);
  assert.match(result.accessibilityPreservationFindings.join(" "), /aria-labelledby and aria-describedby/i);
  assertSafety(result);
});

test("R63F blocks forbidden requests and unsafe flags", () => {
  const result = createR63OperatorWorkQueueFinalDashboardLockdownContract({
    ...readyInput,
    newUiFeatureRequested: true,
    providerActivationRequested: true,
    outreachExecutionRequested: true,
    campaignActivationRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    executionControlRequested: true,
    autonomousWorkflowRequested: true,
    readOnly: false,
    providerCalled: true,
    sent: true,
    uiImplementationAllowedNow: false,
  });
  assert.equal(result.lockdownStatus, "final_lockdown_blocked");
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_workflow_rejected"));
  assert.ok(result.warningCodes.includes("read_only_required"));
  assertSafety(result);
});

test("R63F defines final state and next phase", () => {
  const result = createR63OperatorWorkQueueFinalDashboardLockdownContract(readyInput);
  assert.ok(result.blockedPatterns.includes("auto assign tasks"));
  assert.match(result.forbiddenBoundaries.join(" "), /No autonomous workflow routing/i);
  assert.equal(result.nextSuggestedPhase, "R64A - Driving-for-Dollars Intelligence Scope Contract");
  assertSafety(result);
});
