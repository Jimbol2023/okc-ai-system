import assert from "node:assert/strict";
import test from "node:test";

import { createR66ControlledExecutionRiskPermissionBoundaryAudit } from "./r66-controlled-execution-risk-permission-boundary-audit";

const completeInput = {
  r66aScopeReviewed: true,
  approvalPermissionReviewed: true,
  providerActivationReviewed: true,
  runtimeActivationReviewed: true,
  auditLogReviewed: true,
  failClosedReviewed: true,
  governanceReviewed: true,
  operatorReviewCompleted: true,
  unsafePermissionFound: false,
  approvalExecutionFound: false,
  providerActivationFound: false,
  runtimeActivationFound: false,
  pollingFound: false,
  persistenceFound: false,
  backgroundJobFound: false,
  executionQueueFound: false,
  campaignFound: false,
  outreachFound: false,
  providerCalled: false,
  sent: false,
  approvalGrantsExecution: false,
};

test("R66B completes risk and permission audit with execution blocked", () => {
  const result = createR66ControlledExecutionRiskPermissionBoundaryAudit(completeInput);
  assert.equal(result.auditStatus, "risk_permission_audit_complete");
  assert.match(result.approvalPermissionBoundaries.join(" "), /cannot send/i);
  assert.match(result.providerActivationBoundaries.join(" "), /remain blocked/i);
  assert.match(result.runtimeActivationBoundaries.join(" "), /background jobs/i);
  assert.equal(result.executionAllowedNow, false);
});

test("R66B blocks approval-to-execution, provider, runtime, polling, persistence, campaign, and outreach drift", () => {
  const result = createR66ControlledExecutionRiskPermissionBoundaryAudit({
    ...completeInput,
    approvalExecutionFound: true,
    providerActivationFound: true,
    runtimeActivationFound: true,
    pollingFound: true,
    persistenceFound: true,
    campaignFound: true,
    outreachFound: true,
    approvalGrantsExecution: true,
  });
  assert.equal(result.auditStatus, "risk_audit_blocked");
  assert.ok(result.warningCodes.includes("approval_execution_found"));
  assert.ok(result.warningCodes.includes("provider_activation_found"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_must_be_false"));
});
