import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR52ManualRevenueSopVisibilityInvariants,
  createR52ManualRevenueSopVisibilityContract,
  type R52ManualRevenueSopVisibilityInput,
  type R52ManualRevenueSopVisibilityResult,
} from "./r52-manual-revenue-sop-visibility-contract";

const readyInput: R52ManualRevenueSopVisibilityInput = {
  sopDoctrineReviewed: true,
  governanceVisibilityReviewed: true,
  revenuePriorityVisibilityReviewed: true,
  accessibilityUsabilityReviewed: true,
  operatorReviewCompleted: true,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  workflowMutationRequested: false,
  advisoryConvertedToPermission: false,
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

function assertNoExecution(result: R52ManualRevenueSopVisibilityResult) {
  const invariantCheck = assertR52ManualRevenueSopVisibilityInvariants(result);

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

describe("R52 manual revenue SOP visibility contract", () => {
  it("missing default input fails closed", () => {
    const result = createR52ManualRevenueSopVisibilityContract();

    assert.equal(result.visibilityStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("sop_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertNoExecution(result);
  });

  it("ready visibility plan returns bounded high-ROI guidance", () => {
    const result = createR52ManualRevenueSopVisibilityContract(readyInput);

    assert.equal(result.visibilityStatus, "visibility_plan_ready");
    assert.equal(result.operatorReviewRequired, false);
    assert.ok(result.sopVisibilityGaps.length > 0);
    assert.ok(result.dashboardGuidancePriorities.some((item) => item.priority === "high_roi"));
    assert.ok(result.revenuePriorityVisibility.some((item) => item.surface === "Highest-value leads"));
    assert.ok(result.highRoiVisibility.includes("Manual-only readiness banner."));
    assertNoExecution(result);
  });

  it("missing governance revenue accessibility and operator reviews require review", () => {
    const result = createR52ManualRevenueSopVisibilityContract({
      ...readyInput,
      governanceVisibilityReviewed: false,
      revenuePriorityVisibilityReviewed: false,
      accessibilityUsabilityReviewed: false,
      operatorReviewCompleted: false,
    });

    assert.equal(result.visibilityStatus, "operator_review_required");
    assert.ok(result.warningCodes.includes("governance_visibility_review_required"));
    assert.ok(result.warningCodes.includes("revenue_priority_review_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertNoExecution(result);
  });

  it("runtime activation provider sending automation polling mutation and permission requests are blocked", () => {
    const result = createR52ManualRevenueSopVisibilityContract({
      ...readyInput,
      runtimeActivationRequested: true,
      providerActivationRequested: true,
      liveSendingRequested: true,
      automationAgentRequested: true,
      pollingRequested: true,
      workflowMutationRequested: true,
      advisoryConvertedToPermission: true,
    });

    assert.equal(result.visibilityStatus, "visibility_planning_blocked");
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("live_sending_rejected"));
    assert.ok(result.warningCodes.includes("automation_agent_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("workflow_mutation_rejected"));
    assert.ok(result.warningCodes.includes("advisory_to_permission_rejected"));
    assertNoExecution(result);
  });

  it("execution indicators are forced false and block the visibility plan", () => {
    const result = createR52ManualRevenueSopVisibilityContract({
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

    assert.equal(result.visibilityStatus, "visibility_planning_blocked");
    assert.ok(result.warningCodes.includes("activation_executed_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("sent_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
    assert.ok(result.warningCodes.includes("can_send_now_must_be_false"));
    assertNoExecution(result);
  });

  it("human review classifications keep provider sending and automation never autonomous", () => {
    const result = createR52ManualRevenueSopVisibilityContract(readyInput);
    const providerRuntime = result.humanReviewPreservation.find(
      (item) => item.workflow === "Provider sending and runtime automation",
    );

    assert.equal(providerRuntime?.classification, "never_autonomous");
    assert.ok(result.humanReviewPreservation.some((item) => item.classification === "always_human_review"));
    assert.ok(result.humanReviewPreservation.some((item) => item.classification === "eventually_assisted_with_review"));
    assertNoExecution(result);
  });

  it("visibility candidates reject noisy overbuilt surfaces", () => {
    const result = createR52ManualRevenueSopVisibilityContract(readyInput);

    assert.ok(result.dashboardGuidancePriorities.some((item) => item.priority === "avoid_noise"));
    assert.ok(result.overbuildWarnings.some((warning) => warning.includes("activate") || warning.includes("activation")));
    assertNoExecution(result);
  });

  it("bounded operator notes are enforced", () => {
    const notes = Array.from({ length: 75 }, (_, index) => `visibility_note_${index}_${"x".repeat(220)}`);
    const result = createR52ManualRevenueSopVisibilityContract({
      ...readyInput,
      extraVisibilityNotes: notes,
    });

    assert.equal(result.operatorNotes.length, 40);
    assert.ok(result.operatorNotes.every((note) => note.length <= 183));
    assertNoExecution(result);
  });
});
