import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR52ManualRevenueOperatorWorkdayInvariants,
  createR52ManualRevenueOperatorWorkdayContract,
  type R52ManualRevenueOperatorWorkdayInput,
  type R52ManualRevenueOperatorWorkdayResult,
} from "./r52-manual-revenue-operator-workday-contract";

const readyInput: R52ManualRevenueOperatorWorkdayInput = {
  systemReadinessReviewed: true,
  governanceVisibilityReviewed: true,
  highPriorityQueueReviewed: true,
  overdueQueueReviewed: true,
  buyerPipelineReviewed: true,
  revenuePipelineReviewed: true,
  accessibilityUsabilityReviewed: true,
  operatorReviewCompleted: true,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  autonomousExecutionRequested: false,
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

function assertNoExecution(result: R52ManualRevenueOperatorWorkdayResult) {
  const invariantCheck = assertR52ManualRevenueOperatorWorkdayInvariants(result);

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

describe("R52 manual revenue operator workday contract", () => {
  it("missing default input fails closed", () => {
    const result = createR52ManualRevenueOperatorWorkdayContract();

    assert.equal(result.workdayStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("system_readiness_required"));
    assert.ok(result.doNotProceedConditions.length > 0);
    assertNoExecution(result);
  });

  it("ready manual operator workday returns ordered SOP and remains non-executing", () => {
    const result = createR52ManualRevenueOperatorWorkdayContract(readyInput);

    assert.equal(result.workdayStatus, "manual_revenue_workday_ready");
    assert.equal(result.operatorReviewRequired, false);
    assert.equal(result.orderedWorkflow.length, 8);
    assert.deepEqual(
      result.orderedWorkflow.map((step) => step.section),
      [
        "daily_operator_startup",
        "lead_triage",
        "seller_call",
        "follow_up",
        "buyer_review",
        "revenue_pipeline",
        "governance_safety",
        "accessibility_operator_usability",
      ],
    );
    assertNoExecution(result);
  });

  it("missing startup and queue review inputs require operator review", () => {
    const result = createR52ManualRevenueOperatorWorkdayContract({
      ...readyInput,
      systemReadinessReviewed: false,
      governanceVisibilityReviewed: false,
      highPriorityQueueReviewed: false,
      overdueQueueReviewed: false,
    });

    assert.equal(result.workdayStatus, "operator_review_required");
    assert.ok(result.warningCodes.includes("system_readiness_required"));
    assert.ok(result.warningCodes.includes("governance_visibility_required"));
    assert.ok(result.warningCodes.includes("lead_queue_required"));
    assertNoExecution(result);
  });

  it("missing buyer revenue and accessibility reviews require operator review", () => {
    const result = createR52ManualRevenueOperatorWorkdayContract({
      ...readyInput,
      buyerPipelineReviewed: false,
      revenuePipelineReviewed: false,
      accessibilityUsabilityReviewed: false,
      operatorReviewCompleted: false,
    });

    assert.equal(result.workdayStatus, "operator_review_required");
    assert.ok(result.warningCodes.includes("buyer_pipeline_required"));
    assert.ok(result.warningCodes.includes("revenue_pipeline_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertNoExecution(result);
  });

  it("runtime activation provider live sending automation polling and autonomous requests are blocked", () => {
    const result = createR52ManualRevenueOperatorWorkdayContract({
      ...readyInput,
      runtimeActivationRequested: true,
      providerActivationRequested: true,
      liveSendingRequested: true,
      automationAgentRequested: true,
      pollingRequested: true,
      autonomousExecutionRequested: true,
      advisoryConvertedToPermission: true,
    });

    assert.equal(result.workdayStatus, "manual_revenue_workday_blocked");
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("live_sending_rejected"));
    assert.ok(result.warningCodes.includes("automation_agent_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("autonomous_execution_rejected"));
    assert.ok(result.warningCodes.includes("advisory_to_permission_rejected"));
    assertNoExecution(result);
  });

  it("execution indicators are forced false and block the workday", () => {
    const result = createR52ManualRevenueOperatorWorkdayContract({
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

    assert.equal(result.workdayStatus, "manual_revenue_workday_blocked");
    assert.ok(result.warningCodes.includes("activation_executed_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("sent_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
    assert.ok(result.warningCodes.includes("can_send_now_must_be_false"));
    assertNoExecution(result);
  });

  it("simulationOnly false is rejected while output remains simulation-only", () => {
    const result = createR52ManualRevenueOperatorWorkdayContract({
      ...readyInput,
      simulationOnly: false,
    });

    assert.equal(result.workdayStatus, "operator_review_required");
    assert.ok(result.warningCodes.includes("simulation_only_required"));
    assert.equal(result.simulationOnly, true);
    assertNoExecution(result);
  });

  it("future operationalization classifications preserve never-autonomous outbound controls", () => {
    const result = createR52ManualRevenueOperatorWorkdayContract(readyInput);
    const sending = result.futureOperationalization.find((item) => item.workflow === "SMS/email/provider sending");
    const automationAgent = result.futureOperationalization.find((item) => item.workflow === "Automation-agent runtime cycle");

    assert.equal(sending?.classification, "never_autonomous");
    assert.equal(automationAgent?.classification, "never_autonomous");
    assert.ok(result.futureOperationalization.some((item) => item.classification === "safe_manual_now"));
    assertNoExecution(result);
  });

  it("bounded operator notes are enforced", () => {
    const manyNotes = Array.from({ length: 90 }, (_, index) => `note_${index}_${"x".repeat(220)}`);
    const result = createR52ManualRevenueOperatorWorkdayContract({
      ...readyInput,
      extraOperatorNotes: manyNotes,
    });

    assert.equal(result.operatorNotes.length, 40);
    assert.ok(result.operatorNotes.every((note) => note.length <= 183));
    assertNoExecution(result);
  });
});
