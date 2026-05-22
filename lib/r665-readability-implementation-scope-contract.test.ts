import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR665ReadabilityImplementationScopeInvariants,
  createR665ReadabilityImplementationScopeContract,
  summarizeR665ReadabilityImplementationScope,
  type R665ReadabilityImplementationScopeInput,
  type R665ReadabilityImplementationScopeResult,
} from "./r665-readability-implementation-scope-contract";

const readyInput: R665ReadabilityImplementationScopeInput = {
  r665aScopeReviewed: true,
  r665bAuditReviewed: true,
  allowedChangeTypesReviewed: true,
  forbiddenChangeTypesReviewed: true,
  targetSurfaceReviewed: true,
  accessibilityRulesReviewed: true,
  governanceRulesReviewed: true,
  operatorReviewCompleted: true,
};

function assertSafety(result: R665ReadabilityImplementationScopeResult) {
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
  assert.equal(result.futureImplementationMustRemainUiOnly, true);
  assert.equal(assertR665ReadabilityImplementationScopeInvariants(result).passed, true);
}

test("R66.5C defaults to operator review and does not authorize implementation now", () => {
  const result = createR665ReadabilityImplementationScopeContract();
  assert.equal(result.phase, "R66.5C");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.ok(result.missingReviewAreas.includes("R66.5A UX stabilization scope"));
  assert.ok(result.missingReviewAreas.includes("R66.5B overflow and density audit"));
  assertSafety(result);
});

test("R66.5C authorizes only future UI-only readability cleanup types", () => {
  const result = createR665ReadabilityImplementationScopeContract(readyInput);
  assert.equal(result.scopeStatus, "readability_implementation_scope_ready");
  assert.ok(result.allowedFutureChangeTypes.includes("className-only refinements"));
  assert.ok(result.allowedFutureChangeTypes.includes("responsive grid hardening"));
  assert.ok(result.allowedFutureChangeTypes.includes("badge wrapping fixes"));
  assert.ok(result.allowedFutureChangeTypes.includes("min-w-0 additions"));
  assert.ok(result.classNameOnlyRules.join(" ").includes("className values only"));
  assert.ok(result.recommendedFutureTargets.includes("components/dashboard/*intelligence-summary.tsx"));
  assertSafety(result);
});

test("R66.5C forbids logic, governance, route, provider, persistence, polling, execution, and runtime changes", () => {
  const result = createR665ReadabilityImplementationScopeContract({
    ...readyInput,
    implementationRequestedNow: true,
    redesignRequested: true,
    layoutArchitectureChangeRequested: true,
    businessLogicChangeRequested: true,
    intelligenceLogicChangeRequested: true,
    governanceMeaningChangeRequested: true,
    safetyCopyWeakeningRequested: true,
    governanceWarningHiddenRequested: true,
    routeChangeRequested: true,
    apiChangeRequested: true,
    prismaChangeRequested: true,
    providerChangeRequested: true,
    persistenceRequested: true,
    pollingRequested: true,
    executionControlRequested: true,
    buttonRequested: true,
    approvalToExecutionRequested: true,
    providerActivationRequested: true,
    campaignRequested: true,
    automationAgentRequested: true,
    runtimeActivationRequested: true,
    dataMutationRequested: true,
  });

  assert.equal(result.scopeStatus, "readability_implementation_scope_blocked");
  assert.ok(result.forbiddenFutureChangeTypes.includes("business logic changes"));
  assert.ok(result.forbiddenFutureChangeTypes.includes("governance meaning changes"));
  assert.ok(result.forbiddenFutureChangeTypes.includes("execution controls"));
  assert.ok(result.forbiddenFutureChangeTypes.includes("runtime activation"));
  assert.ok(result.blockedReasons.includes("R66.5C is contract-only and cannot implement UI changes now"));
  assert.ok(result.blockedReasons.includes("buttons and hidden controls are forbidden"));
  assertSafety(result);
});

test("R66.5C prevents line-clamp from hiding governance text and preserves accessibility guarantees", () => {
  const result = createR665ReadabilityImplementationScopeContract({
    ...readyInput,
    lineClampWouldHideGovernanceText: true,
    ariaLabelRemovalRequested: true,
    ariaDescribedbyRemovalRequested: true,
    colorOnlyMeaningRequested: true,
    motionDependencyRequested: true,
    focusMovementRequested: true,
    autoRefreshRequested: true,
    timerRequested: true,
  });

  assert.equal(result.scopeStatus, "readability_implementation_scope_blocked");
  assert.ok(result.blockedReasons.includes("line-clamp cannot hide governance or safety text"));
  assert.match(result.lineClampRules.join(" "), /cannot hide governance warnings/i);
  assert.match(result.accessibilityRules.join(" "), /aria-labelledby and aria-describedby/i);
  assert.match(result.accessibilityRules.join(" "), /No color-only meaning/i);
  assert.match(result.accessibilityRules.join(" "), /auto-refresh, polling, or timers/i);
  assertSafety(result);
});

test("R66.5C summary points to R66.5D while remaining contract-only", () => {
  const result = createR665ReadabilityImplementationScopeContract(readyInput);
  const summary = summarizeR665ReadabilityImplementationScope(result);

  assert.equal(result.nextSuggestedPhase, "R66.5D - Dashboard Readability Cleanup Implementation");
  assert.match(summary, /cannot authorize immediate UI implementation/i);
  assert.match(summary, /governance weakening/i);
  assertSafety(result);
});
