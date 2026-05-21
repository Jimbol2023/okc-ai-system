import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR56ManualRevenueWorkdaySummaryUiScopeInvariants,
  createR56ManualRevenueWorkdaySummaryUiScopeAudit,
  type R56ManualRevenueWorkdayUiScopeAuditInput,
  type R56ManualRevenueWorkdayUiScopeAuditResult,
} from "./r56-manual-revenue-workday-summary-ui-scope-audit";

const readyInput: R56ManualRevenueWorkdayUiScopeAuditInput = {
  r56bScopeReviewed: true,
  uiSurfaceReviewed: true,
  wordingReviewed: true,
  accessibilityReviewed: true,
  operatorReviewCompleted: true,
  dangerousPatternsReviewed: true,
  uiImplementationRequested: false,
  routeChangeRequested: false,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  persistenceRequested: false,
  executionControlRequested: false,
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

function assertSafety(result: R56ManualRevenueWorkdayUiScopeAuditResult) {
  const invariantCheck = assertR56ManualRevenueWorkdaySummaryUiScopeInvariants(result);

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

describe("R56 manual revenue workday summary UI scope audit", () => {
  it("missing default input fails closed into operator review", () => {
    const result = createR56ManualRevenueWorkdaySummaryUiScopeAudit();

    assert.equal(result.surface, "manual_revenue_workday_summary_ui");
    assert.equal(result.scopeStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("r56b_scope_review_required"));
    assert.ok(result.warningCodes.includes("ui_surface_review_required"));
    assert.ok(result.warningCodes.includes("wording_review_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assert.ok(result.warningCodes.includes("dangerous_pattern_review_required"));
    assertSafety(result);
  });

  it("defines the allowed future UI sections without implementing UI now", () => {
    const result = createR56ManualRevenueWorkdaySummaryUiScopeAudit(readyInput);

    assert.equal(result.scopeStatus, "ui_scope_ready_for_later_implementation");
    assert.deepEqual(result.allowedUiSections, [
      "manual_workday_overview",
      "today_revenue_priorities",
      "near_close_opportunities",
      "stuck_deal_review",
      "overdue_manual_follow_ups",
      "missing_critical_data",
      "buyer_disposition_readiness",
      "blocked_do_not_proceed",
      "manual_next_actions",
      "human_review_required",
    ]);
    assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
    assertSafety(result);
  });

  it("orders future display around revenue priority and operator effectiveness", () => {
    const result = createR56ManualRevenueWorkdaySummaryUiScopeAudit(readyInput);

    assert.equal(result.revenuePriorityDisplayOrder[0].section, "manual_workday_overview");
    assert.equal(result.revenuePriorityDisplayOrder[1].section, "today_revenue_priorities");
    assert.equal(result.revenuePriorityDisplayOrder[2].section, "near_close_opportunities");
    assert.equal(result.revenuePriorityDisplayOrder[3].section, "stuck_deal_review");
    assert.ok(result.revenuePriorityDisplayOrder.every((item, index) => item.order === index + 1));
    assert.match(result.revenuePriorityDisplayOrder.map((item) => item.revenueReason).join(" "), /deal throughput|revenue|conversion|Disposition/i);
    assertSafety(result);
  });

  it("blocks forbidden controls and dangerous wording patterns", () => {
    const result = createR56ManualRevenueWorkdaySummaryUiScopeAudit(readyInput);

    assert.ok(result.forbiddenUiControls.includes("Start Automation"));
    assert.ok(result.forbiddenUiControls.includes("Send SMS"));
    assert.ok(result.forbiddenUiControls.includes("Send Email"));
    assert.ok(result.forbiddenUiControls.includes("Auto Follow-Up"));
    assert.ok(result.forbiddenUiControls.includes("Activate Provider"));
    assert.ok(result.forbiddenUiControls.includes("Run Campaign"));
    assert.ok(result.forbiddenUiControls.includes("AI Autopilot"));
    assert.ok(result.forbiddenUiControls.includes("Override Governance"));
    assert.ok(result.forbiddenUiControls.includes("Persist Metrics"));
    assert.ok(result.forbiddenUiControls.includes("Approve and Send"));
    assert.ok(result.forbiddenUiControls.includes("Bulk Approve"));
    assert.ok(result.forbiddenUiControls.includes("ready to send"));
    assert.ok(result.forbiddenUiControls.includes("send after approval"));
    assert.ok(result.forbiddenUiControls.includes("queue execution"));
    assert.ok(result.forbiddenUiControls.includes("auto release"));
    assert.ok(result.forbiddenUiControls.includes("bulk send"));
    assert.ok(result.forbiddenUiControls.includes("autonomous negotiation"));
    assert.ok(result.forbiddenUiControls.includes("autonomous outreach"));
    assert.ok(result.forbiddenUiControls.includes("hidden execution affordances"));
    assertSafety(result);
  });

  it("defines safe wording and no-action boundaries", () => {
    const result = createR56ManualRevenueWorkdaySummaryUiScopeAudit(readyInput);
    const wording = result.safeWording.join(" ");
    const boundaries = result.noActionBoundaries.join(" ");

    assert.match(wording, /Manual revenue workday summary/i);
    assert.match(wording, /Read-only revenue priorities/i);
    assert.match(wording, /Human review required/i);
    assert.match(wording, /No provider called, no message sent/i);
    assert.match(boundaries, /No buttons, links, toggles, menus, forms, or controls may trigger/i);
    assert.match(boundaries, /already-available read-only data/i);
    assert.match(boundaries, /must never imply execution permission/i);
    assertSafety(result);
  });

  it("preserves accessibility expectations for a future UI slice", () => {
    const result = createR56ManualRevenueWorkdaySummaryUiScopeAudit(readyInput);
    const accessibility = result.accessibilityExpectations.join(" ");

    assert.match(accessibility, /semantic heading/i);
    assert.match(accessibility, /text labels/i);
    assert.match(accessibility, /color alone/i);
    assert.match(accessibility, /keyboard order/i);
    assert.match(accessibility, /animation, motion, auto-refresh/i);
    assert.match(accessibility, /screen-reader friendly/i);
    assertSafety(result);
  });

  it("locks implementation boundaries for later explicit authorization", () => {
    const result = createR56ManualRevenueWorkdaySummaryUiScopeAudit(readyInput);

    assert.equal(result.implementationBoundaries.candidateSurface, "dashboard_manual_revenue_workday_summary");
    assert.equal(result.implementationBoundaries.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
    assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
    assert.equal(result.implementationBoundaries.noNewRoutes, true);
    assert.equal(result.implementationBoundaries.noPolling, true);
    assert.equal(result.implementationBoundaries.noPersistence, true);
    assert.equal(result.implementationBoundaries.noProviderControls, true);
    assert.equal(result.implementationBoundaries.noExecutionControls, true);
    assert.equal(result.implementationBoundaries.noAutomationAgent, true);
    assert.equal(result.implementationBoundaries.noApprovalBehaviorChanges, true);
    assert.equal(result.implementationBoundaries.futureImplementationRequiresExplicitAuthorization, true);
    assertSafety(result);
  });

  it("rejects runtime provider sending polling persistence execution UI and autonomous requests", () => {
    const result = createR56ManualRevenueWorkdaySummaryUiScopeAudit({
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
      autonomousWorkflowRequested: true,
      approvalGrantsExecution: true,
    });

    assert.equal(result.scopeStatus, "ui_scope_blocked");
    assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
    assert.ok(result.warningCodes.includes("route_change_rejected"));
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("live_sending_rejected"));
    assert.ok(result.warningCodes.includes("automation_agent_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("persistence_rejected"));
    assert.ok(result.warningCodes.includes("execution_control_rejected"));
    assert.ok(result.warningCodes.includes("autonomous_workflow_rejected"));
    assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
    assertSafety(result);
  });

  it("rejects unsafe invariant inputs while preserving hard output flags", () => {
    const result = createR56ManualRevenueWorkdaySummaryUiScopeAudit({
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

    assert.equal(result.scopeStatus, "ui_scope_blocked");
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

  it("bounds audit notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r56c_ui_note_${index}_${"x".repeat(220)}`);
    const result = createR56ManualRevenueWorkdaySummaryUiScopeAudit({
      ...readyInput,
      extraAuditNotes: notes,
    });

    assert.equal(result.auditNotes.length, 40);
    assert.ok(result.auditNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
