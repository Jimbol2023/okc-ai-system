import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR63OperatorWorkQueueScopeInvariants,
  createR63OperatorWorkQueueIntelligenceScopeContract,
  summarizeR63OperatorWorkQueueScope,
  type R63ScopeInput,
  type R63ScopeResult,
} from "./r63-operator-work-queue-intelligence-scope-contract";

const readyInput: R63ScopeInput = {
  r62fLockdownReviewed: true,
  workloadCategoriesReviewed: true,
  staleWorkflowReviewed: true,
  bottleneckReviewed: true,
  reviewPriorityReviewed: true,
  revenuePriorityReviewed: true,
  queuePressureReviewed: true,
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

function assertSafety(result: R63ScopeResult) {
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
  assert.equal(assertR63OperatorWorkQueueScopeInvariants(result).passed, true);
}

test("R63A defaults to operator review with hard-closed safety flags", () => {
  const result = createR63OperatorWorkQueueIntelligenceScopeContract();
  assert.equal(result.phase, "R63A");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r63a_scope_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r62f_lockdown_review_required"));
  assertSafety(result);
});

test("R63A defines work queue categories and ranking with governance first", () => {
  const result = createR63OperatorWorkQueueIntelligenceScopeContract(readyInput);
  assert.equal(result.scopeStatus, "operator_work_queue_scope_ready");
  assert.ok(result.workloadCategories.includes("governance_stop_visibility"));
  assert.ok(result.workloadCategories.includes("highest_priority_operator_review"));
  assert.ok(result.workloadCategories.includes("queue_pressure_visibility"));
  assert.ok(result.workloadCategories.includes("revenue_risk_visibility"));
  assert.equal(result.rankingConcepts[0]?.concept, "governance_stop_visibility");
  assert.deepEqual(result.rankingConcepts.map((item) => item.rank), Array.from({ length: 24 }, (_, index) => index + 1));
  assert.match(result.rankingConcepts[0]?.revenueReason ?? "", /must outrank urgency/i);
  assertSafety(result);
});

test("R63A defines stale workflow, bottleneck, review, revenue, and queue pressure concepts", () => {
  const result = createR63OperatorWorkQueueIntelligenceScopeContract(readyInput);
  assert.match(result.staleWorkflowConcepts.join(" "), /workflow aging visibility/i);
  assert.match(result.bottleneckConcepts.join(" "), /cannot assign work, mutate workflow state/i);
  assert.match(result.reviewPriorityConcepts.join(" "), /highest-priority operator review/i);
  assert.match(result.revenuePriorityConcepts.join(" "), /priority means manual review/i);
  assert.match(result.queuePressureConcepts.join(" "), /not an execution queue/i);
  assertSafety(result);
});

test("R63A preserves governance, accessibility, safe wording, and forbidden semantics", () => {
  const result = createR63OperatorWorkQueueIntelligenceScopeContract(readyInput);
  assert.match(result.governanceBoundaries.join(" "), /cannot authorize UI implementation/i);
  assert.match(result.governanceBoundaries.join(" "), /Operational priority never means execute/i);
  assert.ok(result.safeOperatorGuidanceWording.includes("Operational priority label is advisory only."));
  assert.ok(result.forbiddenWorkflowSemantics.includes("auto assign tasks"));
  assert.ok(result.forbiddenWorkflowSemantics.includes("AI manages workflow automatically"));
  assert.match(result.accessibilityRequirements.join(" "), /semantic headings/i);
  assertSafety(result);
});

test("R63A classifies pre-implementation audit findings", () => {
  const result = createR63OperatorWorkQueueIntelligenceScopeContract(readyInput);
  assert.ok(result.preImplementationAuditFindings.some((item) => item.classification === "Required before implementation"));
  assert.ok(result.preImplementationAuditFindings.some((item) => item.classification === "Forbidden because it violates governance"));
  assertSafety(result);
});

test("R63A rejects unsafe requests and flags while preserving safe output", () => {
  const result = createR63OperatorWorkQueueIntelligenceScopeContract({
    ...readyInput,
    uiImplementationRequested: true,
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
  assert.equal(result.scopeStatus, "operator_work_queue_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_workflow_rejected"));
  assert.ok(result.warningCodes.includes("read_only_required"));
  assertSafety(result);
});

test("R63A summary is bounded and points to R63B", () => {
  const result = createR63OperatorWorkQueueIntelligenceScopeContract({
    ...readyInput,
    extraScopeNotes: ["R63A note".repeat(100)],
  });
  const summary = summarizeR63OperatorWorkQueueScope(result);
  assert.equal(result.nextSuggestedPhase, "R63B - Operator Work Queue Intelligence UI Scope Audit");
  assert.ok(summary.length <= 853);
  assert.match(summary, /cannot authorize UI implementation/i);
  assertSafety(result);
});
