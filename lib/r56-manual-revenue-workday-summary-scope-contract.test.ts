import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR56ManualRevenueWorkdaySummaryScopeInvariants,
  createR56ManualRevenueWorkdaySummaryScopeContract,
  type R56ManualRevenueWorkdayInput,
  type R56ManualRevenueWorkdayScopeResult,
} from "./r56-manual-revenue-workday-summary-scope-contract";

const readyInput: R56ManualRevenueWorkdayInput = {
  revenuePriorityReviewed: true,
  manualWorkflowReviewed: true,
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

function assertSafety(result: R56ManualRevenueWorkdayScopeResult) {
  const invariantCheck = assertR56ManualRevenueWorkdaySummaryScopeInvariants(result);

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

describe("R56 manual revenue workday summary scope contract", () => {
  it("missing default input fails closed into operator review", () => {
    const result = createR56ManualRevenueWorkdaySummaryScopeContract();

    assert.equal(result.surface, "manual_revenue_workday_summary");
    assert.equal(result.scopeStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("revenue_priority_review_required"));
    assert.ok(result.warningCodes.includes("manual_workflow_review_required"));
    assert.ok(result.warningCodes.includes("governance_boundary_review_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertSafety(result);
  });

  it("locks a high-ROI manual revenue workday summary scope", () => {
    const result = createR56ManualRevenueWorkdaySummaryScopeContract(readyInput);

    assert.equal(result.scopeStatus, "workday_summary_scope_ready");
    assert.deepEqual(result.allowedWorkdayItems, [
      "highest_priority_leads",
      "overdue_follow_ups",
      "stuck_deals",
      "near_close_opportunities",
      "missing_critical_data",
      "blocked_deals",
      "buyer_ready_deals",
      "seller_response_urgency",
      "manual_action_today",
      "revenue_leakage_risks",
      "human_review_required_opportunities",
    ]);
    assertSafety(result);
  });

  it("prioritizes revenue throughput and operator effectiveness", () => {
    const result = createR56ManualRevenueWorkdaySummaryScopeContract(readyInput);
    const findings = `${result.highRoiFindings.join(" ")} ${result.revenuePriorityFindings.join(" ")}`;
    const priorities = result.operationalPriorities.map((priority) => priority.priority);

    assert.match(findings, /what matters today/i);
    assert.match(findings, /deal throughput/i);
    assert.match(findings, /stuck-deal detection/i);
    assert.match(findings, /revenue leakage/i);
    assert.ok(priorities.includes("protect_revenue_today"));
    assert.ok(priorities.includes("move_near_close_deals"));
    assert.ok(priorities.includes("recover_stuck_deals"));
    assert.ok(priorities.includes("prepare_buyer_disposition"));
    assertSafety(result);
  });

  it("keeps all operator actions manual and advisory", () => {
    const result = createR56ManualRevenueWorkdaySummaryScopeContract(readyInput);
    const priorityText = result.operationalPriorities
      .map((priority) => `${priority.manualAction} ${priority.safetyBoundary}`)
      .join(" ");

    assert.match(priorityText, /manual/i);
    assert.match(priorityText, /do not create contact, send, approval, provider, or automation controls/i);
    assert.match(priorityText, /Do not auto-escalate, auto-follow-up, or mutate workflow state/i);
    assert.match(priorityText, /No override governance controls/i);
    assertSafety(result);
  });

  it("blocks dangerous automation provider execution and approval semantics", () => {
    const result = createR56ManualRevenueWorkdaySummaryScopeContract(readyInput);

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
    assert.ok(result.blockedPatterns.includes("send after approval"));
    assert.ok(result.blockedPatterns.includes("queue execution"));
    assert.ok(result.blockedPatterns.includes("auto release"));
    assert.ok(result.blockedPatterns.includes("bulk send"));
    assert.ok(result.blockedPatterns.includes("autonomous negotiation"));
    assert.ok(result.blockedPatterns.includes("autonomous outreach"));
    assert.ok(result.blockedPatterns.includes("hidden execution affordances"));
    assertSafety(result);
  });

  it("preserves governance and accessibility boundaries", () => {
    const result = createR56ManualRevenueWorkdaySummaryScopeContract(readyInput);
    const governance = result.governanceBoundaries.join(" ");
    const accessibility = result.accessibilityRequirements.join(" ");

    assert.match(governance, /cannot become execution permission/i);
    assert.match(governance, /Human review remains required/i);
    assert.match(governance, /Approval status does not grant execution/i);
    assert.match(governance, /do-not-proceed signals/i);
    assert.match(accessibility, /semantic headings/i);
    assert.match(accessibility, /color alone/i);
    assert.match(accessibility, /keyboard order/i);
    assert.match(accessibility, /auto-refresh/i);
    assert.match(accessibility, /screen-reader-friendly/i);
    assertSafety(result);
  });

  it("does not allow UI implementation in the scope phase", () => {
    const result = createR56ManualRevenueWorkdaySummaryScopeContract(readyInput);

    assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
    assert.equal(result.implementationBoundaries.noExecutionControls, true);
    assert.equal(result.implementationBoundaries.noProviderActivation, true);
    assert.equal(result.implementationBoundaries.noPolling, true);
    assert.equal(result.implementationBoundaries.noPersistence, true);
    assert.equal(result.implementationBoundaries.noRuntimeAutomation, true);
    assert.equal(result.implementationBoundaries.noAutomationAgent, true);
    assert.equal(result.implementationBoundaries.noPrismaOrSchemaChanges, true);
    assert.equal(result.implementationBoundaries.noApprovalAsPermission, true);
    assert.equal(result.implementationBoundaries.futureUiRequiresSeparateAuthorization, true);
    assertSafety(result);
  });

  it("blocks runtime provider sending polling persistence autonomous workflow and UI requests", () => {
    const result = createR56ManualRevenueWorkdaySummaryScopeContract({
      ...readyInput,
      uiImplementationRequested: true,
      routeChangeRequested: true,
      runtimeActivationRequested: true,
      providerActivationRequested: true,
      liveSendingRequested: true,
      automationAgentRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      autonomousWorkflowRequested: true,
      approvalGrantsExecution: true,
    });

    assert.equal(result.scopeStatus, "workday_summary_scope_blocked");
    assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
    assert.ok(result.warningCodes.includes("route_change_rejected"));
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("live_sending_rejected"));
    assert.ok(result.warningCodes.includes("automation_agent_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("persistence_rejected"));
    assert.ok(result.warningCodes.includes("autonomous_workflow_rejected"));
    assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
    assertSafety(result);
  });

  it("blocks unsafe safety flags while preserving hard output invariants", () => {
    const result = createR56ManualRevenueWorkdaySummaryScopeContract({
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

    assert.equal(result.scopeStatus, "workday_summary_scope_blocked");
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
    const notes = Array.from({ length: 80 }, (_, index) => `r56b_workday_note_${index}_${"x".repeat(220)}`);
    const result = createR56ManualRevenueWorkdaySummaryScopeContract({
      ...readyInput,
      extraScopeNotes: notes,
    });

    assert.equal(result.scopeNotes.length, 40);
    assert.ok(result.scopeNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
