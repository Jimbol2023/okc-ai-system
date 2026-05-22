import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR61BuyerReadyDispositionPriorityScopeInvariants,
  createR61BuyerReadyDispositionPriorityScopeContract,
  summarizeR61BuyerReadyDispositionPriorityScope,
  type R61BuyerReadyDispositionPriorityInput,
  type R61BuyerReadyDispositionPriorityScopeResult,
} from "./r61-buyer-ready-disposition-priority-scope-contract";

const readyInput: R61BuyerReadyDispositionPriorityInput = {
  r60fLockdownReviewed: true,
  buyerReadyPrioritiesReviewed: true,
  dispositionReadinessReviewed: true,
  buyerFitReviewed: true,
  packageCompletenessReviewed: true,
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

function assertSafety(result: R61BuyerReadyDispositionPriorityScopeResult) {
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
  assert.equal(assertR61BuyerReadyDispositionPriorityScopeInvariants(result).passed, true);
}

test("R61A defaults to operator review with hard-closed safety flags", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract();

  assert.equal(result.phase, "R61A");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r61a_scope_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r60f_lockdown_review_required"));
  assertSafety(result);
});

test("R61A defines buyer-ready priority categories", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract(readyInput);

  assert.equal(result.scopeStatus, "buyer_ready_disposition_priority_scope_ready");
  assert.ok(result.buyerReadyPriorityCategories.includes("governance_stop_review"));
  assert.ok(result.buyerReadyPriorityCategories.includes("buyer_ready_disposition_priority"));
  assert.ok(result.buyerReadyPriorityCategories.includes("near_buyer_ready_review"));
  assert.ok(result.buyerReadyPriorityCategories.includes("ready_to_package_deal"));
  assert.ok(result.buyerReadyPriorityCategories.includes("incomplete_buyer_package"));
  assert.ok(result.buyerReadyPriorityCategories.includes("buyer_fit_review_needed"));
  assert.ok(result.buyerReadyPriorityCategories.includes("blocked_buyer_disposition"));
  assert.ok(result.buyerReadyPriorityCategories.includes("manual_disposition_review"));
  assertSafety(result);
});

test("R61A ranks disposition readiness with governance stops first", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract(readyInput);

  assert.deepEqual(
    result.dispositionReadinessConcepts.map((item) => item.rank),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
  assert.equal(result.dispositionReadinessConcepts[0]?.concept, "resolve_governance_stops");
  assert.equal(result.dispositionReadinessConcepts[1]?.concept, "review_buyer_ready_priority");
  assert.match(result.dispositionReadinessConcepts[0]?.revenueReason ?? "", /outrank buyer-readiness or urgency/i);
  assert.match(result.dispositionReadinessConcepts[1]?.safeOperatorGuidance ?? "", /manual review and package preparation/i);
  assert.match(result.dispositionReadinessConcepts[1]?.boundary ?? "", /does not mean send/i);
  assertSafety(result);
});

test("R61A defines buyer-fit review concepts without contact permission", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract(readyInput);

  assert.ok(result.buyerFitReviewConcepts.includes("buyer_fit_review_needed"));
  assert.ok(result.buyerFitReviewConcepts.includes("buyer_demand_alignment_review"));
  assert.ok(result.buyerFitReviewConcepts.includes("high_probability_buyer_review"));
  assert.ok(result.buyerFitReviewConcepts.includes("strategy_match_review"));
  assert.ok(result.buyerFitReviewConcepts.includes("price_band_review"));
  assert.ok(result.buyerFitReviewConcepts.includes("property_type_review"));
  assert.ok(result.buyerFitReviewConcepts.includes("manual_buyer_match_review_only"));
  assert.match(result.dispositionReadinessConcepts[5]?.boundary ?? "", /No autonomous matching, sending, negotiation/i);
  assertSafety(result);
});

test("R61A defines package completeness concepts and missing package data", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract(readyInput);
  const missingData = result.missingBuyerPackageDataConcepts.join(" ");

  assert.ok(result.packageCompletenessConcepts.includes("missing_assignment_data"));
  assert.ok(result.packageCompletenessConcepts.includes("missing_title_data"));
  assert.ok(result.packageCompletenessConcepts.includes("missing_photo_data"));
  assert.ok(result.packageCompletenessConcepts.includes("missing_repair_data"));
  assert.ok(result.packageCompletenessConcepts.includes("missing_arv_data"));
  assert.ok(result.packageCompletenessConcepts.includes("missing_rent_data"));
  assert.ok(result.packageCompletenessConcepts.includes("missing_strategy_data"));
  assert.match(missingData, /Missing assignment data/i);
  assert.match(missingData, /Missing ARV context/i);
  assert.match(missingData, /Missing disposition strategy data/i);
  assertSafety(result);
});

test("R61A defines near-buyer-ready and blocked disposition boundaries", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract(readyInput);

  assert.match(result.nearBuyerReadyConcepts.join(" "), /manual verification gaps/i);
  assert.match(result.nearBuyerReadyConcepts.join(" "), /does not mean buyer-ready-to-contact/i);
  assert.match(result.blockedDispositionConcepts.join(" "), /Governance stop unresolved/i);
  assert.match(result.blockedDispositionConcepts.join(" "), /Buyer-fit assumptions require manual verification/i);
  assert.match(result.blockedDispositionConcepts.join(" "), /human review required/i);
  assertSafety(result);
});

test("R61A keeps safe operator guidance advisory and manual-first", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract(readyInput);
  const guidance = result.safeOperatorGuidanceConcepts.join(" ");

  assert.match(guidance, /manual disposition review recommended/i);
  assert.match(guidance, /operator package-prep guidance/i);
  assert.match(guidance, /buyer-fit review needed/i);
  assert.match(guidance, /governance stop signals must be resolved first/i);
  assert.match(guidance, /Buyer-ready does not mean send/i);
  assert.match(guidance, /does not send, blast, email, SMS, persist, poll, activate providers/i);
  assertSafety(result);
});

test("R61A defines allowed future visibility concepts", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract(readyInput);
  const visibility = result.allowedFutureVisibilityConcepts.join(" ");

  assert.match(visibility, /buyer-ready disposition priority/i);
  assert.match(visibility, /near-buyer-ready review/i);
  assert.match(visibility, /ready-to-package deal/i);
  assert.match(visibility, /incomplete buyer package/i);
  assert.match(visibility, /buyer demand alignment review/i);
  assert.match(visibility, /missing assignment\/title\/photos\/repair\/ARV\/rent\/strategy data/i);
  assert.match(visibility, /governance stop signals/i);
  assertSafety(result);
});

test("R61A blocks forbidden buyer execution semantics", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract(readyInput);

  assert.ok(result.forbiddenExecutionSemantics.includes("send to buyers"));
  assert.ok(result.forbiddenExecutionSemantics.includes("blast buyers"));
  assert.ok(result.forbiddenExecutionSemantics.includes("auto email buyers"));
  assert.ok(result.forbiddenExecutionSemantics.includes("auto SMS buyers"));
  assert.ok(result.forbiddenExecutionSemantics.includes("launch buyer campaign"));
  assert.ok(result.forbiddenExecutionSemantics.includes("activate buyer outreach"));
  assert.ok(result.forbiddenExecutionSemantics.includes("queue buyer execution"));
  assert.ok(result.forbiddenExecutionSemantics.includes("match and send automatically"));
  assert.ok(result.forbiddenExecutionSemantics.includes("execute disposition workflow"));
  assert.ok(result.forbiddenExecutionSemantics.includes("release buyer automation"));
  assert.ok(result.forbiddenExecutionSemantics.includes("autonomous buyer negotiation"));
  assert.ok(result.forbiddenExecutionSemantics.includes("provider activation"));
  assertSafety(result);
});

test("R61A preserves governance, readiness, and accessibility boundaries", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract(readyInput);
  const governance = result.governanceBoundaries.join(" ");
  const readiness = result.readinessBoundaries.join(" ");
  const accessibility = result.accessibilityRequirements.join(" ");

  assert.match(governance, /scope-contract-only/i);
  assert.match(governance, /must always outrank buyer-readiness/i);
  assert.match(governance, /cannot grant permission to contact buyers or send packages/i);
  assert.match(governance, /no property facts may be invented/i);
  assert.match(readiness, /Buyer-ready does not mean send/i);
  assert.match(readiness, /Ready-to-package does not release a buyer package/i);
  assert.match(readiness, /Buyer-fit review does not mean autonomous matching/i);
  assert.match(accessibility, /semantic headings/i);
  assert.match(accessibility, /readable/i);
  assert.match(accessibility, /text-based/i);
  assert.match(accessibility, /never depend on color alone/i);
  assert.match(accessibility, /No motion dependency, focus movement/i);
  assert.match(accessibility, /screen-reader-friendly summaries/i);
  assertSafety(result);
});

test("R61A rejects UI, provider, sending, outreach, persistence, polling, and automation requests", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract({
    ...readyInput,
    uiImplementationRequested: true,
    routeChangeRequested: true,
    runtimeActivationRequested: true,
    providerActivationRequested: true,
    liveSendingRequested: true,
    emailSmsSendingRequested: true,
    buyerOutreachExecutionRequested: true,
    sellerOutreachExecutionRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    executionControlRequested: true,
    redesignRequested: true,
    autonomousBuyerOutreachRequested: true,
    autonomousSellerOutreachRequested: true,
    autonomousNegotiationRequested: true,
    approvalGrantsExecution: true,
  });

  assert.equal(result.scopeStatus, "buyer_ready_disposition_priority_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("route_change_rejected"));
  assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("live_sending_rejected"));
  assert.ok(result.warningCodes.includes("email_sms_sending_rejected"));
  assert.ok(result.warningCodes.includes("buyer_outreach_execution_rejected"));
  assert.ok(result.warningCodes.includes("seller_outreach_execution_rejected"));
  assert.ok(result.warningCodes.includes("automation_agent_rejected"));
  assert.ok(result.warningCodes.includes("polling_rejected"));
  assert.ok(result.warningCodes.includes("persistence_rejected"));
  assert.ok(result.warningCodes.includes("execution_control_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_buyer_outreach_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_seller_outreach_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_negotiation_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R61A rejects unsafe flag inputs while preserving safe output flags", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract({
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

  assert.equal(result.scopeStatus, "buyer_ready_disposition_priority_scope_blocked");
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

test("R61A summary is bounded and points to the next audit phase", () => {
  const result = createR61BuyerReadyDispositionPriorityScopeContract({
    ...readyInput,
    extraScopeNotes: ["R61A note".repeat(100)],
  });
  const summary = summarizeR61BuyerReadyDispositionPriorityScope(result);

  assert.equal(result.nextSuggestedPhase, "R61B - Buyer-Ready Disposition Priority Intelligence UI Scope Audit");
  assert.ok(summary.length <= 903);
  assert.match(summary, /planning-only/i);
  assert.match(summary, /cannot authorize UI, routes, providers, buyer outreach/i);
  assertSafety(result);
});
