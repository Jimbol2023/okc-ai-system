import assert from "node:assert/strict";
import test from "node:test";

import { createR66ControlledExecutionFinalLockdownContract } from "./r66-controlled-execution-final-lockdown-contract";

const completeInput = {
  r66eSafetyReviewCompleted: true,
  dashboardSurfaceReviewed: true,
  noExecutionReviewed: true,
  noProviderReviewed: true,
  noRuntimeReviewed: true,
  noPollingReviewed: true,
  noCampaignReviewed: true,
  approvalSeparationReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
  executionFound: false,
  providerActivationFound: false,
  runtimeActivationFound: false,
  pollingFound: false,
  campaignFound: false,
  approvalExecutionFound: false,
  hiddenExecutionFound: false,
  providerCalled: false,
  sent: false,
  approvalGrantsExecution: false,
};

test("R66F completes final lockdown with no execution or provider activation", () => {
  const result = createR66ControlledExecutionFinalLockdownContract(completeInput);
  assert.equal(result.lockdownStatus, "final_lockdown_complete");
  assert.ok(result.lockedFiles.includes("components/dashboard/controlled-execution-readiness-summary.tsx"));
  assert.match(result.noExecutionLock.join(" "), /No send controls/i);
  assert.match(result.approvalSeparationLock.join(" "), /Approval does not equal execution/i);
  assert.equal(result.executionAllowedNow, false);
  assert.equal(result.providerActivationAllowed, false);
});

test("R66F blocks execution, provider, runtime, polling, campaign, and approval drift", () => {
  const result = createR66ControlledExecutionFinalLockdownContract({
    ...completeInput,
    executionFound: true,
    providerActivationFound: true,
    runtimeActivationFound: true,
    pollingFound: true,
    campaignFound: true,
    approvalExecutionFound: true,
    hiddenExecutionFound: true,
    sent: true,
  });
  assert.equal(result.lockdownStatus, "lockdown_blocked");
  assert.ok(result.warningCodes.includes("execution_found"));
  assert.ok(result.warningCodes.includes("approval_execution_found"));
  assert.ok(result.warningCodes.includes("sent_must_be_false"));
});
