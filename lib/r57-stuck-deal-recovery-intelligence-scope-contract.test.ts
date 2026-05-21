import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR57StuckDealRecoveryScopeInvariants,
  createR57StuckDealRecoveryIntelligenceScopeContract,
  type R57StuckDealRecoveryInput,
  type R57StuckDealRecoveryScopeResult,
} from "./r57-stuck-deal-recovery-intelligence-scope-contract";

const readyInput: R57StuckDealRecoveryInput = {
  r56fLockdownReviewed: true,
  stuckDealCategoriesReviewed: true,
  revenueLeakageReviewed: true,
  manualRecoveryPrioritiesReviewed: true,
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

function assertSafety(result: R57StuckDealRecoveryScopeResult) {
  const invariantCheck = assertR57StuckDealRecoveryScopeInvariants(result);

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

describe("R57 stuck-deal recovery intelligence scope contract", () => {
  it("missing default input fails closed into operator review", () => {
    const result = createR57StuckDealRecoveryIntelligenceScopeContract();

    assert.equal(result.phase, "R57A");
    assert.equal(result.surface, "stuck_deal_recovery_intelligence");
    assert.equal(result.scopeStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("r56f_lockdown_review_required"));
    assert.ok(result.warningCodes.includes("stuck_deal_category_review_required"));
    assert.ok(result.warningCodes.includes("revenue_leakage_review_required"));
    assert.ok(result.warningCodes.includes("manual_recovery_priority_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertSafety(result);
  });

  it("defines stuck-deal detection categories", () => {
    const result = createR57StuckDealRecoveryIntelligenceScopeContract(readyInput);

    assert.equal(result.scopeStatus, "stuck_deal_recovery_scope_ready");
    assert.deepEqual(result.stuckDealDetectionCategories, [
      "stale_seller_outcome",
      "overdue_manual_follow_up",
      "missing_next_manual_step",
      "missing_critical_data",
      "blocked_governance_state",
      "dnc_or_opt_out_blocked",
      "buyer_readiness_blocker",
      "near_close_friction",
      "human_review_required",
      "unclear_disposition_path",
    ]);
    assertSafety(result);
  });

  it("defines revenue leakage reasons across acquisition follow-up buyer readiness and near-close friction", () => {
    const result = createR57StuckDealRecoveryIntelligenceScopeContract(readyInput);

    assert.ok(result.revenueLeakageReasons.includes("seller_momentum_loss"));
    assert.ok(result.revenueLeakageReasons.includes("follow_up_discipline_gap"));
    assert.ok(result.revenueLeakageReasons.includes("buyer_package_incomplete"));
    assert.ok(result.revenueLeakageReasons.includes("near_close_blocker_unresolved"));
    assert.ok(result.revenueLeakageReasons.includes("deal_stage_ambiguity"));
    assert.match(result.summary, /revenue leakage reasons/i);
    assertSafety(result);
  });

  it("ranks manual recovery priorities around revenue protection", () => {
    const result = createR57StuckDealRecoveryIntelligenceScopeContract(readyInput);

    assert.deepEqual(
      result.manualRecoveryPriorities.map((priority) => priority.priority),
      [
        "resolve_stop_signals_first",
        "recover_near_close_motion",
        "complete_overdue_manual_follow_up",
        "fill_missing_revenue_data",
        "clarify_buyer_readiness",
        "assign_manual_next_step",
      ],
    );
    assert.ok(result.manualRecoveryPriorities.every((priority, index) => priority.rank === index + 1));
    assert.match(result.manualRecoveryPriorities[0].boundary, /No override, send, provider/i);
    assert.match(result.manualRecoveryPriorities[2].boundary, /No automatic outreach/i);
    assertSafety(result);
  });

  it("captures blocked deal overdue follow-up missing data buyer readiness and near-close signals", () => {
    const result = createR57StuckDealRecoveryIntelligenceScopeContract(readyInput);

    assert.match(result.blockedDealPatterns.join(" "), /DNC or opt-out risk/i);
    assert.match(result.overdueFollowUpPatterns.join(" "), /past the operator reference date/i);
    assert.match(result.missingDataBlockers.join(" "), /Missing lead source/i);
    assert.match(result.buyerReadinessBlockers.join(" "), /Buyer package is incomplete/i);
    assert.match(result.nearCloseFrictionSignals.join(" "), /Near-close lead lacks current seller outcome/i);
    assert.match(result.humanReviewRequiredRecoveryItems.join(" "), /DNC, opt-out, and governance review/i);
    assertSafety(result);
  });

  it("uses safe manual next-action language only", () => {
    const result = createR57StuckDealRecoveryIntelligenceScopeContract(readyInput);
    const nextActions = result.safeManualNextActionLanguage.join(" ");

    assert.match(nextActions, /Review stuck deals manually/i);
    assert.match(nextActions, /Call sellers manually outside the app only after confirming governance/i);
    assert.match(nextActions, /Complete missing source, contact, motivation, timeline, outcome, or buyer package data manually/i);
    assert.match(nextActions, /do not share or send from this scope/i);
    assertSafety(result);
  });

  it("blocks execution provider outreach persistence polling and approval semantics", () => {
    const result = createR57StuckDealRecoveryIntelligenceScopeContract(readyInput);

    assert.ok(result.forbiddenExecutionSemantics.includes("Start Automation"));
    assert.ok(result.forbiddenExecutionSemantics.includes("Send SMS"));
    assert.ok(result.forbiddenExecutionSemantics.includes("Send Email"));
    assert.ok(result.forbiddenExecutionSemantics.includes("Auto Follow-Up"));
    assert.ok(result.forbiddenExecutionSemantics.includes("Activate Provider"));
    assert.ok(result.forbiddenExecutionSemantics.includes("Run Campaign"));
    assert.ok(result.forbiddenExecutionSemantics.includes("AI Autopilot"));
    assert.ok(result.forbiddenExecutionSemantics.includes("Override Governance"));
    assert.ok(result.forbiddenExecutionSemantics.includes("Persist Metrics"));
    assert.ok(result.forbiddenExecutionSemantics.includes("Approve and Send"));
    assert.ok(result.forbiddenExecutionSemantics.includes("Bulk Approve"));
    assert.ok(result.forbiddenExecutionSemantics.includes("ready to send"));
    assert.ok(result.forbiddenExecutionSemantics.includes("send after approval"));
    assert.ok(result.forbiddenExecutionSemantics.includes("auto recovery"));
    assert.ok(result.forbiddenExecutionSemantics.includes("auto escalation"));
    assertSafety(result);
  });

  it("preserves governance boundaries and accessibility expectations", () => {
    const result = createR57StuckDealRecoveryIntelligenceScopeContract(readyInput);
    const governance = result.governanceBoundaries.join(" ");
    const accessibility = result.accessibilityExpectations.join(" ");

    assert.match(governance, /planning-only and cannot execute/i);
    assert.match(governance, /cannot grant permission to contact/i);
    assert.match(governance, /not execution-ready/i);
    assert.match(governance, /do-not-proceed signals/i);
    assert.match(governance, /must not invent property facts/i);
    assert.match(accessibility, /semantic headings/i);
    assert.match(accessibility, /color alone/i);
    assert.match(accessibility, /cognitive load/i);
    assert.match(accessibility, /No focus movement/i);
    assertSafety(result);
  });

  it("rejects runtime provider sending polling persistence execution redesign and autonomous requests", () => {
    const result = createR57StuckDealRecoveryIntelligenceScopeContract({
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

    assert.equal(result.scopeStatus, "stuck_deal_recovery_scope_blocked");
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
    const result = createR57StuckDealRecoveryIntelligenceScopeContract({
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

    assert.equal(result.scopeStatus, "stuck_deal_recovery_scope_blocked");
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

  it("bounds scope notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r57a_scope_note_${index}_${"x".repeat(220)}`);
    const result = createR57StuckDealRecoveryIntelligenceScopeContract({
      ...readyInput,
      extraScopeNotes: notes,
    });

    assert.equal(result.scopeNotes.length, 40);
    assert.ok(result.scopeNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
