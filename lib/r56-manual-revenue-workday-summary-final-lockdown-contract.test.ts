import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR56ManualRevenueWorkdayFinalLockdownInvariants,
  createR56ManualRevenueWorkdayFinalLockdownContract,
  type R56ManualRevenueWorkdayFinalInput,
  type R56ManualRevenueWorkdayFinalResult,
} from "./r56-manual-revenue-workday-summary-final-lockdown-contract";

const readyInput: R56ManualRevenueWorkdayFinalInput = {
  r56bScopeReviewed: true,
  r56cUiScopeReviewed: true,
  r56dUiImplementationReviewed: true,
  r56eSmokeSafetyReviewed: true,
  revenueIntelligenceReviewed: true,
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

function assertSafety(result: R56ManualRevenueWorkdayFinalResult) {
  const invariantCheck = assertR56ManualRevenueWorkdayFinalLockdownInvariants(result);

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

describe("R56 manual revenue workday summary final lockdown contract", () => {
  it("missing default input fails closed into operator review", () => {
    const result = createR56ManualRevenueWorkdayFinalLockdownContract();

    assert.equal(result.phase, "R56F");
    assert.equal(result.surface, "manual_revenue_workday_summary_final_lockdown");
    assert.equal(result.lockdownStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("r56b_scope_review_required"));
    assert.ok(result.warningCodes.includes("r56c_ui_scope_review_required"));
    assert.ok(result.warningCodes.includes("r56d_ui_implementation_review_required"));
    assert.ok(result.warningCodes.includes("r56e_smoke_safety_review_required"));
    assert.ok(result.warningCodes.includes("revenue_intelligence_review_required"));
    assertSafety(result);
  });

  it("locks the manual revenue workday summary stack", () => {
    const result = createR56ManualRevenueWorkdayFinalLockdownContract(readyInput);

    assert.equal(result.lockdownStatus, "manual_revenue_workday_summary_locked");
    assert.match(result.r56StackReviewFindings.join(" "), /R56B scoped manual revenue workday intelligence/i);
    assert.match(result.r56StackReviewFindings.join(" "), /R56C scoped later UI implementation/i);
    assert.match(result.r56StackReviewFindings.join(" "), /R56D implemented a narrow dashboard workday summary/i);
    assert.match(result.r56StackReviewFindings.join(" "), /R56E smoke review confirmed/i);
    assert.match(result.lockdownFindings.join(" "), /read-only revenue intelligence surface/i);
    assert.match(result.lockdownFindings.join(" "), /manual-first operator decisions/i);
    assertSafety(result);
  });

  it("selects stuck-deal recovery intelligence as the highest ROI next phase", () => {
    const result = createR56ManualRevenueWorkdayFinalLockdownContract(readyInput);
    const topCandidate = result.candidateRankings[0];

    assert.equal(result.selectedNextPhase, "stuck_deal_recovery_intelligence");
    assert.equal(topCandidate.phase, "stuck_deal_recovery_intelligence");
    assert.equal(topCandidate.rank, 1);
    assert.equal(topCandidate.roiScore, 10);
    assert.equal(topCandidate.operatorLeverageScore, 10);
    assert.match(result.selectedNextPhaseReason, /active revenue leakage/i);
    assert.match(topCandidate.reason, /revenue leakage/i);
    assert.match(topCandidate.allowedPlanningScope, /stale outcomes/i);
    assert.match(topCandidate.boundary, /No auto-escalation/i);
    assertSafety(result);
  });

  it("ranks all candidate phases deterministically", () => {
    const result = createR56ManualRevenueWorkdayFinalLockdownContract(readyInput);

    assert.deepEqual(
      result.candidateRankings.map((candidate) => candidate.phase),
      [
        "stuck_deal_recovery_intelligence",
        "near_close_revenue_recovery_intelligence",
        "acquisition_daily_call_priority_intelligence",
        "buyer_ready_disposition_priority_intelligence",
        "missing_data_revenue_leakage_intelligence",
      ],
    );
    assert.ok(result.candidateRankings.every((candidate, index) => candidate.rank === index + 1));
    assertSafety(result);
  });

  it("preserves forbidden boundaries and allowed planning scope", () => {
    const result = createR56ManualRevenueWorkdayFinalLockdownContract(readyInput);
    const forbidden = result.forbiddenBoundaries.join(" ");
    const allowed = result.allowedPlanningScope.join(" ");

    assert.match(forbidden, /No UI implementation in R56F/i);
    assert.match(forbidden, /No routes, API calls, server actions, database writes/i);
    assert.match(forbidden, /No execution controls/i);
    assert.match(forbidden, /No autonomous negotiation/i);
    assert.match(allowed, /Review the R56 manual revenue workday summary stack/i);
    assert.match(allowed, /Rank the next high-ROI revenue intelligence candidates/i);
    assert.match(allowed, /Select one next planning phase/i);
    assertSafety(result);
  });

  it("blocks dangerous automation provider execution and approval semantics", () => {
    const result = createR56ManualRevenueWorkdayFinalLockdownContract(readyInput);

    assert.ok(result.blockedPatterns.includes("Start Automation"));
    assert.ok(result.blockedPatterns.includes("Send SMS"));
    assert.ok(result.blockedPatterns.includes("Send Email"));
    assert.ok(result.blockedPatterns.includes("Auto Follow-Up"));
    assert.ok(result.blockedPatterns.includes("Activate Provider"));
    assert.ok(result.blockedPatterns.includes("Run Campaign"));
    assert.ok(result.blockedPatterns.includes("AI Autopilot"));
    assert.ok(result.blockedPatterns.includes("Override Governance"));
    assert.ok(result.blockedPatterns.includes("Persist Metrics"));
    assert.ok(result.blockedPatterns.includes("Approve and Send"));
    assert.ok(result.blockedPatterns.includes("Bulk Approve"));
    assert.ok(result.blockedPatterns.includes("ready to send"));
    assert.ok(result.blockedPatterns.includes("send after approval"));
    assert.ok(result.blockedPatterns.includes("queue execution"));
    assert.ok(result.blockedPatterns.includes("auto release"));
    assert.ok(result.blockedPatterns.includes("bulk send"));
    assert.ok(result.blockedPatterns.includes("autonomous negotiation"));
    assert.ok(result.blockedPatterns.includes("autonomous outreach"));
    assert.ok(result.blockedPatterns.includes("hidden execution affordances"));
    assertSafety(result);
  });

  it("preserves governance and accessibility expectations", () => {
    const result = createR56ManualRevenueWorkdayFinalLockdownContract(readyInput);
    const governance = result.governanceBoundaries.join(" ");
    const accessibility = result.accessibilityFindings.join(" ");

    assert.match(governance, /cannot grant execution permission/i);
    assert.match(governance, /Human review remains required/i);
    assert.match(governance, /do-not-proceed signals/i);
    assert.match(governance, /cannot mutate records or trigger contact/i);
    assert.match(accessibility, /semantic headings/i);
    assert.match(accessibility, /color alone/i);
    assert.match(accessibility, /No focus movement/i);
    assert.match(accessibility, /screen-reader friendly/i);
    assertSafety(result);
  });

  it("rejects runtime provider sending polling persistence execution redesign and autonomous requests", () => {
    const result = createR56ManualRevenueWorkdayFinalLockdownContract({
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
    const result = createR56ManualRevenueWorkdayFinalLockdownContract({
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
    const notes = Array.from({ length: 80 }, (_, index) => `r56f_lockdown_note_${index}_${"x".repeat(220)}`);
    const result = createR56ManualRevenueWorkdayFinalLockdownContract({
      ...readyInput,
      extraLockdownNotes: notes,
    });

    assert.equal(result.lockdownNotes.length, 40);
    assert.ok(result.lockdownNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
