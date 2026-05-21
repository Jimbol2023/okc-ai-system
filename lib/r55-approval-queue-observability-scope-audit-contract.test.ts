import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR55ApprovalQueueScopeAuditInvariants,
  createR55ApprovalQueueObservabilityScopeAuditContract,
  type R55ApprovalQueueScopeAuditInput,
  type R55ApprovalQueueScopeAuditResult,
} from "./r55-approval-queue-observability-scope-audit-contract";

const readyInput: R55ApprovalQueueScopeAuditInput = {
  safeScopeReviewed: true,
  safeDataReviewed: true,
  wordingReviewed: true,
  actionPatternsReviewed: true,
  operatorReviewCompleted: true,
  manualReviewSemanticsAccepted: true,
  accessibilityReviewed: true,
  uiImplementationRequested: false,
  approvalBehaviorChangeRequested: false,
  routeChangeRequested: false,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  persistenceRequested: false,
  approvalConvertedToPermission: false,
  approvalAsSendRequested: false,
  sendAfterApprovalRequested: false,
  readyToSendWordingRequested: false,
  queueExecutionWordingRequested: false,
  autoReleaseWordingRequested: false,
  bulkApproveRequested: false,
  bulkSendRequested: false,
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  liveExecutionAllowed: false,
  providerActivationAllowed: false,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  uiImplementationAllowedNow: false,
  approvalGrantsExecution: false,
};

function assertSafety(result: R55ApprovalQueueScopeAuditResult) {
  const invariantCheck = assertR55ApprovalQueueScopeAuditInvariants(result);

  assert.equal(result.readOnly, true);
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.providerCalled, false);
  assert.equal(result.sent, false);
  assert.equal(result.persistenceAllowedNow, false);
  assert.equal(result.pollingAllowed, false);
  assert.equal(result.runtimeActivationAllowed, false);
  assert.equal(result.uiImplementationAllowedNow, false);
  assert.equal(result.approvalGrantsExecution, false);
  assert.deepEqual(result.safetyFlags, {
    readOnly: true,
    advisoryOnly: true,
    simulationOnly: true,
    liveExecutionAllowed: false,
    providerActivationAllowed: false,
    providerCalled: false,
    sent: false,
    persistenceAllowedNow: false,
    pollingAllowed: false,
    runtimeActivationAllowed: false,
    uiImplementationAllowedNow: false,
    approvalGrantsExecution: false,
  });
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

describe("R55 approval queue observability scope audit contract", () => {
  it("missing default input fails closed into scope review", () => {
    const result = createR55ApprovalQueueObservabilityScopeAuditContract();

    assert.equal(result.surface, "approval_queue_observability");
    assert.equal(result.scopeStatus, "approval_queue_scope_requires_review");
    assert.equal(result.riskLevel, "elevated");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("safe_scope_review_required"));
    assert.ok(result.warningCodes.includes("safe_data_review_required"));
    assert.ok(result.warningCodes.includes("wording_review_required"));
    assert.ok(result.warningCodes.includes("action_pattern_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assert.ok(result.warningCodes.includes("manual_review_semantics_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assertSafety(result);
  });

  it("locks the maximum future read-only scope when all reviews are accepted", () => {
    const result = createR55ApprovalQueueObservabilityScopeAuditContract(readyInput);

    assert.equal(result.scopeStatus, "approval_queue_scope_locked_for_future_read_only_ui");
    assert.deepEqual(result.allowedReadOnlyItems, [
      "review_backlog_count_status",
      "blocked_state_visibility",
      "governance_review_required_visibility",
      "human_review_required_summaries",
      "missing_data_review_indicators",
      "manual_review_reminders",
      "advisory_queue_workload_visibility",
      "review_reason_summaries",
      "safety_reason_summaries",
      "non_actionable_queue_classification",
    ]);
    assertSafety(result);
  });

  it("identifies only safe read-only approval queue data", () => {
    const result = createR55ApprovalQueueObservabilityScopeAuditContract(readyInput);
    const sourceShapes = result.safeDataFindings.map((finding) => finding.sourceShape).join(" ");
    const boundaries = result.safeDataFindings.map((finding) => finding.requiredBoundary).join(" ");

    assert.match(sourceShapes, /approvalStatus/i);
    assert.match(sourceShapes, /requiresHumanApproval/i);
    assert.match(sourceShapes, /doNotContact/i);
    assert.match(sourceShapes, /propertyAddress/i);
    assert.match(boundaries, /Never describe backlog as executable/i);
    assert.match(boundaries, /must not create mutation shortcuts/i);
    assert.match(boundaries, /No polling, persistence, or background refresh/i);
    assertSafety(result);
  });

  it("blocks approval wording and action-like semantics", () => {
    const result = createR55ApprovalQueueObservabilityScopeAuditContract(readyInput);

    assert.ok(result.blockedSemantics.includes("Start Automation"));
    assert.ok(result.blockedSemantics.includes("Send SMS"));
    assert.ok(result.blockedSemantics.includes("Send Email"));
    assert.ok(result.blockedSemantics.includes("Auto Follow-Up"));
    assert.ok(result.blockedSemantics.includes("Activate Provider"));
    assert.ok(result.blockedSemantics.includes("Run Campaign"));
    assert.ok(result.blockedSemantics.includes("AI Autopilot"));
    assert.ok(result.blockedSemantics.includes("Override Governance"));
    assert.ok(result.blockedSemantics.includes("Persist Metrics"));
    assert.ok(result.blockedSemantics.includes("Approve and Send"));
    assert.ok(result.blockedSemantics.includes("Bulk Approve"));
    assert.ok(result.blockedSemantics.includes("ready to send"));
    assert.ok(result.blockedSemantics.includes("send after approval"));
    assert.ok(result.blockedSemantics.includes("queue execution"));
    assert.ok(result.blockedSemantics.includes("auto release"));
    assert.ok(result.blockedSemantics.includes("bulk send"));
    assert.ok(result.blockedSemantics.includes("approval means send"));
    assert.ok(result.blockedSemantics.includes("approval grants permission"));
    assertSafety(result);
  });

  it("distinguishes review required from permission granted", () => {
    const result = createR55ApprovalQueueObservabilityScopeAuditContract(readyInput);
    const copy = result.requiredSafetyCopy.join(" ");
    const rules = result.approvalWordingRules.map((rule) => `${rule.allowedLanguage} ${rule.blockedLanguage}`).join(" ");

    assert.match(copy, /Review required means operator review is needed/i);
    assert.match(copy, /does not grant execution permission/i);
    assert.match(copy, /Approval status does not send/i);
    assert.match(rules, /Review required before/i);
    assert.match(rules, /Approval grants permission to execute/i);
    assert.match(rules, /Approve and send/i);
    assertSafety(result);
  });

  it("preserves governance boundaries for future UI only under strict constraints", () => {
    const result = createR55ApprovalQueueObservabilityScopeAuditContract(readyInput);
    const boundaries = result.governanceBoundaries.join(" ");

    assert.match(boundaries, /after this scope is locked/i);
    assert.match(boundaries, /must not change approval behavior/i);
    assert.match(boundaries, /separate observability from existing approval controls/i);
    assert.match(boundaries, /must not add routes/i);
    assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
    assert.equal(result.implementationBoundaries.noApprovalBehaviorChanges, true);
    assert.equal(result.implementationBoundaries.noMutationControls, true);
    assert.equal(result.implementationBoundaries.noBulkApprove, true);
    assert.equal(result.implementationBoundaries.noBulkSend, true);
    assert.equal(result.implementationBoundaries.noApprovalAsPermission, true);
    assertSafety(result);
  });

  it("defines accessibility scope for any later approval queue observability", () => {
    const result = createR55ApprovalQueueObservabilityScopeAuditContract(readyInput);
    const accessibility = result.accessibilityRequirements.join(" ");

    assert.match(accessibility, /semantic heading/i);
    assert.match(accessibility, /execution permission/i);
    assert.match(accessibility, /color alone/i);
    assert.match(accessibility, /keyboard order/i);
    assert.match(accessibility, /focus movement/i);
    assert.match(accessibility, /screen-reader-friendly/i);
    assertSafety(result);
  });

  it("rejects implementation behavior runtime provider polling persistence and dangerous wording requests", () => {
    const result = createR55ApprovalQueueObservabilityScopeAuditContract({
      ...readyInput,
      uiImplementationRequested: true,
      approvalBehaviorChangeRequested: true,
      routeChangeRequested: true,
      runtimeActivationRequested: true,
      providerActivationRequested: true,
      liveSendingRequested: true,
      automationAgentRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      approvalConvertedToPermission: true,
      approvalAsSendRequested: true,
      sendAfterApprovalRequested: true,
      readyToSendWordingRequested: true,
      queueExecutionWordingRequested: true,
      autoReleaseWordingRequested: true,
      bulkApproveRequested: true,
      bulkSendRequested: true,
    });

    assert.equal(result.scopeStatus, "approval_queue_scope_blocked");
    assert.equal(result.riskLevel, "high");
    assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
    assert.ok(result.warningCodes.includes("approval_behavior_change_rejected"));
    assert.ok(result.warningCodes.includes("route_change_rejected"));
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("live_sending_rejected"));
    assert.ok(result.warningCodes.includes("automation_agent_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("persistence_rejected"));
    assert.ok(result.warningCodes.includes("approval_as_permission_rejected"));
    assert.ok(result.warningCodes.includes("approval_as_send_rejected"));
    assert.ok(result.warningCodes.includes("send_after_approval_rejected"));
    assert.ok(result.warningCodes.includes("ready_to_send_wording_rejected"));
    assert.ok(result.warningCodes.includes("queue_execution_wording_rejected"));
    assert.ok(result.warningCodes.includes("auto_release_wording_rejected"));
    assert.ok(result.warningCodes.includes("bulk_approve_rejected"));
    assert.ok(result.warningCodes.includes("bulk_send_rejected"));
    assertSafety(result);
  });

  it("rejects unsafe safety flags while preserving hard output invariants", () => {
    const result = createR55ApprovalQueueObservabilityScopeAuditContract({
      ...readyInput,
      readOnly: false,
      advisoryOnly: false,
      simulationOnly: false,
      liveExecutionAllowed: true,
      providerActivationAllowed: true,
      providerCalled: true,
      sent: true,
      persistenceAllowedNow: true,
      pollingAllowed: true,
      runtimeActivationAllowed: true,
      uiImplementationAllowedNow: true,
      approvalGrantsExecution: true,
    });

    assert.equal(result.scopeStatus, "approval_queue_scope_blocked");
    assert.ok(result.warningCodes.includes("read_only_required"));
    assert.ok(result.warningCodes.includes("advisory_only_required"));
    assert.ok(result.warningCodes.includes("simulation_only_required"));
    assert.ok(result.warningCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
    assert.ok(result.warningCodes.includes("sent_must_be_false"));
    assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
    assert.ok(result.warningCodes.includes("polling_not_allowed"));
    assert.ok(result.warningCodes.includes("runtime_activation_not_allowed"));
    assert.ok(result.warningCodes.includes("ui_implementation_not_allowed_now"));
    assert.ok(result.warningCodes.includes("approval_grants_execution_must_be_false"));
    assertSafety(result);
  });

  it("bounds audit notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r55b_scope_note_${index}_${"x".repeat(220)}`);
    const result = createR55ApprovalQueueObservabilityScopeAuditContract({
      ...readyInput,
      extraAuditNotes: notes,
    });

    assert.equal(result.auditNotes.length, 40);
    assert.ok(result.auditNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
