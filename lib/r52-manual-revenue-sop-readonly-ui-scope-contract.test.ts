import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR52ManualRevenueSopReadonlyUiScopeInvariants,
  createR52ManualRevenueSopReadonlyUiScopeContract,
  type R52ManualRevenueSopReadonlyUiScopeInput,
  type R52ManualRevenueSopReadonlyUiScopeResult,
} from "./r52-manual-revenue-sop-readonly-ui-scope-contract";

const readyInput: R52ManualRevenueSopReadonlyUiScopeInput = {
  firstSurfaceReviewed: true,
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

function assertNoExecution(result: R52ManualRevenueSopReadonlyUiScopeResult) {
  const invariantCheck = assertR52ManualRevenueSopReadonlyUiScopeInvariants(result);

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

describe("R52 manual revenue SOP read-only UI scope contract", () => {
  it("missing default input fails closed", () => {
    const result = createR52ManualRevenueSopReadonlyUiScopeContract();

    assert.equal(result.scopeStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("first_surface_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertNoExecution(result);
  });

  it("selects dashboard overview as the single first UI target", () => {
    const result = createR52ManualRevenueSopReadonlyUiScopeContract(readyInput);

    assert.equal(result.scopeStatus, "readonly_ui_scope_ready");
    assert.equal(result.firstUiTarget, "dashboard_overview");
    assert.equal(result.implementationBoundary.allowedFile, "components/dashboard/system-health-safety-bar.tsx");
    assert.equal(result.implementationBoundary.allowedSurface, "dashboard_overview");
    assertNoExecution(result);
  });

  it("defines the exact read-only content scope for R52J", () => {
    const result = createR52ManualRevenueSopReadonlyUiScopeContract(readyInput);

    assert.deepEqual(result.readOnlyContentScope, [
      "manual_only_reminder",
      "next_safe_manual_action",
      "do_not_proceed_conditions",
      "governance_blocked_state",
      "simulation_only_reminder",
      "missing_data_warning",
      "human_review_required_reminder",
    ]);
    assertNoExecution(result);
  });

  it("implementation boundary prohibits routes mutation controls providers polling and persistence", () => {
    const result = createR52ManualRevenueSopReadonlyUiScopeContract(readyInput);

    assert.equal(result.implementationBoundary.noNewRoutes, true);
    assert.equal(result.implementationBoundary.noMutationControls, true);
    assert.equal(result.implementationBoundary.noProviderControls, true);
    assert.equal(result.implementationBoundary.noPolling, true);
    assert.equal(result.implementationBoundary.noPersistence, true);
    assertNoExecution(result);
  });

  it("dangerous exclusions include automation sending provider campaign and persistence language", () => {
    const result = createR52ManualRevenueSopReadonlyUiScopeContract(readyInput);

    assert.ok(result.dangerousExclusions.includes("Start Automation"));
    assert.ok(result.dangerousExclusions.includes("Send SMS"));
    assert.ok(result.dangerousExclusions.includes("Send Email"));
    assert.ok(result.dangerousExclusions.includes("Activate Provider"));
    assert.ok(result.dangerousExclusions.includes("Run Campaign"));
    assert.ok(result.dangerousExclusions.includes("AI Autopilot"));
    assert.ok(result.dangerousExclusions.includes("Override Governance"));
    assert.ok(result.dangerousExclusions.includes("Persist SOP Progress"));
    assertNoExecution(result);
  });

  it("missing scope reviews require operator review", () => {
    const result = createR52ManualRevenueSopReadonlyUiScopeContract({
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

  it("runtime provider sending automation polling persistence mutation and permission requests are blocked", () => {
    const result = createR52ManualRevenueSopReadonlyUiScopeContract({
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
    });

    assert.equal(result.scopeStatus, "readonly_ui_scope_blocked");
    assert.ok(result.warningCodes.includes("ui_mutation_rejected"));
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

  it("validation plan checks build diff isolation automation-agent provider strings polling and manual-only copy", () => {
    const result = createR52ManualRevenueSopReadonlyUiScopeContract(readyInput);
    const checks = result.r52jValidationPlan.map((item) => item.check).join(" ");

    assert.match(checks, /build/i);
    assert.match(checks, /exact diff/i);
    assert.match(checks, /automation-agent/i);
    assert.match(checks, /provider/i);
    assert.match(checks, /polling/i);
    assert.match(checks, /UI copy/i);
    assertNoExecution(result);
  });

  it("execution indicators are forced false and block the scope", () => {
    const result = createR52ManualRevenueSopReadonlyUiScopeContract({
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

    assert.equal(result.scopeStatus, "readonly_ui_scope_blocked");
    assert.ok(result.warningCodes.includes("activation_executed_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("sent_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
    assert.ok(result.warningCodes.includes("can_send_now_must_be_false"));
    assertNoExecution(result);
  });

  it("bounded operator notes are enforced", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `scope_note_${index}_${"x".repeat(220)}`);
    const result = createR52ManualRevenueSopReadonlyUiScopeContract({
      ...readyInput,
      extraScopeNotes: notes,
    });

    assert.equal(result.operatorNotes.length, 40);
    assert.ok(result.operatorNotes.every((note) => note.length <= 183));
    assertNoExecution(result);
  });
});
