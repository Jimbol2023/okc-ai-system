import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR66ControlledExecutionScopeInvariants,
  createR66ControlledExecutionScopeContract,
  type R66ScopeInput,
  type R66ScopeResult,
} from "./r66-controlled-execution-scope-contract";

const readyInput: R66ScopeInput = {
  r65fLockdownReviewed: true,
  controlledExecutionConceptsReviewed: true,
  approvalSeparationReviewed: true,
  providerBoundaryReviewed: true,
  runtimeBoundaryReviewed: true,
  simulationFirstReviewed: true,
  failClosedReviewed: true,
  governanceBoundaryReviewed: true,
  futureUiReviewed: true,
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

function assertSafety(result: R66ScopeResult) {
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
  assert.equal(result.executionAllowedNow, false);
  assert.equal(result.campaignActivationAllowed, false);
  assert.equal(result.backgroundJobsAllowed, false);
  assert.equal(assertR66ControlledExecutionScopeInvariants(result).passed, true);
}

test("R66A defaults to operator review with execution blocked", () => {
  const result = createR66ControlledExecutionScopeContract();
  assert.equal(result.phase, "R66A");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r66a_scope_contract_only"));
  assertSafety(result);
});

test("R66A defines controlled execution concepts and governance dominance", () => {
  const result = createR66ControlledExecutionScopeContract(readyInput);
  assert.equal(result.scopeStatus, "controlled_execution_scope_ready");
  assert.ok(result.allowedConcepts.includes("approval_does_not_equal_execution"));
  assert.ok(result.allowedConcepts.includes("simulation_first_requirement"));
  assert.match(result.governanceBoundaries[0] ?? "", /must outrank revenue opportunity/i);
  assertSafety(result);
});

test("R66A blocks forbidden semantics and approval-to-execution drift", () => {
  const result = createR66ControlledExecutionScopeContract({
    ...readyInput,
    executionRequested: true,
    providerActivationRequested: true,
    twilioActivationRequested: true,
    emailSmsRequested: true,
    campaignLaunchRequested: true,
    runtimeActivationRequested: true,
    pollingRequested: true,
    backgroundJobRequested: true,
    executionQueueRequested: true,
    automationRequested: true,
    autonomousOutreachRequested: true,
    autonomousNegotiationRequested: true,
    autonomousRoutingRequested: true,
    approvalGrantsExecution: true,
    providerCalled: true,
    sent: true,
  });
  assert.equal(result.scopeStatus, "controlled_execution_scope_blocked");
  assert.ok(result.warningCodes.includes("execution_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assert.ok(result.forbiddenSemantics.includes("approval sends message"));
  assert.ok(result.approvalSeparationRules.join(" ").includes("not execution permission"));
  assertSafety(result);
});
