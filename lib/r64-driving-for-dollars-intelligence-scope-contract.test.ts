import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR64DrivingForDollarsScopeInvariants,
  createR64DrivingForDollarsIntelligenceScopeContract,
  summarizeR64DrivingForDollarsScope,
  type R64ScopeInput,
  type R64ScopeResult,
} from "./r64-driving-for-dollars-intelligence-scope-contract";

const readyInput: R64ScopeInput = {
  r63fLockdownReviewed: true,
  allowedConceptsReviewed: true,
  distressVisibilityReviewed: true,
  stalePropertyReviewed: true,
  acquisitionReviewReviewed: true,
  fieldNoteQualityReviewed: true,
  governanceBoundaryReviewed: true,
  futureUiReviewed: true,
  accessibilityReviewed: true,
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

function assertSafety(result: R64ScopeResult) {
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
  assert.equal(assertR64DrivingForDollarsScopeInvariants(result).passed, true);
}

test("R64A defaults to operator review with hard-closed safety flags", () => {
  const result = createR64DrivingForDollarsIntelligenceScopeContract();
  assert.equal(result.phase, "R64A");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.ok(result.warningCodes.includes("r64a_scope_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r63f_lockdown_review_required"));
  assertSafety(result);
});

test("R64A defines allowed driving-for-dollars concepts with governance first", () => {
  const result = createR64DrivingForDollarsIntelligenceScopeContract(readyInput);
  assert.equal(result.scopeStatus, "driving_for_dollars_scope_ready");
  assert.ok(result.allowedIntelligenceConcepts.includes("governance_stop_visibility"));
  assert.ok(result.allowedIntelligenceConcepts.includes("visible_distress_signal_review"));
  assert.ok(result.allowedIntelligenceConcepts.includes("stale_property_recovery_visibility"));
  assert.ok(result.allowedIntelligenceConcepts.includes("human_only_decision_support"));
  assert.equal(result.rankingConcepts[0]?.concept, "governance_stop_visibility");
  assert.deepEqual(result.rankingConcepts.map((item) => item.rank), Array.from({ length: 25 }, (_, index) => index + 1));
  assert.match(result.rankingConcepts[0]?.revenueReason ?? "", /must outrank distress visibility/i);
  assertSafety(result);
});

test("R64A preserves deterministic scope, future UI boundaries, and fail-closed rules", () => {
  const result = createR64DrivingForDollarsIntelligenceScopeContract(readyInput);
  assert.equal(result.deterministicScope.implementationAllowed, false);
  assert.equal(result.deterministicScope.providerConnectivityAllowed, false);
  assert.equal(result.deterministicScope.gpsMapActivationAllowed, false);
  assert.equal(result.deterministicScope.scrapingAllowed, false);
  assert.equal(result.deterministicScope.skipTracingAllowed, false);
  assert.equal(result.deterministicScope.persistenceAllowed, false);
  assert.equal(result.deterministicScope.runtimeActivationAllowed, false);
  assert.equal(result.deterministicScope.executionControlsAllowed, false);
  assert.match(result.futureUiBoundaryNotes.join(" "), /must not add a GPS map/i);
  assert.match(result.failClosedRules.join(" "), /blocks the scope/i);
  assertSafety(result);
});

test("R64A blocks forbidden driving-for-dollars semantics", () => {
  const result = createR64DrivingForDollarsIntelligenceScopeContract(readyInput);
  assert.ok(result.forbiddenDrivingForDollarsSemantics.includes("auto contact owner"));
  assert.ok(result.forbiddenDrivingForDollarsSemantics.includes("auto skip trace"));
  assert.ok(result.forbiddenDrivingForDollarsSemantics.includes("autonomous property targeting"));
  assert.ok(result.forbiddenDrivingForDollarsSemantics.includes("autonomous route planning"));
  assert.ok(result.forbiddenDrivingForDollarsSemantics.includes("GPS activation"));
  assert.ok(result.forbiddenDrivingForDollarsSemantics.includes("approval grants execution"));
  assertSafety(result);
});

test("R64A preserves governance, accessibility, and safe wording", () => {
  const result = createR64DrivingForDollarsIntelligenceScopeContract(readyInput);
  assert.equal(result.governanceBoundaries[0]?.rule, "Governance stop signals render first.");
  assert.match(result.governanceBoundaries[0]?.enforcement ?? "", /outranks distress visibility/i);
  assert.ok(result.safeOperatorGuidanceWording.includes("Driving-for-dollars priority label is advisory only."));
  assert.ok(result.safeOperatorGuidanceWording.includes("Property priority does not mean contact owner."));
  assert.match(result.accessibilityRequirements.join(" "), /semantic headings/i);
  assert.match(result.accessibilityRequirements.join(" "), /No motion dependency/i);
  assertSafety(result);
});

test("R64A classifies pre-implementation audit findings", () => {
  const result = createR64DrivingForDollarsIntelligenceScopeContract(readyInput);
  assert.ok(result.preImplementationAuditFindings.some((item) => item.classification === "Required before implementation"));
  assert.ok(result.preImplementationAuditFindings.some((item) => item.classification === "Forbidden because it violates governance"));
  assertSafety(result);
});

test("R64A rejects unsafe requests and flags while preserving safe output", () => {
  const result = createR64DrivingForDollarsIntelligenceScopeContract({
    ...readyInput,
    uiImplementationRequested: true,
    providerActivationRequested: true,
    gpsMapActivationRequested: true,
    scrapingRequested: true,
    skipTracingRequested: true,
    outreachExecutionRequested: true,
    campaignLaunchRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    runtimeActivationRequested: true,
    executionControlRequested: true,
    autonomousAcquisitionRequested: true,
    autonomousPropertyTargetingRequested: true,
    autonomousRoutePlanningRequested: true,
    approvalGrantsExecution: true,
    readOnly: false,
    providerCalled: true,
    sent: true,
    uiImplementationAllowedNow: true,
  });
  assert.equal(result.scopeStatus, "driving_for_dollars_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("gps_map_activation_rejected"));
  assert.ok(result.warningCodes.includes("scraping_rejected"));
  assert.ok(result.warningCodes.includes("skip_tracing_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_acquisition_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_property_targeting_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_route_planning_rejected"));
  assert.ok(result.warningCodes.includes("read_only_required"));
  assertSafety(result);
});

test("R64A summary is bounded and points to R64B", () => {
  const result = createR64DrivingForDollarsIntelligenceScopeContract({
    ...readyInput,
    extraScopeNotes: ["R64A note".repeat(100)],
  });
  const summary = summarizeR64DrivingForDollarsScope(result);
  assert.equal(result.nextSuggestedPhase, "R64B - Driving-for-Dollars Intelligence UI Scope Audit");
  assert.ok(summary.length <= 903);
  assert.match(summary, /cannot authorize UI implementation/i);
  assertSafety(result);
});
