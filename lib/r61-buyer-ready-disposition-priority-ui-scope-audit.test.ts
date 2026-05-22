import assert from "node:assert/strict";
import test from "node:test";

import {
  assertR61BuyerReadyDispositionUiScopeInvariants,
  createR61BuyerReadyDispositionUiScopeAudit,
  summarizeR61BuyerReadyDispositionUiScopeAudit,
  type R61BuyerReadyDispositionUiScopeAuditInput,
  type R61BuyerReadyDispositionUiScopeAuditResult,
} from "./r61-buyer-ready-disposition-priority-ui-scope-audit";

const readyInput: R61BuyerReadyDispositionUiScopeAuditInput = {
  r61aScopeReviewed: true,
  uiSurfaceReviewed: true,
  visibilityConceptsReviewed: true,
  buyerReadyVisibilityReviewed: true,
  packageCompletenessVisibilityReviewed: true,
  buyerFitVisibilityReviewed: true,
  demandAlignmentVisibilityReviewed: true,
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

function assertSafety(result: R61BuyerReadyDispositionUiScopeAuditResult) {
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
  assert.equal(assertR61BuyerReadyDispositionUiScopeInvariants(result).passed, true);
}

test("R61B defaults to operator review with hard-closed safety flags", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit();

  assert.equal(result.phase, "R61B");
  assert.equal(result.scopeStatus, "operator_review_required");
  assert.equal(result.operatorReviewRequired, true);
  assert.ok(result.warningCodes.includes("r61b_buyer_ready_disposition_ui_scope_audit_only"));
  assert.ok(result.warningCodes.includes("input_missing"));
  assert.ok(result.warningCodes.includes("r61a_scope_review_required"));
  assertSafety(result);
});

test("R61B defines allowed future UI sections", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit(readyInput);

  assert.equal(result.scopeStatus, "ui_scope_ready_for_later_implementation");
  assert.ok(result.allowedFutureUiSections.includes("governance_stop_signals"));
  assert.ok(result.allowedFutureUiSections.includes("buyer_ready_disposition_priority"));
  assert.ok(result.allowedFutureUiSections.includes("near_buyer_ready_review"));
  assert.ok(result.allowedFutureUiSections.includes("ready_to_package_deal"));
  assert.ok(result.allowedFutureUiSections.includes("incomplete_buyer_package"));
  assert.ok(result.allowedFutureUiSections.includes("buyer_fit_review_needed"));
  assert.ok(result.allowedFutureUiSections.includes("buyer_demand_alignment_review"));
  assert.ok(result.allowedFutureUiSections.includes("operator_package_prep_guidance"));
  assertSafety(result);
});

test("R61B defines buyer-ready visibility ordering with governance first", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit(readyInput);

  assert.deepEqual(
    result.buyerReadyPriorityVisibilityConcepts.map((concept) => concept.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  );
  assert.equal(result.buyerReadyPriorityVisibilityConcepts[0]?.section, "governance_stop_signals");
  assert.equal(result.buyerReadyPriorityVisibilityConcepts[1]?.section, "buyer_ready_disposition_priority");
  assert.match(result.buyerReadyPriorityVisibilityConcepts[0]?.safeCopyRequired ?? "", /resolved first/i);
  assert.match(result.buyerReadyPriorityVisibilityConcepts[1]?.safeCopyRequired ?? "", /does not mean send/i);
  assertSafety(result);
});

test("R61B defines buyer-ready and near-buyer-ready wording", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit(readyInput);

  assert.match(result.buyerReadyVisibilityWording.join(" "), /Buyer-ready disposition priority/i);
  assert.match(result.buyerReadyVisibilityWording.join(" "), /Buyer-ready label is advisory only/i);
  assert.match(result.buyerReadyVisibilityWording.join(" "), /Buyer-ready does not mean send/i);
  assert.match(result.nearBuyerReadyVisibilityWording.join(" "), /Near-buyer-ready review/i);
  assert.match(result.nearBuyerReadyVisibilityWording.join(" "), /does not mean buyer-ready-to-contact/i);
  assertSafety(result);
});

test("R61B defines package completeness visibility", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit(readyInput);
  const wording = result.packageCompletenessVisibilityWording.join(" ");

  assert.match(wording, /Ready-to-package deal/i);
  assert.match(wording, /Incomplete buyer package/i);
  assert.match(wording, /Package-prep priority/i);
  assert.match(wording, /Missing assignment\/title\/photos\/repair\/ARV\/rent\/strategy data/i);
  assert.match(wording, /Review buyer package before taking action/i);
  assertSafety(result);
});

test("R61B defines buyer-fit and demand-alignment visibility", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit(readyInput);

  assert.match(result.buyerFitReviewVisibilityWording.join(" "), /Buyer-fit review needed/i);
  assert.match(result.buyerFitReviewVisibilityWording.join(" "), /Manual buyer match review only/i);
  assert.match(result.buyerFitReviewVisibilityWording.join(" "), /do not authorize buyer contact/i);
  assert.match(result.buyerDemandAlignmentVisibilityWording.join(" "), /Buyer demand alignment review/i);
  assert.match(result.buyerDemandAlignmentVisibilityWording.join(" "), /strategy, market area, price band/i);
  assert.match(result.buyerDemandAlignmentVisibilityWording.join(" "), /cannot launch buyer outreach/i);
  assertSafety(result);
});

test("R61B defines disposition bottleneck, blocked disposition, and governance wording", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit(readyInput);

  assert.match(result.dispositionBottleneckVisibilityWording.join(" "), /Disposition bottleneck/i);
  assert.match(result.dispositionBottleneckVisibilityWording.join(" "), /cannot assign work, mutate workflow state/i);
  assert.match(result.blockedDispositionVisibilityWording.join(" "), /Blocked buyer disposition/i);
  assert.match(result.blockedDispositionVisibilityWording.join(" "), /cannot become approve-and-send/i);
  assert.match(result.governanceStopVisibilityWording.join(" "), /must be resolved first/i);
  assert.match(result.governanceStopVisibilityWording.join(" "), /outrank buyer-readiness/i);
  assertSafety(result);
});

test("R61B keeps safe wording exactly manual and advisory", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit(readyInput);

  assert.ok(result.safeOperatorGuidanceWording.includes("Manual disposition review recommended"));
  assert.ok(result.safeOperatorGuidanceWording.includes("Buyer-ready label is advisory only"));
  assert.ok(result.safeOperatorGuidanceWording.includes("Review buyer package before taking action"));
  assert.ok(result.safeOperatorGuidanceWording.includes("Buyer-fit review needed"));
  assert.ok(result.safeOperatorGuidanceWording.includes("Package-prep priority"));
  assert.ok(result.safeOperatorGuidanceWording.includes("Governance stop signals must be resolved first"));
  assert.ok(result.safeOperatorGuidanceWording.includes("Buyer-ready does not mean send"));
  assertSafety(result);
});

test("R61B blocks forbidden controls, buttons, actions, and dangerous language", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit(readyInput);

  assert.ok(result.forbiddenControlsButtonsActions.includes("send to buyers"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("blast buyers"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("auto email buyers"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("auto SMS buyers"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("launch buyer campaign"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("activate buyer outreach"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("queue buyer execution"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("match and send automatically"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("execute disposition workflow"));
  assert.ok(result.forbiddenControlsButtonsActions.includes("release buyer automation"));
  assert.ok(result.dangerousLanguagePatterns.includes("buyer-ready-to-contact"));
  assert.ok(result.dangerousLanguagePatterns.includes("release package"));
  assertSafety(result);
});

test("R61B preserves accessibility expectations", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit(readyInput);
  const accessibility = result.accessibilityExpectations.join(" ");

  assert.match(accessibility, /semantic headings/i);
  assert.match(accessibility, /readable labels/i);
  assert.match(accessibility, /Status meaning must be text-based/i);
  assert.match(accessibility, /never depend on color alone/i);
  assert.match(accessibility, /Do not rely on motion, focus movement/i);
  assert.match(accessibility, /screen-reader-friendly summaries/i);
  assertSafety(result);
});

test("R61B keeps no-action and implementation boundaries hard-closed", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit(readyInput);
  const boundaries = result.noActionExecutionBoundaries.join(" ");

  assert.equal(result.implementationBoundaries.noUiImplementationNow, true);
  assert.equal(result.implementationBoundaries.noDashboardChangesNow, true);
  assert.equal(result.implementationBoundaries.noNewRoutes, true);
  assert.equal(result.implementationBoundaries.noProviderControls, true);
  assert.equal(result.implementationBoundaries.noEmailSmsControls, true);
  assert.equal(result.implementationBoundaries.noBuyerOutreachControls, true);
  assert.equal(result.implementationBoundaries.noHiddenExecutionAffordances, true);
  assert.match(boundaries, /No buttons, links, toggles, menus, forms, or controls/i);
  assert.match(boundaries, /trigger buyer outreach, seller outreach, email, SMS/i);
  assert.match(boundaries, /must never imply permission to send, share, blast/i);
  assert.match(boundaries, /No hidden execution affordances/i);
  assertSafety(result);
});

test("R61B rejects UI, dashboard, route, provider, outreach, persistence, polling, and automation requests", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit({
    ...readyInput,
    uiImplementationRequested: true,
    dashboardChangeRequested: true,
    routeChangeRequested: true,
    runtimeActivationRequested: true,
    providerActivationRequested: true,
    liveSendingRequested: true,
    emailSmsSendingRequested: true,
    buyerOutreachExecutionRequested: true,
    automationAgentRequested: true,
    pollingRequested: true,
    persistenceRequested: true,
    executionControlRequested: true,
    redesignRequested: true,
    autonomousBuyerOutreachRequested: true,
    autonomousNegotiationRequested: true,
    approvalGrantsExecution: true,
  });

  assert.equal(result.scopeStatus, "ui_scope_blocked");
  assert.ok(result.warningCodes.includes("ui_implementation_rejected"));
  assert.ok(result.warningCodes.includes("dashboard_change_rejected"));
  assert.ok(result.warningCodes.includes("route_change_rejected"));
  assert.ok(result.warningCodes.includes("runtime_activation_rejected"));
  assert.ok(result.warningCodes.includes("provider_activation_rejected"));
  assert.ok(result.warningCodes.includes("live_sending_rejected"));
  assert.ok(result.warningCodes.includes("email_sms_sending_rejected"));
  assert.ok(result.warningCodes.includes("buyer_outreach_execution_rejected"));
  assert.ok(result.warningCodes.includes("automation_agent_rejected"));
  assert.ok(result.warningCodes.includes("polling_rejected"));
  assert.ok(result.warningCodes.includes("persistence_rejected"));
  assert.ok(result.warningCodes.includes("execution_control_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_buyer_outreach_rejected"));
  assert.ok(result.warningCodes.includes("autonomous_negotiation_rejected"));
  assert.ok(result.warningCodes.includes("approval_grants_execution_rejected"));
  assertSafety(result);
});

test("R61B rejects unsafe invariant inputs while preserving safe output flags", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit({
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

test("R61B summary is bounded and points to the next scope contract", () => {
  const result = createR61BuyerReadyDispositionUiScopeAudit({
    ...readyInput,
    extraAuditNotes: ["R61B note".repeat(100)],
  });
  const summary = summarizeR61BuyerReadyDispositionUiScopeAudit(result);

  assert.equal(
    result.nextSuggestedPhase,
    "R61C - Buyer-Ready Disposition Priority Intelligence Read-Only UI Implementation Scope Contract",
  );
  assert.ok(summary.length <= 903);
  assert.match(summary, /cannot authorize UI implementation/i);
  assert.match(summary, /email, SMS, buyer outreach/i);
  assertSafety(result);
});
