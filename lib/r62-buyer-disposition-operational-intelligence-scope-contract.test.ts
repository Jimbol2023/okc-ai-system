import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR62BuyerDispositionOperationalScopeInvariants,
  createR62BuyerDispositionOperationalIntelligenceScopeContract,
  summarizeR62BuyerDispositionOperationalScope,
  type R62BuyerDispositionOperationalInput,
  type R62BuyerDispositionOperationalScopeResult,
} from "./r62-buyer-disposition-operational-intelligence-scope-contract";

const readyInput: R62BuyerDispositionOperationalInput = {
  r61fLockdownReviewed: true,
  operationalCategoriesReviewed: true,
  staleDealReviewed: true,
  assignmentReadinessReviewed: true,
  buyerEngagementReviewed: true,
  dispositionBottleneckReviewed: true,
  workloadPrioritizationReviewed: true,
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

function assertSafety(result: R62BuyerDispositionOperationalScopeResult) {
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
  assert.equal(assertR62BuyerDispositionOperationalScopeInvariants(result).passed, true);
}

test("R62A defaults to operator review with hard-closed safety flags", () => {
  const result = createR62BuyerDispositionOperationalIntelligenceScopeContract();

  assert.equal(result.phase, "R62A");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r62a_scope_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r61f_lockdown_review_required"));
  assertSafety(result);
});

test("R62A defines buyer disposition operational categories", () => {
  const result = createR62BuyerDispositionOperationalIntelligenceScopeContract(readyInput);

  assert.equal(result.scopeStatus, "buyer_disposition_operational_scope_ready");
  assert.ok(result.operationalCategories.includes("governance_stop_visibility"));
  assert.ok(result.operationalCategories.includes("revenue_priority_disposition_review"));
  assert.ok(result.operationalCategories.includes("high_likelihood_assignment_review"));
  assert.ok(result.operationalCategories.includes("assignment_readiness_review"));
  assert.ok(result.operationalCategories.includes("buyer_response_probability_review"));
  assert.ok(result.operationalCategories.includes("stale_deal_visibility"));
  assert.ok(result.operationalCategories.includes("disposition_workload_prioritization"));
  assert.ok(result.operationalCategories.includes("manual_buyer_review_guidance"));
  assertSafety(result);
});

test("R62A ranks operational concepts with governance stops first", () => {
  const result = createR62BuyerDispositionOperationalIntelligenceScopeContract(readyInput);

  assert.deepEqual(
    result.operationalRankingConcepts.map((item) => item.rank),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  );
  assert.equal(result.operationalRankingConcepts[0]?.concept, "resolve_governance_stops");
  assert.equal(result.operationalRankingConcepts[1]?.concept, "review_revenue_priority_disposition");
  assert.match(result.operationalRankingConcepts[0]?.revenueReason ?? "", /outrank readiness, urgency, stale status/i);
  assert.match(result.operationalRankingConcepts[12]?.boundary ?? "", /Buyer-ready does not mean send/i);
  assertSafety(result);
});

test("R62A defines stale-deal and assignment-readiness concepts", () => {
  const result = createR62BuyerDispositionOperationalIntelligenceScopeContract(readyInput);

  assert.ok(result.staleDealConcepts.includes("stale_package_detection"));
  assert.ok(result.staleDealConcepts.includes("stale_deal_visibility"));
  assert.ok(result.staleDealConcepts.includes("buyer_activity_freshness_review"));
  assert.ok(result.staleDealConcepts.includes("disposition_pipeline_stagnation_review"));
  assert.ok(result.assignmentReadinessConcepts.includes("assignment_readiness_review"));
  assert.ok(result.assignmentReadinessConcepts.includes("high_likelihood_assignment_review"));
  assert.ok(result.assignmentReadinessConcepts.includes("assignment_risk_review"));
  assert.ok(result.assignmentReadinessConcepts.includes("manual_assignment_review_only"));
  assertSafety(result);
});

test("R62A defines buyer engagement and bottleneck concepts", () => {
  const result = createR62BuyerDispositionOperationalIntelligenceScopeContract(readyInput);

  assert.ok(result.buyerEngagementReviewConcepts.includes("buyer_response_probability_review"));
  assert.ok(result.buyerEngagementReviewConcepts.includes("buyer_engagement_quality_review"));
  assert.ok(result.buyerEngagementReviewConcepts.includes("buyer_demand_mismatch_visibility"));
  assert.ok(result.buyerEngagementReviewConcepts.includes("manual_buyer_review_guidance"));
  assert.ok(result.dispositionBottleneckConcepts.includes("governance_stop_visibility"));
  assert.ok(result.dispositionBottleneckConcepts.includes("blocked_disposition_visibility"));
  assert.ok(result.dispositionBottleneckConcepts.includes("disposition_workload_prioritization"));
  assertSafety(result);
});

test("R62A preserves governance boundaries and workload limits", () => {
  const result = createR62BuyerDispositionOperationalIntelligenceScopeContract(readyInput);
  const governance = result.governanceBoundaries.join(" ");
  const workload = result.workloadPrioritizationConcepts.join(" ");

  assert.match(governance, /scope-contract-only/i);
  assert.match(governance, /must always outrank urgency, buyer readiness/i);
  assert.match(governance, /Buyer-ready means manual review/i);
  assert.match(governance, /cannot become permission to contact buyers/i);
  assert.match(governance, /no property, buyer, assignment, demand, or package facts may be invented/i);
  assert.match(workload, /manual operator attention, not execution/i);
  assert.match(workload, /not an outbound queue/i);
  assert.match(workload, /cannot assign work, mutate tasks, persist state, poll/i);
  assertSafety(result);
});

test("R62A defines safe guidance and forbidden execution semantics", () => {
  const result = createR62BuyerDispositionOperationalIntelligenceScopeContract(readyInput);
  const guidance = result.safeOperatorGuidanceWording.join(" ");

  assert.match(guidance, /manual buyer-review guidance/i);
  assert.match(guidance, /revenue-priority disposition review/i);
  assert.match(guidance, /stale deal visibility/i);
  assert.match(guidance, /Buyer-ready does not mean send/i);
  assert.ok(result.forbiddenExecutionSemantics.includes("send to buyers"));
  assert.ok(result.forbiddenExecutionSemantics.includes("blast buyers"));
  assert.ok(result.forbiddenExecutionSemantics.includes("autonomous buyer matching"));
  assert.ok(result.forbiddenExecutionSemantics.includes("buyer communication execution"));
  assert.ok(result.forbiddenExecutionSemantics.includes("auto assignment workflow"));
  assertSafety(result);
});

test("R62A preserves deterministic and accessibility requirements", () => {
  const result = createR62BuyerDispositionOperationalIntelligenceScopeContract(readyInput);
  const invariants = result.deterministicInvariants.join(" ");
  const accessibility = result.accessibilityRequirements.join(" ");

  assert.match(invariants, /readOnly must remain true/i);
  assert.match(invariants, /uiImplementationAllowedNow must remain false in R62A/i);
  assert.match(invariants, /Governance stop signals must rank first/i);
  assert.match(invariants, /deterministic, bounded, explainable, fail-closed/i);
  assert.match(accessibility, /semantic headings/i);
  assert.match(accessibility, /predictable reading order/i);
  assert.match(accessibility, /never depend on color alone/i);
  assert.match(accessibility, /No motion dependency, focus movement, polling/i);
  assertSafety(result);
});

test("R62A classifies pre-implementation audit findings", () => {
  const result = createR62BuyerDispositionOperationalIntelligenceScopeContract(readyInput);
  const classifications = result.preImplementationAuditFindings.map((finding) => finding.classification);
  const findings = result.preImplementationAuditFindings.map((finding) => finding.finding).join(" ");

  assert.ok(classifications.includes("Required before implementation"));
  assert.ok(classifications.includes("Safe to include now"));
  assert.ok(classifications.includes("Future upgrade"));
  assert.ok(classifications.includes("Optional optimization"));
  assert.ok(classifications.includes("Forbidden because it violates governance"));
  assert.match(findings, /Audit execution drift/i);
  assert.match(findings, /Scope stale package, stale deal/i);
  assert.match(findings, /Provider activation, buyer communication execution/i);
  assertSafety(result);
});

test("R62A rejects UI, provider, outreach, campaign, persistence, polling, and automation requests", () => {
  const result = createR62BuyerDispositionOperationalIntelligenceScopeContract({
    ...readyInput,
    uiImplementationRequested: true,
    routeChangeRequested: true,
    runtimeActivationRequested: true,
    providerActivationRequested: true,
    liveSendingRequested: true,
    emailSmsSendingRequested: true,
    buyerOutreachExecutionRequested: true,
    campaignLaunchRequested: true,
    buyerCommunicationExecutionRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    executionControlRequested: true,
    redesignRequested: true,
    autonomousMatchingRequested: true,
    autonomousBuyerOutreachRequested: true,
    autonomousNegotiationRequested: true,
    autoAssignmentWorkflowRequested: true,
    approvalGrantsExecution: true,
  });

  assert.equal(result.scopeStatus, "buyer_disposition_operational_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("route_change_rejected"));
  assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("email_sms_sending_rejected"));
  assert.ok(result.warningCodes.includes("buyer_outreach_execution_rejected"));
  assert.ok(result.warningCodes.includes("campaign_launch_rejected"));
  assert.ok(result.warningCodes.includes("buyer_communication_execution_rejected"));
  assert.ok(result.warningCodes.includes("automation_agent_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_matching_rejected"));
  assert.ok(result.warningCodes.includes("auto_assignment_workflow_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R62A rejects unsafe flag inputs while preserving safe output flags", () => {
  const result = createR62BuyerDispositionOperationalIntelligenceScopeContract({
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

  assert.equal(result.scopeStatus, "buyer_disposition_operational_scope_blocked");
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

test("R62A summary is bounded and points to UI scope audit", () => {
  const result = createR62BuyerDispositionOperationalIntelligenceScopeContract({
    ...readyInput,
    extraScopeNotes: ["R62A note".repeat(100)],
  });
  const summary = summarizeR62BuyerDispositionOperationalScope(result);

  assert.equal(result.nextSuggestedPhase, "R62B - Buyer Disposition Operational Intelligence UI Scope Audit");
  assert.ok(summary.length <= 903);
  assert.match(summary, /planning-only/i);
  assert.match(summary, /cannot authorize UI, routes, providers, buyer communication/i);
  assertSafety(result);
});
