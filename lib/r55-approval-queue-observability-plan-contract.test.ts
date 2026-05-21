import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR55ApprovalQueueObservabilityPlanInvariants,
  createR55ApprovalQueueObservabilityPlanContract,
  type R55ApprovalQueueObservabilityPlanInput,
  type R55ApprovalQueueObservabilityPlanResult,
} from "./r55-approval-queue-observability-plan-contract";

const readyInput: R55ApprovalQueueObservabilityPlanInput = {
  scopeReviewed: true,
  approvalSemanticsReviewed: true,
  safetyBoundariesReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
  strongerGovernanceWordingAccepted: true,
  uiImplementationRequested: false,
  routeChangeRequested: false,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  persistenceRequested: false,
  approvalConvertedToPermission: false,
  approvalAsSendRequested: false,
  bulkExecutionRequested: false,
  readyToSendWordingRequested: false,
  queueExecutionWordingRequested: false,
  autoReleaseWordingRequested: false,
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
};

function assertSafety(result: R55ApprovalQueueObservabilityPlanResult) {
  const invariantCheck = assertR55ApprovalQueueObservabilityPlanInvariants(result);

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
  });
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

describe("R55 approval queue observability plan contract", () => {
  it("missing default input fails closed into planning-only review", () => {
    const result = createR55ApprovalQueueObservabilityPlanContract();

    assert.equal(result.surface, "approval_queue_observability");
    assert.equal(result.scopeStatus, "approval_queue_observability_planning_only");
    assert.equal(result.riskClassification, "approval_surface_requires_strong_governance_wording");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("scope_review_required"));
    assert.ok(result.warningCodes.includes("approval_semantics_review_required"));
    assert.ok(result.warningCodes.includes("safety_boundary_review_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assert.ok(result.warningCodes.includes("stronger_governance_wording_required"));
    assertSafety(result);
  });

  it("allows only strict read-only approval queue observability planning later", () => {
    const result = createR55ApprovalQueueObservabilityPlanContract(readyInput);

    assert.equal(result.scopeStatus, "approval_queue_observability_strict_read_only_scope_ready");
    assert.equal(result.riskClassification, "approval_surface_strict_read_only_candidate");
    assert.deepEqual(result.candidateObservabilityItems, [
      "approval_review_backlog_visibility",
      "blocked_state_visibility",
      "governance_review_required_visibility",
      "human_review_required_summary",
      "missing_data_review_indicators",
      "manual_review_reminders",
      "advisory_queue_status_summary",
      "safe_workload_visibility",
    ]);
    assertSafety(result);
  });

  it("treats approval queue as higher risk than lead detail and requires stronger governance wording", () => {
    const result = createR55ApprovalQueueObservabilityPlanContract(readyInput);
    const warnings = result.governanceWarnings.join(" ");
    const risks = result.riskCategoryRankings.map((risk) => risk.category);

    assert.match(warnings, /higher-risk/i);
    assert.match(warnings, /approval-as-permission/i);
    assert.ok(risks.includes("approval_as_permission_drift"));
    assert.ok(risks.includes("execution_proximity"));
    assert.ok(risks.includes("bulk_action_confusion"));
    assert.equal(result.riskCategoryRankings[0].riskLevel, "high");
    assertSafety(result);
  });

  it("blocks unsafe approval semantics and execution-like wording", () => {
    const result = createR55ApprovalQueueObservabilityPlanContract(readyInput);

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
    assert.ok(result.blockedPatterns.includes("queue execution"));
    assert.ok(result.blockedPatterns.includes("auto release"));
    assert.ok(result.blockedPatterns.includes("approval means send"));
    assert.ok(result.blockedPatterns.includes("approval triggers execution"));
    assertSafety(result);
  });

  it("requires copy that approval review does not send or grant permission", () => {
    const result = createR55ApprovalQueueObservabilityPlanContract(readyInput);
    const copy = result.requiredSafetyCopy.join(" ");

    assert.match(copy, /read-only/i);
    assert.match(copy, /Approval review does not send/i);
    assert.match(copy, /Human review remains required/i);
    assert.match(copy, /Provider activation.*blocked/i);
    assert.match(copy, /do-not-proceed/i);
    assert.match(copy, /do not grant permission/i);
    assertSafety(result);
  });

  it("defines accessibility requirements for a future approval queue slice", () => {
    const result = createR55ApprovalQueueObservabilityPlanContract(readyInput);
    const requirements = result.accessibilityRequirements.join(" ");

    assert.match(requirements, /semantic heading/i);
    assert.match(requirements, /execution permission/i);
    assert.match(requirements, /color alone/i);
    assert.match(requirements, /keyboard order/i);
    assert.match(requirements, /motion/i);
    assert.match(requirements, /screen-reader-friendly/i);
    assertSafety(result);
  });

  it("locks implementation boundaries and does not allow UI implementation now", () => {
    const result = createR55ApprovalQueueObservabilityPlanContract(readyInput);

    assert.equal(result.implementationBoundaries.futureCandidateSurface, "app/(dashboard)/dashboard/approvals/page.tsx");
    assert.equal(result.implementationBoundaries.futureAllowedPlacement, "above_approval_queue_client");
    assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
    assert.equal(result.implementationBoundaries.noApprovalBehaviorChanges, true);
    assert.equal(result.implementationBoundaries.noNewRoutes, true);
    assert.equal(result.implementationBoundaries.noMutationControls, true);
    assert.equal(result.implementationBoundaries.noProviderControls, true);
    assert.equal(result.implementationBoundaries.noPolling, true);
    assert.equal(result.implementationBoundaries.noPersistence, true);
    assert.equal(result.implementationBoundaries.noRuntimeExecution, true);
    assert.equal(result.implementationBoundaries.noAutomationAgent, true);
    assert.equal(result.implementationBoundaries.noBulkExecutionControls, true);
    assertSafety(result);
  });

  it("blocks UI route runtime provider sending automation polling persistence and approval permission requests", () => {
    const result = createR55ApprovalQueueObservabilityPlanContract({
      ...readyInput,
      uiImplementationRequested: true,
      routeChangeRequested: true,
      runtimeActivationRequested: true,
      providerActivationRequested: true,
      liveSendingRequested: true,
      automationAgentRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      approvalConvertedToPermission: true,
      approvalAsSendRequested: true,
      bulkExecutionRequested: true,
      readyToSendWordingRequested: true,
      queueExecutionWordingRequested: true,
      autoReleaseWordingRequested: true,
    });

    assert.equal(result.scopeStatus, "approval_queue_observability_plan_blocked");
    assert.equal(result.riskClassification, "approval_surface_high_risk");
    assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
    assert.ok(result.warningCodes.includes("route_change_rejected"));
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("live_sending_rejected"));
    assert.ok(result.warningCodes.includes("automation_agent_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("persistence_rejected"));
    assert.ok(result.warningCodes.includes("approval_as_permission_rejected"));
    assert.ok(result.warningCodes.includes("approval_as_send_rejected"));
    assert.ok(result.warningCodes.includes("bulk_execution_rejected"));
    assert.ok(result.warningCodes.includes("ready_to_send_wording_rejected"));
    assert.ok(result.warningCodes.includes("queue_execution_wording_rejected"));
    assert.ok(result.warningCodes.includes("auto_release_wording_rejected"));
    assertSafety(result);
  });

  it("blocks unsafe safety flags while preserving output invariants", () => {
    const result = createR55ApprovalQueueObservabilityPlanContract({
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
    });

    assert.equal(result.scopeStatus, "approval_queue_observability_plan_blocked");
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
    assertSafety(result);
  });

  it("bounds operator notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r55_approval_queue_note_${index}_${"x".repeat(220)}`);
    const result = createR55ApprovalQueueObservabilityPlanContract({
      ...readyInput,
      extraPlanningNotes: notes,
    });

    assert.equal(result.operatorNotes.length, 40);
    assert.ok(result.operatorNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
