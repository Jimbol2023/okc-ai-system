import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR52ApprovalQueueManualRevenueSopScopeInvariants,
  createR52ApprovalQueueManualRevenueSopScopeContract,
  type R52ApprovalQueueManualRevenueSopScopeInput,
  type R52ApprovalQueueManualRevenueSopScopeResult,
} from "./r52-approval-queue-manual-revenue-sop-scope-contract";

const readyInput: R52ApprovalQueueManualRevenueSopScopeInput = {
  placementReviewed: true,
  contentScopeReviewed: true,
  implementationBoundaryReviewed: true,
  accessibilityRequirementsReviewed: true,
  validationPlanReviewed: true,
  operatorReviewCompleted: true,
  uiMutationRequested: false,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  workflowMutationRequested: false,
  persistenceActivationRequested: false,
  advisoryConvertedToPermission: false,
  bulkApprovalRequested: false,
  activationExecuted: false,
  providerActivationAllowed: false,
  liveExecutionAllowed: false,
  sent: false,
  providerCalled: false,
  canSendNow: false,
  simulationOnly: true,
  liveTestReady: false,
  persistenceAllowedNow: false,
};

function assertNoExecution(result: R52ApprovalQueueManualRevenueSopScopeResult) {
  const invariantCheck = assertR52ApprovalQueueManualRevenueSopScopeInvariants(result);

  assert.equal(result.activationExecuted, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.sent, false);
  assert.equal(result.providerCalled, false);
  assert.equal(result.canSendNow, false);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.liveTestReady, false);
  assert.equal(result.persistenceAllowedNow, false);
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

describe("R52 approval queue manual revenue SOP scope contract", () => {
  it("missing default input fails closed", () => {
    const result = createR52ApprovalQueueManualRevenueSopScopeContract();

    assert.equal(result.scopeStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("placement_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertNoExecution(result);
  });

  it("selects the top of approval queue page as the first placement", () => {
    const result = createR52ApprovalQueueManualRevenueSopScopeContract(readyInput);

    assert.equal(result.scopeStatus, "approval_queue_scope_ready");
    assert.equal(result.firstApprovalQueuePlacement, "top_of_approval_queue_page");
    assert.equal(result.implementationBoundary.allowedFile, "app/(dashboard)/dashboard/approvals/page.tsx");
    assert.equal(result.implementationBoundary.allowedPlacement, "top_of_approval_queue_page");
    assertNoExecution(result);
  });

  it("defines exact read-only approval queue content scope for R52P", () => {
    const result = createR52ApprovalQueueManualRevenueSopScopeContract(readyInput);

    assert.deepEqual(result.readOnlyContentScope, [
      "approval_is_review_only",
      "approval_does_not_send",
      "provider_disabled_reminder",
      "manual_follow_up_reminder",
      "do_not_proceed_conditions",
      "dnc_opt_out_warning",
      "missing_critical_data_warning",
      "human_review_required",
    ]);
    assertNoExecution(result);
  });

  it("implementation boundary preserves existing approval behavior and blocks new route and provider capability", () => {
    const result = createR52ApprovalQueueManualRevenueSopScopeContract(readyInput);

    assert.equal(result.implementationBoundary.noNewRoutes, true);
    assert.equal(result.implementationBoundary.noNewMutationBehavior, true);
    assert.equal(result.implementationBoundary.existingApprovalBehaviorUnchanged, true);
    assert.equal(result.implementationBoundary.noProviderControls, true);
    assert.equal(result.implementationBoundary.noPolling, true);
    assert.equal(result.implementationBoundary.noPersistence, true);
    assertNoExecution(result);
  });

  it("dangerous exclusions include approval queue send automation provider and bulk approval language", () => {
    const result = createR52ApprovalQueueManualRevenueSopScopeContract(readyInput);

    assert.ok(result.dangerousExclusions.includes("Send SMS"));
    assert.ok(result.dangerousExclusions.includes("Send Email"));
    assert.ok(result.dangerousExclusions.includes("Auto Follow-Up"));
    assert.ok(result.dangerousExclusions.includes("Start Automation"));
    assert.ok(result.dangerousExclusions.includes("Activate Provider"));
    assert.ok(result.dangerousExclusions.includes("AI Autopilot"));
    assert.ok(result.dangerousExclusions.includes("Override Governance"));
    assert.ok(result.dangerousExclusions.includes("Persist SOP Progress"));
    assert.ok(result.dangerousExclusions.includes("Auto-contact seller"));
    assert.ok(result.dangerousExclusions.includes("Auto-share with buyer"));
    assert.ok(result.dangerousExclusions.includes("Approve and Send"));
    assert.ok(result.dangerousExclusions.includes("Bulk Approve"));
    assertNoExecution(result);
  });

  it("missing scope reviews require operator review", () => {
    const result = createR52ApprovalQueueManualRevenueSopScopeContract({
      ...readyInput,
      contentScopeReviewed: false,
      implementationBoundaryReviewed: false,
      accessibilityRequirementsReviewed: false,
      validationPlanReviewed: false,
      operatorReviewCompleted: false,
    });

    assert.equal(result.scopeStatus, "operator_review_required");
    assert.ok(result.warningCodes.includes("content_scope_review_required"));
    assert.ok(result.warningCodes.includes("implementation_boundary_review_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assert.ok(result.warningCodes.includes("validation_plan_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertNoExecution(result);
  });

  it("runtime provider sending automation polling persistence mutation permission and bulk approval requests are blocked", () => {
    const result = createR52ApprovalQueueManualRevenueSopScopeContract({
      ...readyInput,
      uiMutationRequested: true,
      runtimeActivationRequested: true,
      providerActivationRequested: true,
      liveSendingRequested: true,
      automationAgentRequested: true,
      pollingRequested: true,
      workflowMutationRequested: true,
      persistenceActivationRequested: true,
      advisoryConvertedToPermission: true,
      bulkApprovalRequested: true,
    });

    assert.equal(result.scopeStatus, "approval_queue_scope_blocked");
    assert.ok(result.warningCodes.includes("ui_mutation_rejected"));
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("live_sending_rejected"));
    assert.ok(result.warningCodes.includes("automation_agent_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("workflow_mutation_rejected"));
    assert.ok(result.warningCodes.includes("persistence_activation_rejected"));
    assert.ok(result.warningCodes.includes("advisory_to_permission_rejected"));
    assert.ok(result.warningCodes.includes("bulk_approval_rejected"));
    assertNoExecution(result);
  });

  it("validation plan checks build diff isolation automation-agent providers polling and approval-not-sending copy", () => {
    const result = createR52ApprovalQueueManualRevenueSopScopeContract(readyInput);
    const checks = result.r52pValidationPlan.map((item) => item.check).join(" ");

    assert.match(checks, /build/i);
    assert.match(checks, /exact diff/i);
    assert.match(checks, /automation-agent/i);
    assert.match(checks, /provider/i);
    assert.match(checks, /polling/i);
    assert.match(checks, /UI copy/i);
    assertNoExecution(result);
  });

  it("execution indicators are forced false and block the scope", () => {
    const result = createR52ApprovalQueueManualRevenueSopScopeContract({
      ...readyInput,
      activationExecuted: true,
      providerActivationAllowed: true,
      liveExecutionAllowed: true,
      sent: true,
      providerCalled: true,
      canSendNow: true,
      liveTestReady: true,
      persistenceAllowedNow: true,
    });

    assert.equal(result.scopeStatus, "approval_queue_scope_blocked");
    assert.ok(result.warningCodes.includes("activation_executed_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("sent_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
    assert.ok(result.warningCodes.includes("can_send_now_must_be_false"));
    assertNoExecution(result);
  });

  it("bounded operator notes are enforced", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `approval_scope_note_${index}_${"x".repeat(220)}`);
    const result = createR52ApprovalQueueManualRevenueSopScopeContract({
      ...readyInput,
      extraScopeNotes: notes,
    });

    assert.equal(result.operatorNotes.length, 40);
    assert.ok(result.operatorNotes.every((note) => note.length <= 183));
    assertNoExecution(result);
  });
});
