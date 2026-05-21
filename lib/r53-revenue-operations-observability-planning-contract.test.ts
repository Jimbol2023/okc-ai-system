import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR53RevenueOperationsObservabilityInvariants,
  createR53RevenueOperationsObservabilityPlanningContract,
  type R53RevenueOperationsObservabilityPlanningInput,
  type R53RevenueOperationsObservabilityPlanningResult,
} from "./r53-revenue-operations-observability-planning-contract";

const readyInput: R53RevenueOperationsObservabilityPlanningInput = {
  manualRevenueMetricsReviewed: true,
  operatorWorkflowMetricsReviewed: true,
  governanceSafetyMetricsReviewed: true,
  excludedMetricsReviewed: true,
  dataSourceSafetyReviewed: true,
  visibilitySurfaceReviewed: true,
  accessibilityRequirementsReviewed: true,
  operatorReviewCompleted: true,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  workflowMutationRequested: false,
  persistenceWriteRequested: false,
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

function assertNoExecution(result: R53RevenueOperationsObservabilityPlanningResult) {
  const invariantCheck = assertR53RevenueOperationsObservabilityInvariants(result);

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

function metricIds(result: R53RevenueOperationsObservabilityPlanningResult, key: keyof Pick<
  R53RevenueOperationsObservabilityPlanningResult,
  "manualRevenueMetrics" | "operatorWorkflowMetrics" | "governanceSafetyMetrics" | "excludedMetrics"
>) {
  return result[key].map((metric) => metric.id);
}

describe("R53 revenue operations observability planning contract", () => {
  it("missing default input fails closed and requires review", () => {
    const result = createR53RevenueOperationsObservabilityPlanningContract();

    assert.equal(result.planStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("manual_metrics_review_required"));
    assert.ok(result.warningCodes.includes("operator_metrics_review_required"));
    assert.ok(result.warningCodes.includes("governance_metrics_review_required"));
    assert.ok(result.warningCodes.includes("excluded_metrics_review_required"));
    assert.ok(result.warningCodes.includes("data_source_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertNoExecution(result);
  });

  it("classifies the dashboard overview as the first safe visibility surface", () => {
    const result = createR53RevenueOperationsObservabilityPlanningContract(readyInput);

    assert.equal(result.planStatus, "observability_plan_ready");
    assert.equal(result.firstVisibilitySurface, "dashboard_overview");
    assert.match(result.firstVisibilityReason, /dashboard/i);
    assertNoExecution(result);
  });

  it("defines safe manual revenue metrics without live execution metrics", () => {
    const result = createR53RevenueOperationsObservabilityPlanningContract(readyInput);
    const ids = metricIds(result, "manualRevenueMetrics");

    assert.ok(ids.includes("new_leads_reviewed"));
    assert.ok(ids.includes("seller_calls_completed_manually"));
    assert.ok(ids.includes("seller_outcomes_recorded"));
    assert.ok(ids.includes("follow_ups_due_manually"));
    assert.ok(ids.includes("follow_ups_overdue_manually"));
    assert.ok(ids.includes("buyer_ready_leads"));
    assert.ok(ids.includes("incomplete_buyer_packages"));
    assert.ok(ids.includes("near_contract_opportunities"));
    assert.ok(ids.includes("near_close_opportunities"));
    assert.ok(ids.includes("blocked_leads"));
    assert.ok(ids.includes("dnc_opt_out_blocked_leads"));
    assert.equal(ids.includes("live_send_counts"), false);
    assertNoExecution(result);
  });

  it("defines operator workflow metrics for manual revenue discipline", () => {
    const result = createR53RevenueOperationsObservabilityPlanningContract(readyInput);
    const ids = metricIds(result, "operatorWorkflowMetrics");

    assert.ok(ids.includes("daily_review_completion"));
    assert.ok(ids.includes("triage_completion"));
    assert.ok(ids.includes("seller_call_outcome_completion"));
    assert.ok(ids.includes("approval_queue_review_completion"));
    assert.ok(ids.includes("buyer_readiness_review_completion"));
    assert.ok(ids.includes("disposition_package_readiness"));
    assert.ok(ids.includes("bottleneck_count"));
    assertNoExecution(result);
  });

  it("defines governance and safety metrics without creating permission", () => {
    const result = createR53RevenueOperationsObservabilityPlanningContract(readyInput);
    const ids = metricIds(result, "governanceSafetyMetrics");

    assert.ok(ids.includes("simulation_only_status"));
    assert.ok(ids.includes("providers_disabled_status"));
    assert.ok(ids.includes("manual_review_required_count"));
    assert.ok(ids.includes("blocked_governance_count"));
    assert.ok(ids.includes("incomplete_data_risk_count"));
    assert.ok(ids.includes("dnc_opt_out_risk_count"));
    assert.ok(ids.includes("approval_does_not_send_confirmation"));
    assertNoExecution(result);
  });

  it("excludes live provider automation and persistence-backed metrics", () => {
    const result = createR53RevenueOperationsObservabilityPlanningContract(readyInput);
    const ids = metricIds(result, "excludedMetrics");

    assert.ok(ids.includes("live_send_counts"));
    assert.ok(ids.includes("automated_outreach_counts"));
    assert.ok(ids.includes("provider_delivery_metrics"));
    assert.ok(ids.includes("twilio_success_failure_metrics"));
    assert.ok(ids.includes("autonomous_follow_up_metrics"));
    assert.ok(ids.includes("automation_agent_cycle_metrics"));
    assert.ok(ids.includes("persistence_backed_audit_logs"));
    assertNoExecution(result);
  });

  it("classifies data source safety across read-only future persistence and unsafe runtime categories", () => {
    const result = createR53RevenueOperationsObservabilityPlanningContract(readyInput);
    const classifications = new Set(result.dataSourceSafetyClassification.map((metric) => metric.dataSourceSafety));

    assert.ok(classifications.has("safe_read_only_now"));
    assert.ok(classifications.has("safe_future_derived_metric"));
    assert.ok(classifications.has("requires_audit_persistence_first"));
    assert.ok(classifications.has("unsafe_until_runtime_activation_exists"));
    assert.ok(
      result.excludedMetrics
        .filter((metric) => metric.id !== "persistence_backed_audit_logs")
        .every((metric) => metric.dataSourceSafety === "unsafe_until_runtime_activation_exists"),
    );
    assertNoExecution(result);
  });

  it("blocks runtime provider sending automation polling persistence mutation and permission requests", () => {
    const result = createR53RevenueOperationsObservabilityPlanningContract({
      ...readyInput,
      runtimeActivationRequested: true,
      providerActivationRequested: true,
      liveSendingRequested: true,
      automationAgentRequested: true,
      pollingRequested: true,
      workflowMutationRequested: true,
      persistenceWriteRequested: true,
      advisoryConvertedToPermission: true,
    });

    assert.equal(result.planStatus, "observability_planning_blocked");
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("live_sending_rejected"));
    assert.ok(result.warningCodes.includes("automation_agent_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("workflow_mutation_rejected"));
    assert.ok(result.warningCodes.includes("persistence_write_rejected"));
    assert.ok(result.warningCodes.includes("advisory_to_permission_rejected"));
    assertNoExecution(result);
  });

  it("preserves accessibility and usability requirements for future visibility", () => {
    const result = createR53RevenueOperationsObservabilityPlanningContract(readyInput);
    const requirements = result.accessibilityRequirements.map((item) => item.requirement).join(" ");

    assert.match(requirements, /readable metric labels/i);
    assert.match(requirements, /not color alone/i);
    assert.match(requirements, /keyboard-friendly/i);
    assert.match(requirements, /low-density/i);
    assert.match(requirements, /Avoid auto-refresh/i);
    assertNoExecution(result);
  });

  it("uses the safe implementation order requested for R53", () => {
    const result = createR53RevenueOperationsObservabilityPlanningContract(readyInput);

    assert.deepEqual(result.implementationOrder, [
      "Create planning contract for manual revenue observability.",
      "Create a pure read-only derived metric helper from existing lead/readiness state.",
      "Add dashboard visibility as the first surface.",
      "Run smoke and safety regression audit.",
      "Run accessibility audit for labels, keyboard order, and non-color-only status.",
      "Only later consider audit persistence after R50 controls are implemented.",
    ]);
    assertNoExecution(result);
  });

  it("execution indicators are forced false and block the plan", () => {
    const result = createR53RevenueOperationsObservabilityPlanningContract({
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

    assert.equal(result.planStatus, "observability_planning_blocked");
    assert.ok(result.warningCodes.includes("activation_executed_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("sent_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
    assert.ok(result.warningCodes.includes("can_send_now_must_be_false"));
    assertNoExecution(result);
  });

  it("bounded operator notes are enforced", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `observability_note_${index}_${"x".repeat(220)}`);
    const result = createR53RevenueOperationsObservabilityPlanningContract({
      ...readyInput,
      extraPlanningNotes: notes,
    });

    assert.equal(result.operatorNotes.length, 40);
    assert.ok(result.operatorNotes.every((note) => note.length <= 183));
    assertNoExecution(result);
  });
});
