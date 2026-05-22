import assert from "node:assert/strict";
import test from "node:test";

import { createR65LeadQualityReadonlyUiImplementationScopeContract, type R65ReadonlyUiScopeInput, type R65ReadonlyUiScopeResult } from "./r65-lead-quality-readonly-ui-implementation-scope-contract";

const readyInput: R65ReadonlyUiScopeInput = {
  r65bUiScopeAuditReviewed: true,
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

function assertSafety(result: R65ReadonlyUiScopeResult) {
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
  assert.equal(result.enrichmentActivationAllowed, false);
  assert.equal(result.skipTracingAllowed, false);
}

test("R65C defines existing dashboard as the only future surface", () => {
  const result = createR65LeadQualityReadonlyUiImplementationScopeContract(readyInput);
  assert.equal(result.scopeStatus, "read_only_ui_implementation_scope_ready");
  assert.equal(result.allowedFutureUiSurface.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
  assert.equal(result.allowedFutureUiSurface.futureComponentAllowed, "components/dashboard/lead-quality-intelligence-summary.tsx");
  assert.equal(result.allowedFutureUiSurface.routeChangesAllowed, false);
  assertSafety(result);
});

test("R65C blocks unsafe surfaces and activation paths", () => {
  const result = createR65LeadQualityReadonlyUiImplementationScopeContract({
    ...readyInput,
    uiImplementationRequested: true,
    enrichmentActivationRequested: true,
    skipTracingRequested: true,
    externalLookupRequested: true,
    providerActivationRequested: true,
    autonomousQualificationRequested: true,
    readOnly: false,
    providerCalled: true,
    sent: true,
    uiImplementationAllowedNow: true,
  });
  assert.equal(result.scopeStatus, "implementation_scope_blocked");
  assert.ok(result.forbiddenSurfaces.includes("new lead enrichment console"));
  assert.ok(result.warningCodes.includes("enrichment_activation_rejected"));
  assert.ok(result.warningCodes.includes("skip_tracing_rejected"));
  assert.ok(result.warningCodes.includes("external_lookup_rejected"));
  assertSafety(result);
});
