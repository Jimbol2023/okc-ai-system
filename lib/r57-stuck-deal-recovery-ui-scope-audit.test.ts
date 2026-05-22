import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR57StuckDealRecoveryUiScopeInvariants,
  createR57StuckDealRecoveryUiScopeAudit,
  type R57StuckDealRecoveryUiScopeAuditInput,
  type R57StuckDealRecoveryUiScopeAuditResult,
} from "./r57-stuck-deal-recovery-ui-scope-audit";

const readyInput: R57StuckDealRecoveryUiScopeAuditInput = {
  r57aScopeReviewed: true,
  uiSurfaceReviewed: true,
  visibilityOrderReviewed: true,
  wordingReviewed: true,
  revenueLeakageReviewed: true,
  governanceBoundaryReviewed: true,
  accessibilityReviewed: true,
  dangerousPatternsReviewed: true,
  operatorReviewCompleted: true,
  uiImplementationRequested: false,
  routeChangeRequested: false,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  persistenceRequested: false,
  executionControlRequested: false,
  redesignRequested: false,
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

function assertSafety(result: R57StuckDealRecoveryUiScopeAuditResult) {
  const invariantCheck = assertR57StuckDealRecoveryUiScopeInvariants(result);

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

describe("R57 stuck-deal recovery intelligence UI scope audit", () => {
  it("missing default input fails closed into operator review", () => {
    const result = createR57StuckDealRecoveryUiScopeAudit();

    assert.equal(result.phase, "R57B");
    assert.equal(result.surface, "stuck_deal_recovery_intelligence_ui");
    assert.equal(result.scopeStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("r57a_scope_review_required"));
    assert.ok(result.warningCodes.includes("ui_surface_review_required"));
    assert.ok(result.warningCodes.includes("visibility_order_review_required"));
    assert.ok(result.warningCodes.includes("wording_review_required"));
    assert.ok(result.warningCodes.includes("revenue_leakage_review_required"));
    assert.ok(result.warningCodes.includes("governance_boundary_review_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assert.ok(result.warningCodes.includes("dangerous_pattern_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertSafety(result);
  });

  it("defines allowed future UI sections without implementing UI now", () => {
    const result = createR57StuckDealRecoveryUiScopeAudit(readyInput);

    assert.equal(result.scopeStatus, "ui_scope_ready_for_later_implementation");
    assert.deepEqual(result.allowedFutureUiSections, [
      "stalled_deal_categories",
      "overdue_manual_follow_up",
      "missing_next_step",
      "buyer_readiness_blockers",
      "near_close_friction",
      "missing_data",
      "unresolved_manual_review",
      "revenue_leakage_indicators",
      "safe_manual_recovery_guidance",
    ]);
    assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
    assertSafety(result);
  });

  it("orders stuck-deal visibility around review blockers and revenue leakage", () => {
    const result = createR57StuckDealRecoveryUiScopeAudit(readyInput);

    assert.deepEqual(
      result.stuckDealVisibilityOrdering.map((item) => item.section),
      [
        "unresolved_manual_review",
        "near_close_friction",
        "overdue_manual_follow_up",
        "missing_next_step",
        "buyer_readiness_blockers",
        "missing_data",
        "stalled_deal_categories",
        "revenue_leakage_indicators",
        "safe_manual_recovery_guidance",
      ],
    );
    assert.ok(result.stuckDealVisibilityOrdering.every((item, index) => item.order === index + 1));
    assert.match(
      result.stuckDealVisibilityOrdering.map((item) => item.revenueLeakageReason).join(" "),
      /revenue|seller momentum|disposition|operator/i,
    );
    assertSafety(result);
  });

  it("defines safe manual recovery escalation human review and revenue leakage wording", () => {
    const result = createR57StuckDealRecoveryUiScopeAudit(readyInput);
    const manualRecovery = result.safeManualRecoveryWording.join(" ");
    const escalation = result.safeEscalationWording.join(" ");
    const humanReview = result.humanReviewRequiredWording.join(" ");
    const leakage = result.revenueLeakageExplanationWording.join(" ");

    assert.match(manualRecovery, /Review this stuck deal manually/i);
    assert.match(manualRecovery, /do not send, queue, or activate/i);
    assert.match(escalation, /Escalate for human review/i);
    assert.match(escalation, /does not approve execution/i);
    assert.match(humanReview, /Human review required/i);
    assert.match(humanReview, /does not grant contact, sending, negotiation, or provider permission/i);
    assert.match(leakage, /may indicate revenue leakage/i);
    assert.match(leakage, /not automated forecasts/i);
    assertSafety(result);
  });

  it("blocks forbidden controls buttons actions and dangerous semantics", () => {
    const result = createR57StuckDealRecoveryUiScopeAudit(readyInput);

    assert.ok(result.forbiddenControlsButtonsActions.includes("send now"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("auto recover"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("auto follow-up"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("activate workflow"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("bulk recovery"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("AI negotiates"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("approve and send"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("release automation"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("start campaign"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("retry automatically"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("queue execution"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("provider activation"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("autonomous outreach"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("hidden execution affordances"));
    assert.match(result.dangerousPatternChecks.join(" "), /Reject routes, providers, Twilio, automation-agent/i);
    assertSafety(result);
  });

  it("preserves accessibility expectations and no-action boundaries", () => {
    const result = createR57StuckDealRecoveryUiScopeAudit(readyInput);
    const accessibility = result.accessibilityExpectations.join(" ");
    const boundaries = result.noActionExecutionBoundaries.join(" ");

    assert.match(accessibility, /semantic headings/i);
    assert.match(accessibility, /color alone/i);
    assert.match(accessibility, /keyboard order/i);
    assert.match(accessibility, /auto-refresh, poll/i);
    assert.match(accessibility, /screen-reader output/i);
    assert.match(boundaries, /No buttons, links, toggles, menus, forms, or controls may trigger/i);
    assert.match(boundaries, /already-available read-only lead and deal review data/i);
    assert.match(boundaries, /must remain labels or guidance only/i);
    assert.match(boundaries, /hidden execution affordances/i);
    assertSafety(result);
  });

  it("locks implementation boundaries for future explicit authorization only", () => {
    const result = createR57StuckDealRecoveryUiScopeAudit(readyInput);

    assert.equal(result.implementationBoundaries.candidateSurface, "dashboard_stuck_deal_recovery_intelligence");
    assert.equal(result.implementationBoundaries.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
    assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
    assert.equal(result.implementationBoundaries.noNewRoutes, true);
    assert.equal(result.implementationBoundaries.noPolling, true);
    assert.equal(result.implementationBoundaries.noPersistence, true);
    assert.equal(result.implementationBoundaries.noProviderControls, true);
    assert.equal(result.implementationBoundaries.noExecutionControls, true);
    assert.equal(result.implementationBoundaries.noAutomationAgent, true);
    assert.equal(result.implementationBoundaries.noApprovalBehaviorChanges, true);
    assert.equal(result.implementationBoundaries.noRedesign, true);
    assert.equal(result.implementationBoundaries.futureImplementationRequiresExplicitAuthorization, true);
    assertSafety(result);
  });

  it("rejects runtime provider sending polling persistence execution UI redesign and autonomous requests", () => {
    const result = createR57StuckDealRecoveryUiScopeAudit({
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
      redesignRequested: true,
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
    assert.ok(result.warningCodes.includes("redesign_rejected"));
    assert.ok(result.warningCodes.includes("autonomous_workflow_rejected"));
    assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
    assertSafety(result);
  });

  it("rejects unsafe invariant inputs while preserving hard output flags", () => {
    const result = createR57StuckDealRecoveryUiScopeAudit({
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

  it("exposes invariant assertions and bounds audit notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r57b_ui_note_${index}_${"x".repeat(220)}`);
    const result = createR57StuckDealRecoveryUiScopeAudit({
      ...readyInput,
      extraAuditNotes: notes,
    });

    assert.match(result.invariantAssertions.join(" "), /readOnly must remain true/i);
    assert.match(result.invariantAssertions.join(" "), /uiImplementationAllowedNow must remain false/i);
    assert.equal(result.auditNotes.length, 40);
    assert.ok(result.auditNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
