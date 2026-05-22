import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR62BuyerDispositionOperationalUiScopeInvariants,
  createR62BuyerDispositionOperationalUiScopeAudit,
  summarizeR62BuyerDispositionOperationalUiScopeAudit,
  type R62BuyerDispositionOperationalUiScopeAuditInput,
  type R62BuyerDispositionOperationalUiScopeAuditResult,
} from "./r62-buyer-disposition-operational-intelligence-ui-scope-audit";

const readyInput: R62BuyerDispositionOperationalUiScopeAuditInput = {
  r62aScopeReviewed: true,
  uiSurfaceReviewed: true,
  visibilityConceptsReviewed: true,
  staleDealVisibilityReviewed: true,
  assignmentReadinessVisibilityReviewed: true,
  buyerEngagementVisibilityReviewed: true,
  bottleneckVisibilityReviewed: true,
  workloadPriorityVisibilityReviewed: true,
  wordingReviewed: true,
  governanceBoundaryReviewed: true,
  accessibilityReviewed: true,
  dangerousPatternsReviewed: true,
  operatorReviewCompleted: true,
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

function assertSafety(result: R62BuyerDispositionOperationalUiScopeAuditResult) {
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
  assert.equal(assertR62BuyerDispositionOperationalUiScopeInvariants(result).passed, true);
}

test("R62B defaults to operator review with hard-closed safety flags", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit();

  assert.equal(result.phase, "R62B");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r62b_buyer_disposition_operational_ui_scope_audit_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r62a_scope_review_required"));
  assertSafety(result);
});

test("R62B defines allowed future UI sections", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit(readyInput);

  assert.equal(result.scopeStatus, "ui_scope_ready_for_later_implementation");
  assert.ok(result.allowedFutureUiSections.includes("governance_stop_visibility"));
  assert.ok(result.allowedFutureUiSections.includes("revenue_priority_disposition_review"));
  assert.ok(result.allowedFutureUiSections.includes("high_likelihood_assignment_review"));
  assert.ok(result.allowedFutureUiSections.includes("assignment_readiness_review"));
  assert.ok(result.allowedFutureUiSections.includes("buyer_response_probability_review"));
  assert.ok(result.allowedFutureUiSections.includes("stale_deal_visibility"));
  assert.ok(result.allowedFutureUiSections.includes("disposition_workload_prioritization"));
  assert.ok(result.allowedFutureUiSections.includes("manual_buyer_review_guidance"));
  assertSafety(result);
});

test("R62B defines operational visibility ordering with governance first", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit(readyInput);

  assert.deepEqual(
    result.operationalVisibilityConcepts.map((concept) => concept.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  );
  assert.equal(result.operationalVisibilityConcepts[0]?.section, "governance_stop_visibility");
  assert.equal(result.operationalVisibilityConcepts[1]?.section, "revenue_priority_disposition_review");
  assert.match(result.operationalVisibilityConcepts[0]?.safeCopyRequired ?? "", /resolved first/i);
  assert.match(result.operationalVisibilityConcepts[12]?.safeCopyRequired ?? "", /never authorizes buyer contact/i);
  assertSafety(result);
});

test("R62B defines stale-deal visibility wording", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit(readyInput);
  const wording = result.staleDealVisibilityWording.join(" ");

  assert.match(wording, /Stale package detection/i);
  assert.match(wording, /Stale deal visibility/i);
  assert.match(wording, /Buyer activity freshness review/i);
  assert.match(wording, /Disposition pipeline stagnation review/i);
  assert.match(wording, /does not launch reactivation/i);
  assertSafety(result);
});

test("R62B defines assignment-readiness and buyer engagement visibility", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit(readyInput);
  const assignment = result.assignmentReadinessVisibilityWording.join(" ");
  const engagement = result.buyerEngagementVisibilityWording.join(" ");

  assert.match(assignment, /Assignment readiness review/i);
  assert.match(assignment, /High-likelihood assignment review/i);
  assert.match(assignment, /Assignment-risk review/i);
  assert.match(assignment, /Buyer-ready does not mean send/i);
  assert.match(engagement, /Buyer response probability review/i);
  assert.match(engagement, /Buyer engagement quality review/i);
  assert.match(engagement, /Buyer demand mismatch visibility/i);
  assert.match(engagement, /do not authorize contact/i);
  assertSafety(result);
});

test("R62B defines bottleneck and workload priority visibility", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit(readyInput);
  const bottleneck = result.bottleneckVisibilityWording.join(" ");
  const workload = result.workloadPriorityVisibilityWording.join(" ");

  assert.match(bottleneck, /Disposition bottleneck visibility/i);
  assert.match(bottleneck, /Blocked disposition visibility/i);
  assert.match(bottleneck, /cannot assign work, mutate workflow state/i);
  assert.match(workload, /Revenue-priority disposition review/i);
  assert.match(workload, /High-value disposition queue review/i);
  assert.match(workload, /not an execution queue/i);
  assertSafety(result);
});

test("R62B keeps safe wording advisory and manual-first", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit(readyInput);

  assert.ok(result.safeOperatorGuidanceWording.includes("Manual buyer-review guidance only"));
  assert.ok(result.safeOperatorGuidanceWording.includes("Revenue-priority disposition review is advisory only"));
  assert.ok(result.safeOperatorGuidanceWording.includes("High-likelihood assignment review is not a send instruction"));
  assert.ok(result.safeOperatorGuidanceWording.includes("Buyer engagement quality review does not authorize contact"));
  assert.ok(result.safeOperatorGuidanceWording.includes("Disposition workload priority is not an execution queue"));
  assert.ok(result.safeOperatorGuidanceWording.includes("Buyer-ready does not mean send"));
  assertSafety(result);
});

test("R62B blocks forbidden controls, buttons, actions, and dangerous language", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit(readyInput);

  assert.ok(result.forbiddenControlsButtonsActions.includes("send to buyers"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("blast buyers"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("autonomous buyer matching"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("buyer communication execution"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("auto assignment workflow"));
  assert.ok(result.dangerousLanguagePatterns.includes("AI closes deals automatically"));
  assert.ok(result.dangerousLanguagePatterns.includes("buyer-ready-to-contact"));
  assert.ok(result.dangerousLanguagePatterns.includes("reactivate buyers automatically"));
  assertSafety(result);
});

test("R62B preserves governance and accessibility expectations", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit(readyInput);
  const governance = result.governanceStopVisibilityWording.join(" ");
  const accessibility = result.accessibilityExpectations.join(" ");

  assert.match(governance, /must be resolved first/i);
  assert.match(governance, /outranks urgency, buyer readiness/i);
  assert.match(accessibility, /semantic headings/i);
  assert.match(accessibility, /readable labels/i);
  assert.match(accessibility, /Status meaning must be text-based/i);
  assert.match(accessibility, /never depend on color alone/i);
  assert.match(accessibility, /Do not rely on motion, focus movement/i);
  assertSafety(result);
});

test("R62B keeps no-action and implementation boundaries hard-closed", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit(readyInput);
  const boundaries = result.noActionExecutionBoundaries.join(" ");

  assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
  assert.equal(result.implementationBoundaries.noDashboardChangesNow, true);
  assert.equal(result.implementationBoundaries.noNewRoutes, true);
  assert.equal(result.implementationBoundaries.noProviderControls, true);
  assert.equal(result.implementationBoundaries.noEmailSmsControls, true);
  assert.equal(result.implementationBoundaries.noBuyerOutreachControls, true);
  assert.equal(result.implementationBoundaries.noAutonomousMatchingOutreachOrNegotiation, true);
  assert.match(boundaries, /No buttons, links, toggles, menus, forms, or controls/i);
  assert.match(boundaries, /autonomous matching, autonomous negotiation/i);
  assert.match(boundaries, /must never imply permission to send, share, blast/i);
  assertSafety(result);
});

test("R62B rejects UI, dashboard, route, provider, outreach, persistence, polling, and automation requests", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit({
    ...readyInput,
    uiImplementationRequested: true,
    dashboardChangeRequested: true,
    routeChangeRequested: true,
    runtimeActivationRequested: true,
    providerActivationRequested: true,
    liveSendingRequested: true,
    emailSmsSendingRequested: true,
    buyerOutreachExecutionRequested: true,
    buyerCommunicationExecutionRequested: true,
    campaignLaunchRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    executionControlRequested: true,
    redesignRequested: true,
    autonomousMatchingRequested: true,
    autonomousBuyerOutreachRequested: true,
    autonomousNegotiationRequested: true,
    autoAssignmentWorkflowRequested: true,
    approvalGrantsExecution: true,
  });

  assert.equal(result.scopeStatus, "ui_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("dashboard_change_rejected"));
  assert.ok(result.warningCodes.includes("route_change_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("buyer_outreach_execution_rejected"));
  assert.ok(result.warningCodes.includes("buyer_communication_execution_rejected"));
  assert.ok(result.warningCodes.includes("campaign_launch_rejected"));
  assert.ok(result.warningCodes.includes("automation_agent_rejected"));
  assert.ok(result.warningCodes.includes("polling_rejected"));
  assert.ok(result.warningCodes.includes("persistence_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_matching_rejected"));
  assert.ok(result.warningCodes.includes("auto_assignment_workflow_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R62B rejects unsafe invariant inputs while preserving safe output flags", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit({
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

test("R62B summary is bounded and points to implementation scope contract", () => {
  const result = createR62BuyerDispositionOperationalUiScopeAudit({
    ...readyInput,
    extraAuditNotes: ["R62B note".repeat(100)],
  });
  const summary = summarizeR62BuyerDispositionOperationalUiScopeAudit(result);

  assert.equal(
    result.nextSuggestedPhase,
    "R62C - Buyer Disposition Operational Intelligence Read-Only UI Implementation Scope Contract",
  );
  assert.ok(summary.length <= 903);
  assert.match(summary, /cannot authorize UI implementation/i);
  assert.match(summary, /buyer communication, buyer outreach/i);
  assertSafety(result);
});
