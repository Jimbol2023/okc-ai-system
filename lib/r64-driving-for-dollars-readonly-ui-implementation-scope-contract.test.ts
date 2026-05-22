import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR64DrivingForDollarsReadonlyUiScopeInvariants,
  createR64DrivingForDollarsReadonlyUiImplementationScopeContract,
  type R64ReadonlyUiScopeInput,
  type R64ReadonlyUiScopeResult,
} from "./r64-driving-for-dollars-readonly-ui-implementation-scope-contract";

const readyInput: R64ReadonlyUiScopeInput = {
  r64bUiScopeAuditReviewed: true,
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

function assertSafety(result: R64ReadonlyUiScopeResult) {
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
  assert.equal(assertR64DrivingForDollarsReadonlyUiScopeInvariants(result).passed, true);
}

test("R64C defaults to operator review and does not authorize implementation", () => {
  const result = createR64DrivingForDollarsReadonlyUiImplementationScopeContract();
  assert.equal(result.phase, "R64C");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r64c_readonly_ui_implementation_scope_contract_only"));
  assertSafety(result);
});

test("R64C defines the existing dashboard as the only future surface", () => {
  const result = createR64DrivingForDollarsReadonlyUiImplementationScopeContract(readyInput);
  assert.equal(result.scopeStatus, "read_only_ui_implementation_scope_ready");
  assert.equal(result.allowedFutureUiSurface.surface, "existing_dashboard");
  assert.equal(result.allowedFutureUiSurface.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
  assert.equal(result.allowedFutureUiSurface.futureComponentAllowed, "components/dashboard/driving-for-dollars-intelligence-summary.tsx");
  assert.equal(result.allowedFutureUiSurface.routeChangesAllowed, false);
  assert.equal(result.allowedFutureUiSurface.implementationAllowedNow, false);
  assertSafety(result);
});

test("R64C blocks forbidden surfaces and preserves safe display rules", () => {
  const result = createR64DrivingForDollarsReadonlyUiImplementationScopeContract(readyInput);
  assert.ok(result.forbiddenSurfaces.includes("new GPS map console"));
  assert.ok(result.forbiddenSurfaces.includes("new scraping panel"));
  assert.match(result.allowedReadOnlyDisplayRules.join(" "), /Governance stop visibility before/i);
  assert.ok(result.safeCopyRules.includes("Property priority does not mean contact owner."));
  assert.match(result.noExecutionGuarantees.join(" "), /No provider\/Twilio connectivity/i);
  assert.match(result.accessibilityGuarantees.join(" "), /aria-labelledby/i);
  assertSafety(result);
});

test("R64C rejects unsafe implementation requests while preserving safe output", () => {
  const result = createR64DrivingForDollarsReadonlyUiImplementationScopeContract({
    ...readyInput,
    uiImplementationRequested: true,
    gpsMapActivationRequested: true,
    scrapingRequested: true,
    skipTracingRequested: true,
    providerActivationRequested: true,
    autonomousAcquisitionRequested: true,
    autonomousPropertyTargetingRequested: true,
    autonomousRoutePlanningRequested: true,
    approvalGrantsExecution: true,
    readOnly: false,
    providerCalled: true,
    sent: true,
    uiImplementationAllowedNow: true,
  });
  assert.equal(result.scopeStatus, "implementation_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("gps_map_activation_rejected"));
  assert.ok(result.warningCodes.includes("scraping_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_route_planning_rejected"));
  assertSafety(result);
});
