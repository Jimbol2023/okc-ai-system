import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR61BuyerReadyDispositionPriorityFinalLockdownInvariants,
  createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract,
  summarizeR61BuyerReadyDispositionPriorityFinalDashboardLockdown,
  type R61FinalLockdownInput,
  type R61FinalLockdownResult,
} from "./r61-buyer-ready-disposition-priority-final-dashboard-lockdown-contract";

const readyInput: R61FinalLockdownInput = {
  r61aScopeReviewed: true,
  r61bUiScopeReviewed: true,
  r61cImplementationScopeReviewed: true,
  r61dUiImplementationReviewed: true,
  r61eSafetyAccessibilityReviewed: true,
  dashboardSafetyReviewed: true,
  readOnlyReviewed: true,
  buyerReadyBoundaryReviewed: true,
  governanceStopDominanceReviewed: true,
  packagePrepReviewed: true,
  buyerFitReviewed: true,
  demandAlignmentReviewed: true,
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

function assertSafety(result: R61FinalLockdownResult) {
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
  assert.equal(assertR61BuyerReadyDispositionPriorityFinalLockdownInvariants(result).passed, true);
}

test("R61F defaults to operator review with UI allowed now and execution closed", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract();

  assert.equal(result.phase, "R61F");
  assert.equal(result.lockdownStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r61f_final_dashboard_lockdown_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r61a_scope_review_required"));
  assertSafety(result);
});

test("R61F locks the full R61 stack when reviews are present", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract(readyInput);

  assert.equal(result.lockdownStatus, "buyer_ready_disposition_priority_dashboard_locked");
  assert.equal(result.operatorReviewRequired, false);
  assert.equal(result.r61StackReviewFindings.length, 5);
  assert.match(result.r61StackReviewFindings.join(" "), /R61A scoped/i);
  assert.match(result.r61StackReviewFindings.join(" "), /R61D implemented/i);
  assert.match(result.r61StackReviewFindings.join(" "), /R61E reviewed/i);
  assertSafety(result);
});

test("R61F enforces read-only dashboard behavior", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract(readyInput);
  const findings = result.readOnlyEnforcementFindings.join(" ");

  assert.match(findings, /advisory labels, counts, package gap summaries/i);
  assert.match(findings, /already-loaded dashboard leads/i);
  assert.match(findings, /adds no fetch, localStorage, sessionStorage, polling/i);
  assert.match(findings, /no buttons, links, forms, toggles, menus, handlers/i);
  assert.match(findings, /uiImplementationAllowedNow is true only because/i);
  assertSafety(result);
});

test("R61F locks buyer-ready boundaries", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract(readyInput);
  const findings = result.buyerReadyBoundaryFindings.join(" ");

  assert.match(findings, /Buyer-ready label is advisory only/i);
  assert.match(findings, /Buyer-ready does not mean send/i);
  assert.match(findings, /manual review and package preparation/i);
  assert.match(findings, /cannot grant permission to contact buyers/i);
  assert.match(findings, /cannot become permission to send, blast, queue/i);
  assertSafety(result);
});

test("R61F preserves governance-stop dominance", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract(readyInput);
  const findings = result.governanceStopDominanceFindings.join(" ");

  assert.match(findings, /Governance stop signals render first/i);
  assert.match(findings, /must be resolved first before buyer-ready/i);
  assert.match(findings, /Do-not-contact, rejected approval, and human-review states/i);
  assert.match(findings, /No buyer-ready urgency, package completeness/i);
  assertSafety(result);
});

test("R61F keeps package-prep, buyer-fit, and demand alignment review-only", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract(readyInput);
  const packagePrep = result.packagePrepFindings.join(" ");
  const fitDemand = result.buyerFitAndDemandAlignmentFindings.join(" ");

  assert.match(packagePrep, /Package-prep priority is review-only/i);
  assert.match(packagePrep, /assignment, title, photos, repair, ARV, rent, or strategy/i);
  assert.match(packagePrep, /Ready-to-package does not release a package/i);
  assert.match(fitDemand, /Buyer-fit review needed is a manual review label only/i);
  assert.match(fitDemand, /Buyer demand alignment review is advisory/i);
  assert.match(fitDemand, /cannot become autonomous matching/i);
  assertSafety(result);
});

test("R61F forbids buyer outreach controls and hidden execution affordances", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract(readyInput);
  const findings = result.forbiddenControlFindings.join(" ");

  assert.match(findings, /No send-to-buyers, blast-buyers, auto-email/i);
  assert.match(findings, /campaign-launch, buyer-outreach activation/i);
  assert.match(findings, /workflow-execution, release-automation/i);
  assert.match(findings, /hidden execution affordance/i);
  assert.ok(result.blockedPatterns.includes("send to buyers"));
  assert.ok(result.blockedPatterns.includes("provider activation"));
  assert.ok(result.blockedPatterns.includes("autonomous buyer negotiation"));
  assertSafety(result);
});

test("R61F preserves accessibility guarantees", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract(readyInput);
  const findings = result.accessibilityPreservationFindings.join(" ");

  assert.match(findings, /semantic section with aria-labelledby and aria-describedby/i);
  assert.match(findings, /heading id and summary id match/i);
  assert.match(findings, /readable headings, counts, status text/i);
  assert.match(findings, /do not depend on color alone/i);
  assert.match(findings, /No motion dependency, focus movement, auto-refresh, polling/i);
  assertSafety(result);
});

test("R61F keeps execution boundaries hard-closed", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract(readyInput);
  const findings = result.executionBoundaryFindings.join(" ");
  const forbidden = result.forbiddenBoundaries.join(" ");

  assert.match(findings, /No buyer outreach, seller outreach, SMS, email, campaigns/i);
  assert.match(findings, /No persistence, polling, runtime activation/i);
  assert.match(findings, /manual-first and advisory-only/i);
  assert.match(forbidden, /No UI redesign or new UI features in R61F/i);
  assert.match(forbidden, /No autonomous buyer matching, autonomous negotiation/i);
  assertSafety(result);
});

test("R61F defines future-safe UI limitations and next phase", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract(readyInput);

  assert.match(result.futureSafeUiLimitations.join(" "), /existing dashboard placement/i);
  assert.match(result.futureSafeUiLimitations.join(" "), /buyer-ready does not mean send/i);
  assert.match(result.futureSafeUiLimitations.join(" "), /non-autonomous, fail-closed/i);
  assert.equal(result.nextSuggestedPhase, "R62A - Buyer Disposition Operational Intelligence Scope Contract");
  assertSafety(result);
});

test("R61F rejects new UI, provider, sending, campaign, persistence, and automation requests", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract({
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
    approvalGrantsExecution: true,
  });

  assert.equal(result.lockdownStatus, "final_lockdown_blocked");
  assert.ok(result.warningCodes.includes("new_ui_feature_rejected"));
  assert.ok(result.warningCodes.includes("route_change_rejected"));
  assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("live_sending_rejected"));
  assert.ok(result.warningCodes.includes("email_sms_sending_rejected"));
  assert.ok(result.warningCodes.includes("buyer_outreach_execution_rejected"));
  assert.ok(result.warningCodes.includes("campaign_activation_rejected"));
  assert.ok(result.warningCodes.includes("automation_agent_rejected"));
  assert.ok(result.warningCodes.includes("polling_rejected"));
  assert.ok(result.warningCodes.includes("persistence_rejected"));
  assert.ok(result.warningCodes.includes("execution_control_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_matching_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_negotiation_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R61F rejects unsafe invariant inputs while returning safe output flags", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract({
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
  assert.ok(result.warningCodes.includes("simulation_only_required"));
  assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
  assert.ok(result.warningCodes.includes("sent_must_be_false"));
  assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
  assert.ok(result.warningCodes.includes("polling_not_allowed"));
  assert.ok(result.warningCodes.includes("runtime_activation_not_allowed"));
  assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
  assert.ok(result.warningCodes.includes("ui_implementation_allowed_now_required"));
  assertSafety(result);
});

test("R61F summary remains bounded and lockdown-only", () => {
  const result = createR61BuyerReadyDispositionPriorityFinalDashboardLockdownContract({
    ...readyInput,
    extraLockdownNotes: ["R61F note".repeat(100)],
  });
  const summary = summarizeR61BuyerReadyDispositionPriorityFinalDashboardLockdown(result);

  assert.ok(summary.length <= 903);
  assert.match(summary, /completed read-only dashboard UI/i);
  assert.match(summary, /cannot authorize redesign, new UI features, routes/i);
  assertSafety(result);
});
