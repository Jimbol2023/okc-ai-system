import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR63OperatorWorkQueueReadonlyUiScopeInvariants,
  createR63OperatorWorkQueueReadonlyUiImplementationScopeContract,
  type R63ReadonlyUiScopeInput,
  type R63ReadonlyUiScopeResult,
} from "./r63-operator-work-queue-readonly-ui-implementation-scope-contract";

const readyInput: R63ReadonlyUiScopeInput = {
  r63bUiScopeAuditReviewed: true,
  futureSurfaceReviewed: true,
  readOnlyDisplayReviewed: true,
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

function assertSafety(result: R63ReadonlyUiScopeResult) {
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
  assert.equal(assertR63OperatorWorkQueueReadonlyUiScopeInvariants(result).passed, true);
}

test("R63C defaults to operator review", () => {
  const result = createR63OperatorWorkQueueReadonlyUiImplementationScopeContract();
  assert.equal(result.phase, "R63C");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r63c_readonly_ui_implementation_scope_contract_only"));
  assert.ok(result.warningCodes.includes("r63b_ui_scope_audit_required"));
  assertSafety(result);
});

test("R63C scopes existing dashboard placement without implementation now", () => {
  const result = createR63OperatorWorkQueueReadonlyUiImplementationScopeContract(readyInput);
  assert.equal(result.scopeStatus, "read_only_ui_implementation_scope_ready");
  assert.equal(result.allowedFutureUiSurface.surface, "existing_dashboard");
  assert.equal(result.allowedFutureUiSurface.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
  assert.equal(result.allowedFutureUiSurface.futureComponentAllowed, "components/dashboard/operator-work-queue-intelligence-summary.tsx");
  assert.equal(result.allowedFutureUiSurface.implementationAllowedNow, false);
  assertSafety(result);
});

test("R63C defines read-only, no-execution, safe copy, and accessibility guarantees", () => {
  const result = createR63OperatorWorkQueueReadonlyUiImplementationScopeContract(readyInput);
  assert.match(result.allowedReadOnlyDisplayRules.join(" "), /Governance stop signals must render first/i);
  assert.match(result.allowedReadOnlyDisplayRules.join(" "), /cannot assign work/i);
  assert.match(result.safeCopyRules.join(" "), /Operational priority label is advisory only/i);
  assert.match(result.noExecutionGuarantees.join(" "), /No UI implementation/i);
  assert.match(result.accessibilityGuarantees.join(" "), /semantic section/i);
  assertSafety(result);
});

test("R63C blocks unsafe requests", () => {
  const result = createR63OperatorWorkQueueReadonlyUiImplementationScopeContract({
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
    sent: true,
    uiImplementationAllowedNow: true,
  });
  assert.equal(result.scopeStatus, "implementation_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_workflow_rejected"));
  assert.ok(result.warningCodes.includes("read_only_required"));
  assertSafety(result);
});
