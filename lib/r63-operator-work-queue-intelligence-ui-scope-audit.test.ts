import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR63OperatorWorkQueueUiScopeInvariants,
  createR63OperatorWorkQueueUiScopeAudit,
  type R63UiScopeInput,
  type R63UiScopeResult,
} from "./r63-operator-work-queue-intelligence-ui-scope-audit";

const readyInput: R63UiScopeInput = {
  r63aScopeReviewed: true,
  uiSurfaceReviewed: true,
  workloadVisibilityReviewed: true,
  queuePressureReviewed: true,
  staleWorkflowReviewed: true,
  bottleneckVisibilityReviewed: true,
  reviewPriorityVisibilityReviewed: true,
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

function assertSafety(result: R63UiScopeResult) {
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
  assert.equal(assertR63OperatorWorkQueueUiScopeInvariants(result).passed, true);
}

test("R63B defaults to operator review", () => {
  const result = createR63OperatorWorkQueueUiScopeAudit();
  assert.equal(result.phase, "R63B");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r63b_ui_scope_audit_only"));
  assert.ok(result.warningCodes.includes("r63a_scope_review_required"));
  assertSafety(result);
});

test("R63B defines future read-only sections and visibility boundaries", () => {
  const result = createR63OperatorWorkQueueUiScopeAudit(readyInput);
  assert.equal(result.scopeStatus, "ui_scope_ready_for_later_implementation");
  assert.equal(result.allowedFutureUiSections[0], "governance_stop_visibility");
  assert.ok(result.allowedFutureUiSections.includes("queue_pressure_visibility"));
  assert.match(result.workloadVisibility.join(" "), /cannot assign tasks/i);
  assert.match(result.queuePressureVisibility.join(" "), /not an execution queue/i);
  assert.match(result.staleWorkflowVisibility.join(" "), /do not launch campaigns/i);
  assert.match(result.bottleneckVisibility.join(" "), /cannot mutate workflow state/i);
  assertSafety(result);
});

test("R63B preserves safe wording, governance, accessibility, and forbidden controls", () => {
  const result = createR63OperatorWorkQueueUiScopeAudit(readyInput);
  assert.ok(result.safeWording.includes("Operational priority label is advisory only."));
  assert.ok(result.forbiddenControls.includes("auto assign tasks"));
  assert.ok(result.dangerousWordingPatterns.includes("AI manages workflow automatically"));
  assert.match(result.accessibilityExpectations.join(" "), /semantic headings/i);
  assert.match(result.governanceBoundaries.join(" "), /must render first/i);
  assertSafety(result);
});

test("R63B blocks unsafe implementation requests", () => {
  const result = createR63OperatorWorkQueueUiScopeAudit({
    ...readyInput,
    uiImplementationRequested: true,
    dashboardChangeRequested: true,
    providerActivationRequested: true,
    outreachExecutionRequested: true,
    campaignLaunchRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    executionControlRequested: true,
    autonomousWorkflowRequested: true,
    approvalGrantsExecution: true,
    readOnly: false,
    providerCalled: true,
    sent: true,
    uiImplementationAllowedNow: true,
  });
  assert.equal(result.scopeStatus, "ui_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("dashboard_change_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_workflow_rejected"));
  assert.ok(result.warningCodes.includes("read_only_required"));
  assertSafety(result);
});
