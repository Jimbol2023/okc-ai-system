import assert from "node:assert/strict";
import test from "node:test";

import { createR65LeadQualityFinalDashboardLockdownContract, type R65FinalLockdownInput, type R65FinalLockdownResult } from "./r65-lead-quality-final-dashboard-lockdown-contract";

const completeInput: R65FinalLockdownInput = {
  r65eSafetyReviewCompleted: true,
  dashboardSurfaceReviewed: true,
  readOnlyBehaviorReviewed: true,
  governanceFirstReviewed: true,
  advisoryWordingReviewed: true,
  accessibilityReviewed: true,
  executionBoundaryReviewed: true,
  providerBoundaryReviewed: true,
  enrichmentBoundaryReviewed: true,
  skipTracingBoundaryReviewed: true,
  persistencePollingRuntimeReviewed: true,
  operatorReviewCompleted: true,
  unsafeUiFound: false,
  executionCapabilityFound: false,
  providerPathFound: false,
  enrichmentActivationFound: false,
  skipTracingActivationFound: false,
  externalLookupFound: false,
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

function assertSafety(result: R65FinalLockdownResult) {
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
  assert.equal(result.enrichmentActivationAllowed, false);
  assert.equal(result.skipTracingAllowed, false);
}

test("R65F completes final dashboard lockdown with governance and accessibility locks", () => {
  const result = createR65LeadQualityFinalDashboardLockdownContract(completeInput);
  assert.equal(result.lockdownStatus, "final_dashboard_lockdown_complete");
  assert.ok(result.lockedFiles.includes("components/dashboard/lead-quality-intelligence-summary.tsx"));
  assert.match(result.readonlyBehaviorLock.join(" "), /read-only and advisory-only/i);
  assert.match(result.governanceFirstLock.join(" "), /must render first/i);
  assert.ok(result.advisoryWordingLock.includes("Lead quality priority does not mean enrich or contact."));
  assert.match(result.accessibilityLock.join(" "), /aria-labelledby/i);
  assertSafety(result);
});

test("R65F blocks execution, provider, enrichment, tracing, persistence, polling, runtime, and approval drift", () => {
  const result = createR65LeadQualityFinalDashboardLockdownContract({
    ...completeInput,
    executionCapabilityFound: true,
    providerPathFound: true,
    enrichmentActivationFound: true,
    skipTracingActivationFound: true,
    externalLookupFound: true,
    pollingFound: true,
    persistenceFound: true,
    runtimeActivationFound: true,
    approvalExecutionFound: true,
    providerCalled: true,
    sent: true,
  });
  assert.equal(result.lockdownStatus, "lockdown_blocked");
  assert.ok(result.warningCodes.includes("execution_capability_found"));
  assert.ok(result.warningCodes.includes("enrichment_activation_found"));
  assert.ok(result.warningCodes.includes("skip_tracing_activation_found"));
  assert.ok(result.warningCodes.includes("external_lookup_found"));
  assertSafety(result);
});
