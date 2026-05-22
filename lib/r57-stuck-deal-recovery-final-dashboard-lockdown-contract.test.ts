import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR57StuckDealRecoveryFinalLockdownInvariants,
  createR57StuckDealRecoveryFinalDashboardLockdownContract,
  type R57FinalLockdownInput,
  type R57FinalLockdownResult,
} from "./r57-stuck-deal-recovery-final-dashboard-lockdown-contract";

const readyInput: R57FinalLockdownInput = {
  r57aScopeReviewed: true,
  r57bUiScopeReviewed: true,
  r57cImplementationScopeReviewed: true,
  r57dUiImplementationReviewed: true,
  r57eSafetyAccessibilityReviewed: true,
  dashboardSafetyReviewed: true,
  revenuePriorityReviewed: true,
  nextRevenueIntelligenceReviewed: true,
  governanceBoundaryReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
  uiImplementationRequested: false,
  routeChangeRequested: false,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  persistenceRequested: false,
  executionControlRequested: false,
  redesignRequested: false,
  autonomousWorkflowRequested: false,
  approvalGrantsExecution: false,
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

function assertSafety(result: R57FinalLockdownResult) {
  const invariantCheck = assertR57StuckDealRecoveryFinalLockdownInvariants(result);

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
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

describe("R57 stuck-deal recovery final dashboard lockdown contract", () => {
  it("missing default input fails closed into operator review", () => {
    const result = createR57StuckDealRecoveryFinalDashboardLockdownContract();

    assert.equal(result.phase, "R57F");
    assert.equal(result.surface, "stuck_deal_recovery_final_dashboard_lockdown");
    assert.equal(result.lockdownStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("r57a_scope_review_required"));
    assert.ok(result.warningCodes.includes("r57b_ui_scope_review_required"));
    assert.ok(result.warningCodes.includes("r57c_implementation_scope_review_required"));
    assert.ok(result.warningCodes.includes("r57d_ui_implementation_review_required"));
    assert.ok(result.warningCodes.includes("r57e_safety_accessibility_review_required"));
    assert.ok(result.warningCodes.includes("dashboard_safety_review_required"));
    assert.ok(result.warningCodes.includes("revenue_priority_review_required"));
    assert.ok(result.warningCodes.includes("next_revenue_intelligence_review_required"));
    assertSafety(result);
  });

  it("locks the full R57 stack", () => {
    const result = createR57StuckDealRecoveryFinalDashboardLockdownContract(readyInput);
    const stack = result.r57StackReviewFindings.join(" ");

    assert.equal(result.lockdownStatus, "stuck_deal_recovery_dashboard_locked");
    assert.match(stack, /R57A scoped stuck-deal recovery intelligence/i);
    assert.match(stack, /R57B audited future presentation surfaces/i);
    assert.match(stack, /R57C locked the final implementation scope/i);
    assert.match(stack, /R57D implemented the read-only dashboard surface/i);
    assert.match(stack, /R57E reviewed safety, accessibility, and revenue-priority ordering/i);
    assertSafety(result);
  });

  it("confirms dashboard safety and required safety copy", () => {
    const result = createR57StuckDealRecoveryFinalDashboardLockdownContract(readyInput);
    const dashboardSafety = result.dashboardSafetyFindings.join(" ");

    assert.equal(
      result.requiredSafetyCopy,
      "Read-only recovery guidance. No provider called, no message sent, no runtime execution.",
    );
    assert.match(dashboardSafety, /read-only and advisory-only/i);
    assert.match(dashboardSafety, /existing dashboard data only/i);
    assert.match(dashboardSafety, /no fetch, localStorage, sessionStorage, polling/i);
    assert.match(dashboardSafety, /no buttons, click handlers, forms, links, toggles/i);
    assert.match(dashboardSafety, /required safety copy remains exact/i);
    assertSafety(result);
  });

  it("preserves revenue priority ordering and accessibility findings", () => {
    const result = createR57StuckDealRecoveryFinalDashboardLockdownContract(readyInput);
    const revenue = result.revenuePriorityFindings.join(" ");
    const accessibility = result.accessibilityFindings.join(" ");

    assert.match(revenue, /human review first/i);
    assert.match(revenue, /near-close friction/i);
    assert.match(revenue, /overdue follow-up/i);
    assert.match(revenue, /revenue leakage, summary, and safe guidance/i);
    assert.match(accessibility, /semantic section with aria-labelledby/i);
    assert.match(accessibility, /heading id matches/i);
    assert.match(accessibility, /readable text labels/i);
    assert.match(accessibility, /does not depend on color alone/i);
    assert.match(accessibility, /No focus movement/i);
    assertSafety(result);
  });

  it("preserves governance boundaries and hard invariants", () => {
    const result = createR57StuckDealRecoveryFinalDashboardLockdownContract(readyInput);
    const governance = result.governanceBoundaryFindings.join(" ");

    assert.match(governance, /No routes, providers, Twilio, automation-agent, Prisma/i);
    assert.match(governance, /No approval wording grants permission/i);
    assert.match(governance, /No hidden execution affordances/i);
    assert.match(governance, /hard-closed/i);
    assert.match(result.invariantAssertions.join(" "), /Required safety copy must remain exact/i);
    assert.match(result.invariantAssertions.join(" "), /R57 dashboard ordering must remain revenue-priority aligned/i);
    assertSafety(result);
  });

  it("selects near-close revenue recovery intelligence as the next highest ROI phase", () => {
    const result = createR57StuckDealRecoveryFinalDashboardLockdownContract(readyInput);
    const topCandidate = result.candidateRankings[0];

    assert.equal(result.selectedNextPhase, "near_close_revenue_recovery_intelligence");
    assert.equal(topCandidate.phase, "near_close_revenue_recovery_intelligence");
    assert.equal(topCandidate.rank, 1);
    assert.equal(topCandidate.roiScore, 10);
    assert.match(result.selectedNextPhaseReason, /deals closest to cash/i);
    assert.match(topCandidate.allowedPlanningScope, /near-close blockers/i);
    assert.match(topCandidate.boundary, /No closing-ready claims/i);
    assert.equal(result.nextSuggestedPhase, "R58A - Near-Close Revenue Recovery Intelligence Scope Contract");
    assertSafety(result);
  });

  it("ranks all next revenue intelligence candidates deterministically", () => {
    const result = createR57StuckDealRecoveryFinalDashboardLockdownContract(readyInput);

    assert.deepEqual(
      result.candidateRankings.map((candidate) => candidate.phase),
      [
        "near_close_revenue_recovery_intelligence",
        "acquisition_daily_call_priority_intelligence",
        "buyer_ready_disposition_priority_intelligence",
        "manual_operator_work_queue_intelligence",
        "missing_data_revenue_leakage_intelligence",
        "lead_quality_source_intelligence",
      ],
    );
    assert.ok(result.candidateRankings.every((candidate, index) => candidate.rank === index + 1));
    assertSafety(result);
  });

  it("blocks dangerous execution provider recovery and approval semantics", () => {
    const result = createR57StuckDealRecoveryFinalDashboardLockdownContract(readyInput);

    assert.ok(result.blockedPatterns.includes("send now"));
    assert.ok(result.blockedPatterns.includes("auto recover"));
    assert.ok(result.blockedPatterns.includes("auto follow-up"));
    assert.ok(result.blockedPatterns.includes("activate workflow"));
    assert.ok(result.blockedPatterns.includes("bulk recovery"));
    assert.ok(result.blockedPatterns.includes("AI negotiates"));
    assert.ok(result.blockedPatterns.includes("approve and send"));
    assert.ok(result.blockedPatterns.includes("release automation"));
    assert.ok(result.blockedPatterns.includes("start campaign"));
    assert.ok(result.blockedPatterns.includes("retry automatically"));
    assert.ok(result.blockedPatterns.includes("queue execution"));
    assert.ok(result.blockedPatterns.includes("provider activation"));
    assert.ok(result.blockedPatterns.includes("autonomous outreach"));
    assert.ok(result.blockedPatterns.includes("hidden execution affordances"));
    assertSafety(result);
  });

  it("rejects runtime provider sending polling persistence execution redesign and autonomous requests", () => {
    const result = createR57StuckDealRecoveryFinalDashboardLockdownContract({
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
    assertSafety(result);
  });

  it("rejects unsafe invariant inputs while preserving hard output flags", () => {
    const result = createR57StuckDealRecoveryFinalDashboardLockdownContract({
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
      approvalGrantsExecution: true,
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

  it("bounds lockdown notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r57f_lockdown_note_${index}_${"x".repeat(220)}`);
    const result = createR57StuckDealRecoveryFinalDashboardLockdownContract({
      ...readyInput,
      extraLockdownNotes: notes,
    });

    assert.equal(result.lockdownNotes.length, 40);
    assert.ok(result.lockdownNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
