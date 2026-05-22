import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR665FinalUxLockdownInvariants,
  createR665FinalUxLockdownContract,
  summarizeR665FinalUxLockdown,
  type R665FinalUxLockdownInput,
  type R665FinalUxLockdownResult,
} from "./r665-final-ux-lockdown-contract";

const lockedInput: R665FinalUxLockdownInput = {
  r665aScopeReviewed: true,
  r665bAuditReviewed: true,
  r665cImplementationScopeReviewed: true,
  r665dCleanupReviewed: true,
  r665eSafetyReviewReviewed: true,
  overflowDoctrineReviewed: true,
  typographyRulesReviewed: true,
  cardDensityRulesReviewed: true,
  badgeWrappingRulesReviewed: true,
  advisoryCopyRulesReviewed: true,
  responsiveRulesReviewed: true,
  governanceVisibilityReviewed: true,
  futureComponentStandardsReviewed: true,
};

function assertSafety(result: R665FinalUxLockdownResult) {
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
  assert.equal(result.dashboardUxStabilized, true);
  assert.equal(result.futureDashboardUxStandardsLocked, true);
  assert.equal(assertR665FinalUxLockdownInvariants(result).passed, true);
}

test("R66.5F defaults to operator review required", () => {
  const result = createR665FinalUxLockdownContract();

  assert.equal(result.phase, "R66.5F");
  assert.equal(result.lockdownStatus, "operator_review_required");
  assert.ok(result.missingReviewAreas.includes("R66.5A scope"));
  assert.ok(result.missingReviewAreas.includes("R66.5E safety review"));
  assertSafety(result);
});

test("R66.5F enforces final dashboard UX standards", () => {
  const result = createR665FinalUxLockdownContract(lockedInput);

  assert.equal(result.lockdownStatus, "final_ux_lockdown_enforced");
  assert.match(result.overflowContainmentDoctrine.join(" "), /min-w-0/i);
  assert.match(result.typographyHierarchyRules.join(" "), /clear readable hierarchy/i);
  assert.match(result.cardDensityRules.join(" "), /Seven-column dashboard layouts/i);
  assert.match(result.badgeWrappingStandards.join(" "), /wrap inside their parent containers/i);
  assert.match(result.futureComponentUxStandards.join(" "), /min-width containment/i);
  assertSafety(result);
});

test("R66.5F preserves advisory governance visibility and blocks unsafe future drift", () => {
  const result = createR665FinalUxLockdownContract({
    ...lockedInput,
    executionAffordanceRequested: true,
    providerActivationRequested: true,
    runtimeActivationRequested: true,
    pollingRequested: true,
    hiddenControlRequested: true,
    governanceWarningRemovalRequested: true,
    safetyCopyWeakeningRequested: true,
    logicChangeRequested: true,
    routeChangeRequested: true,
    persistenceRequested: true,
    automationRequested: true,
    campaignRequested: true,
  });

  assert.equal(result.lockdownStatus, "final_ux_lockdown_blocked");
  assert.ok(result.blockedReasons.includes("execution affordances are forbidden"));
  assert.ok(result.blockedReasons.includes("provider activation is forbidden"));
  assert.ok(result.blockedReasons.includes("governance warning removal is forbidden"));
  assert.ok(result.forbiddenFutureDrift.includes("hidden controls"));
  assert.ok(result.forbiddenFutureDrift.includes("safety copy weakening"));
  assertSafety(result);
});

test("R66.5F blocks accessibility drift", () => {
  const result = createR665FinalUxLockdownContract({
    ...lockedInput,
    colorOnlyMeaningRequested: true,
    motionDependencyRequested: true,
    focusMovementRequested: true,
  });

  assert.equal(result.lockdownStatus, "final_ux_lockdown_blocked");
  assert.ok(result.blockedReasons.includes("color-only meaning is forbidden"));
  assert.ok(result.blockedReasons.includes("motion dependency is forbidden"));
  assert.ok(result.blockedReasons.includes("focus movement is forbidden"));
  assertSafety(result);
});

test("R66.5F summary points to R67A", () => {
  const result = createR665FinalUxLockdownContract(lockedInput);
  const summary = summarizeR665FinalUxLockdown(result);

  assert.equal(result.nextSuggestedPhase, "R67A - Automation-Last Governance Scope Contract");
  assert.match(summary, /read-only, advisory-only, governance-first/i);
  assert.match(summary, /provider activation/i);
  assertSafety(result);
});
