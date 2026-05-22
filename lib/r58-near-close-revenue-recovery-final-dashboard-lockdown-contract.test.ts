import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR58NearCloseRevenueRecoveryFinalLockdownInvariants,
  createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract,
  summarizeR58NearCloseRevenueRecoveryFinalLockdown,
  type R58FinalLockdownInput,
  type R58FinalLockdownResult,
} from "./r58-near-close-revenue-recovery-final-dashboard-lockdown-contract";

const readyInput: R58FinalLockdownInput = {
  r58aScopeReviewed: true,
  r58bUiScopeReviewed: true,
  r58cImplementationScopeReviewed: true,
  r58dUiImplementationReviewed: true,
  r58eSafetyAccessibilityReviewed: true,
  dashboardSafetyReviewed: true,
  revenuePriorityReviewed: true,
  nextRevenueIntelligenceReviewed: true,
  governanceBoundaryReviewed: true,
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

function assertSafety(result: R58FinalLockdownResult) {
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
  assert.deepEqual(result.safetyFlags, {
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
    uiImplementationAllowedNow: false,
  });
  assert.equal(assertR58NearCloseRevenueRecoveryFinalLockdownInvariants(result).passed, true);
}

test("R58F defaults to operator review with hard-closed safety flags", () => {
  const result = createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract();

  assert.equal(result.phase, "R58F");
  assert.equal(result.lockdownStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r58f_final_dashboard_lockdown_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r58a_scope_review_required"));
  assert.ok(result.warningCodes.includes("r58e_safety_accessibility_review_required"));
  assertSafety(result);
});

test("R58F locks the full R58 stack as complete when reviews are present", () => {
  const result = createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract(readyInput);

  assert.equal(result.lockdownStatus, "near_close_revenue_recovery_dashboard_locked");
  assert.equal(result.operatorReviewRequired, false);
  assert.equal(result.r58StackReviewFindings.length, 5);
  assert.match(result.r58StackReviewFindings.join(" "), /R58A scoped/i);
  assert.match(result.r58StackReviewFindings.join(" "), /R58D implemented/i);
  assert.match(result.r58StackReviewFindings.join(" "), /R58E reviewed/i);
  assertSafety(result);
});

test("R58F confirms dashboard safety and exact safety copy", () => {
  const result = createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract(readyInput);

  assert.equal(
    result.requiredSafetyCopy,
    "Read-only near-close recovery guidance. No provider called, no message sent, no runtime execution.",
  );
  assert.match(result.dashboardSafetyFindings.join(" "), /read-only and advisory-only/i);
  assert.match(result.dashboardSafetyFindings.join(" "), /existing dashboard-loaded StoredLead/i);
  assert.match(result.dashboardSafetyFindings.join(" "), /no fetch, localStorage, sessionStorage, polling/i);
  assert.match(result.dashboardSafetyFindings.join(" "), /no buttons, click handlers, forms, links/i);
  assertSafety(result);
});

test("R58F preserves revenue-priority ordering", () => {
  const result = createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract(readyInput);
  const findings = result.revenuePriorityFindings.join(" ");

  assert.match(findings, /governance stop signals, title\/escrow blockers, closing checklist gaps/i);
  assert.match(findings, /assignment friction, seller response blockers, buyer package blockers/i);
  assert.match(findings, /missing document blockers, stale near-close timelines/i);
  assert.match(findings, /pre-closing leakage indicators, summary, and safe guidance/i);
  assert.match(findings, /Revenue leakage indicators remain explanatory/i);
  assertSafety(result);
});

test("R58F preserves accessibility expectations", () => {
  const result = createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract(readyInput);
  const findings = result.accessibilityFindings.join(" ");

  assert.match(findings, /semantic section with aria-labelledby/i);
  assert.match(findings, /heading id matches/i);
  assert.match(findings, /readable text labels/i);
  assert.match(findings, /does not depend on color alone/i);
  assert.match(findings, /No focus movement, motion dependency, auto-refresh, polling/i);
  assertSafety(result);
});

test("R58F keeps governance boundaries hard-closed", () => {
  const result = createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract(readyInput);
  const findings = result.governanceBoundaryFindings.join(" ");
  const forbidden = result.forbiddenBoundaries.join(" ");

  assert.match(findings, /No routes, providers, Twilio, automation-agent, Prisma/i);
  assert.match(findings, /No approval wording grants permission/i);
  assert.match(findings, /No legal-readiness, closing-readiness, assignment-readiness/i);
  assert.match(forbidden, /No UI implementation in R58F/i);
  assert.match(forbidden, /No hidden execution affordances/i);
  assert.match(forbidden, /No property facts may be invented/i);
  assertSafety(result);
});

test("R58F ranks next revenue intelligence candidates and selects operator work queue", () => {
  const result = createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract(readyInput);

  assert.equal(result.selectedNextPhase, "operator_work_queue_intelligence");
  assert.equal(result.nextSuggestedPhase, "R59A - Operator Work Queue Intelligence Scope Contract");
  assert.equal(result.candidateRankings.length, 6);
  assert.deepEqual(
    result.candidateRankings.map((candidate) => candidate.rank),
    [1, 2, 3, 4, 5, 6],
  );
  assert.equal(result.candidateRankings[0]?.phase, "operator_work_queue_intelligence");
  assert.match(result.selectedNextPhaseReason, /unified read-only queue/i);
  assert.match(result.nextRevenueIntelligenceFindings.join(" "), /highest-ROI next candidate/i);
  assertSafety(result);
});

test("R58F blocks dangerous UI, provider, persistence, runtime, and readiness requests", () => {
  const result = createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract({
    ...readyInput,
    uiImplementationRequested: true,
    routeChangeRequested: true,
    runtimeActivationRequested: true,
    providerActivationRequested: true,
    liveSendingRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    executionControlRequested: true,
    redesignRequested: true,
    autonomousWorkflowRequested: true,
    approvalGrantsExecution: true,
    legalOrClosingReadinessClaimRequested: true,
    assignmentReadyClaimRequested: true,
    buyerReadyToContactClaimRequested: true,
  });

  assert.equal(result.lockdownStatus, "final_lockdown_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("route_change_rejected"));
  assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("live_sending_rejected"));
  assert.ok(result.warningCodes.includes("automation_agent_rejected"));
  assert.ok(result.warningCodes.includes("polling_rejected"));
  assert.ok(result.warningCodes.includes("persistence_rejected"));
  assert.ok(result.warningCodes.includes("execution_control_rejected"));
  assert.ok(result.warningCodes.includes("redesign_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_workflow_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assert.ok(result.warningCodes.includes("legal_or_closing_readiness_claim_rejected"));
  assert.ok(result.warningCodes.includes("assignment_ready_claim_rejected"));
  assert.ok(result.warningCodes.includes("buyer_ready_to_contact_claim_rejected"));
  assert.ok(result.rejectionReasons.includes("runtime_activation_rejected"));
  assertSafety(result);
});

test("R58F blocks unsafe invariant inputs while returning safe output flags", () => {
  const result = createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract({
    ...readyInput,
    readOnly: false,
    advisoryOnly: false,
    simulationOnly: false,
    providerCalled: true,
    sent: true,
    persistenceAllowedNow: true,
    pollingAllowed: true,
    runtimeActivationAllowed: true,
    providerActivationAllowed: true,
    uiImplementationAllowedNow: true,
  });

  assert.equal(result.lockdownStatus, "final_lockdown_blocked");
  assert.ok(result.warningCodes.includes("read_only_required"));
  assert.ok(result.warningCodes.includes("advisory_only_required"));
  assert.ok(result.warningCodes.includes("simulation_only_required"));
  assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
  assert.ok(result.warningCodes.includes("sent_must_be_false"));
  assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
  assert.ok(result.warningCodes.includes("polling_not_allowed"));
  assert.ok(result.warningCodes.includes("runtime_activation_not_allowed"));
  assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
  assert.ok(result.warningCodes.includes("ui_implementation_not_allowed_now"));
  assertSafety(result);
});

test("R58F exposes blocked patterns and invariant assertions", () => {
  const result = createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract(readyInput);

  assert.ok(result.blockedPatterns.includes("close deal now"));
  assert.ok(result.blockedPatterns.includes("send assignment"));
  assert.ok(result.blockedPatterns.includes("provider activation"));
  assert.ok(result.blockedPatterns.includes("autonomous negotiation"));
  assert.ok(result.blockedPatterns.includes("legal-ready"));
  assert.ok(result.blockedPatterns.includes("buyer-ready-to-contact"));
  assert.ok(result.blockedPatterns.includes("hidden execution affordances"));
  assert.match(result.invariantAssertions.join(" "), /Required safety copy must remain exact/i);
  assert.match(result.invariantAssertions.join(" "), /Readiness and contactability claims must remain forbidden/i);
  assertSafety(result);
});

test("R58F summary remains bounded and planning-only", () => {
  const result = createR58NearCloseRevenueRecoveryFinalDashboardLockdownContract({
    ...readyInput,
    extraLockdownNotes: ["R58F note".repeat(100)],
  });
  const summary = summarizeR58NearCloseRevenueRecoveryFinalLockdown(result);

  assert.ok(summary.length <= 903);
  assert.match(summary, /planning-only/i);
  assert.match(summary, /cannot authorize UI, redesign, routes, providers/i);
  assertSafety(result);
});
