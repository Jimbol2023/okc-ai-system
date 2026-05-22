import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR57StuckDealRecoveryUiImplementationScopeInvariants,
  createR57StuckDealRecoveryUiImplementationScopeContract,
  type R57StuckDealRecoveryUiImplementationScopeInput,
  type R57StuckDealRecoveryUiImplementationScopeResult,
} from "./r57-stuck-deal-recovery-ui-implementation-scope-contract";

const requiredSafetyCopy =
  "Read-only recovery guidance. No provider called, no message sent, no runtime execution.";

const readyInput: R57StuckDealRecoveryUiImplementationScopeInput = {
  r57bScopeReviewed: true,
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

function assertSafety(result: R57StuckDealRecoveryUiImplementationScopeResult) {
  const invariantCheck = assertR57StuckDealRecoveryUiImplementationScopeInvariants(result);

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

describe("R57 stuck-deal recovery read-only UI implementation scope contract", () => {
  it("missing default input fails closed into operator review", () => {
    const result = createR57StuckDealRecoveryUiImplementationScopeContract();

    assert.equal(result.phase, "R57C");
    assert.equal(result.surface, "stuck_deal_recovery_read_only_ui_implementation_scope");
    assert.equal(result.scopeStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("r57b_scope_review_required"));
    assert.ok(result.warningCodes.includes("placement_review_required"));
    assert.ok(result.warningCodes.includes("read_only_data_review_required"));
    assert.ok(result.warningCodes.includes("display_section_review_required"));
    assert.ok(result.warningCodes.includes("revenue_priority_review_required"));
    assert.ok(result.warningCodes.includes("wording_review_required"));
    assert.ok(result.warningCodes.includes("governance_boundary_review_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assert.ok(result.warningCodes.includes("dangerous_pattern_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertSafety(result);
  });

  it("locks allowed UI placement without implementing UI", () => {
    const result = createR57StuckDealRecoveryUiImplementationScopeContract(readyInput);

    assert.equal(result.scopeStatus, "read_only_ui_implementation_scope_ready");
    assert.equal(result.allowedUiPlacement.surface, "existing_dashboard");
    assert.equal(result.allowedUiPlacement.futureLikelyFile, "app/(dashboard)/dashboard/page.tsx");
    assert.equal(result.allowedUiPlacement.placement, "dashboard_read_only_revenue_operations_section");
    assert.equal(result.allowedUiPlacement.routeChangesAllowed, false);
    assert.equal(result.allowedUiPlacement.redesignAllowed, false);
    assert.equal(result.allowedUiPlacement.implementationAllowedNow, false);
    assertSafety(result);
  });

  it("defines the allowed read-only data source and forbidden sources", () => {
    const result = createR57StuckDealRecoveryUiImplementationScopeContract(readyInput);

    assert.equal(result.allowedReadOnlyDataSource.source, "existing_read_only_lead_and_deal_review_data");
    assert.ok(result.allowedReadOnlyDataSource.allowedDataOnly.includes("lead source"));
    assert.ok(result.allowedReadOnlyDataSource.allowedDataOnly.includes("manual follow-up due state"));
    assert.ok(result.allowedReadOnlyDataSource.allowedDataOnly.includes("revenue leakage indicator labels"));
    assert.ok(result.allowedReadOnlyDataSource.forbiddenDataSources.includes("Prisma schema changes"));
    assert.ok(result.allowedReadOnlyDataSource.forbiddenDataSources.includes("Twilio provider state"));
    assert.ok(result.allowedReadOnlyDataSource.forbiddenDataSources.includes("automation-agent output"));
    assert.equal(result.allowedReadOnlyDataSource.sourceMutationAllowed, false);
    assert.equal(result.allowedReadOnlyDataSource.persistenceAllowed, false);
    assert.equal(result.allowedReadOnlyDataSource.pollingAllowed, false);
    assertSafety(result);
  });

  it("defines allowed display sections for the future read-only UI", () => {
    const result = createR57StuckDealRecoveryUiImplementationScopeContract(readyInput);

    assert.deepEqual(result.allowedDisplaySections, [
      "stuck_deal_recovery_summary",
      "revenue_leakage_indicators",
      "overdue_manual_follow_up_section",
      "missing_next_step_section",
      "buyer_readiness_blocker_section",
      "near_close_friction_section",
      "missing_critical_data_section",
      "human_review_required_section",
      "safe_manual_recovery_guidance",
    ]);
    assertSafety(result);
  });

  it("orders future rendering by revenue priority and required safety copy", () => {
    const result = createR57StuckDealRecoveryUiImplementationScopeContract(readyInput);

    assert.deepEqual(
      result.revenuePriorityOrdering.map((item) => item.section),
      [
        "human_review_required_section",
        "near_close_friction_section",
        "overdue_manual_follow_up_section",
        "missing_next_step_section",
        "buyer_readiness_blocker_section",
        "missing_critical_data_section",
        "revenue_leakage_indicators",
        "stuck_deal_recovery_summary",
        "safe_manual_recovery_guidance",
      ],
    );
    assert.ok(result.revenuePriorityOrdering.every((item, index) => item.order === index + 1));
    assert.ok(result.revenuePriorityOrdering.every((item) => item.requiredSafetyCopy === requiredSafetyCopy));
    assertSafety(result);
  });

  it("preserves required safety copy and safe manual guidance wording", () => {
    const result = createR57StuckDealRecoveryUiImplementationScopeContract(readyInput);
    const wording = result.safeManualGuidanceWording.join(" ");

    assert.equal(result.requiredSafetyCopy, requiredSafetyCopy);
    assert.ok(result.safeManualGuidanceWording.includes(requiredSafetyCopy));
    assert.match(wording, /Review stuck-deal signals manually/i);
    assert.match(wording, /Confirm governance, DNC, opt-out, source, and contact context/i);
    assert.match(wording, /must not send, queue, retry, activate, or persist/i);
    assertSafety(result);
  });

  it("blocks forbidden UI controls and dangerous language patterns", () => {
    const result = createR57StuckDealRecoveryUiImplementationScopeContract(readyInput);

    assert.ok(result.blockedForbiddenUiControls.includes("send now"));
    assert.ok(result.blockedForbiddenUiControls.includes("auto recover"));
    assert.ok(result.blockedForbiddenUiControls.includes("auto follow-up"));
    assert.ok(result.blockedForbiddenUiControls.includes("activate workflow"));
    assert.ok(result.blockedForbiddenUiControls.includes("bulk recovery"));
    assert.ok(result.blockedForbiddenUiControls.includes("AI negotiates"));
    assert.ok(result.blockedForbiddenUiControls.includes("approve and send"));
    assert.ok(result.blockedForbiddenUiControls.includes("release automation"));
    assert.ok(result.blockedForbiddenUiControls.includes("start campaign"));
    assert.ok(result.blockedForbiddenUiControls.includes("retry automatically"));
    assert.ok(result.blockedForbiddenUiControls.includes("queue execution"));
    assert.ok(result.blockedForbiddenUiControls.includes("provider activation"));
    assert.ok(result.blockedForbiddenUiControls.includes("autonomous outreach"));
    assert.ok(result.dangerousLanguagePatterns.includes("execution ready"));
    assert.ok(result.dangerousLanguagePatterns.includes("closing ready without review"));
    assertSafety(result);
  });

  it("defines accessibility requirements and no-action boundaries", () => {
    const result = createR57StuckDealRecoveryUiImplementationScopeContract(readyInput);
    const accessibility = result.accessibilityRequirements.join(" ");
    const boundaries = result.noActionExecutionBoundaries.join(" ");

    assert.match(accessibility, /semantic heading/i);
    assert.match(accessibility, /text label/i);
    assert.match(accessibility, /color alone/i);
    assert.match(accessibility, /keyboard order/i);
    assert.match(accessibility, /auto-refresh, poll/i);
    assert.match(boundaries, /No buttons, links, toggles, menus, forms, or controls may send/i);
    assert.match(boundaries, /read-only derived labels, counts, and explanations/i);
    assert.match(boundaries, /must never become permission to execute/i);
    assert.match(boundaries, /No routes, server actions, provider imports, Twilio calls/i);
    assertSafety(result);
  });

  it("rejects runtime provider sending polling persistence execution UI redesign and autonomous requests", () => {
    const result = createR57StuckDealRecoveryUiImplementationScopeContract({
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

    assert.equal(result.scopeStatus, "implementation_scope_blocked");
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
    const result = createR57StuckDealRecoveryUiImplementationScopeContract({
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

  it("exposes invariant assertions and bounds scope notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r57c_scope_note_${index}_${"x".repeat(220)}`);
    const result = createR57StuckDealRecoveryUiImplementationScopeContract({
      ...readyInput,
      extraScopeNotes: notes,
    });

    assert.match(result.invariantAssertions.join(" "), /readOnly must remain true/i);
    assert.match(result.invariantAssertions.join(" "), /required safety copy must render/i);
    assert.equal(result.scopeNotes.length, 40);
    assert.ok(result.scopeNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
