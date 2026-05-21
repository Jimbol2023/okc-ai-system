import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertR54LeadDetailObservabilityScopeInvariants,
  createR54LeadDetailObservabilityScopeContract,
  type R54LeadDetailObservabilityScopeInput,
  type R54LeadDetailObservabilityScopeResult,
} from "./r54-lead-detail-observability-scope-contract";

const readyInput: R54LeadDetailObservabilityScopeInput = {
  scopeReviewed: true,
  safetyBoundariesReviewed: true,
  accessibilityReviewed: true,
  implementationBoundariesReviewed: true,
  operatorReviewCompleted: true,
  uiImplementationRequested: false,
  routeChangeRequested: false,
  runtimeActivationRequested: false,
  providerActivationRequested: false,
  liveSendingRequested: false,
  automationAgentRequested: false,
  pollingRequested: false,
  persistenceRequested: false,
  advisoryConvertedToPermission: false,
  approvalAsSendRequested: false,
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  liveExecutionAllowed: false,
  providerActivationAllowed: false,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  uiImplementationAllowedNow: false,
};

function assertSafety(result: R54LeadDetailObservabilityScopeResult) {
  const invariantCheck = assertR54LeadDetailObservabilityScopeInvariants(result);

  assert.equal(result.readOnly, true);
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.providerActivationAllowed, false);
  assert.equal(result.providerCalled, false);
  assert.equal(result.sent, false);
  assert.equal(result.persistenceAllowedNow, false);
  assert.equal(result.pollingAllowed, false);
  assert.equal(result.runtimeActivationAllowed, false);
  assert.equal(result.uiImplementationAllowedNow, false);
  assert.deepEqual(result.safetyFlags, {
    readOnly: true,
    advisoryOnly: true,
    simulationOnly: true,
    liveExecutionAllowed: false,
    providerActivationAllowed: false,
    providerCalled: false,
    sent: false,
    persistenceAllowedNow: false,
    pollingAllowed: false,
    runtimeActivationAllowed: false,
    uiImplementationAllowedNow: false,
  });
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

describe("R54 lead detail observability scope contract", () => {
  it("missing default input fails closed and requires operator review", () => {
    const result = createR54LeadDetailObservabilityScopeContract();

    assert.equal(result.surface, "lead_detail_observability");
    assert.equal(result.scopeStatus, "operator_review_required");
    assert.equal(result.operatorReviewRequired, true);
    assert.ok(result.warningCodes.includes("input_missing"));
    assert.ok(result.warningCodes.includes("scope_review_required"));
    assert.ok(result.warningCodes.includes("safety_review_required"));
    assert.ok(result.warningCodes.includes("accessibility_review_required"));
    assert.ok(result.warningCodes.includes("implementation_boundary_review_required"));
    assert.ok(result.warningCodes.includes("operator_review_required"));
    assertSafety(result);
  });

  it("defines the allowed lead detail observability scope", () => {
    const result = createR54LeadDetailObservabilityScopeContract(readyInput);

    assert.equal(result.scopeStatus, "lead_detail_observability_scope_ready");
    assert.deepEqual(result.allowedObservabilityItems, [
      "lead_revenue_readiness_summary",
      "missing_critical_lead_data",
      "seller_call_status_summary",
      "follow_up_due_overdue_summary",
      "buyer_package_completeness_summary",
      "dnc_opt_out_blocked_visibility",
      "governance_blocked_visibility",
      "human_review_required_advisory",
      "near_contract_near_close_advisory",
      "manual_next_step_reminder",
    ]);
    assertSafety(result);
  });

  it("blocks sending automation provider persistence and approval-as-permission semantics", () => {
    const result = createR54LeadDetailObservabilityScopeContract(readyInput);

    assert.ok(result.blockedObservabilityItems.includes("Send SMS"));
    assert.ok(result.blockedObservabilityItems.includes("Send Email"));
    assert.ok(result.blockedObservabilityItems.includes("Start Automation"));
    assert.ok(result.blockedObservabilityItems.includes("Auto Follow-Up"));
    assert.ok(result.blockedObservabilityItems.includes("Activate Provider"));
    assert.ok(result.blockedObservabilityItems.includes("Run Campaign"));
    assert.ok(result.blockedObservabilityItems.includes("AI Autopilot"));
    assert.ok(result.blockedObservabilityItems.includes("Override Governance"));
    assert.ok(result.blockedObservabilityItems.includes("Persist Metrics"));
    assert.ok(result.blockedObservabilityItems.includes("Auto-contact seller"));
    assert.ok(result.blockedObservabilityItems.includes("Auto-share with buyer"));
    assert.ok(result.blockedObservabilityItems.includes("Approve and Send"));
    assert.ok(result.blockedObservabilityItems.includes("Bulk Approve"));
    assert.ok(result.blockedObservabilityItems.includes("approval-as-permission wording"));
    assert.ok(result.blockedObservabilityItems.includes("provider-ready wording"));
    assert.ok(result.blockedObservabilityItems.includes("runtime-ready wording"));
    assert.ok(result.blockedObservabilityItems.includes("polling/auto-refresh semantics"));
    assert.ok(result.blockedObservabilityItems.includes("persistence/write semantics"));
    assertSafety(result);
  });

  it("requires safety copy that keeps blocked states non-actionable", () => {
    const result = createR54LeadDetailObservabilityScopeContract(readyInput);
    const copy = result.requiredSafetyCopy.join(" ");

    assert.match(copy, /Read-only/i);
    assert.match(copy, /Manual operator review/i);
    assert.match(copy, /Approval does not send/i);
    assert.match(copy, /Providers.*blocked/i);
    assert.match(copy, /DNC.*do-not-proceed/i);
    assertSafety(result);
  });

  it("defines accessibility requirements for the later UI slice", () => {
    const result = createR54LeadDetailObservabilityScopeContract(readyInput);
    const requirements = result.accessibilityRequirements.join(" ");

    assert.match(requirements, /semantic heading/i);
    assert.match(requirements, /readable labels/i);
    assert.match(requirements, /color alone/i);
    assert.match(requirements, /keyboard order/i);
    assert.match(requirements, /motion/i);
    assert.match(requirements, /screen-reader-friendly/i);
    assertSafety(result);
  });

  it("locks implementation boundaries and prevents UI implementation in R54B", () => {
    const result = createR54LeadDetailObservabilityScopeContract(readyInput);

    assert.equal(result.implementationBoundaries.laterAllowedSurface, "components/dashboard/lead-detail-client.tsx");
    assert.equal(result.implementationBoundaries.laterAllowedPlacement, "top_of_lead_detail_page");
    assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
    assert.equal(result.implementationBoundaries.noNewRoutes, true);
    assert.equal(result.implementationBoundaries.noMutationControls, true);
    assert.equal(result.implementationBoundaries.noProviderControls, true);
    assert.equal(result.implementationBoundaries.noPolling, true);
    assert.equal(result.implementationBoundaries.noPersistence, true);
    assert.equal(result.implementationBoundaries.noRuntimeExecution, true);
    assert.equal(result.implementationBoundaries.noAutomationAgent, true);
    assert.equal(result.implementationBoundaries.useInMemoryLeadDataOnly, true);
    assertSafety(result);
  });

  it("blocks implementation route runtime provider sending automation polling persistence and permission requests", () => {
    const result = createR54LeadDetailObservabilityScopeContract({
      ...readyInput,
      uiImplementationRequested: true,
      routeChangeRequested: true,
      runtimeActivationRequested: true,
      providerActivationRequested: true,
      liveSendingRequested: true,
      automationAgentRequested: true,
      pollingRequested: true,
      persistenceRequested: true,
      advisoryConvertedToPermission: true,
      approvalAsSendRequested: true,
    });

    assert.equal(result.scopeStatus, "lead_detail_observability_scope_blocked");
    assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
    assert.ok(result.warningCodes.includes("route_change_rejected"));
    assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
    assert.ok(result.warningCodes.includes("provider_activation_rejected"));
    assert.ok(result.warningCodes.includes("live_sending_rejected"));
    assert.ok(result.warningCodes.includes("automation_agent_rejected"));
    assert.ok(result.warningCodes.includes("polling_rejected"));
    assert.ok(result.warningCodes.includes("persistence_rejected"));
    assert.ok(result.warningCodes.includes("advisory_to_permission_rejected"));
    assert.ok(result.warningCodes.includes("approval_as_send_rejected"));
    assert.ok(result.rejectionReasons.includes("ui_implementation_rejected"));
    assertSafety(result);
  });

  it("blocks unsafe safety flags while preserving output invariants", () => {
    const result = createR54LeadDetailObservabilityScopeContract({
      ...readyInput,
      readOnly: false,
      advisoryOnly: false,
      simulationOnly: false,
      liveExecutionAllowed: true,
      providerActivationAllowed: true,
      providerCalled: true,
      sent: true,
      persistenceAllowedNow: true,
      pollingAllowed: true,
      runtimeActivationAllowed: true,
      uiImplementationAllowedNow: true,
    });

    assert.equal(result.scopeStatus, "lead_detail_observability_scope_blocked");
    assert.ok(result.warningCodes.includes("read_only_required"));
    assert.ok(result.warningCodes.includes("advisory_only_required"));
    assert.ok(result.warningCodes.includes("simulation_only_required"));
    assert.ok(result.warningCodes.includes("live_execution_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_activation_allowed_must_be_false"));
    assert.ok(result.warningCodes.includes("provider_called_must_be_false"));
    assert.ok(result.warningCodes.includes("sent_must_be_false"));
    assert.ok(result.warningCodes.includes("persistence_not_allowed_now"));
    assert.ok(result.warningCodes.includes("polling_not_allowed"));
    assert.ok(result.warningCodes.includes("runtime_activation_not_allowed"));
    assert.ok(result.warningCodes.includes("ui_implementation_not_allowed_now"));
    assertSafety(result);
  });

  it("sets the next phase without implementing UI now", () => {
    const result = createR54LeadDetailObservabilityScopeContract(readyInput);

    assert.equal(
      result.nextSuggestedPhase,
      "R54C — Lead Detail Read-Only Observability UI Implementation, only after this scope is accepted.",
    );
    assert.equal(result.uiImplementationAllowedNow, false);
    assertSafety(result);
  });

  it("bounds operator notes", () => {
    const notes = Array.from({ length: 80 }, (_, index) => `r54_lead_detail_scope_note_${index}_${"x".repeat(220)}`);
    const result = createR54LeadDetailObservabilityScopeContract({
      ...readyInput,
      extraScopeNotes: notes,
    });

    assert.equal(result.operatorNotes.length, 40);
    assert.ok(result.operatorNotes.every((note) => note.length <= 183));
    assertSafety(result);
  });
});
