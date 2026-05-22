import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR58NearCloseRevenueRecoveryScopeInvariants,
  createR58NearCloseRevenueRecoveryIntelligenceScopeContract,
  type R58NearCloseRevenueRecoveryInput,
  type R58NearCloseRevenueRecoveryScopeResult,
} from "./r58-near-close-revenue-recovery-intelligence-scope-contract";

const readyInput: R58NearCloseRevenueRecoveryInput = {
  r57fLockdownReviewed: true,
  nearCloseCategoriesReviewed: true,
  revenueRecoverySignalsReviewed: true,
  closingFrictionReviewed: true,
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

function assertSafety(result: R58NearCloseRevenueRecoveryScopeResult) {
  const invariantCheck = assertR58NearCloseRevenueRecoveryScopeInvariants(result);

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

describe("R58 near-close revenue recovery intelligence scope contract", () => {
  it("missing default input fails closed into operator review", () => {
    const result = createR58NearCloseRevenueRecoveryIntelligenceScopeContract();

    assert.equal(result.phase, "R58A");
    assert.equal(result.surface, "near_close_revenue_recovery_intelligence");
    assert.equal(result.scopeStatus, "operator_review_required");
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("r57f_lockdown_review_required"));
    assert.ok(result.warningCodes.includes("near_close_categories_review_required"));
    assert.ok(result.warningCodes.includes("revenue_recovery_signal_review_required"));
    assert.ok(result.warningCodes.includes("closing_friction_review_required"));
    assert.ok(result.warningCodes.includes("manual_recovery_priority_review_required"));
    assertSafety(result);
  });

  it("defines near-close categories and revenue recovery signals", () => {
    const result = createR58NearCloseRevenueRecoveryIntelligenceScopeContract(readyInput);

    assert.equal(result.scopeStatus, "near_close_recovery_scope_ready");
    assert.ok(result.nearCloseDealCategories.includes("assignment_ready_but_blocked"));
    assert.ok(result.nearCloseDealCategories.includes("title_or_escrow_blocked"));
    assert.ok(result.nearCloseDealCategories.includes("stale_closing_timeline"));
    assert.ok(result.revenueRecoverySignals.includes("closest_to_cash_stage"));
    assert.ok(result.revenueRecoverySignals.includes("revenue_leakage_before_closing"));
    assert.ok(result.revenueRecoverySignals.includes("title_escrow_or_checklist_gap"));
    assertSafety(result);
  });

  it("captures closing assignment seller buyer title document and timeline blockers", () => {
    const result = createR58NearCloseRevenueRecoveryIntelligenceScopeContract(readyInput);

    assert.match(result.closingFrictionReasons.join(" "), /Closing checklist is incomplete/i);
    assert.match(result.assignmentFrictionReasons.join(" "), /Assignment path is unclear/i);
    assert.match(result.sellerSideBlockers.join(" "), /Seller response or signature is pending/i);
    assert.match(result.buyerSideBlockers.join(" "), /Buyer package is incomplete/i);
    assert.match(result.titleEscrowChecklistBlockers.join(" "), /Title status is missing/i);
    assert.match(result.missingDocumentBlockers.join(" "), /Missing assignment agreement review/i);
    assert.match(result.staleTimelineRisks.join(" "), /stale relative to the near-close stage/i);
    assertSafety(result);
  });

  it("ranks manual recovery priorities for deals closest to cash", () => {
    const result = createR58NearCloseRevenueRecoveryIntelligenceScopeContract(readyInput);

    assert.deepEqual(
      result.manualRecoveryPriorities.map((priority) => priority.priority),
      [
        "resolve_stop_signals_first",
        "recover_title_or_escrow_path",
        "complete_closing_checklist_review",
        "confirm_assignment_readiness",
        "recover_seller_side_response",
        "complete_buyer_package_review",
        "resolve_missing_documents",
        "refresh_stale_timeline",
      ],
    );
    assert.ok(result.manualRecoveryPriorities.every((priority, index) => priority.rank === index + 1));
    assert.match(result.manualRecoveryPriorities[1].boundary, /No title order, escrow trigger/i);
    assertSafety(result);
  });

  it("defines safe manual next-action wording and governance boundaries", () => {
    const result = createR58NearCloseRevenueRecoveryIntelligenceScopeContract(readyInput);
    const wording = result.safeManualNextActionWording.join(" ");
    const governance = result.governanceBoundaries.join(" ");

    assert.match(wording, /Review near-close blockers manually/i);
    assert.match(wording, /not closing readiness or execution permission/i);
    assert.match(wording, /Label assumptions clearly/i);
    assert.match(governance, /planning-only and cannot execute/i);
    assert.match(governance, /does not mean closing-ready/i);
    assert.match(governance, /cannot grant permission/i);
    assertSafety(result);
  });

  it("blocks forbidden execution semantics and preserves accessibility expectations", () => {
    const result = createR58NearCloseRevenueRecoveryIntelligenceScopeContract(readyInput);

    assert.ok(result.forbiddenExecutionSemantics.includes("send now"));
    assert.ok(result.forbiddenExecutionSemantics.includes("auto recover"));
    assert.ok(result.forbiddenExecutionSemantics.includes("auto follow-up"));
    assert.ok(result.forbiddenExecutionSemantics.includes("activate workflow"));
    assert.ok(result.forbiddenExecutionSemantics.includes("approve and send"));
    assert.ok(result.forbiddenExecutionSemantics.includes("queue execution"));
    assert.ok(result.forbiddenExecutionSemantics.includes("provider activation"));
    assert.ok(result.forbiddenExecutionSemantics.includes("autonomous outreach"));
    assert.ok(result.forbiddenExecutionSemantics.includes("autonomous negotiation"));
    assert.ok(result.forbiddenExecutionSemantics.includes("runtime execution"));
    assert.ok(result.forbiddenExecutionSemantics.includes("persistence activation"));
    assert.ok(result.forbiddenExecutionSemantics.includes("polling activation"));
    assert.match(result.accessibilityExpectations.join(" "), /semantic headings/i);
    assert.match(result.accessibilityExpectations.join(" "), /color alone/i);
    assertSafety(result);
  });

  it("rejects runtime provider sending polling persistence execution redesign and autonomous requests", () => {
    const result = createR58NearCloseRevenueRecoveryIntelligenceScopeContract({
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

    assert.equal(result.scopeStatus, "near_close_recovery_scope_blocked");
    assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("persistence_rejected"));
    assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
    assertSafety(result);
  });

  it("rejects unsafe invariant inputs while preserving hard output flags", () => {
    const result = createR58NearCloseRevenueRecoveryIntelligenceScopeContract({
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

    assert.equal(result.scopeStatus, "near_close_recovery_scope_blocked");
    assert.ok(result.warningCodes.includes("read_only_required"));
    assert.ok(result.warningCodes.includes("advisory_only_required"));
    assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
    assert.ok(result.warningCodes.includes("ui_implementation_not_allowed_now"));
    assertSafety(result);
  });

  it("exposes invariant assertions and bounds scope notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r58a_scope_note_${index}_${"x".repeat(220)}`);
    const result = createR58NearCloseRevenueRecoveryIntelligenceScopeContract({
      ...readyInput,
      extraScopeNotes: notes,
    });

    assert.match(result.invariantAssertions.join(" "), /readOnly must remain true/i);
    assert.match(result.invariantAssertions.join(" "), /uiImplementationAllowedNow must remain false/i);
    assert.equal(result.scopeNotes.length, 40);
    assert.ok(result.scopeNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
