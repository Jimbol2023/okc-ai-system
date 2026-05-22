import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR62BuyerDispositionOperationalFinalLockdownInvariants,
  createR62BuyerDispositionOperationalFinalDashboardLockdownContract,
  summarizeR62BuyerDispositionOperationalFinalDashboardLockdown,
  type R62FinalLockdownInput,
  type R62FinalLockdownResult,
} from "./r62-buyer-disposition-operational-intelligence-final-dashboard-lockdown-contract";

const readyInput: R62FinalLockdownInput = {
  r62aScopeReviewed: true,
  r62bUiScopeReviewed: true,
  r62cImplementationScopeReviewed: true,
  r62dUiImplementationReviewed: true,
  r62eSafetyAccessibilityReviewed: true,
  dashboardSafetyReviewed: true,
  readOnlyReviewed: true,
  operationalPriorityBoundaryReviewed: true,
  governanceStopDominanceReviewed: true,
  staleDealPackageReviewed: true,
  assignmentReadinessReviewed: true,
  buyerEngagementDemandReviewed: true,
  workloadPriorityReviewed: true,
  forbiddenControlsReviewed: true,
  executionBoundariesReviewed: true,
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
  uiImplementationAllowedNow: true,
};

function assertSafety(result: R62FinalLockdownResult) {
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
    uiImplementationAllowedNow: true,
  });
  assert.equal(assertR62BuyerDispositionOperationalFinalLockdownInvariants(result).passed, true);
}

test("R62F defaults to operator review with UI allowed now and execution closed", () => {
  const result = createR62BuyerDispositionOperationalFinalDashboardLockdownContract();

  assert.equal(result.phase, "R62F");
  assert.equal(result.lockdownStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r62f_final_dashboard_lockdown_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r62a_scope_review_required"));
  assertSafety(result);
});

test("R62F locks the full R62 stack when reviews are present", () => {
  const result = createR62BuyerDispositionOperationalFinalDashboardLockdownContract(readyInput);

  assert.equal(result.lockdownStatus, "buyer_disposition_operational_dashboard_locked");
  assert.equal(result.operatorReviewRequired, false);
  assert.equal(result.r62StackReviewFindings.length, 5);
  assert.match(result.r62StackReviewFindings.join(" "), /R62A scoped/i);
  assert.match(result.r62StackReviewFindings.join(" "), /R62D implemented/i);
  assert.match(result.r62StackReviewFindings.join(" "), /R62E reviewed/i);
  assertSafety(result);
});

test("R62F enforces read-only dashboard behavior", () => {
  const result = createR62BuyerDispositionOperationalFinalDashboardLockdownContract(readyInput);
  const findings = result.readOnlyEnforcementFindings.join(" ");

  assert.match(findings, /advisory labels, counts, status text/i);
  assert.match(findings, /already-loaded dashboard leads/i);
  assert.match(findings, /adds no fetch, localStorage, sessionStorage, polling/i);
  assert.match(findings, /no buttons, links, forms, toggles, menus, handlers/i);
  assert.match(findings, /uiImplementationAllowedNow is true only because/i);
  assertSafety(result);
});

test("R62F locks operational priority and governance boundaries", () => {
  const result = createR62BuyerDispositionOperationalFinalDashboardLockdownContract(readyInput);
  const priority = result.operationalPriorityBoundaryFindings.join(" ");
  const governance = result.governanceStopDominanceFindings.join(" ");

  assert.match(priority, /Disposition priority label is advisory only/i);
  assert.match(priority, /High assignment probability does not mean send/i);
  assert.match(priority, /cannot authorize contact/i);
  assert.match(governance, /Governance stop signals render first/i);
  assert.match(governance, /must be resolved first before revenue priority/i);
  assert.match(governance, /No urgency, package completeness/i);
  assertSafety(result);
});

test("R62F keeps stale-deal, assignment, engagement, demand, and workload labels review-only", () => {
  const result = createR62BuyerDispositionOperationalFinalDashboardLockdownContract(readyInput);

  assert.match(result.staleDealPackageFindings.join(" "), /Stale buyer package and stale deal visibility are review-only/i);
  assert.match(result.staleDealPackageFindings.join(" "), /cannot invent property facts/i);
  assert.match(result.assignmentReadinessFindings.join(" "), /Assignment-readiness review needed is a manual review label only/i);
  assert.match(result.assignmentReadinessFindings.join(" "), /does not mean send/i);
  assert.match(result.buyerEngagementDemandFindings.join(" "), /does not perform autonomous matching/i);
  assert.match(result.workloadPriorityFindings.join(" "), /not an execution queue/i);
  assertSafety(result);
});

test("R62F forbids buyer outreach controls and hidden execution affordances", () => {
  const result = createR62BuyerDispositionOperationalFinalDashboardLockdownContract(readyInput);
  const findings = result.forbiddenControlFindings.join(" ");

  assert.match(findings, /No send-to-buyers, blast-buyers, auto-email/i);
  assert.match(findings, /campaign-launch, buyer-outreach activation/i);
  assert.match(findings, /autonomous matching, autonomous-negotiation/i);
  assert.match(findings, /hidden execution affordance/i);
  assert.ok(result.blockedPatterns.includes("send to buyers"));
  assert.ok(result.blockedPatterns.includes("provider activation"));
  assert.ok(result.blockedPatterns.includes("autonomous buyer matching"));
  assert.ok(result.blockedPatterns.includes("buyer communication execution"));
  assertSafety(result);
});

test("R62F preserves accessibility guarantees", () => {
  const result = createR62BuyerDispositionOperationalFinalDashboardLockdownContract(readyInput);
  const findings = result.accessibilityPreservationFindings.join(" ");

  assert.match(findings, /semantic section with aria-labelledby and aria-describedby/i);
  assert.match(findings, /heading id and summary id match/i);
  assert.match(findings, /readable headings, counts, status text/i);
  assert.match(findings, /do not depend on color alone/i);
  assert.match(findings, /No motion dependency, focus movement, auto-refresh, polling/i);
  assertSafety(result);
});

test("R62F keeps execution boundaries hard-closed", () => {
  const result = createR62BuyerDispositionOperationalFinalDashboardLockdownContract(readyInput);
  const findings = result.executionBoundaryFindings.join(" ");
  const forbidden = result.forbiddenBoundaries.join(" ");

  assert.match(findings, /No buyer outreach, seller outreach, SMS, email, campaigns/i);
  assert.match(findings, /No persistence, polling, runtime activation/i);
  assert.match(findings, /manual-first and advisory-only/i);
  assert.match(forbidden, /No UI redesign or new UI features in R62F/i);
  assert.match(forbidden, /No autonomous buyer matching, autonomous negotiation/i);
  assertSafety(result);
});

test("R62F defines future-safe UI limitations and next phase", () => {
  const result = createR62BuyerDispositionOperationalFinalDashboardLockdownContract(readyInput);

  assert.match(result.futureSafeUiLimitations.join(" "), /existing dashboard placement/i);
  assert.match(result.futureSafeUiLimitations.join(" "), /High assignment probability does not mean send/i);
  assert.match(result.futureSafeUiLimitations.join(" "), /not an execution queue/i);
  assert.match(result.futureSafeUiLimitations.join(" "), /non-autonomous, fail-closed/i);
  assert.equal(result.nextSuggestedPhase, "R63A - Operator Work Queue Intelligence Scope Contract");
  assertSafety(result);
});

test("R62F rejects new UI, provider, sending, campaign, persistence, and automation requests", () => {
  const result = createR62BuyerDispositionOperationalFinalDashboardLockdownContract({
    ...readyInput,
    newUiFeatureRequested: true,
    routeChangeRequested: true,
    runtimeActivationRequested: true,
    providerActivationRequested: true,
    liveSendingRequested: true,
    emailSmsSendingRequested: true,
    buyerOutreachExecutionRequested: true,
    campaignActivationRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    executionControlRequested: true,
    redesignRequested: true,
    autonomousMatchingRequested: true,
    autonomousNegotiationRequested: true,
    autoAssignmentWorkflowRequested: true,
    approvalGrantsExecution: true,
  });

  assert.equal(result.lockdownStatus, "final_lockdown_blocked");
  assert.ok(result.warningCodes.includes("new_ui_feature_rejected"));
  assert.ok(result.warningCodes.includes("route_change_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("buyer_outreach_execution_rejected"));
  assert.ok(result.warningCodes.includes("campaign_activation_rejected"));
  assert.ok(result.warningCodes.includes("automation_agent_rejected"));
  assert.ok(result.warningCodes.includes("polling_rejected"));
  assert.ok(result.warningCodes.includes("persistence_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_matching_rejected"));
  assert.ok(result.warningCodes.includes("auto_assignment_workflow_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R62F rejects unsafe invariant inputs while preserving safe output flags", () => {
  const result = createR62BuyerDispositionOperationalFinalDashboardLockdownContract({
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
    uiImplementationAllowedNow: false,
  });

  assert.equal(result.lockdownStatus, "final_lockdown_blocked");
  assert.ok(result.warningCodes.includes("read_only_required"));
  assert.ok(result.warningCodes.includes("advisory_only_required"));
  assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
  assert.ok(result.warningCodes.includes("sent_must_be_false"));
  assert.ok(result.warningCodes.includes("polling_not_allowed"));
  assert.ok(result.warningCodes.includes("ui_implementation_allowed_now_required"));
  assertSafety(result);
});

test("R62F summary is bounded and closes R62", () => {
  const result = createR62BuyerDispositionOperationalFinalDashboardLockdownContract({
    ...readyInput,
    extraLockdownNotes: ["R62F note".repeat(100)],
  });
  const summary = summarizeR62BuyerDispositionOperationalFinalDashboardLockdown(result);

  assert.ok(summary.length <= 903);
  assert.match(summary, /final dashboard lockdown preserves/i);
  assert.match(summary, /without buyer outreach execution/i);
  assertSafety(result);
});
