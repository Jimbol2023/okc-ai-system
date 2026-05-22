import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR58NearCloseUiImplementationScopeInvariants,
  createR58NearCloseRevenueRecoveryUiImplementationScopeContract,
  type R58NearCloseUiImplementationScopeInput,
  type R58NearCloseUiImplementationScopeResult,
} from "./r58-near-close-revenue-recovery-ui-implementation-scope-contract";

const requiredSafetyCopy =
  "Read-only near-close recovery guidance. No provider called, no message sent, no runtime execution.";

const readyInput: R58NearCloseUiImplementationScopeInput = {
  r58bUiScopeReviewed: true,
  placementReviewed: true,
  readOnlyDataReviewed: true,
  displaySectionsReviewed: true,
  revenuePriorityReviewed: true,
  wordingReviewed: true,
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
  assignmentReadyClaimRequested: false,
  buyerReadyToContactClaimRequested: false,
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

function assertSafety(result: R58NearCloseUiImplementationScopeResult) {
  const invariantCheck = assertR58NearCloseUiImplementationScopeInvariants(result);

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

describe("R58 near-close revenue recovery read-only UI implementation scope contract", () => {
  it("missing default input fails closed into operator review", () => {
    const result = createR58NearCloseRevenueRecoveryUiImplementationScopeContract();

    assert.equal(result.phase, "R58C");
    assert.equal(result.surface, "near_close_revenue_recovery_read_only_ui_implementation_scope");
    assert.equal(result.scopeStatus, "operator_review_required");
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("r58b_ui_scope_review_required"));
    assert.ok(result.warningCodes.includes("placement_review_required"));
    assert.ok(result.warningCodes.includes("read_only_data_review_required"));
    assert.ok(result.warningCodes.includes("display_section_review_required"));
    assert.ok(result.warningCodes.includes("revenue_priority_review_required"));
    assertSafety(result);
  });

  it("locks allowed placement and scoped component without implementing UI", () => {
    const result = createR58NearCloseRevenueRecoveryUiImplementationScopeContract(readyInput);

    assert.equal(result.scopeStatus, "read_only_ui_implementation_scope_ready");
    assert.equal(result.allowedUiPlacement.surface, "existing_dashboard");
    assert.equal(result.allowedUiPlacement.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
    assert.equal(result.allowedUiPlacement.futureComponentAllowed, "components/dashboard/near-close-revenue-recovery-summary.tsx");
    assert.equal(result.allowedUiPlacement.routeChangesAllowed, false);
    assert.equal(result.allowedUiPlacement.redesignAllowed, false);
    assert.equal(result.allowedUiPlacement.implementationAllowedNow, false);
    assertSafety(result);
  });

  it("defines allowed existing read-only data and forbidden sources", () => {
    const result = createR58NearCloseRevenueRecoveryUiImplementationScopeContract(readyInput);

    assert.equal(result.allowedReadOnlyDataSource.source, "existing_dashboard_loaded_lead_deal_and_manual_revenue_signals");
    assert.ok(result.allowedReadOnlyDataSource.allowedDataOnly.includes("lead status or deal stage"));
    assert.ok(result.allowedReadOnlyDataSource.allowedDataOnly.includes("buyer package completeness signal"));
    assert.ok(result.allowedReadOnlyDataSource.allowedDerivedSignalsOnlyIfAlreadyInDashboardScope.includes("manual revenue metric values"));
    assert.ok(result.allowedReadOnlyDataSource.forbiddenDataSources.includes("new fetch requests"));
    assert.ok(result.allowedReadOnlyDataSource.forbiddenDataSources.includes("Prisma schema changes"));
    assert.ok(result.allowedReadOnlyDataSource.forbiddenDataSources.includes("automation-agent output"));
    assert.equal(result.allowedReadOnlyDataSource.newFetchAllowed, false);
    assert.equal(result.allowedReadOnlyDataSource.persistenceAllowed, false);
    assert.equal(result.allowedReadOnlyDataSource.pollingAllowed, false);
    assertSafety(result);
  });

  it("defines allowed display sections and revenue priority ordering", () => {
    const result = createR58NearCloseRevenueRecoveryUiImplementationScopeContract(readyInput);

    assert.deepEqual(result.allowedDisplaySections, [
      "near_close_revenue_recovery_summary",
      "governance_stop_signals",
      "title_escrow_blockers",
      "closing_checklist_gaps",
      "assignment_friction",
      "seller_response_blockers",
      "buyer_package_blockers",
      "missing_document_blockers",
      "stale_near_close_timelines",
      "pre_closing_revenue_leakage_indicators",
      "safe_manual_recovery_guidance",
    ]);
    assert.equal(result.revenuePriorityOrdering[0].section, "governance_stop_signals");
    assert.equal(result.revenuePriorityOrdering[1].section, "title_escrow_blockers");
    assert.equal(result.revenuePriorityOrdering[10].section, "safe_manual_recovery_guidance");
    assert.ok(result.revenuePriorityOrdering.every((item, index) => item.order === index + 1));
    assert.ok(result.revenuePriorityOrdering.every((item) => item.requiredSafetyCopy === requiredSafetyCopy));
    assertSafety(result);
  });

  it("preserves required safety copy and safe wording", () => {
    const result = createR58NearCloseRevenueRecoveryUiImplementationScopeContract(readyInput);
    const wording = result.safeManualGuidanceWording.join(" ");

    assert.equal(result.requiredSafetyCopy, requiredSafetyCopy);
    assert.ok(result.safeManualGuidanceWording.includes(requiredSafetyCopy));
    assert.match(wording, /not legal readiness or closing readiness/i);
    assert.match(wording, /does not mean assignment-ready/i);
    assert.match(wording, /does not mean buyer-ready-to-contact/i);
    assert.match(wording, /must not send, queue, retry, close, assign, activate, or persist/i);
    assertSafety(result);
  });

  it("blocks forbidden controls and dangerous language patterns", () => {
    const result = createR58NearCloseRevenueRecoveryUiImplementationScopeContract(readyInput);

    assert.ok(result.blockedForbiddenUiControls.includes("close deal now"));
    assert.ok(result.blockedForbiddenUiControls.includes("send assignment"));
    assert.ok(result.blockedForbiddenUiControls.includes("auto recover"));
    assert.ok(result.blockedForbiddenUiControls.includes("activate workflow"));
    assert.ok(result.blockedForbiddenUiControls.includes("approve and send"));
    assert.ok(result.blockedForbiddenUiControls.includes("queue execution"));
    assert.ok(result.blockedForbiddenUiControls.includes("provider activation"));
    assert.ok(result.blockedForbiddenUiControls.includes("autonomous outreach"));
    assert.ok(result.blockedForbiddenUiControls.includes("autonomous negotiation"));
    assert.ok(result.blockedForbiddenUiControls.includes("legal-ready"));
    assert.ok(result.blockedForbiddenUiControls.includes("closing-ready"));
    assert.ok(result.blockedForbiddenUiControls.includes("buyer-ready-to-contact"));
    assert.ok(result.blockedForbiddenUiControls.includes("assignment-ready"));
    assert.ok(result.blockedForbiddenUiControls.includes("execute closing"));
    assert.ok(result.dangerousLanguagePatterns.includes("ready to close"));
    assertSafety(result);
  });

  it("defines accessibility requirements and no-action boundaries", () => {
    const result = createR58NearCloseRevenueRecoveryUiImplementationScopeContract(readyInput);
    const accessibility = result.accessibilityRequirements.join(" ");
    const boundaries = result.noActionExecutionBoundaries.join(" ");

    assert.match(accessibility, /semantic heading/i);
    assert.match(accessibility, /readable text label/i);
    assert.match(accessibility, /color alone/i);
    assert.match(accessibility, /keyboard order/i);
    assert.match(boundaries, /No buttons, links, toggles, menus, forms, or controls may close/i);
    assert.match(boundaries, /No routes, new fetches, server actions/i);
    assert.match(boundaries, /No legal-ready, closing-ready, assignment-ready/i);
    assertSafety(result);
  });

  it("rejects runtime provider persistence execution readiness and autonomous requests", () => {
    const result = createR58NearCloseRevenueRecoveryUiImplementationScopeContract({
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
      assignmentReadyClaimRequested: true,
      buyerReadyToContactClaimRequested: true,
    });

    assert.equal(result.scopeStatus, "implementation_scope_blocked");
    assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("persistence_rejected"));
    assert.ok(result.warningCodes.includes("legal_or_closing_readiness_claim_rejected"));
    assert.ok(result.warningCodes.includes("assignment_ready_claim_rejected"));
    assert.ok(result.warningCodes.includes("buyer_ready_to_contact_claim_rejected"));
    assertSafety(result);
  });

  it("rejects unsafe invariant inputs while preserving hard output flags", () => {
    const result = createR58NearCloseRevenueRecoveryUiImplementationScopeContract({
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

    assert.equal(result.scopeStatus, "implementation_scope_blocked");
    assert.ok(result.warningCodes.includes("read_only_required"));
    assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
    assert.ok(result.warningCodes.includes("sent_must_be_false"));
    assert.ok(result.warningCodes.includes("ui_implementation_not_allowed_now"));
    assertSafety(result);
  });

  it("exposes invariant assertions and bounds scope notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r58c_scope_note_${index}_${"x".repeat(220)}`);
    const result = createR58NearCloseRevenueRecoveryUiImplementationScopeContract({
      ...readyInput,
      extraScopeNotes: notes,
    });

    assert.match(result.invariantAssertions.join(" "), /readOnly must remain true/i);
    assert.match(result.invariantAssertions.join(" "), /no legal, closing, assignment-ready/i);
    assert.equal(result.scopeNotes.length, 40);
    assert.ok(result.scopeNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
