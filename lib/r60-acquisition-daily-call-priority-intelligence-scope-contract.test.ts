import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR60AcquisitionDailyCallPriorityScopeInvariants,
  createR60AcquisitionDailyCallPriorityIntelligenceScopeContract,
  summarizeR60AcquisitionDailyCallPriorityScope,
  type R60AcquisitionDailyCallPriorityInput,
  type R60AcquisitionDailyCallPriorityScopeResult,
} from "./r60-acquisition-daily-call-priority-intelligence-scope-contract";

const readyInput: R60AcquisitionDailyCallPriorityInput = {
  r59fLockdownReviewed: true,
  priorityCategoriesReviewed: true,
  sellerRevenuePrioritiesReviewed: true,
  manualCallReviewPrioritiesReviewed: true,
  leadDecayUrgencyReviewed: true,
  dealReadinessReviewed: true,
  acquisitionBottlenecksReviewed: true,
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

function assertSafety(result: R60AcquisitionDailyCallPriorityScopeResult) {
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
  assert.equal(assertR60AcquisitionDailyCallPriorityScopeInvariants(result).passed, true);
}

test("R60A defaults to operator review with hard-closed safety flags", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract();

  assert.equal(result.phase, "R60A");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r60a_scope_contract_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r59f_lockdown_review_required"));
  assertSafety(result);
});

test("R60A defines acquisition daily call priority categories", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract(readyInput);

  assert.equal(result.scopeStatus, "acquisition_daily_call_priority_scope_ready");
  assert.ok(result.acquisitionDailyCallPriorityCategories.includes("governance_stop_review"));
  assert.ok(result.acquisitionDailyCallPriorityCategories.includes("highest_probability_seller_review"));
  assert.ok(result.acquisitionDailyCallPriorityCategories.includes("urgent_seller_follow_up"));
  assert.ok(result.acquisitionDailyCallPriorityCategories.includes("overdue_manual_follow_up"));
  assert.ok(result.acquisitionDailyCallPriorityCategories.includes("seller_momentum_risk"));
  assert.ok(result.acquisitionDailyCallPriorityCategories.includes("lead_decay_risk"));
  assert.ok(result.acquisitionDailyCallPriorityCategories.includes("missing_acquisition_data"));
  assert.ok(result.acquisitionDailyCallPriorityCategories.includes("deal_readiness_review"));
  assertSafety(result);
});

test("R60A ranks seller-side revenue-priority concepts", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract(readyInput);

  assert.deepEqual(
    result.sellerRevenuePriorityRankingConcepts.map((item) => item.rank),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(result.sellerRevenuePriorityRankingConcepts[0]?.concept, "resolve_governance_stops");
  assert.equal(result.sellerRevenuePriorityRankingConcepts[1]?.concept, "review_high_probability_sellers");
  assert.equal(result.sellerRevenuePriorityRankingConcepts[2]?.concept, "review_urgent_seller_momentum");
  assert.match(result.sellerRevenuePriorityRankingConcepts[3]?.safeManualGuidance ?? "", /Manual call review recommended/i);
  assert.match(result.sellerRevenuePriorityRankingConcepts[7]?.boundary ?? "", /does not authorize seller contact/i);
  assertSafety(result);
});

test("R60A defines manual call and review priority concepts", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract(readyInput);

  assert.ok(result.manualCallReviewPriorityConcepts.includes("manual_call_review_recommended"));
  assert.ok(result.manualCallReviewPriorityConcepts.includes("seller_follow_up_priority"));
  assert.ok(result.manualCallReviewPriorityConcepts.includes("operator_review_recommended"));
  assert.ok(result.manualCallReviewPriorityConcepts.includes("high_priority_seller_review"));
  assert.ok(result.manualCallReviewPriorityConcepts.includes("seller_momentum_risk"));
  assert.ok(result.manualCallReviewPriorityConcepts.includes("lead_decay_risk"));
  assert.ok(result.manualCallReviewPriorityConcepts.includes("missing_acquisition_data"));
  assert.ok(result.manualCallReviewPriorityConcepts.includes("call_priority_label_is_advisory_only"));
  assertSafety(result);
});

test("R60A defines urgency, overdue follow-up, and lead decay concepts", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract(readyInput);

  assert.match(result.sellerUrgencyConcepts.join(" "), /existing seller-provided context/i);
  assert.match(result.sellerUrgencyConcepts.join(" "), /must not pressure sellers/i);
  assert.match(result.overdueFollowUpConcepts.join(" "), /Overdue manual follow-up/i);
  assert.match(result.overdueFollowUpConcepts.join(" "), /cannot dial, text, email/i);
  assert.match(result.staleLeadDecayConcepts.join(" "), /lead decay risk label/i);
  assert.match(result.staleLeadDecayConcepts.join(" "), /cannot launch reactivation campaigns/i);
  assertSafety(result);
});

test("R60A defines motivation, missing data, readiness, and bottleneck concepts", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract(readyInput);

  assert.match(result.highMotivationSellerConcepts.join(" "), /Motivation labels require human verification/i);
  assert.match(result.highMotivationSellerConcepts.join(" "), /No property facts/i);
  assert.match(result.missingSellerPropertyDataConcepts.join(" "), /missing lead source, phone, property address/i);
  assert.match(result.dealReadinessReviewConcepts.join(" "), /does not mean approved to call/i);
  assert.match(result.acquisitionBottleneckConcepts.join(" "), /Seller follow-up overdue/i);
  assert.match(result.acquisitionBottleneckConcepts.join(" "), /No manual next step present/i);
  assertSafety(result);
});

test("R60A defines governance stop signals before call guidance", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract(readyInput);

  assert.match(result.governanceStopSignals.join(" "), /Do-not-contact or opt-out/i);
  assert.match(result.governanceStopSignals.join(" "), /Human-review-required/i);
  assert.match(result.governanceStopSignals.join(" "), /Missing consent or unclear contact permission/i);
  assert.match(result.governanceStopSignals.join(" "), /must appear before seller call priority guidance/i);
  assertSafety(result);
});

test("R60A keeps safe wording advisory and manual-first", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract(readyInput);
  const wording = result.safeManualGuidanceWording.join(" ");

  assert.match(wording, /manual call review recommended/i);
  assert.match(wording, /seller follow-up priority/i);
  assert.match(wording, /operator review recommended/i);
  assert.match(wording, /high-priority seller review/i);
  assert.match(wording, /call priority label is advisory only/i);
  assert.match(wording, /does not call, dial, send, persist, poll, activate providers/i);
  assertSafety(result);
});

test("R60A blocks forbidden call, provider, campaign, and execution semantics", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract(readyInput);

  assert.ok(result.forbiddenExecutionSemantics.includes("call now"));
  assert.ok(result.forbiddenExecutionSemantics.includes("auto call"));
  assert.ok(result.forbiddenExecutionSemantics.includes("auto dial"));
  assert.ok(result.forbiddenExecutionSemantics.includes("send SMS"));
  assert.ok(result.forbiddenExecutionSemantics.includes("send email"));
  assert.ok(result.forbiddenExecutionSemantics.includes("activate campaign"));
  assert.ok(result.forbiddenExecutionSemantics.includes("launch dialer"));
  assert.ok(result.forbiddenExecutionSemantics.includes("provider activation"));
  assert.ok(result.forbiddenExecutionSemantics.includes("execute call workflow"));
  assert.ok(result.forbiddenExecutionSemantics.includes("release automation"));
  assertSafety(result);
});

test("R60A preserves governance and accessibility boundaries", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract(readyInput);
  const governance = result.governanceBoundaries.join(" ");
  const accessibility = result.accessibilityRequirements.join(" ");

  assert.match(governance, /planning-only/i);
  assert.match(governance, /cannot grant permission to call, dial, text, email/i);
  assert.match(governance, /cannot become permission to execute outreach/i);
  assert.match(governance, /no property facts may be invented/i);
  assert.match(accessibility, /semantic headings/i);
  assert.match(accessibility, /readable labels/i);
  assert.match(accessibility, /text-based/i);
  assert.match(accessibility, /never depend on color alone/i);
  assert.match(accessibility, /No motion dependency, focus movement/i);
  assert.match(accessibility, /screen-reader-friendly summaries/i);
  assertSafety(result);
});

test("R60A rejects runtime, provider, call, dialer, campaign, persistence, and automation requests", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract({
    ...readyInput,
    uiImplementationRequested: true,
    routeChangeRequested: true,
    runtimeActivationRequested: true,
    providerActivationRequested: true,
    liveSendingRequested: true,
    callExecutionRequested: true,
    dialerActivationRequested: true,
    campaignActivationRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    executionControlRequested: true,
    redesignRequested: true,
    autonomousWorkflowRequested: true,
    approvalGrantsExecution: true,
  });

  assert.equal(result.scopeStatus, "acquisition_daily_call_priority_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("route_change_rejected"));
  assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("live_sending_rejected"));
  assert.ok(result.warningCodes.includes("call_execution_rejected"));
  assert.ok(result.warningCodes.includes("dialer_activation_rejected"));
  assert.ok(result.warningCodes.includes("campaign_activation_rejected"));
  assert.ok(result.warningCodes.includes("automation_agent_rejected"));
  assert.ok(result.warningCodes.includes("polling_rejected"));
  assert.ok(result.warningCodes.includes("persistence_rejected"));
  assert.ok(result.warningCodes.includes("execution_control_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_workflow_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R60A rejects unsafe flag inputs while preserving safe output flags", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract({
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

  assert.equal(result.scopeStatus, "acquisition_daily_call_priority_scope_blocked");
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

test("R60A summary is bounded and points to the next audit phase", () => {
  const result = createR60AcquisitionDailyCallPriorityIntelligenceScopeContract({
    ...readyInput,
    extraScopeNotes: ["R60A note".repeat(100)],
  });
  const summary = summarizeR60AcquisitionDailyCallPriorityScope(result);

  assert.equal(result.nextSuggestedPhase, "R60B - Acquisition Daily Call Priority Intelligence UI Scope Audit");
  assert.ok(summary.length <= 903);
  assert.match(summary, /planning-only/i);
  assert.match(summary, /cannot authorize UI, routes, providers, calls, dialing/i);
  assertSafety(result);
});
