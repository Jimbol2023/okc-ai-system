import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR64DrivingForDollarsUiScopeInvariants,
  createR64DrivingForDollarsUiScopeAudit,
  type R64UiScopeInput,
  type R64UiScopeResult,
} from "./r64-driving-for-dollars-intelligence-ui-scope-audit";

const readyInput: R64UiScopeInput = {
  r64aScopeReviewed: true,
  uiSurfaceReviewed: true,
  distressVisibilityReviewed: true,
  stalePropertyVisibilityReviewed: true,
  acquisitionReviewVisibilityReviewed: true,
  fieldNoteVisibilityReviewed: true,
  revenueOpportunityVisibilityReviewed: true,
  wordingReviewed: true,
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

function assertSafety(result: R64UiScopeResult) {
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
  assert.equal(assertR64DrivingForDollarsUiScopeInvariants(result).passed, true);
}

test("R64B defaults to operator review and remains scope-audit only", () => {
  const result = createR64DrivingForDollarsUiScopeAudit();
  assert.equal(result.phase, "R64B");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r64b_ui_scope_audit_only"));
  assert.ok(result.warningCodes.includes("r64a_scope_review_required"));
  assertSafety(result);
});

test("R64B defines allowed future UI sections and visibility boundaries", () => {
  const result = createR64DrivingForDollarsUiScopeAudit(readyInput);
  assert.equal(result.scopeStatus, "ui_scope_ready_for_later_implementation");
  assert.ok(result.allowedFutureUiSections.includes("governance_stop_visibility"));
  assert.ok(result.allowedFutureUiSections.includes("visible_distress_signal_review"));
  assert.ok(result.allowedFutureUiSections.includes("stale_field_observation_review"));
  assert.match(result.distressVisibility.join(" "), /cannot infer owner intent/i);
  assert.match(result.stalePropertyVisibility.join(" "), /cannot launch mail/i);
  assert.match(result.acquisitionReviewVisibility.join(" "), /cannot auto scrape owner data/i);
  assertSafety(result);
});

test("R64B preserves safe wording, governance, accessibility, and dangerous wording blockers", () => {
  const result = createR64DrivingForDollarsUiScopeAudit(readyInput);
  assert.ok(result.safeWording.includes("Property priority does not mean contact owner."));
  assert.match(result.governanceBoundaries[0] ?? "", /render first/i);
  assert.match(result.accessibilityExpectations.join(" "), /semantic headings/i);
  assert.ok(result.dangerousWordingPatterns.includes("approval launches campaign"));
  assert.ok(result.forbiddenControls.includes("GPS activation"));
  assertSafety(result);
});

test("R64B rejects unsafe implementation, provider, GPS, scraping, and execution requests", () => {
  const result = createR64DrivingForDollarsUiScopeAudit({
    ...readyInput,
    uiImplementationRequested: true,
    providerActivationRequested: true,
    gpsMapActivationRequested: true,
    scrapingRequested: true,
    skipTracingRequested: true,
    outreachExecutionRequested: true,
    campaignLaunchRequested: true,
    autonomousAcquisitionRequested: true,
    autonomousPropertyTargetingRequested: true,
    autonomousRoutePlanningRequested: true,
    approvalGrantsExecution: true,
    readOnly: false,
    providerCalled: true,
    sent: true,
    uiImplementationAllowedNow: true,
  });
  assert.equal(result.scopeStatus, "ui_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("gps_map_activation_rejected"));
  assert.ok(result.warningCodes.includes("scraping_rejected"));
  assert.ok(result.warningCodes.includes("skip_tracing_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_property_targeting_rejected"));
  assertSafety(result);
});
