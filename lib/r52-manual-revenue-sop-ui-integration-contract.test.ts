import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR52ManualRevenueSopUiIntegrationInvariants,
  createR52ManualRevenueSopUiIntegrationContract,
  type R52ManualRevenueSopUiIntegrationInput,
  type R52ManualRevenueSopUiIntegrationResult,
} from "./r52-manual-revenue-sop-ui-integration-contract";

const readyInput: R52ManualRevenueSopUiIntegrationInput = {
  entryPointsReviewed: true,
  guidancePatternsReviewed: true,
  revenuePresentationReviewed: true,
  governancePresentationReviewed: true,
  accessibilityStrategyReviewed: true,
  operatorReviewCompleted: true,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  workflowMutationRequested: false,
  persistenceActivationRequested: false,
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

function assertNoExecution(result: R52ManualRevenueSopUiIntegrationResult) {
  const invariantCheck = assertR52ManualRevenueSopUiIntegrationInvariants(result);

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

describe("R52 manual revenue SOP UI integration contract", () => {
  it("missing default input fails closed", () => {
    const result = createR52ManualRevenueSopUiIntegrationContract();

    assert.equal(result.uiIntegrationStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("entry_point_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertNoExecution(result);
  });

  it("ready plan returns highest-ROI UI integration entry points", () => {
    const result = createR52ManualRevenueSopUiIntegrationContract(readyInput);

    assert.equal(result.uiIntegrationStatus, "ui_integration_plan_ready");
    assert.equal(result.operatorReviewRequired, false);
    assert.ok(result.entryPointPlan.some((item) => item.entryPoint === "dashboard_overview"));
    assert.ok(result.entryPointPlan.some((item) => item.entryPoint === "lead_detail"));
    assert.ok(result.entryPointPlan.some((item) => item.entryPoint === "approval_queue"));
    assert.ok(result.safeGuidanceTypes.includes("Manual-only banners."));
    assertNoExecution(result);
  });

  it("missing presentation and accessibility reviews require operator review", () => {
    const result = createR52ManualRevenueSopUiIntegrationContract({
      ...readyInput,
      guidancePatternsReviewed: false,
      revenuePresentationReviewed: false,
      governancePresentationReviewed: false,
      accessibilityStrategyReviewed: false,
      operatorReviewCompleted: false,
    });

    assert.equal(result.uiIntegrationStatus, "operator_review_required");
    assert.ok(result.warningCodes.includes("guidance_review_required"));
    assert.ok(result.warningCodes.includes("revenue_presentation_review_required"));
    assert.ok(result.warningCodes.includes("governance_presentation_review_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertNoExecution(result);
  });

  it("runtime provider sending automation polling mutation persistence and permission requests are blocked", () => {
    const result = createR52ManualRevenueSopUiIntegrationContract({
      ...readyInput,
      runtimeActivationRequested: true,
      providerActivationRequested: true,
      liveSendingRequested: true,
      automationAgentRequested: true,
      pollingRequested: true,
      workflowMutationRequested: true,
      persistenceActivationRequested: true,
      advisoryConvertedToPermission: true,
    });

    assert.equal(result.uiIntegrationStatus, "ui_integration_planning_blocked");
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("live_sending_rejected"));
    assert.ok(result.warningCodes.includes("automation_agent_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("workflow_mutation_rejected"));
    assert.ok(result.warningCodes.includes("persistence_activation_rejected"));
    assert.ok(result.warningCodes.includes("advisory_to_permission_rejected"));
    assertNoExecution(result);
  });

  it("dangerous UI patterns identify activation-looking and polling-based risks", () => {
    const result = createR52ManualRevenueSopUiIntegrationContract(readyInput);

    assert.ok(result.dangerousUiPatterns.some((item) => item.pattern === "Activation-looking controls"));
    assert.ok(result.dangerousUiPatterns.some((item) => item.pattern === "Polling-based guidance"));
    assert.ok(result.dangerousUiPatterns.some((item) => item.pattern === "Progress persistence before audit controls"));
    assertNoExecution(result);
  });

  it("revenue presentation avoids auto-contact and auto-stage movement", () => {
    const result = createR52ManualRevenueSopUiIntegrationContract(readyInput);
    const workFirst = result.revenuePriorityPresentation.find((item) => item.guidanceType === "Work-first lead list summary");
    const bottlenecks = result.revenuePriorityPresentation.find((item) => item.guidanceType === "Near-close and bottleneck board");

    assert.ok(workFirst?.safetyConstraint.includes("Must not auto-contact"));
    assert.ok(bottlenecks?.safetyConstraint.includes("no auto-stage movement"));
    assertNoExecution(result);
  });

  it("governance presentation preserves blocked execution flags", () => {
    const result = createR52ManualRevenueSopUiIntegrationContract(readyInput);
    const simulationOnly = result.governanceVisibilityPresentation.find(
      (item) => item.guidanceType === "Simulation-only status",
    );

    assert.ok(simulationOnly?.safetyConstraint.includes("canSendNow false"));
    assert.ok(result.governanceVisibilityPresentation.some((item) => item.guidanceType === "Provider-disabled and runtime-blocked reminders"));
    assertNoExecution(result);
  });

  it("human review preservation keeps provider sending and runtime automation from appearing automated", () => {
    const result = createR52ManualRevenueSopUiIntegrationContract(readyInput);
    const providerRuntime = result.humanReviewPreservation.find(
      (item) => item.workflow === "Provider sending and runtime automation",
    );

    assert.equal(providerRuntime?.classification, "must_never_appear_automated");
    assert.ok(result.humanReviewPreservation.some((item) => item.classification === "must_preserve_human_review"));
    assertNoExecution(result);
  });

  it("execution indicators are forced false and block the plan", () => {
    const result = createR52ManualRevenueSopUiIntegrationContract({
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

    assert.equal(result.uiIntegrationStatus, "ui_integration_planning_blocked");
    assert.ok(result.warningCodes.includes("activation_executed_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("sent_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
    assert.ok(result.warningCodes.includes("can_send_now_must_be_false"));
    assertNoExecution(result);
  });

  it("bounded operator notes are enforced", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `ui_note_${index}_${"x".repeat(220)}`);
    const result = createR52ManualRevenueSopUiIntegrationContract({
      ...readyInput,
      extraUiPlanningNotes: notes,
    });

    assert.equal(result.operatorNotes.length, 40);
    assert.ok(result.operatorNotes.every((note) => note.length <= 183));
    assertNoExecution(result);
  });
});
