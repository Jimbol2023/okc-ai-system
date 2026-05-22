import assert from "node:assert/strict";
import test from "node:test";

import {
  createR64DrivingForDollarsFinalDashboardLockdownContract,
  type R64FinalLockdownInput,
  type R64FinalLockdownResult,
} from "./r64-driving-for-dollars-final-dashboard-lockdown-contract";

const completeInput: R64FinalLockdownInput = {
  r64eSafetyReviewCompleted: true,
  dashboardSurfaceReviewed: true,
  readOnlyBehaviorReviewed: true,
  governanceFirstReviewed: true,
  advisoryWordingReviewed: true,
  accessibilityReviewed: true,
  executionBoundaryReviewed: true,
  providerBoundaryReviewed: true,
  gpsMapBoundaryReviewed: true,
  scrapingSkipTracingBoundaryReviewed: true,
  persistencePollingRuntimeReviewed: true,
  operatorReviewCompleted: true,
  unsafeUiFound: false,
  executionCapabilityFound: false,
  providerPathFound: false,
  gpsMapActivationFound: false,
  scrapingSkipTracingFound: false,
  pollingFound: false,
  persistenceFound: false,
  runtimeActivationFound: false,
  approvalExecutionFound: false,
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
  uiImplementationAllowedNow: true,
};

function assertSafety(result: R64FinalLockdownResult) {
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
  assert.equal(result.uiImplementationAllowedNow, true);
}

test("R64F defaults to operator review when lockdown inputs are missing", () => {
  const result = createR64DrivingForDollarsFinalDashboardLockdownContract();
  assert.equal(result.phase, "R64F");
  assert.equal(result.lockdownStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("input_missing"));
  assertSafety(result);
});

test("R64F completes final dashboard lockdown with governance and accessibility locks", () => {
  const result = createR64DrivingForDollarsFinalDashboardLockdownContract(completeInput);
  assert.equal(result.lockdownStatus, "final_dashboard_lockdown_complete");
  assert.ok(result.lockedFiles.includes("components/dashboard/driving-for-dollars-intelligence-summary.tsx"));
  assert.match(result.readonlyBehaviorLock.join(" "), /read-only and advisory-only/i);
  assert.match(result.governanceFirstLock.join(" "), /must render first/i);
  assert.ok(result.advisoryWordingLock.includes("Property priority does not mean contact owner."));
  assert.match(result.accessibilityLock.join(" "), /aria-labelledby/i);
  assertSafety(result);
});

test("R64F blocks execution, provider, GPS, scraping, persistence, polling, runtime, and approval drift", () => {
  const result = createR64DrivingForDollarsFinalDashboardLockdownContract({
    ...completeInput,
    executionCapabilityFound: true,
    providerPathFound: true,
    gpsMapActivationFound: true,
    scrapingSkipTracingFound: true,
    pollingFound: true,
    persistenceFound: true,
    runtimeActivationFound: true,
    approvalExecutionFound: true,
    providerCalled: true,
    sent: true,
  });
  assert.equal(result.lockdownStatus, "lockdown_blocked");
  assert.ok(result.warningCodes.includes("execution_capability_found"));
  assert.ok(result.warningCodes.includes("provider_path_found"));
  assert.ok(result.warningCodes.includes("gps_map_activation_found"));
  assert.ok(result.warningCodes.includes("scraping_skip_tracing_found"));
  assert.ok(result.warningCodes.includes("approval_execution_found"));
  assertSafety(result);
});
