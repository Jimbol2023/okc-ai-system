import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR58NearCloseRevenueRecoveryUiScopeInvariants,
  createR58NearCloseRevenueRecoveryUiScopeAudit,
  type R58NearCloseRevenueRecoveryUiScopeAuditInput,
  type R58NearCloseRevenueRecoveryUiScopeAuditResult,
} from "./r58-near-close-revenue-recovery-ui-scope-audit";

const readyInput: R58NearCloseRevenueRecoveryUiScopeAuditInput = {
  r58aScopeReviewed: true,
  uiSurfaceReviewed: true,
  visibilityConceptsReviewed: true,
  wordingReviewed: true,
  closingFrictionReviewed: true,
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
  legalOrClosingReadinessClaimRequested: false,
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

function assertSafety(result: R58NearCloseRevenueRecoveryUiScopeAuditResult) {
  const invariantCheck = assertR58NearCloseRevenueRecoveryUiScopeInvariants(result);

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

describe("R58 near-close revenue recovery UI scope audit", () => {
  it("missing default input fails closed into operator review", () => {
    const result = createR58NearCloseRevenueRecoveryUiScopeAudit();

    assert.equal(result.phase, "R58B");
    assert.equal(result.surface, "near_close_revenue_recovery_intelligence_ui");
    assert.equal(result.scopeStatus, "operator_review_required");
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("r58a_scope_review_required"));
    assert.ok(result.warningCodes.includes("ui_surface_review_required"));
    assert.ok(result.warningCodes.includes("visibility_concept_review_required"));
    assert.ok(result.warningCodes.includes("wording_review_required"));
    assert.ok(result.warningCodes.includes("closing_friction_review_required"));
    assertSafety(result);
  });

  it("defines allowed future UI sections and visibility concepts", () => {
    const result = createR58NearCloseRevenueRecoveryUiScopeAudit(readyInput);

    assert.equal(result.scopeStatus, "ui_scope_ready_for_later_implementation");
    assert.ok(result.allowedFutureUiSections.includes("under_contract_review"));
    assert.ok(result.allowedFutureUiSections.includes("assignment_friction"));
    assert.ok(result.allowedFutureUiSections.includes("title_escrow_blockers"));
    assert.ok(result.allowedFutureUiSections.includes("pre_closing_revenue_leakage_indicators"));
    assert.equal(result.revenueRecoveryVisibilityConcepts[0].section, "governance_stop_signals");
    assert.equal(result.revenueRecoveryVisibilityConcepts[1].section, "under_contract_review");
    assert.ok(result.revenueRecoveryVisibilityConcepts.every((item, index) => item.order === index + 1));
    assertSafety(result);
  });

  it("defines safe manual escalation human review and closing friction wording", () => {
    const result = createR58NearCloseRevenueRecoveryUiScopeAudit(readyInput);
    const manual = result.safeManualRecoveryWording.join(" ");
    const escalation = result.safeEscalationWording.join(" ");
    const humanReview = result.humanReviewRequiredWording.join(" ");
    const friction = result.closingFrictionExplanationWording.join(" ");

    assert.match(manual, /not legal-ready, closing-ready, assignment-ready, or execution-ready/i);
    assert.match(escalation, /does not approve execution/i);
    assert.match(humanReview, /does not grant contact, negotiation, assignment, closing/i);
    assert.match(friction, /not closing-readiness claims/i);
    assert.match(friction, /does not make a deal assignment-ready/i);
    assertSafety(result);
  });

  it("blocks forbidden controls buttons actions and dangerous language", () => {
    const result = createR58NearCloseRevenueRecoveryUiScopeAudit(readyInput);

    assert.ok(result.forbiddenControlsButtonsActions.includes("close deal now"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("send assignment"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("auto recover"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("auto follow-up"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("activate workflow"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("approve and send"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("queue execution"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("provider activation"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("autonomous outreach"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("autonomous negotiation"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("legal-ready"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("closing-ready"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("buyer-ready-to-contact"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("assignment-ready"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("execute closing"));
    assert.ok(result.forbiddenControlsButtonsActions.includes("release automation"));
    assertSafety(result);
  });

  it("preserves accessibility expectations and no-action boundaries", () => {
    const result = createR58NearCloseRevenueRecoveryUiScopeAudit(readyInput);
    const accessibility = result.accessibilityExpectations.join(" ");
    const boundaries = result.noActionExecutionBoundaries.join(" ");

    assert.match(accessibility, /semantic headings/i);
    assert.match(accessibility, /color alone/i);
    assert.match(accessibility, /keyboard order/i);
    assert.match(accessibility, /auto-refresh, poll/i);
    assert.match(boundaries, /No buttons, links, toggles, menus, forms, or controls may trigger close/i);
    assert.match(boundaries, /legal-readiness claims/i);
    assert.match(boundaries, /Approval language must never imply permission/i);
    assertSafety(result);
  });

  it("locks implementation boundaries for later explicit authorization only", () => {
    const result = createR58NearCloseRevenueRecoveryUiScopeAudit(readyInput);

    assert.equal(result.implementationBoundaries.candidateSurface, "dashboard_near_close_revenue_recovery_intelligence");
    assert.equal(result.implementationBoundaries.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
    assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
    assert.equal(result.implementationBoundaries.noNewRoutes, true);
    assert.equal(result.implementationBoundaries.noPolling, true);
    assert.equal(result.implementationBoundaries.noPersistence, true);
    assert.equal(result.implementationBoundaries.noExecutionControls, true);
    assert.equal(result.implementationBoundaries.noLegalOrClosingReadinessClaims, true);
    assertSafety(result);
  });

  it("rejects runtime provider sending polling persistence execution legal-readiness and autonomous requests", () => {
    const result = createR58NearCloseRevenueRecoveryUiScopeAudit({
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
      legalOrClosingReadinessClaimRequested: true,
    });

    assert.equal(result.scopeStatus, "ui_scope_blocked");
    assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("persistence_rejected"));
    assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
    assert.ok(result.warningCodes.includes("legal_or_closing_readiness_claim_rejected"));
    assertSafety(result);
  });

  it("rejects unsafe invariant inputs while preserving hard output flags", () => {
    const result = createR58NearCloseRevenueRecoveryUiScopeAudit({
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
    assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
    assert.ok(result.warningCodes.includes("sent_must_be_false"));
    assert.ok(result.warningCodes.includes("ui_implementation_not_allowed_now"));
    assertSafety(result);
  });

  it("exposes invariant assertions and bounds audit notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r58b_audit_note_${index}_${"x".repeat(220)}`);
    const result = createR58NearCloseRevenueRecoveryUiScopeAudit({
      ...readyInput,
      extraAuditNotes: notes,
    });

    assert.match(result.invariantAssertions.join(" "), /readOnly must remain true/i);
    assert.match(result.invariantAssertions.join(" "), /No legal-ready, closing-ready/i);
    assert.equal(result.auditNotes.length, 40);
    assert.ok(result.auditNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
