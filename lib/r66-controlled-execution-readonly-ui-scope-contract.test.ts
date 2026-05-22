import assert from "node:assert/strict";
import test from "node:test";

import { createR66ControlledExecutionReadonlyUiScopeContract } from "./r66-controlled-execution-readonly-ui-scope-contract";

const readyInput = {
  r66bAuditReviewed: true,
  futureSurfaceReviewed: true,
  readOnlyDisplayReviewed: true,
  safeCopyReviewed: true,
  governanceBoundaryReviewed: true,
  accessibilityReviewed: true,
  dangerousPatternsReviewed: true,
  operatorReviewCompleted: true,
  providerCalled: false,
  sent: false,
  approvalGrantsExecution: false,
  uiImplementationAllowedNow: false,
};

test("R66C defines read-only future UI scope with no implementation authorization", () => {
  const result = createR66ControlledExecutionReadonlyUiScopeContract(readyInput);
  assert.equal(result.scopeStatus, "read_only_ui_scope_ready");
  assert.equal(result.allowedFutureUiSurface.futureComponentAllowed, "components/dashboard/controlled-execution-readiness-summary.tsx");
  assert.equal(result.allowedFutureUiSurface.implementationAllowedNow, false);
  assert.ok(result.forbiddenControls.includes("send controls"));
  assert.equal(result.executionAllowedNow, false);
});

test("R66C rejects execution and provider controls", () => {
  const result = createR66ControlledExecutionReadonlyUiScopeContract({
    ...readyInput,
    executionControlRequested: true,
    providerControlRequested: true,
    approvalToSendRequested: true,
    runtimeActivationRequested: true,
    pollingRequested: true,
    campaignControlRequested: true,
    executionQueueRequested: true,
    sent: true,
  });
  assert.equal(result.scopeStatus, "ui_scope_blocked");
  assert.ok(result.warningCodes.includes("execution_control_rejected"));
  assert.ok(result.warningCodes.includes("provider_control_rejected"));
  assert.ok(result.warningCodes.includes("sent_must_be_false"));
});
