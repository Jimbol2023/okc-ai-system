import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR665OperatorUxStabilizationScopeInvariants,
  createR665OperatorUxStabilizationScopeContract,
  summarizeR665OperatorUxStabilizationScope,
  type R665ScopeInput,
  type R665ScopeResult,
} from "./r665-operator-ux-stabilization-scope-contract";

const readyInput: R665ScopeInput = {
  r66fLockdownReviewed: true,
  uxConceptsReviewed: true,
  dashboardReadabilityReviewed: true,
  overflowReviewed: true,
  badgeWrappingReviewed: true,
  cardSpacingReviewed: true,
  typographyReviewed: true,
  accessibilityReviewed: true,
  governanceBoundaryReviewed: true,
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
  approvalGrantsExecution: false,
};

function assertSafety(result: R665ScopeResult) {
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
  assert.equal(result.uxImplementationAllowedNow, false);
  assert.equal(assertR665OperatorUxStabilizationScopeInvariants(result).passed, true);
}

test("R66.5A defaults to operator review with no implementation authorization", () => {
  const result = createR665OperatorUxStabilizationScopeContract();
  assert.equal(result.phase, "R66.5A");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r665a_scope_contract_only"));
  assert.ok(result.warningCodes.includes("r66f_lockdown_review_required"));
  assertSafety(result);
});

test("R66.5A defines UX stabilization concepts and readability rules", () => {
  const result = createR665OperatorUxStabilizationScopeContract(readyInput);
  assert.equal(result.scopeStatus, "ux_stabilization_scope_ready");
  assert.ok(result.allowedUxConcepts.includes("text_overflow_containment"));
  assert.ok(result.allowedUxConcepts.includes("badge_wrapping"));
  assert.match(result.overflowContainmentRules.join(" "), /Long labels/i);
  assert.match(result.cardSpacingRules.join(" "), /consistent padding/i);
  assert.match(result.typographyHierarchyRules.join(" "), /clear hierarchy/i);
  assertSafety(result);
});

test("R66.5A preserves governance and accessibility boundaries", () => {
  const result = createR665OperatorUxStabilizationScopeContract(readyInput);
  assert.match(result.governanceBoundaries.join(" "), /cannot change execution boundaries/i);
  assert.match(result.accessibilityRequirements.join(" "), /Semantic headings/i);
  assert.ok(result.forbiddenSemantics.includes("weaken safety copy"));
  assert.ok(result.forbiddenSemantics.includes("governance meaning change"));
  assertSafety(result);
});

test("R66.5A rejects redesign, logic, provider, persistence, polling, runtime, automation, and execution requests", () => {
  const result = createR665OperatorUxStabilizationScopeContract({
    ...readyInput,
    implementationRequested: true,
    redesignRequested: true,
    logicChangeRequested: true,
    routeChangeRequested: true,
    providerActivationRequested: true,
    prismaChangeRequested: true,
    persistenceRequested: true,
    pollingRequested: true,
    runtimeActivationRequested: true,
    executionControlRequested: true,
    campaignRequested: true,
    automationRequested: true,
    hiddenButtonRequested: true,
    governanceMeaningChangeRequested: true,
    safetyCopyWeakeningRequested: true,
    providerCalled: true,
    sent: true,
    approvalGrantsExecution: true,
  });
  assert.equal(result.scopeStatus, "ux_stabilization_scope_blocked");
  assert.ok(result.warningCodes.includes("implementation_rejected"));
  assert.ok(result.warningCodes.includes("logic_change_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("execution_control_rejected"));
  assertSafety(result);
});

test("R66.5A summary points to R66.5B", () => {
  const result = createR665OperatorUxStabilizationScopeContract(readyInput);
  const summary = summarizeR665OperatorUxStabilizationScope(result);
  assert.equal(result.nextSuggestedPhase, "R66.5B - Dashboard Overflow / Density Audit");
  assert.match(summary, /cannot authorize implementation/i);
  assertSafety(result);
});
